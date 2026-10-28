import type { Language } from '@/i18n/locales';

export type LocationLanguage = Language;
export type LocationStoreType = 'airport' | 'train' | 'city';
export type LocationServiceStatus = 'active' | 'limited';
export type LocationIndexStatus = 'indexable' | 'noindex';

export type StorefrontPhoto = {
  src: string;
  alt: Record<LocationLanguage, string>;
};

export type LocationLocalizedContent = {
  name: string;
  address: string;
  serviceNote: string;
  accessGuide: string;
};

export type LocationCard = {
  slug: string;
  code: string;
  marketCode: string;
  cityCode: string;
  serviceStatus: LocationServiceStatus;
  indexStatus: LocationIndexStatus;
  storeType: LocationStoreType;
  pickupKey: 'airport' | 'city';
  oneWay: boolean;
  selfService: boolean;
  phone: string;
  hours: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  postalCode?: string;
  mapCode?: string;
  storefrontPhotos: StorefrontPhoto[];
  seo: Record<LocationLanguage, { title: string; description: string }>;
  EN: LocationLocalizedContent;
  ZH: LocationLocalizedContent;
  JA: LocationLocalizedContent;
  ES: LocationLocalizedContent;
  KO: LocationLocalizedContent;
};

export type StoreTimesSpec = {
  postalCode?: string;
  mapCode?: string;
  pickupPrecautions: string;
  returnPrecautions: string;
  paymentMethods: string;
  supportedLanguages: string;
};

export type StoreFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type StoreLocatorFilterState = {
  market: string;
  city?: string;
  airport: boolean;
  cityStore: boolean;
  selfServiceOnly: boolean;
  oneWayOnly: boolean;
  searchQuery: string;
};

// ==========================================
// Destinations Hierarchy Types (Country -> City -> Store)
// ==========================================
export type DestinationCityNode = {
  code: string;
  slug: string;
  marketCode: string;
  countrySlug: string;
  image: string;
  localizedNames: Record<LocationLanguage, string>;
  stores: LocationCard[];
};

export type DestinationCountryNode = {
  code: string;
  slug: string;
  flag: string;
  heroImage: string;
  localizedNames: Record<LocationLanguage, string>;
  cities: DestinationCityNode[];
};
