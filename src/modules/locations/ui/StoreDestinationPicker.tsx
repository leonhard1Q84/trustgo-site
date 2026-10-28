'use client';

import { useId, useState } from 'react';
import { ChevronDown, MapPin, X } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useIsTabletUp } from '@/shared/ui/use-media-query';
import { GroupedOptionList, type OptionGroup } from '@/shared/ui/grouped-option-list';
import { citiesList, marketsList } from '../domain/locations-data';

interface StoreDestinationPickerProps {
  lang: RouteLanguage;
  market: string;
  city?: string;
  onSelect: (market: string, city: string) => void;
}

export function StoreDestinationPicker({
  lang,
  market,
  city,
  onSelect,
}: StoreDestinationPickerProps) {
  const { t, language } = useI18n(lang);
  const [open, setOpen] = useState(false);
  const isTabletUp = useIsTabletUp();
  const titleId = useId();
  const activeCity = citiesList.find((item) => item.code === city);
  const activeMarket = marketsList.find((item) => item.code === market);
  const label =
    market === 'all'
      ? t('locator_all_destinations')
      : [activeMarket?.label[language], activeCity?.localizedNames[language]]
          .filter(Boolean)
          .join(' · ');

  function select(marketCode: string, cityCode: string) {
    onSelect(marketCode, cityCode);
    setOpen(false);
  }

  const trigger = (
    <Button
      variant="secondary"
      className="h-11 min-h-11 w-full max-w-full justify-between gap-2 px-4 md:w-auto md:max-w-96"
    >
      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t('locator_destination_title')}: </span>
      <span className="truncate">{label}</span>
      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Button>
  );

  const groups: OptionGroup[] = [
    {
      id: 'all',
      options: [{ id: 'all', label: t('locator_all_destinations'), selected: market === 'all' }],
    },
    ...marketsList
      .filter((item) => item.code !== 'all')
      .map((item) => ({
        id: item.code,
        label: item.label[language],
        options: [
          {
            id: 'all',
            label: t('locator_all_cities'),
            selected: market === item.code && (!city || city === 'all'),
          },
          ...citiesList
            .filter((node) => node.marketCode === item.code)
            .map((node) => ({
              id: node.code,
              label: node.localizedNames[language],
              selected: market === item.code && city === node.code,
            })),
        ],
      })),
  ];
  const destinations = <GroupedOptionList groups={groups} onSelect={select} />;

  if (isTabletUp) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align="start" aria-labelledby={titleId} className="w-120 p-0">
          <h2 id={titleId} className="sr-only">
            {t('locator_destination_title')}
          </h2>
          <div className="max-h-120 overflow-y-auto overscroll-contain p-2">{destinations}</div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        variant="full"
        hideCloseButton
        aria-describedby={undefined}
        className="sm:inset-0 sm:h-dvh sm:max-h-none sm:max-w-none sm:translate-x-0 sm:translate-y-0 sm:rounded-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <DialogTitle>{t('locator_destination_title')}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label={t('locator_close')}>
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {destinations}
        </div>
      </DialogContent>
    </Dialog>
  );
}
