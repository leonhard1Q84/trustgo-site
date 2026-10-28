import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isRouteLanguage, routeLanguages, routeToLanguage } from '@/i18n/locales';
import { MajorDestinationsView, buildLandingMetadata } from '@/modules/destinations/public-api';

type PageProps = {
  params: Promise<{ lang: string }>;
};

const majorDestinationsSeo = {
  ZH: {
    title: '主要租車目的地與熱門自駕市場推薦 | TrustGo',
    description:
      '探索 TrustGo 亞太主要租車目的地，精選日本、台灣、泰國、馬來西亞熱門自駕城市與機場樞紐，享受透明無隱藏費用與完善的官方車隊保障。',
  },
  EN: {
    title: 'Top Car Rental Destinations & Popular Road Trips | TrustGo',
    description:
      'Explore top car rental destinations across Asia-Pacific with TrustGo. Compare verified vehicles across Japan, Taiwan, Thailand, and Malaysia with upfront pricing and flexible booking.',
  },
  JA: {
    title: 'おすすめレンタカー旅行先・主要目的地一覧 | TrustGo',
    description:
      'TrustGo のおすすめ主要レンタカー目的地一覧。日本・台湾・タイ・マレーシアの人気ドライブエリアや主要空港拠点を網羅、安心の多言語サポートと透明な料金体系をご提供。',
  },
  ES: {
    title: 'Principales Destinos de Alquiler de Coches | TrustGo',
    description:
      'Descubre los mejores destinos de alquiler de coches en Asia-Pacífico con TrustGo. Vehículos modernos y precios transparentes en Japón, Taiwán, Tailandia y Malasia.',
  },
  KO: {
    title: '주요 렌터카 추천 여행지 및 인기 드라이브 코스 | TrustGo',
    description:
      'TrustGo의 아시아 태평양 주요 렌터카 여행지를 만나보세요. 일본, 대만, 태국, 말레이시아의 인기 도시와 주요 공항에서 투명한 요금과 검증된 차량으로 완벽한 여행을 시작하세요.',
  },
};

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};

  const language = routeToLanguage(lang);
  const seo = majorDestinationsSeo[language] ?? majorDestinationsSeo.EN;

  return buildLandingMetadata({
    lang,
    path: 'car-rental',
    title: seo.title,
    description: seo.description,
  });
}

export default async function MajorDestinationsRoute({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return (
    <main id="main-content">
      <MajorDestinationsView lang={lang} />
    </main>
  );
}
