import { routeLanguages, type RouteLanguage } from '@/i18n/locales';
import {
  duringAndAfterUseQuestions,
  onlinePaymentQuestions,
  rentalFeeQuestions,
  reservationQuestions,
  vehicleCategoryQuestions,
} from './helpFaqData/sourceFaq';
import {
  billingSupplementQuestions,
  duringRentalSupplementQuestions,
  reservationDocumentQuestions,
} from './helpFaqData/pdfSupplement';
import { attachmentQuestions } from './helpFaqData/attachmentQuestions';
import { managingReservationQuestions } from './helpFaqData/managingReservationQuestions';
import { driverRequirementQuestions } from './helpFaqData/driverRequirementQuestions';
import { vehicleEquipmentQuestions } from './helpFaqData/vehicleEquipmentQuestions';
import { protectionLiabilityQuestions } from './helpFaqData/protectionLiabilityQuestions';
import { pickupReturnQuestions } from './helpFaqData/pickupReturnQuestions';
import { duringRentalSupportQuestions } from './helpFaqData/duringRentalSupportQuestions';
import {
  localizeQuestions,
  type HelpFaqLinkTarget,
  type HelpFaqQuestion,
  type HelpFaqQuestionDefinition,
  type LocaleText,
} from './helpFaqData/types';

export const helpFaqTopicIds = [
  'making-a-reservation',
  'managing-a-reservation',
  'driver-requirements',
  'vehicles-and-extras',
  'pricing-payment-and-deposit',
  'protection-and-liability',
  'pickup-and-return',
  'fuel-mileage-and-travel',
  'during-your-rental',
] as const;

export type { HelpFaqLinkTarget, HelpFaqQuestion } from './helpFaqData/types';
export type HelpFaqTopicId = (typeof helpFaqTopicIds)[number];

export type HelpFaqTopic = {
  id: HelpFaqTopicId;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  questions: HelpFaqQuestion[];
};

export type HelpFaqCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  browseTitle: string;
  browseIntro: string;
  questionCountLabel: string;
  viewTopic: string;
  backToHelp: string;
  allTopics: string;
  onThisPage: string;
  relatedActions: string;
  relatedTopics: string;
  bookingTermsTitle: string;
  bookingTermsBody: string;
  supportTitle: string;
  supportIntro: string;
  supportCards: Array<{ title: string; description: string; cta: string; target: HelpFaqLinkTarget }>;
  linkLabels: Record<HelpFaqLinkTarget, string>;
};

export type LocalizedHelpFaq = { copy: HelpFaqCopy; topics: Record<HelpFaqTopicId, HelpFaqTopic> };

type TopicDefinition = {
  id: HelpFaqTopicId;
  title: LocaleText;
  description: LocaleText;
  keywords: Record<RouteLanguage, string[]>;
  questions: HelpFaqQuestionDefinition[];
};

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({
  en,
  zh,
  ja,
  es,
  ko,
});

const only = <T extends {id: string}>(questions: T[], ids: string[]) =>
  ids.map((id) => {
    const question = questions.find((question) => question.id === id);
    if (!question) throw new Error(`Unknown Help Center question: ${id}`);
    return question;
  });

const makingReservationQuestions = [
  ...only(reservationQuestions, ['how-to-make-reservation']),
  ...attachmentQuestions.making,
  ...only(vehicleCategoryQuestions, ['vehicle-model-specification']),
  ...reservationDocumentQuestions,
];





const pickupQuestions = pickupReturnQuestions;

const duringYourRentalQuestions = duringRentalSupportQuestions;

const fuelMileageQuestions = [
  ...only(duringAndAfterUseQuestions, ['refuel-before-return']),
  ...only(duringRentalSupplementQuestions, ['correct-fuel-type', 'wrong-fuel']),
  ...only(rentalFeeQuestions, ['unlimited-distance']),
  ...attachmentQuestions.travel,
];

const pricingPaymentDepositQuestions = [
  ...rentalFeeQuestions.filter(({id}) => id !== 'unlimited-distance'),
  ...onlinePaymentQuestions.filter(({id}) => !['cancellation-fee-receipt', 'refund-notice-reservation-status'].includes(id)),
  ...billingSupplementQuestions,
  ...attachmentQuestions.pricing,
];

const protectionQuestions = protectionLiabilityQuestions;

export const helpFaqLastReviewed = '2026-09-16';

