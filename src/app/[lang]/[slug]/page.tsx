import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routeLanguages, isRouteLanguage, htmlLangMap } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { buildPageMetadata } from '@/lib/seo';
import { FloatingContactWidget } from '@/modules/franchise/public-api';
import { AboutContent } from '@/modules/site-content/public-api';
import { InformationPage } from '@/shared/ui/information-page';
import { InformationContactLinks } from '@/shared/ui/information-contact-links';
import { StructuredData } from '@/shared/ui/structured-data';

export const dynamic = 'force-static';
export const dynamicParams = false;

const STATIC_SLUGS = ['about', 'self-service', 'terms', 'privacy', 'cookies', 'safety'] as const;
type StaticSlug = (typeof STATIC_SLUGS)[number];

const SLUG_KEY_MAP: Record<StaticSlug, { titleKey: string; descKey: string }> = {
  about: { titleKey: 'slug_about_title', descKey: 'slug_about_desc' },
  'self-service': {
    titleKey: 'slug_self_service_title',
    descKey: 'slug_self_service_desc',
  },
  terms: { titleKey: 'slug_terms_title', descKey: 'slug_terms_desc' },
  privacy: { titleKey: 'slug_privacy_title', descKey: 'slug_privacy_desc' },
  cookies: { titleKey: 'slug_cookies_title', descKey: 'slug_cookies_desc' },
  safety: { titleKey: 'slug_safety_title', descKey: 'slug_safety_desc' },
};

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of routeLanguages) {
    for (const slug of STATIC_SLUGS) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) return {};
  const slug = resolvedParams.slug as StaticSlug;
  if (!STATIC_SLUGS.includes(slug)) return {};

  const lang = resolvedParams.lang;
  const config = SLUG_KEY_MAP[slug];
  const title = getTranslation(config.titleKey, lang);
  const desc = getTranslation(config.descKey, lang);

  if (slug === 'about') {
    return buildPageMetadata({
      lang,
      path: 'about',
      title: `${title} | TrustGo`,
      description: desc,
    });
  }

  return {
    title: `${title} | TrustGo Car Rental`,
    description: desc,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: {
        en: `/en/${slug}`,
        zh: `/zh/${slug}`,
        ja: `/ja/${slug}`,
        es: `/es/${slug}`,
        ko: `/ko/${slug}`,
      },
    },
  };
}

export default async function StaticInfoPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    notFound();
  }
  const slug = resolvedParams.slug as StaticSlug;
  if (!STATIC_SLUGS.includes(slug)) {
    notFound();
  }

  const lang = resolvedParams.lang;
  const t = (k: string) => getTranslation(k, lang);
  const config = SLUG_KEY_MAP[slug];

  const metadata =
    slug === 'about'
      ? buildPageMetadata({
          lang,
          path: 'about',
          title: `${t(config.titleKey)} | TrustGo`,
          description: t(config.descKey),
        })
      : null;

  return (
    <>
      {metadata && (
        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: t(config.titleKey),
            description: t(config.descKey),
            url: String(metadata.alternates?.canonical),
            inLanguage: htmlLangMap[lang],
            about: { '@type': 'Organization', name: 'TrustGo' },
          }}
        />
      )}
      {slug === 'about' ? (
        <>
          <AboutContent lang={lang} />
          <FloatingContactWidget lang={lang} />
        </>
      ) : (
        <InformationPage title={t(config.titleKey)} description={t(config.descKey)}>
          <p>{t('slug_content_updating')}</p>
          <InformationContactLinks lang={lang} />
        </InformationPage>
      )}
    </>
  );
}
