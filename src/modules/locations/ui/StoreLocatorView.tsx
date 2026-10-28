'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  MapPin,
  Plane,
  Building2,
  Clock,
  Search,
  RotateCcw,
  List as ListIcon,
  Map as MapIcon,
  ChevronRight,
  ShieldCheck,
  CarFront,
  HelpCircle,
  KeyRound,
  ChevronDown,
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { routeToLanguage } from '@/i18n/locales';
import { FilterChip } from '@/shared/ui/filter-chip';
import { Button } from '@/shared/ui/button';
import { useI18n } from '@/i18n/useI18n';
import { StoreDestinationPicker } from './StoreDestinationPicker';
import { filterLocatorStores, resolveLocatorDestination } from '../domain/store-locator-filters';
import type { StoreLocatorFilterState } from '../domain/types';
import { locationCards } from '../domain/locations-data';
import { storeTypeBadgeCopy, buildStoreBookingUrl } from '../domain/store-formatters';

const StoreLocatorMap = dynamic(
  () => import('./StoreLocatorMap').then((mod) => mod.StoreLocatorMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-muted rounded-card border border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground animate-pulse">
          <MapPin className="w-4 h-4 text-foreground-secondary animate-bounce" />
          <span>Loading interactive map...</span>
        </div>
      </div>
    ),
  }
);

interface StoreLocatorViewProps {
  lang: RouteLanguage;
  initialMarket?: string;
  initialCity?: string;
}