const sharedLinkLabels: Record<RouteLanguage, Record<HelpFaqLinkTarget, string>> = {
  en: {
    rent: 'Find a vehicle',
    manage: 'Manage booking',
    locations: 'View locations',
    support: 'Contact support',
    important: 'Driver documents',
  },
  zh: {
    rent: '搜尋車輛',
    manage: '管理訂單',
    locations: '查看門店',
    support: '聯絡客服',
    important: '駕駛證件',
  },
  ja: {
    rent: '車を探す',
    manage: '予約管理',
    locations: '店舗を見る',
    support: 'サポートへ連絡',
    important: '運転書類',
  },
  es: {
    rent: 'Buscar vehículo',
    manage: 'Gestionar reserva',
    locations: 'Ver oficinas',
    support: 'Contactar soporte',
    important: 'Documentos del conductor',
  },
  ko: {
    rent: '차량 검색',
    manage: '예약 관리',
    locations: '지점 보기',
    support: '지원팀 문의',
    important: '운전 서류',
  },
};

const pageCopy: Record<RouteLanguage, HelpFaqCopy> = {
  en: {
    metaTitle: 'Car rental Help Center | TrustGo',
    metaDescription:
      'Find clear answers about driver documents, bookings, vehicles, protection, payments, pickup, return and roadside support.',
    eyebrow: 'TrustGo Help Center',
    title: 'Answers for every part of your rental',
    intro:
      'Check what to prepare before booking, what is included under different pricing and quote conditions, and what to do during the rental.',
    browseTitle: 'Browse help topics',
    browseIntro: 'Choose the part of your rental you need help with.',
    questionCountLabel: 'questions',
    viewTopic: 'View topic',
    backToHelp: 'Back to Help Center',
    allTopics: 'All help topics',
    onThisPage: 'On this page',
    relatedActions: 'Related actions',
    relatedTopics: 'Related topics',
    bookingTermsTitle: 'Your booking terms take priority',
    bookingTermsBody:
      'Availability, prices, limits and protection conditions can vary by pricing terms, branch and brand partner. Always use the terms shown for your booking as the final source.',
    supportTitle: 'Need help with a specific booking?',
    supportIntro:
      'Include your booking reference so support can check the terms and current order status.',
    supportCards: [
      {
        title: 'Start a booking',
        description: 'Compare current vehicles, protection packages, additional equipment and services.',
        cta: 'Find a vehicle',
        target: 'rent',
      },
      {
        title: 'Manage a booking',
        description: 'Review an existing booking and the actions currently available.',
        cta: 'Manage booking',
        target: 'manage',
      },
      {
        title: 'Rental in progress',
        description: 'Contact support promptly for an accident, breakdown, key or tyre issue.',
        cta: 'Contact support',
        target: 'support',
      },
    ],
    linkLabels: sharedLinkLabels.en,
  },
  zh: {
    metaTitle: '租車幫助中心 | TrustGo',
    metaDescription: '查閱駕駛證件、預訂、車輛、保障、付款、取還車與道路救援的清晰說明。',
    eyebrow: 'TrustGo 幫助中心',
    title: '租車每一步，都有清晰答案',
    intro: '了解預訂前須準備的資料、不同報價條件包含的項目，以及租期內遇到問題時的處理方式。',
    browseTitle: '瀏覽幫助主題',
    browseIntro: '按目前所在的租車環節查看相關答案。',
    questionCountLabel: '個問題',
    viewTopic: '查看主題',
    backToHelp: '返回幫助中心',
    allTopics: '全部幫助主題',
    onThisPage: '本頁內容',
    relatedActions: '相關操作',
    relatedTopics: '相關主題',
    bookingTermsTitle: '以你的預訂條款為準',
    bookingTermsBody:
      '供應、價格、限額與保障條件可能因不同報價條件、門店及品牌合作方而異；最終請以該筆預訂顯示的條款為準。',
    supportTitle: '需要處理特定預訂？',
    supportIntro: '聯絡客服時請提供預訂編號，以便核對條款與當前訂單狀態。',
    supportCards: [
      {
        title: '開始預訂',
        description: '一站式比較車輛、保障方案與附加設備及服務。',
        cta: '搜尋車輛',
        target: 'rent',
      },
      {
        title: '管理預訂',
        description: '查看現有預訂及當前可用操作。',
        cta: '管理訂單',
        target: 'manage',
      },
      {
        title: '租期內支援',
        description: '事故、故障、車匙或輪胎問題請及時聯絡客服。',
        cta: '聯絡客服',
        target: 'support',
      },
    ],
    linkLabels: sharedLinkLabels.zh,
  },
  ja: {
    metaTitle: 'レンタカーヘルプセンター | TrustGo',
    metaDescription: '運転書類、予約、車両、補償、支払い、受け取り、返却、ロードサービスを確認できます。',
    eyebrow: 'TrustGo ヘルプセンター',
    title: 'レンタルの各場面に、分かりやすい答えを',
    intro: '予約前の準備、各プラン・見積条件に含まれる内容、利用中のトラブル対応を確認できます。',
    browseTitle: 'ヘルプトピック',
    browseIntro: '確認したいレンタルの場面を選んでください。',
    questionCountLabel: '件',
    viewTopic: 'トピックを見る',
    backToHelp: 'ヘルプセンターへ戻る',
    allTopics: 'すべてのトピック',
    onThisPage: 'このページの内容',
    relatedActions: '関連操作',
    relatedTopics: '関連トピック',
    bookingTermsTitle: '予約条件が優先されます',
    bookingTermsBody:
      '在庫、料金、上限、補償条件はプラン条件、店舗、ブランドパートナーで異なります。最終的には予約に表示された条件を確認してください。',
    supportTitle: '特定の予約についてお困りですか？',
    supportIntro: '予約番号を添えて連絡すると、条件と現在の注文状態を確認できます。',
    supportCards: [
      {
        title: '予約を始める',
        description: '車両、補償プラン、追加装備・オプションを一括比較します。',
        cta: '車を探す',
        target: 'rent',
      },
      {
        title: '予約を管理する',
        description: '既存予約と現在利用できる操作を確認します。',
        cta: '予約管理',
        target: 'manage',
      },
      {
        title: '利用中のサポート',
        description: '事故、故障、鍵、タイヤの問題は早めに連絡してください。',
        cta: 'サポートへ連絡',
        target: 'support',
      },
    ],
    linkLabels: sharedLinkLabels.ja,
  },
  es: {
    metaTitle: 'Centro de ayuda de alquiler | TrustGo',
    metaDescription:
      'Consulta documentos, reservas, vehículos, protección, pagos, recogida, devolución y asistencia.',
    eyebrow: 'Centro de ayuda TrustGo',
    title: 'Respuestas claras para cada parte del alquiler',
    intro: 'Revisa qué preparar, qué incluye cada opción de presupuesto y qué hacer durante el alquiler.',
    browseTitle: 'Temas de ayuda',
    browseIntro: 'Elige la parte del alquiler sobre la que necesitas ayuda.',
    questionCountLabel: 'preguntas',
    viewTopic: 'Ver tema',
    backToHelp: 'Volver al Centro de ayuda',
    allTopics: 'Todos los temas',
    onThisPage: 'En esta página',
    relatedActions: 'Acciones relacionadas',
    relatedTopics: 'Temas relacionados',
    bookingTermsTitle: 'Las condiciones de tu reserva tienen prioridad',
    bookingTermsBody:
      'Disponibilidad, precios, límites y protección pueden variar por condiciones de precio, oficina y socio. La fuente final son las condiciones de tu reserva.',
    supportTitle: '¿Necesitas ayuda con una reserva concreta?',
    supportIntro: 'Incluye la referencia para que soporte revise condiciones y estado actual.',
    supportCards: [
      {
        title: 'Empezar una reserva',
        description: 'Compara vehículos, protección y equipamiento adicional en tu búsqueda.',
        cta: 'Buscar vehículo',
        target: 'rent',
      },
      {
        title: 'Gestionar una reserva',
        description: 'Consulta la reserva y las acciones disponibles.',
        cta: 'Gestionar reserva',
        target: 'manage',
      },
      {
        title: 'Alquiler en curso',
        description: 'Contacta pronto por accidente, avería, llave o neumático.',
        cta: 'Contactar soporte',
        target: 'support',
      },
    ],
    linkLabels: sharedLinkLabels.es,
  },
  ko: {
    metaTitle: '렌터카 도움말 센터 | TrustGo',
    metaDescription: '운전 서류, 예약, 차량, 보호, 결제, 픽업, 반납과 긴급출동 안내를 확인하세요.',
    eyebrow: 'TrustGo 도움말 센터',
    title: '렌탈의 모든 과정에 필요한 명확한 답변',
    intro:
      '예약 전 준비 사항, 각 요금제 및 견적 조건별 포함 내용과 대여 중 문제 대응 방법을 확인하세요.',
    browseTitle: '도움말 주제',
    browseIntro: '도움이 필요한 렌탈 단계를 선택하세요.',
    questionCountLabel: '개 질문',
    viewTopic: '주제 보기',
    backToHelp: '도움말 센터로 돌아가기',
    allTopics: '모든 도움말 주제',
    onThisPage: '이 페이지의 내용',
    relatedActions: '관련 작업',
    relatedTopics: '관련 주제',
    bookingTermsTitle: '예약 조건이 우선 적용됩니다',
    bookingTermsBody:
      '재고, 가격, 한도와 보호 조건은 요금 조건, 지점과 브랜드 파트너에 따라 다를 수 있습니다. 최종 기준은 해당 예약에 표시된 조건입니다.',
    supportTitle: '특정 예약에 도움이 필요한가요?',
    supportIntro: '예약 번호를 함께 보내면 조건과 현재 주문 상태를 확인할 수 있습니다.',
    supportCards: [
      {
        title: '예약 시작',
        description: '차량, 보호 패키지와 추가 장비 및 옵션을 한눈에 비교하세요.',
        cta: '차량 검색',
        target: 'rent',
      },
      {
        title: '예약 관리',
        description: '기존 예약과 현재 가능한 작업을 확인하세요.',
        cta: '예약 관리',
        target: 'manage',
      },
      {
        title: '대여 중 지원',
        description: '사고, 고장, 키 또는 타이어 문제는 즉시 문의하세요.',
        cta: '지원팀 문의',
        target: 'support',
      },
    ],
    linkLabels: sharedLinkLabels.ko,
  },
};

