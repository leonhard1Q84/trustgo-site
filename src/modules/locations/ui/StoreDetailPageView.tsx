'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  CarFront,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Grid2X2,
  KeyRound,
  Plane,
  Building2,
  RotateCcw,
} from 'lucide-react';
import type { RouteLanguage } from '@/i18n/locales';
import { routeToLanguage } from '@/i18n/locales';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import type { LocationCard } from '../domain/types';
import { getStoreTimesSpec } from '../domain/store-times-specs';
import { getStoreFaqList } from '../domain/store-faqs';
import { storeTypeBadgeCopy } from '../domain/store-formatters';
import { SearchBar } from '@/modules/rental-search/ui/search-bar';
import { createDefaultSearchForm, type SearchFormState } from '@/modules/rental-search/domain/search-form';
import { getDefaultLicenseCountry } from '@/modules/rental-search/domain/countries';

interface StoreDetailPageViewProps {
  location: LocationCard;
  lang: RouteLanguage;
  marketSlug?: string;
  citySlug?: string;
}

const copy = {
  EN: {
    showAllPhotos: 'Show all photos',
    locationSection: "Where you'll pick up",
    contactSection: 'Contact the station',
    home: 'Home',
    carRental: 'Car rental',
    locations: 'Locations',
    reserveBtn: 'Book at this station',
    reserveBtnShort: 'Book Now',
    addressLabel: 'Address',
    phoneLabel: 'Hotline & Concierge',
    accessLabel: 'Terminal Access & Transit',
    hoursLabel: 'Operating Hours',
    businessDaysLabel: 'Operating days',
    businessDays: 'Monday – Sunday (Year-round)',
    regularHoursLabel: 'Regular hours',
    surchargeHoursLabel: 'Out-of-hours service',
    surchargeHoursNote: 'Transparent fee shown in trip summary before payment.',
    pickupLabel: 'Pick-up Guide',
    returnLabel: 'Return Guide',
    oneWayLabel: 'One-Way Return',
    oneWaySupported: 'One-way rental supported to authorized hubs',
    oneWayUnsupported: 'Same-station return only',
    paymentsLabel: 'Accepted Payments',
    languagesLabel: 'Service Languages',
    heroSub: 'Free cancellation up to 48h · Transparent pricing · 24/7 Road Concierge',
    airportBadge: 'Airport Hub · Express Shuttle',
    cityBadge: 'Downtown Depot',
    faqTitle: 'Station FAQs & Rental Rules',
    quickSearchTitle: 'Check Live Vehicle Availability at this Hub',
    pickupDate: 'Pick-up Date',
    returnDate: 'Return Date',
    pickupTime: 'Pick-up Time',
    returnTime: 'Return Time',
    searchVehicles: 'Find Vehicles',
    googleMapsDirections: 'Open in Google Maps',
  },
  ZH: {
    showAllPhotos: '顯示所有照片',
    locationSection: "取車位置",
    contactSection: '聯絡門店',
    home: '首頁',
    carRental: '租車服務',
    locations: '服務網點',
    reserveBtn: '在此門店預約租車',
    reserveBtnShort: '立即預約',
    addressLabel: '門店地址',
    phoneLabel: '服務熱線與客服',
    accessLabel: '航廈交通與接駁指引',
    hoursLabel: '營業時間',
    businessDaysLabel: '營業日',
    businessDays: '週一至週日（全年無休）',
    regularHoursLabel: '常規營業時段',
    surchargeHoursLabel: '特殊時段服務',
    surchargeHoursNote: '具體手續費於結帳明細頁透明呈現，所見即所付。',
    pickupLabel: '取車交接指引',
    returnLabel: '還車驗收指引',
    oneWayLabel: '異地還車支援',
    oneWaySupported: '支援同區域指定樞紐異地還車',
    oneWayUnsupported: '僅支援同店取還',
    paymentsLabel: '接受支付方式',
    languagesLabel: '多語言支援',
    heroSub: '取車前 48 小時免費取消 · 透明收費無隱藏費用 · 24/7 全天候道路救援',
    airportBadge: '機場旗艦店 · 專屬免費接駁',
    cityBadge: '市中心核心直營店',
    faqTitle: '門店常見問題與取車規程',
    quickSearchTitle: '查詢本門店即時可租車輛',
    pickupDate: '取車日期',
    returnDate: '還車日期',
    pickupTime: '取車時間',
    returnTime: '還車時間',
    searchVehicles: '開始找車',
    googleMapsDirections: '在 Google 地圖中查看',
  },
  JA: {
    showAllPhotos: 'すべての写真を表示',
    locationSection: "受取場所",
    contactSection: '店舗へのお問い合わせ',
    home: 'ホーム',
    carRental: 'レンタカー',
    locations: '営業所案内',
    reserveBtn: 'この営業所で予約する',
    reserveBtnShort: '今すぐ予約',
    addressLabel: '店舗住所',
    phoneLabel: 'お電話・コンシェルジュ',
    accessLabel: 'アクセス・送迎案内',
    hoursLabel: '営業時間',
    businessDaysLabel: '営業日',
    businessDays: '月曜日〜日曜日（年中無休）',
    regularHoursLabel: '通常営業時間',
    surchargeHoursLabel: '時間外対応枠',
    surchargeHoursNote: '時間外料金はお支払い前の明細にて透明に表示されます。',
    pickupLabel: '受取・貸出手順',
    returnLabel: '返却・点検手順',
    oneWayLabel: 'ワンウェイ（乗り捨て）',
    oneWaySupported: '指定拠点への乗り捨て対応可能',
    oneWayUnsupported: '同店舗への返却のみ対応',
    paymentsLabel: 'お支払い方法',
    languagesLabel: '対応言語',
    heroSub: '48時間前までキャンセル無料 · 隠れた費用なし · 24時間ロードサービス完備',
    airportBadge: '空港ハブ・無料送迎付き',
    cityBadge: '市内直営営業所',
    faqTitle: '店舗利用規程およびよくある質問',
    quickSearchTitle: 'この営業所の空車状況をリアルタイム検索',
    pickupDate: '出発日',
    returnDate: '返却日',
    pickupTime: '出発時間',
    returnTime: '返却時間',
    searchVehicles: '車両を検索',
    googleMapsDirections: 'Googleマップで案内を見る',
  },
  ES: {
    showAllPhotos: 'Ver todas las fotos',
    locationSection: "Dónde recogerás el coche",
    contactSection: 'Contactar con la oficina',
    home: 'Inicio',
    carRental: 'Alquiler de coches',
    locations: 'Oficinas',
    reserveBtn: 'Reservar en esta oficina',
    reserveBtnShort: 'Reservar',
    addressLabel: 'Dirección',
    phoneLabel: 'Teléfono y atención',
    accessLabel: 'Cómo llegar y traslados',
    hoursLabel: 'Horario de apertura',
    businessDaysLabel: 'Días de apertura',
    businessDays: 'Lunes a domingo (todo el año)',
    regularHoursLabel: 'Horario estándar',
    surchargeHoursLabel: 'Servicio fuera de horario',
    surchargeHoursNote: 'El suplemento se desglosa transparentemente antes del pago.',
    pickupLabel: 'Guía de recogida',
    returnLabel: 'Guía de devolución',
    oneWayLabel: 'Devolución en otra oficina',
    oneWaySupported: 'Alquiler de solo ida disponible a oficinas autorizadas',
    oneWayUnsupported: 'Devolución únicamente en la misma oficina',
    paymentsLabel: 'Métodos de pago',
    languagesLabel: 'Idiomas de atención',
    heroSub: 'Cancelación gratuita hasta 48h · Sin costes ocultos · Asistencia en carretera 24/7',
    airportBadge: 'Oficina Aeropuerto · Traslado gratis',
    cityBadge: 'Oficina Urbana',
    faqTitle: 'Preguntas frecuentes y condiciones de la oficina',
    quickSearchTitle: 'Consultar disponibilidad en esta oficina',
    pickupDate: 'Fecha de recogida',
    returnDate: 'Fecha de devolución',
    pickupTime: 'Hora de recogida',
    returnTime: 'Hora de devolución',
    searchVehicles: 'Buscar coches',
    googleMapsDirections: 'Abrir en Google Maps',
  },
  KO: {
    showAllPhotos: '사진 모두 보기',
    locationSection: "픽업 위치",
    contactSection: '지점 문의',
    home: '홈',
    carRental: '렌터카',
    locations: '지점 안내',
    reserveBtn: '이 지점에서 예약하기',
    reserveBtnShort: '지금 예약',
    addressLabel: '지점 주소',
    phoneLabel: '전화 및 고객센터',
    accessLabel: '공항 터미널 셔틀 / 길안내',
    hoursLabel: '영업시간',
    businessDaysLabel: '영업일',
    businessDays: '월요일~일요일 (연중무휴)',
    regularHoursLabel: '정규 영업시간',
    surchargeHoursLabel: '심야/새벽 서비스',
    surchargeHoursNote: '할증 요금은 결제 전 예약 내역에 투명하게 표시됩니다.',
    pickupLabel: '차량 인수 안내',
    returnLabel: '차량 반납 안내',
    oneWayLabel: '타 지점 편도 반납',
    oneWaySupported: '인가된 주요 지점으로 편도 반납 지원',
    oneWayUnsupported: '동일 지점 반납만 지원',
    paymentsLabel: '결제 수단',
    languagesLabel: '지원 언어',
    heroSub: '픽업 48시간 전까지 무료 취소 · 투명한 요금제 · 24시간 긴급출동 지원',
    airportBadge: '공항 거점 · 무료 셔틀 운행',
    cityBadge: '도심 직영 지점',
    faqTitle: '지점 이용 안내 및 자주 묻는 질문',
    quickSearchTitle: '이 지점의 실시간 대여 가능 차량 조회',
    pickupDate: '대여일',
    returnDate: '반납일',
    pickupTime: '대여 시간',
    returnTime: '반납 시간',
    searchVehicles: '차량 검색',
    googleMapsDirections: 'Google 지도에서 길찾기',
  },
};

