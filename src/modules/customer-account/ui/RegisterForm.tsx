'use client';

import React, {useState, useRef} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  accountErrorMessageKey,
  validateEmail,
  validatePassword,
} from '../domain/account.rules';
import {useAuth} from '../application/AuthContext';
import {createAccountRequestId} from '../application/account-request';
import {AccountRichTextConsent} from './AccountRichTextConsent';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface RegisterFormProps {
  lang: RouteLanguage;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({lang}) => {
  const {t} = useI18n(lang);
  const router = useRouter();
  const {register} = useAuth();

  const [email, setEmail] = useState('');
  const requestId = useRef<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingUserHint, setExistingUserHint] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setExistingUserHint(false);

    if (!email || !validateEmail(email)) {
      setErrorMessage(t('account.error.invalid_email'));
      return;
    }

    const check = validatePassword(password);
    if (!check.valid) {
      setErrorMessage(t(check.messageKey as any || 'account.error.password_complexity'));
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage(t('account.error.password_mismatch'));
      return;
    }

    if (!consentAgreed) {
      setErrorMessage(t('account.error.consent_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        email,
        password,
        password_confirmation: passwordConfirmation,
        account_creation_request_id: requestId.current ??= createAccountRequestId(),
        terms_version: CURRENT_TERMS_VERSION,
        privacy_version: CURRENT_PRIVACY_VERSION,
        consent_locale: lang,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(`/${lang}/account/`);
        }, 1200);
      } else if (res.code === 'EMAIL_ALREADY_EXISTS' || res.code === 'PASSWORD_NOT_SET') {
        setExistingUserHint(true);
        setErrorMessage(
          res.code === 'PASSWORD_NOT_SET'
            ? t('account.error.password_not_set_hint')
            : t('account.error.email_already_registered'),
        );
      } else {
        setErrorMessage(t(accountErrorMessageKey(res.code, 'account.error.general_failed')));
      }
    } catch {
      setErrorMessage(t('account.error.network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-card border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">{t('account.register.success_title')}</h2>
        <p className="text-sm text-[#667085] mb-6">{t('account.register.success_desc')}</p>
        <Link
          href={`/${lang}/account/`}
          className="inline-flex items-center justify-center w-full h-11 rounded-control bg-[#25A5E3] text-white font-semibold text-sm hover:bg-[#1D82B5] transition-colors"
        >
          {t('account.action.go_to_account')}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
          {t('account.register.title')}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#667085]">
          {t('account.register.subtitle')}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-control border border-red-200 bg-red-50 p-3.5 flex items-start gap-2 text-xs font-medium text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#25A5E3] mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
            {existingUserHint && (
              <Link
                href={`/${lang}/account/sign-in/`}
                className="mt-1.5 inline-block font-semibold text-[#25A5E3] underline underline-offset-2 hover:text-[#1D82B5]"
              >
                {t('account.action.go_to_sign_in')} →
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="reg-email" className="block text-xs font-semibold text-[#344054] mb-1">
            {t('account.field.email')} <span className="text-[#25A5E3]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-control border border-[#D9E2EC] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] outline-none focus:border-[#25A5E3] focus:ring-1 focus:ring-[#25A5E3]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-xs font-semibold text-[#344054] mb-1">
            {t('account.field.password')} <span className="text-[#25A5E3]">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('account.field.password_placeholder') || '至少 8 位，包含字母與數字'}
              className="w-full rounded-control border border-[#D9E2EC] bg-white py-2.5 pl-9 pr-10 text-sm text-[#0F172A] outline-none focus:border-[#25A5E3] focus:ring-1 focus:ring-[#25A5E3]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467]"
              aria-label={showPassword ? t('account.action.hide_password') : t('account.action.show_password')}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reg-password-confirm" className="block text-xs font-semibold text-[#344054] mb-1">
            {t('account.field.password_confirmation')} <span className="text-[#25A5E3]">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <input
              id="reg-password-confirm"
              type={showConfirmation ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder={t('account.field.password_confirmation_placeholder') || '再次輸入密碼'}
              className="w-full rounded-control border border-[#D9E2EC] bg-white py-2.5 pl-9 pr-10 text-sm text-[#0F172A] outline-none focus:border-[#25A5E3] focus:ring-1 focus:ring-[#25A5E3]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmation(!showConfirmation)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467]"
              aria-label={showConfirmation ? t('account.action.hide_password') : t('account.action.show_password')}
            >
              {showConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-[#475467] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentAgreed}
              onChange={(e) => setConsentAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#D9E2EC] text-[#25A5E3] focus:ring-[#25A5E3]"
            />
            <span className="leading-relaxed">
              <AccountRichTextConsent
                lang={lang}
                rawText={t('account.consent.registration_agreement') || '我已閱讀並同意 <terms>服務條款</terms> 和 <privacy>隱私政策</privacy>'}
              />
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-control bg-[#25A5E3] hover:bg-[#1D82B5] active:scale-[0.99] text-white font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSubmitting ? t('account.action.submitting') : t('account.action.create_account')}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-[#D9E2EC] text-center text-xs text-[#667085]">
        <span>{t('account.register.already_have_account')} </span>
        <Link
          href={`/${lang}/account/sign-in/`}
          className="font-semibold text-[#25A5E3] hover:text-[#1D82B5] hover:underline"
        >
          {t('account.action.sign_in')}
        </Link>
      </div>
    </div>
  );
};
