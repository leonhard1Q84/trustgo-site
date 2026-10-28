'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

import { SearchBar } from '@/modules/rental-search/ui/search-bar';
import ValuePropsBar from './ValuePropsBar';
import type { MarketLandingConfig } from '../domain/landing-pages-data';
import {
  cityLandingConfigs,
  marketLandingConfigs,
  marketHeroImages,
  cityLandmarkImages,
  getCityStores,
} from '../domain/landing-pages-data';
import { routeToLanguage, type RouteLanguage, type Language } from '@/i18n/locales';

interface MarketLandingViewProps {
  market: MarketLandingConfig;
  lang: RouteLanguage;
}

function getCityRentalAnchor(cityName: string, language: Language): string {
  switch (language) {
    case 'ZH':
      return `${cityName}租車`;
    case 'JA':
      return `${cityName} レンタカー`;
    case 'ES':
      return `Alquiler de coches en ${cityName}`;
    case 'KO':
      return `${cityName} 렌터카`;
    case 'EN':
    default:
      return `${cityName} Car Rental`;
  }
}

function getStoreCountLabel(count: number, language: Language): string {
  switch (language) {
    case 'ZH':
      return `${count} 間服務網點`;
    case 'JA':
      return `${count} 店舗展開`;
    case 'ES':
      return `${count} oficinas`;
    case 'KO':
      return `${count}개 지점`;
    case 'EN':
    default:
      return `${count} locations`;
  }
}