const copy = {
  EN: {
    title: 'Worldwide Hubs & Station Directory',
    allDestinations: 'All Destinations',
    allCities: 'All Cities',
    searchPlaceholder: 'Search by city, airport, store name or address...',
    filterAll: 'All Stations',
    filterAirport: 'Airport Hubs',
    filterCity: 'Downtown Depots',
    filterSelfService: '24/7 Smart Keybox',
    filterOneWay: 'One-Way Rental',
    storesFound: (n: number) => `Found ${n} verified rental stations`,
    noResultsTitle: 'No rental stations found',
    noResultsHint: 'Try adjusting your destination filter or search keywords.',
    resetFilters: 'Reset filters',
    bookNow: 'Book Now',
    storeDetails: 'Store Details',
    googleMaps: 'Google Maps Directions',
    listView: 'List View',
    mapView: 'Interactive Map',
    // Three-tier Destinations Directory
    hierarchyKicker: 'DESTINATIONS HIERARCHY DIRECTORY',
    hierarchyTitle: 'All Destinations & Station Directory',
    hierarchySubtitle:
      'Explore our network across Asia-Pacific: Country/Market → City → Verified Stations.',
    hierarchyLevelCountry: 'Level 1: Country / Market',
    hierarchyLevelCity: 'Level 2: Service Cities',
    hierarchyLevelStores: 'Level 3: Verified Stations',
    viewAllStoresInCity: 'View on Map',
    stationsCount: (n: number) => `${n} stations`,
    citiesCount: (n: number) => `${n} cities`,
    whyChooseTitle: 'Why Choose TrustGo Rental Hubs?',
    whyChooseSubtitle:
      'Travel with confidence with transparent pricing, guaranteed vehicle condition, and full multilingual assistance.',
    whyCards: [
      {
        title: 'Upfront Pricing & Modern Fleet',
        desc: 'Clear rates with standard insurance and mileage included. Choose from compact cars, SUVs, and spacious family MPVs.',
      },
      {
        title: 'Seamless Terminal & Contactless Pickup',
        desc: 'Tailored to your flight schedule with complimentary terminal shuttles or 24/7 self-service smart keyboxes.',
      },
      {
        title: 'Pre-Arrival Guidance & 24/7 Concierge',
        desc: 'Receive station terminal directions, parking bay info, and fuel tips before arrival, backed by 24/7 road concierge.',
      },
    ],
    faqTitle: 'Rental Station FAQs',
    faqs: [
      {
        q: 'How do I pick up my vehicle at an airport location?',
        a: 'Select your arrival airport and dates to reserve. Upon arrival, proceed to the terminal service counter or board our complimentary TrustGo express shuttle (3–5 minutes) outside the arrivals hall. Meeting instructions are detailed in your confirmation.',
      },
      {
        q: 'Can I return the vehicle to a different branch (one-way rental)?',
        a: 'Yes, one-way rentals are supported between major airport hubs and downtown locations within the region. Select a different return station during search; any applicable one-way fee is itemized upfront before booking.',
      },
      {
        q: 'How does 24/7 contactless self-service pickup work?',
        a: 'At participating 24/7 stations, verify your credentials online before arrival to receive your smart keybox access code. Complete a quick digital vehicle checklist on your phone and drive away smoothly.',
      },
      {
        q: 'What documents must I present at the counter?',
        a: 'The primary driver must present a valid passport, original home country driver license, an International Driving Permit (1949 IDP) or official translation, and a physical credit card in the driver name.',
      },
      {
        q: 'Will my vehicle be held if my arrival flight is delayed?',
        a: 'Yes! If you provide your flight number when booking, our local station team tracks flight arrivals in real time. Your car is held free of charge even past normal counter hours.',
      },
    ],
  },
  ZH: {
    title: '全球服務網點與門店索引',
    allDestinations: '全部目的地',
    allCities: '全部城市',
    searchPlaceholder: '搜尋城市、機場、門店名稱或地址...',
    filterAll: '全部門店',
    filterAirport: '機場旗艦店',
    filterCity: '市中心門店',
    filterSelfService: '24/7 自助取還',
    filterOneWay: '支援異地還車',
    storesFound: (n: number) => `共找到 ${n} 間服務門店`,
    noResultsTitle: '未找到符合條件的門店',
    noResultsHint: '請嘗試清除搜尋關鍵字或調整目的地篩選條件。',
    resetFilters: '重置篩選條件',
    bookNow: '立即預訂',
    storeDetails: '查看詳情',
    googleMaps: 'Google 地圖導航',
    listView: '列表模式',
    mapView: '互動地圖',
    // Three-tier Destinations Directory
    hierarchyKicker: '目的地網絡分層索引',
    hierarchyTitle: '全量目的地與門店分層目錄',
    hierarchySubtitle: '按「國家/地區 → 城市 → 門店」三級分層，完整瀏覽 TrustGo 亞太自駕服務網絡。',
    hierarchyLevelCountry: '第一層：國家 / 地區',
    hierarchyLevelCity: '第二層：服務城市',
    hierarchyLevelStores: '第三層：專屬門店',
    viewAllStoresInCity: '地圖定位',
    stationsCount: (n: number) => `${n} 間門店`,
    citiesCount: (n: number) => `${n} 個城市`,
    whyChooseTitle: '為何選擇 TrustGo 門店服務？',
    whyChooseSubtitle: '堅持透明收費、嚴格車況維護與全天候多語言支援，讓自駕旅程輕鬆快樂。',
    whyCards: [
      {
        title: '透明報價與嚴選新車',
        desc: '清晰透明的租金標準，基礎保險全包含。涵蓋實用經濟車、熱門休旅 SUV 及舒適 7-8 人座商務車。',
      },
      {
        title: '航廈無縫接駁與 24/7 智慧取還',
        desc: '依據您的航班時間提供專屬免費穿梭巴士，或透過智慧鑰匙箱享受 24 小時無接觸取還車體驗。',
      },
      {
        title: '抵達前指引與全天候道路救援',
        desc: '出行前獲取航站樓接駁指引、停車場泊位指南與當地交規提醒，並享有 24/7 多語言專屬客服支援。',
      },
    ],
    faqTitle: '門店常見問題解答',
    faqs: [
      {
        q: '在機場門店該如何辦理取車與接駁？',
        a: '抵達機場提領行李後，前往航廈接待櫃檯或在到達大廳外指定站點搭乘 TrustGo 免費專屬接駁車（車程約 3-5 分鐘）。具體接駁站牌位置於預訂確認信中有詳細圖解。',
      },
      {
        q: '是否支援在不同門店異地還車（One-way）？',
        a: '支援。TrustGo 在同一國家/地區的主要機場及市中心門店之間開放異地還車。在搜尋時勾選「異地還車」即可，所有異地手續費均在結帳前透明呈現。',
      },
      {
        q: '24/7 無接觸智慧鑰匙箱取車如何操作？',
        a: '在支援 24/7 自助門店，於出行前完成線上身份與駕照核驗後，即可取得專屬取車泊位號與智慧密碼箱代碼，透過手機完成車況確認後即可啟程。',
      },
      {
        q: '取車時主駕駛人必須出示哪些證件？',
        a: '主駕駛人須出示護照原件、本國有效駕駛執照原件、國際駕照（IDP）或法定官方翻譯件，以及主駕駛人本人名下實體信用卡進行押金預授權。',
      },
      {
        q: '若抵達航班延誤晚到，預訂會被取消嗎？',
        a: '若在預訂時填寫了抵達航班號，門店將即時追蹤航班動態。凡填有航班號的有效預訂，即使晚於常規營業時間，門店亦會為您免費保留車輛或切換為 24/7 智慧鑰匙箱取車。',
      },
    ],
  },
  JA: {
    title: '営業所一覧・インタラクティブマップ',
    allDestinations: 'すべての目的地',
    allCities: 'すべての都市',
    searchPlaceholder: '都市、空港、営業所名または住所で検索...',
    filterAll: 'すべての店舗',
    filterAirport: '空港ハブ',
    filterCity: '市内・駅前店舗',
    filterSelfService: '24時間スマート受取',
    filterOneWay: 'ワンウェイ（乗り捨て）',
    storesFound: (n: number) => `該当する営業所 ${n} 件`,
    noResultsTitle: '条件に一致する営業所が見つかりません',
    noResultsHint: '検索キーワードを変更するか、フィルターをリセットしてください。',
    resetFilters: 'フィルターをリセット',
    bookNow: '予約する',
    storeDetails: '店舗詳細',
    googleMaps: 'Google マップ案内',
    listView: 'リスト表示',
    mapView: '地図表示',
    // Three-tier Destinations Directory
    hierarchyKicker: '目的地階層ディレクトリ',
    hierarchyTitle: '全目的地・営業所インデックス',
    hierarchySubtitle:
      '「国・地域 → 都市 → 営業所」の3階層でTrustGoのアジア太平洋自駕ネットワークをご確認いただけます。',
    hierarchyLevelCountry: '第1層：国・地域',
    hierarchyLevelCity: '第2層：対象都市',
    hierarchyLevelStores: '第3層：営業所一覧',
    viewAllStoresInCity: '地図で見る',
    stationsCount: (n: number) => `${n} 店舗`,
    citiesCount: (n: number) => `${n} 都市`,
    whyChooseTitle: 'TrustGo営業所が選ばれる理由',
    whyChooseSubtitle:
      '明確な料金体系、安心の整備車両、多言語ロードサポートで快適なドライブを支えます。',
    whyCards: [
      {
        title: '明朗会計と厳選フリート',
        desc: '基本補償込みの安心プラン。コンパクトカーからSUV、ミニバンまで豊富な車種をラインナップ。',
      },
      {
        title: '空港送迎＆24時間セルフ受取',
        desc: 'フライトに合わせた無料シャトルや、夜間・早朝もスムーズに出発できるスマートキーボックス完備。',
      },
      {
        title: '出発前ガイドと多言語サポート',
        desc: 'アクセス方法、駐車ベイ案内、交通ルールを事前にお届けし、24時間安心の多言語対応を提供。',
      },
    ],
    faqTitle: '営業所のご利用に関するよくある質問',
    faqs: [
      {
        q: '空港店舗での受取・送迎の流れを教えてください。',
        a: '空港到着後、ターミナル内受付または指定の乗り場よりTrustGo無料送迎シャトル（約3〜5分）をご利用ください。乗り場の詳細は予約確認メールに記載されています。',
      },
      {
        q: '別の営業所への乗り捨て（ワンウェイレンタル）は可能ですか？',
        a: 'はい、同エリア内の主要空港・市内拠点間で乗り捨てが可能です。検索時に返却場所を指定してご予約ください。',
      },
      {
        q: '24時間スマートキー受取はどのように利用しますか？',
        a: '事前オンライン確認を完了すると、スマートキーボックスの暗証番号が発行されます。アプリで車両状態を確認後、すぐにご出発いただけます。',
      },
      {
        q: '出発当日に必要な書類は何ですか？',
        a: '主運転者様の有効なパスポート、本国免許証原本、1949年ジュネーブ条約国際免許証（または公式日本語翻訳文）、およびご本人名義のクレジットカードをご用意ください。',
      },
      {
        q: 'フライトが遅延した場合、予約はどうなりますか？',
        a: '便名をご登録いただいている場合、フライト到着状況を監視し無料で車両を確保いたします。',
      },
    ],
  },
  ES: {
    title: 'Directorio de Oficinas y Mapa',
    allDestinations: 'Todos los destinos',
    allCities: 'Todas las ciudades',
    searchPlaceholder: 'Buscar ciudad, aeropuerto, oficina o dirección...',
    filterAll: 'Todas',
    filterAirport: 'Aeropuertos',
    filterCity: 'Centro ciudad',
    filterSelfService: 'Smart Keybox 24/7',
    filterOneWay: 'Solo ida',
    storesFound: (n: number) => `${n} oficinas encontradas`,
    noResultsTitle: 'No se encontraron oficinas',
    noResultsHint: 'Prueba a cambiar tus filtros de búsqueda.',
    resetFilters: 'Restablecer filtros',
    bookNow: 'Reservar coche',
    storeDetails: 'Ver detalles',
    googleMaps: 'Indicaciones en Google Maps',
    listView: 'Lista',
    mapView: 'Mapa',
    // Three-tier Destinations Directory
    hierarchyKicker: 'DIRECTORIO JERÁRQUICO DE DESTINOS',
    hierarchyTitle: 'Directorio completo de destinos y oficinas',
    hierarchySubtitle:
      'Explora nuestra red por niveles: País/Mercado → Ciudad → Oficinas verificadas.',
    hierarchyLevelCountry: 'Nivel 1: País o región',
    hierarchyLevelCity: 'Nivel 2: Ciudades',
    hierarchyLevelStores: 'Nivel 3: Oficinas verificadas',
    viewAllStoresInCity: 'Ver en mapa',
    stationsCount: (n: number) => `${n} oficinas`,
    citiesCount: (n: number) => `${n} ciudades`,
    whyChooseTitle: '¿Por qué elegir TrustGo?',
    whyChooseSubtitle:
      'Tarifas transparentes, vehículos garantizados y asistencia multilingüe continua.',
    whyCards: [
      {
        title: 'Precios claros y flota moderna',
        desc: 'Tarifas con seguro básico incluido. Desde utilitarios económicos hasta SUV familiares.',
      },
      {
        title: 'Lanzadera de aeropuerto y autoservicio 24/7',
        desc: 'Servicio de autobús lanzadera gratuito y recogida autónoma con taquillas inteligentes.',
      },
      {
        title: 'Guía previa y soporte en carretera',
        desc: 'Recibe indicaciones de terminal y normas locales antes de viajar, con soporte 24/7.',
      },
    ],
    faqTitle: 'Preguntas frecuentes sobre oficinas',
    faqs: [
      {
        q: '¿Cómo recojo el coche en una oficina de aeropuerto?',
        a: 'Al aterrizar, dirígete al punto de encuentro indicado y toma la lanzadera gratuita de TrustGo (3-5 min).',
      },
      {
        q: '¿Se permite la devolución en otra oficina (solo ida)?',
        a: 'Sí, disponible entre oficinas principales de la misma región.',
      },
      {
        q: '¿Cómo funciona la recogida autónoma 24/7?',
        a: 'Valida tu permiso en línea antes de la llegada para recibir el código de taquilla inteligente.',
      },
      {
        q: '¿Qué documentación se necesita?',
        a: 'Pasaporte en vigor, carnet de conducir nacional, Permiso Internacional (IDP 1949) y tarjeta de crédito.',
      },
      {
        q: '¿Qué ocurre si el vuelo se retrasa?',
        a: 'Si indicas tu número de vuelo, monitorizamos el aterrizaje y reservamos tu coche sin coste adicional.',
      },
    ],
  },
  KO: {
    title: '글로벌 지점 및 대여소 디렉토리',
    allDestinations: '전체 목적지',
    allCities: '전체 도시',
    searchPlaceholder: '도시, 공항, 지점명 또는 주소 검색...',
    filterAll: '전체 지점',
    filterAirport: '공항 거점',
    filterCity: '도심 지점',
    filterSelfService: '24시간 스마트 키박스',
    filterOneWay: '편도 대여',
    storesFound: (n: number) => `총 ${n}개 지점 검색됨`,
    noResultsTitle: '일치하는 지점이 없습니다',
    noResultsHint: '필터 조건을 변경하거나 검색어를 재설정해 주세요.',
    resetFilters: '필터 초기화',
    bookNow: '지금 예약',
    storeDetails: '지점 상세',
    googleMaps: 'Google 지도 길찾기',
    listView: '목록 보기',
    mapView: '지도 보기',
    // Three-tier Destinations Directory
    hierarchyKicker: '목적지 계층형 디렉토리',
    hierarchyTitle: '전체 목적지 및 지점 계층형 디렉토리',
    hierarchySubtitle:
      '국가/지역 → 도시 → 지점 3단계 계층 구조로 TrustGo의 아시아 태평양 네트워크를 확인하세요.',
    hierarchyLevelCountry: '1단계: 국가 및 지역',
    hierarchyLevelCity: '2단계: 서비스 도시',
    hierarchyLevelStores: '3단계: 대여 지점',
    viewAllStoresInCity: '지도에서 보기',
    stationsCount: (n: number) => `${n}개 지점`,
    citiesCount: (n: number) => `${n}개 도시`,
    whyChooseTitle: 'TrustGo 지점을 선택하는 이유',
    whyChooseSubtitle:
      '숨겨진 비용 없는 투명한 가격, 철저한 차량 관리, 24시간 다국어 지원으로 안심 여행을 보장합니다.',
    whyCards: [
      {
        title: '투명한 요금제와 최신 정비 차량',
        desc: '기본 보상 포함 투명한 요금. 실속형 경차부터 패밀리 SUV, 미니밴까지 완비.',
      },
      {
        title: '공항 무료 셔틀 및 24시간 비대면 인수',
        desc: '항공편 맞춤 무료 셔틀과 스마트 키박스를 통한 24시간 자유로운 비대면 출차 지원.',
      },
      {
        title: '출발 전 맞춤 안내와 24시간 안심 로드 지원',
        desc: '터미널 셔틀 정류장, 주차 구역, 현지 교통 팁을 사전에 안내해 드립니다.',
      },
    ],
    faqTitle: '지점 대여 관련 자주 묻는 질문',
    faqs: [
      {
        q: '공항 지점에서 차량을 어떻게 수령하나요?',
        a: '입국장 밖 전용 정류장에서 TrustGo 무료 셔틀버스(약 3~5분 소요)에 탑승하여 이동합니다.',
      },
      {
        q: '다른 지점으로 반납(편도 대여)이 가능한가요?',
        a: '네, 동일 권역 내 주요 공항 및 시내 지점 간 편도 대여가 지원됩니다.',
      },
      {
        q: '24시간 스마트 비대면 인수는 어떻게 진행되나요?',
        a: '사전 온라인 확인 완료 시 스마트 키박스 비밀번호가 발송되며, 비대면으로 즉시 출발 가능합니다.',
      },
      {
        q: '수령 시 지참해야 할 서류는 무엇인가요?',
        a: '여권 원본, 국내 운전면허증 원본, 1949 제네바 협약 국제운전면허증(IDP), 본인 명의 신용카드입니다.',
      },
      {
        q: '항공편이 지연되면 예약이 취소되나요?',
        a: '항공편명을 등록하신 경우 착륙 상태를 실시간 모니터링하여 안전하게 차량을 보관합니다.',
      },
    ],
  },
};

