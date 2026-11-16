export const SEARCH_RESULT_EXPIRY_MS = 3 * 60 * 1000;

/** Quote lifetime uses the service clock; elapsed time uses the browser's monotonic clock. */
export function expiryLifetime(expiresAt?: string, checkedAt?: string, now = Date.now()) {
  if (!expiresAt) return SEARCH_RESULT_EXPIRY_MS;
  const remaining = Date.parse(expiresAt) - (checkedAt ? Date.parse(checkedAt) : now);
  return Number.isFinite(remaining) ? Math.max(0, remaining) : 0;
}
