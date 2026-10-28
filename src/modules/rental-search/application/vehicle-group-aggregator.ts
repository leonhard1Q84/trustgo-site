import type { FleetVehicle } from '../domain/fleet-data';
import type { StoreOffer } from '../domain/store-offers';

export interface PricedOffer extends StoreOffer {
  totalPrice: number;
  isLowestPrice: boolean;
  isNearest: boolean;
}

/** Vehicle group card: specs once, then every nearby depot offering it (all expanded). */
export interface VehicleGroup {
  vehicle: FleetVehicle;
  offers: PricedOffer[]; // nearest first
  fromTotal: number;
}

export interface OfferFilter {
  freeCancellation?: boolean;
  depositFree?: boolean;
}

export function matchesOfferFilter(offer: StoreOffer, filter: OfferFilter): boolean {
  if (filter.freeCancellation && offer.cancellationFreeHours <= 0) return false;
  if (filter.depositFree && offer.depositAmount > 0) return false;
  return true;
}

/**
 * Groups depot offers by vehicle group. Offer filters apply per offer; a group disappears
 * only when none of its offers match. Tags are only shown when a group has more than one offer.
 */
export function aggregateVehicleGroups(
  vehicles: FleetVehicle[],
  offers: StoreOffer[],
  rentalDays: number,
  filter: OfferFilter = {}
): VehicleGroup[] {
  const days = Math.max(1, rentalDays);
  return vehicles.flatMap((vehicle) => {
    const matching = offers
      .filter((o) => o.vehicleId === vehicle.id && matchesOfferFilter(o, filter))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    if (!matching.length) return [];
    const totals = matching.map((o) => o.pricePerDay * days);
    const lowest = Math.min(...totals);
    const multiple = matching.length > 1;
    return [{
      vehicle,
      fromTotal: lowest,
      offers: matching.map((o, i) => ({
        ...o,
        totalPrice: totals[i],
        isNearest: multiple && i === 0,
        isLowestPrice: multiple && totals[i] === lowest,
      })),
    }];
  });
}
