import type { RouteLanguage } from '@/i18n/locales';
import { B2B_CONTACT } from '@/modules/franchise/contact';
import { getTranslation } from '@/i18n/translation';

export interface FooterLinkGroup {
  title: string;
  links: Array<
    | { href: string; label: string; action?: never }
    | { action: 'partnership'; label: string; href?: never }
  >;
}

export function getFooterGroups(
  lang: RouteLanguage
): Record<'rent' | 'service' | 'business' | 'company', FooterLinkGroup> {
  const t = (key: string) => getTranslation(key, lang);
  const link = (path: string, key: string) => ({ href: `/${lang}/${path}`, label: t(key) });
  return {
    rent: {
      title: t('footer_rental_title'),
      links: [
        link('car-rental', 'footer_destinations'),
        link('locations', 'footer_locations'),
        link('help', 'footer_rental_guide'),
        link('help/faq/driver-requirements', 'footer_driver_requirements'),
        link('help/faq/protection-and-liability', 'footer_protection'),
      ],
    },
    service: {
      title: t('footer_service_title'),
      links: [
        link('help/customer-service#before-booking', 'footer_before_booking'),
        link('help/customer-service#booking-and-rental', 'footer_booking_rental'),
        link('help/customer-service#after-rental', 'footer_after_rental'),
        link('manage-booking', 'footer_find_booking'),
        link('account', 'footer_account'),
      ],
    },
    business: {
      title: t('footer_business_title'),
      links: [
        link('franchise', 'footer_fleet_partnership'),
        { action: 'partnership', label: t('footer_business_contact') },
        { href: B2B_CONTACT.merchantPortalUrl, label: t('franchise_login') },
      ],
    },
    company: {
      title: t('footer_about_title'),
      links: [
        link('about', 'footer_about_us'),
        link('about#service-standards', 'footer_service_standards'),
        link('about#network', 'about_destinations_cta'),
      ],
    },
  };
}
