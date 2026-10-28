import crypto from 'node:crypto';
import type {
  AccountAuthSession,
  AccountCreationConsent,
  AccountManagementPreferences,
  ChallengePurpose,
  CustomerAccount,
  CustomerProfileData,
  PublicAccountProfile,
  PublicSavedTravelerProfile,
  SavedContactInput,
  SavedContactProfile,
  SavedTravelerInput,
  SavedTravelerProfile,
  TravelerDocument,
  VerificationChallenge,
} from '@/modules/customer-account/domain/account.types';
import {
  CHALLENGE_EXPIRY_MS,
  CHALLENGE_MAX_ATTEMPTS,
  CHALLENGE_RESEND_COOLDOWN_MS,
  CURRENT_MARKETING_CONSENT_VERSION,
  SESSION_TTL_MS,
  ACCOUNT_NOTIFICATION_CHANNELS,
  normalizePhoneNumber,
  validateEmail,
  validatePhoneCountryCode,
  validatePhoneNumber,
  validateSavedTravelerInput,
  maskDocumentNumber,
  normalizeEmail,
  formatCustomerId,
} from '@/modules/customer-account/domain/account.rules';

interface GlobalAccountState {
  accounts: Map<string, CustomerAccount>;
  emailIndex: Map<string, string>;
  sessions: Map<string, AccountAuthSession>;
  challenges: Map<string, VerificationChallenge>;
  lastChallengeSentAt: Map<string, number>;
  checkoutAccountRequests: Map<string, {
    email: string;
    accountId: string;
    created: boolean;
    createdAt: string;
  }>;
  registrationAccountRequests: Map<string, {
    email: string;
    accountId: string;
    createdAt: string;
  }>;
}

declare global {
  // eslint-disable-next-line no-var
  var __tgGlobalAccountState: GlobalAccountState | undefined;
}

