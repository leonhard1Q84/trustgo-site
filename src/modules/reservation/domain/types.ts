import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  InsurancePackageId,
  RentalTripDetails,
  RatePricingBreakdown,
  SpecialEquipmentSelection,
} from '@/modules/rate-details/public-api';

export interface DriverDetails {
  title: 'Mr' | 'Ms' | 'Dr';
  firstName: string;
  lastName: string; // Surname - critical for guest booking lookup
  email: string;
  phoneCountryCode: string;
  phone: string;
  licenseCountry: string;
  flightNumber?: string;
  additionalDriver?: {
    enabled: boolean;
    fullName?: string;
  };
}

export interface ReservationDraft {
  draftId: string;
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  insurancePackageId: InsurancePackageId;
  driver: DriverDetails;
  equipment: SpecialEquipmentSelection;
  pricing: RatePricingBreakdown;
  createdAt: string;
}
