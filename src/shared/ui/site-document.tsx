import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import '@/app/globals.css';

export const siteMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://trustgo.rentals'),
  title: 'TrustGo | Go Easy. Go Happy. — Worldwide Car Rental',
  description: 'Simple, transparent car rental for carefree road adventures worldwide.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

const poppins = localFont({
  src: [
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-poppins',
  preload: false,
});

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function SiteDocument({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: RouteLanguage;
}) {
  return (
    <html lang={htmlLangMap[lang]} className={`scroll-smooth ${poppins.variable}`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
