import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';

export type InsurancePackageId = 'basic' | 'inclusive' | 'zero-excess';

export interface InsurancePackage {
  id: InsurancePackageId;
  name: string;
  tagline: string;
  badge?: string;
  dailyRate: number;
  damageExcess: number; // 0 for zero-excess
  theftExcess: number;
  features: {
    label: string;
    included: boolean;
    description?: string;
    featureKey?: 'cdw' | 'tpl' | 'tp' | 'glass' | 'tyre' | 'roadside';
    descriptionKey?: string;
  }[];
}

export interface InsuranceCoverageItem {
  code: string;
  name: string;
  included: boolean;
  excessText: string;
  limitText: string;
  description: string;
}

export interface InsuranceExclusionGroup {
  category: string;
  items: string[];
}

export interface InsuranceIncidentStep {
  step: number;
  title: string;
  description: string;
}

export interface InsuranceDetailedPackage {
  id: InsurancePackageId;
  name: string;
  tagline: string;
  dailyRate: number;
  damageExcess: number;
  theftExcess: number;
  excessSummary: string;
  nocSummary: string;
  tplSummary: string;
  items: InsuranceCoverageItem[];
  conditions: string[];
  exclusions: InsuranceExclusionGroup[];
  incidentSteps: InsuranceIncidentStep[];
}

export interface RentalTripDetails {
  pickupLocation: string;
  returnLocation: string;
  pickupDateTime: string; // ISO or formatted
  returnDateTime: string;
  rentalDays: number;
  driverAge: number;
  pickupStoreCode?: string;
  returnStoreCode?: string;
  licenseCountry?: string;
  timeZone?: string;
  offerId?: string;
  rateDetailsId?: string;
  rateExpiresAt?: string;
}

export interface CancellationStep {
  title: string;
  timeRange: string;
  feePercentage: number;
  highlight?: boolean;
  /** Boundaries measured backwards from the scheduled pick-up instant. */
  fromHoursBeforePickup?: number;
  untilHoursBeforePickup?: number;
}

export interface CancellationPolicy {
  freeCancellationHours?: number;
  freeCancellationDeadline: string;
  steps: CancellationStep[];
  notice: string;
}

export interface SpecialFee {
  labelKey: string; // i18n key, e.g. 'rate_oneway_fee'
  amount: number;
}

export interface RatePricingBreakdown {
  currency: string;
  dailyRate: number;
  rentalDays: number;
  baseRentalSubtotal: number;
  insurancePackageId: InsurancePackageId;
  insuranceDailyRate: number;
  insuranceSubtotal: number;
  equipmentSubtotal: number;
  specialFees: SpecialFee[];
  specialFeesSubtotal: number;
  taxesAndFees: number;
  totalCharge: number;
  securityDeposit: number;
  payNow: number;
  payAtCounter: number;
}

export interface VehicleRateDetails {
  vehicle: FleetVehicle;
  trip: RentalTripDetails;
  availableInsurances: InsurancePackage[];
  cancellationPolicy: CancellationPolicy;
  pricing: RatePricingBreakdown;
}
