import type {SavedTravelerInput} from './account.types';

export const CURRENT_TERMS_VERSION = 'account-terms-v1';
export const CURRENT_PRIVACY_VERSION = 'privacy-v1';

export const CHALLENGE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
export const CHALLENGE_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const CHALLENGE_MAX_ATTEMPTS = 5;
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const SESSION_COOKIE_NAME = 'tg_auth_session';
export const CURRENT_MARKETING_CONSENT_VERSION = 'marketing-consent-v1';

export const TRAVELER_DOCUMENT_TYPES = [
  'passport',
  'driver_license',
  'government_id',
  'international_driving_permit',
  'certified_translation',
  'other_id',
] as const;

export const ACCOUNT_NOTIFICATION_CHANNELS = ['email', 'sms'] as const;
const EXPIRY_DOCUMENT_TYPES = new Set([
  'passport',
  'driver_license',
  'government_id',
  'international_driving_permit',
]);

/**
 * Normalizes email address:
 * - Trims leading/trailing whitespace
 * - Converts domain part to lowercase
 * - Preserves username part (including +tags)
 */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0) return trimmed.toLowerCase();
  const user = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  return `${user}@${domain}`;
}

/**
 * Basic email format validator.
 */
export function validateEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

/**
 * Masks an email for safe display, e.g. "c***@example.com".
 */
export function maskEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const [user, domain] = normalized.split('@');
  if (!user || !domain) return normalized;
  const visibleUser = user.length <= 2 ? `${user[0] || '*'}***` : `${user.slice(0, 2)}***`;
  return `${visibleUser}@${domain}`;
}

export interface PasswordValidationResult {
  valid: boolean;
  messageKey?: string;
}

/**
 * Password complexity rule:
 * - Minimum 8 characters
 * - Must contain at least one letter and one number
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return {valid: false, messageKey: 'account.error.password_too_short'};
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (!hasLetter || !hasDigit) {
    return {valid: false, messageKey: 'account.error.password_complexity'};
  }
  return {valid: true};
}

/**
 * Validates 6-digit numeric verification code.
 */
export function validateVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

