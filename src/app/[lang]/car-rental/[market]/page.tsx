import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/shared/ui/structured-data';
import {
  MarketLandingView,
  getAllLandingMarketSlugs,
  getLandingMarket,
  buildLandingMetadata,
  getMarketStructuredData,
} from '@/modules/destinations/public-api';
import { isRouteLanguage, routeLanguages, routeToLanguage } from '@/i18n/locales';

type PageProps = {
  params: Promise<{ lang: string; market: string }>;
};

export function generateStaticParams() {
  const markets = getAllLandingMarketSlugs();
  return routeLanguages.flatMap((lang) =>
    markets.map((market) => ({
      lang,
      market,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, market } = await params;
  if (!isRouteLanguage(lang)) return {};

  const landingMarket = getLandingMarket(market);
  if (!landingMarket) return {};

  const language = routeToLanguage(lang);
  const title = landingMarket.seoTitles[language] ?? landingMarket.seoTitles.EN;
  const description = landingMarket.seoDescriptions[language] ?? landingMarket.seoDescriptions.EN;

  return buildLandingMetadata({
    lang,
    path: `car-rental/${landingMarket.marketSlug}`,
    title,
    description,
  });
}

export default async function MarketLandingRoute({ params }: PageProps) {
  const { lang, market } = await params;
  if (!isRouteLanguage(lang)) notFound();

  const landingMarket = getLandingMarket(market);
  if (!landingMarket) notFound();

  const structuredData = getMarketStructuredData(landingMarket, lang);

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content">
        <MarketLandingView market={landingMarket} lang={lang} />
      </main>
    </>
  );
}
