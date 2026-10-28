'use client';

import React, { useMemo } from 'react';
import { CalendarDays, MapPin, Pencil, X } from 'lucide-react';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { useIsTabletUp } from '@/shared/ui/use-media-query';
import { getDriverAgeBand, getRentalDays, parseDateInput, type SearchFormState } from '../domain/search-form';
import { SearchBar } from './search-bar';

interface SearchSummaryBarProps {
  lang: RouteLanguage;
  form: SearchFormState;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
}

/**
 * Results-page search: a compact, sticky one-line summary ("LAX · Thu 29 Oct 10:00 – Sun 1 Nov 10:00 · 3 days").
 * PC expands it in place into the full search row; H5 opens the search card in a full-screen sheet.
 */
export function SearchSummaryBar({ lang, form, editing, onEditingChange: setEditing }: SearchSummaryBarProps) {
  const { t } = useI18n(lang);
  const isTabletUp = useIsTabletUp();
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(htmlLangMap[lang], { month: 'short', day: 'numeric', weekday: 'short' }),
    [lang]
  );
  const fmt = (date: string, time: string) => `${formatter.format(parseDateInput(date))} ${time}`;
  const days = t('search_rental_days').replace('{days}', String(getRentalDays(form.pickupDate, form.returnDate, form.pickupTime, form.returnTime)));
  const dropoffLabel = form.differentReturn ? form.dropoff.label : '';

  const summary = (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex w-full min-w-0 items-center gap-3 rounded-full border border-border-strong bg-background px-4 py-2 text-left transition-colors hover:border-foreground cursor-pointer md:w-auto md:max-w-full"
      aria-label={`${t('search_edit')}: ${form.pickup.label}`}
    >
      <MapPin className="h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {form.pickup.label}
          {dropoffLabel && ` → ${dropoffLabel}`}
        </span>
        <span className="flex items-center gap-1.5 truncate text-xs text-foreground-secondary md:hidden">
          {fmt(form.pickupDate, form.pickupTime)} – {fmt(form.returnDate, form.returnTime)} · {days}
        </span>
      </span>
      <span className="hidden h-6 w-px bg-border md:block" aria-hidden="true" />
      <span className="hidden items-center gap-2 text-sm tabular-nums text-foreground md:flex">
        <CalendarDays className="h-4 w-4 text-foreground-secondary" aria-hidden="true" />
        {fmt(form.pickupDate, form.pickupTime)} – {fmt(form.returnDate, form.returnTime)}
        <span className="rounded-full border border-border-strong px-2 py-0.5 text-xs font-semibold">{days}</span>
      </span>
      <span className="hidden h-6 w-px bg-border lg:block" aria-hidden="true" />
      <span className="hidden text-sm text-foreground-secondary lg:block">
        {t('search_age_label')} {getDriverAgeBand(form.driverAge).label}
      </span>
      <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <div className="sticky top-14 z-20 border-b border-border bg-background lg:top-18">
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
        {editing && isTabletUp ? (
          <div className="flex items-start gap-3">
            <SearchBar lang={lang} variant="bar" initial={form} onSubmitted={() => setEditing(false)} className="flex-1" />
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label={t('common_close')}
              className="mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          summary
        )}
      </div>

      {!isTabletUp && (
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent variant="full" aria-describedby={undefined} className="bg-muted">
            <div className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
              <DialogTitle>{t('search_edit')}</DialogTitle>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SearchBar lang={lang} initial={form} onSubmitted={() => setEditing(false)} className="shadow-none" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
