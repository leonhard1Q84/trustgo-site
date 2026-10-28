'use client';

export interface CookieConsentPreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number;
}

export const CONSENT_STORAGE_KEY = 'tg_cookie_consent_v1';
export const OPEN_PREFERENCES_EVENT = 'tg_open_cookie_preferences';
export const CONSENT_CHANGED_EVENT = 'tg_cookie_consent_changed';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let cachedConsent: CookieConsentPreferences | null | undefined = undefined;

/**
 * Read stored cookie consent safely (SSR safe)
 */
export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (typeof parsed?.analytics === 'boolean' && typeof parsed?.marketing === 'boolean') {
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
        updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
      };
    }
  } catch {
    // storage inaccessible
  }
  return null;
}

/**
 * Subscribe to cookie consent store changes (supports multi-tab and local events)
 */
export function subscribeConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    cachedConsent = undefined;
    callback();
  };

  window.addEventListener('storage', handleUpdate);
  window.addEventListener(CONSENT_CHANGED_EVENT, handleUpdate);

  return () => {
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener(CONSENT_CHANGED_EVENT, handleUpdate);
  };
}

/**
 * Snapshot reader for useSyncExternalStore
 */
export function getConsentSnapshot(): CookieConsentPreferences | null {
  if (cachedConsent === undefined) {
    cachedConsent = getStoredConsent();
  }
  return cachedConsent;
}

/**
 * Apply consent states to Google Consent Mode v2 via gtag
 */
export function applyGtagConsent(prefs: CookieConsentPreferences): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: prefs.analytics ? 'granted' : 'denied',
      ad_storage: prefs.marketing ? 'granted' : 'denied',
      ad_user_data: prefs.marketing ? 'granted' : 'denied',
      ad_personalization: prefs.marketing ? 'granted' : 'denied',
    });
  }
}

/**
 * Persist consent choices and dispatch updates
 */
export function saveConsent(choices: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsentPreferences {
  const prefs: CookieConsentPreferences = {
    necessary: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    updatedAt: Date.now(),
  };

  cachedConsent = prefs;

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage quota or private mode restriction
    }

    applyGtagConsent(prefs);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: prefs }));
  }

  return prefs;
}

/**
 * Request opening the cookie preference configuration dialog
 */
export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}
