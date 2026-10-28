import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {SESSION_COOKIE_NAME} from '@/modules/customer-account/domain/account.rules';

async function handleGET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({authenticated: false});
    }

    const session = CustomerAccountStore.getSession(sessionCookie.value);
    if (!session) {
      // Expired or invalid session
      const response = NextResponse.json({authenticated: false});
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    const account = CustomerAccountStore.findById(session.account_id);
    if (!account) {
      const response = NextResponse.json({authenticated: false});
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      account: toPublicProfile(account),
    });
  } catch (error) {
    console.error('Get session route error:', error);
    return NextResponse.json({authenticated: false}, {status: 500});
  }
}

export const GET = accountRoute('session', handleGET);
