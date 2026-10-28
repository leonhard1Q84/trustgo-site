import { NextResponse } from 'next/server';
import { pendingCheckouts } from '@/modules/booking-management/domain/pending-checkout';
import { attachRentalCookie, checkRentalRequest, rentalAccess, revokeRentalAccess } from '@/server/rental-access';
import { createReservation, readBooking, listBookings, listSessionBookings, lookupBooking, payBooking,
  previewCancellation, cancelReservation } from '@/integrations/fleetedge/local-rental-adapter';
import { RentalError } from '@/modules/reservation/domain/validation';
import type { CreateReservationInput } from '@/integrations/fleetedge/local-rental-adapter';
import {completeCheckoutAccount} from '@/server/checkout-account';
import { localBookingFault } from '@/integrations/fleetedge/local-booking-faults';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(request: Request, context: { params: Promise<{ action: string[] }> }) {
  try {
    const { action } = await context.params;
    const [resource, id, operation] = action;
    checkRentalRequest(request, resource);
    if (request.method === 'GET' && resource === 'guest-bookings' && action.length === 1) {
      const existingAccess = await rentalAccess();
      const orders = existingAccess ? listSessionBookings(existingAccess) : [];
      return NextResponse.json({ status: orders.length ? 'active' : 'missing', orders }, {
        headers: { 'Cache-Control': 'private, no-store' },
      });
    }
    if (request.method === 'GET' && resource === 'pending-checkouts' && action.length === 1) {
      const existingAccess = await rentalAccess();
      return NextResponse.json(existingAccess ? pendingCheckouts(listBookings(existingAccess)) : [], {
        headers: { 'Cache-Control': 'private, no-store' },
      });
    }
    const access = await rentalAccess(true);
    if (!access) throw new RentalError('booking_not_found', 404);
    let body: Record<string, unknown> = {};
    if (request.method === 'POST') {
      if (Number(request.headers.get('content-length')) > 20_000) throw new RentalError('invalid_request', 413);
      const text = await request.text();
      if (text.length > 20_000) throw new RentalError('invalid_request', 413);
      try { body = JSON.parse(text); } catch { throw new RentalError('invalid_request', 400); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RentalError('invalid_request', 400);
    }
    let result: unknown;
    if (request.method === 'GET' && resource === 'bookings' && action.length === 1) {
      const orders = listBookings(access);
      // An authenticated account can view its list even before its first booking.
      result = { status: access.accountId || orders.length ? 'active' : 'missing', orders };
    } else if (request.method === 'GET' && resource === 'bookings' && id && action.length === 2) {
      result = readBooking(id, access);
      // A delayed local payment may first be confirmed by status polling.
      completeCheckoutAccount(id, access);
      result = readBooking(id, access);
    } else if (request.method === 'POST' && resource === 'reservations' && action.length === 1) {
      result = createReservation(body as unknown as CreateReservationInput, access);
    } else if (request.method === 'POST' && ['lookup', 'guest-lookup'].includes(resource) && action.length === 1) {
      if (typeof body.confirmationCode !== 'string' || typeof body.lastName !== 'string') throw new RentalError('invalid_request', 400);
      const fault = body.lastName.trim() ? localBookingFault(body.confirmationCode) : undefined;
      if (fault?.malformed) return new NextResponse('Upstream response unavailable', {
        status: fault.status, headers: { 'Cache-Control': 'private, no-store', 'Content-Type': 'text/plain' },
      });
      result = lookupBooking(body.confirmationCode, body.lastName,
        resource === 'guest-lookup' ? { sessionId: access.sessionId } : access);
    } else if (request.method === 'POST' && resource === 'bookings' && id && operation === 'payment' && action.length === 3) {
      result = payBooking(id, body.idempotencyKey as string, access, body.localPaymentScenario);
      completeCheckoutAccount(id, access);
      result = readBooking(id, access);
    } else if (request.method === 'POST' && resource === 'bookings' && id && operation === 'cancellation-estimate' && action.length === 3) {
      result = previewCancellation(id, access);
    } else if (request.method === 'POST' && resource === 'bookings' && id && operation === 'cancel' && action.length === 3) {
      result = cancelReservation(id, body as { reason: string; version: string; idempotencyKey: string }, access);
    } else if (request.method === 'POST' && resource === 'revoke' && action.length === 1) {
      revokeRentalAccess(access);
      const response = NextResponse.json({ success: true });
      response.cookies.delete('tg_rental_access');
      return response;
    } else throw new RentalError('invalid_request', 404);
    const response = NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
    attachRentalCookie(response, access);
    return response;
  } catch (error) {
    const known = error instanceof RentalError;
    return NextResponse.json({ code: known ? error.code : 'service_unavailable', ...(known && error.field ? { field: error.field } : {}) }, {
      status: known ? error.status : 503, headers: { 'Cache-Control': 'private, no-store' },
    });
  }
}

export const GET = handle;
export const POST = handle;
