'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Check, ChevronDown, Fuel, Gauge, Info, MapPin, Users } from 'lucide-react';
import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { useIsTabletUp } from '@/shared/ui/use-media-query';
import { cn } from '@/shared/ui/utils';
import type { StoreOffer } from '../domain/store-offers';
import type { PricedOffer, VehicleGroup } from '../application/vehicle-group-aggregator';
import {
  localizeCounterType, localizeFuelType, localizeTransmission, localizeVehicleCategory,
  localizeVehicleName, splitVehicleName,
} from '../domain/vehicleLocalization';

type PolicyTone = 'extra' | 'positive' | 'neutral' | 'notice';

interface PolicyItem {
  tone: PolicyTone;
  text: string;
}

/** Selling-point row is capped (Component Library §3.1); strongest points win the slots. */
const MAX_POLICIES = 6;

type PolicySource = Pick<
  StoreOffer,
  'cancellationFreeHours' | 'depositAmount' | 'currency' | 'mileagePolicy' | 'fuelPolicy' | 'selfService' | 'openAllHours' | 'inclusions'
>;

const INCLUSION_LABELS: Record<StoreOffer['inclusions'][number], string> = {
  additional_driver: 'rs_filter_free_additional_driver',
  gps: 'rs_filter_free_gps',
  winter_tyres: 'rs_filter_winter_tyres',
};

/**
 * Per-offer selling points in fixed priority: free extras (blue) → money-back positives (green)
 * → routine conveniences (neutral) → cost warnings (orange). Mirrors OTA cards so the eye can
 * scan by color instead of reading every line.
 */
export function getPolicyItems(source: PolicySource, t: (key: string) => string): PolicyItem[] {
  const extras: PolicyItem[] = source.inclusions.map((inclusion) => ({ tone: 'extra', text: t(INCLUSION_LABELS[inclusion]) }));
  const positives: PolicyItem[] = [];
  const neutrals: PolicyItem[] = [];
  const notices: PolicyItem[] = [];

  if (source.cancellationFreeHours > 0) {
    positives.push({ tone: 'positive', text: t('results_free_cancel_hours').replace('{hours}', String(source.cancellationFreeHours)) });
  } else {
    notices.push({ tone: 'notice', text: t('results_policy_non_refundable') });
  }
  if (source.depositAmount > 0) {
    notices.push({ tone: 'notice', text: t('results_policy_deposit').replace('{amount}', `${source.currency}${source.depositAmount}`) });
  } else {
    positives.push({ tone: 'positive', text: t('results_policy_deposit_free') });
  }
  const km = source.mileagePolicy.match(/(\d+)\s*km/)?.[1];
  if (km) {
    notices.push({ tone: 'notice', text: t('results_policy_limited_mileage').replace('{km}', km) });
  } else {
    neutrals.push({ tone: 'neutral', text: t('rs_filter_unlimited_mileage') });
  }
  if (source.fuelPolicy === 'Pre-purchase') {
    notices.push({ tone: 'notice', text: t('results_policy_prepaid_fuel') });
  } else {
    neutrals.push({ tone: 'neutral', text: t('rs_filter_full_to_full') });
  }
  if (source.selfService) neutrals.push({ tone: 'neutral', text: t('rs_filter_self_service') });
  if (source.openAllHours) neutrals.push({ tone: 'neutral', text: t('rs_filter_open_24h') });

  return [...extras, ...positives, ...neutrals, ...notices].slice(0, MAX_POLICIES);
}

const TONE_STYLES: Record<PolicyTone, { item: string; icon: string }> = {
  extra: { item: 'text-primary font-medium', icon: 'text-primary' },
  positive: { item: 'text-success font-medium', icon: 'text-success' },
  neutral: { item: 'text-foreground-secondary', icon: 'text-muted-foreground' },
  notice: { item: 'text-warning', icon: 'text-warning' },
};

