'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Timer, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { usePendingCheckouts } from '../application/use-pending-checkouts';
import { formatHoldTime, holdSeconds } from '../domain/pending-checkout';
import { localizeVehicleName } from '@/modules/rental-search/domain/vehicleLocalization';

/** All data is reloaded under the current server session; nothing is persisted. */
export function GlobalPaymentReminder() {
  const { t, routeLang } = useI18n();
  const pathname = usePathname();
  const orders = usePendingCheckouts();
  const [collapsedCode, setCollapsedCode] = useState<string | null>(null);
  const order = orders[0];
  if (!order || pathname.split('/')[2] === 'checkout') return null;
  const remaining = holdSeconds(order.paymentDeadline);
  const urgent = remaining <= 180;
  const time = formatHoldTime(remaining);

  if (collapsedCode === order.confirmationCode) {
    return (
      <aside className="fixed right-3 top-1/2 z-40" aria-label={t('ck_hold_global_title')}>
        <Button variant="secondary" className="h-auto flex-col gap-1 border-warning bg-warning-light px-3 py-2 shadow-raised"
          onClick={() => setCollapsedCode(null)} aria-label={t('ck_hold_expand')}>
          <Timer className="size-5 text-warning" aria-hidden="true" />
          <span className="text-caption text-foreground">{t('rental_status_unpaid')}</span>
          <span className="font-mono tabular-nums text-warning" role="timer" aria-live="off">{time}</span>
        </Button>
      </aside>
    );
  }

  return (
    <aside aria-label={t('ck_hold_global_title')} className="border-b border-warning/30 bg-warning-light text-foreground">
      <div className="mx-auto flex max-w-default flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Timer className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <div className="min-w-0 text-body">
            <p className="font-semibold">{t(urgent ? 'ck_hold_warning' : 'ck_hold_global_title')}</p>
            <p className="break-words text-foreground-secondary">{localizeVehicleName(order.vehicleName, routeLang)}</p>
            {orders.length > 1 && (
              <Link className="inline-flex min-h-11 items-center text-primary underline" href={`/${routeLang}/manage-booking`}>
                {t('ck_hold_more').replace('{count}', String(orders.length))}
              </Link>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="sm:order-last" onClick={() => setCollapsedCode(order.confirmationCode)}
          aria-label={t('ck_hold_collapse')}><X className="size-5" aria-hidden="true" /></Button>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 pl-8 sm:w-auto sm:pl-0">
          <div>
            <p className="text-caption text-foreground-secondary">{t('ck_hold_expires')}</p>
            <span className="font-mono text-title font-bold tabular-nums text-warning" role="timer" aria-live="off">{time}</span>
          </div>
          <Button asChild className="h-auto min-h-11 gap-2 whitespace-normal px-4 py-2">
            <Link href={`/${routeLang}/checkout/${encodeURIComponent(order.confirmationCode)}`}>
              {t('ck_hold_continue')}<ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
