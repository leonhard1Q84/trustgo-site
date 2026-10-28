import { randomUUID, createHash } from 'node:crypto';
import { getVehicleById } from '@/modules/rental-search/domain/fleet-data';
import { applyOfferToVehicle, getStoreOffer } from '@/modules/rental-search/domain/store-offers';
import { getAvailableStoreOffers, validateSearch } from '@/modules/rental-search/domain/availability';
import { depotDateTime } from '@/modules/rental-search/domain/depot-time';
import { getRentalDays, type SearchFormState } from '@/modules/rental-search/domain/search-form';
import { calculateRatePricing, STANDARD_INSURANCE_PACKAGES } from '@/modules/rate-details/application/rate-service';
import { calculateEquipmentCost, type SpecialEquipmentSelection } from '@/modules/rate-details/domain/equipment';
import type { InsurancePackageId, RentalTripDetails } from '@/modules/rate-details/domain/types';
import type { DriverDetails } from '@/modules/reservation/domain/types';
import type { BookingRecord } from '@/modules/booking-management/domain/types';
import { canPayBooking, estimateCancellation } from '@/modules/booking-management/domain/lifecycle';
import { RentalError, normalizeLicenseCountry, validateDriver, validateEquipment } from '@/modules/reservation/domain/validation';
import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';
import type {AccountCreationConsent, CheckoutAccountSelection} from '@/modules/customer-account/domain/account.types';
import {checkoutAccountConsent} from '@/modules/customer-account/domain/checkout-account';
import { readLocalPaymentScenario } from '@/modules/checkout/domain/local-payment-scenario';
import { confirmLocalPayment, localPaymentResult } from './local-payment';
import { throwLocalBookingFault } from './local-booking-faults';

export interface RentalAccess { sessionId: string; accountId?: string }
export interface CreateReservationInput {
  rateDetailsId: string;
  insuranceId: InsurancePackageId;
  equipment: SpecialEquipmentSelection;
  driver: DriverDetails;
  idempotencyKey: string;
  accountCreation?: CheckoutAccountSelection;
}
type RateDetails = { vehicle: NonNullable<ReturnType<typeof getVehicleById>>; trip: RentalTripDetails; search: SearchFormState };
type StoredBooking = { booking: BookingRecord; owner: RentalAccess; authorized: Set<string>; expires: number;
  accountConsent?: AccountCreationConsent; localPaymentSettlesAt?: number };
interface RentalState {
  rates: Map<string, { details: RateDetails; expires: number }>;
  bookings: Map<string, StoredBooking>;
  operations: Map<string, { fingerprint: string; bookingId: string; expires: number; errorCode?: string; errorStatus?: number }>;
}
const globalState = globalThis as typeof globalThis & { __trustgoRentalState?: RentalState };
const state = globalState.__trustgoRentalState ??= { rates: new Map(), bookings: new Map(), operations: new Map() };
const RATE_TTL = 3 * 60_000;
const HOLD_TTL = 15 * 60_000;
const RETENTION = 7 * 86_400_000;

export function assertLocalRentalEnabled() {
  if (process.env.NODE_ENV === 'production' && process.env.TRUSTGO_RENTAL_MODE !== 'local') {
    throw new RentalError('service_unavailable', 503);
  }
}

function prune(now = Date.now()) {
  for (const [key, value] of state.rates) if (value.expires + 86_400_000 <= now) state.rates.delete(key);
  for (const [key, value] of state.bookings) if (value.expires <= now) state.bookings.delete(key);
  for (const [key, value] of state.operations) if (value.expires <= now) state.operations.delete(key);
}

