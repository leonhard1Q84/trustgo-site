import {checkoutAccountContext, recordCheckoutAccountResult, type RentalAccess} from '@/integrations/fleetedge/local-rental-adapter';
import {CustomerAccountStore} from './customerAccountStore';
import {enqueueCustomerAccountNotification} from './customerAccountNotifications';
import {localAccountsEnabled} from './account-route';

// The caller must already have confirmed payment. Account failure must never
// change, roll back, or misreport the reservation's payment result.
export function completeCheckoutAccount(reservationId: string, access: RentalAccess) {
  try {
    const context = checkoutAccountContext(reservationId, access);
    if (!context) return {success: true, created: false};
    if (access.accountId) {
      recordCheckoutAccountResult(reservationId, access, 'not_requested');
      return {success: true, created: false};
    }
    if (!localAccountsEnabled()) throw new Error('ACCOUNT_SERVICE_UNAVAILABLE');
    const result = CustomerAccountStore.createOrReuseCheckoutAccount({email: context.email,
      consent: context.consent, accountCreationRequestId: context.requestId});
    if (!result.account || result.error) throw new Error('ACCOUNT_CREATION_FAILED');
    if (result.isNew) enqueueCustomerAccountNotification({notification_type: 'account_created', account: result.account,
      locale: context.consent.locale, idempotency_key: `account-created:${result.account.account_id}`});
    recordCheckoutAccountResult(reservationId, access, 'created');
    // Creating/reusing an account never authenticates the guest or returns a profile.
    return {success: true, created: true};
  } catch {
    try { recordCheckoutAccountResult(reservationId, access, 'failed'); } catch { /* Unauthorized/missing booking. */ }
    return {success: false, created: false};
  }
}
