'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { useUnsavedLocaleChanges } from '@/i18n/LocaleNavigation';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { findResumableReservation } from '@/modules/reservation/application/checkout-recovery';
import { useRouter } from 'next/navigation';
import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  RentalTripDetails,
  InsurancePackageId,
  SpecialEquipmentSelection,
  calculateEquipmentCost,
  calculateRatePricing,
  RateSummarySidebar,
} from '@/modules/rate-details/public-api';
import { DriverDetails, DriverForm } from '@/modules/reservation/public-api';
import {
  createBooking,
  listGuestBookings,
} from '@/modules/booking-management/application/booking-store';
import {
  RentalError,
  normalizeLicenseCountry,
  validateDriver,
} from '@/modules/reservation/domain/validation';
import { buildRateReturnHref } from '@/modules/reservation/application/rate-return';
import { buildSearchQuery, type SearchFormState } from '@/modules/rental-search/domain/search-form';
import type { RouteLanguage } from '@/i18n/locales';
import {
  useSearchExpiry,
  SearchRefreshSkeleton,
} from '@/modules/rental-search/ui/SearchExpiryDialog';
import {
  AccountCreationCheckoutSection,
  CURRENT_TERMS_VERSION,
  CURRENT_PRIVACY_VERSION,
  useAuth,
} from '@/modules/customer-account/public-api';

interface DriverBookingViewProps {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  search: SearchFormState;
  insuranceId: InsurancePackageId;
  initialEquipment: SpecialEquipmentSelection;
  lang: RouteLanguage;
}

