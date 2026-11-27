'use client';

import React, { useEffect, useState } from 'react';
import { Check, Lock, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/ui/utils';

export type PaymentProcessingPhase = 'idle' | 'processing' | 'succeeded';

interface PaymentProcessingDialogProps {
  phase: PaymentProcessingPhase;
  amount: number;
  currency: string;
  vehicleName?: string;
}

const STEP_KEYS = [
  'ck_pay_loading_step_verify',
  'ck_pay_loading_step_authorize',
  'ck_pay_loading_step_confirm',
] as const;

export function PaymentProcessingDialog({
  phase,
  amount,
  currency,
  vehicleName,
}: PaymentProcessingDialogProps) {
  const { t } = useI18n();
  const [processingStep, setProcessingStep] = useState(0);
  const open = phase !== 'idle';
  const isSucceeded = phase === 'succeeded';
  const activeStep = isSucceeded ? STEP_KEYS.length : phase === 'processing' ? processingStep : 0;

  useEffect(() => {
    if (phase !== 'processing') return;

    const step0Timer = window.setTimeout(() => setProcessingStep(0), 0);
    const step1Timer = window.setTimeout(() => setProcessingStep(1), 450);
    const step2Timer = window.setTimeout(() => setProcessingStep(2), 1000);
    return () => {
      window.clearTimeout(step0Timer);
      window.clearTimeout(step1Timer);
      window.clearTimeout(step2Timer);
    };
  }, [phase]);

  const currentAnnouncement = isSucceeded
    ? t('ck_pay_loading_success_title')
    : t(STEP_KEYS[Math.min(activeStep, STEP_KEYS.length - 1)]);

  return (
    <Dialog open={open}>
      <DialogContent
        variant="sheet"
        hideCloseButton
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="sm:max-w-md overflow-hidden"
      >
        <div className="px-6 pt-8 pb-[calc(1.75rem+env(safe-area-inset-bottom))] sm:py-8 flex flex-col items-center text-center">
          {/* Emblem: native indeterminate <progress> ring transitioning to confirmed check */}
          <div className="relative flex items-center justify-center w-16 h-16 mb-5">
            {isSucceeded ? (
              <div className="tg-payment-check-in flex items-center justify-center w-16 h-16 rounded-full bg-success-light border-2 border-success text-success">
                <Check className="w-7 h-7" strokeWidth={2.25} aria-hidden="true" />
              </div>
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="tg-payment-halo pointer-events-none absolute -inset-2 rounded-full bg-brand-light"
                />
                <progress
                  aria-label={t('ck_pay_loading_title')}
                  className="tg-payment-spinner relative z-10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-foreground"
                >
                  <Lock className="w-5 h-5" />
                </span>
              </>
            )}
          </div>

          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            {isSucceeded ? t('ck_pay_loading_success_title') : t('ck_pay_loading_title')}
          </DialogTitle>

          <DialogDescription className="mt-1.5 text-sm text-foreground-secondary">
            {isSucceeded ? (
              t('ck_pay_loading_success_desc')
            ) : (
              <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
                <span className="font-semibold text-foreground tabular-nums">
                  {currency}
                  {amount}
                </span>
                {vehicleName ? (
                  <>
                    <span aria-hidden="true" className="text-border-strong">
                      &middot;
                    </span>
                    <span className="truncate max-w-60">{vehicleName}</span>
                  </>
                ) : null}
              </span>
            )}
          </DialogDescription>

          {/* Subtle stepped status indicator */}
          <ol
            aria-label={t('ck_pay_loading_title')}
            className="mt-6 w-full max-w-xs space-y-2.5 text-left"
          >
            {STEP_KEYS.map((key, index) => {
              const isDone = isSucceeded || index < activeStep;
              const isCurrent = !isSucceeded && index === activeStep;
              return (
                <li
                  key={key}
                  className={cn(
                    'flex items-center gap-3 text-xs transition-colors duration-200',
                    isDone
                      ? 'text-foreground font-medium'
                      : isCurrent
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                      isDone
                        ? 'border-success bg-success-light text-success'
                        : isCurrent
                          ? 'border-primary bg-brand-light'
                          : 'border-border bg-background'
                    )}
                  >
                    {isDone ? (
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    ) : isCurrent ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                    )}
                  </span>
                  <span className="leading-snug">{t(key)}</span>
                </li>
              );
            })}
          </ol>

          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {currentAnnouncement}
          </p>

          {/* Footer reassurance */}
          <div className="mt-6 pt-4 w-full border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 shrink-0 text-success" aria-hidden="true" />
            <span>{t('ck_pay_loading_do_not_close')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
