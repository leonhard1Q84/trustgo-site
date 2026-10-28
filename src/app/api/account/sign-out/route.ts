import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {SESSION_COOKIE_NAME} from '@/modules/customer-account/domain/account.rules';
import { rentalAccess, revokeRentalAccess } from '@/server/rental-access';

async function handlePOST() {
  try {
    const access = await rentalAccess();
    if (access) revokeRentalAccess(access);
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie && sessionCookie.value) {
      CustomerAccountStore.destroySession(sessionCookie.value);
    }

    const response = NextResponse.json({success: true});
    response.cookies.delete(SESSION_COOKIE_NAME);
    response.cookies.delete('tg_rental_access');
    return response;
  } catch (error) {
    console.error('Sign-out route error:', error);
    return NextResponse.json({success: false, message: 'Failed to sign out.'}, {status: 500});
  }
}

export const POST = accountRoute('sign-out', handlePOST);
