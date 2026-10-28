'use client';

import React, {useState, useEffect} from 'react';
import {Loader2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogTitle} from '@/shared/ui/dialog';
import {accountErrorMessageKey} from '../domain/account.rules';
import type {CustomerProfileData} from '../domain/account.types';

interface AccountProfileEditDialogProps {
  lang: RouteLanguage;
  profile?: CustomerProfileData | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<CustomerProfileData>) => Promise<{success: boolean; error?: string}>;
}

const inputClass =
  'w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';
const labelClass = 'block text-caption font-medium text-foreground mb-1.5';

export const AccountProfileEditDialog: React.FC<AccountProfileEditDialogProps> = ({
  lang,
  profile,
  open,
  onClose,
  onSave,
}) => {
  const {t} = useI18n(lang);
  const [title, setTitle] = useState<'mr' | 'ms' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle((profile?.title as 'mr' | 'ms') || '');
      setFirstName(profile?.first_name || '');
      setLastName(profile?.last_name || '');
      setBirthDate(profile?.birth_date || '');
      setError(null);
    }
  }, [open, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await onSave({
        title: title ? title : undefined,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || undefined,
      });

      if (res.success) {
        onClose();
      } else {
        setError(t(accountErrorMessageKey(res.error, 'account.error.save_failed')));
      }
    } catch {
      setError(t('account.error.save_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="sheet" className="p-0 gap-0 overflow-y-auto">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle>{t('account.action.edit_data')} · {t('account.section.basic_info')}</DialogTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4 sm:px-6">
          {/* Title / 稱謂 */}
          <fieldset>
            <legend className={labelClass}>{t('account.field.title')}</legend>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer text-body font-medium text-foreground">
                <input
                  type="radio"
                  name="edit-title"
                  checked={title === 'ms'}
                  onChange={() => setTitle('ms')}
                  className="h-4 w-4 accent-primary"
                />
                <span>{t('account.field.ms')}</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-body font-medium text-foreground">
                <input
                  type="radio"
                  name="edit-title"
                  checked={title === 'mr'}
                  onChange={() => setTitle('mr')}
                  className="h-4 w-4 accent-primary"
                />
                <span>{t('account.field.mr')}</span>
              </label>
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name-input" className={labelClass}>
                {t('account.field.first_name')}
              </label>
              <input
                id="first-name-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="last-name-input" className={labelClass}>
                {t('account.field.last_name')}
              </label>
              <input
                id="last-name-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="birth-date-input" className={labelClass}>
              {t('account.field.birth_date')}
            </label>
            <input
              id="birth-date-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-control border border-destructive/30 bg-destructive-light px-3.5 py-2.5 text-caption font-medium text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pb-[env(safe-area-inset-bottom)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-control border border-border bg-background px-4 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {t('account.action.cancel_edit')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-control bg-primary px-5 text-body font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors cursor-pointer min-w-28"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{t('account.status.submitting')}</span>
                </>
              ) : (
                <span>{t('account.action.save_changes')}</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountProfileEditDialog;
