/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Execute actual application logic; isolate only display components and request identity.
// No browser automation, preview server, network or real payments are used.
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  if (name.startsWith('@/')) name = path.join(root, 'src', name.slice(2));
  return resolve.call(this, name, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
require.extensions['.tsx'] = require.extensions['.ts'];
const rental = require('../src/integrations/fleetedge/local-rental-adapter.ts');
const search = require('../src/modules/rental-search/domain/search-form.ts');
const { getAvailableStoreOffers } = require('../src/modules/rental-search/domain/availability.ts');
const { depotDateTime } = require('../src/modules/rental-search/domain/depot-time.ts');
const { getDefaultEquipmentSelection } = require('../src/modules/rate-details/domain/equipment.ts');
const { readRateSelection } = require('../src/modules/rate-details/domain/selection.ts');
const { safeRateRecoveryPath } = require('../src/modules/reservation/application/route-recovery.ts');
const { verifiedBookingReturnPath } = require('../src/modules/booking-management/domain/access-recovery.ts');
const { createBookingSync } = require('../src/modules/booking-management/application/booking-sync.ts');
const { bookingStatusKey, paymentStatusKey, hasFreeCancellation } = require('../src/modules/booking-management/domain/status-presentation.ts');
const { canPayBooking, canCancelBooking } = require('../src/modules/booking-management/domain/lifecycle.ts');
const { RentalError } = require('../src/modules/reservation/domain/validation.ts');
const transport = require('../src/modules/booking-management/application/booking-store.ts');
const key = () => crypto.randomUUID();
const actor = { sessionId: key() };
let requestAccess = actor;
const load = Module._load;
Module._load = function (name, parent, ...rest) {
  if (parent?.filename.includes('/src/modules/') && parent.filename.includes('/ui/')) {
    if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
    if (name === '@/i18n/useI18n') return { useI18n: () => ({ routeLang: 'en',
      t: key => require('../src/i18n/translation.ts').getTranslation(key, 'en') }) };
  }
  if (name === '@/server/rental-access') return {
    rentalAccess: async () => requestAccess, checkRentalRequest: () => {}, attachRentalCookie: () => {},
  };
  if (name === '@/server/checkout-account') return { completeCheckoutAccount: () => {} };
  if (parent?.filename.includes('/src/app/[lang]/')) {
    if (name === 'lucide-react') return { ArrowLeft: () => null };
    if (name === '@/i18n/useI18n') return { getTranslation: key => key };
    if (name === '@/modules/rate-details/public-api') return require('../src/modules/rate-details/application/rate-service.ts');
    if (name === '@/modules/reservation/public-api') return { BookingProgressStepper: () => null };
    if (name === '@/modules/rental-search/ui/RentalSearchResults') return { RentalSearchResults: () => null };
    if (['./RateDetailsView', './DriverBookingView', './BookingDetailsView', './CheckoutCashierView'].includes(name)) {
      return { [name.slice(2)]: () => null };
    }
  }
  return load.call(this, name, parent, ...rest);
};
const ratePage = require('../src/app/[lang]/rent/[id]/page.tsx').default;
const driverPage = require('../src/app/[lang]/book/driver/page.tsx').default;
const resultsPage = require('../src/app/[lang]/rent/page.tsx').default;
const bookingPage = require('../src/app/[lang]/booking/[confirmationCode]/page.tsx').default;
const checkoutPage = require('../src/app/[lang]/checkout/[reservationId]/page.tsx').default;
const api = require('../src/app/api/rental/[...action]/route.ts');
const driver = { title: 'Ms', firstName: 'Test', lastName: 'Traveler', email: 'test@example.com',
  phoneCountryCode: '+1', phone: '5550001234', licenseCountry: 'US' };
const form = () => ({ ...search.createDefaultSearchForm('US', new Date('2030-01-01T12:00:00Z')),
  pickupDate: '2030-01-10', returnDate: '2030-01-13',
  pickup: { label: 'LAX', poiId: 'poi-lax-airport' } });
const details = () => rental.createRateDetails(form(), 'toyota-rav4-suv@US-LAX-01', 'en');
const input = rate => ({ rateDetailsId: rate.trip.rateDetailsId, insuranceId: 'basic',
  equipment: getDefaultEquipmentSelection(), driver, idempotencyKey: key() });
const props = (params, query = {}) => ({ params: Promise.resolve({ lang: 'en', ...params }), searchParams: Promise.resolve(query) });
const rejectsCode = (fn, code) => assert.throws(fn, error => error instanceof RentalError && error.code === code);
async function redirects(fn, check) {
  await assert.rejects(fn, error => {
    assert.ok(error.digest?.startsWith('NEXT_REDIRECT;'), error.stack);
    const target = error.digest.split(';')[2];
    if (typeof check === 'function') check(target); else assert.equal(target, check);
    return true;
  });
}
function findProps(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (tree.props && predicate(tree.props)) return tree.props;
  for (const child of [tree.props?.children].flat(Infinity)) {
    const found = findProps(child, predicate);
    if (found) return found;
  }
  return null;
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const tick = () => new Promise(resolve => setImmediate(resolve));
let passed = 0;
async function test(name, fn) { await fn(); passed++; console.log(`✓ ${name}`); }
const realNow = Date.now;
const realFetch = global.fetch;
const oldEnvironment = { NODE_ENV: process.env.NODE_ENV, TRUSTGO_RENTAL_MODE: process.env.TRUSTGO_RENTAL_MODE };

(async () => {
  Date.now = () => Date.parse('2030-01-01T12:00:00Z');
  process.env.TRUSTGO_RENTAL_MODE = 'local';
  await test('past pick-up and exact local pick-up instant cannot return sellable offers', () => {
    const past = { ...form(), pickupDate: '2020-01-01', returnDate: '2020-01-02' };
    rejectsCode(() => getAvailableStoreOffers(past), 'invalid_search');
    const exact = { ...form(), pickupDate: '2030-01-01', pickupTime: '04:00', returnDate: '2030-01-02' };
    rejectsCode(() => getAvailableStoreOffers(exact), 'invalid_search');
    assert.deepEqual(getAvailableStoreOffers({ ...exact, pickupTime: '04:01' }), []);
  });
  await test('depot wall clocks use their own zones across normal and DST dates', () => {
    assert.equal(depotDateTime('2030-01-01', '10:00', 'Asia/Tokyo'), '2030-01-01T01:00:00.000Z');
    assert.equal(depotDateTime('2030-01-01', '10:00', 'America/Los_Angeles'), '2030-01-01T18:00:00.000Z');
    assert.equal(depotDateTime('2030-07-01', '10:00', 'America/Los_Angeles'), '2030-07-01T17:00:00.000Z');
    rejectsCode(() => depotDateTime('2030-03-10', '02:30', 'America/Los_Angeles'), 'invalid_search');
  });
  await test('pick-up entering the unavailable three-day window rejects creation within a valid quote', () => {
    const base = Date.now;
    try {
      Date.now = () => Date.parse('2030-01-01T17:59:00Z');
      const rate = rental.createRateDetails({ ...form(), pickupDate: '2030-01-04', returnDate: '2030-01-05' }, 'toyota-rav4-suv@US-LAX-01', 'en');
      Date.now = () => Date.parse('2030-01-01T18:00:01Z');
      const owner = { sessionId: key() };
      rejectsCode(() => rental.createReservation(input(rate), owner), 'rate_unavailable');
      assert.deepEqual(rental.listBookings(owner), []);
    } finally { Date.now = base; }
  });
  await test('expired display snapshots never extend quote validity or allow creation', () => {
    const rate = details(), base = Date.now;
    try {
      Date.now = () => Date.parse(rate.trip.rateExpiresAt);
      assert.deepEqual(rental.getRateDetailsForDisplay(rate.trip.rateDetailsId), rate);
      rejectsCode(() => rental.getRateDetails(rate.trip.rateDetailsId), 'rate_expired');
      rejectsCode(() => rental.createReservation(input(rate), actor), 'rate_expired');
      Date.now = () => Date.parse(rate.trip.rateExpiresAt) + 86_400_000;
      rejectsCode(() => rental.getRateDetailsForDisplay(rate.trip.rateDetailsId), 'rate_expired');
    } finally { Date.now = base; }
  });
  await test('label-only, unknown and conflicting identities never inherit another destination', () => {
    for (const pickup of [
      { label: 'Tokyo' }, { label: 'Tokyo', storeCode: 'unknown' },
      { label: 'Tokyo', poiId: 'poi-lax-airport', storeCode: 'KLDJ01' },
    ]) assert.deepEqual(getAvailableStoreOffers({ ...form(), pickup }), []);
    const parsed = search.parseSearchForm({ pickupStoreCode: 'KLDJ01' }, form());
    assert.equal(parsed.pickup.storeCode, 'KLDJ01');
    assert.ok(getAvailableStoreOffers(parsed).every(offer => offer.storeCode === 'KLDJ01'));
  });
  await test('invalid URL choices fall back consistently; valid choices survive', () => {
    for (const insurance of ['invalid', ['inclusive']]) assert.equal(readRateSelection({ insurance }).insuranceId, 'basic');
    for (const equipment of ['{', 'null', '[]', JSON.stringify({ ...getDefaultEquipmentSelection(), childSeat: 99 })]) {
      assert.deepEqual(readRateSelection({ equipment }).equipment, getDefaultEquipmentSelection());
    }
    const equipment = { ...getDefaultEquipmentSelection(), childSeat: 2 };
    assert.deepEqual(readRateSelection({ insurance: 'inclusive', equipment: JSON.stringify(equipment) }), { insuranceId: 'inclusive', equipment });
  });
  await test('overlap checks allow adjacent trips and isolated guests but reject the same owner overlap', () => {
    const owner = { sessionId: key() };
    const firstRate = details();
    const first = rental.createReservation(input(firstRate), owner);
    rejectsCode(() => rental.createReservation(input(details()), owner), 'booking_conflict');
    assert.ok(rental.createReservation(input(details()), { sessionId: key() }));
    const nextSearch = { ...form(), pickupDate: form().returnDate, returnDate: search.addDays(form().returnDate, 1) };
    const adjacent = rental.createRateDetails(nextSearch, first.trip.offerId, 'en');
    assert.ok(rental.createReservation(input(adjacent), owner));
    const estimate = rental.previewCancellation(first.confirmationCode, owner);
    rental.cancelReservation(first.confirmationCode, { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() }, owner);
    assert.ok(rental.createReservation(input(details()), owner));
  });
  await test('expired unpaid holds no longer block a fresh reservation', () => {
    const owner = { sessionId: key() };
    const first = rental.createReservation(input(details()), owner);
    const base = Date.now;
    try {
      Date.now = () => Date.parse(first.paymentDeadline);
      assert.equal(rental.readBooking(first.confirmationCode, owner).closureReason, 'payment_timeout');
      assert.ok(rental.createReservation(input(details()), owner));
    } finally { Date.now = base; }
  });
  await test('rate recovery allows only current-language local rate pages and public fields', () => {
    for (const value of ['https://evil.test/en/rent/car', '//evil.test/en/rent/car', '/en/booking/TG-X', '/zh/rent/car', '/en/rent/car\\x', '/en/rent/%2Fcar']) {
      assert.equal(safeRateRecoveryPath(value, 'en'), null);
    }
    const path = safeRateRecoveryPath('/en/rent/car?pickup=Tokyo&offer=car%40KLDJ01&rateDetailsId=old&email=secret#frag', 'en');
    assert.equal(path, '/en/rent/car?pickup=Tokyo&offer=car%40KLDJ01');
  });
  await test('verification resumes only the exact verified booking, surface and language', () => {
    for (const value of ['https://evil.test/en/booking/TG-X', '//evil.test/en/booking/TG-X', '/zh/booking/TG-X', '/en/booking/TG-Y',
      '/en/booking/TG-X?token=x', '/en/booking/TG-X#x', '/en/booking/TG-X%2Fother', '/en/booking/%', '/en/rent/TG-X']) {
      assert.equal(verifiedBookingReturnPath(value, 'en', 'TG-X'), null);
    }
    assert.equal(verifiedBookingReturnPath('/en/checkout/tg-x', 'en', 'TG-X'), '/en/checkout/TG-X');
  });
  await test('rate route uses existing expired dialog context, not a generic exception', async () => {
    const rate = details(), base = Date.now;
    try {
      Date.now = () => Date.parse(rate.trip.rateExpiresAt);
      const tree = await ratePage(props({ id: rate.vehicle.id }, { rateDetailsId: rate.trip.rateDetailsId }));
      assert.equal(findProps(tree, p => p.trip)?.trip.rateDetailsId, rate.trip.rateDetailsId);
      await redirects(() => driverPage(props({}, { rateDetailsId: rate.trip.rateDetailsId, insurance: 'inclusive' })), target => {
        const url = new URL(target, 'https://local.test');
        assert.equal(url.pathname, `/en/rent/${rate.vehicle.id}`);
        assert.equal(url.searchParams.get('rateDetailsId'), rate.trip.rateDetailsId);
        assert.equal(url.searchParams.get('insurance'), 'inclusive');
      });
    } finally { Date.now = base; }
  });
  await test('lost quote context recovers safely without looping through the lost ID', async () => {
    await redirects(() => driverPage(props({}, { rateDetailsId: 'missing', returnTo: '/en/rent/car?rateDetailsId=missing&offer=car%40KLDJ01' })), '/en/rent/car?offer=car%40KLDJ01');
    await redirects(() => driverPage(props({}, { returnTo: '//evil.test' })), '/en/rent');
    await redirects(() => ratePage(props({ id: 'toyota-rav4-suv' }, { pickup: 'Tokyo' })), target => {
      const url = new URL(target, 'https://local.test');
      assert.equal(url.pathname, '/en/rent');
      assert.equal(url.searchParams.get('pickup'), 'Tokyo');
      assert.equal(url.searchParams.get('pickupPoiId'), null);
    });
  });
  await test('unknown vehicle and quote/vehicle mismatch remain true Next 404s', async () => {
    const rate = details();
    for (const query of [props({ id: 'unknown' }), props({ id: 'hyundai-i30-compact' }, { rateDetailsId: rate.trip.rateDetailsId })]) {
      await assert.rejects(() => ratePage(query), error => error.digest === 'NEXT_HTTP_ERROR_FALLBACK;404');
    }
  });
  await test('invalid search results explain date failure without showing inventory', async () => {
    const tree = await resultsPage(props({}, { pickup: 'LAX', pickupPoiId: 'poi-lax-airport', pickupDate: '2020-01-01T10:00', returnDate: '2020-01-02T10:00' }));
    assert.deepEqual(tree.props.offers, []);
    assert.equal(tree.props.docNotice.isWarning, true);
  });
  const booking = rental.createReservation(input(details()), actor);
  await test('booking and checkout SSR recover missing authorization to existing verification', async () => {
    requestAccess = null;
    for (const [page, params, surface] of [[bookingPage, { confirmationCode: booking.confirmationCode }, 'booking'], [checkoutPage, { reservationId: booking.confirmationCode }, 'checkout']]) {
      await redirects(() => page(props(params)), target => {
        const url = new URL(target, 'https://local.test');
        assert.ok(url.pathname === '/en/manage-booking' || (url.pathname === '/en' && url.searchParams.get('bookingLookup') === '1'));
        assert.equal(url.searchParams.get('returnTo'), `/en/${surface}/${booking.confirmationCode}`);
      });
    }
    requestAccess = { sessionId: key() };
    await redirects(() => bookingPage(props({ confirmationCode: booking.confirmationCode })), target => assert.ok(target.startsWith('/en/manage-booking?') || target.startsWith('/en?')));
    requestAccess = actor;
    assert.ok(await bookingPage(props({ confirmationCode: booking.confirmationCode })));
  });
  await test('production service failures propagate instead of becoming false 404s', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.TRUSTGO_RENTAL_MODE;
    try {
      for (const [page, params] of [[bookingPage, { confirmationCode: booking.confirmationCode }], [checkoutPage, { reservationId: booking.confirmationCode }]]) {
        await assert.rejects(() => page(props(params)), error => error.code === 'service_unavailable' && error.status === 503 && !error.digest);
      }
    } finally {
      process.env.TRUSTGO_RENTAL_MODE = 'local';
      if (oldEnvironment.NODE_ENV === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = oldEnvironment.NODE_ENV;
    }
  });
  await test('client transport distinguishes not found, throttling and temporary failure', async () => {
    for (const [status, body, code] of [[404, { code: 'booking_not_found' }, 'booking_not_found'], [429, {}, 'try_later'], [503, { code: 'service_unavailable' }, 'service_unavailable'], [400, { code: 'invalid_driver', field: 'email' }, 'invalid_driver']]) {
      global.fetch = async () => Response.json(body, { status });
      await assert.rejects(() => transport.getBookingByConfirmationCode('TG-X'), error => error.code === code && error.status === status && (status !== 400 || error.field === 'email'));
    }
    for (const response of [new Response('<html>oops</html>', { status: 503 }), Response.json(null)]) {
      global.fetch = async () => response;
      await assert.rejects(() => transport.listGuestBookings(), error => error.code === 'service_unavailable');
    }
    global.fetch = async () => { throw new TypeError('offline'); };
    await assert.rejects(() => transport.listGuestBookings(), error => error.code === 'service_unavailable' && error.status === 503);
  });
  await test('API preserves field validation and genuine unknown-endpoint 404 semantics', async () => {
    const response = await api.POST(new Request('http://localhost/api/rental/reservations', { method: 'POST', body: JSON.stringify({ ...input(details()), driver: { ...driver, email: 'bad' } }) }), { params: Promise.resolve({ action: ['reservations'] }) });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { code: 'invalid_driver', field: 'email' });
    const unknown = await api.GET(new Request('http://localhost/api/rental/unknown'), { params: Promise.resolve({ action: ['unknown'] }) });
    assert.equal(unknown.status, 404);
    assert.deepEqual(await unknown.json(), { code: 'invalid_request' });
  });
  await test('overlapping refreshes coalesce and cannot overwrite a completed mutation', async () => {
    const first = deferred(), second = deferred(), seen = [], errors = [];
    let calls = 0;
    const sync = createBookingSync({ load: () => (++calls === 1 ? first.promise : second.promise), onBooking: b => seen.push(b), onError: e => errors.push(e) });
    const running = sync.refresh();
    void sync.refresh(); void sync.refresh();
    await tick(); assert.equal(calls, 1);
    const paid = { ...booking, status: 'CONFIRMED', paymentStatus: 'paid' };
    sync.publish(paid);
    first.resolve(booking);
    await tick(); assert.equal(calls, 2);
    assert.deepEqual(seen, [paid]);
    second.resolve(paid);
    await running;
    assert.deepEqual(seen, [paid, paid]);
    assert.deepEqual(errors, []);
    sync.stop();
  });
  await test('obsolete errors and disposed responses never change newer booking state', async () => {
    const pending = deferred(), seen = [], errors = [];
    const sync = createBookingSync({ load: () => pending.promise, onBooking: b => seen.push(b), onError: e => errors.push(e) });
    const running = sync.refresh();
    sync.publish(booking);
    pending.reject(new RentalError('booking_not_found', 404));
    await running;
    assert.deepEqual(errors, []);
    const stopped = deferred();
    const disposable = createBookingSync({ load: () => stopped.promise, onBooking: b => seen.push(b), onError: e => errors.push(e) });
    const loading = disposable.refresh();
    disposable.stop(); stopped.resolve(booking); await loading;
    await disposable.refresh();
    assert.deepEqual(seen, [booking]);
  });
  await test('sync recovers after synchronous failures as well as rejected requests', async () => {
    let calls = 0;
    const seen = [], errors = [];
    const sync = createBookingSync({ load: () => {
      if (++calls === 1) throw new RentalError('service_unavailable', 503);
      if (calls === 2) return Promise.reject(new RentalError('try_later', 429));
      return Promise.resolve(booking);
    }, onBooking: b => seen.push(b), onError: e => errors.push(e.code) });
    await sync.refresh(); await sync.refresh(); await sync.refresh();
    assert.deepEqual(errors, ['service_unavailable', 'try_later']);
    assert.deepEqual(seen, [booking]); sync.stop();
  });
  await test('payment and reservation state mapping keeps unknown payments blocked and refunds separate', () => {
    for (const state of ['processing', 'unknown', 'failed']) {
      const b = { ...booking, paymentStatus: state };
      assert.equal(paymentStatusKey(b), `rental_status_${state}`);
      assert.equal(canPayBooking(b), state === 'failed');
      assert.equal(canCancelBooking(b), state === 'failed');
    }
    for (const [status, expected] of [['ACTIVE_RENTAL', 'bm_state_active'], ['COMPLETED', 'bm_state_completed']]) {
      assert.equal(bookingStatusKey({ ...booking, status }), expected);
    }
    assert.equal(bookingStatusKey({ ...booking, status: 'CANCELLED', closureReason: 'payment_timeout' }), 'ck_hold_expired_title');
    for (const refundStatus of ['processing', 'refunded', 'failed', 'not_required']) {
      assert.equal(paymentStatusKey({ ...booking, status: 'CANCELLED', paymentStatus: 'paid', refundStatus }), `rental_refund_${refundStatus}`);
    }
    const cutoff = Date.parse(booking.trip.pickupDateTime) - booking.vehicle.cancellationFreeHours * 3_600_000;
    assert.equal(hasFreeCancellation(booking, cutoff), true);
    assert.equal(hasFreeCancellation(booking, cutoff + 1), false);
    assert.equal(hasFreeCancellation({ ...booking, status: 'CANCELLED' }, cutoff - 1), false);
  });
  await test('rendered order amounts use online due and actual paid rather than counter totals', () => {
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const { GuestOrderList } = require('../src/modules/booking-management/ui/GuestOrderList.tsx');
    const pricing = { ...booking.pricing, payNow: 123.45, totalCharge: 987.65 };
    const render = order => renderToStaticMarkup(React.createElement(GuestOrderList, { orders: [order], lang: 'en', onAddNewBooking: () => {} }));
    const unpaid = render({ ...booking, pricing });
    assert.ok(unpaid.includes('123.45'));
    assert.ok(!unpaid.includes('987.65'));
    const paid = render({ ...booking, pricing, status: 'CONFIRMED', paymentStatus: 'paid', paidAmount: 111.11 });
    assert.ok(paid.includes('111.11'));
    assert.ok(!paid.includes('987.65'));
  });
  await test('rendered overseas contact uses its own depot telephone', () => {
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const { BookingDetailsSidebar } = require('../src/modules/booking-management/ui/BookingDetailsSidebar.tsx');
    const { storeDirectory } = require('../src/modules/destination-search/store-directory.ts');
    const depot = storeDirectory.find(store => store.storeCode === 'KLDJ01');
    const html = renderToStaticMarkup(React.createElement(BookingDetailsSidebar, {
      booking: { ...booking, trip: { ...booking.trip, pickupStoreCode: depot.storeCode } },
    }));
    assert.ok(depot.phone);
    assert.ok(html.includes(`tel:${depot.phone.replace(/[^0-9+]/g, '')}`));
    assert.ok(!html.includes('tel:+13105550199'));
  });
  await test('elapsed client deadline alone never renders an authoritative cancelled message', () => {
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const { getTranslation } = require('../src/i18n/translation.ts');
    const { RateLockHoldBanner } = require('../src/modules/checkout/ui/RateLockHoldBanner.tsx');
    const overdue = { ...booking, paymentDeadline: new Date(Date.now() - 1).toISOString() };
    const render = (order, errorCode) => renderToStaticMarkup(React.createElement(RateLockHoldBanner, { booking: order, canCancel: false, onCancel: () => {}, errorCode }));
    assert.ok(render(overdue).includes(getTranslation('ck_hold_checking_title', 'en')));
    assert.ok(render({ ...overdue, status: 'CANCELLED', closureReason: 'payment_timeout' }).includes(getTranslation('ck_hold_expired_title', 'en')));
    assert.ok(render(overdue, 'service_unavailable').includes(getTranslation('rental_service_unavailable', 'en')));
  });
  console.log(`\n${passed} booking recovery regressions passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  Date.now = realNow; global.fetch = realFetch;
  for (const [key, value] of Object.entries(oldEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
