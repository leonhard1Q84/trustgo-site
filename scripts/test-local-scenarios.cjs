/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const rental = require('../src/integrations/fleetedge/local-rental-adapter.ts');
const { getAvailableStoreOffers } = require('../src/modules/rental-search/domain/availability.ts');
const { parseSearchForm, createDefaultSearchForm } = require('../src/modules/rental-search/domain/search-form.ts');
const { getDefaultEquipmentSelection } = require('../src/modules/rate-details/domain/equipment.ts');
const { canPayBooking, canCancelBooking } = require('../src/modules/booking-management/domain/lifecycle.ts');
const { localPaymentScenarioForCard } = require('../src/modules/checkout/domain/local-payment-scenario.ts');
const { isValidPaymentCard } = require('../src/modules/checkout/domain/payment-validation.ts');
const transport = require('../src/modules/booking-management/application/booking-store.ts');
const key = () => crypto.randomUUID();
const actor = () => ({ sessionId: key() });
let access = actor();
let accountCompletions = 0;
const load = Module._load;
Module._load = function (name, parent, ...rest) {
  if (name === '@/server/rental-access') return {
    rentalAccess: async () => access, checkRentalRequest: () => {}, attachRentalCookie: () => {},
  };
  if (name === '@/server/checkout-account') return { completeCheckoutAccount: () => { accountCompletions++; } };
  return load.call(this, name, parent, ...rest);
};
const route = require('../src/app/api/rental/[...action]/route.ts');
const realNow = Date.now, realFetch = global.fetch;
const originalEnvironment = { NODE_ENV: process.env.NODE_ENV, TRUSTGO_RENTAL_MODE: process.env.TRUSTGO_RENTAL_MODE,
  TRUSTGO_LOCAL_FAULTS: process.env.TRUSTGO_LOCAL_FAULTS };
let now = Date.parse('2030-01-01T12:00:00Z');
Date.now = () => now;
process.env.TRUSTGO_RENTAL_MODE = 'local';
const form = (pickupDate = '2030-01-10T10:00', returnDate = '2030-01-13T10:00', patch = {}) => parseSearchForm({
  pickup: 'LAX', pickupPoiId: 'poi-lax-airport', pickupDate, returnDate, driverAge: '30', licenseCountry: 'US', ...patch,
}, createDefaultSearchForm('US'));
const tripFromNow = (leadHours, rentalHours = 48, zone = 'America/Los_Angeles', patch = {}) => {
  const localDate = timestamp => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(timestamp));
    const part = type => parts.find(p => p.type === type).value;
    return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
  };
  return form(localDate(now + leadHours * 3600000), localDate(now + (leadHours + rentalHours) * 3600000), patch);
};
const input = rate => ({ rateDetailsId: rate.trip.rateDetailsId, insuranceId: 'basic', equipment: getDefaultEquipmentSelection(),
  driver: { title: 'Ms', firstName: 'Test', lastName: 'Traveler', email: 'qa.booking@example.com', phoneCountryCode: '+1', phone: '2025550148', licenseCountry: 'US' }, idempotencyKey: key() });
