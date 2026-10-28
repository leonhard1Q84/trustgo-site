'use client';

import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { MapPin, Clock, Phone, Bus, Key, Fuel } from 'lucide-react';
import { RentalTripDetails } from '@/modules/rate-details/public-api';

interface DepotAccessGuideProps {
  trip: RentalTripDetails;
  fuelPolicy?: string;
  depositAmount?: number;
  currency?: string;
}

export function DepotAccessGuide({
  trip,
  depositAmount = 300,
  currency = '$',
}: DepotAccessGuideProps) {
  const { t } = useI18n();
  return (
    <div className="bg-background rounded-card p-5 sm:p-6 border border-border mb-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-brand" />
          <h2 className="text-xl font-bold text-foreground">{t('bm_guide_title')}</h2>
        </div>
        <p className="text-xs text-foreground-secondary mt-1">
          Everything you need to locate the rental desk and drive away smoothly.
        </p>
      </div>

      {/* Depot Address & Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pick-up Location */}
        <div className="p-5 rounded-card bg-muted border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <MapPin className="w-4 h-4" />
            <span>{t('bm_pickup_depot')}</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">{trip.pickupLocation}</h3>
          <p className="text-xs text-foreground-secondary">
            9000 Airport Blvd, Los Angeles, CA 90045 &middot; Terminal 2 Free Express Shuttle
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground-secondary pt-2 border-t border-border">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-foreground-secondary" />
              07:00 – 23:00 Daily
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-foreground-secondary" />
              +1 (310) 555-0199
            </span>
          </div>
        </div>

        {/* Return Location */}
        <div className="p-5 rounded-card bg-muted border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-warm-strong">
            <MapPin className="w-4 h-4" />
            <span>{t('bm_return_depot')}</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">{trip.returnLocation}</h3>
          <p className="text-xs text-foreground-secondary">
            Follow &quot;Rental Car Return&quot; overhead signs into the TrustGo Dedicated Return
            Bay.
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground-secondary pt-2 border-t border-border">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-warm-strong" />
              24/7 Key Drop Box Available
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-warm-strong" />
              Return with full tank
            </span>
          </div>
        </div>
      </div>

      {/* Step by Step Handover */}
      <div className="p-5 rounded-card bg-brand-light/50 border border-brand/20 space-y-3">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
          <Bus className="w-4 h-4 text-foreground-secondary" />
          <span>{t('bm_shuttle_title')}</span>
        </h4>
        <ol className="text-xs text-foreground-secondary space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            After collecting your checked bags, proceed outside to the ground transportation island.
          </li>
          <li>
            Wait at the purple &quot;Rental Car Shuttles&quot; canopy. Look for the Sky Blue{' '}
            <strong>{t('bm_shuttle_name')}</strong>.
          </li>
          <li>
            Shuttles depart every 8–10 minutes. The ride to the main depot hub takes approximately 5
            minutes.
          </li>
          <li>
            Present your physical driver&apos;s license, original passport, and credit card for the{' '}
            {currency}
            {depositAmount} pre-authorization deposit.
          </li>
        </ol>
      </div>
    </div>
  );
}
