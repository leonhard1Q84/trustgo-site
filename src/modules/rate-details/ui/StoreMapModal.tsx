'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import type { StoreInfo } from '../domain/depot-info';
export { buildDepotStoreInfo, type StoreInfo } from '../domain/depot-info';
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogTitle,
} from '@/shared/ui/dialog';

interface StoreMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupStore: StoreInfo;
  returnStore?: StoreInfo;
  initialTab?: 'pickup' | 'return';
  lang?: RouteLanguage;
}

export function StoreMapModal({
  isOpen,
  onClose,
  pickupStore,
  returnStore,
  initialTab = 'pickup',
  lang = 'en',
}: StoreMapModalProps) {
  const { t } = useI18n(lang);
  const [activeTab, setActiveTab] = useState<'pickup' | 'return'>(initialTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync tab on modal open
      setActiveTab(initialTab);
      setCopied(false);
    }
  }, [isOpen, initialTab]);

  const isPickup = activeTab === 'pickup';
  const currentStore = isPickup ? pickupStore : returnStore || pickupStore;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentStore.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mapQuery =
    currentStore.lat && currentStore.lng
      ? `${currentStore.lat},${currentStore.lng}`
      : `${currentStore.name} ${currentStore.address}`.trim();

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

  const steps = isPickup
    ? [
        {
          title: t('storemap_p1_title').replace(/^[0-9]+\.\s*/, ''),
          desc: t('storemap_p1_body'),
        },
        {
          title: t('storemap_p2_title').replace(/^[0-9]+\.\s*/, ''),
          desc:
            currentStore.accessGuide && currentStore.accessGuide[routeToLanguage(lang)]
              ? `${currentStore.accessGuide[routeToLanguage(lang)]}。${t('storemap_p2_body')}`
              : t('storemap_p2_body'),
        },
        {
          title: t('storemap_p3_title').replace(/^[0-9]+\.\s*/, ''),
          desc: t('storemap_p3_body'),
        },
      ]
    : [
        {
          title: t('storemap_r1_title').replace(/^[0-9]+\.\s*/, ''),
          desc: t('storemap_r1_body'),
        },
        {
          title: t('storemap_r2_title').replace(/^[0-9]+\.\s*/, ''),
          desc: t('storemap_r2_body'),
        },
        {
          title: t('storemap_r3_title').replace(/^[0-9]+\.\s*/, ''),
          desc: t('storemap_r3_body'),
        },
      ];

  const hasMultipleStores = Boolean(
    returnStore &&
      (returnStore.name !== pickupStore.name || returnStore.address !== pickupStore.address)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="full" className="sm:max-w-2xl">
        {/* Header with Underline Tabs */}
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-5 pt-5 pb-2 sm:px-6 pr-14">
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              {t('storemap_title')}
            </DialogTitle>
          </div>

          {/* Underline Tabs */}
          {hasMultipleStores ? (
            <div className="flex gap-6 px-5 sm:px-6 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('pickup')}
                className={`pb-2.5 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  isPickup
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('storemap_tab_pickup')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('return')}
                className={`pb-2.5 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  !isPickup
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('storemap_tab_return')}
              </button>
            </div>
          ) : (
            <div className="flex gap-6 px-5 sm:px-6 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('pickup')}
                className={`pb-2.5 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  isPickup
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('storemap_tab_pickup')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('return')}
                className={`pb-2.5 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  !isPickup
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('storemap_tab_return')}
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <DialogBody className="space-y-6 p-5 sm:p-6">
          {/* 1. Real Google Maps Embed */}
          <div className="relative w-full h-48 sm:h-56 rounded-card overflow-hidden border border-border bg-muted">
            <iframe
              key={`${currentStore.name}-${activeTab}`}
              src={mapEmbedUrl}
              title={currentStore.name}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* 2. Store Information Section */}
          <div className="space-y-4 text-sm">
            {/* Branch name */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t('storemap_branch_name')}</h4>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {currentStore.name}
              </p>
            </div>

            {/* Branch address */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t('storemap_branch_address')}</h4>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground-secondary">{currentStore.address}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-success" />
                      <span className="text-success">{t('storemap_copied')}</span>
                    </>
                  ) : (
                    <span>{t('storemap_copy_addr')}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Contact number */}
            {currentStore.phone && (
              <div>
                <h4 className="text-sm font-bold text-foreground">{t('storemap_branch_phone')}</h4>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm text-foreground-secondary">{currentStore.phone}</span>
                  <a
                    href={`tel:${currentStore.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    <span>{t('storemap_call')}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Business hours */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t('storemap_branch_hours')}</h4>
              <p className="mt-1 text-sm text-foreground-secondary">
                {currentStore.hours.replace('(Everyday)', `(${t('storeguide_everyday')})`)}{' '}
                <span className="text-xs text-muted-foreground">{t('storemap_localtime_note')}</span>
              </p>
            </div>
          </div>

          {/* 3. Pick-up / Drop-off Instructions */}
          <div className="border-t border-border/70 pt-5">
            <h4 className="text-sm font-bold text-foreground mb-3">
              {isPickup ? t('storemap_instructions_pickup') : t('storemap_instructions_return')}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-foreground-secondary leading-relaxed bg-muted/50 p-4 sm:p-5 rounded-card border border-border/40">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-foreground shrink-0 font-medium">•</span>
                  <div>
                    <strong className="text-foreground font-semibold">{step.title}</strong>{' '}
                    <span>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
