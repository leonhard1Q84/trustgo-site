import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {
  isDateOnOrBeforeToday,
  normalizePhoneNumber,
  validatePhoneCountryCode,
  validatePhoneNumber,
} from '@/modules/customer-account/domain/account.rules';
import type {CustomerProfileData} from '@/modules/customer-account/domain/account.types';

async function handleGET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) {
      return NextResponse.json({authenticated: false}, {status: 401});
    }

    return NextResponse.json({
      authenticated: true,
      account: toPublicProfile(account),
      profile: account.profile ?? {},
      email_verification_state: account.email_verification_state,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}

async function handlePATCH(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = (await request.json()) as Partial<CustomerProfileData>;
    const allowedFields: Array<keyof CustomerProfileData> = [
      'title',
      'first_name',
      'last_name',
      'middle_name',
      'no_surname',
      'birth_date',
      'nationality_region',
      'city',
      'phone_country_code',
      'phone_number',
    ];
    const profileFields = Object.fromEntries(
      allowedFields
        .filter((field) => body[field] !== undefined)
        .map((field) => [
          field,
          field === 'phone_number' && typeof body[field] === 'string'
            ? normalizePhoneNumber(body[field] as string)
            : body[field],
        ]),
    ) as Partial<CustomerProfileData>;

    if (profileFields.no_surname && profileFields.last_name?.trim()) {
      return NextResponse.json({success: false, error: 'SURNAME_INVALID'}, {status: 400});
    }
    if (!profileFields.no_surname && profileFields.first_name !== undefined && !profileFields.first_name.trim()) {
      return NextResponse.json({success: false, error: 'GIVEN_NAMES_REQUIRED'}, {status: 400});
    }
    if (profileFields.birth_date && !isDateOnOrBeforeToday(profileFields.birth_date)) {
      return NextResponse.json({success: false, error: 'BIRTH_DATE_INVALID'}, {status: 400});
    }
    if (profileFields.phone_country_code
      && !validatePhoneCountryCode(profileFields.phone_country_code)) {
      return NextResponse.json({success: false, error: 'PHONE_COUNTRY_CODE_INVALID'}, {status: 400});
    }
    if (profileFields.phone_number && !validatePhoneNumber(profileFields.phone_number)) {
      return NextResponse.json({success: false, error: 'PHONE_NUMBER_INVALID'}, {status: 400});
    }
    if (Object.entries(profileFields).some(([field, value]) =>
      typeof value === 'string'
      && ['first_name', 'last_name', 'middle_name', 'nationality_region', 'city'].includes(field)
      && value.length > 120,
    )) {
      return NextResponse.json({success: false, error: 'PROFILE_FIELD_TOO_LONG'}, {status: 400});
    }

    const updated = CustomerAccountStore.updateProfile(account.account_id, profileFields);

    if (!updated) {
      return NextResponse.json({error: 'Account not found'}, {status: 404});
    }

    return NextResponse.json({
      success: true,
      account: toPublicProfile(updated),
      profile: updated.profile ?? {},
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({error: 'Failed to update profile'}, {status: 500});
  }
}

export const GET = accountRoute('profile', handleGET);
export const PATCH = accountRoute('profile', handlePATCH);
