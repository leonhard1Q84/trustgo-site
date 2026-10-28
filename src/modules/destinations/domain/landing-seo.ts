import type { Metadata } from 'next';
import {
  htmlLangMap,
  ogLocaleMap,
  routeLanguages,
  routeToLanguage,
  type RouteLanguage,
} from '@/i18n/locales';
import type { CityLandingConfig, MarketLandingConfig } from './landing-pages-data';
import type { LocationCard } from '@/modules/locations/domain/types';
import { getStoreFaqList } from '@/modules/locations/domain/store-faqs';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals').replace(/\/+$/, '');

function normalizePath(path = '') {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return normalized ? `${normalized}/` : '';
}

export function buildLandingMetadata({
  lang,
  path,
  title,
  description,
  noindex = false,
}: {
  lang: RouteLanguage;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const suffix = normalizePath(path);
  const canonical = `${siteUrl}/${lang}/${suffix}`;
  const languages = Object.fromEntries([
    ...routeLanguages.map((routeLang) => [
      htmlLangMap[routeLang],
      `${siteUrl}/${routeLang}/${suffix}`,
    ]),
    ['x-default', `${siteUrl}/en/${suffix}`],
  ]);

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'TrustGo',
      title,
      description,
      url: canonical,
      locale: ogLocaleMap[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function getMarketStructuredData(market: MarketLandingConfig, lang: RouteLanguage) {
  const language = routeToLanguage(lang);
  const marketName = market.localizedNames[language] ?? market.localizedNames.EN;
  const canonicalUrl = `${siteUrl}/${lang}/car-rental/${market.marketSlug}/`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/${lang}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Car Rental',
          item: `${siteUrl}/${lang}/car-rental/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: marketName,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AutoRental',
      '@id': `${canonicalUrl}#service`,
      name: `TrustGo - ${marketName}`,
      url: canonicalUrl,
      description: market.seoDescriptions[language],
      inLanguage: htmlLangMap[lang],
      areaServed: {
        '@type': 'Country',
        name: marketName,
        identifier: market.marketCode,
      },
      brand: {
        '@type': 'Brand',
        name: 'TrustGo',
      },
    },
  ];
}

export function getCityStructuredData(
  market: MarketLandingConfig,
  city: CityLandingConfig,
  lang: RouteLanguage
) {
  const language = routeToLanguage(lang);
  const marketName = market.localizedNames[language] ?? market.localizedNames.EN;
  const cityName = city.localizedNames[language] ?? city.localizedNames.EN;
  const canonicalUrl = `${siteUrl}/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${canonicalUrl}#service`,
    name: `TrustGo - ${cityName}`,
    url: canonicalUrl,
    description: city.seoDescriptions[language],
    inLanguage: htmlLangMap[lang],
    areaServed: [
      {
        '@type': 'City',
        name: cityName,
      },
      {
        '@type': 'Country',
        name: marketName,
        identifier: market.marketCode,
      },
    ],
    brand: {
      '@type': 'Brand',
      name: 'TrustGo',
    },
  };

  // Only output aggregateRating if reviewCount > 0
  if (city.reviewSummary && city.reviewSummary.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: city.reviewSummary.averageRating,
      reviewCount: city.reviewSummary.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${lang}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Car Rental',
        item: `${siteUrl}/${lang}/car-rental/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: marketName,
        item: `${siteUrl}/${lang}/car-rental/${market.marketSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: cityName,
        item: canonicalUrl,
      },
    ],
  };

  return [breadcrumbs, schema];
}

export function getNestedStoreStructuredData(
  market: MarketLandingConfig,
  city: CityLandingConfig,
  location: LocationCard,
  lang: RouteLanguage
) {
  const language = routeToLanguage(lang);
  const marketName = market.localizedNames[language] ?? market.localizedNames.EN;
  const cityName = city.localizedNames[language] ?? city.localizedNames.EN;
  const storeName = location[language].name;
  const canonicalUrl = `${siteUrl}/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/${location.slug}/`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/${lang}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Car Rental',
          item: `${siteUrl}/${lang}/car-rental/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: marketName,
          item: `${siteUrl}/${lang}/car-rental/${market.marketSlug}/`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: cityName,
          item: `${siteUrl}/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: storeName,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AutoRental',
      '@id': `${canonicalUrl}#store`,
      name: storeName,
      url: canonicalUrl,
      description: location.seo[language]?.description ?? location.seo.EN.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location[language].address,
        addressLocality: cityName,
        addressCountry: market.marketCode,
      },
      telephone: location.phone,
      openingHours: location.hours,
      brand: {
        '@type': 'Brand',
        name: 'TrustGo',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: getStoreFaqList(location, language).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];
}
