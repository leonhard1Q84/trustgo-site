import type { BookingRecord } from '@/modules/booking-management/domain/types';
import { canPayBooking } from '@/modules/booking-management/domain/lifecycle';
import type { CreateReservationInput } from '@/integrations/fleetedge/local-rental-adapter';
import { validateDriver } from '../domain/validation';

/** A retry may resume its own unchanged hold; another reservation needs explicit review. */
export function findResumableReservation(
  bookings: BookingRecord[],
  input: CreateReservationInput
): BookingRecord | undefined {
  const driver = validateDriver(input.driver);
  return bookings.find((booking) => {
    if (
      booking.trip.rateDetailsId !== input.rateDetailsId ||
      !canPayBooking(booking) ||
      booking.insurance.id !== input.insuranceId
    )
      return false;
    const existing = validateDriver(booking.driver);
    const sameDriver =
      (
        [
          'title',
          'firstName',
          'lastName',
          'email',
          'phoneCountryCode',
          'phone',
          'licenseCountry',
          'flightNumber',
        ] as const
      ).every((field) => (existing[field] ?? '') === (driver[field] ?? '')) &&
      existing.additionalDriver?.enabled === driver.additionalDriver?.enabled &&
      existing.additionalDriver?.fullName === driver.additionalDriver?.fullName;
    const sameEquipment = Object.keys(input.equipment).every(
      (key) =>
        input.equipment[key as keyof typeof input.equipment] ===
        booking.equipment[key as keyof typeof input.equipment]
    );
    const wantsAccount = Boolean(input.accountCreation?.create_account_requested);
    return (
      sameDriver && sameEquipment && wantsAccount === (booking.accountCreationStatus === 'pending')
    );
  });
}
