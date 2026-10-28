export const BOOKING_CHANGED_EVENT = 'trustgo:booking-changed';
const CHANNEL = 'trustgo-booking-changes';

/** Signal invalidation only; never broadcast or persist customer/order data. */
export function notifyBookingChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(BOOKING_CHANGED_EVENT));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage('changed');
    channel.close();
  }
}

export function subscribeBookingChanges(refresh: () => void) {
  window.addEventListener(BOOKING_CHANGED_EVENT, refresh);
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
  if (channel) channel.onmessage = refresh;
  return () => {
    window.removeEventListener(BOOKING_CHANGED_EVENT, refresh);
    channel?.close();
  };
}
