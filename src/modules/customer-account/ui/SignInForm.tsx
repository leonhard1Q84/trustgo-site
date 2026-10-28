'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {
  accountErrorMessageKey,
  validateEmail,
  validatePassword,
  validateVerificationCode,
} from '../domain/account.rules';
import {CustomerAccountService} from '../application/customerAccountService';
import {useAuth} from '../application/AuthContext';
import { BrandLogo } from '@/shared/ui/brand-logo';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface SignInFormProps {
  lang: RouteLanguage;
}

type SignInMode = 'password' | 'challenge';

export const SignInForm: React.FC<SignInFormProps> = ({lang}) => {
  const {t} = useI18n(lang);
  const router = useRouter();
  const {signIn, refreshSession} = useAuth();

  const [mode, setMode] = useState<SignInMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Challenge / Set Password state
  const [challengeId, setChallengeId] = useState('');
  const [challengePurpose, setChallengePurpose] = useState<'first_time_password' | 'forgot_password'>('first_time_password');
  const [verificationCode, setVerificationCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cooldown timer
  const [cooldown, setCooldown] = useState(0);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [notFoundHint, setNotFoundHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setNotFoundHint(false);

    if (!email || !validateEmail(email)) {
      setErrorMessage(t('account.error.invalid_email'));
      return;
    }

    if (!password) {
      setErrorMessage(t('account.error.password_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(email, password);

      if (res.success) {
        router.push(`/${lang}/account/`);
        return;
      }

      if (res.code === 'ACCOUNT_NOT_FOUND') {
        setNotFoundHint(true);
        setErrorMessage(t('account.sign_in.not_found'));
      } else if (res.code === 'PASSWORD_NOT_SET') {
        // Account exists from checkout, redirect to challenge verification mode
        setInfoMessage(t('account.sign_in.password_not_set_hint'));
        await initiateChallenge('first_time_password');
      } else if (res.code === 'INVALID_CREDENTIALS') {
        setErrorMessage(t('account.error.invalid_credentials'));
      } else {
        setErrorMessage(t(accountErrorMessageKey(res.code)));
      }
    } catch {
      setErrorMessage(t('account.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateChallenge = async (purpose: 'first_time_password' | 'forgot_password') => {
    if (!email || !validateEmail(email)) {
      setErrorMessage(t('account.error.invalid_email'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const challengeRes = await CustomerAccountService.requestChallenge(email, purpose, lang);
      if (challengeRes.success) {
        setChallengeId(challengeRes.challenge_id);
        setChallengePurpose(purpose);
        setMaskedEmail(challengeRes.masked_email);
        setDevCode(challengeRes.dev_code || null);
        setMode('challenge');
        setCooldown(60);
      } else {
        setErrorMessage(t(accountErrorMessageKey(challengeRes.code)));
      }
    } catch {
      setErrorMessage(t('account.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    await initiateChallenge(challengePurpose);
  };

  const handleVerifyAndSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setErrorMessage(t('account.verification.invalid'));
      return;
    }

    const check = validatePassword(newPassword);
    if (!check.valid) {
      setErrorMessage(t(check.messageKey as any || 'account.error.password_complexity'));
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setErrorMessage(t('account.error.password_mismatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await CustomerAccountService.verifyAndSetPassword({
        email,
        challenge_id: challengeId,
        verification_code: verificationCode,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
        purpose: challengePurpose,
      });

      if (res.success) {
        await refreshSession();
        router.push(`/${lang}/account/`);
      } else if (res.code === 'ACCOUNT_NOT_FOUND') {
        setNotFoundHint(true);
        setErrorMessage(t('account.sign_in.not_found'));
      } else {
        setErrorMessage(t('account.verification.invalid'));
      }
    } catch {
      setErrorMessage(t('account.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-card border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="text-center mb-8">
        <div className="inline-flex justify-center mb-4">
          <BrandLogo className="h-10 sm:h-11 w-auto" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
          {mode === 'password' ? t('account.action.sign_in') : t('account.action.set_password')}
        </h1>
        <p className="text-sm font-medium text-neutral-500 mt-2">
          {mode === 'password'
            ? t('account.sign_in.subtitle')
            : t('account.sign_in.challenge_subtitle')}
        </p>
      </div>

      {infoMessage && (
        <div className="mb-6 rounded-card border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-card border border-red-200 bg-red-50/80 p-4 text-sm text-[#B42318] flex flex-col gap-1"
        >
          <span>{errorMessage}</span>
          {notFoundHint && (
            <Link
              href={`/${lang}/account/register/`}
              className="font-bold underline underline-offset-2 hover:text-[#25A5E3]"
            >
              {t('account.action.create')} &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-neutral-50/80 border border-neutral-200/60 p-3.5 flex items-center justify-around text-center text-xs font-semibold text-neutral-700">
        <div className="flex items-center gap-1.5">
          <span className="text-[#25A5E3]">⚡</span>
          <span>{t('account.privilege.express')}</span>
        </div>
        <span className="h-3.5 w-px bg-neutral-200" />
        <div className="flex items-center gap-1.5">
          <span className="text-[#25A5E3]">🏷️</span>
          <span>{t('account.privilege.discount')}</span>
        </div>
        <span className="h-3.5 w-px bg-neutral-200" />
        <div className="flex items-center gap-1.5">
          <span className="text-[#25A5E3]">📱</span>
          <span>{t('account.privilege.manage')}</span>
        </div>
      </div>

      {mode === 'password' ? (
        /* Standard Password Sign-in Form */
        <form onSubmit={handlePasswordSignIn} className="space-y-4 sm:space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5"
            >
              {t('account.field.email')}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-card border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#25A5E3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25A5E3]/15 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="signin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                {t('account.field.password')}
              </label>
              <button
                type="button"
                onClick={() => initiateChallenge('forgot_password')}
                className="text-xs font-semibold text-[#25A5E3] hover:text-[#1D82B5] underline underline-offset-2 transition-colors"
              >
                {t('account.action.forgot_password')}
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-card border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#25A5E3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25A5E3]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1"
                aria-label={showPassword ? t('account.action.hide_password') : t('account.action.show_password')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] rounded-card bg-[#25A5E3] hover:bg-[#1D82B5] active:bg-[#B3000F] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(230,0,18,0.22)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('account.status.submitting')}</span>
              </>
            ) : (
              <span>{t('account.action.sign_in')}</span>
            )}
          </button>
        </form>
      ) : (
        /* Challenge Verification & Set Password Form */
        <form onSubmit={handleVerifyAndSetPassword} className="space-y-4 sm:space-y-5">
          <div className="rounded-card border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-xs text-neutral-600">
              {t('account.verification.sent').replace('{masked_email}', maskedEmail || email)}
            </p>
            {devCode && (
              <p className="text-xs font-mono font-semibold text-emerald-700 mt-1">
                [Testing Code]: {devCode}
              </p>
            )}
          </div>

          {/* Verification Code Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="verify-code"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                {t('account.verification.code')}
              </label>
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={handleResendCode}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:text-neutral-400"
              >
                {cooldown > 0
                  ? `${t('account.verification.resend')} (${cooldown}s)`
                  : t('account.verification.resend')}
              </button>
            </div>
            <input
              id="verify-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              className="w-full tracking-widest text-center font-mono text-lg font-bold rounded-card border border-neutral-200 bg-neutral-50/50 py-2.5 text-neutral-900 focus:border-[#25A5E3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25A5E3]/15 transition-all"
            />
          </div>

          {/* New Password Field */}
          <div>
            <label
              htmlFor="verify-new-password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5"
            >
              {t('account.field.new_password')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                id="verify-new-password"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-card border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#25A5E3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25A5E3]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1"
                aria-label={showNewPassword ? t('account.action.hide_password') : t('account.action.show_password')}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {t('account.field.password_hint')}
            </p>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="verify-confirm-password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5"
            >
              {t('account.field.password_confirmation')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                id="verify-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-card border border-neutral-200 bg-neutral-50/50 py-3 pl-11 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#25A5E3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25A5E3]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none p-1"
                aria-label={showConfirmPassword ? t('account.action.hide_password') : t('account.action.show_password')}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit & Back buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] rounded-card bg-[#25A5E3] hover:bg-[#1D82B5] active:bg-[#B3000F] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(230,0,18,0.22)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('account.status.submitting')}</span>
                </>
              ) : (
                <span>{t('account.action.set_password')}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('password');
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('account.action.back_to_sign_in')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <p className="text-sm font-medium text-neutral-600">
          {t('account.sign_in.join_now_free')}{' '}
          <Link
            href={`/${lang}/account/register/`}
            className="font-bold text-[#25A5E3] hover:text-[#1D82B5] underline underline-offset-4 ml-1.5 transition-colors"
          >
            {t('account.sign_in.join_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};
