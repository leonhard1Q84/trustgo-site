import { randomUUID } from 'node:crypto';
import type { BookingRecord } from '@/modules/booking-management/domain/types';
import type { LocalPaymentScenario } from '@/modules/checkout/domain/local-payment-scenario';

/** Local provider result; no card, token, or payment secret is retained. */
export function localPaymentResult(scenario: LocalPaymentScenario) {
  const error = ({
    declined: 'payment_declined', insufficient_funds: 'payment_insufficient_funds',
    authentication_failed: 'payment_authentication_failed', unavailable: 'payment_unavailable',
    unknown: 'payment_unconfirmed',
  } as Partial<Record<LocalPaymentScenario, string>>)[scenario];
  const paymentStatus = scenario === 'success' ? 'paid' : scenario === 'processing' ? 'processing'
    : scenario === 'unknown' ? 'unknown' : 'failed';
  return { paymentStatus, errorCode: error, errorStatus: scenario === 'unavailable' ? 503 : 409 } as const;
}

export function confirmLocalPayment(booking: BookingRecord) {
  booking.paymentStatus = 'paid';
  booking.paidAmount = booking.pricing.payNow;
  booking.paymentTransactionId ||= `local_${randomUUID()}`;
  booking.status = 'CONFIRMED';
}
