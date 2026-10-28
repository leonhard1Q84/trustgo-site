'use client';

import { useState } from 'react';
import { UserCheck, CreditCard, IdCard, FileText, AlertCircle } from 'lucide-react';
import { IdpSampleDrawer } from '@/modules/identity-verification/public-api';
import { getStoreByCode } from '@/modules/destination-search/store-directory';
import { type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import type { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import type { CancellationPolicy, RentalTripDetails } from '../domain/types';

export type CitizenTab = 'non_local' | 'local';
export type ThingsToKnowTab = 'docs' | 'driver' | 'deposit' | 'rules';

export interface ThingsToKnowSectionProps {
  depositAmount?: number;
  currency?: string;
  lang?: RouteLanguage;
  licenseCountry?: string;
  cancellationPolicy?: CancellationPolicy;
  supplierName?: string;
  trip?: RentalTripDetails;
  vehicle?: FleetVehicle;
}

const originIds: Record<string, string> = {
  HK: 'hong-kong',
  TW: 'taiwan',
  CN: 'china-mainland',
  US: 'united-states',
  KR: 'korea',
  DE: 'germany',
  FR: 'germany',
  CH: 'germany',
};

function VisaLogo() {
  return (
    <svg
      className="h-3.5 w-auto"
      viewBox="0 0 36 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Visa"
    >
      <path
        d="M14.6 0.3L9.6 11.7H6.3L3.8 2.5C3.7 2 3.5 1.6 3.1 1.4C2.4 1 1.2 0.7 0.1 0.4L0.2 0.3H5.5C6.2 0.3 6.8 0.8 7 1.6L8.3 8.3L11.5 0.3H14.6ZM27.4 8C27.4 5 23.2 4.8 23.2 3.4C23.2 2.9 23.7 2.4 24.8 2.2C25.3 2.1 26.8 2.1 28.4 2.8L29 0.7C28.2 0.4 27.1 0.1 25.8 0.1C22.6 0.1 20.3 1.8 20.3 4.2C20.3 6 21.9 7 23.2 7.6C24.4 8.2 24.8 8.6 24.8 9.2C24.8 10.1 23.7 10.5 22.7 10.5C21.1 10.5 20.2 10.2 19.5 9.9L18.9 12.1C19.7 12.5 21.1 12.8 22.5 12.8C25.9 12.8 28.2 11.1 28.2 8.4L27.4 8ZM35.6 11.7H38.3L35.8 0.3H33.4C32.8 0.3 32.3 0.6 32.1 1.2L27.4 11.7H30.6L31.2 10H35.2L35.6 11.7ZM32.1 7.7L33.7 3.3L34.6 7.7H32.1ZM19.6 0.3L17.1 11.7H14.1L16.6 0.3H19.6Z"
        fill="#1A1F71"
      />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Mastercard">
      <svg
        className="h-4.5 w-auto"
        viewBox="0 0 28 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="10" r="8" fill="#EB001B" />
        <circle cx="19" cy="10" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
      <span className="font-sans text-caption font-bold text-foreground">Mastercard</span>
    </div>
  );
}

function JcbLogo() {
  return (
    <svg
      className="h-4 w-auto"
      viewBox="0 0 32 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JCB"
    >
      <rect x="0" y="0" width="10" height="14" rx="2" fill="#0C419A" />
      <rect x="11" y="0" width="10" height="14" rx="2" fill="#D61B23" />
      <rect x="22" y="0" width="10" height="14" rx="2" fill="#007940" />
      <text
        x="5"
        y="10.5"
        fill="white"
        fontSize="9"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        J
      </text>
      <text
        x="16"
        y="10.5"
        fill="white"
        fontSize="9"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        C
      </text>
      <text
        x="27"
        y="10.5"
        fill="white"
        fontSize="9"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        B
      </text>
    </svg>
  );
}

export function ThingsToKnowSection({
  depositAmount = 300,
  currency = '$',
  lang = 'en',
  licenseCountry,
  trip,
  vehicle,
}: ThingsToKnowSectionProps) {
  const { t } = useI18n(lang);
  const [showSamples, setShowSamples] = useState(false);

  const isJapan = Boolean(
    trip?.pickupStoreCode && getStoreByCode(trip.pickupStoreCode)?.marketCode === 'JP'
  );

  const [citizenTab, setCitizenTab] = useState<CitizenTab>(
    licenseCountry?.toUpperCase() === 'JP' ? 'local' : 'non_local'
  );

  const formattedDeposit = `${vehicle?.currency ?? currency}${new Intl.NumberFormat(
    lang === 'zh' ? 'zh-Hant' : lang
  ).format(vehicle?.depositAmount ?? depositAmount)}`;

  return (
    <section
      className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-12 space-y-10"
      aria-labelledby="things-to-know-heading"
    >
      {/* ── Section Title ── */}
      <div className="flex items-center gap-2.5">
        <FileText className="h-6 w-6 text-foreground shrink-0" aria-hidden="true" />
        <h2
          id="things-to-know-heading"
          className="text-h3 font-semibold text-foreground tracking-tight md:text-h2"
        >
          {t('rd_important')}
        </h2>
      </div>

      {/* ── 1. Driver Age & Experience ── */}
      <div className="border-b border-border pb-8">
        <div className="flex items-center gap-2 text-title font-semibold text-foreground">
          <UserCheck className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_driver_age_title')}</h3>
        </div>
        <p className="mt-2 text-body text-foreground-secondary leading-relaxed pl-7">
          {t('rd_driver_age_rule_desc')}
        </p>
      </div>

      {/* ── 2. Required Documents for Pick-up ── */}
      <div className="border-b border-border pb-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-title font-semibold text-foreground">
            <IdCard className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
            <h3>{t('rd_pickup_docs_header')}</h3>
          </div>

          {/* Clean Segmented Control Switcher */}
          <div className="inline-flex rounded-control border border-border bg-muted p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCitizenTab('non_local')}
              className={`rounded-control px-3.5 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                citizenTab === 'non_local'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              {t('rd_tab_non_local')}
            </button>
            <button
              type="button"
              onClick={() => setCitizenTab('local')}
              className={`rounded-control px-3.5 py-1.5 text-caption font-semibold transition-colors cursor-pointer ${
                citizenTab === 'local'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              {t('rd_tab_local')}
            </button>
          </div>
        </div>

        {citizenTab === 'non_local' ? (
          /* Non-Local Citizen Content */
          <div className="pl-0 sm:pl-7 space-y-6">
            {/* Identity Document */}
            <div className="space-y-1">
              <p className="text-body font-semibold text-foreground">
                {t('rd_id_proof_title')}
              </p>
              <p className="text-caption text-foreground-secondary leading-relaxed">
                {t('rd_id_non_local_desc')}
              </p>
            </div>

            {/* Driver's License Combinations */}
            <div className="space-y-4">
              <div>
                <p className="text-body font-semibold text-foreground">
                  {t('rd_license_proof_title')}
                </p>
                <p className="mt-1 text-caption text-foreground-secondary leading-relaxed">
                  {t('rd_license_non_local_intro')}
                </p>
              </div>

              <div className="space-y-4 divide-y divide-border pt-1">
                {/* Combination 1: 1949 IDP */}
                <div className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-body font-medium text-foreground">
                      ① {t('rd_idp_card_title')}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowSamples(true)}
                      className="shrink-0 h-7 px-3 text-caption font-semibold"
                    >
                      {t('rd_idp_sample_btn')}
                    </Button>
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    {t('rd_idp_card_desc')}
                  </p>
                </div>

                {/* Combination 2: Official Translation */}
                <div className="pt-3 space-y-1">
                  <p className="text-body font-medium text-foreground">
                    ② {t('rd_translation_card_title')}
                  </p>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    {t('rd_translation_card_desc')}
                  </p>
                </div>

                {/* Warning: Mainland China Licenses */}
                {isJapan && (
                  <div className="pt-3 flex items-start gap-2 text-caption leading-relaxed">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-warning" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-warning-strong">
                        {t('rd_mainland_notice_title')}：
                      </span>
                      <span className="text-foreground-secondary">
                        {t('rd_mainland_notice_desc')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Local Citizen Content */
          <div className="pl-0 sm:pl-7 space-y-5">
            <div className="space-y-1">
              <p className="text-body font-semibold text-foreground">{t('rd_id_proof_title')}</p>
              <p className="text-caption text-foreground-secondary leading-relaxed">
                {t('rd_id_local_desc')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-body font-semibold text-foreground">{t('rd_local_license_full_title')}</p>
              <p className="text-caption text-foreground-secondary leading-relaxed">
                {t('rd_local_license_full_desc')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Deposit & Payment Methods (Flat Two-Column Grid, Clean & Breathable) ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-title font-semibold text-foreground">
          <CreditCard className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
          <h3>{t('rd_payment_and_deposit_title')}</h3>
        </div>

        <div className="pl-0 sm:pl-7 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Column 1: Accepted Credit Cards + Logos */}
          <div className="space-y-3">
            <p className="text-body font-semibold text-foreground">
              {t('rd_accepted_cards_title')}
            </p>
            <p className="text-caption text-foreground-secondary leading-relaxed">
              {t('rd_accepted_cards_desc')}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <div className="flex h-8 items-center justify-center rounded-control border border-border bg-background px-3 shadow-xs">
                <VisaLogo />
              </div>
              <div className="flex h-8 items-center justify-center rounded-control border border-border bg-background px-3 shadow-xs">
                <MastercardLogo />
              </div>
              <div className="flex h-8 items-center justify-center rounded-control border border-border bg-background px-3 shadow-xs">
                <JcbLogo />
              </div>
            </div>
          </div>

          {/* Column 2: Security Deposit Preauthorization */}
          <div className="space-y-3">
            <p className="text-body font-semibold text-foreground">
              {t('rd_deposit_box_title')}
            </p>
            <p className="text-caption text-foreground-secondary leading-relaxed">
              {t('rd_deposit_box_desc').replace('{amount}', formattedDeposit)}
            </p>
            <p className="text-caption text-muted-foreground leading-relaxed">
              {t('rd_deposit_release')}
            </p>
          </div>
        </div>
      </div>

      {/* IDP Sample Drawer */}
      <IdpSampleDrawer
        isOpen={showSamples}
        onClose={() => setShowSamples(false)}
        lang={lang}
        initialOriginId={originIds[(licenseCountry ?? '').toUpperCase()]}
      />
    </section>
  );
}

export const ImportantRentalTerms = ThingsToKnowSection;
