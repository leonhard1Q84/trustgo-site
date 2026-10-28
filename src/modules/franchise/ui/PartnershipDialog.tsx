'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { PartnershipForm } from './PartnershipForm';

interface PartnershipDialogProps {
  lang: RouteLanguage;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PartnershipDialog({
  lang,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PartnershipDialogProps) {
  const { t } = useI18n(lang);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        variant="sheet"
        hideCloseButton
        className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6"
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            aria-label={t('franchise_modal_close')}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </DialogClose>
        <DialogHeader className="text-left pb-1">
          {/* Clean title without repetitive descriptions */}
          <DialogTitle className="text-h2 font-bold text-foreground">
            {t('franchise_apply')}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <PartnershipForm lang={lang} onClose={() => onOpenChange?.(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
