'use client';

import { formatTripDateTime } from '@/modules/rate-details/domain/format-trip';
import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/useI18n';
import { type RouteLanguage } from '@/i18n/locales';
import { Check, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { BookingRecord } from '../domain/types';
import {
  localizeVehicleName,
  localizeVehicleCategory,
  localizeTransmission,
  localizeFuelType,
} from '@/modules/rental-search/domain/vehicleLocalization';

interface VehicleTripCardProps {
  booking: BookingRecord;
  lang?: string;
}

export function VehicleTripCard({ booking, lang }: VehicleTripCardProps) {
  const { t, routeLang } = useI18n(lang as RouteLanguage);
  const activeLang = lang || routeLang;
  const { vehicle, trip, insurance } = booking;

  return (
    <section className="bg-background rounded-card border border-border overflow-hidden">
      {/* 1. Vehicle Header & Specs */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Vehicle Thumbnail */}
          <div className="relative h-40 w-full sm:h-28 sm:w-48 shrink-0 rounded-control bg-muted overflow-hidden border border-border">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Vehicle Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-bold text-primary">
                {localizeVehicleCategory(vehicle.category, activeLang)}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {localizeVehicleName(vehicle.name, activeLang)}
            </h2>

            {/* Badges / Specs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-foreground-secondary">
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border">
                {vehicle.seats} {t('common_seats')}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border">
                {vehicle.bags} {t('common_bags')}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border">
                {localizeTransmission(vehicle.gear, activeLang)}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border">
                {localizeFuelType(vehicle.fuel, activeLang)}
              </span>
            </div>

            {/* Insurance & Mileage Included */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-foreground-secondary">
              <div className="flex items-center gap-1.5 text-success font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  {insurance.name} ({insurance.damageExcess === 0 ? '$0 Excess' : `$${insurance.damageExcess} Excess`})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-success font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>{t('fleet_feature_unlimited_mileage')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Rental Trip Timeline Bar */}
      <div className="border-t border-border bg-muted/50 px-5 py-4">
        <div className="flex items-center justify-between pb-2 text-xs text-muted-foreground border-b border-border/80 mb-3">
          <div className="flex items-center gap-1.5 font-bold text-foreground-secondary">
            <Calendar className="w-4 h-4 text-foreground-secondary" />
            <span>{t('bm_trip_summary')}</span>
          </div>
          <div className="flex items-center gap-1 text-success text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('bm_voucher_guaranteed')}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          {/* Pick-up */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{t('bm_pickup')}</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {formatTripDateTime(trip.pickupDateTime, trip, activeLang)}
            </p>
            <p className="text-xs text-foreground-secondary truncate">
              {trip.pickupLocation}
            </p>
          </div>

          {/* Rental Duration Pill */}
          <div className="flex sm:flex-col items-center justify-center gap-1.5 py-2 sm:py-0 sm:px-4 border-y sm:border-y-0 sm:border-x border-border">
            <span className="text-xs font-semibold bg-muted text-foreground px-3 py-1 rounded-full">
              {trip.rentalDays} {t('bm_days')}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </div>

          {/* Return */}
          <div className="space-y-1 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-warm-strong">
              <span className="w-2 h-2 rounded-full bg-warm" />
              <span>{t('bm_return')}</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {formatTripDateTime(trip.returnDateTime, trip, activeLang)}
            </p>
            <p className="text-xs text-foreground-secondary truncate">
              {trip.returnLocation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
