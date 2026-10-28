import { customerAccountBaseTranslations } from './catalog-customer-account-base';

// prettier-ignore
export type TranslationEntry = { EN: string; ZH: string; ES?: string; KO?: string; JA?: string };
export interface Translations {
  [key: string]: TranslationEntry;
}

export const translations: Translations = {
  // Brand
  brand_name: { EN: 'TrustGo', ZH: 'TrustGo' },
  brand_slogan: { EN: 'Go Easy. Go Happy.', ZH: '輕鬆出發，快樂同行' },
  brand_tagline: {
    EN: 'Carefree, transparent car rental for international road adventures.',
    ZH: '為國際自駕旅行量身打造的自營租車品牌，透明安心。',
  },

  // Navigation
  nav_home: { EN: 'Home', ZH: '首頁' },
  nav_search_cars: { EN: 'Search Cars', ZH: '搜尋車輛' },
  nav_locations: { EN: 'Locations', ZH: '門店分佈' },
  nav_franchise: { EN: 'Fleet Partnership', ZH: '車行加盟' },
  nav_manage_booking: { EN: 'Find My Booking', ZH: '訪客查單' },
  nav_contact: { EN: 'Contact Concierge', ZH: '專屬客服' },
  nav_language: { EN: 'Language', ZH: '語言' },
  nav_menu_open: { EN: 'Open navigation menu', ZH: '打開導航選單' },
  nav_menu_close: { EN: 'Close navigation menu', ZH: '關閉導航選單' },

  // Common UI
  common_back_home: { EN: 'Back to Home', ZH: '返回首頁' },
  common_close: { EN: 'Close', ZH: '關閉' },
  common_copy: { EN: 'Copy', ZH: '複製' },
  common_copied: { EN: 'Copied!', ZH: '已複製！' },
  common_search: { EN: 'Search', ZH: '搜索' },
  common_loading: { EN: 'Loading...', ZH: '加載中...' },
  common_seats: { EN: 'Seats', ZH: '座' },
  common_bags: { EN: 'Bags', ZH: '件行李' },
  common_automatic: { EN: 'Automatic', ZH: '自動擋' },
  common_manual: { EN: 'Manual', ZH: '手動擋' },
  common_per_day: { EN: '/ day', ZH: '/ 天起' },
  common_select_reserve: { EN: 'Select & Reserve', ZH: '選擇並預訂' },
  common_instant_confirmation: { EN: 'Instant Confirmation', ZH: '即時確認' },
  common_free_cancellation: { EN: 'Free Cancellation', ZH: '免費取消' },
  common_clean_guaranteed: { EN: 'Clean Car Guaranteed', ZH: '深度清潔保障' },

  // Home Hero
  home_hero_badge: {
    EN: 'Official Global Car Rental',
    ZH: '國際自駕 官方自營品牌',
  },
  home_hero_title: {
    EN: 'Your Trusted Companion for Carefree Road Trips',
    ZH: '找到理想座駕，輕鬆探索世界',
  },
  home_hero_subtitle: {
    EN: 'From booking to pick-up, clear details for a confident journey.',
    ZH: '從預訂到取車，把重要的事看清楚，輕鬆開啟旅程。',
  },

  // Search Bar
  search_pickup_location: { EN: 'Pick-up Location', ZH: '取車地點' },
  search_pickup_placeholder: {
    EN: 'Airport, city, or depot...',
    ZH: '機場、城市或車站門店...',
  },
  search_return_location: { EN: 'Return Location', ZH: '還車地點' },
  search_return_placeholder: {
    EN: 'Return airport or depot...',
    ZH: '還車機場或門店...',
  },
  search_same_location: { EN: 'Return to same location', ZH: '同店還車' },
  search_different_location: {
    EN: 'Different return location',
    ZH: '異地還車',
  },
  search_dates: { EN: 'Pick-up & Return Dates', ZH: '取還車時間' },
  search_pickup_date: { EN: 'Pick-up Date', ZH: '取車日期' },
  search_return_date: { EN: 'Return Date', ZH: '還車日期' },
  search_driver_age: { EN: 'Driver aged 25–65', ZH: '駕駛人 25–65 歲' },
  search_driver_age_notice: {
    EN: 'Young driver surcharge may apply under 25',
    ZH: '未滿 25 歲可能需支付年輕駕駛人附加費',
  },
  search_submit: { EN: 'Search Cars', ZH: '搜尋車輛' },
  search_loading_vehicles: {
    EN: 'Finding the right vehicles for you…',
    ZH: '正在為你尋找合適的車輛…',
  },
  search_license_country_label: {
    EN: "Driver's License Country",
    ZH: '駕照簽發國家/地區',
  },
  search_age_label: { EN: 'Driver age', ZH: '駕駛人年齡' },
  search_rental_days: { EN: '{days} days', ZH: '{days} 天' },
  search_pickup_time: { EN: 'Pick-up time', ZH: '取車時間' },
  search_return_time: { EN: 'Return time', ZH: '還車時間' },
  search_cal_prev_month: { EN: 'Previous month', ZH: '上個月' },
  search_cal_next_month: { EN: 'Next month', ZH: '下個月' },
  search_cal_local_time: { EN: 'All times are local to the pick-up location.', ZH: '所有時間均為取車門店當地時間。' },
  search_cal_select_return: { EN: 'Select a return date', ZH: '請選擇還車日期' },
  search_cal_confirm: { EN: 'Done', ZH: '完成' },
  search_error_pickup: { EN: 'Oops! Please select a pick-up location first.', ZH: '哎呀！請先選擇取車地點。' },
  search_error_return: { EN: 'Oops! Please select a return location.', ZH: '哎呀！請選擇還車地點。' },
  search_edit: { EN: 'Edit', ZH: '修改' },
  search_license_country_change: { EN: 'Change', ZH: '更換' },
  search_license_country_hint: {
    EN: 'Determines applicable rate plans and local document eligibility',
    ZH: '決定適用的費率套餐與目的地法定准駕證件要求',
  },
  search_license_country_search_placeholder: {
    EN: 'Search country or region...',
    ZH: '搜索國家或地區...',
  },
  search_license_country_popular: {
    EN: 'Popular Markets & Regions',
    ZH: '常用國家與出發地',
  },

  // Promises / Values (Why TrustGo)
  promises_section_badge: { EN: 'Why TrustGo', ZH: '服務承諾' },
  promises_section_title: {
    EN: 'Travel with Total Confidence',
    ZH: '清晰透明，全程安心出發',
  },
  promises_section_subtitle: {
    EN: 'Every policy, fee, and requirement is crystal clear before you book.',
    ZH: '每項條款、費用與保險保障在您下單前均清晰可讀，絕無隱藏套路。',
  },
  promises_easy_title: { EN: 'Clear Pricing Upfront', ZH: '費用預訂前透明標註' },
  promises_easy_desc: {
    EN: 'Itemized rental, taxes, and add-ons before you pay.',
    ZH: '租金、稅費與附加費用，預訂前逐項了解。',
  },
  promises_confidence_title: {
    EN: 'Clear Cover & Deposit',
    ZH: '保障條款與押金清晰',
  },
  promises_confidence_desc: {
    EN: 'Understand your excess, coverage, and deposit terms clearly.',
    ZH: '涵蓋範圍、免賠額度與押金退還規則一目了然。',
  },
  promises_freedom_title: {
    EN: 'Pick-up Guidance',
    ZH: '門店指引與證件清單',
  },
  promises_freedom_desc: {
    EN: 'Depot hours, location instructions, and checklist ready in advance.',
    ZH: '門店位置、營業時間與所需證件，出發前輕鬆掌握。',
  },

  // Traveler Stories / Reviews
  reviews_verified_badge: {
    EN: 'Verified Traveler Reviews',
    ZH: '認證真實評價',
  },
  reviews_section_title: {
    EN: 'Loved by Road Trippers',
    ZH: '全球自駕旅行者真實口碑',
  },
  reviews_section_subtitle: {
    EN: 'Over 120,000+ verified trips, rated 4.9/5.0 for transparent and reliable journeys.',
    ZH: '累積超過 120,000+ 筆真實用車訂單，綜合評分 4.9 / 5.0，紀錄每次安心出發。',
  },
  reviews_based_score: {
    EN: 'Rated 4.9/5 based on verified traveler experiences',
    ZH: '綜合評分 4.9/5 · 基於真實用車訂單評價',
  },
  reviews_item1_quote: {
    EN: 'Zero wait time at the LAX airport depot and completely transparent pricing. Smoothest rental experience ever!',
    ZH: '洛杉磯機場取車完全不需要排隊，價格明細一目了然，是我海外租車體驗最棒的一次！',
  },
  reviews_item1_author: { EN: 'David M.', ZH: 'David M.' },
  reviews_item1_country: { EN: 'United States', ZH: '美國' },
  reviews_item1_route: {
    EN: 'California Highway 1 (LA to SF)',
    ZH: '加州一號公路（洛杉磯 - 舊金山）',
  },
  reviews_item1_category: { EN: 'Full-size SUV', ZH: '全尺寸 SUV' },
  reviews_item2_quote: {
    EN: 'Car was spotless, fuel policy was completely like-for-like as promised. Truly made our family holiday unforgettable.',
    ZH: '車輛整備非常乾淨，滿油取還政策完全透明，為我們的全家澳洲度假帶來了美好回憶。',
  },
  reviews_item2_author: { EN: 'Hannah K.', ZH: 'Hannah K.' },
  reviews_item2_country: { EN: 'Germany', ZH: '德國' },
  reviews_item2_route: {
    EN: 'Melbourne to Great Ocean Road',
    ZH: '墨爾本至大洋路自駕',
  },
  reviews_item2_category: { EN: 'Standard Sedan', ZH: '舒適型轎車' },
  reviews_item3_quote: {
    EN: 'The friendly staff explained all local driving rules patiently. No pushy upsells at the counter. 10/10 recommend!',
    ZH: '門店工作人員耐心講解了當地的駕駛注意事項，沒有任何強行推銷保險，強烈推薦！',
  },
  reviews_item3_author: { EN: 'Kenji S.', ZH: '佐藤 健治' },
  reviews_item3_country: { EN: 'Japan', ZH: '日本' },
  reviews_item3_route: { EN: 'Hokkaido Scenic Ring', ZH: '北海道景觀環線' },
  reviews_item3_category: { EN: 'Compact Wagon', ZH: '緊湊型旅行車' },
  reviews_item4_quote: {
    EN: 'Traveling with two kids and multiple bags — the 7-seater had plenty of room and child seats were pre-installed perfectly.',
    ZH: '帶兩個孩子行李很多，提前確認的 7 人座空間非常充裕，兒童安全座椅也已提前裝好，非常貼心。',
  },
  reviews_item4_author: { EN: 'Sarah L.', ZH: 'Sarah L.' },
  reviews_item4_country: { EN: 'Canada', ZH: '加拿大' },
  reviews_item4_route: {
    EN: 'Orlando Family Theme Park Route',
    ZH: '奧蘭多家庭自駕主題遊',
  },
  reviews_item4_category: { EN: '7-Seater Minivan', ZH: '7座 商務休旅車' },
  reviews_item5_quote: {
    EN: 'One-way drop-off was completely seamless. Clear depot return instructions and zero surprise return fees.',
    ZH: '單程異地還車流程極其順暢，還車地點指引精確到停車位，完全沒有額外爭議收費。',
  },
  reviews_item5_author: { EN: 'Marc D.', ZH: 'Marc D.' },
  reviews_item5_country: { EN: 'France', ZH: '法國' },
  reviews_item5_route: {
    EN: 'Frankfurt to Munich (One-Way)',
    ZH: '法蘭克福至慕尼黑（異地還車）',
  },
  reviews_item5_category: { EN: 'Premium Estate', ZH: '高階旅行轎跑' },
  reviews_item6_quote: {
    EN: 'Flight was delayed by nearly 2 hours, but depot staff held our reservation and handed over the car swiftly. Lifesaver!',
    ZH: '航班延誤了近 2 小時，抵達羽田機場時工作人員依然保留了預訂，快速辦理交車，拯救了我們的行程！',
  },
  reviews_item6_author: { EN: 'Elena R.', ZH: 'Elena R.' },
  reviews_item6_country: { EN: 'Australia', ZH: '澳洲' },
  reviews_item6_route: {
    EN: 'Tokyo Haneda to Mt. Fuji & Hakone',
    ZH: '東京羽田至富士山箱根',
  },
  reviews_item6_category: { EN: 'Hybrid SUV', ZH: '油電混動休旅' },

  // Inspirations
  inspirations_section_title: {
    EN: 'Inspirations for Your Next Adventure',
    ZH: '自駕靈感 · 精選風景公路',
  },
  inspirations_section_subtitle: {
    EN: 'Curated scenic road trips with guaranteed vehicle availability.',
    ZH: '探索全球經典自駕路線，精選網點支持，隨時啟程。',
  },
  inspirations_explore_more: {
    EN: 'View All Destinations',
    ZH: '查看更多目的地',
  },
  inspirations_item1_title: {
    EN: 'Pacific Coast Highway',
    ZH: '加州一號太平洋海岸公路',
  },
  inspirations_item1_location: {
    EN: 'California, USA',
    ZH: '美國 · 加利福尼亞',
  },
  inspirations_item1_tag: { EN: 'Ocean & Sunsets', ZH: '落日與海景' },
  inspirations_item2_title: { EN: 'Great Ocean Road', ZH: '墨爾本大洋路' },
  inspirations_item2_location: {
    EN: 'Victoria, Australia',
    ZH: '澳大利亞 · 維多利亞',
  },
  inspirations_item2_tag: { EN: 'Coastal Wildlife', ZH: '海岸與自然' },
  inspirations_item3_title: {
    EN: 'Hokkaido Panoramic Circuit',
    ZH: '北海道四季全景環線',
  },
  inspirations_item3_location: { EN: 'Hokkaido, Japan', ZH: '日本 · 北海道' },
  inspirations_item3_tag: { EN: 'Four Seasons', ZH: '四季之美' },

  // Fleet Showcase
  fleet_title: {
    EN: 'Verified Vehicles for Every Journey',
    ZH: '優質可靠車隊，伴您安心出發',
  },
  fleet_subtitle: {
    EN: 'From compact city cruisers to rugged full-size 4WDs, maintained to pristine standards.',
    ZH: '從經濟型轎車、城市休旅到四驅越野，全車隊均經嚴格清潔與安全整備。',
  },
  fleet_view_all: { EN: 'View All Vehicles', ZH: '查看全部車型' },
  fleet_badge_popular: { EN: 'Most Popular', ZH: '熱門首選' },
  fleet_badge_value: { EN: 'Best Value', ZH: '高性價比' },
  fleet_badge_spacious: { EN: 'Family Choice', ZH: '家庭首選' },
  fleet_feature_unlimited_mileage: { EN: 'Unlimited Mileage', ZH: '不限里程' },
  fleet_feature_free_cancellation: { EN: 'Free Cancellation', ZH: '免費取消' },
  fleet_feature_touchless_pickup: { EN: 'Touchless Pickup', ZH: '快捷取車' },
  fleet_cat_intermediate_suv: { EN: 'Intermediate SUV', ZH: '緊湊型 SUV' },
  fleet_cat_compact_hatchback: {
    EN: 'Compact Hatchback',
    ZH: '經濟型兩廂轎車',
  },
  fleet_cat_standard_sedan: { EN: 'Standard Sedan', ZH: '標準三廂轎車' },
  fleet_cat_minivan: { EN: '7-Seater People Mover', ZH: '7座商務/家用休旅車' },

  // How It Works
  how_title: {
    EN: '3 Simple Steps to Hit the Open Road',
    ZH: '輕鬆 3 步，開啟自由自駕之旅',
  },
  how_step1_title: { EN: '1. Search & Select', ZH: '1. 搜索與選車' },
  how_step1_desc: {
    EN: 'Pick your dates and location. Compare clear, upfront prices with zero surprise fees.',
    ZH: '選擇取還網點與日期，即時查看包含全險與透明價格的可用車輛。',
  },
  how_step2_title: { EN: '2. Reserve Online', ZH: '2. 在線預約確認' },
  how_step2_desc: {
    EN: 'Instant confirmation with your voucher and depot instructions delivered right away.',
    ZH: '極簡在線預訂，即時出單並獲取詳細的取車憑證與門店指引。',
  },
  how_step3_title: { EN: '3. Pick Up & Go', ZH: '3. 門店提車出發' },
  how_step3_desc: {
    EN: 'Fast counter check-in or seamless touchless pick-up at airport & city locations.',
    ZH: '機場或市區門店快速核驗證件，同油取還，享受無憂自駕時光。',
  },

  // Rent Page
  rent_page_title: {
    EN: 'Available Fleet & Rate Details',
    ZH: '可租車型與費率詳情',
  },
  rent_page_subtitle: {
    EN: 'Transparent rates with full excess reduction options. Instant reservation confirmation.',
    ZH: '透明每日租金、零免賠額保障選項、即時生成預訂憑證。',
  },
  rent_filter_all: { EN: 'All Categories', ZH: '全車種' },
  rent_filter_suv: { EN: 'SUV & 4WD', ZH: 'SUV / 越野' },
  rent_filter_sedan: { EN: 'Sedans', ZH: '轎車' },
  rent_filter_people_mover: { EN: 'People Movers', ZH: '多座休旅' },
  rent_disclaimer: {
    EN: 'Rates include standard vehicle liability, local taxes, and 24/7 roadside assistance. Fuel policy: Like-for-like (return full).',
    ZH: '報價包含法定基本責任險、當地稅費與 24/7 緊急道路救援。燃油政策：滿油取還（Like-for-like）。',
  },

  // Manage Booking Page
  manage_page_title: { EN: 'Find Your Reservation', ZH: '訪客憑號查單' },
  manage_page_subtitle: {
    EN: 'Enter your booking confirmation code and driver surname to check voucher status, counter pick-up instructions, or cancel your rental.',
    ZH: '輸入預訂確認號與主駕駛人姓氏，查詢最新訂單狀態、取車指引、費用明細或在線取消。',
  },
  manage_code_label: { EN: 'Booking Confirmation Code', ZH: '預訂確認號' },
  manage_code_placeholder: {
    EN: 'e.g. TG-2026-88992',
    ZH: '例如：TG-2026-88992',
  },
  manage_lastname_label: {
    EN: 'Driver Last Name (Surname)',
    ZH: '主駕駛人姓氏（英文或拼音）',
  },
  manage_lastname_placeholder: {
    EN: 'e.g. Smith / Wang',
    ZH: '例如：Wang 或 Smith',
  },
  manage_submit_button: { EN: 'Look up Reservation', ZH: '查詢訂單詳情' },
  manage_searching: {
    EN: 'Verifying with FleetEdge Cloud...',
    ZH: '正在聯網驗證訂單...',
  },
  manage_demo_hint: {
    EN: 'Quick demo fill: Click below to preview an active reservation state.',
    ZH: '測試示範：點擊下方按鈕可快速填入並預覽已確認訂單。',
  },
  manage_demo_fill: {
    EN: 'Fill Demo Order (TG-88992 / Wang)',
    ZH: '填入示範訂單（TG-88992 / Wang）',
  },
  manage_result_title: {
    EN: 'Reservation Confirmed',
    ZH: '預訂狀態：已確認 (Confirmed)',
  },
  manage_result_status_badge: {
    EN: 'Active · Ready for Pick-up',
    ZH: '有效訂單 · 待取車',
  },
  manage_result_car_label: { EN: 'Booked Vehicle', ZH: '預訂車型' },
  manage_result_pickup_label: {
    EN: 'Pick-up Hub & Time',
    ZH: '取車門店與時間',
  },
  manage_result_return_label: {
    EN: 'Drop-off Hub & Time',
    ZH: '還車門店與時間',
  },
  manage_result_rate_label: { EN: 'Total Charge', ZH: '租金總額' },
  manage_result_included_label: { EN: 'Included Coverage', ZH: '已含保障' },
  manage_result_included_val: {
    EN: 'Zero Excess Protection + Unlimited Mileage',
    ZH: '零免賠保障（Zero Excess）+ 不限里程',
  },
  manage_cancel_action: { EN: 'Cancel This Reservation', ZH: '在線取消預訂' },
  manage_cancel_notice: {
    EN: 'Free cancellation is available up to 48 hours before pick-up.',
    ZH: '取車前 48 小時前可享受免費取消並全額退款。',
  },
  manage_help_title: {
    EN: 'Need Urgent Assistance with Your Itinerary?',
    ZH: '遇到緊急行程變更？',
  },
  manage_help_desc: {
    EN: 'Reach our 24/7 Global Concierge on WhatsApp or WeChat for real-time adjustments.',
    ZH: '歡迎隨時通過 WhatsApp 或微信聯繫我們的 7x24 小時全球專屬客服管家。',
  },

  // Locations Page
  locations_page_title: {
    EN: 'Worldwide Rental Hubs & Depot Network',
    ZH: '全球門店網點與服務中心',
  },
  locations_page_subtitle: {
    EN: 'Convenient airport terminals and city-center depots in key international destinations.',
    ZH: '覆蓋主要國際旅遊目的地的機場航站樓與市中心核心網點，便捷提車。',
  },
  locations_hours: { EN: 'Operating Hours:', ZH: '營業時間：' },
  locations_phone: { EN: 'Concierge Hotline:', ZH: '服務電話：' },
  locations_address: { EN: 'Address:', ZH: '門店地址：' },
  locations_type_airport: {
    EN: 'Airport Terminal Hub',
    ZH: '機場航站樓專屬網點',
  },
  locations_type_shuttle: {
    EN: 'Airport Shuttle Hub',
    ZH: '機場免費穿梭巴士站點',
  },
  locations_type_city: { EN: 'City Center Depot', ZH: '市中心核心自營門店' },

  // Franchise Page & FleetEdge B2B
  franchise_badge: {
    EN: 'FleetEdge OS · Global Fleet Partnership',
    ZH: 'FleetEdge OS · 全球車隊加盟與運力協同',
  },
  franchise_hero_title: {
    EN: 'Grow Your Fleet with TrustGo & FleetEdge OS',
    ZH: '加盟 TrustGo · 接入 FleetEdge 智能車隊系統',
  },
  franchise_hero_desc: {
    EN: 'Not just a brand partnership — get our proprietary FleetEdge system, connect directly to global OTAs, automate smart dispatch, comprehensively optimize fleet operations, and maximize vehicle utilization and profitability.',
    ZH: '不僅是品牌加盟，更一站式接入自研 FleetEdge 系統。直連全球主流 OTA 渠道，支持智能動態排單與綜合車隊調度，全面盤活運力，大幅提升車隊車輛利用率與綜合收益。',
  },
  franchise_cta_apply: {
    EN: 'Apply for Partnership',
    ZH: '立即申請加盟',
  },
  franchise_cta_merchant_login: {
    EN: 'Merchant Portal',
    ZH: '商戶後台登錄',
  },
  franchise_badge_fe: {
    EN: 'FleetEdge Proprietary OS',
    ZH: 'FleetEdge 自研系統',
  },
  franchise_badge_ota: {
    EN: 'Direct Global OTA Sync',
    ZH: '全球主流 OTA 直連',
  },
  franchise_badge_dispatch: {
    EN: 'Smart Dispatch & 0 Conflict',
    ZH: '智能動態排單 0 衝突',
  },
  franchise_badge_utilization: {
    EN: 'Max Fleet Utilization',
    ZH: '提升車輛在租利用率',
  },
  fe_console_title: {
    EN: 'FleetEdge OS · Dispatch Center',
    ZH: 'FleetEdge OS · 智能車隊調度中心',
  },
  fe_console_subtitle: {
    EN: 'Global Fleet Live Operations & Dispatch',
    ZH: '全球網絡實時車隊運營與排單看板',
  },
  fe_status_online: {
    EN: 'System Live',
    ZH: '系統在線',
  },
  fe_metric_utilization: {
    EN: 'Fleet In-rental Utilization',
    ZH: '車隊在租利用率',
  },
  fe_metric_utilization_growth: {
    EN: '+12.4% vs prev',
    ZH: '+12.4% 同期提升',
  },
  fe_metric_dispatch: {
    EN: 'AI Smart Auto-Dispatch',
    ZH: 'AI 智能動態排單',
  },
  fe_metric_dispatch_unit: {
    EN: 'vehicles active',
    ZH: '輛調度中',
  },
  fe_metric_dispatch_sub: {
    EN: '0-conflict auto matching',
    ZH: '0 衝突無縫自動派單',
  },
  fe_chart_title: {
    EN: 'Revenue & Utilization Growth',
    ZH: '收益與車輛周轉增長趨勢',
  },
  fe_chart_growth: {
    EN: 'Avg. +38% after onboarding',
    ZH: '加盟後平均提升 38%',
  },
  fe_channels_label: {
    EN: 'Connected Global Channels',
    ZH: '已直連全球主流平台',
  },
  fe_channels_count: {
    EN: '10+ Global OTAs Live',
    ZH: '10+ 全球主流 OTA 實時同步',
  },
  partners_franchise_title: {
    EN: 'Our Platform Partners',
    ZH: '平台合作夥伴',
  },
  partners_franchise_intro: {
    EN: 'We help you reach more customers through leading global travel and rental platforms.',
    ZH: '幫助車隊直連全球頂級旅行預訂平台，觸達千萬級跨境與本地租車用戶。',
  },
  partners_visit_website: {
    EN: 'Visit website',
    ZH: '訪問官網',
  },
  partners_new_tab: {
    EN: '(opens in a new tab)',
    ZH: '(在新標籤頁打開)',
  },
  franchise_capabilities_title: {
    EN: 'FleetEdge Core Operating Capabilities',
    ZH: 'FleetEdge 核心系統能力',
  },
  franchise_capabilities_desc: {
    EN: 'A purpose-built car rental operating system powering dispatch, fleet adjustment, multi-channel sync, and yield maximization.',
    ZH: '專為現代車行打造的數字化操作系統，從智能排單、綜合車隊調度到多渠道直連，全面盤活車隊運力。',
  },
  franchise_feature_dispatch_title: {
    EN: 'Smart Auto Dispatch & Scheduling',
    ZH: '智能動態排單與無縫銜接',
  },
  franchise_feature_dispatch_desc: {
    EN: 'Algorithmic vehicle-to-order assignment eliminates scheduling gaps, resolves booking conflicts, and prevents double booking.',
    ZH: '獨創排單算法自動匹配車輛與訂單，消除行程空隙並自動檢測衝突，杜絕超售與重單，顯著提高在租利用率。',
  },
  franchise_feature_fleet_title: {
    EN: 'Comprehensive Fleet Operations & Balancing',
    ZH: '車隊綜合調整與跨網點調度',
  },
  franchise_feature_fleet_desc: {
    EN: 'Dynamic vehicle rebalancing across locations, automated maintenance alerts, and live condition logs keep your fleet healthy and profitable.',
    ZH: '支持跨門店車輛靈活調撥、保養定檢自動預警、在線車況歸檔與車型組升降艙，全方位掌控車隊資產健康度。',
  },
  franchise_feature_channel_title: {
    EN: 'Global Multi-Channel Distribution',
    ZH: '全球主流 OTA 渠道一鍵直連',
  },
  franchise_feature_channel_desc: {
    EN: 'Directly sync inventory, rates, and bookings with Booking.com, Trip.com, Klook, Carmore, Skyscanner, and more in real time.',
    ZH: '直連 Booking.com、Trip.com、Klook、租租車、Carmore、Skyscanner 等主流渠道，房態與價格毫秒級實時同步。',
  },
  franchise_feature_yield_title: {
    EN: 'AI Yield Management & Dynamic Pricing',
    ZH: 'AI 動態調價與收益管理',
  },
  franchise_feature_yield_desc: {
    EN: 'Intelligent pricing algorithms adapt rates according to seasonal trends, local competitor pricing, and remaining fleet stock.',
    ZH: '依據淡旺季需求、本地競品價格與剩餘庫存自適應調價，加盟車隊平均收益提升 38%，兼顧高利用率與高客單價。',
  },
  franchise_stat_countries: {
    EN: 'Covered Markets',
    ZH: '覆蓋國家與地區',
  },
  franchise_stat_countries_sub: {
    EN: 'Japan · Taiwan · Malaysia · Thailand · UAE',
    ZH: '日本 · 台灣 · 馬來西亞 · 泰國 · 阿聯酋',
  },
  franchise_stat_stations: {
    EN: 'Stations & Depots',
    ZH: '合作運營門店',
  },
  franchise_stat_vehicles: {
    EN: 'Fleet Vehicles',
    ZH: '在租運營車輛',
  },
  franchise_stat_channels: {
    EN: 'Connected Channels',
    ZH: '直連分銷渠道',
  },
  franchise_process_title: {
    EN: 'Simple 4-Step Onboarding Process',
    ZH: '極簡 4 步入駐流程',
  },
  franchise_process_1_title: {
    EN: 'Submit Inquiry',
    ZH: '提交意向申請',
  },
  franchise_process_1_desc: {
    EN: 'Share basic contact details, fleet size, and current operating cities.',
    ZH: '填寫您的聯絡方式、車隊規模與主要運營城市。',
  },
  franchise_process_2_title: {
    EN: 'Fleet Qualification Review',
    ZH: '資質與車隊評估',
  },
  franchise_process_2_desc: {
    EN: 'Our B2B team contacts you within 1-2 business days to evaluate your fleet and operations.',
    ZH: '商務團隊將在 1-2 個工作日內對接，評估車隊車況與服務能力。',
  },
  franchise_process_3_title: {
    EN: 'FleetEdge System Onboarding',
    ZH: 'FleetEdge 系統配置與培訓',
  },
  franchise_process_3_desc: {
    EN: 'Set up your merchant workspace, connect OTA channels, and complete team training.',
    ZH: '快速完成商戶端系統開通、OTA 渠道直連配置與車隊標準化 SOP 培訓。',
  },
  franchise_process_4_title: {
    EN: 'Go Live & Boost Utilization',
    ZH: '全渠道上線接單',
  },
  franchise_process_4_desc: {
    EN: 'Your fleet goes live across global channels. Smart dispatch begins filling rental schedules.',
    ZH: '車輛庫存同步推向全球平台，智能排單全面啟動，訂單持續湧入。',
  },
  franchise_form_title: {
    EN: 'Apply for TrustGo Fleet Partnership',
    ZH: '申請加盟 TrustGo 車隊網絡',
  },
  franchise_form_desc: {
    EN: 'Fill out the form below. Our global merchant expansion team will arrange a system demo and consultation.',
    ZH: '請填寫以下信息，我們的全球商戶拓展團隊將第一時間為您安排系統演示與加盟對接。',
  },
  franchise_field_name: {
    EN: 'Contact Name',
    ZH: '聯絡人姓名',
  },
  franchise_field_company: {
    EN: 'Company / Fleet Name',
    ZH: '公司 / 車隊名稱',
  },
  franchise_field_email: {
    EN: 'Business Email',
    ZH: '商務電子郵箱',
  },
  franchise_field_phone: {
    EN: 'Phone / WhatsApp',
    ZH: '聯絡電話 / WhatsApp',
  },
  franchise_field_fleet: {
    EN: 'Fleet Size & Operating Cities',
    ZH: '車隊規模與主要城市',
  },
  franchise_field_notes: {
    EN: 'Cooperation Needs & Notes (Optional)',
    ZH: '合作意向與備註（選填）',
  },
  franchise_form_submit: {
    EN: 'Submit Partnership Application',
    ZH: '提交加盟申請',
  },
  franchise_form_submitting: {
    EN: 'Submitting...',
    ZH: '正在提交...',
  },
  franchise_form_success: {
    EN: 'Application submitted! Our merchant team will contact you within 1-2 business days.',
    ZH: '加盟申請已提交！我們的商務拓展團隊將在 1-2 個工作日內與您聯絡。',
  },
  franchise_form_error: {
    EN: 'Failed to submit. Please try again or reach out directly via Email/WhatsApp.',
    ZH: '提交失敗，請重試或直接通過郵件/WhatsApp 與我們聯絡。',
  },
  franchise_existing_partner_title: {
    EN: 'Already a FleetEdge Partner?',
    ZH: '已經是 FleetEdge 合作夥伴？',
  },
  franchise_existing_partner_desc: {
    EN: 'Log in to your merchant console to manage fleet scheduling, channels, and live revenue.',
    ZH: '登錄商戶端後台，管理您的車隊排單、渠道直連與實時運營收益。',
  },
  franchise_existing_partner_action: {
    EN: 'Open Merchant Console',
    ZH: '進入商戶端後台',
  },
  franchise_direct_contact_title: {
    EN: 'Direct B2B Expansion Contact',
    ZH: '全球商戶拓展直聯通道',
  },
  franchise_direct_contact_desc: {
    EN: 'Prefer direct discussion? Reach our Global Lead directly for immediate partnership evaluation.',
    ZH: '需要即時商務洽談？直接聯絡我們的全球商戶負責人，快速進行合作評估。',
  },
  franchise_benefit1_title: {
    EN: 'Global OTA Distribution',
    ZH: '全球頂級 OTA 渠道直連',
  },
  franchise_benefit1_desc: {
    EN: 'Immediate exposure on Trip.com, Booking.com, and Carmore with automated rate synchronization.',
    ZH: '一鍵對接 Trip.com、Booking.com、Carmore 等全球主流渠道，房價與庫存即時同步。',
  },
  franchise_benefit2_title: {
    EN: 'FleetEdge Smart Management',
    ZH: 'FleetEdge 雲端車隊管理',
  },
  franchise_benefit2_desc: {
    EN: 'Full lifecycle operations, maintenance logs, dynamic pricing, and damage documentation.',
    ZH: '全生命週期管理車輛出入庫、保養定檢、動態智能調價與車損在線歸檔。',
  },
  franchise_benefit3_title: {
    EN: 'Standardized Brand Trust',
    ZH: '統一品牌信任背書',
  },
  franchise_benefit3_desc: {
    EN: 'Benefit from TrustGo’s brand reputation, multilingual customer service, and international dispute support.',
    ZH: '依托 TrustGo 品牌聲譽、多語種 7x24 全球客服與跨國客訴調解機制，提升客戶信賴。',
  },
  franchise_benefit4_title: {
    EN: 'Transparent Settlements',
    ZH: '清晰透明的財務結算',
  },
  franchise_benefit4_desc: {
    EN: 'Automated multi-currency payouts, low transaction friction, and real-time ledger accounting.',
    ZH: '支持多幣種自動對賬與結算週期，無隱藏手續費，賬目一清二楚。',
  },
  franchise_cta_title: {
    EN: 'Ready to Expand Your Rental Fleet?',
    ZH: '準備好拓展您的車隊業務了嗎？',
  },
  franchise_cta_desc: {
    EN: 'Contact our Global Fleet Partnership Team to schedule a system demonstration and onboarding consultation.',
    ZH: '立即聯繫我們的全球商戶拓展團隊，預約系統演示與加盟對接評估。',
  },
  franchise_cta_email: {
    EN: 'Email Merchant Operations',
    ZH: '發送加盟意向郵件',
  },
  franchise_cta_whatsapp: {
    EN: 'Message B2B Partnership',
    ZH: 'WhatsApp 商業合作洽談',
  },

  // Static Slugs
  slug_about_title: { EN: 'About TrustGo', ZH: '關於 TrustGo' },
  slug_about_desc: {
    EN: 'Meet TrustGo: easy booking, clear rental information and the freedom to explore at your own pace. Go Easy. Go Happy.',
    ZH: '認識 TrustGo：輕鬆預訂、清楚了解租車規則與保障，按自己的節奏探索目的地。輕鬆出發，快樂同行。',
  },
  slug_help_title: {
    EN: 'Help Center & Rental Policies',
    ZH: '幫助中心與租車規則',
  },
  slug_help_desc: {
    EN: 'Clear answers on insurance coverage, cancellation rules, fuel policies, and deposits.',
    ZH: '清晰解答關於車險保障、取消政策、滿油取還及押金預授權的常見問題。',
  },
  slug_self_service_title: {
    EN: 'Online Check-in & Self-Service',
    ZH: '在線身份預審與自助服務',
  },
  slug_self_service_desc: {
    EN: 'Pre-verify your driver documents before arrival for quick touchless key collection.',
    ZH: '出行前在線預審駕照與身份證件，抵達門店後快速領取車鑰匙，即刻出發。',
  },
  slug_terms_title: { EN: 'Terms of Service', ZH: '服務條款' },
  slug_terms_desc: {
    EN: 'Transparent terms governing vehicle rental agreements, payment security, and liability limits.',
    ZH: '關於車輛租賃協議、支付安全、免賠額邊界與各方責任的正式法律條款。',
  },
  slug_privacy_title: { EN: 'Privacy Policy', ZH: '隱私保護政策' },
  slug_privacy_desc: {
    EN: 'How TrustGo protects personal data, driver identification documents, and booking records.',
    ZH: 'TrustGo 遵循最小必要原則保護您的個人身份、駕駛證件與訂單隱私數據。',
  },
  slug_cookies_title: { EN: 'Cookie Policy', ZH: 'Cookie 與追蹤政策' },
  slug_cookies_desc: {
    EN: 'Details on how functional and session cookies are utilized to preserve your rental choices.',
    ZH: '說明我們如何使用功能性 Cookie 保存您的語言偏好與搜索行程上下文。',
  },
  slug_safety_title: {
    EN: 'Safety & Hygiene Standards',
    ZH: '車輛安全與清潔衛生標準',
  },
  slug_safety_desc: {
    EN: 'Our rigorous multi-point mechanical inspection and hospital-grade vehicle sanitization protocol.',
    ZH: '每台車輛均需通過嚴格的機械性能多項安檢與專業深度清潔消毒整備。',
  },
  slug_content_updating: {
    EN: 'Detailed terms and policies are managed via the FleetEdge compliance engine. For active rental clauses, please refer to your booking confirmation voucher or contact 24/7 concierge.',
    ZH: '詳細政策與條款由 FleetEdge 合規引擎統一管理。具體訂單條款請參閱預訂確認憑證或聯繫 7x24 小時在線客服。',
  },

  // Not Found
  not_found_title: { EN: 'Page Not Found', ZH: '找不到該頁面' },
  not_found_desc: {
    EN: 'The page or itinerary link you requested does not exist or has been moved.',
    ZH: '您請求的頁面或行程鏈接不存在，或已被移動至新地址。',
  },
  not_found_button: { EN: 'Return to Homepage', ZH: '返回首頁' },
  not_found_badge: { EN: 'Route 404', ZH: '404 號公路' },
  not_found_scenic_title: { EN: 'Looks like a scenic detour!', ZH: '哎呀，開到了未標記的風景小路' },
  not_found_scenic_desc: {
    EN: "This route isn't on our map yet. Let's get you back on track.",
    ZH: '這條路線暫未收錄在地圖上，帶您重回主幹道。',
  },
  not_found_action_home: { EN: 'Back to Home', ZH: '返回首頁' },
  not_found_action_locations: { EN: 'Explore Locations', ZH: '探索門店' },

  // Route Error / Pit Stop
  error_pit_stop_badge: { EN: 'Pit Stop', ZH: '服務區小憩' },
  error_pit_stop_title: { EN: 'A quick pit stop!', ZH: '旅途小憩，正在檢修調校' },
  error_pit_stop_desc: {
    EN: "We hit an unexpected bump. We'll be back on the road shortly.",
    ZH: '前方路況有些小波動，稍後即可重新出發。',
  },
  error_action_retry: { EN: 'Try Again', ZH: '重試' },
  error_action_home: { EN: 'Back to Home', ZH: '返回首頁' },
  error_action_contact: { EN: 'Contact Support', ZH: '聯繫客服' },

  // Contact Hub (Footer Placement)
  contact_nav_title: { EN: 'Contact', ZH: '聯絡我們' },
  contact_badge: { EN: '24/7 Global Concierge', ZH: '7x24小時 全球專屬管家' },
  contact_title: {
    EN: 'Need help with your rental?',
    ZH: '租車出行遇到問題？',
  },
  contact_desc: {
    EN: 'Reach our human support team instantly via WhatsApp, Email, or WeChat.',
    ZH: '隨時通過 WhatsApp、電子郵件或微信聯繫我們的真人客服團隊。',
  },
  contact_whatsapp_label: { EN: 'WhatsApp Instant', ZH: 'WhatsApp 快速諮詢' },
  contact_whatsapp_hint: {
    EN: 'WhatsApp Instant · Voice & Chat',
    ZH: '7x24小時 語音 / 文字溝通',
  },
  contact_open_whatsapp: { EN: 'Open in WhatsApp', ZH: '打開 WhatsApp' },
  contact_email_label: { EN: 'Official Email', ZH: '官方電子郵件' },
  contact_email_hint: {
    EN: 'Official Inquiry & Booking',
    ZH: '行程諮詢與售後支持',
  },
  contact_send_email: { EN: 'Send Email', ZH: '發送郵件' },
  contact_wechat_label: { EN: 'WeChat Concierge', ZH: '微信專屬客服' },
  contact_wechat_hint: {
    EN: 'Dedicated concierge for international road travelers.',
    ZH: '華人海外自駕專屬客服',
  },
  contact_scan_qr: { EN: 'Scan QR Code', ZH: '掃碼添加微信' },
  contact_wechat_dialog_title: {
    EN: 'WeChat Customer Support',
    ZH: 'TrustGo 微信專屬客服',
  },
  contact_wechat_dialog_desc: {
    EN: 'Scan the QR code with WeChat or add ID: yangsi3010 for human assistance.',
    ZH: '使用微信掃一掃下方二維碼，或搜索微信號 yangsi3010 添加真人客服。',
  },

  // Location Search & POI
  search_location_modal_title: {
    EN: 'Select Pick-up / Return Location',
    ZH: '選擇取車 / 還車地點',
  },
  search_location_pickup_title: {
    EN: 'Select Pick-up Location',
    ZH: '選擇取車地點',
  },
  search_location_return_title: {
    EN: 'Select Return Location',
    ZH: '選擇還車地點',
  },
  search_location_placeholder: {
    EN: 'Search city, airport, landmark or depot (e.g. LAX, Hollywood, Sydney...)',
    ZH: '搜索城市、機場、地標或門店（如 LAX、好萊塢、悉尼...）',
  },
  search_location_recent: { EN: 'Recent Choice', ZH: '最近選擇' },
  search_location_clear_recent: { EN: 'Clear', ZH: '清除' },
  search_location_group_places: {
    EN: 'Popular Locations & POIs',
    ZH: '熱門地點與地標 (POI)',
  },
  search_location_group_stores: {
    EN: 'Official Rental Depots',
    ZH: '官方直營門店',
  },
  search_location_store_count: { EN: 'depots', ZH: '家門店' },
  search_location_select_city: { EN: 'Select City', ZH: '選擇城市' },
  search_location_all_places: { EN: 'All Places', ZH: '全部地點' },
  search_location_no_match: {
    EN: 'No matching location found',
    ZH: '未找到匹配地點',
  },
  search_location_no_match_hint: {
    EN: 'Try searching by airport code (e.g. LAX), landmark or browse countries on the left.',
    ZH: '請嘗試輸入機場代碼 (如 LAX)、熱門地標或在左側瀏覽地區。',
  },
  search_location_request_title: {
    EN: 'Want TrustGo to serve "{query}"?',
    ZH: '希望 TrustGo 支持「{query}」？',
  },
  search_location_request_btn: {
    EN: 'Submit Location Request',
    ZH: '提交地點心願',
  },
  search_location_request_received: {
    EN: 'Thank you! We have logged your request for "{query}".',
    ZH: '感謝反饋！已收到您對「{query}」的開通心願。',
  },
  search_location_back: { EN: 'Back', ZH: '返回' },
  search_location_exact_depot: { EN: 'Exact Depot Match', ZH: '精確匹配門店' },
  poi_kind_airport: { EN: 'Airports', ZH: '機場' },
  poi_kind_transport_hub: { EN: 'Transit Hubs', ZH: '火車站 / 交通樞紐' },
  poi_kind_hotel: { EN: 'Hotels', ZH: '酒店度假區' },
  poi_kind_landmark: { EN: 'Landmarks', ZH: '景點 / 著名地標' },
  poi_kind_other: { EN: 'Other Places', ZH: '其他地點' },

  // Footer
  footer_brand_desc: {
    EN: 'TrustGo is an international car rental brand making self-drive travel easier, safer, and friendlier.',
    ZH: 'TrustGo 是一家致力於讓國際自駕旅行更輕鬆、更安心、更有溫度的自營租車品牌。',
  },
  footer_col_rent_title: { EN: 'Rent a Car', ZH: '租車服務' },
  footer_col_rent_airports: { EN: 'Airport Depots', ZH: '機場門店' },
  footer_col_rent_suv: { EN: 'SUV & 4WD Rentals', ZH: 'SUV 與越野車型' },
  footer_col_rent_electric: { EN: 'Electric & Hybrids', ZH: '新能源與混動車' },
  footer_col_rent_oneway: { EN: 'One-Way Rentals', ZH: '異地還車服務' },
  footer_col_manage_title: { EN: 'Manage Booking', ZH: '預訂管理' },
  footer_col_manage_find: { EN: 'Find My Reservation', ZH: '訪客憑號查單' },
  footer_col_manage_cancel: { EN: 'Cancellation Policy', ZH: '取消與退款政策' },
  footer_col_manage_checkin: { EN: 'Online Check-in', ZH: '在線身份預審' },
  footer_col_manage_insurance: {
    EN: 'Coverage & Deductibles',
    ZH: '保險與免賠額說明',
  },
  footer_col_company_title: { EN: 'About TrustGo', ZH: '關於我們' },
  footer_col_company_about: {
    EN: 'Brand Story & Standards',
    ZH: '品牌故事與標準',
  },
  footer_col_company_franchise: {
    EN: 'Fleet Partnership',
    ZH: 'FleetEdge 車行加盟',
  },
  footer_col_company_sister: { EN: '', ZH: '' },
  footer_col_legal_title: { EN: 'Legal & Policies', ZH: '條款與隱私' },
  footer_col_legal_terms: { EN: 'Terms of Service', ZH: '服務條款' },
  footer_col_legal_privacy: { EN: 'Privacy Policy', ZH: '隱私政策' },
  footer_col_legal_cookie: { EN: 'Cookie Policy', ZH: 'Cookie 政策' },
  footer_col_legal_safety: { EN: 'Safety Standards', ZH: '安全標準' },
  footer_all_rights: {
    EN: '© 2026 TrustGo Inc. All rights reserved.',
    ZH: '© 2026 TrustGo Inc. 保留所有權利。',
  },

  // Search refresh & results
  search_refresh_results: {
    EN: 'Refreshing live availability & rates...',
    ZH: '正在重新檢索即時庫存與優惠報價...',
  },
  search_refresh_booking: {
    EN: 'Refreshing your quote & availability...',
    ZH: '正在重新檢索即時報價與庫存...',
  },
  results_sort_label: { EN: 'Sort by:', ZH: '排序：' },
  results_sort_recommended: { EN: 'Recommended', ZH: '推薦優先' },
  results_sort_price: { EN: 'Price: Low to High', ZH: '價格從低到高' },
  results_sort_rating: { EN: 'Customer Rating', ZH: '客戶評分' },
  results_sort_size: { EN: 'Vehicle Size', ZH: '車輛尺寸' },
  results_rateplan_badge: {
    EN: 'Rate Plan: Verified Zero-Excess Inclusive',
    ZH: '費率方案：已驗證零免賠全包',
  },
  results_empty_title: {
    EN: 'No vehicles available for this trip',
    ZH: '當前行程暫無可預訂車輛',
  },
  results_empty_desc: {
    EN: 'Sorry, there is no available inventory at {location} for your selected dates. Try adjusting pick-up/return times (±1-2 days) or check a nearby depot.',
    ZH: '很抱歉，{location} 在您選擇的日期時間暫無可用庫存。建議微調取還車時間（+/- 1~2 天），或嘗試查看臨近的其他門店。',
  },
  results_adjust_dates: { EN: 'Adjust Dates', ZH: '微調取還車時間' },
  results_adjust_search: { EN: 'Modify Search Criteria', ZH: '修改搜尋條件' },
  results_view_depots: { EN: 'View Other Depots', ZH: '查看其他門店' },
  results_filter_empty_title: { EN: 'No vehicles match current filters', ZH: '沒有符合當前篩選條件的車輛' },
  results_filter_empty_desc: {
    EN: 'There are {count} vehicles available for your trip. Try clearing filters to view all options.',
    ZH: '當前行程共有 {count} 款車型可租，建議清除篩選條件以查看全部可用選項。',
  },
  results_clear_filters: { EN: 'Clear all filters', ZH: '清除所有篩選' },
  results_empty_tip_dates_title: { EN: 'Adjust dates & hours', ZH: '調整取還車時間' },
  results_empty_tip_dates_desc: {
    EN: 'Try adjusting pick-up or drop-off by ±1-2 days, or select regular depot business hours.',
    ZH: '嘗試微調取還車日期（前後 1~2 天），或選擇門店標準營業時間段。',
  },
  results_empty_tip_locations_title: { EN: 'Check nearby depots', ZH: '查看周邊門店' },
  results_empty_tip_locations_desc: {
    EN: 'Major airport hubs or city stations usually offer broader vehicle availability.',
    ZH: '主要機場或城市核心樞紐門店通常擁有更充裕的車隊庫存。',
  },
  results_empty_tip_age_title: { EN: 'Verify driver age', ZH: '確認駕駛人年齡' },
  results_empty_tip_age_desc: {
    EN: 'Standard drivers aged 25–64 have access to the complete fleet catalog.',
    ZH: '25-64 歲主駕駛人可享受全品類車型開放租賃。',
  },
  results_reviews_count: { EN: '({count} reviews)', ZH: '（{count} 條評價）' },
  results_daily_from: { EN: 'Daily Rate from', ZH: '每日租金' },
  results_total: {
    EN: 'Total: {total} ({days} days)',
    ZH: '總計：{total}（{days} 天）',
  },
  results_taxes_included: { EN: 'Taxes & fees included', ZH: '含稅費' },
  results_free_cancel_hours: {
    EN: 'Free cancellation up to {hours}h before pickup',
    ZH: '取車前 {hours} 小時可免費取消',
  },
  results_count: { EN: '{count} cars available', ZH: '共 {count} 款車型可租' },
  results_policy_non_refundable: { EN: 'Non-refundable', ZH: '不可免費取消' },
  results_policy_deposit_free: { EN: 'No deposit', ZH: '免押金' },
  results_policy_deposit: { EN: '{amount} deposit at pick-up', ZH: '取車押金 {amount}' },
  results_policy_limited_mileage: { EN: '{km} km/day included', ZH: '每日限 {km} 公里' },
  results_policy_prepaid_fuel: { EN: 'Pre-purchase fuel', ZH: '預付燃油' },
  results_price_total: { EN: '{total} total', ZH: '總價 {total}' },
  results_price_per_day: { EN: '{price} / day · incl. taxes', ZH: '{price} / 天 · 含稅費' },
  results_view_deal: { EN: 'View deal', ZH: '查看詳情' },
  results_tag_nearest: { EN: 'Nearest', ZH: '最近' },
  results_tag_lowest: { EN: 'Lowest price', ZH: '最低價' },
  results_select: { EN: 'Select', ZH: '選擇' },
  common_opens_new_tab: { EN: 'opens in a new tab', ZH: '在新分頁開啟' },
  results_more_depots: { EN: 'View {count} more nearby depots', ZH: '查看另外 {count} 家門店' },
  results_hide_depots: { EN: 'Hide other depots', ZH: '收起其他門店' },
  results_pickup_label: { EN: 'Pick-up:', ZH: '取車：' },

  // Important rental terms
  terms_title: {
    EN: 'Important Pick-up Requirements & Documents',
    ZH: '重要取車要求與證件規範',
  },
  terms_subtitle: {
    EN: 'Check driver age, valid IDP requirements by origin, and deposit card rules.',
    ZH: '請核對駕駛人年齡、各客源地合法國際駕照（IDP）與到店押金信用卡要求。',
  },
  terms_tab_visitor: {
    EN: 'International Visitor',
    ZH: '非當地居民 / 國際旅客',
  },
  terms_tab_local: { EN: 'Local Resident', ZH: '當地居民 / 本國公民' },
  terms_age_title: {
    EN: 'Driver Age & Experience',
    ZH: '駕駛人年齡與駕齡要求',
  },
  terms_age_desc: {
    EN: 'Main driver must be aged 21-70 and hold a valid full license for 1+ year. A young driver fee may apply under 25.',
    ZH: '主駕駛人須年滿 21 至 70 歲，且持有合法正式駕駛執照滿 1 年以上。未滿 25 歲可能產生青年駕駛人附加費。',
  },
  terms_docs_title: {
    EN: 'Legal Driving Eligibility & Documents',
    ZH: '法定駕駛資格與證件',
  },
  terms_view_samples: { EN: 'Samples by origin', ZH: '各客源地範本' },
  terms_docs_visitor: {
    EN: 'Original passport + physical home license + 1949 Geneva Convention paper IDP (or official Japanese/legal translation).',
    ZH: '護照原件 + 實體本國駕照 + 1949 年日內瓦公約紙本 IDP（或官方授權日文/法定翻譯件）。',
  },
  terms_docs_local: {
    EN: 'Government-issued physical ID (or residence card) + original valid domestic license.',
    ZH: '政府簽發之有效實體身份證件（或在留卡） + 本國合法正式駕照原件。',
  },
  terms_view_idp: {
    EN: 'View IDP / translation samples for all origins',
    ZH: '檢視各國 IDP / 翻譯件實物樣張',
  },
  terms_deposit_title: {
    EN: 'Deposit Pre-authorization',
    ZH: '到店押金預授權',
  },
  terms_deposit_desc: {
    EN: "At pick-up, present a physical credit card in the main driver's name for the deposit hold (approx. {amount}). Released immediately after a clean return.",
    ZH: '取車時須出示主駕駛人本人名下的實體信用卡辦理押金預授權（約 {amount}）。完好還車後即時解除凍結。',
  },

  // Store guide section
  storeguide_title: {
    EN: 'Depot Pick-up & Return Guide',
    ZH: '門店取還車指引與地圖',
  },
  storeguide_subtitle: {
    EN: 'Depot address, opening hours, and how to reach us via airport shuttle.',
    ZH: '清楚掌握門店地址、營業時間與機場接駁專車抵達方式。',
  },
  storeguide_view_full: {
    EN: 'View Full Guide & Map',
    ZH: '查看完整指引與地圖',
  },
  storeguide_pickup_depot: { EN: 'Pick-up Depot', ZH: '取車門店' },
  storeguide_shuttle_label: { EN: 'Shuttle Service', ZH: '接駁方式' },
  storeguide_shuttle_title: {
    EN: 'Free Airport Terminal Shuttle',
    ZH: '免費專車機場接駁',
  },
  storeguide_shuttle_desc: {
    EN: 'After arrival, head to the designated shuttle point on Level 1 — our staff will take you to the depot.',
    ZH: '抵達航站樓後前往 1 樓指定接駁站點，工作人員將安排專車快速送達車行。',
  },
  storeguide_hours_prefix: { EN: 'Operating Hours: ', ZH: '營業時間：' },
  storeguide_phone_prefix: { EN: 'Contact: ', ZH: '聯繫電話：' },
  storeguide_map_nav: { EN: 'Map & Directions', ZH: '地圖導航' },

  // Store map modal
  storemap_title: {
    EN: 'Branch Location & Access Guide',
    ZH: '門店位置與交通指引',
  },
  storemap_tab_pickup: { EN: 'Pick-up Branch', ZH: '取車門店' },
  storemap_tab_return: { EN: 'Drop-off Branch', ZH: '還車門店' },
  storemap_branch_name: { EN: 'Branch Name', ZH: '門店名稱' },
  storemap_branch_address: { EN: 'Branch Address', ZH: '門店地址' },
  storemap_branch_phone: { EN: 'Contact Number', ZH: '聯繫電話' },
  storemap_branch_hours: { EN: 'Business Hours', ZH: '營業時間' },
  storemap_localtime_note: {
    EN: '(All times are in local time)',
    ZH: '（所有時間均為當地時間）',
  },
  storemap_copy_addr: { EN: 'Copy', ZH: '複製地址' },
  storemap_copied: { EN: 'Copied', ZH: '已複製' },
  storemap_call: { EN: 'Call', ZH: '撥打' },
  storemap_instructions_pickup: { EN: 'Pick-up Instructions', ZH: '取車指引' },
  storemap_instructions_return: { EN: 'Drop-off Instructions', ZH: '還車指引' },
  storemap_nav_gmaps: {
    EN: 'Navigate in Google Maps',
    ZH: '在 Google Maps 中導航',
  },
  storemap_addr_label: { EN: 'Full Address', ZH: '門店詳細地址' },
  storemap_hours_label: {
    EN: 'Opening Hours (local time)',
    ZH: '營業時間（當地時區）',
  },
  storemap_shuttle_eta: {
    EN: 'Approx. 5 min shuttle ride from terminal',
    ZH: '距航站樓約 5 分鐘接駁車程',
  },
  storemap_pickup_flow: {
    EN: 'Pick-up & Shuttle Instructions',
    ZH: '取車流程與接駁指引',
  },
  storemap_return_flow: {
    EN: 'Return Inspection & Airport Drop-off',
    ZH: '還車驗收與返程送機',
  },
  storemap_p1_title: {
    EN: '1. Terminal Arrival & Baggage:',
    ZH: '1. 航站樓抵達與行李提取：',
  },
  storemap_p1_body: {
    EN: 'After your flight lands, contact our staff while collecting baggage so we can dispatch the shuttle.',
    ZH: '國內或國際航班抵達後，請在提取行李時提前與工作人員取得聯繫，以便調配接駁專車。',
  },
  storemap_p2_title: {
    EN: '2. Shuttle Pick-up Point:',
    ZH: '2. 接駁專車乘車點：',
  },
  storemap_p2_body: {
    EN: 'Take the terminal elevator to Level 1 and go to the shuttle zone at Exit 1 — our staff will greet you with a sign.',
    ZH: '請搭乘航站樓電梯至 1 樓，自【1 號出口】前往接駁乘車區，工作人員將舉牌接送至車行門店。',
  },
  storemap_p3_title: {
    EN: '3. Counter Check & Handover:',
    ZH: '3. 櫃檯驗收與提車：',
  },
  storemap_p3_body: {
    EN: 'Show your confirmation code, driver documents and credit card, sign the e-rental agreement, then inspect the car.',
    ZH: '在門店出示預訂確認號、主駕駛人有效證件及信用卡，簽署電子租賃合同後現場驗車交付。',
  },
  storemap_r1_title: { EN: '1. Return with Full Tank:', ZH: '1. 滿油還車：' },
  storemap_r1_body: {
    EN: 'Arrive before the agreed return time, fill up the tank, and keep the last fuel receipt.',
    ZH: '請於約定還車時間前抵達門店，加滿燃油並保留最後一次加油小票。',
  },
  storemap_r2_title: {
    EN: '2. Inspection & Deposit Release:',
    ZH: '2. 現場驗車與解凍押金：',
  },
  storemap_r2_body: {
    EN: 'Staff will verify bodywork, mileage and fuel on the spot; once confirmed, the deposit hold is released immediately.',
    ZH: '工作人員將現場核驗車身外觀、里程與燃油。確認無誤後，即時解除押金預授權。',
  },
  storemap_r3_title: {
    EN: '3. Free Airport Drop-off:',
    ZH: '3. 免費送機專車：',
  },
  storemap_r3_body: {
    EN: 'After returning the car, our shuttle takes you back to your departure terminal free of charge.',
    ZH: '辦結還車手續後，門店將安排專車免費送達出發航站樓相應值機島。',
  },
  storemap_close: { EN: 'Close Depot Info', ZH: '關閉門店資訊' },

  // Rate summary sidebar
  rate_summary_badge: { EN: 'Transparent Pricing', ZH: '透明定價' },
  rate_summary_title: { EN: 'Rental Summary', ZH: '租車費用總覽' },
  rate_pickup_return: { EN: 'Pick-up & Return', ZH: '取車與還車' },
  rate_dates_time: { EN: 'Dates & Time', ZH: '日期與時間' },
  rate_car_rental: {
    EN: 'Car Rental ({days} days x {rate})',
    ZH: '車輛租金（{days} 天 x {rate}）',
  },
  rate_protection: { EN: 'Protection: {name}', ZH: '保障方案：{name}' },
  rate_included: { EN: 'Included', ZH: '已包含' },
  rate_equipment_addons: {
    EN: 'Special Equipment & Add-ons',
    ZH: '附加設備與服務',
  },
  rate_taxes_fees: {
    EN: 'Estimated Taxes & Concession Fees',
    ZH: '預估稅費與特許經營費',
  },
  rate_free_cancel_hours: {
    EN: 'Free Cancellation (up to {hours}h)',
    ZH: '免費取消（取車前 {hours} 小時）',
  },
  rate_total_due: { EN: 'Total Charge', ZH: '總計' },
  rate_taxes_note: {
    EN: 'All local mandatory taxes included. No hidden charges.',
    ZH: '已含當地法定稅費，絕無隱藏收費。',
  },
  rate_deposit_title: {
    EN: 'Counter Pre-Authorization:',
    ZH: '到店押金預授權：',
  },
  rate_deposit_note: {
    EN: "Refundable deposit of {amount} held on the main driver's credit card at pick-up.",
    ZH: '取車時於主駕駛人信用卡凍結可退押金 {amount}。',
  },
  rate_cta_continue: { EN: 'Continue to Driver Details', ZH: '填寫駕駛人信息' },
  rate_cta_assurance: {
    EN: 'Guaranteed Rate & Instant Hold',
    ZH: '鎖定費率 · 即時保留車輛',
  },

  // Booking management
  bm_reason_plans: { EN: 'Change of travel itinerary / plans', ZH: '行程計劃變更' },
  bm_reason_price: { EN: 'Found a lower price or better alternative', ZH: '找到更低價格或更優方案' },
  bm_reason_transport: { EN: 'Flight / train delayed or cancelled', ZH: '航班 / 火車延誤或取消' },
  bm_reason_mistake: { EN: 'Booking made by mistake / duplicate reservation', ZH: '誤訂 / 重複預訂' },
  bm_reason_emergency: { EN: 'Personal or medical emergency', ZH: '個人或醫療緊急情況' },
  bm_reason_other: { EN: 'Other reason', ZH: '其他原因' },
  bm_cancel_title: { EN: 'Cancel Your Reservation', ZH: '取消您的預訂' },
  bm_paid_amount: { EN: 'Total Paid Amount', ZH: '已支付總額' },
  bm_penalty_fee: { EN: 'Cancellation Penalty Fee', ZH: '取消違約金' },
  bm_refund_amount: { EN: 'Estimated Refund Amount', ZH: '預計退款金額' },
  bm_processing: { EN: 'Processing...', ZH: '處理中...' },
  bm_confirm_cancel: { EN: 'Confirm Cancellation', ZH: '確認取消' },
  bm_checkin_start: { EN: 'Start online identity verification', ZH: '開始線上身份核驗' },
  bm_checkin_submitted: { EN: 'Documents Submitted', ZH: '文件已提交' },
  bm_status_cancelled: { EN: 'CANCELLED', ZH: '已取消' },
  bm_status_confirmed: { EN: 'CONFIRMED', ZH: '已確認' },
  bm_status_completed: { EN: 'COMPLETED', ZH: '已完成' },
  bm_voucher_cancelled: { EN: 'Reservation Cancelled', ZH: '預訂已取消' },
  bm_voucher_guaranteed: { EN: 'Confirmed & Guaranteed', ZH: '已確認並保證' },
  bm_copy_code: { EN: 'Copy confirmation code', ZH: '複製確認號' },
  bm_print_voucher: { EN: 'Print Voucher', ZH: '打印憑證' },
  bm_cancel_reservation: { EN: 'Cancel Reservation', ZH: '取消預訂' },
  bm_main_driver: { EN: 'Main Driver', ZH: '主駕駛人' },
  bm_total_prepaid: { EN: 'Total Prepaid', ZH: '預付總額' },
  bm_guide_title: { EN: 'Pick-up & Handover Guide', ZH: '取車交接指引' },
  bm_pickup_depot: { EN: 'Pick-up Depot', ZH: '取車門店' },
  bm_return_depot: { EN: 'Return Depot', ZH: '還車門店' },
  bm_shuttle_title: { EN: 'Arrival & Shuttle Instructions', ZH: '抵達與接駁說明' },
  bm_shuttle_name: { EN: 'TrustGo Express Shuttle', ZH: 'TrustGo 快速接駁車' },

  // Guest order list & lookup
  bm_tab_all: { EN: 'All Trips', ZH: '全部行程' },
  bm_tab_active: { EN: 'Upcoming & Active', ZH: '即將出行 / 進行中' },
  bm_tab_pending: { EN: 'Awaiting Payment', ZH: '待支付' },
  bm_tab_past: { EN: 'Past & Cancelled', ZH: '已完結 / 已取消' },
  bm_book_another: { EN: 'Book Another Car', ZH: '再租一輛車' },
  bm_empty_category: { EN: 'No Trips in this Category', ZH: '此分類暫無行程' },
  bm_empty_active: { EN: 'No Active Bookings Found', ZH: '暫無進行中的預訂' },
  bm_empty_hint_tab: { EN: 'Try selecting another tab to view your other scheduled car rental journeys.', ZH: '可切換其他分頁查看您的其他租車行程。' },
  bm_empty_hint_book: { EN: 'Explore our modern fleet and start your seamless road trip across scenic routes.', ZH: '瀏覽我們的現代化車隊，開啟無憂自駕之旅。' },
  bm_explore_fleet: { EN: 'Explore Fleet & Book', ZH: '瀏覽車隊並預訂' },
  bm_state_confirmed: { EN: 'Confirmed', ZH: '已確認' },
  bm_state_active: { EN: 'In Rental', ZH: '進行中' },
  bm_state_pending: { EN: 'Awaiting Payment', ZH: '待支付' },
  bm_state_completed: { EN: 'Completed', ZH: '已完成' },
  bm_state_cancelled: { EN: 'Cancelled', ZH: '已取消' },
  bm_confirm_code_label: { EN: 'Confirmation Code:', ZH: '預訂確認號：' },
  bm_copy_code_hint: { EN: 'Click to copy confirmation code', ZH: '點擊複製確認號' },
  bm_amount_due: { EN: 'Amount Due', ZH: '待付金額' },
  bm_total_paid: { EN: 'Total Paid', ZH: '已付金額' },
  bm_extend_rental: { EN: 'Extend Rental', ZH: '延長租期' },
  bm_complete_payment: { EN: 'Complete Payment', ZH: '完成支付' },
  bm_view_details: { EN: 'View Details', ZH: '查看詳情' },
  bm_lookup_add: { EN: "Don't see a booking? Look up & add another confirmation code", ZH: '沒看到預訂？查詢並添加其他確認號' },
  bm_one_way: { EN: 'One-way rental', ZH: '異地還車' },
  bm_help_title: { EN: 'Common questions about your booking', ZH: '訂單常見問題' },
  bm_help_manage: { EN: 'How do I manage or cancel a booking?', ZH: '如何管理或取消預訂？' },
  bm_help_pickup: { EN: 'Pick-up & return guide', ZH: '取車與還車指引' },
  bm_help_deposit: { EN: 'Payment & deposit explained', ZH: '付款與押金說明' },
  bm_help_all: { EN: 'Browse Help Center', ZH: '瀏覽幫助中心' },

  bm_placeholder_code: { EN: 'e.g. TG-2026-88991', ZH: '例如 TG-2026-88991' },
  bm_placeholder_name: { EN: 'e.g. Smith / Wang', ZH: '例如 Smith / Wang' },
  bm_searching: { EN: 'Searching Itinerary...', ZH: '正在查詢行程...' },
  bm_find_add: { EN: 'Find & Add Reservation', ZH: '查詢並添加預訂' },
  bm_not_found: { EN: 'Reservation Not Found', ZH: '未找到預訂' },
  bm_not_found_detail: { EN: 'No matching booking was found for confirmation code {code} and surname {name}.', ZH: '找不到確認號 {code} 與姓氏 {name} 匹配的預訂。' },
  bm_lookup_title: { EN: 'Find Your Reservation', ZH: '查詢您的預訂' },
  bm_lookup_subtitle: { EN: "Enter your booking confirmation code and primary driver's surname to view details, complete online check-in, or manage your trip.", ZH: '輸入預訂確認號與主駕駛姓氏，即可查看詳情、完成線上身份核驗或管理行程。' },
  bm_lookup_code_label: { EN: 'Booking Confirmation Code', ZH: '預訂確認號' },
  bm_lookup_name_label: { EN: 'Driver Last Name (Surname)', ZH: '駕駛人姓氏' },
  bm_lookup_cancel: { EN: 'Cancel', ZH: '取消' },
  bm_verified_note: { EN: 'Verified lookup · your booking access stays private to this device', ZH: '安全驗證查詢 · 您的預訂訪問權限僅保存在本設備上' },

  // Checkout & payment
  ck_accept_terms: { EN: 'Please accept the Terms of Service and Rental Agreement to proceed.', ZH: '請同意服務條款與租賃協議後繼續。' },
  ck_invalid_expiry: { EN: 'Please enter a valid MM/YY expiration date.', ZH: '請輸入有效的 MM/YY 有效期。' },
  ck_secure_payment: { EN: 'Secure Payment Method', ZH: '安全支付方式' },
  ck_card_name: { EN: 'Name on card', ZH: '持卡人姓名' },
  ck_card_placeholder: { EN: '1234 5678 9012 3456', ZH: '1234 5678 9012 3456' },
  ck_expiry: { EN: 'MM/YY', ZH: 'MM/YY' },
  ck_zip_placeholder: { EN: 'e.g. 90210', ZH: '例如 90210' },
  ck_terms: { EN: 'Terms of Service', ZH: '服務條款' },
  ck_rental_policy: { EN: 'Rental Policy', ZH: '租賃政策' },
  ck_privacy: { EN: 'Privacy Policy', ZH: '隱私政策' },
  ck_authorizing: { EN: 'Authorizing with Bank...', ZH: '正在向銀行授權...' },
  ck_instant_voucher: { EN: 'Instant Voucher Confirmation', ZH: '即時出票確認' },
  ck_total_due: { EN: 'Total Due Now', ZH: '現需支付' },
  ck_processing: { EN: 'Processing...', ZH: '處理中...' },
  ck_trip_details: { EN: 'Trip & Vehicle Details', ZH: '行程與車輛信息' },
  ck_main_driver: { EN: 'Main Driver', ZH: '主駕駛人' },
  ck_protection: { EN: 'Protection Package', ZH: '保障方案' },
  ck_mileage: { EN: 'Mileage', ZH: '里程' },
  ck_unlimited: { EN: 'Unlimited', ZH: '不限里程' },
  ck_cancellation: { EN: 'Cancellation', ZH: '取消政策' },
  ck_free_48h: { EN: 'Free up to 48h', ZH: '48 小時前免費取消' },
  ck_deposit_label: { EN: 'Pre-Authorization Deposit:', ZH: '預授權押金：' },
  ck_hold_warning: { EN: 'Hurry! Your guaranteed rate and vehicle hold expire soon', ZH: '抓緊！您的鎖定費率與車輛保留即將到期' },
  ck_hold_cta: { EN: 'Lock in Guaranteed Rate & Vehicle Hold', ZH: '鎖定費率並保留車輛' },
  ck_hold_expires: { EN: 'Hold expires in', ZH: '保留到期倒計時' },

  // Driver form & stepper
  df_main_driver: { EN: 'Main Driver Information', ZH: '主駕駛人信息' },
  df_guest_access: { EN: 'Guest Booking Access:', ZH: '訪客訂單查詢：' },
  df_last_name: { EN: 'Last Name (Surname)', ZH: '姓氏（Last Name）' },
  df_confirm_code: { EN: 'Booking Confirmation Code', ZH: '預訂確認號' },
  df_title: { EN: 'Title', ZH: '稱謂' },
  df_first_name_ph: { EN: 'e.g. David', ZH: '例如 David' },
  df_last_name_ph: { EN: 'e.g. Smith', ZH: '例如 Smith' },
  df_email_ph: { EN: 'david.smith@example.com', ZH: 'david.smith@example.com' },
  df_phone_ph: { EN: '555-0199', ZH: '555-0199' },
  df_flight_ph: { EN: 'e.g. UA 889 / JL 002', ZH: '例如 UA 889 / JL 002' },
  df_full_name_hint: { EN: 'Full name matching their passport and driving license', ZH: '與護照和駕照一致的完整姓名' },
  step_counter: { EN: 'Step {current} of {total}', ZH: '第 {current} 步，共 {total} 步' },
  step_progress: { EN: 'Booking Progress', ZH: '預訂進度' },

  // Rate details extras
  vs_or_similar: { EN: 'Or similar?', ZH: '或同級車型？' },
  vs_passengers: { EN: 'Adult passengers', ZH: '成人乘客數' },
  vs_luggage: { EN: 'Luggage capacity', ZH: '行李容量' },
  vs_transmission: { EN: 'Transmission', ZH: '變速箱' },
  vs_fuel: { EN: 'Fuel type', ZH: '燃油類型' },
  vs_sanitized: { EN: 'Sanitized & inspected before handover', ZH: '交付前已消毒檢查' },
  vs_pickup: { EN: 'Pick-up:', ZH: '取車：' },
  vs_duration: { EN: 'Rental Duration:', ZH: '租期：' },
  ic_title: { EN: 'Choose Your Protection Plan', ZH: '選擇您的保障方案' },
  ic_excess_what: { EN: 'What is Damage Excess?', ZH: '什麼是碰撞免賠額？' },
  ic_select: { EN: 'Select Plan', ZH: '選擇方案' },
  eq_title: { EN: 'Optional Equipment & Add-ons', ZH: '附加設備與服務' },
  eq_add: { EN: 'Add to Rental', ZH: '加入訂單' },
  ct_title: { EN: 'Transparent Cancellation Policy', ZH: '透明取消政策' },
  ct_risk_free: { EN: 'Risk-Free Booking', ZH: '無風險預訂' },
  ct_no_refund: { EN: 'Non-refundable if cancelled within 2 hours', ZH: '取車前 2 小時內取消不予退款' },
  ex_simple_words: { EN: 'In Simple Words:', ZH: '簡單來說：' },
  ex_deductible: { EN: 'Excess (Deductible)', ZH: '免賠額（Excess / Deductible）' },
  ex_basic: { EN: 'Basic Cover ($1,500 Excess):', ZH: '基本保障（$1,500 免賠額）：' },
  ex_zero: { EN: 'Zero Excess Cover ($0 Excess):', ZH: '零免賠保障（$0 免賠額）：' },
  ex_deposit_vs: { EN: 'Security Deposit vs. Excess:', ZH: '押金 vs. 免賠額：' },
  cookie_consent_title: {
    EN: 'Help us improve your experience',
    ZH: '幫助我們提升您的體驗',
  },
  cookie_consent_desc: {
    EN: 'We use cookies and similar technologies to personalise content, measure analytics, and provide an optimised rental booking experience. Some cookies are required for core site functions. By accepting, you agree to our Cookie Policy. You can adjust your preferences at any time.',
    ZH: '我們使用 Cookie 與類似技術來個性化內容、衡量分析數據並優化租車預訂體驗。部分 Cookie 是核心網站功能所必需的。接受即表示您同意我們的 Cookie 政策。您可以隨時調整偏好設定。',
  },
  cookie_consent_accept_all: {
    EN: 'Accept all',
    ZH: '全部接受',
  },
  cookie_consent_only_necessary: {
    EN: 'Only necessary',
    ZH: '僅必要',
  },
  cookie_consent_manage: {
    EN: 'Manage preferences',
    ZH: '偏好設定',
  },
  cookie_consent_save: {
    EN: 'Save preferences',
    ZH: '保存偏好',
  },
  cookie_consent_cat_necessary_title: {
    EN: 'Strictly Necessary Cookies',
    ZH: '核心必要 Cookie',
  },
  cookie_consent_cat_necessary_desc: {
    EN: 'Essential for browsing, security, currency, and language preferences. Cannot be disabled.',
    ZH: '維持網站基本運作、安全校驗、幣種與語言路由所必需，無法停用。',
  },
  cookie_consent_cat_analytics_title: {
    EN: 'Analytics & Performance (GA4)',
    ZH: '分析與效能 (GA4)',
  },
  cookie_consent_cat_analytics_desc: {
    EN: 'Helps us measure site traffic, user interaction flows, and booking performance via Google Analytics.',
    ZH: '透過 Google Analytics 統計網站流量、用戶互動流向與預訂漏斗效能。',
  },
  cookie_consent_cat_marketing_title: {
    EN: 'Marketing & Personalisation',
    ZH: '行銷與個性化',
  },
  cookie_consent_cat_marketing_desc: {
    EN: 'Allows us to remember specific preferences and present tailored car rental offers.',
    ZH: '記錄個人偏好並提供定制化的車型與目的地優惠。',
  },
  cookie_consent_always_active: {
    EN: 'Always Active',
    ZH: '始終啟用',
  },
  cookie_consent_manage_title: {
    EN: 'Cookie Preferences',
    ZH: 'Cookie 偏好管理',
  },
  footer_social_facebook: {
    EN: 'Follow TrustGo on Facebook',
    ZH: '在 Facebook 上關注 TrustGo',
  },
  footer_social_x: {
    EN: 'Follow TrustGo on X',
    ZH: '在 X 上關注 TrustGo',
  },
  footer_social_instagram: {
    EN: 'Follow TrustGo on Instagram',
    ZH: '在 Instagram 上關注 TrustGo',
  },
  footer_cookie_settings: {
    EN: 'Cookie Settings',
    ZH: 'Cookie 設定',
  },

  // Booking views
  bv_booking_summary: { EN: 'Booking Summary', ZH: '預訂摘要' },
  bv_selected_equipment: { EN: 'Selected Equipment', ZH: '已選設備' },
  bv_taxes_fees: { EN: 'Taxes & Concession Fees', ZH: '稅費與特許經營費' },
  bv_reserving: { EN: 'Reserving Vehicle...', ZH: '正在保留車輛...' },
  bv_reserving_short: { EN: 'Reserving...', ZH: '保留中...' },
  bv_proceed: { EN: 'Proceed to Checkout', ZH: '前往結算' },
  bv_ssl_note: { EN: 'Next: Secure 256-bit SSL Payment', ZH: '下一步：256 位 SSL 安全支付' },
  bv_vehicle_specs: { EN: 'Vehicle Specifications', ZH: '車輛規格' },
  bv_payment_breakdown: { EN: 'Payment Breakdown', ZH: '費用明細' },
  bv_addon_equipment: { EN: 'Add-on Equipment', ZH: '附加設備' },
  bv_total_paid: { EN: 'Total Amount Paid', ZH: '已付總額' },
  bv_txn_ref: { EN: 'Transaction Ref:', ZH: '交易流水號：' },
  bv_counter_preauth: { EN: 'Counter Pre-Auth:', ZH: '到店預授權：' },
  // Extended Booking Details Keys
  bm_trip_summary: { EN: "Rental Itinerary Timeline", ZH: "租車行程時間線" },
  bm_days: { EN: "days", ZH: "天" },
  bm_pickup: { EN: "Pick-up", ZH: "取車" },
  bm_return: { EN: "Return", ZH: "還車" },
  bm_guide_pickup_tab: { EN: "Pick-up Guide", ZH: "取車指引" },
  bm_guide_return_tab: { EN: "Return Guide", ZH: "還車指引" },
  bm_copy_address: { EN: "Copy Address", ZH: "複製地址" },
  bm_copied_address: { EN: "Copied", ZH: "已複製" },
  bm_view_google_maps: { EN: "View on Google Maps", ZH: "在 Google 地圖查看" },
  bm_business_hours: { EN: "Business Hours", ZH: "營業時間" },
  bm_business_hours_val: { EN: "07:00 – 23:00 Daily (Free Express Shuttle)", ZH: "周一至周日 07:00 ~ 23:00（免費接駁）" },
  bm_driver_info_title: { EN: "Booked Driver Information", ZH: "預訂駕駛人信息" },
  bm_driver_name: { EN: "Primary Driver Name", ZH: "主駕駛人姓名" },
  bm_driver_phone: { EN: "Contact Phone", ZH: "聯繫電話" },
  bm_driver_email: { EN: "Email Address", ZH: "電子郵箱" },
  bm_flight_number: { EN: "Arrival Flight", ZH: "抵達航班號" },
  bm_special_notes: { EN: "Special Notes", ZH: "特殊用車備註" },
  bm_no_special_notes: { EN: "None specified (Standard handover)", ZH: "無特殊要求（標準交接）" },
  bm_policy_title: { EN: "Rental Terms & Protection Policies", ZH: "租賃須知與保障條款" },
  bm_policy_cancel: { EN: "Cancellation Policy & Free Cancellation Deadline", ZH: "退改政策與取消規則" },
  bm_policy_cancel_free: { EN: "Free Cancellation Deadline: ", ZH: "免費取消截止時間：" },
  bm_policy_cancel_free_desc: { EN: "Full refund guaranteed if cancelled 48 hours prior to pickup time.", ZH: "取車前 48 小時前可無條件全額退款。" },
  bm_policy_cancel_late: { EN: "Late Cancellation & No-Show: ", ZH: "超時取消與 No-Show：" },
  bm_policy_cancel_late_desc: { EN: "Cancellations within 48 hours or counter no-show are subject to supplier penalty fees.", ZH: "取車前 48 小時內取消或未到店取車者，將依條款扣除相應違約手續費。" },
  bm_policy_insurance: { EN: "Insurance Coverage & Security Deposit", ZH: "保險保障與押金說明" },
  bm_policy_insurance_basic: { EN: "Coverage Package: ", ZH: "保險方案：" },
  bm_policy_insurance_basic_desc: { EN: "Third Party Liability (TPL) and Collision Damage Waiver (CDW) included per selected package.", ZH: "已包含第三者責任險 (TPL) 及車輛損失險 (CDW)。自負額請以所選保障套餐為準。" },
  bm_policy_insurance_deposit: { EN: "Pre-Authorization Deposit: ", ZH: "押金預授權：" },
  bm_policy_insurance_deposit_desc: { EN: "A credit card pre-authorization hold is required at pickup counter and released after safe vehicle return.", ZH: "取車時須使用主駕駛人信用卡預授權凍結押金，還車無違章及車損後原路解凍。" },
  bm_policy_docs: { EN: "Driver License & Required Original Documents", ZH: "駕駛人證件要求與取車必備" },
  bm_policy_docs_intro: { EN: "Please present the following original physical documents at the rental desk:", ZH: "取車現場請務必攜帶並出示以下正本證件：" },
  bm_policy_docs_passport: { EN: "Original Passport: Valid original passport of the primary driver.", ZH: "護照正本：主駕駛人有效護照正本（有效期需在用車期間以上）。" },
  bm_policy_docs_license: { EN: "Home Country License: Valid driving license held for at least 1 year.", ZH: "原國籍駕照：原國籍有效駕照正本（持照時間需滿 1 年以上）。" },
  bm_policy_docs_idp: { EN: "IDP / Translation: Valid 1949 Geneva format IDP or certified translation.", ZH: "國際駕照或翻譯件：1949 年日內瓦公約格式國際駕照 (IDP) 正本或法定認可翻譯件。" },
  bm_policy_docs_card: { EN: "Physical Credit Card: Chip card under driver name for security pre-auth.", ZH: "實體信用卡：主駕駛人名下晶片實體信用卡（用於現場押金預授權）。" },
  bm_faq_title: { EN: "Frequently Asked Questions (FAQ)", ZH: "常見問題 FAQ" },
  bm_faq_q1: { EN: "What documents do I need to bring for vehicle pickup?", ZH: "取車時需要帶哪些證件？" },
  bm_faq_a1: { EN: "Bring your original passport, original home country driver license, 1949 Geneva convention IDP (or certified translation), and a physical credit card under the primary driver’s name.", ZH: "請攜帶主駕駛人護照正本、原國籍有效駕照正本、1949 日內瓦公約國際駕照 (IDP) 或法定翻譯件，以及主駕駛人實體信用卡。" },
  bm_faq_q2: { EN: "When will the security deposit hold be refunded?", ZH: "押金何時退還到我的賬戶？" },
  bm_faq_a2: { EN: "The counter deposit is an authorization hold. After returning the vehicle with no traffic violations or damage, the pre-auth hold is released typically within 7–14 business days depending on your issuing bank.", ZH: "押金為到店預授權凍結。還車確認無車損及違章後，車行將即刻申請解凍，通常於 7~14 個工作天內由發卡行解除額度佔用。" },
  bm_faq_q3: { EN: "What if my arrival flight is delayed or rescheduled?", ZH: "我的航班延誤或取消該怎麼辦？" },
  bm_faq_a3: { EN: "If you provided your flight number during booking, depot staff track arrival delays. For major schedule shifts (>2 hours), please contact the branch phone directly to hold your vehicle.", ZH: "若您在預訂時填寫了抵達航班號，門店會主動跟蹤進港狀態。若延誤超過 2 小時，建議直接撥打門店電話以便為您保留車輛。" },
  bm_contact_branch: { EN: "Contact Branch Depot", ZH: "聯繫門店" },
  bm_contact_service: { EN: "Customer Care & Live Support", ZH: "客服與在線支持" },
  bm_live_chat: { EN: "Live Chat (24/7 Available)", ZH: "在線客服（隨時在線）" },
  bm_daily_rate_calc: { EN: "Base Vehicle Rental", ZH: "車輛租金" },
  bm_protection_package: { EN: "Protection Package", ZH: "保險保障" },
  bm_included: { EN: "Included", ZH: "已包含" },
  bm_security_ssl: { EN: "256-bit SSL Encrypted & Certified Secure", ZH: "256 位元 SSL 安全加密保障" },

  df_guest_your: { EN: 'Your', ZH: '您的' },
  df_guest_and: { EN: 'and', ZH: '和' },
  df_guest_tail: { EN: 'will be used as your credentials to check status, download receipts, or cancel your booking.', ZH: '將用於查詢訂單狀態、下載收據或取消預訂。' },

  // Home Promises Badges
  promises_easy_badge: { EN: 'Easy Booking', ZH: '極簡預訂' },
  promises_confidence_badge: { EN: 'Travel with Confidence', ZH: '安心保障' },
  promises_freedom_badge: { EN: 'Freedom to Explore', ZH: '自由探索' },

  // Rental Search & Fleet
  search_live_availability: { EN: 'FleetEdge Live Availability · {count} Vehicles Available', ZH: 'FleetEdge 即時庫存 · 共 {count} 款車型可租' },
  fleet_badge_family: { EN: 'Family Pick', ZH: '家庭首選' },
  common_included: { EN: 'Included', ZH: '已包含' },

  // Insurance Comparison
  ic_subtitle: { EN: 'Drive with complete confidence. Choose between standard excess or zero excess peace of mind.', ZH: '全程安心出發。可在標準免賠或零免賠安心保障之間自由選擇。' },
  ic_badge_popular: { EN: 'Popular', ZH: '熱門首選' },
  ic_badge_recommended: { EN: 'Recommended', ZH: '推薦首選' },
  ic_pkg_basic_name: { EN: 'Basic Cover', ZH: '基礎保障' },
  ic_pkg_basic_tagline: { EN: 'Standard mandatory protection with vehicle excess', ZH: '包含法定必備保障，適用車輛基礎免賠額' },
  ic_pkg_inclusive_name: { EN: 'Inclusive Protection', ZH: '全方位保障' },
  ic_pkg_inclusive_tagline: { EN: 'Significantly reduced excess with glass & tyre cover', ZH: '大幅降低免賠額，包含玻璃與輪胎保障' },
  ic_pkg_zero_name: { EN: 'Zero Excess Peace of Mind', ZH: '零免賠安心保' },
  ic_pkg_zero_tagline: { EN: 'Complete protection with $0 deductible and free roadside assistance', ZH: '全額保障，車損 $0 起賠，免費尊享道路救援' },
  ic_damage_excess_label: { EN: 'Damage Excess:', ZH: '車損免賠額：' },
  ic_zero_deductible: { EN: '$0 Deductible', ZH: '$0 免賠（零自負額）' },
  ic_selected: { EN: 'Selected', ZH: '已選擇' },
  ic_feat_cdw: { EN: 'Collision Damage Waiver (CDW)', ZH: '車輛碰撞險 (CDW)' },
  ic_feat_tpl: { EN: 'Third-Party Liability (TPL)', ZH: '第三者責任險 (TPL)' },
  ic_feat_tp: { EN: 'Theft Protection (TP)', ZH: '車輛盜搶險 (TP)' },
  ic_feat_glass: { EN: 'Windscreen, Glass & Mirrors', ZH: '擋風玻璃、車窗與後視鏡' },
  ic_feat_tyre: { EN: 'Tyre & Wheel Damage', ZH: '輪胎與輪轂損壞' },
  ic_feat_roadside: { EN: '24/7 Breakdown & Towing Service', ZH: '24/7 全天候道路救援與拖車' },

  // Special Equipment Add-ons
  eq_subtitle: { EN: 'Reserve infant & child safety seats, offline GPS navigation, or mountain snow chains with your vehicle.', ZH: '隨車預訂嬰兒與兒童安全座椅、離線 GPS 導航或高山防滑雪鏈。' },
  eq_capped_days: { EN: 'Capped at {days} days max', ZH: '最多計費 {days} 天封頂' },
  eq_infant_name: { EN: 'Infant Safety Seat (0–13 kg / 0–1 yr)', ZH: '嬰兒安全座椅 (0–13 kg / 0–1 歲)' },
  eq_infant_desc: { EN: 'Rear-facing safety seat engineered for newborns and infants up to 12 months.', ZH: '後向式安全座椅，專為新生兒至 12 個月嬰幼兒設計。' },
  eq_child_name: { EN: 'Toddler / Child Seat (9–18 kg / 1–4 yr)', ZH: '幼童安全座椅 (9–18 kg / 1–4 歲)' },
  eq_child_desc: { EN: 'Forward-facing safety seat with 5-point harness for young children.', ZH: '正向式五點式安全帶座椅，適合幼童乘坐。' },
  eq_booster_name: { EN: 'Booster Cushion (15–36 kg / 4–8 yr)', ZH: '兒童增高坐墊 (15–36 kg / 4–8 歲)' },
  eq_booster_desc: { EN: 'High-back booster providing correct seatbelt positioning for older kids.', ZH: '高背增高坐墊，確保安全帶處於合適保護位置。' },
  eq_gps_name: { EN: 'Garmin GPS Navigation Device', ZH: 'Garmin GPS 離線導航儀' },
  eq_gps_desc: { EN: 'Dedicated offline touchscreen GPS with turn-by-turn guidance, preloaded regional maps.', ZH: '獨立觸控離線 GPS，提供逐向語音導航，已預裝目的地最新離線地圖。' },
  eq_snow_name: { EN: 'Snow & Ice Tire Chains', ZH: '高山防滑雪鏈' },
  eq_snow_desc: { EN: 'Pair of custom-fit tire chains mandatory for mountain passes and alpine ski resorts in winter.', ZH: '專車匹配的防滑鏈，冬季前往高山公路及滑雪場必備。' },

  // Cancellation Timeline
  ct_subtitle: { EN: 'Plans change? No problem. Free cancellation is available up to 48 hours prior to pickup.', ZH: '行程有變？無須擔心。取車前 48 小時以上可免費取消。' },
  ct_step_free_title: { EN: 'Free Cancellation', ZH: '免費取消' },
  ct_step_free_time: { EN: 'Up to 48 hours prior to pickup', ZH: '取車前 48 小時以上' },
  ct_step_free_desc: { EN: '100% Full Refund Guaranteed', ZH: '100% 全額無損退款保障' },
  ct_step_late_title: { EN: 'Late Cancellation Fee (50%)', ZH: '臨近取消費用 (50%)' },
  ct_step_late_time: { EN: 'Between 48h and 2h before pickup', ZH: '取車前 48 小時至 2 小時' },
  ct_step_late_desc: { EN: '50% cancellation fee deducted', ZH: '扣除 50% 取消費用後退還餘款' },
  ct_step_noshow_title: { EN: 'Last-Minute Cancellation / No-Show', ZH: '極臨近取消 / 未取車 (No-Show)' },
  ct_step_noshow_time: { EN: 'Less than 2 hours before pickup', ZH: '取車前 2 小時以內或未取車' },

  // Progress Stepper & Driver Form
  step_rate: { EN: '1. Rate & Equipment', ZH: '1. 費率與附加服務' },
  step_driver: { EN: '2. Driver Information', ZH: '2. 主駕駛人信息' },
  step_checkout: { EN: '3. Payment & Checkout', ZH: '3. 支付與結算' },
  df_subtitle: { EN: "Must match the original passport and physical driver's license presented at the counter.", ZH: '必須與門店取車時出示的護照及實體駕照原件一致。' },
  df_first_name_label: { EN: 'First / Given Name', ZH: '名字 / 名 (First / Given Name)' },
  df_last_name_label: { EN: 'Last Name / Surname', ZH: '姓氏 (Last Name / Surname)' },
  df_email_label: { EN: 'Email Address (For Voucher Delivery)', ZH: '電子郵件地址（用於接收租車憑證）' },
  df_phone_label: { EN: 'Mobile Contact Phone', ZH: '行動電話' },
  df_license_country_label: { EN: "Driver's License Issuing Country", ZH: '駕照簽發國家 / 地區' },
  df_flight_label: { EN: 'Arrival Flight Number (Optional)', ZH: '抵達航班號（選填）' },
  df_flight_hint: { EN: 'If your flight is delayed, we protect your vehicle hold past your scheduled pick-up time.', ZH: '若您的航班延誤，我們將為您保留車輛直至航班落地。' },
  df_additional_driver_toggle: { EN: 'Add an Additional Driver (Free of charge)', ZH: '添加額外駕駛人（免費）' },
  df_additional_driver_name: { EN: 'Additional Driver Full Name', ZH: '額外駕駛人完整姓名' },

  // Booking View Sidebar
  bv_configured_trip: { EN: 'Configured Trip', ZH: '行程配置' },
  bv_base_rental: { EN: 'Base Rental ({days}d)', ZH: '車輛租金 ({days} 天)' },
  bv_rental_days: { EN: '{days} Days', ZH: '{days} 天' },
  bv_taxes_included: { EN: 'All taxes included. Transparent checkout ahead.', ZH: '已含所有法定稅費，後續結算透明無隱藏費用。' },

  // Checkout & Payment
  ck_ssl_secure_subtext: { EN: 'Bank-grade 256-bit SSL encrypted · Powered by Stripe', ZH: '銀行級 256 位 SSL 加密 · Powered by Stripe' },
  ck_hold_vehicle_reserved: { EN: 'Vehicle is temporarily reserved in FleetEdge inventory for peace of mind.', ZH: '車輛已在 FleetEdge 庫存中為您暫時保留，請安心預訂。' },
  ck_cardholder_name: { EN: 'Cardholder Name', ZH: '持卡人姓名' },
  ck_card_number: { EN: 'Card Number', ZH: '卡號' },
  ck_card_expires: { EN: 'Expires', ZH: '有效期' },
  ck_card_cvc: { EN: 'CVC / CVV', ZH: '安全碼 (CVC/CVV)' },
  ck_postal_code: { EN: 'Postal Code', ZH: '郵遞區號' },
  ck_card_tab: { EN: 'Credit or Debit Card', ZH: '信用卡 / 借記卡' },
  ck_card_info: { EN: 'Card Information', ZH: '卡片信息' },
  ck_country_or_region: { EN: 'Country or Region', ZH: '國家或地區' },
  ck_contact_email: { EN: 'Receipt & Voucher Email', ZH: '憑單與收據接收郵箱' },
  ck_cvc_hint: { EN: '3 digits on back (4 for Amex)', ZH: '背面 3 位（Amex 為正面 4 位）' },
  bv_processing: { EN: 'Processing...', ZH: '處理中...' },
  bv_proceed_checkout: { EN: 'Proceed to Checkout', ZH: '前往結算' },
  bv_ssl_notice: { EN: 'Bank-grade 256-bit SSL encrypted checkout', ZH: '銀行級 256 位 SSL 加密結算' },
  ck_terms_agreement_text: {
    EN: "I confirm that the main driver meets all driver age requirements and will present a valid physical driver's license and 1949 IDP / certified translation at pick-up. I accept the {terms}, {rental_policy}, and {privacy}.",
    ZH: '我確認主駕駛人符合年齡要求，並將在取車時出示有效的實體駕照及 1949 國際駕照 (IDP) 或官方認證翻譯件。我同意 {terms}、{rental_policy} 與 {privacy}。',
  },
  ck_confirm_and_pay: { EN: 'Confirm & Pay {currency}{amount}', ZH: '確認並支付 {currency}{amount}' },
  ck_pay_now: { EN: 'Pay Now', ZH: '立即支付' },
  ck_pci_certified: { EN: 'PCI-DSS Level 1 Certified', ZH: 'PCI-DSS Level 1 安全認證' },
  ck_order_review_badge: { EN: 'Order Review', ZH: '訂單覆核' },
  ck_pickup_return_depot: { EN: 'Pick-up & Return Depot', ZH: '取車與還車門店' },
  ck_rental_period: { EN: 'Rental Period ({days} Days)', ZH: '租期（{days} 天）' },
  ck_all_taxes_included: { EN: 'All taxes and concession recovery fees included.', ZH: '已包含所有法定稅費與特許經營費。' },
  ck_deposit_desc: { EN: '{currency}{depositAmount} refundable hold on driver\'s credit card upon vehicle pickup.', ZH: '門店取車時將在主駕駛人信用卡凍結 {currency}{depositAmount} 預授權押金，還車後按條款解凍。' },

  back_to_rate_equipment: { EN: 'Back to Rate & Equipment', ZH: '返回費率與附加服務' },
  back_to_driver_info: { EN: 'Back to Driver Information', ZH: '返回駕駛人信息' },

  // Rate summary: price details, payment timing & special fees
  rate_price_details: { EN: 'Price Details', ZH: '價格詳情' },
  rate_tax_incl_amount: {
    EN: 'Incl. taxes & fees {amount}',
    ZH: '已含稅費與附加費 {amount}',
  },
  rate_special_fees: { EN: 'Special Fees', ZH: '特殊費用' },
  rate_oneway_fee: { EN: 'One-way Fee', ZH: '異地還車費' },
  rate_pay_now: { EN: 'Pay Online', ZH: '線上支付' },
  rate_pay_counter: { EN: 'Pay at Counter', ZH: '取車時支付' },

  ic_view_details: { EN: 'View Details', ZH: '查看詳情' },
  ic_included: { EN: 'Included', ZH: '已包含' },
  ic_no_deductible: { EN: 'No deductible', ZH: '零免賠' },
  ic_daily_rate: { EN: 'Daily Rate', ZH: '每日費率' },
  ic_damage_excess: { EN: 'Damage Excess', ZH: '車損免賠額' },
  ic_theft_excess: { EN: 'Theft Excess', ZH: '盜搶免賠額' },
  ic_coverage: { EN: 'Coverage', ZH: '保障範圍' },

  // Insurance details & explainer
  ic_provided_by: { EN: 'The following coverage packages are provided by {supplier}', ZH: '以下保險套餐由 {supplier} 提供' },
  ic_current_plan: { EN: 'Current Plan', ZH: '目前方案' },
  ic_tab_coverage: { EN: 'Coverage Details', ZH: '保障項目說明' },
  ic_tab_conditions: { EN: 'Applicable Conditions', ZH: '適用條件' },
  ic_tab_exclusions: { EN: 'Exclusions', ZH: '除外責任' },
  ic_tab_incident: { EN: 'Incident Guide', ZH: '發生事故指引' },
  ic_customer_excess: { EN: 'Customer Excess', ZH: '客戶自負額' },
  ic_noc_fee: { EN: 'NOC / Loss of Use', ZH: 'NOC 營業損失' },
  ic_third_party_liability: { EN: 'Third-Party Liability', ZH: '第三者責任' },
  ic_deposit_preauth: { EN: 'Deposit Pre-auth', ZH: '到店押金預授權' },
  ic_conditions_intro: { EN: 'This package is subject to the following rental conditions, which must be strictly observed during your trip:', ZH: '本保險套餐受以下適用條件約束，請在租賃使用過程中嚴格遵守：' },
  ic_exclusions_intro: { EN: 'Insurance coverage will not apply in the following events; the renter remains fully liable for all associated damage and costs:', ZH: '如發生以下情形，保險將不予賠付，所有損害及相關費用均需由客戶全額自行承擔：' },
  ic_desc_glass_excluded: { EN: 'Customer liable for glass repair costs', ZH: '承租人需自負玻璃修復費用' },
  ic_desc_tyre_excluded: { EN: 'Customer liable for punctures and blowouts', ZH: '承租人需自負輪胎刺破及爆胎費用' },
  ic_desc_roadside_excluded: { EN: 'Call-out fees apply per incident', ZH: '按次收取救援出車費' },
  ic_desc_roadside_free: { EN: 'Zero call-out charge for flat tyre, lock-out, or battery jump', ZH: '換備胎、開鎖、搭電等救援出車 0 費用' },
  ic_zero_excess_summary: { EN: 'Zero excess ($0)', ZH: '0 自負額 ($0)' },
  ic_noc_waived: { EN: 'Fully waived ($0)', ZH: '全額免除 ($0)' },
  ic_coverage_limit_label: { EN: 'Coverage Limit:', ZH: '保障上限：' },
  ic_excess_label: { EN: 'Excess:', ZH: '免賠額：' },
  ic_select_this_plan: { EN: 'Select This Plan', ZH: '選擇此方案' },

  ex_modal_title: { EN: 'What is Damage Excess (Deductible)?', ZH: '什麼是碰撞免賠額（自負額）？' },
  ex_modal_subtitle: { EN: 'Rental car insurance, deductible & pre-authorization explained', ZH: '租車保險、免賠額與押金預授權指引' },
  ex_deductible_desc: { EN: 'The excess (deductible) is the maximum amount you are legally responsible for paying out of your own pocket before the car rental insurer covers the rest. If the excess is $0, qualifying damages are fully covered by the supplier.', ZH: '客戶自負額（起賠額）是發生事故時，您在車行保險賠付前需要自行承擔的最高金額。超出該金額的合資格損失由車行保險全額承保。若自負額為 0，則合資格車損由車行全額承擔，承租人無需支付。' },
  ex_example1_title: { EN: 'Example 1: Excess is $1,000 (Vehicle damage is $1,800)', ZH: '案例 1：若自負額為 $1,000（車損為 $1,800）' },
  ex_example1_damage: { EN: 'Vehicle Damage: $1,800', ZH: '車損金額：$1,800' },
  ex_example1_excess: { EN: 'Excess: $1,000', ZH: '自負額：$1,000' },
  ex_example1_renter: { EN: 'Renter pays $1,000', ZH: '承租人承擔 $1,000' },
  ex_example1_supplier: { EN: 'Supplier insurance covers $800', ZH: '車行保險承擔 $800' },
  ex_example2_title: { EN: 'Example 2: Excess is $0 (Vehicle damage is $1,800)', ZH: '案例 2：若自負額為 $0（車損為 $1,800）' },
  ex_example2_damage: { EN: 'Vehicle Damage: $1,800', ZH: '車損金額：$1,800' },
  ex_example2_excess: { EN: 'Excess: $0', ZH: '自負額：$0' },
  ex_example2_renter: { EN: 'Renter pays $0 (Zero deductible)', ZH: '承租人無需承擔 ($0)' },
  ex_example2_supplier: { EN: 'Supplier insurance fully covers $1,800', ZH: '車行保險全額承擔 $1,800' },
  ex_important_notes_title: { EN: 'Important terms & boundaries', ZH: '重要須知與適用邊界' },
  ex_note_exclusions: { EN: 'Exclusions (e.g. unauthorized drivers, DUI, failure to file police report) are not covered and renter remains fully liable.', ZH: '若事故符合除外責任（如酒駕、未授權駕駛人開車、未報警等），保險不予賠付，客戶須承擔全部損失。' },
  ex_note_noc: { EN: 'Non-operation charges (NOC), roadside assistance, key loss, glass & tires are subject to specific package terms.', ZH: '停運損失費（NOC）、拖車救援、鑰匙遺失、輪胎與玻璃依套餐等級約定。' },
  ex_note_deposit: { EN: 'Security deposit pre-authorization is a standard rental procedure and is independent of $0 excess.', ZH: '取車時的信用卡押金預授權為車行標準手續，不因 0 自負額自動免除。' },
  ex_btn_understand: { EN: 'I Understand', ZH: '我知道了' },

  back_to_vehicle_results: { EN: 'Back to Vehicle Results', ZH: '返回車輛搜尋結果' },
  ct_timezone_notice: {
    EN: 'All cancellation deadlines are calculated based on the local time zone of the pick-up location.',
    ZH: '所有取消政策截止時間均以取車門店當地時間為準。',
  },
  fleet_fuel_full_to_full: {
    EN: 'Fuel: Like for Like (Full to Full)',
    ZH: '燃油政策：滿油取還',
  },
  vs_or_similar_title: {
    EN: 'What does "Or Similar" mean?',
    ZH: '什麼是「或同級車型」？',
  },
  vs_or_similar_desc: {
    EN: 'Car rental fleets operate in vehicle category groups. You are guaranteed a vehicle matching or exceeding the exact passenger seating, luggage space, transmission type, and vehicle class.',
    ZH: '租車車隊依據車型組運作。我們保證提供載客人數、行李容量、變速箱類型及車輛級別均符合或高於所選車型標準的同級車輛。',
  },
  storeguide_everyday: { EN: 'Everyday', ZH: '每天' },

  ...customerAccountBaseTranslations,

  // Things to know (Airbnb style)
  ttk_title: {
    EN: 'Things to know',
    ZH: '取車須知',
  },
  ttk_subtitle: {
    EN: 'Review essential driver qualifications, document requirements, deposit policies, and cancellation rules.',
    ZH: '出發前請核對駕駛人資格、必備證件、押金及取消政策規範。',
  },
  ttk_show_more: {
    EN: 'Show more',
    ZH: '查看更多',
  },
  ttk_show_all: {
    EN: 'Show all policies',
    ZH: '查看全部須知',
  },
  ttk_tab_driver: {
    EN: 'Driver requirements',
    ZH: '駕駛員資格',
  },
  ttk_driver_summary: {
    EN: 'Aged 21–70 with 1+ year valid driving experience. Young driver surcharge applies under 25.',
    ZH: '主駕駛人須年滿 21 至 70 歲，持照滿 1 年以上。未滿 25 歲可能產生青年駕駛人附加費。',
  },
  ttk_driver_age_title: {
    EN: 'Age Limits & Experience',
    ZH: '年齡限制與駕齡要求',
  },
  ttk_driver_age_desc: {
    EN: 'Drivers must be at least 21 years old and under 70 years old at pick-up, holding a full valid license for at least 1 year. Learner or probationary permits (L/P plates) are strictly prohibited.',
    ZH: '取車時駕駛人年齡須在 21 至 70 歲之間，且持有正式合法駕照滿 1 年以上。不接受學習駕照或臨時實習駕照（L/P 牌）。',
  },
  ttk_driver_young_title: {
    EN: 'Young Driver Policy (Under 25)',
    ZH: '青年駕駛人政策（未滿 25 歲）',
  },
  ttk_driver_young_desc: {
    EN: 'Drivers aged 21 to 24 may incur a young driver fee in accordance with fleet and insurance regulations.',
    ZH: '年齡在 21 至 24 歲之駕駛人，依車隊與保險規範可能需加收青年駕駛人附加費用。',
  },
  ttk_driver_additional_title: {
    EN: 'Additional Drivers',
    ZH: '額外附加駕駛人',
  },
  ttk_driver_additional_desc: {
    EN: 'All additional drivers must present their documents in person at the counter to be added to the rental agreement. Unregistered drivers void all insurance protection.',
    ZH: '所有額外駕駛人均須親臨門店出示全套法定證件並登記於租車合約中。未登記者嚴禁駕車，否則保險完全失效。',
  },
  ttk_driver_refusal_notice: {
    EN: 'If the driver does not satisfy the criteria at pick-up, the booking will be cancelled without refund.',
    ZH: '若取車時駕駛人不符合法定年齡或駕齡標準，門店將依法拒絕辦理且預訂無法退款。',
  },
  ttk_tab_docs: {
    EN: 'Required documents',
    ZH: '取車必備證件',
  },
  ttk_docs_summary: {
    EN: 'Original passport, physical domestic license, and 1949 Geneva Convention IDP booklet (or official translation).',
    ZH: '護照原件、實體本國駕照、1949 年日內瓦公約紙本 IDP（或指定官方日文翻譯件）。',
  },
  ttk_docs_visitor_tab: {
    EN: 'International visitor',
    ZH: '非當地居民 / 國際旅客',
  },
  ttk_docs_local_tab: {
    EN: 'Local resident',
    ZH: '當地居民 / 日本在留者',
  },
  ttk_docs_passport_title: {
    EN: 'Proof of Identity',
    ZH: '身份證明文件',
  },
  ttk_docs_passport_desc: {
    EN: 'Valid physical original passport with entry stamp (within 1 year of arrival). Digital copies or photos on mobile phones are strictly not accepted.',
    ZH: '有效實體護照原件（含 1 年內入境蓋章）。手機截圖或電子掃描件一律不予受理。',
  },
  ttk_docs_local_id_desc: {
    EN: "Valid government-issued photo ID (Residence Card, My Number Card, or Japanese Passport) + original domestic driver's license.",
    ZH: '日本政府簽發之有效實體身份證件（在留卡、個人番號卡或日本護照）+ 日本國內合法正式駕照原件。',
  },
  ttk_docs_license_title: {
    EN: "Domestic Driver's License",
    ZH: '本國實體駕照原件',
  },
  ttk_docs_license_desc: {
    EN: 'Original physical driving license matching your passport name and nationality. Must be in valid status for at least 1 year.',
    ZH: '與護照姓名及簽發地一致的本國實體駕駛執照原件，領照時間須滿 1 年以上且在有效期內。',
  },
  ttk_docs_idp_title: {
    EN: '1949 Geneva Convention IDP Booklet',
    ZH: '1949 年日內瓦公約國際駕照（IDP 紙本）',
  },
  ttk_docs_idp_desc: {
    EN: 'Japan strictly recognizes ONLY physical paper booklet IDPs issued under the 1949 Geneva Convention. Permits under the 1926 Paris, 1943 Washington, or 1968 Vienna Conventions, digital/app IDPs, or unofficial computer translations are NOT accepted in Japan.',
    ZH: '日本國內僅合法承認依據「1949 年日內瓦道路交通公約」簽發的紙質實體小冊子 IDP。依據 1968 年維也納公約、1926 年巴黎公約簽發之 IDP、電子版/APP 國際駕照或非官方電腦翻譯件均不被承認，依法無法取車。',
  },
  ttk_docs_translation_title: {
    EN: 'Official Japanese Translation (6 Origins Only)',
    ZH: '官方日文翻譯件（僅限 6 個特定國家/地區）',
  },
  ttk_docs_translation_desc: {
    EN: 'Holders of licenses from Switzerland, Germany, France, Taiwan, Belgium, or Monaco do NOT require an IDP. You must present your original license + an official Japanese translation issued by JAF or the relevant Embassy/Consulate.',
    ZH: '持有瑞士、德國、法國、台灣、比利時、摩納哥駕照者無須辦理 IDP，取車時出示本國駕照原件 + 由日本汽車聯盟（JAF）或駐日使領館簽發之法定官方日文翻譯文即可合法取車。',
  },
  ttk_docs_mainland_notice: {
    EN: 'Mainland China is not a party to the 1949 Geneva Convention. Drivers holding only a Mainland Chinese license cannot rent or drive legally in Japan.',
    ZH: '因中國大陸非 1949 年日內瓦公約締約方，僅持中國大陸駕照者無法在日本租車或合法自駕。',
  },
  ttk_docs_sample_button: {
    EN: 'View IDP & Translation Samples by Country',
    ZH: '檢視各客源地 IDP / 翻譯件實物樣張',
  },
  ttk_tab_deposit: {
    EN: 'Deposit & payment',
    ZH: '押金與支付方式',
  },
  ttk_deposit_summary: {
    EN: "Physical credit card in main driver's name for deposit pre-authorization ({amount}). Debit cards not accepted. Released upon clean return.",
    ZH: '取車時須以主駕駛人本人的實體信用卡辦理押金預授權（約 {amount}）。不接受借記卡。完好還車後全額解凍。',
  },
  ttk_deposit_amount_title: {
    EN: 'Security Deposit Pre-authorization',
    ZH: '到店保證金（預授權）',
  },
  ttk_deposit_amount_desc: {
    EN: 'The counter will place a temporary pre-authorization hold of approximately {amount} on your credit card. This is not a charge and is fully released upon undamaged vehicle return without outstanding tolls or fines.',
    ZH: '取車時門店將在主駕駛人信用卡凍結約 {amount} 的押金預授權額度。這不是實際扣款，車輛完好歸還且無未繳過路費或違章罰金時，門店即時辦理解凍。',
  },
  ttk_deposit_card_title: {
    EN: 'Accepted Credit Cards',
    ZH: '支持的信用卡種類',
  },
  ttk_deposit_card_desc: {
    EN: "Must be a physical credit card with chip under the main driver's name with at least 6 months validity. Visa, MasterCard, JCB, and American Express are accepted.",
    ZH: '必須出示主駕駛人本人名下的實體晶片信用卡，且有效期須在 6 個月以上。支持 Visa、MasterCard、JCB 及 American Express。',
  },
  ttk_deposit_debit_title: {
    EN: 'Debit & Prepaid Cards Strictly Prohibited',
    ZH: '嚴禁使用借記卡與預付卡',
  },
  ttk_deposit_debit_desc: {
    EN: 'Debit cards (including Visa Debit, Mastercard Debit), prepaid cards, cash, and digital mobile wallets (Apple Pay/Google Pay) cannot be used for the security deposit.',
    ZH: '借記卡（Debit 卡/簽賬卡）、預付卡、現金以及手機行動支付（Apple Pay、Google Pay 等）均無法用於辦理押金預授權。',
  },
  ttk_deposit_timeline_title: {
    EN: 'Deposit Release Timeline',
    ZH: '押金解凍與退還時效',
  },
  ttk_deposit_timeline_desc: {
    EN: 'The merchant releases the hold immediately upon return. Due to interbank processing, the frozen line of credit typically reflects as released on your statement within 7 to 14 business days.',
    ZH: '門店在驗車完好後會即時向收單行提交解除預授權申請。受跨國銀行結算週期影響，通常在 7 至 14 個工作日內在您的信用卡賬單中恢復額度。',
  },
  ttk_tab_cancellation: {
    EN: 'Cancellation & rules',
    ZH: '取消政策與到店須知',
  },
  ttk_cancellation_summary: {
    EN: 'Free cancellation up to 48 hours prior to pick-up with 100% refund. Like-for-like fuel policy and punctuality rules apply.',
    ZH: '取車前 48 小時以上免費取消並享 100% 全額退款。實行滿油取還及門店取車準時保留規範。',
  },
  ttk_rules_punctuality_title: {
    EN: 'Pick-up Grace Period & No-Show',
    ZH: '取車準時與保留寬限期',
  },
  ttk_rules_punctuality_desc: {
    EN: 'Reserved vehicles are held for up to 1 to 2 hours past your scheduled pick-up time during store operating hours. If your flight is delayed, please contact the depot or customer support in advance to secure your reservation.',
    ZH: '門店在營業時間內最長為您保留車輛 1 至 2 小時。若遇航班延誤或行程變更，請務必提前聯繫門店或客服備註延後取車，避免被判定為未取車（No-Show）。',
  },
  ttk_rules_fuel_title: {
    EN: 'Fuel Policy (Like-for-Like)',
    ZH: '燃油政策（滿油取還）',
  },
  ttk_rules_fuel_desc: {
    EN: 'You will receive the vehicle with a full tank and must return it full. If returned with less fuel, a refueling cost calculated by the depot plus a service handling fee will apply.',
    ZH: '車輛交付時為滿油狀態，歸還時亦須加滿油。若歸還時油量不足，門店將按店內費率加收燃油差價及加油手續費。',
  },
  ttk_rules_toll_title: {
    EN: 'Highway Tolls & ETC',
    ZH: '高速公路過路費與 ETC',
  },
  ttk_rules_toll_desc: {
    EN: 'ETC cards can be rented at the pick-up counter (subject to availability). All electronic toll charges accumulated during the rental will be calculated and settled at vehicle return.',
    ZH: '門店現場可租借 ETC 卡（以現場庫存為準）。自駕期間產生之高速過路費將在還車時統一讀卡結算。',
  },
};
