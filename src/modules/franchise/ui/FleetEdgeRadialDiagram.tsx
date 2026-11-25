'use client';

import { useState } from 'react';
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

type Capability = {
  id: string;
  icon: typeof Network;
  keyTitle: string;
  keyDesc: string;
  keyBadge: string;
};

export function FleetEdgeRadialDiagram({ lang }: FleetEdgeRadialDiagramProps) {
  const { t } = useI18n(lang);
  const [activeId, setActiveId] = useState('channels');
  const capabilityTones: Record<string, string> = {
    channels: 'bg-brand-light text-primary',
    pricing: 'bg-brand-light text-primary',
    yield: 'bg-success-light text-success',
    fleet: 'bg-brand-light text-primary',
    dispatch: 'bg-brand-light text-primary',
    mobile: 'bg-success-light text-success',
    reports: 'bg-brand-light text-primary',
  };

  // The 7 explicit core capabilities — Clean, No abused subtitles or redundant badges
  const leftWingCapabilities: Capability[] = [
    {
      id: 'channels',
      icon: Network,
      keyTitle: 'franchise_cap_channels_title',
      keyDesc: 'franchise_cap_channels_desc',
      keyBadge: 'franchise_cap_channels_badge',
    },
    {
      id: 'pricing',
      icon: TrendingUp,
      keyTitle: 'franchise_cap_pricing_title',
      keyDesc: 'franchise_cap_pricing_desc',
      keyBadge: 'franchise_cap_pricing_badge',
    },
    {
      id: 'yield',
      icon: DollarSign,
      keyTitle: 'franchise_cap_yield_title',
      keyDesc: 'franchise_cap_yield_desc',
      keyBadge: 'franchise_cap_yield_badge',
    },
  ];

  const rightWingCapabilities: Capability[] = [
    {
      id: 'fleet',
      icon: Car,
      keyTitle: 'franchise_cap_fleet_title',
      keyDesc: 'franchise_cap_fleet_desc',
      keyBadge: 'franchise_cap_fleet_badge',
    },
    {
      id: 'dispatch',
      icon: CalendarRange,
      keyTitle: 'franchise_cap_dispatch_title',
      keyDesc: 'franchise_cap_dispatch_desc',
      keyBadge: 'franchise_cap_dispatch_badge',
    },
    {
      id: 'mobile',
      icon: Smartphone,
      keyTitle: 'franchise_cap_mobile_title',
      keyDesc: 'franchise_cap_mobile_desc',
      keyBadge: 'franchise_cap_mobile_badge',
    },
  ];

  const biCapability: Capability = {
    id: 'reports',
    icon: BarChart3,
    keyTitle: 'franchise_cap_reports_title',
    keyDesc: 'franchise_cap_reports_desc',
    keyBadge: 'franchise_cap_reports_badge',
  };

  function renderCapability(capability: Capability) {
    const Icon = capability.icon;
    const isActive = activeId === capability.id;

    return (
      <button
        key={capability.id}
        type="button"
        aria-pressed={isActive}
        onMouseEnter={() => setActiveId(capability.id)}
        onFocus={() => setActiveId(capability.id)}
        onClick={() => setActiveId(capability.id)}
        className={`w-full rounded-card p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isActive
            ? 'bg-background/20 shadow-overlay'
            : 'bg-background/10 hover:bg-background/15'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-control ${capabilityTones[capability.id]}`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <h3 className="text-body font-semibold text-background">{t(capability.keyTitle)}</h3>
              <span className="rounded-full bg-background/10 px-2.5 py-0.5 text-caption text-background/75">
                {t(capability.keyBadge)}
              </span>
            </div>
            <p className="mt-1.5 text-caption text-background/70">{t(capability.keyDesc)}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full">
      {/* Clean 3-Column Grid without redundant categories, badges, or subtitles */}
      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Left Wing (3 clean cards) */}
          <div className="space-y-3 lg:col-span-4">{leftWingCapabilities.map(renderCapability)}</div>

          {/* Center Hub: FleetEdge Core */}
          <div className="flex flex-col items-center justify-center py-6 lg:col-span-4 lg:py-0">
            <div className="relative flex size-56 items-center justify-center sm:size-64">
              <span aria-hidden="true" className="absolute inset-0 rounded-full bg-background/5" />
              <span aria-hidden="true" className="absolute inset-5 rounded-full bg-background/10" />
              <span aria-hidden="true" className="absolute inset-11 rounded-full bg-background/10" />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-3 size-2 -translate-x-1/2 rounded-full bg-brand"
              />
              <span
                aria-hidden="true"
                className="absolute right-8 top-1/2 size-2 -translate-y-1/2 rounded-full bg-brand"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-8 left-9 size-2 rounded-full bg-success-light"
              />
              <div className="relative flex size-40 flex-col items-center justify-center rounded-full bg-background p-4 text-center shadow-overlay sm:size-44">
                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-brand-light text-primary">
                  <Globe2 className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-title font-bold tracking-tight text-primary-hover">FleetEdge</h3>
                <span className="mt-0.5 text-caption font-medium text-foreground-secondary">
                  {t('franchise_core_hub')}
                </span>
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-caption font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                  <span>{t('franchise_always_online')}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-center text-caption text-background/65">
              {t('franchise_diagram_center_desc')}
            </p>
          </div>

          {/* Right Wing (3 clean cards) */}
          <div className="space-y-3 lg:col-span-4">{rightWingCapabilities.map(renderCapability)}</div>
        </div>

        {/* Foundation Anchor Module (Visual Operational BI) */}
        <div className="mt-4">
          <button
            type="button"
            aria-pressed={activeId === biCapability.id}
            onMouseEnter={() => setActiveId(biCapability.id)}
            onFocus={() => setActiveId(biCapability.id)}
            onClick={() => setActiveId(biCapability.id)}
            className={`w-full rounded-card p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5 ${
              activeId === biCapability.id
                ? 'bg-background/20 shadow-overlay'
                : 'bg-background/10 hover:bg-background/15'
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-control ${capabilityTones[biCapability.id]}`}
                >
                  <BarChart3 className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-body font-semibold text-background">
                      {t(biCapability.keyTitle)}
                    </h3>
                    <span className="rounded-full bg-background/10 px-2.5 py-0.5 text-caption text-background/75">
                      {t(biCapability.keyBadge)}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-caption text-background/70">
                    {t(biCapability.keyDesc)}
                  </p>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-3 gap-3 md:pl-5">
                {[
                  'franchise_bi_dimension_stores',
                  'franchise_bi_dimension_vehicles',
                  'franchise_bi_dimension_channels',
                ].map((key, index) => (
                  <div key={key} className="min-w-16">
                    <p className="text-caption font-semibold text-background">{t(key)}</p>
                    <div className="mt-2 h-1 rounded-full bg-background/15">
                      <div
                        className={`h-full rounded-full ${index === 1 ? 'bg-brand' : index === 2 ? 'bg-success-light' : 'bg-brand'}`}
                        style={{ width: `${68 + index * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
