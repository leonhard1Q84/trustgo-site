'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import {
  MapPin,
  Clock,
  Bus,
  Copy,
  Check,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { RentalTripDetails } from '@/modules/rate-details/public-api';
import { buildDepotStoreInfo } from '@/modules/rate-details/domain/depot-info';

interface DepotHandoverSectionProps {
  trip: RentalTripDetails;
  depositAmount?: number;
  currency?: string;
}

export function DepotHandoverSection({
  trip,
  depositAmount = 300,
  currency = '$',
}: DepotHandoverSectionProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'pickup' | 'return'>('pickup');
  const [copied, setCopied] = useState(false);

  const isPickup = activeTab === 'pickup';
  const currentDepotName = isPickup ? trip.pickupLocation : trip.returnLocation;
  const currentDepot = buildDepotStoreInfo(currentDepotName, currentDepotName,
    undefined, isPickup ? trip.pickupStoreCode : trip.returnStoreCode);
  const currentDepotAddress = currentDepot.address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentDepotAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    currentDepotName + ' ' + currentDepotAddress
  )}`;

  return (
    <section className="bg-background rounded-card border border-border overflow-hidden">
      {/* 1. Header with Tab Switcher */}
      <div className="border-b border-border bg-muted/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-foreground-secondary" />
            <h3 className="text-base font-bold text-foreground">
              {t('bm_guide_title')}
            </h3>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex rounded-control bg-muted p-1 border border-border text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('pickup')}
              className={`px-3 py-1.5 rounded-control transition-all cursor-pointer ${
                isPickup
                  ? 'bg-background text-primary shadow-raised'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              {t('bm_guide_pickup_tab')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('return')}
              className={`px-3 py-1.5 rounded-control transition-all cursor-pointer ${
                !isPickup
                  ? 'bg-background text-warm-strong shadow-raised'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              {t('bm_guide_return_tab')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* 2. Depot Address Bar with Copy Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-muted p-3.5 border border-border">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  isPickup
                    ? 'bg-brand-light text-primary border border-brand/20'
                    : 'bg-warm-light text-warm-strong border border-warm/20'
                }`}
              >
                {isPickup ? t('bm_pickup_depot') : t('bm_return_depot')}
              </span>
              <h4 className="text-sm font-bold text-foreground truncate">
                {currentDepotName}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{currentDepotAddress}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 rounded-control border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-bold text-foreground transition-colors cursor-pointer shrink-0 shadow-raised"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-foreground-secondary" />
            )}
            <span>{copied ? t('bm_copied_address') : t('bm_copy_address')}</span>
          </button>
        </div>

        {/* 3. Stylized Visual Map Preview Container with Pin Badge */}
        <div className="relative overflow-hidden rounded-control border border-border bg-accent">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            {/* SVG Road Grid Pattern */}
            <svg
              className="absolute inset-0 h-full w-full opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 600 240"
            >
              <path
                d="M0 70 Q 150 35, 300 120 T 600 60"
                stroke="currentColor"
                className="text-border-strong"
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M80 0 L 220 240 M 480 0 L 360 240"
                stroke="currentColor"
                className="text-border-strong"
                strokeWidth="8"
                fill="none"
              />
              <path
                d="M0 180 Q 250 210, 480 140 T 600 190"
                stroke="currentColor"
                className="text-border"
                strokeWidth="8"
                fill="none"
              />
              <rect
                x="120"
                y="40"
                width="70"
                height="40"
                rx="4"
                fill="currentColor"
                className="text-muted"
                opacity="0.8"
              />
              <rect
                x="420"
                y="100"
                width="90"
                height="50"
                rx="4"
                fill="currentColor"
                className="text-muted"
                opacity="0.8"
              />
              <rect
                x="290"
                y="20"
                width="60"
                height="35"
                rx="4"
                fill="currentColor"
                className="text-muted"
                opacity="0.8"
              />
            </svg>

            {/* Map Pin Floating Card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="rounded-control bg-background p-2.5 border border-border max-w-[280px] text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <span className="rounded bg-brand px-1.5 py-0.5 text-white text-xs">
                    TrustGo
                  </span>
                  <span className="text-foreground truncate">{currentDepotName}</span>
                </div>
                <p className="text-xs text-foreground-secondary truncate">
                  {currentDepotAddress}
                </p>
              </div>
              <div className="h-2.5 w-2.5 rotate-45 bg-background border-r border-b border-border -mt-1.5" />
              <div className="h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-raised -mt-0.5" />
            </div>

            {/* External Google Maps Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 rounded-control bg-background/95 backdrop-blur-xs border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-background transition-colors shadow-raised flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-foreground-secondary" />
              <span>{t('bm_view_google_maps')}</span>
            </a>
          </div>
        </div>

        {/* 4. Business Hours & Service Guidance */}
        <div className="space-y-3 pt-1 text-xs">
          {/* Operating Hours */}
          <div className="flex items-start gap-2.5 rounded-control bg-muted p-3.5 border border-border">
            <Clock className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">
                {t('bm_business_hours')}
              </span>
              <p className="text-foreground-secondary">
                {currentDepot.hours}
              </p>
            </div>
          </div>

          {/* Handover & Shuttle Details */}
          <div className="flex items-start gap-2.5 rounded-control bg-muted p-3.5 border border-border">
            <Bus className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-foreground block">
                {t('bm_shuttle_title')}
              </span>
              <ol className="text-foreground-secondary space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  After collecting your checked bags, proceed outside to the airport ground transportation island.
                </li>
                <li>
                  Wait at the purple &quot;Rental Car Shuttles&quot; canopy. Look for the Sky Blue <strong>{t('bm_shuttle_name')}</strong>.
                </li>
                <li>
                  Shuttles run every 8–10 minutes. The ride takes approximately 5 minutes to the terminal hub.
                </li>
                <li>
                  Present your original passport, physical driver&apos;s license, and credit card for the {currency}{depositAmount} pre-auth deposit.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