const topics: TopicDefinition[] = [
  {
    id: 'making-a-reservation',
    title: text('Making a reservation', '建立預訂', '予約を作成する', 'Hacer una reserva', '예약 만들기'),
    description: text(
      'Choose a vehicle class, equipment and services, then confirm the terms before payment.',
      '選擇車型組、附加設備及服務，付款前確認適用條款。',
      '車両クラス、追加装備・オプションを選び、支払い前に条件を確認します。',
      'Elige categoría, equipamiento y servicios y confirma las condiciones antes de pagar.',
      '차량 등급, 장비와 옵션을 선택하고 결제 전에 조건을 확인하세요.'
    ),
    keywords: {
      en: ['reservation', 'vehicle class', 'equipment', 'child seat'],
      zh: ['預訂', '車型組', '附加設備', '兒童座椅'],
      ja: ['予約', '車両クラス', '追加装備', 'チャイルドシート'],
      es: ['reserva', 'categoría', 'equipamiento', 'silla infantil'],
      ko: ['예약', '차량 등급', '장비', '카시트'],
    },
    questions: makingReservationQuestions,
  },
  {
    id: 'managing-a-reservation',
    title: text('Managing a reservation', '管理預訂', '予約を管理する', 'Gestionar una reserva', '예약 관리'),
    description: text(
      'Review your booking, cancellation and refund guidance when plans change.',
      '查看預訂、取消與退款說明，了解行程變更時的處理方式。',
      '予約の確認、キャンセル・返金と、予定変更時の対応を確認します。',
      'Consulta tu reserva y las reglas de cancelación y reembolso si cambian tus planes.',
      '예약 조회, 취소·환불 및 일정 변경 시 처리 방법을 확인하세요.'
    ),
    keywords: {
      en: ['manage', 'change', 'cancel', 'no-show'],
      zh: ['管理', '變更', '取消', '未取車'],
      ja: ['管理', '変更', 'キャンセル', 'ノーショー'],
      es: ['gestionar', 'cambiar', 'cancelar', 'no presentado'],
      ko: ['관리', '변경', '취소', '노쇼'],
    },
    questions: managingReservationQuestions,
  },
  {
    id: 'driver-requirements',
    title: text('Driver requirements', '駕駛人資格與證件', '運転者の資格と書類', 'Requisitos del conductor', '운전자 요건'),
    description: text(
      'Prepare the original licence, identity documents and driver eligibility for every driver.',
      '為每位駕駛人準備駕照正本、身分文件並確認資格。',
      '全運転者の免許証原本・本人確認書類と利用資格を準備します。',
      'Prepara permisos originales, identificación y requisitos para todos los conductores.',
      '모든 운전자의 면허 원본, 신분 서류와 자격을 준비하세요.'
    ),
    keywords: {
      en: ['licence', 'IDP', 'driver', 'age'],
      zh: ['駕照', '國際駕照', '駕駛人', '年齡'],
      ja: ['免許', '国際運転免許', '運転者', '年齢'],
      es: ['permiso', 'IDP', 'conductor', 'edad'],
      ko: ['면허', '국제운전면허', '운전자', '연령'],
    },
    questions: driverRequirementQuestions,
  },
  {
    id: 'vehicles-and-extras',
    title: text('Vehicles and extras', '車輛與附加設備', '車両と追加装備', 'Vehículos y extras', '차량 및 추가 장비'),
    description: text(
      'Understand vehicle groups, guaranteed models, equipment and special requirements.',
      '了解車型組、保證車型、附加設備及特殊需求。',
      '車両グループ、確約車種、追加装備、特別な要件を確認します。',
      'Consulta grupos de vehículos, modelos garantizados, extras y requisitos especiales.',
      '차량 그룹, 확정 차종, 추가 장비와 특별 요건을 확인하세요.'
    ),
    keywords: {
      en: ['vehicle', 'model', 'equipment', 'winter tyres'],
      zh: ['車輛', '車型', '附加設備', '雪胎'],
      ja: ['車両', '車種', '追加装備', 'スタッドレス'],
      es: ['vehículo', 'modelo', 'extras', 'neumáticos'],
      ko: ['차량', '차종', '추가 장비', '겨울 타이어'],
    },
    questions: vehicleEquipmentQuestions,
  },
  {
    id: 'pricing-payment-and-deposit',
    title: text('Pricing, payment and deposit', '價格、付款與押金', '料金・支払い・デポジット', 'Precios, pagos y depósitos', '가격, 결제 및 보증금'),
    description: text(
      'Understand the quote, payment methods, deposit holds and final charges.',
      '了解報價、付款方式、押金預授權及最終收費。',
      '見積、支払い方法、デポジットの事前承認、最終請求を確認します。',
      'Entiende la oferta, los métodos de pago, la retención del depósito y los cargos finales.',
      '견적, 결제 수단, 보증금 사전 승인과 최종 청구를 확인하세요.'
    ),
    keywords: {
      en: ['price', 'payment', 'deposit', 'card', 'invoice'],
      zh: ['價格', '付款', '押金', '信用卡', '發票'],
      ja: ['料金', '支払い', 'デポジット', 'カード', '請求書'],
      es: ['precio', 'pago', 'depósito', 'tarjeta', 'factura'],
      ko: ['가격', '결제', '보증금', '카드', '청구서'],
    },
    questions: pricingPaymentDepositQuestions,
  },
  {
    id: 'protection-and-liability',
    title: text('Protection and accident liability', '保障與事故責任', '補償と事故責任', 'Protección y responsabilidad', '보장 및 사고 책임'),
    description: text(
      'Compare protection options, deductibles, exclusions and accident obligations.',
      '比較保障方案、自負額、除外責任及事故處理義務。',
      '補償プラン、免責額、除外事項、事故時の義務を確認します。',
      'Compara protección, franquicias, exclusiones y obligaciones tras un accidente.',
      '보장 옵션, 자기부담금, 제외 사항과 사고 의무를 확인하세요.'
    ),
    keywords: {
      en: ['protection', 'CDW', 'NOC', 'ECO', 'claim'],
      zh: ['保障', 'CDW', 'NOC', 'ECO', '理賠'],
      ja: ['補償', 'CDW', 'NOC', 'ECO', '請求'],
      es: ['protección', 'CDW', 'NOC', 'ECO', 'reclamación'],
      ko: ['보장', 'CDW', 'NOC', 'ECO', '청구'],
    },
    questions: protectionQuestions,
  },
  {
    id: 'pickup-and-return',
    title: text('Pickup and return', '取車與還車', '受け取りと返却', 'Recogida y devolución', '픽업 및 반납'),
    description: text(
      'Find the branch, complete vehicle handover and arrange an approved return.',
      '找到門店、完成車輛交接，並按已確認安排還車。',
      '店舗を確認し、車両の引き渡しと承認済みの返却を行います。',
      'Encuentra la oficina, completa la entrega y organiza una devolución aprobada.',
      '지점을 찾고 차량 인수를 완료한 뒤 승인된 방식으로 반납하세요.'
    ),
    keywords: {
      en: ['pickup', 'return', 'branch', 'shuttle', 'one-way'],
      zh: ['取車', '還車', '門店', '接駁', '異地還車'],
      ja: ['受け取り', '返却', '店舗', '送迎', 'ワンウェイ'],
      es: ['recogida', 'devolución', 'oficina', 'traslado', 'one-way'],
      ko: ['픽업', '반납', '지점', '셔틀', '편도'],
    },
    questions: pickupQuestions,
  },
  {
    id: 'fuel-mileage-and-travel',
    title: text('Fuel, mileage and travel rules', '燃油、里程與行程規則', '燃料・走行距離・走行ルール', 'Combustible, kilometraje y viaje', '연료, 주행거리 및 운행 규정'),
    description: text(
      'Check fuel, mileage, toll and cross-border rules before and during the trip.',
      '在出發前及行程中確認燃油、里程、通行費與跨境規則。',
      '出発前と利用中に燃料、走行距離、通行料、越境条件を確認します。',
      'Consulta combustible, kilometraje, peajes y reglas transfronterizas.',
      '출발 전과 운행 중 연료, 주행거리, 통행료와 국경 이동 규정을 확인하세요.'
    ),
    keywords: {
      en: ['fuel', 'mileage', 'toll', 'cross-border', 'wrong fuel'],
      zh: ['燃油', '里程', '通行費', '跨境', '加錯油'],
      ja: ['燃料', '走行距離', '通行料', '越境', '誤給油'],
      es: ['combustible', 'kilometraje', 'peaje', 'frontera'],
      ko: ['연료', '주행거리', '통행료', '국경', '오주유'],
    },
    questions: fuelMileageQuestions,
  },
  {
    id: 'during-your-rental',
    title: text('In-rental support and after-return issues', '租期中支援與還車後處理', '利用中のサポートと返却後の対応', 'Asistencia y gestiones tras la devolución', '대여 중 지원 및 반납 후 처리'),
    description: text(
      'Get urgent help during the rental and resolve invoices or disputes after return.',
      '取得租期中的緊急支援，並處理還車後帳單或爭議。',
      '利用中の緊急支援と、返却後の請求・異議申立てを確認します。',
      'Obtén ayuda urgente y resuelve facturas o disputas tras la devolución.',
      '대여 중 긴급 지원을 받고 반납 후 청구나 분쟁을 처리하세요.'
    ),
    keywords: {
      en: ['accident', 'breakdown', 'key', 'roadside', 'dispute'],
      zh: ['事故', '故障', '車匙', '道路救援', '爭議'],
      ja: ['事故', '故障', '鍵', 'ロードサービス', '異議'],
      es: ['accidente', 'avería', 'llave', 'asistencia', 'disputa'],
      ko: ['사고', '고장', '키', '긴급출동', '분쟁'],
    },
    questions: duringYourRentalQuestions,
  },
];

