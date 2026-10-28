export interface PartnerLogo {
  name: string;
  website: string;
  logo: string;
  /** Icon-only assets keep a visible brand name beside the image. */
  iconOnly?: boolean;
  onDark?: boolean;
}

export const partnerLogos: PartnerLogo[] = [
  { name: 'Klook', website: 'https://www.klook.com/', logo: '/partners/klook.png', iconOnly: true },
  { name: 'Booking.com', website: 'https://www.booking.com/', logo: '/partners/booking.svg' },
  { name: 'carmore / 카모아', website: 'https://carmore.kr/home', logo: '/partners/carmore.png' },
  { name: 'QEEQ.COM', website: 'https://www.qeeq.com/', logo: '/partners/qeeq.png' },
  { name: '租租車 / Zuzuche', website: 'https://www.zuzuche.com/', logo: '/partners/zuzuche.png' },
  {
    name: 'EconomyBookings',
    website: 'https://www.economybookings.com/',
    logo: '/partners/economybookings.svg',
    onDark: true,
  },
  {
    name: 'DiscoverCars',
    website: 'https://www.discovercars.com/',
    logo: '/partners/discovercars.png',
    iconOnly: true,
  },
  { name: 'KAYAK', website: 'https://www.kayak.com/', logo: '/partners/kayak.svg' },
  { name: 'Skyscanner', website: 'https://www.skyscanner.net/', logo: '/partners/skyscanner.svg' },
  { name: 'gogoout', website: 'https://gogoout.com/en', logo: '/partners/gogoout.png' },
];

export const B2B_CONTACT = {
  email: 'soren.yang@trustgo.tech',
  whatsapp: '+86 187 6199 1085',
  whatsappLink: 'https://wa.me/8618761991085',
  wechat: 'yangsi3010',
  merchantPortalUrl: 'https://merchant.ixrentacar.com/vue/homePage',
  locationsUrl: '/locations',
} as const;

export interface FranchiseStatItem {
  value: string;
  labelKey: string;
  subKey?: string;
}

export const FRANCHISE_STATS: FranchiseStatItem[] = [
  {
    value: '5',
    labelKey: 'franchise_stat_countries',
    subKey: 'franchise_stat_countries_sub',
  },
  {
    value: '50+',
    labelKey: 'franchise_stat_stations',
  },
  {
    value: '2,000+',
    labelKey: 'franchise_stat_vehicles',
  },
  {
    value: '10+',
    labelKey: 'franchise_stat_channels',
  },
];
