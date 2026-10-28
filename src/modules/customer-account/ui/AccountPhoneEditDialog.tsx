'use client';

import React, {useState, useEffect} from 'react';
import {Loader2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogTitle} from '@/shared/ui/dialog';
import {PHONE_DIAL_OPTIONS} from '../domain/countryData';
import type {CustomerProfileData} from '../domain/account.types';

interface AccountPhoneEditDialogProps {
  lang: RouteLanguage;
  currentCode?: string;
  currentPhone?: string;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<CustomerProfileData>) => Promise<{success: boolean; error?: string}>;
}

export const AccountPhoneEditDialog: React.FC<AccountPhoneEditDialogProps> = ({
  lang,
  currentCode = '+81',
  currentPhone = '',
  open,
  onClose,
  onSave,
}) => {
  const {t} = useI18n(lang);
  const [countryCode, setCountryCode] = useState(currentCode || '+81');
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCountryCode(currentCode || '+81');
      setPhoneNumber(currentPhone || '');
      setError(null);
    }
  }, [open, currentCode, currentPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNumber = phoneNumber.trim();
    if (!cleanNumber) {
      setError(t('account.error.contact_fields_required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSave({
        phone_country_code: countryCode,
        phone_number: cleanNumber,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || t('account.error.save_failed'));
      }
    } catch {
      setError(t('account.error.save_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="sheet" className="p-0 gap-0 overflow-y-auto">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle>
            {currentPhone ? t('account.contact.edit_contact') : t('account.security.link_phone_action')}
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4 sm:px-6">
          <div>
            <label
              htmlFor="phone-number-input"
              className="block text-caption font-medium text-foreground mb-1.5"
            >
              {t('account.field.phone')}
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                aria-label={t('account.field.phone_country_code')}
                className="w-32 shrink-0 rounded-control border border-border bg-background px-3 py-2.5 text-body text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong"
              >
                {PHONE_DIAL_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.dialCode}>
                    {opt.label[lang] || opt.label.en}
                  </option>
                ))}
              </select>
              <input
                id="phone-number-input"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="912345678"
                className={inputClass}
              />
            </div>
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

export default AccountPhoneEditDialog;
