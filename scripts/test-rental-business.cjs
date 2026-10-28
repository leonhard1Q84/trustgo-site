/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Compile the actual TypeScript domain and adapter in memory; no browser,
// preview server, payment provider, or generated application source is used.
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
const { createDefaultSearchForm, getRentalDays, parseSearchForm } = require('../src/modules/rental-search/domain/search-form.ts');
const { getAvailableStoreOffers, validateSearch } = require('../src/modules/rental-search/domain/availability.ts');
const { getDefaultEquipmentSelection, calculateEquipmentCost, getEquipmentChargeLines } = require('../src/modules/rate-details/domain/equipment.ts');
const { pendingCheckouts, holdSeconds } = require('../src/modules/booking-management/domain/pending-checkout.ts');
const { estimateCancellation } = require('../src/modules/booking-management/domain/lifecycle.ts');
const { validateDriver } = require('../src/modules/reservation/domain/validation.ts');
const { storeDirectory, isStoreEligible, findStoresWithinRadius } = require('../src/modules/destination-search/store-directory.ts');
const { poiCatalog } = require('../src/modules/destination-search/poi-catalog.ts');
const { buildDepotStoreInfo } = require('../src/modules/rate-details/domain/depot-info.ts');
const { FLEET_STORE_OFFERS } = require('../src/modules/rental-search/domain/store-offers.ts');
const { aggregateVehicleGroups } = require('../src/modules/rental-search/application/vehicle-group-aggregator.ts');
const { FLEET_VEHICLES } = require('../src/modules/rental-search/domain/fleet-data.ts');
const { findResumableReservation } = require('../src/modules/reservation/application/checkout-recovery.ts');
const { buildRateReturnHref } = require('../src/modules/reservation/application/rate-return.ts');
const { buildCancellationPolicy, calculateRatePricing } = require('../src/modules/rate-details/application/rate-service.ts');
const { cancellationCutoff, cancellationHeadline, cancellationRows } = require('../src/modules/rate-details/domain/cancellation-presentation.ts');
const { getTranslation } = require('../src/i18n/translation.ts');
const driver = { title: 'Ms', firstName: 'Test', lastName: 'Traveler', email: 'test@example.com',
  phoneCountryCode: '+1', phone: '5550001234', licenseCountry: 'United States' };
const form = () => ({ ...createDefaultSearchForm('US', new Date(Date.now() + 2 * 86400000)),
  pickup: { label: 'LAX', poiId: 'poi-lax-airport' } });
const access = () => ({ sessionId: crypto.randomUUID() });
const key = () => crypto.randomUUID();
const details = (offer = 'toyota-rav4-suv@US-LAX-01') => rental.createRateDetails(form(), offer, 'en');
const input = rate => ({ rateDetailsId: rate.trip.rateDetailsId, insuranceId: 'basic',
  equipment: getDefaultEquipmentSelection(), driver, idempotencyKey: key() });
let passed = 0;
function test(name, callback) { callback(); passed++; console.log(`✓ ${name}`); }
function rejects(callback, code) { assert.throws(callback, error => error.code === code || error.message === code); }

test('unchanged checkout retry resumes only its own payable reservation', () => {
  const actor = access(), request = input(details());
  const booking = rental.createReservation(request, actor);
  // A new client intent can receive a conflict, then recover the authorized hold.
  rejects(() => rental.createReservation({ ...request, idempotencyKey: key() }, actor), 'booking_conflict');
  const orders = rental.listBookings(actor);
  assert.equal(findResumableReservation(orders, request).confirmationCode, booking.confirmationCode);
  assert.equal(findResumableReservation(rental.listBookings(access()), request), undefined);
  for (const patch of [
    { driver: { ...driver, email: 'other@example.com' } },
    { driver: { ...driver, additionalDriver: { enabled: true, fullName: 'Another Traveler' } } },
    { equipment: { ...request.equipment, childSeat: 1 } },
    { insuranceId: 'inclusive' },
    { rateDetailsId: 'another-quote' },
    { accountCreation: { create_account_requested: true } },
  ]) assert.equal(findResumableReservation(orders, { ...request, ...patch }), undefined);
  rental.payBooking(booking.confirmationCode, key(), actor);
  assert.equal(findResumableReservation(rental.listBookings(actor), request), undefined);
});
test('expired or uncertain payments cannot be resumed as payable holds', () => {
  const request = input(details()), booking = rental.createReservation(request, access());
  for (const patch of [
    { paymentStatus: 'processing' }, { paymentStatus: 'unknown' }, { status: 'CANCELLED' },
    { paymentDeadline: new Date(Date.now() - 1000).toISOString() },
  ]) assert.equal(findResumableReservation([{ ...booking, ...patch }], request), undefined);
});
test('global checkout summaries exclude closed, uncertain and expired holds and all customer details', () => {
  const booking = rental.createReservation(input(details()), access());
  const now = Date.now();
  const later = { ...booking, confirmationCode: 'LATER', paymentDeadline: new Date(now + 60_000).toISOString() };
  const earlier = { ...booking, confirmationCode: 'EARLIER', paymentDeadline: new Date(now + 10_000).toISOString() };
  const excluded = [
    { status: 'CANCELLED' }, { status: 'CONFIRMED', paymentStatus: 'paid' },
    { paymentStatus: 'processing' }, { paymentStatus: 'unknown' },
    { paymentDeadline: new Date(now).toISOString() }, { paymentDeadline: 'invalid' },
  ].map(patch => ({ ...booking, ...patch }));
  const summaries = pendingCheckouts([later, ...excluded, earlier], now);
  assert.deepEqual(summaries.map(order => order.confirmationCode), ['EARLIER', 'LATER']);
  assert.deepEqual(Object.keys(summaries[0]).sort(), ['confirmationCode', 'paymentDeadline', 'vehicleName']);
  assert.equal(holdSeconds(earlier.paymentDeadline, now), 10);
  assert.equal(holdSeconds(earlier.paymentDeadline, now + 10_000), 0);
  assert.equal(holdSeconds('invalid', now), 0);
  assert.equal(holdSeconds(undefined, now), 0);
});
test('a released or paid reservation disappears from authorized global checkout summaries', () => {
  const actor = access();
  const booking = rental.createReservation(input(details()), actor);
  assert.equal(pendingCheckouts(rental.listBookings(actor)).length, 1);
  assert.deepEqual(pendingCheckouts(rental.listBookings(access())), []);
  const estimate = rental.previewCancellation(booking.confirmationCode, actor);
  assert.equal(estimate.paidAmount + estimate.penaltyAmount + estimate.refundAmount, 0);
  rental.cancelReservation(booking.confirmationCode, { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() }, actor);
  assert.deepEqual(pendingCheckouts(rental.listBookings(actor)), []);
  const next = rental.createReservation(input(details()), actor);
  rental.payBooking(next.confirmationCode, key(), actor);
  assert.deepEqual(pendingCheckouts(rental.listBookings(actor)), []);
});
test('driver validation identifies the actual field instead of always blaming the first name', () => {
  for (const [field, value] of [
    ['firstName', ' '], ['lastName', ' '], ['email', 'invalid'],
    ['phoneCountryCode', '1'], ['phone', '123'], ['flightNumber', '!'],
    ['additionalDriver', { enabled: true, fullName: ' ' }],
  ]) assert.throws(() => validateDriver({ ...driver, [field]: value }),
    error => error.code === 'invalid_driver' && error.field === field);
});

