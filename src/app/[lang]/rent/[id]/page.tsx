import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import {
  buildSearchQuery,
  createDefaultSearchForm,
  parseSearchForm,
} from '@/modules/rental-search/domain/search-form';
import { getDefaultLicenseCountry } from '@/modules/rental-search/domain/countries';
import { getAvailableStoreOffers } from '@/modules/rental-search/domain/availability';
import { createRateDetails, getRateDetailsForDisplay } from '@/integrations/fleetedge/local-rental-adapter';
import { getVehicleById } from '@/modules/rental-search/domain/fleet-data';
import { RentalError } from '@/modules/reservation/domain/validation';
import { readRateSelection } from '@/modules/rate-details/domain/selection';
import { buildCancellationPolicy } from '@/modules/rate-details/public-api';
import { BookingProgressStepper } from '@/modules/reservation/public-api';
import { RateDetailsView } from './RateDetailsView';

export const dynamic = 'force-dynamic';

export default async function RateDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) notFound();
  const lang = resolvedParams.lang;
  const vehicleId = resolvedParams.id;
  const resolvedSearchParams = (await searchParams) || {};

  const form = parseSearchForm(
    resolvedSearchParams,
    createDefaultSearchForm(getDefaultLicenseCountry(lang))
  );
  if (!getVehicleById(vehicleId)) notFound();
  const existingId =
    typeof resolvedSearchParams.rateDetailsId === 'string'
      ? resolvedSearchParams.rateDetailsId
      : '';
  let details;
  const resultsHref = `/${lang}/rent?${buildSearchQuery(form)}`;
  try {
    if (existingId) {
      try {
        details = getRateDetailsForDisplay(existingId, lang);
      } catch (err) {
        if (err instanceof RentalError && err.code === 'rate_expired') {
          const offerId = typeof resolvedSearchParams.offer === 'string'
            ? resolvedSearchParams.offer
            : getAvailableStoreOffers(form).find(o => o.vehicleId === vehicleId)?.offerId;
          if (offerId) details = createRateDetails(form, offerId, lang);
        } else {
          throw err;
        }
      }
    } else {
      const offerId = typeof resolvedSearchParams.offer === 'string'
        ? resolvedSearchParams.offer
        : getAvailableStoreOffers(form).find(o => o.vehicleId === vehicleId)?.offerId;
      if (offerId) details = createRateDetails(form, offerId, lang);
    }
  } catch (error) {
    if (!(error instanceof RentalError) || !['rate_expired', 'rate_unavailable', 'invalid_search', 'invalid_driver'].includes(error.code)) throw error;
    // An expected invalid/expired selection returns to the existing search flow.
  }
  if (!details) redirect(resultsHref);
  const { vehicle, trip, search } = details;
  if (vehicle.id !== vehicleId) notFound();
  const { insuranceId: initialInsurance, equipment: initialEquipment } = readRateSelection(resolvedSearchParams);
  const licenseCountry = trip.licenseCountry;

  const cancellationPolicy = buildCancellationPolicy(vehicle.cancellationFreeHours);

  // Back to results keeps the original search (Page Patterns §4: restore search & filters).
  const resultsQuery = buildSearchQuery(search);

  return (
    <div className="bg-background min-h-dvh">
      <BookingProgressStepper
        currentStep="rate"
        lang={lang}
        vehicleId={vehicle.id}
        insuranceId={initialInsurance}
        backHref={`/${lang}/rent${resultsQuery ? `?${resultsQuery}` : ''}`}
        backLabel={getTranslation('back_to_vehicle_results', lang)}
      />
      <div className="max-w-default mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-8">
        {/* Interactive Client Component for Insurance Selection & Price Sync */}
        <RateDetailsView
          vehicle={vehicle}
          trip={trip}
          cancellationPolicy={cancellationPolicy}
          initialInsurance={initialInsurance}
          initialEquipment={initialEquipment}
          refreshHref={`/${lang}/rent/${vehicle.id}?${resultsQuery}&offer=${encodeURIComponent(trip.offerId ?? '')}`}
          backToSearchHref={`/${lang}/rent${resultsQuery ? `?${resultsQuery}` : ''}`}
          isRefreshed={resolvedSearchParams.refreshed === '1'}
          lang={lang}
          licenseCountry={licenseCountry}
        />
      </div>
    </div>
  );
}
