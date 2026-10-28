'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import {
  Building2,
  Phone,
  Copy,
  Check,
  Headphones,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { BookingRecord } from '../domain/types';
import { paymentStatusKey } from '../domain/status-presentation';
import { buildDepotStoreInfo } from '@/modules/rate-details/domain/depot-info';

interface BookingDetailsSidebarProps {
  booking: BookingRecord;
}

export function BookingDetailsSidebar({ booking }: BookingDetailsSidebarProps) {
  const { t } = useI18n();
  const [copiedPhone, setCopiedPhone] = useState(false);

  const { pricing, vehicle, insurance, trip, status } = booking;
  const storePhone = buildDepotStoreInfo(vehicle.supplier.name, trip.pickupLocation,
    vehicle.supplier.locationType, trip.pickupStoreCode).phone;
  const isCancelled = status === 'CANCELLED';

  const handleCopyPhone = async () => {
    if (!storePhone) return;
    try {
      await navigator.clipboard.writeText(storePhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch { /* Clipboard access may be denied; keep the visible number available. */ }
  };

  const handleOpenLiveChat = () => {
    window.location.href = `mailto:support@trustgorental.com?subject=Inquiry%20for%20Booking%20${booking.confirmationCode}`;
  };

  const dailyRate = Math.round(pricing.baseRentalSubtotal / Math.max(1, trip.rentalDays));

  return (
    <div className="space-y-3.5">
      {/* ── 1. Contact Operator & Customer Support ── */}
      <section className="bg-background rounded-card border border-border overflow-hidden divide-y divide-border">
        {/* Branch Phone Row */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-medium text-muted-foreground block">
                {t('bm_contact_branch')}
              </span>
              <p className="text-xs font-bold text-foreground truncate">
                {trip.pickupLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={storePhone ? `tel:${storePhone.replace(/[^0-9+]/g, '')}` : undefined}
              className="inline-flex items-center gap-1 rounded-control bg-muted/60 border border-border px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors tabular-nums"
            >
              <Phone className="w-3 h-3 text-muted-foreground" />
              <span>{storePhone || '—'}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyPhone}
              disabled={!storePhone}
              title={t('bm_copy_code')}
              className="rounded-control border border-border bg-background p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {copiedPhone ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Live Chat Row */}
        <button
          type="button"
          onClick={handleOpenLiveChat}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-muted/40 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Headphones className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-muted-foreground block">
                {t('bm_contact_service')}
              </span>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {t('bm_live_chat')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </section>

      {/* ── 2. Price Details Breakdown ── */}
      <section className="bg-background rounded-card border border-border overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {t('bv_payment_breakdown')}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isCancelled
                ? 'bg-destructive-light text-destructive'
                : 'bg-success-light text-success'
            }`}
          >
            {t(paymentStatusKey(booking))}
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          {/* Car Rental Fee Breakdown */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>{t('bm_daily_rate_calc')}</span>
              <span className="tabular-nums">
                {pricing.currency}
                {pricing.baseRentalSubtotal}
              </span>
            </div>

            <div className="space-y-1 text-xs text-foreground-secondary">
              <div className="flex items-center justify-between">
                <span>
                  {pricing.currency}
                  {dailyRate} &times; {trip.rentalDays} {t('bm_days')}
                </span>
                <span className="font-medium text-foreground tabular-nums">
                  {pricing.currency}
                  {pricing.baseRentalSubtotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{vehicle.mileagePolicy}</span>
                <span className="font-medium text-foreground">
                  {t('bm_included')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('bv_taxes_fees')}</span>
                <span className="font-medium text-foreground tabular-nums">
                  {pricing.currency}
                  {pricing.taxesAndFees}
                </span>
              </div>
            </div>
          </div>

          {/* Protection Package Block */}
          <div className="border-t border-border pt-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>{t('bm_protection_package')}</span>
              <span className="text-foreground font-semibold">
                {pricing.insuranceSubtotal === 0
                  ? t('bm_included')
                  : `${pricing.currency}${pricing.insuranceSubtotal}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-foreground-secondary">
              <span>{t(`ic_pkg_${insurance.id === 'zero-excess' ? 'zero' : insurance.id}_name`)}</span>
              <span className="font-medium text-foreground">
                {t('bm_included')}
              </span>
            </div>
          </div>

          {/* Special Equipment if any */}
          {pricing.equipmentSubtotal > 0 && (
            <div className="border-t border-border pt-3 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>{t('bv_addon_equipment')}</span>
              <span className="tabular-nums">
                {pricing.currency}
                {pricing.equipmentSubtotal}
              </span>
            </div>
          )}

          {/* Pre-auth & Payment Details */}
          <div className="rounded-control bg-muted/40 border border-border p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-foreground-secondary">
              <span>{t('bv_counter_preauth')}</span>
              <span className="font-semibold text-foreground tabular-nums">
                {pricing.currency}
                {vehicle.depositAmount} Hold
              </span>
            </div>
            <div className="flex items-center justify-between text-foreground-secondary">
              <span>{t('bv_txn_ref')}</span>
              <span className="font-mono text-foreground text-[11px] truncate max-w-[140px]">
                {booking.paymentTransactionId ? `•••• ${booking.paymentTransactionId.slice(-4)}` : '—'}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t border-border pt-3 flex items-baseline justify-between">
            <span className="text-xs font-bold text-foreground">
              {t('bv_total_paid')}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-foreground tabular-nums">
              {pricing.currency}
              {booking.paidAmount ?? 0}
            </span>
          </div>

          {/* 256-bit SSL Security Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground border-t border-border">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>{t('bm_security_ssl')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
