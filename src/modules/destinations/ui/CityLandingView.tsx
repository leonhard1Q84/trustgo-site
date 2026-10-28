
'use client';

const storeTypeCopy = {
  airport: { EN: 'Airport location', ZH: '機場店', JA: '空港店', ES: 'Aeropuerto', KO: '공항 지점' },
  train: { EN: 'Station location', ZH: '火車站店', JA: '駅前店', ES: 'Estación', KO: '역 지점' },
  city: { EN: 'City location', ZH: '市中心店', JA: '市内店', ES: 'Ciudad', KO: '도심 지点' },
};
function buildRentPath(lang: RouteLanguage, options: any) {
  const p = new URLSearchParams();
  if (options?.pickupLocation) p.set('pickup', options.pickupLocation);
  if (options?.pickupLocationCode) p.set('pickupCode', options.pickupLocationCode);
  return `/${lang}/rent?${p.toString()}`;
}

import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Clock,
  Phone,
  CarFront,
  ArrowRight,
  Star,
  Building2,
  Map as MapIcon,
  List as ListIcon,
  Users,
  Search,
  Navigation,
} from 'lucide-react';



import { SearchBar } from '@/modules/rental-search/ui/search-bar';
import ValuePropsBar from './ValuePropsBar';
import CityStoreMap from './CityStoreMap';
import type { CityLandingConfig, MarketLandingConfig } from '../domain/landing-pages-data';
import { cityLandingConfigs, marketHeroImages } from '../domain/landing-pages-data';
import {
  
  type LocationCard,
} from '@/modules/locations/domain/types';
import { getStoreByCode, calculateDistanceKm } from '@/modules/destination-search/store-directory';
import { routeToLanguage, type RouteLanguage, type Language } from '@/i18n/locales';


const vehicleCompactHatchback = { src: '/images/vehicles/compact-hatchback.jpg' };
const vehicleCompactSuv = { src: '/images/vehicles/compact-suv.jpg' };
const vehicleComfortSedan = { src: '/images/vehicles/comfort-sedan.jpg' };
const vehicleFamilyMpv = { src: '/images/vehicles/family-mpv.jpg' };

