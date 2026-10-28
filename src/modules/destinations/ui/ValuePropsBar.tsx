'use client';

import React from 'react';
import { RotateCcw, ShieldCheck, BadgeCheck } from 'lucide-react';
import type { Language } from '@/i18n/locales';

interface ValuePropsBarProps {
  language: Language;
  className?: string;
}

const copy = {
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
};

export default function ValuePropsBar({ language, className = '' }: ValuePropsBarProps) {
  return (
    <section
      aria-label={language === 'ZH' ? '服務核心保障' : 'Key rental guarantees'}
      className={`rounded-sm bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Value Prop 1 */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-brand-light text-[#25A5E3]">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {copy.vp1Title[language] ?? copy.vp1Title.EN}
            </h4>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {copy.vp1Desc[language] ?? copy.vp1Desc.EN}
            </p>
          </div>
        </div>

        {/* Value Prop 2 */}
        <div className="flex items-start gap-3.5 pt-3.5 md:pt-0 md:pl-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-blue-50 text-blue-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {copy.vp2Title[language] ?? copy.vp2Title.EN}
            </h4>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {copy.vp2Desc[language] ?? copy.vp2Desc.EN}
            </p>
          </div>
        </div>

        {/* Value Prop 3 */}
        <div className="flex items-start gap-3.5 pt-3.5 md:pt-0 md:pl-6">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-emerald-50 text-emerald-600">
            <BadgeCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {copy.vp3Title[language] ?? copy.vp3Title.EN}
            </h4>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {copy.vp3Desc[language] ?? copy.vp3Desc.EN}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
