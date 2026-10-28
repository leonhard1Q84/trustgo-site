'use client';

import React from 'react';
import {Pencil, Plus, Trash2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogTitle} from '@/shared/ui/dialog';
import {Button} from '@/shared/ui/button';
import {getPhoneCodeDisplayName} from '../domain/countryData';
import type {PublicAccountProfile, SavedContactProfile} from '../domain/account.types';
import {AccountContactForm} from './AccountContactForm';

interface AccountContactsModuleProps {
  lang: RouteLanguage;
  contacts: SavedContactProfile[];
  account: PublicAccountProfile;
  onVerify: () => void;
  contactEditor: SavedContactProfile | null | undefined;
  onStartAdd: () => void;
  onStartEdit: (c: SavedContactProfile) => void;
  onCloseEditor: () => void;
  onSavedContacts: (list: SavedContactProfile[]) => void;
  onDelete: (c: SavedContactProfile) => void;
  onDefault: (c: SavedContactProfile) => void;
}

export const AccountContactsModule: React.FC<AccountContactsModuleProps> = ({
  lang,
  contacts,
  account,
  onVerify,
  contactEditor,
  onStartAdd,
  onStartEdit,
  onCloseEditor,
  onSavedContacts,
  onDelete,
  onDefault,
}) => {
  const {t} = useI18n(lang);
  const hasContacts = contacts.length > 0;
  const isEmailVerified = account.email_verification_state === 'verified';
  const emailStatusKey = isEmailVerified
    ? 'account.security.verified_status'
    : account.email_verification_state === 'pending'
      ? 'account.contact.email_pending'
      : 'account.security.unverified_status';

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3 pb-1">
        <h1 className="text-h2 font-bold tracking-tight text-foreground">
          {t('account.section.contact_info')}
        </h1>

        {/* Desktop-only Add Button (Hidden on Mobile to avoid duplication with sticky CTA) */}
        <Button type="button" size="sm" onClick={onStartAdd} className="hidden md:inline-flex shrink-0 gap-1.5 whitespace-normal">
          <Plus aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>{t('account.contact.add')}</span>
        </Button>
      </div>

      <section className="rounded-card border border-border bg-background p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-body font-semibold text-foreground">{t('account.contact.account_email')}</h2>
            <p className="break-all text-body text-foreground">{account.primary_email}</p>
            <p role="status" className="text-caption text-foreground-secondary">{t(emailStatusKey)}</p>
          </div>
          {!isEmailVerified && (
            <Button type="button" variant="text" onClick={onVerify} className="h-auto min-h-11 self-start whitespace-normal px-0 py-2 md:shrink-0 md:self-center">
              {t('account.security.verify_email_action')}
            </Button>
          )}
        </div>
      </section>

      {!hasContacts ? (
        <p className="text-body text-foreground-secondary">{t('account.contact.add_details_hint')}</p>
      ) : (
        <section className="space-y-3">
          <h2 className="text-title font-semibold text-foreground">{t('account.contact.saved_contacts')}</h2>
          {contacts.map((contact) => (
            <article
              key={contact.contact_id}
              className="rounded-card border border-border bg-background p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-body font-semibold text-foreground">{contact.contact_name}</h3>
                    {contact.is_default_booking && (
                      <span className="rounded-tag bg-muted px-2 py-0.5 text-caption font-medium text-foreground-secondary">
                        {t('account.contact.default')}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 break-all text-caption text-foreground-secondary">{contact.contact_email}</p>
                  <p className="mt-0.5 text-caption font-medium text-foreground">
                    {getPhoneCodeDisplayName(contact.phone_country_code, lang)} {contact.phone_number}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {!contact.is_default_booking && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onDefault(contact)}
                      className="whitespace-normal text-caption font-medium"
                    >
                      {t('account.contact.set_default')}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onStartEdit(contact)}
                    className="gap-1 whitespace-normal text-caption font-medium"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>{t('account.action.edit')}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(contact)}
                    className="gap-1 whitespace-normal text-caption font-medium text-destructive hover:bg-destructive-light"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('account.action.delete')}</span>
                  </Button>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {contact.uses.map((use) => (
                  <span key={use} className="rounded-tag bg-muted px-2.5 py-0.5 text-caption text-foreground-secondary">
                    {t(`account.contact.use.${use}`)}
                  </span>
                ))}
                {contact.receipt_invoice_email && (
                  <span className="min-w-0 break-all rounded-tag bg-muted px-2.5 py-0.5 text-caption text-foreground-secondary">
                    {t('account.contact.receipt_invoice_badge')}: {contact.receipt_invoice_email}
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Mobile-only Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md shadow-bottombar md:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <Button
          type="button"
          onClick={onStartAdd}
          className="h-auto min-h-11 w-full gap-2 whitespace-normal"
        >
          <Plus aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>{t('account.contact.add')}</span>
        </Button>
      </div>

      {/* Add / Edit Contact Dialog */}
      <Dialog open={contactEditor !== undefined} onOpenChange={(open) => { if (!open) onCloseEditor(); }}>
        <DialogContent variant="sheet" className="p-0 gap-0">
          <DialogTitle className="sr-only">
            {contactEditor ? t('account.contact.edit_contact') : t('account.contact.add')}
          </DialogTitle>
          <AccountContactForm
            lang={lang}
            contact={contactEditor ?? undefined}
            accountEmail={account.primary_email}
            onClose={onCloseEditor}
            onSaved={onSavedContacts}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountContactsModule;
