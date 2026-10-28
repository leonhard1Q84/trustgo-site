'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGuestLookup } from '../application/guest-lookup-context';

/** Consume a compatibility URL once; credentials are never encoded in it. */
export function GuestLookupUrlTrigger() {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const { openLookup } = useGuestLookup();
  useEffect(() => {
    if (search.get('bookingLookup') !== '1') return;
    openLookup({ returnTo: search.get('returnTo') });
    const clean = new URLSearchParams(search.toString());
    clean.delete('bookingLookup');
    clean.delete('returnTo');
    router.replace(`${pathname}${clean.size ? `?${clean}` : ''}`, { scroll: false });
  }, [openLookup, pathname, router, search]);
  return null;
}
