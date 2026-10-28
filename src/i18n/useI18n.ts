import { routeToLanguage, type RouteLanguage, type Language } from './locales';
import { getTranslation } from './translation';
import { useLanguage } from './LanguageContext';

export { getTranslation } from './translation';

export function useI18n(lang?: RouteLanguage) {
  try {
    const ctx = useLanguage();
    return {
      t: (key: string) => {
        if (lang) return getTranslation(key, lang);
        return ctx.t(key);
      },
      language: ctx.language,
      routeLang: lang ?? ctx.routeLang,
    };
  } catch {
    return {
      t: (key: string) => getTranslation(key, lang ?? 'en'),
      language: (lang ? routeToLanguage(lang) : 'EN') as Language,
      routeLang: lang ?? 'en',
    };
  }
}
