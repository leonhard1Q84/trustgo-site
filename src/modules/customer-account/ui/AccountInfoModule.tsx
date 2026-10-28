'use client';

import React, {useState} from 'react';
import {
  Check,
  CheckCircle2,
} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import type {
  AccountManagementPreferences,
  CustomerProfileData,
  PublicAccountProfile,
} from '../domain/account.types';
import {AccountPasswordChangeDialog} from './AccountPasswordChangeDialog';
import {AccountProfileEditDialog} from './AccountProfileEditDialog';
import {AccountPhoneEditDialog} from './AccountPhoneEditDialog';
import {formatPhoneWithCountryCode, inferDialCode} from '../domain/countryData';

interface AccountInfoModuleProps {
  lang: RouteLanguage;
  account: PublicAccountProfile;
  profile?: CustomerProfileData | null;
  onUpdateProfile: (profile: Partial<CustomerProfileData>) => Promise<{success: boolean; error?: string}>;
  passwordDraft: {current: string; next: string; confirmation: string};
  passwordMessage: string | null;
  isSavingPassword: boolean;
  preferences: AccountManagementPreferences;
  preferencesMessage: string | null;
  onVerify: () => void;
  onPasswordDraftChange: (p: {current: string; next: string; confirmation: string}) => void;
  onSavePassword: (e: React.FormEvent) => void;
  onToggleBookingReminders: (enabled: boolean) => void;
  onToggleMarketing: (enabled: boolean) => void;
  onNavigateTab?: (tab: 'account_info' | 'travelers' | 'contacts') => void;
}

