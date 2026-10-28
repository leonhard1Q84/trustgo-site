import {
  locationCards,
  citiesList,
  marketsList,
} from '@/modules/locations/domain/locations-data';
import type { LocationCard } from '@/modules/locations/domain/types';
import {
  getStoreByCode,
  storeDirectory,
} from '@/modules/destination-search/store-directory';
import {
  htmlLangMap,
  routeLanguages,
  routeToLanguage,
  type Language,
  type RouteLanguage,
} from '@/i18n/locales';

export type LocationCountry = 'japan' | 'taiwan' | 'thailand' | 'malaysia';
export type LocationCity =
  | 'tokyo'
  | 'narita'
  | 'osaka'
  | 'kyoto'
  | 'fukuoka'
  | 'nagoya'
  | 'okinawa'
  | 'sapporo'
  | 'taoyuan'
  | 'kaohsiung'
  | 'phuket'
  | 'langkawi'
  | 'kuala-lumpur'
  | 'other';

export function getLocationCountry(location: LocationCard): LocationCountry {
  if (location.marketCode === 'TW') return 'taiwan';
  if (location.marketCode === 'TH') return 'thailand';
  if (location.marketCode === 'MY') return 'malaysia';
  return 'japan';
}

export function getLocationCity(location: LocationCard): LocationCity {
  return location.cityCode as LocationCity;
}

export function isLocationIndexable(location: LocationCard): boolean {
  return location.indexStatus === 'indexable';
}


export type LocalizedText = Record<Language, string>;

export type LandingTip = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: 'driving' | 'parking' | 'rules' | 'toll' | 'transit';
  sourceId?: string;
  reviewedAt: string;
};

export type VerifiedCityReview = {
  reviewId: string;
  pickupCityId: string;
  pickupStoreCode: string;
  rating: number; // 1 - 5
  publishedAt: string; // ISO YYYY-MM
  vehicleGroup: LocalizedText;
  originalLocale: string;
  originalText: string;
  localizedText: LocalizedText;
};

export type CityReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

export type MarketLandingConfig = {
  marketId: string;
  marketSlug: string;
  marketCode: 'JP' | 'TW' | 'TH' | 'MY';
  countryKey: LocationCountry;
  localizedNames: LocalizedText;
  seoTitles: LocalizedText;
  seoDescriptions: LocalizedText;
  h1: LocalizedText;
  intro: LocalizedText;
  popularCitySlugs: string[];
  tips: LandingTip[];
  valueProps: Array<{
    title: LocalizedText;
    description: LocalizedText;
  }>;
};

export type CityLandingConfig = {
  cityId: string;
  citySlug: string;
  marketSlug: string;
  cityKey: LocationCity;
  localizedNames: LocalizedText;
  seoTitles: LocalizedText;
  seoDescriptions: LocalizedText;
  h1: LocalizedText;
  intro: LocalizedText;
  tips: LandingTip[];
  reviewSummary: CityReviewSummary;
  reviews: VerifiedCityReview[];
  relatedCitySlugs: string[];
};

export const marketHeroImages: Record<string, string> = {
  japan: '/images/destinations/japan-roadtrip.jpg',
  taiwan: '/images/destinations/taiwan-roadtrip.jpg',
  thailand: '/images/destinations/thailand-roadtrip.jpg',
  malaysia: '/images/destinations/malaysia-roadtrip.jpg',
};

export const cityLandmarkImages: Record<string, string> = {
  tokyo: '/images/cities/tokyo-landmark.jpg',
  osaka: '/images/cities/osaka-landmark.jpg',
  fukuoka: '/images/cities/fukuoka-landmark.jpg',
  okinawa: '/images/cities/okinawa-landmark.jpg',
  sapporo: '/images/cities/sapporo-landmark.jpg',
  kyoto: '/images/cities/kyoto-landmark.jpg',
  kaohsiung: '/images/cities/kaohsiung-landmark.jpg',
  taoyuan: '/images/cities/taoyuan-landmark.jpg',
  phuket: '/images/cities/phuket-landmark.jpg',
  langkawi: '/images/cities/langkawi-landmark.jpg',
};

// ----------------------------------------------------------------------
// 1. Service Markets Data
// ----------------------------------------------------------------------

