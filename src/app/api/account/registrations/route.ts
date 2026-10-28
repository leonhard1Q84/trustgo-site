import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  validateAccountCreationRequestId,
  validateEmail,
  validatePassword,
} from '@/modules/customer-account/domain/account.rules';
import {isRouteLanguage} from '@/i18n/locales';
import {enqueueCustomerAccountNotification} from '@/server/customerAccountNotifications';

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      password_confirmation,
      terms_version,
      privacy_version,
      consent_locale,
      account_creation_request_id,
    } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        {success: false, code: 'INVALID_EMAIL', message: 'Invalid email address.'},
        {status: 400},
      );
    }

    if (!password) {
      return NextResponse.json(
        {success: false, code: 'PASSWORD_REQUIRED', message: 'Password is required.'},
        {status: 400},
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        {success: false, code: 'INVALID_PASSWORD', message: 'Password does not meet requirements.'},
        {status: 400},
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        {success: false, code: 'PASSWORD_MISMATCH', message: 'Password confirmation does not match.'},
        {status: 400},
      );
    }

    if (terms_version !== CURRENT_TERMS_VERSION || privacy_version !== CURRENT_PRIVACY_VERSION) {
      return NextResponse.json(
        {success: false, code: 'INVALID_LEGAL_VERSION', message: 'Invalid terms or privacy version.'},
        {status: 400},
      );
    }
    if (!validateAccountCreationRequestId(account_creation_request_id)) {
      return NextResponse.json(
        {success: false, code: 'INVALID_REQUEST_ID', message: 'A valid account creation request is required.'},
        {status: 400},
      );
    }

    if (!isRouteLanguage(consent_locale)) {
      return NextResponse.json({success: false, code: 'INVALID_LEGAL_VERSION'}, {status: 400});
    }
    const locale = consent_locale;

    const result = CustomerAccountStore.createOrReplayRegistrationAccount({
      email,
      password,
      consent: {
        terms_version,
        privacy_version,
        locale,
        agreed_at: new Date().toISOString(),
      },
      accountCreationRequestId: account_creation_request_id,
    });

    if (result.error || !result.account) {
      return NextResponse.json(
        {
          success: false,
          code: result.error,
          message: 'Account creation request could not be replayed safely.',
        },
        {status: 409},
      );
    }

    if (!result.isNew && !result.idempotentReplay) {
      return NextResponse.json(
        {
          success: false,
          code: result.account.password_state === 'not_set' ? 'PASSWORD_NOT_SET' : 'EMAIL_ALREADY_EXISTS',
          message: result.account.password_state === 'not_set'
            ? 'This account was created during checkout. Please sign in with an email code to set a password.'
            : 'An account with this email already exists. Please sign in.',
        },
        {status: 409},
      );
    }

    if (result.alreadyHadPassword && !result.idempotentReplay) {
      // Account exists and already has a password set.
      return NextResponse.json(
        {
          success: false,
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email already exists. Please sign in.',
        },
        {status: 409},
      );
    }

    if (result.isNew) {
      enqueueCustomerAccountNotification({
        notification_type: 'account_created',
        account: result.account,
        locale,
        idempotency_key: `account-created:${result.account.account_id}`,
      });
    }

    // Sign in automatically
    const session = CustomerAccountStore.createSession(result.account.account_id, result.account.primary_email);
    const response = NextResponse.json({
      success: true,
      account: toPublicProfile(result.account),
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
    console.error('Registration route error:', error);
    return NextResponse.json(
      {success: false, code: 'INTERNAL_ERROR', message: 'Failed to create account.'},
      {status: 500},
    );
  }
}

export const POST = accountRoute('registrations', handlePOST);
