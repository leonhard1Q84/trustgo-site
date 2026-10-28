import type {RouteLanguage} from '@/i18n/locales';

export interface CountryItem {
  code: string;
  dialCode: string;
  names: Record<RouteLanguage, string>;
}

export const COUNTRIES: CountryItem[] = [
  {
    code: 'JP',
    dialCode: '+81',
    names: {
      en: 'Japan',
      zh: '日本',
      ja: '日本',
      es: 'Japón',
      ko: '일본',
    },
  },
  {
    code: 'TW',
    dialCode: '+886',
    names: {
      en: 'Taiwan',
      zh: '台灣',
      ja: '台湾',
      es: 'Taiwán',
      ko: '대만',
    },
  },
  {
    code: 'CN',
    dialCode: '+86',
    names: {
      en: 'China',
      zh: '中國大陸',
      ja: '中国',
      es: 'China',
      ko: '중국',
    },
  },
  {
    code: 'HK',
    dialCode: '+852',
    names: {
      en: 'Hong Kong',
      zh: '香港',
      ja: '香港',
      es: 'Hong Kong',
      ko: '홍콩',
    },
  },
  {
    code: 'KR',
    dialCode: '+82',
    names: {
      en: 'South Korea',
      zh: '韓國',
      ja: '韓国',
      es: 'Corea del Sur',
      ko: '한국',
    },
  },
  {
    code: 'US',
    dialCode: '+1',
    names: {
      en: 'United States',
      zh: '美國',
      ja: 'アメリカ合衆国',
      es: 'Estados Unidos',
      ko: '미국',
    },
  },
  {
    code: 'CA',
    dialCode: '+1',
    names: {
      en: 'Canada',
      zh: '加拿大',
      ja: 'カナダ',
      es: 'Canadá',
      ko: '캐나다',
    },
  },
  {
    code: 'SG',
    dialCode: '+65',
    names: {
      en: 'Singapore',
      zh: '新加坡',
      ja: 'シンガポール',
      es: 'Singapur',
      ko: '싱가포르',
    },
  },
  {
    code: 'MY',
    dialCode: '+60',
    names: {
      en: 'Malaysia',
      zh: '馬來西亞',
      ja: 'マレーシア',
      es: 'Malasia',
      ko: '말레이시아',
    },
  },
  {
    code: 'TH',
    dialCode: '+66',
    names: {
      en: 'Thailand',
      zh: '泰國',
      ja: 'タイ',
      es: 'Tailandia',
      ko: '태국',
    },
  },
  {
    code: 'AU',
    dialCode: '+61',
    names: {
      en: 'Australia',
      zh: '澳大利亞',
      ja: 'オーストラリア',
      es: 'Australia',
      ko: '호주',
    },
  },
  {
    code: 'NZ',
    dialCode: '+64',
    names: {
      en: 'New Zealand',
      zh: '紐西蘭',
      ja: 'ニュージーランド',
      es: 'Nueva Zelanda',
      ko: '뉴질랜드',
    },
  },
  {
    code: 'GB',
    dialCode: '+44',
    names: {
      en: 'United Kingdom',
      zh: '英國',
      ja: 'イギリス',
      es: 'Reino Unido',
      ko: '영국',
    },
  },
  {
    code: 'DE',
    dialCode: '+49',
    names: {
      en: 'Germany',
      zh: '德國',
      ja: 'ドイツ',
      es: 'Alemania',
      ko: '독일',
    },
  },
  {
    code: 'FR',
    dialCode: '+33',
    names: {
      en: 'France',
      zh: '法國',
      ja: 'フランス',
      es: 'Francia',
      ko: '프랑스',
    },
  },
  {
    code: 'IT',
    dialCode: '+39',
    names: {
      en: 'Italy',
      zh: '義大利',
      ja: 'イタリア',
      es: 'Italia',
      ko: '이탈리아',
    },
  },
  {
    code: 'ES',
    dialCode: '+34',
    names: {
      en: 'Spain',
      zh: '西班牙',
      ja: 'スペイン',
      es: 'España',
      ko: '스페인',
    },
  },
  {
    code: 'AE',
    dialCode: '+971',
    names: {
      en: 'United Arab Emirates',
      zh: '阿拉伯聯合大公國',
      ja: 'アラブ首長国連邦',
      es: 'Emiratos Árabes Unidos',
      ko: '아랍에미리트',
    },
  },
  {
    code: 'PH',
    dialCode: '+63',
    names: {
      en: 'Philippines',
      zh: '菲律賓',
      ja: 'フィリピン',
      es: 'Filipinas',
      ko: '필리핀',
    },
  },
  {
    code: 'VN',
    dialCode: '+84',
    names: {
      en: 'Vietnam',
      zh: '越南',
      ja: 'ベトナム',
      es: 'Vietnam',
      ko: '베트남',
    },
  },
  {
    code: 'ID',
    dialCode: '+62',
    names: {
      en: 'Indonesia',
      zh: '印尼',
      ja: 'インドネシア',
      es: 'Indonesia',
      ko: '인도네시아',
    },
  },
  {
    code: 'OTHER',
    dialCode: '+0',
    names: {
      en: 'Other / International',
      zh: '其他 / 國際',
      ja: 'その他 / 国際',
      es: 'Otro / Internacional',
      ko: '기타 / 국제',
    },
  },
];

