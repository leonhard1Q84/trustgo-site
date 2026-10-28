'use client';

import React from 'react';
import Link from 'next/link';
import type {RouteLanguage} from '@/i18n/locales';

interface AccountRichTextConsentProps {
  lang: RouteLanguage;
  rawText: string;
  className?: string;
}

/**
 * Safely parses translated strings containing <terms>...</terms> and <privacy>...</privacy>
 * into clickable Next.js Links opening in a new tab.
 * Stops propagation so clicking the legal link does not toggle parent checkboxes.
 */
export const AccountRichTextConsent: React.FC<AccountRichTextConsentProps> = ({
  lang,
  rawText,
  className,
}) => {
  const parts: React.ReactNode[] = [];
  const regex = /(<terms>(.*?)<\/terms>|<privacy>(.*?)<\/privacy>)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(rawText.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith('<terms>')) {
      const linkText = match[2];
      parts.push(
        <Link
          key={`terms-${match.index}`}
          href={`/${lang}/terms/`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:text-primary-hover underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {linkText}
        </Link>,
      );
    } else if (fullMatch.startsWith('<privacy>')) {
      const linkText = match[3];
      parts.push(
        <Link
          key={`privacy-${match.index}`}
          href={`/${lang}/privacy/`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:text-primary-hover underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {linkText}
        </Link>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    parts.push(rawText.substring(lastIndex));
  }

  return (
    <span
      className={
        className ??
        'text-xs sm:text-sm font-medium text-foreground leading-relaxed select-text'
      }
    >
      {parts}
    </span>
  );
};
