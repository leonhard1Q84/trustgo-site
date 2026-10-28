'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import type { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import type { RatePricingBreakdown } from '../domain/types';
import { getEquipmentChargeLines, type SpecialEquipmentSelection } from '../domain/equipment';

interface RatePriceBreakdownProps {
  vehicle: FleetVehicle;
  pricing: RatePricingBreakdown;
  insuranceName: string;
  equipment?: SpecialEquipmentSelection;
  lang: RouteLanguage;
}

function PriceGroup({
  title,
  amount,
  children,
}: {
  title: string;
  amount: string;
  children: ReactNode;
}) {
  return (
    <details open className="group py-2">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-control text-body font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <span>{title}</span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-foreground-secondary transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
        <span className="shrink-0 tabular-nums">{amount}</span>
      </summary>
      <dl className="space-y-3 pb-3 pt-1 text-caption text-foreground-secondary">{children}</dl>
    </details>
  );
}

function PriceLine({
  label,
  amount,
  calculation,
}: {
  label: string;
  amount?: string;
  calculation?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
      <dt className="min-w-0 flex-1">{label}</dt>
      {amount && <dd className="shrink-0 text-right tabular-nums">{amount}</dd>}
      {calculation && <dd className="w-full">{calculation}</dd>}
    </div>
  );
}

export function RatePriceBreakdown({
  vehicle,
  pricing,
  insuranceName,
  equipment,
  lang,
}: RatePriceBreakdownProps) {
  const { t } = useI18n(lang);
  const number = new Intl.NumberFormat(lang === 'zh' ? 'zh-Hant' : lang, {
    maximumFractionDigits: 2,
  });
  const money = (amount: number) => `${pricing.currency}${number.format(amount)}`;
  const calculation = (rate: number, days: number) =>
    t('rd_daily_calculation').replace('{rate}', money(rate)).replace('{days}', number.format(days));
  const equipmentLines = equipment ? getEquipmentChargeLines(equipment, pricing.rentalDays) : [];
  const equipmentNameKeys = {
    infantSeat: 'eq_infant_name',
    childSeat: 'eq_child_name',
    boosterSeat: 'eq_booster_name',
    gpsNavigation: 'eq_gps_name',
    snowChains: 'eq_snow_name',
  };

  return (
    <section aria-label={t('rate_price_details')}>
      <h3 className="mb-2 text-body font-semibold">{t('rate_price_details')}</h3>
      <div className="divide-y divide-border">
        <PriceGroup title={t('bm_daily_rate_calc')} amount={money(pricing.baseRentalSubtotal)}>
          <PriceLine
            label={calculation(pricing.dailyRate, pricing.rentalDays)}
            amount={money(pricing.baseRentalSubtotal)}
          />
          <PriceLine
            label={
              vehicle.mileagePolicy === 'Unlimited Mileage'
                ? t('fleet_feature_unlimited_mileage')
                : t('results_policy_limited_mileage').replace('{km}', number.format(250))
            }
          />
        </PriceGroup>
        <PriceGroup
          title={t('rd_price_insurance')}
          amount={
            pricing.insuranceSubtotal === 0 ? t('rate_included') : money(pricing.insuranceSubtotal)
          }
        >
          <PriceLine
            label={insuranceName}
            amount={
              pricing.insuranceSubtotal === 0
                ? t('rate_included')
                : money(pricing.insuranceSubtotal)
            }
          />
          {pricing.insuranceDailyRate > 0 && (
            <PriceLine label={calculation(pricing.insuranceDailyRate, pricing.rentalDays)} />
          )}
        </PriceGroup>
        <PriceGroup title={t('rate_equipment_addons')} amount={money(pricing.equipmentSubtotal)}>
          {equipmentLines.length > 0 ? (
            equipmentLines.map((line) => (
              <PriceLine
                key={line.id}
                label={`${t(equipmentNameKeys[line.id])} × ${number.format(line.quantity)}`}
                amount={money(line.amount)}
                calculation={calculation(line.dailyRate, line.chargeDays)}
              />
            ))
          ) : (
            <PriceLine
              label={
                pricing.equipmentSubtotal > 0 ? t('rate_equipment_addons') : t('rd_no_equipment')
              }
            />
          )}
        </PriceGroup>
        <PriceGroup
          title={t('rd_price_fees')}
          amount={money(pricing.specialFeesSubtotal + pricing.taxesAndFees)}
        >
          {pricing.specialFees.map((fee) => (
            <PriceLine key={fee.labelKey} label={t(fee.labelKey)} amount={money(fee.amount)} />
          ))}
          <PriceLine label={t('rate_taxes_fees')} amount={money(pricing.taxesAndFees)} />
        </PriceGroup>
      </div>
    </section>
  );
}
