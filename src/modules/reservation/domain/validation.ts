import type { DriverDetails } from './types';
import type { SpecialEquipmentSelection } from '@/modules/rate-details/domain/equipment';
import {
  EQUIPMENT_CATALOG,
  getDefaultEquipmentSelection,
} from '@/modules/rate-details/domain/equipment';
import { COUNTRIES_LIST } from '@/modules/rental-search/domain/countries';

export class RentalError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = 409,
    public readonly field?: keyof DriverDetails
  ) {
    super(code);
    this.name = 'RentalError';
  }
}

export function normalizeLicenseCountry(value: string): string {
  if (typeof value !== 'string') throw new RentalError('invalid_driver', 400);
  const country = COUNTRIES_LIST.find((c) => c.code === value.toUpperCase() || c.name === value);
  if (!country) throw new RentalError('invalid_driver', 400);
  return country.code;
}

export function validateDriver(input: DriverDetails): DriverDetails {
  if (!input || !['Mr', 'Ms', 'Dr'].includes(input.title))
    throw new RentalError('invalid_driver', 400);
  const clean = (value: unknown, max: number, field: keyof DriverDetails) => {
    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.trim().length > max ||
      /[\u0000-\u001f]/.test(value)
    ) {
      throw new RentalError('invalid_driver', 400, field);
    }
    return value.trim();
  };
  const email = clean(input.email, 254, 'email').toLowerCase();
  const phone = clean(input.phone, 32, 'phone');
  const phoneCountryCode = clean(input.phoneCountryCode, 5, 'phoneCountryCode');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new RentalError('invalid_driver', 400, 'email');
  if (!/^\+\d{1,4}$/.test(phoneCountryCode))
    throw new RentalError('invalid_driver', 400, 'phoneCountryCode');
  if (!/^[\d ()-]{5,32}$/.test(phone) || phone.replace(/\D/g, '').length < 5) {
    throw new RentalError('invalid_driver', 400, 'phone');
  }
  if (input.flightNumber !== undefined && typeof input.flightNumber !== 'string') {
    throw new RentalError('invalid_driver', 400);
  }
  if (
    input.additionalDriver !== undefined &&
    (!input.additionalDriver ||
      typeof input.additionalDriver !== 'object' ||
      Array.isArray(input.additionalDriver) ||
      typeof input.additionalDriver.enabled !== 'boolean')
  ) {
    throw new RentalError('invalid_driver', 400);
  }
  const flightNumber = input.flightNumber?.trim();
  if (flightNumber && !/^[A-Za-z0-9 -]{2,16}$/.test(flightNumber))
    throw new RentalError('invalid_driver', 400, 'flightNumber');
  return {
    title: input.title,
    firstName: clean(input.firstName, 80, 'firstName'),
    lastName: clean(input.lastName, 80, 'lastName'),
    email,
    phone,
    phoneCountryCode,
    licenseCountry: normalizeLicenseCountry(input.licenseCountry),
    flightNumber,
    additionalDriver: {
      enabled: Boolean(input.additionalDriver?.enabled),
      fullName: input.additionalDriver?.enabled
        ? clean(input.additionalDriver.fullName, 160, 'additionalDriver')
        : '',
    },
  };
}

export function validateEquipment(input: unknown): SpecialEquipmentSelection {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new RentalError('invalid_equipment', 400);
  const result = getDefaultEquipmentSelection();
  for (const item of EQUIPMENT_CATALOG) {
    const value = (input as Record<string, unknown>)[item.id];
    if (typeof result[item.id] === 'boolean') {
      if (typeof value !== 'boolean') throw new RentalError('invalid_equipment', 400);
    } else if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < 0 ||
      value > item.maxQuantity
    ) {
      throw new RentalError('invalid_equipment', 400);
    }
    Object.assign(result, { [item.id]: value });
  }
  return result;
}
