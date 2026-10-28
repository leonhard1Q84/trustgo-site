'use client';

import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  RentalTripDetails,
  CancellationPolicy,
  InsurancePackageId,
  SpecialEquipmentSelection,
  getDefaultEquipmentSelection,
  calculateEquipmentCost,
  calculateRatePricing,
  VehicleSnapshot,
  InsuranceComparison,
  EquipmentSelector,
  ThingsToKnowSection,
  RateSummarySidebar,
  VehiclePolicySection,
} from '@/modules/rate-details/public-api';
import {
  useSearchExpiry,
  SearchRefreshSkeleton,
} from '@/modules/rental-search/ui/SearchExpiryDialog';
import { useI18n } from '@/i18n/useI18n';
import { type RouteLanguage } from '@/i18n/locales';

interface RateDetailsViewProps {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  cancellationPolicy: CancellationPolicy;
  initialInsurance: InsurancePackageId;
  initialEquipment?: SpecialEquipmentSelection;
  refreshHref: string;
  backToSearchHref?: string;
  isRefreshed?: boolean;
  lang: RouteLanguage;
  licenseCountry?: string;
}

export function RateDetailsView({
  vehicle,
  trip,
  cancellationPolicy,
  initialInsurance,
  initialEquipment,
  refreshHref,
  backToSearchHref,
  isRefreshed,
  lang,
  licenseCountry,
}: RateDetailsViewProps) {
  const { t } = useI18n(lang as RouteLanguage);
  const [selectedInsurance, setSelectedInsurance] = useState<InsurancePackageId>(initialInsurance);
  const [equipment, setEquipment] = useState<SpecialEquipmentSelection>(
    initialEquipment ?? getDefaultEquipmentSelection()
  );

  // Keep only public selections in the current entry, including the original quote TTL.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (trip.rateDetailsId) url.searchParams.set('rateDetailsId', trip.rateDetailsId);
    url.searchParams.set('insurance', selectedInsurance);
    url.searchParams.set('equipment', JSON.stringify(equipment));
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }, [trip.rateDetailsId, selectedInsurance, equipment]);

  // Refresh expired rate details using the original search.
  const handleRefreshRate = async () => {
    // Refresh the selected depot rate from the original search
    if (typeof window !== 'undefined') {
      const destination = new URL(refreshHref, window.location.origin);
      destination.searchParams.set('insurance', selectedInsurance);
      destination.searchParams.set('equipment', JSON.stringify(equipment));
      destination.searchParams.set('refreshed', '1');
      window.location.assign(destination.href);
    }
  };

  const { searchExpiryDialog, isSearchRefreshing } = useSearchExpiry({
    isActive: true,
    resetKey: trip.rateDetailsId,
    expiresAt: trip.rateExpiresAt,
    onRefresh: handleRefreshRate,
    lang,
    variant: 'rate',
    backHref: backToSearchHref,
  });

  // Recalculate equipment cost and overall rate pricing in real-time
  const equipmentCost = calculateEquipmentCost(equipment, trip.rentalDays);
  const pricing = calculateRatePricing(vehicle, trip, selectedInsurance, equipmentCost);

  if (isSearchRefreshing) {
    return (
      <div className="py-8">
        <SearchRefreshSkeleton variant="booking" label={t('search_refresh_booking')} />
      </div>
    );
  }

  return (
    <>
      {searchExpiryDialog}

      <div className="pb-28 lg:pb-0">
        {isRefreshed && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-control border border-border bg-muted p-4 text-xs sm:text-sm text-foreground"
          >
            <Info className="size-5 shrink-0 text-foreground-secondary mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">{t('rd_rate_refreshed_title')}</p>
              <p className="mt-0.5 text-foreground-secondary">{t('rd_rate_refreshed_desc')}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="min-w-0 lg:col-span-8 space-y-8 md:space-y-10">
            <VehicleSnapshot vehicle={vehicle} trip={trip} lang={lang} />

            <InsuranceComparison
              selectedId={selectedInsurance}
              onSelect={setSelectedInsurance}
              currency={vehicle.currency}
              depositAmount={vehicle.depositAmount}
              supplierName={vehicle.supplier.name}
              lang={lang}
            />

            <EquipmentSelector
              selection={equipment}
              onChange={setEquipment}
              currency={vehicle.currency}
              rentalDays={trip.rentalDays}
            />

            <VehiclePolicySection
              vehicle={vehicle}
              policy={cancellationPolicy}
              trip={trip}
              lang={lang}
            />
          </div>

          <div className="min-w-0 lg:col-span-4 lg:sticky lg:top-40">
            <RateSummarySidebar
              vehicle={vehicle}
              trip={trip}
              pricing={pricing}
              equipment={equipment}
              rateReturnHref={`${refreshHref}&insurance=${selectedInsurance}&equipment=${encodeURIComponent(JSON.stringify(equipment))}`}
              lang={lang}
            />
          </div>
        </div>
        <ThingsToKnowSection
          depositAmount={vehicle.depositAmount}
          currency={vehicle.currency}
          lang={lang}
          licenseCountry={licenseCountry}
          trip={trip}
          vehicle={vehicle}
        />
      </div>
    </>
  );
}
