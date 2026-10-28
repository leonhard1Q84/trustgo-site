import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/locales';
import { cn } from './utils';

interface BrandLogoProps {
  lang?: Locale;
  variant?: 'header' | 'footer' | 'icon-only';
  className?: string;
}

export function BrandLogo({ lang = 'en', variant = 'header', className = '' }: BrandLogoProps) {
  const homeHref = `/${lang}`;

  if (variant === 'icon-only') {
    return (
      <Link href={homeHref} className={`inline-flex items-center ${className}`}>
        <div className="w-9 h-9 rounded-control bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-raised">
          TG
        </div>
      </Link>
    );
  }

  return (
    <Link href={homeHref} className={cn('inline-flex items-center gap-2 group', className)}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-brand group-hover:opacity-90 transition-opacity">
            Trust<span className="text-warm">Go</span>
          </span>
          <span className="text-xs font-medium text-muted-foreground border-l border-border pl-2 hidden sm:inline">
            Car Rental
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground -mt-0.5">
          Go Easy. Go Happy.
        </span>
      </div>
    </Link>
  );
}
