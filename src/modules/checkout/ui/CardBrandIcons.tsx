'use client';

import React from 'react';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'unionpay' | 'unknown';

export function detectCardBrand(cardNumber: string): CardBrand {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return 'discover';
  if (/^35/.test(clean)) return 'jcb';
  if (/^(62|81)/.test(clean)) return 'unionpay';
  return 'unknown';
}

export function formatCardNumber(value: string, brand?: CardBrand): string {
  const clean = value.replace(/\D/g, '').slice(0, 19);
  const detected = brand || detectCardBrand(clean);
  // Amex is typically 4-6-5 digits (15 digits total)
  if (detected === 'amex') {
    const p1 = clean.slice(0, 4);
    const p2 = clean.slice(4, 10);
    const p3 = clean.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }
  // Standard 4-4-4-4 (up to 19 for unionpay/generic)
  return clean.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Standard card badge container: 34px × 22px (standard ISO/IEC 7810 ID-1 ratio)
 * Crisp white background, subtle border, smooth rounded corners, official brand colors.
 */
interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VisaIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-white border border-border/80 shadow-2xs overflow-hidden ${dims} ${className}`}
      title="Visa"
      aria-label="Visa"
    >
      <svg viewBox="0 0 48 32" className="w-[84%] h-[84%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.23 21.84L21.57 7.28H25.3L22.96 21.84H19.23Z"
          fill="#1434CB"
        />
        <path
          d="M36.43 7.57C35.65 7.27 34.42 7.03 32.9 7.03C29.08 7.03 26.4 9.06 26.38 11.97C26.35 14.12 28.27 15.31 29.74 16.03C31.25 16.77 31.75 17.25 31.75 17.91C31.75 18.93 30.53 19.37 29.39 19.37C27.91 19.37 27.05 19.14 25.79 18.57L25.13 18.27L24.44 22.56C25.6 23.09 27.75 23.55 29.98 23.57C34.02 23.57 36.66 21.57 36.7 18.49C36.72 16.71 35.63 15.33 33.3 14.21C32.06 13.58 31.3 13.15 31.3 12.37C31.3 11.69 32.06 10.97 32.93 10.97C33.88 10.95 34.69 11.16 35.53 11.53L36.03 11.75L36.43 7.57Z"
          fill="#1434CB"
        />
        <path
          d="M42.1 16.74C42.26 15.89 42.92 12.33 42.92 12.33C42.9 12.35 42.36 10.87 42.06 9.49C41.87 8.59 41.51 7.28 41.51 7.28H38.08C37.33 7.28 36.73 7.71 36.45 8.38L31.14 21.84H35.06C35.06 21.84 35.7 20.07 35.86 19.63C36.29 19.63 40.1 19.63 40.64 19.63C40.76 20.17 41.13 21.84 41.13 21.84H44.6L42.1 16.74ZM36.94 16.65L38.48 12.42C38.48 12.42 38.92 10.45 39.06 9.81L39.73 13.06L40.23 15.53C40.27 15.74 40.35 16.14 40.39 16.65H36.94Z"
          fill="#1434CB"
        />
        <path
          d="M15.42 7.28H11.78C10.65 7.28 9.77 7.61 9.27 8.81L3.4 21.84H7.32C7.32 21.84 7.96 20.07 8.12 19.63H12.92C13.04 20.17 13.41 21.84 13.41 21.84H17.34L15.42 7.28ZM9.2 16.65L11.46 10.42L12.51 16.65H9.2Z"
          fill="#1434CB"
        />
        <path
          d="M9.27 8.81L7.54 17.06C7.3 15.93 6.3 14.74 5.23 14.18L8.6 22.25L12.54 22.25L15.42 7.28H11.78C10.65 7.28 9.77 7.61 9.27 8.81Z"
          fill="#FAA61A"
        />
      </svg>
    </span>
  );
}

export function MastercardIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-white border border-border/80 shadow-2xs overflow-hidden ${dims} ${className}`}
      title="Mastercard"
      aria-label="Mastercard"
    >
      <svg viewBox="0 0 36 24" className="w-[85%] h-[85%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="12" r="8" fill="#EB001B" />
        <circle cx="23" cy="12" r="8" fill="#F79E1B" fillOpacity="0.92" />
        <path
          d="M18 6.47A7.98 7.98 0 0 1 21 12a7.98 7.98 0 0 1-3 5.53A7.98 7.98 0 0 1 15 12a7.98 7.98 0 0 1 3-5.53z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