export const marketLandingConfigs: MarketLandingConfig[] = [
  {
    marketId: 'japan',
    marketSlug: 'japan',
    marketCode: 'JP',
    countryKey: 'japan',
    localizedNames: {
      EN: 'Japan',
      ZH: '日本',
      JA: '日本',
      ES: 'Japón',
      KO: '일본',
    },
    seoTitles: {
      EN: 'Car Rental in Japan | Compare Airport & Station Branches | TrustGo',
      ZH: '日本租車服務 | 機場與主要車站門店查詢與預訂 | TrustGo',
      JA: '日本レンタカー予約 | 空港・主要駅店舗と料金確認 | TrustGo',
      ES: 'Alquiler de coches en Japón | Oficinas en aeropuertos y estaciones | TrustGo',
      KO: '일본 렌터카 예약 | 주요 공항 및 역 지점 안내 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Japan with TrustGo. Transparent rates, verified airport shuttle or direct station pickup, multi-language support and one-way options.',
      ZH: 'TrustGo 日本租車：清晰收費口徑、成田/羽田/關西/福岡/那霸等核心機場與車站網點覆蓋，支持多語言服務與部分跨店異地還車。',
      JA: 'TrustGoの日本レンタカー。成田・羽田・関西・福岡・那覇空港や主要駅からの受け取りに対応。明瞭な料金体系と多言語サポートを提供します。',
      ES: 'Alquiler de coches en Japón con TrustGo. Tarifas transparentes, recogida en aeropuertos y estaciones principales, y asistencia multilingüe.',
      KO: 'TrustGo 일본 렌터카. 나리타, 하네다, 간사이, 후쿠오카, 오키나와 등 주요 공항 및 역 거점에서 투명한 요금과 다국어 지원으로 예약하세요.',
    },
    h1: {
      EN: 'Car rental in Japan',
      ZH: '在日本租車',
      JA: '日本のレンタカー',
      ES: 'Alquiler de coches en Japón',
      KO: '일본 렌터카',
    },
    intro: {
      EN: 'Discover Japan with complete road freedom. From Hokkaido expressways to Okinawa coastal highways, TrustGo offers well-maintained fleets with English, Chinese and Japanese booking support.',
      ZH: '透過 TrustGo 探索日本自駕之旅。覆蓋東京首都圈、關西、九州、沖繩與北海道等核心自駕目的地，提供全流程多語言支持與透明安心的取還車保障。',
      JA: 'TrustGoで安心の日本ドライブ旅へ。北海道のパノラマロードから沖縄の海岸線まで、整備済み車両と明確な利用ガイドでスムーズな旅をサポートします。',
      ES: 'Explora Japón a tu propio ritmo con TrustGo. Conectamos los principales aeropuertos y estaciones con vehículos fiables y soporte en varios idiomas.',
      KO: 'TrustGo과 함께 일본 전역을 자유롭게 여행하세요. 주요 공항 및 역 거점에서 체계적인 차량 정비와 다국어 안내로 쾌적한 드라이브를 제공합니다.',
    },
    popularCitySlugs: ['tokyo', 'osaka', 'fukuoka', 'okinawa', 'sapporo', 'kyoto'],
    valueProps: [
      {
        title: {
          EN: 'Transparent Daily Rates',
          ZH: '透明清晰的日租收費',
          JA: '明確な日額基本料金',
          ES: 'Tarifas diarias transparentes',
          KO: '투명한 일일 대여 요금',
        },
        description: {
          EN: 'All standard mandatory fees and liability protections clearly presented before booking confirmation.',
          ZH: '所有法定基本保障與必要費用在確認預訂前完全明示，無隱藏離櫃加收。',
          JA: '基本補償や必須費用は予約確定前にすべて明示され、店頭での予期せぬ追加請求を防ぎます。',
          ES: 'Precios claros con coberturas obligatorias incluidas antes de confirmar tu reserva.',
          KO: '기본 보상 및 필수 비용이 예약 확정 전 투명하게 공개됩니다.',
        },
      },
      {
        title: {
          EN: 'Airport Shuttle & Direct Station Pickup',
          ZH: '機場免費接駁與車站直達',
          JA: '空港無料送迎・駅チカ受け取り',
          ES: 'Lanzadera de aeropuerto y puntos en estaciones',
          KO: '무료 공항 셔틀 및 역세권 지점',
        },
        description: {
          EN: 'Free dedicated shuttle buses at international terminals or direct pedestrian access at transit hubs.',
          ZH: '主要國際機場提供航廈專用免費接駁車，火車站門店步行即可直接到達服務前台。',
          JA: '主要空港では無料送迎バスを運行し、新幹線・主要駅では徒歩圏内のカウンターで出発できます。',
          ES: 'Servicio de autobús gratuito en aeropuertos y mostradores a pocos pasos de las estaciones.',
          KO: '국제공항 무료 전용 셔틀 운행 및 주요 역에서 도보로 편리하게 연결됩니다.',
        },
      },
      {
        title: {
          EN: 'ETC Card & Multilingual GPS',
          ZH: '支持 ETC 車載器與多語指引',
          JA: 'ETC車載器完備・多言語対応',
          ES: 'Dispositivo ETC y soporte en viaje',
          KO: 'ETC 단말기 및 다국어 지원',
        },
        description: {
          EN: 'Vehicles equipped with ETC units for smooth expressway cruising and multilingual customer assistance.',
          ZH: '車輛配備高速公路 ETC 車載設備，並提供即時在線多語客服支持。',
          JA: '高速道路をスムーズに通過できるETC車載器を標準搭載し、旅中の多言語チャットサポートも利用可能です。',
          ES: 'Vehículos equipados con dispositivo ETC para autopistas y asistencia durante el viaje.',
          KO: '고속도로를 편리하게 이용할 수 있는 ETC 단말기 장착 및 여행 중 다국어 지원을 제공합니다.',
        },
      },
    ],
    tips: [
      {
        id: 'jp-tip-driving-side',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Drive on the Left & Give Way',
          ZH: '靠左行駛與優先路權',
          JA: '左側通行と歩行者優先ルール',
          ES: 'Conducción por la izquierda y ceda el paso',
          KO: '좌측통행 및 보행자 우선',
        },
        description: {
          EN: 'Vehicles in Japan drive on the left side of the road. Turning across traffic (right turns) requires yielding to oncoming straight vehicles and crossing pedestrians.',
          ZH: '日本車輛靠左側行駛，右駕駕駛座。右轉時必須禮讓對向直行車輛及斑馬線行人先行。',
          JA: '日本は左側通行です。右折時は直進車や横断歩行者の通行を妨げないよう十分な減速・一時停止を行ってください。',
          ES: 'En Japón se conduce por la izquierda. Al girar a la derecha, cede siempre el paso a vehículos que vienen de frente y peatones.',
          KO: '일본은 좌측통행 국가입니다. 우회전 시 맞은편 직진 차량 및 횡단보도 보행자에게 반드시 양보해야 합니다.',
        },
      },
      {
        id: 'jp-tip-license-idp',
        category: 'rules',
        reviewedAt: '2026-09-01',
        title: {
          EN: '1949 Geneva Convention IDP or Official Translation Required',
          ZH: '必備 1949 日內瓦公約國際駕照或法定日文譯本',
          JA: 'ジュネーブ条約（1949年）IDPまたは公式日本語翻訳文の持参',
          ES: 'Permiso internacional (Ginebra 1949) o traducción oficial obligatoria',
          KO: '1949 제네바 협약 국제운전면허증 또는 공인 일본어 번역본 필수',
        },
        description: {
          EN: 'Renters must carry an original passport, home domestic driving license, and either an International Driving Permit under the 1949 Geneva Convention or a certified Japanese translation (for Taiwan, Switzerland, Germany, France, etc.).',
          ZH: '取車時必須出示護照原件、本國駕照原件，以及符合 1949 年日內瓦公約格式的國際駕照（IDP）；持有臺灣、瑞士、德國、法國等特定駕照者需出示官方指定之日文翻譯本原件。',
          JA: '受取時にはパスポート原本、自国免許証、および1949年ジュネーブ条約に基づく国際運転免許証（または台湾・独・仏等所定の公式日本語翻訳文原本）の提示が必要です。',
          ES: 'Para recoger el vehículo es imprescindible presentar pasaporte original, permiso de conducir nacional y permiso internacional conforme al Convenio de Ginebra de 1949 o traducción oficial certificada.',
          KO: '차량 수령 시 여권 원본, 자국 운전면허증 원본 및 1949년 제네바 협약 준수 국제운전면허증(또는 지정 국가 공인 일본어 번역본 원본)을 지참해야 합니다.',
        },
      },
      {
        id: 'jp-tip-parking',
        category: 'parking',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Strict Street Parking Regulations & Coin Parking',
          ZH: '嚴格的路邊禁停規定與投幣式停車場',
          JA: '路上駐車の禁止とコインパーキングの利用',
          ES: 'Prohibición estricta de estacionamiento en calle y parkings de pago',
          KO: '엄격한 불법주차 단속 및 유료 코인 주차장 이용',
        },
        description: {
          EN: 'Street parking is strictly prohibited in most urban areas. Always use designated coin-operated parking lots (Times, Mitsui Repark) and never park on sidewalks or yellow-marked curbs.',
          ZH: '市區道路嚴禁無故臨時停放車輛。請務必使用 Times、三井 Repark 等標識清晰的投幣停車場（Coin Parking），違規停放面臨高額警署罰鍰。',
          JA: '都市部では路上駐車が厳しく取り締まられます。必ずコインパーキング等の専用駐車場をご利用ください。',
          ES: 'Aparcar en la calle está muy regulado y castigado. Utiliza siempre aparcamientos de pago señalizados.',
          KO: '도시 지역의 노상 주차는 엄격히 금지됩니다. 반드시 인근 코인 주차장(Times, Repark 등)을 이용하시기 바랍니다.',
        },
      },
      {
        id: 'jp-tip-toll-etc',
        category: 'toll',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Expressway Tolls & ETC Card Lanes',
          ZH: '高速公路通行費與 ETC 專用道',
          JA: '高速道路料金とETC専用レーンの利用',
          ES: 'Peajes de autopista y carriles ETC',
          KO: '고속도로 통행료 및 ETC 전용 레인',
        },
        description: {
          EN: 'Expressways in Japan are tolled. Vehicles have ETC devices installed; if using an ETC card, enter lanes marked "ETC" below 20 km/h. If paying cash/credit card, enter green "一般" (General) lanes.',
          ZH: '日本高速公路多為計程收費。配備 ETC 卡時可慢速（20 km/h 以下）通過紫色「ETC 專用」車道；未持卡者請進入綠色「一般」車道領取通行券並於出口付費。',
          JA: 'ETCカードをご利用の際は紫色「ETC専用」レーンを時速20km以下で通過してください。非搭載の場合は緑色の「一般」レーンをご利用ください。',
          ES: 'Las autopistas japonesas son de peaje. Pasa a menos de 20 km/h por los carriles morados ETC con tarjeta, o por los carriles verdes (General) para pago manual.',
          KO: '일본 고속도로는 유료입니다. ETC 카드를 사용할 경우 20km/h 이하로 보라색 ETC 레인을 통과하고, 미사용 시 일반 레인에서 정산하세요.',
        },
      },
    ],
  },
  {
    marketId: 'taiwan',
    marketSlug: 'taiwan',
    marketCode: 'TW',
    countryKey: 'taiwan',
    localizedNames: {
      EN: 'Taiwan',
      ZH: '臺灣',
      JA: '台湾',
      ES: 'Taiwán',
      KO: '대만',
    },
    seoTitles: {
      EN: 'Car Rental in Taiwan | Kaohsiung & Taoyuan Airport Pickup | TrustGo',
      ZH: '臺灣租車自駕 | 高雄機場、火車站與桃園機場網點 | TrustGo',
      JA: '台湾レンタカー予約 | 高雄・桃園空港・高鉄駅店舗 | TrustGo',
      ES: 'Alquiler de coches en Taiwán | Oficinas en Kaohsiung y Taoyuan | TrustGo',
      KO: '대만 렌터카 예약 | 가오슝 공항, 타오위안 공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Taiwan with TrustGo. Pick up directly at Kaohsiung Airport, Kaohsiung Main Station or Taoyuan Airport. Transparent pricing and one-way options.',
      ZH: 'TrustGo 臺灣租車服務：直營覆蓋高雄國際機場、高雄火車站、左營高鐵站與桃園機場周邊，提供透明日租金、清晰異地還車與在地租車指引。',
      JA: 'TrustGoの台湾レンタカー。高雄国際空港、高雄駅、左営高鉄駅、桃園空港など主要ハブで利用可能。明瞭な料金と安心のサポートを提供。',
      ES: 'Alquiler de coches en Taiwán con TrustGo. Puntos de recogida en aeropuerto de Kaohsiung, estación central y aeropuerto de Taoyuan.',
      KO: 'TrustGo 대만 렌터카. 가오슝 공항, 가오슝역, 쭤잉 고속철도역, 타오위안 공항에서 투명한 요금으로 편리하게 대여하세요.',
    },
    h1: {
      EN: 'Car rental in Taiwan',
      ZH: '在臺灣租車',
      JA: '台湾のレンタカー',
      ES: 'Alquiler de coches en Taiwán',
      KO: '대만 렌터카',
    },
    intro: {
      EN: 'Explore Taiwan from scenic coastal highways in the south to western metropolis corridors. TrustGo connects major transportation gateways with quality vehicles and bilingual service.',
      ZH: '從墾丁壯麗的南國海岸線到西部高鐵走廊，透過 TrustGo 開啟自在的臺灣自駕之旅。我們在高雄與桃園設有便捷門店，提供優質車況與全程專業支持。',
      JA: '南部の雄大な海岸線から都市間をつなぐ高速道路まで、台湾のドライブ旅を快適に。TrustGoが高雄や桃園の主要ゲートウェイでサポートします。',
      ES: 'Recorre Taiwán desde las costas del sur hasta las vibrantes ciudades del oeste. TrustGo te ofrece vehículos fiables y puntos de recogida estratégicos.',
      KO: '대만 남부의 아름다운 해안도로부터 서부 고속철도 회랑까지, TrustGo과 함께 안전하고 편리한 대만 자駕 여행을 시작하세요.',
    },
    popularCitySlugs: ['kaohsiung', 'taoyuan'],
    valueProps: [
      {
        title: {
          EN: 'High-Speed Rail & Airport Connectivity',
          ZH: '高鐵火車站與機場無縫接駁',
          JA: '空港・高鉄駅直結の好アクセス',
          ES: 'Conexión con tren de alta velocidad y aeropuertos',
          KO: '공항 및 고속철도역 밀착 연결',
        },
        description: {
          EN: 'Convenient branches near Kaohsiung Airport (KHH), Kaohsiung Railway Station, and Zuoying HSR Station.',
          ZH: '緊鄰高雄國際機場、高雄火車站及左營高鐵站，出站快速取車啟程。',
          JA: '高雄空港、高雄駅、左営高鉄駅の至近に拠点を構え、新幹線や航空機からの乗り換えがスムーズです。',
          ES: 'Puntos estratégicos cerca del aeropuerto de Kaohsiung, la estación central y Zuoying HSR.',
          KO: '가오슝 공항, 가오슝 기차역, 쭤잉 고속철도역 인근에서 신속하게 픽업할 수 있습니다.',
        },
      },
      {
        title: {
          EN: 'Electronic eTag Toll Standard',
          ZH: '全車標配 eTag 電子收費',
          JA: 'eTag電子高速料金システム対応',
          ES: 'Peaje electrónico eTag integrado',
          KO: 'eTag 전자 통행료 결제 지원',
        },
        description: {
          EN: 'Expressway tolls in Taiwan are automatically recorded by electronic RFID gantry sensors. Settle cleanly upon return.',
          ZH: '高速公路全面實施感應門架電子收費，還車時按官方通行流水清晰精確結算，透明無多收。',
          JA: '台湾の高速道路はeTag自動課金に対応。返却時に実費分を正確に清算できます。',
          ES: 'Los peajes de autopista se registran automáticamente con el sistema eTag y se liquidan con claridad al devolver el coche.',
          KO: '대만 고속도로의 eTag 전자 통행료 시스템으로 편리하게 이동하고 반납 시 정확하게 정산합니다.',
        },
      },
      {
        title: {
          EN: 'Flexible City-to-City One-Way',
          ZH: '支持靈活跨門店異地還車',
          JA: '柔軟なワンウェイ（乗り捨て）対応',
          ES: 'Opciones de devolución en otra oficina',
          KO: '편도 대여(다른 지점 반납) 지원',
        },
        description: {
          EN: 'One-way rental supported between eligible station pairs across southern and northern hubs.',
          ZH: '在指定合格門店組合之間支持異地還車，方便順路環島或單向行程安排。',
          JA: '所定の拠点間で乗り捨て利用に対応しており、台湾周遊や片道移動に便利です。',
          ES: 'Permite devolver el vehículo en otra oficina autorizada para facilitar itinerarios de sentido único.',
          KO: '지정된 지점 간 편도 대여를 지원하여 대만 일주 및 일정 계획이 자유롭습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'tw-tip-driving-side',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Drive on the Right & Scooter Awareness',
          ZH: '靠右行駛與注意機車專用動線',
          JA: '右側通行とスクーター（原付）への注意',
          ES: 'Conducción por la derecha y atención a motocicletas',
          KO: '우측통행 및 오토바이 주의',
        },
        description: {
          EN: 'Vehicles in Taiwan drive on the right side. Urban streets have large volumes of motor scooters. Check rear-view mirrors and blind spots carefully before making right turns or changing lanes.',
          ZH: '臺灣為左駕靠右行駛。市區機車密度較高，車輛右轉或變換車道前務必提前打方向燈，並轉頭確認後照鏡盲區無直行機車。',
          JA: '台湾は右側通行です。街中はスクーターの交通量が非常に多いため、右折時や車線変更時は巻き込み事故に十分ご注意ください。',
          ES: 'En Taiwán se conduce por la derecha. Hay gran densidad de scooters en ciudades; revisa siempre espejos y ángulos muertos antes de girar.',
          KO: '대만은 우측통행입니다. 도심에 오토바이 통행량이 많으므로 우회전 및 차선 변경 시 사각지대를 철저히 확인하세요.',
        },
      },
      {
        id: 'tw-tip-etag',
        category: 'toll',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Distance-Based Highway Tolls via eTag',
          ZH: '國道計程收費與 eTag 結算',
          JA: '高速道路のeTag距離課金システム',
          ES: 'Peajes por distancia con sistema eTag',
          KO: '국도 거리비례 eTag 전자 통행료',
        },
        description: {
          EN: 'National Freeways 1 and 3 use electronic gantry tolling with no physical toll booths. The eTag sticker on the windshield automatically logs mileage. You simply pay the exact calculated toll when returning the car.',
          ZH: '臺灣國道1號、3號等高速公路全面採用無實體收費站之電子門架計程收費。租車自帶 eTag 晶片，行駛費用將於門店還車時依官方實際通行明細結清。',
          JA: '台湾の高速道路（国道1号・3号等）は料金所のないETCゲート方式です。全車eTag搭載のため、利用明細に基づき返却時に清算します。',
          ES: 'Las autopistas nacionales no tienen cabinas físicas de peaje; el eTag del parabrisas registra el recorrido para su posterior abono.',
          KO: '대만 국도(고속도로)는 톨게이트 없이 전자 게이트로 통행료를 부과하며, 반납 시 이용 내역대로 정산합니다.',
        },
      },
      {
        id: 'tw-tip-child-seat',
        category: 'rules',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Mandatory Child Safety Seats for Under 4 Years',
          ZH: '4 歲以下幼童強制使用安全座椅',
          JA: '4歳未満のチャイルドシート着用義務',
          ES: 'Silla infantil obligatoria para menores de 4 años',
          KO: '만 4세 이하 카시트 의무 착용',
        },
        description: {
          EN: 'Taiwan road traffic laws require children under 4 years old (or under 18 kg) to be secured in an approved rear-facing or front-facing child safety seat. TrustGo provides certified child seats as an optional extra.',
          ZH: '依據臺灣交通法規，年齡在 4 歲以下或體重在 18 公斤以下之幼童乘車時，必須安置於後座並使用幼童安全座椅。預訂時可加選經認證的兒童安全座椅。',
          JA: '台湾の道路交通法により、4歳未満（または体重18kg以下）の幼児はチャイルドシートの着用が義務付けられています。予約時にお申し込みいただけます。',
          ES: 'La normativa exige que los menores de 4 años (o menos de 18 kg) viajen con sistema de retención infantil homologado.',
          KO: '대만 교통법규에 따라 만 4세 이하(또는 18kg 이하) 유아는 카시트 착용이 필수입니다. 예약 시 옵션으로 신청할 수 있습니다.',
        },
      },
    ],
  },
  {
    marketId: 'thailand',
    marketSlug: 'thailand',
    marketCode: 'TH',
    countryKey: 'thailand',
    localizedNames: {
      EN: 'Thailand',
      ZH: '泰國',
      JA: 'タイ',
      ES: 'Tailandia',
      KO: '태국',
    },
    seoTitles: {
      EN: 'Car Rental in Thailand | Phuket Airport Pickup | TrustGo',
      ZH: '泰國租車自駕 | 普吉國際機場門店與自駕預訂 | TrustGo',
      JA: 'タイレンタカー予約 | プーケット国際空港店舗 | TrustGo',
      ES: 'Alquiler de coches en Tailandia | Aeropuerto de Phuket | TrustGo',
      KO: '태국 렌터카 예약 | 푸켓 국제공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Thailand with TrustGo. Convenient pickup at Phuket International Airport, reliable insurance, and clean air-conditioned vehicles.',
      ZH: 'TrustGo 泰國租車：緊鄰普吉國際機場，提供空調優質車況、透明保險選項與便捷的接送指引，開啟海島自在自駕之旅。',
      JA: 'プーケット国際空港での受け取りに対応したTrustGoのタイレンタカー。整備の行き届いた快適な車両と明確な補償でお迎えします。',
      ES: 'Alquiler de coches en Tailandia con TrustGo en el aeropuerto de Phuket. Vehículos limpios y con aire acondicionado.',
      KO: 'TrustGo 태국 렌터카. 푸켓 국제공항 인근 지점에서 쾌적한 에어컨 차량과 투명한 보험으로 편리하게 이용하세요.',
    },
    h1: {
      EN: 'Car rental in Thailand',
      ZH: '在泰國租車',
      JA: 'タイのレンタカー',
      ES: 'Alquiler de coches en Tailandia',
      KO: '태국 렌터카',
    },
    intro: {
      EN: 'Explore Thailand tropical islands and coastal gems. With well-marked highway routes and airport-proximate branches, renting with TrustGo makes island hopping effortless.',
      ZH: '探索泰國熱帶海島與美麗海岸。我們在普吉島設有專業服務站點，提供經過全面檢驗的可靠車輛與清晰的取還車指引。',
      JA: 'タイの南国リゾートや美しいビーチエリアをレンタカーで巡る。プーケット空港からすぐに出発できる信頼のサービスをご提供します。',
      ES: 'Descubre las costas y destinos de Tailandia a tu propio ritmo con vehículos revisados y servicio puntual.',
      KO: '푸켓의 아름다운 해변과 명소를 TrustGo 차량으로 편안하게 둘러보세요.',
    },
    popularCitySlugs: ['phuket'],
    valueProps: [
      {
        title: {
          EN: 'Phuket Airport Meet & Greet',
          ZH: '普吉機場專人接送與快速交車',
          JA: 'プーケット空港出迎え・迅速な引渡し',
          ES: 'Recepción en aeropuerto de Phuket',
          KO: '푸켓 공항 미팅 및 신속한 인수',
        },
        description: {
          EN: 'Direct arrival coordination outside terminal gates with short transfer to vehicle inspection bays.',
          ZH: '航廈出口專人指引，短途前往門店服務區快速完成驗車與鑰匙交付。',
          JA: 'ターミナル到着口での案内からスムーズな引き渡しまで、専任スタッフが対応します。',
          ES: 'Coordinación directa a tu llegada al aeropuerto para recoger el coche con rapidez.',
          KO: '공항 도착 즉시 안내를 받아 신속하게 차량을 인수할 수 있습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'th-tip-driving-left',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Left-Hand Traffic in Thailand',
          ZH: '靠左行駛與注意路況',
          JA: '左側通行と走行時の注意',
          ES: 'Conducción por la izquierda en Tailandia',
          KO: '태국 좌측통행 규정',
        },
        description: {
          EN: 'Traffic flows on the left in Thailand. Exercise defensive driving, especially on winding island coastal roads with motorbike traffic.',
          ZH: '泰國為右駕靠左行駛國家。島上山路蜿蜒且機車穿梭頻繁，請保持防禦性駕駛並保持安全車距。',
          JA: 'タイは左側通行です。山道やカーブの多い海沿い道路では、スピードを抑えて安全運転を心がけてください。',
          ES: 'En Tailandia se conduce por la izquierda. Conduce con prudencia en carreteras de costa y curvas.',
          KO: '태국은 좌측통행입니다. 해안 도로와 굽은 길에서 오토바이에 주의하며 안전 거리를 유지하세요.',
        },
      },
    ],
  },
  {
    marketId: 'malaysia',
    marketSlug: 'malaysia',
    marketCode: 'MY',
    countryKey: 'malaysia',
    localizedNames: {
      EN: 'Malaysia',
      ZH: '馬來西亞',
      JA: 'マレーシア',
      ES: 'Malasia',
      KO: '말레이시아',
    },
    seoTitles: {
      EN: 'Car Rental in Malaysia | Langkawi Airport & Jetty Pickup | TrustGo',
      ZH: '馬來西亞租車自駕 | 蘭卡威機場與客運碼頭網點 | TrustGo',
      JA: 'マレーシアレンタカー予約 | ランカウイ空港・桟橋店舗 | TrustGo',
      ES: 'Alquiler de coches en Malasia | Aeropuerto y muelle de Langkawi | TrustGo',
      KO: '말레이시아 렌터카 예약 | 랑카위 공항 및 제티 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Malaysia with TrustGo. Key pickup locations at Langkawi International Airport and Kuah Jetty with clear prices.',
      ZH: 'TrustGo 馬來西亞租車：覆蓋蘭卡威國際機場與瓜鎮客運碼頭，提供清晰收費、靈活海島自駕與優質車況。',
      JA: 'ランカウイ空港やクア桟橋から快適に出発。TrustGoのマレーシアレンタカーでリゾート自駕旅路をスムーズに。',
      ES: 'Alquiler de coches en Malasia con TrustGo en Langkawi (aeropuerto y muelle).',
      KO: 'TrustGo 말레이시아 렌터카. 랑카위 국제공항 및 제티에서 투명한 요금으로 대여하세요.',
    },
    h1: {
      EN: 'Car rental in Malaysia',
      ZH: '在馬來西亞租車',
      JA: 'マレーシアのレンタカー',
      ES: 'Alquiler de coches en Malasia',
      KO: '말레이시아 렌터카',
    },
    intro: {
      EN: 'Experience Malaysia diverse landscapes from duty-free duty islands to mainland highways. TrustGo provides modern, air-conditioned vehicles for your island or city expeditions.',
      ZH: '體驗馬來西亞的多樣風情。我們在免稅度假勝地蘭卡威設有机場與碼頭核心站點，為您的度假行程提供清爽舒適的空調用車。',
      JA: 'マレーシアの美しい島々をレンタカーで自由に散策。ランカウイ島で快適な移動手段を提供します。',
      ES: 'Descubre los paisajes y encantos de Malasia con coches fiables y asistencia cercana.',
      KO: '면세 휴양지 랑카위에서 TrustGo과 함께 편리한 렌터카 여행을 즐겨보세요.',
    },
    popularCitySlugs: ['langkawi'],
    valueProps: [
      {
        title: {
          EN: 'Airport & Ferry Terminal Coverage',
          ZH: '機場與輪渡碼頭雙站點覆蓋',
          JA: '空港＆フェリー桟橋のダブル対応',
          ES: 'Cobertura en aeropuerto y terminal marítima',
          KO: '공항 및 페리 터미널 동시 지원',
        },
        description: {
          EN: 'Pick up at Langkawi Airport or Kuah Jetty according to your arrival flight or ferry route.',
          ZH: '可按航班或輪渡時刻靈活選擇蘭卡威機場或瓜鎮碼頭取車，無縫連接行程。',
          JA: '飛行機でもフェリーでも、到着場所に合わせたスムーズな受け取りが可能です。',
          ES: 'Elige recoger en el aeropuerto o en el muelle de ferris según tu plan de llegada.',
          KO: '비행기나 페리 도착 일정에 맞춰 공항 또는 부두에서 바로 인수할 수 있습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'my-tip-island-driving',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Left-Hand Drive & Scenic Island Roads',
          ZH: '靠左行駛與海島自然路況',
          JA: '左側通行と島内の道路環境',
          ES: 'Conducción por la izquierda en carreteras costeras',
          KO: '좌측통행 및 섬 도로 환경 주의',
        },
        description: {
          EN: 'Malaysia drives on the left. In Langkawi, watch for occasional wildlife crossings (monkeys, water buffaloes) along rural coastal and rainforest roads.',
          ZH: '馬來西亞為靠左行駛。在蘭卡威自駕途經熱帶雨林或鄉村道路時，請留意猴群等野生動物穿越，切勿超速。',
          JA: 'マレーシアは左側通行です。ランカウイ島内では道路脇の動物や急なカーブに配慮し、制限速度を守って運転してください。',
          ES: 'Se conduce por la izquierda. En Langkawi, modera la velocidad por posibles animales en zonas de selva.',
          KO: '말레이시아는 좌측통행입니다. 랑카위 외곽 도로에서는 야생동물 출현에 주의하며 서행하세요.',
        },
      },
    ],
  },
];

