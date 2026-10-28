'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Gauge,
  Fuel,
  Check,
  Percent,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import type { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import type { CancellationPolicy, RentalTripDetails } from '../domain/types';
import { cancellationHeadline, cancellationRows } from '../domain/cancellation-presentation';

export interface VehiclePolicySectionProps {
  vehicle: FleetVehicle;
  policy: CancellationPolicy;
  trip?: RentalTripDetails;
  lang?: RouteLanguage;
}

export function VehiclePolicySection({
  vehicle,
  policy,
  trip,
  lang = 'en',
}: VehiclePolicySectionProps) {
  const { t } = useI18n(lang);
  const [now, setNow] = useState<number>();

  useEffect(() => {
    // Refresh time-sensitive wording while keeping server and initial client markup identical.
    const refresh = () => setNow(Date.now());
    const initial = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const headline = cancellationHeadline(policy, trip, lang, t, now);
  const rows = cancellationRows(policy, trip, lang, t);
  const isNonRefundable = !policy.freeCancellationHours || policy.freeCancellationHours <= 0;

  // Deposit calculation & formatting
  const depositAmount = vehicle.depositAmount ?? 0;
  const formattedDeposit = `${vehicle.currency}${new Intl.NumberFormat(
    lang === 'zh' ? 'zh-Hant' : lang
  ).format(depositAmount)}`;

  // Mileage calculation
  const km = vehicle.mileagePolicy.match(/(\d+)\s*km/)?.[1];
  const mileageTitle = km
    ? t('results_policy_limited_mileage').replace('{km}', km)
    : t('fleet_feature_unlimited_mileage');
  const mileageDesc = km ? t('rd_mileage_desc') : t('rd_mileage_unlimited_desc');

  // Fuel calculation
  const isElectric = vehicle.fuel === 'Electric';
  const isPrepaid = vehicle.fuelPolicy === 'Pre-purchase';
  const fuelTitle = isElectric
    ? t('rd_electric_fuel')
    : isPrepaid
      ? t('results_policy_prepaid_fuel')
      : t('rd_fuel_full_to_full');
  const fuelDesc = isElectric
    ? t('rd_electric_desc')
    : isPrepaid
      ? t('rd_prepaid_fuel_desc')
      : t('rd_fuel_policy_same_to_same_desc');

  return (
    <section
      className="rounded-card border border-border bg-background p-5 md:p-7 space-y-6"
      aria-labelledby="vehicle-policies-heading"
    >
      {/* ── Section Title ── */}
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <ShieldCheck className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
        <h2
          id="vehicle-policies-heading"
          className="text-h3 font-semibold text-foreground tracking-tight"
        >
          {t('rd_booking_policies_title')}
        </h2>
      </div>

      {/* ── Subsection 1: Confirmation Policy ── */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2.5 text-title font-semibold text-foreground">
          <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_confirmation_title')}</h3>
        </div>
        <p className="text-body text-foreground-secondary leading-relaxed pl-7.5">
          {t('rd_confirmation_desc')}
        </p>
      </div>

      {/* ── Subsection 2: Cancellation Policy (High Visibility, Always Expanded) ── */}
      <div className="border-b border-border pb-6 space-y-4">
        <div className="flex items-center gap-2.5 text-title font-semibold text-foreground">
          <Clock className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_cancel_title')}</h3>
        </div>

        {/* Free Cancellation Highlight Headline */}
        <div className="pl-7.5 space-y-1">
          <p
            className={`text-title md:text-h3 font-bold tracking-tight ${
              isNonRefundable ? 'text-destructive' : 'text-success'
            }`}
          >
            {headline}
          </p>
          <p className="text-body text-foreground-secondary">
            {t(policy.freeCancellationHours ? 'rd_cancel_summary' : 'rd_cancel_no_refund')}
          </p>
        </div>

        {/* Timeline Stepper Box */}
        <div className="rounded-control bg-muted p-4 md:p-6 ml-0 md:ml-7.5">
          <div className="relative">
            {/* Continuous Vertical Timeline Line */}
            <div
              className="absolute left-3.5 top-3.5 bottom-3.5 w-px bg-border-strong"
              aria-hidden="true"
            />

            <div className="space-y-6">
              {rows.map((row, index) => {
                const isFree = row.feePercentage === 0;
                return (
                  <div key={index} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-xs ${
                        isFree
                          ? 'bg-success'
                          : row.feePercentage === 100
                            ? 'bg-muted-foreground'
                            : 'bg-foreground-secondary'
                      }`}
                    >
                      {isFree ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <Percent className="h-3.5 w-3.5 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p
                        className={`text-body font-semibold ${
                          isFree ? 'text-success' : 'text-foreground'
                        }`}
                      >
                        {row.title}
                      </p>
                      {row.period && (
                        <p className="mt-1 text-caption font-medium text-foreground-secondary">
                          {row.period}
                        </p>
                      )}
                      {row.refund && (
                        <p className="mt-0.5 text-caption text-muted-foreground">{row.refund}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Local time notice & cancellation changes */}
        <div className="pl-7.5 space-y-1">
          <p className="text-caption text-muted-foreground">
            {t('ct_timezone_notice')}
            {trip?.timeZone ? ` · ${trip.timeZone}` : ''}
          </p>
          <p className="text-caption text-muted-foreground">{t('rd_cancel_changes_short')}</p>
        </div>
      </div>

      {/* ── Subsection 3: Deposit Policy ── */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2.5 text-title font-semibold text-foreground">
          <CreditCard className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_deposit_policy_title')}</h3>
        </div>
        <div className="text-body text-foreground-secondary leading-relaxed pl-7.5 space-y-1">
          <p className="font-medium text-foreground">
            {depositAmount === 0
              ? t('rd_no_deposit')
              : t('rd_deposit_brief').replace('{amount}', formattedDeposit)}
          </p>
          <p className="text-caption text-foreground-secondary">{t('rd_deposit_preauth_desc')}</p>
        </div>
      </div>

      {/* ── Subsection 4: Mileage Policy ── */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2.5 text-title font-semibold text-foreground">
          <Gauge className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_mileage_policy_title')}</h3>
        </div>
        <div className="text-body text-foreground-secondary leading-relaxed pl-7.5 space-y-1">
          <p className="font-medium text-foreground">{mileageTitle}</p>
          <p className="text-caption text-foreground-secondary">{mileageDesc}</p>
        </div>
      </div>

      {/* ── Subsection 5: Fuel Policy ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-title font-semibold text-foreground">
          <Fuel className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_fuel')}</h3>
        </div>
        <div className="text-body text-foreground-secondary leading-relaxed pl-7.5 space-y-1">
          <p className="font-medium text-foreground">{fuelTitle}</p>
          <p className="text-caption text-foreground-secondary">{fuelDesc}</p>
        </div>
      </div>
    </section>
  );
}
