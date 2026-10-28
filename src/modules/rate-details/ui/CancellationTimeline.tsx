'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { RouteLanguage } from '@/i18n/locales';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import type { CancellationPolicy, RentalTripDetails } from '../domain/types';
import { cancellationHeadline, cancellationRows } from '../domain/cancellation-presentation';

interface CancellationTimelineProps {
  policy: CancellationPolicy;
  trip?: RentalTripDetails;
  lang?: RouteLanguage;
}

export function CancellationTimeline({ policy, trip, lang = 'en' }: CancellationTimelineProps) {
  const { t } = useI18n(lang);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [now, setNow] = useState<number>();
  useEffect(() => {
    // Refresh time-sensitive wording while keeping server and initial client markup identical.
    const refresh = () => setNow(Date.now());
    const initial = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);
  const headline = cancellationHeadline(policy, trip, lang, t, now);
  const rows = cancellationRows(policy, trip, lang, t);

  return (
    <section
      className="border-y border-border py-8 md:py-10"
      aria-labelledby="cancellation-heading"
    >
      <div className="flex items-start gap-4">
        <CalendarCheck className="mt-1 h-6 w-6 shrink-0 text-foreground" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="cancellation-heading" className="text-h3 font-semibold text-foreground">
            {t('rd_cancel_title')}
          </h2>
          <p className="mt-3 text-title font-semibold text-foreground">{headline}</p>
          <p className="mt-2 text-body text-foreground-secondary">
            {t(policy.freeCancellationHours ? 'rd_cancel_summary' : 'rd_cancel_no_refund')}
          </p>
          <p className="mt-2 text-caption text-muted-foreground">
            {t('ct_timezone_notice')}
            {trip?.timeZone ? ` · ${trip.timeZone}` : ''}
          </p>
          <Button
            ref={triggerRef}
            variant="text"
            onClick={() => setOpen(true)}
            className="mt-2 h-auto min-h-11 whitespace-normal px-0 py-2 text-left underline underline-offset-4"
          >
            {t('rd_cancel_detail')}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          variant="full"
          hideCloseButton
          aria-describedby={undefined}
          className="max-md:inset-0 max-md:h-dvh max-md:max-h-none max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:animate-none"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <DialogHeader className="flex-row items-center justify-between gap-4">
            <DialogTitle>{t('rd_cancel_title')}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" aria-label={t('common_close')}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <DialogBody className="min-h-0 py-6 md:py-8">
            <p className="text-title font-semibold">{headline}</p>
            <p className="mt-2 text-caption text-muted-foreground">
              {t('ct_timezone_notice')}
              {trip?.timeZone ? ` · ${trip.timeZone}` : ''}
            </p>
            <ol className="mt-8">
              {rows.map((row, index) => (
                <li key={index} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-foreground bg-background" />
                    {index < rows.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-title font-semibold">{row.title}</h3>
                    {row.period && (
                      <p className="mt-2 text-body text-foreground-secondary">{row.period}</p>
                    )}
                    <p className="mt-1 text-body text-foreground-secondary">{row.refund}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-border pt-6 text-body text-foreground-secondary">
              {t('rd_cancel_changes')}
            </p>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </section>
  );
}
