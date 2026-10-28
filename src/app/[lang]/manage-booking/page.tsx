import { redirect, notFound } from 'next/navigation';
import { isRouteLanguage } from '@/i18n/locales';
import { rentalAccess } from '@/server/rental-access';
import { listBookings } from '@/integrations/fleetedge/local-rental-adapter';
import {
  bookingLookupModalPath,
  verifiedBookingReturnPath,
} from '@/modules/booking-management/domain/access-recovery';

export const dynamic = 'force-dynamic';

export default async function ManageBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();
  const { returnTo } = await searchParams;
  const access = await rentalAccess();
  const orders = access ? listBookings(access) : [];
  if (returnTo) {
    const target = orders
      .map((order) => verifiedBookingReturnPath(returnTo, lang, order.confirmationCode))
      .find(Boolean);
    if (target) redirect(target);
    redirect(bookingLookupModalPath(lang, returnTo));
  }
  redirect(access?.accountId || orders.length ? `/${lang}/manage-booking/orders` : bookingLookupModalPath(lang));
}