test('itemized equipment charges respect quantity and daily charge caps', () => {
  const selection = { ...getDefaultEquipmentSelection(), childSeat: 2, gpsNavigation: true, snowChains: true };
  const lines = getEquipmentChargeLines(selection, 14);
  assert.deepEqual(lines.map(({ id, quantity, chargeDays, amount }) => ({ id, quantity, chargeDays, amount })), [
    { id: 'childSeat', quantity: 2, chargeDays: 10, amount: 200 },
    { id: 'gpsNavigation', quantity: 1, chargeDays: 10, amount: 90 },
    { id: 'snowChains', quantity: 1, chargeDays: 7, amount: 105 },
  ]);
  assert.equal(lines.reduce((sum, line) => sum + line.amount, 0), calculateEquipmentCost(selection, 14));
  assert.deepEqual(getEquipmentChargeLines(getDefaultEquipmentSelection(), 3), []);
  rejects(() => getEquipmentChargeLines({ ...selection, childSeat: 3 }, 14), 'invalid_equipment');
});
test('four price categories and payment timing reconcile with taxes counted once', () => {
  for (const insurance of ['basic', 'inclusive', 'zero-excess']) {
    const pricing = calculateRatePricing(FLEET_VEHICLES[0], { rentalDays: 14, pickupLocation: 'A', returnLocation: 'B' }, insurance, 395);
    const categories = [pricing.baseRentalSubtotal, pricing.insuranceSubtotal, pricing.equipmentSubtotal,
      pricing.specialFeesSubtotal + pricing.taxesAndFees];
    assert.equal(Math.round(categories.reduce((sum, amount) => sum + amount, 0) * 100), Math.round(pricing.totalCharge * 100));
    assert.equal(Math.round((pricing.payNow + pricing.payAtCounter) * 100), Math.round(pricing.totalCharge * 100));
    assert.equal(pricing.specialFeesSubtotal, 65);
  }
});
test('return access type comes from its own depot, not the pickup supplier', () => {
  for (const [accessType, expected] of [['counter', 'In-Terminal Counter'], ['walk', 'Walk to Depot']]) {
    const store = storeDirectory.find(store => store.accessType === accessType);
    assert.ok(store);
    const info = buildDepotStoreInfo('TrustGo', store.localizedNames.EN, 'Free Shuttle Bus', store.storeCode);
    assert.equal(info.locationType, expected);
  }
});

