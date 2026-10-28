import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HelpCenterView, getHelpFaq, getHelpFaqTopicList } from '@/modules/help/public-api';
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
  const { copy } = getHelpFaq(lang);
  return buildPageMetadata({
    lang,
    path: 'help',
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

function getStructuredData(lang: RouteLanguage) {
  const faq = getHelpFaq(lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';
  const url = `${siteUrl}/${lang}/help`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: faq.copy.title,
    description: faq.copy.metaDescription,
    inLanguage: htmlLangMap[lang] ?? 'en',
    url,
    mainEntity: getHelpFaqTopicList(lang).map((topic) => ({
      '@type': 'ItemList',
      name: topic.title,
      numberOfItems: topic.questions.length,
      url: `${url}/faq/${topic.id}`,
    })),
    publisher: { '@type': 'Organization', name: 'TrustGo', url: siteUrl },
  };
}

export default async function HelpCenterRoute({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return (
    <>
      <StructuredData data={getStructuredData(lang)} />
      <HelpCenterView lang={lang} />
    </>
  );
}
