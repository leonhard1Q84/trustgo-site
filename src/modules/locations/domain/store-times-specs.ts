import type { Language } from '@/i18n/locales';
import type { LocationCard, StoreTimesSpec } from './types';

const defaultPayments: Record<Language, string> = {
  EN: 'Visa, MasterCard, American Express, JCB, UnionPay, Apple Pay / Google Pay. Credit card in primary driver name required for vehicle security pre-authorization deposit.',
  ZH: '接受 Visa、MasterCard、American Express、JCB、銀聯卡、Apple Pay / Google Pay。取車時須出示主駕駛人名下之實體信用卡進行押金預授權。',
  JA: 'Visa、MasterCard、American Express、JCB、銀聯、Apple Pay / Google Pay 対応。お引き取りの際、車両保証デポジットのため主運転者名義のクレジットカードのご提示が必要です。',
  ES: 'Visa, MasterCard, American Express, JCB, UnionPay, Apple Pay / Google Pay. Se requiere tarjeta de crédito a nombre del conductor principal para el depósito de fianza.',
  KO: 'Visa, MasterCard, American Express, JCB, UnionPay, Apple Pay / Google Pay 지원. 차량 보증금 사전 승인을 위해 주 운전자 명의의 신용카드가 필수입니다.',
};

const defaultLanguages: Record<Language, string> = {
  EN: 'English, Chinese (Mandarin/Cantonese), Japanese, Spanish, Korean concierge support via phone and online chat.',
  ZH: '英文、中文（國語/粵語）、日語、西班牙語、韓語多語言專屬熱線與線上客服。',
  JA: '英語、中国語、日本語、スペイン語、韓国語による多言語コンシェルジュ・オンラインチャットサポート。',
  ES: 'Atención al cliente en inglés, chino, japonés, español y coreano vía telefónica y chat online 24/7.',
  KO: '영어, 중국어, 일본어, 스페인어, 한국어 전용 전화 및 온라인 채팅 다국어 고객지원.',
};

