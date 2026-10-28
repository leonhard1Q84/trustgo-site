'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BookingRecord } from '../domain/types';

interface BookingPoliciesAccordionProps {
  booking: BookingRecord;
}

export function BookingPoliciesAccordion({ booking }: BookingPoliciesAccordionProps) {
  const { t } = useI18n();
  const [openAccordions, setOpenAccordions] = useState<{
    policy: boolean;
    insurance: boolean;
    documents: boolean;
  }>({
    policy: true, // open by default
    insurance: false,
    documents: false,
  });

  const toggleAccordion = (key: 'policy' | 'insurance' | 'documents') => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const freeDeadlineText = booking.vehicle.cancellationFreeHours > 0
    ? t('rental_free_cancellation_hours').replace('{hours}', String(booking.vehicle.cancellationFreeHours))
    : t('ct_no_refund');

  return (
    <div className="bg-background rounded-card border border-border overflow-hidden divide-y divide-border">
      {/* ── Accordion 1: Cancellation Policy & Rules ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('policy')}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {t('bm_policy_cancel')}
            </span>
          </div>
          {openAccordions.policy ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openAccordions.policy && (
          <div className="px-4 pb-4 pt-1 text-xs text-foreground-secondary space-y-2 border-t border-border bg-muted/20">
            <div className="space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground font-semibold">
                    {booking.vehicle.cancellationFreeHours > 0 ? t('bm_policy_cancel_free') : t('ct_no_refund')}
                  </strong>{' '}
                  <span className="text-foreground font-semibold">
                    {freeDeadlineText}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {booking.vehicle.cancellationFreeHours > 0 ? t('ct_step_free_desc') : t('ct_no_refund')}
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground font-semibold">
                    {t('bm_policy_cancel_late')}
                  </strong>{' '}
                  <span>{t('bm_policy_cancel_late_desc').replace(/48/g, String(booking.vehicle.cancellationFreeHours))}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Accordion 2: Insurance Coverage & Security Deposit ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('insurance')}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {t('bm_policy_insurance')}
            </span>
          </div>
          {openAccordions.insurance ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openAccordions.insurance && (
          <div className="px-4 pb-4 pt-1 text-xs text-foreground-secondary space-y-2 border-t border-border bg-muted/20">
            <div className="space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground font-semibold">
                    {t('bm_policy_insurance_basic')}
                  </strong>{' '}
                  <span>
                    {booking.insurance.name} (Damage Excess: ${booking.insurance.damageExcess}).{' '}
                    {t('bm_policy_insurance_basic_desc')}
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>
                  <strong className="text-foreground font-semibold">
                    {t('bm_policy_insurance_deposit')}
                  </strong>{' '}
                  <span>
                    ${booking.vehicle.depositAmount} Hold. {t('bm_policy_insurance_deposit_desc')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Accordion 3: Driver License & Required Documents ── */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('documents')}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {t('bm_policy_docs')}
            </span>
          </div>
          {openAccordions.documents ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {openAccordions.documents && (
          <div className="px-4 pb-4 pt-1 text-xs text-foreground-secondary space-y-2 border-t border-border bg-muted/20">
            <p className="font-semibold text-foreground">
              {t('bm_policy_docs_intro')}
            </p>
            <ul className="list-disc pl-4 space-y-1 leading-relaxed text-[11px]">
              <li>{t('bm_policy_docs_passport')}</li>
              <li>{t('bm_policy_docs_license')}</li>
              <li>{t('bm_policy_docs_idp')}</li>
              <li>{t('bm_policy_docs_card')}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
