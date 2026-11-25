'use client';

import { ArrowRight } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { PartnershipDialog } from './PartnershipDialog';

interface FranchiseCtaBannerProps {
  lang: RouteLanguage;
}

export function FranchiseCtaBanner({ lang }: FranchiseCtaBannerProps) {
  const { t } = useI18n(lang);

  return (
    <section className="bg-background py-12 lg:py-16">
      {/* Clean Pearlescent Surface — No heavy borders */}
      <div className="mx-auto max-w-default px-4 md:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary via-primary-hover to-brand-deep px-5 py-10 text-center shadow-overlay sm:px-8 lg:px-12 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute -left-20 -top-20 size-64 rounded-full bg-brand/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-20 size-64 rounded-full bg-success-light/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            {/* Minimalist Core Heading Only */}
            <h2 className="text-h2 font-semibold text-background text-balance lg:text-h2-desktop">
              {t('franchise_cta_banner_title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-background/80">
              {t('franchise_cta_banner_desc')}
            </p>

            {/* Primary partnership action */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PartnershipDialog lang={lang}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 min-h-12 w-full bg-background px-8 text-sm font-bold text-primary hover:bg-brand-light hover:text-primary-hover sm:w-auto"
                >
                  <span>{t('franchise_apply')}</span>
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Button>
              </PartnershipDialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
