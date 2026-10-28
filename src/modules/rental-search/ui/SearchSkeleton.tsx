'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/shared/ui/skeleton';
import { normalizeRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { SearchLoadingProgressBar } from './SearchExpiryDialog';

/** Mirrors the sticky results-page search summary (SearchSummaryBar). */
export function SearchBarSkeleton() {
  return (
    <div className="border-b border-border bg-background" role="status" aria-busy="true" aria-label="Loading search">
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-full rounded-full md:w-2/3" />
      </div>
    </div>
  );
}

/** Mirrors VehicleGroupCard: vehicle header + depot offer rows. */
export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-background" role="status" aria-busy="true">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
        <Skeleton className="aspect-4/3 w-full rounded-control sm:w-56" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-t border-border px-5 py-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="h-11 w-24 rounded-control" />
        </div>
      ))}
    </div>
  );
}

export function RentalResultsSkeleton({
  count = 3,
  includeSearchBar = true,
}: {
  count?: number;
  includeSearchBar?: boolean;
}) {
  const params = useParams();
  const lang = normalizeRouteLanguage(
    typeof params?.lang === 'string' ? params.lang : undefined
  );
  const loadingLabel = getTranslation('search_loading_vehicles', lang);

  return (
    <div className="min-h-dvh bg-background" role="status" aria-live="polite" aria-busy="true" aria-label="Loading vehicles">
      {includeSearchBar && <SearchBarSkeleton />}
      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-full" />
        </div>
        <SearchLoadingProgressBar label={loadingLabel} />
        <div className="space-y-6">
          {Array.from({ length: count }).map((_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
