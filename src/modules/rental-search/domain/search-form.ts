import type { LocationSelection } from '@/modules/destination-search/types';

/**
 * Vehicle Availability Search form state, shared by the home search card,
 * the results-page search bar and every PC / H5 picker.
 */
export interface SearchLocation {
  label: string;
  poiId?: string;
  storeCode?: string;
}

export interface SearchFormState {
  pickup: SearchLocation;
  differentReturn: boolean;
  dropoff: SearchLocation;
  pickupDate: string; // YYYY-MM-DD, pick-up depot local date
  pickupTime: string; // HH:mm
  returnDate: string;
  returnTime: string;
  driverAge: number;
  licenseCountry: string; // ISO 3166-1 alpha-2
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Driver age bands: Young Driver Fee applies below 25, Senior Driver Fee from 65. */
export const DRIVER_AGE_BANDS = [
  { value: 21, label: '21–24' },
  { value: 30, label: '25–64' },
  { value: 65, label: '65+' },
] as const;

export const DEFAULT_DRIVER_AGE = 30;
export const DEFAULT_PICKUP_TIME = '10:00';
export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  return `${h}:${i % 2 ? '30' : '00'}`;
});

export function getDriverAgeBand(age: number) {
  if (age < 25) return DRIVER_AGE_BANDS[0];
  if (age >= 65) return DRIVER_AGE_BANDS[2];
  return DRIVER_AGE_BANDS[1];
}

export function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(value: string, days: number): string {
  const date = parseDateInput(value);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

export function getRentalDays(pickupDate: string, returnDate: string, pickupTime = '10:00', returnTime = '10:00'): number {
  if (!pickupDate || !returnDate) return 1;
  const start = Date.parse(`${pickupDate}T${pickupTime}:00Z`);
  const end = Date.parse(`${returnDate}T${returnTime}:00Z`);
  return Number.isFinite(start) && Number.isFinite(end) ? Math.max(1, Math.ceil((end - start) / 86_400_000)) : 1;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function splitDateTime(value: string | undefined): [string | undefined, string | undefined] {
  if (!value) return [undefined, undefined];
  const [date, time] = value.split('T');
  return [/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined, /^\d{2}:\d{2}$/.test(time ?? '') ? time : undefined];
}

export function createDefaultSearchForm(licenseCountry: string, today = new Date()): SearchFormState {
  const pickupDate = addDays(toDateInput(today), 3);
  return {
    pickup: { label: '' },
    differentReturn: false,
    dropoff: { label: '' },
    pickupDate,
    pickupTime: DEFAULT_PICKUP_TIME,
    returnDate: addDays(pickupDate, 3),
    returnTime: DEFAULT_PICKUP_TIME,
    driverAge: DEFAULT_DRIVER_AGE,
    licenseCountry,
  };
}

export function parseSearchForm(params: SearchParamsRecord, fallback: SearchFormState): SearchFormState {
  const pickupLabel = first(params.pickup);
  const returnLabel = first(params.return);
  const [pickupDate, pickupTime] = splitDateTime(first(params.pickupDate));
  const [returnDate, returnTime] = splitDateTime(first(params.returnDate));
  const age = Number(first(params.driverAge));
  const returnPoiId = first(params.returnPoiId);
  const returnStoreCode = first(params.returnStoreCode);
  const differentReturn = Boolean(returnPoiId ? returnPoiId !== first(params.pickupPoiId)
    : returnStoreCode ? returnStoreCode !== first(params.pickupStoreCode)
      : returnLabel && pickupLabel && returnLabel !== pickupLabel);

  return {
    pickup: pickupLabel || first(params.pickupPoiId) || first(params.pickupStoreCode)
      ? { label: pickupLabel ?? '', poiId: first(params.pickupPoiId), storeCode: first(params.pickupStoreCode) }
      : fallback.pickup,
    differentReturn,
    dropoff: differentReturn
      ? { label: returnLabel ?? '', poiId: returnPoiId, storeCode: returnStoreCode }
      : fallback.dropoff,
    pickupDate: pickupDate ?? fallback.pickupDate,
    pickupTime: pickupTime ?? fallback.pickupTime,
    returnDate: returnDate ?? fallback.returnDate,
    returnTime: returnTime ?? fallback.returnTime,
    driverAge: Number.isFinite(age) && age > 0 ? age : fallback.driverAge,
    licenseCountry: (first(params.licenseCountry) ?? fallback.licenseCountry).toUpperCase(),
  };
}

export function buildSearchQuery(form: SearchFormState): string {
  const dropoff = form.differentReturn ? form.dropoff : form.pickup;
  const query: Record<string, string> = {
    pickup: form.pickup.label,
    return: dropoff.label || form.pickup.label,
    pickupDate: `${form.pickupDate}T${form.pickupTime}`,
    returnDate: `${form.returnDate}T${form.returnTime}`,
    driverAge: String(form.driverAge),
    licenseCountry: form.licenseCountry,
  };
  if (form.pickup.poiId) query.pickupPoiId = form.pickup.poiId;
  if (form.pickup.storeCode) query.pickupStoreCode = form.pickup.storeCode;
  if (form.differentReturn) {
    if (form.dropoff.poiId) query.returnPoiId = form.dropoff.poiId;
    if (form.dropoff.storeCode) query.returnStoreCode = form.dropoff.storeCode;
  }
  return new URLSearchParams(query).toString();
}

export function selectionToLocation(selection: LocationSelection, displayName: string): SearchLocation {
  return selection.selectionType === 'POI'
    ? { label: displayName, poiId: selection.poiId, storeCode: selection.associatedStoreCode }
    : { label: displayName, storeCode: selection.storeCode };
}

export function hasLocation(location: SearchLocation): boolean {
  return Boolean(location.label && (location.poiId || location.storeCode));
}
