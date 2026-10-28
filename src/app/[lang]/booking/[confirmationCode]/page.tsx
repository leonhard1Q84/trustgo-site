import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { isRouteLanguage } from '@/i18n/locales';
import { readPageBooking } from '@/modules/booking-management/application/read-page-booking';
import { BookingDetailsView } from './BookingDetailsView';
import { getTranslation } from '@/i18n/translation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: isRouteLanguage(lang) ? `${getTranslation('bm_view_details', lang)} | TrustGo` : 'TrustGo',
    robots: { index: false, follow: false },
    alternates: { canonical: null, languages: {} },
  };
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; confirmationCode: string }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) notFound();
  const lang = resolvedParams.lang;
  const confirmationCode = resolvedParams.confirmationCode;

  const booking = await readPageBooking(confirmationCode, lang, `/${lang}/booking/${encodeURIComponent(confirmationCode)}`);

  return (
    <div className="py-8 bg-muted min-h-dvh">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${lang}/manage-booking/orders`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-foreground-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{getTranslation('guest_back_list', lang)}</span>
          </Link>

        </div>

        {/* Live Booking View */}
        <BookingDetailsView
          initialBooking={booking!}
          confirmationCode={confirmationCode}
          lang={lang}
        />
      </div>
    </div>
  );
}
