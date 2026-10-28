import { accountRoute } from '@/server/account-route';
import {NextResponse} from 'next/server';
import {getAuthenticatedAccount} from '@/server/customerAccountAuth';
import {CustomerAccountStore} from '@/server/customerAccountStore';
import {ACCOUNT_NOTIFICATION_CHANNELS} from '@/modules/customer-account/domain/account.rules';
import {isRouteLanguage} from '@/i18n/locales';
import type {AccountNotificationChannel} from '@/modules/customer-account/domain/account.types';

function validChannels(value: unknown): value is AccountNotificationChannel[] {
  return Array.isArray(value)
    && new Set(value).size === value.length
    && value.every((channel) => (ACCOUNT_NOTIFICATION_CHANNELS as readonly string[]).includes(channel));
}

async function handleGET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    return NextResponse.json({
      success: true,
      preferences: CustomerAccountStore.getManagementPreferences(account.account_id),
    });
  } catch (error) {
    console.error('Get account management preferences error:', error);
    return NextResponse.json({success: false, error: 'Failed to load settings'}, {status: 500});
  }
}

async function handlePATCH(request: Request) {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) return NextResponse.json({authenticated: false}, {status: 401});

    const body = await request.json();
    const notificationChannels = body.notification_channels;
    const bookingReminderChannels = body.booking_reminder_channels;
    if (!validChannels(notificationChannels) || !validChannels(bookingReminderChannels)) {
      return NextResponse.json({success: false, error: 'INVALID_CHANNELS'}, {status: 400});
    }
    if (typeof body.marketing_opt_in !== 'boolean') {
      return NextResponse.json({success: false, error: 'INVALID_MARKETING_OPT_IN'}, {status: 400});
    }
    if (body.marketing_opt_in && !isRouteLanguage(body.marketing_consent_locale)) {
      return NextResponse.json({success: false, error: 'MARKETING_CONSENT_LOCALE_REQUIRED'}, {status: 400});
    }

    const locale = isRouteLanguage(body.marketing_consent_locale) ? body.marketing_consent_locale : account.consent.locale;
    const preferences = CustomerAccountStore.updateManagementPreferences(account.account_id, {
      notification_channels: notificationChannels,
      booking_reminder_channels: bookingReminderChannels,
      marketing_opt_in: body.marketing_opt_in,
      marketing_consent_locale: locale,
    });

    if (!preferences) return NextResponse.json({success: false, error: 'ACCOUNT_NOT_FOUND'}, {status: 404});
    return NextResponse.json({success: true, preferences});
  } catch (error) {
    console.error('Update account management preferences error:', error);
    return NextResponse.json({success: false, error: 'Failed to save settings'}, {status: 500});
  }
}

export const GET = accountRoute('management/preferences', handleGET);
export const PATCH = accountRoute('management/preferences', handlePATCH);
