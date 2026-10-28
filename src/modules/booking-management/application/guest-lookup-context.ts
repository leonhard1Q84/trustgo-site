'use client';

import { createContext, useContext } from 'react';

export interface GuestLookupOptions {
  returnTo?: string | null;
}
export const GuestLookupContext = createContext<{
  openLookup: (options?: GuestLookupOptions) => void;
  openBookingEntry: (options?: GuestLookupOptions) => Promise<void>;
} | null>(null);

export function useGuestLookup() {
  const context = useContext(GuestLookupContext);
  if (!context) throw new Error('GuestLookupProvider is required');
  return context;
}
