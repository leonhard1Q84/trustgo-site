export const ACCOUNT_UNAUTHORIZED_EVENT = 'trustgo:account-unauthorized';

export function createAccountRequestId() {
  // Never turn a public value (such as email length) into a request credential.
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function accountFetch(path: string, init: RequestInit = {}) {
  const method = init.method ?? 'GET';
  const response = await fetch(path, {
    ...init, credentials: 'same-origin', cache: 'no-store',
    headers: { ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    ...(method !== 'GET' && init.body === undefined ? { body: '{}' } : {}),
  });
  if (response.status === 401 && path !== '/api/account/sign-in/password' && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ACCOUNT_UNAUTHORIZED_EVENT));
  }
  return response;
}
