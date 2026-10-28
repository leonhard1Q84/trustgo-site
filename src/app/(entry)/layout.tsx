import type { ReactNode } from 'react';
import { SiteDocument, siteMetadata, siteViewport } from '@/shared/ui/site-document';
import { defaultRouteLanguage } from '@/i18n/locales';

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function EntryLayout({ children }: { children: ReactNode }) {
  return <SiteDocument lang={defaultRouteLanguage}>{children}</SiteDocument>;
}
