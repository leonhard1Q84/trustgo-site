import React from 'react';
import { notFound } from 'next/navigation';
import { routeLanguages, isRouteLanguage, getDictionary } from '@/i18n/locales';
import {
  GlobalPaymentReminder,
  GuestLookupProvider,
} from '@/modules/booking-management/public-api';
import { SiteHeader } from '@/shared/ui/site-header';
import { SiteFooter } from '@/shared/ui/site-footer';
import { CookieConsent } from '@/shared/ui/cookie-consent';
import { GoogleAnalytics } from '@/shared/analytics/google-analytics';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { LocaleNavigationProvider } from '@/i18n/LocaleNavigation';
import { SiteDocument, siteMetadata, siteViewport } from '@/shared/ui/site-document';
import { AuthProvider, AuthModal } from '@/modules/customer-account/public-api';
import type { Metadata } from 'next';

export const viewport = siteViewport;

export async function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    return {};
  }
  const lang = resolvedParams.lang;
  const dict = getDictionary(lang);

  return {
    ...siteMetadata,
    title: `${dict.brand.name} | ${dict.brand.slogan}`,
    description: dict.brand.tagline,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        zh: '/zh',
        ja: '/ja',
        es: '/es',
        ko: '/ko',
      },
    },
    openGraph: {
      title: `${dict.brand.name} - ${dict.brand.slogan}`,
      description: dict.brand.tagline,
      siteName: 'TrustGo Car Rental',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    notFound();
  }
  const lang = resolvedParams.lang;

  return (
    <SiteDocument lang={lang}>
      <LanguageProvider initialRouteLanguage={lang}>
        <LocaleNavigationProvider lang={lang}>
          <AuthProvider>
            <GuestLookupProvider>
              <GoogleAnalytics />
              <div className="flex flex-col min-h-dvh">
                <SiteHeader lang={lang} />
                <GlobalPaymentReminder />
                <main className="flex-1">{children}</main>
                <SiteFooter lang={lang} />
              </div>
              <CookieConsent lang={lang} />
              <AuthModal lang={lang} />
            </GuestLookupProvider>
          </AuthProvider>
        </LocaleNavigationProvider>
      </LanguageProvider>
    </SiteDocument>
  );
}