const countryMap = new Map<string, CountryItem>();
COUNTRIES.forEach((c) => {
  countryMap.set(c.code.toUpperCase(), c);
});

/**
 * Returns localized country label, e.g. "日本 (Japan, JP)" or "台灣 (TW)"
 */
export function getCountryDisplayName(code: string | undefined, lang: RouteLanguage): string {
  if (!code) return '';
  const item = countryMap.get(code.trim().toUpperCase());
  if (!item) return code;
  const localizedName = item.names[lang] || item.names.en;
  return item.code === 'OTHER' ? localizedName : `${localizedName} (${item.code})`;
}

/**
 * Returns localized phone code label, e.g. "+81 日本"
 */
export function getPhoneCodeDisplayName(dialCode: string | undefined, lang: RouteLanguage): string {
  if (!dialCode) return '';
  const trimmed = dialCode.trim();
  const matched = COUNTRIES.find((c) => c.dialCode === trimmed);
  if (!matched || matched.code === 'OTHER') return trimmed;
  const localizedName = matched.names[lang] || matched.names.en;
  return `${trimmed} ${localizedName}`;
}

/**
 * Formats a phone number with its country dial code.
 * Intelligently infers country code if missing based on standard mobile number patterns.
 */
export function formatPhoneWithCountryCode(phoneNumber?: string, dialCode?: string): string {
  if (!phoneNumber) return '';
  const cleanNumber = phoneNumber.trim();
  if (!cleanNumber) return '';

  if (cleanNumber.startsWith('+')) {
    return cleanNumber;
  }

  if (dialCode && dialCode.trim()) {
    const code = dialCode.trim().startsWith('+') ? dialCode.trim() : `+${dialCode.trim()}`;
    return `${code} ${cleanNumber}`;
  }

  // Chinese 11-digit mobile starting with 13-19
  if (/^1[3-9]\d{9}$/.test(cleanNumber)) {
    return `+86 ${cleanNumber}`;
  }

  // Japanese mobile starting with 070/080/090 (11 digits) or 70/80/90 (10 digits)
  if (/^0?[789]0\d{8}$/.test(cleanNumber)) {
    return `+81 ${cleanNumber.replace(/^0/, '')}`;
  }

  // Taiwanese mobile starting with 09 (10 digits) or 9 (9 digits)
  if (/^0?9\d{8}$/.test(cleanNumber)) {
    return `+886 ${cleanNumber.replace(/^0/, '')}`;
  }

  return `+81 ${cleanNumber}`;
}

/**
 * Infers the best default dial code from phone number if dialCode is missing
 */
export function inferDialCode(phoneNumber?: string, dialCode?: string): string {
  if (dialCode && dialCode.trim()) {
    return dialCode.trim().startsWith('+') ? dialCode.trim() : `+${dialCode.trim()}`;
  }
  if (!phoneNumber) return '+81';
  const clean = phoneNumber.trim();
  if (clean.startsWith('+')) {
    const matched = PHONE_DIAL_OPTIONS.find((opt) => clean.startsWith(opt.dialCode));
    if (matched) return matched.dialCode;
  }
  if (/^1[3-9]\d{9}$/.test(clean)) return '+86';
  if (/^0?9\d{8}$/.test(clean)) return '+886';
  if (/^0?[789]0\d{8}$/.test(clean)) return '+81';
  return '+81';
}

