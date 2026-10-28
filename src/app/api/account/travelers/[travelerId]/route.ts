import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {validateSavedTravelerInput} from '@/modules/customer-account/domain/account.rules';
import type {SavedTravelerInput} from '@/modules/customer-account/domain/account.types';

type RouteProps = {params: Promise<{travelerId: string}>};

async function handlePATCH(request: Request, {params}: RouteProps) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const {travelerId} = await params;
    const body = (await request.json()) as SavedTravelerInput & {set_default?: boolean};
    if (body.set_default) {
      const status = CustomerAccountStore.setDefaultTraveler(account.account_id, travelerId);
      if (status !== 'UPDATED') return NextResponse.json({success: false, error: status}, {status: 404});
    } else {
      const validationError = validateSavedTravelerInput(body, {allowMaskedDocument: true});
      if (validationError) return NextResponse.json({success: false, error: validationError}, {status: 400});
      const result = CustomerAccountStore.saveTraveler(account.account_id, body, travelerId);
      if (result.error) return NextResponse.json({success: false, error: result.error}, {status: 400});
    }

    return NextResponse.json({
      success: true,
      travelers: CustomerAccountStore.listTravelers(account.account_id),
    });
  } catch (error) {
    console.error('Update traveler error:', error);
    return NextResponse.json({success: false, error: 'Failed to update traveler'}, {status: 500});
  }
}

async function handleDELETE(_request: Request, {params}: RouteProps) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const {travelerId} = await params;
    const status = CustomerAccountStore.deleteTraveler(account.account_id, travelerId);
    if (status !== 'DELETED') return NextResponse.json({success: false, error: status}, {status: 404});

    return NextResponse.json({
      success: true,
      travelers: CustomerAccountStore.listTravelers(account.account_id),
    });
  } catch (error) {
    console.error('Delete traveler error:', error);
    return NextResponse.json({success: false, error: 'Failed to delete traveler'}, {status: 500});
  }
}

export const PATCH = accountRoute('travelers/[travelerId]', handlePATCH);
export const DELETE = accountRoute('travelers/[travelerId]', handleDELETE);