const pickupPrecautionsByMarket: Record<string, Record<Language, string>> = {
  US: {
    EN: 'Present valid home country driver license, passport, and credit card. Free terminal shuttle runs every 10-15 minutes outside Baggage Claim.',
    ZH: '取車時出示原籍國有效駕照正本、國際駕照（IDP 或英文認證件）、護照與信用卡。機場抵達航站行李提取區外每 10-15 分鐘有專屬接駁車。',
    JA: '本国有効運転免許証、国際運転免許証（IDP）、パスポート、クレジットカードをご提示ください。荷物受取エリア外から10〜15分間隔で無料シャトルが運行。',
    ES: 'Presente permiso de conducir original en vigor, pasaporte y tarjeta de crédito. Lanzadera gratuita cada 10-15 minutos fuera de la zona de recogida de equipajes.',
    KO: '유효한 본국 운전면허증, 국제운전면허증(IDP), 여권 및 신용카드를 제시해 주세요. 수하물 수취 구역 외부에서 10~15분 간격으로 무료 셔틀 운행.',
  },
  JP: {
    EN: 'Primary driver must present passport, 1949 Geneva Convention IDP (or official Japanese translation for Taiwan/Switzerland/Germany/France licenses), and credit card.',
    ZH: '駕駛人必須出示護照原件、符合 1949 日內瓦公約之國際駕照（IDP）原件（或台灣/瑞士/德國/法國駕照及官方日文翻譯本）與信用卡。',
    JA: 'パスポート原本、1949年ジュネーブ条約加盟国の国際免許証原本（または台湾・スイス・ドイツ等の運転免許証原本＋公式日本語翻訳文）、クレジットカードをご提示ください。',
    ES: 'El conductor debe presentar pasaporte, permiso internacional de conducir IDP (Convenio de Ginebra de 1949) o traducción oficial al japonés, y tarjeta de crédito.',
    KO: '여권 원본, 1949 제네바 협약 가입국 국제운전면허증(IDP) 원본(또는 대만/스위스/독일 등 공식 일본어 번역본) 및 신용카드를 제시해야 합니다.',
  },
  TW: {
    EN: 'Present valid driver license, International Driving Permit (IDP) or mutual recognition permit, passport, and credit card.',
    ZH: '駕駛人須出示本國駕照正本、國際駕照（IDP）或互惠協議證明、護照與信用卡。機場與高鐵站提供專屬接駁或出站指引。',
    JA: '運転免許証原本、国際免許証（IDP）または相互承認証明書、パスポート、クレジットカードをご提示ください。',
    ES: 'Presente permiso de conducir original, permiso internacional (IDP) o acuerdo recíproco, pasaporte y tarjeta de crédito.',
    KO: '유효한 운전면허증 원본, 국제운전면허증(IDP) 또는 상호협정 서류, 여권 및 신용카드를 제시해 주세요.',
  },
  TH: {
    EN: 'Present original passport, 1949 Geneva Convention IDP, original home driving license, and credit card.',
    ZH: '出示護照原件、1949 日內瓦公約國際駕照（IDP）、原籍國駕照正本與信用卡。普吉島等度假海島門店提供機場接待。',
    JA: 'パスポート原本、1949年ジュネーブ条約国際免許証（IDP）、本国運転免許証原本、クレジットカードをご提示ください。',
    ES: 'Presente pasaporte original, permiso internacional IDP (Ginebra 1949), carnet original de conducir y tarjeta de crédito.',
    KO: '여권 원본, 1949 제네바 협약 국제운전면허증(IDP), 본국 운전면허증 및 신용카드를 제시해 주세요.',
  },
  MY: {
    EN: 'Present valid passport, 1949 Geneva Convention IDP or official English driving license, and credit card.',
    ZH: '出示護照原件、符合 1949 日內瓦公約之國際駕照（IDP）或英文駕照正本與信用卡。吉隆坡與蘭卡威提供便利接駁服務。',
    JA: 'パスポート原本、1949年ジュネーブ条約国際免許証（IDP）または英語表記免許証原本、クレジットカードをご提示ください。',
    ES: 'Presente pasaporte original, permiso internacional IDP (Ginebra 1949) o permiso de conducir en inglés, y tarjeta de crédito.',
    KO: '여권 원본, 1949 제네바 협약 국제운전면허증(IDP) 또는 영문 운전면허증 원본, 신용카드를 제시해 주세요.',
  },
  AU: {
    EN: 'Present original English driver license or official NAATI translation / 1949 IDP, passport, and credit card. Vehicle inspection completed digitally.',
    ZH: '出示英文駕照原件或官方 NAATI 翻譯件 / 國際駕照、護照與信用卡。取車交接支援全數位化車況檢驗與即刻出庫。',
    JA: '英語表記の運転免許証原本（または公式NAATI翻訳文／国際免許証）、パスポート、クレジットカードをご提示ください。デジタル車両点検対応。',
    ES: 'Presente licencia de conducir en inglés o traducción oficial NAATI / IDP, pasaporte y tarjeta de crédito. Inspección digital rápida al recoger.',
    KO: '영문 운전면허증 원본 또는 공인 NAATI 번역본 / 국제운전면허증, 여권 및 신용카드를 제시해 주세요. 모바일 디지털 차량 점검 지원.',
  },
  ES: {
    EN: 'Present valid EU driver license or official international driving permit (IDP 1949/1968), passport/EU ID, and credit card.',
    ZH: '出示歐盟駕照或國際駕照（IDP）、護照/身分證明文件及信用卡。門店提供高速公路通行資訊與清晰交接指南。',
    JA: 'EU加盟国運転免許証または国際免許証（IDP 1949/1968）、パスポート、クレジットカードをご提示ください。',
    ES: 'Presente permiso de conducir de la UE en vigor o permiso internacional (IDP 1949/1968), pasaporte o DNI, y tarjeta de crédito.',
    KO: '유효한 EU 운전면허증 또는 국제운전면허증(IDP 1949/1968), 여권 및 신용카드를 제시해 주세요.',
  },
  KR: {
    EN: 'Present valid 1949 or 1968 Convention International Driving Permit (IDP), home country license, passport, and credit card.',
    ZH: '出示符合 1949 或 1968 日內瓦/維也納公約之國際駕照（IDP）原件、本國駕照、護照與信用卡。',
    JA: '1949年または1968年条約国際運転免許証（IDP）、自国免許証、パスポート、クレジットカードをご提示ください。',
    ES: 'Presente permiso internacional de conducción (Convenio 1949 o 1968), carnet original de conducir, pasaporte y tarjeta de crédito.',
    KO: '1949 또는 1968 협약 국제운전면허증(IDP) 원본, 국내 유효 운전면허증, 여권 및 본인 명의 신용카드를 제시해 주세요.',
  },
};

const returnPrecautions: Record<Language, string> = {
  EN: 'Return the vehicle to the designated TrustGo return bay with like-for-like fuel level. 29-minute grace period applies. After-hours drop box available for contactless key deposit.',
  ZH: '請按約定油量（滿油或等量）將車輛停妥於 TrustGo 專用還車道。享有標準 29 分鐘還車寬限期；非營業時段提供安全投匙箱進行無接觸還車。',
  JA: '指定のTrustGo返却レーンに同等の燃料レベルでご返却ください。29分間の返却猶予期間（Grace Period）適用。営業時間外は専用キーボックスをご利用いただけます。',
  ES: 'Devuelva el vehículo en el carril designado de TrustGo con el mismo nivel de combustible. Período de gracia de 29 minutos. Buzón seguro para llaves disponible fuera de horario.',
  KO: '지정된 TrustGo 반납 구역에 대여 시와 동일한 주유량으로 반납해 주세요. 29분 무료 유예 기간이 적용되며, 영업 외 시간 스마트 키 반납함을 이용할 수 있습니다.',
};

export function getStoreTimesSpec(location: LocationCard, language: Language): StoreTimesSpec {
  const market = location.marketCode;
  const marketPickup = pickupPrecautionsByMarket[market] || pickupPrecautionsByMarket.US;

  return {
    postalCode: location.postalCode,
    mapCode: location.mapCode,
    pickupPrecautions: marketPickup[language] ?? marketPickup.EN,
    returnPrecautions: returnPrecautions[language] ?? returnPrecautions.EN,
    paymentMethods: defaultPayments[language] ?? defaultPayments.EN,
    supportedLanguages: defaultLanguages[language] ?? defaultLanguages.EN,
  };
}
