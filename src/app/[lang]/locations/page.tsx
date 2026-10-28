import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routeLanguages, isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { FloatingContactWidget } from '@/modules/franchise/public-api';
import { StoreLocatorView } from '@/modules/locations/public-api';
import { locationCards } from '@/modules/locations/domain/locations-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';

export async function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) return {};
  const lang = resolvedParams.lang;
  const title = getTranslation('locations_page_title', lang);
  const desc = getTranslation('locations_page_subtitle', lang);

  const languagesMap: Record<string, string> = {};
  for (const l of routeLanguages) {
    languagesMap[l] = `${BASE_URL}/${l}/locations`;
  }

  return {
    title: `${title} | TrustGo Car Rental`,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}/${lang}/locations`,
      languages: languagesMap,
    },
    openGraph: {
      title: `${title} - TrustGo Worldwide Hubs`,
      description: desc,
      url: `${BASE_URL}/${lang}/locations`,
      siteName: 'TrustGo Car Rental',
      type: 'website',
    },
  };
}

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    notFound();
  }
  const lang = resolvedParams.lang;

  // JSON-LD ItemList Schema for Locations
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TrustGo Rental Hubs & Stations',
    description: 'Worldwide car rental locations and airport hubs powered by TrustGo.',
    itemListElement: locationCards.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'AutoRental',
        name: card.EN.name,
        url: `${BASE_URL}/${lang}/locations/${card.slug}`,
        telephone: card.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: card.EN.address,
          addressCountry: card.marketCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: card.coordinates.latitude,
          longitude: card.coordinates.longitude,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div id="main-content">
        <StoreLocatorView lang={lang} />
      </div>
      <FloatingContactWidget lang={lang} />
    </>
  );
}
