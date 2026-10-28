import { redirect } from 'next/navigation';
import { rentalAccess } from '@/server/rental-access';
import { readBooking } from '@/integrations/fleetedge/local-rental-adapter';
import { throwLocalBookingFault } from '@/integrations/fleetedge/local-booking-faults';
import { RentalError } from '@/modules/reservation/domain/validation';
import { bookingAccessRecoveryPath } from '../domain/access-recovery';

/** Resource privacy and service failure are different: only access loss needs lookup. */
export async function readPageBooking(code: string, lang: string, path: string) {
  // Synthetic IDs contain no order data, so local error-page checks need no guest grant.
  throwLocalBookingFault(code);
  const access = await rentalAccess();
  if (!access) redirect(bookingAccessRecoveryPath(lang, path));
  try { return readBooking(code, access); }
  catch (error) {
    if (error instanceof RentalError && error.code === 'booking_not_found') {
      redirect(bookingAccessRecoveryPath(lang, path));
    }
    throw error;
  }
}
