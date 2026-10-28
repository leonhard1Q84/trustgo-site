'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/modules/customer-account/application/AuthContext';
import { listPendingCheckouts } from './booking-store';
import { subscribeBookingChanges } from './booking-events';
import { holdSeconds, type PendingCheckout } from '../domain/pending-checkout';

export function usePendingCheckouts() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<{ owner?: string; orders: PendingCheckout[] }>({ orders: [] });
  const [now, setNow] = useState(() => Date.now());
  const owner = user?.customer_id;

  useEffect(() => {
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
    const visibleRefresh = () => { if (document.visibilityState === 'visible') void refresh(); };
    void refresh();
    const unsubscribe = subscribeBookingChanges(() => void refresh());
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    const poll = setInterval(visibleRefresh, 15_000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      active = false;
      clearInterval(poll);
      clearInterval(tick);
      unsubscribe();
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
    };
  }, [pathname, owner]);

  return snapshot.owner === owner ? snapshot.orders.filter(order => holdSeconds(order.paymentDeadline, now) > 0) : [];
}
