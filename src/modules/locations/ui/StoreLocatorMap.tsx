'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteLanguage } from '@/i18n/locales';
import { routeToLanguage } from '@/i18n/locales';
import type { LocationCard } from '../domain/types';
import { storeTypeBadgeCopy, buildStoreBookingUrl } from '../domain/store-formatters';

export interface StoreLocatorMapProps {
  stores: LocationCard[];
  selectedStoreCode: string | null;
  onSelectStore: (storeCode: string) => void;
  lang: RouteLanguage;
  className?: string;
}

const DEFAULT_VIEW = {
  center: [25.0, 10.0] as [number, number],
  zoom: 2,
};

const mapCopy = {
  EN: { reserve: 'Book Now', details: 'View Details', hours: 'Hours' },
  ZH: { reserve: '立即預訂', details: '查看詳情', hours: '營業時間' },
  JA: { reserve: '予約する', details: '店舗詳細', hours: '営業時間' },
  ES: { reserve: 'Reservar', details: 'Ver detalles', hours: 'Horario' },
  KO: { reserve: '지금 예약', details: '상세 정보', hours: '영업시간' },
};

export function StoreLocatorMap({
  stores,
  selectedStoreCode,
  onSelectStore,
  lang,
  className = '',
}: StoreLocatorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const language = routeToLanguage(lang);
  const copy = mapCopy[language] || mapCopy.EN;
  const isInternalClickRef = useRef<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const validPoints: [number, number][] = [];

    stores.forEach((store) => {
      const { latitude, longitude } = store.coordinates;
      validPoints.push([latitude, longitude]);

      const isSelected = store.code === selectedStoreCode;
      const isAirport = store.storeType === 'airport';
      const storeName = store[language]?.name || store.EN.name;
      const storeAddress = store[language]?.address || store.EN.address;
      const detailHref = `/${lang}/locations/${store.slug}`;
      const rentHref = buildStoreBookingUrl(lang, store.code, storeName);

      // Marker uses design tokens: brand sky blue, primary when selected
      const pinBg = isSelected ? 'var(--color-primary)' : 'var(--color-brand)';
      const iconHtml = `
        <div style="position: relative; cursor: pointer; transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: transform 0.2s ease;">
          ${
            isSelected
              ? '<span style="position: absolute; inset: -6px; border-radius: 9999px; background: rgba(37, 165, 227, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>'
              : ''
          }
          <div style="display: flex; height: 34px; width: 34px; align-items: center; justify-content: center; border-radius: 9999px; background: ${pinBg}; box-shadow: 0 4px 12px rgba(34, 34, 34, 0.2); border: 2px solid #ffffff; color: #ffffff;">
            ${
              isAirport
                ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>'
                : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
            }
          </div>
          <div style="position: absolute; bottom: -3px; left: 13px; height: 8px; width: 8px; transform: rotate(45deg); background: ${pinBg}; border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'trustgo-store-pin',
        html: iconHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      const badges = storeTypeBadgeCopy[language] || storeTypeBadgeCopy.EN;
      const typeBadge = isAirport ? badges.airport : badges.downtown;

      const popupHtml = `
        <div style="font-family: inherit; min-width: 230px; max-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size: 12px; font-weight: 700; background: var(--color-muted); color: var(--color-foreground); padding: 3px 8px; border-radius: 4px;">
              ${typeBadge}
            </span>
            ${
              store.selfService
                ? `<span style="font-size: 12px; font-weight: 700; background: var(--color-success-light); color: var(--color-success); padding: 3px 8px; border-radius: 4px;">${badges.selfService}</span>`
                : ''
            }
          </div>
          <div style="font-size: 14px; font-weight: 700; color: var(--color-foreground); margin-bottom: 4px; line-height: 1.35;">
            ${storeName}
          </div>
          <div style="font-size: 12px; color: var(--color-foreground-secondary); margin-bottom: 8px; line-height: 1.4;">
            ${storeAddress}
          </div>
          <div style="font-size: 12px; color: var(--color-muted-foreground); margin-bottom: 10px; font-weight: 600;">
            ⏰ ${store.hours}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 8px; border-top: 1px solid var(--color-border);">
            <a href="${detailHref}" style="display: inline-flex; align-items: center; justify-content: center; height: 32px; font-size: 12px; font-weight: 600; color: var(--color-foreground); background: var(--color-background); border: 1px solid var(--color-border-strong); border-radius: 8px; text-decoration: none;">
              ${copy.details}
            </a>
            <a href="${rentHref}" style="display: inline-flex; align-items: center; justify-content: center; height: 32px; font-size: 12px; font-weight: 700; color: var(--color-primary-foreground); background: var(--color-primary); border-radius: 8px; text-decoration: none;">
              ${copy.reserve}
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -8],
        maxWidth: 300,
      });

      marker.on('click', () => {
        isInternalClickRef.current = true;
        onSelectStore(store.code);
        setTimeout(() => {
          isInternalClickRef.current = false;
        }, 500);
      });

      markersRef.current.set(store.code, marker);
    });

    if (validPoints.length > 1) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, {
        padding: [48, 48],
        maxZoom: 12,
        animate: true,
      });
    } else if (validPoints.length === 1) {
      map.flyTo(validPoints[0], 11, { duration: 1 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- external system sync
  }, [stores, language, onSelectStore, lang, copy]);

  // Sync selectedStoreCode
  useEffect(() => {
    if (!selectedStoreCode) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const marker = markersRef.current.get(selectedStoreCode);
    if (marker) {
      marker.openPopup();
      if (!isInternalClickRef.current) {
        map.panTo(marker.getLatLng(), { animate: true });
      }
    }
  }, [selectedStoreCode]);

  return (
    <div
      ref={mapContainerRef}
      className={`h-full w-full min-h-[380px] bg-muted ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}

export default StoreLocatorMap;
