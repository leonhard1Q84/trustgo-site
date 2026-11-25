import type { FleetVehicle } from '../domain/fleet-data';
import type { StoreOffer } from '../domain/store-offers';
import {
  matchesOfferFeatures, matchesVehicleFilters, type OfferFeature, type ResultFilters,
} from '../domain/result-filters';

export interface PricedOffer extends StoreOffer {
  totalPrice: number;
  isLowestPrice: boolean;
}

/** Vehicle group card: specs once, then every nearby depot offering it (all expanded). */
export interface VehicleGroup {
  vehicle: FleetVehicle;
  offers: PricedOffer[]; // nearest first
  fromTotal: number;
}

/**
 * Groups depot offers by vehicle group. Offer features apply per offer; a group disappears
 * only when none of its offers match. "Lowest price" is only flagged when depots actually differ.
 */
export function aggregateVehicleGroups(
  vehicles: FleetVehicle[],
  offers: StoreOffer[],
  rentalDays: number,
  features: OfferFeature[] = []
): VehicleGroup[] {
  const days = Math.max(1, rentalDays);
  return vehicles.flatMap((vehicle) => {
    const matching = offers
      .filter((o) => o.vehicleId === vehicle.id && matchesOfferFeatures(o, features))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    if (!matching.length) return [];
    const totals = matching.map((o) => o.pricePerDay * days);
    const lowest = Math.min(...totals);
    const pricesDiffer = lowest < Math.max(...totals);
    return [{
      vehicle,
      fromTotal: lowest,
      offers: matching.map((o, i) => ({
        ...o,
        totalPrice: totals[i],
        isLowestPrice: pricesDiffer && totals[i] === lowest,
      })),
    }];
  });
}

export function filterVehicleGroups(
  vehicles: FleetVehicle[],
  offers: StoreOffer[],
  rentalDays: number,
  filters: ResultFilters
): VehicleGroup[] {
  return aggregateVehicleGroups(vehicles.filter((car) => matchesVehicleFilters(car, filters)), offers, rentalDays, filters.features);
}
