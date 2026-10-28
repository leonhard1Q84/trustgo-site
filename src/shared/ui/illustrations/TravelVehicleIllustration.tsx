import React from 'react';

interface TravelVehicleIllustrationProps {
  /**
   * 场景变体：
   * - '404' | 'detour': 偏离既定路线 / 迷路探索 (Scenic Detour)
   * - '500' | 'pit-stop': 旅途故障 / 临时检修 (Quick Pit Stop)
   * - 'empty-search' | 'no-cars': 搜索无可用车辆 / 日期行程调整 (Search Dates & Inventory)
   */
  variant?: '404' | 'detour' | '500' | 'pit-stop' | 'empty-search' | 'no-cars';
  className?: string;
}

/**
 * 纯粹精致的手绘自驾旅途车辆场景 (不叠加城市天际线，专注文车与旅途情境)
 */
export function TravelVehicleIllustration({
  variant = '404',
  className = 'w-full max-w-md mx-auto h-auto',
}: TravelVehicleIllustrationProps) {
  const is404 = variant === '404' || variant === 'detour';
  const is500 = variant === '500' || variant === 'pit-stop';

  return (
    <div className={`relative select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 460 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.02" />
            <stop offset="50%" stopColor="#0F172A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* ================= 1. 公路路面与地平线 ================= */}
        {/* 路基渐变底 */}
        <path d="M20 148 C140 142 320 142 440 148 L445 158 C320 154 140 154 15 158 Z" fill="url(#roadGlow)" />
        {/* 公路主干线 */}
        <path d="M20 148 C150 142 310 142 440 148" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M40 156 C160 152 300 152 420 156" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 4" strokeLinecap="round" />
        {/* 公路中间手绘虚线分道线 */}
        <line x1="55" y1="149" x2="105" y2="147" stroke="#64748B" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
        <line x1="125" y1="146" x2="205" y2="145" stroke="#64748B" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
        <line x1="225" y1="145" x2="315" y2="145" stroke="#64748B" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
        <line x1="335" y1="146" x2="415" y2="148" stroke="#64748B" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />

        {/* 路旁手绘小草芽 (增添旅途呼吸感) */}
        <path d="M30 148 Q33 140 35 146 Q38 139 40 148" stroke="#64748B" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M422 149 Q425 141 427 147 Q430 140 433 149" stroke="#64748B" strokeWidth="1.3" fill="none" strokeLinecap="round" />

        {/* 天空悠闲手绘小云朵 */}
        <g stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" className="opacity-70">
          <path d="M75 38 Q85 30 96 36 Q106 31 114 38 Q122 36 126 42 H70 Q68 42 75 38 Z" />
          <path d="M350 28 Q358 22 366 26 Q374 21 380 27 Q386 25 390 30 H346 Q344 30 350 28 Z" strokeWidth="1.1" />
        </g>

        {/* ================= 2. 核心手绘自驾旅行车 (Travel Wagon / SUV) ================= */}
        {/* 车身放置在 x=150~320, y=70~146 */}
        <g id="travel-car" transform="translate(170, 75)">
          {/* 车底阴影 */}
          <ellipse cx="78" cy="71" rx="82" ry="4.5" fill="#0F172A" opacity="0.25" />

          {/* 车顶行李架与旅行箱 */}
          {/* 行李架金属横梁 */}
          <line x1="30" y1="18" x2="124" y2="18" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="42" y1="18" x2="42" y2="23" stroke="#0F172A" strokeWidth="2" />
          <line x1="112" y1="18" x2="112" y2="23" stroke="#0F172A" strokeWidth="2" />

          {/* 旅行行李箱 1 (主皮箱，带手绘绑带) */}
          <rect x="40" y="5" width="46" height="14" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <line x1="54" y1="5" x2="54" y2="19" stroke="#25A5E3" strokeWidth="1.6" />
          <line x1="72" y1="5" x2="72" y2="19" stroke="#25A5E3" strokeWidth="1.6" />
          <path d="M59 5 V2 H67 V5" stroke="#0F172A" strokeWidth="1.5" fill="none" />

          {/* 旅行行李包 2 (暖阳橘斜靠小包) */}
          <path
            d="M92 9 Q97 5 107 8 Q114 11 112 19 H90 Z"
            fill="#FFF7ED"
            stroke="#FF7F50"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* 车窗与车顶 */}
          <path
            d="M32 40 L46 23 H116 L136 40 Z"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* 车窗分块与浅蓝天色微光 */}
          <path d="M48 38 L58 26 H80 V38 Z" fill="#F0F9FF" stroke="#0F172A" strokeWidth="1.6" />
          <path d="M84 26 H112 L128 38 H84 Z" fill="#F0F9FF" stroke="#0F172A" strokeWidth="1.6" />

          {/* 车身轮廓与轮拱 (纯净白底，墨水线条) */}
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

          {/* 品牌晴空蓝腰线 */}
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

        {/* ================= 3. 场景化分支元素 ================= */}
        {is404 ? (
          /* -------- 404: 优雅的 ROUTE 404 公路盾牌路标 (左侧 x=65) -------- */
          <g id="signpost-404" transform="translate(75, 70)">
            {/* 标牌底阴影 */}
            <ellipse cx="28" cy="78" rx="14" ry="3" fill="#0F172A" opacity="0.2" />
            {/* 标牌立柱 */}
            <line x1="28" y1="36" x2="28" y2="78" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="38" x2="30" y2="76" stroke="#94A3B8" strokeWidth="1" />

            {/* 盾牌板面 */}
            <path
              d="M8 8 H48 C54 8 58 13 58 20 C58 35 32 50 28 52 C24 50 -2 35 -2 20 C-2 13 2 8 8 8 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M10 11 H46 C49 11 53 15 53 20 C53 32 31 45 28 47 C25 45 3 32 3 20 C3 15 7 11 10 11 Z"
              fill="none"
              stroke="#25A5E3"
              strokeWidth="1.6"
            />
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

            {/* 旁边轻微旅途小星芒 */}
            <path d="M56 12 L58 16 L62 17 L58 18 L56 22 L54 18 L50 17 L54 16 Z" fill="#FF7F50" opacity="0.8" />
          </g>
        ) : is500 ? (
          /* -------- 500: 开舱检修 + 交通安全锥 + 调校扳手 -------- */
          <g id="service-500">
            {/* 发动机舱打开盖板 (Hood Open on car) */}
            <g transform="translate(308, 115)">
              <line x1="0" y1="0" x2="24" y2="-22" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="12" y1="-10" x2="12" y2="0" stroke="#0F172A" strokeWidth="1.6" />
              {/* 调校小烟气 */}
              <path
                d="M16 -16 Q24 -24 18 -30 Q12 -36 20 -42"
                fill="none"
                stroke="#25A5E3"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
            </g>

            {/* 手绘交通安全锥 (右侧 x=355) */}
            <g transform="translate(355, 112)">
              <ellipse cx="14" cy="33" rx="14" ry="3.5" fill="#0F172A" opacity="0.25" />
              <path d="M2 32 L26 32" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M5 32 L12 9 H16 L23 32 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.2" strokeLinejoin="round" />
              <polygon points="7,26 21,26 19,20 9,20" fill="#FF7F50" stroke="#FF7F50" strokeWidth="0.5" />
              <polygon points="10,17 18,17 16,12 12,12" fill="#25A5E3" stroke="#25A5E3" strokeWidth="0.5" />
            </g>

            {/* 调校小扳手 (左侧 x=115) */}
            <g transform="translate(125, 110) rotate(-20)">
              <circle cx="10" cy="10" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M6 6 L14 14 M11 5 L15 9 M5 11 L9 15" stroke="#25A5E3" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </g>
        ) : (
          /* -------- empty-search: 日程与路线探索路牌 (左侧站立式日历探索站牌 + 放大镜 + 暖阳橘星芒) -------- */
          <g id="search-schedule-sign" transform="translate(70, 60)">
            {/* 站牌底阴影 */}
            <ellipse cx="28" cy="88" rx="15" ry="3.2" fill="#0F172A" opacity="0.2" />
            {/* 标牌立柱 */}
            <line x1="28" y1="36" x2="28" y2="88" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="38" x2="30" y2="86" stroke="#94A3B8" strokeWidth="1" />

            {/* 日历便签板 (双装订环 + 晴空蓝顶部横条) */}
            <rect
              x="4"
              y="10"
              width="48"
              height="44"
              rx="6"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M4 23 H52" stroke="#25A5E3" strokeWidth="2.4" />
            {/* 双装订环 */}
            <rect x="13.5" y="6" width="5" height="7.5" rx="1.5" fill="#0F172A" />
            <rect x="33.5" y="6" width="5" height="7.5" rx="1.5" fill="#0F172A" />

            {/* 日历网格刻线 (象征出行日期排程) */}
            <line x1="11" y1="30" x2="23" y2="30" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="36" x2="21" y2="36" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="42" x2="19" y2="42" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

            {/* 探索放大镜 (聚焦在日历右下方日期点位) */}
            <g transform="translate(18, 14)">
              <circle cx="16" cy="18" r="9.5" fill="#F0F9FF" stroke="#0F172A" strokeWidth="2.2" />
              <line x1="23.5" y1="25.5" x2="31" y2="33" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="24" y1="25" x2="28" y2="29" stroke="#FF7F50" strokeWidth="1.2" strokeLinecap="round" />
              {/* 镜片内探索准星 */}
              <circle cx="16" cy="18" r="2.2" fill="#25A5E3" />
              <path d="M16 11.5 V14 M16 22 V24.5 M9.5 18 H12 M20 18 H22.5" stroke="#25A5E3" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
            </g>

            {/* 站牌上方俏皮旅途星芒与探索微光 */}
            <path d="M52 4 L54 8 L58 9 L54 10 L52 14 L50 10 L46 9 L50 8 Z" fill="#FF7F50" opacity="0.9" />
            <circle cx="4" cy="8" r="1.5" fill="#25A5E3" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}
