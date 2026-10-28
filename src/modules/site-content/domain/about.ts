import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';

export function getAboutSections(lang: RouteLanguage) {
  const t = (key: string) => getTranslation(key, lang);
  return [
    { id: 'easy-booking', title: t('about_easy_title'), body: t('about_easy_body') },
    {
      id: 'travel-with-confidence',
      title: t('about_confidence_title'),
      body: t('about_confidence_body'),
    },
    { id: 'freedom-to-explore', title: t('about_freedom_title'), body: t('about_freedom_body') },
  ];
}

export function getAboutStandards(lang: RouteLanguage) {
  const t = (key: string) => getTranslation(key, lang);
  return [
    {
      id: 'price',
      title: t('about_price_title'),
      body: t('about_price_body'),
      href: `/${lang}/car-rental`,
      label: t('service_search'),
    },
    {
      id: 'pickup',
      title: t('about_pickup_title'),
      body: t('about_pickup_body'),
      href: `/${lang}/locations`,
      label: t('about_locations_cta'),
    },
    {
      id: 'rules',
      title: t('about_rules_title'),
      body: t('about_rules_body'),
      href: `/${lang}/help/faq/protection-and-liability`,
      label: t('about_rules_cta'),
    },
    {
      id: 'support',
      title: t('about_support_title'),
      body: t('about_support_body'),
      href: `/${lang}/help/customer-service`,
      label: t('footer_service_title'),
    },
  ] as const;
}
