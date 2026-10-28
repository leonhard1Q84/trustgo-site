import type {RouteLanguage} from '@/i18n/locales';

export type PasswordState = 'set' | 'not_set';
export type EmailVerificationState = 'verified' | 'unverified' | 'pending';
export type TravelerDocumentType =
  | 'passport'
  | 'driver_license'
  | 'government_id'
  | 'international_driving_permit'
  | 'certified_translation'
  | 'other_id';
export type AccountNotificationChannel = 'email' | 'sms';

export interface AccountCreationConsent {
  terms_version: string;
  privacy_version: string;
  locale: RouteLanguage;
  agreed_at: string;
}

export interface CustomerProfileData {
  title?: 'mr' | 'ms';
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  no_surname?: boolean;
  birth_date?: string; // YYYY-MM-DD
  nationality_region?: string;
  city?: string;
  phone_country_code?: string;
  phone_number?: string;
  sms_updates?: boolean;
  email_offers?: boolean;
  // Passport details
  passport_number?: string;
  passport_country?: string;
  passport_expiry?: string;
  // Driver License details
  license_region?: string;
  license_number?: string;
  license_permit_type?: 'idp_1949' | 'jp_translation' | 'domestic';
  license_expiry?: string;
  // Membership
  member_discount_code?: string;
  new_password?: string;
}

export interface TravelerDocument {
  document_id: string;
  document_type: TravelerDocumentType;
  document_number: string;
  issuing_region: string;
  expiry_date?: string;
  permit_type?: 'idp_1949' | 'jp_translation' | 'domestic';
}

export interface SavedTravelerProfile {
  traveler_id: string;
  given_names: string;
  surname?: string;
  no_surname: boolean;
  birth_date: string;
  nationality_region: string;
  gender?: 'female' | 'male' | 'unspecified';
  is_default: boolean;
  consent_confirmed: boolean;
  created_at: string;
  updated_at: string;
  documents: TravelerDocument[];
}

export interface PublicTravelerDocument extends Omit<TravelerDocument, 'document_number'> {
  document_number_masked: string;
}

export interface PublicSavedTravelerProfile extends Omit<SavedTravelerProfile, 'documents'> {
  documents: PublicTravelerDocument[];
}

export interface ReceiptInvoiceContact {
  receipt_invoice_email?: string;
  invoice_recipient_name?: string;
  invoice_address?: string;
  invoice_tax_id?: string;
}

export interface SavedContactProfile extends ReceiptInvoiceContact {
  contact_id: string;
  contact_name: string;
  contact_email: string;
  phone_country_code: string;
  phone_number: string;
  uses: Array<'booking_confirmation' | 'trip_updates' | 'customer_service' | 'receipt_invoice'>;
  is_default_booking: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountManagementPreferences {
  notification_channels: AccountNotificationChannel[];
  booking_reminder_channels: AccountNotificationChannel[];
  marketing_opt_in: boolean;
  marketing_consent_version?: string;
  marketing_consent_locale?: string;
  marketing_consent_source?: 'account_management';
  marketing_consented_at?: string;
  updated_at: string;
}

export interface CustomerAccount {
  account_id: string;
  primary_email: string;
  password_state: PasswordState;
  email_verification_state: EmailVerificationState;
  password_hash?: string;
  password_salt?: string;
  consent: AccountCreationConsent;
  created_at: string;
  updated_at: string;
  source: 'standalone_registration' | 'guest_checkout';
  profile?: CustomerProfileData;
  travelers: SavedTravelerProfile[];
  contacts: SavedContactProfile[];
  management_preferences: AccountManagementPreferences;
}

export type ChallengePurpose = 'first_time_password' | 'forgot_password' | 'registration' | 'email_verification';

export interface VerificationChallenge {
  challenge_id: string;
  email: string;
  purpose: ChallengePurpose;
  code_hash: string;
  expires_at: number;
  attempts: number;
  verified: boolean;
}

export interface AccountAuthSession {
  session_id: string;
  account_id: string;
  email: string;
  created_at: number;
  expires_at: number;
}

export interface PublicAccountProfile {
  customer_id: string;
  primary_email: string;
  password_state: PasswordState;
  email_verification_state: EmailVerificationState;
  created_at: string;
  source: CustomerAccount['source'];
  profile?: CustomerProfileData;
}

export interface RegistrationRequest {
  email: string;
  challenge_id?: string;
  verification_code?: string;
  password: string;
  password_confirmation: string;
  terms_version: string;
  privacy_version: string;
  consent_locale: RouteLanguage;
  account_creation_request_id: string;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  code?: string;
  account?: PublicAccountProfile;
}

export interface PasswordSignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  success: boolean;
  code?: 'SUCCESS' | 'PASSWORD_REQUIRED' | 'PASSWORD_NOT_SET' | 'INVALID_CREDENTIALS' | 'ACCOUNT_NOT_FOUND' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'SERVICE_UNAVAILABLE';
  message?: string;
  account?: PublicAccountProfile;
}

export interface ChallengeRequest {
  email: string;
  purpose: ChallengePurpose;
  locale: RouteLanguage;
}

export interface ChallengeResponse {
  success: boolean;
  code?: string;
  challenge_id: string;
  masked_email: string;
  dev_code?: string; // only in non-production for testing
  message?: string;
}

export interface VerifyAndSetPasswordRequest {
  email: string;
  challenge_id: string;
  verification_code: string;
  new_password: string;
  new_password_confirmation: string;
  purpose: Extract<ChallengePurpose, 'first_time_password' | 'forgot_password'>;
}

export interface SessionResponse {
  authenticated: boolean;
  account?: PublicAccountProfile;
}

export interface CheckoutAccountSelection {
  create_account_requested: boolean;
  account_creation_consent?: {
    terms_version: string;
    privacy_version: string;
    locale: RouteLanguage;
  };
}

export interface CheckoutAccountCreationPayload {
  reservation_id: string;
}

export type TravelerDocumentInput = Omit<TravelerDocument, 'document_id'> & {
  document_id?: string;
};

export interface SavedTravelerInput {
  given_names: string;
  surname?: string;
  no_surname?: boolean;
  birth_date: string;
  nationality_region: string;
  gender?: SavedTravelerProfile['gender'];
  is_default?: boolean;
  consent_confirmed: boolean;
  documents: Array<Partial<TravelerDocumentInput> & Pick<TravelerDocumentInput, 'document_type' | 'issuing_region'>>;
}

export interface SavedContactInput {
  contact_name: string;
  contact_email: string;
  phone_country_code: string;
  phone_number: string;
  uses: SavedContactProfile['uses'];
  is_default_booking?: boolean;
  receipt_invoice_email?: string;
  invoice_recipient_name?: string;
  invoice_address?: string;
  invoice_tax_id?: string;
}
