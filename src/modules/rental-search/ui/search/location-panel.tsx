'use client';

import React, { useMemo, useState } from 'react';
import {
  Building2,
  ChevronLeft,
  History,
  Hotel,
  Landmark,
  MapPin,
  Plane,
  TrainFront,
  type LucideIcon,
} from 'lucide-react';
import type { Language } from '@/i18n/locales';
import { GroupedOptionList } from '@/shared/ui/grouped-option-list';
import {
  getBrowseCities,
  getBrowseMarkets,
  getCityAllPois,
  getRecentPoiCandidate,
  saveRecentPoiId,
  searchLocations,
  type CityNode,
  type LocationSelection,
  type PoiCandidate,
  type PoiKind,
  type ServiceMarket,
  type StoreCandidate,
} from '@/modules/destination-search/public-api';

const POI_KIND_ORDER: PoiKind[] = ['airport', 'transport_hub', 'landmark', 'hotel', 'other'];
const POI_KIND_ICONS: Record<PoiKind, LucideIcon> = {
  airport: Plane,
  transport_hub: TrainFront,
  hotel: Hotel,
  landmark: Landmark,
  other: MapPin,
};

interface LocationPanelProps {
  query: string;
  language: Language;
  t: (key: string) => string;
  onSelect: (selection: LocationSelection, displayName: string) => void;
}

const optionClass =
  'flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors cursor-pointer';

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-3 text-xs font-medium text-muted-foreground first:pt-0">
      {children}
    </p>
  );
}

/** PC location picker panel: recent → market / city → POIs grouped by kind, or live matches while typing. */
export function LocationPanel({ query, language, t, onSelect }: LocationPanelProps) {
  const [city, setCity] = useState<{ market: ServiceMarket; node: CityNode } | null>(null);
  const markets = useMemo(() => getBrowseMarkets(), []);
  const recentPoi = useMemo(() => getRecentPoiCandidate(language), [language]);
  const trimmed = query.trim();
  const result = useMemo(
    () => (trimmed ? searchLocations(trimmed, language) : null),
    [trimmed, language]
  );

  const selectPoi = (poi: PoiCandidate) => {
    saveRecentPoiId(poi.poiId);
    onSelect(
      {
        selectionType: 'POI',
        poiId: poi.poiId,
        label: poi.label,
        serviceLocationCount: poi.serviceLocationCount,
        associatedStoreCode: poi.nearestStoreCode,
        cityName: poi.cityLabel,
      },
      poi.label
    );
  };
  const selectStore = (store: StoreCandidate) =>
    onSelect(
      {
        selectionType: 'STORE',
        storeCode: store.storeCode,
        label: store.label,
        cityName: store.cityLabel,
      },
      store.label
    );

  const renderPoi = (poi: PoiCandidate, withCity: boolean) => {
    const Icon = POI_KIND_ICONS[poi.kind] ?? MapPin;
    return (
      <button
        key={poi.poiId}
        type="button"
        role="option"
        aria-selected={false}
        onClick={() => selectPoi(poi)}
        className={optionClass}
      >
        <Icon className="h-4 w-4 shrink-0 text-foreground-secondary" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{poi.label}</span>
          {withCity && (
            <span className="block truncate text-xs text-muted-foreground">
              {poi.cityLabel} · {poi.marketLabel}
            </span>
          )}
        </span>
      </button>
    );
  };

  if (result) {
    const stores = result.stores.filter((s) => s.storeCode !== result.exactStore?.storeCode);
    const storeList = result.exactStore ? [result.exactStore, ...stores] : stores;
    if (!result.hasMatches) {
      return (
        <div className="px-3 py-6 text-center">
          <p className="text-sm font-semibold text-foreground">{t('search_location_no_match')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('search_location_no_match_hint')}</p>
        </div>
      );
    }
    return (
      <div role="listbox">
        {result.places.length > 0 && <GroupTitle>{t('search_location_group_places')}</GroupTitle>}
        {result.places.map((poi) => renderPoi(poi, true))}
        {storeList.length > 0 && <GroupTitle>{t('search_location_group_stores')}</GroupTitle>}
        {storeList.map((store) => (
          <button
            key={store.storeCode}
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => selectStore(store)}
            className={optionClass}
          >
            <Building2 className="h-4 w-4 shrink-0 text-foreground-secondary" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{store.label}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {store.cityLabel} · {store.marketLabel}
              </span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (city) {
    const pois = getCityAllPois(city.market.code, city.node.code, language);
    return (
      <div>
        <div className="flex items-center justify-between border-b border-border px-3 pb-2.5">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {city.node.localizedNames[language]} · {city.market.localizedNames[language]}
          </span>
          <button
            type="button"
            onClick={() => setCity(null)}
            className="inline-flex items-center gap-0.5 rounded-control px-2 py-1 text-xs font-medium text-foreground-secondary hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t('search_location_back')}
          </button>
        </div>
        {POI_KIND_ORDER.map((kind) => {
          const group = pois.filter((p) => p.kind === kind);
          if (!group.length) return null;
          return (
            <div key={kind} className="pt-2">
              <GroupTitle>{t(`poi_kind_${kind}`)}</GroupTitle>
              <div className="grid grid-cols-2 gap-x-1">
                {group.map((poi) => renderPoi(poi, false))}
              </div>
            </div>
          );
        })}
        {pois.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            {t('search_location_no_match_hint')}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {recentPoi && (
        <>
          <GroupTitle>
            <span className="inline-flex items-center gap-1">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              {t('search_location_recent')}
            </span>
          </GroupTitle>
          {renderPoi(recentPoi, true)}
        </>
      )}
      <GroupedOptionList
        groups={markets
          .map((market) => ({
            id: market.code,
            label: market.localizedNames[language],
            options: getBrowseCities(market.code).map((node) => ({
              id: node.code,
              label: node.localizedNames[language],
            })),
          }))
          .filter((group) => group.options.length > 0)}
        onSelect={(marketCode, cityCode) => {
          const market = markets.find((item) => item.code === marketCode);
          const node = getBrowseCities(marketCode).find((item) => item.code === cityCode);
          if (market && node) setCity({ market, node });
        }}
      />
    </div>
  );
}
