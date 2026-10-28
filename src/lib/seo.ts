import type { Metadata } from 'next';
import { htmlLangMap, ogLocaleMap, routeLanguages, type RouteLanguage } from '@/i18n/locales';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';

const defaultCopy: Record<RouteLanguage, { title: string; description: string }> = {
  en: {
    title: 'TrustGo - Go Easy. Go Happy. | Clear Pricing & Flexible Rentals',
    description: 'TrustGo offers friendly, straightforward car rentals across major global destinations with clear pricing, flexible pickup, and verified fleet quality.',
  },
  zh: {
    title: 'TrustGo - 輕鬆出發，快樂同行 | 價格透明、取還靈活、安心自駕',
    description: 'TrustGo 為全球精選目的地提供親切透明的租車服務，清晰價格、靈活取還、在線訂單管理與全程自駕支援。',
  },
  ja: {
    title: 'TrustGo - 気軽に出発、楽しくドライブ | 明確な料金と柔軟なレンタカー',
    description: 'TrustGoは世界中の人気旅行先で、明確な料金、柔軟な受け取り、安心のフリート品質と日本語サポートを提供します。',
  },
  es: {
    title: 'TrustGo - Viaja fácil, viaja feliz | Precios claros y alquiler flexible',
    description: 'TrustGo ofrece alquiler de vehículos claro, flexible y de confianza en los principales destinos del mundo.',
  },
  ko: {
    title: 'TrustGo - 편리한 출발, 즐거운 여정 | 투명한 가격과 유연한 렌터카',
    description: 'TrustGo는 전 세계 주요 여행지에서 투명한 요금, 유연한 픽업, 신뢰할 수 있는 차량과 고객 지원을 제공합니다.',
  },
};

function normalizePath(path = '') {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  return normalized ? `${normalized}/` : '';
}

export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  noindex = false,
}: {
  lang: RouteLanguage;
  path?: string;
  title?: string;
  description?: string;
  noindex?: boolean;
}): Metadata {
  const suffix = normalizePath(path);
  const copy = defaultCopy[lang] ?? defaultCopy.en;
  const canonical = `${siteUrl}/${lang}/${suffix}`;
  const pageTitle = title ?? copy.title;
  const pageDescription = description ?? copy.description;
  const languages = Object.fromEntries([
    ...routeLanguages.map((routeLang) => [htmlLangMap[routeLang], `${siteUrl}/${routeLang}/${suffix}`]),
    ['x-default', `${siteUrl}/en/${suffix}`],
  ]);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'TrustGo Car Rental',
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      locale: ogLocaleMap[lang] ?? 'en_US',
    },
    twitter: { card: 'summary_large_image', title: pageTitle, description: pageDescription },
  };
}

export function getDefaultStructuredData(lang: RouteLanguage, path = '') {
  const suffix = normalizePath(path);
  const copy = defaultCopy[lang] ?? defaultCopy.en;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'TrustGo',
    url: `${siteUrl}/${lang}/${suffix}`,
    description: copy.description,
    inLanguage: htmlLangMap[lang] ?? 'en',
    areaServed: ['US', 'JP', 'TH', 'AU', 'NZ', 'EU'],
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card',
    availableLanguage: routeLanguages,
    brand: { '@type': 'Brand', name: 'TrustGo' },
  };
}
