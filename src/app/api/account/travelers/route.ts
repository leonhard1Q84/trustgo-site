import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {validateSavedTravelerInput} from '@/modules/customer-account/domain/account.rules';
import type {SavedTravelerInput} from '@/modules/customer-account/domain/account.types';

async function handleGET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    return NextResponse.json({
      success: true,
      travelers: CustomerAccountStore.listTravelers(account.account_id),
    });
  } catch (error) {
    console.error('List travelers error:', error);
    return NextResponse.json({success: false, error: 'Failed to load travelers'}, {status: 500});
  }
}

async function handlePOST(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = (await request.json()) as SavedTravelerInput;
    const validationError = validateSavedTravelerInput(body);
    if (validationError) return NextResponse.json({success: false, error: validationError}, {status: 400});

    const result = CustomerAccountStore.saveTraveler(account.account_id, body);
    if (result.error) return NextResponse.json({success: false, error: result.error}, {status: 400});

    return NextResponse.json({
      success: true,
      travelers: CustomerAccountStore.listTravelers(account.account_id),
    });
  } catch (error) {
    console.error('Save traveler error:', error);
    return NextResponse.json({success: false, error: 'Failed to save traveler'}, {status: 500});
  }
}

export const GET = accountRoute('travelers', handleGET);
export const POST = accountRoute('travelers', handlePOST);
