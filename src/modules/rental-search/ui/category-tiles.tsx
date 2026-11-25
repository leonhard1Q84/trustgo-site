'use client';

import React from 'react';
import { FilterChip } from '@/shared/ui/filter-chip';
import { type CategoryOption } from '../domain/result-filters';
import { FILTER_LABEL_KEYS } from './result-filter-labels';

export interface CategoryStat {
  option: CategoryOption;
  count: number;
}

interface CategoryChipsRowProps {
  stats: CategoryStat[];
  selected: CategoryOption | null;
  onSelect: (option: CategoryOption | null) => void;
  t: (key: string) => string;
}

/**
 * Vehicle-class filter row above the results list: plain chips (no photos or prices —
 * brand direct channel, not a multi-supplier marketplace). Single-select; "All" resets.
 */
export function CategoryChipsRow({ stats, selected, onSelect, t }: CategoryChipsRowProps) {
  return (
    <div
      role="radiogroup"
      aria-label={t('rs_filter_group_category')}
      className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-0.5 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
    >
      <FilterChip selected={selected === null} onClick={() => onSelect(null)}>
        {t('rs_type_all')}
      </FilterChip>
      {stats.map(({ option, count }) => {
        const active = selected === option;
        return (
          <FilterChip
            key={option}
            role="radio"
            aria-checked={active}
            selected={active}
            disabled={count === 0 && !active}
            onClick={() => onSelect(active ? null : option)}
          >
            {t(FILTER_LABEL_KEYS[option])}
          </FilterChip>
        );
      })}
    </div>
  );
}
