import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { routeLanguages, isRouteLanguage } from '@/i18n/locales';
import {
  locationCards,
  getLocationByRouteSegment,
  getStoreMetadata,
  getStoreStructuredData,
  getStoreBreadcrumbData,
  StoreDetailPageView,
} from '@/modules/locations/public-api';
import {
  getLocationCountry,
  getLocationCity,
  marketLandingConfigs,
  cityLandingConfigs,
} from '@/modules/destinations/public-api';

type PageProps = {
  params: Promise<{ lang: string; store: string }>;
};

export async function generateStaticParams() {
  return routeLanguages.flatMap((lang) =>
    locationCards.map((loc) => ({
      lang,
      store: loc.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, store } = await params;
  if (!isRouteLanguage(lang)) return {};

  const location = getLocationByRouteSegment(store);
  if (!location) return {};

  const meta = getStoreMetadata(location, lang);
  return {
    ...meta,
    robots: { index: false, follow: true },
  };
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { lang, store } = await params;
  if (!isRouteLanguage(lang)) {
    notFound();
  }

  const location = getLocationByRouteSegment(store);
  if (!location) {
    notFound();
  }

  // Canonicalize to hierarchical route: /car-rental/[market]/[city]/[store]/
  const countryKey = getLocationCountry(location);
  const cityKey = getLocationCity(location);
  const market = marketLandingConfigs.find((m) => m.countryKey === countryKey);
  const city = cityLandingConfigs.find((c) => c.citySlug === cityKey && c.marketSlug === market?.marketSlug);

  if (market && city) {
    permanentRedirect(`/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/${location.slug}/`);
  }

  if (store.toLowerCase() !== location.slug.toLowerCase()) {
    permanentRedirect(`/${lang}/locations/${location.slug}`);
  }

  const structuredData = getStoreStructuredData(location, lang);
  const breadcrumbData = getStoreBreadcrumbData(location, lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div id="main-content">
        <StoreDetailPageView location={location} lang={lang} />
      </div>
    </>
  );
}
