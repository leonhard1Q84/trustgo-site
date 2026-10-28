import { type Language } from '@/i18n/locales';

function resolveLanguage(lang?: string): Language {
  if (!lang) return 'EN';
  const lower = lang.toLowerCase();
  if (lower === 'zh') return 'ZH';
  if (lower === 'ja') return 'JA';
  if (lower === 'es') return 'ES';
  if (lower === 'ko') return 'KO';
  if (lower === 'en') return 'EN';
  if (lang === 'ZH' || lang === 'JA' || lang === 'ES' || lang === 'KO' || lang === 'EN') {
    return lang as Language;
  }
  return 'EN';
}

type LocalizedText = Record<Language, string>;

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function localizeFromMap(
  value: string | undefined,
  lang: string | undefined,
  map: Record<string, LocalizedText>
): string {
  if (!value) return '';
  const uiLang = resolveLanguage(lang);
  const normalized = normalizeText(value);
  return map[normalized]?.[uiLang] ?? map[normalized]?.EN ?? value;
}

const orSimilarMap: LocalizedText = {
  EN: 'or similar',
  ZH: '或同級車型',
  JA: 'または同等クラス',
  ES: 'o similar',
  KO: '또는 동급 차량',
};

const categoryMap: Record<string, LocalizedText> = {
  [normalizeText('Intermediate SUV')]: {
    EN: 'Intermediate SUV',
    ZH: '中型 SUV',
    JA: 'ミドルサイズSUV',
    ES: 'SUV intermedio',
    KO: '중형 SUV',
  },
  [normalizeText('Compact Hatchback')]: {
    EN: 'Compact Hatchback',
    ZH: '緊湊型掀背車',
    JA: 'コンパクトハッチバック',
    ES: 'Compacto 5 puertas',
    KO: '컴팩트 해치백',
  },
  [normalizeText('People Mover / Van')]: {
    EN: 'People Mover / Van',
    ZH: '7-8座休旅商務車',
    JA: 'ミニバン / ワゴン',
    ES: 'Monovolumen / Furgoneta',
    KO: '승합차 / 밴',
  },
  [normalizeText('Economy Hatchback')]: {
    EN: 'Economy Hatchback',
    ZH: '經濟型掀背車',
    JA: 'エコノミーハッチバック',
    ES: 'Económico 5 puertas',
    KO: '이코노미 해치백',
  },
  [normalizeText('Full-size Sedan')]: {
    EN: 'Full-size Sedan',
    ZH: '中大型轎車',
    JA: 'フルサイズセダン',
    ES: 'Sedán grande',
    KO: '대형 세단',
  },
  [normalizeText('Compact Sedan')]: {
    EN: 'Compact Sedan',
    ZH: '緊湊型轎車',
    JA: 'コンパクトセダン',
    ES: 'Sedán compacto',
    KO: '컴팩트 세단',
  },
  [normalizeText('SUV')]: {
    EN: 'SUV',
    ZH: 'SUV 休旅車',
    JA: 'SUV',
    ES: 'SUV',
    KO: 'SUV',
  },
};

const transmissionMap: Record<string, LocalizedText> = {
  [normalizeText('Automatic')]: {
    EN: 'Automatic',
    ZH: '自動擋',
    JA: 'AT',
    ES: 'Automático',
    KO: '자동',
  },
  [normalizeText('Manual')]: {
    EN: 'Manual',
    ZH: '手動擋',
    JA: 'MT',
    ES: 'Manual',
    KO: '수동',
  },
};

const fuelMap: Record<string, LocalizedText> = {
  [normalizeText('Petrol')]: {
    EN: 'Petrol',
    ZH: '汽油',
    JA: 'ガソリン',
    ES: 'Gasolina',
    KO: '가솔린',
  },
  [normalizeText('Hybrid')]: {
    EN: 'Hybrid',
    ZH: '油電混動',
    JA: 'ハイブリッド',
    ES: 'Híbrido',
    KO: '하이브리드',
  },
  [normalizeText('Petrol / Hybrid')]: {
    EN: 'Petrol / Hybrid',
    ZH: '汽油 / 油電混動',
    JA: 'ガソリン / HV',
    ES: 'Gasolina / Híbrido',
    KO: '가솔린 / 하이브리드',
  },
  [normalizeText('Diesel')]: {
    EN: 'Diesel',
    ZH: '柴油',
    JA: 'ディーゼル',
    ES: 'Diésel',
    KO: '디젤',
  },
  [normalizeText('Diesel / Petrol')]: {
    EN: 'Diesel / Petrol',
    ZH: '柴油 / 汽油',
    JA: 'ディーゼル / ガソリン',
    ES: 'Diésel / Gasolina',
    KO: '디젤 / 가솔린',
  },
  [normalizeText('Electric')]: {
    EN: 'Electric',
    ZH: '純電動',
    JA: '電気自動車 (EV)',
    ES: 'Eléctrico',
    KO: '전기차 (EV)',
  },
  [normalizeText('EV')]: {
    EN: 'EV',
    ZH: '純電動',
    JA: 'EV',
    ES: 'Eléctrico',
    KO: '전기차 (EV)',
  },
};

