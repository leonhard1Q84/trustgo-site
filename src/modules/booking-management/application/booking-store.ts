import { notifyBookingChanged } from './booking-events';
import type { PendingCheckout } from '../domain/pending-checkout';
import type { BookingRecord, CancellationEstimate } from '../domain/types';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { CreateReservationInput } from '@/integrations/fleetedge/local-rental-adapter';
import type { LocalPaymentScenario } from '@/modules/checkout/domain/local-payment-scenario';

async function rentalRequest<T>(path: string, body?: unknown): Promise<T> {
  // Remove legacy browser copies containing driver details when upgrading an
  // existing preview. Current records and access remain on the server only.
  if (typeof window !== 'undefined') {
    try {
      for (const key of Object.keys(sessionStorage)) if (key.startsWith('booking_TG-')) sessionStorage.removeItem(key);
      localStorage.removeItem('trustgo_mock_guest_session_id');
      localStorage.removeItem('trustgo_guest_authorized_codes');
    } catch { /* Storage may be disabled; server access still works. */ }
  }
  let response: Response;
  let data;
  try {
    response = await fetch(`/api/rental/${path}`, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
    });
    try { data = await response.json(); } catch {
      throw new RentalError(response.status === 429 ? 'try_later' : 'service_unavailable', response.status >= 400 ? response.status : 503);
    }
  } catch (error) {
    if (error instanceof RentalError) throw error;
    throw new RentalError('service_unavailable', 503);
  }
  if (!response.ok) throw new RentalError(typeof data?.code === 'string' ? data.code : response.status === 429 ? 'try_later' : 'service_unavailable', response.status, data?.field);
  if (!data || typeof data !== 'object') throw new RentalError('service_unavailable', 503);
  if (body !== undefined) notifyBookingChanged();
  return data;
}

export async function createBooking(input: CreateReservationInput) {
  // Establish the HttpOnly access cookie before the mutation, so a lost create
  // response can be retried under the same owner and idempotency key.
  await listGuestBookings();
  return rentalRequest<BookingRecord>('reservations', input);
}
export function getBookingByConfirmationCode(code: string) {
  return rentalRequest<BookingRecord>(`bookings/${encodeURIComponent(code)}`);
}
export function payBookingByConfirmationCode(code: string, idempotencyKey: string, localPaymentScenario: LocalPaymentScenario = 'success') {
  return rentalRequest<BookingRecord>(`bookings/${encodeURIComponent(code)}/payment`, { idempotencyKey, localPaymentScenario });
}
export function findGuestBooking(code: string, lastName: string) {
  return rentalRequest<BookingRecord>('guest-lookup', { confirmationCode: code, lastName });
}
export function linkAccountBooking(code: string, lastName: string) {
  return rentalRequest<BookingRecord>('lookup', { confirmationCode: code, lastName });
}
export interface BookingListResult { status: 'active' | 'missing'; orders: BookingRecord[] }
export type GuestBookingsResult = BookingListResult;
export function listAccessibleBookings() { return rentalRequest<BookingListResult>('bookings'); }
export const listGuestBookings = listAccessibleBookings;
export function listSessionBookings() { return rentalRequest<GuestBookingsResult>('guest-bookings'); }
export function getCancellationEstimate(code: string) {
  return rentalRequest<CancellationEstimate>(`bookings/${encodeURIComponent(code)}/cancellation-estimate`, {});
}
export function cancelBooking(code: string, reason: string, version: string, idempotencyKey: string) {
  return rentalRequest<BookingRecord>(`bookings/${encodeURIComponent(code)}/cancel`, { reason, version, idempotencyKey });
}

export function listPendingCheckouts() { return rentalRequest<PendingCheckout[]>('pending-checkouts'); }
