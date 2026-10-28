'use client';

import { useSyncExternalStore } from 'react';

/** SSR-safe media query hook; returns `false` during server render. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Desktop & tablet (≥ 768px) use anchored popovers; mobile uses full-screen sheets. */
export function useIsTabletUp(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