export function createRateDetails(form: SearchFormState, offerId: string, lang: RouteLanguage): RateDetails {
  assertLocalRentalEnabled();
  prune();
  validateSearch(form);
  form = { ...form, licenseCountry: normalizeLicenseCountry(form.licenseCountry) };
  const offer = getAvailableStoreOffers(form).find(o => o.offerId === offerId);
  const base = offer && getVehicleById(offer.vehicleId);
  if (!offer || !base) throw new RentalError('rate_unavailable', 404);
  // Use the selected depot's IANA zone; FE owns real rental-day billing.
  const pickup = depotDateTime(form.pickupDate, form.pickupTime, offer.timeZone);
  const dropoff = depotDateTime(form.returnDate, form.returnTime, offer.timeZone);
  if (Date.parse(pickup) <= Date.now() || Date.parse(dropoff) <= Date.parse(pickup)) {
    throw new RentalError('invalid_search', 400);
  }
  const expires = Date.now() + RATE_TTL;
  const rateDetailsId = randomUUID();
  const trip: RentalTripDetails = {
    pickupLocation: offer.storeNames[routeToLanguage(lang)], returnLocation: offer.storeNames[routeToLanguage(lang)],
    pickupDateTime: pickup, returnDateTime: dropoff,
    rentalDays: getRentalDays(form.pickupDate, form.returnDate, form.pickupTime, form.returnTime),
    driverAge: form.driverAge, licenseCountry: form.licenseCountry,
    pickupStoreCode: offer.storeCode, returnStoreCode: offer.storeCode,
    timeZone: offer.timeZone, offerId, rateDetailsId, rateExpiresAt: new Date(expires).toISOString(),
  };
  const details = { vehicle: applyOfferToVehicle(base, offer, routeToLanguage(lang)), trip, search: form };
  state.rates.set(rateDetailsId, { details: structuredClone(details), expires });
  return structuredClone(details);
}

export function getRateDetails(id: string): RateDetails {
  assertLocalRentalEnabled();
  prune();
  const rate = state.rates.get(id);
  if (!rate || rate.expires <= Date.now()) throw new RentalError('rate_expired', 410);
  return structuredClone(rate.details);
}

/** Expired public snapshots are display-only: the existing expiry dialog can requery them. */
export function getRateDetailsForDisplay(id: string, lang?: RouteLanguage): RateDetails {
  assertLocalRentalEnabled();
  prune();
  const rate = state.rates.get(id);
  if (!rate) throw new RentalError('rate_expired', 410);
  const details = structuredClone(rate.details);
  const offer = lang && getStoreOffer(details.trip.offerId);
  if (offer && lang) {
    const name = offer.storeNames[routeToLanguage(lang)];
    details.vehicle.supplier.name = name;
    details.trip.pickupLocation = name;
    if (details.trip.returnStoreCode === offer.storeCode) details.trip.returnLocation = name;
  }
  return details;
}

function authorized(record: StoredBooking, access: RentalAccess) {
  return record.owner.sessionId === access.sessionId || record.authorized.has(access.sessionId)
    || Boolean(access.accountId && record.owner.accountId === access.accountId);
}

function reconcile(record: StoredBooking, now = Date.now()): BookingRecord {
  const booking = record.booking;
  if (record.localPaymentSettlesAt !== undefined && record.localPaymentSettlesAt <= now
    && booking.status === 'PENDING_PAYMENT' && ['processing', 'unknown'].includes(booking.paymentStatus ?? '')) {
    confirmLocalPayment(booking);
    delete record.localPaymentSettlesAt;
  }
  if (booking.status === 'PENDING_PAYMENT' && Date.parse(booking.paymentDeadline ?? '') <= now
    && !['paid', 'processing', 'unknown'].includes(booking.paymentStatus ?? 'unpaid')) {
    booking.status = 'CANCELLED';
    booking.closureReason = 'payment_timeout';
    booking.refundStatus = 'not_required';
  }
  // Only the local adapter simulates refunds. Production must reconcile the
  // payment provider callback instead of inferring settlement from elapsed time.
  if (booking.refundStatus === 'processing' && booking.cancellation
    && Date.parse(booking.cancellation.cancelledAt) + 5_000 <= now) booking.refundStatus = 'refunded';
  return booking;
}

function findAuthorized(id: string, access: RentalAccess): StoredBooking {
  assertLocalRentalEnabled();
  throwLocalBookingFault(id);
  prune();
  const record = state.bookings.get(id.trim().toUpperCase());
  if (!record || !authorized(record, access)) throw new RentalError('booking_not_found', 404);
  reconcile(record);
  return record;
}

