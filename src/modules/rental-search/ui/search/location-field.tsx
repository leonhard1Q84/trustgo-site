'use client';

import React, { useId, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { routeToLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/popover';
import { useIsTabletUp } from '@/shared/ui/use-media-query';
import { LocationSearchModal } from '@/modules/destination-search/ui/location-search-modal';
import type { LocationSelection } from '@/modules/destination-search/types';
import { selectionToLocation, type SearchLocation } from '../../domain/search-form';
import { LocationPanel } from './location-panel';
import { FieldError, FieldLabel, fieldBoxClass } from './field';

interface LocationFieldProps {
  lang: RouteLanguage;
  fieldId: 'pickup' | 'return';
  label: string;
  placeholder: string;
  value: SearchLocation;
  onChange: (value: SearchLocation) => void;
  error?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

/** Pick-up / return location: PC combobox + anchored panel, H5 full-screen search sheet. */
export function LocationField({
  lang, fieldId, label, placeholder, value, onChange, error, open, onOpenChange, className,
}: LocationFieldProps) {
  const { t } = useI18n(lang);
  const isTabletUp = useIsTabletUp();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const listId = `${inputId}-list`;
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string | null>(null);

  const handleSelect = (selection: LocationSelection, displayName: string) => {
    onChange(selectionToLocation(selection, displayName));
    setQuery(null);
    onOpenChange(false);
  };

  const close = () => {
    setQuery(null);
    onOpenChange(false);
  };

  if (!isTabletUp) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-describedby={error ? errorId : undefined}
          className={fieldBoxClass(Boolean(error), 'w-full cursor-pointer')}
        >
          <MapPin className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <FieldLabel>{label}</FieldLabel>
            <span className={`block truncate text-base ${value.label ? 'font-medium text-foreground' : 'text-foreground-disabled'}`}>
              {value.label || placeholder}
            </span>
          </span>
        </button>
        {error && <FieldError id={errorId}>{error}</FieldError>}
        <LocationSearchModal
          isOpen={open}
          fieldId={fieldId}
          title={label}
          placeholder={placeholder}
          lang={lang}
          onClose={close}
          onSelect={handleSelect}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
        <PopoverAnchor asChild>
          <div ref={anchorRef} className={fieldBoxClass(Boolean(error), 'cursor-text')} onClick={() => inputRef.current?.focus()}>
            <MapPin className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
              <input
                ref={inputRef}
                id={inputId}
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-describedby={error ? errorId : undefined}
                autoComplete="off"
                value={query ?? value.label}
                placeholder={placeholder}
                onFocus={(e) => {
                  e.currentTarget.select();
                  onOpenChange(true);
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onOpenChange(true);
                }}
                onKeyDown={(e) => e.key === 'Escape' && close()}
                className="block w-full truncate bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-foreground-disabled"
              />
            </div>
            {value.label && (
              <button
                type="button"
                aria-label={t('search_location_clear_recent')}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ label: '' });
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={listId}
          align="start"
          className="w-120 max-h-120 overflow-y-auto p-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
          }}
        >
          <LocationPanel
            query={query ?? ''}
            language={routeToLanguage(lang)}
            t={t}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
