'use client';

import { ArrowRight, ExternalLink } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { B2B_CONTACT } from '../domain/franchise-data';
import { PartnershipDialog } from './PartnershipDialog';

interface FranchiseCtaBannerProps {
  lang: RouteLanguage;
}

export function FranchiseCtaBanner({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);

  return (
    <section className="bg-muted/40 py-8 lg:py-12">
      {/* Clean Pearlescent Surface — No heavy borders */}
      <div className="mx-auto max-w-default px-4 py-4 text-center md:px-8 md:py-8 lg:px-10">
        <div className="relative mx-auto max-w-xl">
          {/* Minimalist Core Heading Only */}
          <h2 className="text-h2 font-extrabold text-foreground lg:text-h2-desktop text-balance">
            {t('franchise_cta_banner_title')}
          </h2>

          {/* Dual Action Buttons with standardized design system colors & rounded-control */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PartnershipDialog lang={lang}>
              <Button
                size="lg"
                className="h-12 min-h-12 w-full rounded-control px-8 text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs sm:w-auto"
              >
                <span>{t('franchise_apply')}</span>
                <ArrowRight className="ml-2 size-4 text-white" aria-hidden="true" />
              </Button>
            </PartnershipDialog>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-12 min-h-12 w-full rounded-control border border-border-strong px-7 text-sm font-medium sm:w-auto"
            >
              <a href={B2B_CONTACT.merchantPortalUrl} target="_blank" rel="noopener noreferrer">
                <span>{t('franchise_login')}</span>
                <ExternalLink className="ml-2 size-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">{t('franchise_new_tab')}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
