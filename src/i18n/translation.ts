import { routeToLanguage, type RouteLanguage } from './locales';
import { translations, type TranslationEntry } from './catalog-base';
import { jaTranslations } from './catalog-ja';
import { esTranslations } from './catalog-es';
import { koTranslations } from './catalog-ko';
import { siteContentTranslations } from './catalog-site-content';
import { rateDetailsTranslations } from './catalog-rate-details';
import { checkoutTranslations } from './catalog-checkout';
import { franchiseTranslations } from './catalog-franchise';
import { bookingManagementTranslations } from './catalog-booking-management';

export function getTranslation(key: string, lang: RouteLanguage): string {
  const language = routeToLanguage(lang);
  if (bookingManagementTranslations[key]) return bookingManagementTranslations[key][language];
  if (checkoutTranslations[key]) return checkoutTranslations[key][language];
  if (franchiseTranslations[key]) return franchiseTranslations[key][language];
  if (rateDetailsTranslations[key]) return rateDetailsTranslations[key][language];
  if (siteContentTranslations[key]) return siteContentTranslations[key][language];
  if (!translations[key]) return key;
  if (language === 'JA') return jaTranslations[key] ?? translations[key].EN;
  if (language === 'ES') return esTranslations[key] ?? translations[key].ES ?? translations[key].EN;
  if (language === 'KO') return koTranslations[key] ?? translations[key].KO ?? translations[key].EN;
  return translations[key][language as keyof TranslationEntry] ?? translations[key].EN;
}
