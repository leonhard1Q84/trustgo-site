import type { CategoryOption, OfferFeature, SeatOption, TransmissionOption } from '../domain/result-filters';

export const FILTER_LABEL_KEYS: Record<CategoryOption | TransmissionOption | SeatOption | OfferFeature, string> = {
  economy: 'rs_type_economy',
  suv: 'rent_filter_suv',
  mpv: 'rs_type_mpv',
  premium: 'rs_type_premium',
  Automatic: 'rs_filter_automatic',
  Manual: 'rs_filter_manual',
  up_to_5: 'rs_filter_seats_5',
  six_to_seven: 'rs_filter_seats_6_7',
  eight_plus: 'rs_filter_seats_8',
  free_cancellation: 'rs_filter_free_cancellation',
  deposit_free: 'rs_filter_deposit_free',
  unlimited_mileage: 'rs_filter_unlimited_mileage',
  full_to_full: 'rs_filter_full_to_full',
  self_service: 'rs_filter_self_service',
  open_24h: 'rs_filter_open_24h',
  free_additional_driver: 'rs_filter_free_additional_driver',
  free_gps: 'rs_filter_free_gps',
  winter_tyres: 'rs_filter_winter_tyres',
};
