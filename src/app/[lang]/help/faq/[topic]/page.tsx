import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  HelpTopicDetailView,
  getHelpFaq,
  getHelpFaqTopic,
  helpFaqLastReviewed,
  helpFaqTopicIds,
  isHelpFaqTopic,
} from '@/modules/help/public-api';
import { StructuredData } from '@/shared/ui/structured-data';
import { htmlLangMap, isRouteLanguage, routeLanguages, type RouteLanguage } from '@/i18n/locales';
import { buildPageMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ lang: string; topic: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routeLanguages.flatMap((lang) => helpFaqTopicIds.map((topic) => ({ lang, topic })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, topic } = await params;
  if (!isRouteLanguage(lang) || !isHelpFaqTopic(topic)) return {};
  const faqTopic = getHelpFaqTopic(lang, topic);
  const faq = getHelpFaq(lang);
  const title = `${faqTopic.title} | TrustGo Help Center`;
  const description = `${faqTopic.description} ${faq.copy.bookingTermsBody}`;
  const metadata = buildPageMetadata({ lang, path: `help/faq/${topic}`, title, description });
  return {
    ...metadata,
    keywords: faqTopic.keywords,
    openGraph: { ...(metadata.openGraph ?? {}), type: 'article', title, description },
  };
}

function getStructuredData(lang: RouteLanguage, topic: (typeof helpFaqTopicIds)[number]) {
  const faq = getHelpFaq(lang);
  const faqTopic = getHelpFaqTopic(lang, topic);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals';
  const url = `${siteUrl}/${lang}/help/faq/${topic}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: htmlLangMap[lang] ?? 'en',
      mainEntity: faqTopic.questions.map((question) => ({
        '@type': 'Question',
        name: question.question,
        acceptedAnswer: { '@type': 'Answer', text: question.answer.join('\n\n') },
      })),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      dateModified: helpFaqLastReviewed,
      publisher: { '@type': 'Organization', name: 'TrustGo', url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TrustGo', item: `${siteUrl}/${lang}` },
        { '@type': 'ListItem', position: 2, name: faq.copy.eyebrow, item: `${siteUrl}/${lang}/help` },
        { '@type': 'ListItem', position: 3, name: faqTopic.title, item: url },
      ],
    },
  ];
}

export default async function HelpFaqTopicRoute({ params }: PageProps) {
  const { lang, topic } = await params;
  if (!isRouteLanguage(lang) || !isHelpFaqTopic(topic)) notFound();
  const faqTopic = getHelpFaqTopic(lang, topic);

  return (
    <>
      <StructuredData data={getStructuredData(lang, topic)} />
      <HelpTopicDetailView lang={lang} topic={faqTopic} />
    </>
  );
}
