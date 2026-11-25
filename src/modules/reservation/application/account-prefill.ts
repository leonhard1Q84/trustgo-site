import type {
  CustomerProfileData,
  PublicAccountProfile,
  PublicSavedTravelerProfile,
  SavedContactProfile,
} from '@/modules/customer-account/public-api';
import type {DriverDetails} from '../domain/types';
import {normalizeLicenseCountry} from '../domain/validation';

export interface AccountPrefillData {
  account?: PublicAccountProfile;
  profile?: CustomerProfileData;
  travelers: PublicSavedTravelerProfile[];
  contacts: SavedContactProfile[];
}

export interface DriverPrefillOption {
  id: string;
  source: 'account_profile' | 'saved_traveler';
  primaryLabel: string;
  isDefault: boolean;
  profile?: CustomerProfileData;
  traveler?: PublicSavedTravelerProfile;
}

export interface ContactPrefillOption {
  id: string;
  source: 'account_profile' | 'saved_contact';
  primaryLabel: string;
  isDefault: boolean;
  email: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
}

function displayName(firstName: string | undefined, lastName: string | undefined): string {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(' ');
}

function travelerDisplayName(traveler: PublicSavedTravelerProfile): string {
  return displayName(traveler.given_names, traveler.no_surname ? '' : traveler.surname);
}

function byDefaultFirst<T extends {is_default: boolean}>(a: T, b: T) {
  return Number(b.is_default) - Number(a.is_default);
}

function byDefaultContactFirst(a: SavedContactProfile, b: SavedContactProfile) {
  return Number(b.is_default_booking) - Number(a.is_default_booking);
}

export function buildDriverPrefillOptions(data: AccountPrefillData): DriverPrefillOption[] {
  const options: DriverPrefillOption[] = [];
  const profileName = displayName(data.profile?.first_name, data.profile?.no_surname ? '' : data.profile?.last_name);

  if (profileName) {
    options.push({
      id: 'account-profile',
      source: 'account_profile',
      primaryLabel: profileName,
      isDefault: false,
      profile: data.profile,
    });
  }

  for (const traveler of [...data.travelers].sort(byDefaultFirst)) {
    options.push({
      id: traveler.traveler_id,
      source: 'saved_traveler',
      primaryLabel: travelerDisplayName(traveler),
      isDefault: traveler.is_default,
      traveler,
    });
  }

  return options.filter((option) => option.primaryLabel.trim());
}

export function buildContactPrefillOptions(data: AccountPrefillData): ContactPrefillOption[] {
  const options: ContactPrefillOption[] = [];
  const accountEmail = data.account?.primary_email?.trim();

  if (accountEmail) {
    const profileName = displayName(data.profile?.first_name, data.profile?.no_surname ? '' : data.profile?.last_name);
    options.push({
      id: 'account-profile',
      source: 'account_profile',
      primaryLabel: profileName || accountEmail,
      isDefault: false,
      email: accountEmail,
      phoneCountryCode: data.profile?.phone_country_code,
      phoneNumber: data.profile?.phone_number,
    });
  }

  for (const contact of [...data.contacts].sort(byDefaultContactFirst)) {
    options.push({
      id: contact.contact_id,
      source: 'saved_contact',
      primaryLabel: contact.contact_name,
      isDefault: contact.is_default_booking,
      email: contact.contact_email,
      phoneCountryCode: contact.phone_country_code,
      phoneNumber: contact.phone_number,
    });
  }

  return options.filter((option) => option.primaryLabel.trim() && option.email.trim());
}

function licenseCountryOrFallback(value: string | undefined, fallback: string): string {
  const candidate = value?.trim();
  if (!candidate) return fallback;
  try {
    return normalizeLicenseCountry(candidate);
  } catch {
    return fallback;
  }
}

function travelerLicenseCountry(traveler: PublicSavedTravelerProfile): string | undefined {
  return traveler.documents.find((item) => item.document_type === 'driver_license')?.issuing_region;
}

export function applyDriverPrefill(driver: DriverDetails, option: DriverPrefillOption): DriverDetails {
  if (option.source === 'account_profile') {
    const profile = option.profile ?? {};
    return {
      ...driver,
      title: profile.title === 'ms' ? 'Ms' : profile.title === 'mr' ? 'Mr' : driver.title,
      firstName: profile.first_name?.trim() ?? '',
      lastName: profile.no_surname ? '' : profile.last_name?.trim() ?? '',
      licenseCountry: licenseCountryOrFallback(profile.license_region, driver.licenseCountry),
    };
  }

  const traveler = option.traveler;
  if (!traveler) return driver;
  return {
    ...driver,
    title: traveler.gender === 'male' ? 'Mr' : traveler.gender === 'female' ? 'Ms' : driver.title,
    firstName: traveler.given_names.trim(),
    lastName: traveler.no_surname ? '' : traveler.surname?.trim() ?? '',
    licenseCountry: licenseCountryOrFallback(travelerLicenseCountry(traveler), driver.licenseCountry),
  };
}

export function applyContactPrefill(driver: DriverDetails, option: ContactPrefillOption): DriverDetails {
  const phoneCountryCode = option.phoneCountryCode?.trim();
  const phoneNumber = option.phoneNumber?.trim();
  const hasCompletePhone = Boolean(phoneCountryCode && phoneNumber);
  return {
    ...driver,
    email: option.email.trim(),
    phoneCountryCode: hasCompletePhone ? phoneCountryCode! : driver.phoneCountryCode,
    phone: hasCompletePhone ? phoneNumber! : driver.phone,
  };
}

export function clearDriverPrefill(driver: DriverDetails): DriverDetails {
  return {
    ...driver,
    firstName: '',
    lastName: '',
  };
}

export function clearContactPrefill(driver: DriverDetails): DriverDetails {
  return {
    ...driver,
    email: '',
    phone: '',
  };
}
