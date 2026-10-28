import React from 'react';

interface TravelStateIllustrationProps {
  /**
   * 场景变体：
   * - '404' | 'detour': 偏离既定路线 / 迷路探索 (Scenic Detour)
   * - '500' | 'pit-stop': 旅途故障 / 临时检修 (Quick Pit Stop)
   */
  variant?: '404' | 'detour' | '500' | 'pit-stop';
  className?: string;
}

/**
 * 手绘都市立交与自驾旅行场景插画
 * 底图基于真实手绘都市建筑群与高架桥速写，前景融入自驾小车、旅行行李与场景标牌
 */
export function TravelStateIllustration({
  variant = '404',
  className = 'w-full max-w-2xl mx-auto h-auto',
}: TravelStateIllustrationProps) {
  const is404 = variant === '404' || variant === 'detour';

  return (
    <div className={`relative select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1024 258"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs overflow-visible"
      >
        {/* ================= 1. 真实高精度手绘都市建筑群与立交桥底图 ================= */}
        <image
          href="/images/illustrations/skyline-sketch-base.png"
          x="0"
          y="0"
          width="1024"
          height="258"
          preserveAspectRatio="xMidYMid meet"
          className="opacity-85 dark:opacity-75 transition-opacity"
        />

        {/* ================= 2. 天空手绘飞鸟 (增添旅途与远方空气感) ================= */}
        <g stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <path d="M260 38 Q268 31 276 38 Q284 31 292 38" fill="none" />
          <path d="M298 48 Q304 42 310 48 Q316 42 322 48" fill="none" strokeWidth="1.3" />
          <path d="M740 32 Q747 26 754 32 Q761 26 768 32" fill="none" strokeWidth="1.4" />
        </g>

        {/* ================= 3. 立交桥路面行驶层 (前景车旅场景) ================= */}
        {is404 ? (
          /* -------- 404 场景：404 公路盾牌 + 桥上停靠的自驾旅行休旅车 -------- */
          <g id="scene-detour-404">
            {/* 404 复古公路盾牌标牌 (立在桥面护栏旁 x=365) */}
            <g transform="translate(365, 115)">
              {/* 标牌立柱 */}
              <line x1="28" y1="36" x2="28" y2="78" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="30" y1="38" x2="30" y2="76" stroke="#64748B" strokeWidth="1" />

              {/* 盾牌板面 */}
              <path
                d="M8 8 H48 C54 8 58 13 58 20 C58 35 32 50 28 52 C24 50 -2 35 -2 20 C-2 13 2 8 8 8 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              {/* 盾牌内描线 */}
              <path
                d="M10 11 H46 C49 11 53 15 53 20 C53 32 31 45 28 47 C25 45 3 32 3 20 C3 15 7 11 10 11 Z"
                fill="none"
                stroke="#25A5E3"
                strokeWidth="1.6"
              />
              {/* 标牌文字 */}
              <text
                x="28"
                y="22"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="800"
                letterSpacing="1"
                fill="#334155"
                fontFamily="ui-monospace, monospace"
              >
                ROUTE
              </text>
              <text
                x="28"
                y="38"
                textAnchor="middle"
                fontSize="15"
                fontWeight="900"
                letterSpacing="0.5"
                fill="#0F172A"
                fontFamily="ui-monospace, monospace"
              >
                404
              </text>
            </g>

            {/* 精密手绘自驾休旅车 (SUV/Wagon，停在桥面 x=470, y=120) */}
            <g transform="translate(470, 122)">
              {/* 车底阴影 */}
              <ellipse cx="78" cy="71" rx="80" ry="4.5" fill="#0F172A" opacity="0.3" />

              {/* 车顶行李架与行李箱 (自驾出游灵魂属性) */}
              {/* 行李架双横梁 */}
              <line x1="32" y1="18" x2="120" y2="18" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="44" y1="18" x2="44" y2="23" stroke="#0F172A" strokeWidth="2" />
              <line x1="108" y1="18" x2="108" y2="23" stroke="#0F172A" strokeWidth="2" />

              {/* 旅行行李箱 1 (主箱，带手绘排线与绑带) */}
              <rect x="42" y="5" width="46" height="14" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <line x1="56" y1="5" x2="56" y2="19" stroke="#25A5E3" strokeWidth="1.6" />
              <line x1="74" y1="5" x2="74" y2="19" stroke="#25A5E3" strokeWidth="1.6" />
              <path d="M61 5 V2 H69 V5" stroke="#0F172A" strokeWidth="1.5" fill="none" />

              {/* 旅行行李包 2 (斜放小包，暖阳橘) */}
              <path
                d="M92 9 Q97 5 107 8 Q114 11 112 19 H90 Z"
                fill="#FFF7ED"
                stroke="#FF7F50"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* SUV 车体轮廓 */}
              {/* 车窗与车顶 (A/B/C/D柱) */}
              <path
                d="M32 40 L46 23 H116 L136 40 Z"
                fill="#F8FAFC"
                stroke="#0F172A"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              {/* 车窗手绘分隔 */}
              <path d="M48 38 L58 26 H80 V38 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M84 26 H112 L128 38 H84 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.6" />

              {/* 车身下半截与轮拱 (白底白身，手绘黑色墨水钢笔描边) */}
              <path
                d="M14 54 
                   C14 44 22 41 34 40 
                   L138 40 
                   C150 41 158 46 158 54 
                   L158 60 
                   L140 60 
                   C140 51 128 47 118 47 
                   C108 47 98 51 98 60 
                   L62 60 
                   C62 51 50 47 40 47 
                   C30 47 20 51 20 60 
                   L14 60 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              {/* TrustGo 品牌蓝腰线 */}
              <path d="M26 46 L148 46" stroke="#25A5E3" strokeWidth="2.4" strokeLinecap="round" />

              {/* 门把手 */}
              <line x1="68" y1="50" x2="78" y2="50" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <line x1="96" y1="50" x2="106" y2="50" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

              {/* 车灯 */}
              <path d="M152 47 L156 51 H148 Z" fill="#25A5E3" stroke="#25A5E3" strokeWidth="1" />
              <path d="M16 47 L14 51 H18 Z" fill="#FF7F50" stroke="#FF7F50" strokeWidth="1.2" />

              {/* 后车轮 */}
              <circle cx="41" cy="61" r="13" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
              <circle cx="41" cy="61" r="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx="41" cy="61" r="2.5" fill="#25A5E3" />

              {/* 前车轮 */}
              <circle cx="119" cy="61" r="13" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
              <circle cx="119" cy="61" r="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx="119" cy="61" r="2.5" fill="#25A5E3" />
            </g>
          </g>
        ) : (
          /* -------- 500 场景：车头开盖检修 + 交通锥 + 调校小扳手 -------- */
          <g id="scene-pitstop-500">
            {/* 精密手绘自驾休旅车 (检修状态，开机盖 x=460, y=122) */}
            <g transform="translate(460, 122)">
              {/* 车底阴影 */}
              <ellipse cx="78" cy="71" rx="80" ry="4.5" fill="#0F172A" opacity="0.3" />

              {/* 车顶行李架 */}
              <line x1="32" y1="18" x2="120" y2="18" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="44" y1="18" x2="44" y2="23" stroke="#0F172A" strokeWidth="2" />
              <line x1="108" y1="18" x2="108" y2="23" stroke="#0F172A" strokeWidth="2" />
              <rect x="42" y="5" width="46" height="14" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <line x1="56" y1="5" x2="56" y2="19" stroke="#25A5E3" strokeWidth="1.6" />
              <line x1="74" y1="5" x2="74" y2="19" stroke="#25A5E3" strokeWidth="1.6" />

              {/* 车窗与车顶 */}
              <path
                d="M32 40 L46 23 H116 L136 40 Z"
                fill="#F8FAFC"
                stroke="#0F172A"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d="M48 38 L58 26 H80 V38 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M84 26 H112 L128 38 H84 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.6" />

              {/* 车体 */}
              <path
                d="M14 54 
                   C14 44 22 41 34 40 
                   L138 40 
                   C150 41 158 46 158 54 
                   L158 60 
                   L140 60 
                   C140 51 128 47 118 47 
                   C108 47 98 51 98 60 
                   L62 60 
                   C62 51 50 47 40 47 
                   C30 47 20 51 20 60 
                   L14 60 Z"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              <path d="M26 46 L148 46" stroke="#25A5E3" strokeWidth="2.4" strokeLinecap="round" />

              {/* 车灯 */}
              <path d="M152 47 L156 51 H148 Z" fill="#25A5E3" stroke="#25A5E3" strokeWidth="1" />
              <path d="M16 47 L14 51 H18 Z" fill="#FF7F50" stroke="#FF7F50" strokeWidth="1.2" />

              {/* 车轮 */}
              <circle cx="41" cy="61" r="13" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
              <circle cx="41" cy="61" r="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx="119" cy="61" r="13" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
              <circle cx="119" cy="61" r="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />

              {/* 发动机盖打开 (Hood Open) */}
              <line x1="138" y1="40" x2="162" y2="18" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="150" y1="30" x2="150" y2="40" stroke="#0F172A" strokeWidth="1.6" />

              {/* 轻盈检修微雾 */}
              <path
                d="M154 14 Q162 6 156 0 Q150 -6 158 -12"
                fill="none"
                stroke="#25A5E3"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
            </g>

            {/* 手绘交通安全锥 (Traffic Cone x=640) */}
            <g transform="translate(640, 160)">
              <ellipse cx="14" cy="32" rx="15" ry="3.5" fill="#0F172A" opacity="0.25" />
              <path d="M2 31 L26 31" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M5 31 L12 8 H16 L23 31 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.2" strokeLinejoin="round" />
              <polygon points="7,25 21,25 19,19 9,19" fill="#FF7F50" stroke="#FF7F50" strokeWidth="0.5" />
              <polygon points="10,16 18,16 16,11 12,11" fill="#25A5E3" stroke="#25A5E3" strokeWidth="0.5" />
            </g>

            {/* 调校小扳手手绘图标 (Tuning Wrench x=420) */}
            <g transform="translate(420, 155) rotate(-20)">
              <circle cx="10" cy="10" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M6 6 L14 14 M11 5 L15 9 M5 11 L9 15" stroke="#25A5E3" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
