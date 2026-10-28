'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/customer-account/public-api';
import { listAccessibleBookings, type BookingListResult } from './booking-store';
import { subscribeBookingChanges } from './booking-events';

/** Reload from the server on return and invalidation; never persist order data. */
export function useBookingList() {
  const { user, isLoading } = useAuth();
  const owner = user?.customer_id;
  const [snapshot, setSnapshot] = useState<{
    owner?: string;
    result: BookingListResult | null;
    error: Error | null;
  }>({ result: null, error: null });
  useEffect(() => {
    if (isLoading) return;
    let active = true;
    let running = false;
    let queued = false;
    const refresh = async () => {
      if (running) { queued = true; return; }
      running = true;
      try {
        const next = await listAccessibleBookings();
        if (active && !queued) setSnapshot({ owner, result: next, error: null });
      } catch (failure) {
        if (active && !queued) {
          setSnapshot({ owner, result: null,
            error: failure instanceof Error ? failure : new Error('service_unavailable') });
        }
      } finally {
        running = false;
        if (active && queued) { queued = false; void refresh(); }
      }
    };
    const visibleRefresh = () => { if (document.visibilityState === 'visible') void refresh(); };
    void refresh();
    const unsubscribe = subscribeBookingChanges(visibleRefresh);
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    const timer = setInterval(visibleRefresh, 15_000);
    return () => {
      active = false;
      unsubscribe();
      clearInterval(timer);
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
    };
  }, [owner, isLoading]);
  return !isLoading && snapshot.owner === owner
    ? { result: snapshot.result, error: snapshot.error }
    : { result: null, error: null };
}
