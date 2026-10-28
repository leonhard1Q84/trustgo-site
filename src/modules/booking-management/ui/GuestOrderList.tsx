'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/useI18n';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  CarFront,
  Copy,
  Check,
  CreditCard,
  DoorOpen,
  Fuel,
  Gauge,
  PlusCircle,
  ChevronRight,
  Users,
} from 'lucide-react';
import { BookingRecord, GuestOrderFilter } from '../domain/types';
import {
  localizeVehicleName,
  localizeVehicleCategory,
  localizeTransmission,
  localizeFuelType,
  splitVehicleName,
} from '@/modules/rental-search/domain/vehicleLocalization';
import { canPayBooking } from '../domain/lifecycle';
import { bookingStatusKey, paymentStatusKey } from '../domain/status-presentation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { formatTripDateTime } from '@/modules/rate-details/domain/format-trip';

interface GuestOrderListProps {
  orders: BookingRecord[];
  lang: string;
}

export function GuestOrderList({ orders, lang }: GuestOrderListProps) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<GuestOrderFilter>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch {
        /* Keep the existing copy action available if access was denied. */
      }
    }
  };

  const matchesFilter = (order: BookingRecord, f: GuestOrderFilter): boolean => {
    if (f === 'all') return true;
    if (f === 'pending_payment') return order.status === 'PENDING_PAYMENT';
    if (f === 'upcoming') {
      return order.status === 'CONFIRMED' || order.status === 'ACTIVE_RENTAL';
    }
    if (f === 'closed') {
      return order.status === 'COMPLETED' || order.status === 'CANCELLED';
    }
    return true;
  };

  const counts = useMemo(() => {
    return {
      all: orders.length,
      upcoming: orders.filter((o) => matchesFilter(o, 'upcoming')).length,
      pending_payment: orders.filter((o) => matchesFilter(o, 'pending_payment')).length,
      closed: orders.filter((o) => matchesFilter(o, 'closed')).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => matchesFilter(o, filter));
  }, [orders, filter]);

  const filterTabs: Array<{
    id: GuestOrderFilter;
    label: string;
    count: number;
  }> = [
    { id: 'all', label: t('bm_tab_all'), count: counts.all },
    { id: 'upcoming', label: t('bm_tab_active'), count: counts.upcoming },
    {
      id: 'pending_payment',
      label: t('bm_tab_pending'),
      count: counts.pending_payment,
    },
    { id: 'closed', label: t('bm_tab_past'), count: counts.closed },
  ];

  const statusBadge = (order: BookingRecord) => {
    const map: Record<string, { cls: string; label: string }> = {
      CONFIRMED: { cls: 'bg-success-light text-success', label: t('bm_state_confirmed') },
      ACTIVE_RENTAL: { cls: 'bg-muted text-foreground-secondary', label: t('bm_state_active') },
      PENDING_PAYMENT: { cls: 'bg-warning-light text-warning', label: t('bm_state_pending') },
      COMPLETED: { cls: 'bg-muted text-foreground-secondary', label: t('bm_state_completed') },
      CANCELLED: { cls: 'bg-destructive-light text-destructive', label: t('bm_state_cancelled') },
    };
    const badge = map[order.status] ?? map.COMPLETED;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        {order.closureReason === 'payment_timeout'
          ? t(bookingStatusKey(order))
          : order.status === 'PENDING_PAYMENT' &&
              ['processing', 'unknown', 'failed'].includes(order.paymentStatus ?? '')
            ? t(paymentStatusKey(order))
            : badge.label}
      </span>
    );
  };

  return (
    <Tabs
      value={filter}
      onValueChange={(value) => setFilter(value as GuestOrderFilter)}
      className="space-y-6"
    >
      {/* Text tabs (Component Library §2.8) + neutral secondary action */}
      <div className="flex items-end justify-between gap-4 border-b border-border">
        <TabsList
          className="-mb-px flex min-w-0 items-center gap-6 overflow-x-auto scrollbar-none"
          aria-label={t('guest_list_title')}
        >
          {filterTabs.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`inline-flex h-11 shrink-0 items-center gap-1.5 border-b-2 text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-foreground font-semibold text-foreground'
                    : 'border-transparent text-foreground-secondary hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{tab.count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <Link
          href={`/${lang}`}
          className="mb-2 hidden min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline md:inline-flex"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          {t('bm_book_another')}
        </Link>
      </div>

      <TabsContent key={filter} value={filter}>
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <CarFront className="mx-auto h-10 w-10 text-foreground-secondary" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-foreground">
              {counts.all > 0 ? t('bm_empty_category') : t('bm_empty_active')}
            </h3>
            <p className="mt-1 text-sm text-foreground-secondary">
              {counts.all > 0 ? t('bm_empty_hint_tab') : t('bm_empty_hint_book')}
            </p>
            {counts.all > 0 ? (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                {t('bm_tab_all')}
              </button>
            ) : (
              <Link
                href={`/${lang}`}
                className="mt-5 inline-flex h-12 items-center gap-1 rounded-control bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                {t('bm_explore_fleet')}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredOrders.map((order) => {
              const isPendingPayment = order.status === 'PENDING_PAYMENT';
              const detailHref = `/${lang}/booking/${order.confirmationCode}`;
              const sameReturn = order.trip.returnLocation === order.trip.pickupLocation;
              return (
                <li
                  key={order.confirmationCode}
                  className="overflow-hidden rounded-card border border-border bg-background"
                >
                  {/* Header strip: confirmation code + status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5 md:px-5">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(order.confirmationCode)}
                      title={t('bm_copy_code_hint')}
                      className="inline-flex min-h-8 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <span className="sr-only">{t('bm_confirm_code_label')}</span>
                      <span className="font-mono font-semibold tracking-wide text-foreground">
                        {order.confirmationCode}
                      </span>
                      {copiedCode === order.confirmationCode ? (
                        <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                    {statusBadge(order)}
                  </div>

                  {/* Body: vehicle / trip timeline / price & actions */}
                  <div className="flex flex-col gap-5 p-4 md:p-5 lg:flex-row lg:items-center lg:gap-6">
                    {/* Vehicle */}
                    <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:items-center sm:gap-4">
                      <Link
                        href={detailHref}
                        className="relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-control bg-muted sm:w-36"
                      >
                        <Image
                          src={order.vehicle.image}
                          alt={localizeVehicleName(order.vehicle.name, lang)}
                          fill
                          sizes="(min-width: 640px) 144px, 112px"
                          className="object-contain"
                        />
                      </Link>
                      <div className="min-w-0 space-y-1.5">
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                          <Link href={detailHref} className="hover:underline underline-offset-4">
                            {splitVehicleName(order.vehicle.name, lang).model}
                          </Link>
                          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                            {[
                              splitVehicleName(order.vehicle.name, lang).orSimilar,
                              localizeVehicleCategory(order.vehicle.category, lang),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </h3>
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-6 text-foreground-secondary">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            {order.vehicle.seats}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="h-4 w-4" aria-hidden="true" />
                            {order.vehicle.bags}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <DoorOpen className="h-4 w-4" aria-hidden="true" />
                            {order.vehicle.doors}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Gauge className="h-4 w-4" aria-hidden="true" />
                            {localizeTransmission(order.vehicle.gear, lang)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Fuel className="h-4 w-4" aria-hidden="true" />
                            {localizeFuelType(order.vehicle.fuel, lang)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Trip timeline: pickup → return on a vertical rail */}
                    <div className="w-full shrink-0 lg:w-80 lg:border-l lg:border-border lg:pl-6">
                      <ol>
                        <li className="relative pb-4 pl-5">
                          <span
                            className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-success"
                            aria-hidden="true"
                          />
                          <span
                            className="absolute bottom-0 left-[3.5px] top-4 w-px bg-border"
                            aria-hidden="true"
                          />
                          <p className="text-caption font-medium text-foreground-secondary">
                            {t('bm_pickup')}
                          </p>
                          <p className="mt-0.5 text-body font-semibold tabular-nums text-foreground">
                            {formatTripDateTime(order.trip.pickupDateTime, order.trip, lang)}
                          </p>
                          <p className="truncate text-caption text-foreground-secondary">
                            {order.trip.pickupLocation}
                          </p>
                        </li>
                        <li className="relative pl-5">
                          <span
                            className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-foreground"
                            aria-hidden="true"
                          />
                          <p className="text-caption font-medium text-foreground-secondary">
                            {t('bm_return')}
                          </p>
                          <p className="mt-0.5 text-body font-semibold tabular-nums text-foreground">
                            {formatTripDateTime(order.trip.returnDateTime, order.trip, lang)}
                          </p>
                          <p className="truncate text-caption text-foreground-secondary">
                            {order.trip.returnLocation}
                          </p>
                        </li>
                      </ol>
                      <p className="mt-2.5 flex items-center justify-between pl-5 text-caption text-muted-foreground">
                        <span>{sameReturn ? '' : t('bm_one_way')}</span>
                        <span className="font-semibold tabular-nums text-foreground-secondary">
                          {order.trip.rentalDays} {t('bm_days')}
                        </span>
                      </p>
                    </div>

                    {/* Price & actions */}
                    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border pt-3 lg:w-44 lg:flex-col lg:items-end lg:justify-center lg:border-0 lg:pt-0">
                      <div className="lg:text-right">
                        <p className="text-xs text-muted-foreground">
                          {isPendingPayment ? t('bm_amount_due') : t('bm_total_paid')}
                        </p>
                        <p className="text-lg font-semibold tabular-nums text-foreground">
                          {order.pricing.currency}
                          {(isPendingPayment
                            ? order.pricing.payNow
                            : (order.paidAmount ?? 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                      {isPendingPayment && canPayBooking(order) ? (
                        <Link
                          href={`/${lang}/checkout/${order.confirmationCode}`}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                        >
                          <CreditCard className="h-4 w-4" aria-hidden="true" />
                          {t('bm_complete_payment')}
                        </Link>
                      ) : (
                        <Link
                          href={detailHref}
                          className="inline-flex min-h-11 items-center gap-0.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {t('bm_view_details')}
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
