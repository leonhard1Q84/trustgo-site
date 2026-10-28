'use client';

import React, {useEffect, useState} from 'react';
import {Eye, EyeOff, Loader2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogDescription, DialogTitle} from '@/shared/ui/dialog';
import {validatePassword, validateVerificationCode} from '../domain/account.rules';
import {CustomerAccountService} from '../application/customerAccountService';
import type {PublicAccountProfile} from '../domain/account.types';

interface AccountEmailVerificationDialogProps {
  lang: RouteLanguage;
  account: PublicAccountProfile;
  open: boolean;
  onClose: () => void;
  onUpdated: (account: PublicAccountProfile) => void;
}

const inputClass =
  'w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';
const labelClass = 'mb-1 block text-caption font-medium text-foreground';

export function AccountEmailVerificationDialog({
  lang,
  account,
  open,
  onClose,
  onUpdated,
}: AccountEmailVerificationDialogProps) {
  const {t} = useI18n(lang);
  const [challengeId, setChallengeId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setChallengeId('');
    setMaskedEmail('');
    setVerificationCode('');
    setNewPassword('');
    setNewPasswordConfirmation('');
    setDevCode(null);
    setError(null);
    setSent(false);
  }, [open]);

  const requestCode = async () => {
    setError(null);
    setIsSubmitting(true);
    const response = await CustomerAccountService.requestEmailVerification();
    if (response.success) {
      setChallengeId(response.challenge_id);
      setMaskedEmail(response.masked_email);
      setDevCode(response.dev_code ?? null);
      setSent(true);
    } else {
      setError(response.code === 'RATE_LIMITED' ? t('account.verification.rate_limited') : t('account.error.generic'));
    }
    setIsSubmitting(false);
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!validateVerificationCode(verificationCode)) {
      setError(t('account.verification.invalid'));
      return;
    }
    if (account.password_state === 'not_set') {
      const check = validatePassword(newPassword);
      if (!check.valid) {
        setError(t(check.messageKey ?? 'account.error.password_complexity'));
        return;
      }
      if (newPassword !== newPasswordConfirmation) {
        setError(t('account.error.password_mismatch'));
        return;
      }
    }

    setIsSubmitting(true);
    const response = await CustomerAccountService.verifyEmail({
      challenge_id: challengeId,
      verification_code: verificationCode,
      ...(account.password_state === 'not_set'
        ? {new_password: newPassword, new_password_confirmation: newPasswordConfirmation}
        : {}),
    });
    if (response.success && response.account) {
      onUpdated(response.account);
      onClose();
    } else {
      setError(response.code === 'RATE_LIMITED' ? t('account.verification.rate_limited') : t('account.verification.invalid'));
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="sheet" className="p-0 gap-0 overflow-y-auto">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle>{t('account.verification.modal_title')}</DialogTitle>
          <DialogDescription>{t('account.verification.modal_desc')}</DialogDescription>
        </div>

        <form onSubmit={verify} className="space-y-4 px-5 py-4 sm:px-6">
          <div className="rounded-control bg-muted p-3 text-caption text-foreground-secondary">
            <span className="font-semibold text-foreground">{account.primary_email}</span>
            {sent && maskedEmail && (
              <p className="mt-1">
                {t('account.verification.sent').replace('{masked_email}', maskedEmail)}
              </p>
            )}
            {devCode && (
              <p className="mt-1 font-mono font-semibold text-success">
                {t('account.verification.dev_code')} {devCode}
              </p>
            )}
          </div>

          {!sent ? (
            <button
              type="button"
              onClick={requestCode}
              disabled={isSubmitting}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2 text-body font-semibold text-primary-foreground hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('account.verification.continue_button')}
            </button>
          ) : (
            <>
              <div>
                <label htmlFor="account-email-code" className={labelClass}>
                  {t('account.verification.code')}
                </label>
                <input
                  id="account-email-code"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  placeholder="000000"
                  className={`${inputClass} text-center font-mono text-lg tracking-[0.4em]`}
                />
              </div>

              {account.password_state === 'not_set' && (
                <>
                  <div>
                    <label htmlFor="account-first-password" className={labelClass}>
                      {t('account.field.new_password')}
                    </label>
                    <div className="relative">
                      <input
                        id="account-first-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={showPassword ? t('account.action.hide_password') : t('account.action.show_password')}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-caption text-foreground-secondary">{t('account.field.password_hint')}</p>
                  </div>
                  <div>
                    <label htmlFor="account-first-password-confirmation" className={labelClass}>
                      {t('account.field.password_confirmation')}
                    </label>
                    <input
                      id="account-first-password-confirmation"
                      type="password"
                      autoComplete="new-password"
                      value={newPasswordConfirmation}
                      onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {error && (
                <p role="alert" className="rounded-control border border-destructive/30 bg-destructive-light px-3 py-2 text-caption font-medium text-destructive">
                  {error}
                </p>
              )}

              <div className="flex gap-2.5 pb-[env(safe-area-inset-bottom)]">
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={isSubmitting}
                  className="min-h-10 flex-1 rounded-control border border-border bg-background px-3 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {t('account.verification.resend')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-10 flex-[1.4] items-center justify-center gap-1.5 rounded-control bg-primary px-4 text-body font-semibold text-primary-foreground hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>{t('account.security.verify_email_action')}</span>
                  )}
                </button>
              </div>
            </>
          )}

          {error && !sent && (
            <p role="alert" className="rounded-control border border-destructive/30 bg-destructive-light px-3 py-2 text-caption font-medium text-destructive">
              {error}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