function PolicyList({ items }: { items: PolicyItem[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm leading-6">
      {items.map((policy) => {
        const tone = TONE_STYLES[policy.tone];
        const Icon = policy.tone === 'notice' ? Info : Check;
        return (
          <li key={policy.text} className={cn('flex items-center gap-1.5', tone.item)}>
            <Icon className={cn('h-4 w-4 shrink-0', tone.icon)} aria-hidden="true" />
            <span className="truncate">{policy.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

interface VehicleGroupCardProps {
  group: VehicleGroup;
  lang: RouteLanguage;
  rentalDays: number;
  buildHref: (offer: PricedOffer) => string;
}

/**
 * Dense list card: small image | model + specs + nearest depot offer | price + Select.
 * Other nearby depots stay collapsed behind "View N more depots".
 */
export function VehicleGroupCard({ group, lang, rentalDays, buildHref }: VehicleGroupCardProps) {
  const t = (k: string) => getTranslation(k, lang);
  const language = routeToLanguage(lang);
  const isTabletUp = useIsTabletUp();
  const [expanded, setExpanded] = useState(false);
  const { vehicle: car } = group;
  const [primary, ...others] = group.offers;
  const name = localizeVehicleName(car.name, lang);
  const { model, orSimilar } = splitVehicleName(car.name, lang);

  // PC / tablet: Rate Details in a new tab keeps the list for comparison; H5 stays in the same tab.
  const linkProps = isTabletUp ? { target: '_blank', rel: 'noopener' } : {};

  const storeLine = (offer: PricedOffer) => (
    <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-sm leading-6 text-foreground-secondary">
      <MapPin className="h-4 w-4 shrink-0 text-foreground-secondary" aria-hidden="true" />
      <span className="font-medium text-foreground">{offer.storeNames[language] ?? offer.storeNames.EN}</span>
      <span>· {localizeCounterType(offer.counterType, lang)} · {offer.distanceKm} km</span>
      {offer.isLowestPrice && (
        <span className="rounded-full bg-warm-light px-2 text-xs font-medium leading-5 text-warm-strong">{t('results_tag_lowest')}</span>
      )}
    </p>
  );

  const selectLink = (offer: PricedOffer, size: 'md' | 'sm') => (
    <Link
      href={buildHref(offer)}
      {...linkProps}
      className={cn(
        'inline-flex items-center justify-center rounded-control font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        size === 'md'
          ? 'h-11 w-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary-hover md:w-32'
          : 'h-9 min-w-20 border border-foreground px-4 text-sm text-foreground hover:bg-muted'
      )}
    >
      {t('results_select')}
      {isTabletUp && <span className="sr-only"> ({t('common_opens_new_tab')})</span>}
    </Link>
  );

  const price = (offer: PricedOffer, align: 'right' | 'left' = 'right') => (
    <div className={align === 'right' ? 'md:text-right' : undefined}>
      <p className="text-2xl font-semibold leading-tight tabular-nums text-foreground">
        {offer.currency}
        {offer.totalPrice}
      </p>
      <p className="mt-1 text-xs leading-5 tabular-nums text-muted-foreground">
        {t('search_rental_days').replace('{days}', String(rentalDays))} · {t('results_price_per_day').replace('{price}', `${offer.currency}${offer.pricePerDay}`)}
      </p>
    </div>
  );

  return (
    <article className="rounded-card border border-border bg-background">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        {/* Small image keeps the row dense */}
        <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-control bg-muted sm:w-52 lg:w-44">
          <Image src={car.image} alt={name} fill sizes="(min-width: 640px) 208px, 100vw" className="object-contain" />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold leading-snug text-foreground">
              {model}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {orSimilar ? `${orSimilar} · ` : ''}
                {localizeVehicleCategory(car.category, lang)}
              </span>
            </h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-6 text-foreground-secondary">
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" aria-hidden="true" />{car.seats}</span>
              <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" aria-hidden="true" />{car.bags}</span>
              <span className="inline-flex items-center gap-1"><Gauge className="h-4 w-4" aria-hidden="true" />{localizeTransmission(car.gear, lang)}</span>
              <span className="inline-flex items-center gap-1"><Fuel className="h-4 w-4" aria-hidden="true" />{localizeFuelType(car.fuel, lang)}</span>
            </p>
          </div>
          <div className="space-y-1">
            {storeLine(primary)}
            <PolicyList items={getPolicyItems(primary, t)} />
          </div>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4 border-t border-border pt-3 sm:min-w-36 sm:flex-col sm:items-end sm:gap-4 sm:self-stretch sm:justify-center sm:border-0 sm:pt-0 sm:text-right">
          {price(primary)}
          {selectLink(primary, 'md')}
        </div>
      </div>

      {others.length > 0 && (
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex h-11 w-full items-center justify-center gap-1 text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
          >
            {expanded
              ? t('results_hide_depots')
              : t('results_more_depots').replace('{count}', String(others.length))}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          </button>
          {expanded && (
            <ul className="divide-y divide-border border-t border-border">
              {others.map((offer) => (
                <li key={offer.offerId} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
                  <div className="min-w-0 flex-1 space-y-1">
                    {storeLine(offer)}
                    <PolicyList items={getPolicyItems(offer, t)} />
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-4">
                    <p className="text-base font-semibold tabular-nums text-foreground">
                      {offer.currency}
                      {offer.totalPrice}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {t('results_price_per_day').replace('{price}', `${offer.currency}${offer.pricePerDay}`)}
                      </span>
                    </p>
                    {selectLink(offer, 'sm')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
