'use client';

import { ArrowRight, ChevronDown, ExternalLink, Globe, ShieldCheck, Zap } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { htmlLangMap } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { B2B_CONTACT } from '../domain/franchise-data';
import { FleetEdgeOverview } from './FleetEdgeOverview';
import { FleetEdgeRadialDiagram } from './FleetEdgeRadialDiagram';
import { FloatingContactWidget } from './FloatingContactWidget';
import { FranchiseCtaBanner } from './FranchiseCtaBanner';
import { PartnershipDialog } from './PartnershipDialog';

const container = 'mx-auto max-w-default px-4 md:px-8 lg:px-10';
const section = 'scroll-mt-20 py-8 lg:py-12';
const heading = 'text-h2 font-bold lg:text-h2-desktop text-foreground';

export function FranchiseContent({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  const numberFormat = new Intl.NumberFormat(htmlLangMap[lang]);

  const valueProps = [
    {
      icon: Globe,
      keyTitle: 'franchise_why_channels_title',
      keyDesc: 'franchise_why_channels_desc',
      accentColor: 'bg-primary/10 text-primary',
    },
    {
      icon: Zap,
      keyTitle: 'franchise_why_saas_title',
      keyDesc: 'franchise_why_saas_desc',
      accentColor: 'bg-warm/10 text-warm',
    },
    {
      icon: ShieldCheck,
      keyTitle: 'franchise_why_security_title',
      keyDesc: 'franchise_why_security_desc',
      accentColor: 'bg-success/10 text-success',
    },
  ];

  return (
    <div>
      {/* 1. Hero Section: Heading directly highlights connection with global channels */}
      <section
        className={`${container} grid items-center gap-8 py-8 md:py-12 lg:grid-cols-2 lg:gap-12 lg:py-14`}
      >
        <div className="min-w-0">
          <h1 className="text-h1 font-extrabold tracking-tight text-foreground text-balance lg:text-h1-desktop">
            {t('franchise_hero_title')}
          </h1>

          <p className="mt-3 max-w-xl text-body text-foreground-secondary leading-relaxed">
            {t('franchise_hero_desc')}
          </p>

          {/* Core Stats Strip */}
          <div className="mt-5 flex flex-wrap items-center gap-6 py-3 sm:gap-10">
            <div>
              <p className="font-mono text-2xl font-extrabold text-foreground sm:text-3xl">5</p>
              <p className="text-caption text-foreground-secondary mt-0.5">
                {t('franchise_stat_regions')}
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl font-extrabold text-foreground sm:text-3xl">50+</p>
              <p className="text-caption text-foreground-secondary mt-0.5">
                {t('franchise_stat_stations')}
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl font-extrabold text-foreground sm:text-3xl">
                {numberFormat.format(2000)}+
              </p>
              <p className="text-caption text-foreground-secondary mt-0.5">
                {t('franchise_stat_vehicles')}
              </p>
            </div>
          </div>

          {/* Standard Primary & Secondary Buttons */}
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PartnershipDialog lang={lang}>
              <Button
                size="lg"
                className="h-12 min-h-12 rounded-control px-7 text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs"
              >
                <span>{t('franchise_apply')}</span>
                <ArrowRight className="ml-2 size-4 shrink-0 text-white" aria-hidden="true" />
              </Button>
            </PartnershipDialog>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-12 min-h-12 rounded-control border border-border-strong px-6 text-sm font-medium"
            >
              <a href={B2B_CONTACT.merchantPortalUrl} target="_blank" rel="noopener noreferrer">
                <span>{t('franchise_login')}</span>
                <ExternalLink
                  className="ml-2 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="sr-only">{t('franchise_new_tab')}</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Clean Dashboard Preview */}
        <FleetEdgeOverview lang={lang} />
      </section>

      {/* 2. Core Ecosystem Section (7 FleetEdge Capabilities Clean Hub & Spoke) */}
      <section id="fleetedge" className="scroll-mt-20 bg-muted/40 py-8 lg:py-12">
        <div className={container}>
          <div className="mx-auto max-w-2xl text-center mb-8">
            <h2 className={heading}>{t('franchise_ecosystem_title')}</h2>
            <p className="mt-2 text-body text-foreground-secondary leading-relaxed">
              {t('franchise_ecosystem_desc')}
            </p>
          </div>

          {/* 7 Capabilities Clean Diagram */}
          <FleetEdgeRadialDiagram lang={lang} />
        </div>
      </section>

      {/* 3. Why Choose FleetEdge (3 Clean Value Proposition Cards) */}
      <section className={`${container} ${section}`}>
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className={heading}>{t('franchise_why_title')}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <div key={prop.keyTitle} className="rounded-card border border-border bg-card p-6">
                <div
                  className={`flex size-10 items-center justify-center rounded-control mb-3.5 ${prop.accentColor}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-body font-bold text-foreground mb-1.5">{t(prop.keyTitle)}</h3>
                <p className="text-caption text-foreground-secondary leading-normal">
                  {t(prop.keyDesc)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 4-Step Onboarding Process */}
      <section className={`${container} ${section}`}>
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className={heading}>{t('franchise_process_heading')}</h2>
        </div>

        <ol className="lg:grid lg:grid-cols-4">
          {[1, 2, 3, 4].map((step) => (
            <li
              key={step}
              className="relative pb-8 pl-16 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-6 lg:last:pr-0"
            >
              {step < 4 && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-5 top-10 border-l border-border lg:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-10 right-0 top-5 hidden border-t border-border lg:block"
                  />
                </>
              )}
              <span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-muted font-mono text-caption font-semibold text-foreground-secondary lg:static">
                0{step}
              </span>
              <div className="pt-2 lg:pt-4">
                <h3 className="text-body font-bold text-foreground">
                  {t(`franchise_step_${step}_title`)}
                </h3>
                <p className="mt-1 text-caption text-foreground-secondary leading-normal">
                  {t(`franchise_step_${step}_body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. FAQ Accordion (Clean Compact Accordions) */}
      <section className={`${container} ${section}`}>
        <div className="mx-auto max-w-2xl">
          <h2 className={`text-center mb-8 ${heading}`}>{t('franchise_faq_title')}</h2>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((index) => (
              <details key={index} className="group px-4 py-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-control text-body font-semibold text-foreground transition-colors hover:text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span>{t(`franchise_faq_${index}_q`)}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-2 pb-2 text-caption text-foreground-secondary leading-relaxed">
                  {t(`franchise_faq_${index}_a`)}
                </p>
              </details>
            ))}
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
