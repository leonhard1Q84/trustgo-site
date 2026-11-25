'use client';

import React, {useMemo, useState} from 'react';
import {ChevronRight, Plus, User} from 'lucide-react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {cn} from '@/shared/ui/utils';

export interface AccountPrefillOptionView {
  id: string;
  primaryLabel: string;
  secondaryLabel?: string;
  isDefault?: boolean;
}

interface AccountPrefillSelectorProps<Option extends AccountPrefillOptionView> {
  label: string;
  actionLabel: string;
  dialogTitle: string;
  manualLabel: string;
  defaultLabel: string;
  options: Option[];
  selectedId: string | null;
  onSelect: (option: Option) => void;
  onManual: () => void;
}

export function AccountPrefillSelector<Option extends AccountPrefillOptionView>({
  label,
  actionLabel,
  dialogTitle,
  manualLabel,
  defaultLabel,
  options,
  selectedId,
  onSelect,
  onManual,
}: AccountPrefillSelectorProps<Option>) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleOptions = useMemo(() => {
    const firstOptions = options.slice(0, 2);
    if (!selectedId || firstOptions.some((option) => option.id === selectedId)) return firstOptions;
    const selectedOption = options.find((option) => option.id === selectedId);
    if (!selectedOption) return firstOptions;
    return [selectedOption, ...firstOptions.filter((option) => option.id !== selectedId)].slice(0, 2);
  }, [options, selectedId]);

  if (options.length === 0) return null;

  const chooseOption = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const chooseManual = () => {
    onManual();
    setIsOpen(false);
  };

  return (
    <div className="rounded-control border border-border bg-muted p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption font-semibold text-foreground-secondary">{label}</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-control px-2 text-caption font-semibold text-primary transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{actionLabel}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {visibleOptions.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={cn(
                'inline-flex min-h-11 max-w-full items-center gap-2 rounded-control border px-3 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'border-primary bg-brand-light text-primary'
                  : 'border-border bg-background text-foreground hover:border-border-strong hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 bg-background',
                  isSelected ? 'border-primary' : 'border-border-strong',
                )}
                aria-hidden="true"
              >
                {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
              </span>
              <span className="min-w-0 truncate">{option.primaryLabel}</span>
            </button>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent variant="sheet" className="gap-0 p-0">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-4">
            <button
              type="button"
              onClick={chooseManual}
              className="flex min-h-12 w-full items-center gap-2.5 rounded-control border border-primary bg-background px-4 py-3 text-left text-body font-semibold text-primary transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{manualLabel}</span>
            </button>

            <div className="space-y-2.5">
              {options.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => chooseOption(option)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-control border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected
                        ? 'border-primary bg-brand-light'
                        : 'border-border bg-background hover:bg-muted',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-background',
                        isSelected ? 'border-primary' : 'border-border-strong',
                      )}
                      aria-hidden="true"
                    >
                      {isSelected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cn('break-words text-body font-semibold', isSelected ? 'text-primary' : 'text-foreground')}>
                          {option.primaryLabel}
                        </span>
                        {option.isDefault ? (
                          <span className="rounded-tag bg-muted px-2 py-0.5 text-caption font-medium text-foreground-secondary">
                            {defaultLabel}
                          </span>
                        ) : null}
                      </span>
                      {option.secondaryLabel ? (
                        <span className="mt-1 block break-all text-caption text-foreground-secondary">
                          {option.secondaryLabel}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
