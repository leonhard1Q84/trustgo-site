import { citiesList, marketsList } from './locations-data';
import type { LocationCard, LocationLanguage, StoreLocatorFilterState } from './types';

/** A city always carries its parent market, including city-only entry points. */
export function resolveLocatorDestination(market: string, city = 'all') {
  const cityNode = citiesList.find((item) => item.code === city.toLowerCase());
  if (cityNode && (market === 'all' || cityNode.marketCode === market.toUpperCase())) {
    return { market: cityNode.marketCode, city: cityNode.code };
  }
  const marketNode = marketsList.find((item) => item.code === market.toUpperCase());
  return { market: marketNode?.code ?? 'all', city: 'all' };
}

export function filterLocatorStores(
  stores: LocationCard[],
  filters: StoreLocatorFilterState,
  language: LocationLanguage
) {
  const query = filters.searchQuery.trim().toLowerCase();
  return stores.filter((store) => {
    if (filters.market !== 'all' && store.marketCode !== filters.market) return false;
    if (filters.city && filters.city !== 'all' && store.cityCode !== filters.city) return false;

    // Airport and downtown/station are an OR group; capabilities are additive.
    const isAirport = store.storeType === 'airport';
    if (filters.airport || filters.cityStore) {
      if (!((filters.airport && isAirport) || (filters.cityStore && !isAirport))) return false;
    }
    if (filters.selfServiceOnly && !store.selfService) return false;
    if (filters.oneWayOnly && !store.oneWay) return false;

    const content = store[language] || store.EN;
    const city = citiesList.find((item) => item.code === store.cityCode);
    const market = marketsList.find((item) => item.code === store.marketCode);
    return (
      !query ||
      [
        store.code,
        store.slug,
        store.marketCode,
        store.cityCode,
        content.name,
        content.address,
        content.serviceNote,
        store.EN.name,
        store.EN.address,
        city?.localizedNames[language],
        city?.localizedNames.EN,
        market?.label[language],
        market?.label.EN,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  });
}
