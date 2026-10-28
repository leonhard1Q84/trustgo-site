import { RouteLanguage } from '@/i18n/locales';

export interface CountryOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

export const COUNTRIES_LIST: CountryOption[] = [
  {
    code: 'CN',
    name: 'China (Mainland)',
    nativeName: '中国大陆',
    flag: '🇨🇳',
    popular: true,
  },
  {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    popular: true,
  },
  {
    code: 'HK',
    name: 'Hong Kong SAR',
    nativeName: '中國香港',
    flag: '🇭🇰',
    popular: true,
  },
  { code: 'TW', name: 'Taiwan', nativeName: '台灣', flag: '🇹🇼', popular: true },
  { code: 'JP', name: 'Japan', nativeName: '日本', flag: '🇯🇵', popular: true },
  {
    code: 'KR',
    name: 'South Korea',
    nativeName: '대한민국',
    flag: '🇰🇷',
    popular: true,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    popular: true,
  },
  {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    popular: true,
  },
  {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    popular: true,
  },
  {
    code: 'SG',
    name: 'Singapore',
    nativeName: 'Singapore',
    flag: '🇸🇬',
    popular: true,
  },
  {
    code: 'ES',
    name: 'Spain',
    nativeName: 'España',
    flag: '🇪🇸',
    popular: true,
  },
  {
    code: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    popular: true,
  },
  {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    popular: true,
  },
  {
    code: 'IT',
    name: 'Italy',
    nativeName: 'Italia',
    flag: '🇮🇹',
    popular: true,
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    nativeName: 'New Zealand',
    flag: '🇳🇿',
    popular: true,
  },
  { code: 'MY', name: 'Malaysia', nativeName: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', nativeName: 'ประเทศไทย', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', nativeName: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', nativeName: 'Indonesia', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', nativeName: 'Việt Nam', flag: '🇻🇳' },
  { code: 'IN', name: 'India', nativeName: 'India', flag: '🇮🇳' },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات',
    flag: '🇦🇪',
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    flag: '🇸🇦',
  },
  { code: 'NL', name: 'Netherlands', nativeName: 'Nederland', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', nativeName: 'Schweiz', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', nativeName: 'Österreich', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', nativeName: 'Belgique', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', nativeName: 'Sverige', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', nativeName: 'Norge', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', nativeName: 'Danmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', nativeName: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', nativeName: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', nativeName: 'Ελλάδα', flag: '🇬🇷' },
  { code: 'MX', name: 'Mexico', nativeName: 'México', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', nativeName: 'Brasil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', nativeName: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', nativeName: 'Chile', flag: '🇨🇱' },
  { code: 'ZA', name: 'South Africa', nativeName: 'South Africa', flag: '🇿🇦' },
];

export const POPULAR_COUNTRIES = COUNTRIES_LIST.filter((c) => c.popular);

export function getDefaultLicenseCountry(lang: RouteLanguage): string {
  switch (lang) {
    case 'zh':
      return 'CN';
    case 'ja':
      return 'JP';
    case 'ko':
      return 'KR';
    case 'es':
      return 'ES';
    case 'en':
    default:
      return 'US';
  }
}

export function getCountryByCode(code: string | null | undefined): CountryOption {
  if (!code) return COUNTRIES_LIST[1]; // US default
  const found = COUNTRIES_LIST.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return (
    found || {
      code: code.toUpperCase(),
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      flag: '🌐',
    }
  );
}

export function getDocumentRequirementNotice(
  countryCode: string,
  destinationText: string,
  lang: RouteLanguage
): { isWarning: boolean; text: string } | null {
  const dest = destinationText.toLowerCase();
  const c = countryCode.toUpperCase();

  // Special restriction: Japan
  if (
    dest.includes('japan') ||
    dest.includes('tokyo') ||
    dest.includes('hnd') ||
    dest.includes('nrt') ||
    dest.includes('kix') ||
    dest.includes('osaka')
  ) {
    if (c === 'CN') {
      return {
        isWarning: true,
        text:
          lang === 'zh'
            ? '⚠️ 提示：日本法規嚴格遵守《1949年日內瓦公約》，中國大陸駕照（含翻譯件）無法直接提車，須持有日內瓦1949 IDP。'
            : '⚠️ Notice: Japanese law strictly requires a 1949 Geneva Convention IDP. Mainland China driving licenses cannot be accepted directly.',
      };
    }
  }

  // Australia / New Zealand translation requirement
  if (
    dest.includes('australia') ||
    dest.includes('sydney') ||
    dest.includes('melbourne') ||
    dest.includes('syd') ||
    dest.includes('mel') ||
    dest.includes('new zealand') ||
    dest.includes('auckland')
  ) {
    if (c === 'CN' || c === 'TW') {
      return {
        isWarning: false,
        text:
          lang === 'zh'
            ? 'ℹ️ 准駕說明：中國駕照在此目的地需配合 NAATI 認證翻譯件或國際公證件一同出示。'
            : 'ℹ️ Document requirement: Non-English driving licenses require a certified NAATI translation or legal notary translation.',
      };
    }
  }

  return null;
}
