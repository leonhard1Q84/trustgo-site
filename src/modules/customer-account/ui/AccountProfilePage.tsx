'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {
  ArrowLeft,
  Car,
  Check,
  ChevronRight,
  Clock,
  Copy,
  LogOut,
  Settings,
  Smartphone,
} from 'lucide-react';
import type {RouteLanguage} from '@/i18n/locales';
import {useI18n} from '@/i18n/useI18n';
import { BrandLogo } from '@/shared/ui/brand-logo';
import {useAuth} from '../application/AuthContext';
import {CustomerAccountService} from '../application/customerAccountService';
import {validatePassword} from '../domain/account.rules';
import type {
  AccountManagementPreferences,
  AccountNotificationChannel,
  CustomerProfileData,
  PublicAccountProfile,
  PublicSavedTravelerProfile,
  SavedContactProfile,
} from '../domain/account.types';
import {AccountEmailVerificationDialog} from './AccountEmailVerificationDialog';
import {AccountOverviewHub} from './AccountOverviewHub';
import {AccountInfoModule} from './AccountInfoModule';
import {AccountTravelersModule} from './AccountTravelersModule';
import {AccountContactsModule} from './AccountContactsModule';

interface AccountProfilePageProps {
  lang: RouteLanguage;
}

type ModuleKey = 'overview' | 'account_info' | 'travelers' | 'contacts';

const defaultPreferences: AccountManagementPreferences = {
  notification_channels: ['email'],
  booking_reminder_channels: ['email'],
  marketing_opt_in: false,
  updated_at: '',
};

