'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  CalendarCheck,
  Car,
  CheckCircle2,
  Dog,
  HeartHandshake,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { getPetTravelGuide } from '../domain/petTravel';
import type { RouteLanguage } from '@/i18n/locales';

export default function PetTravelGuidePageView({ lang }: { lang: RouteLanguage }) {
  const guide = getPetTravelGuide(lang);

  const tocItems = [
    { id: 'core-summary', title: lang === 'zh' ? '1. 核心准則速覽' : lang === 'ja' ? '1. 基本ルールの概要' : lang === 'es' ? '1. Resumen de normas' : lang === 'ko' ? '1. 핵심 규정 요약' : '1. Core Policy Summary' },
    { id: 'advance-reservation', title: lang === 'zh' ? '2. 提前申報與預訂要求' : lang === 'ja' ? '2. 事前予約・申告手続き' : lang === 'es' ? '2. Reserva previa' : lang === 'ko' ? '2. 사전 예약 및 신고' : '2. Advance Booking' },
    { id: 'pet-and-carrier', title: lang === 'zh' ? '3. 籠具規格與寵物限制' : lang === 'ja' ? '3. ケージ規格と対象動物' : lang === 'es' ? '3. Transportín y peso' : lang === 'ko' ? '3. 이동장 규격 및 체중' : '3. Carrier & Pet Limits' },
    { id: 'where-pet-rides', title: lang === 'zh' ? '4. 車內乘車位置與防護' : lang === 'ja' ? '4. 乗車位置とシート保護' : lang === 'es' ? '4. Ubicación en el vehículo' : lang === 'ko' ? '4. 탑승 위치 및 매트' : '4. Designated Riding Area' },
    { id: 'vehicle-limits', title: lang === 'zh' ? '5. 適用車型與空間建議' : lang === 'ja' ? '5. 対象車種とスペース' : lang === 'es' ? '5. Categorías recomendadas' : lang === 'ko' ? '5. 권장 차종 및 공간' : '5. Eligible Vehicles' },
    { id: 'cleaning-damage', title: lang === 'zh' ? '6. 清潔、異味與損失賠償' : lang === 'ja' ? '6. 清掃・消臭・営業補償' : lang === 'es' ? '6. Limpieza y daños' : lang === 'ko' ? '6. 청소·손상 및 보상' : '6. Cleaning & Damage Fees' },
    { id: 'assistance-animals', title: lang === 'zh' ? '7. 輔助犬與服務動物政策' : lang === 'ja' ? '7. 補助犬・介助動物の規定' : lang === 'es' ? '7. Animales de asistencia' : lang === 'ko' ? '7. 보조 동물 특별 규정' : '7. Assistance Animals' },
  ];

  return (
    <article className="min-h-screen bg-[#F8FAFC] pt-20 text-[#0F172A]">
      {/* ═══ Header ═══ */}
      <header className="border-b border-slate-200/90 bg-white">
        <div className="mx-auto max-w-[84rem] px-4 py-8 sm:px-6 sm:py-10 md:px-12 xl:px-16">
          {/* Standard Clean Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <a href={`/${lang}/`} className="transition-colors hover:text-[#25A5E3]">
              TrustGo
            </a>
            <span className="text-slate-300">/</span>
            <a href={`/${lang}/help/`} className="transition-colors hover:text-[#25A5E3]">
              {guide.helpCenter}
            </a>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#0F172A] truncate">{guide.title}</span>
          </nav>

          <div className="mt-5 max-w-4xl space-y-3 lg:max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
              <BookOpen className="h-3.5 w-3.5 text-[#25A5E3]" />
              <span>{lang === 'zh' ? '車隊服務手冊 · 官方指南' : 'Fleet Service Handbook · Official Guide'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
              {guide.title}
            </h1>
            <p className="text-sm font-normal leading-relaxed text-[#475467] sm:text-base text-pretty">
              {guide.intro}
            </p>
          </div>
        </div>
      </header>

      {/* ═══ Main 2-Column Layout ═══ */}
      <div className="mx-auto max-w-[84rem] px-4 py-10 sm:px-6 md:px-12 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">

          {/* ── Left Main Editorial Content ── */}
          <main className="space-y-10">

            {/* 1. Core Summary Table Card */}
            <section id="core-summary" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  1.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {lang === 'zh' ? '攜寵同行核心準則速覽' : 'Core Pet Travel Policy at a Glance'}
                </h2>
              </div>

              <div className="mt-6 overflow-hidden rounded-card border border-slate-200 bg-slate-50/50">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <th className="w-1/3 px-4 py-3 font-bold text-slate-700 bg-slate-50/75 sm:px-6">
                        {lang === 'zh' ? '適用寵物類別' : 'Eligible Pets'}
                      </th>
                      <td className="px-4 py-3 text-slate-800 sm:px-6 font-medium">
                        {lang === 'zh' ? '體重不超過 10 kg 的家養犬或貓（其他小型動物需提前專案確認）' : 'Domestic dogs and cats up to 10kg (other small animals require prior branch approval)'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="px-4 py-3 font-bold text-slate-700 bg-slate-50/75 sm:px-6">
                        {lang === 'zh' ? '籠具要求' : 'Carrier Specification'}
                      </th>
                      <td className="px-4 py-3 text-slate-800 sm:px-6 font-medium">
                        {lang === 'zh' ? '約 70 × 90 × 75 cm 封閉式運輸籠（行車途中寵物必須全程在籠內）' : 'Closed carrier approx. 70 × 90 × 75 cm; pet must remain inside carrier while in vehicle'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="px-4 py-3 font-bold text-slate-700 bg-slate-50/75 sm:px-6">
                        {lang === 'zh' ? '乘車位置' : 'Designated Location'}
                      </th>
                      <td className="px-4 py-3 text-slate-800 sm:px-6 font-medium">
                        {lang === 'zh' ? '後備廂行李區或鋪設專用防護墊的後排地板（嚴禁直接置於皮質座椅）' : 'Trunk cargo area or rear floor on protective sheet; never directly on bare seats'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="px-4 py-3 font-bold text-slate-700 bg-slate-50/75 sm:px-6">
                        {lang === 'zh' ? '申報流程' : 'Booking Procedure'}
                      </th>
                      <td className="px-4 py-3 text-slate-800 sm:px-6 font-medium">
                        {lang === 'zh' ? '必須在預訂時備註或在取車前取得門店書面/系統核准確認' : 'Must declare during reservation or confirm with the branch prior to pickup'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="px-4 py-3 font-bold text-slate-700 bg-slate-50/75 sm:px-6">
                        {lang === 'zh' ? '推薦車型組' : 'Recommended Fleet'}
                      </th>
                      <td className="px-4 py-3 text-slate-800 sm:px-6 font-medium">
                        {lang === 'zh' ? 'SUV 緊湊/中型休旅車、7/8 座 MPV 廂型車（通風及後備廂空間更充裕）' : 'Compact/Intermediate SUVs or 7/8-seat MPVs for adequate cargo space and ventilation'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 2. Advance Reservation */}
            <section id="advance-reservation" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  2.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.beforeBookingTitle}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                <p>{guide.beforeBookingBody}</p>

                <div className="grid gap-3 pt-2">
                  {guide.beforeBookingSteps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3 rounded-card border border-slate-100 bg-[#F8FAFC] p-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="font-semibold text-slate-800 pt-0.5 leading-snug">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-card border border-amber-200 bg-amber-50/70 p-4 text-amber-900">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                        {lang === 'zh' ? '重要提醒：嚴禁未申報臨時帶寵取車' : 'Notice: Unapproved Pet Arrivals Cannot Be Accommodated'}
                      </h4>
                      <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                        {lang === 'zh'
                          ? '門店每台車輛出車前均需做好相應的防護與清潔準備。如未獲門店提前確認直接帶寵物到店，門店有權拒絕交付車輛，相應取消費用按預訂政策執行。'
                          : 'Due to vehicle allocation and hygiene scheduling, branches cannot accept pets without advance approval. The reservation may be refused at the counter without advance clearance.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Pet and Carrier Requirements */}
            <section id="pet-and-carrier" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  3.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.sections[1]?.title || '籠具規格與寵物限制'}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {guide.sections[1]?.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {guide.sections[1]?.bullets && guide.sections[1].bullets.length > 0 && (
                  <ul className="space-y-2.5 rounded-card border border-slate-100 bg-[#F8FAFC] p-4.5">
                    {guide.sections[1].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-800 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#25A5E3] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* 4. Where Pet Rides */}
            <section id="where-pet-rides" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  4.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.sections[2]?.title || '車內乘車位置與防護要求'}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {guide.sections[2]?.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {guide.sections[2]?.bullets && guide.sections[2].bullets.length > 0 && (
                  <div className="rounded-card border border-red-100 bg-red-50/60 p-4 text-red-950">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="h-5 w-5 text-[#25A5E3] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">
                          {lang === 'zh' ? '車廂乘車紀律嚴格禁止事項：' : 'Strict Vehicle Cabin Prohibitions:'}
                        </h4>
                        {guide.sections[2].bullets.map((b, idx) => (
                          <p key={idx} className="text-xs text-slate-700 font-medium">
                            • {b}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 5. Vehicle and Location Limits */}
            <section id="vehicle-limits" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  5.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.sections[3]?.title || '適用車型與空間要求'}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {guide.sections[3]?.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-card border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Car className="h-4 w-4 text-[#25A5E3]" />
                      <span>{lang === 'zh' ? 'SUV 休旅車型組 (首選推薦)' : 'SUV Classes (Recommended)'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'zh'
                        ? '如 Toyota Yaris Cross, Chevrolet Trax 等。後備廂方正通風，易於平整放置籠具與固定。'
                        : 'e.g. Toyota Yaris Cross, Chevrolet Trax. Flat cargo floor, good air circulation, easy carrier securement.'}
                    </p>
                  </div>

                  <div className="rounded-card border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Box className="h-4 w-4 text-[#25A5E3]" />
                      <span>{lang === 'zh' ? '7/8座 MPV 廂型車組' : '7/8-Seat MPVs / Passenger Vans'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'zh'
                        ? '如 Toyota Alphard, Toyota Sienna 等。適合多人家庭攜寵，後排摺疊後空間極為寬裕。'
                        : 'e.g. Toyota Alphard, Toyota Sienna. Ideal for family groups with pets, flexible folding seating.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Fees, Cleaning and Damage */}
            <section id="cleaning-damage" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  6.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.sections[4]?.title || '費用、清潔及損壞賠償'}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {guide.sections[4]?.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                <div className="rounded-card border border-slate-200 bg-slate-50/60 p-4.5 space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">
                    {lang === 'zh' ? '還車驗收與清潔標準說明：' : 'Vehicle Return Hygiene Standards:'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>• {lang === 'zh' ? '正常情況下保持車內無異味、無明顯毛髮、爪印或排泄物污染。' : 'Ensure vehicle cabin is returned without odor, pet hair accumulation, or claw damage.'}</li>
                    <li>• {lang === 'zh' ? '若產生嚴重異味或污漬需專業深層清潔/消臭，門店將按實際工時收取清潔費。' : 'Deep cleaning or deodorization fees may apply if excessive stains or odors require commercial treatment.'}</li>
                    <li>• {lang === 'zh' ? '若造成座椅皮革撕裂、咬損等物理損壞，將按損壞定損及營業損失（NOC）標準追償。' : 'Physical damages to upholstery or interior components will be assessed according to damage and NOC rules.'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Assistance Animals */}
            <section id="assistance-animals" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  7.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.sections[5]?.title || '輔助犬與服務動物特別政策'}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {guide.sections[5]?.body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                <div className="rounded-card border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950">
                  <div className="flex items-start gap-2.5">
                    <HeartHandshake className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                        {lang === 'zh' ? '服務犬/導盲犬合法權利保障' : 'Protection of Certified Service Animals'}
                      </h4>
                      <p className="mt-1 text-xs text-emerald-850 leading-relaxed">
                        {lang === 'zh'
                          ? '持有合法資質證明的導盲犬、聽導犬及介助服務犬同行時，依法免收額外寵物附加費。為確保提車流暢，請在預訂後提前通知取車門店並準備好相關證明文件。'
                          : 'Certified guide dogs, hearing dogs, and service dogs are accommodated in accordance with legal protections without extra pet surcharges. Please notify the branch in advance with valid certification.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Official Handbook Footnote */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-slate-100 text-[#0F172A]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {guide.sourceLabel} · {guide.sourceName}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-[#667085]">
                    {guide.sourceNote}
                  </p>
                </div>
              </div>
            </section>

          </main>

          {/* ── Right Column: Sticky Table of Contents & Quick Actions ── */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100">
                {lang === 'zh' ? '本手冊目錄' : 'Table of Contents'}
              </h3>
              <nav className="mt-3 space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-control px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#25A5E3] transition-colors truncate"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Action Box */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {lang === 'zh' ? '準備好攜寵出發了嗎？' : 'Ready to Rent?'}
                </h3>
                <p className="mt-1 text-xs text-[#667085] leading-relaxed">
                  {lang === 'zh'
                    ? '搜尋我們的大空間 SUV 與 MPV 車隊，享受全家與愛寵的無憂旅程。'
                    : 'Search our spacious SUV & MPV fleet for a comfortable trip with your pet.'}
                </p>
              </div>

              <a
                href={`/${lang}/rent/`}
                className="flex w-full min-h-10 items-center justify-center gap-1.5 rounded-control bg-[#25A5E3] px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#CC0010] shadow-xs"
              >
                <span>{lang === 'zh' ? '搜尋可租車型' : 'Search Vehicles'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <div className="border-t border-slate-100 pt-3">
                <a
                  href={`/${lang}/help/faq/making-a-reservation/`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#25A5E3] hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{lang === 'zh' ? '查看車輛與附加服務 FAQ' : 'Vehicle & Extras FAQ'}</span>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
