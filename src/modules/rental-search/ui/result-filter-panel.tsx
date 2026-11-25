'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/ui/utils';
import {
  FEATURE_GROUPS, SEAT_OPTIONS, TRANSMISSION_OPTIONS,
  isFilterSelected, toggleFilter, withOnly,
  type FilterFacet, type FilterOption, type FilterValue, type ResultFilters,
} from '../domain/result-filters';
import { FILTER_LABEL_KEYS } from './result-filter-labels';

export interface ResultFilterPanelProps {
  filters: ResultFilters;
  onChange: (filters: ResultFilters) => void;
  /** Number of vehicle groups the given filters would return. */
  countFor: (filters: ResultFilters) => number;
  /** Offer features present in the unfiltered results; absent ones are not offered. */
  availableFeatures: Set<string>;
  t: (key: string) => string;
  idPrefix: string;
}

/** Checkbox filter groups shared by the PC sidebar and the H5 full-screen sheet. */
export function ResultFilterPanel({ filters, onChange, countFor, availableFeatures, t, idPrefix }: ResultFilterPanelProps) {
  const group = <F extends FilterFacet>(groupKey: string, facet: F, options: FilterValue<F>[]) => (
    <fieldset key={groupKey} className="border-b border-border py-4 last:border-0">
      <legend className="float-left mb-2 w-full text-sm font-semibold text-foreground">{t(`rs_filter_group_${groupKey}`)}</legend>
      <ul className="clear-left">
        {options.map((value) => {
          const option = { facet, value } as FilterOption;
          const selected = isFilterSelected(filters, option);
          const count = countFor(withOnly(filters, option));
          const disabled = !selected && count === 0;
          const id = `${idPrefix}-${value}`;
          return (
            <li key={value}>
              <label
                htmlFor={id}
                className={cn(
                  'flex min-h-11 items-center gap-3 text-sm lg:min-h-9',
                  disabled ? 'cursor-not-allowed text-foreground-disabled' : 'cursor-pointer text-foreground'
                )}
              >
                <input
                  id={id}
                  type="checkbox"
                  className="peer sr-only"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => onChange(toggleFilter(filters, option))}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-tag border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                    selected ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background',
                    disabled && 'border-border'
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">{t(FILTER_LABEL_KEYS[value])}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );

  return (
    <div>
      {group('transmission', 'transmission', TRANSMISSION_OPTIONS)}
      {group('seats', 'seats', SEAT_OPTIONS)}
      {FEATURE_GROUPS.map(({ key, options }) => {
        const visible = options.filter((option) => availableFeatures.has(option));
        return visible.length > 0 && group(key, 'features', visible);
      })}
    </div>
  );
}
