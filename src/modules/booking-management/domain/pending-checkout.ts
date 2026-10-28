import type { BookingRecord } from './types';
import { canPayBooking } from './lifecycle';

/** Global navigation needs no driver, contact, payment or location details. */
export interface PendingCheckout {
  confirmationCode: string;
  vehicleName: string;
  paymentDeadline: string;
}

export function pendingCheckouts(bookings: BookingRecord[], now = Date.now()): PendingCheckout[] {
  return bookings.filter(booking => canPayBooking(booking, now))
    .map(booking => ({
      confirmationCode: booking.confirmationCode,
      vehicleName: booking.vehicle.name,
      paymentDeadline: booking.paymentDeadline!,
    }))
    .sort((a, b) => Date.parse(a.paymentDeadline) - Date.parse(b.paymentDeadline));
}

export function holdSeconds(deadline?: string, now = Date.now()): number {
  const end = Date.parse(deadline ?? '');
  return Number.isFinite(end) ? Math.max(0, Math.ceil((end - now) / 1000)) : 0;
}

export function formatHoldTime(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