interface CityLandingViewProps {
  market: MarketLandingConfig;
  city: CityLandingConfig;
  stores: LocationCard[];
  lang: RouteLanguage;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm == null) return '';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  if (distanceKm < 100) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm).toLocaleString()} km`;
}

function getCityRentalAnchor(cityName: string, language: Language): string {
  switch (language) {
    case 'ZH':
      return `${cityName}租車`;
    case 'JA':
      return `${cityName} レンタカー`;
    case 'ES':
      return `Alquiler de coches en ${cityName}`;
    case 'KO':
      return `${cityName} 렌터카`;
    case 'EN':
    default:
      return `${cityName} Car Rental`;
  }
}

function CityLandingContent({
  market,
  city,
  stores,
  lang,
}: CityLandingViewProps) {
  const [selectedStoreCode, setSelectedStoreCode] = useState<string | null>(stores[0]?.code ?? null);
  const [showOriginalReview, setShowOriginalReview] = useState<Record<string, boolean>>({});
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const handleSelectStore = (storeCode: string) => {
    setSelectedStoreCode(storeCode);
  };
  
  const language = routeToLanguage(lang);
  const marketName = market.localizedNames[language] ?? market.localizedNames.EN;
  const cityName = city.localizedNames[language] ?? city.localizedNames.EN;



  // Mobile view toggle: 'list' | 'map'
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Geolocation & Silent Distance Sorting State
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestUserLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (error) => {
        console.info('Geolocation access not granted or unavailable:', error?.message);
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, []);

  // Request user location immediately on page entry silently
  React.useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  // Attach distanceKm to each store
  const storesWithDistance = React.useMemo(() => {
    return stores.map((store) => {
      const snapshot = getStoreByCode(store.code);
      let distanceKm: number | null = null;
      if (userCoords && snapshot?.point) {
        distanceKm = calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          snapshot.point.latitude,
          snapshot.point.longitude
        );
      }
      return {
        ...store,
        distanceKm,
      };
    });
  }, [stores, userCoords]);

  // Silently sort stores by distance when userCoords are available; otherwise default
  const sortedStores = React.useMemo(() => {
    if (userCoords) {
      return [...storesWithDistance].sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }
    return storesWithDistance;
  }, [storesWithDistance, userCoords]);

  // Search Widget State aligned with home page
  const initialStore = stores[0];
  const today = new Date();
  
  const reviewTrackRef = useRef<HTMLDivElement | null>(null);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (!reviewTrackRef.current) return;
    const amount = 380;
    reviewTrackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const toggleReviewOriginal = (reviewId: string) => {
    setShowOriginalReview((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const selectedStore = sortedStores.find((s) => s.code === selectedStoreCode) ?? sortedStores[0];

  // UI Localized strings
  const ui = {
    home: { EN: 'Home', ZH: '首頁', JA: 'ホーム', ES: 'Inicio', KO: '홈' },
    carRental: { EN: 'Car rental', ZH: '租車服務', JA: 'レンタカー', ES: 'Alquiler de coches', KO: '렌터카' },
    carRentalsInMarket: {
      EN: `Car rentals in ${marketName}`,
      ZH: `${marketName} 租車`,
      JA: `${marketName}のレンタカー`,
      ES: `Alquiler de coches en ${marketName}`,
      KO: `${marketName} 렌터카`,
    },
    carRentalsInCity: {
      EN: `Car rentals in ${cityName}`,
      ZH: `${cityName} 租車`,
      JA: `${cityName}のレンタカー`,
      ES: `Alquiler de coches en ${cityName}`,
      KO: `${cityName} 렌터카`,
    },
    searchH1: {
      EN: `${cityName} City car rentals`,
      ZH: `${cityName} 租車自駕服務`,
      JA: `${cityName}のレンタカー予約`,
      ES: `Alquiler de coches en ${cityName}`,
      KO: `${cityName} 렌터카 예약`,
    },
    searchSubtitle: {
      EN: 'Free cancellation up to 48 hours · Transparent pricing',
      ZH: '取車前 48 小時免費取消 · 費用透明無隱藏',
      JA: '出発48時間前までキャンセル無料 · 明瞭な料金体系',
      ES: 'Cancelación gratuita hasta 48h · Tarifas transparentes',
      KO: '픽업 48시간 전 무료 취소 · 투명한 요금',
    },
    sameDropoff: {
      EN: 'Same drop-off',
      ZH: '同店還車',
      JA: '同じ場所で返却',
      ES: 'Mismo lugar de devolución',
      KO: '동일 장소 반납',
    },
    differentDropoff: {
      EN: 'Different drop-off',
      ZH: '異地還車',
      JA: '異なる場所で返却',
      ES: 'Devolución en otro lugar',
      KO: '다른 장소 반납',
    },
    pickupLocation: {
      EN: 'Pick-up location',
      ZH: '取車地點',
      JA: '受け取り場所',
      ES: 'Lugar de recogida',
      KO: '픽업 장소',
    },
    dropoffLocation: {
      EN: 'Drop-off location',
      ZH: '還車地點',
      JA: '返却場所',
      ES: 'Lugar de devolución',
      KO: '반납 장소',
    },
    searchCars: {
      EN: 'Search',
      ZH: '搜尋車輛',
      JA: '検索する',
      ES: 'Buscar',
      KO: '검색',
    },
    // 3 Value props
    vp1Title: {
      EN: 'Flexible rentals',
      ZH: '靈活自駕預訂',
      JA: '柔軟な予約変更',
      ES: 'Alquileres flexibles',
      KO: '유연한 렌탈 예약',
    },
    vp1Desc: {
      EN: 'Cancel or change most bookings for free up to 48 hours before pick-up',
      ZH: '多數車型在取車前 48 小時可免費取消或調整預訂時間',
      JA: '出発48時間前までほとんどの予約でキャンセル・変更無料',
      ES: 'Cancela o modifica la mayoría de reservas gratis hasta 48h antes',
      KO: '픽업 48시간 전까지 대부분의 예약을 무료로 취소 및 변경 가능',
    },
    vp2Title: {
      EN: 'No hidden fees',
      ZH: '透明無隱藏費用',
      JA: '明瞭な料金体系',
      ES: 'Sin cargos ocultos',
      KO: '숨겨진 수수료 없음',
    },
    vp2Desc: {
      EN: 'Know exactly what you are paying with all taxes and insurance items upfront',
      ZH: '費用明細一目了然，清晰列示各項保障與必備稅費',
      JA: '税金や保険を含む総額を事前にわかりやすく提示します',
      ES: 'Conoce exactamente lo que pagas desde el primer momento',
      KO: '모든 세금과 보험 항목을 사전에 투명하게 확인하세요',
    },
    vp3Title: {
      EN: 'Verified customer reviews',
      ZH: '真實用車好評',
      JA: '本物の口コミ評価',
      ES: 'Opiniones verificadas',
      KO: '검증된 고객 후기',
    },
    vp3Desc: {
      EN: '100% verified real customer rental experiences and feedback',
      ZH: '均來自真實完成租車訂單的用戶反饋與評價',
      JA: '実際に利用を完了したお客様からの本物の評価です',
      ES: 'Valoraciones de clientes reales que completaron su alquiler',
      KO: '실제 렌탈을 완료한 이용자의 100% 검증된 후기',
    },
    // Store List & Map
    storesCardTitle: {
      EN: `${cityName} City`,
      ZH: `${cityName} 門店與地圖導航`,
      JA: `${cityName}の店舗一覧とマップ`,
      ES: `${cityName}`,
      KO: `${cityName} 지점 및 지도`,
    },
    storesAvailable: {
      EN: `${stores.length} locations available`,
      ZH: `共 ${stores.length} 間服務門店`,
      JA: `${stores.length}店舗利用可能`,
      ES: `${stores.length} oficinas disponibles`,
      KO: `${stores.length}개 지점 이용 가능`,
    },
    reserveBtn: {
      EN: 'Reserve a car rental',
      ZH: '在此預訂租車',
      JA: 'この店舗で予約',
      ES: 'Reservar coche',
      KO: '이 지점에서 예약',
    },
    storeDetails: {
      EN: 'Store details',
      ZH: '門店詳情',
      JA: '店舗詳細',
      ES: 'Detalles de la oficina',
      KO: '지점 상세',
    },
    listView: { EN: 'List', ZH: '列表', JA: 'リスト', ES: 'Lista', KO: '목록' },
    mapView: { EN: 'Map', ZH: '地圖', JA: '地図', ES: 'Mapa', KO: '지도' },
    sortDefault: {
      EN: 'Recommended',
      ZH: '推薦排序',
      JA: 'おすすめ順',
      ES: 'Recomendado',
      KO: '추천순',
    },
    sortByDistance: {
      EN: 'Sort by distance',
      ZH: '按距離排序',
      JA: '距離順',
      ES: 'Ordenar por distancia',
      KO: '거리순 정렬',
    },
    nearestToMe: {
      EN: 'Nearest to me',
      ZH: '離我最近',
      JA: '現在地から近い順',
      ES: 'Más cercano',
      KO: '내 위치에서 가까운 순',
    },
    locating: {
      EN: 'Locating...',
      ZH: '定位中...',
      JA: '位置取得中...',
      ES: 'Localizando...',
      KO: '위치 확인 중...',
    },
    farNotice: {
      EN: 'You appear to be far from this city. Showing stores sorted by distance from your current location.',
      ZH: '您當前位置距離該城市較遠，已按實際距離為您排序。',
      JA: '現在地はこの都市から離れています。実際の距離順に並べ替えました。',
      ES: 'Te encuentras lejos de esta ciudad. Las oficinas se muestran ordenadas por distancia.',
      KO: '현재 위치가 이 도시에서 멀리 떨어져 있습니다. 실제 거리 순으로 정렬되었습니다.',
    },
    // Reviews
    reviewsHeading: {
      EN: 'Car rental user reviews',
      ZH: `${cityName} 租車用戶評價`,
      JA: `${cityName} レンタカーの口コミ`,
      ES: `Opiniones de alquiler en ${cityName}`,
      KO: `${cityName} 렌터카 이용 후기`,
    },
    verifiedRenter: {
      EN: 'Verified renter',
      ZH: '已驗證租車用戶',
      JA: '確認済み利用者',
      ES: 'Cliente verificado',
      KO: '검증된 이용자',
    },
    showMore: {
      EN: 'Show More',
      ZH: '查看更多',
      JA: 'もっと見る',
      ES: 'Ver más',
      KO: '더 보기',
    },
    showLess: {
      EN: 'Show Less',
      ZH: '收起',
      JA: '閉じる',
      ES: 'Menos',
      KO: '접기',
    },
    viewOriginal: {
      EN: 'Original text',
      ZH: '查看原文',
      JA: '原文を見る',
      ES: 'Ver original',
      KO: '원문 보기',
    },
    viewTranslation: {
      EN: 'View translation',
      ZH: '查看翻譯',
      JA: '翻訳を見る',
      ES: 'Ver traducción',
      KO: '번역 보기',
    },
    emptyReviews: {
      EN: 'No city rental reviews yet',
      ZH: '暫無城市租車評論',
      JA: 'この都市のレンタカーレビューはまだありません',
      ES: 'Aún no hay opiniones de alquiler en esta ciudad',
      KO: '아직 이 도시의 렌터카 리뷰가 없습니다',
    },
    popularModelsTitle: {
      EN: `${cityName} popular car rental models`,
      ZH: `${cityName} 熱門租車車型推薦`,
      JA: `${cityName}のおすすめ人気レンタカー車種`,
      ES: `Modelos de alquiler populares en ${cityName}`,
      KO: `${cityName} 인기 렌터카 추천 차량`,
    },
    popularModelsSubtitle: {
      EN: 'The prices listed here will be regularly updated but may still differ from the latest prices offered by the supplier. The price at the time of order shall prevail.',
      ZH: '此處顯示的價格將定期更新，但仍可能與車隊即時報價有所差異，以最終下單時的價格為準。',
      JA: '表示価格は定期的に更新されますが、最新の空車・料金状況により変動する場合があります。最終注文時の価格が適用されます。',
      ES: 'Los precios mostrados se actualizan periódicamente y pueden variar según la disponibilidad. Prevalece el precio al reservar.',
      KO: '표시된 요금은 정기적으로 업데이트되나 실시간 재고에 따라 달라질 수 있으며, 최종 예약 시점의 요금이 적용됩니다.',
    },
    viewAllModels: {
      EN: 'View more car models',
      ZH: '查看更多車型',
      JA: 'すべての車種を見る',
      ES: 'Ver más modelos',
      KO: '더 많은 차량 보기',
    },
    fromPrice: {
      EN: 'from',
      ZH: '起',
      JA: '〜',
      ES: 'desde',
      KO: '부터',
    },
    perDay: {
      EN: '/day',
      ZH: '/天',
      JA: '/日',
      ES: '/día',
      KO: '/일',
    },
    seatsUnit: {
      EN: 'seats',
      ZH: '座',
      JA: '人乗り',
      ES: 'plazas',
      KO: '인승',
    },
    automatic: {
      EN: 'Automatic',
      ZH: '自動擋',
      JA: 'AT',
      ES: 'Automático',
      KO: '자동',
    },
    relatedCities: {
      EN: `Other destinations in ${marketName}`,
      ZH: `${marketName} 其他熱門租車目的地`,
      JA: `${marketName}のその他の人気都市`,
      ES: `Otros destinos en ${marketName}`,
      KO: `${marketName}의 다른 인기 여행지`,
    },
  };

  // Related cities
  const relatedCities = cityLandingConfigs.filter(
    (c) => c.marketSlug === market.marketSlug && c.citySlug !== city.citySlug
  );

  // Popular car models data for this market/city
  const popularCarModels = [
    {
      id: 'compact-hatch',
      name:
        market.marketSlug === 'japan'
          ? 'Toyota Yaris'
          : market.marketSlug === 'taiwan'
          ? 'Toyota Vios'
          : market.marketSlug === 'thailand'
          ? 'Toyota Yaris Ativ'
          : 'Perodua Myvi',
      category: {
        EN: 'Compact Car',
        ZH: '小型家用車',
        JA: 'コンパクト',
        ES: 'Compacto',
        KO: '소형차',
      },
      seats: 5,
      transmission: ui.automatic[language],
      image: vehicleCompactHatchback.src,
      price:
        market.marketSlug === 'japan'
          ? '¥4,500'
          : market.marketSlug === 'taiwan'
          ? 'NT$ 1,380'
          : market.marketSlug === 'thailand'
          ? '฿950'
          : 'RM 120',
    },
    {
      id: 'compact-suv',
      name:
        market.marketSlug === 'japan'
          ? 'Toyota Yaris Cross'
          : market.marketSlug === 'taiwan'
          ? 'Toyota Yaris Cross'
          : market.marketSlug === 'thailand'
          ? 'Honda HR-V'
          : 'Proton X50',
      category: {
        EN: 'Compact SUV',
        ZH: '越野休旅 SUV',
        JA: 'コンパクトSUV',
        ES: 'SUV Compacto',
        KO: '컴팩트 SUV',
      },
      seats: 5,
      transmission: ui.automatic[language],
      image: vehicleCompactSuv.src,
      price:
        market.marketSlug === 'japan'
          ? '¥5,800'
          : market.marketSlug === 'taiwan'
          ? 'NT$ 1,680'
          : market.marketSlug === 'thailand'
          ? '฿1,350'
          : 'RM 190',
    },
    {
      id: 'comfort-sedan',
      name:
        market.marketSlug === 'japan'
          ? 'Toyota Corolla Fielder'
          : market.marketSlug === 'taiwan'
          ? 'Toyota Corolla Altis'
          : market.marketSlug === 'thailand'
          ? 'Toyota Corolla Altis'
          : 'Toyota Vios',
      category: {
        EN: 'Medium Car',
        ZH: '中型舒適轎車',
        JA: 'セダン',
        ES: 'Sedán',
        KO: '중형 세단',
      },
      seats: 5,
      transmission: ui.automatic[language],
      image: vehicleComfortSedan.src,
      price:
        market.marketSlug === 'japan'
          ? '¥6,200'
          : market.marketSlug === 'taiwan'
          ? 'NT$ 1,580'
          : market.marketSlug === 'thailand'
          ? '฿1,200'
          : 'RM 160',
    },
    {
      id: 'family-mpv',
      name:
        market.marketSlug === 'japan'
          ? 'Toyota Voxy'
          : market.marketSlug === 'taiwan'
          ? 'Toyota Sienta'
          : market.marketSlug === 'thailand'
          ? 'Toyota Commuter'
          : 'Toyota Innova',
      category: {
        EN: 'Family MPV',
        ZH: '家庭休旅 MPV',
        JA: 'ミニバン',
        ES: 'Monovolumen MPV',
        KO: '패밀리 MPV',
      },
      seats: 7,
      transmission: ui.automatic[language],
      image: vehicleFamilyMpv.src,
      price:
        market.marketSlug === 'japan'
          ? '¥11,800'
          : market.marketSlug === 'taiwan'
          ? 'NT$ 2,180'
          : market.marketSlug === 'thailand'
          ? '฿2,200'
          : 'RM 280',
    },
  ];

  // Hero background image
  const heroImage = marketHeroImages[market.marketSlug] || '/images/destinations/taiwan-roadtrip.jpg';

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-800 antialiased">
      

      {/* ================================================================= */}
      {/* 1. TOP FULL-WIDTH SCENIC HERO & HOMEPAGE-ALIGNED SEARCH           */}
      {/* ================================================================= */}
      <section className="relative z-30 w-full overflow-visible bg-[#0B2545] text-white pt-20 lg:pt-24 pb-6 sm:pb-8 border-b border-slate-200">
        {/* Destination Scenic Road Trip Photo - Full Width */}
        <img
          src={heroImage}
          alt={`${cityName}, ${marketName}`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Luminous TrustGo Ocean Blue Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-[#0B2545]/50 to-[#0B2545]/20" />

        {/* Content Container (max-w-[80rem] centered) */}
        <div className="relative z-10 mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          {/* Header Text - Compact & Sleek */}
          <div className="max-w-3xl mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              {ui.searchH1[language]}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-white/85">
              {ui.searchSubtitle[language]}
            </p>
          </div>

          {/* Unified Booking Search Widget (Horizontal Hero Bar on PC) */}
          <SearchBar lang={lang} variant="hero" />
        </div>
      </section>

      <main className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
        {/* ================================================================= */}
        {/* 2. VALUE PROPOSITIONS BAR: Desktop only (Preserved for trust)     */}
        {/* ================================================================= */}
        <div className="hidden md:block">
          <ValuePropsBar language={language} />
        </div>

        {/* ================================================================= */}
        {/* 3. POPULAR CAR RENTAL MODELS (OTA Style Inventory Showcase)       */}
        {/* ================================================================= */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {ui.popularModelsTitle[language]}
            </h2>
            <a
              href={`/${lang}/rent/?pickupCode=${stores[0]?.code ?? ''}&returnCode=${stores[0]?.code ?? ''}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#25A5E3] transition-colors"
            >
              <span>{ui.viewAllModels[language]}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* 4 Models Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularCarModels.map((model) => {
              const rentModelUrl = `/${lang}/rent/?pickupCode=${stores[0]?.code ?? ''}&returnCode=${stores[0]?.code ?? ''}`;

              return (
                <a
                  key={model.id}
                  href={rentModelUrl}
                  className="group flex flex-col justify-between rounded-card border border-slate-200 bg-white p-4 transition-all hover:border-slate-300"
                >
                  {/* Vehicle Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-slate-50 flex items-center justify-center">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#25A5E3] transition-colors truncate">
                        {model.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 truncate">
                        {model.category[language]} · {model.seats} {ui.seatsUnit[language]} · {model.transmission}
                      </p>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-extrabold text-slate-900">
                          {model.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          {ui.fromPrice[language]} {ui.perDay[language]}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#25A5E3] transition-colors" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. UNIFIED CONTAINER CARD: STORE LIST + MAP                       */}
        {/* ================================================================= */}
        <section className="overflow-hidden rounded-card bg-white border border-slate-200">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-card bg-sky-50 text-[#25A5E3]">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {ui.storesCardTitle[language]}
                </h2>
                <p className="text-[11px] font-medium text-slate-400">
                  {ui.storesAvailable[language]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile View Switcher (List / Map) */}
              <div className="flex lg:hidden rounded-card bg-slate-100 p-0.5 text-xs font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className={`flex items-center gap-1.5 rounded-card px-2.5 py-1 transition-colors ${
                    mobileView === 'list'
                      ? 'bg-white text-slate-900 border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ListIcon className="h-3.5 w-3.5" />
                  <span>{ui.listView[language]} ({sortedStores.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('map')}
                  className={`flex items-center gap-1.5 rounded-card px-2.5 py-1 transition-colors ${
                    mobileView === 'map'
                      ? 'bg-white text-slate-900 border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  <span>{ui.mapView[language]}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Unified Split Layout (Left: Store List / Right: Embedded Map) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Scrollable Store List */}
            <div
              className={`lg:col-span-6 xl:col-span-5 border-r border-slate-100 max-h-[640px] overflow-y-auto divide-y divide-slate-100 ${
                mobileView === 'map' ? 'hidden lg:block' : 'block'
              }`}
            >
              {sortedStores.map((store) => {
                const isSelected = selectedStoreCode === store.code;
                const storeName = store[language]?.name ?? store.EN.name;
                const storeAddress = store[language]?.address ?? store.EN.address;
                const storeNote = store[language]?.serviceNote ?? store.EN.serviceNote;
                const detailUrl = `/${lang}/car-rental/${market.marketSlug}/${city.citySlug}/${store.slug}/`;
                const rentUrl = `/${lang}/rent/?pickupCode=${store.code}&returnCode=${store.code}&differentDropoff=false`;

                return (
                  <div
                    key={store.code}
                    onClick={() => handleSelectStore(store.code)}
                    className={`p-5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/50 border-l-2 border-l-[#25A5E3]'
                        : 'hover:bg-slate-50/70 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">
                            {storeName}
                          </h3>
                          <span className="rounded-card bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {storeTypeCopy[store.storeType]?.[language] ?? store.storeType}
                          </span>
                          {store.distanceKm !== null && store.distanceKm !== undefined && (
                            <span className="inline-flex items-center gap-1 rounded-card bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-[#0077B6] border border-sky-100/80">
                              <Navigation className="h-2.5 w-2.5" />
                              <span>{formatDistance(store.distanceKm)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact & Hours */}
                    <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                      {store.phone && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{store.phone}</span>
                        </div>
                      )}
                      {store.hours && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{store.hours}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{storeAddress}</span>
                      </div>
                    </div>

                    {/* Highlights / Notes */}
                    {storeNote && (
                      <div className="mt-3 rounded-card bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-600 border border-slate-100">
                        {storeNote}
                      </div>
                    )}

                    {/* Action Buttons (Reserve / Store Details) */}
                    <div className="mt-4 flex items-center justify-between gap-3 pt-2">
                      <a
                        href={detailUrl}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                      >
                        <span>{ui.storeDetails[language]}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href={rentUrl}
                        className="inline-flex items-center gap-1.5 rounded-card bg-[#25A5E3] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1D82B6] transition-colors"
                      >
                        <span>{ui.reserveBtn[language]}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Full-height Interactive Map */}
            <div
              className={`lg:col-span-6 xl:col-span-7 h-[420px] lg:h-[640px] relative bg-slate-50 ${
                mobileView === 'list' ? 'hidden lg:block' : 'block'
              }`}
            >
              <CityStoreMap
                stores={sortedStores}
                selectedStoreCode={selectedStoreCode}
                onSelectStore={handleSelectStore}
                lang={lang}
                className="relative h-full w-full bg-slate-100 overflow-hidden"
              />

              {/* Mobile Selected Store Quick Banner when in Map Mode */}
              {selectedStore && mobileView === 'map' && (
                <div className="lg:hidden absolute bottom-3 left-3 right-3 z-20 rounded-card bg-white p-3 border border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {selectedStore[language]?.name ?? selectedStore.EN.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {selectedStore[language]?.address ?? selectedStore.EN.address}
                      </p>
                    </div>
                    <a
                      href={`/${lang}/rent/?pickupCode=${selectedStore.code}&returnCode=${selectedStore.code}&differentDropoff=false`}
                      className="shrink-0 rounded-card bg-[#25A5E3] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {ui.reserveBtn[language]}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* VALUE PROPOSITIONS BAR: Mobile only                               */}
        {/* ================================================================= */}
        <div className="block md:hidden">
          <ValuePropsBar language={language} />
        </div>

        {/* ================================================================= */}
        {/* 5. CAR RENTAL USER REVIEWS CAROUSEL                               */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {ui.reviewsHeading[language]}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold text-slate-900">
                    {city.reviewSummary.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">/5.0</span>
                </div>
                <span>·</span>
                <span>
                  Based on {city.reviewSummary.reviewCount} verified rental reviews
                </span>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            {city.reviews.length > 0 && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => scrollReviews('left')}
                  aria-label="Previous reviews"
                  className="flex h-8 w-8 items-center justify-center rounded-card border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollReviews('right')}
                  aria-label="Next reviews"
                  className="flex h-8 w-8 items-center justify-center rounded-card border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {city.reviews.length === 0 ? (
            <div className="rounded-card bg-white p-8 text-center text-xs text-slate-500 border border-slate-200">
              {ui.emptyReviews[language]}
            </div>
          ) : (
            <div
              ref={reviewTrackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x pb-2 pt-1 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {city.reviews.map((rev) => {
                const isExpanded = expandedReviews[rev.reviewId] ?? false;
                const isOriginal = showOriginalReview[rev.reviewId] ?? false;
                const text = isOriginal
                  ? rev.originalText
                  : (rev.localizedText[language] || rev.localizedText.EN || rev.originalText);
                const vehicle = rev.vehicleGroup[language] ?? rev.vehicleGroup.EN;

                return (
                  <div
                    key={rev.reviewId}
                    className="w-[300px] sm:w-[350px] shrink-0 snap-start rounded-card border border-slate-200 bg-white p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Review Header with Avatar & Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-card bg-blue-50 text-blue-600 font-bold text-xs">
                            {rev.reviewId.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              Anonymous user
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-card bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                              {rev.rating.toFixed(1)} / 5.0
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-medium text-slate-400">
                          {rev.publishedAt}
                        </span>
                      </div>

                      {/* Vehicle badge */}
                      <div className="mt-2 text-[11px] font-medium text-slate-500">
                        {vehicle}
                      </div>

                      {/* Review text */}
                      <p
                        className={`mt-3 text-xs leading-relaxed text-slate-700 ${
                          !isExpanded ? 'line-clamp-3' : ''
                        }`}
                      >
                        {text}
                      </p>
                    </div>

                    {/* Bottom Toggles */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => toggleReviewExpand(rev.reviewId)}
                        className="font-bold text-[#25A5E3] hover:underline cursor-pointer"
                      >
                        {isExpanded ? ui.showLess[language] : ui.showMore[language]}
                      </button>

                      {rev.originalLocale !== language && (
                        <button
                          type="button"
                          onClick={() => toggleReviewOriginal(rev.reviewId)}
                          className="font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {isOriginal ? ui.viewTranslation[language] : ui.viewOriginal[language]}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 6. OTHER DESTINATIONS IN MARKET (Clean Chips)                     */}
        {/* ================================================================= */}
        {relatedCities.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {ui.relatedCities[language]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map((other) => (
                <a
                  key={other.citySlug}
                  href={`/${lang}/car-rental/${market.marketSlug}/${other.citySlug}/`}
                  className="inline-flex items-center gap-1 rounded-card border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#25A5E3] hover:text-[#25A5E3] transition-colors"
                >
                  <span>
                    {getCityRentalAnchor(
                      other.localizedNames[language] ?? other.localizedNames.EN,
                      language
                    )}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 7. BOTTOM BREADCRUMB NAVIGATION (Kayak / Trip.com style)          */}
        {/* ================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 pt-3 pb-1 px-1 border-t border-slate-200/80"
        >
          <a href={`/${lang}/`} className="hover:text-slate-900 transition-colors">
            {ui.home[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <a
            href={`/${lang}/car-rental/`}
            className="hover:text-slate-900 transition-colors"
          >
            {ui.carRental[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <a
            href={`/${lang}/car-rental/${market.marketSlug}/`}
            className="hover:text-slate-900 transition-colors"
          >
            {ui.carRentalsInMarket[language]}
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="font-semibold text-slate-900">
            {ui.carRentalsInCity[language]}
          </span>
        </nav>
      </main>

      
    </div>
  );
}

export default function CityLandingView(props: CityLandingViewProps) {
  return (
    
      <CityLandingContent {...props} />
    
  );
}
