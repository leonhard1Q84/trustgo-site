'use client';

import { Globe2, TrendingUp } from 'lucide-react';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';

export function FleetEdgeOverview({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  const numberFormat = new Intl.NumberFormat(htmlLangMap[lang]);
  const growth = new Intl.NumberFormat(htmlLangMap[lang], {
    style: 'percent',
    signDisplay: 'always',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(0.184);
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Clean, Restrained Enterprise Dashboard Card */}
      <div className="rounded-card border border-border bg-card p-5 sm:p-6">
        {/* Window Chrome Header — No invented labels */}
        <div className="flex items-center gap-1.5 border-b border-border pb-3.5 mb-4">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>

        {/* Dashboard Content */}
        <div className="space-y-3">
          {/* Top Two Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {/* OTA Direct Channels */}
            <div className="rounded-control border border-border/80 bg-muted/40 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <Globe2 className="size-4 text-primary" />
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <div className="mt-3">
                <span className="block font-mono text-title font-bold text-foreground">
                  Trip / Booking
                </span>
                <span className="text-caption text-muted-foreground">
                  {t('franchise_dashboard_channels')}
                </span>
              </div>
            </div>

            {/* AI Dynamic Pricing */}
            <div className="col-span-2 rounded-control border border-border/80 bg-muted/40 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-caption font-semibold text-success font-mono">
                  {growth} RevPAC
                </span>
              </div>
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-4/5" />
                </div>
                <span className="mt-1.5 block text-caption text-muted-foreground">
                  {t('franchise_dashboard_pricing')}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Metric Banner (Today Global Orders) */}
          <div className="rounded-control bg-muted/40 p-4">
            <div className="text-caption font-medium text-foreground-secondary">
              {t('franchise_dashboard_bookings')}
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
                + {numberFormat.format(1284)}
              </span>
              <span className="text-caption text-foreground-secondary">
                {t('franchise_dashboard_dispatch')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
