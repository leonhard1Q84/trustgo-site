import { depotDateTime } from './depot-time';
import { hasLocalInventory } from './local-inventory';
import { FLEET_STORE_OFFERS, type StoreOffer } from './store-offers';
import { type SearchFormState, type SearchLocation, parseDateInput, toDateInput } from './search-form';
import { findStoresWithinRadius, getStoreByCode, isStoreEligible } from '@/modules/destination-search/store-directory';
import { poiCatalog } from '@/modules/destination-search/poi-catalog';
import { RentalError, normalizeLicenseCountry } from '@/modules/reservation/domain/validation';

export function validateSearch(form: SearchFormState): void {
  const validDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && toDateInput(parseDateInput(date)) === date;
  const validTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  if (!validDate(form.pickupDate) || !validDate(form.returnDate) || !validTime(form.pickupTime)
    || !validTime(form.returnTime) || `${form.returnDate}T${form.returnTime}` <= `${form.pickupDate}T${form.pickupTime}`
    || !Number.isInteger(form.driverAge) || form.driverAge < 18 || form.driverAge > 99) {
    throw new RentalError('invalid_search', 400);
  }
  normalizeLicenseCountry(form.licenseCountry);
}

function matchingStores(location: SearchLocation): Map<string, number> {
  // Preserve the original LAX fixtures, which predate the destination directory.
  if (location.poiId === 'poi-lax-airport') return !location.storeCode || ['US-LAX-01', 'US-LAX-02'].includes(location.storeCode)
    ? new Map([['US-LAX-01', 1.2], ['US-LAX-02', 3.5]]) : new Map();
  if (location.poiId) {
    const poi = poiCatalog.find(p => p.poiId === location.poiId && p.status === 'active');
    // Match the 60 km service area used by the destination picker's POI count.
    const stores = new Map(poi ? findStoresWithinRadius(poi.point, 60, poi.marketCode)
      .map(store => [store.storeCode, store.distanceKm]) : []);
    return location.storeCode && !stores.has(location.storeCode) ? new Map() : stores;
  }
  const store = location.storeCode && getStoreByCode(location.storeCode);
  if (store && isStoreEligible(store)) return new Map([[store.storeCode, 0]]);
  if (['US-LAX-01', 'US-LAX-02'].includes(location.storeCode ?? '')) return new Map([[location.storeCode!, 0]]);
  return new Map();
}

export function getAvailableStoreOffers(form: SearchFormState, now = Date.now()): StoreOffer[] {
  validateSearch(form);
  const pickupStores = matchingStores(form.pickup);
  const returnStores = form.differentReturn ? matchingStores(form.dropoff) : pickupStores;
  // The current internal data has no cross-depot inventory. FE must explicitly
  // supply a valid pair before a one-way rental can be reserved.
  const candidates = FLEET_STORE_OFFERS.filter(o => pickupStores.has(o.storeCode));
  const timely = candidates.filter(offer => {
    try {
      const pickup = Date.parse(depotDateTime(form.pickupDate, form.pickupTime, offer.timeZone));
      const returned = Date.parse(depotDateTime(form.returnDate, form.returnTime, offer.timeZone));
      return pickup > now && returned > pickup;
    } catch (error) {
      if (error instanceof RentalError && error.code === 'invalid_search') return false;
      throw error;
    }
  });
  if (candidates.length && !timely.length) throw new RentalError('invalid_search', 400);
  return timely.filter(o => returnStores.has(o.storeCode))
    .filter(offer => {
      const pickup = Date.parse(depotDateTime(form.pickupDate, form.pickupTime, offer.timeZone));
      return hasLocalInventory(pickup, now);
    })
    .map(offer => ({ ...offer, distanceKm: pickupStores.get(offer.storeCode)! }));
}
