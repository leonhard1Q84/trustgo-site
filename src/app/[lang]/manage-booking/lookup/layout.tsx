import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isRouteLanguage(lang) ? {
    title: `${getTranslation('guest_form_title', lang)} | TrustGo`,
    description: getTranslation('guest_form_note', lang),
  } : {};
}

export default function GuestLookupLayout({ children }: { children: ReactNode }) {
  return children;
}
