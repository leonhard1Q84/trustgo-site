'use client';

import React from 'react';
import type { RouteLanguage } from '@/i18n/locales';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { useAuthModal } from '../application/AuthModalContext';
import { AuthUnifiedCard } from './AuthUnifiedCard';

interface AuthModalProps {
  lang: RouteLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({ lang }) => {
  const { isOpen, closeAuthModal, options } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent
        variant="sheet"
        className="sm:max-w-[480px] p-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <div className="max-h-[85dvh] overflow-y-auto pt-6">
          {isOpen && <AuthUnifiedCard
            lang={lang}
            isModal={true}
            initialEmail={options.defaultEmail}
            initialView={options.initialView}
            redirectUrl={options.redirectUrl}
            onSuccess={options.onSuccess}
          />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
