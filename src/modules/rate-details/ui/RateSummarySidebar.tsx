'use client';

import { formatTripDateTime } from '@/modules/rate-details/domain/format-trip';
import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import { RatePricingBreakdown, RentalTripDetails } from '../domain/types';
import { SpecialEquipmentSelection } from '../domain/equipment';
import { STANDARD_INSURANCE_PACKAGES } from '../application/rate-service';
import { StoreMapModal, buildDepotStoreInfo } from './StoreMapModal';
import { type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/shared/ui/dialog';
import { RatePriceBreakdown } from './RatePriceBreakdown';
import {
  localizeVehicleName,
  localizeCounterType,
} from '@/modules/rental-search/domain/vehicleLocalization';

interface RateSummarySidebarProps {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  pricing: RatePricingBreakdown;
  equipment?: SpecialEquipmentSelection;
  lang: RouteLanguage;
  mode?: 'rate-details' | 'driver-checkout';
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  title?: string;
  submitFormId?: string;
  actionFeedback?: React.ReactNode;
  rateReturnHref?: string;
}

function DepotRow({
  label,
  location,
  accessType,
  dateTime,
  onOpenMap,
  mapLabel,
  compact = false,
}: {
  label: string;
  location: string;
  accessType: string;
  dateTime: string;
  onOpenMap: () => void;
  mapLabel: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <MapPin className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1 relative">
        <span className="text-muted-foreground block text-xs font-bold">{label}</span>
        <span className="font-semibold text-foreground block leading-snug">{location}</span>
        {!compact && (
          <span className="mt-1 block text-caption text-foreground-secondary">{accessType}</span>
        )}
        {!compact && <span className="text-foreground-secondary block mt-1">{dateTime}</span>}
        {compact ? (
          <div className="flex flex-wrap items-center justify-between gap-x-2">
            <span className="text-foreground-secondary">{dateTime}</span>
            <button
              type="button"
              onClick={onOpenMap}
              className={`inline-flex min-h-11 items-center gap-1 text-caption font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${compact ? 'mt-0' : 'mt-1'}`}
            >
              <span>{mapLabel}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenMap}
            className={`inline-flex min-h-11 items-center gap-1 text-caption font-semibold text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${compact ? 'mt-0' : 'mt-1'}`}
          >
            <span>{mapLabel}</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export function RateSummarySidebar({
  vehicle,
  trip,
  pricing,
  equipment,
  lang,
  mode = 'rate-details',
  isSubmitting = false,
  submitDisabled = false,
  title,
  submitFormId,
  actionFeedback,
  rateReturnHref,
}: RateSummarySidebarProps) {
  const { t } = useI18n(lang);
  const compact = mode === 'driver-checkout';
  const [inputFocused, setInputFocused] = useState(false);
  React.useEffect(() => {
    const update = () =>
      setInputFocused(
        document.activeElement?.matches(
          'input:not([type=checkbox]):not([type=radio]), textarea, select'
        ) ?? false
      );
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => {
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, []);
  const [mapTab, setMapTab] = useState<'pickup' | 'return' | null>(null);
  const number = new Intl.NumberFormat(lang === 'zh' ? 'zh-Hant' : lang, {
    maximumFractionDigits: 2,
  });
  const money = (amount: number) => `${pricing.currency}${number.format(amount)}`;

  const selectedInsurance =
    STANDARD_INSURANCE_PACKAGES.find((pkg) => pkg.id === pricing.insurancePackageId) ||
    STANDARD_INSURANCE_PACKAGES[0];

  const insuranceName = t(
    `ic_pkg_${selectedInsurance.id === 'zero-excess' ? 'zero' : selectedInsurance.id}_name`
  );

  const pickupStore = buildDepotStoreInfo(
    vehicle.supplier.name,
    trip.pickupLocation,
    vehicle.supplier.locationType,
    trip.pickupStoreCode
  );
  const returnStore = buildDepotStoreInfo(
    vehicle.supplier.name,
    trip.returnLocation || trip.pickupLocation,
    vehicle.supplier.locationType,
    trip.returnStoreCode
  );

  const equipmentParam = equipment ? encodeURIComponent(JSON.stringify(equipment)) : '';
  const nextStepHref = `/${lang}/book/driver?rateDetailsId=${encodeURIComponent(trip.rateDetailsId ?? '')}&insurance=${pricing.insurancePackageId}${equipmentParam ? `&equipment=${equipmentParam}` : ''}${rateReturnHref ? `&returnTo=${encodeURIComponent(rateReturnHref)}` : ''}`;

  const sidebarTitle =
    title || (mode === 'driver-checkout' ? t('bv_booking_summary') : t('rate_summary_title'));

  return (
    <aside className="w-full min-w-0">
      <div
        className={`bg-background rounded-card p-5 md:p-6 border border-border ${compact ? 'space-y-4' : 'space-y-6'}`}
      >
        {/* Header */}
        <div className="pb-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{sidebarTitle}</h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            {localizeVehicleName(vehicle.name, lang)} &middot;{' '}
            {t('ck_rental_period').replace('{days}', String(pricing.rentalDays))}
          </p>
          {compact && (
            <p className="mt-1 text-caption text-foreground-secondary">{insuranceName}</p>
          )}
        </div>

        {/* Pick-up & Return Depots with Map & Directions */}
        <div className="space-y-3.5 text-xs pb-4 border-b border-border">
          <DepotRow
            compact={compact}
            label={t('bm_pickup_depot')}
            location={pickupStore.name}
            accessType={localizeCounterType(pickupStore.locationType, lang)}
            dateTime={formatTripDateTime(trip.pickupDateTime, trip, lang)}
            mapLabel={t('rd_depot_guide')}
            onOpenMap={() => setMapTab('pickup')}
          />
          <DepotRow
            compact={compact}
            label={t('bm_return_depot')}
            location={returnStore.name}
            accessType={localizeCounterType(returnStore.locationType, lang)}
            dateTime={formatTripDateTime(trip.returnDateTime, trip, lang)}
            mapLabel={t('rd_depot_guide')}
            onOpenMap={() => setMapTab('return')}
          />
        </div>

        {compact ? (
          <details className="group/price border-b border-border pb-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-control text-body font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {t('rate_price_details')}
              <ChevronDown
                className="h-4 w-4 transition-transform group-open/price:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <RatePriceBreakdown
              vehicle={vehicle}
              pricing={pricing}
              insuranceName={insuranceName}
              equipment={equipment}
              lang={lang}
            />
          </details>
        ) : (
          <RatePriceBreakdown
            vehicle={vehicle}
            pricing={pricing}
            insuranceName={insuranceName}
            equipment={equipment}
            lang={lang}
          />
        )}

        {/* Payment Timing: Pay Now vs Pay at Counter */}
        <div className={`space-y-2 text-body ${compact ? '' : 'border-y border-border py-5'}`}>
          <div className="flex justify-between items-center text-foreground-secondary">
            <span>{t('rate_pay_now')}</span>
            <span className="font-bold text-foreground">{money(pricing.payNow)}</span>
          </div>
          <div className="flex justify-between items-center text-foreground-secondary">
            <span>{t('rate_pay_counter')}</span>
            <span className="font-bold text-foreground">{money(pricing.payAtCounter)}</span>
          </div>
        </div>

        {/* Total Charge */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-bold text-foreground">{t('rate_total_due')}</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {money(pricing.totalCharge)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t('rate_taxes_note')}</p>

          <div className="mt-3 text-caption leading-relaxed text-foreground-secondary">
            {compact ? (
              t('bv_deposit_summary').replace('{amount}', money(pricing.securityDeposit))
            ) : (
              <>
                <span className="font-bold text-foreground block mb-0.5">
                  {t('rate_deposit_title')}
                </span>
                {t('rate_deposit_note').replace('{amount}', money(pricing.securityDeposit))}
              </>
            )}
          </div>
        </div>

        {actionFeedback}

        {/* Action Button (desktop); on H5 the fixed bottom bar below carries the CTA */}
        <div className="hidden lg:block">
          {mode === 'driver-checkout' ? (
            <Button
              type="submit"
              form={submitFormId}
              disabled={submitDisabled || isSubmitting}
              className="w-full gap-2 group"
            >
              <span>{isSubmitting ? t('bv_reserving') : t('bv_proceed')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          ) : (
            <Link
              href={nextStepHref}
              className="w-full h-12 rounded-control bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t('rate_cta_continue')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
            <Lock className="w-3 h-3 text-foreground-secondary" />
            <span>{mode === 'driver-checkout' ? t('bv_ssl_note') : t('rate_cta_assurance')}</span>
          </div>
        </div>
      </div>

      {/* H5 sticky bottom action bar (layout-grid.md §5) */}
      <Dialog>
        <div
          className={`fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background shadow-bottombar lg:hidden ${inputFocused ? 'hidden' : ''}`}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="min-w-0">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="text"
                  className="h-auto min-h-11 flex-col items-start gap-0 px-0 py-0 text-left md:hidden"
                >
                  <span className="text-caption font-normal underline underline-offset-4">
                    {t('rate_price_details')}
                  </span>
                  <span className="text-xl font-semibold tabular-nums">
                    {money(pricing.totalCharge)}
                  </span>
                </Button>
              </DialogTrigger>
              <div className="hidden md:block">
                <span className="text-xs text-muted-foreground block">{t('rate_total_due')}</span>
                <span className="text-xl font-bold text-foreground tracking-tight tabular-nums">
                  {money(pricing.totalCharge)}
                </span>
              </div>
            </div>
            {mode === 'driver-checkout' ? (
              <Button
                type="submit"
                form={submitFormId}
                disabled={submitDisabled || isSubmitting}
                className="min-w-0 whitespace-normal gap-1.5 px-5"
              >
                <span>{isSubmitting ? t('bv_reserving_short') : t('bv_proceed')}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link
                href={nextStepHref}
                className="h-11 shrink-0 rounded-control bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm transition-colors flex items-center justify-center gap-1.5 px-5"
              >
                <span>{t('rate_cta_continue')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <DialogContent variant="sheet" hideCloseButton className="overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('rate_price_details')}</DialogTitle>
            <DialogDescription>{t('rate_taxes_note')}</DialogDescription>
          </DialogHeader>
          <DialogBody className="min-h-0">
            <RatePriceBreakdown
              vehicle={vehicle}
              pricing={pricing}
              insuranceName={insuranceName}
              equipment={equipment}
              lang={lang}
            />
            <dl className="space-y-3 border-t border-border py-5 text-body">
              <div className="flex justify-between gap-4">
                <dt>{t('rate_pay_now')}</dt>
                <dd>{money(pricing.payNow)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>{t('rate_pay_counter')}</dt>
                <dd>{money(pricing.payAtCounter)}</dd>
              </div>
              <div className="flex justify-between gap-4 font-semibold">
                <dt>{t('rate_total_due')}</dt>
                <dd>{money(pricing.totalCharge)}</dd>
              </div>
            </dl>
          </DialogBody>
          <DialogFooter className="bg-background">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('common_close')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StoreMapModal
        isOpen={mapTab !== null}
        onClose={() => setMapTab(null)}
        pickupStore={pickupStore}
        returnStore={returnStore}
        initialTab={mapTab ?? 'pickup'}
        lang={lang}
      />
    </aside>
  );
}
