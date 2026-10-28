'use client';

import React, {useState} from 'react';
import {BookOpen, Loader2, Plus, Save, Trash2} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import {CustomerAccountService} from '../application/customerAccountService';
import {accountErrorMessageKey, documentTypeRequiresExpiry} from '../domain/account.rules';
import {COUNTRIES, getCountryDisplayName} from '../domain/countryData';
import type {
  PublicSavedTravelerProfile,
  SavedTravelerInput,
  TravelerDocumentType,
} from '../domain/account.types';
import {AccountNameGuidelinesDialog} from './AccountNameGuidelinesDialog';

interface TravelerDocumentDraft {
  document_id?: string;
  document_type: TravelerDocumentType;
  document_number: string;
  document_number_masked?: string;
  issuing_region: string;
  expiry_date: string;
}

interface AccountTravelerFormProps {
  lang: RouteLanguage;
  traveler?: PublicSavedTravelerProfile;
  onClose: () => void;
  onSaved: (travelers: PublicSavedTravelerProfile[]) => void;
}

const inputClass = 'w-full rounded-control border border-border bg-background px-3 py-2 text-body text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-ring focus:ring-2 focus:ring-ring/20 hover:border-border-strong';

export function AccountTravelerForm({lang, traveler, onClose, onSaved}: AccountTravelerFormProps) {
  const {t} = useI18n(lang);
  const [givenNames, setGivenNames] = useState(traveler?.given_names ?? '');
  const [surname, setSurname] = useState(traveler?.surname ?? '');
  const noSurname = traveler?.no_surname ?? false;
  const [birthDate, setBirthDate] = useState(traveler?.birth_date ?? '');
  const [nationality, setNationality] = useState(traveler?.nationality_region ?? 'JP');
  const [gender, setGender] = useState<NonNullable<PublicSavedTravelerProfile['gender']>>(traveler?.gender ?? 'unspecified');
  const [isDefault, setIsDefault] = useState(traveler?.is_default ?? false);
  const [documents, setDocuments] = useState<TravelerDocumentDraft[]>(
    traveler?.documents.map((document) => ({
      document_id: document.document_id,
      document_type: document.document_type,
      document_number: '',
      document_number_masked: document.document_number_masked,
      issuing_region: document.issuing_region,
      expiry_date: document.expiry_date ?? '',
    })) ?? [{
      document_type: 'passport',
      document_number: '',
      issuing_region: 'JP',
      expiry_date: '',
    }],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const updateDocument = (index: number, patch: Partial<TravelerDocumentDraft>) => {
    setDocuments((current) => current.map((doc, docIndex) => docIndex === index ? {...doc, ...patch} : doc));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!givenNames.trim() || (!noSurname && !surname.trim()) || (noSurname && surname.trim())) {
      setError(t('account.error.name_required'));
      return;
    }
    setIsSaving(true);
    const payload: SavedTravelerInput = {
      given_names: givenNames,
      surname: noSurname ? undefined : surname,
      no_surname: noSurname,
      birth_date: birthDate,
      nationality_region: nationality,
      gender,
      is_default: isDefault,
      consent_confirmed: true,
      documents: documents
        .filter((d) => d.document_number.trim() || d.document_id)
        .map((d) => ({
          document_id: d.document_id,
          document_type: d.document_type,
          document_number: d.document_number,
          issuing_region: d.issuing_region,
          expiry_date: d.expiry_date || undefined,
        })),
    };

    const response = await CustomerAccountService.saveTraveler(payload, traveler?.traveler_id);

    if (response.success && response.travelers) {
      onSaved(response.travelers);
    } else {
      setError(t(accountErrorMessageKey(response.error, 'account.error.save_failed')));
    }
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 pr-14 sm:px-6">
        <h2 className="text-title font-semibold text-foreground">
          {traveler ? t('account.traveler.edit_traveler') : t('account.traveler.add')}
        </h2>
        <button
          type="button"
          onClick={() => setIsGuidelinesOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-control border border-border bg-background px-2.5 text-caption font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>{t('account.name_guidelines.title')}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
              {/* 1. Given Names */}
              <div>
                <label htmlFor="traveler-given-names" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.given_names')} <span className="text-destructive">*</span>
                </label>
                <input
                  id="traveler-given-names"
                  value={givenNames}
                  onChange={(event) => setGivenNames(event.target.value)}
                  placeholder={t('account.field.given_names_hint')}
                  className={inputClass}
                  required
                />
              </div>

              {/* 2. Surname */}
              <div>
                <label htmlFor="traveler-surname" className="mb-1 block text-caption font-medium text-foreground">
                  {t('account.field.surname')} {!noSurname && <span className="text-destructive">*</span>}
                </label>
                <input
                  id="traveler-surname"
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                  disabled={noSurname}
                  placeholder={t('account.field.surname_hint')}
                  className={`${inputClass} disabled:bg-muted disabled:text-foreground-disabled`}
                  required={!noSurname}
                />
              </div>
            </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* 3. Nationality */}
            <div>
              <label htmlFor="traveler-nationality" className="mb-1 block text-caption font-medium text-foreground">
                {t('account.field.nationality')} <span className="text-destructive">*</span>
              </label>
              <select
                id="traveler-nationality"
                value={nationality}
                onChange={(event) => setNationality(event.target.value)}
                className={inputClass}
                required
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {getCountryDisplayName(country.code, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Birth Date */}
            <div>
              <label htmlFor="traveler-birth-date" className="mb-1 block text-caption font-medium text-foreground">
                {t('account.field.birth_date')} <span className="text-destructive">*</span>
              </label>
              <input
                id="traveler-birth-date"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* 5. Gender */}
            <div>
              <label htmlFor="traveler-gender" className="mb-1 block text-caption font-medium text-foreground">
                {t('account.field.gender')}
              </label>
              <select
                id="traveler-gender"
                value={gender}
                onChange={(event) => setGender(event.target.value as typeof gender)}
                className={inputClass}
              >
                <option value="unspecified">{t('account.gender.unspecified')}</option>
                <option value="female">{t('account.gender.female')}</option>
                <option value="male">{t('account.gender.male')}</option>
              </select>
            </div>
          </div>

          {/* Travel Documents Section */}
          <section className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-body font-semibold text-foreground">{t('account.traveler.documents')}</h3>
              <button
                type="button"
                onClick={() =>
                  setDocuments((current) => [
                    ...current,
                    {document_type: 'government_id', document_number: '', issuing_region: nationality || 'JP', expiry_date: ''},
                  ])
                }
                className="inline-flex h-7 items-center gap-1 rounded-control border border-border px-2.5 text-caption font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t('account.traveler.add_document')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {documents.map((document, index) => (
                <div key={document.document_id ?? `new-${index}`} className="rounded-control border border-border bg-muted p-3 sm:p-3.5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-caption font-semibold text-foreground-secondary">
                      {t('account.traveler.document_number_label')} #{index + 1}
                    </span>
                    {documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDocuments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive-light hover:text-destructive transition-colors cursor-pointer"
                        aria-label={t('account.traveler.remove_document')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-caption font-medium text-foreground-secondary">{t('account.field.document_type')}</label>
                      <select
                        value={document.document_type}
                        onChange={(event) => updateDocument(index, {document_type: event.target.value as TravelerDocumentType})}
                        className={inputClass}
                      >
                        <option value="passport">{t('account.document.type.passport')}</option>
                        <option value="driver_license">{t('account.document.type.driver_license')}</option>
                        <option value="government_id">{t('account.document.type.government_id')}</option>
                        <option value="international_driving_permit">{t('account.document.type.international_driving_permit')}</option>
                        <option value="certified_translation">{t('account.document.type.certified_translation')}</option>
                        <option value="other_id">{t('account.document.type.other_id')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-caption font-medium text-foreground-secondary">{t('account.field.document_issuing_region')}</label>
                      <select
                        value={document.issuing_region}
                        onChange={(event) => updateDocument(index, {issuing_region: event.target.value})}
                        className={inputClass}
                        required
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {getCountryDisplayName(country.code, lang)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-caption font-medium text-foreground-secondary">{t('account.field.document_number')}</label>
                      <input
                        value={document.document_number}
                        onChange={(event) => updateDocument(index, {document_number: event.target.value})}
                        placeholder={document.document_number_masked ?? t('account.field.document_number_placeholder')}
                        className={`${inputClass} font-mono`}
                        required={!document.document_id}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-caption font-medium text-foreground-secondary">{t('account.field.document_expiry')}</label>
                      <input
                        type="date"
                        value={document.expiry_date}
                        onChange={(event) => updateDocument(index, {expiry_date: event.target.value})}
                        className={inputClass}
                        required={documentTypeRequiresExpiry(document.document_type)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Options: Default Traveler */}
          <div className="border-t border-border pt-3">
            <label className="flex items-center gap-2 text-body font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(event) => setIsDefault(event.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span>{t('account.traveler.set_default')}</span>
            </label>
          </div>

          {error && (
            <p role="alert" className="rounded-control border border-destructive/30 bg-destructive-light px-3.5 py-2.5 text-caption font-medium text-destructive">
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
              <span>{t('account.traveler.save')}</span>
            </button>
          </div>
        </div>
      </form>

      <AccountNameGuidelinesDialog
        lang={lang}
        open={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />
    </div>
  );
}
