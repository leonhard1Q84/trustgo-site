'use client';

import React from 'react';
import {
  ChevronRight,
  Plane,
} from 'lucide-react';

import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';

function buildRentPath(
  lang: RouteLanguage,
  options: {
    pickupLocation: string;
    pickupLocationCode: string;
    pickupPoiId?: string;
    returnLocation?: string;
    returnLocationCode?: string;
    returnPoiId?: string;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    [key: string]: unknown;
  }
) {
  const params = new URLSearchParams();
  params.set('pickup', options.pickupLocation);
  if (options.pickupLocationCode) params.set('pickupCode', options.pickupLocationCode);
  params.set('return', options.returnLocation || options.pickupLocation);
  if (options.returnLocationCode) params.set('returnCode', options.returnLocationCode);
  params.set('pickupDate', options.pickupDate);
  params.set('dropoffDate', options.dropoffDate);
  return `/${lang}/rent?${params.toString()}`;
}

interface MajorDestinationsViewProps {
  lang: RouteLanguage;
}

function getDefaultSearchDates() {
  const today = new Date();
  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
  };
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  return {
    pickupDate: formatDate(addDays(today, 15)),
    dropoffDate: formatDate(addDays(today, 18)),
  };
}

const heroCopy = {
  ZH: {
    title: '租車自駕目的地',
    desc: '日本、台灣、泰國與馬來西亞熱門自駕路線',
  },
  EN: {
    title: 'Car Rental Destinations',
    desc: 'Scenic road trips across Japan, Taiwan, Thailand & Malaysia',
  },
  JA: {
    title: 'レンタカー目的地',
    desc: '日本・台湾・タイ・マレーシアの人気ドライブコース',
  },
  ES: {
    title: 'Destinos de alquiler de coches',
    desc: 'Rutas por Japón, Taiwán, Tailandia y Malasia',
  },
  KO: {
    title: '렌터카 드라이브 목적지',
    desc: '일본, 대만, 태국, 말레이시아 인기 여행 코스',
  },
};

export const marketList = [
  {
    slug: 'japan',
    image: '/images/destinations/japan-roadtrip.jpg',
    names: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    highlight: {
      EN: '8 cities · 26 locations',
      ZH: '東京、大阪、沖繩等 8 大城市',
      JA: '東京・大阪・沖縄など8都市',
      ES: 'Tokio, Osaka, Okinawa y más',
      KO: '도쿄, 오사카, 오키나와 등 8개 도시',
    },
  },
  {
    slug: 'taiwan',
    image: '/images/destinations/taiwan-roadtrip.jpg',
    names: { EN: 'Taiwan', ZH: '台灣', JA: '台湾', ES: 'Taiwán', KO: '대만' },
    highlight: {
      EN: 'Taoyuan & Kaohsiung hubs',
      ZH: '桃園機場與高雄自駕樞紐',
      JA: '桃園空港・高雄拠点',
      ES: 'Centros en Taoyuan y Kaohsiung',
      KO: '타오위안 공항 및 가오슝 거점',
    },
  },
  {
    slug: 'thailand',
    image: '/images/destinations/thailand-roadtrip.jpg',
    names: { EN: 'Thailand', ZH: '泰國', JA: 'タイ', ES: 'Tailandia', KO: '태국' },
    highlight: {
      EN: 'Phuket island getaway',
      ZH: '普吉島度假海島自駕',
      JA: 'プーケット島リゾートドライブ',
      ES: 'Isla de Phuket',
      KO: '푸껫 휴양지 드라이브',
    },
  },
  {
    slug: 'malaysia',
    image: '/images/destinations/malaysia-roadtrip.jpg',
    names: { EN: 'Malaysia', ZH: '馬來西亞', JA: 'マレーシア', ES: 'Malasia', KO: '말레이시아' },
    highlight: {
      EN: 'Langkawi & Kuala Lumpur',
      ZH: '蘭卡威與吉隆坡熱門網點',
      JA: 'ランカウイ・クアラルンプール',
      ES: 'Langkawi y Kuala Lumpur',
      KO: '랑카위 및 쿠알라룸푸르',
    },
  },
];

