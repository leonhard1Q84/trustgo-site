import { FleetVehicle } from '@/modules/rental-search/domain/fleet-data';
import {
  InsurancePackage,
  InsurancePackageId,
  RatePricingBreakdown,
  RentalTripDetails,
} from '../domain/types';

export const STANDARD_INSURANCE_PACKAGES: InsurancePackage[] = [
  {
    id: 'basic',
    name: 'Basic Cover',
    tagline: 'Standard mandatory protection with vehicle excess',
    dailyRate: 0,
    damageExcess: 1500,
    theftExcess: 1500,
    features: [
      { label: 'Collision Damage Waiver (CDW)', included: true, featureKey: 'cdw' },
      { label: 'Third-Party Liability (TPL)', included: true, featureKey: 'tpl' },
      { label: 'Theft Protection (TP)', included: true, featureKey: 'tp' },
      {
        label: 'Windscreen, Glass & Mirrors',
        included: false,
        description: 'Customer liable for glass repair costs',
        featureKey: 'glass',
        descriptionKey: 'ic_desc_glass_excluded',
      },
      {
        label: 'Tyre & Wheel Damage',
        included: false,
        description: 'Customer liable for punctures and blowouts',
        featureKey: 'tyre',
        descriptionKey: 'ic_desc_tyre_excluded',
      },
      {
        label: '24/7 Breakdown & Towing Service',
        included: false,
        description: 'Call-out fees apply',
        featureKey: 'roadside',
        descriptionKey: 'ic_desc_roadside_excluded',
      },
    ],
  },
  {
    id: 'inclusive',
    name: 'Inclusive Protection',
    tagline: 'Significantly reduced excess with glass & tyre cover',
    badge: 'Popular',
    dailyRate: 14,
    damageExcess: 300,
    theftExcess: 300,
    features: [
      { label: 'Collision Damage Waiver (CDW)', included: true, featureKey: 'cdw' },
      { label: 'Third-Party Liability (TPL)', included: true, featureKey: 'tpl' },
      { label: 'Theft Protection (TP)', included: true, featureKey: 'tp' },
      { label: 'Windscreen, Glass & Mirrors', included: true, featureKey: 'glass' },
      { label: 'Tyre & Wheel Damage', included: true, featureKey: 'tyre' },
      {
        label: '24/7 Breakdown & Towing Service',
        included: false,
        description: 'Call-out fees apply',
        featureKey: 'roadside',
        descriptionKey: 'ic_desc_roadside_excluded',
      },
    ],
  },
  {
    id: 'zero-excess',
    name: 'Zero Excess Peace of Mind',
    tagline: 'Complete protection with $0 deductible and free roadside assistance',
    badge: 'Recommended',
    dailyRate: 24,
    damageExcess: 0,
    theftExcess: 0,
    features: [
      { label: 'Collision Damage Waiver (CDW)', included: true, featureKey: 'cdw' },
      { label: 'Third-Party Liability (TPL)', included: true, featureKey: 'tpl' },
      { label: 'Theft Protection (TP)', included: true, featureKey: 'tp' },
      { label: 'Windscreen, Glass & Mirrors', included: true, featureKey: 'glass' },
      { label: 'Tyre & Wheel Damage', included: true, featureKey: 'tyre' },
      {
        label: '24/7 Breakdown & Towing Service',
        included: true,
        description: 'Zero call-out charge for flat tyre, lock-out, or battery jump',
        featureKey: 'roadside',
        descriptionKey: 'ic_desc_roadside_free',
      },
    ],
  },
];

export function buildCancellationPolicy(freeHours = 48) {
  const lateHours = Math.min(2, freeHours);
  return {
    freeCancellationHours: freeHours,
    freeCancellationDeadline:
      freeHours > 0
        ? `${freeHours} hours before pick-up (Local destination time)`
        : 'Non-refundable',
    steps:
      freeHours <= 0
        ? [
            {
              title: 'Non-refundable',
              timeRange: 'At any time',
              feePercentage: 100,
            },
          ]
        : [
            {
              title: 'Free Cancellation',
              timeRange:
                freeHours > 0 ? `Up to ${freeHours} hours prior to pickup` : 'Non-refundable',
              feePercentage: freeHours > 0 ? 0 : 100,
              highlight: true,
              untilHoursBeforePickup: freeHours,
            },
            {
              title: 'Late Cancellation Fee (50%)',
              timeRange: `Between ${freeHours}h and ${lateHours}h before pickup`,
              feePercentage: freeHours > 0 ? 50 : 100,
              fromHoursBeforePickup: freeHours,
              untilHoursBeforePickup: lateHours,
            },
            {
              title: 'No-Show / Non-Refundable (100%)',
              timeRange: 'Less than 2 hours before pickup or after pickup time',
              feePercentage: 100,
              fromHoursBeforePickup: lateHours,
            },
          ],
    notice:
      'All cancellation deadlines are calculated based on the local time zone of the pick-up location.',
  };
}

// One-way rentals (different pick-up / return depots) carry a flat relocation fee,
// settled at the counter together with any optional equipment.
const ONE_WAY_FEE_FLAT = 65;

export function calculateRatePricing(
  vehicle: FleetVehicle,
  trip: RentalTripDetails,
  insuranceId: InsurancePackageId = 'basic',
  equipmentCost: number = 0
): RatePricingBreakdown {
  const safeDays = Math.max(1, trip.rentalDays);
  const baseRentalSubtotal = vehicle.pricePerDay * safeDays;

  const selectedInsurance =
    STANDARD_INSURANCE_PACKAGES.find((pkg) => pkg.id === insuranceId) ||
    STANDARD_INSURANCE_PACKAGES[0];
  const insuranceSubtotal = selectedInsurance.dailyRate * safeDays;

  const specialFees =
    trip.returnLocation && trip.returnLocation !== trip.pickupLocation
      ? [{ labelKey: 'rate_oneway_fee', amount: ONE_WAY_FEE_FLAT }]
      : [];
  const specialFeesSubtotal = specialFees.reduce((sum, fee) => sum + fee.amount, 0);

  // Standard estimated local taxes & concession recovery fee (~8%)
  const subtotalBeforeTax =
    baseRentalSubtotal + insuranceSubtotal + equipmentCost + specialFeesSubtotal;
  const taxesAndFees = Math.round(subtotalBeforeTax * 0.08 * 100) / 100;
  const totalCharge = Math.round((subtotalBeforeTax + taxesAndFees) * 100) / 100;

  // Optional equipment and special fees are collected at the pick-up counter.
  const payAtCounter = equipmentCost + specialFeesSubtotal;

  return {
    currency: vehicle.currency,
    dailyRate: vehicle.pricePerDay,
    rentalDays: safeDays,
    baseRentalSubtotal,
    insurancePackageId: selectedInsurance.id,
    insuranceDailyRate: selectedInsurance.dailyRate,
    insuranceSubtotal,
    equipmentSubtotal: equipmentCost,
    specialFees,
    specialFeesSubtotal,
    taxesAndFees,
    totalCharge,
    securityDeposit: vehicle.depositAmount,
    payNow: Math.round((totalCharge - payAtCounter) * 100) / 100,
    payAtCounter,
  };
}

export function getDefaultTripDetails(): RentalTripDetails {
  return {
    pickupLocation: 'Los Angeles Airport (LAX) - TrustGo Prime Hub',
    returnLocation: 'Los Angeles Airport (LAX) - TrustGo Prime Hub',
    pickupDateTime: '2026-11-01 10:00',
    returnDateTime: '2026-11-06 10:00',
    rentalDays: 5,
    driverAge: 30,
  };
}
