import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { parsePartnershipApplication } from '@/modules/franchise/domain/partnership-application';
import { submitPartnershipEnquiry } from '@/integrations/partnership/submit-enquiry';

type Attempt = { hash: string; expires: number; response: Promise<{ accepted: boolean; status: number }> };
type Bucket = { count: number; expires: number };
const globals = globalThis as typeof globalThis & {
  __tgPartnershipAttempts?: Map<string, Attempt>;
  __tgPartnershipLimits?: Map<string, Bucket>;
};
const attempts = globals.__tgPartnershipAttempts ??= new Map<string, Attempt>();
const limits = globals.__tgPartnershipLimits ??= new Map<string, Bucket>();
const digest = (value: string) => createHash('sha256').update(value).digest('hex');

function reply(status: number, code?: string) {
  return NextResponse.json(status === 202 ? { accepted: true } : { accepted: false, code }, {
    status,
    headers: { 'Cache-Control': 'private, no-store', ...(status === 429 ? { 'Retry-After': '60' } : {}) },
  });
}

async function readLimitedBody(request: Request) {
  if (Number(request.headers.get('content-length')) > 16_384) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16_384) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export async function handlePartnershipPOST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply(403, 'INVALID_ORIGIN');
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, 'INVALID_CONTENT_TYPE');
  const requestId = request.headers.get('idempotency-key') ?? '';
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) return reply(400, 'INVALID_REQUEST_ID');

  const now = Date.now();
  for (const [key, attempt] of attempts) if (attempt.expires <= now) attempts.delete(key);
  for (const [key, bucket] of limits) if (bucket.expires <= now) limits.delete(key);
  // A production reverse proxy must replace this header, with durable limits also enforced upstream.
  const source = digest(request.headers.get('x-forwarded-for') ?? 'local');
  const bucket = limits.get(source) ?? { count: 0, expires: now + 60_000 };
  if (limits.size >= 10_000 && !limits.has(source)) return reply(429, 'RATE_LIMITED');
  limits.set(source, bucket);
  if (++bucket.count > 10) return reply(429, 'RATE_LIMITED');

  const application = parsePartnershipApplication(await readLimitedBody(request));
  if (!application) return reply(400, 'INVALID_APPLICATION');
  const hash = digest(JSON.stringify(application));
  const existing = attempts.get(requestId);
  if (existing && existing.hash !== hash) return reply(409, 'REQUEST_CONFLICT');
  if (!existing && attempts.size >= 10_000) return reply(429, 'RATE_LIMITED');
  const response = existing?.response ?? submitPartnershipEnquiry(application, requestId);
  if (!existing) attempts.set(requestId, { hash, expires: now + 15 * 60_000, response });
  const result = await response;
  // Retry a failed delivery using the same upstream idempotency key; only confirmations are cached.
  if (!result.accepted) attempts.delete(requestId);
  return reply(result.status, result.accepted ? undefined : 'DELIVERY_UNAVAILABLE');
}
