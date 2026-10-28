import type {RouteLanguage} from '@/i18n/locales';

type LocaleText = Record<RouteLanguage, string>;

type PetTravelSectionDefinition = {
  id: string;
  title: LocaleText;
  body: LocaleText[];
  bullets?: LocaleText[];
};

export type PetTravelSection = {
  id: string;
  title: string;
  body: string[];
  bullets: string[];
};

export type PetTravelGuide = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  helpCenter: string;
  backToHelp: string;
  beforeBookingTitle: string;
  beforeBookingBody: string;
  beforeBookingSteps: string[];
  termsTitle: string;
  termsBody: string;
  faqLabel: string;
  sourceLabel: string;
  sourceName: string;
  sourceNote: string;
  sections: PetTravelSection[];
};

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});

const sectionDefinitions: PetTravelSectionDefinition[] = [
  {
    id: 'advance-reservation',
    title: text('Reserve pet travel in advance', '請提前預訂寵物同行', 'ペット同乗は事前に予約', 'Reserva el viaje con mascota con antelación', '반려동물 동승은 미리 예약'),
    body: [
      text(
        'A pet cannot simply be brought to the counter without prior notice. Add the pet requirement during booking. If the online booking flow does not provide a pet option, contact the pickup location after booking and obtain confirmation before travel.',
        '不能在沒有事先申報的情況下直接帶寵物到門店。請在預訂時加入攜帶寵物的要求；如線上預訂流程沒有寵物選項，完成預訂後請聯絡取車門店，並在出發前取得確認。',
        '事前の申告なしにペットを連れて来店することはできません。予約時にペット同乗を申告してください。オンライン予約にペット項目がない場合は、予約後に受け取り店舗へ連絡し、利用前に確認を得てください。',
        'No lleves una mascota al mostrador sin avisar. Indica la necesidad durante la reserva. Si el proceso online no ofrece una opción para mascotas, contacta con la oficina de recogida después de reservar y obtén confirmación antes del viaje.',
        '사전 고지 없이 반려동물을 데리고 카운터에 오지 마세요. 예약할 때 반려동물 동승을 요청하세요. 온라인 예약에 반려동물 옵션이 없으면 예약 후 픽업 지점에 연락해 이용 전에 확인을 받으세요.',
      ),
      text(
        'Without an approved pet requirement, the vehicle may not be released. Availability is subject to the location, vehicle class and the terms shown for your booking.',
        '如未獲門店確認寵物要求，車輛可能無法交付。供應取決於門店、車型組及該筆預訂顯示的條款。',
        'ペット同乗の確認がない場合、車両を引き渡せないことがあります。利用可否は店舗、車両クラス、予約に表示される条件によります。',
        'Sin una solicitud de mascota aprobada, es posible que no se entregue el vehículo. La disponibilidad depende de la oficina, la categoría y las condiciones de la reserva.',
        '반려동물 동승이 승인되지 않으면 차량을 인도받지 못할 수 있습니다. 이용 가능 여부는 지점, 차량 등급과 예약 조건에 따릅니다.',
      ),
    ],
  },
  {
    id: 'pet-and-carrier',
    title: text('Pet and carrier requirements', '寵物及運輸籠要求', 'ペットとケージの条件', 'Requisitos de mascota y transportín', '반려동물과 이동장 요건'),
    body: [
      text('The standard reference allows dogs and cats up to 10 kg in a carrier measuring approximately 70 cm × 90 cm × 75 cm. Bring the carrier yourself unless your Quote expressly includes one.', '一般參考標準為體重不超過 10 公斤的狗或貓，使用約 70 cm × 90 cm × 75 cm 的運輸籠。除非 Quote 明確包括運輸籠，否則請自行準備。', '一般的な参考基準は、体重10kg以下の犬・猫を、約70cm×90cm×75cmのケージに入れることです。見積にケージが明記されていない限り、ご自身で用意してください。', 'La referencia estándar permite perros y gatos de hasta 10 kg en un transportín de aproximadamente 70 × 90 × 75 cm. Aporta el transportín salvo que la oferta indique expresamente que está incluido.', '일반 참고 기준은 최대 10kg의 개와 고양이를 약 70cm × 90cm × 75cm 이동장에 넣는 것입니다. 견적에 이동장이 명시적으로 포함되지 않았다면 직접 준비하세요.'),
    ],
    bullets: [
      text('The dimensions are approximate and may not fit every vehicle type, especially commercial vehicles. Confirm suitability with the pickup location.', '尺寸僅供參考，未必適用於所有車型，尤其是商用車；請向取車門店確認是否合適。', '寸法は目安で、特に商用車など一部車両には適合しない場合があります。受け取り店舗へ確認してください。', 'Las medidas son aproximadas y pueden no servir para todos los vehículos, especialmente comerciales. Confirma con la oficina.', '치수는 대략적인 기준이며 특히 상용차 등 일부 차량에는 맞지 않을 수 있습니다. 픽업 지점에 확인하세요.'),
      text('A small animal other than a dog or cat requires separate confirmation before booking.', '狗或貓以外的小型動物，須在預訂前另行確認。', '犬・猫以外の小動物は、予約前に別途確認が必要です。', 'Los animales pequeños distintos de perros y gatos requieren confirmación antes de reservar.', '개와 고양이 외 소형 동물은 예약 전에 별도 확인이 필요합니다.'),
      text('Use a soft- or hard-sided carrier that keeps the pet fully inside. Do not allow the pet to move freely in the vehicle.', '可使用軟式或硬式運輸籠，但寵物必須全程留在籠內；不得讓寵物在車內自由走動。', 'ソフト・ハードどちらのケージでも構いませんが、ペットの体が外に出ないものを使用してください。車内で自由に動かしてはいけません。', 'Puede ser un transportín blando o rígido, pero la mascota debe permanecer dentro. No la dejes suelta en el vehículo.', '소프트 또는 하드 이동장을 사용할 수 있지만 반려동물은 항상 안에 있어야 합니다. 차량 안에서 자유롭게 움직이게 하지 마세요.'),
    ],
  },
  {
    id: 'where-pet-rides',
    title: text('Where the pet rides', '寵物在車內的位置', 'ペットを乗せる場所', 'Dónde viaja la mascota', '반려동물 탑승 위치'),
    body: [
      text('Place the carrier in the luggage space or on the rear floor, using the protective sheet provided or required by the location. Pets must remain inside the carrier throughout the rental.', '請將運輸籠放在行李空間或後排地板，並使用門店提供或要求的防護墊。租期內寵物必須全程留在運輸籠內。', 'ケージは荷室または後部床面に置き、店舗が用意・指定する保護シートを使用してください。利用中、ペットは常にケージ内に入れてください。', 'Coloca el transportín en el espacio de equipaje o en el suelo trasero usando la funda protectora indicada por la oficina. La mascota debe permanecer dentro durante todo el alquiler.', '이동장은 트렁크 공간 또는 뒷좌석 바닥에 지점에서 제공하거나 지정한 보호 시트를 사용해 놓으세요. 대여 기간 내내 반려동물은 이동장 안에 있어야 합니다.'),
    ],
    bullets: [
      text('Do not place a pet directly on a seat or let it move around the cabin.', '不得讓寵物直接在座椅上，也不得在車廂內自由活動。', 'ペットを座席に直接置いたり、車内で自由に動かしたりしないでください。', 'No coloques la mascota directamente en un asiento ni la dejes suelta.', '반려동물을 좌석에 직접 두거나 실내에서 자유롭게 움직이게 하지 마세요.'),
    ],
  },
  {
    id: 'vehicle-and-location-limits',
    title: text('Vehicle and location limits', '車型及門店限制', '車両・店舗の制限', 'Límites de vehículos y oficinas', '차량 및 지점 제한'),
    body: [
      text('Pet-friendly vehicles are limited to classes and locations with enough passenger or luggage space. A pet request does not guarantee that every vehicle in a class or every branch can accept the pet.', '可攜寵物車輛僅限於有足夠乘客或行李空間的車型組及門店。提出寵物要求不代表該車型組的所有車輛或所有門店都能接受寵物。', 'ペット同乗可能な車両は、乗員・荷室に十分な空間がある車両クラスと店舗に限られます。申告しただけで、クラス内の全車両・全店舗が対応するとは限りません。', 'Los vehículos aptos para mascotas se limitan a categorías y oficinas con espacio suficiente. Solicitarlo no garantiza que todos los vehículos o sucursales lo admitan.', '반려동물 동승 차량은 승객 또는 수하물 공간이 충분한 등급과 지점으로 제한됩니다. 요청했다고 해서 해당 등급의 모든 차량이나 모든 지점에서 허용되는 것은 아닙니다.'),
      text('Confirm the vehicle class, carrier fit, pickup location and any required equipment before travel. The Quote and booking terms are the final source for your reservation.', '出發前請確認車型組、運輸籠尺寸是否合適、取車門店及所需裝備。Quote 及預訂條款是該筆預訂的最終依據。', '利用前に車両クラス、ケージの適合、受け取り店舗、必要な装備を確認してください。見積と予約条件が最終的な基準です。', 'Antes del viaje, confirma la categoría, el tamaño del transportín, la oficina y el equipamiento requerido. La oferta y las condiciones son la referencia final.', '이용 전에 차량 등급, 이동장 적합 여부, 픽업 지점과 필요한 장비를 확인하세요. 견적과 예약 조건이 최종 기준입니다.'),
    ],
  },
  {
    id: 'fees-and-cleaning',
    title: text('Fees, cleaning and damage', '費用、清潔及損壞', '料金・清掃・損傷', 'Cargos, limpieza y daños', '요금, 청소 및 손상'),
    body: [
      text('A pet-related Extra, cleaning or deodorisation charge, and compensation for damage or business interruption may apply when shown in the Quote, booking terms or branch rules. Do not assume a fixed amount until it is displayed or confirmed.', '如 Quote、預訂條款或門店規則列明，可能收取寵物 Extra、清潔或除味費，以及損壞或影響營業的補償費。未有顯示或確認前，請勿假設固定金額。', '見積、予約条件、店舗規則に記載される場合、ペットExtra、清掃・消臭費、損傷や営業補償が発生することがあります。表示・確認前に固定額を想定しないでください。', 'Pueden aplicarse Extras, limpieza, desodorización o compensación por daños o interrupción del negocio si figuran en la oferta, condiciones o reglas de la oficina. No presupongas un importe fijo sin confirmación.', '견적, 예약 조건 또는 지점 규정에 표시된 경우 반려동물 Extra, 청소·탈취 비용과 손상 또는 영업 중단 보상금이 부과될 수 있습니다. 표시나 확인 전에는 고정 금액을 가정하지 마세요.'),
      text('Keep the carrier and protective sheet clean, and report any issue to the location. Additional charges are handled according to the applicable booking terms.', '請保持運輸籠及防護墊清潔，如有問題請通知門店。任何額外費用按適用的預訂條款處理。', 'ケージと保護シートを清潔に保ち、問題があれば店舗へ連絡してください。追加料金は適用される予約条件に従います。', 'Mantén limpio el transportín y la funda protectora, e informa a la oficina de cualquier problema. Los cargos se gestionan según las condiciones aplicables.', '이동장과 보호 시트를 깨끗하게 유지하고 문제가 있으면 지점에 알리세요. 추가 요금은 적용되는 예약 조건에 따라 처리됩니다.'),
    ],
  },
  {
    id: 'assistance-animals',
    title: text('Assistance animals', '輔助動物', '補助犬・介助動物', 'Animales de asistencia', '보조 동물'),
    body: [
      text('Assistance animals, including service dogs, may be subject to different requirements from ordinary pet travel. Contact the pickup location before booking so the applicable accommodation and documents can be confirmed.', '包括服務犬在內的輔助動物，可能適用不同於一般寵物同行的要求。請在預訂前聯絡取車門店，以確認適用安排及所需文件。', '盲導犬・介助犬などの補助動物は、通常のペット同乗と異なる条件が適用される場合があります。予約前に受け取り店舗へ連絡し、対応と必要書類を確認してください。', 'Los animales de asistencia, incluidos los perros de servicio, pueden tener requisitos distintos. Contacta con la oficina antes de reservar para confirmar las adaptaciones y documentos aplicables.', '안내견을 포함한 보조 동물은 일반 반려동물 동승과 다른 요건이 적용될 수 있습니다. 예약 전에 픽업 지점에 연락해 필요한 지원과 서류를 확인하세요.'),
    ],
  },
];