const destinationList = [
  {
    marketSlug: 'japan',
    citySlug: 'tokyo',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Tokyo', ZH: '東京', JA: '東京', ES: 'Tokio', KO: '도쿄' },
    subtitle: {
      EN: 'Haneda & Narita Airports',
      ZH: '羽田 / 成田國際機場',
      JA: '羽田・成田国際空港',
      ES: 'Aeropuertos de Haneda y Narita',
      KO: '하네다 / 나리타 국제공항',
    },
    image: '/images/cities/tokyo-landmark.jpg',
  },
  {
    marketSlug: 'japan',
    citySlug: 'osaka',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Osaka', ZH: '大阪', JA: '大阪', ES: 'Osaka', KO: '오사카' },
    subtitle: {
      EN: 'Kansai Airport & Central Osaka',
      ZH: '關西國際機場與難波市區',
      JA: '関西国際空港・難波',
      ES: 'Aeropuerto de Kansai',
      KO: '간사이 국제공항 및 난바',
    },
    image: '/images/cities/osaka-landmark.jpg',
  },
  {
    marketSlug: 'japan',
    citySlug: 'okinawa',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Okinawa', ZH: '沖繩', JA: '沖縄', ES: 'Okinawa', KO: '오키나와' },
    subtitle: {
      EN: 'Naha Airport & Island Cruising',
      ZH: '那霸機場 · 海島自駕首選',
      JA: '那覇空港・海岸ドライブ',
      ES: 'Aeropuerto de Naha',
      KO: '나하 공항 · 해안 드라이브',
    },
    image: '/images/cities/okinawa-landmark.jpg',
  },
  {
    marketSlug: 'japan',
    citySlug: 'fukuoka',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Fukuoka', ZH: '福岡', JA: '福岡', ES: 'Fukuoka', KO: '후쿠오카' },
    subtitle: {
      EN: 'Fukuoka Airport & Kyushu Hub',
      ZH: '福岡機場 · 九州自駕門戶',
      JA: '福岡空港・九州周遊拠点',
      ES: 'Aeropuerto de Fukuoka',
      KO: '후쿠오카 공항 · 규슈 거점',
    },
    image: '/images/cities/fukuoka-landmark.jpg',
  },
  {
    marketSlug: 'japan',
    citySlug: 'sapporo',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Sapporo', ZH: '札幌', JA: '札幌', ES: 'Sapporo', KO: '삿포로' },
    subtitle: {
      EN: 'New Chitose Airport & Hokkaido',
      ZH: '新千歲機場 · 北海道周遊',
      JA: '新千歳空港・北海道周遊',
      ES: 'Nuevo Chitose y Hokkaido',
      KO: '신치토세 공항 · 홋카이도',
    },
    image: '/images/cities/sapporo-landmark.jpg',
  },
  {
    marketSlug: 'japan',
    citySlug: 'kyoto',
    marketName: { EN: 'Japan', ZH: '日本', JA: '日本', ES: 'Japón', KO: '일본' },
    cityName: { EN: 'Kyoto', ZH: '京都', JA: '京都', ES: 'Kioto', KO: '교토' },
    subtitle: {
      EN: 'Kyoto Station & Historic Routes',
      ZH: '京都車站 · 古都自駕',
      JA: '京都駅・古都めぐり',
      ES: 'Estación de Kioto',
      KO: '교토역 · 고도 드라이브',
    },
    image: '/images/cities/kyoto-landmark.jpg',
  },
  {
    marketSlug: 'taiwan',
    citySlug: 'taoyuan',
    marketName: { EN: 'Taiwan', ZH: '台灣', JA: '台湾', ES: 'Taiwán', KO: '대만' },
    cityName: { EN: 'Taoyuan', ZH: '桃園', JA: '桃園', ES: 'Taoyuan', KO: '타오위안' },
    subtitle: {
      EN: 'Taoyuan International Airport',
      ZH: '桃園國際機場直達',
      JA: '桃園国際空港直結',
      ES: 'Aeropuerto Internacional de Taoyuan',
      KO: '타오위안 국제공항 직결',
    },
    image: '/images/cities/taoyuan-landmark.jpg',
  },
  {
    marketSlug: 'taiwan',
    citySlug: 'kaohsiung',
    marketName: { EN: 'Taiwan', ZH: '台灣', JA: '台湾', ES: 'Taiwán', KO: '대만' },
    cityName: { EN: 'Kaohsiung', ZH: '高雄', JA: '高雄', ES: 'Kaohsiung', KO: '가오슝' },
    subtitle: {
      EN: 'Kaohsiung HSR & Zuoying',
      ZH: '高雄左營高鐵站與市區',
      JA: '左営高鉄駅・市内拠点',
      ES: 'Estación de tren de Kaohsiung',
      KO: '가오슝 쭤잉 고속철역',
    },
    image: '/images/cities/kaohsiung-landmark.jpg',
  },
];

