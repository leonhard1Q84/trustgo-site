import {
  BlobError, BlobPreconditionFailedError, BlobRequestAbortedError,
  BlobServiceNotAvailable, BlobServiceRateLimited, BlobUnknownError,
} from '@vercel/blob';

/** Overlapping conditional writes can be reported as bad_request instead of HTTP 412. */
export function demoStorageFailure(error: unknown): 'conflict' | 'transient' | 'permanent' {
  if (error instanceof BlobPreconditionFailedError || (error instanceof BlobError
    && /conditional request cannot succeed due to a conflicting operation|already exists/i.test(error.message))) {
    return 'conflict';
  }
  if (error instanceof BlobRequestAbortedError || error instanceof BlobServiceNotAvailable
    || error instanceof BlobServiceRateLimited || error instanceof BlobUnknownError
    || (error instanceof BlobError && /Failed to fetch blob: (408|429|5\d\d)\b/.test(error.message))
    || (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name))
    || (error instanceof TypeError && /fetch failed|network|terminated/i.test(error.message))) return 'transient';
  return 'permanent';
}

export function demoStorageRetryAfter(error: unknown): number {
  return error instanceof BlobServiceRateLimited ? error.retryAfter * 1000 : 0;
}
