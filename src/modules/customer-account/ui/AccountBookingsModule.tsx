'use client';

import React from 'react';
import { GuestBookingLink } from '@/modules/booking-management/public-api';
import { Calendar, Search, ArrowRight } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';

interface AccountBookingsModuleProps {
  lang: RouteLanguage;
  customerEmail?: string;
}

export const AccountBookingsModule: React.FC<AccountBookingsModuleProps> = ({ lang }) => {
  const { t } = useI18n(lang);

  return (
    <div className="rounded-card border border-border bg-background p-6 shadow-xs text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-control bg-brand-light text-primary">
        <Calendar className="h-6 w-6" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-bold text-foreground">
          {lang === 'zh' ? '預訂管理' : 'Manage Your Reservations'}
        </h3>
        <p className="text-xs text-foreground-secondary leading-relaxed">
          {t('bm_empty_hint_tab')}
        </p>
      </div>
      <div className="pt-2">
        <GuestBookingLink
          href={`/${lang}/manage-booking/orders`}
          className="inline-flex items-center gap-2 rounded-control bg-primary text-primary-foreground hover:bg-primary-strong px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{t('nav_manage_booking')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </GuestBookingLink>
      </div>
    </div>
  );
};

export default AccountBookingsModule;
