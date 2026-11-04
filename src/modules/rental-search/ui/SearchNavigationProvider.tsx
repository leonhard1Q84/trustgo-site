'use client';

import { createContext, useContext, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { RentalResultsSkeleton } from './SearchSkeleton';

const MINIMUM_SEARCH_FEEDBACK_MS = 800;
type SearchNavigation = {
  searching: boolean;
  search: (href: string) => void;
  refresh: () => void;
};
const Context = createContext<SearchNavigation | null>(null);

/** Lives above route pages so feedback survives both navigation and re-search. */
export function SearchNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [searching, startTransition] = useTransition();

  const navigate = (href?: string) => {
    if (searching) return;
    startTransition(async () => {
      // Same-URL searches must request fresh server results too.
      const current = window.location.pathname + window.location.search;
      if (!href || href === current) router.refresh();
      else router.push(href);
      // Keep the existing feedback perceptible even with cached/instant results.
      // React also keeps the transition pending until the route update settles.
      await new Promise<void>(resolve => window.setTimeout(resolve, MINIMUM_SEARCH_FEEDBACK_MS));
    });
  };

  return (
    <Context.Provider value={{ searching, search: navigate, refresh: () => navigate() }}>
      {searching ? <RentalResultsSkeleton count={4} /> : children}
    </Context.Provider>
  );
}

export function useSearchNavigation(): SearchNavigation {
  const context = useContext(Context);
  if (!context) throw new Error('SearchNavigationProvider is required');
  return context;
}
