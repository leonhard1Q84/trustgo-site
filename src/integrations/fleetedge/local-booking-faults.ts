import { RentalError } from '@/modules/reservation/domain/validation';

type LocalBookingFault = { status: number; code: string; malformed?: boolean };
const faults: Record<string, LocalBookingFault> = {
  'TG-QA-SERVICE-503': { status: 503, code: 'service_unavailable' },
  'TG-QA-RATE-429': { status: 429, code: 'try_later' },
  'TG-QA-TIMEOUT-504': { status: 504, code: 'service_unavailable' },
  'TG-QA-BAD-RESPONSE': { status: 502, code: 'service_unavailable', malformed: true },
};

/** Reserved synthetic IDs only; never inspect, authorize, or mutate a real booking. */
export function localBookingFault(code: string): LocalBookingFault | undefined {
  if (!['development', 'test'].includes(process.env.NODE_ENV ?? '')
    || process.env.TRUSTGO_LOCAL_FAULTS === 'off') return;
  return faults[code.trim().toUpperCase()];
}

/** SSR has no HTTP payload to corrupt: all fixture failures propagate to its existing boundary. */
export function throwLocalBookingFault(code: string) {
  const fault = localBookingFault(code);
  if (fault) throw new RentalError(fault.code, fault.status);
}
