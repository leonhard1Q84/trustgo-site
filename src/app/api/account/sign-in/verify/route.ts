import { NextResponse } from 'next/server';
import { accountRoute } from '@/server/account-route';
import { CustomerAccountStore, toPublicProfile } from '@/server/customerAccountStore';
import { setSessionCookie } from '@/server/customerAccountAuth';
import { SESSION_TTL_MS, validateEmail, validatePassword, validateVerificationCode } from '@/modules/customer-account/domain/account.rules';

async function handlePOST(request: Request) {
  const { email, challenge_id, verification_code, new_password, new_password_confirmation, purpose } = await request.json();
  const fail = (code: string, status = 400) => NextResponse.json({ success: false, code }, { status });
  if (typeof email !== 'string' || !validateEmail(email)) return fail('INVALID_EMAIL');
  if (!challenge_id || typeof verification_code !== 'string' || !validateVerificationCode(verification_code)) return fail('MISSING_VERIFICATION');
  if (purpose !== 'first_time_password' && purpose !== 'forgot_password') return fail('INVALID_REQUEST');
  if (!new_password) return fail('PASSWORD_REQUIRED');
  if (!validatePassword(new_password).valid) return fail('INVALID_PASSWORD');
  if (new_password !== new_password_confirmation) return fail('PASSWORD_MISMATCH');

  // Validate every recoverable field before consuming the one-time code.
  const account = CustomerAccountStore.findByEmail(email);
  if (purpose === 'first_time_password' && account?.password_state === 'set') return fail('INVALID_CODE');
  const result = CustomerAccountStore.verifyChallengeCode(challenge_id, email, verification_code, purpose);
  if (!result.valid) return fail(result.reason ?? 'INVALID_CODE');
  if (!account) return fail('ACCOUNT_NOT_FOUND', 404);

  // These synchronous local-adapter operations cannot interleave with another
  // request; the production account service must provide the same transaction.
  CustomerAccountStore.updatePassword(account.account_id, new_password);
  CustomerAccountStore.markEmailVerified(account.account_id);
  const session = CustomerAccountStore.createSession(account.account_id, account.primary_email);
  const response = NextResponse.json({ success: true, account: toPublicProfile(account) });
  setSessionCookie(response, session.session_id, SESSION_TTL_MS / 1000);
  return response;
}

export const POST = accountRoute('sign-in/verify', handlePOST);
