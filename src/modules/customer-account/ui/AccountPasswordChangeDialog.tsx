'use client';

import React, {useState, useEffect} from 'react';
import {Eye, EyeOff, Loader2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogDescription, DialogTitle} from '@/shared/ui/dialog';
import {validatePassword} from '../domain/account.rules';
import type {PublicAccountProfile} from '../domain/account.types';

interface AccountPasswordChangeDialogProps {
  lang: RouteLanguage;
  account: PublicAccountProfile;
  open: boolean;
  onClose: () => void;
  passwordDraft: {current: string; next: string; confirmation: string};
  passwordMessage: string | null;
  isSavingPassword: boolean;
  onPasswordDraftChange: (p: {current: string; next: string; confirmation: string}) => void;
  onSavePassword: (e: React.FormEvent) => void;
}

export const AccountPasswordChangeDialog: React.FC<AccountPasswordChangeDialogProps> = ({
  lang,
  account,
  open,
  onClose,
  passwordDraft,
  passwordMessage,
  isSavingPassword,
  onPasswordDraftChange,
  onSavePassword,
}) => {
  const {t} = useI18n(lang);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNextPassword, setShowNextPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLocalError(null);
      onPasswordDraftChange({current: '', next: '', confirmation: ''});
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (account.password_state !== 'not_set' && !passwordDraft.current) {
      setLocalError(t('account.error.password_required'));
      return;
    }

    const check = validatePassword(passwordDraft.next);
    if (!check.valid) {
      setLocalError(t(check.messageKey ?? 'account.error.password_complexity'));
      return;
    }

    if (passwordDraft.next !== passwordDraft.confirmation) {
      setLocalError(t('account.error.password_mismatch'));
      return;
    }

    onSavePassword(e);
  };

  const inputClass =
    'w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';
  const labelClass = 'block text-caption font-medium text-foreground mb-1.5';
  const eyeButtonClass =
    'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer';

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="sheet" className="p-0 gap-0 overflow-y-auto">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle>{t('account.security.change_password')}</DialogTitle>
          {account.password_state === 'not_set' && (
            <DialogDescription>{t('account.security.password_not_set_desc')}</DialogDescription>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4 sm:px-6">
          {account.password_state !== 'not_set' && (
            <div>
              <label htmlFor="modal-current-password" className={labelClass}>
                {t('account.security.current_password')}
              </label>
              <div className="relative">
                <input
                  id="modal-current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={passwordDraft.current}
                  onChange={(e) => onPasswordDraftChange({...passwordDraft, current: e.target.value})}
                  className={`${inputClass} pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className={eyeButtonClass}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="modal-new-password" className={labelClass}>
              {t('account.security.new_password')}
            </label>
            <div className="relative">
              <input
                id="modal-new-password"
                type={showNextPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={passwordDraft.next}
                onChange={(e) => onPasswordDraftChange({...passwordDraft, next: e.target.value})}
                className={`${inputClass} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNextPassword((prev) => !prev)}
                className={eyeButtonClass}
              >
                {showNextPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-caption text-foreground-secondary mt-1">
              {t('account.field.password_hint')}
            </p>
          </div>

          <div>
            <label htmlFor="modal-confirm-password" className={labelClass}>
              {t('account.security.confirm_password')}
            </label>
            <div className="relative">
              <input
                id="modal-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={passwordDraft.confirmation}
                onChange={(e) => onPasswordDraftChange({...passwordDraft, confirmation: e.target.value})}
                className={`${inputClass} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className={eyeButtonClass}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {(localError || passwordMessage) && (
            <div
              role="status"
              className={`rounded-control px-3.5 py-2.5 text-caption font-medium ${
                passwordMessage && passwordMessage === t('account.security.password_updated')
                  ? 'border border-success/30 bg-success-light text-success'
                  : 'border border-destructive/30 bg-destructive-light text-destructive'
              }`}
            >
              {localError || passwordMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pb-[env(safe-area-inset-bottom)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSavingPassword}
              className="h-10 rounded-control border border-border bg-background px-4 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {t('account.action.cancel_edit')}
            </button>
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-primary px-5 text-body font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors cursor-pointer min-w-28"
            >
              {isSavingPassword ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{t('account.status.submitting')}</span>
                </>
              ) : (
                <span>{t('account.security.update_button')}</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountPasswordChangeDialog;
