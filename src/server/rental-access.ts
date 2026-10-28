import { randomBytes, createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { getAuthenticatedAccount } from './customerAccountAuth';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { RentalAccess } from '@/integrations/fleetedge/local-rental-adapter';

const COOKIE = 'tg_rental_access';
const TTL = 24 * 60 * 60_000;
interface AccessState { sessions: Map<string, number>; limits: Map<string, { count: number; expires: number }> }
const globals = globalThis as typeof globalThis & { __trustgoRentalAccess?: AccessState };
const state = globals.__trustgoRentalAccess ??= { sessions: new Map(), limits: new Map() };

export async function rentalAccess(create = false): Promise<RentalAccess | null> {
  const now = Date.now();
  for (const [id, expiry] of state.sessions) if (expiry <= now) state.sessions.delete(id);
  const cookie = (await cookies()).get(COOKIE)?.value;
  const account = await getAuthenticatedAccount();
  if (cookie && state.sessions.has(cookie)) return { sessionId: cookie, accountId: account?.account_id };
  if (!create && !account) return null;
  if (!create) return { sessionId: '', accountId: account!.account_id };
  const sessionId = randomBytes(32).toString('hex');
  state.sessions.set(sessionId, now + TTL);
  return { sessionId, accountId: account?.account_id };
}

export function attachRentalCookie(response: NextResponse, access: RentalAccess) {
  response.cookies.set(COOKIE, access.sessionId, { httpOnly: true, sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', path: '/' });
}

export function revokeRentalAccess(access: RentalAccess) { state.sessions.delete(access.sessionId); }

export function checkRentalRequest(request: Request, action: string) {
  const now = Date.now();
  for (const [key, value] of state.limits) if (value.expires <= now) state.limits.delete(key);
  if (request.method !== 'GET') {
    if (request.headers.get('origin') !== new URL(request.url).origin) throw new RentalError('invalid_request', 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) throw new RentalError('invalid_request', 415);
  }
  const ipHash = createHash('sha256').update(request.headers.get('x-forwarded-for') ?? 'local').digest('hex');
  const key = `${ipHash}:${action}`;
  const limit = state.limits.get(key) ?? { count: 0, expires: now + 60_000 };
  if (++limit.count > (['lookup', 'guest-lookup'].includes(action) ? 10 : 120)) throw new RentalError('try_later', 429);
  state.limits.set(key, limit);
}
