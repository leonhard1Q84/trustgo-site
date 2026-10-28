'use client';

import React, {useState} from 'react';
import {Loader2, Phone, Save} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {CustomerAccountService} from '../application/customerAccountService';
import {accountErrorMessageKey} from '../domain/account.rules';
import {PHONE_DIAL_OPTIONS} from '../domain/countryData';
import type {SavedContactProfile, SavedContactInput} from '../domain/account.types';

const uses = ['booking_confirmation', 'trip_updates', 'customer_service', 'receipt_invoice'] as const;
type ContactUse = (typeof uses)[number];

interface AccountContactFormProps {
  lang: RouteLanguage;
  contact?: SavedContactProfile;
  accountEmail: string;
  onClose: () => void;
  onSaved: (contacts: SavedContactProfile[]) => void;
}

const inputClass = 'w-full rounded-control border border-border bg-background px-3 py-2 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';

export function AccountContactForm({lang, contact, accountEmail, onClose, onSaved}: AccountContactFormProps) {
  const {t} = useI18n(lang);
  // Parse initial names from existing contact_name
  const initialNames = (() => {
    if (!contact?.contact_name) return {firstName: '', lastName: ''};
    const parts = contact.contact_name.trim().split(/\s+/);
    if (parts.length === 1) return {firstName: parts[0], lastName: ''};
    return {lastName: parts[0], firstName: parts.slice(1).join(' ')};
  })();

  const [lastName, setLastName] = useState(initialNames.lastName);
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [email, setEmail] = useState(contact?.contact_email ?? accountEmail);
  const [countryCode, setCountryCode] = useState(contact?.phone_country_code ?? '+81');
  const [phone, setPhone] = useState(contact?.phone_number ?? '');
  const [selectedUses, setSelectedUses] = useState<ContactUse[]>(contact?.uses ?? ['booking_confirmation', 'trip_updates']);
  const [isDefault, setIsDefault] = useState(contact?.is_default_booking ?? false);
  const [receiptEmail, setReceiptEmail] = useState(contact?.receipt_invoice_email ?? '');
  const [recipientName, setRecipientName] = useState(contact?.invoice_recipient_name ?? '');
  const [invoiceAddress, setInvoiceAddress] = useState(contact?.invoice_address ?? '');
  const [taxId, setTaxId] = useState(contact?.invoice_tax_id ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleUse = (value: ContactUse) => {
    setSelectedUses((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const fullName = [lastName.trim(), firstName.trim()].filter(Boolean).join(' ');
    if (!fullName || !email.trim() || !phone.trim() || selectedUses.length === 0) {
      setError(t('account.error.contact_fields_required'));
      return;
    }
    if (selectedUses.includes('receipt_invoice') && !receiptEmail.trim()) {
      setError(t('account.error.receipt_email_required'));
      return;
    }

    setIsSaving(true);
    const input: SavedContactInput = {
      contact_name: fullName,
      contact_email: email,
      phone_country_code: countryCode,
      phone_number: phone,
      uses: selectedUses,
      is_default_booking: isDefault,
      receipt_invoice_email: receiptEmail || undefined,
      invoice_recipient_name: recipientName || undefined,
      invoice_address: invoiceAddress || undefined,
      invoice_tax_id: taxId || undefined,
    };
    const response = await CustomerAccountService.saveContact(input, contact?.contact_id);
    if (response.success && response.contacts) {
      onSaved(response.contacts);
      onClose();
    } else {
      setError(t(accountErrorMessageKey(response.error, 'account.error.save_failed')));
    }
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="text-title font-semibold text-foreground">
          {contact ? t('account.contact.edit_contact') : t('account.contact.add')}
        </h2>
      </div>

      <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          {/* Contact Details Section */}
          <section>
            <h3 className="mb-3 text-caption font-semibold text-foreground-secondary">{t('account.contact.information')}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Last Name */}
              <div>
                <label htmlFor="account-contact-last-name" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.last_name')} <span className="text-destructive">*</span>
                </label>
                <input
                  id="account-contact-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={t('account.field.last_name_hint')}
                  className={inputClass}
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="account-contact-first-name" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.first_name')} <span className="text-destructive">*</span>
                </label>
                <input
                  id="account-contact-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={t('account.field.first_name_hint')}
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="account-contact-email" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.contact_email')} <span className="text-destructive">*</span>
                </label>
                <input
                  id="account-contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Dial Code Select */}
              <div>
                <label htmlFor="account-contact-country-code" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.phone_country_code')} <span className="text-destructive">*</span>
                </label>
                <select
                  id="account-contact-country-code"
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  className={inputClass}
                  required
                >
                  {PHONE_DIAL_OPTIONS.map((opt) => (
                    <option key={opt.dialCode} value={opt.dialCode}>
                      {opt.label[lang] || opt.label.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="account-contact-phone" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.phone_number')} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-disabled" />
                  <input
                    id="account-contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={`${inputClass} pl-8.5 font-mono`}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Uses Section */}
          <section className="border-t border-border pt-3">
            <h3 className="text-caption font-semibold text-foreground-secondary">{t('account.contact.uses_title')}</h3>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {uses.map((use) => (
                <label
                  key={use}
                  className={`flex items-center gap-2.5 rounded-control border p-2.5 text-body font-medium transition-colors cursor-pointer select-none ${
                    selectedUses.includes(use)
                      ? 'border-ring bg-brand-light text-foreground'
                      : 'border-border bg-background text-foreground-secondary hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUses.includes(use)}
                    onChange={() => toggleUse(use)}
                    className="h-3.5 w-3.5 rounded accent-primary"
                  />
                  <span>{t(`account.contact.use.${use}`)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Invoice / Receipt Section */}
          {selectedUses.includes('receipt_invoice') && (
            <section className="border-t border-border pt-3">
              <h3 className="mb-2.5 text-caption font-semibold text-foreground-secondary">{t('account.contact.receipt_invoice_title')}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="account-receipt-email" className="mb-1 block text-caption font-medium text-foreground">
                    {t('account.field.receipt_invoice_email')} <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="account-receipt-email"
                    type="email"
                    value={receiptEmail}
                    onChange={(event) => setReceiptEmail(event.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="account-invoice-recipient" className="mb-1 block text-caption font-medium text-foreground">
                    {t('account.field.invoice_recipient_name')}
                  </label>
                  <input
                    id="account-invoice-recipient"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="account-invoice-tax-id" className="mb-1 block text-caption font-medium text-foreground">
                    {t('account.field.invoice_tax_id')}
                  </label>
                  <input
                    id="account-invoice-tax-id"
                    value={taxId}
                    onChange={(event) => setTaxId(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="account-invoice-address" className="mb-1 block text-caption font-medium text-foreground">
                    {t('account.field.invoice_address')}
                  </label>
                  <textarea
                    id="account-invoice-address"
                    value={invoiceAddress}
                    onChange={(event) => setInvoiceAddress(event.target.value)}
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>

            </section>
          )}

          {/* Options: Set Default */}
          <div className="border-t border-border pt-3">
            <label className="flex items-center gap-2 text-body font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(event) => setIsDefault(event.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span>{t('account.contact.set_default')}</span>
            </label>
          </div>

          {error && (
            <p role="alert" className="rounded-control border border-destructive/30 bg-destructive-light px-3.5 py-2 text-caption font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-muted px-5 py-3.5 sm:px-6 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5">
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-control border border-border bg-background px-4 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {t('account.action.cancel_edit')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-control bg-primary px-5 text-body font-semibold text-primary-foreground hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>{t('account.contact.save')}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
