'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Plus, Minus } from 'lucide-react';
import { SpecialEquipmentSelection, EQUIPMENT_CATALOG } from '../domain/equipment';

interface EquipmentSelectorProps {
  selection: SpecialEquipmentSelection;
  onChange: (updated: SpecialEquipmentSelection) => void;
  currency?: string;
  rentalDays?: number;
}

export function EquipmentSelector({ selection, onChange, currency = '$' }: EquipmentSelectorProps) {
  const { t } = useI18n();
  const handleQuantityChange = (key: 'infantSeat' | 'childSeat' | 'boosterSeat', delta: number) => {
    const current = selection[key];
    const item = EQUIPMENT_CATALOG.find((c) => c.id === key);
    const max = item ? item.maxQuantity : 3;
    const nextVal = Math.max(0, Math.min(max, current + delta));
    onChange({ ...selection, [key]: nextVal });
  };

  const handleToggleChange = (key: 'gpsNavigation' | 'snowChains') => {
    onChange({ ...selection, [key]: !selection[key] });
  };

  return (
    <section className="border-t border-border pt-8 md:pt-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-h3 font-semibold text-foreground">{t('eq_title')}</h2>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">{t('eq_subtitle')}</p>
        </div>
      </div>

      {/* List of Add-ons */}
      <div className="space-y-4">
        {EQUIPMENT_CATALOG.map((item) => {
          const isQuantity =
            item.id === 'infantSeat' || item.id === 'childSeat' || item.id === 'boosterSeat';
          const qty = isQuantity
            ? (selection[item.id as 'infantSeat' | 'childSeat' | 'boosterSeat'] as number)
            : 0;
          const isToggled =
            !isQuantity && Boolean(selection[item.id as 'gpsNavigation' | 'snowChains']);

          const localizedName =
            item.id === 'infantSeat'
              ? t('eq_infant_name')
              : item.id === 'childSeat'
                ? t('eq_child_name')
                : item.id === 'boosterSeat'
                  ? t('eq_booster_name')
                  : item.id === 'gpsNavigation'
                    ? t('eq_gps_name')
                    : t('eq_snow_name');

          const localizedDesc =
            item.id === 'infantSeat'
              ? t('eq_infant_desc')
              : item.id === 'childSeat'
                ? t('eq_child_desc')
                : item.id === 'boosterSeat'
                  ? t('eq_booster_desc')
                  : item.id === 'gpsNavigation'
                    ? t('eq_gps_desc')
                    : t('eq_snow_desc');

          return (
            <div
              key={item.id}
              className={`p-4 rounded-card border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                (isQuantity && qty > 0) || (!isQuantity && isToggled)
                  ? 'bg-brand-light/30 border-brand/40 shadow-raised'
                  : 'bg-background border-border hover:border-border-strong'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{localizedName}</h3>
                  {item.maxChargeDays && (
                    <span className="bg-muted border border-border text-foreground-secondary text-xs font-semibold px-2 py-0.5 rounded-full">
                      {t('eq_capped_days').replace('{days}', String(item.maxChargeDays))}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground-secondary mt-1 max-w-xl">{localizedDesc}</p>
                <div className="text-xs font-bold text-foreground mt-2">
                  {currency}
                  {item.dailyRate}{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    {t('common_per_day')}
                  </span>
                </div>
              </div>

              {/* Action: Stepper or Toggle */}
              <div className="shrink-0 flex items-center justify-end">
                {isQuantity ? (
                  <div className="flex items-center gap-3 bg-muted p-1.5 rounded-control border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.id as 'infantSeat' | 'childSeat' | 'boosterSeat',
                          -1
                        )
                      }
                      disabled={qty === 0}
                      className="w-8 h-8 rounded-control bg-background border border-border text-foreground hover:bg-muted flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-foreground w-6 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.id as 'infantSeat' | 'childSeat' | 'boosterSeat',
                          1
                        )
                      }
                      disabled={qty >= item.maxQuantity}
                      className="w-8 h-8 rounded-control bg-primary text-white hover:bg-primary-hover flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-raised"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleChange(item.id as 'gpsNavigation' | 'snowChains')}
                    className={`px-4 py-2 rounded-control text-xs font-bold transition-all ${
                      isToggled
                        ? 'bg-primary text-white shadow-raised'
                        : 'bg-muted hover:bg-brand-light text-foreground border border-border'
                    }`}
                  >
                    {isToggled ? 'Added' : t('eq_add')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
