import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isRouteLanguage, routeLanguages, htmlLangMap } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { buildPageMetadata } from '@/lib/seo';
import { CustomerServiceView, getCustomerServiceStages } from '@/modules/help/public-api';
import { StructuredData } from '@/shared/ui/structured-data';

type PageProps = { params: Promise<{ lang: string }> };
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};
  return buildPageMetadata({
    lang,
    path: 'help/customer-service',
    title: `${getTranslation('footer_service_title', lang)} | TrustGo`,
    description: getTranslation('service_description', lang),
  });
}

export default async function CustomerServicePage({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();
  const metadata = await generateMetadata({ params: Promise.resolve({ lang }) });
  const url = String(metadata.alternates?.canonical);
  return (
    <>
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: getTranslation('footer_service_title', lang),
        description: getTranslation('service_description', lang),
        url,
        inLanguage: htmlLangMap[lang],
        hasPart: getCustomerServiceStages(lang).map((stage) => ({
          '@type': 'WebPageElement', name: stage.title, url: `${url}#${stage.id}`,
        })),
      }} />
      <CustomerServiceView lang={lang} />
    </>
  );
}
