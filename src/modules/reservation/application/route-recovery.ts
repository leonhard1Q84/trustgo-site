import type { RouteLanguage } from '@/i18n/locales';

const SEARCH_KEYS = ['pickup', 'return', 'pickupPoiId', 'pickupStoreCode', 'returnPoiId', 'returnStoreCode',
  'pickupDate', 'returnDate', 'driverAge', 'licenseCountry', 'offer', 'insurance', 'equipment'];

/** Only public rental facts may survive a lost rate context; never arbitrary redirects. */
export function safeRateRecoveryPath(value: unknown, lang: RouteLanguage): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return null;
  const url = new URL(value, 'https://trustgo.invalid');
  if (!value.startsWith('/') || url.origin !== 'https://trustgo.invalid'
    || !new RegExp(`^/${lang}/rent/[a-zA-Z0-9_-]+$`).test(url.pathname)) return null;
  const query = new URLSearchParams();
  for (const key of SEARCH_KEYS) {
    const entry = url.searchParams.get(key);
    if (entry !== null) query.set(key, entry);
  }
  return `${url.pathname}?${query}`;
}