export const AccountInfoModule: React.FC<AccountInfoModuleProps> = ({
  lang,
  account,
  profile,
  onUpdateProfile,
  passwordDraft,
  passwordMessage,
  isSavingPassword,
  preferences,
  preferencesMessage,
  onVerify,
  onPasswordDraftChange,
  onSavePassword,
  onToggleBookingReminders,
  onToggleMarketing,
}) => {
  const {t} = useI18n(lang);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [profileSuccessBadge, setProfileSuccessBadge] = useState(false);

  const handleProfileSaved = async (data: Partial<CustomerProfileData>) => {
    const res = await onUpdateProfile(data);
    if (res.success) {
      setProfileSuccessBadge(true);
      setTimeout(() => setProfileSuccessBadge(false), 2500);
    }
    return res;
  };

  const bookingRemindersActive =
    preferences.booking_reminder_channels && preferences.booking_reminder_channels.length > 0;
  const marketingActive = Boolean(preferences.marketing_opt_in);

  const formatTitle = (titleVal?: string) => {
    if (titleVal === 'ms') return t('account.field.ms');
    if (titleVal === 'mr') return t('account.field.mr');
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-1">
        <h1 className="text-h2 font-bold tracking-tight text-foreground">
          {t('account.personal_settings.title')}
        </h1>

        {profileSuccessBadge && (
          <span className="inline-flex items-center gap-1 rounded-control bg-success-light px-2.5 py-1 text-caption font-semibold text-success shrink-0">
            <Check className="h-3.5 w-3.5" />
            <span>{t('account.status.saved')}</span>
          </span>
        )}
      </div>

      {/* 1. 基本資料 (Basic Information) */}
      <section>
        <div className="rounded-card border border-border bg-background overflow-hidden pb-3">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <h2 className="text-body font-semibold text-foreground">
              {t('account.section.basic_info')}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:underline transition-colors cursor-pointer"
            >
              <span>{t('account.action.edit_data')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 pb-2">
            <div>
              {/* Row 1: 姓名 (Unified Name Display) */}
              <div className="px-5 py-2.5 flex items-center gap-4">
                <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                  {t('account.field.name')}
                </span>
                <span className="text-body font-semibold text-foreground">
                  {[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || (
                    <span className="font-normal text-foreground-disabled">{t('account.status.not_set')}</span>
                  )}
                </span>
              </div>

              {/* Row 2: 稱謂 (Title) */}
              <div className="px-5 py-2.5 flex items-center gap-4">
                <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                  {t('account.field.title')}
                </span>
                <span className="text-body font-semibold text-foreground">
                  {formatTitle(profile?.title) ?? (
                    <span className="font-normal text-foreground-disabled">{t('account.status.not_set')}</span>
                  )}
                </span>
              </div>
            </div>

            <div>
              {/* Row 3: 出生日期 (Birth Date) */}
              <div className="px-5 py-2.5 flex items-center gap-4">
                <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                  {t('account.field.birth_date')}
                </span>
                <span className="text-body font-semibold text-foreground">
                  {profile?.birth_date ? (
                    profile.birth_date
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(true)}
                      className="font-normal text-foreground-disabled hover:text-primary transition-colors cursor-pointer"
                    >
                      {t('account.status.not_set')}
                    </button>
                  )}
                </span>
              </div>

              {/* Row 4: 會員卡號 (Member ID) */}
              <div className="px-5 py-2.5 flex items-center gap-4">
                <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                  {t('account.profile.member_number')}
                </span>
                <span className="text-body font-semibold font-mono text-foreground">
                  {account.customer_id || 'TG-9223'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 帳號安全與通訊管道 (Account Security & Communication) */}
      <section>
        <div className="rounded-card border border-border bg-background overflow-hidden pb-3">
          <div className="px-5 pt-4 pb-1">
            <h2 className="text-body font-semibold text-foreground">
              {t('account.contact.title')}
            </h2>
          </div>

          {/* Row 1: 電子郵件地址 (Email) */}
          <div className="px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0">
              <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                {t('account.field.email')}
              </span>
              <span className="text-body font-semibold text-foreground truncate">
                {account.primary_email}
              </span>
            </div>
            <div className="shrink-0">
              {account.email_verification_state === 'verified' ? (
                <span className="inline-flex items-center gap-1 text-caption font-medium text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t('account.badge.verified')}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onVerify}
                  className="text-caption font-medium text-primary hover:underline cursor-pointer"
                >
                  {t('account.security.verify_email_action')}
                </button>
              )}
            </div>
          </div>

          {/* Row 2: 行動電話 (Phone Number with Country Code) */}
          <div className="px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0">
              <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                {t('account.field.phone')}
              </span>
              <span className="text-body font-semibold text-foreground">
                {profile?.phone_number ? (
                  formatPhoneWithCountryCode(profile.phone_number, profile.phone_country_code)
                ) : (
                  <span className="font-normal text-foreground-disabled">{t('account.status.not_set')}</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPhoneModalOpen(true)}
              className="shrink-0 text-caption font-medium text-primary hover:underline cursor-pointer"
            >
              {profile?.phone_number
                ? t('account.action.edit')
                : t('account.security.link_phone_action')}
            </button>
          </div>

          {/* Row 3: 登入密碼 */}
          <div className="px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 min-w-0">
              <span className="w-24 sm:w-28 text-body text-foreground-secondary shrink-0">
                {t('account.security.password_field')}
              </span>
              <span className="text-body font-semibold text-foreground tracking-widest font-mono">
                ••••••••
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="shrink-0 text-caption font-medium text-primary hover:underline cursor-pointer"
            >
              {t('account.security.update_button')}
            </button>
          </div>
        </div>
      </section>

      {/* 3. 通知偏好 (Notification Preferences) */}
      <section>
        <div className="rounded-card border border-border bg-background overflow-hidden pb-3">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <h2 className="text-body font-semibold text-foreground">
              {t('account.section.notification_pref')}
            </h2>
            {preferencesMessage && (
              <span className="inline-flex items-center gap-1 text-caption font-medium text-success">
                <Check className="h-3 w-3" />
                <span>{preferencesMessage}</span>
              </span>
            )}
          </div>

          {/* Switch 1: 預訂與行程通知 */}
          <div className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="pr-2">
              <p className="text-body font-medium text-foreground">
                {t('account.pref.trip_notice')}
              </p>
              <p className="text-caption text-foreground-secondary mt-0.5 leading-relaxed">
                {t('account.pref.trip_notice_desc')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={bookingRemindersActive}
              aria-label={t('account.pref.trip_notice')}
              onClick={() => onToggleBookingReminders(!bookingRemindersActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                bookingRemindersActive ? 'bg-primary' : 'bg-accent'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 transform rounded-full bg-background shadow-raised transition duration-200 ${
                  bookingRemindersActive ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 2: 專屬優惠與活動 */}
          <div className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="pr-2">
              <p className="text-body font-medium text-foreground">
                {t('account.pref.exclusive_offers')}
              </p>
              <p className="text-caption text-foreground-secondary mt-0.5 leading-relaxed">
                {t('account.pref.exclusive_offers_desc')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={marketingActive}
              aria-label={t('account.pref.exclusive_offers')}
              onClick={() => onToggleMarketing(!marketingActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                marketingActive ? 'bg-primary' : 'bg-accent'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 transform rounded-full bg-background shadow-raised transition duration-200 ${
                  marketingActive ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Modal Dialog 1: Profile Edit Modal */}
      <AccountProfileEditDialog
        lang={lang}
        profile={profile}
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleProfileSaved}
      />

      {/* Modal Dialog 2: Password Change Modal */}
      <AccountPasswordChangeDialog
        lang={lang}
        account={account}
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        passwordDraft={passwordDraft}
        passwordMessage={passwordMessage}
        isSavingPassword={isSavingPassword}
        onPasswordDraftChange={onPasswordDraftChange}
        onSavePassword={async (e) => {
          await onSavePassword(e);
        }}
      />

      {/* Modal Dialog 3: Dedicated Phone Number Edit / Link Modal */}
      <AccountPhoneEditDialog
        lang={lang}
        currentCode={inferDialCode(profile?.phone_number, profile?.phone_country_code)}
        currentPhone={profile?.phone_number}
        open={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSave={handleProfileSaved}
      />
    </div>
  );
};

export default AccountInfoModule;
