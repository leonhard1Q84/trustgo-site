'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { CalendarDays, ReceiptText, ShieldCheck, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { Dialog, DialogContent, DialogTitle, DialogBody, DialogFooter } from '@/shared/ui/dialog';
import { GuestLookupContext, type GuestLookupOptions } from '../application/guest-lookup-context';
import { listAccessibleBookings } from '../application/booking-store';
import { verifiedBookingReturnPath } from '../domain/access-recovery';
import type { BookingRecord } from '../domain/types';
import { GuestLookupUrlTrigger } from './GuestLookupUrlTrigger';
import { RentalError } from '@/modules/reservation/domain/validation';
import { useLookupViewport } from '../application/use-lookup-viewport';

const GuestBookingLookupCard = dynamic(
  () => import('./GuestBookingLookupCard').then((module) => module.GuestBookingLookupCard),
  {
    loading: () => <Skeleton className="h-64 rounded-control" />,
  }
);
type Intent = GuestLookupOptions & {
  id: number;
  pathname: string;
  checking: boolean;
  errorCode?: string;
};

export function GuestLookupProvider({ children }: { children: ReactNode }) {
  const { t, routeLang: lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const sequence = useRef(0);
  const pendingEntry = useRef<number | null>(null);
  const busy = useRef(false);
  const trigger = useRef<HTMLElement | null>(null);
  const [searching, setSearching] = useState(false);
  const [intent, setIntent] = useState<Intent | null>(null);
  // Session checks stay invisible; only missing access or a request error opens the dialog.
  const open = Boolean(intent && !intent.checking && intent.pathname === pathname);
  const viewportStyle = useLookupViewport(open);
  const begin = useCallback(
    (options: GuestLookupOptions = {}, checking = false) => {
      if (busy.current) return null;
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && !focused.closest('[data-guest-lookup]')) {
        trigger.current = focused;
      }
      const next = { returnTo: options.returnTo, id: ++sequence.current, pathname, checking };
      pendingEntry.current = null;
      setIntent(next);
      return next;
    },
    [pathname]
  );
  const openLookup = useCallback(
    (options?: GuestLookupOptions) => {
      begin(options);
    },
    [begin]
  );
  const openBookingEntry = useCallback(
    async (options?: GuestLookupOptions) => {
      if (pendingEntry.current !== null) return;
      const next = begin(options, true);
      if (!next) return;
      pendingEntry.current = next.id;
      try {
        const result = await listAccessibleBookings();
        if (sequence.current !== next.id) return;
        const target = result.orders
          .map((order) => verifiedBookingReturnPath(next.returnTo, lang, order.confirmationCode))
          .find(Boolean);
        if (target || (!next.returnTo && result.status === 'active')) {
          setIntent(null);
          router.push(target ?? `/${lang}/manage-booking/orders`);
        } else setIntent({ ...next, checking: false });
      } catch (error) {
        if (sequence.current === next.id)
          setIntent({
            ...next,
            checking: false,
            errorCode: error instanceof RentalError ? error.code : 'service_unavailable',
          });
      } finally {
        if (pendingEntry.current === next.id) pendingEntry.current = null;
      }
    },
    [begin, lang, router]
  );
  useEffect(
    () => () => {
      sequence.current += 1;
      pendingEntry.current = null;
      busy.current = false;
    },
    []
  );
  useEffect(() => {
    if (!intent || intent.pathname === pathname) return;
    // Ignore navigation cleanup if a newer entry has already opened on the destination.
    queueMicrotask(() => {
      if (sequence.current !== intent.id) return;
      sequence.current += 1;
      pendingEntry.current = null;
      busy.current = false;
      setSearching(false);
      setIntent(null);
    });
  }, [intent, pathname]);
  const context = useMemo(() => ({ openLookup, openBookingEntry }), [openLookup, openBookingEntry]);
  const close = () => {
    if (busy.current) return;
    sequence.current += 1;
    setIntent(null);
  };
  const success = (booking: BookingRecord) => {
    if (!intent || intent.id !== sequence.current) return;
    const target = verifiedBookingReturnPath(intent.returnTo, lang, booking.confirmationCode);
    setIntent(null);
    if (target) router.replace(target);
    else if (pathname !== `/${lang}/manage-booking/orders`)
      router.push(`/${lang}/manage-booking/orders`);
  };
  return (
    <GuestLookupContext.Provider value={context}>
      {children}
      <Suspense fallback={null}>
        <GuestLookupUrlTrigger />
      </Suspense>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent
          data-guest-lookup
          style={viewportStyle}
          variant="sheet"
          sheetBreakpoint="md"
          className="md:max-w-md"
          aria-describedby={undefined}
          hideCloseButton
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (trigger.current?.isConnected) trigger.current.focus();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-2">
            <DialogTitle className="text-2xl font-semibold">{t('guest_form_title')}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-3 shrink-0 rounded-full"
              onClick={close}
              disabled={searching}
              aria-label={t('common_close')}
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <DialogBody className="px-6 pt-5 pb-6">
            {intent?.errorCode ? (
              <div role="alert" className="space-y-5">
                <p className="text-sm text-foreground-secondary">
                  {t(`rental_${intent.errorCode}`)}
                </p>
                <Button className="w-full" onClick={() => void openBookingEntry(intent)}>
                  {t('error_action_retry')}
                </Button>
              </div>
            ) : (
              <GuestBookingLookupCard
                key={intent?.id}
                onLookupSuccess={success}
                onSearchingChange={(value) => {
                  if (intent?.id === sequence.current) {
                    busy.current = value;
                    setSearching(value);
                  }
                }}
              />
            )}
          </DialogBody>
          <DialogFooter className="border-border bg-muted">
            <div className="grid w-full grid-cols-3 gap-3 text-center text-xs text-foreground-secondary">
              {[
                { Icon: CalendarDays, key: 'guest_feature_trip' },
                { Icon: ReceiptText, key: 'guest_feature_cost' },
                { Icon: ShieldCheck, key: 'guest_feature_rules' },
              ].map(({ Icon, key }) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GuestLookupContext.Provider>
  );
}
