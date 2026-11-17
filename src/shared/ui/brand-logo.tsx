import Image from 'next/image';
import Link from 'next/link';
import { getDictionary, type Locale } from '@/i18n/locales';
import { cn } from './utils';

interface BrandLogoProps {
  lang?: Locale;
  variant?: 'header' | 'footer' | 'icon-only';
  className?: string;
}

export function BrandLogo({ lang = 'en', variant = 'header', className = '' }: BrandLogoProps) {
  const dict = getDictionary(lang);
  const iconOnly = variant === 'icon-only';

  return (
    <Link
      href={`/${lang}`}
      aria-label={`${dict.brand.name} — ${dict.nav.home}`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control align-middle transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        iconOnly ? 'size-11 p-1' : variant === 'footer' ? 'h-14 w-34' : 'h-11 w-28 lg:h-14 lg:w-34',
        className
      )}
    >
      <Image
        src={iconOnly ? '/brand/trustgo-icon.png' : '/brand/trustgo-logo.svg'}
        alt="TrustGo Car Rental"
        width={iconOnly ? 800 : 135}
        height={iconOnly ? 800 : 57}
        unoptimized
        className="block size-full object-contain"
      />
    </Link>
  );
}
