import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {
  normalizePhoneNumber,
  validateEmail,
  validatePhoneCountryCode,
  validatePhoneNumber,
} from '@/modules/customer-account/domain/account.rules';
import type {SavedContactInput} from '@/modules/customer-account/domain/account.types';

const validUses = new Set(['booking_confirmation', 'trip_updates', 'customer_service', 'receipt_invoice']);

function validateContactInput(input: SavedContactInput): string | null {
  if (!input.contact_name?.trim()) return 'CONTACT_NAME_REQUIRED';
  if (!input.contact_email || !validateEmail(input.contact_email)) return 'CONTACT_EMAIL_INVALID';
  if (!input.phone_country_code || !validatePhoneCountryCode(input.phone_country_code)) return 'PHONE_COUNTRY_CODE_REQUIRED';
  if (!validatePhoneNumber(input.phone_number ?? '')) return 'PHONE_NUMBER_REQUIRED';
  if (!Array.isArray(input.uses) || input.uses.length === 0) return 'CONTACT_USE_REQUIRED';
  if (new Set(input.uses).size !== input.uses.length) return 'CONTACT_USE_INVALID';
  if (input.uses.some((use) => !validUses.has(use))) return 'CONTACT_USE_INVALID';
  if (input.uses.includes('receipt_invoice') && (!input.receipt_invoice_email || !validateEmail(input.receipt_invoice_email))) {
    return 'RECEIPT_EMAIL_INVALID';
  }
  if (input.receipt_invoice_email && !validateEmail(input.receipt_invoice_email)) return 'RECEIPT_EMAIL_INVALID';
  return null;
}

function normalizeInput(input: SavedContactInput): SavedContactInput {
  return {...input, phone_number: normalizePhoneNumber(input.phone_number)};
}

async function handleGET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    return NextResponse.json({
      success: true,
      contacts: CustomerAccountStore.listContacts(account.account_id),
    });
  } catch (error) {
    console.error('List contacts error:', error);
    return NextResponse.json({success: false, error: 'Failed to load contacts'}, {status: 500});
  }
}

async function handlePOST(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = (await request.json()) as SavedContactInput;
    const validationError = validateContactInput(body);
    if (validationError) return NextResponse.json({success: false, error: validationError}, {status: 400});

    const result = CustomerAccountStore.saveContact(account.account_id, normalizeInput(body));
    if (result.error) return NextResponse.json({success: false, error: result.error}, {status: 400});

    return NextResponse.json({
      success: true,
      contacts: CustomerAccountStore.listContacts(account.account_id),
    });
  } catch (error) {
    console.error('Save contact error:', error);
    return NextResponse.json({success: false, error: 'Failed to save contact'}, {status: 500});
  }
}

export const GET = accountRoute('contacts', handleGET);
export const POST = accountRoute('contacts', handlePOST);
