import type { BookingRecord, CancellationEstimate } from './types';
import { RentalError } from '@/modules/reservation/domain/validation';

export function canPayBooking(booking: BookingRecord, now = Date.now()): boolean {
  return booking.status === 'PENDING_PAYMENT' && ['unpaid', 'failed'].includes(booking.paymentStatus ?? 'unpaid')
    && Number.isFinite(Date.parse(booking.paymentDeadline ?? '')) && Date.parse(booking.paymentDeadline!) > now;
}

export function canCancelBooking(booking: BookingRecord): boolean {
  return ['PENDING_PAYMENT', 'CONFIRMED'].includes(booking.status)
    && booking.paymentStatus !== 'processing' && booking.paymentStatus !== 'unknown';
}

export function estimateCancellation(booking: BookingRecord, now = Date.now()): CancellationEstimate {
  if (!canCancelBooking(booking)) throw new RentalError('order_not_cancellable');
  const paidAmount = booking.paymentStatus === 'paid' ? booking.paidAmount ?? 0 : 0;
  const pickup = Date.parse(booking.trip.pickupDateTime);
  if (!Number.isFinite(pickup)) throw new RentalError('invalid_search', 400);
  const hours = (pickup - now) / 3_600_000;
  // Local fixture policy follows the selected depot's cancellation window.
  // An unpaid hold is released without a refund. Counter charges and deposits
  // are never refunded as online payments.
  const fraction = booking.vehicle.cancellationFreeHours === 0 ? 1
    : hours >= booking.vehicle.cancellationFreeHours ? 0 : hours >= 2 ? 0.5 : 1;
  const penaltyAmount = Math.round(paidAmount * fraction * 100) / 100;
  const refundAmount = Math.round((paidAmount - penaltyAmount) * 100) / 100;
  return { paidAmount, penaltyAmount, refundAmount, currency: booking.pricing.currency,
    version: [booking.confirmationCode, paidAmount, penaltyAmount, booking.pricing.currency].join(':') };
}
