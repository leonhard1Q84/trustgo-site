import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {maskEmail} from '@/modules/customer-account/domain/account.rules';
import {enqueueCustomerAccountNotification} from '@/server/customerAccountNotifications';

async function handlePOST() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const result = CustomerAccountStore.createChallenge(account.primary_email, 'email_verification');
    if (!result.success && result.rateLimited) {
      return NextResponse.json({success: false, code: 'RATE_LIMITED'}, {status: 429});
    }
    if (!result.challenge) return NextResponse.json({success: false, code: 'CHALLENGE_FAILED'}, {status: 500});

    enqueueCustomerAccountNotification({
      notification_type: 'email_verification_code',
      account,
      locale: account.consent.locale,
      idempotency_key: `email-verification:${result.challenge.challenge_id}`,
      code: result.rawCode,
      code_expires_in_minutes: 10,
    });

    return NextResponse.json({
      success: true,
      challenge_id: result.challenge.challenge_id,
      masked_email: maskEmail(account.primary_email),
      ...(process.env.NODE_ENV !== 'production' ? {dev_code: result.rawCode} : {}),
    });
  } catch (error) {
    console.error('Create email verification challenge error:', error);
    return NextResponse.json({success: false, code: 'INTERNAL_ERROR'}, {status: 500});
  }
}

export const POST = accountRoute('security/email-verification/challenges', handlePOST);
