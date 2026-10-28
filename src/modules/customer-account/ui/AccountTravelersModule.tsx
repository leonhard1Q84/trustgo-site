'use client';

import React from 'react';
import {FileText, Pencil, Plus, Trash2, UsersRound} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {Dialog, DialogContent, DialogTitle} from '@/shared/ui/dialog';
import {Button} from '@/shared/ui/button';
import {getCountryDisplayName} from '../domain/countryData';
import type {PublicSavedTravelerProfile} from '../domain/account.types';
import {AccountTravelerForm} from './AccountTravelerForm';

interface AccountTravelersModuleProps {
  lang: RouteLanguage;
  travelers: PublicSavedTravelerProfile[];
  travelerEditor: PublicSavedTravelerProfile | null | undefined;
  onStartAdd: () => void;
  onStartEdit: (t: PublicSavedTravelerProfile) => void;
  onCloseEditor: () => void;
  onSavedTravelers: (list: PublicSavedTravelerProfile[]) => void;
  onDelete: (t: PublicSavedTravelerProfile) => void;
  onDefault: (t: PublicSavedTravelerProfile) => void;
}

function formatDate(value: string | undefined, lang: RouteLanguage) {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang, {year: 'numeric', month: 'short', day: 'numeric'}).format(date);
}

export const AccountTravelersModule: React.FC<AccountTravelersModuleProps> = ({
  lang,
  travelers,
  travelerEditor,
  onStartAdd,
  onStartEdit,
  onCloseEditor,
  onSavedTravelers,
  onDelete,
  onDefault,
}) => {
  const {t} = useI18n(lang);
  const hasTravelers = travelers.length > 0;

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3 pb-1">
        <h1 className="text-h2 font-bold tracking-tight text-foreground">{t('account.tabs.license')}</h1>

        {/* Desktop-only Add Button */}
        {hasTravelers && (
          <Button type="button" size="sm" onClick={onStartAdd} className="hidden sm:inline-flex shrink-0 gap-1.5">
            <Plus className="h-4 w-4" />
            <span>{t('account.traveler.add')}</span>
          </Button>
        )}
      </div>

      {!hasTravelers ? (
        <div className="rounded-card border border-dashed border-border bg-background p-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-card bg-muted text-muted-foreground mb-3">
            <UsersRound className="h-5 w-5" />
          </div>
          <p className="text-title font-semibold text-foreground">{t('account.traveler.empty_title')}</p>
          <p className="mt-1 text-caption text-foreground-secondary max-w-sm mx-auto">{t('account.traveler.empty_desc')}</p>

          <Button type="button" size="sm" onClick={onStartAdd} className="mt-4 hidden sm:inline-flex gap-1.5">
            <Plus className="h-4 w-4" />
            <span>{t('account.traveler.add')}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {travelers.map((traveler) => (
            <article
              key={traveler.traveler_id}
              className="rounded-card border border-border bg-background p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-body font-semibold text-foreground">
                      {traveler.no_surname
                        ? traveler.given_names
                        : `${traveler.surname ?? ''} ${traveler.given_names}`.trim()}
                    </h3>
                    {traveler.is_default && (
                      <span className="rounded-tag bg-muted px-2 py-0.5 text-caption font-medium text-foreground-secondary">
                        {t('account.traveler.default')}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-caption text-foreground-secondary">
                    {getCountryDisplayName(traveler.nationality_region, lang)} · {formatDate(traveler.birth_date, lang)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!traveler.is_default && (
                    <Button type="button" variant="secondary" size="sm" onClick={() => onDefault(traveler)} className="text-caption font-medium">
                      {t('account.traveler.set_default')}
                    </Button>
                  )}
                  <Button type="button" variant="secondary" size="sm" onClick={() => onStartEdit(traveler)} className="gap-1 text-caption font-medium">
                    <Pencil className="h-3.5 w-3.5" />
                    <span>{t('account.action.edit')}</span>
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => onDelete(traveler)} className="gap-1 text-caption font-medium text-destructive hover:bg-destructive-light">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('account.action.delete')}</span>
                  </Button>
                </div>
              </div>

              {/* Documents preview */}
              {traveler.documents && traveler.documents.length > 0 && (
                <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
                  {traveler.documents.map((doc) => (
                    <div
                      key={doc.document_id}
                      className="flex items-center gap-2 rounded-control bg-muted p-2.5 text-caption text-foreground-secondary"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground">{t(`account.document.type.${doc.document_type}`)}</span>
                        <span className="ml-1.5 font-mono">{doc.document_number_masked}</span>
                        <p className="mt-0.5">
                          {getCountryDisplayName(doc.issuing_region, lang)}
                          {doc.expiry_date ? ` · ${doc.expiry_date}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Mobile-only Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md shadow-bottombar sm:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          onClick={onStartAdd}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-control bg-primary px-4 text-body font-semibold text-primary-foreground hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t('account.traveler.add')}</span>
        </button>
      </div>

      {/* Add / Edit Traveler Dialog */}
      <Dialog open={travelerEditor !== undefined} onOpenChange={(open) => { if (!open) onCloseEditor(); }}>
        <DialogContent variant="sheet" className="p-0 gap-0">
          <DialogTitle className="sr-only">
            {travelerEditor ? t('account.traveler.edit_traveler') : t('account.traveler.add')}
          </DialogTitle>
          <AccountTravelerForm
            lang={lang}
            traveler={travelerEditor ?? undefined}
            onClose={onCloseEditor}
            onSaved={onSavedTravelers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountTravelersModule;
