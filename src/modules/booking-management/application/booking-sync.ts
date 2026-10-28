import type { BookingRecord } from '../domain/types';

/** Coalesce refreshes and prevent a pre-mutation response from undoing newer state. */
export function createBookingSync<T = BookingRecord>(input: {
  load: () => Promise<T>;
  onBooking: (booking: T) => void;
  onError: (error: unknown) => void;
}) {
  let active = true;
  let revision = 0;
  let pending: Promise<void> | null = null;
  let queued = false;
  const refresh = (): Promise<void> => {
    if (!active) return Promise.resolve();
    if (pending) { queued = true; return pending; }
    const current = revision;
    pending = (async () => {
      try {
        const booking = await Promise.resolve().then(input.load);
        if (active && current === revision) input.onBooking(booking);
      } catch (error) {
        if (active && current === revision) input.onError(error);
      } finally {
        pending = null;
        if (active && queued) { queued = false; await refresh(); }
      }
    })();
    return pending;
  };
  return {
    refresh,
    publish(booking: T) {
      revision += 1;
      if (active) input.onBooking(booking);
    },
    stop() { active = false; revision += 1; },
  };
}
