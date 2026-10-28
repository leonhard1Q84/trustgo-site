'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, ChevronRight, Check } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { Button } from './button';
import {
  saveConsent,
  subscribeConsent,
  getConsentSnapshot,
  OPEN_PREFERENCES_EVENT,
} from '@/shared/analytics/consent-manager';

interface CookieConsentProps {
  lang: Locale;
}

export function CookieConsent({ lang }: CookieConsentProps) {
  // Sync with client-side localStorage state safely across SSR
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    () => undefined // Server snapshot
  );

  // Modal display states
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);
  const [view, setView] = useState<'banner' | 'manage'>('banner');

  // Preference switches
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Listen to manual trigger (e.g., clicking "Cookie Settings" in footer)
  useEffect(() => {
    const handleOpenPreferences = () => {
      const current = getConsentSnapshot();
      if (current) {
        setAnalyticsEnabled(current.analytics);
        setMarketingEnabled(current.marketing);
      }
      setView('manage');
      setIsManuallyOpened(true);
    };

    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpenPreferences);
    return () => {
      window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpenPreferences);
    };
  }, []);

  // During SSR or before hydration finishes, render nothing
  if (consent === undefined) return null;

  // If user already decided and modal is not manually opened, render nothing
  const shouldShow = consent === null || isManuallyOpened;
  if (!shouldShow) return null;

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setIsManuallyOpened(false);
  };

  const handleOnlyNecessary = () => {
    saveConsent({ analytics: false, marketing: false });
    setIsManuallyOpened(false);
  };

  const handleSavePreferences = () => {
    saveConsent({
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    });
    setIsManuallyOpened(false);
  };

  return (
    <aside
      aria-label={getTranslation('cookie_consent_title', lang)}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-background border border-border rounded-card shadow-overlay p-5 transition-all duration-300 animate-fade-in"
    >
      {view === 'banner' && consent === null ? (
        /* View 1: Airbnb-style floating consent banner */
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-foreground">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {getTranslation('cookie_consent_title', lang)}
              </h3>
              <p className="text-xs text-foreground-secondary leading-relaxed mt-1">
                {getTranslation('cookie_consent_desc', lang)}{' '}
                <Link
                  href={`/${lang}/cookies`}
                  className="font-medium text-primary hover:underline underline-offset-2"
                >
                  {getTranslation('footer_col_legal_cookie', lang)}
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none font-semibold text-xs h-9 bg-foreground text-background hover:bg-foreground/90 shadow-raised"
            >
              {getTranslation('cookie_consent_accept_all', lang)}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleOnlyNecessary}
              className="flex-1 sm:flex-none text-xs h-9"
            >
              {getTranslation('cookie_consent_only_necessary', lang)}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView('manage')}
              className="w-full sm:w-auto text-xs h-9 text-foreground-secondary hover:text-foreground"
            >
              {getTranslation('cookie_consent_manage', lang)}
            </Button>
          </div>
        </div>
      ) : (
        /* View 2: Detailed preference management panel */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-foreground-secondary" />
              <h3 className="text-sm font-bold text-foreground">
                {getTranslation('cookie_consent_manage_title', lang)}
              </h3>
            </div>
            {consent === null && (
              <button
                type="button"
                onClick={() => setView('banner')}
                className="text-xs text-foreground-secondary hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{getTranslation('common_back', lang) || 'Back'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-xs">
            {/* 1. Necessary */}
            <div className="p-3 rounded-control bg-muted/60 border border-border/80 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {getTranslation('cookie_consent_cat_necessary_title', lang)}
                  </span>
                  <span className="text-xs font-medium text-success bg-success-light px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    {getTranslation('cookie_consent_always_active', lang)}
                  </span>
                </div>
                <p className="text-foreground-secondary mt-1 leading-normal text-xs">
                  {getTranslation('cookie_consent_cat_necessary_desc', lang)}
                </p>
              </div>
            </div>

            {/* 2. Analytics (GA4) */}
            <label className="p-3 rounded-control bg-background border border-border flex items-start justify-between gap-3 cursor-pointer hover:border-brand/40 transition-colors">
              <div>
                <span className="font-semibold text-foreground">
                  {getTranslation('cookie_consent_cat_analytics_title', lang)}
                </span>
                <p className="text-foreground-secondary mt-1 leading-normal text-xs">
                  {getTranslation('cookie_consent_cat_analytics_desc', lang)}
                </p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border-strong text-primary focus:ring-primary cursor-pointer"
              />
            </label>

            {/* 3. Marketing */}
            <label className="p-3 rounded-control bg-background border border-border flex items-start justify-between gap-3 cursor-pointer hover:border-brand/40 transition-colors">
              <div>
                <span className="font-semibold text-foreground">
                  {getTranslation('cookie_consent_cat_marketing_title', lang)}
                </span>
                <p className="text-foreground-secondary mt-1 leading-normal text-xs">
                  {getTranslation('cookie_consent_cat_marketing_desc', lang)}
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border-strong text-primary focus:ring-primary cursor-pointer"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSavePreferences}
              className="text-xs h-9"
            >
              {getTranslation('cookie_consent_save', lang)}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs h-9 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-raised"
            >
              {getTranslation('cookie_consent_accept_all', lang)}
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
