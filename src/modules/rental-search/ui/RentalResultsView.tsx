'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  FilterX,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react';
import { type RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { FilterChip } from '@/shared/ui/filter-chip';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  CATEGORY_OPTIONS, EMPTY_FILTERS, FEATURE_GROUPS, countActiveFilters, isFilterSelected, matchesCategoryOption, toggleFilter, withOnly,
  type CategoryOption, type FilterOption, type ResultFilters,
} from '@/modules/rental-search/domain/result-filters';
import { useSearchExpiry, SearchRefreshSkeleton } from '@/modules/rental-search/ui/SearchExpiryDialog';
import type { StoreOffer } from '@/modules/rental-search/domain/store-offers';
import {
  aggregateVehicleGroups, filterVehicleGroups, type VehicleGroup,
} from '@/modules/rental-search/application/vehicle-group-aggregator';
import { TravelVehicleIllustration } from '@/shared/ui/illustrations/TravelVehicleIllustration';
import { SkylineHorizon } from '@/shared/ui/illustrations/SkylineHorizon';
import { VehicleGroupCard } from './vehicle-group-card';
import { useSearchNavigation } from './SearchNavigationProvider';
import { ResultFiltersDialog } from './result-filters-dialog';
import { ResultFilterPanel } from './result-filter-panel';
import { CategoryChipsRow } from './category-tiles';
import { FILTER_LABEL_KEYS } from './result-filter-labels';

type SortKey = 'recommended' | 'price_low' | 'size';

/** High-frequency filters kept outside the Filters dialog (Design Guidelines §9). */
const QUICK_FILTERS: FilterOption[] = [
  { facet: 'features', value: 'free_cancellation' },
  { facet: 'features', value: 'unlimited_mileage' },
  { facet: 'features', value: 'deposit_free' },
  { facet: 'transmission', value: 'Automatic' },
];

const SORTERS: Record<SortKey, (a: VehicleGroup, b: VehicleGroup) => number> = {
  recommended: () => 0,
  price_low: (a, b) => a.fromTotal - b.fromTotal,
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
  resultsCheckedAt?: string;
  resultsExpiresAt?: string;
}

export function RentalResultsView({
  vehicles, offers, lang, pickupLocation, licenseCountry, rentalDays, searchParams, docNotice,
  resultsCheckedAt, resultsExpiresAt,
}: RentalResultsViewProps) {
  const t = (k: string) => getTranslation(k, lang);
  const [filters, setFilters] = useState<ResultFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  const [noticeOpen, setNoticeOpen] = useState(true);
  const { refresh } = useSearchNavigation();

  const { searchExpiryDialog, isSearchRefreshing } = useSearchExpiry({
    isActive: offers.length > 0,
    resetKey: `${pickupLocation}-${licenseCountry}-${rentalDays}`,
    onRefresh: refresh,
    checkedAt: resultsCheckedAt,
    expiresAt: resultsExpiresAt,
    lang,
  });

  const allGroups = useMemo(
    () => aggregateVehicleGroups(vehicles, offers, rentalDays),
    [vehicles, offers, rentalDays]
  );

  const countFor = useCallback(
    (candidate: ResultFilters) => filterVehicleGroups(vehicles, offers, rentalDays, candidate).length,
    [vehicles, offers, rentalDays]
  );

  const availableFeatures = useMemo(
    () => new Set<string>(FEATURE_GROUPS.flatMap((g) => g.options).filter((f) => countFor({ ...EMPTY_FILTERS, features: [f] }) > 0)),
    [countFor]
  );

  /** Category is picked in the tiles row, so sidebar / sheet actions only touch the other facets. */
  const sheetFacetsCount = countActiveFilters({ ...filters, category: [] });
  const clearSheetFacets = (f: ResultFilters): ResultFilters => ({ ...EMPTY_FILTERS, category: f.category });

  const categoryStats = useMemo(() => {
    const base = filterVehicleGroups(vehicles, offers, rentalDays, { ...filters, category: [] });
    return CATEGORY_OPTIONS.map((option) => {
      const inCategory = base.filter((group) => matchesCategoryOption(group.vehicle, option));
      return { option, count: inCategory.length };
    });
  }, [vehicles, offers, rentalDays, filters]);

  const visible = useMemo(
    () => filterVehicleGroups(vehicles, offers, rentalDays, filters).sort(SORTERS[sortBy]),
    [vehicles, offers, rentalDays, filters, sortBy]
  );

  const quickFilters = QUICK_FILTERS.filter((option) => option.facet !== 'features' || availableFeatures.has(option.value));

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

          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8">
            {/* PC: always-visible checkbox filters; H5 / Tablet use the sheet below */}
            <aside
              aria-label={t('rs_filters')}
              className="hidden lg:sticky lg:top-40 lg:block lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto lg:rounded-card lg:border lg:border-border lg:px-4"
            >
              <div className="flex items-center justify-between border-b border-border py-3">
                <h2 className="text-base font-semibold text-foreground">{t('rs_filters')}</h2>
                {sheetFacetsCount > 0 && (
                  <Button variant="text" size="sm" className="h-8 px-1 text-sm" onClick={() => setFilters((f) => clearSheetFacets(f))}>
                    {t('rs_filter_clear_all')}
                  </Button>
                )}
              </div>
              <ResultFilterPanel
                filters={filters}
                onChange={setFilters}
                countFor={countFor}
                availableFeatures={availableFeatures}
                t={t}
                idPrefix="filter-side"
              />
            </aside>

            <div className="min-w-0">
              {/* Filters & sort */}
              <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 py-0.5 sm:-mx-6 sm:px-6 lg:hidden scrollbar-none">
                <ResultFiltersDialog
                  filters={filters}
                  onApply={setFilters}
                  countFor={countFor}
                  availableFeatures={availableFeatures}
                  t={t}
                />
                {quickFilters.map((option) => {
                  const selected = isFilterSelected(filters, option);
                  return (
                    <FilterChip
                      key={option.value}
                      selected={selected}
                      disabled={!selected && countFor(withOnly(filters, option)) === 0}
                      onClick={() => setFilters((f) => toggleFilter(f, option))}
                    >
                      {t(FILTER_LABEL_KEYS[option.value])}
                    </FilterChip>
                  );
                })}
              </div>

              <div className="mt-3 lg:mt-0">
                <CategoryChipsRow
                  stats={categoryStats}
                  selected={filters.category.length === 1 ? (filters.category[0] as CategoryOption) : null}
                  onSelect={(option) => setFilters((f) => ({ ...f, category: option ? [option] : [] }))}
                  t={t}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 lg:mt-0">
                <p className="text-sm text-foreground-secondary">
                  {t('results_count').replace('{count}', String(visible.length))}
                </p>
                <label className="flex shrink-0 items-center gap-2 text-sm text-foreground-secondary">
                  <span>{t('results_sort_label')}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="h-9 rounded-full border border-border-strong bg-background px-3 text-sm font-medium text-foreground focus:border-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="recommended">{t('results_sort_recommended')}</option>
                    <option value="price_low">{t('results_sort_price')}</option>
                    <option value="size">{t('results_sort_size')}</option>
                  </select>
                </label>
              </div>

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
                      onClick={() => setFilters(EMPTY_FILTERS)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-raised hover:shadow-overlay focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 active:scale-[0.99] cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      {t('results_clear_filters')}
                    </button>
                  </div>
                </section>
              ) : (
                /* 4. 正常车辆列表卡片 */
                <div className="mt-4 space-y-6">
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
          </div>
        </div>
      )}
    </>
  );
}
