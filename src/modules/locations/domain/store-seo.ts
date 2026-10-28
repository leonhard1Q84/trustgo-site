import type { Metadata } from 'next';
import type { RouteLanguage } from '@/i18n/locales';
import { routeLanguages, routeToLanguage } from '@/i18n/locales';
import type { LocationCard } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';

export function getStoreMetadata(location: LocationCard, lang: RouteLanguage): Metadata {
  const language = routeToLanguage(lang);
  const localized = location[language] || location.EN;
  const seo = location.seo[language] || location.seo.EN;

  const languagesMap: Record<string, string> = {};
  for (const l of routeLanguages) {
    languagesMap[l] = `${BASE_URL}/${l}/locations/${location.slug}`;
  }

  return {
    title: `${seo.title} | TrustGo Car Rental`,
    description: seo.description,
    alternates: {
      canonical: `${BASE_URL}/${lang}/locations/${location.slug}`,
      languages: languagesMap,
    },
    openGraph: {
      title: `${localized.name} - TrustGo Car Rental`,
      description: seo.description,
      url: `${BASE_URL}/${lang}/locations/${location.slug}`,
      siteName: 'TrustGo Car Rental',
      type: 'website',
      images: [
        {
          url: location.storefrontPhotos[0]?.src
            ? `${BASE_URL}${location.storefrontPhotos[0].src}`
            : `${BASE_URL}/brand/trustgo-logo.png`,
          width: 1200,
          height: 630,
          alt: localized.name,
        },
      ],
    },
    robots: {
      index: location.indexStatus === 'indexable',
      follow: true,
    },
  };
}

export function getStoreStructuredData(location: LocationCard, lang: RouteLanguage) {
  const language = routeToLanguage(lang);
  const localized = location[language] || location.EN;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: localized.name,
    description: location.seo[language]?.description || localized.serviceNote,
    url: `${BASE_URL}/${lang}/locations/${location.slug}`,
    telephone: location.phone,
    priceRange: '$$',
    currenciesAccepted: 'USD, EUR, AUD, JPY, KRW',
    paymentAccepted: 'Credit Card, Apple Pay, Google Pay',
    address: {
      '@type': 'PostalAddress',
      streetAddress: localized.address,
      postalCode: location.postalCode || '',
      addressCountry: location.marketCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
    },
    openingHours: location.hours,
    image: location.storefrontPhotos.map((p) => `${BASE_URL}${p.src}`),
    sameAs: [
      'https://trustgo.rentals',
    ],
  };
}

export function getStoreBreadcrumbData(location: LocationCard, lang: RouteLanguage) {
  const language = routeToLanguage(lang);
  const localized = location[language] || location.EN;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: `${BASE_URL}/${lang}/locations`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: localized.name,
        item: `${BASE_URL}/${lang}/locations/${location.slug}`,
      },
    ],
  };
}