const airportHubList = [
  {
    iata: 'NRT',
    code: 'KLNRT01',
    poiId: 'poi-airport-nrt',
    names: {
      EN: 'Narita International Airport',
      ZH: '成田國際機場',
      JA: '成田国際空港',
      ES: 'Aeropuerto de Narita',
      KO: '나리타 국제공항',
    },
    region: {
      EN: 'Tokyo · Free terminal shuttle',
      ZH: '東京 / 千葉 · 航廈免費接駁',
      JA: '東京・千葉 · ターミナル無料送迎',
      ES: 'Tokio · Lanzadera gratuita',
      KO: '도쿄 · 터미널 무료 셔틀',
    },
    image: '/images/airports/nrt-airport.jpg',
  },
  {
    iata: 'HND',
    code: 'KLHND01',
    poiId: 'poi-airport-hnd',
    names: {
      EN: 'Tokyo Haneda Airport',
      ZH: '東京羽田國際機場',
      JA: '羽田空港',
      ES: 'Aeropuerto de Haneda',
      KO: '하네다 국제공항',
    },
    region: {
      EN: 'Tokyo · 20 mins to city center',
      ZH: '東京 · 距市中心僅 20 分鐘',
      JA: '東京 · 都心まで20分',
      ES: 'Tokio · A 20 min del centro',
      KO: '도쿄 · 도심까지 20분',
    },
    image: '/images/airports/hnd-airport.jpg',
  },
  {
    iata: 'OKA',
    code: 'OKA01',
    poiId: 'poi-airport-oka',
    names: {
      EN: 'Naha Airport',
      ZH: '那霸機場',
      JA: '那覇空港',
      ES: 'Aeropuerto de Naha',
      KO: '나하 공항',
    },
    region: {
      EN: 'Okinawa · Dedicated shuttle',
      ZH: '沖繩 · 航廈專車接駁',
      JA: '沖縄 · 専用送迎バス直結',
      ES: 'Okinawa · Lanzadera exclusiva',
      KO: '오키나와 · 전용 셔틀 연계',
    },
    image: '/images/airports/oka-airport.jpg',
  },
  {
    iata: 'CTS',
    code: 'CTS01',
    poiId: 'poi-airport-cts',
    names: {
      EN: 'New Chitose Airport',
      ZH: '新千歲機場',
      JA: '新千歳空港',
      ES: 'Aeropuerto de Nuevo Chitose',
      KO: '신치토세 공항',
    },
    region: {
      EN: 'Hokkaido / Sapporo · 4WD ready',
      ZH: '北海道 / 札幌 · 雪胎 4WD 配備',
      JA: '北海道・札幌 · 4WD＆スタッドレス完備',
      ES: 'Hokkaido · Tracción 4WD',
      KO: '홋카이도 / 삿포로 · 4WD 완비',
    },
    image: '/images/airports/cts-airport.jpg',
  },
];

