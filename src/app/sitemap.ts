import type { MetadataRoute } from 'next';
import { htmlLangMap, routeLanguages, type RouteLanguage } from '@/i18n/locales';
import {
  getAllLandingCityPaths,
  getAllLandingMarketSlugs,
  getAllLandingStorePaths,
} from '@/modules/destinations/public-api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';
const publicSections = [
  '',
  'locations',
  'car-rental',
  'franchise',
  'about',
  'help',
  'help/customer-service',
  'help/sipp-codes',
  'help/pet-travel',
];

function localizedEntry(lang: RouteLanguage, path: string): MetadataRoute.Sitemap[number] {
  const suffix = path ? `${path}/` : '';
  return {
    url: `${siteUrl}/${lang}/${suffix}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries([
        ...routeLanguages.map((routeLang) => [htmlLangMap[routeLang], `${siteUrl}/${routeLang}/${suffix}`]),
        ['x-default', `${siteUrl}/en/${suffix}`],
      ]),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = routeLanguages.flatMap((lang) => publicSections.map((path) => localizedEntry(lang, path)));

  // Level 1: Market landing pages
  const markets = routeLanguages.flatMap((lang) =>
    getAllLandingMarketSlugs().map((market) => localizedEntry(lang, `car-rental/${market}`))
  );

  // Level 2: City landing pages
  const cities = routeLanguages.flatMap((lang) =>
    getAllLandingCityPaths().map((p) => localizedEntry(lang, `car-rental/${p.market}/${p.city}`))
  );

  // Level 3: Nested Store landing pages (Canonical store URLs)
  const stores = routeLanguages.flatMap((lang) =>
    getAllLandingStorePaths().map((p) => localizedEntry(lang, `car-rental/${p.market}/${p.city}/${p.store}`))
  );

  return [...pages, ...markets, ...cities, ...stores];
}
