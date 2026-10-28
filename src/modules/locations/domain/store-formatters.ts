import type { Language, RouteLanguage } from '@/i18n/locales';
import { } from '@/i18n/locales';

export const storeTypeBadgeCopy: Record<Language, { airport: string; downtown: string; selfService: string }> = {
  EN: { airport: 'Airport Hub · Shuttle', downtown: 'Downtown Depot', selfService: '24/7 Smart Keybox' },
  ZH: { airport: '機場樞紐 · 免費接駁', downtown: '市中心直營店', selfService: '24/7 自助取還' },
  JA: { airport: '空港ハブ・無料送迎', downtown: '市内営業所', selfService: '24時間スマート受取' },
  ES: { airport: 'Oficina Aeropuerto · Traslado', downtown: 'Oficina Centro', selfService: 'Smart Keybox 24/7' },
  KO: { airport: '공항 거점 · 무료 셔틀', downtown: '도심 지점', selfService: '24시간 스마트 키박스' },
};

export function formatStoreHours(hoursStr: string) {
  if (!hoursStr) return '08:00 - 20:00';
  return hoursStr;
}

export function buildStoreBookingUrl(
  lang: RouteLanguage,
  storeCode: string,
  storeName: string
): string {
  const params = new URLSearchParams();
  params.set('pickup', storeName);
  params.set('pickupCode', storeCode);
  params.set('return', storeName);
  params.set('returnCode', storeCode);
  params.set('differentDropoff', 'false');
  return `/${lang}/rent?${params.toString()}`;
}
