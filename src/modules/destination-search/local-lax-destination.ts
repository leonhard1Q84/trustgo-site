import type { CityNode, PoiRecord, ServiceMarket, StoreLocationSnapshot } from './types';

// Local booking fixtures share the existing LAX offer identities. They never
// extend the published destination directory, landing pages or production picker.
const market: ServiceMarket = { code: 'US', flag: '🇺🇸', order: 5,
  localizedNames: { EN: 'United States', ZH: '美國', JA: 'アメリカ', ES: 'Estados Unidos', KO: '미국' } };
const city: CityNode = { code: 'los-angeles', marketCode: 'US', point: { latitude: 33.9416, longitude: -118.4085 },
  localizedNames: { EN: 'Los Angeles', ZH: '洛杉磯', JA: 'ロサンゼルス', ES: 'Los Ángeles', KO: '로스앤젤레스' } };
const poi: PoiRecord = { poiId: 'poi-lax-airport', kind: 'airport', marketCode: 'US', countryCode: 'US',
  cityCode: city.code, point: city.point, status: 'active', codes: ['LAX', 'KLAX'],
  aliases: ['Los Angeles', '洛杉磯', '洛杉矶', 'ロサンゼルス', '로스앤젤레스'],
  localizedNames: { EN: 'Los Angeles International Airport (LAX)', ZH: '洛杉磯國際機場 (LAX)',
    JA: 'ロサンゼルス国際空港 (LAX)', ES: 'Aeropuerto Internacional de Los Ángeles (LAX)', KO: '로스앤젤레스 국제공항 (LAX)' } };
const stores: StoreLocationSnapshot[] = [
  { storeCode: 'US-LAX-01', marketCode: 'US', cityCode: city.code, point: city.point,
    enabled: true, officialWebsiteEnabled: true, rentalSearchEnabled: true, oneWayEnabled: false, storeType: 'airport',
    localizedNames: { EN: 'TrustGo LAX Airport Hub', ZH: 'TrustGo 洛杉磯機場旗艦店', JA: 'TrustGo ロサンゼルス空港店',
      ES: 'TrustGo Aeropuerto LAX', KO: 'TrustGo LAX 공항점' } },
  { storeCode: 'US-LAX-02', marketCode: 'US', cityCode: city.code, point: { latitude: 33.946, longitude: -118.38 },
    enabled: true, officialWebsiteEnabled: true, rentalSearchEnabled: true, oneWayEnabled: false, storeType: 'city',
    localizedNames: { EN: 'TrustGo Century Blvd', ZH: 'TrustGo 世紀大道店', JA: 'TrustGo センチュリー・ブルバード店',
      ES: 'TrustGo Century Blvd', KO: 'TrustGo 센추리 블러바드점' } },
];

export function localLaxDestination() {
  return process.env.NODE_ENV === 'production' ? undefined : { market, city, poi, stores };
}
