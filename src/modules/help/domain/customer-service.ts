import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import type { HelpFaqTopicId } from './helpFaq';

export interface ServiceLink {
  label: string;
  href: string;
}

export interface CustomerServiceStage {
  id: 'before-booking' | 'booking-and-rental' | 'after-rental';
  title: string;
  description: string;
  guidance: string[];
  links: ServiceLink[];
  notes: Array<{ title: string; body: string }>;
  action: ServiceLink;
}

export function getCustomerServiceStages(lang: RouteLanguage): CustomerServiceStage[] {
  const t = (key: string) => getTranslation(key, lang);
  const topic = (id: HelpFaqTopicId, key: string, anchor = ''): ServiceLink => ({
    href: `/${lang}/help/faq/${id}${anchor ? `#${anchor}` : ''}`,
    label: t(key),
  });
  const manage = { href: `/${lang}/manage-booking`, label: t('footer_find_booking') };
  return [
    {
      id: 'before-booking',
      title: t('footer_before_booking'),
      description: t('service_before_intro'),
      guidance: [],
      links: [
        topic('driver-requirements', 'footer_driver_requirements'),
        topic('vehicles-and-extras', 'service_vehicles'),
        topic('pricing-payment-and-deposit', 'service_payment'),
        topic('protection-and-liability', 'footer_protection'),
      ],
      notes: [],
      action: { href: `/${lang}/rent`, label: t('service_search') },
    },
    {
      id: 'booking-and-rental',
      title: t('footer_booking_rental'),
      description: t('service_during_intro'),
      guidance: [t('service_no_modification'), t('service_branch_help')],
      links: [
        topic('making-a-reservation', 'footer_rental_guide'),
        topic('pricing-payment-and-deposit', 'service_payment'),
        topic('managing-a-reservation', 'service_cancel', 'how-to-cancel-reservation'),
        topic('pickup-and-return', 'service_pickup'),
        topic('during-your-rental', 'service_roadside', 'accident-first-step'),
      ],
      notes: [],
      action: manage,
    },
    {
      id: 'after-rental',
      title: t('footer_after_rental'),
      description: t('service_after_intro'),
      guidance: [],
      links: [
        topic('managing-a-reservation', 'service_refunds', 'refund-status-check'),
        topic('pricing-payment-and-deposit', 'service_payment'),
        topic('during-your-rental', 'service_receipts', 'post-return-payment-proof-and-invoices'),
        topic('during-your-rental', 'service_final_charges', 'post-return-final-charges-timeline'),
      ],
      notes: [
        { title: t('service_lost_found'), body: t('service_lost_found_body') },
        { title: t('service_complaints'), body: t('service_complaints_body') },
      ],
      action: manage,
    },
  ];
}