export const PHONE_DIAL_OPTIONS: Array<{dialCode: string; code: string; label: Record<RouteLanguage, string>}> = [
  {dialCode: '+81', code: 'JP', label: {en: '+81 Japan', zh: '+81 日本', ja: '+81 日本', es: '+81 Japón', ko: '+81 일본'}},
  {dialCode: '+886', code: 'TW', label: {en: '+886 Taiwan', zh: '+886 台灣', ja: '+886 台湾', es: '+886 Taiwán', ko: '+886 대만'}},
  {dialCode: '+86', code: 'CN', label: {en: '+86 China', zh: '+86 中國大陸', ja: '+86 中国', es: '+86 China', ko: '+86 중국'}},
  {dialCode: '+852', code: 'HK', label: {en: '+852 Hong Kong', zh: '+852 香港', ja: '+852 香港', es: '+852 Hong Kong', ko: '+852 홍콩'}},
  {dialCode: '+1', code: 'US/CA', label: {en: '+1 United States / Canada', zh: '+1 美國 / 加拿大', ja: '+1 アメリカ / カナダ', es: '+1 Estados Unidos / Canadá', ko: '+1 미국 / 캐나다'}},
  {dialCode: '+82', code: 'KR', label: {en: '+82 South Korea', zh: '+82 韓國', ja: '+82 韓国', es: '+82 Corea del Sur', ko: '+82 한국'}},
  {dialCode: '+65', code: 'SG', label: {en: '+65 Singapore', zh: '+65 新加坡', ja: '+65 シンガポール', es: '+65 Singapur', ko: '+65 싱가포르'}},
  {dialCode: '+60', code: 'MY', label: {en: '+60 Malaysia', zh: '+60 馬來西亞', ja: '+60 マレーシア', es: '+60 Malasia', ko: '+60 말레이시아'}},
  {dialCode: '+66', code: 'TH', label: {en: '+66 Thailand', zh: '+66 泰國', ja: '+66 タイ', es: '+66 Tailandia', ko: '+66 태국'}},
  {dialCode: '+44', code: 'GB', label: {en: '+44 United Kingdom', zh: '+44 英國', ja: '+44 イギリス', es: '+44 Reino Unido', ko: '+44 영국'}},
  {dialCode: '+61', code: 'AU', label: {en: '+61 Australia', zh: '+61 澳大利亞', ja: '+61 オーストラリア', es: '+61 Australia', ko: '+61 호주'}},
  {dialCode: '+64', code: 'NZ', label: {en: '+64 New Zealand', zh: '+64 紐西蘭', ja: '+64 ニュージーランド', es: '+64 Nueva Zelanda', ko: '+64 뉴질랜드'}},
  {dialCode: '+49', code: 'DE', label: {en: '+49 Germany', zh: '+49 德國', ja: '+49 ドイツ', es: '+49 Alemania', ko: '+49 독일'}},
  {dialCode: '+33', code: 'FR', label: {en: '+33 France', zh: '+33 法國', ja: '+33 フランス', es: '+33 Francia', ko: '+33 프랑스'}},
  {dialCode: '+39', code: 'IT', label: {en: '+39 Italy', zh: '+39 義大利', ja: '+39 イタリア', es: '+39 Italia', ko: '+39 이탈리아'}},
  {dialCode: '+34', code: 'ES', label: {en: '+34 Spain', zh: '+34 西班牙', ja: '+34 スペイン', es: '+34 España', ko: '+34 스페인'}},
  {dialCode: '+971', code: 'AE', label: {en: '+971 United Arab Emirates', zh: '+971 阿拉伯聯合大公國', ja: '+971 アラブ首長国連邦', es: '+971 Emiratos Árabes Unidos', ko: '+971 아랍에미리트'}},
  {dialCode: '+63', code: 'PH', label: {en: '+63 Philippines', zh: '+63 菲律賓', ja: '+63 フィリピン', es: '+63 Filipinas', ko: '+63 필리핀'}},
  {dialCode: '+84', code: 'VN', label: {en: '+84 Vietnam', zh: '+84 越南', ja: '+84 ベトナム', es: '+84 Vietnam', ko: '+84 베트남'}},
  {dialCode: '+62', code: 'ID', label: {en: '+62 Indonesia', zh: '+62 印尼', ja: '+62 インドネシア', es: '+62 Indonesia', ko: '+62 인도네시아'}},
];
