export interface SpecialEquipmentSelection {
  infantSeat: number; // 0-1 years old
  childSeat: number; // 1-4 years old
  boosterSeat: number; // 4-7 years old
  gpsNavigation: boolean;
  snowChains: boolean;
}

export interface EquipmentCatalogItem {
  id: keyof SpecialEquipmentSelection;
  name: string;
  description: string;
  dailyRate: number;
  maxQuantity: number;
  maxChargeDays?: number; // max 10 days cap
}

export const EQUIPMENT_CATALOG: EquipmentCatalogItem[] = [
  {
    id: 'infantSeat',
    name: 'Infant Safety Seat (0–13 kg / 0–1 yr)',
    description: 'Rear-facing safety seat engineered for newborns and infants up to 12 months.',
    dailyRate: 10,
    maxQuantity: 2,
    maxChargeDays: 10,
  },
  {
    id: 'childSeat',
    name: 'Toddler Safety Seat (9–18 kg / 1–4 yr)',
    description:
      'Forward-facing harness car seat compliant with international ECE R44/04 standards.',
    dailyRate: 10,
    maxQuantity: 2,
    maxChargeDays: 10,
  },
  {
    id: 'boosterSeat',
    name: 'Child Booster Cushion (15–36 kg / 4–7 yr)',
    description: 'High-back or backless booster elevating child for proper adult seatbelt fit.',
    dailyRate: 8,
    maxQuantity: 3,
    maxChargeDays: 10,
  },
  {
    id: 'gpsNavigation',
    name: 'Portable GPS Satellite Navigator',
    description: 'Preloaded offline destination maps with real-time speed camera warnings.',
    dailyRate: 9,
    maxQuantity: 1,
    maxChargeDays: 10,
  },
  {
    id: 'snowChains',
    name: 'Winter Snow Chains Set',
    description:
      'High-traction steel tyre chains required for alpine roads and snowy mountain passes.',
    dailyRate: 15,
    maxQuantity: 1,
    maxChargeDays: 7,
  },
];

export function getDefaultEquipmentSelection(): SpecialEquipmentSelection {
  return {
    infantSeat: 0,
    childSeat: 0,
    boosterSeat: 0,
    gpsNavigation: false,
    snowChains: false,
  };
}

export interface EquipmentChargeLine {
  id: keyof SpecialEquipmentSelection;
  quantity: number;
  chargeDays: number;
  dailyRate: number;
  amount: number;
}

/** The itemized summary and checkout total share quantity validation and charge caps. */
export function getEquipmentChargeLines(
  selection: SpecialEquipmentSelection,
  rentalDays: number
): EquipmentChargeLine[] {
  if (!Number.isInteger(rentalDays) || rentalDays < 1) throw new Error('invalid_search');
  const lines: EquipmentChargeLine[] = [];

  for (const item of EQUIPMENT_CATALOG) {
    const chargeDays = Math.min(rentalDays, item.maxChargeDays ?? rentalDays);
    const val = selection[item.id];
    if (
      typeof val !== typeof getDefaultEquipmentSelection()[item.id] ||
      (typeof val === 'number' && (!Number.isInteger(val) || val < 0 || val > item.maxQuantity))
    ) {
      throw new Error('invalid_equipment');
    }
    const quantity = typeof val === 'boolean' ? Number(val) : val;
    if (quantity > 0) {
      lines.push({
        id: item.id,
        quantity,
        chargeDays,
        dailyRate: item.dailyRate,
        amount: quantity * item.dailyRate * chargeDays,
      });
    }
  }
  return lines;
}

export function calculateEquipmentCost(
  selection: SpecialEquipmentSelection,
  rentalDays: number
): number {
  return getEquipmentChargeLines(selection, rentalDays).reduce(
    (total, line) => total + line.amount,
    0
  );
}
