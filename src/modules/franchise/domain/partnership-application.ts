import { isRouteLanguage, type RouteLanguage } from '@/i18n/locales';

export const applicationLimits = { contactName: 120, company: 160, email: 254, help: 2000 } as const;
export type ApplicationField = keyof typeof applicationLimits;
export type PartnershipApplication = Record<ApplicationField, string> & {
  consent: true;
  lang: RouteLanguage;
};

export function parsePartnershipApplication(value: unknown): PartnershipApplication | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.consent !== true || typeof input.lang !== 'string' || !isRouteLanguage(input.lang)) return null;
  const fields = {} as Record<ApplicationField, string>;
  for (const field of Object.keys(applicationLimits) as ApplicationField[]) {
    if (typeof input[field] !== 'string') return null;
    const text = input[field].trim();
    if (text.length > applicationLimits[field] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) return null;
    fields[field] = text;
  }
  if (!fields.contactName || !fields.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return null;
  return { ...fields, email: fields.email.toLowerCase(), consent: true, lang: input.lang };
}
