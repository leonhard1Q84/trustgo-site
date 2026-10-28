import { Locale } from '../locales';
import { getTranslation } from '../translation';
import { getFooterGroups, type FooterLinkGroup } from '@/modules/site-content/content-api';

export interface ContactHighlight {
  badge: string;
  title: string;
  desc: string;
  whatsappLabel: string;
  whatsappHint: string;
  openWhatsApp: string;
  emailLabel: string;
  emailHint?: string;
  sendEmail: string;
  copyAction: string;
  copied?: string;
  wechatLabel: string;
  wechatHint: string;
  copySuccess: string;
}

export interface FooterColumns {
  contact: {
    title: string;
    whatsappLabel: string;
    whatsappHint: string;
    emailLabel: string;
    emailHint: string;
    wechatLabel: string;
    wechatHint: string;
    badge: string;
    copied: string;
    copyAction: string;
  };
  rent: FooterLinkGroup;
  service: FooterLinkGroup;
  business: FooterLinkGroup;
  company: FooterLinkGroup;
  legal: {
    terms: string;
    privacy: string;
    cookiePolicy: string;
    safetyPolicy: string;
  };
}

export interface Dictionary {
  brand: {
    name: string;
    slogan: string;
    tagline: string;
  };
  nav: {
    home: string;
    searchCars: string;
    locations: string;
    manageBooking: string;
    franchise: string;
    contact: string;
    language: string;
    menuOpen: string;
    menuClose: string;
  };
  common: {
    brandName: string;
    slogan: string;
    search: string;
    findReservation: string;
    signIn: string;
    signUp: string;
    myBookings: string;
    profile: string;
    help: string;
    locations: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    searchBar: {
      pickupLocation: string;
      pickupPlaceholder: string;
      returnLocation: string;
      returnPlaceholder: string;
      sameLocation: string;
      differentLocation: string;
      dates: string;
      driverAge: string;
      driverAgeNotice: string;
      searchCars: string;
    };
    promises: {
      sectionTitle: string;
      sectionSubtitle: string;
      easyBooking: {
        title: string;
        desc: string;
      };
      confidence: {
        title: string;
        desc: string;
      };
      freedom: {
        title: string;
        desc: string;
      };
    };
    reviews: {
      sectionTitle: string;
      sectionSubtitle: string;
      verifiedBadge: string;
      basedOnTripReviews: string;
      items: Array<{
        quote: string;
        author: string;
        country: string;
        countryFlag: string;
        route: string;
        vehicleCategory: string;
        rating: number;
      }>;
    };
    inspirations: {
      sectionTitle: string;
      sectionSubtitle: string;
      exploreMore: string;
      items: Array<{
        title: string;
        location: string;
        image: string;
        tag: string;
      }>;
    };
  };
  footer: {
    description: string;
    explore: string;
    support: string;
    partners: string;
    legal: string;
    privacy: string;
    terms: string;
    franchise: string;
    allRightsReserved: string;
    contactHighlight: ContactHighlight;
    columns: FooterColumns;
    rights: string;
  };
  fleet: {
    title: string;
    subtitle: string;
    viewAll: string;
    seats: string;
    bags: string;
    auto: string;
    manual: string;
    fromPerDay: string;
    bookNow: string;
  };
  howItWorks: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  franchise: {
    tag: string;
    title: string;
    desc: string;
    cta: string;
  };
  values: {
    title: string;
    subtitle: string;
    card1: { title: string; desc: string };
    card2: { title: string; desc: string };
    card3: { title: string; desc: string };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    sameDropoff: string;
    driverAgeLabel: string;
    pickupLabel: string;
    pickupPlaceholder: string;
    dropoffLabel: string;
    pickupDate: string;
    searchButton: string;
    instantConfirmation: string;
    freeCancellation: string;
    cleanGuaranteed: string;
  };
}

