import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isRouteLanguage, routeLanguages, type RouteLanguage } from '@/i18n/locales';
import { buildPageMetadata } from '@/lib/seo';
import { AccountClientView } from '@/modules/customer-account/public-api';

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};
  return buildPageMetadata({
    title: 'My Account | TrustGo',
    description: 'Manage your TrustGo account, profile, saved travelers, and booking contacts.',
    lang,
    path: 'account',
    noindex: true,
  });
}

export default async function AccountPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[42vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AccountClientView lang={lang as RouteLanguage} />
    </Suspense>
  );
}
