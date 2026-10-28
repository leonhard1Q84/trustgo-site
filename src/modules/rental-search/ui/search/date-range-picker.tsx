'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/ui/utils';
import { parseDateInput, toDateInput, TIME_OPTIONS } from '../../domain/search-form';

export interface DateRangeValue {
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
}

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  locale: string;
  minDate: string;
  layout: 'dual' | 'stacked';
  t: (key: string) => string;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

/** Two-click range selection (pick-up → return); pick-up time syncs to return time until the return time is edited. */
export function DateRangePicker({ value, onChange, locale, minDate, layout, t }: DateRangePickerProps) {
  const [anchorMonth, setAnchorMonth] = useState(() => monthStart(parseDateInput(value.pickupDate || minDate)));
  const [selecting, setSelecting] = useState<'pickup' | 'return'>('pickup');
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [returnTimeTouched, setReturnTimeTouched] = useState(value.pickupTime !== value.returnTime);

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }), [locale]);
  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)));
  }, [locale]);

  const months = layout === 'dual'
    ? [anchorMonth, addMonths(anchorMonth, 1)]
    : Array.from({ length: 6 }, (_, i) => addMonths(anchorMonth, i));
  const canGoBack = anchorMonth > monthStart(parseDateInput(minDate));

  const rangeEnd = selecting === 'return' ? (hoverDate && hoverDate > value.pickupDate ? hoverDate : '') : value.returnDate;

  const handleDay = (date: string) => {
    if (selecting === 'pickup' || date < value.pickupDate) {
      onChange({ ...value, pickupDate: date, returnDate: '' });
      setSelecting('return');
      return;
    }
    onChange({ ...value, returnDate: date });
    setSelecting('pickup');
    setHoverDate(null);
  };

  const renderMonth = (month: Date) => {
    const firstWeekday = month.getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => toDateInput(new Date(month.getFullYear(), month.getMonth(), i + 1))),
    ];
    return (
      <div key={month.toISOString()} className="min-w-0 flex-1">
        <p className="mb-3 text-center text-sm font-semibold text-foreground">{monthFormatter.format(month)}</p>
        <div className="grid grid-cols-7 text-center">
          {weekdayLabels.map((w, i) => (
            <span key={i} className="pb-2 text-xs font-medium text-muted-foreground">{w}</span>
          ))}
          {cells.map((date, i) => {
            if (!date) return <span key={`e${i}`} />;
            const disabled = date < minDate;
            const isStart = date === value.pickupDate;
            const isEnd = date === rangeEnd;
            const inRange = Boolean(rangeEnd) && date > value.pickupDate && date < rangeEnd;
            return (
              <div
                key={date}
                className={cn(
                  'flex h-10 items-center justify-center',
                  (inRange || ((isStart || isEnd) && rangeEnd && value.pickupDate !== rangeEnd)) && 'bg-brand-light',
                  isStart && rangeEnd && 'rounded-l-full',
                  isEnd && 'rounded-r-full'
                )}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDay(date)}
                  onMouseEnter={() => selecting === 'return' && setHoverDate(date)}
                  aria-pressed={isStart || isEnd}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors',
                    disabled
                      ? 'cursor-not-allowed text-foreground-disabled line-through'
                      : 'cursor-pointer text-foreground hover:border hover:border-foreground',
                    (isStart || isEnd) && 'bg-primary font-semibold text-primary-foreground hover:border-0'
                  )}
                >
                  {Number(date.slice(8))}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const timeSelect = (label: string, current: string, onSelect: (time: string) => void) => (
    <label className="flex items-center justify-between gap-3 text-sm text-foreground">
      <span className="font-medium">{label}</span>
      <select
        value={current}
        onChange={(e) => onSelect(e.target.value)}
        className="h-10 rounded-control border border-input bg-background px-3 text-sm font-medium tabular-nums text-foreground focus:border-brand focus:outline-none cursor-pointer"
      >
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div>
      <div className={cn('relative', layout === 'dual' ? 'flex gap-8' : 'space-y-8')}>
        {layout === 'dual' && (
          <>
            <button
              type="button"
              aria-label={t('search_cal_prev_month')}
              disabled={!canGoBack}
              onClick={() => setAnchorMonth((m) => addMonths(m, -1))}
              className="absolute left-0 -top-1 flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t('search_cal_next_month')}
              onClick={() => setAnchorMonth((m) => addMonths(m, 1))}
              className="absolute right-0 -top-1 flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-muted cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        {months.map(renderMonth)}
      </div>

      <div className={cn('mt-5 grid gap-3 border-t border-border pt-4', layout === 'dual' && 'grid-cols-2 gap-8')}>
        {timeSelect(t('search_pickup_time'), value.pickupTime, (time) =>
          onChange({ ...value, pickupTime: time, returnTime: returnTimeTouched ? value.returnTime : time })
        )}
        {timeSelect(t('search_return_time'), value.returnTime, (time) => {
          setReturnTimeTouched(true);
          onChange({ ...value, returnTime: time });
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t('search_cal_local_time')}</p>
    </div>
  );
}
