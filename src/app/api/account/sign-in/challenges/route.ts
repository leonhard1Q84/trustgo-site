import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {maskEmail, validateEmail} from '@/modules/customer-account/domain/account.rules';
import {enqueueCustomerAccountNotification} from '@/server/customerAccountNotifications';
import {isRouteLanguage} from '@/i18n/locales';

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const {email, purpose = 'first_time_password', locale} = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        {success: false, code: 'INVALID_EMAIL', message: 'Invalid email address.'},
        {status: 400},
      );
    }

    if (purpose !== 'first_time_password' && purpose !== 'forgot_password') {
      return NextResponse.json({success: false, code: 'INVALID_REQUEST'}, {status: 400});
    }
    const safePurpose = purpose;

    const result = CustomerAccountStore.createChallenge(email, safePurpose);

    if (!result.success && result.rateLimited) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMITED',
          message: 'Please wait before requesting another verification code.',
        },
        {status: 429},
      );
    }

    if (!result.challenge) {
      return NextResponse.json(
        {success: false, code: 'CHALLENGE_FAILED', message: 'Failed to create challenge.'},
        {status: 500},
      );
    }

    const masked = maskEmail(email);
    const account = CustomerAccountStore.findByEmail(email);
    const notificationType = safePurpose === 'forgot_password'
      ? 'password_reset_code'
      : safePurpose === 'first_time_password'
        ? 'password_setup_code'
        : null;
    const canDeliver = account && (safePurpose !== 'first_time_password' || account.password_state === 'not_set');
    if (canDeliver && notificationType && result.rawCode) {
      enqueueCustomerAccountNotification({
        notification_type: notificationType,
        account,
        locale: isRouteLanguage(locale) ? locale : 'en',
        idempotency_key: `${notificationType}:${result.challenge.challenge_id}`,
        code: result.rawCode,
        code_expires_in_minutes: 10,
      });
    }

    return NextResponse.json({
      success: true,
      challenge_id: result.challenge.challenge_id,
      masked_email: masked,
      // For developer / testing convenience, expose dev_code in non-production
      ...(process.env.NODE_ENV !== 'production' && canDeliver ? {dev_code: result.rawCode} : {}),
      message: 'Verification code sent.',
    });
  } catch (error) {
    console.error('Challenge route error:', error);
    return NextResponse.json(
      {success: false, code: 'INTERNAL_ERROR', message: 'Failed to send challenge.'},
      {status: 500},
    );
  }
}

export const POST = accountRoute('sign-in/challenges', handlePOST);
