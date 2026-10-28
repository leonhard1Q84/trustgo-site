import React from 'react';
import { notFound } from 'next/navigation';
import { routeLanguages, isRouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { FLEET_VEHICLES } from '@/modules/rental-search/domain/fleet-data';
import { createDefaultSearchForm, getRentalDays, parseSearchForm } from '@/modules/rental-search/domain/search-form';
import { RentalSearchResults } from '@/modules/rental-search/ui/RentalSearchResults';
import { getDefaultLicenseCountry, getDocumentRequirementNotice } from '@/modules/rental-search/domain/countries';
import type { Metadata } from 'next';
import { getAvailableStoreOffers } from '@/modules/rental-search/domain/availability';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { StoreOffer } from '@/modules/rental-search/domain/store-offers';

// Rolling availability must use the request clock, never a build-time snapshot.
export const dynamic = 'force-dynamic';

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
  const title = getTranslation('rent_page_title', lang);
  const desc = getTranslation('rent_page_subtitle', lang);

  return {
    title: `${title} | TrustGo Car Rental`,
    description: desc,
    alternates: {
      canonical: `/${lang}/rent`,
      languages: {
        en: '/en/rent',
        zh: '/zh/rent',
        ja: '/ja/rent',
        es: '/es/rent',
        ko: '/ko/rent',
      },
    },
  };
}

export default async function RentPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  if (!isRouteLanguage(resolvedParams.lang)) {
    notFound();
  }
  const lang = resolvedParams.lang;
  const resolvedSearchParams = (await searchParams) || {};

  const form = parseSearchForm(
    resolvedSearchParams,
    createDefaultSearchForm(getDefaultLicenseCountry(lang))
  );
  if (!form.pickup.label && !form.pickup.poiId && !form.pickup.storeCode) {
    form.pickup = { label: 'Los Angeles International Airport (LAX)', poiId: 'poi-lax-airport', storeCode: 'US-LAX-01' };
  }
  const pickupLocation = form.pickup.label;
  const rentalDays = getRentalDays(form.pickupDate, form.returnDate, form.pickupTime, form.returnTime);
  let docNotice = getDocumentRequirementNotice(form.licenseCountry, pickupLocation, lang);
  let offers: StoreOffer[] = [];
  try { offers = getAvailableStoreOffers(form); }
  catch (error) {
    if (!(error instanceof RentalError) || !['invalid_search', 'invalid_driver'].includes(error.code)) throw error;
    docNotice = { isWarning: true, text: getTranslation('rental_invalid_search', lang) };
  }

  return (
    <RentalSearchResults
      form={form}
      vehicles={FLEET_VEHICLES}
      offers={offers}
      lang={lang}
      pickupLocation={pickupLocation}
      licenseCountry={form.licenseCountry}
      rentalDays={rentalDays}
      searchParams={resolvedSearchParams}
      docNotice={docNotice}
    />
  );
}
