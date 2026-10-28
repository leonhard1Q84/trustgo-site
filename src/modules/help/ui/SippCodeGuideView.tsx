'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Car,
  CheckCircle2,
  Copy,
  Check,
  HelpCircle,
  Info,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { getSippCodeGuide } from '../domain/sippCodes';
import type { RouteLanguage } from '@/i18n/locales';

const POPULAR_FLEET_CODES = [
  { code: 'CDMR', nameZh: '緊湊型 5門 手動', nameEn: 'Compact 5-Door Manual', seats: '5', luggage: '2', exampleZh: 'Toyota Yaris Cross 或同級', exampleEn: 'Toyota Yaris Cross or similar' },
  { code: 'CDAR', nameZh: '緊湊型 5門 自動', nameEn: 'Compact 5-Door Automatic', seats: '5', luggage: '2', exampleZh: 'Nissan Note / Toyota Yaris 或同級', exampleEn: 'Nissan Note / Toyota Yaris or similar' },
  { code: 'IFAR', nameZh: '中型休旅 SUV 自動', nameEn: 'Intermediate SUV Automatic', seats: '5', luggage: '3', exampleZh: 'Chevrolet Trax / Nissan Kicks 或同級', exampleEn: 'Chevrolet Trax / Nissan Kicks or similar' },
  { code: 'SVAR', nameZh: '標準型 7/8座 MPV 廂型車', nameEn: 'Standard 7/8-Seat MPV Van', seats: '7-8', luggage: '5', exampleZh: 'Toyota Alphard / Sienna 或同級', exampleEn: 'Toyota Alphard / Sienna or similar' },
  { code: 'PDAR', nameZh: '高級豪華轎車 自動', nameEn: 'Premium Luxury Sedan Auto', seats: '5', luggage: '3', exampleZh: 'Lexus ES 300h 或同級', exampleEn: 'Lexus ES 300h or similar' },
  { code: 'EDAR', nameZh: '經濟型 掀背 自動', nameEn: 'Economy Hatchback Auto', seats: '5', luggage: '2', exampleZh: 'Toyota Vitz 或同級', exampleEn: 'Toyota Vitz or similar' },
] as const;

