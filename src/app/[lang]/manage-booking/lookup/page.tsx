import { notFound, redirect } from 'next/navigation';
import { isRouteLanguage } from '@/i18n/locales';
import { bookingLookupModalPath } from '@/modules/booking-management/domain/access-recovery';

/** Old bookmarks open the global lookup, with the home page behind it. */
export default async function GuestLookupCompatibilityPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { lang } = await params;
  if (!isRouteLanguage(lang)) notFound();
  const { returnTo } = await searchParams;
  redirect(bookingLookupModalPath(lang, returnTo));
}
