'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { HelpCircle } from 'lucide-react';

export function BookingFaqSection() {
  const { t } = useI18n();

  const faqItems = [
    {
      q: t('bm_faq_q1'),
      a: t('bm_faq_a1'),
    },
    {
      q: t('bm_faq_q2'),
      a: t('bm_faq_a2'),
    },
    {
      q: t('bm_faq_q3'),
      a: t('bm_faq_a3'),
    },
  ];

  return (
    <section className="bg-background rounded-card border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            {t('bm_faq_title')}
          </h3>
        </div>
      </div>

      {/* FAQ items list - Clean dividers, no box inside box */}
      <div className="divide-y divide-border">
        {faqItems.map((item, idx) => (
          <div key={idx} className="p-4 sm:p-5 space-y-1">
            <p className="font-semibold text-foreground text-xs">
              Q: {item.q}
            </p>
            <p className="text-foreground-secondary leading-relaxed text-xs pt-0.5">
              A: {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
