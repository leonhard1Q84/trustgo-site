'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookingRecord, getBookingByConfirmationCode, payBookingByConfirmationCode, CancellationModal
} from '@/modules/booking-management/public-api';
import { useBookingSync } from '@/modules/booking-management/application/use-booking-sync';
import { canPayBooking, canCancelBooking } from '@/modules/booking-management/domain/lifecycle';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { PaymentCardDetails } from '@/modules/checkout/domain/types';
import { localPaymentScenarioForCard } from '@/modules/checkout/domain/local-payment-scenario';
import {
  RateLockHoldBanner, StripeCardForm, CheckoutOrderSummary, CheckoutExpiryDialog
} from '@/modules/checkout/public-api';

interface CheckoutCashierViewProps {
  initialBooking: BookingRecord;
  reservationId: string;
  lang: string;
}

export function CheckoutCashierView({
  initialBooking,
  reservationId,
  lang,
}: CheckoutCashierViewProps) {
  const router = useRouter();
  const { booking, error: syncError, updateBooking: setBooking } = useBookingSync(initialBooking, reservationId, lang, 'checkout');
  const [isProcessing, setIsProcessing] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const paymentRequest = useRef('');
  const submission = useRef(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!syncError && booking.status === 'CONFIRMED' && booking.paymentStatus === 'paid') {
      router.replace(`/${lang}/booking/${booking.confirmationCode}`);
    }
  }, [booking, lang, router, syncError]);

  const handlePay = async (card: PaymentCardDetails) => {
    if (submission.current || syncError || !canPayBooking(booking)) throw new RentalError('order_not_payable');
    submission.current = true;
    setIsProcessing(true);
    try {
      paymentRequest.current ||= crypto.randomUUID();
      const confirmed = await payBookingByConfirmationCode(reservationId, paymentRequest.current, localPaymentScenarioForCard(card.cardNumber));
      setBooking(confirmed);
      if (confirmed.paymentStatus !== 'paid') throw new RentalError('payment_unconfirmed');
      router.push(`/${lang}/booking/${confirmed.confirmationCode}`);
    } catch (error) {
      // A lost response must be reconciled before another payment is attempted.
      const current = await getBookingByConfirmationCode(reservationId).catch(() => null);
      if (current) setBooking(current);
      else setBooking(current => current.status === 'PENDING_PAYMENT' && ['unpaid', 'failed'].includes(current.paymentStatus ?? 'unpaid')
        ? { ...current, paymentStatus: 'unknown' } : current);
      if (current?.paymentStatus === 'failed') paymentRequest.current = '';
      if (current?.paymentStatus === 'paid') {
        router.push(`/${lang}/booking/${current.confirmationCode}`);
        return;
      }
      throw error;
    } finally {
      submission.current = false;
      setIsProcessing(false);
    }
  };

  if (syncError instanceof RentalError && syncError.code === 'booking_not_found') return null;

  return (
    <div>
      {/* 15-Minute Rate Lock Banner */}
      <RateLockHoldBanner booking={booking} errorCode={syncError instanceof RentalError ? syncError.code : syncError ? 'service_unavailable' : undefined} onCancel={() => setShowCancelModal(true)}
        canCancel={!syncError && !isProcessing && canCancelBooking(booking) && canPayBooking(booking, now)} />
      <CancellationModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}
        booking={booking} onCancelled={setBooking} />

      <CheckoutExpiryDialog key={reservationId} expired={!syncError && !showCancelModal
        && booking.status === 'CANCELLED' && booking.closureReason === 'payment_timeout'
        && !['paid', 'processing', 'unknown'].includes(booking.paymentStatus ?? 'unpaid')} />

      {/* Main Grid: Left Payment Form, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 lg:pb-0">
        <div className="lg:col-span-8">
          <StripeCardForm
            amount={booking.pricing.payNow}
            currency={booking.pricing.currency}
            isProcessing={isProcessing}
            canPay={!syncError && !showCancelModal && canPayBooking(booking, now)}
            driverEmail={booking.driver?.email}
            defaultCardholderName={`${booking.driver?.firstName || ''} ${booking.driver?.lastName || ''}`.trim()}
            onPay={handlePay}
          />
        </div>

        <div className="lg:col-span-4">
          <CheckoutOrderSummary
            vehicle={booking.vehicle}
            trip={booking.trip}
            driver={booking.driver}
            equipment={booking.equipment}
            insuranceName={booking.insurance.name}
            totalAmount={booking.pricing.payNow}
            currency={booking.pricing.currency}
            depositAmount={booking.vehicle.depositAmount}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
