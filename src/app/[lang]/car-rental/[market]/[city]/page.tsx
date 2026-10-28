import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/shared/ui/structured-data';
import {
  CityLandingView,
  getAllLandingCityPaths,
  getCityStores,
  getLandingCity,
  getLandingMarket,
  buildLandingMetadata,
  getCityStructuredData,
} from '@/modules/destinations/public-api';
import { isRouteLanguage, routeLanguages, routeToLanguage } from '@/i18n/locales';

type PageProps = {
  params: Promise<{ lang: string; market: string; city: string }>;
};

export function generateStaticParams() {
  const paths = getAllLandingCityPaths();
  return routeLanguages.flatMap((lang) =>
    paths.map((p) => ({
      lang,
      market: p.market,
      city: p.city,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, market, city } = await params;
  if (!isRouteLanguage(lang)) return {};

  const landingMarket = getLandingMarket(market);
  const landingCity = getLandingCity(market, city);
  if (!landingMarket || !landingCity) return {};

  const language = routeToLanguage(lang);
  const title = landingCity.seoTitles[language] ?? landingCity.seoTitles.EN;
  const description = landingCity.seoDescriptions[language] ?? landingCity.seoDescriptions.EN;

  return buildLandingMetadata({
    lang,
    path: `car-rental/${landingMarket.marketSlug}/${landingCity.citySlug}`,
    title,
    description,
  });
}

export default async function CityLandingRoute({ params }: PageProps) {
  const { lang, market, city } = await params;
  if (!isRouteLanguage(lang)) notFound();

  const landingMarket = getLandingMarket(market);
  const landingCity = getLandingCity(market, city);
  if (!landingMarket || !landingCity) notFound();

  const stores = getCityStores(landingCity.citySlug);
  const structuredData = getCityStructuredData(landingMarket, landingCity, lang);

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content">
        <CityLandingView
          market={landingMarket}
          city={landingCity}
          stores={stores}
          lang={lang}
        />
      </main>
    </>
  );
}
