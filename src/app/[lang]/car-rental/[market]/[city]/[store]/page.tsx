import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/shared/ui/structured-data';
import { StoreDetailPageView } from '@/modules/locations/public-api';
import {
  getAllLandingStorePaths,
  getLandingCity,
  getLandingMarket,
  getStoreByLandingSlug,
  isLocationIndexable,
  buildLandingMetadata,
  getNestedStoreStructuredData,
} from '@/modules/destinations/public-api';
import { isRouteLanguage, routeLanguages } from '@/i18n/locales';
import { getStoreMetadata } from '@/modules/locations/domain/store-seo';

type PageProps = {
  params: Promise<{ lang: string; market: string; city: string; store: string }>;
};

export function generateStaticParams() {
  const paths = getAllLandingStorePaths();
  return routeLanguages.flatMap((lang) =>
    paths.map((p) => ({
      lang,
      market: p.market,
      city: p.city,
      store: p.store,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, market, city, store } = await params;
  if (!isRouteLanguage(lang)) return {};

  const landingMarket = getLandingMarket(market);
  const landingCity = getLandingCity(market, city);
  const location = getStoreByLandingSlug(market, city, store);

  if (!landingMarket || !landingCity || !location) return {};

  const meta = getStoreMetadata(location, lang);

  return buildLandingMetadata({
    lang,
    path: `car-rental/${landingMarket.marketSlug}/${landingCity.citySlug}/${location.slug}`,
    title: (meta.title as string) ?? '',
    description: (meta.description as string) ?? '',
    noindex: !isLocationIndexable(location),
  });
}

export default async function NestedStoreRoute({ params }: PageProps) {
  const { lang, market, city, store } = await params;
  if (!isRouteLanguage(lang)) notFound();

  const landingMarket = getLandingMarket(market);
  const landingCity = getLandingCity(market, city);
  const location = getStoreByLandingSlug(market, city, store);

  if (!landingMarket || !landingCity || !location) notFound();

  const structuredData = getNestedStoreStructuredData(landingMarket, landingCity, location, lang);

  return (
    <>
      <StructuredData data={structuredData} />
      <div id="main-content">
        <StoreDetailPageView
          lang={lang}
          location={location}
          marketSlug={landingMarket.marketSlug}
          citySlug={landingCity.citySlug}
        />
      </div>
    </>
  );
}
