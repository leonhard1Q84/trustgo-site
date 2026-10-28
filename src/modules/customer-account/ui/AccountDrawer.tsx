'use client';

import React, {useEffect} from 'react';
import {
  CalendarDays,
  CircleUserRound,
  HelpCircle,
  KeyRound,
  LogOut,
  Smartphone,
  UsersRound,
  X,
} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import type {PublicAccountProfile} from '../domain/account.types';

interface AccountDrawerProps {
  lang: RouteLanguage;
  isOpen: boolean;
  onClose: () => void;
  user: PublicAccountProfile | null;
  onSignOut: () => Promise<void>;
}

export function AccountDrawer({
  lang,
  isOpen,
  onClose,
  user,
  onSignOut,
}: AccountDrawerProps) {
  const {t} = useI18n(lang);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const emailInitial = (user.primary_email?.[0] || 'U').toUpperCase();

  const navItems = [
    {
      id: 'bookings',
      icon: CalendarDays,
      label: t('account.drawer.my_bookings'),
      href: `/${lang}/manage-booking/orders`,
    },
    {
      id: 'account_info',
      icon: CircleUserRound,
      label: t('account.section.account_info'),
      href: `/${lang}/account/?tab=account_info`,
    },
    {
      id: 'travelers',
      icon: UsersRound,
      label: t('account.section.frequent_travelers'),
      href: `/${lang}/account/?tab=travelers`,
    },
    {
      id: 'contacts',
      icon: Smartphone,
      label: t('account.section.contact_info'),
      href: `/${lang}/account/?tab=contacts`,
    },
    {
      id: 'management',
      icon: KeyRound,
      label: t('account.section.account_management'),
      href: `/${lang}/account/?tab=management`,
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: t('account.drawer.help'),
      href: `/${lang}/help/`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end bg-slate-950/40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label={t('account.drawer.menu_title')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-200"
        role="document"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('account.drawer.menu_title')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common_close')}
            className="flex h-8 w-8 items-center justify-center rounded-control text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Identity Header (No avatar photo, no tier badge, no points - clean letter circle) */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white px-5 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 border border-red-100 text-[#25A5E3] font-black text-xl shadow-sm">
              {emailInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400">
                  {t('account.drawer.hi')},
                </span>
              </div>
              <p className="truncate text-sm font-bold text-slate-900">
                {user.primary_email}
              </p>
              {user.customer_id && (
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {user.customer_id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3.5 rounded-card px-3.5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#25A5E3] transition-colors active:scale-[0.99]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-control bg-slate-100 text-slate-500 group-hover:text-[#25A5E3]">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Drawer Footer: Secure Sign Out */}
        <div className="border-t border-slate-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await onSignOut();
            }}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-card border border-red-200 bg-red-50/60 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100/80 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('account.action.sign_out')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountDrawer;
