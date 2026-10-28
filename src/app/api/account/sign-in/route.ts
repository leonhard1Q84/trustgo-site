import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  validateEmail,
} from '@/modules/customer-account/domain/account.rules';

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const {email, password} = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        {success: false, code: 'INVALID_EMAIL', message: 'Invalid email address.'},
        {status: 400},
      );
    }

    const account = CustomerAccountStore.findByEmail(email);
    if (!account) {
      return NextResponse.json(
        {success: false, code: 'ACCOUNT_NOT_FOUND', message: 'Account not found.'},
        {status: 404},
      );
    }

    if (account.password_state === 'not_set') {
      return NextResponse.json(
        {
          success: false,
          code: 'PASSWORD_NOT_SET',
          message: 'This account does not have a password set. Please verify via email to set your password.',
        },
        {status: 200},
      );
    }

    if (!password) {
      return NextResponse.json({success: false, code: 'PASSWORD_REQUIRED'}, {status: 400});
    }

    const verifyResult = CustomerAccountStore.verifyPassword(email, password);
    if (!verifyResult.valid) {
      return NextResponse.json(
        {success: false, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.'},
        {status: 401},
      );
    }

    // Success: Create session and set cookie
    const session = CustomerAccountStore.createSession(account.account_id, account.primary_email);
    const response = NextResponse.json({
      success: true,
      account: toPublicProfile(account),
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.session_id,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });

    return response;
  } catch (error) {
    console.error('Sign-in route error:', error);
    return NextResponse.json(
      {success: false, code: 'INTERNAL_ERROR', message: 'Sign-in failed.'},
      {status: 500},
    );
  }
}

export const POST = accountRoute('sign-in', handlePOST);
