'use client';

import React, { useMemo, useState } from 'react';
import {
  FilterX,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react';
import { type RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { FilterChip } from '@/shared/ui/filter-chip';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import { useSearchExpiry, SearchRefreshSkeleton } from '@/modules/rental-search/ui/SearchExpiryDialog';
import type { StoreOffer } from '@/modules/rental-search/domain/store-offers';
import { aggregateVehicleGroups, type VehicleGroup } from '@/modules/rental-search/application/vehicle-group-aggregator';
import { TravelVehicleIllustration } from '@/shared/ui/illustrations/TravelVehicleIllustration';
import { SkylineHorizon } from '@/shared/ui/illustrations/SkylineHorizon';
import { VehicleGroupCard } from './vehicle-group-card';

type CategoryFilter = 'all' | 'suv' | 'sedan' | 'people_mover';
type SortKey = 'recommended' | 'price_low' | 'rating' | 'size';

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'rent_filter_all' },
  { key: 'suv', label: 'rent_filter_suv' },
  { key: 'sedan', label: 'rent_filter_sedan' },
  { key: 'people_mover', label: 'rent_filter_people_mover' },
];

function matchesCategory(car: FleetVehicle, filter: CategoryFilter) {
  const category = car.category.toLowerCase();
  if (filter === 'suv') return category.includes('suv');
  if (filter === 'people_mover') return category.includes('van') || category.includes('people');
  if (filter === 'sedan') return category.includes('sedan') || category.includes('hatchback') || category.includes('compact');
  return true;
}

const SORTERS: Record<SortKey, (a: VehicleGroup, b: VehicleGroup) => number> = {
  recommended: () => 0,
  price_low: (a, b) => a.fromTotal - b.fromTotal,
  rating: (a, b) => b.vehicle.rating - a.vehicle.rating,
  size: (a, b) => b.vehicle.seats - a.vehicle.seats || b.vehicle.bags - a.vehicle.bags,
};

interface RentalResultsViewProps {
  offers: StoreOffer[];
  vehicles: FleetVehicle[];
  lang: RouteLanguage;
  pickupLocation: string;
  licenseCountry: string;
  rentalDays: number;
  searchParams: Record<string, string | string[] | undefined>;
  docNotice?: { isWarning: boolean; text: string } | null;
  onEditSearch?: () => void;
}

