'use client';

import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/ui/utils';
import { COUNTRIES_LIST, POPULAR_COUNTRIES, type CountryOption } from '../../domain/countries';
import { DRIVER_AGE_BANDS, getDriverAgeBand } from '../../domain/search-form';

const triggerClass =
  'group inline-flex h-11 items-center gap-1 text-sm text-foreground-secondary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-control';

function TriggerValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:underline underline-offset-4">
      {children}
      <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}

const optionClass = (selected: boolean) =>
  cn(
    'flex w-full items-center justify-between gap-2 rounded-control px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted cursor-pointer',
    selected ? 'font-semibold text-foreground' : 'text-foreground-secondary'
  );

export function useCountryName(lang: RouteLanguage) {
  return useMemo(() => {
    const names = new Intl.DisplayNames([htmlLangMap[lang]], { type: 'region' });
    return (country: CountryOption) => names.of(country.code) ?? country.name;
  }, [lang]);
}

/** "License country: United States ⌄" — inline text dropdown, no helper copy. */
export function LicenseCountrySelect({
  lang, value, onChange,
}: { lang: RouteLanguage; value: string; onChange: (code: string) => void }) {
  const { t } = useI18n(lang);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const countryName = useCountryName(lang);
  const selected = COUNTRIES_LIST.find((c) => c.code === value) ?? COUNTRIES_LIST[0];
  const q = filter.trim().toLowerCase();
  const list = q
    ? COUNTRIES_LIST.filter((c) =>
        [c.code, c.name, c.nativeName, countryName(c)].some((s) => s.toLowerCase().includes(q))
      )
    : [...POPULAR_COUNTRIES, ...COUNTRIES_LIST.filter((c) => !c.popular)];

  return (
    <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setFilter(''); }}>
      <PopoverTrigger className={triggerClass}>
        <span>{t('search_license_country_label')}:</span>
        <TriggerValue>{countryName(selected)}</TriggerValue>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('search_license_country_search_placeholder')}
            aria-label={t('search_license_country_search_placeholder')}
            className="h-10 w-full rounded-control border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-disabled focus:border-brand focus:outline-none"
          />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {list.map((country, i) => (
            <React.Fragment key={country.code}>
              {!q && i === POPULAR_COUNTRIES.length && <div className="my-1 border-t border-border" />}
              <button
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                  setFilter('');
                }}
                className={optionClass(country.code === value)}
              >
                <span className="truncate">{countryName(country)}</span>
                {country.code === value && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            </React.Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** "Driver age: 25–64 ⌄" — bands map to Young / Standard / Senior driver rules. */
export function DriverAgeSelect({
  lang, value, onChange,
}: { lang: RouteLanguage; value: number; onChange: (age: number) => void }) {
  const { t } = useI18n(lang);
  const [open, setOpen] = useState(false);
  const current = getDriverAgeBand(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={triggerClass}>
        <span>{t('search_age_label')}:</span>
        <TriggerValue>{current.label}</TriggerValue>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        {DRIVER_AGE_BANDS.map((band) => (
          <button
            key={band.value}
            type="button"
            onClick={() => {
              onChange(band.value);
              setOpen(false);
            }}
            className={optionClass(band.value === current.value)}
          >
            <span className="tabular-nums">{band.label}</span>
            {band.value === current.value && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
