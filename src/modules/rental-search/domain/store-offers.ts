import type { Language } from '@/i18n/locales';
import type { FleetVehicle } from './fleet-data';
import { createLocalStoreOffers } from './local-store-offers';

/**
 * One bookable product: a vehicle group offered by one depot.
 * Mirrors a single FE `vehAvailRate` result line (rate + rules are per depot).
 */
export interface StoreOffer {
  offerId: string;
  vehicleId: string;
  storeCode: string;
  storeNames: Record<Language, string>;
  counterType: FleetVehicle['supplier']['locationType'];
  distanceKm: number; // from the searched pick-up POI
  pricePerDay: number;
  currency: string;
  timeZone: string;
  depositAmount: number; // 0 = deposit-free
  cancellationFreeHours: number; // 0 = non-refundable
  mileagePolicy: FleetVehicle['mileagePolicy'];
  fuelPolicy: FleetVehicle['fuelPolicy'];
}

const LAX_HUB: Pick<StoreOffer, 'storeCode' | 'storeNames' | 'counterType'> = {
  storeCode: 'US-LAX-01',
  storeNames: {
    EN: 'TrustGo LAX Airport Hub',
    ZH: 'TrustGo 洛杉磯機場旗艦店',
    JA: 'TrustGo ロサンゼルス空港店',
    ES: 'TrustGo Aeropuerto LAX',
    KO: 'TrustGo LAX 공항점',
  },
  counterType: 'In-Terminal Counter',
};

const CENTURY_BLVD: Pick<StoreOffer, 'storeCode' | 'storeNames' | 'counterType'> = {
  storeCode: 'US-LAX-02',
  storeNames: {
    EN: 'TrustGo Century Blvd',
    ZH: 'TrustGo 世紀大道店',
    JA: 'TrustGo センチュリー・ブルバード店',
    ES: 'TrustGo Century Blvd',
    KO: 'TrustGo 센추리 블러바드점',
  },
  counterType: 'Free Shuttle Bus',
};

type OfferSeed = Omit<StoreOffer, 'offerId' | 'storeCode' | 'storeNames' | 'counterType' | 'currency' | 'timeZone'> & {
  store: typeof LAX_HUB;
};

const seeds: OfferSeed[] = [
  { vehicleId: 'toyota-rav4-suv', store: LAX_HUB, distanceKm: 1.2, pricePerDay: 58, depositAmount: 300, cancellationFreeHours: 48, mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'toyota-rav4-suv', store: CENTURY_BLVD, distanceKm: 3.5, pricePerDay: 51, depositAmount: 0, cancellationFreeHours: 0, mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'hyundai-i30-compact', store: LAX_HUB, distanceKm: 1.2, pricePerDay: 42, depositAmount: 250, cancellationFreeHours: 48, mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'kia-carnival-van', store: CENTURY_BLVD, distanceKm: 3.5, pricePerDay: 89, depositAmount: 400, cancellationFreeHours: 48, mileagePolicy: 'Limited (250 km/day)', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'tesla-model-y-electric', store: LAX_HUB, distanceKm: 1.2, pricePerDay: 79, depositAmount: 500, cancellationFreeHours: 48, mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'tesla-model-y-electric', store: CENTURY_BLVD, distanceKm: 3.5, pricePerDay: 75, depositAmount: 500, cancellationFreeHours: 24, mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Pre-purchase' },
];

/** Internal availability data until FE `vehAvailRate` is wired through the adapter. */
export const FLEET_STORE_OFFERS: StoreOffer[] = [...seeds.map(({ store, ...seed }) => ({
  ...seed,
  ...store,
  currency: '$',
  timeZone: 'America/Los_Angeles',
  offerId: `${seed.vehicleId}@${store.storeCode}`,
})), ...createLocalStoreOffers()];

export function getStoreOffer(offerId: string | undefined): StoreOffer | undefined {
  return offerId ? FLEET_STORE_OFFERS.find((o) => o.offerId === offerId) : undefined;
}

/** Applies a depot offer's rate and rules onto the vehicle so Rate Details shows the selected product. */
export function applyOfferToVehicle(vehicle: FleetVehicle, offer: StoreOffer, language: Language): FleetVehicle {
  return {
    ...vehicle,
    pricePerDay: offer.pricePerDay,
    currency: offer.currency,
    depositAmount: offer.depositAmount,
    cancellationFreeHours: offer.cancellationFreeHours,
    mileagePolicy: offer.mileagePolicy,
    fuelPolicy: offer.fuelPolicy,
    supplier: { ...vehicle.supplier, name: offer.storeNames[language] ?? offer.storeNames.EN, locationType: offer.counterType },
  };
}
