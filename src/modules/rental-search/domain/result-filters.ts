import type { FleetVehicle } from './fleet-data';
import type { StoreOffer } from './store-offers';

export type CategoryOption = 'economy' | 'suv' | 'mpv' | 'premium';
export type TransmissionOption = FleetVehicle['gear'];
export type SeatOption = 'up_to_5' | 'six_to_seven' | 'eight_plus';
export type OfferFeature =
  | 'free_cancellation' | 'deposit_free' | 'unlimited_mileage' | 'full_to_full'
  | 'self_service' | 'open_24h'
  | 'free_additional_driver' | 'free_gps' | 'winter_tyres';

/** Options within a vehicle facet are OR-ed; every selected offer feature must hold (AND). */
export interface ResultFilters {
  category: CategoryOption[];
  transmission: TransmissionOption[];
  seats: SeatOption[];
  features: OfferFeature[];
}

export type FilterFacet = keyof ResultFilters;
export type FilterValue<F extends FilterFacet> = ResultFilters[F][number];

export const EMPTY_FILTERS: ResultFilters = { category: [], transmission: [], seats: [], features: [] };

export const CATEGORY_OPTIONS: CategoryOption[] = ['economy', 'suv', 'mpv', 'premium'];
export const TRANSMISSION_OPTIONS: TransmissionOption[] = ['Automatic', 'Manual'];
export const SEAT_OPTIONS: SeatOption[] = ['up_to_5', 'six_to_seven', 'eight_plus'];
export const FEATURE_GROUPS: { key: 'policies' | 'depot' | 'extras'; options: OfferFeature[] }[] = [
  { key: 'policies', options: ['free_cancellation', 'deposit_free', 'unlimited_mileage', 'full_to_full'] },
  { key: 'depot', options: ['self_service', 'open_24h'] },
  { key: 'extras', options: ['free_additional_driver', 'free_gps', 'winter_tyres'] },
];

const FEATURE_TESTS: Record<OfferFeature, (offer: StoreOffer) => boolean> = {
  free_cancellation: (o) => o.cancellationFreeHours > 0,
  deposit_free: (o) => o.depositAmount === 0,
  unlimited_mileage: (o) => o.mileagePolicy === 'Unlimited Mileage',
  full_to_full: (o) => o.fuelPolicy === 'Like for Like (Full to Full)',
  self_service: (o) => o.selfService,
  open_24h: (o) => o.openAllHours,
  free_additional_driver: (o) => o.inclusions.includes('additional_driver'),
  free_gps: (o) => o.inclusions.includes('gps'),
  winter_tyres: (o) => o.inclusions.includes('winter_tyres'),
};

const SEAT_TESTS: Record<SeatOption, (seats: number) => boolean> = {
  up_to_5: (s) => s <= 5,
  six_to_seven: (s) => s >= 6 && s <= 7,
  eight_plus: (s) => s >= 8,
};

export function matchesCategoryOption(car: FleetVehicle, option: CategoryOption) {
  return car.segment === option;
}

export function matchesOfferFeatures(offer: StoreOffer, features: OfferFeature[]): boolean {
  return features.every((feature) => FEATURE_TESTS[feature](offer));
}

export function matchesVehicleFilters(car: FleetVehicle, filters: ResultFilters): boolean {
  return (
    (!filters.category.length || filters.category.some((option) => matchesCategoryOption(car, option))) &&
    (!filters.transmission.length || filters.transmission.includes(car.gear)) &&
    (!filters.seats.length || filters.seats.some((option) => SEAT_TESTS[option](car.seats)))
  );
}

export type FilterOption = { [F in FilterFacet]: { facet: F; value: FilterValue<F> } }[FilterFacet];

export function isFilterSelected(filters: ResultFilters, { facet, value }: FilterOption): boolean {
  return (filters[facet] as string[]).includes(value);
}

export function toggleFilter(filters: ResultFilters, option: FilterOption): ResultFilters {
  const current = filters[option.facet] as string[];
  const next = isFilterSelected(filters, option) ? current.filter((v) => v !== option.value) : [...current, option.value];
  return { ...filters, [option.facet]: next };
}

/** Filters as if only this option were chosen in its facet; used to grey out dead-end options. */
export function withOnly(filters: ResultFilters, option: FilterOption): ResultFilters {
  if (option.facet !== 'features') return { ...filters, [option.facet]: [option.value] };
  return isFilterSelected(filters, option) ? filters : { ...filters, features: [...filters.features, option.value] };
}

export function countActiveFilters(filters: ResultFilters): number {
  return Object.values(filters).reduce((sum, values) => sum + values.length, 0);
}
