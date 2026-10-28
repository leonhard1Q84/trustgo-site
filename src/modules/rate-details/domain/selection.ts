import type { InsurancePackageId } from './types';
import { getDefaultEquipmentSelection } from './equipment';
import { validateEquipment } from '@/modules/reservation/domain/validation';

/** URL choices are optional hints; malformed hints never alter the server contract. */
export function readRateSelection(params: Record<string, string | string[] | undefined>) {
  const insuranceId: InsurancePackageId = typeof params.insurance === 'string' && ['basic', 'inclusive', 'zero-excess'].includes(params.insurance)
    ? params.insurance as InsurancePackageId : 'basic';
  let equipment = getDefaultEquipmentSelection();
  if (typeof params.equipment === 'string') {
    try { equipment = validateEquipment(JSON.parse(params.equipment)); } catch { /* discard invalid URL selections */ }
  }
  return { insuranceId, equipment };
}
