'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BookingRecord } from '../domain/types';
import { RentalError } from '@/modules/reservation/domain/validation';
import { bookingAccessRecoveryPath } from '../domain/access-recovery';
import { getBookingByConfirmationCode } from './booking-store';
import { subscribeBookingChanges } from './booking-events';
import { createBookingSync } from './booking-sync';

export function useBookingSync(initialBooking: BookingRecord, code: string, lang: string, surface: 'booking' | 'checkout') {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState({ code, booking: initialBooking, error: null as Error | null });
  const latestBooking = useRef(initialBooking);
  const sync = useRef<ReturnType<typeof createBookingSync> | null>(null);
  useEffect(() => {
    latestBooking.current = initialBooking;
    const current = createBookingSync({
      load: () => getBookingByConfirmationCode(code),
      onBooking: booking => {
        latestBooking.current = booking;
        setSnapshot({ code, booking, error: null });
      },
      onError: error => {
        const failure = error instanceof Error ? error : new RentalError('service_unavailable', 503);
        setSnapshot(previous => ({ code, booking: previous.code === code ? previous.booking : initialBooking, error: failure }));
        if (failure instanceof RentalError && failure.code === 'booking_not_found') {
          router.replace(bookingAccessRecoveryPath(lang, `/${lang}/${surface}/${encodeURIComponent(code)}`));
        }
      },
    });
    sync.current = current;
    const visibleRefresh = () => { if (document.visibilityState === 'visible') void current.refresh(); };
    void current.refresh();
    const unsubscribe = subscribeBookingChanges(visibleRefresh);
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    const timer = setInterval(visibleRefresh, 5000);
    return () => {
      current.stop();
      clearInterval(timer);
      unsubscribe();
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
    };
  }, [code, lang, router, surface, initialBooking]);
  const updateBooking = useCallback((value: BookingRecord | ((current: BookingRecord) => BookingRecord)) => {
    sync.current?.publish(typeof value === 'function' ? value(latestBooking.current) : value);
  }, []);
  const booking = snapshot.code === code ? snapshot.booking : initialBooking;
  const error = snapshot.code === code ? snapshot.error : null;
  return { booking, error, updateBooking };
}