function MajorDestinationsContent({ lang }: MajorDestinationsViewProps) {
  const language = routeToLanguage(lang);
  const hero = heroCopy[language] ?? heroCopy.EN;

  const labels = {
    home: { EN: 'Home', ZH: '首頁', JA: 'ホーム', ES: 'Inicio', KO: '홈' },
    carRental: { EN: 'Car rental', ZH: '租車服務', JA: 'レンタカー', ES: 'Alquiler de coches', KO: '렌터카' },
    popularMarketsTitle: {
      EN: 'Countries and regions',
      ZH: '熱門國家與地區',
      JA: '人気国・地域',
      ES: 'Países y regiones',
      KO: '인기 국가 및 지역',
    },
    popularDestinationsTitle: {
      EN: 'Popular destinations',
      ZH: '熱門自駕城市',
      JA: '人気ドライブ都市',
      ES: 'Destinos populares',
      KO: '인기 드라이브 도시',
    },
    popularAirportsTitle: {
      EN: 'Popular airport hubs',
      ZH: '熱門機場樞紐',
      JA: '主要空港ハブ',
      ES: 'Aeropuertos principales',
      KO: '핵심 공항 허브',
    },
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-800 antialiased">
      {/* ================================================================= */}
      {/* 1. SCENIC ROAD TRIP HERO BANNER                                    */}
      {/* ================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#0B2545] text-white border-b border-slate-200/80 pt-20 sm:pt-24 pb-8 sm:pb-10 flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/destinations/taiwan-roadtrip.jpg"
            alt="Scenic coastal road trip"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-[#0B2545]/50 to-[#0B2545]/20 sm:bg-gradient-to-r sm:from-[#0B2545]/85 sm:via-[#0B2545]/50 sm:to-[#0B2545]/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8 space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
            {hero.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-normal">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MAIN CONTAINER: AIRBNB-STYLE PHOTO-FIRST FLOW                     */}
      {/* ================================================================= */}
      <main className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16 space-y-10 sm:space-y-12">
        {/* ================================================================= */}
        {/* 2. POPULAR MARKETS (Unboxed Airbnb Cards)                         */}
        {/* ================================================================= */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {labels.popularMarketsTitle[language]}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {marketList.map((m) => {
              const targetUrl = `/${lang}/car-rental/${m.slug}/`;
              const mName = m.names[language] ?? m.names.EN;
              const hText = m.highlight[language] ?? m.highlight.EN;

              return (
                <a
                  key={m.slug}
                  href={targetUrl}
                  className="group block focus:outline-none"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-slate-100">
                    <img
                      src={m.image}
                      alt={mName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#25A5E3] transition-colors truncate">
                      {mName}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {hText}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. POPULAR CITIES (8 Cities · 4x2 Grid Spanning Perfectly)        */}
        {/* ================================================================= */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {labels.popularDestinationsTitle[language]}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {destinationList.map((dest) => {
              const targetUrl = `/${lang}/car-rental/${dest.marketSlug}/${dest.citySlug}/`;
              const cityName = dest.cityName[language] ?? dest.cityName.EN;
              const subText = dest.subtitle[language] ?? dest.subtitle.EN;

              return (
                <a
                  key={dest.citySlug}
                  href={targetUrl}
                  className="group block focus:outline-none"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-slate-100">
                    <img
                      src={dest.image}
                      alt={cityName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#25A5E3] transition-colors truncate">
                      {cityName}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {subText}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. AIRPORT HUBS (Clean Photo Cards with IATA badge)               */}
        {/* ================================================================= */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {labels.popularAirportsTitle[language]}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {airportHubList.map((airport) => {
              const defaultDates = getDefaultSearchDates();
              const airportName = airport.names[language] ?? airport.names.EN;
              const regionName = airport.region[language] ?? airport.region.EN;
              const targetUrl = buildRentPath(lang, {
                pickupLocation: airportName,
                pickupLocationCode: airport.code,
                pickupPoiId: airport.poiId,
                returnLocation: airportName,
                returnLocationCode: airport.code,
                returnPoiId: airport.poiId,
                pickupDate: defaultDates.pickupDate,
                pickupTime: '10:00',
                dropoffDate: defaultDates.dropoffDate,
                dropoffTime: '10:00',
                licenseRegion: 'United States',
                ageRange: '25-64',
                differentDropoff: false,
              });

              return (
                <a
                  key={airport.iata}
                  href={targetUrl}
                  className="group block focus:outline-none"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-slate-100">
                    <img
                      src={airport.image}
                      alt={airportName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {/* Small IATA pill badge */}
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-card bg-[#0B2545]/75 backdrop-blur-xs px-2 py-0.5 text-[11px] font-mono font-bold text-white">
                      <Plane className="h-3 w-3 text-[#25A5E3]" />
                      <span>{airport.iata}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-0.5">
                    <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#25A5E3] transition-colors truncate">
                      {airportName}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {regionName}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. BOTTOM BREADCRUMBS                                             */}
        {/* ================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 pt-3 pb-1 px-1 border-t border-slate-200/80"
        >
          <a href={`/${lang}/`} className="hover:text-slate-900 transition-colors">
            {labels.home[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-semibold text-slate-900">
            {labels.carRental[language]}
          </span>
        </nav>
      </main>
    </div>
  );
}

export default function MajorDestinationsView(props: MajorDestinationsViewProps) {
  return <MajorDestinationsContent {...props} />;
}