export function isTravelerDocumentType(value: string): boolean {
  return (TRAVELER_DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function validateDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isDateOnOrAfterToday(value: string): boolean {
  if (!validateDate(value)) return false;
  return value >= new Date().toISOString().slice(0, 10);
}

export function isDateOnOrBeforeToday(value: string): boolean {
  if (!validateDate(value)) return false;
  return value <= new Date().toISOString().slice(0, 10);
}

export function documentTypeRequiresExpiry(value: string): boolean {
  return EXPIRY_DOCUMENT_TYPES.has(value);
}

export function validatePhoneCountryCode(value: string): boolean {
  return /^\+\d{1,4}$/.test(value.trim());
}

export function validatePhoneNumber(value: string): boolean {
  const digits = normalizePhoneNumber(value).replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15;
}

export function validateAccountCreationRequestId(value: unknown): value is string {
  return typeof value === 'string'
    && value.length >= 8
    && value.length <= 128
    && /^[A-Za-z0-9._:-]+$/.test(value);
}

export function validateSavedTravelerInput(
  input: SavedTravelerInput,
  options: {allowMaskedDocument?: boolean} = {},
): string | null {
  if (!input || typeof input !== 'object') return 'TRAVELER_FIELDS_REQUIRED';
  if (!input.given_names?.trim()) return 'GIVEN_NAMES_REQUIRED';
  if ((!input.no_surname && !input.surname?.trim()) || (input.no_surname && input.surname?.trim())) {
    return 'SURNAME_INVALID';
  }
  if (!input.birth_date || !isDateOnOrBeforeToday(input.birth_date)) return 'BIRTH_DATE_INVALID';
  if (!input.nationality_region?.trim()) return 'NATIONALITY_REQUIRED';
  if (input.consent_confirmed !== true) return 'TRAVELER_CONSENT_REQUIRED';
  if (!Array.isArray(input.documents) || input.documents.length === 0) return 'DOCUMENT_REQUIRED';

  for (const document of input.documents) {
    if (!document?.document_type || !isTravelerDocumentType(document.document_type)) {
      return 'DOCUMENT_TYPE_INVALID';
    }
    const hasExistingDocumentId = Boolean(document.document_id?.trim());
    if (!document.document_number?.trim() && !(options.allowMaskedDocument && hasExistingDocumentId)) {
      return 'DOCUMENT_NUMBER_REQUIRED';
    }
    if (!document.issuing_region?.trim()) return 'DOCUMENT_ISSUING_REGION_REQUIRED';
    if (document.expiry_date && !validateDate(document.expiry_date)) {
      return 'DOCUMENT_EXPIRY_INVALID';
    }
    if (documentTypeRequiresExpiry(document.document_type)
      && (!document.expiry_date || !isDateOnOrAfterToday(document.expiry_date))) {
      return 'DOCUMENT_EXPIRY_INVALID';
    }
  }
  return null;
}

export function accountErrorMessageKey(
  code: string | undefined,
  fallback = 'account.error.generic',
): string {
  switch (code) {
    case 'INVALID_EMAIL':
      return 'account.error.invalid_email';
    case 'PASSWORD_REQUIRED':
      return 'account.error.password_required';
    case 'INVALID_PASSWORD':
    case 'account.error.password_too_short':
    case 'account.error.password_complexity':
      return 'account.error.password_complexity';
    case 'PASSWORD_MISMATCH':
      return 'account.error.password_mismatch';
    case 'INVALID_LEGAL_VERSION':
    case 'CONSENT_REQUIRED':
      return 'account.error.consent_required';
    case 'EMAIL_ALREADY_EXISTS':
      return 'account.error.email_already_registered';
    case 'PASSWORD_NOT_SET':
      return 'account.error.password_not_set_hint';
    case 'INVALID_CREDENTIALS':
      return 'account.error.invalid_credentials';
    case 'ACCOUNT_NOT_FOUND':
      return 'account.sign_in.not_found';
    case 'RATE_LIMITED':
      return 'account.verification.rate_limited';
    case 'GIVEN_NAMES_REQUIRED':
    case 'SURNAME_INVALID':
      return 'account.error.name_required';
    case 'TRAVELER_FIELDS_REQUIRED':
    case 'BIRTH_DATE_INVALID':
    case 'NATIONALITY_REQUIRED':
      return 'account.error.traveler_fields_required';
    case 'TRAVELER_CONSENT_REQUIRED':
      return 'account.error.traveler_consent_required';
    case 'DOCUMENT_REQUIRED':
    case 'DOCUMENT_TYPE_INVALID':
    case 'DOCUMENT_NUMBER_REQUIRED':
    case 'DOCUMENT_ISSUING_REGION_REQUIRED':
    case 'DOCUMENT_EXPIRY_INVALID':
    case 'DOCUMENT_FIELDS_REQUIRED':
      return 'account.error.document_fields_required';
    case 'CONTACT_FIELDS_REQUIRED':
    case 'CONTACT_NAME_REQUIRED':
    case 'CONTACT_EMAIL_INVALID':
    case 'PHONE_COUNTRY_CODE_REQUIRED':
    case 'PHONE_COUNTRY_CODE_INVALID':
    case 'PHONE_NUMBER_REQUIRED':
    case 'PHONE_NUMBER_INVALID':
    case 'PHONE_INVALID':
    case 'CONTACT_USE_REQUIRED':
    case 'CONTACT_USE_INVALID':
      return 'account.error.contact_fields_required';
    case 'RECEIPT_EMAIL_REQUIRED':
    case 'RECEIPT_EMAIL_INVALID':
      return 'account.error.receipt_email_required';
    case 'INVALID_CHANNELS':
    case 'INVALID_MARKETING_OPT_IN':
    case 'MARKETING_CONSENT_LOCALE_REQUIRED':
    case 'INVALID_REQUEST_ID':
    case 'PROFILE_FIELD_TOO_LONG':
      return fallback;
    case 'INVALID_CODE':
    case 'EXPIRED':
    case 'MISMATCH':
    case 'NOT_FOUND':
    case 'USED':
    case 'TOO_MANY_ATTEMPTS':
    case 'MISSING_VERIFICATION':
      return 'account.verification.invalid';
    case 'NETWORK_ERROR':
      return 'account.error.network';
    default:
      return fallback;
  }
}

export function maskDocumentNumber(value: string): string {
  const normalized = value.trim();
  if (!normalized) return '';
  if (normalized.length <= 4) return '••••';
  return `${'•'.repeat(Math.max(4, normalized.length - 4))}${normalized.slice(-4)}`;
}

export function normalizePhoneNumber(value: string): string {
  return value.replace(/[^\d\s().-]/g, '').trim();
}

export function hasMeaningfulName(input: {
  given_names?: string;
  surname?: string;
  no_surname?: boolean;
}): boolean {
  const givenNames = input.given_names?.trim() ?? '';
  const surname = input.surname?.trim() ?? '';
  if (!givenNames) return false;
  if (input.no_surname) return !surname;
  return Boolean(surname);
}

/**
 * Formats an internal account ID into an elegant, official TrustGo Customer ID.
 * Example: 'acc_76f7b52d5ef06f15' -> 'TG-7685-2061'
 */
export function formatCustomerId(accountId: string): string {
  if (!accountId) return 'TG-8829-1065';
  if (accountId.startsWith('TG-')) return accountId;

  // Deterministically convert any internal string (like hex) into an elegant 8-digit segmented membership ID
  const clean = accountId.replace(/[^a-fA-F0-9]/g, '') || '88291065';
  let num = 0;
  for (let i = 0; i < clean.length; i++) {
    num = (num * 31 + clean.charCodeAt(i)) % 90000000;
  }
  const idNum = 10000000 + Math.abs(num);
  const str = idNum.toString();
  return `TG-${str.slice(0, 4)}-${str.slice(4, 8)}`;
}
