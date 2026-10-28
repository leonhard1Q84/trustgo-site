import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isRouteLanguage, routeLanguages } from '@/i18n/locales';
import { buildPageMetadata } from '@/lib/seo';
import { RegisterClientView } from '@/modules/customer-account/public-api';

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};
  return buildPageMetadata({
    title: 'Create Account | TrustGo',
    description: 'Join TrustGo for streamlined car rentals, faster checkout, and easy reservation management.',
    lang,
    path: 'account/register',
    noindex: true,
  });
}

export default async function RegisterPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return <RegisterClientView lang={lang} />;
}
