import type { CancellationPolicy, RentalTripDetails } from './types';
import { formatTripDateTime } from './format-trip';

export function cancellationCutoff(trip: RentalTripDetails | undefined, hours: number | undefined) {
  if (!trip || hours === undefined) return undefined;
  // Only offset-aware instants can be converted without using the customer's timezone.
  if (!/(Z|[+-]\d{2}:?\d{2})$/.test(trip.pickupDateTime)) return undefined;
  const pickup = Date.parse(trip.pickupDateTime);
  return Number.isFinite(pickup) ? pickup - hours * 3_600_000 : undefined;
}

export function cancellationHeadline(
  policy: CancellationPolicy,
  trip: RentalTripDetails | undefined,
  lang: string,
  t: (key: string) => string,
  now?: number
) {
  const hours = policy.freeCancellationHours;
  if (!hours) return t('rd_non_refundable');
  const cutoff = cancellationCutoff(trip, hours);
  if (cutoff !== undefined && trip) {
    if (now !== undefined && now > cutoff) return t('rd_cancel_expired');
    return t('rd_cancel_before').replace(
      '{date}',
      formatTripDateTime(new Date(cutoff).toISOString(), trip, lang)
    );
  }
  return t('rd_cancel_hours').replace('{hours}', String(hours));
}

export function cancellationRows(
  policy: CancellationPolicy,
  trip: RentalTripDetails | undefined,
  lang: string,
  t: (key: string) => string
) {
  return policy.steps.map((step) => {
    const from = cancellationCutoff(trip, step.fromHoursBeforePickup);
    const until = cancellationCutoff(trip, step.untilHoursBeforePickup);
    const format = (value: number) =>
      formatTripDateTime(new Date(value).toISOString(), trip!, lang);
    let period = '';
    if (from !== undefined && until !== undefined) {
      period = t('rd_cancel_between')
        .replace('{from}', format(from))
        .replace('{until}', format(until));
    } else if (until !== undefined) {
      period = t('rd_cancel_until').replace('{date}', format(until));
    } else if (from !== undefined) {
      period = t('rd_cancel_after').replace('{date}', format(from));
    } else if (policy.freeCancellationHours) {
      period = t(
        step.feePercentage === 0
          ? 'ct_step_free_time'
          : step.feePercentage === 100
            ? 'ct_step_noshow_time'
            : 'ct_step_late_time'
      ).replace(/48/g, String(policy.freeCancellationHours));
    }
    return {
      title:
        step.feePercentage === 0
          ? t('ct_step_free_title')
          : t('rd_cancel_fee').replace('{percent}', String(step.feePercentage)),
      period,
      refund: t('rd_cancel_refund').replace('{percent}', String(100 - step.feePercentage)),
      feePercentage: step.feePercentage,
    };
  });
}
