import { getStoreByCode, storeDirectory } from '@/modules/destination-search/store-directory';
import type { Language } from '@/i18n/locales';

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat?: number;
  lng?: number;
  locationType: string;
  accessGuide?: Record<Language, string>;
}

export function buildDepotStoreInfo(
  supplierName: string,
  location: string,
  locationType?: string,
  storeCode?: string
): StoreInfo {
  const store = storeCode
    ? getStoreByCode(storeCode)
    : storeDirectory.find((candidate) =>
        Object.values(candidate.localizedNames).some(
          (name) => name === location || name === supplierName
        )
      );
  if (store) {
    return {
      name: location,
      address: store.address ?? '',
      phone: store.phone ?? '',
      hours: store.hours ?? '',
      lat: store.point.latitude,
      lng: store.point.longitude,
      accessGuide: store.accessGuide,
      locationType:
        store.accessType === 'shuttle'
          ? 'Free Shuttle Bus'
          : store.accessType === 'counter'
            ? 'In-Terminal Counter'
            : store.accessType === 'walk'
              ? 'Walk to Depot'
              : (locationType ?? 'Meet & Greet'),
    };
  }
  // Original LAX fixture only. Unknown destinations must not inherit its address.
  const isLax =
    storeCode?.startsWith('US-LAX-') ||
    /LAX|Los Angeles|洛杉磯|ロサンゼルス|Century Blvd|世紀大道/.test(location);
  return {
    name: supplierName === location ? location : `${supplierName} - ${location}`,
    address: isLax ? '5250 W Century Blvd, Los Angeles, CA 90045, United States' : '',
    phone: isLax ? '+1 (800) 555-0199' : '',
    hours: isLax ? '06:00 - 23:30 (Everyday)' : '',
    lat: isLax ? 33.9455 : undefined,
    lng: isLax ? -118.3985 : undefined,
    locationType: locationType ?? 'Meet & Greet',
  };
}
