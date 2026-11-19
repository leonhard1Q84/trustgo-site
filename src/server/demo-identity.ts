import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/modules/customer-account/domain/account.rules';

/** Anonymous navigation must not wake business storage just to discover an empty session. */
export async function hasDemoIdentity(accountOnly = false) {
  const jar = await cookies();
  return Boolean(jar.get(SESSION_COOKIE_NAME)?.value || (!accountOnly && jar.get('tg_rental_access')?.value));
}
