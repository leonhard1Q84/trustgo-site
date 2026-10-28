import {accountFetch, createAccountRequestId} from './account-request';
import type {
  AccountManagementPreferences,
  ChallengePurpose,
  ChallengeResponse,
  CheckoutAccountCreationPayload,
  CustomerProfileData,
  PublicAccountProfile,
  PublicSavedTravelerProfile,
  RegistrationRequest,
  RegistrationResponse,
  SavedContactInput,
  SavedContactProfile,
  SavedTravelerInput,
  SessionResponse,
  SignInResponse,
  VerifyAndSetPasswordRequest,
} from '../domain/account.types';
import type {RouteLanguage} from '@/i18n/locales';
import type {BookingRecord} from '@/modules/booking-management/public-api';


export class CustomerAccountService {
  /**
   * Register a new account with password
   */
  static async register(payload: RegistrationRequest): Promise<RegistrationResponse> {
    try {
      const requestId = payload.account_creation_request_id
        ?? createAccountRequestId();
      const response = await accountFetch('/api/account/registrations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...payload, account_creation_request_id: requestId}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CustomerAccountService.register error:', error);
      return {success: false, code: 'NETWORK_ERROR', message: 'Network error'};
    }
  }

  /**
   * Sign in using password
   */
  static async signInWithPassword(email: string, password: string): Promise<SignInResponse> {
    try {
      const response = await accountFetch('/api/account/sign-in/password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CustomerAccountService.signInWithPassword error:', error);
      return {success: false, code: 'NETWORK_ERROR' as const, message: 'Network error'};
    }
  }

  /**
   * Request verification challenge code (for first time password setup or forgot password)
   */
  static async requestChallenge(
    email: string,
    purpose: ChallengePurpose = 'first_time_password',
    locale: RouteLanguage = 'en',
  ): Promise<ChallengeResponse> {
    try {
      const response = await accountFetch('/api/account/password/challenges', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, purpose, locale}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CustomerAccountService.requestChallenge error:', error);
      return {
        success: false,
        challenge_id: '',
        masked_email: email,
        message: 'Network error',
      };
    }
  }