const pageCopy: Record<RouteLanguage, Omit<PetTravelGuide, 'sections'>> = {
  en: {
    metaTitle: 'Pet-friendly car rental guide | TrustGo',
    metaDescription: 'Check advance booking, carrier, vehicle, location, cleaning and assistance-animal requirements for travelling with a pet in an TrustGo vehicle.',
    eyebrow: 'Vehicle and Extra reference',
    title: 'Travelling with a pet',
    intro: 'Pet travel must be declared and approved in advance during booking. Use this official fleet guide to prepare a compliant carrier, select an eligible vehicle class, and verify travel requirements with your pickup branch.',
    helpCenter: 'Help Center',
    backToHelp: 'Back to Help Center',
    beforeBookingTitle: 'Before you book',
    beforeBookingBody: 'Pet travel must be approved in advance. Follow these steps so the location can check the vehicle, space and applicable terms.',
    beforeBookingSteps: [
      'Select or request pet travel during booking.',
      'If no pet option is shown online, contact the pickup location after booking.',
      'Confirm the accepted vehicle class, carrier fit, equipment and any Extra or cleaning conditions before travel.',
    ],
    termsTitle: 'Your Quote and branch terms take priority',
    termsBody: 'The rules below are a practical reference. Availability, equipment, fees and exceptions can vary by vehicle, location and booking channel. The Quote and booking confirmation are the final record for your rental.',
    faqLabel: 'Read the related FAQ',
    sourceLabel: 'Pet-Friendly Policy',
    sourceName: 'TrustGo Official Pet Travel Standards',
    sourceNote: 'TrustGo provides pet-friendly vehicle options subject to advance branch confirmation and carrier hygiene requirements. Your Quote and booking confirmation serve as the final binding agreement.',
  },
  zh: {
    metaTitle: '租車攜帶寵物指南 | TrustGo',
    metaDescription: '了解 TrustGo 車輛攜帶寵物的提前預訂、運輸籠、車型、門店、清潔及輔助動物要求。',
    eyebrow: '車輛及 Extra 參考資料',
    title: '攜帶寵物租車指南',
    intro: '攜帶寵物出行須在預訂時提前確認，恕無法在取車當天臨時追加。請依本指南準備合規運輸籠、挑選合適車型，並於出發前向取車門店核對承接條件。',
    helpCenter: '幫助中心',
    backToHelp: '返回幫助中心',
    beforeBookingTitle: '預訂前須知',
    beforeBookingBody: '攜帶寵物須提前取得確認，讓門店核對車輛、空間及適用條款。',
    beforeBookingSteps: [
      '在預訂時選擇或申報攜帶寵物。',
      '如線上沒有寵物選項，完成預訂後聯絡取車門店。',
      '出發前確認可接受的車型組、運輸籠尺寸、所需裝備，以及任何 Extra 或清潔條件。',
    ],
    termsTitle: '請以 Quote 及門店條款為準',
    termsBody: '以下內容是實務參考。供應、裝備、費用及例外情況可能因車輛、門店及預訂渠道而異；Quote 及預訂確認是該筆租車的最終記錄。',
    faqLabel: '查看相關 FAQ',
    sourceLabel: '寵物同行規範',
    sourceName: 'TrustGo 官方寵物乘車服務標準',
    sourceNote: 'TrustGo 提供寵物同行用車方案，須遵守提前申報、合規籠具及車內防護規定。實際預訂請以您的 Quote 報價單及預訂確認條款為準。',
  },
  ja: {
    metaTitle: 'レンタカーのペット同乗ガイド | TrustGo',
    metaDescription: 'TrustGoでペットと旅行する際の事前予約、ケージ、車両・店舗、清掃、補助動物の条件を確認できます。',
    eyebrow: '車両・追加オプション参考資料',
    title: 'ペットと一緒にレンタカーを利用する場合',
    intro: 'ペットの同乗は予約時の事前申告と店舗確認が必須です。当日の追加は承れません。本ガイドに沿って規定ケージを準備し、対象車種をご確認ください。',
    helpCenter: 'ヘルプセンター',
    backToHelp: 'ヘルプセンターへ戻る',
    beforeBookingTitle: '予約前に確認すること',
    beforeBookingBody: '店舗が車両、スペース、適用条件を確認できるよう、ペット同乗は事前に承認を得てください。',
    beforeBookingSteps: [
      '予約時にペット同乗を選択または申告する。',
      'オンラインに項目がない場合は、予約後に受け取り店舗へ連絡する。',
      '利用前に対象クラス、ケージの適合、装備、追加料金・清掃条件を確認する。',
    ],
    termsTitle: '見積と店舗条件が優先されます',
    termsBody: '以下は実務上の参考です。利用可否、装備、料金、例外は車両、店舗、予約チャネルにより異なります。見積と予約確認が最終記録です。',
    faqLabel: '関連FAQを見る',
    sourceLabel: 'ペット同乗基準',
    sourceName: 'TrustGo 公式ペット同乗サービス基準',
    sourceNote: 'TrustGoはペット同乗対応車両を提供しています（事前申告・指定ケージ・防護シートの使用が必須）。実際の予約条件は見行情及び予約確認書が最終基準となります。',
  },
  es: {
    metaTitle: 'Guía para alquilar un coche con mascota | TrustGo',
    metaDescription: 'Consulta los requisitos de reserva previa, transportín, vehículo, oficina, limpieza y animales de asistencia de TrustGo.',
    eyebrow: 'Referencia de vehículos y Extras',
    title: 'Viajar con una mascota',
    intro: 'El viaje con mascotas debe declararse y confirmarse durante la reserva con antelación. Consulta esta guía oficial para preparar el transportín adecuado y verificar los requisitos de tu oficina de recogida.',
    helpCenter: 'Centro de ayuda',
    backToHelp: 'Volver al Centro de ayuda',
    beforeBookingTitle: 'Antes de reservar',
    beforeBookingBody: 'La oficina debe aprobar el viaje con mascota con antelación para revisar el vehículo, el espacio y las condiciones aplicables.',
    beforeBookingSteps: [
      'Selecciona o solicita el viaje con mascota durante la reserva.',
      'Si no aparece una opción online, contacta con la oficina de recogida después de reservar.',
      'Confirma antes del viaje la categoría, el transportín, el equipamiento y las condiciones de Extra o limpieza.',
    ],
    termsTitle: 'Prevalecen la oferta y las condiciones de la oficina',
    termsBody: 'Lo siguiente es una referencia práctica. La disponibilidad, el equipamiento, los cargos y las excepciones pueden variar. La oferta y la confirmación son el registro final.',
    faqLabel: 'Ver la FAQ relacionada',
    sourceLabel: 'Normativa de mascotas',
    sourceName: 'Estándar oficial de viaje con mascotas de TrustGo',
    sourceNote: 'TrustGo ofrece opciones de vehículos aptos para mascotas sujetas a confirmación previa de la oficina y requisitos de transportín y limpieza.',
  },
  ko: {
    metaTitle: '반려동물 동반 렌터카 가이드 | TrustGo',
    metaDescription: 'TrustGo 차량에 반려동물을 동승할 때 필요한 사전 예약, 이동장, 차량·지점, 청소 및 보조 동물 조건을 확인하세요.',
    eyebrow: '차량 및 Extra 참고 자료',
    title: '반려동물과 함께 렌터카 이용하기',
    intro: '반려동물 동승은 예약 시 사전 신청 및 지점 승인이 필수이며, 픽업 당일 현장 추가는 불가합니다. 본 가이드에 따라 규격 이동장을 준비하고 지점 승인 조건을 확인하세요.',
    helpCenter: '도움말 센터',
    backToHelp: '도움말 센터로 돌아가기',
    beforeBookingTitle: '예약 전 확인',
    beforeBookingBody: '지점에서 차량, 공간과 적용 조건을 확인할 수 있도록 반려동물 동승을 미리 승인받으세요.',
    beforeBookingSteps: [
      '예약할 때 반려동물 동승을 선택하거나 요청합니다.',
      '온라인에 반려동물 옵션이 없으면 예약 후 픽업 지점에 연락합니다.',
      '이용 전에 차량 등급, 이동장 적합 여부, 장비와 Extra·청소 조건을 확인합니다.',
    ],
    termsTitle: '견적과 지점 조건이 우선합니다',
    termsBody: '아래 내용은 실무 참고 자료입니다. 이용 가능 여부, 장비, 요금과 예외는 차량, 지점, 예약 채널에 따라 달라질 수 있습니다. 견적과 예약 확인서가 최종 기록입니다.',
    faqLabel: '관련 FAQ 보기',
    sourceLabel: '반려동물 동승 규정',
    sourceName: 'TrustGo 공식 반려동물 탑승 표준',
    sourceNote: 'TrustGo은 사전 지점 승인 및 규격 이동장 사용을 조건으로 반려동물 동승 가능 차량을 제공합니다. 최종 예약 조건은 견적서와 예약 확인서를 따릅니다.',
  },
};

export function getPetTravelGuide(lang: RouteLanguage): PetTravelGuide {
  return {
    ...pageCopy[lang],
    sections: sectionDefinitions.map((section) => ({
      id: section.id,
      title: section.title[lang],
      body: section.body.map((b) => b[lang]),
      bullets: (section.bullets || []).map((b) => b[lang]),
    })),
  };
}
