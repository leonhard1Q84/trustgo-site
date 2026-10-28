'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Search, Menu, ChevronDown, User, LogOut } from 'lucide-react';
import {
  type RouteLanguage,
  routeLanguages,
  LOCALE_LABELS,
  getDictionary,
} from '@/i18n/locales';
import { LocaleSwitchLink } from '@/i18n/LocaleNavigation';
import { useAuth, useAuthModal } from '@/modules/customer-account/public-api';
import { BrandLogo } from './brand-logo';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './dialog';
import { cn } from './utils';
import { getTranslation } from '@/i18n/translation';
import { GuestBookingLink } from '@/modules/booking-management/public-api';
import { useHeaderLayout } from './use-header-layout';

interface SiteHeaderProps {
  lang: RouteLanguage;
}

export function SiteHeader({ lang }: SiteHeaderProps) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { containerRef, brandRef, navRef, actionsRef, compact } = useHeaderLayout();

  const navLinkClass = (active: boolean) =>
    cn(
      'inline-flex min-h-11 items-center whitespace-nowrap transition-colors underline-offset-8 decoration-2 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      active
        ? 'text-foreground font-semibold underline'
        : 'text-foreground-secondary hover:text-foreground'
    );

  const mobileLinkClass = (active: boolean) =>
    cn('px-3 py-3 rounded-control hover:bg-muted', active && 'font-semibold bg-muted');

  const isHome = pathname === `/${lang}`;
  const isDestinations = Boolean(pathname?.startsWith(`/${lang}/car-rental`));
  const isLocations = Boolean(pathname?.startsWith(`/${lang}/locations`));
  const isFranchise = Boolean(pathname?.startsWith(`/${lang}/franchise`));
  const isHelp = Boolean(pathname?.startsWith(`/${lang}/help`));
  const isAbout = pathname === `/${lang}/about` || pathname === `/${lang}/about/`;
  const isManageBooking = Boolean(pathname?.startsWith(`/${lang}/manage-booking`));
  const isAccount = Boolean(pathname?.startsWith(`/${lang}/account`));

  const destinationsLabel =
    lang === 'zh'
      ? '租車目的地'
      : lang === 'ja'
        ? '主要目的地'
        : lang === 'es'
          ? 'Destinos'
          : lang === 'ko'
            ? '주요 여행지'
            : 'Destinations';
  const helpLabel =
    lang === 'zh'
      ? '幫助中心'
      : lang === 'ja'
        ? 'ヘルプ'
        : lang === 'es'
          ? 'Ayuda'
          : lang === 'ko'
            ? '도움말'
            : 'Help';
  const signInLabel =
    lang === 'zh'
      ? '登入 / 註冊'
      : lang === 'ja'
        ? 'ログイン / 登録'
        : lang === 'es'
          ? 'Iniciar sesión'
          : lang === 'ko'
            ? '로그인 / 회원가입'
            : 'Sign In';
  const myAccountLabel =
    lang === 'zh'
      ? '個人帳戶'
      : lang === 'ja'
        ? 'マイアカウント'
        : lang === 'es'
          ? 'Mi cuenta'
          : lang === 'ko'
            ? '내 계정'
            : 'My Account';
  const signOutLabel =
    lang === 'zh'
      ? '登出'
      : lang === 'ja'
        ? 'ログアウト'
        : lang === 'es'
          ? 'Cerrar sesión'
          : lang === 'ko'
            ? '로그아웃'
            : 'Sign Out';

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div
        ref={containerRef}
        className="relative max-w-header mx-auto px-4 md:px-8 lg:px-10 min-h-14 lg:min-h-18 flex items-center justify-between gap-4 lg:gap-8 xl:gap-12 lg:py-2"
      >
        {/* Brand Logo */}
        <div ref={brandRef} className="shrink-0">
          <BrandLogo lang={lang} />
        </div>

        {/* Desktop Nav Links */}
        <nav
          ref={navRef}
          aria-hidden={compact || undefined}
          inert={compact}
          className={cn(
            'hidden w-max shrink-0 items-center justify-center gap-6 xl:gap-8 text-sm font-medium lg:flex',
            compact && 'invisible absolute left-0 top-0 pointer-events-none'
          )}
        >
          <Link href={`/${lang}`} className={navLinkClass(isHome)}>
            {dict.nav.home}
          </Link>
          <Link href={`/${lang}/car-rental`} className={navLinkClass(isDestinations)}>
            {destinationsLabel}
          </Link>
          <Link href={`/${lang}/locations`} className={navLinkClass(isLocations)}>
            {dict.nav.locations}
          </Link>
          <Link href={`/${lang}/franchise`} className={navLinkClass(isFranchise)}>
            {dict.nav.franchise}
          </Link>
          <Link href={`/${lang}/help`} className={navLinkClass(isHelp)}>
            {helpLabel}
          </Link>
          <Link
            href={`/${lang}/about`}
            className={navLinkClass(isAbout)}
            aria-current={isAbout ? 'page' : undefined}
          >
            {getTranslation('footer_about_us', lang)}
          </Link>
        </nav>

        {/* Right CTA / Action Area */}
        <div
          ref={actionsRef}
          aria-hidden={compact || undefined}
          inert={compact}
          className={cn(
            'hidden w-max shrink-0 lg:flex items-center gap-2',
            compact && 'invisible absolute right-0 top-0 pointer-events-none'
          )}
        >
          {/* Quick Find Booking Button */}
          <GuestBookingLink
            href={`/${lang}/manage-booking`}
            className="min-h-11 px-3 py-2 rounded-control text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{dict.nav.manageBooking}</span>
          </GuestBookingLink>

          {/* Language Selector Popover */}
          <Popover>
            <PopoverTrigger
              className="flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-control text-xs font-semibold text-foreground-secondary hover:text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-nowrap"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>
                {LOCALE_LABELS[lang].flag} {LOCALE_LABELS[lang].nativeName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-1.5">
              {routeLanguages.map((targetLocale) => (
                <LocaleSwitchLink
                  key={targetLocale}
                  lang={targetLocale}
                  onNavigate={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2 text-xs font-medium rounded-control hover:bg-muted transition-colors',
                    targetLocale === lang
                      ? 'text-foreground font-semibold bg-muted'
                      : 'text-foreground-secondary'
                  )}
                >
                  <span>
                    {LOCALE_LABELS[targetLocale].flag} {LOCALE_LABELS[targetLocale].nativeName}
                  </span>
                  <span className="text-xs text-muted-foreground">{targetLocale}</span>
                </LocaleSwitchLink>
              ))}
            </PopoverContent>
          </Popover>

          {/* User Auth Status CTA */}
          {!isLoading &&
            (isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger
                  className="flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-control text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold text-xs transition-colors cursor-pointer"
                  aria-label="User Account Menu"
                >
                  <User className="w-3.5 h-3.5" />
                  <span
                    className="max-w-28 truncate"
                    title={user.profile?.first_name || user.primary_email.split('@')[0]}
                  >
                    {user.profile?.first_name || user.primary_email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 p-1.5">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {user.profile?.first_name
                        ? `${user.profile.first_name} ${user.profile.last_name || ''}`.trim()
                        : 'TrustGo Member'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.primary_email}</p>
                  </div>
                  <Link
                    href={`/${lang}/account`}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-control hover:bg-muted text-foreground transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{myAccountLabel}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!(await signOut()))
                        window.alert(getTranslation('account.error.sign_out_failed', lang));
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-control hover:bg-muted text-destructive hover:text-destructive transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{signOutLabel}</span>
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="min-h-11 px-3 py-2 rounded-control text-foreground-secondary hover:text-foreground hover:bg-muted font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>{signInLabel}</span>
              </button>
            ))}
        </div>

        {/* Mobile Actions: Find Booking + Full-Screen Menu Sheet */}
        <div className={cn('flex items-center gap-2', !compact && 'lg:hidden')}>
          <GuestBookingLink
            href={`/${lang}/manage-booking`}
            className="flex h-11 w-11 items-center justify-center rounded-control text-foreground-secondary hover:text-foreground"
            aria-label={dict.nav.manageBooking}
          >
            <Search className="w-5 h-5" />
          </GuestBookingLink>
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogTrigger
              className="flex h-11 w-11 items-center justify-center rounded-control text-foreground hover:bg-muted cursor-pointer"
              aria-label={dict.nav.menuOpen}
            >
              <Menu className="w-6 h-6" />
            </DialogTrigger>
            <DialogContent variant="full" className="overflow-y-auto">
              <div className="flex h-14 items-center border-b border-border px-4">
                <DialogTitle>{dict.nav.menuOpen}</DialogTitle>
              </div>
              <nav className="flex flex-col space-y-1 px-4 py-5 text-base font-medium text-foreground">
                <Link
                  href={`/${lang}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isHome)}
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href={`/${lang}/car-rental`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isDestinations)}
                >
                  {destinationsLabel}
                </Link>
                <Link
                  href={`/${lang}/locations`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isLocations)}
                >
                  {dict.nav.locations}
                </Link>
                <Link
                  href={`/${lang}/franchise`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isFranchise)}
                >
                  {dict.nav.franchise}
                </Link>
                <Link
                  href={`/${lang}/help`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isHelp)}
                >
                  {helpLabel}
                </Link>
                <Link
                  href={`/${lang}/about`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isAbout)}
                  aria-current={isAbout ? 'page' : undefined}
                >
                  {getTranslation('footer_about_us', lang)}
                </Link>
                <GuestBookingLink
                  href={`/${lang}/manage-booking`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass(isManageBooking)}
                >
                  {dict.nav.manageBooking}
                </GuestBookingLink>

                {/* Account mobile entry */}
                {isAuthenticated && user ? (
                  <Link
                    href={`/${lang}/account`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(mobileLinkClass(isAccount), 'break-words')}
                  >
                    {myAccountLabel} ({user.profile?.first_name || user.primary_email.split('@')[0]}
                    )
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className={cn(mobileLinkClass(isAccount), 'w-full text-left cursor-pointer')}
                  >
                    {signInLabel}
                  </button>
                )}
              </nav>

              {/* Languages */}
              <div className="px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t border-border mt-auto">
                <span className="text-xs font-medium text-muted-foreground block mb-2 px-3">
                  {dict.nav.language}
                </span>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {routeLanguages.map((targetLocale) => (
                    <LocaleSwitchLink
                      key={targetLocale}
                      lang={targetLocale}
                      onNavigate={() => setMobileMenuOpen(false)}
                      className={cn(
                        'px-3 py-2.5 rounded-control text-xs font-medium border text-center',
                        targetLocale === lang
                          ? 'border-foreground text-foreground font-semibold'
                          : 'border-border text-foreground-secondary'
                      )}
                    >
                      {LOCALE_LABELS[targetLocale].flag} {LOCALE_LABELS[targetLocale].nativeName}
                    </LocaleSwitchLink>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
