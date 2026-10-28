import type { BookingRecord } from './types';
import { canCancelBooking } from './lifecycle';

export function bookingStatusKey(booking: BookingRecord): string {
  if (booking.status === 'CANCELLED') return booking.closureReason === 'payment_timeout'
    ? 'ck_hold_expired_title' : 'bm_voucher_cancelled';
  return ({ CONFIRMED: 'bm_voucher_guaranteed', PENDING_PAYMENT: 'rental_status_unpaid',
    ACTIVE_RENTAL: 'bm_state_active', COMPLETED: 'bm_state_completed' } as Record<string, string>)[booking.status]
    ?? 'rental_service_unavailable';
}

export function paymentStatusKey(booking: BookingRecord): string {
  if (booking.status === 'CANCELLED') return booking.paymentStatus === 'paid'
    ? `rental_refund_${booking.refundStatus ?? 'not_required'}` : 'rental_refund_not_required';
  return ({ paid: 'rental_status_paid', processing: 'rental_status_processing', unknown: 'rental_status_unknown',
    failed: 'rental_status_failed', unpaid: 'rental_status_unpaid' } as Record<string, string>)[booking.paymentStatus ?? 'unpaid']
    ?? 'rental_status_unknown';
}

export function hasFreeCancellation(booking: BookingRecord, now = Date.now()): boolean {
  return canCancelBooking(booking) && booking.vehicle.cancellationFreeHours > 0
    && Date.parse(booking.trip.pickupDateTime) - booking.vehicle.cancellationFreeHours * 3_600_000 >= now;
}
