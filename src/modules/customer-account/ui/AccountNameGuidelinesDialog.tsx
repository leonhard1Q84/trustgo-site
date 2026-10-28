'use client';

import React from 'react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogTitle} from '@/shared/ui/dialog';

interface AccountNameGuidelinesDialogProps {
  lang: RouteLanguage;
  open: boolean;
  onClose: () => void;
}

export function AccountNameGuidelinesDialog({lang, open, onClose}: AccountNameGuidelinesDialogProps) {
  const {t} = useI18n(lang);

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="full" className="p-0 gap-0">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle>{t('account.name_guidelines.title')}</DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 text-body leading-relaxed text-foreground-secondary sm:px-6">
          <div className="mb-6 rounded-card border border-border bg-muted p-4">
            <p className="font-semibold text-foreground">{t('account.name_guidelines.summary')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-control border border-border bg-background p-3">
                <p className="text-caption text-foreground-secondary">{t('account.name_guidelines.surname_label')}</p>
                <p className="mt-1 font-semibold uppercase text-foreground">SMITH</p>
              </div>
              <div className="rounded-control border border-border bg-background p-3">
                <p className="text-caption text-foreground-secondary">{t('account.name_guidelines.given_names_label')}</p>
                <p className="mt-1 font-semibold uppercase text-foreground">MARY ISABELLE</p>
              </div>
            </div>
          </div>
          <section className="space-y-2">
            <h3 className="text-title font-semibold text-foreground">{t('account.name_guidelines.important_title')}</h3>
            <p>{t('account.name_guidelines.important_body')}</p>
          </section>
          <section className="mt-6 space-y-2">
            <h3 className="text-title font-semibold text-foreground">{t('account.name_guidelines.how_to_enter_title')}</h3>
            <p>{t('account.name_guidelines.how_to_enter_body')}</p>
          </section>
          <section className="mt-6 space-y-2">
            <h3 className="text-title font-semibold text-foreground">{t('account.name_guidelines.middle_name_title')}</h3>
            <p>{t('account.name_guidelines.middle_name_body')}</p>
          </section>
          <section className="mt-6 space-y-2">
            <h3 className="text-title font-semibold text-foreground">{t('account.name_guidelines.no_surname_title')}</h3>
            <p>{t('account.name_guidelines.no_surname_body')}</p>
          </section>
          <section className="mt-6 space-y-2">
            <h3 className="text-title font-semibold text-foreground">{t('account.name_guidelines.non_english_title')}</h3>
            <p>{t('account.name_guidelines.non_english_body')}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
