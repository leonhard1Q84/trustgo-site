import crypto from 'node:crypto';
import type { RouteLanguage } from '@/i18n/locales';
import type { CustomerAccount } from '@/modules/customer-account/domain/account.types';
import { maskEmail } from '@/modules/customer-account/domain/account.rules';
import {localAccountsEnabled} from './account-route';

export type AccountNotificationType =
  | 'account_created'
  | 'password_setup_code'
  | 'password_reset_code'
  | 'email_verification_code';

export interface AccountNotificationRequest {
  notification_type: AccountNotificationType;
  account: CustomerAccount;
  locale: RouteLanguage;
  idempotency_key: string;
  code?: string;
  code_expires_in_minutes?: number;
}

export interface AccountNotificationEvent {
  notification_id: string;
  idempotency_key: string;
  notification_type: AccountNotificationType;
  source: CustomerAccount['source'];
  locale: RouteLanguage;
  masked_email: string;
  account_created_at?: string;
  code_expires_in_minutes?: number;
  delivery_status: 'preview_only';
  created_at: string;
}

interface NotificationState {
  events: Map<string, AccountNotificationEvent>;
}

declare global {
  // eslint-disable-next-line no-var
  var __tgGlobalAccountNotificationState: NotificationState | undefined;
}

const state: NotificationState = globalThis.__tgGlobalAccountNotificationState ?? {
  events: new Map(),
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.__tgGlobalAccountNotificationState = state;
}

/**
 * Notification boundary for the account service.
 * Retains delivery metadata safely.
 */
export function enqueueCustomerAccountNotification(
  request: AccountNotificationRequest,
): { accepted: boolean; notification_id: string; delivery_status: AccountNotificationEvent['delivery_status'] } {
  if (!localAccountsEnabled()) throw new Error('ACCOUNT_DELIVERY_UNAVAILABLE');
  const existing = state.events.get(request.idempotency_key);
  if (existing) {
    return {
      accepted: true,
      notification_id: existing.notification_id,
      delivery_status: existing.delivery_status,
    };
  }

  const notification: AccountNotificationEvent = {
    notification_id: `notification_${crypto.randomBytes(12).toString('hex')}`,
    idempotency_key: request.idempotency_key,
    notification_type: request.notification_type,
    source: request.account.source,
    locale: request.locale,
    masked_email: maskEmail(request.account.primary_email),
    ...(request.notification_type === 'account_created'
      ? { account_created_at: request.account.created_at }
      : {}),
    ...(request.code_expires_in_minutes
      ? { code_expires_in_minutes: request.code_expires_in_minutes }
      : {}),
    delivery_status: 'preview_only',
    created_at: new Date().toISOString(),
  };
  state.events.set(request.idempotency_key, notification);
  return {
    accepted: true,
    notification_id: notification.notification_id,
    delivery_status: notification.delivery_status,
  };
}

export function listCustomerAccountNotificationEvents(): AccountNotificationEvent[] {
  return [...state.events.values()];
}

export function resetCustomerAccountNotificationEvents(): void {
  state.events.clear();
}
