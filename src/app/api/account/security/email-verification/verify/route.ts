import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {validatePassword} from '@/modules/customer-account/domain/account.rules';
import {SESSION_TTL_MS} from '@/modules/customer-account/domain/account.rules';
import {setSessionCookie} from '@/server/customerAccountAuth';

async function handlePOST(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = await request.json();
    const {challenge_id, verification_code, new_password, new_password_confirmation} = body;
    if (!challenge_id || !verification_code) {
      return NextResponse.json({success: false, code: 'MISSING_VERIFICATION'}, {status: 400});
    }
    if (account.password_state === 'not_set' && !new_password) {
      return NextResponse.json({success: false, code: 'PASSWORD_REQUIRED'}, {status: 400});
    }
    if (account.password_state === 'set' && new_password) {
      return NextResponse.json({success: false, code: 'INVALID_REQUEST'}, {status: 400});
    }
    if (new_password) {
      const passwordCheck = validatePassword(new_password);
      if (!passwordCheck.valid) {
        return NextResponse.json({success: false, code: passwordCheck.messageKey ?? 'INVALID_PASSWORD'}, {status: 400});
      }
      if (new_password !== new_password_confirmation) {
        return NextResponse.json({success: false, code: 'PASSWORD_MISMATCH'}, {status: 400});
      }
    }

    const result = CustomerAccountStore.verifyChallengeCode(
      challenge_id,
      account.primary_email,
      verification_code,
      'email_verification',
    );
    if (!result.valid) {
      return NextResponse.json({success: false, code: result.reason ?? 'INVALID_CODE'}, {status: 400});
    }

    if (new_password) CustomerAccountStore.updatePassword(account.account_id, new_password);
    const updated = CustomerAccountStore.markEmailVerified(account.account_id);
    const response = NextResponse.json({
      success: true,
      account: updated ? toPublicProfile(updated) : undefined,
    });
    if (new_password) {
      const session = CustomerAccountStore.createSession(account.account_id, account.primary_email);
      setSessionCookie(response, session.session_id, SESSION_TTL_MS / 1000);
    }
    return response;
  } catch (error) {
    console.error('Verify account email error:', error);
    return NextResponse.json({success: false, code: 'INTERNAL_ERROR'}, {status: 500});
  }
}

export const POST = accountRoute('security/email-verification/verify', handlePOST);
