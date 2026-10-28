import React from 'react';
import { notFound } from 'next/navigation';
import { isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { readPageBooking } from '@/modules/booking-management/application/read-page-booking';
import { BookingProgressStepper } from '@/modules/reservation/public-api';
import { CheckoutCashierView } from './CheckoutCashierView';

export const dynamic = 'force-dynamic';

export default async function CheckoutCashierPage({
  params,
}: {
  params: Promise<{ lang: string; reservationId: string }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) notFound();
  const lang = resolvedParams.lang;
  const reservationId = resolvedParams.reservationId;

  const booking = await readPageBooking(reservationId, lang, `/${lang}/checkout/${encodeURIComponent(reservationId)}`);

  return (
    <div className="bg-muted min-h-dvh">
      <BookingProgressStepper
        currentStep="checkout"
        lang={lang}
        vehicleId={booking?.vehicle.id}
        backHref={`/${lang}/manage-booking`}
        backLabel={getTranslation('nav_manage_booking', lang)}
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Client View for Payment & Summary */}
        <CheckoutCashierView initialBooking={booking!} reservationId={reservationId} lang={lang} />
      </div>
    </div>
  );
}
