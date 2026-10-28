'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CreditCard,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { PaymentCardDetails } from '../domain/types';
import { RentalError } from '@/modules/reservation/domain/validation';
import { paymentCardValidationError } from '../domain/payment-validation';
import {
  detectCardBrand,
  formatCardNumber,
  CardBrandIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DiscoverIcon,
  JcbIcon,
} from './CardBrandIcons';

interface StripeCardFormProps {
  amount: number;
  currency: string;
  isProcessing: boolean;
  canPay?: boolean;
  driverEmail?: string;
  defaultCardholderName?: string;
  onPay: (card: PaymentCardDetails) => Promise<void>;
}

const POPULAR_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China (中国)' },
  { code: 'JP', name: 'Japan (日本)' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'KR', name: 'South Korea (대한민국)' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong (香港)' },
  { code: 'TW', name: 'Taiwan (台灣)' },
];

export function StripeCardForm({
  amount,
  currency,
  isProcessing,
  canPay = true,
  driverEmail = '',
  defaultCardholderName = '',
  onPay,
}: StripeCardFormProps) {
  const { t } = useI18n();
  const [card, setCard] = useState<PaymentCardDetails>({
    cardNumber: '',
    cardholderName: defaultCardholderName,
    expiryDate: '',
    cvc: '',
    postalCode: '',
  });

  const [country, setCountry] = useState('US');
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time card brand detection
  const detectedBrand = detectCardBrand(card.cardNumber);

  const handleCardNumberChange = (val: string) => {
    const formatted = formatCardNumber(val);
    setCard((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCard((prev) => ({ ...prev, expiryDate: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCard((prev) => ({ ...prev, expiryDate: raw }));
    }
  };

  const handleCvcChange = (val: string) => {
    const maxLen = detectedBrand === 'amex' ? 4 : 4;
    const clean = val.replace(/\D/g, '').slice(0, maxLen);
    setCard((prev) => ({ ...prev, cvc: clean }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (isProcessing || !canPay) {
      setErrorMessage(t('rental_order_not_payable'));
      return;
    }

    if (!agreed) {
      setErrorMessage(t('ck_accept_terms'));
      return;
    }

    const cardError = paymentCardValidationError(card);
    if (cardError) {
      setErrorMessage(t(cardError === 'invalid_expiry' ? 'ck_invalid_expiry' : 'rental_invalid_card'));
      return;
    }

    try {
      await onPay(card);
    } catch (error) {
      setErrorMessage(t(`rental_${error instanceof RentalError ? error.code : 'service_unavailable'}`));
    } finally {
      setCard((current) => ({ ...current, cardNumber: '', cvc: '' }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background rounded-card p-6 sm:p-7 border border-border shadow-raised space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {t('ck_secure_payment')}
            </h2>
          </div>
          <p className="text-xs text-foreground-secondary mt-1">
            {t('ck_ssl_secure_subtext')}
          </p>
        </div>
      </div>

      {/* Payment Method Selector (Stripe Elements Tab Style) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-foreground">
          {t('ck_secure_payment')}
        </label>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-control bg-background border-2 border-primary text-foreground text-xs font-bold shadow-xs">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>{t('ck_card_tab')}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-1" />
          </div>
        </div>
      </div>

      {/* Contact Email for Voucher Delivery */}
      <dl className="space-y-1.5">
        <dt className="text-xs font-bold text-foreground">{t('ck_contact_email')}</dt>
        <dd className="break-all text-sm text-foreground-secondary">{driverEmail}</dd>
      </dl>

      {/* Card Information Unified Container (Stripe Elements Signature UI) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-foreground">
              {t('ck_card_info')} <span className="text-warm-strong">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground">{t('ck_cvc_hint')}</span>
          </div>

          <div className="rounded-lg border border-border bg-background shadow-2xs overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            {/* Top Row: Card Number */}
            <div className="relative flex items-center px-3.5 py-3">
              <div className="mr-2.5 shrink-0">
                {detectedBrand !== 'unknown' ? (
                  <CardBrandIcon brand={detectedBrand} size="sm" />
                ) : (
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder={t('ck_card_placeholder')}
                value={card.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={23}
                className="w-full bg-transparent text-sm font-mono font-medium text-foreground placeholder:text-muted-foreground focus:outline-none pr-32"
              />

              {/* Official Card Brand Logos inside input */}
              <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none select-none">
                {detectedBrand === 'unknown' ? (
                  <>
                    <VisaIcon size="sm" />
                    <MastercardIcon size="sm" />
                    <AmexIcon size="sm" />
                    <DiscoverIcon size="sm" />
                    <JcbIcon size="sm" />
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                    <CardBrandIcon brand={detectedBrand} size="md" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Expiry Date & CVC */}
            <div className="grid grid-cols-2 border-t border-border bg-muted/20">
              {/* Expiry Date */}
              <div className="px-3.5 py-2.5 border-r border-border focus-within:bg-background transition-colors">
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">
                  {t('ck_card_expires')}
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder={t('ck_expiry')}
                  value={card.expiryDate}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  maxLength={5}
                  className="w-full bg-transparent text-xs font-mono font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* CVC / CVV */}
              <div className="relative flex flex-col justify-center px-3.5 py-2.5 focus-within:bg-background transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {t('ck_card_cvc')}
                  </label>
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={card.cvc}
                  onChange={(e) => handleCvcChange(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {t('ck_cardholder_name')} <span className="text-warm-strong">*</span>
          </label>
          <input
            type="text"
            required
            autoComplete="cc-name"
            placeholder={t('ck_card_name')}
            value={card.cardholderName}
            onChange={(e) => setCard({ ...card, cardholderName: e.target.value })}
            className="w-full h-11 px-3.5 rounded-control border border-border bg-muted/40 focus:bg-background focus:border-primary text-xs font-medium text-foreground focus:outline-none transition-all"
          />
        </div>

        {/* Billing Address: Country or Region & Postal Code (Stripe Standard) */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {t('ck_country_or_region')} &amp; {t('ck_postal_code')}
          </label>
          <div className="rounded-lg border border-border bg-background shadow-2xs overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            {/* Country Dropdown */}
            <div className="relative border-b border-border px-3.5 py-2.5 bg-muted/10">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none bg-transparent text-xs font-medium text-foreground focus:outline-none pr-8 cursor-pointer"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-3 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Postal Code Input */}
            <div className="px-3.5 py-2.5">
              <input
                type="text"
                autoComplete="postal-code"
                placeholder={t('ck_zip_placeholder')}
                value={card.postalCode || ''}
                onChange={(e) => setCard({ ...card, postalCode: e.target.value })}
                className="w-full bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded text-primary border-border focus:ring-primary mt-0.5 cursor-pointer"
          />
          <span className="text-xs text-foreground-secondary leading-relaxed">
            {t('ck_terms_agreement_text')
              .split(/(\{terms\}|\{rental_policy\}|\{privacy\})/g)
              .map((part, i) => {
                if (part === '{terms}') {
                  return (
                    <span key={i} className="text-primary hover:underline font-medium">
                      {t('ck_terms')}
                    </span>
                  );
                }
                if (part === '{rental_policy}') {
                  return (
                    <span key={i} className="text-primary hover:underline font-medium">
                      {t('ck_rental_policy')}
                    </span>
                  );
                }
                if (part === '{privacy}') {
                  return (
                    <span key={i} className="text-primary hover:underline font-medium">
                      {t('ck_privacy')}
                    </span>
                  );
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
              })}
          </span>
        </label>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-control bg-warm-light border border-warm/20 flex items-center gap-2.5 text-xs text-foreground animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-warm-strong shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Stripe-style Pay Button */}
      <div className="space-y-4 pt-2">
        <button
          type="submit"
          disabled={isProcessing || !canPay}
          className="w-full h-12 rounded-control bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-overlay transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('ck_authorizing')}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                {t('ck_confirm_and_pay')
                  .replace('{currency}', currency)
                  .replace('{amount}', String(amount))}
              </span>
            </>
          )}
        </button>

        {/* Trust Badges & Certifications */}
        <div className="rounded-control bg-muted/40 border border-border/80 px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            {t('ck_pci_certified')}
          </span>
          <span className="hidden sm:inline text-border font-bold">&middot;</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            256-bit SSL
          </span>
          <span className="hidden sm:inline text-border font-bold">&middot;</span>
          <span className="text-foreground-secondary">{t('ck_instant_voucher')}</span>
        </div>

      </div>

      {/* H5 Sticky Bottom Pay Bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-sm shadow-bottombar lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <span className="text-xs text-muted-foreground block">{t('ck_total_due')}</span>
            <span className="text-xl font-bold text-foreground tracking-tight tabular-nums">
              {currency}{amount}
            </span>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !canPay}
            className="h-11 shrink-0 px-6 rounded-control bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-raised transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('ck_processing')}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>{t('ck_pay_now')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
