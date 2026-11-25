import { storeDirectory, isStoreEligible } from '@/modules/destination-search/store-directory';
import type { StoreLocationSnapshot } from '@/modules/destination-search/types';
import { locationCards } from '@/modules/locations/domain/locations-data';
import type { OfferInclusion, StoreOffer } from './store-offers';

// Internal channel inventory for local booking verification, not FE availability.
// Keep the existing USD channel pricing convention for every market: changing
// currency symbols alone would mislabel equipment, protection and tax amounts.
const MARKET_TIME_ZONES: Record<string, string> = {
  JP: 'Asia/Tokyo', TW: 'Asia/Taipei', TH: 'Asia/Bangkok', MY: 'Asia/Kuala_Lumpur',
};

const PRODUCTS: Pick<StoreOffer, 'vehicleId' | 'pricePerDay' | 'depositAmount' | 'cancellationFreeHours' | 'mileagePolicy' | 'fuelPolicy'>[] = [
  { vehicleId: 'toyota-rav4-suv', pricePerDay: 58, depositAmount: 300, cancellationFreeHours: 48,
    mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'hyundai-i30-compact', pricePerDay: 42, depositAmount: 0, cancellationFreeHours: 48,
    mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'kia-carnival-van', pricePerDay: 89, depositAmount: 400, cancellationFreeHours: 48,
    mileagePolicy: 'Limited (250 km/day)', fuelPolicy: 'Like for Like (Full to Full)' },
  { vehicleId: 'tesla-model-y-electric', pricePerDay: 79, depositAmount: 500, cancellationFreeHours: 0,
    mileagePolicy: 'Unlimited Mileage', fuelPolicy: 'Pre-purchase' },
];

function counterType(store: StoreLocationSnapshot): StoreOffer['counterType'] {
  if (store.accessType === 'shuttle') return 'Free Shuttle Bus';
  if (store.accessType === 'counter' || store.atAirport) return 'In-Terminal Counter';
  return 'Meet & Greet';
}

const SELF_SERVICE_STORES = new Set(locationCards.filter(card => card.selfService).map(card => card.code));
const WINTER_TYRE_CITIES = new Set(['sapporo']);

function inclusions(store: StoreLocationSnapshot): OfferInclusion[] {
  return WINTER_TYRE_CITIES.has(store.cityCode) ? ['additional_driver', 'winter_tyres'] : ['additional_driver'];
}

export function createLocalStoreOffers(): StoreOffer[] {
  return storeDirectory.filter(isStoreEligible).flatMap(store => {
    const timeZone = MARKET_TIME_ZONES[store.marketCode];
    if (!timeZone) return [];
    return PRODUCTS.map(product => ({
      ...product,
      offerId: `${product.vehicleId}@${store.storeCode}`,
      storeCode: store.storeCode,
      storeNames: { ...store.localizedNames },
      counterType: counterType(store),
      distanceKm: 0,
      selfService: SELF_SERVICE_STORES.has(store.storeCode),
      openAllHours: /^00:00\s*-\s*24:00$/.test(store.hours ?? ''),
      inclusions: inclusions(store),
      currency: '$',
      timeZone,
    }));
  });
}
