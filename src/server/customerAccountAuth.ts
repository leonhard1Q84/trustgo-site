import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { CustomerAccountStore } from './customerAccountStore';
import { SESSION_COOKIE_NAME } from '@/modules/customer-account/domain/account.rules';
import { localAccountsEnabled } from './account-route';

export async function getAuthenticatedAccount() {
  if (!localAccountsEnabled()) return null;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const session = CustomerAccountStore.getSession(sessionId);
  if (!session) return null;

  return CustomerAccountStore.findById(session.account_id) ?? null;
}

export function setSessionCookie(response: NextResponse, sessionId: string, maxAgeSeconds: number) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: maxAgeSeconds,
  });
}
