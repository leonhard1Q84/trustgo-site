import { RentalError } from '@/modules/reservation/domain/validation';

export const LOCAL_PAYMENT_SCENARIOS = [
  'success', 'declined', 'insufficient_funds', 'authentication_failed', 'processing', 'unknown', 'unavailable',
] as const;
export type LocalPaymentScenario = typeof LOCAL_PAYMENT_SCENARIOS[number];

/** Map test PANs in memory; only the nonsensitive scenario goes to the local API. */
export function localPaymentScenarioForCard(number: string): LocalPaymentScenario {
  const normalized = number.replace(/\s/g, '');
  if (process.env.NODE_ENV !== 'production') {
    const shortcut = ({ '0002': 'declined', '9995': 'insufficient_funds', '3063': 'authentication_failed',
      '3155': 'processing', '0119': 'unknown', '0259': 'unavailable' } as Record<string, LocalPaymentScenario>)[normalized];
    if (shortcut) return shortcut;
  }
  return ({
    '4000000000000002': 'declined',
    '4000000000009995': 'insufficient_funds',
    '4000000000003063': 'authentication_failed',
    '4000002500003155': 'processing',
    '4000000000000119': 'unknown',
    '4000000000000259': 'unavailable',
  } as Record<string, LocalPaymentScenario>)[normalized] ?? 'success';
}

export function readLocalPaymentScenario(value: unknown): LocalPaymentScenario {
  if (value === undefined) return 'success';
  if (typeof value !== 'string' || !LOCAL_PAYMENT_SCENARIOS.includes(value as LocalPaymentScenario)) {
    throw new RentalError('invalid_request', 400);
  }
  return value as LocalPaymentScenario;
}