function MarketLandingContent({ market, lang }: MarketLandingViewProps) {
  const language = routeToLanguage(lang);
  const marketName = market.localizedNames[language] ?? market.localizedNames.EN;
  const heroImage = marketHeroImages[market.marketSlug] || '/images/destinations/japan-roadtrip.jpg';

  // Filter cities under this market
  const marketCities = cityLandingConfigs.filter(
    (city) => city.marketSlug === market.marketSlug
  );

  // Filter popular cities
  const popularCities = market.popularCitySlugs
    .map((slug) => marketCities.find((c) => c.citySlug === slug))
    .filter((c): c is (typeof marketCities)[0] => Boolean(c));

  const citiesToDisplay = popularCities.length > 0 ? popularCities : marketCities;

  const navLabels = {
    home: { EN: 'Home', ZH: '首頁', JA: 'ホーム', ES: 'Inicio', KO: '홈' },
    carRental: { EN: 'Car rental', ZH: '租車服務', JA: 'レンタカー', ES: 'Alquiler de coches', KO: '렌터카' },
    carRentalsInMarket: {
      EN: `Car rentals in ${marketName}`,
      ZH: `${marketName} 租車`,
      JA: `${marketName}のレンタカー`,
      ES: `Alquiler de coches en ${marketName}`,
      KO: `${marketName} 렌터카`,
    },
    searchH1: {
      EN: `Car rental in ${marketName}`,
      ZH: `在 ${marketName} 租車`,
      JA: `${marketName}のレンタカー`,
      ES: `Alquiler de coches en ${marketName}`,
      KO: `${marketName} 렌터카`,
    },
    searchSubtitle: {
      EN: 'Free cancellation up to 48 hours · Transparent pricing',
      ZH: '取車前 48 小時免費取消 · 費用透明無隱藏',
      JA: '出発48時間前までキャンセル無料 · 明瞭な料金体系',
      ES: 'Cancelación gratuita hasta 48h · Tarifas transparentes',
      KO: '픽업 48시간 전 무료 취소 · 투명한 요금',
    },
    popularCities: {
      EN: `Popular destinations in ${marketName}`,
      ZH: `${marketName} 熱門自駕目的地`,
      JA: `${marketName}の人気目的地`,
      ES: `Destinos populares en ${marketName}`,
      KO: `${marketName} 인기 목적지`,
    },
    allCities: {
      EN: `All car rental cities in ${marketName}`,
      ZH: `全部目的地`,
      JA: `すべての都市`,
      ES: `Todas las ciudades`,
      KO: `모든 도시`,
    },
    rentalTips: {
      EN: `Driving tips for ${marketName}`,
      ZH: `在 ${marketName} 的自駕須知`,
      JA: `${marketName}の運転ガイド`,
      ES: `Consejos para conducir en ${marketName}`,
      KO: `${marketName} 운전 가이드`,
    },
    otherMarkets: {
      EN: 'Explore other destinations',
      ZH: '瀏覽其他租車目的地',
      JA: '他の旅行先を見る',
      ES: 'Explorar otros destinos',
      KO: '다른 여행지 둘러보기',
    },
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-800 antialiased">
      {/* ================================================================= */}
      {/* 1. TOP FULL-WIDTH SCENIC HERO & HOMEPAGE-ALIGNED SEARCH           */}
      {/* ================================================================= */}
      <section className="relative z-30 w-full overflow-visible bg-[#0B2545] text-white pt-20 lg:pt-24 pb-6 sm:pb-8 border-b border-slate-200">
        <img
          src={heroImage}
          alt={marketName}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-[#0B2545]/50 to-[#0B2545]/20" />

        <div className="relative z-10 mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              {navLabels.searchH1[language]}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-white/85">
              {navLabels.searchSubtitle[language]}
            </p>
          </div>

          <SearchBar lang={lang} variant="hero" />
        </div>
      </section>

      <main className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* ================================================================= */}
        {/* 2. VALUE PROPOSITIONS BAR                                         */}
        {/* ================================================================= */}
        <div className="hidden md:block">
          <ValuePropsBar language={language} />
        </div>

        {/* ================================================================= */}
        {/* 3. AIRBNB-STYLE PHOTO-FIRST POPULAR CITIES (Unboxed & Minimal)   */}
        {/* ================================================================= */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {navLabels.popularCities[language]}
            </h2>
          </div>

          {/* Airbnb-style 4-column responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {citiesToDisplay.map((city) => {
              const cityName = city.localizedNames[language] ?? city.localizedNames.EN;
              const cityImage = cityLandmarkImages[city.citySlug] || heroImage;
              const storeCount = getCityStores(city.citySlug).length;

              return (
                <a
                  key={city.citySlug}
                  href={`/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/`}
                  className="group block focus:outline-none"
                >
                  {/* Photo Container: Unboxed, pure image, smooth hover scale */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-slate-100">
                    <img
                      src={cityImage}
                      alt={cityName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Clean 2-line metadata below photo */}
                  <div className="mt-2.5 space-y-0.5">
                    <h3 className="font-semibold text-base text-slate-900 group-hover:text-[#25A5E3] transition-colors truncate">
                      {cityName}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {storeCount > 0
                        ? getStoreCountLabel(storeCount, language)
                        : getCityRentalAnchor(cityName, language)}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* All Cities Fast Links (Compact Chips) */}
          {marketCities.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {navLabels.allCities[language]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {marketCities.map((city) => {
                  const cName = city.localizedNames[language] ?? city.localizedNames.EN;
                  return (
                    <a
                      key={city.citySlug}
                      href={`/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/`}
                      className="inline-flex items-center gap-1 rounded-card border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#25A5E3] hover:text-[#25A5E3] transition-colors"
                    >
                      <span>{getCityRentalAnchor(cName, language)}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 4. VALUE PROPOSITIONS BAR: Mobile only                           */}
        {/* ================================================================= */}
        <div className="block md:hidden">
          <ValuePropsBar language={language} />
        </div>

        {/* ================================================================= */}
        {/* 5. DRIVING TIPS (Concise & Clean)                                */}
        {/* ================================================================= */}
        {market.tips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {navLabels.rentalTips[language]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {market.tips.map((tip, idx) => (
                <div
                  key={tip.id}
                  className="rounded-card bg-white p-4 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-sky-100 text-[11px] font-bold text-[#0077B6]">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {tip.title[language] ?? tip.title.EN}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 pl-7 line-clamp-3">
                    {tip.description[language] ?? tip.description.EN}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 6. OTHER SERVICE MARKETS (Minimal Grid)                           */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {navLabels.otherMarkets[language]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {marketLandingConfigs
              .filter((m) => m.marketSlug !== market.marketSlug)
              .map((other) => (
                <a
                  key={other.marketSlug}
                  href={`/${lang}/car-rental/${other.marketSlug}/`}
                  className="flex items-center justify-between rounded-card bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:text-[#25A5E3] hover:border-[#25A5E3] transition-colors border border-slate-200"
                >
                  <span>{other.localizedNames[language] ?? other.localizedNames.EN}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </a>
              ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 7. BOTTOM BREADCRUMB NAVIGATION                                   */}
        {/* ================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 pt-3 pb-1 px-1 border-t border-slate-200/80"
        >
          <a href={`/${lang}/`} className="hover:text-slate-900 transition-colors">
            {navLabels.home[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <a href={`/${lang}/car-rental/`} className="hover:text-slate-900 transition-colors">
            {navLabels.carRental[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-semibold text-slate-900">
            {navLabels.carRentalsInMarket[language]}
          </span>
        </nav>
      </main>
    </div>
  );
}

export default function MarketLandingView(props: MarketLandingViewProps) {
  return <MarketLandingContent {...props} />;
}
