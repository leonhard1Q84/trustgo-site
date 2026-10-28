import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  RentalTripDetails,
  RatePricingBreakdown,
  InsurancePackage,
  SpecialEquipmentSelection,
} from '@/modules/rate-details/public-api';
import { DriverDetails } from '@/modules/reservation/public-api';

export type BookingStatus =
  'CONFIRMED' | 'PENDING_PAYMENT' | 'ACTIVE_RENTAL' | 'COMPLETED' | 'CANCELLED';

export type GuestOrderFilter = 'all' | 'pending_payment' | 'upcoming' | 'closed';

export interface BookingRecord {
  confirmationCode: string;
  status: BookingStatus;
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  driver: DriverDetails;
  insurance: InsurancePackage;
  equipment: SpecialEquipmentSelection;
  pricing: RatePricingBreakdown;
  paymentTransactionId: string;
  createdAt: string;
  paymentDeadline?: string;
  paymentStatus?: 'unpaid' | 'processing' | 'paid' | 'failed' | 'unknown';
  accountCreationStatus?: 'not_requested' | 'pending' | 'created' | 'failed';
  paidAmount?: number;
  closureReason?: 'customer_cancelled' | 'payment_timeout';
  refundStatus?: 'not_required' | 'processing' | 'refunded' | 'failed';
  cancellation?: {
    cancelledAt: string;
    reason: string;
    refundAmount: number;
    penaltyAmount: number;
  };
}

export interface CancellationEstimate {
  paidAmount: number;
  penaltyAmount: number;
  refundAmount: number;
  currency: string;
  version: string;
}
