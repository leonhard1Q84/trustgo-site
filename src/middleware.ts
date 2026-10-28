import { NextResponse, type NextRequest } from 'next/server';
import {
  isRouteLanguage, defaultRouteLanguage
} from './i18n/locales';

const PUBLIC_FILE_EXTENSIONS =
  /\.(png|jpg|jpeg|svg|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|json)$/i;

function detectPreferredLanguage(request: NextRequest): string {
  // 1. Check cookies
  const cookieLocale =
    request.cookies.get('tg_locale')?.value || request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isRouteLanguage(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang
      .split(',')
      .map((part) => {
        const [lang, qPart] = part.trim().split(';q=');
        return {
          lang: lang.trim().toLowerCase(),
          q: qPart ? parseFloat(qPart) : 1.0,
        };
      })
      .sort((a, b) => b.q - a.q);

    for (const item of preferred) {
      if (item.lang.startsWith('zh')) return 'zh';
      if (item.lang.startsWith('ja')) return 'ja';
      if (item.lang.startsWith('es')) return 'es';
      if (item.lang.startsWith('ko')) return 'ko';
      if (item.lang.startsWith('en')) return 'en';
    }
  }

  return defaultRouteLanguage;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals, API, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand') ||
    PUBLIC_FILE_EXTENSIONS.test(pathname) ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png'
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // If first segment is a valid route language
  if (isRouteLanguage(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tg-route-language', firstSegment);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('x-tg-route-language', firstSegment);
    return response;
  }

  // If missing language prefix or invalid prefix, detect and redirect
  const targetLang = detectPreferredLanguage(request);
  const redirectUrl = new URL(
    `/${targetLang}${pathname === '/' ? '' : pathname}${request.nextUrl.search}`,
    request.url
  );

  return NextResponse.redirect(redirectUrl, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
