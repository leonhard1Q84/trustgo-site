'use client';

import React, { useState } from 'react';
import {
  BookingRecord,
  BookingVoucherHeader,
  OnlineCheckinBanner,
  CancellationModal,
  MasterTripItineraryCard,
  BookedDriverCard,
  BookingPoliciesAccordion,
  BookingFaqSection,
  BookingDetailsSidebar,
} from '@/modules/booking-management/public-api';

import { useBookingSync } from '@/modules/booking-management/application/use-booking-sync';
import { RentalError } from '@/modules/reservation/domain/validation';

interface BookingDetailsViewProps {
  initialBooking: BookingRecord;
  confirmationCode: string;
  lang: string;
}

export function BookingDetailsView({
  initialBooking,
  confirmationCode,
  lang,
}: BookingDetailsViewProps) {
  const { booking, error, updateBooking: setBooking } = useBookingSync(initialBooking, confirmationCode, lang, 'booking');
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (error instanceof RentalError && error.code === 'booking_not_found') return null;
  if (error) throw error;

  return (
    <div className="pb-16">
      {/* 1. Header with Status Badge & Confirmation Code */}
      <BookingVoucherHeader
        booking={booking}
        onOpenCancelModal={() => setShowCancelModal(true)}
      />

      {/* 2. Online identity verification before pick-up */}
      <OnlineCheckinBanner />

      {/* 3. Main Itinerary & Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-start">
        {/* ── LEFT COLUMN: Master Trip Itinerary, Driver, Policies & FAQ ── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* A. Integrated Master Trip Card: Vehicle + Duration Timeline + Depot Handover Guide & Map */}
          <MasterTripItineraryCard booking={booking} lang={lang} />

          {/* B. Booked Driver Information */}
          <BookedDriverCard driver={booking.driver} />

          {/* C. Rental Terms, Cancellation Rules & Driver License Policies */}
          <BookingPoliciesAccordion booking={booking} />

          {/* D. Frequently Asked Questions (FAQ) */}
          <BookingFaqSection />
        </div>

        {/* ── RIGHT COLUMN: Sticky Contact & Payment Details Sidebar ── */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-3.5">
          <BookingDetailsSidebar booking={booking} />
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onCancelled={(updated) => setBooking(updated)}
      />
    </div>
  );
}