export function getDictionary(locale: Locale): Dictionary {
  const t = (k: string) => getTranslation(k, locale);

  return {
    brand: {
      name: t('brand_name'),
      slogan: t('brand_slogan'),
      tagline: t('brand_tagline'),
    },
    nav: {
      home: t('nav_home'),
      searchCars: t('nav_search_cars'),
      locations: t('nav_locations'),
      manageBooking: t('nav_manage_booking'),
      franchise: t('nav_franchise'),
      contact: t('nav_contact'),
      language: t('nav_language'),
      menuOpen: t('nav_menu_open'),
      menuClose: t('nav_menu_close'),
    },
    common: {
      brandName: t('brand_name'),
      slogan: t('brand_slogan'),
      search: t('common_search'),
      findReservation: t('nav_manage_booking'),
      signIn: t('nav_manage_booking'),
      signUp: t('nav_franchise'),
      myBookings: t('nav_manage_booking'),
      profile: t('nav_manage_booking'),
      help: t('slug_help_title'),
      locations: t('nav_locations'),
    },
    home: {
      heroTitle: t('home_hero_title'),
      heroSubtitle: t('home_hero_subtitle'),
      searchBar: {
        pickupLocation: t('search_pickup_location'),
        pickupPlaceholder: t('search_pickup_placeholder'),
        returnLocation: t('search_return_location'),
        returnPlaceholder: t('search_return_placeholder'),
        sameLocation: t('search_same_location'),
        differentLocation: t('search_different_location'),
        dates: t('search_dates'),
        driverAge: t('search_driver_age'),
        driverAgeNotice: t('search_driver_age_notice'),
        searchCars: t('search_submit'),
      },
      promises: {
        sectionTitle: t('promises_section_title'),
        sectionSubtitle: t('promises_section_subtitle'),
        easyBooking: {
          title: t('promises_easy_title'),
          desc: t('promises_easy_desc'),
        },
        confidence: {
          title: t('promises_confidence_title'),
          desc: t('promises_confidence_desc'),
        },
        freedom: {
          title: t('promises_freedom_title'),
          desc: t('promises_freedom_desc'),
        },
      },
      reviews: {
        sectionTitle: t('reviews_section_title'),
        sectionSubtitle: t('reviews_section_subtitle'),
        verifiedBadge: t('reviews_verified_badge'),
        basedOnTripReviews: t('reviews_based_score'),
        items: [
          {
            quote: t('reviews_item1_quote'),
            author: t('reviews_item1_author'),
            country: t('reviews_item1_country'),
            countryFlag: '🇺🇸',
            route: t('reviews_item1_route'),
            vehicleCategory: t('reviews_item1_category'),
            rating: 5,
          },
          {
            quote: t('reviews_item2_quote'),
            author: t('reviews_item2_author'),
            country: t('reviews_item2_country'),
            countryFlag: '🇩🇪',
            route: t('reviews_item2_route'),
            vehicleCategory: t('reviews_item2_category'),
            rating: 5,
          },
          {
            quote: t('reviews_item3_quote'),
            author: t('reviews_item3_author'),
            country: t('reviews_item3_country'),
            countryFlag: '🇯🇵',
            route: t('reviews_item3_route'),
            vehicleCategory: t('reviews_item3_category'),
            rating: 5,
          },
          {
            quote: t('reviews_item4_quote'),
            author: t('reviews_item4_author'),
            country: t('reviews_item4_country'),
            countryFlag: '🇨🇦',
            route: t('reviews_item4_route'),
            vehicleCategory: t('reviews_item4_category'),
            rating: 5,
          },
          {
            quote: t('reviews_item5_quote'),
            author: t('reviews_item5_author'),
            country: t('reviews_item5_country'),
            countryFlag: '🇫🇷',
            route: t('reviews_item5_route'),
            vehicleCategory: t('reviews_item5_category'),
            rating: 5,
          },
          {
            quote: t('reviews_item6_quote'),
            author: t('reviews_item6_author'),
            country: t('reviews_item6_country'),
            countryFlag: '🇦🇺',
            route: t('reviews_item6_route'),
            vehicleCategory: t('reviews_item6_category'),
            rating: 5,
          },
        ],
      },
      inspirations: {
        sectionTitle: t('inspirations_section_title'),
        sectionSubtitle: t('inspirations_section_subtitle'),
        exploreMore: t('inspirations_explore_more'),
        items: [
          {
            title: t('inspirations_item1_title'),
            location: t('inspirations_item1_location'),
            image:
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            tag: t('inspirations_item1_tag'),
          },
          {
            title: t('inspirations_item2_title'),
            location: t('inspirations_item2_location'),
            image:
              'https://images.unsplash.com/photo-1527672809634-04ed36500acd?auto=format&fit=crop&w=1200&q=80',
            tag: t('inspirations_item2_tag'),
          },
          {
            title: t('inspirations_item3_title'),
            location: t('inspirations_item3_location'),
            image:
              'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            tag: t('inspirations_item3_tag'),
          },
        ],
      },
    },
    footer: {
      description: t('footer_brand_desc'),
      explore: t('nav_locations'),
      support: t('slug_help_title'),
      partners: t('nav_franchise'),
      legal: t('footer_col_legal_title'),
      privacy: t('footer_col_legal_privacy'),
      terms: t('footer_col_legal_terms'),
      franchise: t('nav_franchise'),
      allRightsReserved: t('footer_all_rights'),
      contactHighlight: {
        badge: t('contact_badge'),
        title: t('contact_title'),
        desc: t('contact_desc'),
        whatsappLabel: t('contact_whatsapp_label'),
        whatsappHint: t('contact_whatsapp_hint'),
        openWhatsApp: t('contact_open_whatsapp'),
        emailLabel: t('contact_email_label'),
        sendEmail: t('contact_send_email'),
        copyAction: t('common_copy'),
        wechatLabel: t('contact_wechat_label'),
        wechatHint: t('contact_wechat_hint'),
        copySuccess: t('common_copied'),
      },
      columns: {
        contact: {
          title: t('contact_nav_title') || t('nav_contact') || 'Contact',
          whatsappLabel: t('contact_whatsapp_label'),
          whatsappHint: t('contact_whatsapp_hint'),
          emailLabel: t('contact_email_label'),
          emailHint: t('contact_email_hint') || 'Official Inquiry & Booking',
          wechatLabel: t('contact_wechat_label'),
          wechatHint: t('contact_wechat_hint'),
          badge: t('contact_badge'),
          copied: t('common_copied'),
          copyAction: t('common_copy'),
        },
        ...getFooterGroups(locale),
        legal: {
          terms: t('footer_col_legal_terms'),
          privacy: t('footer_col_legal_privacy'),
          cookiePolicy: t('footer_col_legal_cookie'),
          safetyPolicy: t('footer_col_legal_safety'),
        },
      },
      rights: t('footer_all_rights'),
    },
    fleet: {
      title: t('fleet_title'),
      subtitle: t('fleet_subtitle'),
      viewAll: t('fleet_view_all'),
      seats: t('common_seats'),
      bags: t('common_bags'),
      auto: t('common_automatic'),
      manual: t('common_manual'),
      fromPerDay: t('common_per_day'),
      bookNow: t('common_select_reserve'),
    },
    howItWorks: {
      title: t('how_title'),
      step1Title: t('how_step1_title'),
      step1Desc: t('how_step1_desc'),
      step2Title: t('how_step2_title'),
      step2Desc: t('how_step2_desc'),
      step3Title: t('how_step3_title'),
      step3Desc: t('how_step3_desc'),
    },
    franchise: {
      tag: t('franchise_badge'),
      title: t('franchise_hero_title'),
      desc: t('franchise_hero_desc'),
      cta: t('franchise_benefit1_title'),
    },
    values: {
      title: t('promises_section_title'),
      subtitle: t('promises_section_subtitle'),
      card1: {
        title: t('promises_easy_title'),
        desc: t('promises_easy_desc'),
      },
      card2: {
        title: t('promises_confidence_title'),
        desc: t('promises_confidence_desc'),
      },
      card3: {
        title: t('promises_freedom_title'),
        desc: t('promises_freedom_desc'),
      },
    },
    hero: {
      badge: t('home_hero_badge'),
      title: t('home_hero_title'),
      subtitle: t('home_hero_subtitle'),
      sameDropoff: t('search_same_location'),
      driverAgeLabel: t('search_driver_age'),
      pickupLabel: t('search_pickup_location'),
      pickupPlaceholder: t('search_pickup_placeholder'),
      dropoffLabel: t('search_return_location'),
      pickupDate: t('search_pickup_date'),
      searchButton: t('search_submit'),
      instantConfirmation: t('common_instant_confirmation'),
      freeCancellation: t('common_free_cancellation'),
      cleanGuaranteed: t('common_clean_guaranteed'),
    },
  };
}
