/** Rolling internal test inventory; FE remains the source of live availability. */
const MINIMUM_LEAD_TIME_MS = 72 * 60 * 60_000;

export function hasLocalInventory(pickupInstant: number, now: number): boolean {
  return pickupInstant - now >= MINIMUM_LEAD_TIME_MS;
}
