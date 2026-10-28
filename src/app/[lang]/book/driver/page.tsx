import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getRateDetailsForDisplay } from '@/integrations/fleetedge/local-rental-adapter';
import { RentalError } from '@/modules/reservation/domain/validation';
import { readRateSelection } from '@/modules/rate-details/domain/selection';
import { isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { BookingProgressStepper } from '@/modules/reservation/public-api';
import { buildRateReturnHref } from '@/modules/reservation/application/rate-return';
import { safeRateRecoveryPath } from '@/modules/reservation/application/route-recovery';
import { DriverBookingView } from './DriverBookingView';

export const dynamic = 'force-dynamic';

export default async function DriverDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) notFound();
  const lang = resolvedParams.lang;
  const resolvedSearchParams = (await searchParams) || {};

  const rateDetailsId = typeof resolvedSearchParams.rateDetailsId === 'string' ? resolvedSearchParams.rateDetailsId : '';
  const recoveryPath = safeRateRecoveryPath(resolvedSearchParams.returnTo, lang) ?? `/${lang}/rent`;
  if (!rateDetailsId) redirect(recoveryPath);
  let details;
  try { details = getRateDetailsForDisplay(rateDetailsId, lang); }
  catch (error) {
    if (!(error instanceof RentalError) || error.code !== 'rate_expired') throw error;
  }
  if (!details) redirect(recoveryPath);
  const { vehicle, trip, search } = details;
  const { insuranceId, equipment: initialEquipment } = readRateSelection(resolvedSearchParams);
  const backHref = `${buildRateReturnHref({
    lang,
    vehicleId: vehicle.id,
    offerId: trip.offerId ?? '',
    search,
    licenseCountry: trip.licenseCountry || 'United States',
    insuranceId,
    equipment: initialEquipment,
  })}&rateDetailsId=${encodeURIComponent(rateDetailsId)}`;
  // eslint-disable-next-line react-hooks/purity -- request-time expiry check in an async Server Component
  if (Date.parse(trip.rateExpiresAt ?? '') <= Date.now()) redirect(backHref);

  return (
    <div className="bg-muted min-h-dvh">
      <BookingProgressStepper
        currentStep="driver"
        lang={lang}
        vehicleId={vehicle.id}
        insuranceId={insuranceId}
        backHref={backHref}
        backLabel={getTranslation('back_to_rate_equipment', lang)}
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Dedicated Driver Information View */}
        <DriverBookingView
          key={trip.rateDetailsId}
          vehicle={vehicle}
          trip={trip}
          search={search}
          insuranceId={insuranceId}
          initialEquipment={initialEquipment}
          lang={lang}
        />
      </div>
    </div>
  );
}