export function StoreLocatorView({
  lang,
  initialMarket = 'all',
  initialCity = 'all',
}: StoreLocatorViewProps) {
  const language = routeToLanguage(lang);
  const t = copy[language] || copy.EN;
  const { t: uiText } = useI18n(lang);

  const [filterState, setFilterState] = useState<StoreLocatorFilterState>({
    ...resolveLocatorDestination(initialMarket, initialCity),
    airport: false,
    cityStore: false,
    selfServiceOnly: false,
    oneWayOnly: false,
    searchQuery: '',
  });

  const [requestedStoreCode, setSelectedStoreCode] = useState<string | null>(
    locationCards[0]?.code ?? null
  );
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // The sticky map follows the actual filter height, including translated text wrapping.
  useEffect(() => {
    const filters = filtersRef.current;
    if (!filters) return;
    const update = () =>
      rootRef.current?.style.setProperty(
        '--locator-filter-height',
        `${filters.getBoundingClientRect().height}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(filters);
    return () => observer.disconnect();
  }, []);

  const filteredStores = useMemo(
    () => filterLocatorStores(locationCards, filterState, language),
    [filterState, language]
  );
  // Keep map and list selection valid when destination or services change.
  const selectedStoreCode = filteredStores.some((store) => store.code === requestedStoreCode)
    ? requestedStoreCode
    : (filteredStores[0]?.code ?? null);

  const handleSelectStore = useCallback((storeCode: string) => {
    setSelectedStoreCode(storeCode);
  }, []);

  const handleResetFilters = () => {
    setFilterState({
      market: 'all',
      city: 'all',
      airport: false,
      cityStore: false,
      selfServiceOnly: false,
      oneWayOnly: false,
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filterState.market !== 'all' ||
    (Boolean(filterState.city) && filterState.city !== 'all') ||
    filterState.airport ||
    filterState.cityStore ||
    filterState.selfServiceOnly ||
    filterState.oneWayOnly ||
    Boolean(filterState.searchQuery);

  return (
    <div ref={rootRef} className="bg-background min-h-screen pb-16">
      {/* 1. Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          {t.title}
        </h1>
      </div>

      {/* Destination hierarchy and independent service filters. Only desktop sticks. */}
      <div
        ref={filtersRef}
        className="lg:sticky lg:top-18 z-20 border-b border-border bg-background"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-start lg:px-8">
          <div className="shrink-0 lg:max-w-64">
            <StoreDestinationPicker
              lang={lang}
              market={filterState.market}
              city={filterState.city}
              onSelect={(market, city) => setFilterState((prev) => ({ ...prev, market, city }))}
            />
          </div>
          <fieldset className="min-w-0 lg:flex-1">
            <legend className="sr-only">{uiText('locator_service_filters')}</legend>
            <div className="-m-1 flex snap-x items-center gap-2 overflow-x-auto p-1 lg:flex-wrap">
              {(
                [
                  { key: 'airport', label: 'locator_airport', Icon: Plane },
                  { key: 'cityStore', label: 'locator_downtown', Icon: Building2 },
                  { key: 'selfServiceOnly', label: 'locator_self_service', Icon: KeyRound },
                  { key: 'oneWayOnly', label: 'locator_one_way', Icon: RotateCcw },
                ] as const
              ).map(({ key, label, Icon }) => (
                <FilterChip
                  key={key}
                  selected={filterState[key]}
                  onClick={() => setFilterState((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className="h-11 snap-start"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {uiText(label)}
                </FilterChip>
              ))}
            </div>
          </fieldset>
          <div className="relative w-full lg:w-64 lg:shrink-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={filterState.searchQuery}
              onChange={(event) =>
                setFilterState((prev) => ({ ...prev, searchQuery: event.target.value }))
              }
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="h-11 w-full rounded-control border border-input bg-background pr-4 pl-10 text-base text-foreground placeholder:text-foreground-disabled transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
        <section className="space-y-4">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-foreground-secondary">
            <span role="status" aria-live="polite" aria-atomic="true">
              {t.storesFound(filteredStores.length)}
            </span>
            {hasActiveFilters && (
              <Button variant="text" onClick={handleResetFilters} className="h-11 min-h-11 px-2">
                {t.resetFilters}
              </Button>
            )}
          </div>
          {/* Mobile View Toggle */}
          <div className="lg:hidden flex rounded-full bg-accent p-1">
            <button
              type="button"
              onClick={() => setMobileTab('list')}
              aria-pressed={mobileTab === 'list'}
              className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                mobileTab === 'list'
                  ? 'bg-background text-foreground shadow-raised'
                  : 'text-foreground-secondary'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              <span>{t.listView}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('map')}
              aria-pressed={mobileTab === 'map'}
              className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                mobileTab === 'map'
                  ? 'bg-background text-foreground shadow-raised'
                  : 'text-foreground-secondary'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{t.mapView}</span>
            </button>
          </div>

          {/* 3. Main Split View: Left Store List + Right Interactive Leaflet Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Stores List */}
            <div
              ref={listRef}
              className={`lg:col-span-6 xl:col-span-5 space-y-4 ${
                mobileTab === 'map' ? 'hidden lg:block' : 'block'
              }`}
            >
              {filteredStores.length === 0 ? (
                <div className="bg-background rounded-card p-8 border border-border text-center space-y-3">
                  <Building2 className="w-10 h-10 text-foreground-disabled mx-auto" />
                  <h3 className="text-base font-bold text-foreground">{t.noResultsTitle}</h3>
                  <p className="text-xs text-foreground-secondary">{t.noResultsHint}</p>
                  <Button onClick={handleResetFilters}>{t.resetFilters}</Button>
                </div>
              ) : (
                filteredStores.map((store) => {
                  const isSelected = store.code === selectedStoreCode;
                  const content = store[language] || store.EN;
                  const badges = storeTypeBadgeCopy[language] || storeTypeBadgeCopy.EN;
                  const typeBadge =
                    store.storeType === 'airport' ? badges.airport : badges.downtown;
                  const detailHref = `/${lang}/locations/${store.slug}`;
                  const bookingHref = buildStoreBookingUrl(lang, store.code, content.name);

                  return (
                    <div
                      key={store.code}
                      onClick={() => handleSelectStore(store.code)}
                      className={`bg-background rounded-card p-5 border transition-colors cursor-pointer relative ${
                        isSelected
                          ? 'border-brand ring-1 ring-brand'
                          : 'border-border hover:border-border-strong'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-secondary">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          {store.storeType === 'airport' ? (
                            <Plane className="w-3.5 h-3.5" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5" />
                          )}
                          {typeBadge}
                        </span>
                        {store.selfService && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-foreground">{badges.selfService}</span>
                          </>
                        )}
                        {store.oneWay && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{t.filterOneWay}</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-base font-semibold text-foreground leading-snug">
                        <Link
                          href={detailHref}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline underline-offset-4"
                        >
                          {content.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-foreground-secondary line-clamp-1">
                        {content.address}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground-secondary">
                        <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="truncate tabular-nums">{store.hours}</span>
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Button asChild variant="text" className="h-11 min-h-11 gap-0.5 px-0">
                          <Link href={detailHref} onClick={(e) => e.stopPropagation()}>
                            {t.storeDetails}
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="secondary"
                          className="h-11 min-h-11 gap-1.5 px-4 hover:border-primary hover:bg-primary hover:text-primary-foreground active:border-primary-hover active:bg-primary-hover active:text-primary-foreground"
                        >
                          <a href={bookingHref} onClick={(e) => e.stopPropagation()}>
                            <CarFront className="w-4 h-4" aria-hidden="true" />
                            <span>{t.bookNow}</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Sticky Interactive Leaflet Map */}
            <div
              className={`lg:col-span-6 xl:col-span-7 lg:sticky ${
                mobileTab === 'list' ? 'hidden lg:block' : 'block'
              }`}
              style={{ top: 'calc(4.5rem + var(--locator-filter-height, 0px) + 1rem)' }}
            >
              <div className="h-120 lg:h-170 w-full rounded-card overflow-hidden border border-border relative">
                <StoreLocatorMap
                  stores={filteredStores}
                  selectedStoreCode={selectedStoreCode}
                  onSelectStore={handleSelectStore}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        </section>
        {/* 4. Value Propositions Bar */}
        <div className="pt-8 pb-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              {t.whyChooseTitle}
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-1.5">
              {t.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.whyCards.map((card, i) => (
              <div key={i} className="space-y-2.5">
                <div className="w-10 h-10 rounded-control bg-muted text-foreground flex items-center justify-center font-bold">
                  {i === 0 ? (
                    <CarFront className="w-5 h-5 text-foreground-secondary" />
                  ) : i === 1 ? (
                    <KeyRound className="w-5 h-5 text-foreground-secondary" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-foreground-secondary" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground">{card.title}</h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Global Station FAQs Section */}
        <div className="bg-background rounded-card p-6 sm:p-8 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-foreground-secondary" />
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {t.faqTitle}
            </h2>
          </div>

          <div className="divide-y divide-border">
            {t.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground-secondary shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-foreground-secondary mt-2.5 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreLocatorView;
