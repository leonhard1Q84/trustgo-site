'use client';

import { formatTripDateTime } from '@/modules/rate-details/domain/format-trip';
import React from 'react';
import { useI18n } from '@/i18n/useI18n';
import { type RouteLanguage } from '@/i18n/locales';
import Image from 'next/image';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  localizeVehicleName,
  localizeVehicleCategory,
  localizeTransmission,
} from '@/modules/rental-search/domain/vehicleLocalization';
import { RentalTripDetails, SpecialEquipmentSelection } from '@/modules/rate-details/public-api';
import { DriverDetails } from '@/modules/reservation/public-api';
import { MapPin, Calendar, User } from 'lucide-react';

interface CheckoutOrderSummaryProps {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  driver: DriverDetails;
  equipment: SpecialEquipmentSelection;
  insuranceName: string;
  totalAmount: number;
  currency: string;
  depositAmount: number;
  lang?: string;
}

export function CheckoutOrderSummary({
  vehicle,
  trip,
  driver,
  insuranceName,
  totalAmount,
  currency,
  depositAmount,
  lang,
}: CheckoutOrderSummaryProps) {
  const { t, routeLang } = useI18n(lang as RouteLanguage);
  const activeLang = lang || routeLang;
  return (
    <aside className="w-full lg:w-[380px] shrink-0 space-y-6">
      <div className="bg-background rounded-card p-6 border border-border shadow-overlay lg:sticky lg:top-24 space-y-5">
        {/* Header */}
        <div className="pb-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{t('ck_trip_details')}</h3>
        </div>

        {/* Vehicle Card Mini */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-border">
          <div className="relative w-20 h-16 rounded-control overflow-hidden bg-muted shrink-0 border border-border">
            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
          </div>
          <div>
            <span className="text-xs font-bold text-primary block">
              {localizeVehicleCategory(vehicle.category, activeLang)}
            </span>
            <h4 className="text-sm font-bold text-foreground leading-tight">
              {localizeVehicleName(vehicle.name, activeLang)}
            </h4>
            <span className="text-xs text-muted-foreground">
              {localizeTransmission(vehicle.gear, activeLang)}
            </span>
          </div>
        </div>

        {/* Trip Depot & Dates */}
        <div className="space-y-3 text-xs pb-4 border-b border-border">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs font-bold ">
                {t('ck_pickup_return_depot')}
              </span>
              <span className="font-semibold text-foreground">{trip.pickupLocation}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs font-bold ">
                {t('ck_rental_period').replace('{days}', String(trip.rentalDays))}
              </span>
              <span className="font-semibold text-foreground">
                {formatTripDateTime(trip.pickupDateTime, trip, activeLang)} &rarr; {formatTripDateTime(trip.returnDateTime, trip, activeLang)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-foreground-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs font-bold ">{t('ck_main_driver')}</span>
              <span className="font-semibold text-foreground">
                {driver.title} {driver.firstName} {driver.lastName}
              </span>
              <span className="text-xs text-muted-foreground block">{driver.email}</span>
            </div>
          </div>
        </div>

        {/* Selected Perks & Insurance */}
        <div className="space-y-2 text-xs pb-4 border-b border-border">
          <div className="flex justify-between items-center text-foreground-secondary">
            <span>{t('ck_protection')}</span>
            <span className="font-bold text-foreground">
              {insuranceName === 'Basic Cover' || insuranceName === 'basic'
                ? t('ic_pkg_basic_name')
                : insuranceName === 'Inclusive Protection' || insuranceName === 'inclusive'
                  ? t('ic_pkg_inclusive_name')
                  : insuranceName === 'Zero Excess Peace of Mind' || insuranceName === 'zero-excess'
                    ? t('ic_pkg_zero_name')
                    : insuranceName}
            </span>
          </div>
          <div className="flex justify-between items-center text-foreground-secondary">
            <span>{t('ck_mileage')}</span>
            <span className="font-semibold text-success">{t('ck_unlimited')}</span>
          </div>
          <div className="flex justify-between items-center text-foreground-secondary">
            <span>{t('ck_cancellation')}</span>
            <span className="font-semibold text-success">{t('ck_free_48h')}</span>
          </div>
        </div>

        {/* Total Price Section */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-bold text-foreground">{t('ck_total_due')}</span>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              {currency}
              {totalAmount}
            </span>
          </div>
          <span className="text-xs text-muted-foreground block">
            {t('ck_all_taxes_included')}
          </span>

          <div className="mt-3 p-3 rounded-control bg-muted border border-border text-xs text-foreground-secondary">
            <strong className="text-foreground block mb-0.5">{t('ck_deposit_label')}</strong>
            {t('ck_deposit_desc')
              .replace('{currency}', currency)
              .replace('{depositAmount}', String(depositAmount))}
          </div>
        </div>
      </div>
    </aside>
  );
}
