'use client';

import React, {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { getTranslation } from './translation';
import { localizedNavigationHref } from './navigation';
import type { RouteLanguage } from './locales';

type Destination = { href: string; lang: RouteLanguage; onNavigate?: () => void };
type NavigationContext = {
  request: (destination: Destination) => void;
  register: (id: string, dirty: boolean) => () => void;
};
const Context = createContext<NavigationContext | null>(null);

export function LocaleNavigationProvider({
  lang,
  children,
}: {
  lang: RouteLanguage;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const drafts = useRef(new Map<string, boolean>());
  const [pending, setPending] = useState<Destination | null>(null);
  const register = useCallback((id: string, dirty: boolean) => {
    drafts.current.set(id, dirty);
    return () => {
      drafts.current.delete(id);
    };
  }, []);
  const navigate = (destination: Destination) => {
    document.cookie = `tg_locale=${destination.lang}; path=/; max-age=31536000; SameSite=Lax`;
    destination.onNavigate?.();
    setPending(null);
    router.push(destination.href);
  };
  const request = (destination: Destination) => {
    if ([...drafts.current.values()].some(Boolean)) setPending(destination);
    else navigate(destination);
  };

  return (
    <Context.Provider value={{ request, register }}>
      {children}
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent variant="sheet" sheetBreakpoint="md" hideCloseButton className="p-5 sm:p-6">
          <DialogTitle>{getTranslation('nav_language_leave_title', lang)}</DialogTitle>
          <DialogDescription className="mt-2">
            {getTranslation('nav_language_leave_description', lang)}
          </DialogDescription>
          <div className="mt-5 flex flex-wrap justify-end gap-3 pb-[env(safe-area-inset-bottom)]">
            <Button variant="secondary" onClick={() => setPending(null)}>
              {getTranslation('nav_language_stay', lang)}
            </Button>
            <Button
              onClick={() => {
                if (pending) navigate(pending);
              }}
            >
              {getTranslation('nav_language_continue', lang)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Context.Provider>
  );
}

/** Register only a boolean; personal form contents stay inside their page. */
export function useUnsavedLocaleChanges(dirty: boolean) {
  const context = useContext(Context);
  const register = context?.register;
  const id = useId();
  useEffect(() => register?.(id, dirty), [register, id, dirty]);
}

function subscribeLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
  };
}
const locationSnapshot = () => window.location.hash;
const serverLocationSnapshot = () => '';

type LocaleSwitchLinkProps = {
  lang: RouteLanguage;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

function LanguageLink({
  lang,
  children,
  className,
  onNavigate,
  query = '',
}: LocaleSwitchLinkProps & { query?: string }) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeLocation, locationSnapshot, serverLocationSnapshot);
  const navigation = useContext(Context);
  const href = localizedNavigationHref(`${pathname}${query ? `?${query}` : ''}${hash}`, lang);
  return (
    <Link
      href={href}
      className={className}
      prefetch={false}
      onClick={(event) => {
        const current = new URL(window.location.href);
        const destination = localizedNavigationHref(
          current.pathname + current.search + current.hash,
          lang
        );
        event.currentTarget.href = destination;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (current.pathname.split('/')[1] === lang) return;
        navigation?.request({ href: destination, lang, onNavigate });
      }}
    >
      {children}
    </Link>
  );
}

function SearchLanguageLink(props: LocaleSwitchLinkProps) {
  const query = useSearchParams();
  return <LanguageLink {...props} query={query.toString()} />;
}

/** Query-dependent links have their own boundary so the page keeps its server HTML. */
export function LocaleSwitchLink(props: LocaleSwitchLinkProps) {
  return (
    <Suspense fallback={<LanguageLink {...props} />}>
      <SearchLanguageLink {...props} />
    </Suspense>
  );
}
