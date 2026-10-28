import type { Language } from '@/i18n/locales';
import { } from '@/i18n/locales';
import { cityNodes, poiCatalog, serviceMarkets } from './poi-catalog';
import { localLaxDestination } from './local-lax-destination';
import {
  calculateServiceLocationCount, getNearestStore, storeDirectory
} from './store-directory';
import type {
  CityNode, LocationSearchResult, PoiCandidate, PoiRecord, ServiceMarket, StoreCandidate, StoreLocationSnapshot
} from './types';

const RECENT_POI_SESSION_KEY = 'tg_recent_poi_id';
const searchPois = () => { const local = localLaxDestination(); return local ? [...poiCatalog, local.poi] : poiCatalog; };
const searchStores = () => [...storeDirectory, ...(localLaxDestination()?.stores ?? [])];
const searchCities = () => { const local = localLaxDestination(); return local ? [...cityNodes, local.city] : cityNodes; };
const searchMarkets = () => { const local = localLaxDestination(); return local ? [...serviceMarkets, local.market] : serviceMarkets; };

/**
 * Normalizes text for search matching:
 * - NFKD unicode decomposition (strips combining diacritics / accents)
 * - Lowercases and removes excessive whitespace & punctuation
 */
export function normalizeSearchString(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim();
}

/**
 * Check if word 'target' is reachable from 'query' with at most 1 edit distance.
 * Only applied when query length >= 4.
 */
function isSingleCharMistake(query: string, target: string): boolean {
  if (query.length < 4 || target.length < 4) return false;
  if (Math.abs(query.length - target.length) > 1) return false;

  let edits = 0;
  let i = 0;
  let j = 0;

  while (i < query.length && j < target.length) {
    if (query[i] !== target[j]) {
      edits++;
      if (edits > 1) return false;

      if (query.length > target.length) {
        i++;
      } else if (query.length < target.length) {
        j++;
      } else {
        i++;
        j++;
      }
    } else {
      i++;
      j++;
    }
  }

  if (i < query.length || j < target.length) edits++;
  return edits <= 1;
}

function matchScore(queryNorm: string, targetNorm: string): number {
  if (!queryNorm || !targetNorm) return 0;
  if (targetNorm === queryNorm) return 100;
  if (targetNorm.startsWith(queryNorm)) return 80;
  if (targetNorm.includes(queryNorm)) return 60;
  if (isSingleCharMistake(queryNorm, targetNorm)) return 40;
  return 0;
}

function getCityNode(cityCode: string): CityNode | undefined {
  return searchCities().find((city) => city.code.toLowerCase() === cityCode.toLowerCase());
}

function getMarket(marketCode: string): ServiceMarket | undefined {
  return searchMarkets().find((market) => market.code.toUpperCase() === marketCode.toUpperCase());
}

export function toPoiCandidate(record: PoiRecord, language: Language): PoiCandidate {
  const city = getCityNode(record.cityCode);
  const market = getMarket(record.marketCode);
  const local = localLaxDestination();
  const isLocalLax = local?.poi.poiId === record.poiId;
  const serviceLocationCount = isLocalLax ? local.stores.length : calculateServiceLocationCount(record.point, 60, record.marketCode);
  const nearestStore = isLocalLax ? { ...local.stores[0], distanceKm: 1.2 } : getNearestStore(record.point, record.marketCode);

  return {
    id: record.poiId,
    poiId: record.poiId,
    kind: record.kind,
    label: record.localizedNames[language] || record.localizedNames.EN || record.poiId,
    cityLabel: city?.localizedNames[language] || city?.localizedNames.EN || record.cityCode,
    marketLabel: market?.localizedNames[language] || market?.localizedNames.EN || record.marketCode,
    serviceLocationCount,
    nearestStoreCode: nearestStore?.storeCode,
    nearestStoreName: nearestStore?.localizedNames[language] || nearestStore?.localizedNames.EN,
    distanceKm: nearestStore?.distanceKm,
    record,
  };
}

export function toStoreCandidate(
  snapshot: StoreLocationSnapshot,
  language: Language
): StoreCandidate {
  const city = getCityNode(snapshot.cityCode);
  const market = getMarket(snapshot.marketCode);

  return {
    id: `store-${snapshot.storeCode}`,
    storeCode: snapshot.storeCode,
    label: snapshot.localizedNames[language] || snapshot.localizedNames.EN || snapshot.storeCode,
    cityLabel: city?.localizedNames[language] || city?.localizedNames.EN || snapshot.cityCode,
    marketLabel:
      market?.localizedNames[language] || market?.localizedNames.EN || snapshot.marketCode,
    storeType: snapshot.storeType,
    snapshot,
  };
}

/* ------------------------------------------------------------------ */
/* Session Recent POI Storage */
/* ------------------------------------------------------------------ */

export function getRecentPoiId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(RECENT_POI_SESSION_KEY);
  } catch {
    return null;
  }
}