export function DriverBookingView({
  vehicle,
  trip,
  search,
  insuranceId,
  initialEquipment,
  lang,
}: DriverBookingViewProps) {
  const { t } = useI18n(lang);
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [createAccountRequested, setCreateAccountRequested] = useState(true);
  const [choiceReady, setChoiceReady] = useState(false);
  const choiceKey = `tg_account_choice_${trip.rateDetailsId}`;

  useEffect(() => {
    try {
      setCreateAccountRequested(sessionStorage.getItem(choiceKey) !== 'false');
    } catch {
      /* The in-memory selection still works with storage disabled. */
    }
    setChoiceReady(true);
  }, [choiceKey]);

  const toggleAccountCreation = (requested: boolean) => {
    setCreateAccountRequested(requested);
    try {
      sessionStorage.setItem(choiceKey, String(requested));
    } catch {
      /* Optional, non-personal draft choice. */
    }
  };

  const [driver, setDriver] = useState<DriverDetails>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+1',
    phone: '',
    licenseCountry: normalizeLicenseCountry(trip.licenseCountry ?? search.licenseCountry),
    flightNumber: '',
    additionalDriver: {
      enabled: false,
      fullName: '',
    },
  });

  const [existingCheckout, setExistingCheckout] = useState<string | null>(null);
  useUnsavedLocaleChanges(Boolean(driver.firstName || driver.lastName || driver.email || driver.phone
    || driver.flightNumber || driver.additionalDriver?.enabled || driver.additionalDriver?.fullName
    || driver.title !== 'Mr' || driver.phoneCountryCode !== '+1'
    || driver.licenseCountry !== normalizeLicenseCountry(trip.licenseCountry ?? search.licenseCountry)));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (submitError) {
      feedback.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      feedback.current?.focus({ preventScroll: true });
    }
  }, [submitError]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submission = useRef(false);
  const requestId = useRef('');

  // Equipment was selected in Step 1 (Rate Details)
  const equipmentCost = calculateEquipmentCost(initialEquipment, trip.rentalDays);
  const pricing = calculateRatePricing(vehicle, trip, insuranceId, equipmentCost);

  const backToSearchHref = `/${lang}/rent?${buildSearchQuery(search)}`;

  const returnToRateDetails = useCallback(() => {
    const destination = buildRateReturnHref({
      lang,
      vehicleId: vehicle.id,
      offerId: trip.offerId ?? '',
      search,
      licenseCountry: driver.licenseCountry,
      insuranceId,
      equipment: initialEquipment,
    });
    const url = new URL(destination, window.location.origin);
    url.searchParams.set('refreshed', '1');
    window.location.assign(url.href);
  }, [lang, vehicle.id, trip.offerId, search, driver.licenseCountry, insuranceId, initialEquipment]);

  const { searchExpiryDialog, isSearchRefreshing, isExpired, triggerExpiry } = useSearchExpiry({
    isActive: true,
    resetKey: trip.rateDetailsId,
    expiresAt: trip.rateExpiresAt,
    onRefresh: returnToRateDetails,
    lang,
    variant: 'rate',
    backHref: backToSearchHref,
  });

  const handleProceedToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submission.current || isAuthLoading || !choiceReady || isExpired) return;
    const form = e.currentTarget;
    setSubmitError(null);
    setExistingCheckout(null);
    submission.current = true;
    setIsSubmitting(true);
    let navigationStarted = false;
    try {
      const validatedDriver = validateDriver(driver);
      if (validatedDriver.licenseCountry !== normalizeLicenseCountry(trip.licenseCountry ?? search.licenseCountry)) {
        returnToRateDetails();
        navigationStarted = true;
        return;
      }
      if (!requestId.current) {
        const storageKey = `tg_reservation_intent_${trip.rateDetailsId}`;
        try {
          requestId.current = sessionStorage.getItem(storageKey) || crypto.randomUUID();
          sessionStorage.setItem(storageKey, requestId.current);
        } catch {
          requestId.current = crypto.randomUUID();
        }
      }
      const input = {
        rateDetailsId: trip.rateDetailsId ?? '',
        insuranceId,
        equipment: initialEquipment,
        driver: validatedDriver,
        idempotencyKey: requestId.current,
        accountCreation: {
          create_account_requested: !isAuthenticated && createAccountRequested,
          ...(!isAuthenticated && createAccountRequested
            ? {
                account_creation_consent: {
                  terms_version: CURRENT_TERMS_VERSION,
                  privacy_version: CURRENT_PRIVACY_VERSION,
                  locale: lang,
                },
              }
            : {}),
        },
      };
      let booking;
      try {
        booking = await createBooking(input);
      } catch (error) {
        if (
          !(error instanceof RentalError) ||
          !['booking_conflict', 'submission_changed'].includes(error.code)
        )
          throw error;
        const existing = await listGuestBookings();
        booking = findResumableReservation(existing.orders, input);
        if (!booking) {
          const pending = existing.orders.find(
            (order) =>
              order.status === 'PENDING_PAYMENT' &&
              ['unpaid', 'failed'].includes(order.paymentStatus ?? 'unpaid') &&
              Date.parse(order.paymentDeadline ?? '') > Date.now() &&
              Date.parse(order.trip.pickupDateTime) < Date.parse(trip.returnDateTime) &&
              Date.parse(order.trip.returnDateTime) > Date.parse(trip.pickupDateTime)
          );
          setExistingCheckout(pending?.confirmationCode ?? null);
          throw error;
        }
      }
      router.push(`/${lang}/checkout/${booking.confirmationCode}`);
      navigationStarted = true;
    } catch (error) {
      const code = error instanceof RentalError ? error.code : 'service_unavailable';
      if (code === 'driver_changed') {
        returnToRateDetails();
        navigationStarted = true;
        return;
      }
      if (code === 'rate_expired' || code === 'rate_unavailable') {
        triggerExpiry();
        return;
      }
      const field =
        error instanceof RentalError && error.field
          ? (form.elements.namedItem(error.field) as HTMLInputElement | null)
          : null;
      if (field) {
        field.setCustomValidity(t(`bv_invalid_${error instanceof RentalError ? error.field : ''}`));
        field.scrollIntoView({ block: 'center', behavior: 'smooth' });
        field.focus({ preventScroll: true });
        field.reportValidity();
      } else {
        setSubmitError(code);
      }
    } finally {
      if (!navigationStarted) {
        submission.current = false;
        setIsSubmitting(false);
      }
    }
  };

  if (isSearchRefreshing) {
    return (
      <div className="py-8">
        <SearchRefreshSkeleton variant="booking" label={t('search_refresh_booking')} />
      </div>
    );
  }

  return (
    <>
      {searchExpiryDialog}
      <form
        id="driver-booking-form"
        onSubmit={handleProceedToCheckout}
        onClickCapture={(e) => {
          e.currentTarget
            .querySelectorAll<HTMLInputElement>('input')
            .forEach((input) => input.setCustomValidity(''));
        }}
        onInput={(e) => {
          e.currentTarget
            .querySelectorAll<HTMLInputElement>('input')
            .forEach((input) => input.setCustomValidity(''));
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-28 lg:pb-0"
      >
        {/* Left 8 Cols: Pure Driver Information Form with Embedded Guest Account Creation */}
        <div className="lg:col-span-8">
          <DriverForm
            driver={driver}
            onChange={setDriver}
            footer={
              !isAuthLoading && !isAuthenticated && choiceReady ? (
                <AccountCreationCheckoutSection
                  lang={lang}
                  driverEmail={driver.email}
                  createAccountRequested={createAccountRequested}
                  onToggleCreateAccount={toggleAccountCreation}
                  variant="embedded"
                />
              ) : null
            }
          />
          <Button
            type="submit"
            disabled={isSubmitting || isAuthLoading || !choiceReady || isExpired}
            className="mt-5 w-full lg:hidden"
          >
            {isSubmitting ? t('bv_reserving') : t('bv_proceed')}
          </Button>
        </div>

        {/* Right 4 Cols: Order Review Sidebar (Unified with Rate Details Sidebar) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <RateSummarySidebar
            vehicle={vehicle}
            trip={trip}
            pricing={pricing}
            equipment={initialEquipment}
            lang={lang}
            mode="driver-checkout"
            submitFormId="driver-booking-form"
            actionFeedback={
              submitError && !isExpired ? (
                <div
                  ref={feedback}
                  role="alert"
                  tabIndex={-1}
                  className="scroll-mt-40 rounded-control border border-border p-3 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p>
                    {t(`rental_${submitError}`) === `rental_${submitError}`
                      ? t('rental_service_unavailable')
                      : t(`rental_${submitError}`)}
                  </p>
                  {existingCheckout && (
                    <Link
                      className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline"
                      href={`/${lang}/checkout/${existingCheckout}`}
                    >
                      {t('bv_continue_existing')}
                    </Link>
                  )}
                  {['booking_conflict', 'submission_changed'].includes(submitError) && (
                    <Link
                      className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline"
                      href={`/${lang}/manage-booking`}
                    >
                      {t('bv_review_bookings')}
                    </Link>
                  )}
                </div>
              ) : null
            }
            isSubmitting={isSubmitting}
            submitDisabled={isAuthLoading || !choiceReady || isExpired || isSubmitting}
          />
        </div>
      </form>
    </>
  );
}
