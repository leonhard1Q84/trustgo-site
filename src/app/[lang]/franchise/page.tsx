import { notFound } from 'next/navigation';
import { FranchiseContent } from '@/modules/franchise/public-api';
import type { Metadata } from 'next';
import { routeLanguages, isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) return {};
  const lang = resolvedParams.lang;
  const title = getTranslation('franchise_hero_title', lang);
  const desc = getTranslation('franchise_hero_desc', lang);

  return buildPageMetadata({
    lang, path: 'franchise', title: `${title} | TrustGo Car Rental`, description: desc,
  });
}

export default async function FranchisePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();
  return <FranchiseContent lang={lang} />;
}
