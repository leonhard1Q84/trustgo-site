'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { GuestOrderList, useGuestLookup } from '@/modules/booking-management/public-api';
import { bookingLookupModalPath } from '@/modules/booking-management/domain/access-recovery';
import { useBookingList } from '@/modules/booking-management/application/use-booking-list';

const ORDER_HELP_LINKS: ReadonlyArray<{ key: string; topic: string }> = [
  { key: 'bm_help_manage', topic: 'managing-a-reservation' },
  { key: 'bm_help_pickup', topic: 'pickup-and-return' },
  { key: 'bm_help_deposit', topic: 'pricing-payment-and-deposit' },
];

export default function OrdersPage() {
  const { t, routeLang: lang } = useI18n();
  const router = useRouter();
  const { result, error } = useBookingList();
  const { openLookup } = useGuestLookup();
  useEffect(() => {
    if (result?.status === 'missing') router.replace(bookingLookupModalPath(lang));
  }, [result, router, lang]);
  if (error) throw error;
  return (
    <div className="mx-auto max-w-default space-y-6 px-4 py-8 pb-16 md:px-8 lg:px-10">
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
        {t('guest_list_title')}
      </h1>
      {!result || result.status === 'missing' ? (
        <div aria-busy="true" className="space-y-4">
          <Skeleton className="h-11 w-64" />
          <Skeleton className="h-48 rounded-card" />
        </div>
      ) : (
        <>
          <GuestOrderList orders={result.orders} lang={lang} />
          <Button
            variant="text"
            className="h-auto min-h-11 gap-2 whitespace-normal px-0 py-2 text-left"
            onClick={() => openLookup()}
          >
            <PlusCircle className="size-4 shrink-0" aria-hidden="true" />
            {t('bm_lookup_add')}
          </Button>
          <section aria-labelledby="order-help-heading" className="mt-10 border-t border-border pt-8">
            <h2
              id="order-help-heading"
              className="text-title font-semibold text-foreground"
            >
              {t('bm_help_title')}
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {ORDER_HELP_LINKS.map(({ key, topic }) => (
                <li key={topic}>
                  <Link
                    href={`/${lang}/help/faq/${topic}`}
                    className="flex min-h-12 items-center justify-between gap-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    <span>{t(key)}</span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${lang}/help`}
              className="mt-3 inline-flex min-h-11 items-center gap-0.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t('bm_help_all')}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
