import type { PaymentCardDetails } from './types';

export function isValidPaymentExpiry(expiry: string, now = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
  return Boolean(match && new Date(2000 + Number(match[2]), Number(match[1]), 1) > now);
}

/** Local form validation only. A real payment must use provider-hosted fields. */
export function isValidPaymentCard(card: PaymentCardDetails, now = new Date()): boolean {
  const number = card.cardNumber.replace(/\s/g, '');
  if (!/^\d{15,19}$/.test(number) || /^0+$/.test(number) || !/^\d{3,4}$/.test(card.cvc) || !card.cardholderName.trim()) return false;
  const sum = [...number].reverse().reduce((total, digit, index) => {
    let value = Number(digit);
    if (index % 2) { value *= 2; if (value > 9) value -= 9; }
    return total + value;
  }, 0);
  if (sum % 10) return false;
  return isValidPaymentExpiry(card.expiryDate, now);
}

/** Preview accepts easy dummy data; production retains the strict card checks. */
export function paymentCardValidationError(card: PaymentCardDetails, now = new Date()): 'invalid_card' | 'invalid_expiry' | null {
  const number = card.cardNumber.replace(/\s/g, '');
  const preview = process.env.NODE_ENV !== 'production';
  if (!(preview ? /^\d{1,19}$/ : /^\d{15,19}$/).test(number)) return 'invalid_card';
  if (!isValidPaymentExpiry(card.expiryDate, now)) return 'invalid_expiry';
  if (!card.cardholderName.trim() || /^0+$/.test(number)
    || !(preview ? /^\d{1,4}$/ : /^\d{3,4}$/).test(card.cvc)) return 'invalid_card';
  return preview || isValidPaymentCard(card, now) ? null : 'invalid_card';
}