export const AccountProfilePage: React.FC<AccountProfilePageProps> = ({lang}) => {
  const {t} = useI18n(lang);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get('tab');

  const {user, isAuthenticated, isLoading, signOut, refreshSession, setUser} = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');

  // Synchronize activeModule reactively whenever searchParams change; redirect bookings to dedicated page
  useEffect(() => {
    if (tabFromQuery === 'bookings') {
      router.replace(`/${lang}/manage-booking/orders`);
      return;
    }
    if (tabFromQuery && ['account_info', 'travelers', 'contacts'].includes(tabFromQuery)) {
      setActiveModule(tabFromQuery as ModuleKey);
    } else if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setActiveModule('account_info');
      } else {
        setActiveModule('overview');
      }
    }
  }, [tabFromQuery, lang, router]);

  // Listen to Navbar custom event and browser popstate for instant tab switching
  useEffect(() => {
    const handleCustomTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<ModuleKey>;
      if (customEvent.detail && ['account_info', 'travelers', 'contacts'].includes(customEvent.detail)) {
        setActiveModule(customEvent.detail);
      }
    };
    const handlePopState = () => {
      const currentTab = new URLSearchParams(window.location.search).get('tab');
      if (currentTab === 'bookings') {
        window.location.href = `/${lang}/manage-booking/orders`;
        return;
      }
      if (currentTab && ['account_info', 'travelers', 'contacts'].includes(currentTab)) {
        setActiveModule(currentTab as ModuleKey);
      } else {
        setActiveModule(window.innerWidth >= 1024 ? 'account_info' : 'overview');
      }
    };

    window.addEventListener('account-tab-change', handleCustomTabChange);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('account-tab-change', handleCustomTabChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [lang]);

  const handleTabChange = (key: ModuleKey) => {
    setActiveModule(key);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (key === 'overview') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', key);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const [account, setAccount] = useState<PublicAccountProfile | null>(user);
  const [profile, setProfile] = useState<CustomerProfileData | null>(user?.profile ?? null);
  const [travelers, setTravelers] = useState<PublicSavedTravelerProfile[]>([]);
  const [contacts, setContacts] = useState<SavedContactProfile[]>([]);
  const [preferences, setPreferences] = useState<AccountManagementPreferences>(defaultPreferences);
  const [pageError, setPageError] = useState<string | null>(null);
  const [travelerEditor, setTravelerEditor] = useState<PublicSavedTravelerProfile | null | undefined>(undefined);
  const [contactEditor, setContactEditor] = useState<SavedContactProfile | null | undefined>(undefined);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState({current: '', next: '', confirmation: ''});
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [preferencesMessage, setPreferencesMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const moduleLoadFailedMessage = t('account.error.module_load_failed');

  useEffect(() => {
    setAccount(user);
    setProfile(user?.profile ?? null);
  }, [user]);

  useEffect(() => {
    setTravelers([]);
    setContacts([]);
    setPreferences(defaultPreferences);
    setTravelerEditor(undefined);
    setContactEditor(undefined);
    setPasswordDraft({current: '', next: '', confirmation: ''});
    setIsVerificationOpen(false);
  }, [user?.customer_id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setPageError(null);
    CustomerAccountService.getAccountCenterData()
      .then((data) => {
        if (cancelled) return;
        if (!data.success && data.error === 'AUTHENTICATED_REQUIRED') {
          setUser(null);
          return;
        }
        if (!data.success) setPageError(moduleLoadFailedMessage);
        if (data.account) setAccount(data.account);
        if (data.profile) setProfile(data.profile);
        setTravelers(data.travelers);
        if (data.contacts) setContacts(data.contacts);
        if (data.preferences) setPreferences(data.preferences);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.customer_id, moduleLoadFailedMessage, setUser]);

  const handleSignOut = async () => {
    if (!await signOut()) {
      window.alert(t('account.error.sign_out_failed'));
      return;
    }
    router.push(`/${lang}/`);
  };

  const handleCopyId = async () => {
    if (!account?.customer_id) return;
    try {
      await navigator.clipboard.writeText(account.customer_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1800);
    } catch {
      setCopiedId(false);
    }
  };

  const handleUpdateProfile = async (profileData: Partial<CustomerProfileData>) => {
    const res = await CustomerAccountService.updateProfile(profileData);
    if (res.success) {
      if (res.profile) setProfile(res.profile);
      if (res.account) {
        setAccount(res.account);
        setUser(res.account);
      }
    }
    return res;
  };

  const handleVerificationUpdated = async (updatedAccount: PublicAccountProfile) => {
    setAccount(updatedAccount);
    setUser(updatedAccount);
    await refreshSession();
  };

  const handleDeleteTraveler = async (traveler: PublicSavedTravelerProfile) => {
    if (!window.confirm(t('account.confirm.delete_traveler'))) return;
    const response = await CustomerAccountService.deleteTraveler(traveler.traveler_id);
    if (response.success && response.travelers) setTravelers(response.travelers);
    else setPageError(t('account.error.save_failed'));
  };

  const handleDeleteContact = async (contact: SavedContactProfile) => {
    if (!window.confirm(t('account.confirm.delete_contact'))) return;
    const response = await CustomerAccountService.deleteContact(contact.contact_id);
    if (response.success && response.contacts) setContacts(response.contacts);
    else setPageError(t('account.error.save_failed'));
  };

  const handleDefaultContact = async (contact: SavedContactProfile) => {
    const response = await CustomerAccountService.setDefaultContact(contact.contact_id);
    if (response.success && response.contacts) setContacts(response.contacts);
  };

  const handleToggleBookingReminders = async (enabled: boolean) => {
    const channels: AccountNotificationChannel[] = enabled ? ['email'] : [];
    const nextPrefs: AccountManagementPreferences = {
      ...preferences,
      booking_reminder_channels: channels,
    };
    setPreferences(nextPrefs);
    setPreferencesMessage(null);
    const response = await CustomerAccountService.updateManagementPreferences({
      notification_channels: nextPrefs.notification_channels,
      booking_reminder_channels: nextPrefs.booking_reminder_channels,
      marketing_opt_in: nextPrefs.marketing_opt_in,
      marketing_consent_locale: lang,
    });
    if (response.success && response.preferences) {
      setPreferences(response.preferences);
      setPreferencesMessage(t('account.management.saved'));
      setTimeout(() => setPreferencesMessage(null), 2400);
    }
  };

  const handleToggleMarketing = async (enabled: boolean) => {
    const nextPrefs: AccountManagementPreferences = {
      ...preferences,
      marketing_opt_in: enabled,
    };
    setPreferences(nextPrefs);
    setPreferencesMessage(null);
    const response = await CustomerAccountService.updateManagementPreferences({
      notification_channels: nextPrefs.notification_channels,
      booking_reminder_channels: nextPrefs.booking_reminder_channels,
      marketing_opt_in: enabled,
      marketing_consent_locale: lang,
    });
    if (response.success && response.preferences) {
      setPreferences(response.preferences);
      setPreferencesMessage(t('account.management.saved'));
      setTimeout(() => setPreferencesMessage(null), 2400);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    const check = validatePassword(passwordDraft.next);
    if (!check.valid) {
      setPasswordMessage(t(check.messageKey ?? 'account.error.password_complexity'));
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirmation) {
      setPasswordMessage(t('account.error.password_mismatch'));
      return;
    }
    setIsSavingPassword(true);
    const response = await CustomerAccountService.updatePassword({
      current_password: passwordDraft.current,
      new_password: passwordDraft.next,
      new_password_confirmation: passwordDraft.confirmation,
    });
    if (response.success && response.account) {
      setAccount(response.account);
      setUser(response.account);
      setPasswordDraft({current: '', next: '', confirmation: ''});
      setPasswordMessage(t('account.security.password_updated'));
    } else {
      setPasswordMessage(
        response.code === 'INVALID_CURRENT_PASSWORD'
          ? t('account.error.current_password_invalid')
          : t('account.error.save_failed'),
      );
    }
    setIsSavingPassword(false);
  };

  if (isLoading || (isAuthenticated && (!account || account.customer_id !== user?.customer_id))) {
    return (
      <div className="flex min-h-[42vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ring border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !account) {
    return (
      <div className="mx-auto max-w-md rounded-card border border-border bg-background p-8 text-center">
        <BrandLogo className="mx-auto mb-4 h-8 w-auto" />
        <h1 className="text-h3 font-bold text-foreground">{t('account.profile.sign_in_required_title')}</h1>
        <p className="mt-2 text-body text-foreground-secondary">{t('account.profile.sign_in_required_desc')}</p>
        <Link
          href={`/${lang}/account/sign-in/`}
          className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-control bg-primary px-5 py-2.5 text-body font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          <span>{t('account.action.sign_in')}</span>
        </Link>
      </div>
    );
  }

  // H5 Mobile Overview Transition Hub
  if (activeModule === 'overview') {
    return (
      <div className="lg:hidden">
        <AccountOverviewHub
          lang={lang}
          account={account}
          onSelectTab={handleTabChange}
          onSignOut={handleSignOut}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Back to Overview Navigation Bar */}
      <div className="flex items-center justify-between lg:hidden border-b border-border pb-3">
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className="inline-flex items-center gap-1.5 text-body font-medium text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('account.action.back_to_overview')}</span>
        </button>
      </div>

      {/* Main Grid: Left Nav on Desktop + Main Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
        {/* Left Column (Sidebar) */}
        <aside
          aria-label={t('account.tabs.personal_settings')}
          className="hidden lg:block"
        >
          <div className="rounded-card border border-border bg-background overflow-hidden">
            {/* 1. Member summary */}
            <div className="p-4 border-b border-border bg-brand-light/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-body font-semibold flex items-center justify-center shrink-0">
                  {(account.profile?.first_name?.[0] || account.primary_email?.[0] || 'T').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-body font-semibold text-foreground truncate">
                    {account.profile?.first_name && account.profile?.last_name
                      ? `${account.profile.first_name} ${account.profile.last_name}`
                      : account.primary_email.split('@')[0]}
                  </p>
                  <p className="text-caption text-foreground-secondary truncate">
                    {account.primary_email}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-caption text-muted-foreground block">
                    {t('account.profile.member_number')}
                  </span>
                  <span className="text-body font-semibold font-mono tracking-wide text-foreground block mt-0.5">
                    {account.customer_id || 'TG-9223'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-control border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title={t('account.action.copy_id')}
                  aria-label={t('account.action.copy_id')}
                >
                  {copiedId ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 2. Navigation List */}
            <nav className="p-2 space-y-0.5">
              {[
                {
                  key: 'account_info' as const,
                  icon: Settings,
                  labelKey: 'account.tabs.personal_settings',
                },
                {
                  key: 'travelers' as const,
                  icon: Car,
                  labelKey: 'account.tabs.license',
                },
                {
                  key: 'contacts' as const,
                  icon: Smartphone,
                  labelKey: 'account.section.contact_info',
                },
              ].map(({key, icon: Icon, labelKey}) => {
                const isActive = activeModule === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleTabChange(key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center justify-between rounded-control px-3.5 py-2.5 text-body transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-brand-light text-foreground font-semibold'
                        : 'text-foreground-secondary hover:bg-muted hover:text-foreground font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                      <span className="truncate">{t(labelKey)}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                );
              })}

              {/* Link directly to dedicated manage-booking page */}
              <Link
                href={`/${lang}/manage-booking/orders`}
                className="flex w-full items-center justify-between rounded-control px-3.5 py-2.5 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{t('account.nav.orders')}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            </nav>

            {/* 3. Sign Out */}
            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-control px-3.5 py-2.5 text-body font-medium text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{t('account.action.security_sign_out')}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column (Content Area) */}
        <main className="min-w-0 pb-12 sm:pb-8">
          {pageError && (
            <p role="alert" className="mb-4 rounded-card border border-destructive/30 bg-destructive-light px-4 py-3 text-body text-destructive">
              {pageError}
            </p>
          )}

          {activeModule === 'account_info' && (
            <AccountInfoModule
              lang={lang}
              account={account}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              passwordDraft={passwordDraft}
              passwordMessage={passwordMessage}
              isSavingPassword={isSavingPassword}
              preferences={preferences}
              preferencesMessage={preferencesMessage}
              onVerify={() => setIsVerificationOpen(true)}
              onPasswordDraftChange={setPasswordDraft}
              onSavePassword={savePassword}
              onToggleBookingReminders={handleToggleBookingReminders}
              onToggleMarketing={handleToggleMarketing}
              onNavigateTab={(tab) => handleTabChange(tab)}
            />
          )}

          {activeModule === 'travelers' && (
            <AccountTravelersModule
              lang={lang}
              travelers={travelers}
              travelerEditor={travelerEditor}
              onStartAdd={() => setTravelerEditor(null)}
              onStartEdit={(traveler) => setTravelerEditor(traveler)}
              onCloseEditor={() => setTravelerEditor(undefined)}
              onSavedTravelers={(updated) => {
                setTravelers(updated);
                setTravelerEditor(undefined);
              }}
              onDelete={handleDeleteTraveler}
              onDefault={async (traveler) => {
                const response = await CustomerAccountService.setDefaultTraveler(traveler.traveler_id);
                if (response.success && response.travelers) setTravelers(response.travelers);
              }}
            />
          )}

          {activeModule === 'contacts' && (
            <AccountContactsModule
              lang={lang}
              contacts={contacts}
              account={account}
              onVerify={() => setIsVerificationOpen(true)}
              contactEditor={contactEditor}
              onStartAdd={() => setContactEditor(null)}
              onStartEdit={(contact) => setContactEditor(contact)}
              onCloseEditor={() => setContactEditor(undefined)}
              onSavedContacts={(updated) => {
                setContacts(updated);
                setContactEditor(undefined);
              }}
              onDelete={handleDeleteContact}
              onDefault={handleDefaultContact}
            />
          )}
        </main>
      </div>

      {/* Global Email Verification Modal Dialog */}
      <AccountEmailVerificationDialog
        lang={lang}
        account={account}
        open={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onUpdated={handleVerificationUpdated}
      />
    </div>
  );
};

export default AccountProfilePage;
