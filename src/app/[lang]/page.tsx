import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routeLanguages, isRouteLanguage, getDictionary } from '@/i18n/locales';
import { FloatingContactWidget } from '@/modules/franchise/public-api';
import { SearchBar } from '@/modules/rental-search/ui/search-bar';
import { ConfidenceFeatures } from '@/modules/home/ui/confidence-features';
import { TravelerStories } from '@/modules/home/ui/traveler-stories';
import { RoadTripInspirations } from '@/modules/home/ui/road-trip-inspirations';

export async function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    return {};
  }
  const lang = resolvedParams.lang;
  const dict = getDictionary(lang);

  return {
    title: `${dict.home.heroTitle} | TrustGo Car Rental`,
    description: dict.home.heroSubtitle,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        zh: '/zh',
        ja: '/ja',
        es: '/es',
        ko: '/ko',
      },
    },
    openGraph: {
      title: `${dict.brand.name} - ${dict.brand.slogan}`,
      description: dict.home.heroSubtitle,
      url: `/${lang}`,
      siteName: 'TrustGo Car Rental',
      images: [
        {
          url: '/brand/trustgo-logo.png',
          width: 1024,
          height: 1024,
          alt: 'TrustGo Car Rental Logo',
        },
      ],
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    notFound();
  }
  const lang = resolvedParams.lang;
  const dict = getDictionary(lang);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero: photo is the protagonist; search card floats on it (PC) or follows it (H5) */}
      <section className="relative w-full lg:h-160">
        <div className="relative h-72 sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
            alt={dict.home.heroTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Local scrim only behind the headline */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent lg:bg-gradient-to-l lg:from-foreground/60 lg:via-foreground/10" />
        </div>

        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-12 px-4 sm:px-6 lg:relative lg:px-8">
          <SearchBar lang={lang} className="relative -mt-6 border border-border lg:mt-0 lg:w-104 lg:shrink-0 lg:border-0" />
          {/* Single H1: overlays the photo bottom on H5, sits right of the card on PC */}
          <div className="absolute inset-x-0 top-0 flex h-72 flex-col justify-end px-4 pb-10 text-white sm:h-96 sm:px-6 lg:static lg:h-auto lg:flex-1 lg:items-end lg:p-0 lg:text-right">
            <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-2 max-w-md text-base text-white/90 text-balance lg:mt-4 lg:text-lg">
              {dict.home.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Why TrustGo - 3 Promises (Easy Booking / Confidence / Freedom) */}
      <ConfidenceFeatures dict={dict} />

      {/* 3. Loved by Road Trippers - Real Traveler Stories (Verified Reviews) */}
      <TravelerStories dict={dict} />

      {/* 4. Road Trip Inspirations */}
      <RoadTripInspirations lang={lang} dict={dict} />

      <FloatingContactWidget lang={lang} />
    </div>
  );
}
