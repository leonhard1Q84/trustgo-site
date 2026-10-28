'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { ShieldCheck, UploadCloud, IdCard } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';

export function OnlineCheckinBanner() {
  const { t } = useI18n();
  const [showModal, setShowModal] = useState(false);
  const uploaded = false;

  return (
    <>
      <div className="bg-background rounded-card border border-border p-3.5 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 text-foreground-secondary flex items-center justify-center shrink-0">
            <IdCard className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              {t('bm_checkin_title')}
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {t('bm_checkin_description')}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className="h-auto min-h-11 max-w-full whitespace-normal text-xs shrink-0 self-start sm:self-center"
        >
          {uploaded ? `✓ ${t('bm_checkin_submitted')}` : t('bm_checkin_start')}
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent variant="sheet" hideCloseButton className="p-5 sm:p-6 max-w-lg overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-foreground-secondary" aria-hidden="true" />
              <DialogTitle className="text-sm sm:text-sm">
                {t('bm_checkin_title')}
              </DialogTitle>
            </div>
          </div>

          <div className="space-y-4 text-xs text-foreground-secondary">
            <DialogDescription>{t('bm_checkin_description')}</DialogDescription>

            <div className="p-5 rounded-control border-2 border-dashed border-border-strong bg-muted/50 text-center space-y-2 cursor-pointer hover:border-primary transition-colors">
              <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto" />
              <div>
                <p className="font-semibold text-foreground">
                  {t('bm_checkin_upload')}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {t('bm_checkin_formats')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="h-auto min-h-11 max-w-full whitespace-normal text-xs"
              >
                {t('common_close')}
              </Button>
              <Button
                type="button"
                disabled
                title={t('rental_service_unavailable')}
                className="h-auto min-h-11 max-w-full whitespace-normal text-xs"
              >
                {t('bm_checkin_submit')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
