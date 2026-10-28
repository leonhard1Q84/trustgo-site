'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle, Building2, Check, ChevronLeft, ChevronRight, History, Hotel, Landmark, MapPin, Plane, Search, TrainFront, X, type LucideIcon
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { routeToLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import {
  clearRecentPoiId, getBrowseCities, getBrowseMarkets, getCityAllPois, getRecentPoiCandidate, saveRecentPoiId, searchLocations
} from '../search-engine';
import type { CityNode, LocationSelection, PoiCandidate, PoiKind, StoreCandidate } from '../types';

export interface LocationSearchModalProps {
  isOpen: boolean;
  fieldId: 'pickup' | 'return';
  title?: string;
  placeholder?: string;
  lang: RouteLanguage;
  onClose: () => void;
  onSelect: (selection: LocationSelection, displayName: string) => void;
}

const poiKindIcons: Record<PoiKind, LucideIcon> = {
  airport: Plane,
  transport_hub: TrainFront,
  hotel: Hotel,
  landmark: Landmark,
  other: MapPin,
};

function getPoiKindIcon(kind: PoiKind) {
  return poiKindIcons[kind] ?? MapPin;
}

/**
 * Highlights matches of query within a text string using TrustGo Sky Blue.
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="text-primary font-bold underline decoration-brand/40">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export function LocationSearchModal({
  isOpen,
  fieldId,
  title,
  placeholder,
  lang,
  onClose,
  onSelect,
}: LocationSearchModalProps) {
  const { t } = useI18n(lang);
  const uiLanguage = routeToLanguage(lang);

  const [query, setQuery] = useState('');
  const [selectedMarketCode, setSelectedMarketCode] = useState('JP');
  const [selectedCity, setSelectedCity] = useState<CityNode | null>(null);
  const [requestedQueries, setRequestedQueries] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const modalTitle =
    title ||
    (fieldId === 'pickup' ? t('search_location_pickup_title') : t('search_location_return_title'));

  const inputPlaceholder = placeholder || t('search_location_placeholder');

  const markets = useMemo(() => getBrowseMarkets(), []);
  const activeMarket = useMemo(
    () => markets.find((m) => m.code === selectedMarketCode) || markets[0],
    [markets, selectedMarketCode]
  );
  const cities = useMemo(
    () => (activeMarket ? getBrowseCities(activeMarket.code) : []),
    [activeMarket]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- external system sync
  const recentPoi = useMemo(() => getRecentPoiCandidate(uiLanguage), [uiLanguage, isOpen]);

  // Search Results
  const searchResult = useMemo(() => {
    if (!query.trim()) return null;
    return searchLocations(query.trim(), uiLanguage, selectedMarketCode);
  }, [query, uiLanguage, selectedMarketCode]);

  // Autofocus the search input when opening (Radix already locks body scroll)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 60);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- external system sync
      setQuery('');
      setSelectedCity(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPoi = (poi: PoiCandidate) => {
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
    onClose();
  };

  const handleSelectStore = (store: StoreCandidate) => {
    onSelect(
      {
        selectionType: 'STORE',
        storeCode: store.storeCode,
        label: store.label,
        cityName: store.cityLabel,
      },
      store.label
    );
    onClose();
  };

  const handleRequestLocation = (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed || requestedQueries.has(trimmed)) return;
    setRequestedQueries((prev) => new Set(prev).add(trimmed));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        variant="full"
        hideCloseButton
        className="p-0 overflow-hidden sm:h-[650px] sm:max-h-[88vh] sm:max-w-4xl"
        aria-labelledby="location-modal-title"
      >
        {/* Top Header Bar */}
        <div className="flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6 bg-background">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('search_location_back')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle id="location-modal-title" className="text-base sm:text-lg tracking-tight">
            {modalTitle}
          </DialogTitle>
          <div className="w-9" aria-hidden="true" />
        </div>

        {/* Search Input Bar (Sticky Under Header) */}
        <div className="shrink-0 border-b border-border bg-muted p-3 sm:px-6 sm:py-3.5">
          <div className="relative flex items-center rounded-control bg-background px-3.5 py-2.5 border border-border focus-within:border-brand focus-within:ring-2 focus-within:ring-ring/15 transition-all">
            <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-2.5" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop = 0;
                }
              }}
              placeholder={inputPlaceholder}
              className="w-full bg-transparent text-sm sm:text-base font-bold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title={t('search_location_clear_recent')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Body Area */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto">
          {/* ======================================================== */}
          {/* VIEW 1: GLOBAL SEARCH RESULTS VIEW (When query is typed) */}
          {/* ======================================================== */}
          {query.trim() && searchResult ? (
            <div className="p-3 sm:p-6 space-y-4 max-w-4xl mx-auto">
              {/* Exact Store Match (Pinned to Top) */}
              {searchResult.exactStore && (
                <div className="space-y-1.5">
                  <p className="px-2 text-xs font-bold text-muted-foreground">
                    {t('search_location_exact_depot')}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectStore(searchResult.exactStore!)}
                    className="flex w-full items-center justify-between gap-3 rounded-control bg-brand-light border border-brand/30 p-3.5 text-left text-primary hover:bg-brand-light transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary text-white">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm sm:text-base font-bold text-foreground">
                          <HighlightedText text={searchResult.exactStore.label} query={query} />
                        </div>
                        <div className="truncate text-xs text-foreground-secondary mt-0.5">
                          {searchResult.exactStore.cityLabel} ·{' '}
                          {searchResult.exactStore.marketLabel} ({searchResult.exactStore.storeCode}
                          )
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-control bg-primary px-2 py-1 text-xs font-bold text-white">
                      {t('search_location_group_stores')}
                    </span>
                  </button>
                </div>
              )}

              {/* POI Candidates (Places) */}
              {searchResult.places.length > 0 && (
                <div className="space-y-1.5">
                  <p className="px-2 text-xs font-bold text-muted-foreground">
                    {t('search_location_group_places')}
                  </p>
                  <div className="divide-y divide-border">
                    {searchResult.places.map((poi) => {
                      const Icon = getPoiKindIcon(poi.kind);
                      const hasStores = poi.serviceLocationCount > 0;

                      return (
                        <button
                          key={poi.poiId}
                          type="button"
                          onClick={() => handleSelectPoi(poi)}
                          className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left hover:bg-brand-light/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-muted text-foreground-secondary group-hover:bg-muted group-hover:text-primary transition-colors">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                <HighlightedText text={poi.label} query={query} />
                              </div>
                              <div className="truncate text-xs text-muted-foreground mt-0.5">
                                {poi.cityLabel} · {poi.marketLabel}
                                {poi.nearestStoreName && (
                                  <span className="ml-2 text-foreground-secondary">
                                    (via {poi.nearestStoreName})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {hasStores && (
                            <span className="shrink-0 text-xs font-semibold text-foreground-secondary">
                              {poi.serviceLocationCount} {t('search_location_store_count')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Stores */}
              {searchResult.stores.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <p className="px-2 text-xs font-bold text-muted-foreground">
                    {t('search_location_group_stores')}
                  </p>
                  <div className="divide-y divide-border">
                    {searchResult.stores
                      .filter((s) => s.storeCode !== searchResult.exactStore?.storeCode)
                      .map((store) => (
                        <button
                          key={store.storeCode}
                          type="button"
                          onClick={() => handleSelectStore(store)}
                          className="flex w-full items-center justify-between gap-3 p-3 sm:p-4 text-left hover:bg-brand-light/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-muted text-foreground-secondary group-hover:bg-muted group-hover:text-primary transition-colors">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                <HighlightedText text={store.label} query={query} />
                              </div>
                              <div className="truncate text-xs text-muted-foreground mt-0.5">
                                {store.cityLabel} · {store.marketLabel} ({store.storeCode})
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-control bg-muted px-2 py-1 text-xs font-semibold text-foreground-secondary">
                            {t('search_location_group_stores')}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* No Matches Feedback State */}
              {!searchResult.hasMatches &&
                (() => {
                  const trimmed = query.trim();
                  const isValidQuery = trimmed.length >= 2 && trimmed.length <= 40;
                  const isRequested = requestedQueries.has(trimmed);

                  return (
                    <div className="py-12 px-4 text-center space-y-4">
                      <AlertCircle className="mx-auto h-10 w-10 text-warm-strong" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          {t('search_location_no_match')}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('search_location_no_match_hint')}
                        </p>
                      </div>

                      {isValidQuery && (
                        <div className="pt-3 border-t border-border max-w-sm mx-auto">
                          {isRequested ? (
                            <p className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-success">
                              <Check className="h-4 w-4" />
                              <span>
                                {t('search_location_request_received').replace('{query}', trimmed)}
                              </span>
                            </p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-foreground-secondary">
                                {t('search_location_request_title').replace('{query}', trimmed)}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRequestLocation(trimmed)}
                                className="rounded-control bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-bold text-white shadow-raised cursor-pointer transition-colors"
                              >
                                {t('search_location_request_btn')}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
          ) : (
            /* ======================================================== */
            /* VIEW 2: HIERARCHICAL BROWSE VIEW (Market -> City -> POI) */
            /* ======================================================== */
            <div className="flex h-full min-h-[460px]">
              {/* Left Column: Markets / Countries */}
              <div className="w-28 sm:w-40 lg:w-48 shrink-0 bg-muted border-r border-border overflow-y-auto">
                <div className="py-2">
                  {markets.map((market) => {
                    const isSelected = market.code === selectedMarketCode;
                    return (
                      <button
                        key={market.code}
                        type="button"
                        onClick={() => {
                          setSelectedMarketCode(market.code);
                          setSelectedCity(null);
                        }}
                        className={`relative flex w-full items-center gap-2 px-3 py-3.5 text-xs sm:text-sm transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-background font-bold text-primary border-l-4 border-brand'
                            : 'font-semibold text-foreground-secondary hover:bg-brand-light/40 hover:text-foreground'
                        }`}
                      >
                        <span className="text-base">{market.flag}</span>
                        <span className="truncate">{market.localizedNames[uiLanguage]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Cities OR City POIs Drilldown */}
              <div className="flex-1 min-w-0 overflow-y-auto p-3.5 sm:p-5">
                {selectedCity === null ? (
                  /* Sub-view 2A: City Grid under Active Market */
                  <div className="space-y-4">
                    {/* Recent POI if available */}
                    {recentPoi && (
                      <div className="rounded-control bg-muted p-3">
                        <div className="flex items-center justify-between pb-2 text-xs font-bold text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <History className="h-3 w-3 text-muted-foreground" />
                            <span>{t('search_location_recent')}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearRecentPoiId();
                              setSelectedCity(null);
                            }}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            title={t('search_location_clear_recent')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectPoi(recentPoi)}
                          className="flex w-full items-center justify-between rounded-control bg-background p-2.5 text-left hover:bg-brand-light/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {React.createElement(getPoiKindIcon(recentPoi.kind), {
                              className: 'h-4 w-4 text-primary shrink-0',
                            })}
                            <span className="truncate text-xs sm:text-sm font-bold text-foreground">
                              {recentPoi.label}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {recentPoi.cityLabel}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Market Header */}
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                        <span>{activeMarket.flag}</span>
                        <span>
                          {activeMarket.localizedNames[uiLanguage]} ·{' '}
                          {t('search_location_select_city')}
                        </span>
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        {cities.length}
                      </span>
                    </div>

                    {/* City Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {cities.map((city) => (
                        <button
                          key={city.code}
                          type="button"
                          onClick={() => setSelectedCity(city)}
                          className="flex items-center justify-between rounded-control p-3 sm:p-3.5 text-left font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer group"
                        >
                          <span className="truncate text-xs sm:text-sm">
                            {city.localizedNames[uiLanguage]}
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Sub-view 2B: POIs under Selected City */
                  (() => {
                    const cityPois = getCityAllPois(
                      activeMarket.code,
                      selectedCity.code,
                      uiLanguage
                    );

                    return (
                      <div className="space-y-4">
                        {/* City Navigation Header with Back Button */}
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <button
                            type="button"
                            onClick={() => setSelectedCity(null)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer group"
                          >
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span>{t('search_location_back')}</span>
                          </button>
                          <div className="text-right">
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              {selectedCity.localizedNames[uiLanguage]}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                              ({activeMarket.localizedNames[uiLanguage]})
                            </span>
                          </div>
                        </div>

                        {/* POIs List */}
                        <div className="divide-y divide-border">
                          {cityPois.map((poi) => {
                            const Icon = getPoiKindIcon(poi.kind);
                            const hasStores = poi.serviceLocationCount > 0;

                            return (
                              <button
                                key={poi.poiId}
                                type="button"
                                onClick={() => handleSelectPoi(poi)}
                                className="flex w-full items-center justify-between gap-3 p-3 text-left hover:bg-brand-light/50 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-muted text-foreground-secondary group-hover:bg-muted group-hover:text-primary transition-colors">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="truncate text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                      {poi.label}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground mt-0.5">
                                      {t(`poi_kind_${poi.kind}`)}
                                      {poi.nearestStoreName && (
                                        <span className="ml-2 text-foreground-secondary">
                                          · {poi.nearestStoreName}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {hasStores && (
                                  <span className="shrink-0 text-xs font-semibold text-foreground-secondary">
                                    {poi.serviceLocationCount} {t('search_location_store_count')}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
