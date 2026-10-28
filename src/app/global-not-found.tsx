import { headers } from 'next/headers';
import { normalizeRouteLanguage } from '@/i18n/locales';
import { NotFoundView } from '@/shared/ui/not-found-view';
import { SiteDocument, siteMetadata, siteViewport } from '@/shared/ui/site-document';

export const metadata = { ...siteMetadata, robots: { index: false, follow: false } };
export const viewport = siteViewport;

export default async function GlobalNotFound() {
  const lang = normalizeRouteLanguage((await headers()).get('x-tg-route-language'));
  return (
    <SiteDocument lang={lang}>
      <NotFoundView lang={lang} />
    </SiteDocument>
  );
}
