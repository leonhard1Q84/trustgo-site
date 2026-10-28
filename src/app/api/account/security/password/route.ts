import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore, toPublicProfile} from '@/server/customerAccountStore';
import {validatePassword} from '@/modules/customer-account/domain/account.rules';
import {SESSION_TTL_MS} from '@/modules/customer-account/domain/account.rules';
import {setSessionCookie} from '@/server/customerAccountAuth';

async function handlePATCH(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = await request.json();
    const {current_password, new_password, new_password_confirmation} = body;
    if (!new_password) return NextResponse.json({success: false, code: 'PASSWORD_REQUIRED'}, {status: 400});
    const passwordCheck = validatePassword(new_password);
    if (!passwordCheck.valid) {
      return NextResponse.json({success: false, code: passwordCheck.messageKey ?? 'INVALID_PASSWORD'}, {status: 400});
    }
    if (new_password !== new_password_confirmation) {
      return NextResponse.json({success: false, code: 'PASSWORD_MISMATCH'}, {status: 400});
    }
    if (account.password_state === 'not_set') {
      return NextResponse.json({success: false, code: 'EMAIL_VERIFICATION_REQUIRED'}, {status: 409});
    }
    if (!current_password) return NextResponse.json({success: false, code: 'CURRENT_PASSWORD_REQUIRED'}, {status: 400});

    const status = CustomerAccountStore.updatePasswordWithCurrent(
      account.account_id,
      current_password,
      new_password,
    );
    if (status === 'INVALID_CURRENT_PASSWORD') {
      return NextResponse.json({success: false, code: status}, {status: 403});
    }
    if (status !== 'UPDATED') {
      return NextResponse.json({success: false, code: status}, {status: 400});
    }

    const updated = CustomerAccountStore.findById(account.account_id);
    const response = NextResponse.json({success: true, account: updated ? toPublicProfile(updated) : undefined});
    const session = CustomerAccountStore.createSession(account.account_id, account.primary_email);
    setSessionCookie(response, session.session_id, SESSION_TTL_MS / 1000);
    return response;
  } catch (error) {
    console.error('Update account password error:', error);
    return NextResponse.json({success: false, code: 'INTERNAL_ERROR'}, {status: 500});
  }
}

export const PATCH = accountRoute('security/password', handlePATCH);
