'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  accountErrorMessageKey,
  validateEmail,
  validatePassword,
  validateVerificationCode,
} from '../domain/account.rules';
import { CustomerAccountService } from '../application/customerAccountService';
import { useAuth } from '../application/AuthContext';
import { useAuthModal } from '../application/AuthModalContext';
import {createAccountRequestId} from '../application/account-request';
import {initialAuthView, safeAccountReturnPath, type AuthView} from '../domain/auth-flow';
import { AccountRichTextConsent } from './AccountRichTextConsent';
import { BrandLogo } from '@/shared/ui/brand-logo';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

interface AuthUnifiedCardProps {
  lang: RouteLanguage;
  isModal?: boolean;
  initialEmail?: string;
  initialView?: 'initial' | 'password' | 'register' | 'challenge';
  redirectUrl?: string;
  onSuccess?: () => void;
}

export const AuthUnifiedCard: React.FC<AuthUnifiedCardProps> = ({
  lang,
  isModal = false,
  initialEmail = '',
  initialView = 'initial',
  redirectUrl,
  onSuccess,
}) => {
  const { t } = useI18n(lang);
  const router = useRouter();
  const { signIn, register, refreshSession } = useAuth();
  const { closeAuthModal } = useAuthModal();

  const [view, setView] = useState<AuthView>(() => initialAuthView(initialView, initialEmail));
  const emailDestination = useRef<AuthView>(initialView === 'register' ? 'register' : 'password');
  const registrationRequest = useRef<{email: string; id: string} | null>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Challenge (Email verification / Set password)
  const [challengeId, setChallengeId] = useState('');
  const [challengePurpose, setChallengePurpose] = useState<'first_time_password' | 'forgot_password'>('first_time_password');
  const [verificationCode, setVerificationCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleFinishSuccess = useCallback(async () => {
    if (!active.current) return;
    if (!await refreshSession()) {
      setErrorMessage(t('account.error.generic'));
      return;
    }
    if (!active.current) return;
    if (isModal) {
      closeAuthModal();
      if (redirectUrl) router.push(safeAccountReturnPath(redirectUrl, lang));
    } else {
      router.push(safeAccountReturnPath(redirectUrl, lang));
    }
    onSuccess?.();
  }, [refreshSession, onSuccess, isModal, closeAuthModal, router, redirectUrl, lang, t]);

  const returnToEmail = () => {
    emailDestination.current = view === 'register' ? 'register' : 'password';
    setPassword('');
    setPasswordConfirmation('');
    setNewPassword('');
    setNewPasswordConfirmation('');
    setVerificationCode('');
    setChallengeId('');
    setDevCode(null);
    setErrorMessage(null);
    setInfoMessage(null);
    setView('initial');
  };

  // Initial Step: User inputs email and clicks Continue
  const handleInitialContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !validateEmail(trimmed)) {
      setErrorMessage(t('account.error.invalid_email'));
      return;
    }

    setEmail(trimmed);
    if (emailDestination.current === 'register') {
      setView('register');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await signIn(trimmed, '');
      if (result.code === 'PASSWORD_REQUIRED') setView('password');
      else if (result.code === 'ACCOUNT_NOT_FOUND') {
        setView('register');
        setInfoMessage(t('account.sign_in.not_found'));
      } else if (result.code === 'PASSWORD_NOT_SET') await initiateChallenge('first_time_password');
      else setErrorMessage(t(accountErrorMessageKey(result.code)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password Sign-In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!password) {
      setErrorMessage(t('account.error.password_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(email, password);

      if (res.success) {
        await handleFinishSuccess();
        return;
      }

      if (res.code === 'ACCOUNT_NOT_FOUND') {
        // Account does not exist, switch smoothly to register
        setView('register');
        setInfoMessage(t('account.sign_in.not_found'));
      } else if (res.code === 'PASSWORD_NOT_SET') {
        // Created during checkout, requires verification to set password
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

  // Register New Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!validateEmail(email)) {
      emailDestination.current = 'register';
      setView('initial');
      setErrorMessage(t('account.error.invalid_email'));
      return;
    }

    const check = validatePassword(password);
    if (!check.valid) {
      setErrorMessage(t(check.messageKey ? (check.messageKey as keyof typeof t) : 'account.error.password_complexity'));
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
      if (registrationRequest.current?.email !== email.trim().toLowerCase()) {
        registrationRequest.current = {email: email.trim().toLowerCase(), id: createAccountRequestId()};
      }
      const requestId = registrationRequest.current.id;
      const res = await register({
        email,
        password,
        password_confirmation: passwordConfirmation,
        account_creation_request_id: requestId,
        terms_version: CURRENT_TERMS_VERSION,
        privacy_version: CURRENT_PRIVACY_VERSION,
        consent_locale: lang,
      });

      if (res.success) {
        await handleFinishSuccess();
      } else if (res.code === 'EMAIL_ALREADY_EXISTS') {
        setView('password');
        setErrorMessage(t('account.error.email_already_registered'));
      } else if (res.code === 'PASSWORD_NOT_SET') {
        await initiateChallenge('first_time_password');
      } else {
        setErrorMessage(t(accountErrorMessageKey(res.code)));
      }
    } catch {
      setErrorMessage(t('account.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Challenge (Email verification code)
  const initiateChallenge = async (purpose: 'first_time_password' | 'forgot_password') => {
    if (!validateEmail(email)) {
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
        setVerificationCode('');
        setPassword('');
        setPasswordConfirmation('');
        setView('challenge');
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

  const handleVerifyAndSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setErrorMessage(t('account.verification.invalid'));
      return;
    }

    const check = validatePassword(newPassword);
    if (!check.valid) {
      setErrorMessage(t(check.messageKey ? (check.messageKey as keyof typeof t) : 'account.error.password_complexity'));
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
        await handleFinishSuccess();
      } else if (res.code === 'ACCOUNT_NOT_FOUND') {
        setView('register');
        setErrorMessage(t('account.sign_in.not_found'));
      } else {
        setErrorMessage(t(accountErrorMessageKey(res.code, 'account.verification.invalid')));
      }
    } catch {
      setErrorMessage(t('account.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Top Header: Brand Logo & Title */}
      <div className="text-center pt-2 pb-6 px-4 sm:px-6">
        <div className="flex justify-center mb-4">
          <BrandLogo lang={lang} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {view === 'challenge'
            ? t('account.action.set_password')
            : t('account.auth.log_in_or_sign_up')}
        </h2>
        {view === 'initial' && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            {t('account.sign_in.subtitle')}
          </p>
        )}
      </div>

      {/* Info / Success Feedback */}
      {infoMessage && (
        <div className="mx-4 sm:mx-6 mb-4 rounded-control border border-primary/20 bg-brand-light p-3 text-xs sm:text-sm text-primary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="mx-4 sm:mx-6 mb-4 rounded-control border border-destructive/20 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive flex items-center gap-2"
        >
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* VIEW 1: INITIAL SCREEN (EMAIL + CONTINUE) */}
      {view === 'initial' && (
        <div className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleInitialContinue} className="space-y-4">
            <div>
              <label htmlFor="auth-email-input" className="block text-xs font-semibold text-foreground mb-1.5">
                {t('account.field.email')}
              </label>
              <div className="relative">
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full h-12 px-4 rounded-control border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-control bg-primary hover:bg-primary-strong text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t('account.verification.continue_button')}</span>
              )}
            </button>
          </form>

          {/* Value Props Row */}
          <div className="mt-8 pt-5 border-t border-border grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-foreground">⚡ {t('account.privilege.express')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-foreground">🏷️ {t('account.privilege.discount')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-foreground">📱 {t('account.privilege.manage')}</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PASSWORD SIGN-IN */}
      {view === 'password' && (
        <div className="px-4 sm:px-6 pb-6">
          {/* Back button and current email badge */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
                  disabled={isSubmitting}
              onClick={() => {
                returnToEmail();
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground-secondary hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('account.action.back_to_sign_in')}</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="max-w-[150px] sm:max-w-[180px] truncate font-medium text-foreground">
                {email}
              </span>
              <button
                type="button"
                  disabled={isSubmitting}
                onClick={returnToEmail}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                {t('account.auth.change_email')}
              </button>
            </div>
          </div>

          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-password-input"
                  className="text-xs font-semibold text-foreground"
                >
                  {t('account.field.password')}
                </label>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => initiateChallenge('forgot_password')}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  {t('account.action.forgot_password')}
                </button>
              </div>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('account.auth.enter_password')}
                  autoComplete="current-password"
                  autoFocus
                  required
                  className="w-full h-12 px-4 pr-11 rounded-control border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-control bg-primary hover:bg-primary-strong text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t('account.action.sign_in')}</span>
              )}
            </button>
          </form>

          {/* Switch to Register link */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span>{t('account.sign_in.join_now_free')} </span>
            <button
              type="button"
                  disabled={isSubmitting}
              onClick={() => {
                setView('register');
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="text-primary hover:underline font-bold cursor-pointer"
            >
              {t('account.sign_in.join_link')}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: REGISTER NEW ACCOUNT */}
      {view === 'register' && (
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
                  disabled={isSubmitting}
              onClick={() => {
                returnToEmail();
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground-secondary hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('account.action.back_to_sign_in')}</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="max-w-[150px] sm:max-w-[180px] truncate font-medium text-foreground">
                {email}
              </span>
              <button
                type="button"
                  disabled={isSubmitting}
                onClick={returnToEmail}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                {t('account.auth.change_email')}
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="auth-reg-password"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                {t('account.field.password')}
              </label>
              <div className="relative">
                <input
                  id="auth-reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('account.field.password_hint')}
                  autoComplete="new-password"
                  autoFocus
                  required
                  className="w-full h-12 px-4 pr-11 rounded-control border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-reg-confirm"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                {t('account.field.password_confirmation')}
              </label>
              <div className="relative">
                <input
                  id="auth-reg-confirm"
                  type={showConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder={t('account.field.password_confirmation')}
                  autoComplete="new-password"
                  required
                  className="w-full h-12 px-4 pr-11 rounded-control border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showConfirmation ? 'Hide password' : 'Show password'}
                >
                  {showConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Legal consent check */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-xs border-border text-primary focus:ring-primary"
                />
                <span className="leading-relaxed">
                  <AccountRichTextConsent
                    lang={lang}
                    rawText={
                      t('account.consent.registration_agreement') ||
                      'I agree to the <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>'
                    }
                  />
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-control bg-primary hover:bg-primary-strong text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t('account.action.create')}</span>
              )}
            </button>
          </form>

          {/* Switch back to sign-in */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span>{t('account.register.have_account')} </span>
            <button
              type="button"
                  disabled={isSubmitting}
              onClick={() => {
                setView('password');
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="text-primary hover:underline font-bold cursor-pointer"
            >
              {t('account.action.go_to_sign_in')}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: EMAIL CHALLENGE (SET PASSWORD / FORGOT PASSWORD) */}
      {view === 'challenge' && (
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
                  disabled={isSubmitting}
              onClick={() => {
                setView('password');
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground-secondary hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('account.action.back_to_sign_in')}</span>
            </button>
          </div>

          <div className="mb-4 text-xs text-muted-foreground">
            <p>
              {t('account.verification.sent').replace('{masked_email}', maskedEmail || email)}
            </p>
          </div>

          {devCode && (
            <div className="mb-4 rounded-control border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 font-mono">
              [Dev Simulation Code]: {devCode}
            </div>
          )}

          <form onSubmit={handleVerifyAndSetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="auth-code-input"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                {t('account.verification.code')}
              </label>
              <div className="relative">
                <input
                  id="auth-code-input"
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  autoFocus
                  required
                  className="w-full h-12 px-4 rounded-control border border-border bg-background text-foreground text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div className="mt-1.5 text-right">
                <button
                  type="button"
                  disabled={cooldown > 0 || isSubmitting}
                  onClick={() => initiateChallenge(challengePurpose)}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer disabled:opacity-50"
                >
                  {cooldown > 0
                    ? `${t('account.verification.resend')} (${cooldown}s)`
                    : t('account.verification.resend')}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-new-password"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                {t('account.field.new_password')}
              </label>
              <div className="relative">
                <input
                  id="auth-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('account.field.password_hint')}
                  required
                  className="w-full h-12 px-4 pr-11 rounded-control border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-confirm-new-password"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                {t('account.field.password_confirmation')}
              </label>
              <div className="relative">
                <input
                  id="auth-confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  placeholder={t('account.field.password_confirmation')}
                  required
                  className="w-full h-12 px-4 pr-11 rounded-control border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-control bg-primary hover:bg-primary-strong text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{t('account.action.set_password')}</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
