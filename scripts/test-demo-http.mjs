import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { demoHttpFetch } from './demo-http-transport.mjs';

// Explicit target: this creates and cancels synthetic orders in a demo deployment.
const target = process.argv[2];
if (!target) throw new Error('Usage: npm run test:demo-http -- https://demo-host [zh en ja es ko]');
const base = new URL(target).origin;
const languages = process.argv.slice(3);
if (!languages.length) languages.push('zh', 'en', 'ja', 'es', 'ko');
assert.ok(languages.every(lang => ['zh', 'en', 'ja', 'es', 'ko'].includes(lang)));

function client() {
  const cookies = new Map();
  return async (path, body, expected = 200) => {
    const response = await demoHttpFetch(new URL(path, base), {
      method: body === undefined ? 'GET' : 'POST', redirect: 'manual', cache: 'no-store',
      headers: { Origin: base, 'Content-Type': 'application/json',
        Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join('; ') },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(30_000),
    });
    for (const line of response.headers.getSetCookie()) {
      const pair = line.split(';')[0]; const index = pair.indexOf('=');
      cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }
    // Never include personal records, confirmation codes or cookie values in failures.
    assert.equal(response.status, expected, `${new URL(path, base).pathname.split('/').slice(0, 4).join('/')} HTTP status`);
    const text = await response.text();
    if (path.startsWith('/api/')) return JSON.parse(text);
    assert.ok(!text.includes('NEXT_REDIRECT'), 'Unexpected SSR redirect');
    assert.ok(!/"digest":"\d+"/.test(text), 'SSR error boundary rendered');
    return text;
  };
}

const pickup = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const dropoff = new Date(Date.now() + 10 * 86_400_000).toISOString().slice(0, 10);
const query = new URLSearchParams({ pickup: 'Haneda', return: 'Haneda', pickupStoreCode: 'KLHND01',
  pickupDate: `${pickup}T10:00`, returnDate: `${dropoff}T10:00`, driverAge: '30',
  licenseCountry: 'US', offer: 'hyundai-i30-compact@KLHND01' });

for (const lang of languages) {
  const started = performance.now();
  const request = client();
  const rateHtml = await request(`/${lang}/rent/hyundai-i30-compact?${query}`);
  const driverHref = rateHtml.match(new RegExp(`href="([^\"]*/${lang}/book/driver\\?[^\"]*)"`))?.[1]?.replaceAll('&amp;', '&');
  assert.ok(driverHref, 'Rate page has no driver link');
  const rateId = new URL(driverHref, base).searchParams.get('rateDetailsId');
  assert.ok((await request(driverHref)).includes('driver-booking-form'), 'Driver form missing');
  const naha = new URLSearchParams(query);
  naha.set('pickupStoreCode', 'OKA01'); naha.set('offer', 'toyota-rav4-suv@OKA01');
  const alternate = await request(`/${lang}/rent/toyota-rav4-suv?${naha}`);
  assert.ok(alternate.includes(`/${lang}/book/driver?`), 'Alternate destination missing');
  await request('/api/rental/bookings');
  const input = { rateDetailsId: rateId, insuranceId: 'basic',
    equipment: { infantSeat: 0, childSeat: 0, boosterSeat: 0, gpsNavigation: false, snowChains: false },
    driver: { title: 'Mr', firstName: 'Acceptance', lastName: 'Traveler', email: 'acceptance@example.invalid',
      phoneCountryCode: '+1', phone: '5550001234', licenseCountry: 'US' }, idempotencyKey: randomUUID() };
  const booking = await request('/api/rental/reservations', input);
  const code = booking.confirmationCode;
  assert.ok(code, 'Reservation missing');
  const bookingPath = `/api/rental/bookings/${encodeURIComponent(code)}`;
  const checkoutPath = `/${lang}/checkout/${encodeURIComponent(code)}`;
  // Reproduce a browser loading checkout, session and navigation at the same time.
  for (let round = 0; round < 1; round++) {
    await Promise.all(Array.from({ length: 5 }, async (_, i) => {
      const path = [checkoutPath, '/api/account/session', '/api/rental/pending-checkouts',
        bookingPath, '/api/rental/guest-bookings'][i % 5];
      const result = await request(path);
      if (path === checkoutPath) assert.ok(result.includes('initialBooking'), 'Checkout missing');
      if (path === bookingPath) assert.equal(result.confirmationCode, code);
    }));
  }
  const reservations = await Promise.all(Array.from({ length: 3 }, () => request('/api/rental/reservations', input)));
  assert.ok(reservations.every(order => order.confirmationCode === code), 'Duplicate reservations');
  const payment = { idempotencyKey: randomUUID(), localPaymentScenario: 'success' };
  const paid = await Promise.all(Array.from({ length: 3 }, () => request(`${bookingPath}/payment`, payment)));
  assert.ok(paid.every(order => order.status === 'CONFIRMED'), 'Payment not confirmed');
  assert.equal(new Set(paid.map(order => order.paymentTransactionId)).size, 1, 'Duplicate payment');
  await client()(bookingPath, undefined, 404);
  const guest = client();
  await guest('/api/rental/guest-lookup', { confirmationCode: code, lastName: 'WrongSurname' }, 404);
  await guest('/api/rental/guest-lookup', { confirmationCode: code, lastName: 'Traveler' });
  assert.ok((await guest(`/${lang}/booking/${encodeURIComponent(code)}`)).includes('initialBooking'));
  const estimate = await guest(`${bookingPath}/cancellation-estimate`, {});
  const cancelled = await guest(`${bookingPath}/cancel`, { reason: 'bm_reason_plans', version: estimate.version,
    idempotencyKey: randomUUID() });
  assert.equal(cancelled.status, 'CANCELLED');
  assert.equal((await request(bookingPath)).status, 'CANCELLED');
  console.log(`${lang}: PASS full booking lifecycle, 5 mixed concurrent reads, idempotent reserve/pay, access isolation (${Math.round((performance.now() - started) / 1000)}s)`);
}