export default function SippCodeGuidePageView({ lang }: { lang: RouteLanguage }) {
  const guide = getSippCodeGuide(lang);

  // Interactive quick lookup state
  const [catCode, setCatCode] = useState('C');
  const [bodyCode, setBodyCode] = useState('D');
  const [transCode, setTransCode] = useState('M');
  const [fuelCode, setFuelCode] = useState('R');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sectionsMap = useMemo(() => {
    const map: Record<string, (typeof guide.sections)[number]> = {};
    guide.sections.forEach((sec) => {
      map[sec.id] = sec;
    });
    return map;
  }, [guide.sections]);

  const currentCategory = sectionsMap.category?.entries.find((e) => e.code === catCode);
  const currentBody = sectionsMap.body?.entries.find((e) => e.code === bodyCode);
  const currentTrans = sectionsMap.transmission?.entries.find((e) => e.code === transCode);
  const currentFuel = sectionsMap.fuel?.entries.find((e) => e.code === fuelCode);

  const fullDecodedCode = `${catCode}${bodyCode}${transCode}${fuelCode}`;

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullDecodedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyPreset = (codeStr: string) => {
    if (codeStr.length !== 4) return;
    const [c1, c2, c3, c4] = codeStr.toUpperCase().split('');
    if (sectionsMap.category?.entries.some((e) => e.code === c1)) setCatCode(c1);
    if (sectionsMap.body?.entries.some((e) => e.code === c2)) setBodyCode(c2);
    if (sectionsMap.transmission?.entries.some((e) => e.code === c3)) setTransCode(c3);
    if (sectionsMap.fuel?.entries.some((e) => e.code === c4)) setFuelCode(c4);
  };

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return guide.sections;
    return guide.sections
      .map((sec) => ({
        ...sec,
        entries: sec.entries.filter(
          (e) => e.code.toLowerCase().includes(query) || e.label.toLowerCase().includes(query),
        ),
      }))
      .filter((sec) => sec.entries.length > 0);
  }, [guide.sections, searchQuery]);

  const tocItems = [
    { id: 'structure-overview', title: lang === 'zh' ? '1. SIPP 4 位結構總解' : lang === 'ja' ? '1. SIPP 4文字の構造' : lang === 'es' ? '1. Estructura de 4 caracteres' : lang === 'ko' ? '1. SIPP 4자리 구조' : '1. 4-Character Structure' },
    { id: 'fleet-presets', title: lang === 'zh' ? '2. 常用車隊代號對照表' : lang === 'ja' ? '2. 主要車両コード一覧' : lang === 'es' ? '2. Códigos de flota habituales' : lang === 'ko' ? '2. 주요 차량 코드 대조표' : '2. Popular Fleet Codes' },
    { id: 'detailed-matrix', title: lang === 'zh' ? '3. 完整代碼定義字典' : lang === 'ja' ? '3. 完全コード定義マトリクス' : lang === 'es' ? '3. Matriz completa de códigos' : lang === 'ko' ? '3. 전체 코드 정의 사전' : '3. Complete Code Matrix' },
    { id: 'allocation-policy', title: lang === 'zh' ? '4. 車型組配車原則與保障' : lang === 'ja' ? '4. 配車原則と履行保証' : lang === 'es' ? '4. Principio de asignación' : lang === 'ko' ? '4. 배차 원칙 및 보증' : '4. Vehicle Allocation Policy' },
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
              <span>{lang === 'zh' ? '車隊分類手冊 · 官方指南' : 'Fleet Classification Handbook · Official Guide'}</span>
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

            {/* 1. SIPP Structure Overview & Inline Interactive Lookup */}
            <section id="structure-overview" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  1.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {lang === 'zh' ? 'SIPP 4 位結構總解與示例' : 'SIPP 4-Character Structure Overview'}
                </h2>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                {lang === 'zh'
                  ? 'SIPP (Standard Interline Passenger Procedures / ACRISS) 是國際租車業通用的 4 位英文字母編碼系統。從左至右分別嚴格對應車輛的 4 大核心維度：'
                  : 'SIPP (ACRISS) is an international 4-character coding system used across the car rental industry to classify vehicle classes across four key dimensions from left to right:'}
              </p>

              {/* 4 Position Table */}
              <div className="mt-5 overflow-hidden rounded-card border border-slate-200 bg-slate-50/50">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700">
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '代碼位置' : 'Position'}</th>
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '維度含義' : 'Dimension'}</th>
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '常見代碼示例' : 'Common Examples'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#25A5E3] sm:px-6">第 1 位 (1st)</td>
                      <td className="px-4 py-3 font-bold text-slate-800 sm:px-6">{guide.sections[0]?.title}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">M (Mini), E (Economy), C (Compact), I (Intermediate), S (Standard), F (Fullsize), P (Premium), L (Luxury)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#25A5E3] sm:px-6">第 2 位 (2nd)</td>
                      <td className="px-4 py-3 font-bold text-slate-800 sm:px-6">{guide.sections[1]?.title}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">D (4/5 門), B (2/3 門), F (SUV), V (客運廂型車), W (旅行車), S (跑車)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#25A5E3] sm:px-6">第 3 位 (3rd)</td>
                      <td className="px-4 py-3 font-bold text-slate-800 sm:px-6">{guide.sections[2]?.title}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">A (自動變速), M (手動變速), B (自動 4WD), D (自動 AWD), N (手動 4WD)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#25A5E3] sm:px-6">第 4 位 (4th)</td>
                      <td className="px-4 py-3 font-bold text-slate-800 sm:px-6">{guide.sections[3]?.title}</td>
                      <td className="px-4 py-3 text-slate-600 sm:px-6">R (未指定燃料+空調), V (汽油+空調), D (柴油+空調), H (油電混動+空調), E (純電+空調)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Inline Interactive Lookup Card */}
              <div className="mt-6 rounded-card border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                      {lang === 'zh' ? '即時代碼解讀示例工具：' : 'Live Code Interpretation Tool:'}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-[#25A5E3] bg-white px-2 py-0.5 rounded border border-red-200">
                      {fullDecodedCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#25A5E3] self-start sm:self-auto"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? (lang === 'zh' ? '已複製' : 'Copied') : (lang === 'zh' ? '複製代碼' : 'Copy')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">1. {guide.sections[0]?.title}</label>
                    <select
                      value={catCode}
                      onChange={(e) => setCatCode(e.target.value)}
                      className="w-full rounded-control border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-[#25A5E3] focus:outline-hidden"
                    >
                      {sectionsMap.category?.entries.map((e) => (
                        <option key={e.code} value={e.code}>{e.code} - {e.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">2. {guide.sections[1]?.title}</label>
                    <select
                      value={bodyCode}
                      onChange={(e) => setBodyCode(e.target.value)}
                      className="w-full rounded-control border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-[#25A5E3] focus:outline-hidden"
                    >
                      {sectionsMap.body?.entries.map((e) => (
                        <option key={e.code} value={e.code}>{e.code} - {e.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">3. {guide.sections[2]?.title}</label>
                    <select
                      value={transCode}
                      onChange={(e) => setTransCode(e.target.value)}
                      className="w-full rounded-control border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-[#25A5E3] focus:outline-hidden"
                    >
                      {sectionsMap.transmission?.entries.map((e) => (
                        <option key={e.code} value={e.code}>{e.code} - {e.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">4. {guide.sections[3]?.title}</label>
                    <select
                      value={fuelCode}
                      onChange={(e) => setFuelCode(e.target.value)}
                      className="w-full rounded-control border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-[#25A5E3] focus:outline-hidden"
                    >
                      {sectionsMap.fuel?.entries.map((e) => (
                        <option key={e.code} value={e.code}>{e.code} - {e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-control bg-white border border-slate-200/80 p-3 text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-[#25A5E3] font-black">{fullDecodedCode} 解讀結果：</span>
                  <span>
                    {[currentCategory?.label, currentBody?.label, currentTrans?.label, currentFuel?.label].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Popular Fleet Codes Table */}
            <section id="fleet-presets" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  2.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {lang === 'zh' ? 'TrustGo 車隊常用代號對照表' : 'Common TrustGo Fleet Codes Matrix'}
                </h2>
              </div>

              <div className="mt-5 overflow-hidden rounded-card border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700">
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? 'SIPP 代號' : 'SIPP Code'}</th>
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '車型組含義' : 'Category'}</th>
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '人數/行李' : 'Seats / Bags'}</th>
                      <th className="px-4 py-3 font-bold sm:px-6">{lang === 'zh' ? '代表車型示例' : 'Representative Model'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {POPULAR_FLEET_CODES.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 sm:px-6">
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(item.code)}
                            className="font-mono font-black text-[#25A5E3] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 transition-colors"
                          >
                            {item.code}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 sm:px-6">
                          {lang === 'zh' ? item.nameZh : item.nameEn}
                        </td>
                        <td className="px-4 py-3 text-slate-600 sm:px-6">
                          {item.seats} {lang === 'zh' ? '座' : 'seats'} · {item.luggage} {lang === 'zh' ? '件大行李' : 'bags'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 sm:px-6">
                          {lang === 'zh' ? item.exampleZh : item.exampleEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Detailed Character Matrix */}
            <section id="detailed-matrix" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                    3.0
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                    {lang === 'zh' ? '完整四位代碼定義字典' : 'Complete 4-Position Character Dictionary'}
                  </h2>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'zh' ? '搜尋代碼或含義 (如 SUV, 自動)...' : 'Search code or keyword...'}
                    className="h-9 w-full rounded-control border border-slate-200 bg-white pl-8.5 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#25A5E3] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.id} className="rounded-card border border-slate-200/90 overflow-hidden">
                    <div className="bg-slate-100/75 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#0F172A] text-white px-2 py-0.5 text-[11px] font-bold">
                          {section.position}
                        </span>
                        <h3 className="font-bold text-sm text-[#0F172A]">{section.title}</h3>
                      </div>
                      <span className="text-xs text-slate-500">{section.entries.length} {lang === 'zh' ? '個代碼' : 'codes'}</span>
                    </div>

                    <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {section.entries.map((entry) => (
                        <div key={entry.code} className="flex items-center gap-2.5 rounded-control border border-slate-100 bg-[#F8FAFC] p-2.5 text-xs">
                          <span className="flex h-7 w-8 shrink-0 items-center justify-center rounded bg-white border border-slate-200 font-mono font-black text-[#25A5E3]">
                            {entry.code}
                          </span>
                          <span className="font-medium text-slate-800 truncate">{entry.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Vehicle Allocation Policy */}
            <section id="allocation-policy" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-control bg-red-50 text-xs font-bold text-[#25A5E3]">
                  4.0
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  {guide.classRuleTitle}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                <p>{guide.classRuleBody}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-card border border-slate-200 bg-[#F8FAFC] p-4 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                      <span>{lang === 'zh' ? '保證同級或免費升級' : 'Guaranteed category'}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'zh' ? '如預訂車型組庫存緊張，將免費升級至更高組別車輛。' : 'Free upgrade to a higher vehicle group if original class is unavailable.'}
                    </p>
                  </div>

                  <div className="rounded-card border border-slate-200 bg-[#F8FAFC] p-4 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                      <span>{lang === 'zh' ? '保證乘員與行李空間' : 'Guaranteed capacity'}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'zh' ? '嚴格保證預訂組別所列載客人數與標準行李箱容積。' : 'Seating and luggage capacity will strictly match or exceed the booked class.'}
                    </p>
                  </div>

                  <div className="rounded-card border border-slate-200 bg-[#F8FAFC] p-4 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                      <span>{lang === 'zh' ? '保證變速箱與空調配備' : 'Guaranteed features'}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'zh' ? '自動擋/手動擋及冷暖空調等核心動力配置100%保證。' : 'Transmission type and A/C are 100% guaranteed as specified.'}
                    </p>
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
                  {lang === 'zh' ? '查找最新可租車輛' : 'Ready to Book?'}
                </h3>
                <p className="mt-1 text-xs text-[#667085] leading-relaxed">
                  {lang === 'zh'
                    ? '按 SIPP 級別精準篩選，獲取即時透明報價與免押金/免手續費禮遇。'
                    : 'Filter by SIPP vehicle category to get live rates and flexible pickup.'}
                </p>
              </div>

              <a
                href={`/${lang}/rent/`}
                className="flex w-full min-h-10 items-center justify-center gap-1.5 rounded-control bg-[#25A5E3] px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#CC0010] shadow-xs"
              >
                <span>{lang === 'zh' ? '即時搜尋車型' : 'Search Vehicles'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <div className="border-t border-slate-100 pt-3">
                <a
                  href={`/${lang}/help/faq/making-a-reservation/`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#25A5E3] hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{lang === 'zh' ? '查看車型組與配備 FAQ' : 'Vehicle & Model FAQ'}</span>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