const counterTypeMap: Record<string, LocalizedText> = {
  [normalizeText('Walk to Depot')]: {
    EN: 'Walk to the depot',
    ZH: '步行前往門店',
    JA: '店舗まで徒歩',
    ES: 'A pie hasta el establecimiento',
    KO: '지점까지 도보 이동',
  },
  [normalizeText('In-Terminal Counter')]: {
    EN: 'In-Terminal Counter',
    ZH: '航站樓內櫃檯',
    JA: 'ターミナル内カウンター',
    ES: 'Mostrador en terminal',
    KO: '터미널 내 카운터',
  },
  [normalizeText('Free Shuttle Bus')]: {
    EN: 'Free Shuttle Bus',
    ZH: '免費穿梭巴士',
    JA: '無料シャトルバス',
    ES: 'Autobús de enlace gratuito',
    KO: '무료 셔틀버스',
  },
  [normalizeText('Meet & Greet')]: {
    EN: 'Meet & Greet',
    ZH: '專人接機服務',
    JA: 'ミート＆グリート',
    ES: 'Servicio de bienvenida',
    KO: '도착 로비 픽업 안내',
  },
};

const badgeMap: Record<string, LocalizedText> = {
  [normalizeText('Most Popular')]: {
    EN: 'Most Popular',
    ZH: '熱門首選',
    JA: '一番人気',
    ES: 'Más popular',
    KO: '인기 추천',
  },
  [normalizeText('Best Value')]: {
    EN: 'Best Value',
    ZH: '高性價比',
    JA: 'コスパ最高',
    ES: 'Mejor precio/calidad',
    KO: '가성비 최고',
  },
  [normalizeText('Family Pick')]: {
    EN: 'Family Pick',
    ZH: '家庭首選',
    JA: 'ファミリー向け',
    ES: 'Ideal para familias',
    KO: '패밀리 추천',
  },
  [normalizeText('Family Choice')]: {
    EN: 'Family Choice',
    ZH: '家庭首選',
    JA: 'ファミリー向け',
    ES: 'Ideal para familias',
    KO: '패밀리 추천',
  },
};

export function localizeVehicleName(
  name: string | undefined,
  lang?: string
): string {
  if (!name) return '';
  const uiLang = resolveLanguage(lang);
  if (uiLang === 'EN') return name;

  const orSimilarRegex = /\s*(?:or similar|\(or similar\))\s*$/i;
  if (orSimilarRegex.test(name)) {
    const baseName = name.replace(orSimilarRegex, '').trim();
    const localizedOrSimilar = orSimilarMap[uiLang] ?? 'or similar';
    return `${baseName} ${localizedOrSimilar}`;
  }
  return name;
}

/** Splits "Toyota RAV4 AWD or similar" into the model and the localized "or similar" suffix (if any). */
export function splitVehicleName(
  name: string | undefined,
  lang?: string
): { model: string; orSimilar?: string } {
  if (!name) return { model: '' };
  const orSimilarRegex = /\s*(?:or similar|\(or similar\))\s*$/i;
  if (!orSimilarRegex.test(name)) return { model: name };
  const uiLang = resolveLanguage(lang);
  return { model: name.replace(orSimilarRegex, '').trim(), orSimilar: orSimilarMap[uiLang] ?? 'or similar' };
}

export function localizeVehicleCategory(
  category: string | undefined,
  lang?: string
): string {
  return localizeFromMap(category, lang, categoryMap);
}

export function localizeTransmission(
  gear: string | undefined,
  lang?: string
): string {
  return localizeFromMap(gear, lang, transmissionMap);
}

export function localizeFuelType(
  fuel: string | undefined,
  lang?: string
): string {
  return localizeFromMap(fuel, lang, fuelMap);
}

export function localizeCounterType(
  counterType: string | undefined,
  lang?: string
): string {
  return localizeFromMap(counterType, lang, counterTypeMap);
}

export function localizeFleetBadge(
  badge: string | undefined,
  lang?: string
): string {
  return localizeFromMap(badge, lang, badgeMap);
}
