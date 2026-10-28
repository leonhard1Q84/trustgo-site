'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleHelp, ShieldAlert, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { findGuestBooking } from '../application/booking-store';
import type { BookingRecord } from '../domain/types';
import { RentalError } from '@/modules/reservation/domain/validation';

interface GuestBookingLookupCardProps {
  onLookupSuccess: (booking: BookingRecord) => void | Promise<void>;
  onSearchingChange?: (searching: boolean) => void;
}

export function GuestBookingLookupCard({
  onLookupSuccess,
  onSearchingChange,
}: GuestBookingLookupCardProps) {
  const { t, routeLang } = useI18n();
  const id = useId();
  const [bookingCode, setBookingCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSearching) return;
    setErrorCode('');
    setIsSearching(true);
    onSearchingChange?.(true);
    try {
      const booking = await findGuestBooking(bookingCode, lastName);
      await onLookupSuccess(booking);
    } catch (error) {
      setErrorCode(error instanceof RentalError ? error.code : 'service_unavailable');
    } finally {
      setIsSearching(false);
      onSearchingChange?.(false);
    }
  };
  const inputClass =
    'h-14 w-full rounded-control border border-border-strong bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60';
  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSearching}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`${id}-code`} className="text-sm font-semibold">
            {t('bm_lookup_code_label')}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="-my-3 -mr-3"
            onClick={() => setShowHelp(!showHelp)}
            aria-label={t('guest_code_help')}
            title={t('guest_code_help')}
            aria-expanded={showHelp}
            aria-controls={`${id}-help`}
          >
            <CircleHelp className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <input
          id={`${id}-code`}
          name="confirmationCode"
          type="text"
          autoFocus
          required
          maxLength={100}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          disabled={isSearching}
          placeholder={t('bm_placeholder_code')}
          value={bookingCode}
          onChange={(event) => setBookingCode(event.target.value)}
          className={inputClass}
          aria-describedby={
            `${showHelp ? `${id}-help ` : ''}${errorCode ? `${id}-error` : ''}`.trim() || undefined
          }
        />
        {showHelp && (
          <p id={`${id}-help`} className="text-xs leading-relaxed text-foreground-secondary">
            {t('guest_code_hint')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-surname`} className="block text-sm font-semibold">
          {t('bm_lookup_name_label')}
        </label>
        <input
          id={`${id}-surname`}
          name="lastName"
          type="text"
          required
          maxLength={100}
          autoComplete="family-name"
          disabled={isSearching}
          placeholder={t('bm_placeholder_name')}
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className={inputClass}
          aria-describedby={errorCode ? `${id}-error` : undefined}
        />
      </div>
      {errorCode && (
        <div
          id={`${id}-error`}
          role="alert"
          className="flex gap-2 rounded-control bg-destructive-light p-3 text-sm text-foreground"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <p>
              {t(errorCode === 'booking_not_found' ? 'guest_not_found' : `rental_${errorCode}`)}
            </p>
            <Link
              href={`/${routeLang}/help/customer-service#booking-and-rental`}
              className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline"
            >
              {t('guest_contact')}
            </Link>
          </div>
        </div>
      )}
      <Button type="submit" disabled={isSearching} className="h-14 w-full gap-3 text-base">
        {t(isSearching ? 'bm_searching' : 'guest_find')}
        {isSearching ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
      </Button>
    </form>
  );
}
