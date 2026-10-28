'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

export function CheckoutExpiryDialog({ expired }: { expired: boolean }) {
  const { t, routeLang } = useI18n();
  const [dismissed, setDismissed] = useState(false);
  return (
    <Dialog open={expired && !dismissed} onOpenChange={open => { if (!open) setDismissed(true); }}>
      <DialogContent variant="sheet" hideCloseButton>
        <DialogHeader>
          <DialogTitle>{t('ck_hold_expired_title')}</DialogTitle>
          <DialogDescription className="text-body">{t('ck_hold_expired_desc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-wrap">
          <Button variant="secondary" className="h-auto min-h-12 whitespace-normal" onClick={() => setDismissed(true)}>{t('ck_cancel_close')}</Button>
          <Button asChild className="h-auto min-h-12 whitespace-normal">
            <Link href={`/${routeLang}/rent`}>{t('ck_hold_search')}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
