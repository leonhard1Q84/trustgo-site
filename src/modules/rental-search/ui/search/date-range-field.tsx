'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { htmlLangMap, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useIsTabletUp } from '@/shared/ui/use-media-query';
import { getRentalDays, parseDateInput, toDateInput } from '../../domain/search-form';
import { DateRangePicker, type DateRangeValue } from './date-range-picker';
import { FieldLabel, fieldBoxClass } from './field';

interface DateRangeFieldProps {
  lang: RouteLanguage;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

/** One field for the whole rental period: pick-up | rental days | return. */
export function DateRangeField({ lang, value, onChange, open, onOpenChange, className }: DateRangeFieldProps) {
  const { t } = useI18n(lang);
  const isTabletUp = useIsTabletUp();
  const locale = htmlLangMap[lang];
  const minDate = toDateInput(new Date());
  const [draft, setDraft] = useState<DateRangeValue>(value);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', weekday: 'short' }),
    [locale]
  );
  const format = (date: string, time: string) => (date ? `${formatter.format(parseDateInput(date))} ${time}` : '—');
  const days = getRentalDays(value.pickupDate, value.returnDate, value.pickupTime, value.returnTime);
  const daysLabel = t('search_rental_days').replace('{days}', String(days));

  const openPicker = () => {
    setDraft(value);
    onOpenChange(true);
  };

  const trigger = (
    <button
      type="button"
      onClick={openPicker}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`${t('search_pickup_date')} ${format(value.pickupDate, value.pickupTime)}, ${t('search_return_date')} ${format(value.returnDate, value.returnTime)}, ${daysLabel}`}
      className={fieldBoxClass(false, 'w-full cursor-pointer')}
    >
      <CalendarDays className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <FieldLabel>{t('search_pickup_date')}</FieldLabel>
        <span suppressHydrationWarning className="block truncate text-sm font-medium tabular-nums text-foreground">
          {format(value.pickupDate, value.pickupTime)}
        </span>
      </span>
      <span suppressHydrationWarning className="shrink-0 rounded-full border border-border-strong px-2 py-0.5 text-xs font-semibold text-foreground">
        {daysLabel}
      </span>
      <span className="min-w-0 flex-1 text-right">
        <FieldLabel>{t('search_return_date')}</FieldLabel>
        <span suppressHydrationWarning className="block truncate text-sm font-medium tabular-nums text-foreground">
          {format(value.returnDate, value.returnTime)}
        </span>
      </span>
    </button>
  );

  if (!isTabletUp) {
    const draftComplete = Boolean(draft.pickupDate && draft.returnDate);
    return (
      <div className={className}>
        {trigger}
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent variant="full" aria-describedby={undefined}>
            <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
              <DialogTitle>{t('search_dates')}</DialogTitle>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <DateRangePicker value={draft} onChange={setDraft} locale={locale} minDate={minDate} layout="stacked" t={t} />
            </div>
            <DialogFooter className="justify-between bg-background">
              <span className="text-sm font-semibold text-foreground">
                {draftComplete
                  ? t('search_rental_days').replace('{days}', String(getRentalDays(draft.pickupDate, draft.returnDate, draft.pickupTime, draft.returnTime)))
                  : t('search_cal_select_return')}
              </span>
              <Button
                disabled={!draftComplete}
                onClick={() => {
                  onChange(draft);
                  onOpenChange(false);
                }}
              >
                {t('search_cal_confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (!next && !(draft.pickupDate && draft.returnDate)) setDraft(value);
          onOpenChange(next);
        }}
      >
        <PopoverAnchor asChild>{trigger}</PopoverAnchor>
        <PopoverContent align="start" className="w-180 max-w-[calc(100vw-2rem)] p-6">
          <DateRangePicker
            value={draft}
            onChange={(next) => {
              setDraft(next);
              if (next.pickupDate && next.returnDate) onChange(next);
            }}
            locale={locale}
            minDate={minDate}
            layout="dual"
            t={t}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
