'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import type { BookingRecord } from '@/modules/booking-management/domain/types';
import { formatHoldTime, holdSeconds } from '@/modules/booking-management/domain/pending-checkout';

interface RateLockHoldBannerProps {
  booking: BookingRecord;
  onCancel: () => void;
  canCancel: boolean;
  errorCode?: string;
}

export function RateLockHoldBanner({ booking, onCancel, canCancel, errorCode }: RateLockHoldBannerProps) {
  const { t, routeLang } = useI18n();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = holdSeconds(booking.paymentDeadline, now);
  const checking = Boolean(errorCode) || ['processing', 'unknown'].includes(booking.paymentStatus ?? '')
    || (booking.status === 'PENDING_PAYMENT' && booking.paymentStatus !== 'paid' && seconds === 0);
  const paid = booking.paymentStatus === 'paid' && booking.status !== 'CANCELLED';
  const cancelled = booking.status === 'CANCELLED';
  const expired = !paid && !checking && cancelled && booking.closureReason === 'payment_timeout';
  const active = booking.status === 'PENDING_PAYMENT' && !paid && !checking && !expired;
  const urgent = active && seconds <= 180;
  const state = checking ? 'checking' : cancelled ? (expired ? 'expired' : 'cancelled') : paid ? 'paid' : expired ? 'expired' : null;
  const Icon = paid ? CheckCircle2 : expired || urgent ? AlertTriangle : Timer;

  return (
    <section aria-label={t('ck_hold_expires')} className={`mb-8 rounded-card border border-l-4 p-4 sm:p-6 ${
      paid ? 'border-success/30 border-l-success bg-success-light'
        : cancelled && !expired ? 'border-border-strong bg-muted'
          : expired ? 'border-destructive/30 border-l-destructive bg-destructive-light'
            : 'border-warning/30 border-l-warning bg-warning-light'
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Icon className={`mt-0.5 size-6 shrink-0 ${paid ? 'text-success' : expired ? 'text-destructive' : 'text-warning'}`} aria-hidden="true" />
          <div className="min-w-0 text-body">
            <h2 className="text-title font-semibold" aria-live="polite">
              {state ? t(`ck_hold_${state}_title`) : t(urgent ? 'ck_hold_warning' : 'ck_hold_cta')}
            </h2>
            <p className="mt-1 text-foreground-secondary">{errorCode ? t(`rental_${errorCode}`) : cancelled && booking.paymentStatus === 'paid'
              ? t(`rental_refund_${booking.refundStatus ?? 'not_required'}`) : state ? t(`ck_hold_${state}_desc`) : t('ck_hold_vehicle_reserved')}</p>
          </div>
        </div>
        {active && (
          <div className="w-full border-t border-warning/20 pt-3 sm:w-auto sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-caption text-foreground-secondary">{t('ck_hold_expires')}</p>
            <span className="mt-1 block font-mono text-h2 font-semibold tabular-nums text-warning lg:text-h2-desktop" role="timer" aria-live="off" suppressHydrationWarning>
              {formatHoldTime(seconds)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        {state && (
          <Button asChild variant="secondary" className="h-auto min-h-11 whitespace-normal px-4 py-2">
            <Link href={expired || cancelled ? `/${routeLang}/rent` : `/${routeLang}/booking/${booking.confirmationCode}`}>
              {t(expired || cancelled ? 'ck_hold_search' : 'ck_hold_view')}
            </Link>
          </Button>
        )}
        {canCancel && <Button variant="text" className="h-auto min-h-11 whitespace-normal px-2 py-2" onClick={onCancel}>{t('bm_cancel_reservation')}</Button>}
      </div>
    </section>
  );
}
