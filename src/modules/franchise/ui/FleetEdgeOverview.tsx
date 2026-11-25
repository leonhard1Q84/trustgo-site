'use client';

import { useState } from 'react';
import { ArrowRight, CalendarRange, CheckCircle2, Globe2, TrendingUp } from 'lucide-react';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';

type DashboardTab = 'operations' | 'distribution';

export function FleetEdgeOverview({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  const numberFormat = new Intl.NumberFormat(htmlLangMap[lang]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('operations');
  const isOperations = activeTab === 'operations';

  return (
    <div className="relative mx-auto w-full max-w-xl sm:pt-12 lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-2 top-16 rounded-card bg-brand/15 blur-2xl"
      />
      <div className="absolute right-2 top-0 z-10 hidden max-w-xs items-start gap-2 rounded-card bg-card p-3 shadow-overlay sm:flex">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-caption font-semibold text-foreground">
            {t('franchise_dashboard_sync_title')}
          </p>
          <p className="mt-0.5 text-caption text-muted-foreground">
            {t('franchise_dashboard_sync_desc')}
          </p>
        </div>
      </div>

      {/* Clean, Restrained Enterprise Dashboard Card */}
      <div className="relative rounded-card bg-card p-5 shadow-overlay sm:p-6">
        {/* Window Chrome Header — No invented labels */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </div>

          <div
            role="tablist"
            aria-label={t('franchise_console_title')}
            className="flex rounded-control bg-muted p-1"
          >
            {(['operations', 'distribution'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`min-h-11 rounded-tag px-3.5 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTab === tab
                    ? 'bg-background text-primary shadow-raised'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {tab === 'operations'
                  ? t('franchise_dashboard_tab_operations')
                  : t('franchise_dashboard_tab_distribution')}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-4 sm:grid-cols-5">
          <div className="rounded-control bg-muted/70 p-4 sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-control ${
                  isOperations
                    ? 'bg-brand-light text-primary'
                    : 'bg-success-light text-success'
                }`}
              >
                {isOperations ? (
                  <Globe2 className="size-5" aria-hidden="true" />
                ) : (
                  <TrendingUp className="size-5" aria-hidden="true" />
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 text-caption font-medium text-foreground-secondary">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                {t('franchise_always_online')}
              </span>
            </div>
            <h3 className="mt-4 text-title font-semibold text-foreground">
              {isOperations ? 'Trip.com / Booking.com' : t('franchise_dashboard_pricing')}
            </h3>
            <p className="mt-1 text-caption text-foreground-secondary">
              {isOperations
                ? t('franchise_dashboard_channels')
                : t('franchise_cap_pricing_badge')}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[isOperations ? 'franchise_module_channels' : 'franchise_module_fleet', 'franchise_module_orders'].map(
                (key) => (
                  <span
                    key={key}
                    className="rounded-full bg-background px-2.5 py-1 text-caption text-foreground-secondary"
                  >
                    {t(key)}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="rounded-control bg-brand-light/60 p-4 sm:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-caption font-medium text-foreground-secondary">
                {isOperations
                  ? t('franchise_dashboard_bookings')
                  : t('franchise_dashboard_visual_caption')}
              </p>
              {isOperations ? (
                <CalendarRange className="size-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>

            <svg
              viewBox="0 0 260 84"
              className="mt-3 h-24 w-full text-primary"
              aria-hidden="true"
            >
              <path
                d={
                  isOperations
                    ? 'M0 62 C32 58 48 42 78 46 C108 50 126 28 158 32 C190 36 210 18 260 14 L260 84 L0 84 Z'
                    : 'M0 68 C28 62 52 56 84 40 C116 24 148 36 180 22 C212 10 236 12 260 6 L260 84 L0 84 Z'
                }
                fill="currentColor"
                opacity="0.12"
              />
              <path
                d={
                  isOperations
                    ? 'M0 62 C32 58 48 42 78 46 C108 50 126 28 158 32 C190 36 210 18 260 14'
                    : 'M0 68 C28 62 52 56 84 40 C116 24 148 36 180 22 C212 10 236 12 260 6'
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="260"
                cy={isOperations ? '14' : '6'}
                r="4"
                fill="currentColor"
                stroke="var(--color-background)"
                strokeWidth="2"
              />
            </svg>
            <p className="mt-2 text-caption text-muted-foreground">
              {t('franchise_dashboard_visual_caption')}
            </p>
          </div>
        </div>

        {/* Hero Metric Banner (Today Global Orders) */}
        <div className="mt-4 rounded-card bg-gradient-to-r from-brand-deep via-primary to-primary-hover p-4 text-background shadow-raised sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-caption text-background/70">{t('franchise_stat_vehicles')}</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-3xl font-bold tracking-tight text-background">
                  + {numberFormat.format(2000)}
                </span>
                <span className="rounded-full bg-background/15 px-2.5 py-0.5 text-caption font-medium text-background">
                  FleetEdge
                </span>
              </div>
              <p className="mt-1 text-caption text-background/70">
                {t('franchise_dashboard_dispatch')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex h-11 items-end gap-1" aria-hidden="true">
                {[42, 64, 52, 76, 60, 88, 100].map((height, index) => (
                  <span
                    key={height + index}
                    style={{ height: `${height}%` }}
                    className={`w-1.5 rounded-tag ${index === 6 ? 'bg-brand' : 'bg-background/25'}`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption font-medium text-background/80">
                <span>{t('franchise_ota_channel')}</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="font-semibold text-background">FleetEdge</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{t('franchise_ops_label')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