function buildTopic(definition: TopicDefinition, lang: RouteLanguage): HelpFaqTopic {
  return {
    id: definition.id,
    title: definition.title[lang],
    shortTitle: definition.title[lang],
    description: definition.description[lang],
    keywords: definition.keywords[lang],
    questions: localizeQuestions(definition.questions, lang),
  };
}

function buildFaq(lang: RouteLanguage): LocalizedHelpFaq {
  return {
    copy: pageCopy[lang],
    topics: Object.fromEntries(topics.map((topic) => [topic.id, buildTopic(topic, lang)])) as Record<
      HelpFaqTopicId,
      HelpFaqTopic
    >,
  };
}

export const helpFaq = Object.fromEntries(
  routeLanguages.map((lang) => [lang, buildFaq(lang)])
) as Record<RouteLanguage, LocalizedHelpFaq>;

export function getHelpFaq(lang: RouteLanguage) {
  return helpFaq[lang] ?? helpFaq.en;
}

export function getHelpFaqTopic(lang: RouteLanguage, topic: HelpFaqTopicId) {
  return getHelpFaq(lang).topics[topic];
}

export function isHelpFaqTopic(value: string): value is HelpFaqTopicId {
  return (helpFaqTopicIds as readonly string[]).includes(value);
}

export function getHelpFaqTopicList(lang: RouteLanguage) {
  const faq = getHelpFaq(lang);
  return helpFaqTopicIds.map((id) => faq.topics[id]);
}
