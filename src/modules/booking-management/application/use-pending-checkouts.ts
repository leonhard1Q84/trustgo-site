'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/customer-account/application/AuthContext';
import { listPendingCheckouts } from './booking-store';
import { subscribeBookingChanges } from './booking-events';
import { createVisibleRefresh } from '@/shared/application/visible-refresh';
import { holdSeconds, type PendingCheckout } from '../domain/pending-checkout';

export function usePendingCheckouts() {
  const { user, isLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<{ owner?: string; orders: PendingCheckout[] }>({ orders: [] });
  const [now, setNow] = useState(() => Date.now());
  const owner = user?.customer_id;

  useEffect(() => {
    if (isLoading) return;
    let active = true;
    let revision = 0;
    const refresh = async () => {
      const current = ++revision;
      try {
        const orders = await listPendingCheckouts();
        if (active && revision === current) setSnapshot({ owner, orders });
      } catch {
        // An unverified hold must not remain actionable after a failed refresh.
        if (active && revision === current) setSnapshot({ owner, orders: [] });
      }
    };
    const visibleRefresh = createVisibleRefresh(() => { void refresh(); });
    void refresh();
    const unsubscribe = subscribeBookingChanges(() => void refresh());
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
    };
  }, [owner, isLoading]);

  useEffect(() => {
    if (snapshot.owner !== owner || !snapshot.orders.length) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [snapshot, owner]);

  return snapshot.owner === owner ? snapshot.orders.filter(order => holdSeconds(order.paymentDeadline, now) > 0) : [];
}
