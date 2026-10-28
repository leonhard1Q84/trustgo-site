import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SippCodeGuideView, getSippCodeGuide } from '@/modules/help/public-api';
import { StructuredData } from '@/shared/ui/structured-data';
import { htmlLangMap, isRouteLanguage, routeLanguages, type RouteLanguage } from '@/i18n/locales';
import { buildPageMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ lang: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};
  const guide = getSippCodeGuide(lang);
  return buildPageMetadata({
    lang,
    path: 'help/sipp-codes',
    title: `${guide.metaTitle} | TrustGo`,
    description: guide.metaDescription,
  });
}

function getStructuredData(lang: RouteLanguage) {
  const guide = getSippCodeGuide(lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';
  const url = `${siteUrl}/${lang}/help/sipp-codes`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: guide.title,
      description: guide.metaDescription,
      inLanguage: htmlLangMap[lang] ?? 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      publisher: { '@type': 'Organization', name: 'TrustGo', url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TrustGo', item: `${siteUrl}/${lang}` },
        { '@type': 'ListItem', position: 2, name: guide.helpCenter, item: `${siteUrl}/${lang}/help` },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ],
    },
  ];
}

export default async function SippCodesRoute({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return (
    <>
      <StructuredData data={getStructuredData(lang)} />
      <SippCodeGuideView lang={lang} />
    </>
  );
}