test('rate cancellation dates use the depot timezone and selected free-cancellation window', () => {
  const trip = { pickupDateTime: '2026-11-03T01:00:00.000Z', timeZone: 'Asia/Tokyo' };
  const policy = buildCancellationPolicy(24);
  const t = key => getTranslation(key, 'en');
  const deadline = Date.parse('2026-11-02T01:00:00.000Z');
  assert.equal(cancellationCutoff(trip, 24), deadline);
  const previousTimezone = process.env.TZ;
  try {
    for (const timezone of ['America/Los_Angeles', 'Asia/Shanghai', 'UTC']) {
      process.env.TZ = timezone;
      const headline = cancellationHeadline(policy, trip, 'en', t, deadline - 1);
      assert.match(headline, /Nov 2, 2026, 10:00/);
      assert.equal(cancellationHeadline(policy, trip, 'en', t, deadline + 1), t('rd_cancel_expired'));
    }
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
  const rows = cancellationRows(policy, trip, 'en', t);
  assert.match(rows[1].period, /Nov 2, 2026, 10:00/);
  assert.match(rows[1].period, /Nov 3, 2026, 08:00/);
  assert.match(rows[1].refund, /50%.*prepaid/);
});
test('non-refundable rates have one policy interval and never promise free cancellation', () => {
  const policy = buildCancellationPolicy(0);
  const t = key => getTranslation(key, 'zh');
  assert.equal(policy.steps.length, 1);
  assert.equal(cancellationHeadline(policy, undefined, 'zh', t), t('rd_non_refundable'));
  const rows = cancellationRows(policy, undefined, 'zh', t);
  assert.equal(rows.length, 1);
  assert.match(rows[0].refund, /0%/);
  assert.equal(rows[0].period, '');
});
test('cancellation details have localized dates and refunds in every supported language', () => {
  const trip = { pickupDateTime: '2026-11-03T01:00:00.000Z', timeZone: 'Asia/Tokyo' };
  for (const lang of ['en', 'zh', 'ja', 'es', 'ko']) {
    const t = key => getTranslation(key, lang);
    const rows = cancellationRows(buildCancellationPolicy(72), trip, lang, t);
    for (const row of rows) {
      assert.doesNotMatch(row.title + row.period + row.refund, /rd_|ct_|\{\w+\}/);
    }
  }
});

test('location search never returns LAX offers for another destination', () => {
  const offers = getAvailableStoreOffers({ ...form(), pickup: { label: 'Tokyo', storeCode: 'KLDJ01' } });
  assert.equal(offers.length, 4);
  assert.ok(offers.every(offer => offer.storeCode === 'KLDJ01' && offer.timeZone === 'Asia/Tokyo'));
});
test('every eligible destination depot has bookable vehicle groups and combined policy filters', () => {
  for (const store of storeDirectory.filter(isStoreEligible)) {
    const offers = getAvailableStoreOffers({ ...form(), pickup: { label: store.localizedNames.EN, storeCode: store.storeCode } });
    assert.equal(aggregateVehicleGroups(FLEET_VEHICLES, offers, 3).length, 4, store.storeCode);
    assert.ok(offers.every(offer => offer.storeCode === store.storeCode && offer.distanceKm === 0));
    assert.ok(aggregateVehicleGroups(FLEET_VEHICLES, offers, 3, { freeCancellation: true, depositFree: true }).length > 0);
  }
  assert.equal(new Set(FLEET_STORE_OFFERS.map(offer => offer.offerId)).size, FLEET_STORE_OFFERS.length);
});
test('POI results match the destination picker service radius and actual distances', () => {
  for (const poi of poiCatalog.filter(poi => poi.status === 'active')) {
    const expected = findStoresWithinRadius(poi.point, 60, poi.marketCode);
    const offers = getAvailableStoreOffers({ ...form(), pickup: { label: poi.localizedNames.EN, poiId: poi.poiId } });
    assert.deepEqual([...new Set(offers.map(offer => offer.storeCode))].sort(), expected.map(store => store.storeCode).sort(), poi.poiId);
    for (const offer of offers) assert.equal(offer.distanceKm, expected.find(store => store.storeCode === offer.storeCode).distanceKm);
  }
});
test('unknown or disabled destinations never inherit unrelated inventory', () => {
  for (const pickup of [ { label: 'Unknown', storeCode: 'missing' }, { label: 'Unknown', poiId: 'missing', storeCode: 'KLDJ01' } ]) {
    assert.equal(getAvailableStoreOffers({ ...form(), pickup }).length, 0);
  }
  const store = storeDirectory.find(isStoreEligible), enabled = store.enabled;
  try {
    store.enabled = false;
    assert.equal(getAvailableStoreOffers({ ...form(), pickup: { label: store.localizedNames.EN, storeCode: store.storeCode } }).length, 0);
  } finally { store.enabled = enabled; }
});
test('every destination depot preserves its identity and local time through reserve, pay and cancel', () => {
  const zones = { JP: 'Asia/Tokyo', TW: 'Asia/Taipei', TH: 'Asia/Bangkok', MY: 'Asia/Kuala_Lumpur' };
  for (const store of storeDirectory.filter(isStoreEligible)) {
    const search = { ...form(), pickup: { label: store.localizedNames.ZH, storeCode: store.storeCode } };
    const rate = rental.createRateDetails(search, `toyota-rav4-suv@${store.storeCode}`, 'zh');
    assert.equal(rate.trip.timeZone, zones[store.marketCode]);
    assert.equal(rate.trip.pickupLocation, store.localizedNames.ZH);
    assert.equal(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: rate.trip.timeZone })
      .format(new Date(rate.trip.pickupDateTime)), '10:00');
    const info = buildDepotStoreInfo(rate.vehicle.supplier.name, rate.trip.pickupLocation, rate.vehicle.supplier.locationType, rate.trip.pickupStoreCode);
    assert.equal(info.address, store.address ?? '');
    assert.equal(info.lat, store.point.latitude);
    assert.equal(info.phone, store.phone ?? '');
    const actor = access(), request = input(rate);
    request.equipment.childSeat = 1;
    const booking = rental.createReservation(request, actor);
    assert.equal(booking.trip.pickupStoreCode, store.storeCode);
    assert.equal(booking.trip.returnStoreCode, store.storeCode);
    assert.equal(booking.pricing.currency, '$'); // Existing USD channel; no fake FX conversion.
    assert.equal(booking.pricing.dailyRate, rate.vehicle.pricePerDay);
    assert.equal(booking.pricing.equipmentSubtotal, calculateEquipmentCost(request.equipment, rate.trip.rentalDays));
    const paid = rental.payBooking(booking.confirmationCode, key(), actor);
    const estimate = rental.previewCancellation(booking.confirmationCode, actor);
    assert.equal(estimate.refundAmount, paid.paidAmount);
    const cancelled = rental.cancelReservation(booking.confirmationCode, {
      reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key(),
    }, actor);
    assert.equal(cancelled.status, 'CANCELLED');
    assert.equal(cancelled.cancellation.refundAmount, paid.paidAmount);
  }
});
test('unsupported cross-market returns stay unavailable and cannot create rate details', () => {
  const search = { ...form(), pickup: { label: 'Tokyo', storeCode: 'KLDJ01' },
    differentReturn: true, dropoff: { label: 'Taipei', storeCode: 'TPE01' } };
  assert.equal(getAvailableStoreOffers(search).length, 0);
  rejects(() => rental.createRateDetails(search, 'toyota-rav4-suv@KLDJ01', 'en'), 'rate_unavailable');
});
test('unknown depot details never display the Los Angeles fixture address', () => {
  const info = buildDepotStoreInfo('Unknown', 'Unknown', undefined, 'missing');
  assert.equal(info.address, '');
  assert.equal(info.lat, undefined);
});
test('same label with different store IDs retains one-way intent', () => {
  assert.equal(parseSearchForm({ pickup: 'Airport', return: 'Airport', pickupStoreCode: 'A', returnStoreCode: 'B' }, form()).differentReturn, true);
});
test('unsupported one-way depot pair returns no offers', () => {
  assert.equal(getAvailableStoreOffers({ ...form(), differentReturn: true, dropoff: { label: 'Other', storeCode: 'US-LAX-02' }, pickup: { label: 'LAX', storeCode: 'US-LAX-01' } }).length, 0);
});
test('rental duration includes time and supports same-day rentals', () => {
  assert.equal(getRentalDays('2030-01-01', '2030-01-02', '10:00', '11:00'), 2);
  assert.equal(getRentalDays('2030-01-01', '2030-01-01', '10:00', '18:00'), 1);
});
test('invalid dates, times and reversed periods are rejected', () => {
  rejects(() => validateSearch({ ...form(), pickupDate: '2030-02-31' }), 'invalid_search');
  rejects(() => validateSearch({ ...form(), pickupTime: '99:99' }), 'invalid_search');
  rejects(() => validateSearch({ ...form(), returnDate: '2000-01-01' }), 'invalid_search');
});
test('selected depot price, deposit, licence and timezone survive reservation creation', () => {
  const booking = rental.createReservation(input(details('toyota-rav4-suv@US-LAX-02')), access());
  assert.equal(booking.pricing.dailyRate, 51);
  assert.equal(booking.pricing.securityDeposit, 0);
  assert.equal(booking.trip.pickupStoreCode, 'US-LAX-02');
  assert.equal(booking.driver.licenseCountry, 'US');
  assert.equal(booking.trip.timeZone, 'America/Los_Angeles');
  assert.equal(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: booking.trip.timeZone })
    .format(new Date(booking.trip.pickupDateTime)), '10');
});
test('unknown rate and unknown reservation never fabricate a record', () => {
  rejects(() => rental.getRateDetails('missing'), 'rate_expired');
  rejects(() => rental.readBooking('TG-NOT-REAL', access()), 'booking_not_found');
});
test('negative days, excessive equipment, empty surname and mismatched licence are rejected', () => {
  rejects(() => calculateEquipmentCost({ ...getDefaultEquipmentSelection(), childSeat: 1 }, -5), 'invalid_search');
  rejects(() => calculateEquipmentCost({ ...getDefaultEquipmentSelection(), childSeat: 999 }, 3), 'invalid_equipment');
  rejects(() => validateDriver({ ...driver, lastName: '  ' }), 'invalid_driver');
  const request = input(details());
  rejects(() => rental.createReservation({ ...request, driver: { ...driver, licenseCountry: 'Japan' } }, access()), 'driver_changed');
});
test('licence changes return to the same rate details product with fresh search and no personal fields', () => {
  const search = { ...form(), licenseCountry: 'CN', driverAge: 21,
    pickup: { label: '羽田機場', poiId: undefined, storeCode: 'KLHND01' } };
  // Use the exact depot selection, with a pickup time that differs from defaults.
  search.pickupTime = '11:30';
  search.returnTime = '12:00';
  const original = rental.createRateDetails(search, 'toyota-rav4-suv@KLHND01', 'zh');
  const actor = access(), equipment = { ...getDefaultEquipmentSelection(), childSeat: 2, gpsNavigation: true };
  rejects(() => rental.createReservation({ ...input(original), equipment }, actor), 'driver_changed');
  assert.equal(rental.listBookings(actor).length, 0);
  for (const lang of ['en', 'zh', 'ja', 'es', 'ko']) {
    const href = buildRateReturnHref({ lang, vehicleId: original.vehicle.id, offerId: original.trip.offerId,
      search: original.search, licenseCountry: driver.licenseCountry, insuranceId: 'inclusive', equipment });
    const url = new URL(href, 'http://rental.test');
    assert.equal(url.pathname, `/${lang}/rent/toyota-rav4-suv`);
    assert.equal(url.searchParams.get('offer'), original.trip.offerId);
    assert.equal(url.searchParams.get('licenseCountry'), 'US');
    assert.equal(url.searchParams.get('insurance'), 'inclusive');
    assert.deepEqual(JSON.parse(url.searchParams.get('equipment')), equipment);
    assert.deepEqual(parseSearchForm(Object.fromEntries(url.searchParams), form()), { ...search, licenseCountry: 'US' });
    assert.equal(url.searchParams.has('rateDetailsId'), false);
    assert.ok(!href.includes(driver.email) && !href.includes(driver.lastName) && !href.includes(driver.phone));
    const refreshed = rental.createRateDetails(parseSearchForm(Object.fromEntries(url.searchParams), form()), url.searchParams.get('offer'), lang);
    assert.notEqual(refreshed.trip.rateDetailsId, original.trip.rateDetailsId);
    assert.equal(refreshed.trip.licenseCountry, 'US');
    assert.equal(refreshed.trip.pickupStoreCode, original.trip.pickupStoreCode);
    assert.equal(refreshed.trip.pickupDateTime, original.trip.pickupDateTime);
    const booking = rental.createReservation({ ...input(refreshed), equipment, insuranceId: 'inclusive' }, access());
    assert.equal(booking.driver.licenseCountry, booking.trip.licenseCountry);
    assert.equal(booking.insurance.id, 'inclusive');
    assert.deepEqual(booking.equipment, equipment);
  }
});
test('malformed optional driver fields and phone numbers return validation errors', () => {
  for (const patch of [
    { flightNumber: 123 }, { additionalDriver: null }, { additionalDriver: [] },
    { additionalDriver: { enabled: 'false' } }, { phone: '-----' },
  ]) rejects(() => validateDriver({ ...driver, ...patch }), 'invalid_driver');
  assert.equal(validateDriver({ ...driver, flightNumber: '  AB123  ', additionalDriver: { enabled: false } }).flightNumber, 'AB123');
});
test('reservation submission is idempotent and changed payload cannot reuse its key', () => {
  const actor = access(), request = input(details());
  const booking = rental.createReservation(request, actor);
  assert.equal(rental.createReservation(request, actor).confirmationCode, booking.confirmationCode);
  assert.equal(rental.listBookings(actor).length, 1);
  rejects(() => rental.createReservation({ ...request, driver: { ...driver, firstName: 'Changed' } }, actor), 'submission_changed');
  rejects(() => rental.createReservation(input(details()), actor), 'booking_conflict');
});
test('global lookup URLs keep only safe booking targets and resume only the verified reservation', () => {
  const { bookingLookupModalPath, verifiedBookingReturnPath } = require('../src/modules/booking-management/domain/access-recovery.ts');
  for (const lang of ['en', 'zh', 'ja', 'es', 'ko']) {
    const path = `/${lang}/booking/TG-123`;
    assert.equal(bookingLookupModalPath(lang), `/${lang}?bookingLookup=1`);
    assert.equal(bookingLookupModalPath(lang, path), `/${lang}?bookingLookup=1&returnTo=${encodeURIComponent(path)}`);
    assert.equal(verifiedBookingReturnPath(path, lang, 'tg-123'), path);
    assert.equal(verifiedBookingReturnPath(path, lang, 'TG-456'), null);
    for (const unsafe of ['https://other.test', '//other.test', `/${lang}/account`, `/${lang}/booking/TG-123?lastName=private`, `/${lang}/booking/TG-123#other`, `/${lang}/booking/TG%2F123`]) {
      assert.equal(bookingLookupModalPath(lang, unsafe), `/${lang}?bookingLookup=1`);
      assert.equal(verifiedBookingReturnPath(unsafe, lang, 'TG-123'), null);
    }
  }
});
test('guest access requires the correct surname; account linkage uses verified identity', () => {
  const booking = rental.createReservation(input(details()), access());
  const stranger = access();
  rejects(() => rental.readBooking(booking.confirmationCode, stranger), 'booking_not_found');
  rejects(() => rental.lookupBooking(booking.confirmationCode, 'Wrong', stranger), 'booking_not_found');
  rejects(() => rental.previewCancellation(booking.confirmationCode, stranger), 'booking_not_found');
  rental.lookupBooking(booking.confirmationCode, ' traveler ', { ...stranger, accountId: 'account-test' });
  assert.equal(rental.readBooking(booking.confirmationCode, { sessionId: 'new-session', accountId: 'account-test' }).confirmationCode, booking.confirmationCode);
});
test('guest lists isolate session grants from account ownership and append verified bookings once', () => {
  const accountOwner = { ...access(), accountId: key() };
  const accountBooking = rental.createReservation(input(details()), accountOwner);
  const first = rental.createReservation(input(details()), access());
  const second = rental.createReservation(input(details()), access());
  const guest = { ...access(), accountId: accountOwner.accountId };
  assert.equal(rental.listBookings(guest).length, 1);
  assert.deepEqual(rental.listSessionBookings(guest), []);
  assert.deepEqual(rental.listSessionBookings({ sessionId: '', accountId: accountOwner.accountId }), []);
  rental.lookupBooking(first.confirmationCode, 'Traveler', { sessionId: guest.sessionId });
  rejects(() => rental.lookupBooking(second.confirmationCode, 'Wrong', guest), 'booking_not_found');
  assert.deepEqual(rental.listSessionBookings(guest).map(b => b.confirmationCode), [first.confirmationCode]);
  rental.lookupBooking(second.confirmationCode, 'Traveler', { sessionId: guest.sessionId });
  rental.lookupBooking(first.confirmationCode, 'Traveler', { sessionId: guest.sessionId });
  assert.equal(rental.listSessionBookings(guest).length, 2);
  assert.ok(!rental.listSessionBookings(guest).some(b => b.confirmationCode === accountBooking.confirmationCode));
  assert.deepEqual(rental.listSessionBookings({ ...access(), accountId: accountOwner.accountId }), []);
});
test('online payment excludes equipment and counter charges; repeated payment never charges twice', () => {
  const actor = access(), request = input(details());
  request.equipment.childSeat = 1;
  const booking = rental.createReservation(request, actor);
  const paid = rental.payBooking(booking.confirmationCode, key(), actor);
  assert.equal(paid.paidAmount, booking.pricing.payNow);
  assert.ok(paid.paidAmount < booking.pricing.totalCharge);
  assert.equal(rental.payBooking(booking.confirmationCode, key(), actor).paymentTransactionId, paid.paymentTransactionId);
});
test('unpaid cancellation releases the reservation without refunding money never collected', () => {
  const actor = access(), booking = rental.createReservation(input(details()), actor);
  const estimate = rental.previewCancellation(booking.confirmationCode, actor);
  assert.equal(estimate.paidAmount, 0);
  assert.equal(estimate.refundAmount, 0);
  const operation = { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() };
  const cancelled = rental.cancelReservation(booking.confirmationCode, operation, actor);
  assert.equal(cancelled.refundStatus, 'not_required');
  assert.deepEqual(rental.cancelReservation(booking.confirmationCode, operation, actor), cancelled);
  rejects(() => rental.payBooking(booking.confirmationCode, key(), actor), 'order_not_payable');
});
test('paid cancellation refunds only the actual online payment and tracks settlement separately', () => {
  const actor = access(), request = input(details()); request.equipment.childSeat = 1;
  const booking = rental.createReservation(request, actor);
  const paid = rental.payBooking(booking.confirmationCode, key(), actor);
  const estimate = rental.previewCancellation(booking.confirmationCode, actor);
  assert.equal(estimate.refundAmount, paid.paidAmount);
  const cancelled = rental.cancelReservation(booking.confirmationCode, { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() }, actor);
  assert.equal(cancelled.refundStatus, 'processing');
  assert.ok(cancelled.cancellation.refundAmount < cancelled.pricing.totalCharge);
  rejects(() => rental.previewCancellation(booking.confirmationCode, actor), 'order_not_cancellable');
});
test('non-refundable depot policy never returns a free-cancellation refund', () => {
  const actor = access(), booking = rental.createReservation(input(details('toyota-rav4-suv@US-LAX-02')), actor);
  rental.payBooking(booking.confirmationCode, key(), actor);
  assert.equal(rental.previewCancellation(booking.confirmationCode, actor).refundAmount, 0);
});
test('late cancellation boundaries use the depot instant and actual paid amount', () => {
  const actor = access(), booking = rental.createReservation(input(details()), actor);
  const paid = rental.payBooking(booking.confirmationCode, key(), actor);
  const pickup = Date.parse(paid.trip.pickupDateTime);
  assert.equal(estimateCancellation(paid, pickup - 48 * 3_600_000).penaltyAmount, 0);
  assert.equal(estimateCancellation(paid, pickup - 2 * 3_600_000).penaltyAmount, Math.round(paid.paidAmount * 50) / 100);
  assert.equal(estimateCancellation(paid, pickup - 3_600_000).refundAmount, 0);
  for (const status of ['ACTIVE_RENTAL', 'COMPLETED', 'CANCELLED']) rejects(() => estimateCancellation({ ...paid, status }), 'order_not_cancellable');
  for (const paymentStatus of ['processing', 'unknown']) rejects(() => estimateCancellation({ ...paid, paymentStatus }), 'order_not_cancellable');
});
test('cancellation must confirm the latest fee and cannot race a successful payment', () => {
  const actor = access(), booking = rental.createReservation(input(details()), actor);
  const estimate = rental.previewCancellation(booking.confirmationCode, actor);
  rental.payBooking(booking.confirmationCode, key(), actor);
  rejects(() => rental.cancelReservation(booking.confirmationCode, { reason: 'bm_reason_plans', version: estimate.version, idempotencyKey: key() }, actor), 'cancellation_changed');
});
test('rate expiry and hold expiry cannot be extended by refreshing the page', () => {
  const actor = access(), rate = details(), booking = rental.createReservation(input(rate), actor);
  const originalNow = Date.now;
  try {
    Date.now = () => originalNow() + 16 * 60_000;
    rejects(() => rental.getRateDetails(rate.trip.rateDetailsId), 'rate_expired');
    assert.equal(rental.readBooking(booking.confirmationCode, actor).closureReason, 'payment_timeout');
    rejects(() => rental.payBooking(booking.confirmationCode, key(), actor), 'order_not_payable');
  } finally { Date.now = originalNow; }
});
test('production cannot silently use the internal payment or rental adapter', () => {
  const previous = process.env.NODE_ENV, mode = process.env.TRUSTGO_RENTAL_MODE;
  try {
    process.env.NODE_ENV = 'production'; delete process.env.TRUSTGO_RENTAL_MODE;
    rejects(() => rental.listBookings(access()), 'service_unavailable');
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
    if (mode === undefined) delete process.env.TRUSTGO_RENTAL_MODE; else process.env.TRUSTGO_RENTAL_MODE = mode;
  }
});

