import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { getHelpFaq, type HelpFaqTopicId } from './helpFaq';

export const helpCenterCategoryIds = [
  'making',
  'managing',
  'pickup',
  'during',
  'return',
  'billing',
] as const;
export type HelpCenterCategoryId = (typeof helpCenterCategoryIds)[number];
export type HelpCenterLink = { title: string; href: string };

export function getHelpCenterNavigation(lang: RouteLanguage) {
  const { topics } = getHelpFaq(lang);
  const t = (key: string) => getTranslation(key, lang);
  const topic = (id: HelpFaqTopicId): HelpCenterLink => ({
    title: topics[id].title,
    href: `/${lang}/help/faq/${id}`,
  });
  const question = (id: HelpFaqTopicId, questionId: string): HelpCenterLink => {
    const entry = topics[id].questions.find((item) => item.id === questionId);
    if (!entry) throw new Error(`Missing help navigation question: ${id}/${questionId}`);
    return { title: entry.question, href: `${topic(id).href}#${questionId}` };
  };
  const managing = (id: string) => question('managing-a-reservation', id);
  const pickup = (id: string) => question('pickup-and-return', id);
  const during = (id: string) => question('during-your-rental', id);
  const links: Record<HelpCenterCategoryId, HelpCenterLink[]> = {
    making: [
      topic('driver-requirements'),
      topic('making-a-reservation'),
      topic('vehicles-and-extras'),
      topic('pricing-payment-and-deposit'),
      topic('protection-and-liability'),
      topic('fuel-mileage-and-travel'),
      managing('cancellation-fee'),
      { title: t('help_center_pet'), href: `/${lang}/help/pet-travel` },
    ],
    managing: [
      topic('managing-a-reservation'),
      managing('how-to-cancel-reservation'),
      managing('how-to-modify-reservation'),
      managing('refund-status-check'),
      managing('flight-delay-or-cancellation'),
      managing('what-is-no-show'),
    ],
    pickup: [
      pickup('how-to-find-pickup-location'),
      pickup('rental-day-requirements'),
      pickup('branch-opening-hours'),
      pickup('airport-shuttle'),
      pickup('outside-business-hours'),
      pickup('pre-departure-inspection'),
      pickup('existing-damage'),
      topic('driver-requirements'),
    ],
    during: [
      topic('during-your-rental'),
      during('roadside-assistance-services'),
      during('vehicle-breakdown-or-starting-failure'),
      during('accident-first-step'),
      during('lost-key-lockout-procedure'),
      topic('fuel-mileage-and-travel'),
      pickup('extend-rental'),
      topic('protection-and-liability'),
    ],
    return: [
      topic('pickup-and-return'),
      pickup('late-return-rules'),
      pickup('outside-business-hours'),
      pickup('one-way-rental'),
      pickup('avoid-post-return-fees'),
      topic('fuel-mileage-and-travel'),
    ],
    billing: [
      topic('pricing-payment-and-deposit'),
      managing('refund-status-check'),
      during('post-return-payment-proof-and-invoices'),
      during('post-return-final-charges-timeline'),
      during('dispute-post-return-charges'),
      during('traffic-and-parking-fines'),
    ],
  };
  return helpCenterCategoryIds.map((id) => ({
    id,
    title: t(`help_center_${id}`),
    links: links[id],
  }));
}
