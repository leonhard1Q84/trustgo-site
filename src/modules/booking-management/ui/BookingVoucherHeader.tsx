'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Copy, Check, Printer, ShieldCheck, XCircle, AlertCircle, Info } from 'lucide-react';
import { BookingRecord } from '../domain/types';
import { canCancelBooking } from '../domain/lifecycle';
import { bookingStatusKey, hasFreeCancellation } from '../domain/status-presentation';

interface BookingVoucherHeaderProps {
  booking: BookingRecord;
  onOpenCancelModal: () => void;
}

export function BookingVoucherHeader({ booking, onOpenCancelModal }: BookingVoucherHeaderProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.confirmationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* A denied copy must not be reported as successful. */ }
  };

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className="bg-background rounded-card border border-border p-4 sm:p-5 mb-5">
      {/* Top Bar: Status Badge, Confirmation Code, and Key Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                isCancelled
                  ? 'bg-destructive-light text-destructive'
                  : 'bg-success-light text-success'
              }`}
            >
              {isCancelled ? (
                <XCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{t(bookingStatusKey(booking))}</span>
            </span>

          </div>

          <div className="flex items-center gap-2.5 pt-0.5">
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {booking.confirmationCode}
            </h1>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover bg-brand-light px-2 py-1 rounded-control transition-colors cursor-pointer"
              title={t('bm_copy_code')}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-control border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-foreground-secondary" />
            <span>{t('bm_print_voucher')}</span>
          </button>

          {canCancelBooking(booking) && (
            <button
              onClick={onOpenCancelModal}
              className="px-3.5 py-2 rounded-control border border-border bg-background hover:bg-muted text-foreground-secondary hover:text-destructive font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('bm_cancel_reservation')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Free cancellation reassurance tag */}
      {hasFreeCancellation(booking) && (
        <div className="mt-3.5 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-foreground-secondary">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span>{t('rental_free_cancellation_hours').replace('{hours}', String(booking.vehicle.cancellationFreeHours))}</span>
        </div>
      )}

      {/* Cancellation Banner if cancelled */}
      {isCancelled && booking.cancellation && (
        <div className="mt-4 p-3.5 rounded-control bg-destructive-light border border-destructive/20 flex items-start gap-2.5 text-xs text-destructive">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold mb-0.5">
              Booking Cancelled on {new Date(booking.cancellation.cancelledAt).toLocaleDateString()}
            </strong>
            <p className="leading-relaxed text-destructive/90">
              {t(booking.cancellation.reason)}. {t(`rental_refund_${booking.refundStatus ?? 'not_required'}`)}{' '}
              <strong>{booking.pricing.currency}{booking.cancellation.refundAmount}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