export function readBooking(id: string, access: RentalAccess): BookingRecord {
  return structuredClone(findAuthorized(id, access).booking);
}

export function listBookings(access: RentalAccess): BookingRecord[] {
  assertLocalRentalEnabled();
  prune();
  return [...state.bookings.values()].filter(r => authorized(r, access))
    .map(r => structuredClone(reconcile(r))).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Guest lookup lists only grants held by this session, never account-wide access. */
export function listSessionBookings(access: RentalAccess): BookingRecord[] {
  if (!access.sessionId) return [];
  return listBookings({ sessionId: access.sessionId });
}

export function lookupBooking(id: string, surname: string, access: RentalAccess): BookingRecord {
  assertLocalRentalEnabled();
  if (surname.trim()) throwLocalBookingFault(id);
  prune();
  const record = state.bookings.get(id.trim().toUpperCase());
  if (!record || !surname.trim() || record.booking.driver.lastName.normalize('NFKC').toLocaleLowerCase()
    !== surname.trim().normalize('NFKC').toLocaleLowerCase()) throw new RentalError('booking_not_found', 404);
  record.authorized.add(access.sessionId);
  // Linking to an account requires the same surname verification as guest access.
  if (access.accountId && !record.owner.accountId) record.owner.accountId = access.accountId;
  return structuredClone(reconcile(record));
}

function operationKey(action: string, access: RentalAccess, key: string) {
  if (typeof key !== 'string' || !/^[\w-]{16,100}$/.test(key)) throw new RentalError('invalid_request', 400);
  return `${access.accountId ?? access.sessionId}:${action}:${key}`;
}
function fingerprint(value: unknown) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }

export function createReservation(input: CreateReservationInput, access: RentalAccess): BookingRecord {
  assertLocalRentalEnabled();
  prune();
  const driver = validateDriver(input.driver);
  let accountConsent: AccountCreationConsent | undefined;
  try { accountConsent = access.accountId ? undefined : checkoutAccountConsent(input.accountCreation); }
  catch { throw new RentalError('invalid_request', 400); }
  const equipment = validateEquipment(input.equipment);
  const insurance = STANDARD_INSURANCE_PACKAGES.find(p => p.id === input.insuranceId);
  if (!insurance) throw new RentalError('invalid_request', 400);
  const key = operationKey('reserve', access, input.idempotencyKey);
  const hash = fingerprint({ ...input, driver, equipment });
  const previous = state.operations.get(key);
  if (previous) {
    if (previous.fingerprint !== hash) throw new RentalError('submission_changed');
    return readBooking(previous.bookingId, access);
  }
  const { vehicle, trip, search } = getRateDetails(input.rateDetailsId);
  // Recheck time and sellability at Reserve, even while the quote TTL is valid.
  if (Date.parse(trip.pickupDateTime) <= Date.now()) throw new RentalError('rate_unavailable', 409);
  if (!getAvailableStoreOffers(search).some(offer => offer.offerId === trip.offerId)) {
    throw new RentalError('rate_unavailable', 409);
  }
  if (driver.licenseCountry !== trip.licenseCountry) throw new RentalError('driver_changed');
  for (const booking of listBookings(access)) {
    if (['CONFIRMED', 'PENDING_PAYMENT', 'ACTIVE_RENTAL'].includes(booking.status)
      && Date.parse(booking.trip.pickupDateTime) < Date.parse(trip.returnDateTime)
      && Date.parse(booking.trip.returnDateTime) > Date.parse(trip.pickupDateTime)) {
      throw new RentalError('booking_conflict');
    }
  }
  const pricing = calculateRatePricing(vehicle, trip, input.insuranceId, calculateEquipmentCost(equipment, trip.rentalDays));
  const confirmationCode = `TG-${new Date().getUTCFullYear()}-${randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()}`;
  const booking: BookingRecord = { confirmationCode, status: 'PENDING_PAYMENT', vehicle, trip, driver,
    insurance, equipment, pricing, paymentTransactionId: '', paymentStatus: 'unpaid', paidAmount: 0,
    createdAt: new Date().toISOString(), paymentDeadline: new Date(Math.min(Date.now() + HOLD_TTL, Date.parse(trip.pickupDateTime))).toISOString(),
    accountCreationStatus: accountConsent ? 'pending' : 'not_requested' };
  const expires = Date.now() + RETENTION;
  state.bookings.set(confirmationCode, { booking, owner: { ...access }, authorized: new Set(), expires, accountConsent });
  state.operations.set(key, { fingerprint: hash, bookingId: confirmationCode, expires });
  return structuredClone(booking);
}

