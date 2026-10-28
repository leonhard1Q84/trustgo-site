'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import type { LocationCard } from '@/modules/locations/domain/types';
import { getStoreByCode } from '@/modules/destination-search/store-directory';
import { routeToLanguage, type RouteLanguage } from '@/i18n/locales';
function resolveSafeExternalUrl(u: string, _opts: any) { return u; }

interface CityStoreMapProps {
  stores: LocationCard[];
  selectedStoreCode: string | null;
  onSelectStore?: (storeCode: string) => void;
  lang: RouteLanguage;
  className?: string;
}

function getMapEmbedUrl(location: LocationCard, language: 'EN' | 'ZH' | 'JA' | 'ES' | 'KO') {
  const snapshot = getStoreByCode(location.code);
  const query = snapshot?.point
    ? `${snapshot.point.latitude},${snapshot.point.longitude}`
    : `${location[language]?.name ?? location.EN.name} ${location[language]?.address ?? location.EN.address}`;
  const url = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  return resolveSafeExternalUrl(url, { allowedHosts: ['google.com'], allowSubdomains: true });
}

function getMapSearchUrl(location: LocationCard, language: 'EN' | 'ZH' | 'JA' | 'ES' | 'KO') {
  const snapshot = getStoreByCode(location.code);
  const query = snapshot?.point
    ? `${snapshot.point.latitude},${snapshot.point.longitude}`
    : `${location[language]?.name ?? location.EN.name} ${location[language]?.address ?? location.EN.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function CityStoreMap({
  stores,
  selectedStoreCode,
  lang,
  className = '',
}: CityStoreMapProps) {
  const language = routeToLanguage(lang);

  // Active store: resolve by selected code, or fallback to first
  const activeStore = stores.find((s) => s.code === selectedStoreCode) ?? stores[0];
  if (!activeStore) return null;

  const mapEmbedUrl = getMapEmbedUrl(activeStore, language);
  const mapSearchUrl = getMapSearchUrl(activeStore, language);
  const activeName = activeStore[language]?.name ?? activeStore.EN.name;
  const activeAddress = activeStore[language]?.address ?? activeStore.EN.address;

  return (
    <div className={`relative flex flex-col h-full w-full bg-slate-100 overflow-hidden ${className}`}>
      {/* Main Map Embed (Unobstructed full view with native Google Maps pin & interactions) */}
      <div className="relative flex-1 w-full h-full min-h-[360px] bg-slate-100">
        {mapEmbedUrl ? (
          <iframe
            key={activeStore.code}
            src={mapEmbedUrl}
            title={activeName}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-500">
            <MapPin className="h-8 w-8 text-[#E60012] mb-2" />
            <p className="text-sm font-semibold text-slate-800">{activeName}</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">{activeAddress}</p>
          </div>
        )}
      </div>

      {/* Bottom Store Info Status Strip linking directly to Google Maps */}
      <a
        href={mapSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={activeName}
        className="hidden sm:flex items-center justify-between px-3.5 py-2.5 bg-white border-t border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="h-3.5 w-3.5 text-[#E60012] shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-slate-900 truncate group-hover:text-[#E60012] transition-colors">{activeName}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 truncate">{activeAddress}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium shrink-0 ml-3">
          {activeStore.hours}
        </div>
      </a>
    </div>
  );
}
