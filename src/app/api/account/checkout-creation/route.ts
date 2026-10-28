import {NextResponse} from 'next/server';
import {accountRoute} from '@/server/account-route';
import {rentalAccess} from '@/server/rental-access';
import {completeCheckoutAccount} from '@/server/checkout-account';
import {readBooking} from '@/integrations/fleetedge/local-rental-adapter';

async function handlePOST(request: Request) {
  const body = await request.json();
  if (typeof body.reservation_id !== 'string' || body.reservation_id.length > 128) {
    return NextResponse.json({success: false, code: 'INVALID_REQUEST'}, {status: 400});
  }
  const access = await rentalAccess();
  if (!access) return NextResponse.json({success: false, code: 'AUTHENTICATION_REQUIRED'}, {status: 401});
  try { readBooking(body.reservation_id, access); }
  catch { return NextResponse.json({success: false, code: 'BOOKING_NOT_FOUND'}, {status: 404}); }
  const result = completeCheckoutAccount(body.reservation_id, access);
  return NextResponse.json(result, {status: result.success ? 200 : 503});
}

export const POST = accountRoute('checkout-creation', handlePOST);
