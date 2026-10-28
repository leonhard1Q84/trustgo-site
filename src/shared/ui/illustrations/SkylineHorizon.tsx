import React from 'react';

interface SkylineHorizonProps {
  className?: string;
  opacity?: number;
}

/**
 * 城市天际线通栏地平线底衬
 * 提取自手绘都市建筑群线稿，适用于 404、500 以及页面底部空状态
 */
export function SkylineHorizon({
  className = '',
  opacity = 0.28,
}: SkylineHorizonProps) {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="w-full h-full bg-bottom bg-repeat-x bg-contain transition-opacity duration-300"
        style={{
          backgroundImage: "url('/images/illustrations/sketch-skyline.png')",
          opacity,
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%), linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  );
}
