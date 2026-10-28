'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, CircleAlert, Copy, Loader2, MessageCircle } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { B2B_CONTACT } from '../domain/franchise-data';
import { applicationLimits } from '../domain/partnership-application';

interface PartnershipFormProps {
  lang: RouteLanguage;
  onSuccess?: () => void;
  onClose?: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'unavailable' | 'invalid';

export function PartnershipForm({ lang, onSuccess, onClose }: PartnershipFormProps) {
  const { t } = useI18n(lang);
  const [state, setState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [selectedFleetSize, setSelectedFleetSize] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');

  const pending = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fleetSizeOptions = [
    'franchise_fleet_under_20',
    'franchise_fleet_20_50',
    'franchise_fleet_50_200',
    'franchise_fleet_over_200',
  ];
  const fleetSizePrefix = selectedFleetSize ? `[${t(selectedFleetSize)}] ` : '';

  function handleFleetSizeSelect(option: string) {
    setSelectedFleetSize((current) => (current === option ? '' : option));
  }

  async function copyWechat() {
    try {
      await navigator.clipboard.writeText(B2B_CONTACT.wechat);
      setCopiedWechat(true);
      setTimeout(() => setCopiedWechat(false), 2000);
    } catch {
      // Fallback
    }
  }

  function resetFeedback() {
    if (!pending.current && state !== 'idle') {
      setState('idle');
      setErrors({});
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      contactName: String(data.get('contactName') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      help: `${fleetSizePrefix}${helpText.trim()}`.trim(),
    };

    const nextErrors: Record<string, string> = {};
    if (!values.contactName) nextErrors.contactName = t('franchise_required');
    if (!values.company) nextErrors.company = t('franchise_required');
    if (!values.email) {
      nextErrors.email = t('franchise_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = t('franchise_invalid_email');
    }
    if (data.get('consent') !== 'on') {
      nextErrors.consent = t('franchise_required');
    }
    if (values.help.length > applicationLimits.help) {
      nextErrors.help = t('franchise_help_too_long');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setState('invalid');
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    const payload = JSON.stringify({ ...values, consent: true, lang });
    if (attempt.current?.payload !== payload) {
      attempt.current = { payload, id: crypto.randomUUID() };
    }

    pending.current = true;
    setState('submitting');

    try {
      const response = await fetch('/api/franchise-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': attempt.current.id,
        },
        body: payload,
        signal: AbortSignal.timeout(20_000),
      });

      const result = await response.json().catch(() => null);
      if (response.ok && result?.accepted === true) {
        form.reset();
        setSelectedFleetSize('');
        setHelpText('');
        attempt.current = null;
        setState('success');
        onSuccess?.();
      } else {
        setState(response.status === 503 ? 'unavailable' : 'error');
      }
    } catch {
      setState('error');
    } finally {
      pending.current = false;
    }
  }

  // Clean, respectful success state
  if (state === 'success') {
    return (
      <div className="py-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>

        <h3 className="mt-3 text-body font-bold text-foreground">{t('franchise_success')}</h3>

        {/* WeChat quick direct contact */}
        <div className="mx-auto mt-5 max-w-xs rounded-control border border-border bg-muted/30 p-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded bg-success/10 text-success">
                <MessageCircle className="size-3.5" />
              </div>
              <span className="font-mono text-caption font-semibold text-foreground">
                {t('franchise_wechat')}: {B2B_CONTACT.wechat}
              </span>
            </div>
            <button
              type="button"
              onClick={copyWechat}
              className="inline-flex items-center gap-1 rounded-tag border border-border bg-background px-2 py-0.5 text-caption font-medium text-foreground hover:bg-muted"
            >
              {copiedWechat ? (
                <Check className="size-2.5 text-success" />
              ) : (
                <Copy className="size-2.5 text-muted-foreground" />
              )}
              <span>{t(copiedWechat ? 'franchise_copied' : 'franchise_copy')}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={onClose}
            className="h-10 min-h-10 px-6 rounded-control text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs"
          >
            {t('franchise_modal_close')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      onChange={resetFeedback}
      noValidate
      className="space-y-4"
      aria-busy={state === 'submitting'}
    >
      <fieldset disabled={state === 'submitting'} className="space-y-3.5">
        {/* Contact Name & Company */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="partnership-contactName"
              className="mb-1 block text-caption font-medium text-foreground"
            >
              {t('franchise_name')} <span className="text-destructive">*</span>
            </label>
            <input
              id="partnership-contactName"
              name="contactName"
              type="text"
              autoComplete="name"
              maxLength={applicationLimits.contactName}
              required
              placeholder={t('franchise_name')}
              aria-invalid={Boolean(errors.contactName)}
              className="w-full rounded-control border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-destructive"
            />
            {errors.contactName && (
              <p className="mt-0.5 text-caption text-destructive">{errors.contactName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="partnership-company"
              className="mb-1 block text-caption font-medium text-foreground"
            >
              {t('franchise_company')} <span className="text-destructive">*</span>
            </label>
            <input
              id="partnership-company"
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={applicationLimits.company}
              required
              placeholder={t('franchise_company')}
              aria-invalid={Boolean(errors.company)}
              className="w-full rounded-control border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-destructive"
            />
            {errors.company && (
              <p className="mt-0.5 text-caption text-destructive">{errors.company}</p>
            )}
          </div>
        </div>

        {/* Business Email */}
        <div>
          <label
            htmlFor="partnership-email"
            className="mb-1 block text-caption font-medium text-foreground"
          >
            {t('franchise_email')} <span className="text-destructive">*</span>
          </label>
          <input
            id="partnership-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={applicationLimits.email}
            required
            placeholder="name@company.com"
            aria-invalid={Boolean(errors.email)}
            className="w-full rounded-control border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-destructive"
          />
          {errors.email && <p className="mt-0.5 text-caption text-destructive">{errors.email}</p>}
        </div>

        {/* Fleet Size Chips */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span id="partnership-fleet-size" className="text-caption font-medium text-foreground">
              {t('franchise_fleet_size')}
            </span>
            <div
              role="group"
              aria-labelledby="partnership-fleet-size"
              className="flex flex-wrap gap-1.5"
            >
              {fleetSizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selectedFleetSize === option}
                  onClick={() => handleFleetSizeSelect(option)}
                  className={`rounded-tag px-2.5 py-1 text-xs transition-colors ${
                    selectedFleetSize === option
                      ? 'border border-primary bg-primary text-white font-medium shadow-2xs'
                      : 'border border-border bg-muted/40 text-foreground hover:bg-muted'
                  }`}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Goals Textarea */}
        <div>
          <label htmlFor="partnership-help" className="sr-only">
            {t('franchise_goals')}
          </label>
          <textarea
            id="partnership-help"
            name="help"
            rows={2}
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            maxLength={applicationLimits.help - fleetSizePrefix.length}
            placeholder={t('franchise_goals')}
            aria-invalid={Boolean(errors.help)}
            aria-describedby={errors.help ? 'partnership-help-error' : undefined}
            className="w-full rounded-control border border-input bg-background p-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
          {errors.help && (
            <p id="partnership-help-error" className="mt-0.5 text-caption text-destructive">
              {errors.help}
            </p>
          )}
        </div>

        {/* Privacy Checkbox */}
        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-2 text-caption text-foreground-secondary">
            <input
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 size-3.5 shrink-0 rounded border-input text-primary accent-primary"
            />
            <span>
              {t('franchise_consent')} ·{' '}
              <Link
                href={`/${lang}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {t('franchise_privacy_link')}
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="text-caption text-destructive mt-0.5">{errors.consent}</p>
          )}
        </div>
      </fieldset>

      {/* Error alert */}
      {(state === 'error' || state === 'unavailable') && (
        <div
          role="alert"
          className="flex gap-2 rounded-control bg-destructive-light p-2.5 text-caption text-destructive"
        >
          <CircleAlert className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{t(state === 'unavailable' ? 'franchise_unavailable' : 'franchise_error')}</p>
        </div>
      )}

      {/* Submit Button with standard primary style */}
      <Button
        type="submit"
        disabled={state === 'submitting'}
        className="h-11 min-h-11 w-full rounded-control text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs"
      >
        {state === 'submitting' && (
          <Loader2 className="mr-2 size-4 shrink-0 animate-spin" aria-hidden="true" />
        )}
        {t(state === 'submitting' ? 'franchise_submitting' : 'franchise_submit')}
      </Button>
    </form>
  );
}
