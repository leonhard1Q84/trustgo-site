'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { BookingRecord, CancellationEstimate } from '../domain/types';
import { RentalError } from '@/modules/reservation/domain/validation';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useI18n } from '@/i18n/useI18n';
import { canCancelBooking } from '../domain/lifecycle';
import { cancelBooking, getCancellationEstimate, getBookingByConfirmationCode } from '../application/booking-store';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord;
  onCancelled: (updatedBooking: BookingRecord) => void;
}

const REASONS = ['bm_reason_plans', 'bm_reason_price', 'bm_reason_transport', 'bm_reason_mistake', 'bm_reason_emergency', 'bm_reason_other'] as const;

export function CancellationModal({ isOpen, onClose, booking, onCancelled }: CancellationModalProps) {
  const { t, routeLang } = useI18n();
  const reasonId = useId();
  const [selectedReason, setSelectedReason] = useState<string>(REASONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<CancellationEstimate | null>(null);
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const requestId = useRef('');
  const submitting = useRef(false);
  const revision = useRef(0);
  const opener = useRef<HTMLElement | null>(null);
  const checking = ['processing', 'unknown'].includes(booking.paymentStatus ?? '');
  const unpaid = !checking && booking.paymentStatus !== 'paid';
  const cancellable = canCancelBooking(booking);

  const loadEstimate = useCallback(async () => {
    const current = ++revision.current;
    setEstimate(null);
    setErrorCode('');
    setLoading(true);
    try {
      const value = await getCancellationEstimate(booking.confirmationCode);
      if (current === revision.current) setEstimate(value);
    } catch (error) {
      if (current === revision.current) setErrorCode(error instanceof RentalError ? error.code : 'service_unavailable');
    } finally {
      if (current === revision.current) setLoading(false);
    }
  }, [booking.confirmationCode]);

  useEffect(() => {
    if (isOpen) {
      requestId.current = '';
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the server estimate when opening the confirmation
      void loadEstimate();
    }
    return () => { revision.current += 1; };
  }, [isOpen, loadEstimate]);

  const handleConfirm = async () => {
    if (!estimate || submitting.current || !cancellable) return;
    submitting.current = true;
    setIsSubmitting(true);
    setErrorCode('');
    try {
      requestId.current ||= crypto.randomUUID();
      const updated = await cancelBooking(booking.confirmationCode, selectedReason, estimate.version, requestId.current);
      onCancelled(updated);
      onClose();
    } catch (error) {
      const current = await getBookingByConfirmationCode(booking.confirmationCode).catch(() => null);
      if (current?.status === 'CANCELLED') {
        onCancelled(current);
        onClose();
        return;
      }
      if (current) onCancelled(current);
      setEstimate(null);
      setErrorCode(error instanceof RentalError ? error.code : 'service_unavailable');
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const money = (amount: number) => new Intl.NumberFormat(routeLang === 'zh' ? 'zh-Hant' : routeLang, {
    style: 'currency', currency: estimate?.currency ?? booking.pricing.currency,
  }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open && !submitting.current) onClose(); }}>
      <DialogContent variant="sheet" hideCloseButton className="overflow-hidden"
        onOpenAutoFocus={() => { opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }}
        onCloseAutoFocus={event => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus(); }}>
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            {t(checking ? 'ck_hold_checking_title' : unpaid ? 'ck_cancel_unpaid_title' : 'bm_cancel_title')}
          </DialogTitle>
          <DialogDescription className="text-body">{t(checking ? 'ck_hold_checking_desc' : unpaid ? 'ck_cancel_unpaid_desc' : 'ck_cancel_paid_desc')}</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5 text-body">
          <p className="break-all font-mono text-caption text-muted-foreground">{booking.confirmationCode}</p>
          {loading && <p role="status">{t('ck_cancel_loading')}</p>}
          {estimate && (
            <dl className="space-y-3">
              {[
                ['bm_paid_amount', estimate.paidAmount],
                ['bm_penalty_fee', estimate.penaltyAmount],
                ['bm_refund_amount', estimate.refundAmount],
              ].map(([label, amount]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <dt>{t(String(label))}</dt><dd className="font-semibold tabular-nums">{money(Number(amount))}</dd>
                </div>
              ))}
            </dl>
          )}
          {errorCode && <p role="alert" className="text-destructive">{t(`rental_${errorCode}`)}</p>}
          {!cancellable && <p role="status">{t('rental_order_not_cancellable')}</p>}
          {!estimate && !loading && cancellable && (
            <Button variant="secondary" onClick={() => void loadEstimate()}>{t('ck_cancel_retry')}</Button>
          )}
          <div>
            <label htmlFor={reasonId} className="mb-2 block font-semibold">{t('ck_cancel_reason')}</label>
            <select id={reasonId} value={selectedReason} disabled={isSubmitting}
              onChange={event => setSelectedReason(event.target.value)}
              className="h-12 w-full rounded-control border border-input bg-background px-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {REASONS.map(key => <option key={key} value={key}>{t(key)}</option>)}
            </select>
          </div>
        </DialogBody>
        <DialogFooter className="flex-wrap bg-background">
          <Button variant="secondary" disabled={isSubmitting} onClick={onClose} className="h-auto min-h-12 flex-1 whitespace-normal">
            {t(cancellable ? 'ck_cancel_keep' : 'ck_cancel_close')}
          </Button>
          <Button variant="secondary" onClick={handleConfirm} disabled={isSubmitting || !estimate || !cancellable}
            className="h-auto min-h-12 flex-1 gap-2 whitespace-normal border-destructive bg-destructive text-white hover:bg-destructive">
            {isSubmitting && <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />}
            {t(isSubmitting ? 'bm_processing' : 'bm_confirm_cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
