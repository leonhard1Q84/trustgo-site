'use client';

import {
  BarChart3,
  CalendarRange,
  Car,
  DollarSign,
  Globe2,
  Network,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';

interface FleetEdgeRadialDiagramProps {
  lang: RouteLanguage;
}

export function FleetEdgeRadialDiagram({ lang }: FleetEdgeRadialDiagramProps) {
  const { t } = useI18n(lang);

  // The 7 explicit core capabilities — Clean, No abused subtitles or redundant badges
  const accentStyles = {
    primary: 'bg-muted text-foreground-secondary',
    warm: 'bg-warm/10 text-warm',
    success: 'bg-success/10 text-success',
  } as const;

  const leftWingCapabilities = [
    {
      id: 'channels',
      icon: Network,
      accent: 'primary' as const,
      keyTitle: 'franchise_cap_channels_title',
      keyDesc: 'franchise_cap_channels_desc',
    },
    {
      id: 'pricing',
      icon: TrendingUp,
      accent: 'warm' as const,
      keyTitle: 'franchise_cap_pricing_title',
      keyDesc: 'franchise_cap_pricing_desc',
    },
    {
      id: 'yield',
      icon: DollarSign,
      accent: 'success' as const,
      keyTitle: 'franchise_cap_yield_title',
      keyDesc: 'franchise_cap_yield_desc',
    },
  ];

  const rightWingCapabilities = [
    {
      id: 'fleet',
      icon: Car,
      accent: 'success' as const,
      keyTitle: 'franchise_cap_fleet_title',
      keyDesc: 'franchise_cap_fleet_desc',
    },
    {
      id: 'dispatch',
      icon: CalendarRange,
      accent: 'primary' as const,
      keyTitle: 'franchise_cap_dispatch_title',
      keyDesc: 'franchise_cap_dispatch_desc',
    },
    {
      id: 'mobile',
      icon: Smartphone,
      accent: 'warm' as const,
      keyTitle: 'franchise_cap_mobile_title',
      keyDesc: 'franchise_cap_mobile_desc',
    },
  ];

  const biCapability = {
    id: 'reports',
    icon: BarChart3,
    accent: 'primary' as const,
    keyTitle: 'franchise_cap_reports_title',
    keyDesc: 'franchise_cap_reports_desc',
  };

  return (
    <div className="w-full">
      {/* Clean 3-Column Grid without redundant categories, badges, or subtitles */}
      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-3.5 lg:grid-cols-12 lg:gap-5">
          {/* Left Wing (3 clean cards) */}
          <div className="space-y-3 lg:col-span-4">
            {leftWingCapabilities.map((cap) => {
              const Icon = cap.icon;
              const accent = accentStyles[cap.accent];
              return (
                <div
                  key={cap.id}
                  className="w-full rounded-card border border-border bg-card p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-control ${accent}`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-body font-semibold text-foreground">{t(cap.keyTitle)}</h3>
                      <p className="mt-1 text-caption text-foreground-secondary leading-normal">
                        {t(cap.keyDesc)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Hub: FleetEdge Core */}
          <div className="flex flex-col items-center justify-center py-2 lg:col-span-4 lg:py-0">
            <div className="flex size-44 sm:size-48 flex-col items-center justify-center rounded-full border-2 border-border bg-card p-4 text-center shadow-xs">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-1.5">
                <Globe2 className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-title font-black tracking-tight text-foreground">FleetEdge</h3>
              <span className="text-caption font-semibold text-foreground-secondary">
                {t('franchise_core_hub')}
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-caption font-medium text-success">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                <span>{t('franchise_always_online')}</span>
              </div>
            </div>
          </div>

          {/* Right Wing (3 clean cards) */}
          <div className="space-y-3 lg:col-span-4">
            {rightWingCapabilities.map((cap) => {
              const Icon = cap.icon;
              const accent = accentStyles[cap.accent];
              return (
                <div
                  key={cap.id}
                  className="w-full rounded-card border border-border bg-card p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-control ${accent}`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-body font-semibold text-foreground">{t(cap.keyTitle)}</h3>
                      <p className="mt-1 text-caption text-foreground-secondary leading-normal">
                        {t(cap.keyDesc)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Foundation Anchor Module (Visual Operational BI) */}
        <div className="mt-3.5">
          <div className="w-full rounded-card border border-border bg-card p-4 text-left">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-control ${accentStyles[biCapability.accent]}`}
              >
                <BarChart3 className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-body font-semibold text-foreground">
                  {t(biCapability.keyTitle)}
                </h3>
                <p className="mt-0.5 text-caption text-foreground-secondary leading-normal">
                  {t(biCapability.keyDesc)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
