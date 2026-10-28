import { Mail, Phone } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';

export function InformationContactLinks({ lang }: { lang: RouteLanguage }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 not-prose">
      <a
        href="mailto:soren.yang@trustgo.tech"
        aria-label={getTranslation('contact_email_label', lang)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-muted border border-border text-xs font-semibold text-foreground hover:bg-brand-light hover:text-primary transition-colors"
      >
        <Mail className="w-4 h-4 text-foreground-secondary" aria-hidden="true" />
        <span>soren.yang@trustgo.tech</span>
      </a>
      <a
        href="https://wa.me/8618761991085"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={getTranslation('contact_whatsapp_label', lang)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-muted border border-border text-xs font-semibold text-foreground hover:bg-brand-light hover:text-primary transition-colors"
      >
        <Phone className="w-4 h-4 text-foreground-secondary" aria-hidden="true" />
        <span>+86 187 6199 1085</span>
      </a>
    </div>
  );
}