const reserve = (owner = access) => rental.createReservation(input(rental.createRateDetails(form(), 'toyota-rav4-suv@US-LAX-01', 'zh')), owner);
async function api(method, code, body) {
  const action = ['bookings', code, ...(method === 'POST' ? ['payment'] : [])];
  const response = await route[method](new Request(`http://local.test/api/rental/${action.join('/')}`, {
    method, headers: { Origin: 'http://local.test', 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  }), { params: Promise.resolve({ action }) });
  return { status: response.status, data: await response.json() };
}
let passed = 0;
async function test(name, fn) { await fn(); passed++; console.log(`✓ ${name}`); }
const rejectsCode = (fn, code) => assert.throws(fn, error => error.code === code);
const cards = {
  success: '4242424242424242', declined: '4000000000000002', insufficient_funds: '4000000000009995',
  authentication_failed: '4000000000003063', processing: '4000002500003155', unknown: '4000000000000119', unavailable: '4000000000000259',
};
(async () => {
  await test('rolling inventory has no stock within three days and full stock from 72 hours onward', () => {
    for (const lead of [1, 24, 48, 71]) assert.deepEqual(getAvailableStoreOffers(tripFromNow(lead)), []);
    for (const lead of [72, 73, 96, 240]) {
      const offers = getAvailableStoreOffers(tripFromNow(lead));
      assert.equal(offers.length, 6);
      assert.equal(new Set(offers.map(o => o.vehicleId)).size, 4);
    }
  });
  await test('inventory recomputes at each read, including exact boundary and later calendar dates', () => {
    const boundary = tripFromNow(72);
    assert.equal(getAvailableStoreOffers(boundary, now - 1).length, 6);
    assert.equal(getAvailableStoreOffers(boundary, now).length, 6);
    assert.deepEqual(getAvailableStoreOffers(boundary, now + 1), []);
    const start = now;
    try {
      now += 180 * 86400000;
      assert.equal(getAvailableStoreOffers(tripFromNow(96)).length, 6);
      assert.deepEqual(getAvailableStoreOffers(tripFromNow(24)), []);
      assert.deepEqual(getAvailableStoreOffers(tripFromNow(24, 240)), []);
    } finally { now = start; }
  });
  await test('rolling inventory uses each depot timezone and direct rate IDs cannot bypass it', () => {
    const sold = tripFromNow(24);
    const tokyo = hours => ({ ...tripFromNow(hours, 48, 'Asia/Tokyo'), pickup: { label: 'Tokyo', storeCode: 'KLDJ01' } });
    assert.deepEqual(getAvailableStoreOffers(tokyo(24)), []);
    assert.equal(getAvailableStoreOffers(tokyo(72)).length, 4);
    rejectsCode(() => rental.createRateDetails(sold, 'toyota-rav4-suv@US-LAX-01', 'zh'), 'rate_unavailable');
  });
  await test('creation rechecks the rolling stock window even while its quote remains valid', () => {
    const rate = rental.createRateDetails(tripFromNow(72 + 1 / 60), 'toyota-rav4-suv@US-LAX-01', 'zh');
    const start = now;
    try {
      now += 61000;
      assert.equal(rental.getRateDetails(rate.trip.rateDetailsId).trip.rateDetailsId, rate.trip.rateDetailsId);
      const owner = actor();
      rejectsCode(() => rental.createReservation(input(rate), owner), 'rate_unavailable');
      assert.deepEqual(rental.listBookings(owner), []);
    } finally { now = start; }
  });
  await test('every documented test card passes form checks and maps to one scenario', () => {
    for (const [scenario, number] of Object.entries(cards)) {
      assert.equal(isValidPaymentCard({ cardNumber: number, cardholderName: 'Test Traveler', expiryDate: '12/39', cvc: '123' }, new Date(now)), true, scenario);
      assert.equal(localPaymentScenarioForCard(number.replace(/(.{4})/g, '$1 ').trim()), scenario);
    }
    assert.equal(localPaymentScenarioForCard('5555555555554444'), 'success');
  });
  for (const scenario of ['declined', 'insufficient_funds', 'authentication_failed', 'unavailable']) {
    await test(`${scenario} persists failure without charge; same intent replays; new success can retry`, async () => {
      access = actor();
      const booking = reserve(), intent = key();
      const expected = `payment_${scenario}`;
      const failed = await api('POST', booking.confirmationCode, { idempotencyKey: intent, localPaymentScenario: scenario });
      assert.equal(failed.status, scenario === 'unavailable' ? 503 : 409);
      assert.equal(failed.data.code, expected);
      const state = rental.readBooking(booking.confirmationCode, access);
      assert.equal(state.status, 'PENDING_PAYMENT'); assert.equal(state.paymentStatus, 'failed');
      assert.equal(state.paidAmount, 0); assert.equal(state.paymentTransactionId, '');
      assert.equal(state.paymentDeadline, booking.paymentDeadline); assert.equal(canPayBooking(state), true);
      assert.equal(rental.previewCancellation(booking.confirmationCode, access).refundAmount, 0);
      assert.deepEqual(await api('POST', booking.confirmationCode, { idempotencyKey: intent, localPaymentScenario: scenario }), failed);
      assert.equal((await api('POST', booking.confirmationCode, { idempotencyKey: intent, localPaymentScenario: 'success' })).data.code, 'submission_changed');
      const paid = await api('POST', booking.confirmationCode, { idempotencyKey: key(), localPaymentScenario: 'success' });
      assert.equal(paid.data.paymentStatus, 'paid'); assert.equal(paid.data.paidAmount, booking.pricing.payNow);
      const again = await api('POST', booking.confirmationCode, { idempotencyKey: key(), localPaymentScenario: 'success' });
      assert.equal(again.data.paymentTransactionId, paid.data.paymentTransactionId);
    });
  }
  for (const scenario of ['processing', 'unknown']) {
    await test(`${scenario} blocks competing actions and resolves once from authoritative polling`, async () => {
      access = actor();
      const booking = reserve(), intent = key();
      const start = now;
      const initial = await api('POST', booking.confirmationCode, { idempotencyKey: intent, localPaymentScenario: scenario });
      assert.equal(initial.status, scenario === 'unknown' ? 409 : 200);
      if (scenario === 'unknown') assert.equal(initial.data.code, 'payment_unconfirmed');
      const pending = rental.readBooking(booking.confirmationCode, access);
      assert.equal(pending.paymentStatus, scenario); assert.equal(pending.paidAmount, 0);
      assert.equal(canPayBooking(pending), false); assert.equal(canCancelBooking(pending), false);
      rejectsCode(() => rental.payBooking(booking.confirmationCode, key(), access), 'order_not_payable');
      rejectsCode(() => rental.previewCancellation(booking.confirmationCode, access), 'order_not_cancellable');
      now = start + 9999; assert.equal(rental.readBooking(booking.confirmationCode, access).paymentStatus, scenario);
      const completionsBefore = accountCompletions;
      now = start + 10000;
      const settled = await api('GET', booking.confirmationCode);
      assert.equal(settled.data.paymentStatus, 'paid'); assert.equal(settled.data.status, 'CONFIRMED');
      assert.equal(settled.data.paidAmount, booking.pricing.payNow);
      assert.ok(accountCompletions > completionsBefore);
      assert.equal(rental.readBooking(booking.confirmationCode, access).paymentTransactionId, settled.data.paymentTransactionId);
      assert.equal(settled.data.paymentDeadline, booking.paymentDeadline);
      assert.ok(!JSON.stringify(settled.data).includes('localPaymentSettlesAt'));
      now = start;
    });
  }
  await test('pending settlement crossing the hold deadline cannot falsely become cancelled', () => {
    access = actor(); const booking = reserve(); const start = now;
    try {
      now = Date.parse(booking.paymentDeadline) - 1;
      rental.payBooking(booking.confirmationCode, key(), access, 'processing');
      now += 2;
      assert.equal(rental.readBooking(booking.confirmationCode, access).status, 'PENDING_PAYMENT');
      now += 10000;
      assert.equal(rental.readBooking(booking.confirmationCode, access).status, 'CONFIRMED');
    } finally { now = start; }
  });
  await test('scenario parameters cannot bypass authorization, expiry, cancellation or the production guard', async () => {
    access = actor(); const owner = access, booking = reserve();
    access = actor();
    assert.equal((await api('POST', booking.confirmationCode, { idempotencyKey: key(), localPaymentScenario: 'success' })).status, 404);
    access = owner;
    assert.equal((await api('POST', booking.confirmationCode, { idempotencyKey: key(), localPaymentScenario: 'arbitrary' })).status, 400);
    assert.equal(rental.readBooking(booking.confirmationCode, access).paymentStatus, 'unpaid');
    const estimate = rental.previewCancellation(booking.confirmationCode, access);
    rental.cancelReservation(booking.confirmationCode, { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() }, access);
    rejectsCode(() => rental.payBooking(booking.confirmationCode, key(), access, 'success'), 'order_not_payable');
    const expired = reserve(), start = now;
    now = Date.parse(expired.paymentDeadline);
    rejectsCode(() => rental.payBooking(expired.confirmationCode, key(), access, 'processing'), 'order_not_payable');
    now = start;
    process.env.NODE_ENV = 'production'; delete process.env.TRUSTGO_RENTAL_MODE;
    rejectsCode(() => rental.payBooking(booking.confirmationCode, key(), access, 'success'), 'service_unavailable');
    process.env.TRUSTGO_RENTAL_MODE = 'local';
    if (originalEnvironment.NODE_ENV === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnvironment.NODE_ENV;
  });
  await test('client transport sends only the scenario and idempotency key, never card details', async () => {
    let request;
    global.fetch = async (url, options) => { request = { url, ...options }; return Response.json({ status: 'PENDING_PAYMENT', paymentStatus: 'failed' }); };
    const intent = key();
    await transport.payBookingByConfirmationCode('TG-EXAMPLE', intent, localPaymentScenarioForCard(cards.declined));
    assert.deepEqual(JSON.parse(request.body), { idempotencyKey: intent, localPaymentScenario: 'declined' });
    assert.ok(!request.body.includes(cards.declined));
    const state = JSON.stringify(global.__trustgoRentalState, (_key, value) => value instanceof Map ? [...value] : value instanceof Set ? [...value] : value);
    for (const card of Object.values(cards)) assert.ok(!state.includes(card));
  });
  const faultCases = [
    ['TG-QA-SERVICE-503', 503, 'service_unavailable'], ['TG-QA-RATE-429', 429, 'try_later'],
    ['TG-QA-TIMEOUT-504', 504, 'service_unavailable'], ['TG-QA-BAD-RESPONSE', 502, 'service_unavailable'],
  ];
  const lookup = (code, lastName = 'Traveler', resource = 'guest-lookup') => route.POST(new Request(`http://local.test/api/rental/${resource}`, {
    method: 'POST', headers: { Origin: 'http://local.test', 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmationCode: code, lastName }),
  }), { params: Promise.resolve({ action: [resource] }) });
  await test('local lookup inputs return deterministic faults without changing bookings or grants', async () => {
    process.env.NODE_ENV = 'development'; delete process.env.TRUSTGO_LOCAL_FAULTS;
    access = actor();
    const before = rental.listBookings(access), completions = accountCompletions;
    for (const [code, status, error] of faultCases) {
      for (const resource of ['guest-lookup', 'lookup']) {
        const response = await lookup(` ${code.toLowerCase()} `, 'Traveler', resource);
        assert.equal(response.status, status);
        assert.equal(response.headers.get('cache-control'), 'private, no-store');
        assert.equal(response.headers.get('set-cookie'), null);
        if (status === 502) await assert.rejects(() => response.json());
        else assert.deepEqual(await response.json(), { code: error });
      }
    }
    assert.deepEqual(rental.listBookings(access), before);
    assert.equal(accountCompletions, completions);
    assert.equal((await lookup('TG-QA-NOT-FOUND')).status, 404);
    assert.equal((await lookup('TG-QA-SERVICE-503', '')).status, 404);
    assert.equal((await lookup('TG-QA-SERVICE-503', null)).status, 400);
  });
  await test('client classifies synthetic 429, 503, gateway timeout and malformed response correctly', async () => {
    global.fetch = async (_url, options) => {
      const body = JSON.parse(options.body);
      return lookup(body.confirmationCode, body.lastName);
    };
    for (const [code, status, error] of faultCases) {
      await assert.rejects(() => transport.findGuestBooking(code, 'Traveler'), e => e.status === status && e.code === error);
    }
  });
  await test('synthetic error-page inputs propagate without access while ordinary orders still verify', async () => {
    const { readPageBooking } = require('../src/modules/booking-management/application/read-page-booking.ts');
    const { bookingAccessRecoveryPath } = require('../src/modules/booking-management/domain/access-recovery.ts');
    access = null;
    for (const [code, status, error] of faultCases) {
      await assert.rejects(() => readPageBooking(code, 'zh', `/zh/booking/${code}`), e => e.status === status && e.code === error);
    }
    await assert.rejects(() => readPageBooking('TG-QA-NOT-FOUND', 'zh', '/zh/booking/TG-QA-NOT-FOUND'),
      e => e.digest?.split(';')[2] === bookingAccessRecoveryPath('zh', '/zh/booking/TG-QA-NOT-FOUND'));
    access = actor();
  });
  await test('faults disable in production even with local adapter enabled, and can be switched off in development', async () => {
    for (const [environment, disabled] of [['production', false], ['development', true], ['test', true]]) {
      process.env.NODE_ENV = environment;
      if (disabled) process.env.TRUSTGO_LOCAL_FAULTS = 'off'; else delete process.env.TRUSTGO_LOCAL_FAULTS;
      for (const [code] of faultCases) {
        const response = await lookup(code);
        assert.equal(response.status, 404);
        assert.deepEqual(await response.json(), { code: 'booking_not_found' });
        rejectsCode(() => rental.readBooking(code, access), 'booking_not_found');
      }
    }
    process.env.NODE_ENV = 'production'; delete process.env.TRUSTGO_RENTAL_MODE;
    assert.equal((await lookup('TG-QA-SERVICE-503')).status, 503);
  });
  await test('home picker LAX aliases and selections lead to the documented inventory in every language', () => {
    process.env.NODE_ENV = 'development';
    const destinations = require('../src/modules/destination-search/search-engine.ts');
    const { selectionToLocation } = require('../src/modules/rental-search/domain/search-form.ts');
    for (const language of ['EN', 'ZH', 'JA', 'ES', 'KO']) {
      for (const query of ['LAX', 'lax', 'Los Angeles', '洛杉磯', '洛杉矶']) {
        const result = destinations.searchLocations(query, language);
        const poi = result.places.find(p => p.poiId === 'poi-lax-airport');
        assert.ok(poi, `${language}/${query}`);
        assert.equal(result.hasMatches, true); assert.equal(poi.serviceLocationCount, 2);
        assert.equal(poi.nearestStoreCode, 'US-LAX-01');
        const pickup = selectionToLocation({ selectionType: 'POI', poiId: poi.poiId, label: poi.label,
          serviceLocationCount: poi.serviceLocationCount, associatedStoreCode: poi.nearestStoreCode }, poi.label);
        assert.equal(getAvailableStoreOffers({ ...form(), pickup }).length, 6);
        assert.equal(getAvailableStoreOffers({ ...tripFromNow(24), pickup }).length, 0);
      }
      assert.equal(destinations.searchLocations('US-LAX-01', language).exactStore?.storeCode, 'US-LAX-01');
      assert.equal(destinations.searchLocations('US-LAX-02', language).exactStore?.storeCode, 'US-LAX-02');
      assert.equal(destinations.getCityAllPois('US', 'los-angeles', language)[0]?.poiId, 'poi-lax-airport');
    }
    assert.ok(destinations.getBrowseMarkets().some(m => m.code === 'US'));
    assert.equal(destinations.getBrowseCities('US')[0].code, 'los-angeles');
    process.env.NODE_ENV = 'production';
    assert.equal(destinations.searchLocations('LAX', 'ZH').hasMatches, false);
    assert.equal(destinations.getBrowseMarkets().some(m => m.code === 'US'), false);
  });
  await test('preview accepts easy dummy cards and short failure inputs while production keeps strict validation', async () => {
    const { paymentCardValidationError } = require('../src/modules/checkout/domain/payment-validation.ts');
    const card = { cardNumber: '1234', cardholderName: '随便测试', expiryDate: '12/39', cvc: '1' };
    process.env.NODE_ENV = 'development'; process.env.TRUSTGO_RENTAL_MODE = 'local';
    for (const number of ['1', '1234', '1111111111111111', '4242424242424241', '4242424242424242424']) {
      assert.equal(paymentCardValidationError({ ...card, cardNumber: number }, new Date(now)), null, number);
      assert.equal(localPaymentScenarioForCard(number), 'success');
    }
    for (const number of ['', '0000', 'abc', '12345678901234567890']) {
      assert.equal(paymentCardValidationError({ ...card, cardNumber: number }, new Date(now)), 'invalid_card');
    }
    assert.equal(paymentCardValidationError({ ...card, cvc: '' }), 'invalid_card');
    assert.equal(paymentCardValidationError({ ...card, cardholderName: ' ' }), 'invalid_card');
    for (const expiryDate of ['13/39', '01/20', '1/3', '']) {
      assert.equal(paymentCardValidationError({ ...card, expiryDate }, new Date(now)), 'invalid_expiry');
    }
    const shortcuts = { '0002': 'declined', '9995': 'insufficient_funds', '3063': 'authentication_failed',
      '3155': 'processing', '0119': 'unknown', '0259': 'unavailable' };
    for (const [number, scenario] of Object.entries(shortcuts)) {
      assert.equal(paymentCardValidationError({ ...card, cardNumber: number }, new Date(now)), null);
      assert.equal(localPaymentScenarioForCard(number), scenario);
    }
    access = actor();
    const booking = reserve();
    assert.equal((await api('POST', booking.confirmationCode, { idempotencyKey: key(),
      localPaymentScenario: localPaymentScenarioForCard('0002') })).data.code, 'payment_declined');
    assert.equal((await api('POST', booking.confirmationCode, { idempotencyKey: key(),
      localPaymentScenario: localPaymentScenarioForCard('1234') })).data.paymentStatus, 'paid');
    process.env.NODE_ENV = 'production';
    assert.equal(paymentCardValidationError(card, new Date(now)), 'invalid_card');
    assert.equal(paymentCardValidationError({ ...card, cardNumber: '4242424242424241', cvc: '123' }, new Date(now)), 'invalid_card');
    assert.equal(paymentCardValidationError({ ...card, cardNumber: cards.success, cvc: '123' }, new Date(now)), null);
    assert.equal(paymentCardValidationError({ ...card, cardNumber: cards.success }, new Date(now)), 'invalid_card');
    for (const number of Object.keys(shortcuts)) assert.equal(localPaymentScenarioForCard(number), 'success');
  });
  console.log(`\n${passed} local scenario checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  Date.now = realNow; global.fetch = realFetch;
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