export function RentalResultsView({
  vehicles, offers, lang, pickupLocation, licenseCountry, rentalDays, searchParams, docNotice,
}: RentalResultsViewProps) {
  const t = (k: string) => getTranslation(k, lang);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  const [noticeOpen, setNoticeOpen] = useState(true);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [depositFree, setDepositFree] = useState(false);

  const { searchExpiryDialog, isSearchRefreshing } = useSearchExpiry({
    isActive: true,
    resetKey: `${pickupLocation}-${licenseCountry}-${rentalDays}`,
    onRefresh: async () => window.location.reload(),
    lang,
  });

  const allGroups = useMemo(
    () => aggregateVehicleGroups(vehicles, offers, rentalDays),
    [vehicles, offers, rentalDays]
  );

  const visible = useMemo(
    () =>
      aggregateVehicleGroups(
        vehicles.filter((car) => matchesCategory(car, category)),
        offers,
        rentalDays,
        { freeCancellation, depositFree }
      ).sort(SORTERS[sortBy]),
    [vehicles, offers, category, sortBy, rentalDays, freeCancellation, depositFree]
  );

  const detailQuery = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') params.set(key, value);
    });
    params.set('days', String(rentalDays));
    params.set('licenseCountry', licenseCountry);
    params.set('pickup', pickupLocation);
    return params.toString();
  }, [searchParams, rentalDays, licenseCountry, pickupLocation]);

  if (isSearchRefreshing) {
    return (
      <div className="py-6">
        <SearchRefreshSkeleton variant="results" label={t('search_refresh_results')} />
      </div>
    );
  }

  return (
    <>
      {searchExpiryDialog}
      <h1 className="sr-only">{t('rent_page_title')}</h1>

      {/* 1. 全程无可用车辆（Genuine 0-inventory state for trip criteria） */}
      {allGroups.length === 0 ? (
        <div className="relative flex-1 flex flex-col justify-between w-full">
          {/* Single, dismissible document requirement notice */}
          {docNotice && noticeOpen && (
            <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-4">
              <div
                role="status"
                className={`flex items-start gap-2.5 rounded-control px-4 py-3 text-sm ${
                  docNotice.isWarning ? 'bg-warning-light text-warning' : 'bg-brand-light text-primary-hover'
                }`}
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="flex-1 leading-relaxed">{docNotice.text}</p>
                <button
                  type="button"
                  onClick={() => setNoticeOpen(false)}
                  aria-label={t('common_close')}
                  className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-background/60 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* 核心主视觉：无边框、无多余卡片，留白居中，与 404 页面设计语言统一 */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16">
            <div className="w-full max-w-lg mx-auto text-center space-y-6 sm:space-y-7">
              <div className="w-full px-2">
                <TravelVehicleIllustration variant="empty-search" className="w-full max-w-sm sm:max-w-md mx-auto" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t('results_empty_title')}
              </h2>
            </div>
          </div>

          {/* 底部通栏手绘都市天际线地平线 (与 404 同款自然底衬) */}
          <div className="relative w-full z-0 pointer-events-none mt-auto">
            <SkylineHorizon className="w-full h-24 sm:h-36 -mb-1" opacity={0.28} />
          </div>
        </div>
      ) : (
        /* 2. 有可用库存车辆 */
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 flex-1">
          {/* Single, dismissible document requirement notice */}
          {docNotice && noticeOpen && (
            <div
              role="status"
              className={`mb-4 flex items-start gap-2.5 rounded-control px-4 py-3 text-sm ${
                docNotice.isWarning ? 'bg-warning-light text-warning' : 'bg-brand-light text-primary-hover'
              }`}
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1 leading-relaxed">{docNotice.text}</p>
              <button
                type="button"
                onClick={() => setNoticeOpen(false)}
                aria-label={t('common_close')}
                className="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-background/60 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Filters & sort */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
              {CATEGORY_FILTERS.map((f) => (
                <FilterChip key={f.key} selected={category === f.key} onClick={() => setCategory(f.key)}>
                  {t(f.label)}
                </FilterChip>
              ))}
              <span className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />
              <FilterChip selected={freeCancellation} onClick={() => setFreeCancellation((v) => !v)}>
                {t('fleet_feature_free_cancellation')}
              </FilterChip>
              <FilterChip selected={depositFree} onClick={() => setDepositFree((v) => !v)}>
                {t('results_policy_deposit_free')}
              </FilterChip>
            </div>
            <label className="flex shrink-0 items-center gap-2 text-sm text-foreground-secondary">
              <span>{t('results_sort_label')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="h-9 rounded-full border border-border-strong bg-background px-3 text-sm font-medium text-foreground focus:border-foreground focus:outline-none cursor-pointer"
              >
                <option value="recommended">{t('results_sort_recommended')}</option>
                <option value="price_low">{t('results_sort_price')}</option>
                <option value="rating">{t('results_sort_rating')}</option>
                <option value="size">{t('results_sort_size')}</option>
              </select>
            </label>
          </div>

          <p className="mt-4 text-sm text-foreground-secondary">
            {t('results_count').replace('{count}', String(visible.length))}
          </p>

          {/* 3. 筛选无匹配分支（Filtered to 0） */}
          {visible.length === 0 ? (
            <section
              aria-label={t('results_filter_empty_title')}
              className="mx-auto my-8 max-w-lg rounded-card border border-border/80 bg-background px-6 py-8 text-center"
            >
              <FilterX className="mx-auto h-10 w-10 text-foreground-secondary" aria-hidden="true" />
              <h2 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {t('results_filter_empty_title')}
              </h2>
              <p className="mt-2 text-sm text-foreground-secondary leading-relaxed">
                {t('results_filter_empty_desc').replace('{count}', String(allGroups.length))}
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('all');
                    setFreeCancellation(false);
                    setDepositFree(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-raised hover:shadow-overlay focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 active:scale-[0.99] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t('results_clear_filters')}
                </button>
              </div>
            </section>
          ) : (
            /* 4. 正常车辆列表卡片 */
            <div className="mt-5 space-y-4">
              {visible.map((group) => (
                <VehicleGroupCard
                  key={group.vehicle.id}
                  group={group}
                  lang={lang}
                  rentalDays={rentalDays}
                  buildHref={(offer) =>
                    `/${lang}/rent/${group.vehicle.id}?${detailQuery}&offer=${encodeURIComponent(offer.offerId)}`
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