// ----------------------------------------------------------------------
// 2. City Landing Pages Data
// ----------------------------------------------------------------------

export const cityLandingConfigs: CityLandingConfig[] = [
  // Taiwan - Kaohsiung
  {
    cityId: 'kaohsiung',
    citySlug: 'kaohsiung',
    marketSlug: 'taiwan',
    cityKey: 'kaohsiung',
    localizedNames: {
      EN: 'Kaohsiung',
      ZH: '高雄',
      JA: '高雄',
      ES: 'Kaohsiung',
      KO: '가오슝',
    },
    seoTitles: {
      EN: 'Kaohsiung Car Rental | Airport & Railway Station Branches | TrustGo',
      ZH: '高雄租車自駕 | 高雄機場、火車站與左營高鐵站門店預訂 | TrustGo',
      JA: '高雄レンタカー予約 | 高雄空港・駅前・左営高鉄店舗 | TrustGo',
      ES: 'Alquiler de coches en Kaohsiung | Aeropuerto y estaciones | TrustGo',
      KO: '가오슝 렌터카 예약 | 공항 및 주요 기차역 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Compare car rental locations in Kaohsiung with TrustGo. Convenient branches at Kaohsiung Airport (KHH), Kaohsiung Main Station, and Zuoying HSR Station.',
      ZH: 'TrustGo 高雄租車：在高雄國際機場、高雄火車站及左營高鐵站比較真實取還門店。價格透明，支持出站即取與異地還車。',
      JA: 'TrustGoの高雄レンタカー。高雄空港、高雄駅、左営高鉄駅の各店舗を比較してスムーズに予約。明確な料金体系で安心の南部ドライブを。',
      ES: 'Alquiler de coches en Kaohsiung con TrustGo. Oficinas en el aeropuerto KHH, estación central y Zuoying HSR con tarifas claras.',
      KO: 'TrustGo 가오슝 렌터카. 가오슝 국제공항, 가오슝역, 쭤잉역 지점 비교 및 실시간 예약. 투명한 가격과 편리한 이동 지원.',
    },
    h1: {
      EN: 'Car rental in Kaohsiung',
      ZH: '在高雄租車',
      JA: '高雄のレンタカー',
      ES: 'Alquiler de coches en Kaohsiung',
      KO: '가오슝 렌터카',
    },
    intro: {
      EN: 'The gateway to southern Taiwan and Kenting National Park. Pick up your car directly upon arrival at Kaohsiung Airport or High Speed Rail stations to explore the south with total flexibility.',
      ZH: '探索南臺灣與墾丁國家公園的最佳出發門戶。抵達高雄國際機場或高鐵左營站後直接取車出發，沿著濱海公路開啟舒適自在的自駕旅行。',
      JA: '南台湾や墾丁（ケンティン）観光の玄関口。高雄空港や高鉄駅から直接出発して、自由で快適な南国ドライブをお楽しみください。',
      ES: 'La puerta de entrada al sur de Taiwán y Kenting. Recoge tu vehículo directamente en el aeropuerto o en las estaciones principales.',
      KO: '대만 남부와 컨딩 국립공원 여행의 관문. 가오슝 공항 또는 고속철도역에서 바로 렌터카를 인수하여 자유롭게 여행하세요.',
    },
    relatedCitySlugs: ['taoyuan'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 42,
    },
    reviews: [
      {
        reviewId: 'rev-khh-001',
        pickupCityId: 'kaohsiung',
        pickupStoreCode: 'KHH01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Compact Sedan (1.5L / 1.6L)',
          ZH: '經濟型轎車 (1.5L / 1.6L)',
          JA: 'コンパクトセダン (1.5L / 1.6L)',
          ES: 'Sedán compacto (1.5L / 1.6L)',
          KO: '준중형 세단 (1.5L / 1.6L)',
        },
        originalLocale: 'zh',
        originalText: '高雄機場取車手續非常順暢，工作人員驗車很細緻，eTag 結算也很清楚。車況非常新，開去墾丁沿路風景絕美！',
        localizedText: {
          EN: 'Pickup at Kaohsiung Airport was very smooth. The staff inspected the vehicle thoroughly and explained the eTag toll settlement clearly. Car was practically brand new!',
          ZH: '高雄機場取車手續非常順暢，工作人員驗車很細緻，eTag 結算也很清楚。車況非常新，開去墾丁沿路風景絕美！',
          JA: '高雄空港での受取手続きが非常にスムーズでした。スタッフの車両点検も丁寧で、eTagの精算説明も分かりやすかったです。車も新しくて快適でした！',
          ES: 'La recogida en el aeropuerto de Kaohsiung fue muy ágil. El personal revisó el coche en detalle y explicó el sistema de peajes eTag.',
          KO: '가오슝 공항에서 인수가 매우 신속했습니다. 직원분이 차량 검수를 꼼꼼히 해주셨고 eTag 정산도 명확했습니다. 차 상태도 훌륭했습니다!',
        },
      },
      {
        reviewId: 'rev-khh-002',
        pickupCityId: 'kaohsiung',
        pickupStoreCode: 'GXZY01',
        rating: 5,
        publishedAt: '2026-07',
        vehicleGroup: {
          EN: 'Mid-size SUV (5 Seats)',
          ZH: '中型休旅 SUV (5座)',
          JA: 'ミドルサイズSUV (5人乗り)',
          ES: 'SUV mediano (5 plazas)',
          KO: '중형 SUV (5인승)',
        },
        originalLocale: 'en',
        originalText: 'Picked up right after arriving on the High Speed Rail at Zuoying. Clear directions, English documentation was provided, and returning the car was hassle-free.',
        localizedText: {
          EN: 'Picked up right after arriving on the High Speed Rail at Zuoying. Clear directions, English documentation was provided, and returning the car was hassle-free.',
          ZH: '從高鐵左營站出站後直接取車，指引清晰，提供完整英文合約說明，還車流程也毫不費時。',
          JA: '新幹線で左営駅に到着してすぐに受取できました。分かりやすい案内と英語書類が揃っており、返却時も大変スムーズでした。',
          ES: 'Recogí el coche al bajar del tren de alta velocidad en Zuoying. Indicaciones claras y proceso de devolución rápido.',
          KO: '쭤잉역 고속철도 도착 후 바로 수령했습니다. 안내가 명확하고 영문 서류가 준비되어 있어 반납까지 매우 편리했습니다.',
        },
      },
      {
        reviewId: 'rev-khh-003',
        pickupCityId: 'kaohsiung',
        pickupStoreCode: 'GX01',
        rating: 5,
        publishedAt: '2026-06',
        vehicleGroup: {
          EN: 'Compact Sedan',
          ZH: '經濟型轎車',
          JA: 'コンパクトセダン',
          ES: 'Sedán compacto',
          KO: '준중형 세단',
        },
        originalLocale: 'ja',
        originalText: '高雄駅近くで立地が良く、スタッフの方がとても親切でした。台南方面へのドライブも快適に楽しめました。',
        localizedText: {
          EN: 'Great location near Kaohsiung Station with very friendly staff. Our day trip drive towards Tainan was very enjoyable.',
          ZH: '門店就在高雄車站周邊，位置極佳且店員非常熱情親切。開車前往臺南周邊遊玩十分舒適愜意。',
          JA: '高雄駅近くで立地が良く、スタッフの方がとても親切でした。台南方面へのドライブも快適に楽しめました。',
          ES: 'Excelente ubicación cerca de la estación de Kaohsiung con personal muy amable. Viaje perfecto hacia Tainan.',
          KO: '가오슝역 인근이라 위치가 좋고 직원들이 매우 친절했습니다. 타이난 방면 드라이브도 편안했습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'khh-tip-parking',
        category: 'parking',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Street Parking & Pay at Convenience Stores',
          ZH: '路邊停車格與超商繳費',
          JA: '路上パーキングメーターとコンビニ支払い',
          ES: 'Estacionamiento en calle y pago en tiendas de conveniencia',
          KO: '노상 유료 주차 및 편의점 납부',
        },
        description: {
          EN: 'Kaohsiung city uses numbered curb parking spaces. A traffic assistant places a payment slip under your windshield wiper; you can pay the fee conveniently at any 7-Eleven or FamilyMart within 14 days.',
          ZH: '高雄市區路邊設有畫線收費停車格。停放後收費員會開立繳費通知單夾於雨刷上，持單可在 14 天內於臺灣任一家 7-ELEVEN、全家等超商輕鬆繳納。',
          JA: '高雄市内の路上有料駐車枠に停めると、係員がワイパーに納付書を挟みます。台湾全土のセブンイレブンやファミリーマートで簡単に支払えます。',
          ES: 'Al aparcar en plazas de pago en la calle, te dejarán un resguardo en el parabrisas que puedes abonar en cualquier 7-Eleven o FamilyMart.',
          KO: '가오슝 도심 노상 주차구획에 주차하면 주차요원이 와이퍼에 고지서를 부착합니다. 14일 이내에 세븐일레븐이나 패밀리마트에서 납부할 수 있습니다.',
        },
      },
      {
        id: 'khh-tip-highway',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Direct Access to National Freeway 1 & Expressway 88',
          ZH: '直通國道1號與臺88線快速道路',
          JA: '国道1号および台88線への直結アクセス',
          ES: 'Acceso directo a la autopista 1 y la vía rápida 88',
          KO: '국도 1호선 및 타이 88선 고속도로 직결',
        },
        description: {
          EN: 'From Kaohsiung branches, quickly merge onto National Freeway 1 heading north or Expressway 88 heading southeast towards Pingtung and Kenting.',
          ZH: '從高雄市區門店出發，可迅速接上國道1號北上臺南、嘉義，或由臺88線快速道路往東南銜接南州交流道直奔墾丁風景區。',
          JA: '各店舗から国道1号（北上・台南方面）や台88線（南東・屏東・墾丁方面）へ素早く合流できます。',
          ES: 'Salida rápida hacia la autopista 1 al norte o hacia la vía 88 para ir hacia Kenting y el sur.',
          KO: '지점에서 국도 1호선(북부 타이난 방면)이나 타이 88선(컨딩 방면)으로 빠르게 진입할 수 있습니다.',
        },
      },
    ],
  },

  // Taiwan - Taoyuan
  {
    cityId: 'taoyuan',
    citySlug: 'taoyuan',
    marketSlug: 'taiwan',
    cityKey: 'taoyuan',
    localizedNames: {
      EN: 'Taoyuan / Taipei',
      ZH: '桃園 / 臺北',
      JA: '桃園 / 台北',
      ES: 'Taoyuan / Taipéi',
      KO: '타오위안 / 타이베이',
    },
    seoTitles: {
      EN: 'Taoyuan Car Rental | Taoyuan Airport & HSR Station Branches | TrustGo',
      ZH: '桃園租車自駕 | 桃園國際機場與高鐵桃園站門店預訂 | TrustGo',
      JA: '桃園レンタカー予約 | 桃園空港・桃園高鉄駅店舗 | TrustGo',
      ES: 'Alquiler de coches en Taoyuan | Aeropuerto y estación HSR | TrustGo',
      KO: '타오위안 렌터카 예약 | 공항 및 고속철도역 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car at Taoyuan International Airport (TPE) and Taoyuan HSR Station with TrustGo. Start your northern Taiwan road trip right after your flight.',
      ZH: 'TrustGo 桃園租車：直營覆蓋桃園國際機場周邊與桃園高鐵站，抵達航廈即刻接駁取車，輕鬆開啟北部與環島自駕行程。',
      JA: 'TrustGoの桃園レンタカー。桃園国際空港および桃園高鉄駅の拠点で、到着後スムーズに出発できます。',
      ES: 'Alquiler de coches en Taoyuan con TrustGo en el aeropuerto TPE y estación HSR.',
      KO: 'TrustGo 타오위안 렌터카. 타오위안 국제공항 및 고속철도역에서 편리하게 대여하세요.',
    },
    h1: {
      EN: 'Car rental in Taoyuan',
      ZH: '在桃園租車',
      JA: '桃園のレンタカー',
      ES: 'Alquiler de coches en Taoyuan',
      KO: '타오위안 렌터카',
    },
    intro: {
      EN: 'The primary international air gateway of Taiwan. Convenient depots near TPE Airport Terminal 1 & 2 and Taoyuan HSR station connect seamlessly with the northern expressway network.',
      ZH: '臺灣首要的國際航空樞紐門戶。在桃園國際機場及高鐵桃園站附近設有專屬服務站點，提供完善的接駁與交車服務，輕鬆串聯國道北上與南下動線。',
      JA: '台湾最大の国際ゲートウェイ。桃園国際空港（TPE）周辺および高鉄桃園駅の拠点から、北部・中部への快適なドライブを始められます。',
      ES: 'Principal punto de entrada aéreo en Taiwán. Oficinas con lanzadera cerca de la terminal y de la estación de alta velocidad.',
      KO: '대만 최대의 국제선 공항 거점. 타오위안 공항 및 고속철도역 인근에서 편리하게 차량을 대여하여 북부 및 전국 드라이브를 즐기세요.',
    },
    relatedCitySlugs: ['kaohsiung'],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 36,
    },
    reviews: [
      {
        reviewId: 'rev-tpe-001',
        pickupCityId: 'taoyuan',
        pickupStoreCode: 'TPE01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Mid-size Sedan',
          ZH: '中型轎車',
          JA: 'ミドルサイズセダン',
          ES: 'Sedán mediano',
          KO: '중형 세단',
        },
        originalLocale: 'zh',
        originalText: '下飛機後接駁車很快就來了，門店手續辦得很快，服務態度很好，車輛非常乾淨！',
        localizedText: {
          EN: 'Shuttle arrived quickly after landing. Counter paperwork was fast, friendly staff, and the car was spotless!',
          ZH: '下飛機後接駁車很快就來了，門店手續辦得很快，服務態度很好，車輛非常乾淨！',
          JA: '飛行機を降りてからのシャトルバスも早く、カウンター手続きもスピーディー。車もとても清潔でした！',
          ES: 'La lanzadera llegó muy rápido tras aterrizar. Trámites ágiles y coche impecable.',
          KO: '착륙 후 셔틀버스가 빠르게 도착했고 수속도 신속했습니다. 차량도 매우 깨끗했습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'tpe-tip-airport-pickup',
        category: 'transit',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Airport Shuttle Meeting Point at TPE',
          ZH: '桃園機場航廈接駁集合說明',
          JA: '桃園空港ターミナル送迎集合案内',
          ES: 'Punto de encuentro para lanzadera en aeropuerto TPE',
          KO: '타오위안 공항 셔틀 미팅 안내',
        },
        description: {
          EN: 'Upon luggage claim, proceed to the designated pickup area outside T1 or T2. The free TrustGo shuttle transfers you in 8 minutes directly to the dispatch center.',
          ZH: '領取行李出關後，前往一航廈或二航廈指定接送區。TrustGo 免費專用接駁車約 8 分鐘即可送抵車輛整備中心辦理交車。',
          JA: '手荷物受取後、指定の送迎エリアへお進みください。約8分で車両センターへ直行送迎いたします。',
          ES: 'Tras recoger equipaje, dirígete al punto indicado para subir a la lanzadera gratuita (aprox. 8 min al centro de entrega).',
          KO: '수하물 수령 후 지정 픽업 장소로 이동하시면 무료 셔틀이 약 8분 만에 지점으로 안내해 드립니다.',
        },
      },
    ],
  },

  // Japan - Tokyo
  {
    cityId: 'tokyo',
    citySlug: 'tokyo',
    marketSlug: 'japan',
    cityKey: 'tokyo',
    localizedNames: {
      EN: 'Tokyo',
      ZH: '東京',
      JA: '東京',
      ES: 'Tokio',
      KO: '도쿄',
    },
    seoTitles: {
      EN: 'Tokyo Car Rental | Haneda Airport, Tokyo Station & Shinjuku | TrustGo',
      ZH: '東京租車自駕 | 羽田機場、東京站、新宿與淺草橋門店預訂 | TrustGo',
      JA: '東京レンタカー予約 | 羽田空港・東京駅・新宿・浅草橋店舗 | TrustGo',
      ES: 'Alquiler de coches en Tokio | Aeropuerto de Haneda y estaciones | TrustGo',
      KO: '도쿄 렌터카 예약 | 하네다 공항, 도쿄역, 신주쿠 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Tokyo with TrustGo. Multiple stations across Haneda Airport (HND), Tokyo Station, Shinjuku and Asakusabashi. Instant booking & clear pricing.',
      ZH: 'TrustGo 東京租車：覆蓋羽田機場 T3 航廈、東京車站丸之內、新宿站與淺草橋站，提供日租明細、車載 ETC 與市內靈活取車支持。',
      JA: 'TrustGoの東京レンタカー。羽田空港、東京駅、新宿、浅草橋など都内主要拠点でスマートに出発。ETC標準搭載、明瞭会計で安心。',
      ES: 'Alquiler de coches en Tokio con TrustGo. Puntos en aeropuerto de Haneda, estación de Tokio, Shinjuku y Asakusabashi.',
      KO: 'TrustGo 도쿄 렌터카. 하네다 공항, 도쿄역, 신주쿠역, 아사쿠사바시 지점에서 투명한 요금으로 간편하게 예약하세요.',
    },
    h1: {
      EN: 'Car rental in Tokyo',
      ZH: '在東京租車',
      JA: '東京のレンタカー',
      ES: 'Alquiler de coches en Tokio',
      KO: '도쿄 렌터카',
    },
    intro: {
      EN: 'Start your journey from Japan vibrant capital. Whether cruising to Mount Fuji, Hakone hot springs, or the Izu Peninsula, our central rail and airport stations offer ultimate convenience.',
      ZH: '從日本活力首都啟程。前往富士山河口湖、箱根溫泉鄉或伊豆半島，在羽田機場或東京都內主要鐵道大站取車，享受極致便捷的自駕體驗。',
      JA: '日本の首都から富士山・箱根・伊豆へのドライブ旅へ。羽田空港や都内主要ターミナル駅からのスムーズな出発をサポートします。',
      ES: 'Comienza tu ruta desde Tokio hacia el Monte Fuji, Hakone o la península de Izu con recogida en aeropuertos y estaciones céntricas.',
      KO: '도쿄에서 출발하여 후지산, 하코네, 이즈 반도로 떠나는 자유로운 드라이브. 하네다 공항과 도심 주요 역에서 편리하게 시작하세요.',
    },
    relatedCitySlugs: ['narita', 'osaka', 'kyoto', 'nagoya'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 58,
    },
    reviews: [
      {
        reviewId: 'rev-tyo-001',
        pickupCityId: 'tokyo',
        pickupStoreCode: 'KLHND01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Compact Hatchback',
          ZH: '經濟型掀背車',
          JA: 'コンパクトカー',
          ES: 'Hatchback compacto',
          KO: '컴팩트 해치백',
        },
        originalLocale: 'en',
        originalText: 'Pickup at Haneda Terminal 3 was super easy. Staff guided us directly to the parking deck. Car was clean and GPS worked great in English!',
        localizedText: {
          EN: 'Pickup at Haneda Terminal 3 was super easy. Staff guided us directly to the parking deck. Car was clean and GPS worked great in English!',
          ZH: '在羽田機場第3航廈取車非常便利，工作人員直接引導至停車樓交車。車況乾淨整潔，英語導航使用順暢！',
          JA: '羽田空港第3ターミナルでの受け取りがとてもスムーズでした。スタッフが駐車場まで案内してくれ、車両も清潔でした！',
          ES: 'Recogida facilísima en la Terminal 3 de Haneda. El personal nos guió al parking y el coche estaba impoluto.',
          KO: '하네다 공항 제3터미널에서 수령이 매우 간편했습니다. 직원이 주차장까지 친절히 안내해주었고 차량도 매우 쾌적했습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'tyo-tip-shutoko',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Navigating the Shuto Expressway (Shutoko)',
          ZH: '首都高速公路（首都高）駕駛要領',
          JA: '首都高速道路の走行と分岐の注意点',
          ES: 'Conducción en la autopista Shuto de Tokio',
          KO: '도쿄 수도고속도로 주행 및 분기 주의',
        },
        description: {
          EN: 'Tokyo urban elevated expressway (Shutoko) has tight curves, short merge ramps, and complex junction forks. Keep a safe distance and listen to car navigation prompts early.',
          ZH: '東京市區高架之首都高速公路車流較快、彎道與分岔多且匝道合流距離較短。請保持安全車距並提前依據導航提示切換車道。',
          JA: '首都高は合流車線が短くカーブや分岐が多いため、速度を控えめに保ち、ナビの車線案内に早めに従ってください。',
          ES: 'La red Shutoko de Tokio tiene curvas cerradas e incorporaciones cortas; mantén distancia de seguridad y sigue las indicaciones del navegador.',
          KO: '도쿄 도심의 수도고속도로는 램프가 짧고 분기점이 복잡하므로 네비게이션 안내에 따라 미리 차선을 변경하세요.',
        },
      },
    ],
  },

  // Japan - Osaka
  {
    cityId: 'osaka',
    citySlug: 'osaka',
    marketSlug: 'japan',
    cityKey: 'osaka',
    localizedNames: {
      EN: 'Osaka',
      ZH: '大阪',
      JA: '大阪',
      ES: 'Osaka',
      KO: '오사카',
    },
    seoTitles: {
      EN: 'Osaka Car Rental | Kansai Airport & Namba Branches | TrustGo',
      ZH: '大阪租車自駕 | 關西機場、難波與心齋橋門店預訂 | TrustGo',
      JA: '大阪レンタカー予約 | 関西空港・難波・心斎橋店舗 | TrustGo',
      ES: 'Alquiler de coches en Osaka | Aeropuerto de Kansai y Namba | TrustGo',
      KO: '오사카 렌터카 예약 | 간사이 공항, 난바, 신사이바시 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Osaka with TrustGo. Stations at Kansai International Airport (KIX), Namba and Shinsaibashi. Perfect for touring Kansai, Nara and Wakayama.',
      ZH: 'TrustGo 大阪租車：覆蓋關西國際機場、難波站與心齋橋，提供透明收費與優質自駕車隊，輕鬆漫遊關西、京都、奈良與和歌山。',
      JA: 'TrustGoの大阪レンタカー。関西空港や難波・心斎橋の拠点でスムーズに受け取り。奈良・和歌山・京都方面へのドライブに最適。',
      ES: 'Alquiler de coches en Osaka con TrustGo. Oficinas en aeropuerto KIX, Namba y Shinsaibashi con precios claros.',
      KO: 'TrustGo 오사카 렌터카. 간사이 국제공항, 난바, 신사이바시 지점. 교토, 나라, 와카야마 여행에 최적인 거점.',
    },
    h1: {
      EN: 'Car rental in Osaka',
      ZH: '在大阪租車',
      JA: '大阪のレンタカー',
      ES: 'Alquiler de coches en Osaka',
      KO: '오사카 렌터카',
    },
    intro: {
      EN: 'The culinary and cultural heart of Kansai. Pick up your vehicle at Kansai Airport or downtown Osaka to explore ancient temples, scenic coastal peninsulas, and hot springs.',
      ZH: '關西的美食文化與交通核心。於關西國際機場或大阪市中心門店取車，自由穿梭京都古都、奈良神鹿公園、神戶港灣與和歌山白濱溫泉海岸。',
      JA: '関西観光の拠点。関西空港や大阪中心部の店舗から出発し、京都・奈良・神戸・和歌山へ自由度の高いドライブ旅行を楽しめます。',
      ES: 'El corazón de Kansai. Recoge tu coche en el aeropuerto KTrustGo o en el centro de Osaka para recorrer Kioto, Nara y Wakayama.',
      KO: '간사이 여행의 중심. 간사이 공항이나 도심 지점에서 출발하여 교토, 나라, 고베, 와카야마를 자유롭게 여행하세요.',
    },
    relatedCitySlugs: ['kyoto', 'tokyo', 'nagoya'],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 46,
    },
    reviews: [
      {
        reviewId: 'rev-osa-001',
        pickupCityId: 'osaka',
        pickupStoreCode: 'KIX02',
        rating: 5,
        publishedAt: '2026-07',
        vehicleGroup: {
          EN: 'Full-size Minivan (7-8 Seats)',
          ZH: '全尺寸 MPV 休旅車 (7-8座)',
          JA: 'ミニバン (7-8人乗り)',
          ES: 'Monovolumen grande (7-8 plazas)',
          KO: '대형 미니밴 (7-8인승)',
        },
        originalLocale: 'zh',
        originalText: '一家六口去和歌山玩，在關西機場店租了八座阿爾法，車內非常乾淨寬敞，行李全放得下。中文溝通無障礙！',
        localizedText: {
          EN: 'Family of six traveling to Wakayama. Rented an 8-seater van at Kansai Airport. Extremely clean and spacious, fitted all our luggage easily!',
          ZH: '一家六口去和歌山玩，在關西機場店租了八座休旅車，車內非常乾淨寬敞，行李全放得下。服務溝通無障礙！',
          JA: '家族6人で和歌山旅行のため関空店でミニバンを利用しました。とても清潔で荷物も余裕で積め、大満足でした！',
          ES: 'Alquilamos un monovolumen de 8 plazas en el aeropuerto de Kansai para ir a Wakayama. Muy espacioso y limpio.',
          KO: '가족 6명이 와카야마 여행을 위해 간사이공항 지점에서 미니밴을 대여했습니다. 실내가 매우 넓고 짐도 여유 있게 실렸습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'osa-tip-hanshin',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Hanshin Expressway Network',
          ZH: '阪神高速公路路網行駛指引',
          JA: '阪神高速道路の走行ガイド',
          ES: 'Red de autopistas Hanshin en Osaka',
          KO: '한신 고속도로 이용 안내',
        },
        description: {
          EN: 'Connecting Osaka, Kobe, and Sakai with distance-based tolls. Use the Loop Route (Route 1) carefully when changing directions.',
          ZH: '連接大阪、神戶與堺市的阪神高速採用計程收費。行經環狀線（1號線）時請依車道指引提前減速變道。',
          JA: '大阪・神戸・堺を結ぶ阪神高速は距離別料金です。1号環状線の分岐では早めの車線確認をおすすめします。',
          ES: 'La red Hanshin conecta Osaka con Kobe y Sakai. Presta atención al circular por la ruta circular 1.',
          KO: '오사카, 고베, 사카이를 잇는 한신 고속도로는 1호 순환선 분기가 잦으므로 차선 안내를 미리 확인하세요.',
        },
      },
    ],
  },

  // Japan - Fukuoka
  {
    cityId: 'fukuoka',
    citySlug: 'fukuoka',
    marketSlug: 'japan',
    cityKey: 'fukuoka',
    localizedNames: {
      EN: 'Fukuoka',
      ZH: '福岡',
      JA: '福岡',
      ES: 'Fukuoka',
      KO: '후쿠오카',
    },
    seoTitles: {
      EN: 'Fukuoka Car Rental | Airport & Hakata Station Pickup | TrustGo',
      ZH: '福岡租車自駕 | 福岡機場與博多站門店預訂 | TrustGo',
      JA: '福岡レンタカー予約 | 福岡空港・博多駅店舗 | TrustGo',
      ES: 'Alquiler de coches en Fukuoka | Aeropuerto y estación Hakata | TrustGo',
      KO: '후쿠오카 렌터카 예약 | 공항 및 하카타역 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Fukuoka with TrustGo. Key depots at Fukuoka Airport and Hakata Station. Ideal gateway for exploring Kyushu, Yufuin, and Kumamoto.',
      ZH: 'TrustGo 福岡租車：直營覆蓋福岡國際機場與博多火車站，抵達即取。開啟九州、由布院溫泉、別府與阿蘇火山自駕之旅。',
      JA: 'TrustGoの福岡レンタカー。福岡空港および博多駅でスムーズに出発。湯布院、別府、阿蘇など九州周遊ドライブの拠点に。',
      ES: 'Alquiler de coches en Fukuoka con TrustGo en aeropuerto y estación Hakata para explorar Kyushu.',
      KO: 'TrustGo 후쿠오카 렌터카. 후쿠오카 공항 및 하카타역 지점에서 규슈 유후인, 벳푸, 아소산 여행을 시작하세요.',
    },
    h1: {
      EN: 'Car rental in Fukuoka',
      ZH: '在福岡租車',
      JA: '福岡のレンタカー',
      ES: 'Alquiler de coches en Fukuoka',
      KO: '후쿠오카 렌터카',
    },
    intro: {
      EN: 'The energetic economic and travel hub of Kyushu. Pick up your car directly near Fukuoka Airport or Hakata Shinkansen Station for scenic drives to onsen towns and coastal cliffs.',
      ZH: '探索九州最便捷的門戶樞紐。於福岡機場或博多新幹線站就近取車出發，自由造訪由布院、黑川溫泉、熊本城與宮崎海岸。',
      JA: '九州観光の玄関口。福岡空港や博多駅前で車を受け取り、名湯巡りや雄大な阿蘇山への快適なドライブをお楽しみください。',
      ES: 'El punto de partida ideal para recorrer Kyushu. Recoge tu coche en el aeropuerto o en la estación Hakata.',
      KO: '규슈 여행의 관문. 후쿠오카 공항이나 하카타역에서 차량을 수령하여 온천 마을과 수려한 자연을 만끽하세요.',
    },
    relatedCitySlugs: ['tokyo', 'osaka', 'okinawa'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 38,
    },
    reviews: [
      {
        reviewId: 'rev-fuk-001',
        pickupCityId: 'fukuoka',
        pickupStoreCode: 'KLFUK01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Compact Car',
          ZH: '小型經濟車',
          JA: 'コンパクトカー',
          ES: 'Coche compacto',
          KO: '소형차',
        },
        originalLocale: 'zh',
        originalText: '福岡機場國際航廈出來接駁很快，取車手續十分鐘搞定，車載 ETC 和導航很好用，開去由布院一路順暢。',
        localizedText: {
          EN: 'Super fast shuttle from Fukuoka Airport. Pickup took only 10 minutes. The onboard ETC and English navigation made driving to Yufuin seamless.',
          ZH: '福岡機場國際航廈出來接駁很快，取車手續十分鐘搞定，車載 ETC 和導航很好用，開去由布院一路順暢。',
          JA: '福岡空港国際線からの送迎がとても早く、手続きも10分で完了。ETCとナビが使いやすく湯布院までのドライブが快適でした。',
          ES: 'Lanzadera rapidísima desde el aeropuerto de Fukuoka. Trámites en 10 minutos y navegación perfecta.',
          KO: '후쿠오카 공항 셔틀이 매우 빨랐고 10분 만에 인수가 끝났습니다. ETC와 네비게이션 덕분에 유후인까지 편안하게 다녀왔습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'fuk-tip-expressway',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Kyushu Expressway & Urban Fukuoka Route',
          ZH: '九州自動車道與福岡都市高速行駛指引',
          JA: '九州自動車道および福岡都市高速の利用ガイド',
          ES: 'Autopistas de Kyushu y red urbana de Fukuoka',
          KO: '규슈 자동차도 및 후쿠오카 도시 고속도로 안내',
        },
        description: {
          EN: 'The Kyushu Expressway connects north to south. When driving into Fukuoka city center, Fukuoka Urban Expressway provides quick bypass access.',
          ZH: '九州自動車道貫穿九州南北。若前往福岡市區，可經由福岡都市高速快速抵達天神或博多周邊。',
          JA: '九州自動車道で各県へ直結。福岡市内へのアクセスには福岡都市高速のご利用が便利です。',
          ES: 'La autopista de Kyushu conecta toda la isla de norte a sur, facilitando traslados rápidos.',
          KO: '규슈 자동차도를 통해 규슈 전역으로 신속히 이동할 수 있으며 도심 이동 시 도시 고속도로를 활용하세요.',
        },
      },
    ],
  },

  // Japan - Okinawa
  {
    cityId: 'okinawa',
    citySlug: 'okinawa',
    marketSlug: 'japan',
    cityKey: 'okinawa',
    localizedNames: {
      EN: 'Okinawa / Naha',
      ZH: '沖繩 / 那霸',
      JA: '沖縄 / 那覇',
      ES: 'Okinawa / Naha',
      KO: '오키나와 / 나하',
    },
    seoTitles: {
      EN: 'Okinawa Car Rental | Naha Airport Pickup | TrustGo',
      ZH: '沖繩租車自駕 | 那霸機場門店預訂與自駕攻略 | TrustGo',
      JA: '沖縄レンタカー予約 | 那覇空港店舗・安心サポート | TrustGo',
      ES: 'Alquiler de coches en Okinawa | Aeropuerto de Naha | TrustGo',
      KO: '오키나와 렌터카 예약 | 나하 공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Okinawa with TrustGo. Depot near Naha Airport (OKA) with complimentary shuttle. Explore Churaumi Aquarium, Kouri Island, and coastal beaches.',
      ZH: 'TrustGo 沖繩租車：那霸機場免費接駁，透明收費、全保選項與車況保障。自駕暢遊美麗海水族館、古宇利島與恩納村海灘。',
      JA: 'TrustGoの沖縄レンタカー。那覇空港から無料送迎で店舗へ。美ら海水族館や古宇利島、恩納村のリゾートドライブを安心サポート。',
      ES: 'Alquiler de coches en Okinawa con TrustGo. Lanzadera gratuita en el aeropuerto de Naha.',
      KO: 'TrustGo 오키나와 렌터카. 나하 공항 무료 셔틀 운행. 츄라우미 수족관, 코우리 대교, 온나손 해변을 자유롭게 둘러보세요.',
    },
    h1: {
      EN: 'Car rental in Okinawa',
      ZH: '在沖繩租車',
      JA: '沖縄のレンタカー',
      ES: 'Alquiler de coches en Okinawa',
      KO: '오키나와 렌터카',
    },
    intro: {
      EN: 'Japan premier tropical paradise where car rental is essential. From Naha Airport, cruise the Okinawa Expressway up to northern emerald beaches and historic castle ruins.',
      ZH: '日本最熱門的熱帶度假勝地，自駕是漫遊沖繩的最佳方式。從那霸機場出發，沿著沖繩自動車道一路向北，盡覽翡翠海色與琉球王國世界遺產。',
      JA: 'ドライブが必須の南国リゾート。那覇空港から沖縄自動車道を利用して、北部エメラルドグリーンの絶景ビーチや古宇利島へ自由にお出かけください。',
      ES: 'El paraíso tropical de Japón donde alquilar coche es indispensable para explorar playas y templos.',
      KO: '오키나와 여행의 필수 선택, 렌터카. 나하 공항에서 출발하여 오키나와 자동차도를 타고 북부의 푸른 바다와 명소를 만끽하세요.',
    },
    relatedCitySlugs: ['fukuoka', 'tokyo', 'osaka'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 52,
    },
    reviews: [
      {
        reviewId: 'rev-oka-001',
        pickupCityId: 'okinawa',
        pickupStoreCode: 'OKA01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Compact Hatchback',
          ZH: '經濟型掀背車',
          JA: 'コンパクトカー',
          ES: 'Coche compacto',
          KO: '컴팩트 해치백',
        },
        originalLocale: 'zh',
        originalText: '去沖繩自駕強烈推薦，那霸機場出來有專用車位接駁，車內冷氣超涼快，省油又好開，後車廂放兩個大箱子剛剛好。',
        localizedText: {
          EN: 'Highly recommend renting with TrustGo in Okinawa! Dedicated pickup shuttle at Naha Airport, icy cold A/C, great fuel economy, and fit two large suitcases easily.',
          ZH: '去沖繩自駕強烈推薦，那霸機場出來有專用車位接駁，車內冷氣超涼快，省油又好開，後車廂放兩個大箱子剛剛好。',
          JA: '沖縄旅行に超おすすめです。那覇空港からの送迎もスムーズで、車内も涼しく燃費抜群。スーツケース2個もすっきり積めました。',
          ES: 'Muy recomendable en Okinawa. Recogida rápida con lanzadera, aire acondicionado excelente y muy económico.',
          KO: '오키나와 여행에 적극 추천합니다. 나하 공항 셔틀이 신속했고 에어컨도 시원하며 트렁크에 대형 캐리어 2개가 넉넉히 들어갔습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'oka-tip-expressway',
        category: 'toll',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Okinawa Expressway from Kyoda to Naha',
          ZH: '沖繩自動車道（許田至那霸）行駛攻略',
          JA: '沖縄自動車道（那覇IC〜許田IC）利用ガイド',
          ES: 'Autopista de Okinawa de Naha a Kyoda',
          KO: '오키나와 자동차도(나하-쿄다) 이용 가이드',
        },
        description: {
          EN: 'The toll expressway runs from Naha IC in the south to Kyoda IC in the north near Nago. Toll is approx. 1,040 JPY (standard car). Use ETC for fastest clearance.',
          ZH: '貫穿沖繩南北的收費高速公路，自南端那霸IC至北端名護許田IC，普通車單程約 1,040 日圓。使用 ETC 走專用道可免排隊迅速通過。',
          JA: '那覇ICから北部名護の許田ICまでを結ぶ有料高速道路です。ETC利用で料金所をノンストップで通過できます。',
          ES: 'Autopista de peaje de sur a norte (Naha a Kyoda). Con ETC se pasa sin detenerse en los peajes.',
          KO: '남부 나하 IC부터 북부 쿄다 IC까지 연결되는 유료 도로입니다. ETC를 사용하면 요금소 대기 없이 통과할 수 있습니다.',
        },
      },
    ],
  },

  // Japan - Kyoto
  {
    cityId: 'kyoto',
    citySlug: 'kyoto',
    marketSlug: 'japan',
    cityKey: 'kyoto',
    localizedNames: {
      EN: 'Kyoto',
      ZH: '京都',
      JA: '京都',
      ES: 'Kioto',
      KO: '교토',
    },
    seoTitles: {
      EN: 'Kyoto Car Rental | Kyoto Station Pickup | TrustGo',
      ZH: '京都租車自駕 | 京都站南口門店預訂 | TrustGo',
      JA: '京都レンタカー予約 | 京都駅前店舗・郊外ドライブ | TrustGo',
      ES: 'Alquiler de coches en Kioto | Estación de Kioto | TrustGo',
      KO: '교토 렌터카 예약 | 교토역 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car at Kyoto Station with TrustGo. Ideal for visiting Amanohashidate, Ine Boathouses, Lake Biwa, and the Arashiyama countryside.',
      ZH: 'TrustGo 京都租車：緊鄰京都車站，出站即取。探索天橋立、伊根舟屋、滋賀琵琶湖與美山町合掌村等郊區秘境的理想選擇。',
      JA: '京都駅から徒歩で出発。天橋立、伊根の舟屋、琵琶湖、美山かやぶきの里など、京都郊外・滋賀ドライブに最適です。',
      ES: 'Alquiler de coches en la estación de Kioto con TrustGo para recorrer Amanohashidate y el lago Biwa.',
      KO: 'TrustGo 교토 렌터카. 교토역 인근 지점에서 아마노하시다테, 이네후나야, 비와호로 드라이브를 떠나보세요.',
    },
    h1: {
      EN: 'Car rental in Kyoto',
      ZH: '在京都租車',
      JA: '京都のレンタカー',
      ES: 'Alquiler de coches en Kioto',
      KO: '교토 렌터카',
    },
    intro: {
      EN: 'While central Kyoto is best explored on foot or bus, renting a car unlocks scenic northern Kyoto (Amanohashidate, Tango Peninsula) and peaceful Lake Biwa.',
      ZH: '京都古蹟市區大眾運輸發達，而租車自駕則是探訪「海之京都」（天橋立、伊根舟屋）與滋賀琵琶湖畔絕景不可或缺的方式。',
      JA: '京都市内だけでなく、風光明媚な「海の京都」（天橋立・伊根）や琵琶湖周辺への小旅行にレンタカーが活躍します。',
      ES: 'Alquila tu coche en Kioto para visitar las costas del norte y los pueblos tradicionales fuera del centro.',
      KO: '교토 도심을 벗어나 바다의 교토(아마노하시다테, 이네후나야)와 비와호의 절경을 렌터카로 둘러보세요.',
    },
    relatedCitySlugs: ['osaka', 'tokyo', 'nagoya'],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 32,
    },
    reviews: [
      {
        reviewId: 'rev-kyo-001',
        pickupCityId: 'kyoto',
        pickupStoreCode: 'JD02',
        rating: 5,
        publishedAt: '2026-07',
        vehicleGroup: {
          EN: 'Mid-size Wagon',
          ZH: '休旅旅行車',
          JA: 'ステーションワゴン',
          ES: 'Familiar mediano',
          KO: '중형 왜건',
        },
        originalLocale: 'ja',
        originalText: '京都駅から歩いてすぐで立地最高でした。天橋立と伊根の舟屋まで快適にドライブできました。',
        localizedText: {
          EN: 'Outstanding location right next to Kyoto Station. Drove to Amanohashidate and Ine boathouses comfortably.',
          ZH: '京都站步行即可抵達，位置極佳。開車去天橋立和伊根舟屋一路非常舒適順利。',
          JA: '京都駅から歩いてすぐで立地最高でした。天橋立と伊根の舟屋まで快適にドライブできました。',
          ES: 'Ubicación fantástica cerca de la estación de Kioto. Viaje perfecto hasta Amanohashidate.',
          KO: '교토역에서 도보로 바로 연결되어 위치가 최고였습니다. 아마노하시다테와 이네후나야까지 편안하게 다녀왔습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'kyo-tip-narrow-streets',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Narrow Historic Streets & One-Way Alleys',
          ZH: '歷史市街狹窄巷弄與單行道留意',
          JA: '歴史地区の狭路・一方通行への注意',
          ES: 'Calles estrechas de sentido único en barrios históricos',
          KO: '역사 도심 좁은 골목 및 일방통행 주의',
        },
        description: {
          EN: 'Streets around Gion and central machiya districts can be very narrow with strict pedestrian priority and one-way rules. Stick to major arterial avenues.',
          ZH: '祇園、河原町及傳統町家街區道路狹窄且單行道多。市區自駕建議行駛主要幹道（烏丸通、堀川通等），切勿強行駛入狹小歷史巷弄。',
          JA: '祇園など歴史的街並み周辺は狭い一方通行が多いため、幹線道路（烏丸通など）を優先して走行してください。',
          ES: 'Las zonas históricas tienen callejuelas estrechas y pasos peatonales. Se aconseja circular por grandes avenidas.',
          KO: '기온 등 역사 지구는 도로가 좁고 일방통행이 많으므로 대로 중심으로 운행하시기 바랍니다.',
        },
      },
    ],
  },

  // Japan - Sapporo / Chitose
  {
    cityId: 'sapporo',
    citySlug: 'sapporo',
    marketSlug: 'japan',
    cityKey: 'sapporo',
    localizedNames: {
      EN: 'Sapporo / Chitose',
      ZH: '札幌 / 新千歲',
      JA: '札幌 / 新千歳',
      ES: 'Sapporo / Chitose',
      KO: '삿포로 / 치토세',
    },
    seoTitles: {
      EN: 'Sapporo Car Rental | New Chitose Airport Pickup | TrustGo',
      ZH: '札幌租車自駕 | 新千歲機場門店預訂與北海道自駕 | TrustGo',
      JA: '札幌・新千歳空港レンタカー予約 | 北海道ドライブ | TrustGo',
      ES: 'Alquiler de coches en Sapporo | Aeropuerto New Chitose | TrustGo',
      KO: '삿포로 렌터카 예약 | 신치토세 공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car at New Chitose Airport (CTS) with TrustGo. Explore Hokkaido breathtaking national parks, Furano flower fields, and Otaru canals with winter-ready fleets.',
      ZH: 'TrustGo 札幌/新千歲機場租車：免費航廈接駁，提供雪地防滑輪胎與優質四驅車輛。暢遊富良野花田、美瑛青池、小樽運河與登別溫泉。',
      JA: '新千歳空港（CTS）無料送迎対応。富良野・美瑛・小樽・ニセコなど大自然の北海道ドライブを快適車両でお届けします。',
      ES: 'Alquiler de coches en Sapporo con TrustGo en el aeropuerto New Chitose.',
      KO: 'TrustGo 삿포로 신치토세 공항 렌터카. 후라노, 비에이, 오타루, 노보리베츠로 떠나는 홋카이도 여행을 함께하세요.',
    },
    h1: {
      EN: 'Car rental in Sapporo',
      ZH: '在札幌租車',
      JA: '札幌のレンタカー',
      ES: 'Alquiler de coches en Sapporo',
      KO: '삿포로 렌터카',
    },
    intro: {
      EN: 'Hokkaido is vast and best experienced by car. From New Chitose Airport, wide straight scenic expressways lead to pristine lakes, ski resorts, and culinary capitals.',
      ZH: '北海道幅員遼闊，租車自駕是飽覽北國四季之美的最佳選擇。自新千歲機場取車出發，沿著寬闊平坦的高速景觀公路前往富良野、洞爺湖與函館。',
      JA: '広大な北海道の魅力を満喫するにはレンタカーが最適。新千歳空港から出発して、四季折々の絶景パノラマロードを自由にお楽しみください。',
      ES: 'Hokkaido es una región inmensa que se disfruta al máximo sobre ruedas desde el aeropuerto New Chitose.',
      KO: '광활한 홋카이도 자연을 즐기기에 렌터카는 최선의 선택입니다. 신치토세 공항에서 출발하여 사계절의 아름다움을 느껴보세요.',
    },
    relatedCitySlugs: ['tokyo', 'osaka'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 45,
    },
    reviews: [
      {
        reviewId: 'rev-cts-001',
        pickupCityId: 'sapporo',
        pickupStoreCode: 'CTS02',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: '4WD Compact SUV',
          ZH: '四驅休旅 SUV',
          JA: '4WDコンパクトSUV',
          ES: 'SUV compacto 4WD',
          KO: '4WD 컴팩트 SUV',
        },
        originalLocale: 'zh',
        originalText: '新千歲機場接駁非常周到，車子是四驅的新車，開去富良野和美瑛超穩超舒適！',
        localizedText: {
          EN: 'Great shuttle service at New Chitose. The vehicle was a brand new 4WD SUV, super stable and smooth driving to Furano and Biei!',
          ZH: '新千歲機場接駁非常周到，車子是四驅的新車，開去富良野和美瑛超穩超舒適！',
          JA: '新千歳空港での送迎がとても丁寧でした。最新4WD車で富良野・美瑛ドライブも安心でした！',
          ES: 'Servicio de lanzadera impecable en Chitose. Coche 4WD nuevo, perfecto para Furano y Biei.',
          KO: '신치토세 공항 셔틀 서비스가 훌륭했습니다. 신차 4WD 차량이라 후라노, 비에이 운전이 아주 안정적이었습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'cts-tip-distance',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Long Distance Driving in Hokkaido',
          ZH: '北海道長途駕駛與加油站規劃',
          JA: '北海道の長距離走行と給油ポイントの確認',
          ES: 'Conducción de larga distancia y estaciones de servicio en Hokkaido',
          KO: '홋카이도 장거리 운전 및 주유소 확인',
        },
        description: {
          EN: 'Distances between towns in Hokkaido can be extensive. Rural gas stations may close early in the evening. Keep your tank above half in rural mountains.',
          ZH: '北海道城鎮間距離較遠。鄉村郊區加油站傍晚可能較早打烊，駛入偏遠山區或國家公園前，請確保油箱保持在半箱以上。',
          JA: '町と町の間隔が広いため、山間部に入る前に早めの給油を心がけてください。',
          ES: 'Las distancias en Hokkaido son grandes y las gasolineras rurales cierran pronto. Mantén el depósito lleno.',
          KO: '도시 간 거리가 멀고 외곽 주유소는 일찍 문을 닫으므로 산간 지역 진입 전 미리 주유하세요.',
        },
      },
    ],
  },

  // Japan - Nagoya
  {
    cityId: 'nagoya',
    citySlug: 'nagoya',
    marketSlug: 'japan',
    cityKey: 'nagoya',
    localizedNames: {
      EN: 'Nagoya',
      ZH: '名古屋',
      JA: '名古屋',
      ES: 'Nagoya',
      KO: '나고야',
    },
    seoTitles: {
      EN: 'Nagoya Car Rental | Chubu Centrair Airport & Nagoya Station | TrustGo',
      ZH: '名古屋租車自駕 | 中部國際機場與名古屋站門店預訂 | TrustGo',
      JA: '名古屋レンタカー予約 | 中部国際空港・名古屋駅店舗 | TrustGo',
      ES: 'Alquiler de coches en Nagoya | Aeropuerto Centrair y estación | TrustGo',
      KO: '나고야 렌터카 예약 | 중부 센트레아 공항 및 나고야역 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Nagoya with TrustGo. Outlets at Chubu Centrair Airport (NGO) and Nagoya Station. Explore Shirakawa-go, Takayama, and the Japanese Alps.',
      ZH: 'TrustGo 名古屋租車：覆蓋中部國際機場與名古屋車站，便捷取車出發，前往白川鄉合掌村、高山老街與立山黑部阿爾卑斯路線。',
      JA: '中部国際空港や名古屋駅から出発。白川郷、飛騨高山、伊勢志摩などへの歴史・絶景ドライブに最適です。',
      ES: 'Alquiler de coches en Nagoya con TrustGo en aeropuerto Centrair y estación central.',
      KO: 'TrustGo 나고야 렌터카. 중부 국제공항 및 나고야역 지점에서 시라카와고, 다카야마로 여행을 떠나보세요.',
    },
    h1: {
      EN: 'Car rental in Nagoya',
      ZH: '在名古屋租車',
      JA: '名古屋のレンタカー',
      ES: 'Alquiler de coches en Nagoya',
      KO: '나고야 렌터카',
    },
    intro: {
      EN: 'Central Japan manufacturing and transit hub. Pick up at Chubu Centrair Airport or Nagoya Station to embark on alpine adventures into Gifu, Takayama, and Shirakawa-go.',
      ZH: '日本中部的樞紐城市。在常滑中部國際機場或名古屋車站取車，沿著東海北陸自動車道前往世界遺產白川鄉合掌村與飛驒高山古街。',
      JA: '中部地方の中心都市。中部空港や名古屋駅から出発し、世界遺産の白川郷や伊勢神宮への快適なドライブを満喫してください。',
      ES: 'El centro neurálgico de Japón. Ideal para adentrarse en los Alpes japoneses y Shirakawa-go.',
      KO: '일본 중부의 중심. 센트레아 공항이나 나고야역에서 차량을 수령하여 시라카와고와 다카야마를 둘러보세요.',
    },
    relatedCitySlugs: ['tokyo', 'osaka', 'kyoto'],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 34,
    },
    reviews: [
      {
        reviewId: 'rev-ngo-001',
        pickupCityId: 'nagoya',
        pickupStoreCode: 'NGO01',
        rating: 5,
        publishedAt: '2026-07',
        vehicleGroup: {
          EN: 'Mid-size SUV',
          ZH: '中型休旅車',
          JA: 'ミドルサイズSUV',
          ES: 'SUV mediano',
          KO: '중형 SUV',
        },
        originalLocale: 'zh',
        originalText: '中部國際機場店服務態度很好，取還車都很有條理，車內乾淨，開去高山白川鄉非常舒服。',
        localizedText: {
          EN: 'Great service at Chubu Centrair Airport. Pickup and return were organized, car was clean, and driving to Takayama was delightful.',
          ZH: '中部國際機場店服務態度很好，取還車都很有條理，車內乾淨，開去高山白川鄉非常舒服。',
          JA: '中部空港店のスタッフがとても親切でした。車両も清潔で、高山・白川郷までのドライブが快適でした。',
          ES: 'Gran servicio en el aeropuerto Centrair. Coche limpio y cómodo para ir a Takayama.',
          KO: '중부 센트레아 공항점 직원들이 매우 친절했고 인수인계가 체계적이었습니다. 다카야마까지 쾌적하게 다녀왔습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'ngo-tip-tokai-hokuriku',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Tokai-Hokuriku Expressway Mountain Tunnels',
          ZH: '東海北陸自動車道山區隧道行駛須知',
          JA: '東海北陸自動車道の山岳トンネル走行ガイド',
          ES: 'Túneles de montaña en la autopista Tokai-Hokuriku',
          KO: '도카이 호쿠리쿠 자동차도 산악 터널 주행 안내',
        },
        description: {
          EN: 'Heading north into Gifu, the Tokai-Hokuriku Expressway features the Hida Tunnel and frequent mountain curves. Turn on headlights inside tunnels and watch speed limits.',
          ZH: '北上前往岐阜高山時，東海北陸自動車道包含飛驒隧道等多座長隧道。進入隧道請務必開啟大燈並維持速限。',
          JA: '飛騨トンネルなど長い山岳トンネルが連続するため、点灯走行と車間距離の確保を徹底してください。',
          ES: 'Ruta hacia Gifu con túneles largos como el de Hida. Enciende luces y respeta la velocidad.',
          KO: '히다 터널 등 긴 산악 터널이 많으므로 터널 내 전조등을 켜고 속도를 준수하세요.',
        },
      },
    ],
  },

  // Japan - Narita
  {
    cityId: 'narita',
    citySlug: 'narita',
    marketSlug: 'japan',
    cityKey: 'narita',
    localizedNames: {
      EN: 'Narita',
      ZH: '成田',
      JA: '成田',
      ES: 'Narita',
      KO: '나리타',
    },
    seoTitles: {
      EN: 'Narita Car Rental | Narita International Airport Pickup | TrustGo',
      ZH: '成田租車自駕 | 成田國際機場門店預訂 | TrustGo',
      JA: '成田レンタカー予約 | 成田国際空港店舗・無料送迎 | TrustGo',
      ES: 'Alquiler de coches en Narita | Aeropuerto Internacional Narita | TrustGo',
      KO: '나리타 렌터카 예약 | 나리타 국제공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car at Narita International Airport (NRT) with TrustGo. Free terminal shuttle bus, transparent rates, ETC support, and easy bypass into Chiba and Greater Tokyo.',
      ZH: 'TrustGo 成田租車：成田國際機場航廈免費接駁，收費透明、配備車載 ETC。方便自駕漫遊千葉房總半島、日光或避開東京市區直通東北。',
      JA: '成田空港（NRT）ターミナル無料送迎対応。千葉・房総半島や日光・東北方面へのドライブに快適な車両をご提供します。',
      ES: 'Alquiler de coches en el aeropuerto de Narita con TrustGo. Lanzadera gratuita a terminales.',
      KO: 'TrustGo 나리타 국제공항 렌터카. 무료 터미널 셔틀 운행으로 지바, 닛코, 도쿄 방면으로 편리하게 이동하세요.',
    },
    h1: {
      EN: 'Car rental in Narita',
      ZH: '在成田租車',
      JA: '成田のレンタカー',
      ES: 'Alquiler de coches en Narita',
      KO: '나리타 렌터카',
    },
    intro: {
      EN: 'Tokyo premier international gateway airport. Start your road trip straight from Narita terminals without navigating crowded downtown rail transfers with heavy luggage.',
      ZH: '成田國際機場是抵達東京的主要國際門戶。攜帶大型行李時，直接在機場門店取車出發，省去轉乘擁擠市區電車的繁瑣勞頓。',
      JA: '大きな荷物を持った移動も、成田空港店舗でのレンタカー受取ならスムーズ。都心の混雑を避けて目的地へ直行できます。',
      ES: 'Evita transbordos de tren con maletas pesadas recogiendo tu vehículo directamente en el aeropuerto de Narita.',
      KO: '무거운 짐을 들고 대중교통 환승할 필요 없이 나리타 공항에서 바로 렌터카를 인수하여 여행을 시작하세요.',
    },
    relatedCitySlugs: ['tokyo', 'osaka'],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 48,
    },
    reviews: [
      {
        reviewId: 'rev-nrt-001',
        pickupCityId: 'narita',
        pickupStoreCode: 'KLNRT01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Full-size Minivan',
          ZH: '全尺寸休旅車',
          JA: 'ミニバン',
          ES: 'Monovolumen',
          KO: '대형 미니밴',
        },
        originalLocale: 'zh',
        originalText: '成田機場一航廈出來電話聯絡後接駁車很快就到了，門店人員驗車很專業，還車後也及時送我們回航廈。',
        localizedText: {
          EN: 'Called upon arrival at Terminal 1 and the shuttle came right away. Professional inspection and timely dropoff back at the terminal after return.',
          ZH: '成田機場一航廈出來電話聯絡後接駁車很快就到了，門店人員驗車很專業，還車後也及時送我們回航廈。',
          JA: '成田第1ターミナル到着後の送迎対応が迅速でした。返却後もスムーズに空港まで送っていただき感謝です。',
          ES: 'Lanzadera puntual al llegar a la T1. Gran atención del personal y devolución muy ágil.',
          KO: '나리타 제1터미널 도착 후 셔틀이 신속히 왔고 차량 검수와 반납 후 터미널 복귀까지 완벽했습니다.',
        },
      },
    ],
    tips: [
      {
        id: 'nrt-tip-higashi-kanto',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Higashi-Kanto Expressway Access',
          ZH: '東關東自動車道直通東京與千葉',
          JA: '東関東自動車道を利用した都心・千葉方面アクセス',
          ES: 'Acceso a la autopista Higashi-Kanto hacia Tokio y Chiba',
          KO: '히가시 간토 자동차도 직결 안내',
        },
        description: {
          EN: 'Direct access via Narita IC onto the Higashi-Kanto Expressway connects directly to Wangan Tokyo expressway and Ken-O Expressway bypass.',
          ZH: '由成田 IC 可直上東關東自動車道，向西銜接首都高灣岸線，或由圈央道繞開市區直通神奈川與埼玉。',
          JA: '成田ICから東関東自動車道へ直結。圏央道を利用すれば都心を迂回して北関東方面へもスムーズです。',
          ES: 'Conexión directa desde Narita IC hacia la autopista Higashi-Kanto y la circunvalación Ken-O.',
          KO: '나리타 IC를 통해 히가시 간토 자동차도 및 켄오 고속도로로 바로 진입할 수 있습니다.',
        },
      },
    ],
  },

  // Thailand - Phuket
  {
    cityId: 'phuket',
    citySlug: 'phuket',
    marketSlug: 'thailand',
    cityKey: 'phuket',
    localizedNames: {
      EN: 'Phuket',
      ZH: '普吉',
      JA: 'プーケット',
      ES: 'Phuket',
      KO: '푸켓',
    },
    seoTitles: {
      EN: 'Phuket Car Rental | Phuket International Airport Pickup | TrustGo',
      ZH: '普吉租車自駕 | 普吉國際機場門店預訂 | TrustGo',
      JA: 'プーケットレンタカー予約 | プーケット国際空港店舗 | TrustGo',
      ES: 'Alquiler de coches en Phuket | Aeropuerto Internacional | TrustGo',
      KO: '푸켓 렌터카 예약 | 푸켓 국제공항 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car at Phuket International Airport (HKT) with TrustGo. Explore Patong, Kata, Karon beaches, Big Buddha, and coastal viewpoints in air-conditioned comfort.',
      ZH: 'TrustGo 普吉租車：普吉國際機場直營服務，收費透明、清爽空調車況。自駕打卡芭東海灘、卡塔海灘、大佛與神仙半島日落。',
      JA: 'プーケット国際空港（HKT）受け取り対応。パトンビーチや絶景ビューポイントを快適なエアコン付きレンタカーで巡る。',
      ES: 'Alquiler de coches en Phuket con TrustGo en el aeropuerto HKT. Recorre playas y miradores.',
      KO: 'TrustGo 푸켓 렌터카. 푸켓 국제공항 지점에서 빠통 비치, 카타 비치, 빅부다를 자유롭게 드라이브하세요.',
    },
    h1: {
      EN: 'Car rental in Phuket',
      ZH: '在普吉租車',
      JA: 'プーケットのレンタカー',
      ES: 'Alquiler de coches en Phuket',
      KO: '푸켓 렌터카',
    },
    intro: {
      EN: 'Thailand premier island destination. Renting a car gives you complete freedom to skip expensive taxi fares and discover secluded beaches along the Andaman coast.',
      ZH: '泰國頂級熱帶度假海島。租車自駕能免去昂貴的出租車議價困擾，隨心探訪安達曼海沿岸的隱世海灘、懸崖咖啡館與壯麗日落觀景點。',
      JA: '美しいアンダマン海に囲まれたリゾートアイランド。レンタカーを利用すれば、タクシー料金を気にせず隠れ家ビーチを自在に満喫できます。',
      ES: 'La isla más famosa de Tailandia. Alquilar coche te da total libertad para explorar playas tranquilas.',
      KO: '태국 최고의 휴양 섬 푸켓. 렌터카로 택시비 부담 없이 안다만 해변과 숨은 명소를 자유롭게 여행하세요.',
    },
    relatedCitySlugs: [],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 29,
    },
    reviews: [
      {
        reviewId: 'rev-hkt-001',
        pickupCityId: 'phuket',
        pickupStoreCode: 'HKT01',
        rating: 5,
        publishedAt: '2026-07',
        vehicleGroup: {
          EN: 'Economy Sedan (1.5L)',
          ZH: '經濟型轎車 (1.5L)',
          JA: 'エコノミーセダン (1.5L)',
          ES: 'Sedán económico (1.5L)',
          KO: '이코노미 세단 (1.5L)',
        },
        originalLocale: 'en',
        originalText: 'Great experience at Phuket Airport. Car was clean, aircon was freezing cold which was a lifesaver in Thailand heat!',
        localizedText: {
          EN: 'Great experience at Phuket Airport. Car was clean, aircon was freezing cold which was a lifesaver in Thailand heat!',
          ZH: '普吉機場門店體驗很棒，車況乾淨，空調非常給力，在炎熱的泰國天氣裡太舒服了！',
          JA: 'プーケット空港での利用体験がとても良かったです。車内は清潔でエアコンもよく効き、快適そのものでした！',
          ES: 'Excelente experiencia en Phuket. Coche limpio y aire acondicionado potente para el calor tropical.',
          KO: '푸켓 공항에서 아주 좋은 경험이었습니다. 차량이 깨끗하고 에어컨이 아주 시원해서 더운 날씨에 최고였습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'hkt-tip-scenic-hills',
        category: 'driving',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Hilly Roads between West Coast Beaches',
          ZH: '西海岸海灘間山路丘陵駕駛注意',
          JA: '西海岸ビーチ間の山道・急勾配での注意点',
          ES: 'Carreteras empinadas entre playas de la costa oeste',
          KO: '서해안 해변 간 급경사 산길 주행 주의',
        },
        description: {
          EN: 'Roads between Patong, Karon, and Kata feature steep slopes and tight curves. Use lower gear descending hills and beware of oncoming scooter overtaking.',
          ZH: '芭東、卡倫與卡塔海灘之間的連接山路坡度較大且多彎道。下坡請切入低速擋輔助制動，並留意對向超車機車。',
          JA: 'パトンからカタへ向かう道路はアップダウンが激しいため、下り坂ではシフトダウンを活用し慎重に運転してください。',
          ES: 'Pendientes pronunciadas entre Patong y Kata. Usa marchas cortas en bajadas y cuidado con las motos.',
          KO: '빠통과 카타 사이 도로는 경사가 급하므로 내리막길에서 저단 기어를 사용하고 오토바이에 주의하세요.',
        },
      },
    ],
  },

  // Malaysia - Langkawi
  {
    cityId: 'langkawi',
    citySlug: 'langkawi',
    marketSlug: 'malaysia',
    cityKey: 'langkawi',
    localizedNames: {
      EN: 'Langkawi',
      ZH: '蘭卡威',
      JA: 'ランカウイ',
      ES: 'Langkawi',
      KO: '랑카위',
    },
    seoTitles: {
      EN: 'Langkawi Car Rental | Airport & Kuah Jetty Pickup | TrustGo',
      ZH: '蘭卡威租車自駕 | 蘭卡威機場與瓜鎮碼頭門店預訂 | TrustGo',
      JA: 'ランカウイレンタカー予約 | 空港・クア桟橋店舗 | TrustGo',
      ES: 'Alquiler de coches en Langkawi | Aeropuerto y muelle de Kuah | TrustGo',
      KO: '랑카위 렌터카 예약 | 공항 및 쿠아 제티 지점 | TrustGo',
    },
    seoDescriptions: {
      EN: 'Rent a car in Langkawi with TrustGo. Stations at Langkawi International Airport (LGK) and Kuah Jetty. Easy driving on duty-free island highways.',
      ZH: 'TrustGo 蘭卡威租車：直營覆蓋國際機場與瓜鎮客運碼頭，收費透明、取還靈活。自在穿梭天空之橋、珍南海灘與丹絨魯黑沙灘。',
      JA: 'ランカウイ国際空港（LGK）およびクア桟橋で受け取り可能。免税の島でスカイブリッジやビーチへの快適ドライブを満喫。',
      ES: 'Alquiler de coches en Langkawi con TrustGo en aeropuerto y muelle de ferris.',
      KO: 'TrustGo 랑카위 렌터카. 랑카위 공항 및 쿠아 제티 지점에서 스카이브릿지, 체낭 비치로 드라이브를 즐기세요.',
    },
    h1: {
      EN: 'Car rental in Langkawi',
      ZH: '在蘭卡威租車',
      JA: 'ランカウイのレンタカー',
      ES: 'Alquiler de coches en Langkawi',
      KO: '랑카위 렌터카',
    },
    intro: {
      EN: 'Malaysia legendary duty-free island. With toll-free wide coastal ring roads and minimal traffic outside peak festivals, Langkawi is one of the easiest and most relaxing driving destinations in Southeast Asia.',
      ZH: '馬來西亞著名的免稅度假勝地。島上環島公路免費且路況寬敞良好，車流量適中，是東南亞最悠閒愜意的自駕天堂之一。',
      JA: '免税の島ランカウイ。信号が少なく交通量も落ち着いており、東南アジア屈指の快適でリラックスできるドライブが楽しめます。',
      ES: 'Isla libre de impuestos con carreteras costeras tranquilas y sin peajes. Ideal para conducir relajadamente.',
      KO: '말레이시아의 면세 휴양 섬 랑카위. 통행료 없는 쾌적한 해안 순환도로를 따라 여유로운 드라이브를 즐기세요.',
    },
    relatedCitySlugs: [],
    reviewSummary: {
      averageRating: 4.9,
      reviewCount: 31,
    },
    reviews: [
      {
        reviewId: 'rev-lgk-001',
        pickupCityId: 'langkawi',
        pickupStoreCode: 'LGK01',
        rating: 5,
        publishedAt: '2026-08',
        vehicleGroup: {
          EN: 'Compact Sedan',
          ZH: '經濟型轎車',
          JA: 'コンパクトセダン',
          ES: 'Sedán compacto',
          KO: '컴팩트 세단',
        },
        originalLocale: 'zh',
        originalText: '蘭卡威租車太方便了，機場一出來就取到了車。全島開車都很舒服，停車也很方便，強烈推薦！',
        localizedText: {
          EN: 'Renting a car in Langkawi was so convenient! Got the car right outside the airport. Driving across the island was super relaxing with easy parking.',
          ZH: '蘭卡威租車太方便了，機場一出來就取到了車。全島開車都很舒服，停車也很方便，強烈推薦！',
          JA: 'ランカウイでのレンタカーは最高でした。空港出口ですぐ受取でき、島内の運転も快適で駐車も楽々でした。',
          ES: 'Comodísimo alquilar en Langkawi. Coche recogido al salir del aeropuerto y aparcamiento fácil.',
          KO: '랑카위 렌터카가 정말 편리했습니다. 공항 나오자마자 인수했고 섬 전체 운전과 주차가 너무 쾌적했습니다!',
        },
      },
    ],
    tips: [
      {
        id: 'lgk-tip-toll-free',
        category: 'toll',
        reviewedAt: '2026-09-01',
        title: {
          EN: 'Toll-Free Ring Road & Free Island Parking',
          ZH: '全島環島公路免費與便利停車',
          JA: '通行料無料の環状道路と無料駐車場',
          ES: 'Carreteras sin peaje y aparcamiento gratuito',
          KO: '무료 순환도로 및 편리한 주차 환경',
        },
        description: {
          EN: 'All roads in Langkawi are completely toll-free. Most public attractions, beaches, and night markets provide free or very cheap parking.',
          ZH: '蘭卡威全島道路完全免收過路通行費。絕大多數海灘、景點及免稅商場均設有充裕的免費或低收費停車位。',
          JA: '島内の道路はすべて通行無料です。観光地やビーチの多くで無料駐車場が利用できます。',
          ES: 'No hay peajes en toda la isla y la mayoría de playas disponen de aparcamiento gratuito.',
          KO: '랑카위 전역 도로 통행료가 무료이며 대부분의 관광지와 해변에 무료 주차가 가능합니다.',
        },
      },
    ],
  },
];

