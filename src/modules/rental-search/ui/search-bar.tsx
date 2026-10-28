'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/utils';
import { getDefaultLicenseCountry } from '../domain/countries';
import { getAvailableStoreOffers } from '../domain/availability';
import { RentalError } from '@/modules/reservation/domain/validation';
import {
  buildSearchQuery, createDefaultSearchForm, hasLocation, toDateInput, type SearchFormState,
} from '../domain/search-form';
import { LocationField } from './search/location-field';
import { DateRangeField } from './search/date-range-field';
import { DriverAgeSelect, LicenseCountrySelect } from './search/inline-selects';

const LICENSE_COOKIE = 'tg_license_country';

type OpenField = 'pickup' | 'return' | 'dates' | null;

interface SearchBarProps {
  lang: RouteLanguage;
  /** card: home hero (stacked). bar: results page (single row). hero: full-width hero (1 row on PC, stacked on mobile). */
  variant?: 'card' | 'bar' | 'hero';
  initial?: SearchFormState;
  onSubmitted?: () => void;
  className?: string;
}

export function SearchBar({ lang, variant = 'card', initial, onSubmitted, className }: SearchBarProps) {
  const router = useRouter();
  const { t } = useI18n(lang);
  const [form, setForm] = useState<SearchFormState>(
    () => initial ?? createDefaultSearchForm(getDefaultLicenseCountry(lang))
  );
  const [openField, setOpenField] = useState<OpenField>(null);
  const [errors, setErrors] = useState<{ pickup?: string; return?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore the saved license country and roll statically rendered default dates forward.
  useEffect(() => {
    const saved = document.cookie.match(new RegExp(`${LICENSE_COOKIE}=([A-Z]{2})`, 'i'))?.[1];
    const today = toDateInput(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external system sync (cookie, client clock)
    setForm((prev) => {
      const next = !initial && saved ? { ...prev, licenseCountry: saved.toUpperCase() } : prev;
      return next.pickupDate < today ? { ...createDefaultSearchForm(next.licenseCountry), pickup: next.pickup, dropoff: next.dropoff, differentReturn: next.differentReturn, driverAge: next.driverAge } : next;
    });
  }, [initial]);

  const update = (patch: Partial<SearchFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const setLicenseCountry = (code: string) => {
    update({ licenseCountry: code });
    document.cookie = `${LICENSE_COOKIE}=${code}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLocation(form.pickup)) {
      setErrors({ pickup: t('search_error_pickup') });
      setOpenField('pickup');
      return;
    }
    if (form.differentReturn && !hasLocation(form.dropoff)) {
      setErrors({ return: t('search_error_return') });
      setOpenField('return');
      return;
    }
    try { getAvailableStoreOffers(form); }
    catch (error) {
      if (!(error instanceof RentalError)) throw error;
      if (error.code === 'invalid_search') {
        setOpenField('dates');
        return;
      }
      // Let the results page explain an invalid restored driver selection.
      if (error.code !== 'invalid_driver') throw error;
    }
    setErrors({});
    setSubmitting(true);
    router.push(`/${lang}/rent?${buildSearchQuery(form)}`);
    onSubmitted?.();
  };

  const fieldOpen = (field: Exclude<OpenField, null>) => ({
    open: openField === field,
    onOpenChange: (open: boolean) => setOpenField(open ? field : null),
  });

  const locationFields = (
    <>
      <LocationField
        lang={lang}
        fieldId="pickup"
        label={t('search_pickup_location')}
        placeholder={t('search_pickup_placeholder')}
        value={form.pickup}
        onChange={(pickup) => {
          update({ pickup });
          setErrors((prev) => ({ ...prev, pickup: undefined }));
        }}
        error={errors.pickup}
        className="min-w-0 flex-1"
        {...fieldOpen('pickup')}
      />
      {form.differentReturn && (
        <LocationField
          lang={lang}
          fieldId="return"
          label={t('search_return_location')}
          placeholder={t('search_return_placeholder')}
          value={form.dropoff}
          onChange={(dropoff) => {
            update({ dropoff });
            setErrors((prev) => ({ ...prev, return: undefined }));
          }}
          error={errors.return}
          className="min-w-0 flex-1"
          {...fieldOpen('return')}
        />
      )}
    </>
  );

  const dateField = (
    <DateRangeField
      lang={lang}
      value={form}
      onChange={(range) => update(range)}
      className={variant === 'bar' ? 'min-w-0 lg:w-104 shrink-0' : variant === 'hero' ? 'w-full' : undefined}
      {...fieldOpen('dates')}
    />
  );

  const options = (
    <div className="flex flex-wrap items-center gap-x-5">
      <label className="inline-flex h-11 items-center gap-2 text-sm text-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.differentReturn}
          onChange={(e) => update({ differentReturn: e.target.checked })}
          className="h-4 w-4 rounded-tag border-input accent-primary cursor-pointer"
        />
        <span>{t('search_different_location')}</span>
      </label>
      <DriverAgeSelect lang={lang} value={form.driverAge} onChange={(driverAge) => update({ driverAge })} />
      <LicenseCountrySelect lang={lang} value={form.licenseCountry} onChange={setLicenseCountry} />
    </div>
  );

  if (variant === 'hero') {
    const carRentalTab =
      lang === 'zh'
        ? '租車'
        : lang === 'ja'
        ? 'レンタカー'
        : lang === 'es'
        ? 'Alquiler de coches'
        : lang === 'ko'
        ? '렌터카'
        : 'Car rental';

    return (
      <form
        onSubmit={handleSubmit}
        noValidate
        className={cn(
          'w-full rounded-card bg-background p-4 sm:p-5 shadow-overlay border border-border/80 text-foreground',
          className
        )}
      >
        {/* Top Header Row: Tab + Different Return Checkbox */}
        <div className="mb-3 flex items-center gap-4 sm:gap-6">
          <span className="relative block pb-1 text-sm font-bold text-foreground after:absolute after:left-0 after:-bottom-px after:h-[2px] after:w-full after:bg-primary select-none">
            {carRentalTab}
          </span>
          <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground-secondary hover:text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.differentReturn}
              onChange={(e) => update({ differentReturn: e.target.checked })}
              className="h-4 w-4 rounded-tag border-input accent-primary cursor-pointer"
            />
            <span>{t('search_different_location')}</span>
          </label>
        </div>

        {/* Main Input Row: Single Line on PC (lg:), Stacks on Mobile */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* Location field(s) */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            {locationFields}
          </div>

          {/* Date range picker */}
          <div className="min-w-0 flex-1 lg:w-[460px] lg:flex-none">
            {dateField}
          </div>

          {/* Search Button: Square on PC (h-14 w-14), Full-width on Mobile */}
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full gap-2 text-base font-semibold lg:h-14 lg:w-14 lg:shrink-0 lg:p-0"
            aria-label={t('search_submit')}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="lg:sr-only">
              {submitting ? t('search_loading_vehicles') : t('search_submit')}
            </span>
          </Button>
        </div>

        {/* Bottom Options Row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 pt-2.5 border-t border-border text-xs text-foreground-secondary">
          <LicenseCountrySelect lang={lang} value={form.licenseCountry} onChange={setLicenseCountry} />
          <DriverAgeSelect lang={lang} value={form.driverAge} onChange={(driverAge) => update({ driverAge })} />
        </div>
      </form>
    );
  }

  if (variant === 'bar') {
    return (
      <form onSubmit={handleSubmit} noValidate className={cn('w-full', className)}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">{locationFields}</div>
          {dateField}
          <Button type="submit" disabled={submitting} className="h-14 shrink-0 gap-2 lg:w-14 lg:px-0" aria-label={t('search_submit')}>
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="lg:sr-only">{t('search_submit')}</span>
          </Button>
        </div>
        <div className="mt-1">{options}</div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('w-full rounded-card bg-background p-5 sm:p-6 shadow-overlay', className)}
    >
      <div className="space-y-2">
        {locationFields}
        {dateField}
      </div>
      <div className="mt-1">{options}</div>
      <Button type="submit" disabled={submitting} className="mt-3 w-full gap-2 text-base">
        <Search className="h-5 w-5" aria-hidden="true" />
        <span>{submitting ? t('search_loading_vehicles') : t('search_submit')}</span>
      </Button>
    </form>
  );
}
