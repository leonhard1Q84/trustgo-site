import { GuestBookingLink } from '@/modules/booking-management/public-api';
import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
import { InformationPage } from '@/shared/ui/information-page';
import { InformationContactLinks } from '@/shared/ui/information-contact-links';
import { getCustomerServiceStages } from '../domain/customer-service';

export default function CustomerServiceView({ lang }: { lang: RouteLanguage }) {
  const t = (key: string) => getTranslation(key, lang);
  const stages = getCustomerServiceStages(lang);
  const linkClass = 'text-primary underline underline-offset-2';
  return (
    <InformationPage title={t('footer_service_title')} description={t('service_description')}>
      <nav aria-label={t('footer_service_title')}>
        <ul className="space-y-2">
          {stages.map((stage) => (
            <li key={stage.id}><a href={`#${stage.id}`} className={linkClass}>{stage.title}</a></li>
          ))}
        </ul>
      </nav>
      <p>{t('service_terms')}</p>
      <p>{t('service_ota_help')}</p>
      {stages.map((stage) => (
        <section key={stage.id} id={stage.id} className="scroll-mt-24 space-y-4 pt-6">
          <h2 className="text-lg font-bold text-foreground">{stage.title}</h2>
          <p>{stage.description}</p>
          {stage.guidance.map((text) => <p key={text}>{text}</p>)}
          <ul className="space-y-2">
            {stage.links.map((link) => (
              <li key={link.href}><GuestBookingLink href={link.href} className={linkClass}>{link.label}</GuestBookingLink></li>
            ))}
          </ul>
          {stage.notes.map((note) => (
            <div key={note.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">{note.title}</h3>
              <p>{note.body}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <GuestBookingLink href={stage.action.href} className={linkClass}>{stage.action.label}</GuestBookingLink>
            <a href="#contact" className={linkClass}>{t('service_contact_title')}</a>
          </div>
        </section>
      ))}
      <section id="contact" className="scroll-mt-24 space-y-4 pt-6">
        <h2 className="text-lg font-bold text-foreground">{t('service_contact_title')}</h2>
        <p>{t('service_contact_body')}</p>
        <InformationContactLinks lang={lang} />
      </section>
    </InformationPage>
  );
}