export function checkoutAccountContext(id: string, access: RentalAccess) {
  const record = findAuthorized(id, access);
  if (!record.accountConsent || record.booking.paymentStatus !== 'paid'
    || record.booking.accountCreationStatus === 'created' || record.booking.accountCreationStatus === 'not_requested') return null;
  return {email: record.booking.driver.email, consent: record.accountConsent,
    requestId: `checkout:${record.booking.confirmationCode}`};
}

export function recordCheckoutAccountResult(id: string, access: RentalAccess, status: BookingRecord['accountCreationStatus']) {
  findAuthorized(id, access).booking.accountCreationStatus = status;
}

export function payBooking(id: string, key: string, access: RentalAccess, scenarioInput?: unknown): BookingRecord {
  const record = findAuthorized(id, access);
  const scenario = readLocalPaymentScenario(scenarioInput);
  const operation = operationKey(`payment:${record.booking.confirmationCode}`, access, key);
  const hash = fingerprint({ id: record.booking.confirmationCode, scenario });
  const previous = state.operations.get(operation);
  if (previous) {
    if (previous.fingerprint !== hash) throw new RentalError('submission_changed');
    if (previous.errorCode) throw new RentalError(previous.errorCode, previous.errorStatus);
    return structuredClone(record.booking);
  }
  if (record.booking.paymentStatus === 'paid' && record.booking.status === 'CONFIRMED') return structuredClone(record.booking);
  if (!canPayBooking(record.booking)) throw new RentalError('order_not_payable');
  const result = localPaymentResult(scenario);
  record.booking.paymentStatus = result.paymentStatus;
  if (result.paymentStatus === 'paid') confirmLocalPayment(record.booking);
  if (['processing', 'unknown'].includes(result.paymentStatus)) record.localPaymentSettlesAt = Date.now() + 10_000;
  state.operations.set(operation, { fingerprint: hash, bookingId: record.booking.confirmationCode,
    expires: record.expires, errorCode: result.errorCode, errorStatus: result.errorStatus });
  if (result.errorCode) throw new RentalError(result.errorCode, result.errorStatus);
  return structuredClone(record.booking);
}

export function previewCancellation(id: string, access: RentalAccess) {
  return estimateCancellation(findAuthorized(id, access).booking);
}

export function cancelReservation(id: string, input: { reason: string; version: string; idempotencyKey: string }, access: RentalAccess) {
  const record = findAuthorized(id, access);
  const operation = operationKey(`cancel:${id}`, access, input.idempotencyKey);
  const hash = fingerprint(input);
  const previous = state.operations.get(operation);
  if (previous) {
    if (previous.fingerprint !== hash) throw new RentalError('submission_changed');
    return structuredClone(record.booking);
  }
  if (!['bm_reason_plans', 'bm_reason_price', 'bm_reason_transport', 'bm_reason_mistake',
    'bm_reason_emergency', 'bm_reason_other'].includes(input.reason)) throw new RentalError('invalid_request', 400);
  const estimate = previewCancellation(id, access);
  if (input.version !== estimate.version) throw new RentalError('cancellation_changed');
  record.booking.status = 'CANCELLED';
  record.booking.closureReason = 'customer_cancelled';
  record.booking.refundStatus = estimate.refundAmount > 0 ? 'processing' : 'not_required';
  record.booking.cancellation = { cancelledAt: new Date().toISOString(), reason: input.reason,
    refundAmount: estimate.refundAmount, penaltyAmount: estimate.penaltyAmount };
  state.operations.set(operation, { fingerprint: hash, bookingId: id, expires: record.expires });
  return structuredClone(record.booking);
}
