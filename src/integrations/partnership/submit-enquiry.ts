import type { PartnershipApplication } from '@/modules/franchise/domain/partnership-application';

/** Delivery, access control, retention and deletion are owned by the configured enquiry service. */
export async function submitPartnershipEnquiry(application: PartnershipApplication, requestId: string) {
  const endpoint = process.env.PARTNERSHIP_API_URL;
  // Enable production only after the receiving service's data policy and controls are verified.
  if (!endpoint || (process.env.NODE_ENV === 'production' && process.env.PARTNERSHIP_PRODUCTION_READY !== 'true')) {
    return { accepted: false, status: 503 } as const;
  }
  try {
    if (new URL(endpoint).protocol !== 'https:') return { accepted: false, status: 503 } as const;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': requestId,
        ...(process.env.PARTNERSHIP_API_TOKEN ? { Authorization: `Bearer ${process.env.PARTNERSHIP_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({ ...application, source: 'trustgo', submittedAt: new Date().toISOString() }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(12_000),
    });
    const result = await response.json().catch(() => null);
    if (response.ok && result?.accepted === true) return { accepted: true, status: 202 } as const;
    return { accepted: false, status: 502 } as const;
  } catch {
    // Never log the body, upstream URL, token or contact information.
    return { accepted: false, status: 502 } as const;
  }
}
