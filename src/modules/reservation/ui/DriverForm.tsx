'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Mail, Phone, Plane, Globe, ShieldAlert } from 'lucide-react';
import { DriverDetails } from '../domain/types';
import { COUNTRIES_LIST } from '@/modules/rental-search/domain/countries';
import { normalizeLicenseCountry } from '../domain/validation';

interface DriverFormProps {
  driver: DriverDetails;
  onChange: (updated: DriverDetails) => void;
  footer?: React.ReactNode;
}

export function DriverForm({ driver, onChange, footer }: DriverFormProps) {
  const { t } = useI18n();
  const handleChange = (field: keyof DriverDetails, value: string) => {
    onChange({ ...driver, [field]: value });
  };

  const handleAdditionalDriverToggle = (enabled: boolean) => {
    onChange({
      ...driver,
      additionalDriver: {
        enabled,
        fullName: enabled ? driver.additionalDriver?.fullName || '' : '',
      },
    });
  };

  return (
    <div className="bg-background rounded-card p-6 sm:p-7 border border-border space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">{t('df_main_driver')}</h2>
        </div>
        <p className="text-xs text-foreground-secondary mt-1">{t('df_subtitle')}</p>
      </div>

      {/* Trust Notice regarding Last Name & Guest Lookup */}
      <div className="p-3.5 rounded-control bg-brand-light/60 border border-brand/20 flex items-start gap-2.5 text-xs text-foreground">
        <ShieldAlert className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
        <div>
          <span>
            <strong>{t('df_guest_access')}</strong> {t('df_guest_your')}{' '}
            <strong>{t('df_last_name')}</strong> {t('df_guest_and')}{' '}
            <strong>{t('df_confirm_code')}</strong> {t('df_guest_tail')}
          </span>
        </div>
      </div>

      {/* Driver Form Fields */}
      <div className="space-y-4">
        {/* Title & Names */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Title */}
          <div className="sm:col-span-3">
            <label
              htmlFor="driver-title"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_title')}
            </label>
            <select
              id="driver-title"
              name="title"
              value={driver.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full h-11 px-3 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
            >
              <option value="Mr">Mr.</option>
              <option value="Ms">Ms.</option>
              <option value="Dr">Dr.</option>
            </select>
          </div>

          {/* First Name */}
          <div className="sm:col-span-4">
            <label
              htmlFor="driver-firstName"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_first_name_label')} <span className="text-warm-strong">*</span>
            </label>
            <input
              id="driver-firstName"
              name="firstName"
              autoComplete="given-name"
              maxLength={80}
              type="text"
              required
              placeholder={t('df_first_name_ph')}
              value={driver.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full h-11 px-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
            />
          </div>

          {/* {t('df_last_name')} */}
          <div className="sm:col-span-5">
            <label
              htmlFor="driver-lastName"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_last_name_label')} <span className="text-warm-strong">*</span>
            </label>
            <input
              id="driver-lastName"
              name="lastName"
              autoComplete="family-name"
              maxLength={80}
              type="text"
              required
              placeholder={t('df_last_name_ph')}
              value={driver.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full h-11 px-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Contact: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Email */}
          <div>
            <label
              htmlFor="driver-email"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_email_label')} <span className="text-warm-strong">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="driver-email"
                name="email"
                autoComplete="email"
                maxLength={254}
                type="email"
                required
                placeholder={t('df_email_ph')}
                value={driver.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="driver-phone"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_phone_label')} <span className="text-warm-strong">*</span>
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <input
                  id="driver-phoneCountryCode"
                  name="phoneCountryCode"
                  aria-label={t('bv_phone_country_code')}
                  autoComplete="tel-country-code"
                  inputMode="tel"
                  required
                  pattern="\+[0-9]{1,4}"
                  type="text"
                  placeholder="+1"
                  value={driver.phoneCountryCode}
                  onChange={(e) => handleChange('phoneCountryCode', e.target.value)}
                  className="w-full h-11 px-2.5 text-center rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
                />
              </div>
              <div className="col-span-8 relative flex items-center">
                <Phone className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  id="driver-phone"
                  name="phone"
                  autoComplete="tel-national"
                  inputMode="tel"
                  maxLength={32}
                  type="tel"
                  required
                  placeholder={t('df_phone_ph')}
                  value={driver.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full h-11 pl-9 pr-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* License Country & Flight Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* License Country */}
          <div>
            <label
              htmlFor="driver-licenseCountry"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_license_country_label')} <span className="text-warm-strong">*</span>
            </label>
            <div className="relative flex items-center">
              <Globe className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <select
                id="driver-licenseCountry"
                name="licenseCountry"
                value={normalizeLicenseCountry(driver.licenseCountry)}
                onChange={(e) => handleChange('licenseCountry', e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all"
              >
                {COUNTRIES_LIST.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Flight Number */}
          <div>
            <label
              htmlFor="driver-flightNumber"
              className="block text-xs font-bold text-muted-foreground mb-1.5"
            >
              {t('df_flight_label')}
            </label>
            <div className="relative flex items-center">
              <Plane className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="driver-flightNumber"
                name="flightNumber"
                maxLength={16}
                pattern="[A-Za-z0-9 \-]{2,16}"
                type="text"
                placeholder={t('df_flight_ph')}
                value={driver.flightNumber || ''}
                onChange={(e) => handleChange('flightNumber', e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-control border border-border bg-muted focus:bg-background focus:border-brand text-base font-medium text-foreground focus:outline-none transition-all "
              />
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">{t('df_flight_hint')}</span>
          </div>
        </div>

        {/* Additional Driver Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(driver.additionalDriver?.enabled)}
              onChange={(e) => handleAdditionalDriverToggle(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-border focus:ring-ring"
            />
            <span className="text-xs font-bold text-foreground">
              {t('df_additional_driver_toggle')}
            </span>
          </label>

          {driver.additionalDriver?.enabled && (
            <div className="mt-3 p-4 rounded-control bg-muted border border-border">
              <label
                htmlFor="driver-additionalDriver"
                className="block text-xs font-bold text-muted-foreground mb-1.5"
              >
                {t('df_additional_driver_name')}
              </label>
              <input
                type="text"
                required
                placeholder={t('df_full_name_hint')}
                id="driver-additionalDriver"
                name="additionalDriver"
                maxLength={160}
                value={driver.additionalDriver.fullName || ''}
                onChange={(e) =>
                  onChange({
                    ...driver,
                    additionalDriver: {
                      enabled: true,
                      fullName: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-control border border-border bg-background text-base font-medium text-foreground focus:outline-none focus:border-brand"
              />
            </div>
          )}
        </div>
      </div>

      {footer}
    </div>
  );
}
