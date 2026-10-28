export const routeLanguages = ['en', 'zh', 'ja', 'es', 'ko'] as const;
export const uiLanguages = ['EN', 'ZH', 'JA', 'ES', 'KO'] as const;

export type RouteLanguage = (typeof routeLanguages)[number];
export type Language = (typeof uiLanguages)[number];

// Alias for backwards compatibility
export const SUPPORTED_LOCALES = routeLanguages;
export type Locale = RouteLanguage;

export const defaultRouteLanguage: RouteLanguage = 'en';
export const defaultLanguage: Language = 'EN';
export const DEFAULT_LOCALE: Locale = defaultRouteLanguage;

export const routeToLanguageMap: Record<RouteLanguage, Language> = {
  en: 'EN',
  zh: 'ZH',
  ja: 'JA',
  es: 'ES',
  ko: 'KO',
};

export const languageToRouteMap: Record<Language, RouteLanguage> = {
  EN: 'en',
  ZH: 'zh',
  JA: 'ja',
  ES: 'es',
  KO: 'ko',
};

export const htmlLangMap: Record<RouteLanguage, string> = {
  en: 'en',
  zh: 'zh-Hant',
  ja: 'ja',
  es: 'es',
  ko: 'ko',
};

export const ogLocaleMap: Record<RouteLanguage, string> = {
  en: 'en_US',
  zh: 'zh_TW',
  ja: 'ja_JP',
  es: 'es_ES',
  ko: 'ko_KR',
};

export const sitemapLocaleMap: Record<RouteLanguage, string> = {
  en: 'en-US',
  zh: 'zh-Hant',
  ja: 'ja-JP',
  es: 'es-ES',
  ko: 'ko-KR',
};

export interface LocaleConfig {
  code: RouteLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LOCALES_MAP: Record<RouteLanguage, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  zh: {
    code: 'zh',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇭🇰',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
  },
};

export const LOCALE_LABELS = LOCALES_MAP;

export const languageLabels: Record<Language, string> = {
  EN: 'English',
  ZH: '繁體中文',
  JA: '日本語',
  ES: 'Español',
  KO: '한국어',
};

export function isRouteLanguage(value: string | undefined | null): value is RouteLanguage {
  return Boolean(value && (routeLanguages as readonly string[]).includes(value));
}

export function isValidLocale(locale: string | undefined | null): locale is Locale {
  return isRouteLanguage(locale);
}

export function normalizeRouteLanguage(value: string | undefined | null): RouteLanguage {
  if (!value) return defaultRouteLanguage;
  const normalized = value.toLowerCase();
  if (normalized.startsWith('zh')) return 'zh';
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('ko') || normalized.startsWith('kr')) return 'ko';
  if (normalized.startsWith('en')) return 'en';
  return defaultRouteLanguage;
}

export function getValidatedLocale(locale: string | undefined | null): Locale {
  return normalizeRouteLanguage(locale);
}

export function routeToLanguage(routeLanguage: RouteLanguage): Language {
  return routeToLanguageMap[routeLanguage] || defaultLanguage;
}

export function languageToRoute(language: string): RouteLanguage {
  const normalized = language.toUpperCase();
  if (normalized in languageToRouteMap) return languageToRouteMap[normalized as Language];
  return normalizeRouteLanguage(language);
}

export { getDictionary, type Dictionary } from './dictionaries';