export function StoreDetailPageView({
  location,
  lang,
  marketSlug,
  citySlug,
}: StoreDetailPageViewProps) {
  const language = routeToLanguage(lang);
  const t = copy[language] || copy.EN;
  const localized = location[language] || location.EN;
  const timesSpec = getStoreTimesSpec(location, language);
  const faqs = getStoreFaqList(location, language);
  const badges = storeTypeBadgeCopy[language] || storeTypeBadgeCopy.EN;

  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Store search card: pick-up prefilled with this store, everything else from the shared search defaults.
  const initialSearch = useMemo<SearchFormState>(
    () => ({
      ...createDefaultSearchForm(getDefaultLicenseCountry(lang)),
      pickup: { label: localized.name, storeCode: location.code },
    }),
    [lang, localized.name, location.code]
  );

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${localized.name} ${localized.address}`
  )}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}&z=15&output=embed`;

  const photos = location.storefrontPhotos.map((photo) => ({
    src: photo.src,
    alt: photo.alt[language] || photo.alt.EN,
  }));
  const isAirport = location.storeType === 'airport';
  const TypeIcon = isAirport ? Plane : Building2;

  const facts = [
    { icon: TypeIcon, title: isAirport ? t.airportBadge : t.cityBadge, desc: localized.accessGuide },
    { icon: Clock, title: `${t.hoursLabel} · ${location.hours}`, desc: `${t.businessDays}. ${t.surchargeHoursNote}` },
    { icon: RotateCcw, title: t.oneWayLabel, desc: location.oneWay ? t.oneWaySupported : t.oneWayUnsupported },
    ...(location.selfService ? [{ icon: KeyRound, title: badges.selfService, desc: '' }] : []),
  ];

  const sectionTitle = 'text-xl font-semibold text-foreground tracking-tight';

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 lg:pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {/* Breadcrumb: allowed on ≥ 3-level content pages (Design Guidelines §8.1) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
          <Link href={`/${lang}`} className="hover:text-foreground hover:underline underline-offset-4">{t.home}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <Link href={`/${lang}/car-rental`} className="hover:text-foreground hover:underline underline-offset-4">{t.carRental}</Link>
          {marketSlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href={`/${lang}/car-rental/${marketSlug}`} className="capitalize hover:text-foreground hover:underline underline-offset-4">
                {marketSlug}
              </Link>
            </>
          )}
          {citySlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <Link href={`/${lang}/car-rental/${marketSlug}/${citySlug}`} className="capitalize hover:text-foreground hover:underline underline-offset-4">
                {citySlug}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate text-foreground-secondary">{localized.name}</span>
        </nav>

        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">{localized.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground-secondary">
          <span className="inline-flex items-center gap-1"><TypeIcon className="w-4 h-4" aria-hidden="true" />{isAirport ? t.airportBadge : t.cityBadge}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{location.hours}</span>
          <span aria-hidden="true">·</span>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
            {localized.address}
          </a>
        </p>

        {/* Photo mosaic (PC) / swipe strip (H5) */}
        <div className="relative mt-6">
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-104 overflow-hidden rounded-card">
            {photos.slice(0, 5).map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setModalIndex(idx)}
                className={`relative bg-muted overflow-hidden cursor-pointer group ${idx === 0 ? 'col-span-2 row-span-2' : ''} ${photos.length < 5 && idx === photos.length - 1 && idx > 0 ? 'col-span-2' : ''}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={idx === 0}
                  sizes={idx === 0 ? '600px' : '300px'}
                  className="object-cover transition-opacity group-hover:opacity-90"
                />
              </button>
            ))}
          </div>
          <div className="md:hidden -mx-4 flex snap-x snap-mandatory overflow-x-auto scrollbar-none">
            {photos.map((photo, idx) => (
              <button key={idx} type="button" onClick={() => setModalIndex(idx)} className="relative aspect-4/3 w-full shrink-0 snap-center bg-muted">
                <Image src={photo.src} alt={photo.alt} fill priority={idx === 0} sizes="100vw" className="object-cover" />
                <span className="absolute bottom-3 right-3 rounded-full bg-foreground/70 px-2.5 py-0.5 text-xs font-medium text-white tabular-nums">
                  {idx + 1} / {photos.length}
                </span>
              </button>
            ))}
          </div>
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() => setModalIndex(0)}
              className="absolute bottom-4 right-4 hidden md:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-control border border-foreground bg-background text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
            >
              <Grid2X2 className="w-4 h-4" aria-hidden="true" />
              {t.showAllPhotos}
            </button>
          )}
        </div>

        <div className="mt-8 lg:mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
          {/* Main content: sections separated by dividers, no boxed cards */}
          <main className="min-w-0 divide-y divide-border">
            <section className="pb-8 space-y-6">
              {facts.map((fact) => (
                <div key={fact.title} className="flex gap-4">
                  <fact.icon className="mt-0.5 w-6 h-6 shrink-0 text-foreground" aria-hidden="true" />
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{fact.title}</h2>
                    {fact.desc && <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">{fact.desc}</p>}
                  </div>
                </div>
              ))}
            </section>

            <section className="py-8 space-y-6">
              <div>
                <h2 className={sectionTitle}>{t.pickupLabel}</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary max-w-prose">{timesSpec.pickupPrecautions}</p>
              </div>
              <div>
                <h2 className={sectionTitle}>{t.returnLabel}</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-secondary max-w-prose">{timesSpec.returnPrecautions}</p>
              </div>
            </section>

            <section className="py-8">
              <h2 className={sectionTitle}>{t.locationSection}</h2>
              <p className="mt-2 text-sm text-foreground-secondary">
                {location.postalCode && <span className="tabular-nums">{location.postalCode} </span>}
                {localized.address}
              </p>
              <div className="mt-4 h-80 overflow-hidden rounded-card border border-border bg-muted">
                <iframe
                  src={mapEmbedUrl}
                  title={localized.name}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline underline-offset-4"
              >
                {t.googleMapsDirections}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </section>

            <section className="py-8">
              <h2 className={sectionTitle}>{t.contactSection}</h2>
              <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t.phoneLabel}</dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${location.phone.replace(/[^0-9+]/g, '')}`} className="font-semibold text-foreground hover:underline underline-offset-4 tabular-nums">
                      {location.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email · LINE · WhatsApp · KakaoTalk</dt>
                  <dd className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                    <a href={`mailto:support@trustgo.rentals?subject=${encodeURIComponent(`Store Inquiry: ${localized.name}`)}`} className="font-semibold text-foreground hover:underline underline-offset-4">Email</a>
                    <a href="https://lin.ee/zMvlCte" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline underline-offset-4">LINE</a>
                    <a href="https://wa.me/message/KABPRUSTX7CDI1" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline underline-offset-4">WhatsApp</a>
                    <a href="http://qr.kakao.com/talk/l4meMzPzrewv4E63ge17LvWqoKU-" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline underline-offset-4">KakaoTalk</a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.paymentsLabel}</dt>
                  <dd className="mt-0.5 text-foreground">{timesSpec.paymentMethods}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.languagesLabel}</dt>
                  <dd className="mt-0.5 text-foreground">{timesSpec.supportedLanguages}</dd>
                </div>
              </dl>
            </section>

            <section className="pt-8">
              <h2 className={sectionTitle}>{t.faqTitle}</h2>
              <div className="mt-2 divide-y divide-border">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.id}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-foreground cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <p className="pb-5 text-sm leading-relaxed text-foreground-secondary">{faq.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* Sticky search card: same controls as the home search, pick-up prefilled */}
          <aside id="store-search" className="order-first lg:order-none scroll-mt-24">
            <div className="lg:sticky lg:top-24">
              <h2 className="mb-3 text-lg font-semibold text-foreground">{t.quickSearchTitle}</h2>
              <SearchBar lang={lang} initial={initialSearch} className="border border-border shadow-raised" />
            </div>
          </aside>
        </div>
      </div>

      {/* Photo lightbox */}
      <Dialog open={modalIndex !== null} onOpenChange={(open) => !open && setModalIndex(null)}>
        <DialogContent variant="full" className="p-0 sm:max-w-4xl overflow-hidden" aria-describedby={undefined}>
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 pr-14">
            <DialogTitle className="truncate text-sm">{modalIndex !== null ? photos[modalIndex]?.alt : ''}</DialogTitle>
            <span className="text-sm tabular-nums text-muted-foreground">
              {modalIndex !== null ? `${modalIndex + 1} / ${photos.length}` : ''}
            </span>
          </div>
          <div className="relative flex-1 min-h-96 sm:h-[70vh] bg-muted">
            {modalIndex !== null && (
              <Image src={photos[modalIndex]?.src || ''} alt={photos[modalIndex]?.alt || ''} fill className="object-contain" sizes="(max-width: 768px) 100vw, 900px" />
            )}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setModalIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* H5 bottom bar: jumps to the store search card */}
      <aside
        aria-label={t.reserveBtn}
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background px-4 pt-3 shadow-bottombar lg:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{localized.name}</p>
            <p className="truncate text-xs text-muted-foreground tabular-nums">{location.hours}</p>
          </div>
          <a
            href="#store-search"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-control bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <CarFront className="w-4 h-4" aria-hidden="true" />
            {t.reserveBtnShort}
          </a>
        </div>
      </aside>
    </div>
  );
}

export default StoreDetailPageView;