// ----------------------------------------------------------------------
// 3. Helper Query Functions
// ----------------------------------------------------------------------

export function getLandingMarket(marketSlug: string): MarketLandingConfig | undefined {
  const norm = marketSlug.trim().toLowerCase();
  return marketLandingConfigs.find((m) => m.marketSlug === norm);
}

export function getLandingCity(marketSlug: string, citySlug: string): CityLandingConfig | undefined {
  const mNorm = marketSlug.trim().toLowerCase();
  const cNorm = citySlug.trim().toLowerCase();
  return cityLandingConfigs.find((c) => c.marketSlug === mNorm && c.citySlug === cNorm);
}

export function getCityStores(citySlug: string): LocationCard[] {
  const norm = citySlug.trim().toLowerCase();
  return locationCards.filter((card) => {
    const cardCity = getLocationCity(card);
    return cardCity === norm;
  });
}

export function getAllLandingMarketSlugs(): string[] {
  return marketLandingConfigs.map((m) => m.marketSlug);
}

export function getAllLandingCityPaths(): Array<{ market: string; city: string }> {
  return cityLandingConfigs.map((c) => ({
    market: c.marketSlug,
    city: c.citySlug,
  }));
}

export function getAllLandingStorePaths(): Array<{ market: string; city: string; store: string }> {
  const paths: Array<{ market: string; city: string; store: string }> = [];

  locationCards.forEach((card) => {
    if (!isLocationIndexable(card)) return;
    const country = getLocationCountry(card);
    const city = getLocationCity(card);
    if (city === 'other') return;

    // Verify market & city mapping
    const market = marketLandingConfigs.find((m) => m.countryKey === country);
    if (!market) return;

    const matchedCity = cityLandingConfigs.find((c) => c.citySlug === city && c.marketSlug === market.marketSlug);
    if (!matchedCity) return;

    paths.push({
      market: market.marketSlug,
      city: matchedCity.citySlug,
      store: card.slug,
    });
  });

  return paths;
}

export function getStoreByLandingSlug(
  marketSlug: string,
  citySlug: string,
  storeSlug: string
): LocationCard | undefined {
  const mNorm = marketSlug.trim().toLowerCase();
  const cNorm = citySlug.trim().toLowerCase();
  const sNorm = storeSlug.trim().toLowerCase();

  return locationCards.find((card) => {
    if (card.slug !== sNorm && card.code.toLowerCase() !== sNorm) return false;
    const country = getLocationCountry(card);
    const city = getLocationCity(card);
    const market = marketLandingConfigs.find((m) => m.countryKey === country);
    return market?.marketSlug === mNorm && city === cNorm;
  });
}
