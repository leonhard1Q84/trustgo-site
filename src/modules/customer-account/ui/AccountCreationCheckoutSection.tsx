'use client';

import React from 'react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {maskEmail} from '../domain/account.rules';
import {AccountRichTextConsent} from './AccountRichTextConsent';
import {useAuth} from '../application/AuthContext';
import {CheckCircle2, Loader2, UserCheck, XCircle} from 'lucide-react';
import {cn} from '@/shared/ui/utils';

export type CheckoutAccountCreationStatus = 'idle' | 'pending' | 'created' | 'failed';

interface AccountCreationCheckoutSectionProps {
  lang: RouteLanguage;
  driverEmail: string;
  createAccountRequested: boolean;
  onToggleCreateAccount: (requested: boolean) => void;
  creationStatus?: CheckoutAccountCreationStatus;
  variant?: 'embedded' | 'card';
  className?: string;
}

export const AccountCreationCheckoutSection: React.FC<AccountCreationCheckoutSectionProps> = ({
  lang,
  driverEmail,
  createAccountRequested,
  onToggleCreateAccount,
  creationStatus = 'idle',
  variant = 'embedded',
  className,
}) => {
  const {t} = useI18n(lang);
  const {user, isAuthenticated} = useAuth();

  // If user is already logged in, show lightweight signed-in state without checkbox
  if (isAuthenticated && user) {
    return (
      <section
        aria-label={t('account.status.logged_in')}
        className={cn(
          'rounded-card border border-border bg-muted/30 p-4 transition-all',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-control bg-primary/10 text-primary shrink-0">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>{t('account.status.logged_in')}</span>
              <span className="text-xs font-normal text-foreground-secondary">({user.primary_email})</span>
            </div>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {t('account.checkout.logged_in_notice')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const masked = driverEmail ? maskEmail(driverEmail) : '';

  const isEmbedded = variant === 'embedded';

  return (
    <section
      aria-label={t('account.checkout.title')}
      className={cn(
        isEmbedded
          ? 'border-t border-border pt-5 mt-6'
          : 'rounded-card border border-border bg-background p-5',
        className
      )}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {t('account.checkout.title')}
          </h3>
          <p className="text-xs font-normal text-foreground-secondary mt-1 leading-relaxed">
            {t('account.checkout.description')}
            {masked && (
              <span className="inline-block ml-1 font-semibold text-foreground">
                ({masked})
              </span>
            )}
          </p>
        </div>

        <div className="pt-1">
          <label
            htmlFor="checkout-create-account-checkbox"
            className="flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-sm font-medium text-foreground"
          >
            <input
              id="checkout-create-account-checkbox"
              type="checkbox"
              checked={createAccountRequested}
              onChange={(e) => onToggleCreateAccount(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary focus-visible:ring-2 focus-visible:ring-ring cursor-pointer shrink-0"
            />
            <AccountRichTextConsent
              lang={lang}
              rawText={t('account.creation.consent')}
            />
          </label>
        </div>

        {creationStatus !== 'idle' && (
          <p
            role="status"
            className={cn(
              'flex items-start gap-2 text-xs leading-relaxed',
              creationStatus === 'failed'
                ? 'text-destructive font-medium'
                : creationStatus === 'created'
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
            )}
          >
            {creationStatus === 'pending' && <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" />}
            {creationStatus === 'created' && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {creationStatus === 'failed' && <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            <span>
              {creationStatus === 'pending'
                ? t('account.action.submitting')
                : creationStatus === 'created'
                  ? t('account.creation.success')
                  : t('account.creation.failed_non_blocking')}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};