  /**
   * Verify challenge code and set new password
   */
  static async verifyAndSetPassword(payload: VerifyAndSetPasswordRequest): Promise<SignInResponse> {
    try {
      const response = await accountFetch('/api/account/password/set', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CustomerAccountService.verifyAndSetPassword error:', error);
      return {success: false, code: 'NETWORK_ERROR' as const, message: 'Network error'};
    }
  }

  /**
   * Get current auth session
   */
  static async getSession(): Promise<SessionResponse> {
    try {
      const response = await accountFetch('/api/account/session', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) return {authenticated: false};
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CustomerAccountService.getSession error:', error);
      return {authenticated: false};
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<{success: boolean}> {
    try {
      const response = await accountFetch('/api/account/sign-out', {
        method: 'POST',
      });
      const data = await response.json();
      return {success: response.ok && data.success === true};
    } catch (error) {
      console.error('CustomerAccountService.signOut error:', error);
      return {success: false};
    }
  }

  /**
   * Create account at checkout (strictly non-blocking with 3-second timeout)
   */
  static async createCheckoutAccount(
    payload: CheckoutAccountCreationPayload,
  ): Promise<{success: boolean; created?: boolean}> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await accountFetch('/api/account/checkout-creation', {
        method: 'POST', body: JSON.stringify(payload), signal: controller.signal,
      });
      const data = await response.json();
      return {...data, success: response.ok && data.success === true};
    } catch {
      return {success: false};
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Update customer profile or change password
   */
  static async updateProfile(
    profile: Partial<CustomerProfileData>,
  ): Promise<{success: boolean; account?: PublicAccountProfile; profile?: CustomerProfileData; error?: string}> {
    try {
      const response = await accountFetch('/api/account/profile', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) return {success: false, error: data.error || 'Failed to update'};
      return data;
    } catch (error) {
      console.error('CustomerAccountService.updateProfile error:', error);
      return {success: false, error: 'Network error'};
    }
  }

  static async getAccountCenterData(): Promise<{
    success: boolean;
    account?: PublicAccountProfile;
    profile?: CustomerProfileData;
    travelers: PublicSavedTravelerProfile[];
    contacts: SavedContactProfile[];
    preferences?: AccountManagementPreferences;
    error?: string;
  }> {
    try {
      const [profileResponse, travelersResponse, contactsResponse, preferencesResponse] = await Promise.all([
        accountFetch('/api/account/profile', {cache: 'no-store'}),
        accountFetch('/api/account/travelers', {cache: 'no-store'}),
        accountFetch('/api/account/contacts', {cache: 'no-store'}),
        accountFetch('/api/account/management/preferences', {cache: 'no-store'}),
      ]);
      if ([profileResponse, travelersResponse, contactsResponse, preferencesResponse].some((response) => response.status === 401)) {
        return {success: false, travelers: [], contacts: [], error: 'AUTHENTICATED_REQUIRED'};
      }
      const profile = await profileResponse.json();
      const travelers = await travelersResponse.json();
      const contacts = await contactsResponse.json();
      const preferences = await preferencesResponse.json();
      return {
        success: profileResponse.ok && travelersResponse.ok && contactsResponse.ok && preferencesResponse.ok,
        account: profile.account,
        profile: profile.profile,
        travelers: travelers.travelers ?? [],
        contacts: contacts.contacts ?? [],
        preferences: preferences.preferences,
        error: !profileResponse.ok ? profile.error : undefined,
      };
    } catch (error) {
      console.error('CustomerAccountService.getAccountCenterData error:', error);
      return {success: false, travelers: [], contacts: [], error: 'Network error'};
    }
  }

  static async saveTraveler(
    input: SavedTravelerInput,
    travelerId?: string,
  ): Promise<{success: boolean; travelers?: PublicSavedTravelerProfile[]; error?: string}> {
    try {
      const response = await accountFetch(
        travelerId ? `/api/account/travelers/${encodeURIComponent(travelerId)}` : '/api/account/travelers',
        {
          method: travelerId ? 'PATCH' : 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(input),
        },
      );
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to save traveler'};
    } catch (error) {
      console.error('CustomerAccountService.saveTraveler error:', error);
      return {success: false, error: 'Network error'};
    }
  }

  static async setDefaultTraveler(travelerId: string): Promise<{success: boolean; travelers?: PublicSavedTravelerProfile[]; error?: string}> {
    try {
      const response = await accountFetch(`/api/account/travelers/${encodeURIComponent(travelerId)}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({set_default: true}),
      });
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to set default traveler'};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async deleteTraveler(travelerId: string): Promise<{success: boolean; travelers?: PublicSavedTravelerProfile[]; error?: string}> {
    try {
      const response = await accountFetch(`/api/account/travelers/${encodeURIComponent(travelerId)}`, {method: 'DELETE'});
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to delete traveler'};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async saveContact(
    input: SavedContactInput,
    contactId?: string,
  ): Promise<{success: boolean; contacts?: SavedContactProfile[]; error?: string}> {
    try {
      const response = await accountFetch(
        contactId ? `/api/account/contacts/${encodeURIComponent(contactId)}` : '/api/account/contacts',
        {
          method: contactId ? 'PATCH' : 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(input),
        },
      );
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to save contact'};
    } catch (error) {
      console.error('CustomerAccountService.saveContact error:', error);
      return {success: false, error: 'Network error'};
    }
  }

  static async setDefaultContact(contactId: string): Promise<{success: boolean; contacts?: SavedContactProfile[]; error?: string}> {
    try {
      const response = await accountFetch(`/api/account/contacts/${encodeURIComponent(contactId)}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({set_default: true}),
      });
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to set default contact'};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async deleteContact(contactId: string): Promise<{success: boolean; contacts?: SavedContactProfile[]; error?: string}> {
    try {
      const response = await accountFetch(`/api/account/contacts/${encodeURIComponent(contactId)}`, {method: 'DELETE'});
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to delete contact'};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async updateManagementPreferences(input: {
    notification_channels: AccountManagementPreferences['notification_channels'];
    booking_reminder_channels: AccountManagementPreferences['booking_reminder_channels'];
    marketing_opt_in: boolean;
    marketing_consent_locale: RouteLanguage;
  }): Promise<{success: boolean; preferences?: AccountManagementPreferences; error?: string}> {
    try {
      const response = await accountFetch('/api/account/management/preferences', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return response.ok ? data : {success: false, error: data.error ?? 'Failed to save settings'};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async updatePassword(input: {
    current_password?: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{success: boolean; account?: PublicAccountProfile; code?: string; error?: string}> {
    try {
      const response = await accountFetch('/api/account/security/password', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return response.ok ? data : {success: false, code: data.code, error: data.error};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async requestEmailVerification(): Promise<ChallengeResponse> {
    try {
      const response = await accountFetch('/api/account/security/email-verification/challenges', {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch {
      return {success: false, challenge_id: '', masked_email: '', message: 'Network error'};
    }
  }

  static async verifyEmail(input: {
    challenge_id: string;
    verification_code: string;
    new_password?: string;
    new_password_confirmation?: string;
  }): Promise<{success: boolean; account?: PublicAccountProfile; code?: string; error?: string}> {
    try {
      const response = await accountFetch('/api/account/security/email-verification/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return response.ok ? data : {success: false, code: data.code, error: data.error};
    } catch {
      return {success: false, error: 'Network error'};
    }
  }

  static async getCustomerBookings(_email?: string): Promise<{
    success: boolean; orders: BookingRecord[]; error?: string;
  }> {
    try {
      const { listGuestBookings } = await import('@/modules/booking-management/application/booking-store');
      const { orders } = await listGuestBookings();
      return { success: true, orders };
    } catch { return { success: false, orders: [], error: 'service_unavailable' }; }
  }

  static async linkBooking(bookingRef: string, driverLastName: string, _customerEmail?: string)
    : Promise<{ success: boolean; order?: BookingRecord; error?: string }> {
    try {
      const { linkAccountBooking } = await import('@/modules/booking-management/application/booking-store');
      return { success: true, order: await linkAccountBooking(bookingRef, driverLastName) };
    } catch { return { success: false, error: 'booking_not_found' }; }
  }
}
