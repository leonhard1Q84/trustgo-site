'use client';

import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';

function PolicyText({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-title font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-3 text-body leading-relaxed text-foreground-secondary">
        {children}
      </div>
    </section>
  );
}

export function DriverRequirementsContent({ lang }: { lang: RouteLanguage }) {
  const { t } = useI18n(lang);
  return (
    <div className="space-y-8">
      <PolicyText title={t('ttk_driver_age_title')}>
        <p>{t('ttk_driver_age_desc')}</p>
      </PolicyText>
      <PolicyText title={t('ttk_driver_young_title')}>
        <p>{t('ttk_driver_young_desc')}</p>
      </PolicyText>
      <PolicyText title={t('ttk_driver_additional_title')}>
        <p>{t('ttk_driver_additional_desc')}</p>
      </PolicyText>
      <p className="text-body text-foreground-secondary">{t('ttk_driver_refusal_notice')}</p>
    </div>
  );
}

export function DepositRequirementsContent({
  lang,
  amount,
  depositAmount,
}: {
  lang: RouteLanguage;
  amount: string;
  depositAmount: number;
}) {
  const { t } = useI18n(lang);
  if (depositAmount === 0)
    return <p className="text-body text-foreground-secondary">{t('rd_no_deposit')}</p>;
  return (
    <div className="space-y-8">
      <PolicyText title={t('ttk_deposit_amount_title')}>
        <p>{t('ttk_deposit_amount_desc').replace('{amount}', amount)}</p>
      </PolicyText>
      <PolicyText title={t('ttk_deposit_card_title')}>
        <p>{t('ttk_deposit_card_desc')}</p>
      </PolicyText>
      <PolicyText title={t('ttk_deposit_debit_title')}>
        <p>{t('ttk_deposit_debit_desc')}</p>
      </PolicyText>
      <PolicyText title={t('ttk_deposit_timeline_title')}>
        <p>{t('rd_deposit_release')}</p>
      </PolicyText>
    </div>
  );
}

export function RentalRulesContent({
  lang,
  fuelTitle,
  fuelDescription,
  mileage,
  isJapan,
}: {
  lang: RouteLanguage;
  fuelTitle: string;
  fuelDescription: string;
  mileage: string;
  isJapan: boolean;
}) {
  const { t } = useI18n(lang);
  return (
    <div className="space-y-8">
      <PolicyText title={t('rd_pickup_return')}>
        <p>{t('rd_late_arrival')}</p>
        <p>{t('rd_early_late')}</p>
      </PolicyText>
      <PolicyText title={fuelTitle}>
        <p>{fuelDescription}</p>
      </PolicyText>
      <PolicyText title={t('ck_mileage')}>
        <p className="font-semibold text-foreground">{mileage}</p>
        <p>{t('rd_mileage_desc')}</p>
      </PolicyText>
      <PolicyText title={t('rd_tolls')}>
        <p>{t(isJapan ? 'ttk_rules_toll_desc' : 'rd_tolls_desc')}</p>
      </PolicyText>
    </div>
  );
}
