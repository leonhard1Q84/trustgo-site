'use client';

import Link from 'next/link';

import React, {useState} from 'react';
import {
  Car,
  Check,
  ChevronRight,
  Clock,
  Copy,
  LogOut,
  Settings,
  Smartphone,
} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import type {PublicAccountProfile} from '../domain/account.types';

interface AccountOverviewHubProps {
  lang: RouteLanguage;
  account: PublicAccountProfile;
  onSelectTab: (tab: 'account_info' | 'travelers' | 'contacts') => void;
  onSignOut: () => void;
}

export const AccountOverviewHub: React.FC<AccountOverviewHubProps> = ({
  lang,
  account,
  onSelectTab,
  onSignOut,
}) => {
  const {t} = useI18n(lang);
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!account.customer_id) return;
    try {
      await navigator.clipboard.writeText(account.customer_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const menuItems = [
    {
      key: 'account_info' as const,
      icon: Settings,
      title: t('account.tabs.personal_settings'),
      action: () => onSelectTab('account_info'),
    },
    {
      key: 'travelers' as const,
      icon: Car,
      title: t('account.tabs.license'),
      action: () => onSelectTab('travelers'),
    },
    {
      key: 'contacts' as const,
      icon: Smartphone,
      title: t('account.section.contact_info'),
      action: () => onSelectTab('contacts'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Member Profile Card */}
      <section className="rounded-card border border-border bg-background p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground text-title font-semibold flex items-center justify-center shrink-0">
            {(account.profile?.first_name?.[0] || account.primary_email?.[0] || 'T').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-body font-semibold text-foreground truncate">
              {account.profile?.first_name && account.profile?.last_name
                ? `${account.profile.first_name} ${account.profile.last_name}`
                : account.primary_email.split('@')[0]}
            </p>
            <p className="text-caption text-foreground-secondary truncate">
              {account.primary_email}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="min-w-0">
            <span className="text-caption text-muted-foreground block">
              {t('account.profile.member_number')}
            </span>
            <span className="text-body font-semibold font-mono tracking-wide text-foreground block mt-0.5">
              {account.customer_id || 'TG-9223'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center justify-center h-8 w-8 rounded-control border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={t('account.action.copy_id')}
            aria-label={t('account.action.copy_id')}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </section>

      {/* 2. Navigation Menu */}
      <nav aria-label={t('account.tabs.personal_settings')} className="space-y-3">
        <div className="overflow-hidden rounded-card border border-border bg-background divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.key}
                onClick={item.action}
                className="flex min-h-12 w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-body font-medium text-foreground">
                    {item.title}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}

          {/* Orders link to dedicated manage-booking page */}
          <Link
            href={`/${lang}/manage-booking/orders`}
            className="flex min-h-12 w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-body font-medium text-foreground">
                {t('account.nav.orders')}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        {/* 3. Sign Out */}
        <div className="rounded-card border border-border bg-background">
          <button
            type="button"
            onClick={onSignOut}
            className="flex min-h-12 w-full items-center gap-3 px-4 py-3.5 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground rounded-card transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{t('account.action.security_sign_out')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AccountOverviewHub;
