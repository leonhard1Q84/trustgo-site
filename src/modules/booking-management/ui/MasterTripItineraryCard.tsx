'use client';

import { formatTripDateTime } from '@/modules/rate-details/domain/format-trip';
import { buildDepotStoreInfo } from '@/modules/rate-details/domain/depot-info';
import React, { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/useI18n';
import { type RouteLanguage } from '@/i18n/locales';
import {
  Check,
  Calendar,
  ArrowRight,
  Clock,
  Bus,
  MapPin,
  Copy,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { BookingRecord } from '../domain/types';
import {
  localizeVehicleName,
  localizeVehicleCategory,
  localizeTransmission,
  localizeFuelType,
} from '@/modules/rental-search/domain/vehicleLocalization';

interface MasterTripItineraryCardProps {
  booking: BookingRecord;
  lang?: string;
}

export function MasterTripItineraryCard({ booking, lang }: MasterTripItineraryCardProps) {
  const { t, routeLang } = useI18n(lang as RouteLanguage);
  const activeLang = lang || routeLang;
  const { vehicle, trip, insurance } = booking;

  const [activeTab, setActiveTab] = useState<'pickup' | 'return'>('pickup');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const isPickup = activeTab === 'pickup';
  const currentDepotName = isPickup ? trip.pickupLocation : trip.returnLocation;
  const currentDepot = buildDepotStoreInfo(vehicle.supplier.name, currentDepotName,
    vehicle.supplier.locationType, isPickup ? trip.pickupStoreCode : trip.returnStoreCode);
  const currentDepotAddress = currentDepot.address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentDepotAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    currentDepotName + ' ' + currentDepotAddress
  )}`;

  return (
    <section className="bg-background rounded-card border border-border overflow-hidden">
      {/* ── Part A: Vehicle Info & Specs ── */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {/* Car Image Thumbnail */}
          <div className="relative h-36 w-full sm:h-28 sm:w-44 shrink-0 rounded-control bg-muted overflow-hidden border border-border">
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 176px"
            />
          </div>

          {/* Vehicle Title & Specs */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-foreground-secondary">
                {localizeVehicleCategory(vehicle.category, activeLang)}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {localizeVehicleName(vehicle.name, activeLang)}
            </h2>

            {/* Spec Chips Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-foreground-secondary">
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border font-medium">
                {vehicle.seats} {t('common_seats')}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border font-medium">
                {vehicle.bags} {t('common_bags')}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border font-medium">
                {localizeTransmission(vehicle.gear, activeLang)}
              </span>
              <span className="bg-muted px-2.5 py-1 rounded-control border border-border font-medium">
                {localizeFuelType(vehicle.fuel, activeLang)}
              </span>
            </div>

            {/* Inclusions */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-success font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {insurance.name} ({insurance.damageExcess === 0 ? '$0 Excess' : `$${insurance.damageExcess} Excess`})
                </span>
              </div>
              <div className="flex items-center gap-1 text-success font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{t('fleet_feature_unlimited_mileage')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Part B: Rental Duration Timeline ── */}
      <div className="border-t border-border bg-muted/40 px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between pb-2 text-xs text-muted-foreground border-b border-border/80 mb-3">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Calendar className="w-3.5 h-3.5 text-foreground-secondary" />
            <span>{t('bm_trip_summary')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <span>Store Local Time</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          {/* Pick-up */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              <span>{t('bm_pickup')}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              {formatTripDateTime(trip.pickupDateTime, trip, activeLang)}
            </p>
            <p className="text-xs text-foreground-secondary truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span>{trip.pickupLocation}</span>
            </p>
          </div>

          {/* Rental Duration Pill */}
          <div className="flex sm:flex-col items-center justify-center gap-1 py-1 sm:py-0 sm:px-4 border-y sm:border-y-0 sm:border-x border-border">
            <span className="text-xs font-bold bg-foreground text-background px-2.5 py-0.5 rounded-full">
              {trip.rentalDays} {t('bm_days')}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </div>

          {/* Return */}
          <div className="space-y-0.5 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-foreground-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              <span>{t('bm_return')}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              {formatTripDateTime(trip.returnDateTime, trip, activeLang)}
            </p>
            <p className="text-xs text-foreground-secondary truncate flex items-center gap-1 sm:justify-end">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span>{trip.returnLocation}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Part C: Depot Handover Guide & Interactive Map ── */}
      <div className="border-t border-border p-4 sm:p-5 space-y-4">
        {/* Tabs Switcher */}
        <div className="flex items-center gap-3 border-b border-border pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('pickup')}
            className={`pb-1 text-xs font-bold transition-colors relative cursor-pointer ${
              isPickup
                ? 'text-foreground after:absolute after:bottom-[-11px] after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('bm_guide_pickup_tab')}
          </button>
          <span className="text-border text-xs">|</span>
          <button
            type="button"
            onClick={() => setActiveTab('return')}
            className={`pb-1 text-xs font-bold transition-colors relative cursor-pointer ${
              !isPickup
                ? 'text-foreground after:absolute after:bottom-[-11px] after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('bm_guide_return_tab')}
          </button>
        </div>

        {/* Depot Name & Address Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-muted/60 p-3 border border-border">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {currentDepotName}
              </h4>
              <span className="rounded bg-brand-light text-primary px-1.5 py-0.5 text-[10px] font-semibold">
                {isPickup ? t('bm_pickup_depot') : t('bm_return_depot')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-foreground-secondary">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{currentDepotAddress}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1 rounded-control border border-border bg-background hover:bg-muted px-2.5 py-1 text-xs font-semibold text-foreground transition-colors cursor-pointer shrink-0"
          >
            {copiedAddress ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{copiedAddress ? t('bm_copied_address') : t('bm_copy_address')}</span>
          </button>
        </div>

        {/* Stylized Visual Map Preview Container */}
        <div className="relative overflow-hidden rounded-control border border-border bg-muted/30">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
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
                className="text-border"
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M80 0 L 220 240 M 480 0 L 360 240"
                stroke="currentColor"
                className="text-border"
                strokeWidth="8"
                fill="none"
              />
              <path
                d="M0 180 Q 250 210, 480 140 T 600 190"
                stroke="currentColor"
                className="text-border-strong"
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
              <div className="rounded-control bg-background p-2.5 border border-border max-w-[260px] text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <span className="rounded bg-primary px-1.5 py-0.5 text-white text-[10px]">
                    TrustGo
                  </span>
                  <span className="text-foreground truncate">{currentDepotName}</span>
                </div>
                <p className="text-[11px] text-foreground-secondary truncate">
                  {currentDepotAddress}
                </p>
              </div>
              <div className="h-2 w-2 rotate-45 bg-background border-r border-b border-border -mt-1" />
              <div className="h-3 w-3 rounded-full bg-primary border-2 border-background -mt-0.5" />
            </div>

            {/* External Google Maps Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2.5 right-2.5 rounded-control bg-background/95 backdrop-blur-xs border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3 text-primary" />
              <span>{t('bm_view_google_maps')}</span>
            </a>
          </div>
        </div>

        {/* Operating Hours & Shuttle Guidance */}
        <div className="space-y-2.5 pt-0.5 text-xs">
          {/* Operating Hours */}
          <div className="flex items-start gap-2.5 rounded-control bg-muted/50 p-3 border border-border">
            <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">
                {t('bm_business_hours')}
              </span>
              <p className="text-foreground-secondary">
                {currentDepot.hours}
              </p>
            </div>
          </div>

          {/* Shuttle Directions */}
          <div className="flex items-start gap-2.5 rounded-control bg-muted/50 p-3 border border-border">
            <Bus className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-foreground block">
                {t('bm_shuttle_title')}
              </span>
              <ol className="text-foreground-secondary space-y-1 list-decimal list-inside leading-relaxed">
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
                  Present your original passport, physical driver&apos;s license, and credit card for the ${booking.vehicle.depositAmount} pre-auth deposit.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