const state: GlobalAccountState = globalThis.__tgGlobalAccountState ?? {
  accounts: new Map(),
  emailIndex: new Map(),
  sessions: new Map(),
  challenges: new Map(),
  lastChallengeSentAt: new Map(),
  checkoutAccountRequests: new Map(),
  registrationAccountRequests: new Map(),
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__tgGlobalAccountState = state;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

function defaultManagementPreferences(): AccountManagementPreferences {
  return {
    notification_channels: ['email'],
    booking_reminder_channels: ['email'],
    marketing_opt_in: false,
    updated_at: nowIso(),
  };
}

function publicTraveler(traveler: SavedTravelerProfile): PublicSavedTravelerProfile {
  return {
    ...traveler,
    documents: traveler.documents.map(({document_number, ...document}) => ({
      ...document,
      document_number_masked: maskDocumentNumber(document_number),
    })),
  };
}

export function toPublicProfile(account: CustomerAccount): PublicAccountProfile {
  return {
    customer_id: formatCustomerId(account.account_id),
    primary_email: account.primary_email,
    password_state: account.password_state,
    email_verification_state: account.email_verification_state,
    created_at: account.created_at,
    source: account.source,
    profile: account.profile,
  };
}

export class CustomerAccountStore {
  static findByEmail(email: string): CustomerAccount | undefined {
    const normalized = normalizeEmail(email).toLowerCase();
    const id = state.emailIndex.get(normalized);
    if (!id) return undefined;
    return state.accounts.get(id);
  }

  static findById(accountId: string): CustomerAccount | undefined {
    return state.accounts.get(accountId);
  }

  static updateProfile(
    accountId: string,
    profileUpdate: Partial<CustomerProfileData>,
  ): CustomerAccount | undefined {
    const account = state.accounts.get(accountId);
    if (!account) return undefined;
    account.profile = {...account.profile, ...profileUpdate};
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return account;
  }

  static createOrReuseAccount(input: {
    email: string;
    password?: string;
    consent: AccountCreationConsent;
    source: 'standalone_registration' | 'guest_checkout';
  }): {account: CustomerAccount; isNew: boolean; alreadyHadPassword: boolean} {
    const normalized = normalizeEmail(input.email);
    const existing = this.findByEmail(normalized);

    if (existing) {
      if (input.password && existing.password_state === 'set') {
        return {account: existing, isNew: false, alreadyHadPassword: true};
      }
      return {account: existing, isNew: false, alreadyHadPassword: existing.password_state === 'set'};
    }

    const accountId = createId('acc');
    const createdAt = nowIso();
    const salt = input.password ? generateSalt() : undefined;
    const passwordHash = input.password && salt ? hashPassword(input.password, salt) : undefined;
    const account: CustomerAccount = {
      account_id: accountId,
      primary_email: normalized,
      password_state: input.password ? 'set' : 'not_set',
      email_verification_state: 'unverified',
      password_hash: passwordHash,
      password_salt: salt,
      consent: input.consent,
      created_at: createdAt,
      updated_at: createdAt,
      source: input.source,
      travelers: [],
      contacts: [],
      management_preferences: defaultManagementPreferences(),
    };

    state.accounts.set(accountId, account);
    state.emailIndex.set(normalized.toLowerCase(), accountId);
    return {account, isNew: true, alreadyHadPassword: false};
  }

  static createOrReuseCheckoutAccount(input: {
    email: string;
    consent: AccountCreationConsent;
    accountCreationRequestId?: string;
  }): {
    account?: CustomerAccount;
    isNew: boolean;
    alreadyHadPassword: boolean;
    idempotentReplay?: boolean;
    error?: 'IDEMPOTENCY_EMAIL_MISMATCH' | 'IDEMPOTENCY_ACCOUNT_NOT_FOUND' | 'IDEMPOTENCY_CONFLICT';
  } {
    const normalized = normalizeEmail(input.email);
    const requestId = input.accountCreationRequestId?.trim();

    if (requestId) {
      const previous = state.checkoutAccountRequests.get(requestId);
      if (previous) {
        if (previous.email !== normalized.toLowerCase()) {
          return {isNew: false, alreadyHadPassword: false, error: 'IDEMPOTENCY_EMAIL_MISMATCH'};
        }
        const account = state.accounts.get(previous.accountId);
        if (!account) {
          return {isNew: false, alreadyHadPassword: false, error: 'IDEMPOTENCY_ACCOUNT_NOT_FOUND'};
        }
        return {
          account,
          isNew: previous.created,
          alreadyHadPassword: account.password_state === 'set',
          idempotentReplay: true,
        };
      }
    }

    const result = this.createOrReuseAccount({
      email: normalized,
      consent: input.consent,
      source: 'guest_checkout',
    });

    if (requestId) {
      state.checkoutAccountRequests.set(requestId, {
        email: normalized.toLowerCase(),
        accountId: result.account.account_id,
        created: result.isNew,
        createdAt: nowIso(),
      });
    }

    return {...result, account: result.account};
  }

  static createOrReplayRegistrationAccount(input: {
    email: string;
    password: string;
    consent: AccountCreationConsent;
    accountCreationRequestId: string;
  }): {
    account?: CustomerAccount;
    isNew: boolean;
    alreadyHadPassword: boolean;
    idempotentReplay?: boolean;
    error?: 'IDEMPOTENCY_EMAIL_MISMATCH' | 'IDEMPOTENCY_ACCOUNT_NOT_FOUND' | 'IDEMPOTENCY_CONFLICT';
  } {
    const normalized = normalizeEmail(input.email);
    const requestId = input.accountCreationRequestId.trim();
    const previous = state.registrationAccountRequests.get(requestId);
    if (previous) {
      if (previous.email !== normalized.toLowerCase()) {
        return {
          isNew: false,
          alreadyHadPassword: false,
          error: 'IDEMPOTENCY_EMAIL_MISMATCH',
        };
      }
      const account = state.accounts.get(previous.accountId);
      if (!account) {
        return {
          isNew: false,
          alreadyHadPassword: false,
          error: 'IDEMPOTENCY_ACCOUNT_NOT_FOUND',
        };
      }
      // An idempotency key is not a credential. Even a replay must prove
      // knowledge of the account's current password before issuing a session.
      if (!this.verifyPassword(normalized, input.password).valid) {
        return {isNew: false, alreadyHadPassword: true, error: 'IDEMPOTENCY_CONFLICT'};
      }
      return {account, isNew: false, alreadyHadPassword: true, idempotentReplay: true};
    }

    const result = this.createOrReuseAccount({
      email: normalized,
      password: input.password,
      consent: input.consent,
      source: 'standalone_registration',
    });
    if (result.isNew) {
      state.registrationAccountRequests.set(requestId, {
        email: normalized.toLowerCase(),
        accountId: result.account.account_id,
        createdAt: nowIso(),
      });
    }
    return result;
  }

  static verifyPassword(email: string, passwordAttempt: string): {valid: boolean; account?: CustomerAccount} {
    const account = this.findByEmail(email);
    if (!account || account.password_state !== 'set' || !account.password_hash || !account.password_salt) {
      return {valid: false, account};
    }
    const attemptHash = hashPassword(passwordAttempt, account.password_salt);
    const valid = crypto.timingSafeEqual(
      Buffer.from(attemptHash, 'hex'),
      Buffer.from(account.password_hash, 'hex'),
    );
    return {valid, account};
  }

  static updatePassword(accountId: string, newPassword: string): boolean {
    const account = state.accounts.get(accountId);
    if (!account) return false;
    const salt = generateSalt();
    account.password_salt = salt;
    account.password_hash = hashPassword(newPassword, salt);
    account.password_state = 'set';
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    for (const [id, session] of state.sessions) {
      if (session.account_id === accountId) state.sessions.delete(id);
    }
    for (const [id, challenge] of state.challenges) {
      if (challenge.email === normalizeEmail(account.primary_email).toLowerCase()) state.challenges.delete(id);
    }
    return true;
  }

  static updatePasswordWithCurrent(
    accountId: string,
    currentPassword: string,
    newPassword: string,
  ): 'UPDATED' | 'ACCOUNT_NOT_FOUND' | 'INVALID_CURRENT_PASSWORD' | 'PASSWORD_NOT_SET' {
    const account = state.accounts.get(accountId);
    if (!account) return 'ACCOUNT_NOT_FOUND';
    if (account.password_state !== 'set') return 'PASSWORD_NOT_SET';
    const current = this.verifyPassword(account.primary_email, currentPassword);
    if (!current.valid) return 'INVALID_CURRENT_PASSWORD';
    this.updatePassword(accountId, newPassword);
    return 'UPDATED';
  }

  static markEmailVerified(accountId: string): CustomerAccount | undefined {
    const account = state.accounts.get(accountId);
    if (!account) return undefined;
    account.email_verification_state = 'verified';
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return account;
  }

  static createChallenge(
    email: string,
    purpose: ChallengePurpose,
  ): {success: boolean; rateLimited?: boolean; challenge?: VerificationChallenge; rawCode?: string} {
    const normalized = normalizeEmail(email).toLowerCase();
    const now = Date.now();
    const lastSent = state.lastChallengeSentAt.get(normalized) || 0;
    if (now - lastSent < CHALLENGE_RESEND_COOLDOWN_MS) {
      return {success: false, rateLimited: true};
    }

    for (const [id, challenge] of state.challenges) {
      if (challenge.email === normalized) state.challenges.delete(id);
    }

    const rawCode = crypto.randomInt(100000, 1000000).toString();
    const challenge: VerificationChallenge = {
      challenge_id: createId('ch'),
      email: normalized,
      purpose,
      code_hash: crypto.createHash('sha256').update(rawCode).digest('hex'),
      expires_at: now + CHALLENGE_EXPIRY_MS,
      attempts: 0,
      verified: false,
    };

    state.challenges.set(challenge.challenge_id, challenge);
    state.lastChallengeSentAt.set(normalized, now);
    return {success: true, challenge, rawCode};
  }

  static verifyChallengeCode(
    challengeId: string,
    email: string,
    code: string,
    expectedPurpose?: ChallengePurpose,
  ): {
    valid: boolean;
    purpose?: ChallengePurpose;
    reason?: 'EXPIRED' | 'TOO_MANY_ATTEMPTS' | 'MISMATCH' | 'NOT_FOUND' | 'USED';
  } {
    const challenge = state.challenges.get(challengeId);
    if (!challenge) return {valid: false, reason: 'NOT_FOUND'};
    if (challenge.verified) return {valid: false, reason: 'USED'};
    if (expectedPurpose && challenge.purpose !== expectedPurpose) return {valid: false, reason: 'MISMATCH'};

    const normalized = normalizeEmail(email).toLowerCase();
    if (challenge.email !== normalized) return {valid: false, reason: 'MISMATCH'};
    if (Date.now() > challenge.expires_at) {
      state.challenges.delete(challengeId);
      return {valid: false, reason: 'EXPIRED'};
    }
    if (challenge.attempts >= CHALLENGE_MAX_ATTEMPTS) {
      state.challenges.delete(challengeId);
      return {valid: false, reason: 'TOO_MANY_ATTEMPTS'};
    }

    challenge.attempts += 1;
    const inputHash = crypto.createHash('sha256').update(code.trim()).digest('hex');
    if (inputHash !== challenge.code_hash) return {valid: false, reason: 'MISMATCH'};

    challenge.verified = true;
    state.challenges.delete(challengeId);
    return {valid: true, purpose: challenge.purpose};
  }

  static listTravelers(accountId: string): PublicSavedTravelerProfile[] {
    return state.accounts.get(accountId)?.travelers.map(publicTraveler) ?? [];
  }

  static saveTraveler(
    accountId: string,
    input: SavedTravelerInput,
    travelerId?: string,
  ): {account?: CustomerAccount; traveler?: SavedTravelerProfile; error?: string} {
    const account = state.accounts.get(accountId);
    if (!account) return {error: 'ACCOUNT_NOT_FOUND'};
    const validationError = validateSavedTravelerInput(input, {allowMaskedDocument: Boolean(travelerId)});
    if (validationError) return {error: validationError};

    const existing = travelerId
      ? account.travelers.find((traveler) => traveler.traveler_id === travelerId)
      : undefined;
    if (travelerId && !existing) return {error: 'TRAVELER_NOT_FOUND'};
    const timestamp = nowIso();
    const documents: TravelerDocument[] = input.documents.map((document) => {
      const existingDocument = existing?.documents.find((item) => item.document_id === document.document_id);
      const suppliedNumber = document.document_number?.trim() ?? '';
      const canReuseMaskedNumber = Boolean(
        existingDocument
        && existingDocument.document_type === document.document_type
        && existingDocument.issuing_region === document.issuing_region?.trim(),
      );
      return {
        document_id: document.document_id ?? createId('doc'),
        document_type: document.document_type,
        document_number: suppliedNumber || (canReuseMaskedNumber ? existingDocument?.document_number ?? '' : ''),
        issuing_region: document.issuing_region.trim(),
        expiry_date: document.expiry_date?.trim() || undefined,
        permit_type: document.permit_type,
      };
    });

    if (documents.some((document) => !document.document_number || !document.issuing_region)) {
      return {error: 'DOCUMENT_FIELDS_REQUIRED'};
    }

    const traveler: SavedTravelerProfile = {
      traveler_id: travelerId ?? createId('trav'),
      given_names: input.given_names.trim(),
      surname: input.surname?.trim() || undefined,
      no_surname: Boolean(input.no_surname),
      birth_date: input.birth_date,
      nationality_region: input.nationality_region,
      gender: input.gender ?? 'unspecified',
      is_default: Boolean(input.is_default) || account.travelers.length === 0,
      consent_confirmed: true,
      created_at: existing?.created_at ?? timestamp,
      updated_at: timestamp,
      documents,
    };

    if (traveler.is_default) {
      account.travelers = account.travelers.map((item) => ({...item, is_default: false}));
    }
    if (existing) {
      account.travelers = account.travelers.map((item) => item.traveler_id === traveler.traveler_id ? traveler : item);
    } else {
      account.travelers.push(traveler);
    }
    account.updated_at = timestamp;
    state.accounts.set(accountId, account);
    return {account, traveler};
  }

  static deleteTraveler(accountId: string, travelerId: string): 'DELETED' | 'ACCOUNT_NOT_FOUND' | 'TRAVELER_NOT_FOUND' {
    const account = state.accounts.get(accountId);
    if (!account) return 'ACCOUNT_NOT_FOUND';
    const index = account.travelers.findIndex((traveler) => traveler.traveler_id === travelerId);
    if (index < 0) return 'TRAVELER_NOT_FOUND';
    const wasDefault = account.travelers[index].is_default;
    account.travelers.splice(index, 1);
    if (wasDefault && account.travelers[0]) account.travelers[0].is_default = true;
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return 'DELETED';
  }

  static setDefaultTraveler(
    accountId: string,
    travelerId: string,
  ): 'UPDATED' | 'ACCOUNT_NOT_FOUND' | 'TRAVELER_NOT_FOUND' {
    const account = state.accounts.get(accountId);
    if (!account) return 'ACCOUNT_NOT_FOUND';
    if (!account.travelers.some((traveler) => traveler.traveler_id === travelerId)) return 'TRAVELER_NOT_FOUND';
    account.travelers = account.travelers.map((traveler) => ({
      ...traveler,
      is_default: traveler.traveler_id === travelerId,
    }));
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return 'UPDATED';
  }

  static listContacts(accountId: string): SavedContactProfile[] {
    return state.accounts.get(accountId)?.contacts ?? [];
  }

  static saveContact(
    accountId: string,
    input: SavedContactInput,
    contactId?: string,
  ): {account?: CustomerAccount; contact?: SavedContactProfile; error?: string} {
    const account = state.accounts.get(accountId);
    if (!account) return {error: 'ACCOUNT_NOT_FOUND'};
    if (!input.contact_name.trim() || !input.contact_email.trim() || !input.phone_country_code || !input.phone_number.trim()) {
      return {error: 'CONTACT_FIELDS_REQUIRED'};
    }
    if (!validateEmail(input.contact_email)) return {error: 'CONTACT_EMAIL_INVALID'};
    if (!validatePhoneCountryCode(input.phone_country_code) || !validatePhoneNumber(input.phone_number)) {
      return {error: 'PHONE_INVALID'};
    }
    if (input.uses.length === 0) return {error: 'CONTACT_USE_REQUIRED'};
    if (new Set(input.uses).size !== input.uses.length
      || input.uses.some((use) => !['booking_confirmation', 'trip_updates', 'customer_service', 'receipt_invoice'].includes(use))) {
      return {error: 'CONTACT_USE_INVALID'};
    }
    if (input.uses.includes('receipt_invoice') && !input.receipt_invoice_email?.trim()) {
      return {error: 'RECEIPT_EMAIL_REQUIRED'};
    }
    if (input.receipt_invoice_email && !validateEmail(input.receipt_invoice_email)) {
      return {error: 'RECEIPT_EMAIL_INVALID'};
    }

    const existing = contactId ? account.contacts.find((contact) => contact.contact_id === contactId) : undefined;
    if (contactId && !existing) return {error: 'CONTACT_NOT_FOUND'};
    const timestamp = nowIso();
    const contact: SavedContactProfile = {
      contact_id: contactId ?? createId('contact'),
      contact_name: input.contact_name.trim(),
      contact_email: normalizeEmail(input.contact_email),
      phone_country_code: input.phone_country_code,
      phone_number: normalizePhoneNumber(input.phone_number),
      uses: input.uses,
      is_default_booking: Boolean(input.is_default_booking) || account.contacts.length === 0,
      receipt_invoice_email: input.receipt_invoice_email ? normalizeEmail(input.receipt_invoice_email) : undefined,
      invoice_recipient_name: input.invoice_recipient_name?.trim() || undefined,
      invoice_address: input.invoice_address?.trim() || undefined,
      invoice_tax_id: input.invoice_tax_id?.trim() || undefined,
      created_at: existing?.created_at ?? timestamp,
      updated_at: timestamp,
    };

    if (contact.is_default_booking) {
      account.contacts = account.contacts.map((item) => ({...item, is_default_booking: false}));
    }
    if (existing) {
      account.contacts = account.contacts.map((item) => item.contact_id === contact.contact_id ? contact : item);
    } else {
      account.contacts.push(contact);
    }
    account.updated_at = timestamp;
    state.accounts.set(accountId, account);
    return {account, contact};
  }

  static deleteContact(accountId: string, contactId: string): 'DELETED' | 'ACCOUNT_NOT_FOUND' | 'CONTACT_NOT_FOUND' {
    const account = state.accounts.get(accountId);
    if (!account) return 'ACCOUNT_NOT_FOUND';
    const index = account.contacts.findIndex((contact) => contact.contact_id === contactId);
    if (index < 0) return 'CONTACT_NOT_FOUND';
    const wasDefault = account.contacts[index].is_default_booking;
    account.contacts.splice(index, 1);
    if (wasDefault && account.contacts[0]) account.contacts[0].is_default_booking = true;
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return 'DELETED';
  }

  static setDefaultContact(
    accountId: string,
    contactId: string,
  ): 'UPDATED' | 'ACCOUNT_NOT_FOUND' | 'CONTACT_NOT_FOUND' {
    const account = state.accounts.get(accountId);
    if (!account) return 'ACCOUNT_NOT_FOUND';
    if (!account.contacts.some((contact) => contact.contact_id === contactId)) return 'CONTACT_NOT_FOUND';
    account.contacts = account.contacts.map((contact) => ({
      ...contact,
      is_default_booking: contact.contact_id === contactId,
    }));
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return 'UPDATED';
  }

  static getManagementPreferences(accountId: string): AccountManagementPreferences | undefined {
    return state.accounts.get(accountId)?.management_preferences;
  }

  static updateManagementPreferences(
    accountId: string,
    update: Pick<AccountManagementPreferences, 'notification_channels' | 'booking_reminder_channels'> & {
      marketing_opt_in?: boolean;
      marketing_consent_locale?: string;
    },
  ): AccountManagementPreferences | undefined {
    const account = state.accounts.get(accountId);
    if (!account) return undefined;
    const channelsAreValid = (channels: AccountManagementPreferences['notification_channels']) =>
      Array.isArray(channels)
      && new Set(channels).size === channels.length
      && channels.every((channel) => (ACCOUNT_NOTIFICATION_CHANNELS as readonly string[]).includes(channel));
    if (!channelsAreValid(update.notification_channels) || !channelsAreValid(update.booking_reminder_channels)) {
      return undefined;
    }
    const marketingOptIn = Boolean(update.marketing_opt_in);
    account.management_preferences = {
      ...account.management_preferences,
      notification_channels: update.notification_channels,
      booking_reminder_channels: update.booking_reminder_channels,
      marketing_opt_in: marketingOptIn,
      ...(marketingOptIn
        ? {
            marketing_consent_version: CURRENT_MARKETING_CONSENT_VERSION,
            marketing_consent_locale: update.marketing_consent_locale ?? account.consent.locale,
            marketing_consent_source: 'account_management',
            marketing_consented_at: nowIso(),
          }
        : {
            marketing_consent_version: undefined,
            marketing_consent_locale: undefined,
            marketing_consent_source: undefined,
            marketing_consented_at: undefined,
          }),
      updated_at: nowIso(),
    };
    account.updated_at = nowIso();
    state.accounts.set(accountId, account);
    return account.management_preferences;
  }

  static createSession(accountId: string, email: string): AccountAuthSession {
    const now = Date.now();
    const session: AccountAuthSession = {
      session_id: crypto.randomBytes(32).toString('hex'),
      account_id: accountId,
      email: normalizeEmail(email),
      created_at: now,
      expires_at: now + SESSION_TTL_MS,
    };
    state.sessions.set(session.session_id, session);
    return session;
  }

  static getSession(sessionId: string): AccountAuthSession | undefined {
    const session = state.sessions.get(sessionId);
    if (!session) return undefined;
    if (Date.now() > session.expires_at) {
      state.sessions.delete(sessionId);
      return undefined;
    }
    return session;
  }

  static destroySession(sessionId: string): boolean {
    return state.sessions.delete(sessionId);
  }

  static _resetForTesting(): void {
    state.accounts.clear();
    state.emailIndex.clear();
    state.sessions.clear();
    state.challenges.clear();
    state.lastChallengeSentAt.clear();
    state.checkoutAccountRequests.clear();
    state.registrationAccountRequests.clear();
  }
}
