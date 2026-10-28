'use client';

import React from 'react';
import Link from 'next/link';
import { GuestBookingLink } from '@/modules/booking-management/public-api';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import { BrandLogo } from '@/shared/ui/brand-logo';
import {ArrowLeft} from 'lucide-react';

interface AuthHeaderProps {
  lang: RouteLanguage;
  mode: 'sign-in' | 'register' | 'account';
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({lang, mode}) => {
  const {t} = useI18n(lang);

  return (
    <header className="w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/`} className="inline-flex items-center transition-opacity hover:opacity-90">
            <BrandLogo className="h-8 sm:h-9 w-auto" />
          </Link>
        </div>

        {/* Right: Quick Switch & Back to Home */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {mode === 'sign-in' && (
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-600">
              <span>{t('account.sign_in.join_now_free')}</span>
              <Link
                href={`/${lang}/account/register/`}
                className="font-bold text-[#25A5E3] hover:text-[#1D82B5] transition-colors underline underline-offset-2"
              >
                {t('account.sign_in.join_link')}
              </Link>
            </div>
          )}

          {mode === 'register' && (
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-600">
              <span>{t('account.register.have_account')}</span>
              <Link
                href={`/${lang}/account/sign-in/`}
                className="font-bold text-[#25A5E3] hover:text-[#1D82B5] transition-colors underline underline-offset-2"
              >
                {t('account.action.sign_in')}
              </Link>
            </div>
          )}

          {mode === 'account' && (
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-600">
              <GuestBookingLink
                href={`/${lang}/manage-booking/orders`}
                className="font-semibold text-neutral-600 hover:text-[#25A5E3] transition-colors"
              >
                {t('nav_manage_booking')}
              </GuestBookingLink>
            </div>
          )}


          {/* Desktop: standard text link */}
          <Link
            href={`/${lang}/`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t('account.action.back_to_home')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
