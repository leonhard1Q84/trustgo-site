import type { Language } from '@/i18n/locales';

export type PoiKind = 'airport' | 'transport_hub' | 'hotel' | 'landmark' | 'other';

export type Wgs84Point = {
  latitude: number;
  longitude: number;
};

export type PoiRecord = {
  poiId: string;
  kind: PoiKind;
  marketCode: string;
  countryCode: string;
  cityCode: string;
  localizedNames: Record<Language, string>;
  aliases: string[];
  codes: string[];
  point: Wgs84Point;
  status: 'active' | 'inactive';
};

export type StoreLocationSnapshot = {
  storeCode: string;
  localizedNames: Record<Language, string>;
  marketCode: string;
  cityCode: string;
  point: Wgs84Point;
  enabled: boolean;
  officialWebsiteEnabled: boolean;
  rentalSearchEnabled: boolean;
  oneWayEnabled: boolean;
  storeType: 'airport' | 'train' | 'city';
  address?: string;
  phone?: string;
  hours?: string;
  atAirport?: boolean;
  arrivalWay?: number;
  counterLocation?: string;
  terminalInfo?: string;
  accessType?: 'shuttle' | 'walk' | 'counter';
  accessGuide?: Record<Language, string>;
};

export type PoiStoreMatch = StoreLocationSnapshot & {
  distanceKm: number;
};

export type PoiCandidate = {
  id: string;
  poiId: string;
  kind: PoiKind;
  label: string;
  cityLabel: string;
  marketLabel: string;
  serviceLocationCount: number;
  nearestStoreCode?: string;
  nearestStoreName?: string;
  distanceKm?: number;
  record: PoiRecord;
};

export type StoreCandidate = {
  id: string;
  storeCode: string;
  label: string;
  cityLabel: string;
  marketLabel: string;
  storeType: 'airport' | 'train' | 'city';
  snapshot: StoreLocationSnapshot;
};

export type LocationSearchResult = {
  recentPoi?: PoiCandidate;
  places: PoiCandidate[];
  stores: StoreCandidate[];
  exactStore?: StoreCandidate;
  hasMatches: boolean;
};

export type ServiceMarket = {
  code: string;
  order: number;
  flag: string;
  localizedNames: Record<Language, string>;
};

export type CityNode = {
  code: string;
  marketCode: string;
  point: Wgs84Point;
  localizedNames: Record<Language, string>;
};

export type LocationSelection =
  | {
      selectionType: 'POI';
      poiId: string;
      label: string;
      serviceLocationCount: number;
      associatedStoreCode?: string;
      cityName?: string;
    }
  | {
      selectionType: 'STORE';
      storeCode: string;
      label: string;
      cityName?: string;
    };
