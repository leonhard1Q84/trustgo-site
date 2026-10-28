import { normalizeRouteLanguage, type RouteLanguage } from '@/i18n/locales';

/** Compatibility links open the global lookup over the home page. */
export function bookingLookupModalPath(lang: RouteLanguage, returnTo?: unknown) {
  const query = new URLSearchParams({ bookingLookup: '1' });
  const target = parseBookingReturnPath(returnTo, lang);
  if (target)
    query.set('returnTo', `/${lang}/${target.surface}/${encodeURIComponent(target.code)}`);
  return `/${lang}?${query}`;
}

export function bookingAccessRecoveryPath(lang: string, path: string) {
  return bookingLookupModalPath(normalizeRouteLanguage(lang), path);
}

/** An existing lookup may resume only the booking the customer just verified. */
function parseBookingReturnPath(value: unknown, lang: RouteLanguage) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return null;
  const url = new URL(value, 'https://trustgo.invalid');
  if (url.origin !== 'https://trustgo.invalid' || url.search || url.hash) return null;
  const match = url.pathname.match(new RegExp(`^/${lang}/(booking|checkout)/([^/]+)$`));
  if (!match) return null;
  try {
    const code = decodeURIComponent(match[2]).trim().toUpperCase();
    if (!/^[A-Z0-9-]{1,100}$/.test(code)) return null;
    return { surface: match[1], code };
  } catch {
    return null;
  }
}

export function verifiedBookingReturnPath(
  value: unknown,
  lang: RouteLanguage,
  code: string
): string | null {
  const target = parseBookingReturnPath(value, lang);
  return target && target.code === code.trim().toUpperCase()
    ? `/${lang}/${target.surface}/${encodeURIComponent(target.code)}`
    : null;
}
