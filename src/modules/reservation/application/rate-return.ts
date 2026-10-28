import type { RouteLanguage } from '@/i18n/locales';
import { buildSearchQuery, type SearchFormState } from '@/modules/rental-search/domain/search-form';
import type { InsurancePackageId } from '@/modules/rate-details/domain/types';
import type { SpecialEquipmentSelection } from '@/modules/rate-details/domain/equipment';
import { normalizeLicenseCountry } from '../domain/validation';

/** Requery the selected depot product; never carry an old rateDetailsId forward. */
export function buildRateReturnHref(input: {
  lang: RouteLanguage;
  vehicleId: string;
  offerId: string;
  search: SearchFormState;
  licenseCountry: string;
  insuranceId: InsurancePackageId;
  equipment: SpecialEquipmentSelection;
}): string {
  const params = new URLSearchParams(buildSearchQuery({
    ...input.search,
    licenseCountry: normalizeLicenseCountry(input.licenseCountry),
  }));
  params.set('offer', input.offerId);
  params.set('insurance', input.insuranceId);
  params.set('equipment', JSON.stringify(input.equipment));
  return `/${input.lang}/rent/${encodeURIComponent(input.vehicleId)}?${params}`;
}
