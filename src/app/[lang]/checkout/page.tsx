import { redirect } from 'next/navigation';
import { normalizeRouteLanguage } from '@/i18n/locales';

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${normalizeRouteLanguage(lang)}/manage-booking`);
}
