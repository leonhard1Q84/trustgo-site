import {isRouteLanguage} from '@/i18n/locales';
import {CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION} from './account.rules';
import type {AccountCreationConsent, CheckoutAccountSelection} from './account.types';

export function checkoutAccountConsent(selection: CheckoutAccountSelection | undefined): AccountCreationConsent | undefined {
  if (selection === undefined || selection.create_account_requested === false) return undefined;
  const consent = selection.account_creation_consent;
  if (selection.create_account_requested !== true || !consent
    || consent.terms_version !== CURRENT_TERMS_VERSION || consent.privacy_version !== CURRENT_PRIVACY_VERSION
    || !isRouteLanguage(consent.locale)) throw new Error('INVALID_ACCOUNT_CONSENT');
  return {...consent, agreed_at: new Date().toISOString()};
}
