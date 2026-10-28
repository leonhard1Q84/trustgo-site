'use client';

import React, { useState } from 'react';
import { MapPin, Clock, ChevronRight, Bus } from 'lucide-react';
import { StoreMapModal, buildDepotStoreInfo, type StoreInfo } from './StoreMapModal';
import { type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';

interface StoreGuideSectionProps {
  pickupLocation: string;
  supplierName: string;
  locationType: string;
  storeCode?: string;
  lang?: RouteLanguage;
}

export function StoreGuideSection({
  pickupLocation,
  supplierName,
  locationType,
  storeCode,
  lang = 'en',
}: StoreGuideSectionProps) {
  const { t } = useI18n(lang);
  const [showModal, setShowModal] = useState(false);

  const pickupStore: StoreInfo = buildDepotStoreInfo(supplierName, pickupLocation, locationType, storeCode);
  const returnStore: StoreInfo = { ...pickupStore };

  return (
    <>
      <div className="bg-background rounded-card p-6 sm:p-7 border border-border">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-brand" />
              <h2 className="text-lg font-bold text-foreground">{t('storeguide_title')}</h2>
            </div>
            <p className="text-xs text-foreground-secondary mt-1">{t('storeguide_subtitle')}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer group"
          >
            <span>{t('storeguide_view_full')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2-Column Content Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Pickup Store & Shuttle Details */}
          <div className="p-4 rounded-card bg-muted border border-border space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-control bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">{t('storeguide_pickup_depot')}</span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mt-0.5 leading-snug">
                  {pickupStore.name}
                </h3>
                <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                  {pickupStore.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground pt-2 border-t border-border">
              <Clock className="w-3.5 h-3.5 text-foreground-secondary" />
              <span>
                {t('storeguide_hours_prefix')}
                {pickupStore.hours.replace('(Everyday)', `(${t('storeguide_everyday')})`)}
              </span>
            </div>
          </div>

          {/* Right: Shuttle & Service Instructions */}
          <div className="p-4 rounded-card bg-muted border border-border space-y-3 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-control bg-warm-light text-warm-strong flex items-center justify-center shrink-0 mt-0.5">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-warm-strong block">{t('storeguide_shuttle_label')}</span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mt-0.5 leading-snug">
                  {t('storeguide_shuttle_title')}
                </h3>
                <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                  {t('storeguide_shuttle_desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs text-foreground-secondary">
                {t('storeguide_phone_prefix')}
                <strong className="text-foreground">{pickupStore.phone}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                {t('storeguide_map_nav')} &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      <StoreMapModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        pickupStore={pickupStore}
        returnStore={returnStore}
        lang={lang}
      />
    </>
  );
}
