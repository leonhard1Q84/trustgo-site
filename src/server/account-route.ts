import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

// This repository's account adapter is for local verification. A production
// account service and delivery provider must replace it before enabling it.
export function localAccountsEnabled() {
  return process.env.NODE_ENV !== 'production';
}

type Bucket = { count: number; expires: number };
const globals = globalThis as typeof globalThis & { __tgAccountLimits?: Map<string, Bucket> };
const limits = globals.__tgAccountLimits ??= new Map<string, Bucket>();

function consume(key: string, max: number, duration: number) {
  const now = Date.now();
  for (const [id, bucket] of limits) if (bucket.expires <= now) limits.delete(id);
  const bucket = limits.get(key) ?? { count: 0, expires: now + duration };
  limits.set(key, bucket);
  if (++bucket.count > max) return false;
  return true;
}

export function resetAccountRequestLimitsForTesting() {
  limits.clear();
}

function rejected(code: string, status: number) {
  return NextResponse.json({ success: false, authenticated: false, code }, {
    status, headers: { 'Cache-Control': 'private, no-store', ...(status === 429 ? { 'Retry-After': '60' } : {}) },
  });
}

export function accountRoute<Args extends unknown[]>(
  action: string,
  handler: (request: Request, ...args: Args) => Promise<Response>,
) {
  return async (request: Request, ...args: Args): Promise<Response> => {
    if (!localAccountsEnabled() && action !== 'sign-out') return rejected('SERVICE_UNAVAILABLE', 503);
    try {
      if (request.method !== 'GET') {
        if (request.headers.get('origin') !== new URL(request.url).origin) return rejected('INVALID_REQUEST', 403);
        if (!request.headers.get('content-type')?.startsWith('application/json')) return rejected('INVALID_REQUEST', 415);
      }
      // The reverse proxy must replace, rather than append to, the forwarded IP.
      const source = createHash('sha256').update(request.headers.get('x-forwarded-for') ?? 'local').digest('hex');
      if (!consume(`${source}:${action}`, action === 'sign-in' ? 20 : 120, 60_000)) return rejected('RATE_LIMITED', 429);
      if (['POST', 'PATCH', 'DELETE'].includes(request.method)) {
        const text = await request.clone().text();
        if (text.length > 20_000) return rejected('INVALID_REQUEST', 413);
        const body = text ? JSON.parse(text) : {};
        if (!body || typeof body !== 'object' || Array.isArray(body)) return rejected('INVALID_REQUEST', 400);
        const strings = ['email', 'password', 'password_confirmation', 'new_password', 'new_password_confirmation',
          'current_password', 'challenge_id', 'verification_code', 'purpose', 'account_creation_request_id'];
        if (strings.some(key => body[key] !== undefined && (typeof body[key] !== 'string' || body[key].length > 512))) {
          return rejected('INVALID_REQUEST', 400);
        }
        if (action === 'sign-in' && typeof body.email === 'string') {
          const emailKey = createHash('sha256').update(body.email.trim().toLowerCase()).digest('hex');
          if (!consume(`password:${emailKey}`, 10, 60_000)) return rejected('RATE_LIMITED', 429);
        }
      }
      const response = await handler(request, ...args);
      response.headers.set('Cache-Control', 'private, no-store');
      return response;
    } catch {
      return rejected('INVALID_REQUEST', 400);
    }
  };
}
