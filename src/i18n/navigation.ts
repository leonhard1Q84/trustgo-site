import { isRouteLanguage, type RouteLanguage } from './locales';

const RENTAL_KEYS = [
  'pickup',
  'return',
  'pickupPoiId',
  'pickupStoreCode',
  'returnPoiId',
  'returnStoreCode',
  'pickupDate',
  'returnDate',
  'driverAge',
  'licenseCountry',
  'offer',
  'insurance',
  'equipment',
  'rateDetailsId',
  'refreshed',
];
const INTERNAL_ORIGIN = 'https://trustgo.invalid';

/** Preserve public journey context when changing language, never arbitrary form data. */
export function localizedNavigationHref(href: string, lang: RouteLanguage, depth = 0): string {
  if (!href.startsWith('/') || href.startsWith('//') || /[\\\u0000-\u0020]/.test(href))
    return `/${lang}`;
  const url = new URL(href, INTERNAL_ORIGIN);
  const segments = url.pathname.split('/');
  if (url.origin !== INTERNAL_ORIGIN || !isRouteLanguage(segments[1])) return `/${lang}`;
  segments[1] = lang;
  const path = segments.join('/');
  const query = new URLSearchParams();
  const rental = /^\/(en|zh|ja|es|ko)\/(rent(?:\/[^/]+)?|book\/driver)\/?$/.test(path);
  const keys = rental ? RENTAL_KEYS : ['tab', 'bookingLookup'];
  for (const key of keys) {
    const value = url.searchParams.get(key);
    if (value !== null) query.set(key, value);
  }
  const returnTo = url.searchParams.get('returnTo');
  if (returnTo && depth < 2) {
    const target = localizedNavigationHref(returnTo, lang, depth + 1);
    if (target !== `/${lang}`) query.set('returnTo', target);
  }
  const hash = /^#[\w-]+$/.test(url.hash) ? url.hash : '';
  return `${path}${query.size ? `?${query}` : ''}${hash}`;
}
