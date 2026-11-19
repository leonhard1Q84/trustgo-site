import { createHmac, timingSafeEqual } from 'node:crypto';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { SearchFormState } from '@/modules/rental-search/domain/search-form';
import type { RouteLanguage } from '@/i18n/locales';

export interface DemoQuote {
  form: SearchFormState;
  offerId: string;
  lang: RouteLanguage;
  issued: number;
  expires: number;
  catalog: string;
}
function secret() {
  const value = process.env.TRUSTGO_DEMO_QUOTE_SECRET;
  if (value && value.length >= 32) return value;
  if (!process.env.VERCEL) return 'trustgo-local-development-quote-key';
  throw new Error('DEMO_QUOTE_SECRET_MISSING');
}
function signature(payload: string) {
  const environment = process.env.VERCEL_ENV === 'preview' ? 'preview' : 'production';
  return createHmac('sha256', secret()).update(`dq1:${environment}:${payload}`).digest();
}

/** Only canonical depot/search fields are signed, never driver details or free text. */
export function signDemoQuote(quote: DemoQuote) {
  const payload = Buffer.from(JSON.stringify(quote)).toString('base64url');
  return `dq1.${payload}.${signature(payload).toString('base64url')}`;
}

export function readDemoQuote(id: string): DemoQuote {
  const expired = () => new RentalError('rate_expired', 410);
  if (id.length > 4096) throw expired();
  const [version, payload, mac, extra] = id.split('.');
  if (version !== 'dq1' || !payload || !mac || extra) throw expired();
  const actual = Buffer.from(mac, 'base64url');
  const expected = signature(payload);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw expired();
  let quote: DemoQuote;
  try { quote = JSON.parse(Buffer.from(payload, 'base64url').toString()); }
  catch { throw expired(); }
  if (!Number.isFinite(quote.issued) || !Number.isFinite(quote.expires) || quote.issued > Date.now() + 60_000
    || quote.expires <= quote.issued || quote.expires - quote.issued > 30 * 60_000
    || quote.expires + 86_400_000 <= Date.now()) throw expired();
  return quote;
}
