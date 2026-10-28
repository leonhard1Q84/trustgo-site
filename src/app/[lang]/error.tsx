'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { normalizeRouteLanguage, defaultRouteLanguage } from '@/i18n/locales';
import { useI18n } from '@/i18n/useI18n';
import { TravelVehicleIllustration } from '@/shared/ui/illustrations/TravelVehicleIllustration';
import { SkylineHorizon } from '@/shared/ui/illustrations/SkylineHorizon';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const firstSegment = pathname?.split('/')[1];
  const lang = normalizeRouteLanguage(firstSegment ?? defaultRouteLanguage);
  const { t } = useI18n(lang);

  useEffect(() => {
    console.error('TrustGo Route Error:', error);
  }, [error]);

  return (
    <div className="relative min-h-[75vh] flex flex-col justify-between items-center px-4 py-6 sm:py-10 text-foreground overflow-x-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto text-center space-y-6 sm:space-y-7">
        {/* 中间纯粹手绘自驾车检修场景 (开舱小车 + 交通锥 + 调校扳手) */}
        <div className="w-full px-2">
          <TravelVehicleIllustration variant="pit-stop" className="w-full max-w-sm sm:max-w-md mx-auto" />
        </div>

        {/* 平衡版提示文案 */}
        <div className="space-y-2 max-w-md mx-auto px-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('error_pit_stop_title')}
          </h1>
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            {t('error_pit_stop_desc')}
          </p>
        </div>

        {/* 精简操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto pt-1">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-2.5 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-raised active:scale-[0.99] cursor-pointer"
          >
            {t('error_action_retry')}
          </button>
          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-2.5 rounded-control border border-border hover:bg-muted text-foreground-secondary hover:text-foreground font-medium text-sm transition-colors"
          >
            {t('error_action_home')}
          </Link>
        </div>
      </div>

      {/* 底部通栏手绘都市天际线地平线 */}
      <div className="relative w-full z-0 pointer-events-none mt-auto">
        <SkylineHorizon className="w-full h-20 sm:h-28 -mb-1" opacity={0.25} />
      </div>
    </div>
  );
}
