'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Globe,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { htmlLangMap } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { FleetEdgeOverview } from './FleetEdgeOverview';
import { FleetEdgeRadialDiagram } from './FleetEdgeRadialDiagram';
import { FloatingContactWidget } from './FloatingContactWidget';
import { FranchiseCtaBanner } from './FranchiseCtaBanner';
import { PartnershipDialog } from './PartnershipDialog';

const container = 'mx-auto max-w-default px-4 md:px-8 lg:px-10';
const heading = 'text-h2 font-semibold lg:text-h2-desktop text-foreground';

export function FranchiseContent({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  const numberFormat = new Intl.NumberFormat(htmlLangMap[lang]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const valueProps = [
    {
      icon: Globe,
      keyTitle: 'franchise_why_channels_title',
      keyDesc: 'franchise_why_channels_desc',
      keyMetric: 'franchise_why_channels_metric',
      accent: 'bg-brand-light text-primary',
    },
    {
      icon: Zap,
      keyTitle: 'franchise_why_saas_title',
      keyDesc: 'franchise_why_saas_desc',
      keyMetric: 'franchise_why_saas_metric',
      accent: 'bg-brand-light/70 text-primary-hover',
    },
    {
      icon: ShieldCheck,
      keyTitle: 'franchise_why_security_title',
      keyDesc: 'franchise_why_security_desc',
      keyMetric: 'franchise_why_security_metric',
      accent: 'bg-success-light text-success',
    },
  ];

  return (
    <div>
      {/* 1. Hero Section: Heading directly highlights connection with global channels */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/70 via-background to-background">
        <div
          aria-hidden="true"
          className="absolute -top-28 right-0 size-96 rounded-full bg-brand/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 size-96 rounded-full bg-success-light blur-3xl"
        />
        <div
          className={`${container} relative grid items-center gap-10 py-12 md:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20`}
        >
          <div className="min-w-0">
            <h1 className="text-h1 font-semibold tracking-tight text-foreground text-balance lg:text-h1-desktop">
              <span className="block">{t('franchise_hero_title_prefix')}</span>
              <span className="block bg-gradient-to-r from-primary to-brand bg-clip-text text-transparent">
                {t('franchise_hero_title_accent')}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-body-large text-foreground-secondary">
              {t('franchise_hero_desc')}
            </p>

            {/* Primary partnership action */}
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <PartnershipDialog lang={lang}>
                <Button size="lg" className="h-12 min-h-12 px-7 text-sm shadow-raised">
                  <span>{t('franchise_apply')}</span>
                  <ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" />
                </Button>
              </PartnershipDialog>
            </div>

            {/* Core Stats Strip */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">5</p>
                <p className="mt-0.5 text-caption text-foreground-secondary">
                  {t('franchise_stat_regions')}
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">50+</p>
                <p className="mt-0.5 text-caption text-foreground-secondary">
                  {t('franchise_stat_stations')}
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl">
                  {numberFormat.format(2000)}+
                </p>
                <p className="mt-0.5 text-caption text-foreground-secondary">
                  {t('franchise_stat_vehicles')}
                </p>
              </div>
            </div>
          </div>

          {/* Clean Dashboard Preview */}
          <FleetEdgeOverview lang={lang} />
        </div>
      </section>

      {/* 2. Core Ecosystem Section (7 FleetEdge Capabilities Clean Hub & Spoke) */}
      <section
        id="fleetedge"
        className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-brand-deep-soft via-primary-hover to-brand-deep py-14 text-background lg:py-20"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-0 size-80 rounded-full bg-background/10 blur-3xl"
        />
        <div className={`${container} relative`}>
          <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <h2 className="text-h2 font-semibold text-background lg:text-h2-desktop">
              {t('franchise_ecosystem_title')}
            </h2>
            <p className="mt-3 text-body text-background/75">{t('franchise_ecosystem_desc')}</p>
          </div>

          {/* 7 Capabilities Clean Diagram */}
          <FleetEdgeRadialDiagram lang={lang} />
        </div>
      </section>

      {/* 3. Why Choose FleetEdge (3 Clean Value Proposition Cards) */}
      <section className="bg-brand-light/35 py-12 lg:py-16">
        <div className={container}>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className={heading}>{t('franchise_why_title')}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.keyTitle}
                  className="rounded-card bg-card p-6 shadow-raised lg:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex size-11 items-center justify-center rounded-control ${prop.accent}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-caption font-medium ${prop.accent}`}>
                      {t(prop.keyMetric)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-title font-semibold text-foreground">{t(prop.keyTitle)}</h3>
                  <p className="mt-2 text-body text-foreground-secondary">{t(prop.keyDesc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 4-Step Onboarding Process */}
      <section className="bg-background py-12 lg:py-16">
        <div className={container}>
          <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <h2 className={heading}>{t('franchise_process_heading')}</h2>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-border lg:block"
            />
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex flex-col items-start lg:items-center lg:text-center">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-card bg-brand-light font-mono text-body font-semibold text-primary">
                    0{step}
                  </span>
                  <h3 className="mt-4 text-title font-semibold text-foreground">
                    {t(`franchise_step_${step}_title`)}
                  </h3>
                  <p className="mt-1.5 text-body text-foreground-secondary">
                    {t(`franchise_step_${step}_body`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. FAQ Accordion (Clean Compact Accordions) */}
      <section className="bg-muted/50 py-12 lg:py-16">
        <div className={container}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <h2 className={heading}>{t('franchise_faq_title')}</h2>
              <p className="mt-3 text-body text-foreground-secondary">
                {t('franchise_faq_support_desc')}
              </p>

              <div className="mt-6 rounded-card bg-card p-5 shadow-raised">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-brand-light text-primary">
                    <MessageSquare className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-title font-semibold text-foreground">
                      {t('franchise_faq_support_title')}
                    </h3>
                    <p className="mt-1 text-caption text-foreground-secondary">
                      {t('franchise_form_trust_badge')}
                    </p>
                  </div>
                </div>
                <PartnershipDialog lang={lang}>
                  <Button variant="secondary" className="mt-5 w-full">
                    {t('franchise_faq_demo')}
                  </Button>
                </PartnershipDialog>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="divide-y divide-border overflow-hidden rounded-card bg-card shadow-raised">
                {[1, 2, 3, 4].map((index) => {
                  const itemIndex = index - 1;
                  const isOpen = openFaqIndex === itemIndex;
                  const panelId = `franchise-faq-panel-${index}`;
                  return (
                    <div key={index}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : itemIndex)}
                        className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6"
                      >
                        <span
                          className={`text-body font-semibold ${
                            isOpen ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {t(`franchise_faq_${index}_q`)}
                        </span>
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                            isOpen
                              ? 'rotate-180 bg-brand-light text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <ChevronDown className="size-4" aria-hidden="true" />
                        </span>
                      </button>
                      {isOpen ? (
                        <p
                          id={panelId}
                          className="px-5 pb-5 pr-10 text-body text-foreground-secondary sm:px-6"
                        >
                          {t(`franchise_faq_${index}_a`)}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pearlescent Minimalist CTA Banner */}
      <FranchiseCtaBanner lang={lang} />

      {/* 7. Floating Action Button Contact Widget (FAB in bottom-right) */}
      <FloatingContactWidget lang={lang} defaultOpen />
    </div>
  );
}
