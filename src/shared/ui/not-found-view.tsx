import Link from 'next/link';
import type { RouteLanguage } from '@/i18n/locales';
import { getTranslation } from '@/i18n/useI18n';
import { TravelVehicleIllustration } from '@/shared/ui/illustrations/TravelVehicleIllustration';
import { SkylineHorizon } from '@/shared/ui/illustrations/SkylineHorizon';
import { BrandLogo } from '@/shared/ui/brand-logo';

export function NotFoundView({
  lang,
  standalone = true,
}: {
  lang: RouteLanguage;
  standalone?: boolean;
}) {
  const Content = standalone ? 'main' : 'section';
  return (
    <div
      className={`relative ${standalone ? 'min-h-dvh' : 'min-h-96'} flex flex-col justify-between bg-background text-foreground antialiased selection:bg-primary/20 overflow-x-hidden`}
    >
      {/* 顶部极简 Brand Header */}
      {standalone && (
        <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-start">
          <Link href={`/${lang}`} className="inline-block" aria-label="TrustGo Home">
            <BrandLogo />
          </Link>
        </header>
      )}

      {/* 核心主视觉与操作区 */}
      <Content className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-lg mx-auto text-center space-y-6 sm:space-y-7">
          {/* 中间纯粹手绘自驾车与 404 路标 (独立清爽，不与城市混淆) */}
          <div className="w-full px-2">
            <TravelVehicleIllustration
              variant="404"
              className="w-full max-w-sm sm:max-w-md mx-auto"
            />
          </div>

          {/* 平衡版提示文案：偏简约，但有自驾旅行味道 */}
          <div className="space-y-2 max-w-md mx-auto px-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {getTranslation('not_found_scenic_title', lang)}
            </h1>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {getTranslation('not_found_scenic_desc', lang)}
            </p>
          </div>

          {/* 用户认可的精简单个主按钮 */}
          <div className="pt-1">
            <Link
              href={`/${lang}`}
              className="inline-flex items-center justify-center px-8 py-2.5 sm:py-3 rounded-control bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all shadow-raised hover:shadow-overlay focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 active:scale-[0.99]"
            >
              {getTranslation('not_found_action_home', lang)}
            </Link>
          </div>
        </div>
      </Content>

      {/* 底部通栏手绘都市天际线地平线 (Hola 同款自然底衬) */}
      {standalone && (
        <footer className="relative w-full z-0 pointer-events-none mt-auto">
          <SkylineHorizon className="w-full h-24 sm:h-36 -mb-1" opacity={0.28} />
        </footer>
      )}
    </div>
  );
}
