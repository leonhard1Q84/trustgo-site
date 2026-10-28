import type { RentalTripDetails } from './types';

/** Always display the depot's local time, regardless of the customer's device. */
export function formatTripDateTime(value: string, trip: RentalTripDetails, lang = 'en'): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  const locale = lang === 'zh' ? 'zh-Hant' : lang;
  return new Intl.DateTimeFormat(locale, { timeZone: trip.timeZone ?? 'UTC', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
}
