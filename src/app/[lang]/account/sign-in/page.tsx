import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isRouteLanguage, routeLanguages } from '@/i18n/locales';
import { buildPageMetadata } from '@/lib/seo';
import { SignInClientView } from '@/modules/customer-account/public-api';

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return routeLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) return {};
  return buildPageMetadata({
    title: 'Sign In | TrustGo',
    description: 'Sign in to your TrustGo account to view upcoming bookings and manage your profile.',
    lang,
    path: 'account/sign-in',
    noindex: true,
  });
}

export default async function SignInPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();

  return <SignInClientView lang={lang} />;
}