export function AmexIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-[#006FCF] border border-[#005CA8] shadow-2xs overflow-hidden ${dims} ${className}`}
      title="American Express"
      aria-label="American Express"
    >
      <svg viewBox="0 0 36 24" className="w-[88%] h-[88%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#006FCF" />
        <text
          x="18"
          y="15"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.8px"
          textAnchor="middle"
        >
          AMEX
        </text>
      </svg>
    </span>
  );
}

export function DiscoverIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-white border border-border/80 shadow-2xs overflow-hidden ${dims} ${className}`}
      title="Discover"
      aria-label="Discover"
    >
      <svg viewBox="0 0 40 24" className="w-[90%] h-[90%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="24" rx="2" fill="#FFFFFF" />
        <path d="M4 14.5L10 14.5C11.5 14.5 12.5 13.5 12.5 12C12.5 10.5 11.5 9.5 10 9.5L4 9.5L4 14.5Z" stroke="#231F20" strokeWidth="1.6" />
        <circle cx="21" cy="12" r="5" fill="#FF6000" />
        <path d="M29 9.5L31.5 14.5L34 9.5" stroke="#231F20" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function JcbIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-white border border-border/80 shadow-2xs overflow-hidden ${dims} ${className}`}
      title="JCB"
      aria-label="JCB"
    >
      <svg viewBox="0 0 36 24" className="w-[84%] h-[84%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="8" height="16" rx="2" fill="#0E4EA1" />
        <rect x="14" y="4" width="8" height="16" rx="2" fill="#E60012" />
        <rect x="23" y="4" width="8" height="16" rx="2" fill="#008836" />
        <text x="9" y="15" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">J</text>
        <text x="18" y="15" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">C</text>
        <text x="27" y="15" fill="#FFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">B</text>
      </svg>
    </span>
  );
}

export function UnionPayIcon({ className = '', size = 'md' }: IconProps) {
  const dims = size === 'sm' ? 'w-7 h-4.5' : size === 'lg' ? 'w-10 h-6.5' : 'w-8 h-5.5';
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[4px] bg-white border border-border/80 shadow-2xs overflow-hidden ${dims} ${className}`}
      title="UnionPay"
      aria-label="UnionPay"
    >
      <svg viewBox="0 0 36 24" className="w-[86%] h-[86%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="5" width="8" height="14" rx="1.5" fill="#C8102E" />
        <rect x="14" y="5" width="8" height="14" rx="1.5" fill="#004D9D" />
        <rect x="22" y="5" width="8" height="14" rx="1.5" fill="#007A3D" />
        <path d="M9 12H11M17 12H19M25 12H27" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Renders the official brand icon based on the detected card brand.
 */
export function CardBrandIcon({
  brand,
  className = '',
  size = 'md',
}: {
  brand: CardBrand;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  switch (brand) {
    case 'visa':
      return <VisaIcon className={className} size={size} />;
    case 'mastercard':
      return <MastercardIcon className={className} size={size} />;
    case 'amex':
      return <AmexIcon className={className} size={size} />;
    case 'discover':
      return <DiscoverIcon className={className} size={size} />;
    case 'jcb':
      return <JcbIcon className={className} size={size} />;
    case 'unionpay':
      return <UnionPayIcon className={className} size={size} />;
    default:
      return null;
  }
}