test('card validation rejects bad check digits, expired cards and invalid months', () => {
  const { isValidPaymentCard } = require('../src/modules/checkout/domain/payment-validation.ts');
  const card = { cardNumber: '4242 4242 4242 4242', cardholderName: 'Test Traveler', expiryDate: '12/39', cvc: '123' };
  assert.equal(isValidPaymentCard(card, new Date('2030-01-01')), true);
  assert.equal(isValidPaymentCard({ ...card, cardNumber: '4242 4242 4242 4241' }), false);
  assert.equal(isValidPaymentCard({ ...card, expiryDate: '13/39' }), false);
  assert.equal(isValidPaymentCard({ ...card, expiryDate: '01/20' }), false);
});

// Exercise the actual Route Handler with a request-local cookie facade. These
// are Request objects only: no network requests or browser automation occur.
async function checkApi() {
  const jar = new Map();
  let currentAccount = null;
  const load = Module._load;
  Module._load = function (name, parent, ...rest) {
    if (name === 'next/headers') return { cookies: async () => ({ get: key => jar.has(key) ? { value: jar.get(key) } : undefined }) };
    if (parent?.filename.endsWith('/server/rental-access.ts') && name === './customerAccountAuth') {
      return { getAuthenticatedAccount: async () => currentAccount };
    }
    return load.call(this, name, parent, ...rest);
  };
  const route = require('../src/app/api/rental/[...action]/route.ts');
  const managePage = require('../src/app/[lang]/manage-booking/page.tsx').default;
  const { readPageBooking } = require('../src/modules/booking-management/application/read-page-booking.ts');
  const lookupPage = require('../src/app/[lang]/manage-booking/lookup/page.tsx').default;
  async function expectEntry(target, returnTo) {
    await assert.rejects(() => managePage({ params: Promise.resolve({ lang: 'zh' }), searchParams: Promise.resolve({ returnTo }) }),
      error => error.digest?.split(';')[2] === target);
  }
  async function request(method, action, body, origin = 'http://rental.test') {
    const headers = { 'Content-Type': 'application/json' };
    if (origin) headers.Origin = origin;
    const response = await route[method](new Request(`http://rental.test/api/rental/${action.join('/')}`, {
      method, headers, body: method === 'POST' ? JSON.stringify(body) : undefined,
    }), { params: Promise.resolve({ action }) });
    for (const cookie of response.cookies.getAll()) jar.set(cookie.name, cookie.value);
    return { response, data: await response.json() };
  }
  try {
    const emptyGuest = await request('GET', ['guest-bookings']);
    assert.deepEqual(emptyGuest.data, { status: 'missing', orders: [] });
    assert.equal(emptyGuest.response.headers.get('set-cookie'), null);
    await expectEntry('/zh?bookingLookup=1');
    for (const returnTo of ['https://other.test/booking/TG-123', '//other.test', '/en/booking/TG-123', '/zh/account', '/zh/booking/TG-123?lastName=private']) {
      await expectEntry('/zh?bookingLookup=1', returnTo);
    }
    await assert.rejects(() => lookupPage({ params: Promise.resolve({ lang: 'zh' }), searchParams: Promise.resolve({ returnTo: '/zh/checkout/TG-123' }) }),
      error => error.digest?.split(';')[2] === '/zh?bookingLookup=1&returnTo=%2Fzh%2Fcheckout%2FTG-123');
    passed++; console.log('✓ reading a fresh guest list cannot create or restore authorization');
    const anonymous = await request('GET', ['pending-checkouts']);
    assert.equal(anonymous.response.status, 200);
    assert.equal(anonymous.response.headers.get('set-cookie'), null);
    assert.equal(anonymous.response.headers.get('cache-control'), 'private, no-store');
    assert.deepEqual(anonymous.data, []);
    passed++; console.log('✓ anonymous global reminder reads create no access cookie or reservation');

    const initial = await request('GET', ['bookings']);
    assert.equal(initial.response.status, 200);
    assert.equal(initial.response.headers.get('cache-control'), 'private, no-store');
    assert.match(initial.response.headers.get('set-cookie'), /HttpOnly/);
    assert.match(initial.response.headers.get('set-cookie'), /SameSite=lax/i);
    assert.doesNotMatch(initial.response.headers.get('set-cookie'), /Max-Age|Expires=/i);
    passed++; console.log('✓ API issues private HttpOnly access and disables caching');

    const csrf = await request('POST', ['reservations'], {}, 'https://other.test');
    assert.equal(csrf.response.status, 403);
    const invalid = await request('POST', ['lookup'], { confirmationCode: 123 });
    assert.equal(invalid.response.status, 400);
    passed++; console.log('✓ API blocks cross-origin mutation and malformed lookup');

    const malformedDriver = await request('POST', ['reservations'], {
      ...input(details()), driver: { ...driver, flightNumber: 123 },
    });
    assert.equal(malformedDriver.response.status, 400);
    assert.equal(malformedDriver.data.code, 'invalid_driver');
    passed++; console.log('✓ API reports malformed driver data as a validation error');

    const created = await request('POST', ['reservations'], { ...input(details()), amount: 0 });
    assert.equal(created.response.status, 200);
    assert.ok(created.data.pricing.payNow > 0);
    const code = created.data.confirmationCode;
    const summary = await request('GET', ['pending-checkouts']);
    assert.deepEqual(summary.data.map(order => order.confirmationCode), [code]);
    assert.deepEqual(Object.keys(summary.data[0]).sort(), ['confirmationCode', 'paymentDeadline', 'vehicleName']);
    assert.equal(summary.response.headers.get('cache-control'), 'private, no-store');
    jar.clear();
    assert.deepEqual((await request('GET', ['pending-checkouts'])).data, []);
    passed++; console.log('✓ global reminder API returns only authorized minimal checkout summaries');
    assert.equal((await request('GET', ['bookings', code])).response.status, 404);
    assert.equal((await request('POST', ['lookup'], { confirmationCode: code, lastName: 'Wrong' })).response.status, 404);
    assert.equal((await request('POST', ['lookup'], { confirmationCode: code, lastName: 'Traveler' })).response.status, 200);
    assert.equal((await request('GET', ['bookings', code])).response.status, 200);
    passed++; console.log('✓ API ignores client prices and verifies a new guest session before disclosure');

    const estimate = await request('POST', ['bookings', code, 'cancellation-estimate'], {});
    assert.equal(estimate.data.refundAmount, 0);
    const cancelled = await request('POST', ['bookings', code, 'cancel'], {
      reason: 'bm_reason_plans', version: estimate.data.version, idempotencyKey: key(),
    });
    assert.equal(cancelled.data.status, 'CANCELLED');
    assert.deepEqual((await request('GET', ['pending-checkouts'])).data, []);
    assert.equal((await request('POST', ['bookings', code, 'payment'], { idempotencyKey: key() })).response.status, 409);
    passed++; console.log('✓ API cancellation and subsequent payment enforce the same server state');

    await request('POST', ['revoke'], {});
    assert.equal((await request('GET', ['bookings', code])).response.status, 404);
    passed++; console.log('✓ revoking guest access removes order access');

    jar.clear();
    const accountId = key();
    currentAccount = { account_id: accountId };
    // A signed-in account with no orders must reach the empty list, even with
    // no rental cookie and regardless of email verification state.
    await expectEntry('/zh/manage-booking/orders');
    const emptyAccountList = await request('GET', ['bookings']);
    assert.equal(emptyAccountList.response.status, 200);
    assert.equal(emptyAccountList.response.headers.get('cache-control'), 'private, no-store');
    assert.deepEqual(emptyAccountList.data, { status: 'active', orders: [] });
    passed++; console.log('✓ signed-in accounts without orders reach an active empty list without guest verification');
    const accountOrder = rental.createReservation(input(details()), { ...access(), accountId });
    const guestOrder = rental.createReservation(input(details()), access());
    const anotherOrder = rental.createReservation(input(details()), access());
    const accountList = await request('GET', ['bookings']);
    assert.deepEqual(accountList.data.orders.map(b => b.confirmationCode), [accountOrder.confirmationCode]);
    await expectEntry(`/zh/booking/${accountOrder.confirmationCode}`, `/zh/booking/${accountOrder.confirmationCode}`);
    await expectEntry(`/zh/checkout/${accountOrder.confirmationCode}`, `/zh/checkout/${accountOrder.confirmationCode}`);
    currentAccount = { account_id: key() };
    assert.deepEqual((await request('GET', ['bookings'])).data, { status: 'active', orders: [] });
    assert.equal((await request('GET', ['bookings', accountOrder.confirmationCode])).response.status, 404);
    currentAccount = null;
    assert.deepEqual((await request('GET', ['bookings'])).data, { status: 'missing', orders: [] });
    await expectEntry('/zh?bookingLookup=1');
    currentAccount = { account_id: accountId };
    passed++; console.log('✓ account lists survive rental-cookie loss, enforce ownership and become guest-only after sign-out');
    assert.deepEqual((await request('GET', ['guest-bookings'])).data, { status: 'missing', orders: [] });
    assert.equal((await request('POST', ['guest-lookup'], { confirmationCode: guestOrder.confirmationCode, lastName: 'Wrong' })).response.status, 404);
    assert.deepEqual((await request('GET', ['guest-bookings'])).data.orders, []);
    assert.equal((await request('POST', ['guest-lookup'], { confirmationCode: guestOrder.confirmationCode, lastName: 'Traveler' })).response.status, 200);
    const firstGuestList = await request('GET', ['guest-bookings']);
    assert.deepEqual(firstGuestList.data.orders.map(b => b.confirmationCode), [guestOrder.confirmationCode]);
    assert.equal(firstGuestList.response.headers.get('cache-control'), 'private, no-store');
    await expectEntry('/zh/manage-booking/orders');
    await expectEntry(`/zh/booking/${guestOrder.confirmationCode}`, `/zh/booking/${guestOrder.confirmationCode}`);
    // Repeated lookup is idempotent, and authorizing another booking preserves the first.
    await request('POST', ['guest-lookup'], { confirmationCode: anotherOrder.confirmationCode, lastName: 'Traveler' });
    await request('POST', ['guest-lookup'], { confirmationCode: guestOrder.confirmationCode, lastName: 'Traveler' });
    assert.equal((await request('GET', ['guest-bookings'])).data.orders.length, 2);
    assert.deepEqual(new Set((await request('GET', ['bookings'])).data.orders.map(b => b.confirmationCode)),
      new Set([accountOrder.confirmationCode, guestOrder.confirmationCode, anotherOrder.confirmationCode]));
    rejects(() => rental.readBooking(guestOrder.confirmationCode, { ...access(), accountId }), 'booking_not_found');
    passed++; console.log('✓ guest API appends unique session grants without exposing or linking account orders');

    const revokedToken = jar.get('tg_rental_access');
    await request('POST', ['revoke'], {});
    jar.set('tg_rental_access', revokedToken);
    assert.deepEqual((await request('GET', ['guest-bookings'])).data, { status: 'missing', orders: [] });
    await expectEntry('/zh/manage-booking/orders');
    assert.deepEqual((await request('GET', ['bookings'])).data.orders.map(b => b.confirmationCode), [accountOrder.confirmationCode]);
    const detailPath = `/zh/booking/${guestOrder.confirmationCode}`;
    await assert.rejects(() => readPageBooking(guestOrder.confirmationCode, 'zh', detailPath),
      error => error.digest?.split(';')[2] === `/zh?bookingLookup=1&returnTo=${encodeURIComponent(detailPath)}`);
    assert.equal((await request('GET', ['bookings', guestOrder.confirmationCode])).response.status, 404);
    assert.equal((await request('GET', ['bookings', accountOrder.confirmationCode])).response.status, 200);
    jar.clear();
    assert.deepEqual((await request('GET', ['guest-bookings'])).data.orders, []);
    assert.equal((await request('GET', ['bookings', guestOrder.confirmationCode])).response.status, 404);
    assert.equal((await request('POST', ['guest-lookup'], { confirmationCode: guestOrder.confirmationCode, lastName: 'Traveler' })).response.status, 200);
    assert.equal((await request('GET', ['guest-bookings'])).data.orders.length, 1);
    const originalNow = Date.now;
    try {
      Date.now = () => originalNow() + 24 * 60 * 60_000 + 1000;
      assert.deepEqual((await request('GET', ['guest-bookings'])).data, { status: 'missing', orders: [] });
    } finally { Date.now = originalNow; }
    passed++; console.log('✓ revoked, removed and expired guest cookies lose grants even while the account stays signed in');
  } finally { Module._load = load; }
}
checkApi().then(() => console.log(`\n${passed} rental business scenarios passed.`))
  .catch(error => { console.error(error); process.exitCode = 1; });
