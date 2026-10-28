'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/shared/ui/utils';

export type BookingStep = 'rate' | 'driver' | 'checkout';

interface BookingProgressStepperProps {
  currentStep: BookingStep;
  lang: string;
  vehicleId?: string;
  insuranceId?: string;
  /** Previous step; rendered as the back arrow on the left (replaces in-page "Back to…" links). */
  backHref?: string;
  backLabel?: string;
}

/**
 * Sticky booking-flow bar under the global header (Design Guidelines §8.1):
 * back arrow + step indicator. PC shows all steps, H5 shows "Step 2 of 3 · Driver details".
 */
export function BookingProgressStepper({
  currentStep,
  lang,
  vehicleId = 'toyota-rav4-suv',
  insuranceId = 'basic',
  backHref,
  backLabel,
}: BookingProgressStepperProps) {
  const { t } = useI18n();
  // Catalog labels carry a "1. " prefix; the indicator already shows the number.
  const label = (key: string) => t(key).replace(/^\d+\.\s*/, '');
  const steps: { id: BookingStep; label: string; href?: string }[] = [
    {
      id: 'rate',
      label: label('step_rate'),
      href: currentStep === 'driver' && backHref ? backHref : `/${lang}/rent/${vehicleId}?insurance=${insuranceId}`,
    },
    { id: 'driver', label: label('step_driver'), href: `/${lang}/book/driver?vehicleId=${vehicleId}&insurance=${insuranceId}` },
    { id: 'checkout', label: label('step_checkout') },
  ];
  const currentIdx = steps.findIndex((s) => s.id === currentStep);
  const current = steps[currentIdx];

  return (
    <div className="sticky top-14 z-20 border-b border-border bg-background lg:top-18">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            title={backLabel}
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <span className="w-8 shrink-0 md:hidden" aria-hidden="true" />
        )}

        <p className="flex-1 truncate text-sm text-foreground md:hidden">
          <span className="text-muted-foreground">
            {t('step_counter').replace('{current}', String(currentIdx + 1)).replace('{total}', String(steps.length))}
          </span>
          {' · '}
          <span className="font-semibold">{current?.label}</span>
        </p>

        <nav aria-label={t('step_progress')} className="hidden flex-1 md:block">
          <ol className="flex items-center justify-center gap-3">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentIdx;
              const isCompleted = idx < currentIdx;
              const content = (
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                      isCurrent && 'bg-primary text-primary-foreground',
                      isCompleted && 'bg-accent text-foreground',
                      !isCurrent && !isCompleted && 'border border-border-strong text-muted-foreground'
                    )}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : idx + 1}
                  </span>
                  <span
                    className={cn(
                      'whitespace-nowrap text-sm',
                      isCurrent ? 'font-semibold text-foreground' : 'text-foreground-secondary'
                    )}
                  >
                    {step.label}
                  </span>
                </span>
              );
              return (
                <li key={step.id} className="flex items-center gap-3" aria-current={isCurrent ? 'step' : undefined}>
                  {isCompleted && step.href ? (
                    <Link href={step.href} className="rounded-full hover:underline underline-offset-4">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                  {idx < steps.length - 1 && <span className="h-px w-10 bg-border-strong" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
