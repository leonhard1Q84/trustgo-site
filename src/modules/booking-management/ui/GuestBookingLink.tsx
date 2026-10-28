'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { useGuestLookup } from '../application/guest-lookup-context';

/** Keep native links for new tabs and direct URLs; open lookup in place on a normal click. */
export function GuestBookingLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const { routeLang: lang } = useI18n();
  const { openLookup, openBookingEntry } = useGuestLookup();
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (event.currentTarget.target && event.currentTarget.target !== '_self') ||
          event.currentTarget.hasAttribute('download')
        )
          return;
        const url = new URL(event.currentTarget.href);
        if (url.origin !== window.location.origin) return;
        if (!new RegExp(`^/${lang}/manage-booking(?:/lookup)?/?$`).test(url.pathname)) return;
        event.preventDefault();
        const options = { returnTo: url.searchParams.get('returnTo') };
        if (url.pathname.replace(/\/$/, '').endsWith('/lookup')) openLookup(options);
        else void openBookingEntry(options);
      }}
    />
  );
}
