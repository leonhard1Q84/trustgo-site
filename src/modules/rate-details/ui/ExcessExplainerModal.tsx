'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from '@/shared/ui/dialog';

interface ExcessExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
  depositAmount?: number;
  lang?: RouteLanguage;
}

export function ExcessExplainerModal({
  isOpen,
  onClose,
  currency = '$',
  depositAmount = 300,
  lang = 'en',
}: ExcessExplainerModalProps) {
  const { t } = useI18n(lang);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="full" className="sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="bg-background">
          <div className="flex items-center gap-3 pr-6">
            <div className="w-9 h-9 rounded-control bg-muted text-foreground flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {t('ex_modal_title')}
              </DialogTitle>
              <p className="text-xs text-foreground-secondary mt-0.5">
                {t('ex_modal_subtitle')}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <DialogBody className="space-y-4 py-4 text-xs leading-relaxed">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-control bg-brand-light/60 border border-brand/20">
            <strong className="text-foreground text-xs sm:text-sm block mb-1">
              {t('ex_simple_words')}
            </strong>
            <p className="text-foreground-secondary">
              {t('ex_deductible_desc')}
            </p>
          </div>

          {/* Example 1: Excess $1,000 */}
          <div className="p-3.5 rounded-control border border-border bg-background space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{t('ex_example1_title')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-muted p-2 rounded-control">
                <span className="text-muted-foreground block">{t('ex_example1_damage')}</span>
                <span className="text-muted-foreground block">{t('ex_example1_excess')}</span>
              </div>
              <div className="bg-brand-light/40 p-2 rounded-control border border-brand/10">
                <span className="text-foreground font-bold block">{t('ex_example1_renter')}</span>
                <span className="text-primary font-bold block">{t('ex_example1_supplier')}</span>
              </div>
            </div>
          </div>

          {/* Example 2: Excess $0 */}
          <div className="p-3.5 rounded-control border border-border bg-background space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{t('ex_example2_title')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-muted p-2 rounded-control">
                <span className="text-muted-foreground block">{t('ex_example2_damage')}</span>
                <span className="text-muted-foreground block">{t('ex_example2_excess')}</span>
              </div>
              <div className="bg-success-light/40 p-2 rounded-control border border-success/20">
                <span className="text-success font-bold block">{t('ex_example2_renter')}</span>
                <span className="text-success font-bold block">{t('ex_example2_supplier')}</span>
              </div>
            </div>
          </div>

          {/* Important notes */}
          <div className="space-y-2 pt-1">
            <strong className="text-foreground block font-bold">
              {t('ex_important_notes_title')}
            </strong>
            <ul className="space-y-1.5 list-disc pl-4 text-foreground-secondary text-xs">
              <li>{t('ex_note_exclusions')}</li>
              <li>{t('ex_note_noc')}</li>
              <li>
                {t('ex_note_deposit')} ({currency}
                {depositAmount})
              </li>
            </ul>
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold transition-all shadow-raised cursor-pointer"
          >
            {t('ex_btn_understand')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
