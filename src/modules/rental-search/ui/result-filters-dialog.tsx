'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { FilterChip } from '@/shared/ui/filter-chip';
import { EMPTY_FILTERS, countActiveFilters } from '../domain/result-filters';
import { ResultFilterPanel, type ResultFilterPanelProps } from './result-filter-panel';

type ResultFiltersDialogProps = Omit<ResultFilterPanelProps, 'onChange' | 'idPrefix'> & {
  onApply: ResultFilterPanelProps['onChange'];
};

/** H5 / Tablet entry: full-screen sheet with the sidebar's checkbox groups; changes apply on "Show N cars". */
export function ResultFiltersDialog({ filters, onApply, countFor, availableFeatures, t }: ResultFiltersDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const activeCount = countActiveFilters({ ...filters, category: [] });
  const draftCount = countFor(draft);

  const openDialog = () => {
    setDraft(filters);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? openDialog() : setOpen(false))}>
      <FilterChip selected={activeCount > 0} onClick={openDialog} aria-haspopup="dialog">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {t('rs_filters')}
        {activeCount > 0 && <span className="tabular-nums">· {activeCount}</span>}
      </FilterChip>
      <DialogContent variant="full" aria-describedby={undefined}>
        <DialogHeader className="items-center">
          <DialogTitle>{t('rs_filters')}</DialogTitle>
        </DialogHeader>
        <DialogBody className="py-0">
          <ResultFilterPanel
            filters={draft}
            onChange={setDraft}
            countFor={countFor}
            availableFeatures={availableFeatures}
            t={t}
            idPrefix="filter-sheet"
          />
        </DialogBody>
        <DialogFooter className="justify-between bg-background">
          <Button variant="text" size="sm" className="h-11 px-2 text-sm" onClick={() => setDraft((d) => ({ ...EMPTY_FILTERS, category: d.category }))}>
            {t('rs_filter_clear_all')}
          </Button>
          <Button
            className="h-11 min-h-11"
            disabled={draftCount === 0}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            {draftCount === 0 ? t('rs_filter_no_results') : t('rs_filter_show_results').replace('{count}', String(draftCount))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
