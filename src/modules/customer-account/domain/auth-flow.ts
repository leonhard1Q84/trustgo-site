import type {RouteLanguage} from '@/i18n/locales';
import {validateEmail} from './account.rules';

export type AuthView = 'initial' | 'password' | 'register' | 'challenge';

export function initialAuthView(view: AuthView, email: string): AuthView {
  // Challenges must always be issued by the server in the current form.
  if (view === 'challenge') return 'initial';
  return validateEmail(email) ? view : 'initial';
}

export function safeAccountReturnPath(value: string | undefined, lang: RouteLanguage) {
  const fallback = `/${lang}/account`;
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return fallback;
  const url = new URL(value, 'https://trustgo.invalid');
  if (url.origin !== 'https://trustgo.invalid' || /\/account\/(sign-in|register)\/?$/.test(url.pathname)) return fallback;
  return url.pathname + url.search + url.hash;
}
