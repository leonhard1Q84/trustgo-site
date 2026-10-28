'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { getStoredConsent, applyGtagConsent } from './consent-manager';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Check if user already granted consent in previous visit
    const stored = getStoredConsent();
    if (stored) {
      applyGtagConsent(stored);
    }
  }, []);

  return (
    <>
      {/* 1. Google Consent Mode v2 Default Configuration (Strict Privacy by Default) */}
      <script
        id="google-consent-mode-default"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* 2. Load Google Tag library if Measurement ID is provided */}
      {measurementId && (
        <>
          <Script
            id="google-analytics-tag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('js', new Date());
                gtag('config', '${measurementId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=Lax;Secure'
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