export function saveRecentPoiId(poiId: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (!poiId) {
      window.sessionStorage.removeItem(RECENT_POI_SESSION_KEY);
    } else {
      window.sessionStorage.setItem(RECENT_POI_SESSION_KEY, poiId);
    }
  } catch {
    // Ignore sessionStorage write errors
  }
}

export function clearRecentPoiId(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(RECENT_POI_SESSION_KEY);
  } catch {
    // Ignore sessionStorage errors
  }
}

export function getRecentPoiCandidate(language: Language): PoiCandidate | undefined {
  const recentId = getRecentPoiId();
  if (!recentId) return undefined;

  const record = searchPois().find((poi) => poi.poiId === recentId && poi.status === 'active');
  if (!record) {
    clearRecentPoiId();
    return undefined;
  }

  return toPoiCandidate(record, language);
}

/* ------------------------------------------------------------------ */
/* Search Engine */
/* ------------------------------------------------------------------ */

export function searchLocations(
  query: string,
  language: Language,
  preferredMarketCode?: string,
): LocationSearchResult {
  const recentPoi = getRecentPoiCandidate(language);
  const queryNorm = normalizeSearchString(query);

  if (!queryNorm) {
    return {
      recentPoi,
      places: searchPois()
        .filter((poi) => poi.status === 'active')
        .slice(0, 10)
        .map((poi) => toPoiCandidate(poi, language)),
      stores: searchStores()
        .filter(
          (store) => store.enabled && store.officialWebsiteEnabled && store.rentalSearchEnabled
        )
        .sort((a, b) => Number(b.marketCode === preferredMarketCode) - Number(a.marketCode === preferredMarketCode))
        .slice(0, 8)
        .map((store) => toStoreCandidate(store, language)),
      hasMatches: true,
    };
  }

  // 1. Match POIs
  const poiMatches: Array<{ candidate: PoiCandidate; score: number }> = [];
  for (const poi of searchPois()) {
    if (poi.status !== 'active') continue;

    let bestScore = 0;
    const searchTargets = [
      poi.poiId,
      ...Object.values(poi.localizedNames),
      ...poi.aliases,
      ...poi.codes,
    ];

    for (const target of searchTargets) {
      const score = matchScore(queryNorm, normalizeSearchString(target));
      if (score > bestScore) bestScore = score;
      if (bestScore === 100) break;
    }

    if (bestScore > 0) {
      const candidate = toPoiCandidate(poi, language);
      poiMatches.push({ candidate, score: bestScore });
    }
  }

  // 2. Match Stores
  const storeMatches: Array<{
    candidate: StoreCandidate;
    score: number;
    isExact: boolean;
  }> = [];
  for (const store of searchStores()) {
    if (!store.enabled || !store.officialWebsiteEnabled || !store.rentalSearchEnabled) continue;

    let bestScore = 0;
    let isExact = false;

    if (normalizeSearchString(store.storeCode) === queryNorm) {
      bestScore = 100;
      isExact = true;
    } else {
      const searchTargets = [
        store.storeCode,
        ...Object.values(store.localizedNames),
        store.address || '',
      ];

      for (const target of searchTargets) {
        const targetNorm = normalizeSearchString(target);
        if (targetNorm === queryNorm) {
          bestScore = 100;
          isExact = true;
          break;
        }
        const score = matchScore(queryNorm, targetNorm);
        if (score > bestScore) bestScore = score;
      }
    }

    if (bestScore > 0) {
      const candidate = toStoreCandidate(store, language);
      storeMatches.push({ candidate, score: bestScore, isExact });
    }
  }

  // Find exact store if any
  const exactStoreMatch = storeMatches.find((m) => m.isExact || m.score === 100);
  const exactStore = exactStoreMatch?.candidate;

  // Sort POIs by score descending, then by serviceLocationCount descending
  poiMatches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.candidate.serviceLocationCount - a.candidate.serviceLocationCount;
  });

  // Sort Stores by score descending
  storeMatches.sort((a, b) => b.score - a.score);

  const places = poiMatches.map((m) => m.candidate);
  const stores = storeMatches.map((m) => m.candidate);

  return {
    recentPoi,
    places,
    stores,
    exactStore,
    hasMatches: places.length > 0 || stores.length > 0,
  };
}

/* ------------------------------------------------------------------ */
/* Browsing Hierarchy API */
/* ------------------------------------------------------------------ */

export function getBrowseMarkets(): ServiceMarket[] {
  return searchMarkets().sort((a, b) => a.order - b.order);
}

export function getBrowseCities(marketCode: string): CityNode[] {
  return searchCities().filter((c) => c.marketCode.toUpperCase() === marketCode.toUpperCase());
}

export function getCityAllPois(
  marketCode: string,
  cityCode: string,
  language: Language
): PoiCandidate[] {
  return searchPois()
    .filter(
      (poi) =>
        poi.status === 'active' &&
        poi.marketCode.toUpperCase() === marketCode.toUpperCase() &&
        poi.cityCode.toLowerCase() === cityCode.toLowerCase()
    )
    .map((poi) => toPoiCandidate(poi, language));
}
