import type {HelpFaqQuestionDefinition, HelpFaqLinkTarget, LocaleText} from './types';

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});
const question = (id: string, links: HelpFaqLinkTarget[], prompt: LocaleText, answer: LocaleText): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
});

export const driversAndBookingQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'driver-documents-for-japan',
    ['important'],
    text('Which driving documents are required in Japan?', '在日本租車需要哪些駕駛證件？', '日本で必要な運転書類は何ですか？', '¿Qué documentos de conducción se necesitan en Japón?', '일본에서 어떤 운전 서류가 필요한가요?'),
    text(
      'Every driver must present original, valid documents at pickup. Depending on the issuing country, this means a Japanese driving licence; a 1949 Geneva Convention International Driving Permit with the original domestic licence and passport; or an eligible foreign licence with an official Japanese translation and passport. Copies and digital-only documents are not accepted.',
      '每位駕駛人取車時均須出示有效正本。按駕照簽發地，通常需要日本駕照；或 1949 年《日內瓦道路交通公約》國際駕照連同本國駕照正本與護照；或符合資格的外國駕照連同官方日文譯本與護照。不接受影印本或僅電子版文件。',
      'すべての運転者は受け取り時に有効な原本を提示します。発行国により、日本の免許証、1949年ジュネーブ条約に基づく国際運転免許証と自国免許証・旅券の原本、または対象国の免許証と公的な日本語翻訳・旅券が必要です。コピーやデジタル版のみでは利用できません。',
      'Cada conductor debe presentar documentos originales y vigentes al recoger: permiso japonés; permiso internacional del Convenio de Ginebra de 1949 con permiso nacional y pasaporte; o un permiso extranjero admitido con traducción oficial al japonés y pasaporte. No se aceptan copias ni documentos solo digitales.',
      '모든 운전자는 픽업 시 유효한 원본 서류를 제시해야 합니다. 발급 국가에 따라 일본 운전면허증, 1949년 제네바 협약 국제운전면허증과 자국 면허증·여권 원본, 또는 대상 국가 면허증과 공식 일본어 번역문·여권이 필요합니다. 사본이나 디지털 서류만으로는 이용할 수 없습니다.',
    ),
  ),
  question(
    'driver-eligibility',
    ['rent'],
    text('Are there age or eligibility restrictions for drivers?', '駕駛人是否有年齡或資格限制？', '運転者に年齢や利用資格の制限はありますか？', '¿Hay restricciones de edad o requisitos para los conductores?', '운전자 연령 또는 이용 자격 제한이 있나요?'),
    text(
      'The collected Japan guidance uses 18 as the minimum age, but the actual booking terms and vehicle class apply. A rental may be refused when documents are invalid, a driver is undeclared, the customer appears impaired or another rental-agreement condition is not met.',
      '現有日本指引以 18 歲為最低年齡，但實際仍以預訂條款與車型組限制為準。證件無效、駕駛人未申報、客戶疑似受酒精影響，或不符合其他租賃合約條件時，門店可拒絕出租。',
      '日本向け案内では18歳を最低年齢としていますが、実際の予約条件と車両クラスが適用されます。書類が無効、運転者が未申告、飲酒の疑いがある、その他貸渡条件を満たさない場合は貸し渡しできません。',
      'La guía de Japón indica 18 años como edad mínima, pero se aplican las condiciones de la reserva y categoría. El alquiler puede rechazarse si los documentos no son válidos, el conductor no está declarado, parece estar bajo los efectos del alcohol o incumple otra condición.',
      '일본 안내의 최소 연령은 18세이지만 실제 예약 조건과 차량 등급 제한이 적용됩니다. 서류가 유효하지 않거나 운전자가 등록되지 않았거나 음주가 의심되거나 다른 대여 조건을 충족하지 않으면 대여가 거절될 수 있습니다.',
    ),
  ),
  question(
    'additional-drivers',
    ['manage'],
    text('Can someone other than the person who booked drive?', '預訂人以外的人可以駕駛嗎？', '予約者以外の人も運転できますか？', '¿Puede conducir alguien distinto de quien reservó?', '예약자 외 다른 사람이 운전할 수 있나요?'),
    text(
      'Yes, when the rental terms allow it. Every additional driver must be declared before driving and present the required original licence and identity documents at pickup. An undeclared driver may invalidate protection or breach the rental agreement.',
      '租賃條款允許時可以。每位附加駕駛人都須在駕駛前完成申報，並在取車時出示所需駕照與身分證件正本。未申報駕駛人可能導致保障失效或違反租賃合約。',
      '貸渡条件で認められる場合は可能です。追加運転者も運転前に申告し、受け取り時に必要な免許証と本人確認書類の原本を提示してください。未申告の運転は補償対象外または契約違反となる場合があります。',
      'Sí, si lo permiten las condiciones. Cada conductor adicional debe declararse antes de conducir y presentar los originales exigidos al recoger. Un conductor no declarado puede quedar sin protección o incumplir el contrato.',
      '대여 조건에서 허용하면 가능합니다. 추가 운전자도 운전 전에 등록하고 픽업 시 필요한 면허증과 신분 서류 원본을 제시해야 합니다. 미등록 운전자는 보호가 적용되지 않거나 계약 위반이 될 수 있습니다.',
    ),
  ),
  question(
    'make-view-change-cancel-booking',
    ['rent', 'manage'],
    text('How do I make, view, change or cancel a booking?', '如何建立、查看、變更或取消預訂？', '予約の作成・確認・変更・キャンセル方法は？', '¿Cómo hago, consulto, cambio o cancelo una reserva?', '예약 생성, 조회, 변경 또는 취소는 어떻게 하나요?'),
    text(
      'Book through the TrustGo website, then use Manage Booking for an eligible direct booking. If you booked through a travel agency, another website, phone or email, use the original channel or contact support because it may not be editable online.',
      '可透過 TrustGo 官網預訂；符合條件的官網直接預訂可在「管理訂單」中處理。若預訂來自旅行社、其他網站、電話或電郵，請使用原渠道或聯絡客服，因為該預訂未必可在線修改。',
      'TrustGo公式サイトから予約し、対象となる直接予約は「予約管理」で確認・変更します。旅行会社、他社サイト、電話、メールでの予約はオンライン変更できない場合があるため、元の窓口またはサポートへ連絡してください。',
      'Reserva en la web de TrustGo y usa Gestionar reserva para una reserva directa apta. Si reservaste con una agencia, otra web, teléfono o correo, utiliza el canal original o contacta con soporte.',
      'TrustGo 웹사이트에서 예약한 뒤 대상이 되는 직접 예약은 예약 관리에서 처리하세요. 여행사, 다른 웹사이트, 전화 또는 이메일로 예약한 경우 원래 채널이나 지원팀을 이용하세요.',
    ),
  ),
  question(
    'cancellation-and-no-show',
    ['manage'],
    text('When do cancellation or No-show charges apply?', '何時會收取取消或 No-show 費用？', 'キャンセル料やNo-show料金はいつ発生しますか？', '¿Cuándo se cobran gastos de cancelación o No-show?', '취소 또는 No-show 요금은 언제 발생하나요?'),
    text(
      'The timing, amount and No-show rule come from the terms shown for that booking. Cancel through the original channel and contact the pickup branch before the scheduled time if you will be late; otherwise the vehicle may no longer be held and a charge may apply.',
      '適用時間、金額與 No-show 規則以該筆預訂顯示的條款為準。請透過原渠道取消；若會遲到，須在預定取車時間前聯絡取車門店，否則車輛可能不再保留並可能產生費用。',
      '適用時期、金額、No-show条件は予約に表示された規約を確認してください。遅れる場合は予定時刻前に受け取り店舗へ連絡してください。連絡がない場合、車両を確保できず料金が発生することがあります。',
      'El plazo, importe y regla de No-show dependen de las condiciones de la reserva. Cancela por el canal original y avisa a la oficina antes de la hora prevista si vas a llegar tarde.',
      '적용 시점, 금액과 No-show 규정은 해당 예약 약관을 따릅니다. 원래 채널에서 취소하고 늦을 경우 예정 픽업 시간 전에 지점에 연락하세요.',
    ),
  ),
  question(
    'branch-hours-and-late-pickup',
    ['locations', 'manage'],
    text('Can I pick up or return outside branch hours?', '可以在門店營業時間外取還車嗎？', '営業時間外に受け取り・返却できますか？', '¿Puedo recoger o devolver fuera del horario?', '영업시간 외 픽업·반납이 가능한가요?'),
    text(
      'Standard pickup and return are handled during the branch’s published hours. If you cannot arrive as booked, contact the pickup branch before the scheduled time. A next-day pickup or changed return is not automatic and depends on branch approval, vehicle availability and the booking terms.',
      '一般取還車須在門店公示營業時間內辦理。若不能按時到達，請在預定時間前聯絡取車門店。翌日取車或更改還車安排不會自動成立，須視門店確認、車輛供應與預訂條款而定。',
      '通常の受け取り・返却は店舗の公示営業時間内に行います。予定どおり到着できない場合は予定時刻前に店舗へ連絡してください。翌日受け取りや返却変更は、店舗承認、在庫、予約条件によります。',
      'La recogida y devolución normal se realiza dentro del horario publicado. Si no puedes llegar a tiempo, avisa antes. Recoger al día siguiente o cambiar la devolución depende de aprobación, disponibilidad y condiciones.',
      '일반 픽업과 반납은 공지된 영업시간 내에 진행합니다. 예정대로 도착할 수 없으면 예정 시간 전에 지점에 연락하세요. 다음 날 픽업이나 반납 변경은 지점 승인, 재고와 예약 조건에 따라 달라집니다.',
    ),
  ),
  question(
    'nearest-branch-and-shuttle',
    ['locations'],
    text('How do I find a branch, and is an airport shuttle available?', '如何找到門店？機場是否有接駁服務？', '店舗はどう探しますか？空港送迎はありますか？', '¿Cómo encuentro una oficina y hay traslado de aeropuerto?', '지점은 어떻게 찾고 공항 셔틀이 있나요?'),
    text(
      'Use the Locations page for the address, opening hours and pickup instructions. Airport shuttles are available only at selected locations; follow the instructions for the exact branch in your booking.',
      '請在「服務門店」頁查看地址、營業時間與取車指引。機場接駁只在部分門店提供，請以預訂中指定門店的指引為準。',
      '「店舗」ページで住所、営業時間、受け取り案内を確認してください。空港送迎は一部店舗のみのため、予約に記載された店舗の案内に従ってください。',
      'Consulta Oficinas para ver dirección, horario e instrucciones. El traslado de aeropuerto solo existe en algunas oficinas; sigue la información de la oficina de tu reserva.',
      '지점 페이지에서 주소, 영업시간과 픽업 안내를 확인하세요. 공항 셔틀은 일부 지점에서만 제공되므로 예약에 지정된 지점 안내를 따르세요.',
    ),
  ),
];

export const vehiclesAndExtrasQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'vehicle-model-and-transmission',
    ['rent'],
    text('Can I choose a specific model, colour or transmission?', '可以指定車款、顏色或變速箱嗎？', '車種、色、トランスミッションを指定できますか？', '¿Puedo elegir modelo, color o transmisión?', '특정 모델, 색상 또는 변속기를 선택할 수 있나요?'),
    text(
      'A booking normally confirms a vehicle class, not a specific model, brand or colour. Passenger cars and minivans are generally automatic in the collected Japan guidance, while some commercial vehicles may be manual. Check the vehicle specifications and offer details when a feature is essential.',
      '預訂一般確認車型組，而非特定車款、品牌或顏色。現有日本指引中的乘用車與小型客貨車通常為自動變速，部分商用車可能為手動變速。如某項配置不可缺少，請核對報價與車輛配置詳情。',
      '予約で確約されるのは通常車両クラスで、特定の車種、ブランド、色ではありません。日本向け案内では乗用車とミニバンは原則ATですが、一部商用車はMTの場合があります。必須装備はプラン・見積詳細で確認してください。',
      'La reserva suele confirmar una categoría, no un modelo, marca o color. En la guía de Japón, turismos y monovolúmenes suelen ser automáticos, mientras algunos comerciales pueden ser manuales. Revisa el desglose de la oferta si una característica es imprescindible.',
      '예약은 일반적으로 특정 모델, 브랜드나 색상이 아닌 차량 등급을 확정합니다. 일본 안내에서 승용차와 미니밴은 대체로 자동이지만 일부 상용차는 수동일 수 있습니다. 필수 사양은 견적 및 차량 세부 정보에서 확인하세요.',
    ),
  ),
  question(
    'winter-equipment',
    ['rent', 'support'],
    text('How do I request winter tyres or 4WD?', '如何申請雪胎或四輪驅動？', 'スタッドレスタイヤや4WDはどう予約しますか？', '¿Cómo solicito neumáticos de invierno o 4x4?', '겨울 타이어나 4WD는 어떻게 요청하나요?'),
    text(
      'Add available winter tyres or 4WD while booking and confirm them before pickup. Availability, price and whether winter tyres are standard depend on the branch, season, route and vehicle class. Snow chains and ski racks are not guaranteed.',
      '預訂時選擇可提供的雪胎或四輪驅動，並在取車前確認。供應、價格及雪胎是否為標準配置，取決於門店、季節、行程與車型組。雪鏈與滑雪架不保證提供。',
      '予約時に選択可能なスタッドレスタイヤや4WDを追加し、受け取り前に確定してください。在庫、料金、標準装備かどうかは店舗、季節、経路、車両クラスで異なります。チェーンやスキーキャリアは保証されません。',
      'Añade neumáticos de invierno o 4x4 durante la reserva y confírmalos antes de recoger. Disponibilidad, precio y equipamiento estándar dependen de oficina, temporada, ruta y categoría. No se garantizan cadenas ni portaesquís.',
      '예약할 때 겨울 타이어나 4WD를 추가하고 픽업 전에 확정하세요. 재고, 가격과 기본 장착 여부는 지점, 계절, 경로와 차량 등급에 따라 다릅니다. 스노 체인과 스키 랙은 보장되지 않습니다.',
    ),
  ),
  question(
    'child-seat',
    ['rent'],
    text('When is a child seat required, and how do I reserve one?', '何時必須使用兒童安全座椅？如何預訂？', 'チャイルドシートはいつ必要で、どう予約しますか？', '¿Cuándo se necesita silla infantil y cómo la reservo?', '어린이 카시트는 언제 필요하며 어떻게 예약하나요?'),
    text(
      'Japanese law requires an appropriate child seat for children under six. Add the correct type during booking and confirm availability before pickup. The driver is responsible for choosing and fitting a suitable seat.',
      '日本法規定未滿 6 歲兒童須使用合適的兒童安全座椅。請在預訂時加入正確類型，並於取車前確認供應。駕駛人有責任選擇及安裝合適座椅。',
      '日本では6歳未満の子どもに適切なチャイルドシートが必要です。予約時に合う種類を追加し、受け取り前に在庫を確認してください。座席の選択と取り付けは運転者の責任です。',
      'La ley japonesa exige una silla adecuada para menores de seis años. Añade el tipo correcto al reservar y confirma disponibilidad. El conductor es responsable de elegirla e instalarla.',
      '일본 법은 6세 미만 어린이에게 적합한 카시트를 요구합니다. 예약할 때 맞는 유형을 추가하고 픽업 전에 재고를 확인하세요. 적합한 좌석 선택과 설치는 운전자 책임입니다.',
    ),
  ),
  question(
    'navigation-connectivity',
    ['rent', 'support'],
    text('Can I add GPS navigation and phone connectivity?', '可以選配 GPS 導航及手機連接嗎？', 'GPSナビとスマートフォン接続を追加できますか？', '¿Puedo añadir GPS y conexión móvil?', 'GPS 내비게이션과 휴대전화 연결을 추가할 수 있나요?'),
    text(
      'GPS is an optional Extra when shown for the selected Quote. Availability, price, interface language and support for Bluetooth, USB, AUX, Apple CarPlay or Android Auto depend on the supplied equipment. Select GPS while booking and rely on the confirmed Quote.',
      'GPS 是所選報價顯示時才可選配的 Extra。供應、價格、介面語言，以及藍牙、USB、AUX、Apple CarPlay 或 Android Auto 支援情況取決於實際設備。請在預訂時選配，並以已確認報價為準。',
      'GPSは選択した見積に表示される場合のみ追加できるオプションです。在庫、料金、表示言語、Bluetooth、USB、AUX、Apple CarPlay、Android Auto対応は提供機器により異なります。予約時に選択し、確定した見積を確認してください。',
      'El GPS es un Extra opcional cuando aparece en la oferta. Disponibilidad, precio, idioma y compatibilidad con Bluetooth, USB, AUX, Apple CarPlay o Android Auto dependen del equipo. Selecciónalo al reservar y toma como válida la oferta confirmada.',
      'GPS는 선택한 견적에 표시될 때 추가할 수 있는 선택 Extra입니다. 재고, 가격, 화면 언어와 Bluetooth, USB, AUX, Apple CarPlay 또는 Android Auto 지원 여부는 실제 장비에 따라 다릅니다. 예약 시 선택하고 확정 견적을 기준으로 하세요.',
    ),
  ),
  question(
    'special-vehicle-requirements',
    ['rent', 'support'],
    text('How do I request a non-smoking, pet-friendly or accessible vehicle?', '如何申請禁煙、可攜寵物或無障礙車輛？', '禁煙車、ペット同乗、福祉車両はどう確認しますか？', '¿Cómo solicito un vehículo sin humo, para mascotas o accesible?', '금연, 반려동물 또는 접근성 차량은 어떻게 요청하나요?'),
    text(
      'All TrustGo vehicles are non-smoking. Pet conditions still depend on the booking terms, and wheelchair-accessible vehicles or elevating seats require support confirmation before booking.',
      'TrustGo 所有車輛均為禁煙車。攜帶寵物仍須按預訂條款處理；輪椅無障礙車輛或升降座椅須在預訂前由客服確認。',
      'TrustGoの車両はすべて禁煙です。ペット同乗は予約条件に従い、車いす対応車や昇降シートは予約前にサポートの確認が必要です。',
      'Todos los vehículos de TrustGo son para no fumadores. Las mascotas dependen de las condiciones, y los vehículos accesibles o asientos elevadores requieren confirmación antes de reservar.',
      'TrustGo의 모든 차량은 금연 차량입니다. 반려동물 동승은 예약 조건을 따르며 휠체어 접근 차량이나 승강 시트는 예약 전에 지원팀 확인이 필요합니다.',
    ),
  ),
  question(
    'one-way-rental',
    ['rent', 'locations'],
    text('Can I return the vehicle to a different branch?', '可以在不同門店還車嗎？', '異なる店舗へ返却できますか？', '¿Puedo devolver el vehículo en otra oficina?', '다른 지점에 반납할 수 있나요?'),
    text(
      'A one-way return is available only when the vehicle, pickup branch, return branch and route are eligible. A fee or seasonal equipment condition may apply. Select the intended return location during search and rely on the confirmed booking offer.',
      '只有在車輛、取車門店、還車門店及行程均符合條件時，才可異地還車；可能另收費用或有季節性裝備要求。搜尋時請選擇預定還車地點，並以已確認的報價與訂單條件為準。',
      'ワンウェイ返却は、車両、出発店舗、返却店舗、経路が対象の場合のみ利用できます。料金や季節装備条件が付く場合があります。検索時に返却店舗を指定し、確定したプラン条件を確認してください。',
      'Solo está disponible si vehículo, oficinas y ruta son aptos. Puede haber cargo o requisitos estacionales. Indica el destino al buscar y toma como válida la confirmación de la reserva.',
      '편도 반납은 차량, 픽업 지점, 반납 지점과 경로가 모두 대상일 때만 가능합니다. 수수료나 계절 장비 조건이 적용될 수 있습니다. 검색할 때 반납 지점을 선택하고 확정된 예약 조건을 기준으로 하세요.',
    ),
  ),
  question(
    'etc-and-expressway-pass',
    ['support'],
    text('How do ETC cards and Japanese expressway passes work?', 'ETC 卡及日本高速公路通行證如何使用？', 'ETCカードと高速道路パスはどう利用しますか？', '¿Cómo funcionan la tarjeta ETC y los pases de autopista?', 'ETC 카드와 일본 고속도로 패스는 어떻게 이용하나요?'),
    text(
      'ETC card rental and regional passes are available only at participating branches and for eligible routes or classes. A pass normally requires an ETC card. Request both before pickup and confirm the covered area, validity, fees and return procedure.',
      'ETC 卡租用及地區通行證只在參與門店、合資格行程或車型組提供；通行證通常須配合 ETC 卡。請在取車前申請，並確認適用地區、有效期、費用及歸還方式。',
      'ETCカード貸出と地域別パスは、対応店舗、対象経路・車両クラスでのみ利用できます。パスには通常ETCカードが必要です。受け取り前に申し込み、対象地域、有効期間、料金、返却方法を確認してください。',
      'El alquiler de ETC y los pases regionales solo están disponibles en oficinas, rutas o categorías participantes. El pase suele requerir ETC. Solicita ambos antes de recoger y confirma zona, vigencia, cargos y devolución.',
      'ETC 카드 대여와 지역 패스는 참여 지점과 대상 경로 또는 차량 등급에서만 제공됩니다. 패스는 보통 ETC 카드가 필요합니다. 픽업 전에 신청하고 적용 지역, 유효기간, 요금과 반납 방법을 확인하세요.',
    ),
  ),
];

export const protectionAndChargesQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'protection-packages',
    ['rent', 'important'],
    text('What protection is included, and do I need an additional package?', '基本租金包含哪些保障？是否需要加購？', '基本料金にはどの補償が含まれ、追加は必要ですか？', '¿Qué protección se incluye y necesito un paquete adicional?', '기본 요금에는 어떤 보호가 포함되며 추가 패키지가 필요한가요?'),
    text(
      'Included protection and optional packages vary by pricing terms and brand partner. Compare the customer excess, coverage limits, Non-Operation Charge treatment, roadside services, exclusions and price. Only the package selected in the final confirmed offer becomes part of the booking.',
      '基本保障與可選套餐會因不同報價條件及品牌合作方而異。請比較客戶自負額、保障上限、營業損失賠償費處理、道路救援、除外責任與價格。只有最終預訂報價中選定的套餐會納入訂單。',
      '基本補償と追加パッケージはプラン条件とブランドパートナーにより異なります。自己負担額、補償上限、NOC、ロードサービス、免責事項、料金を比較してください。最終確定したプランで選択したものだけが予約に含まれます。',
      'La protección y paquetes varían según las condiciones de la tarifa y el socio. Compara franquicia, límites, NOC, asistencia, exclusiones y precio. Solo lo elegido en la reserva confirmada forma parte del contrato.',
      '포함 보호와 선택 패키지는 요금 조건과 브랜드 파트너에 따라 다릅니다. 자기부담금, 한도, NOC, 긴급출동, 제외 항목과 가격을 비교하세요. 최종 확정된 조건에서 선택한 패키지만 예약에 포함됩니다.',
    ),
  ),
  question(
    'cdw',
    ['important'],
    text('What is Collision Damage Waiver (CDW)?', '碰撞損害免責（CDW）是甚麼？', 'CDWとは何ですか？', '¿Qué es la exención por daños de colisión (CDW)?', 'Collision Damage Waiver(CDW)란 무엇인가요?'),
    text(
      'CDW is a contractual waiver that can reduce or waive the customer excess for covered vehicle or property damage. It does not mean every loss is covered. Driver eligibility, reporting procedures, exclusions and multiple incidents follow the selected terms.',
      'CDW 是一項合約免責安排，可按條款減免受保障車損或財物損失的客戶自負額，但不代表所有損失均受保障。駕駛資格、通報程序、除外責任及多次事故均以所選條款為準。',
      'CDWは対象となる車両・対物損害の自己負担額を軽減または免除する制度で、すべての損害を補償するものではありません。運転者条件、報告手順、免責事項、複数事故への適用は選択した規約に従います。',
      'CDW puede reducir o eliminar la franquicia por daños cubiertos. No significa que toda pérdida esté cubierta. Conductores, notificación, exclusiones y accidentes múltiples dependen de las condiciones elegidas.',
      'CDW는 보장 대상 차량 또는 재物 손해에 대한 자기부담금을 줄이거나 면제할 수 있는 제도이며 모든 손해가 보장된다는 뜻은 아닙니다. 운전자 자격, 신고 절차, 제외 항목과 복수 사고 적용은 선택 약관을 따릅니다.',
    ),
  ),
  question(
    'noc',
    ['important'],
    text('What is the Non-Operation Charge (NOC)?', '甚麼是營業損失賠償費（NOC）？', 'ノンオペレーションチャージ（NOC）とは何ですか？', '¿Qué es el Non-Operation Charge (NOC)?', 'Non-Operation Charge(NOC)란 무엇인가요?'),
    text(
      'NOC compensates for loss of vehicle use while repair or cleaning is required after an accident, theft, breakdown, damage or severe soiling. An extra coverage option may waive NOC for covered events, but exclusions and customer duties still apply. Check the amount and terms in your selected offer.',
      '車輛因事故、失竊、故障、損壞或嚴重污損而需要維修或清潔時，NOC 用於補償停駛期間的營業損失。附加保障可能減免受保障事故的 NOC，但除外責任及客戶義務仍適用；金額與條件請查看所選報價詳情。',
      'NOCは事故、盗難、故障、損傷、著しい汚損などで修理・清掃が必要な期間の営業損失を補う料金です。追加補償で免除される場合がありますが、免責事項とお客様の義務は残ります。金額と条件はプラン詳細で確認してください。',
      'NOC compensa la pérdida de uso durante reparación o limpieza tras accidente, robo, avería, daño o suciedad grave. Una cobertura extra puede eximirlo, pero siguen las exclusiones y obligaciones. Revisa importe y condiciones en la oferta seleccionada.',
      'NOC는 사고, 도난, 고장, 손상 또는 심한 오염으로 수리나 청소가 필요한 기간의 영업 손실을 보전하는 비용입니다. 추가 보호가 면제할 수 있지만 제외 항목과 고객 의무는 계속 적용됩니다. 선택한 조건에서 금액과 세부 항목을 확인하세요.',
    ),
  ),
  question(
    'roadside-assistance-scope',
    ['support'],
    text('What does roadside assistance cover?', '道路救援包含哪些服務？', 'ロードサービスには何が含まれますか？', '¿Qué cubre la asistencia en carretera?', '긴급출동 서비스에는 무엇이 포함되나요?'),
    text(
      'Depending on the package and event, support may dispatch help for a flat tyre, jump start, lockout, fuel delivery, recovery or towing. Parts, fuel, unauthorised repairs and service outside the limit may remain payable. Contact support before arranging work yourself unless immediate safety requires action.',
      '按套餐及事故情況，道路救援可能包括爆胎、搭電啟動、鎖匙鎖車內、送油、脫困或拖車。零件、燃油、未經授權維修及超出限額的服務仍可能由客戶支付。除非涉及即時安全，請先聯絡客服再自行安排。',
      'パンク、ジャンプスタート、鍵の閉じ込み、燃料配送、引き上げ、レッカーなどが含まれる場合があります。部品、燃料、無断修理、上限外のサービスは有料の場合があります。緊急時を除き、自分で手配する前に連絡してください。',
      'Puede incluir pinchazo, arranque, cierre, combustible, rescate o remolque. Piezas, combustible, reparaciones no autorizadas y servicios fuera del límite pueden cobrarse. Contacta antes de contratar trabajos, salvo urgencia.',
      '패키지와 상황에 따라 펑크, 점프 스타트, 잠금, 연료 배송, 구난 또는 견인이 포함될 수 있습니다. 부품, 연료, 무단 수리와 한도 초과 서비스는 고객 부담일 수 있습니다. 긴급 상황 외에는 직접 맡기기 전에 연락하세요.',
    ),
  ),
  question(
    'rate-calculation',
    ['rent'],
    text('How is the rental price calculated?', '租車價格如何計算？', 'レンタル料金はどう計算されますか？', '¿Cómo se calcula el precio del alquiler?', '렌탈 요금은 어떻게 계산되나요?'),
    text(
      'The final price uses the vehicle class, pickup and return time, locations, season, protection, additional equipment and services, taxes and fees. Mileage treatment can vary by offer. Use the current pricing breakdown as the price source and review every amount change before confirming.',
      '最終價格由車型組、取還時間、門店、季節、保障、附加設備及服務、稅費及適用費用共同計算。里程政策可能因方案而異。請以當前報價詳情為價格依據，並在確認前核對每次金額變更。',
      '最終料金は車両クラス、日時、店舗、シーズン、補償、追加装備・オプション、税金、手数料から計算されます。走行距離条件は商品で異なる場合があります。現在の料金内訳を根拠とし、確定前に変更額を確認してください。',
      'El precio final depende de categoría, horas, oficinas, temporada, protección, equipamiento y servicios adicionales, impuestos y cargos. El kilometraje puede variar. Usa el desglose de precio vigente y revisa todo cambio antes de confirmar.',
      '최종 요금은 차량 등급, 시간, 지점, 시즌, 보호, 추가 장비 및 옵션 서비스, 세금과 수수료로 계산됩니다. 주행거리 조건은 상품에 따라 다를 수 있습니다. 현재 요금 내역을 가격 기준으로 삼고 확정 전 모든 변경 금액을 확인하세요.',
    ),
  ),
];

export const paymentAndRefundQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'accepted-payment-methods',
    ['rent'],
    text('Which payment methods and cards are accepted?', '接受哪些付款方式及信用卡？', '利用できる支払い方法とカードは何ですか？', '¿Qué métodos de pago y tarjetas se aceptan?', '어떤 결제 수단과 카드를 사용할 수 있나요?'),
    text(
      'Accepted card networks and any cash or debit-card conditions depend on the branch, vehicle and checkout. The method must satisfy the cardholder name, authentication and available-credit requirements shown during booking. Use the checkout screen as the current source.',
      '可接受的卡組織，以及現金或扣賬卡條件，取決於門店、車輛與結賬流程。付款方式須符合預訂中顯示的持卡人姓名、驗證及可用額度要求；請以結賬頁當前顯示為準。',
      '利用可能なカード、現金・デビット条件は店舗、車両、決済画面により異なります。予約時に表示される名義、認証、利用可能額の条件を満たす必要があります。現在の利用可否は決済画面で確認してください。',
      'Las tarjetas y condiciones de efectivo o débito dependen de oficina, vehículo y checkout. El medio debe cumplir titular, autenticación y crédito disponible. La pantalla de pago es la fuente vigente.',
      '사용 가능한 카드와 현금 또는 직불카드 조건은 지점, 차량과 결제 화면에 따라 다릅니다. 결제 수단은 명의, 인증과 사용 가능 한도 조건을 충족해야 합니다. 현재 허용 여부는 결제 화면을 기준으로 하세요.',
    ),
  ),
  question(
    'card-authorisation',
    ['manage', 'support'],
    text('Why did card registration fail or a notice arrive before payment?', '為何信用卡登記失敗，或在付款前收到通知？', 'カード登録失敗や決済前の通知はなぜですか？', '¿Por qué falló la tarjeta o llegó un aviso antes del pago?', '카드 등록 실패 또는 결제 전 알림의 이유는 무엇인가요?'),
    text(
      'Failure may come from incorrect details, expiry, insufficient credit, issuer restrictions, 3-D Secure or an unsupported card. A successful authorisation or temporary hold is different from final settlement, although debit cards may show an immediate withdrawal. A release notice alone does not cancel the booking.',
      '失敗原因可能包括資料錯誤、已過期、額度不足、發卡機構限制、3-D Secure 或卡類型不受支援。成功授權或暫時預留額度與最終結算不同，但扣賬卡可能顯示即時扣款。僅收到解除預留通知不代表預訂已取消。',
      '情報誤り、期限、利用可能額、発行会社の制限、3-D Secure、非対応カードなどが原因です。承認や一時確保は最終精算と異なりますが、デビットカードでは即時引き落としに見える場合があります。解除通知だけで予約キャンセルとは判断しないでください。',
      'Puede deberse a datos, caducidad, crédito, restricciones, 3-D Secure o tarjeta no admitida. Una autorización o retención no es el cargo final, aunque con débito puede parecer inmediata. Una liberación no cancela por sí sola la reserva.',
      '정보 오류, 만료, 한도 부족, 카드사 제한, 3-D Secure 또는 미지원 카드가 원인일 수 있습니다. 승인이나 임시 확보는 최종 정산과 다르지만 직불카드는 즉시 출금처럼 보일 수 있습니다. 해제 알림만으로 예약이 취소된 것은 아닙니다.',
    ),
  ),
  question(
    'change-payment-card',
    ['manage', 'support'],
    text('Can I change the card registered for the booking?', '可以更改預訂已登記的信用卡嗎？', '予約に登録したカードを変更できますか？', '¿Puedo cambiar la tarjeta registrada?', '예약에 등록한 카드를 변경할 수 있나요?'),
    text(
      'A registered online-payment card may not be editable after authorisation. If another payment path is allowed, it will be shown in Manage Booking or confirmed by the pickup branch. Do not create a duplicate booking merely to replace a card.',
      '在線付款卡完成授權後可能無法直接更改。如可使用其他付款方式，會在「管理訂單」中顯示，或由取車門店確認。不要只為更換信用卡而建立重複預訂。',
      'オンライン決済用カードは承認後に変更できない場合があります。別の方法が可能な場合は「予約管理」に表示されるか、店舗が案内します。カード変更のためだけに重複予約を作成しないでください。',
      'La tarjeta puede no ser editable tras la autorización. Si existe otra vía, aparecerá en Gestionar reserva o la confirmará la oficina. No crees otra reserva solo para cambiar la tarjeta.',
      '온라인 결제 카드는 승인 후 변경할 수 없을 수 있습니다. 다른 경로가 허용되면 예약 관리에 표시되거나 지점이 확인합니다. 카드 변경만을 위해 중복 예약을 만들지 마세요.',
    ),
  ),
  question(
    'refunds-and-receipts',
    ['manage', 'support'],
    text('How long do refunds take, and where can I get a receipt?', '退款需要多久？如何取得收據？', '返金にはどのくらいかかり、領収書はどこで取得できますか？', '¿Cuánto tarda un reembolso y cómo obtengo un recibo?', '환불은 얼마나 걸리며 영수증은 어디서 받을 수 있나요?'),
    text(
      'TrustGo can submit a release or refund, but the card issuer controls when it appears and debit cards may take longer. Keep the cancellation or payment email. For a missing receipt, contact support with the booking reference and rental details, never full card credentials.',
      'TrustGo 可提交解除預留或退款，但實際入賬時間由發卡機構控制，扣賬卡可能需時較長。請保留取消或付款電郵。如收據遺失，請提供預訂編號與租車資料聯絡客服，切勿提供完整卡資料。',
      'TrustGoは利用枠解除や返金を送信できますが、反映時期は発行会社が決め、デビットカードでは長くかかる場合があります。確認メールを保管してください。領収書は予約番号と利用情報を添えて問い合わせ、カード情報全体は送らないでください。',
      'TrustGo puede enviar la liberación o devolución, pero el emisor controla cuándo aparece y con débito puede tardar más. Conserva el correo. Para un recibo, contacta con referencia y datos del alquiler, sin credenciales completas.',
      'TrustGo은 한도 해제나 환불을 제출할 수 있지만 반영 시점은 카드사가 결정하며 직불카드는 더 오래 걸릴 수 있습니다. 확인 이메일을 보관하세요. 영수증 문의 시 예약 번호와 이용 정보를 보내되 전체 카드 정보는 보내지 마세요.',
    ),
  ),
];

export const duringRentalQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'pickup-checklist',
    ['important'],
    text('What should I bring and check at pickup?', '取車時須攜帶及檢查甚麼？', '受け取り時に何を持参し、確認しますか？', '¿Qué debo llevar y revisar al recoger?', '픽업 시 무엇을 가져가고 확인해야 하나요?'),
    text(
      'Bring every driver’s original documents, the booking reference and an accepted payment method in the required name. Before leaving, check vehicle condition, fuel or charge level, required fuel type, controls, return instructions, emergency contacts and confirmed additional equipment and services.',
      '請攜帶每位駕駛人的證件正本、預訂編號，以及符合持卡人要求的付款方式。離店前請檢查車況、燃油或電量、所需燃料種類、基本控制、還車指引、緊急聯絡方式及已確認的附加設備及服務。',
      '全運転者の書類原本、予約番号、名義条件を満たす支払い方法を持参してください。出発前に車両状態、燃料・充電量、指定燃料、操作方法、返却案内、緊急連絡先、確定済みの追加装備・オプションを確認します。',
      'Lleva originales de todos los conductores, referencia y un medio de pago válido. Antes de salir, revisa estado, combustible o carga, tipo de combustible, mandos, devolución, emergencias y equipamiento adicional confirmado.',
      '모든 운전자의 원본 서류, 예약 번호와 명의 조건에 맞는 결제 수단을 가져오세요. 출발 전에 차량 상태, 연료 또는 충전량, 지정 연료, 조작법, 반납 안내, 긴급 연락처와 확정된 추가 장비 및 옵션 서비스를 확인하세요.',
    ),
  ),
  question(
    'fuel-and-return-level',
    ['support'],
    text('Which fuel should I use, and must I refill before return?', '應使用哪種燃料？還車前需要補充嗎？', 'どの燃料を使い、返却前に給油しますか？', '¿Qué combustible uso y debo repostar antes de devolver?', '어떤 연료를 사용하며 반납 전에 보충해야 하나요?'),
    text(
      'Use the fuel type shown inside the fuel door, on the instrument panel or in pickup instructions; never rely only on pump colour. Return at the fuel or charge level required by the agreement. A fuel or charging amount and service fee may apply if it is below that level.',
      '請按油箱蓋內、儀表板或取車指引標示的燃料種類操作，不要只憑油槍顏色判斷。還車時須達到合約要求的燃油或電量；不足時可能收取燃油或充電費及服務費。',
      '給油口内、メーターパネル、受け取り案内に表示された燃料を使用し、ノズルの色だけで判断しないでください。契約で指定された燃料・充電量で返却し、不足時は代金とサービス料が発生する場合があります。',
      'Usa el combustible indicado en tapa, cuadro o instrucciones; no te guíes solo por el color. Devuelve con el nivel exigido. Si falta, pueden cobrarse consumo y servicio.',
      '연료 주입구, 계기판 또는 픽업 안내에 표시된 연료를 사용하고 주유기 색상만 믿지 마세요. 계약에서 요구하는 연료 또는 충전 수준으로 반납해야 하며 부족하면 비용과 서비스 수수료가 청구될 수 있습니다.',
    ),
  ),
  question(
    'accident-procedure',
    ['support'],
    text('What should I do after an accident or small scratch?', '發生事故或輕微刮痕時應怎樣處理？', '事故や小さな傷が発生したらどうしますか？', '¿Qué hago tras un accidente o arañazo pequeño?', '사고나 작은 긁힘이 발생하면 어떻게 해야 하나요?'),
    text(
      'First protect people and move out of immediate danger when safe. Report the event to police as required, then contact the branch or emergency support from the scene. Report every scratch, dent or collision; failing to complete the required procedure can affect protection.',
      '首先保障人身安全，在安全情況下離開即時危險位置。按要求向警方報案，然後從現場聯絡門店或緊急支援。任何刮痕、凹陷或碰撞都須通報；未完成必要程序可能影響保障。',
      'まず人命を優先し、安全なら危険な場所から移動してください。必要に応じて警察へ届け出た後、現場から店舗または緊急サポートへ連絡します。小さな傷やへこみも報告してください。手続き不足は補償に影響する場合があります。',
      'Primero protege a las personas y sal del peligro si es seguro. Informa a la policía cuando corresponda y contacta desde el lugar con oficina o asistencia. Comunica todo arañazo, golpe o colisión; omitir el procedimiento puede afectar la protección.',
      '먼저 사람의 안전을 확보하고 안전하다면 위험에서 벗어나세요. 필요한 경우 경찰에 신고한 뒤 현장에서 지점 또는 긴급 지원팀에 연락하세요. 작은 긁힘, 찌그러짐이나 충돌도 모두 신고해야 하며 절차 누락은 보호에 영향을 줄 수 있습니다.',
    ),
  ),
  question(
    'breakdown-warning-flat-tyre',
    ['support'],
    text('What should I do for a breakdown, warning light or flat tyre?', '車輛故障、警示燈或爆胎時應怎樣處理？', '故障、警告灯、パンク時はどうしますか？', '¿Qué hago ante avería, testigo o pinchazo?', '고장, 경고등 또는 타이어 펑크 시 어떻게 해야 하나요?'),
    text(
      'Stop in a safe place and contact roadside support. Do not continue with a red or flashing warning, low oil pressure, overheating, unsafe tyre or other serious symptom. Do not use a repair kit, replace parts or authorise repairs unless instructed, except for immediate safety.',
      '請在安全位置停車並聯絡道路救援。出現紅色或閃爍警示燈、低油壓、過熱、輪胎不安全或其他嚴重情況時，不要繼續駕駛。除即時安全需要或客服明確指示外，請勿自行使用補胎工具、更換零件或批准維修。',
      '安全な場所へ停車し、ロードサービスへ連絡してください。赤色・点滅警告、油圧低下、オーバーヒート、危険なタイヤなどの場合は走行を続けず、緊急時を除き指示なしに修理や部品交換をしないでください。',
      'Detente en un lugar seguro y llama a asistencia. No sigas con alerta roja o intermitente, baja presión de aceite, sobrecalentamiento o neumático inseguro. No repares ni autorices trabajos sin instrucciones, salvo seguridad inmediata.',
      '안전한 곳에 정차하고 긴급출동에 연락하세요. 빨간색 또는 점멸 경고, 낮은 오일 압력, 과열, 위험한 타이어가 있으면 계속 운전하지 마세요. 즉각적인 안전 조치 외에는 안내 없이 수리하거나 부품을 교체하지 마세요.',
    ),
  ),
  question(
    'key-problem',
    ['support'],
    text('What should I do if the key is lost, stuck or locked inside?', '車匙遺失、卡住或鎖在車內時怎樣處理？', '鍵の紛失、抜けない、閉じ込み時はどうしますか？', '¿Qué hago si pierdo la llave, se atasca o queda dentro?', '키를 분실하거나 빠지지 않거나 차 안에 잠긴 경우 어떻게 하나요?'),
    text(
      'Secure the vehicle and contact roadside support or the pickup branch. Do not force the lock or ignition and do not use an unapproved locksmith. Replacement, delivery or lockout service may be chargeable depending on the selected protection and cause.',
      '請確保車輛安全，並聯絡道路救援或取車門店。不要強行撬鎖或扭動點火裝置，也不要使用未獲批准的鎖匠。按所選保障及原因，補配車匙、送匙或開鎖服務可能收費。',
      '車両の安全を確保し、ロードサービスまたは店舗へ連絡してください。鍵やイグニッションを無理に動かしたり、未承認業者を利用したりしないでください。補償と原因により、鍵交換、配送、開錠費用が発生する場合があります。',
      'Asegura el vehículo y contacta con asistencia u oficina. No fuerces cerradura o contacto ni uses un cerrajero no autorizado. Sustitución, entrega o apertura pueden tener coste según protección y causa.',
      '차량을 안전하게 두고 긴급출동 또는 지점에 연락하세요. 자물쇠나 시동 장치를 억지로 조작하거나 승인되지 않은 업체를 이용하지 마세요. 보호와 원인에 따라 키 교체, 배송 또는 잠금 해제 비용이 청구될 수 있습니다.',
    ),
  ),
  question(
    'existing-damage',
    ['support'],
    text('How should I record existing damage at pickup?', '取車時應如何記錄已有車損？', '受け取り時の既存損傷はどう記録しますか？', '¿Cómo registro daños existentes al recoger?', '픽업 시 기존 손상은 어떻게 기록하나요?'),
    text(
      'Inspect the vehicle before departure and compare it with the condition record. Report any unlisted scratch, dent, glass, wheel or interior damage before driving away, and keep the accepted record or photos. Use the branch’s formal inspection path when provided.',
      '離店前檢查車輛並對照車況記錄。任何未列出的刮痕、凹陷、玻璃、輪圈或內飾損壞，都應在駕車離開前通知門店，並保存已接受的記錄或相片。如門店提供正式驗車流程，請使用該流程。',
      '出発前に車両と状態記録を確認してください。未記載の傷、へこみ、ガラス、ホイール、内装損傷は走り出す前に申告し、受理された記録または写真を保管します。正式な点検手段がある場合はそれを利用してください。',
      'Inspecciona antes de salir y compara con el parte. Comunica todo daño no registrado antes de conducir y guarda el registro o fotos aceptadas. Usa la inspección formal de la oficina cuando exista.',
      '출발 전에 차량을 상태 기록과 비교해 확인하세요. 기록되지 않은 긁힘, 찌그러짐, 유리, 휠 또는 실내 손상은 운전하기 전에 알리고 접수 기록이나 사진을 보관하세요. 공식 점검 절차가 있으면 이용하세요.',
    ),
  ),
  question(
    'change-return-during-rental',
    ['manage', 'support'],
    text('Can I change the return time or branch during the rental?', '租期內可以更改還車時間或門店嗎？', '利用中に返却時刻や店舗を変更できますか？', '¿Puedo cambiar la hora u oficina de devolución?', '대여 중 반납 시간이나 지점을 변경할 수 있나요?'),
    text(
      'Contact the pickup branch before the agreed return time. Approval is required because later bookings, branch capacity, vehicle eligibility and one-way rules must be checked. Additional time or one-way charges may apply; the change is not valid until confirmed.',
      '請在約定還車時間前聯絡取車門店。由於須核對後續預訂、門店能力、車輛資格及異地還車規則，變更必須獲得批准。可能產生超時或異地還車費；未確認前變更不生效。',
      '約定返却時刻より前に店舗へ連絡してください。後続予約、店舗容量、車両条件、ワンウェイルールの確認が必要です。延長・乗り捨て料金が発生する場合があり、確定するまで変更は有効ではありません。',
      'Contacta antes de la hora acordada. El cambio requiere aprobación por reservas posteriores, capacidad, vehículo y reglas one-way. Puede haber cargos; no es válido hasta confirmación.',
      '약정 반납 시간 전에 지점에 연락하세요. 이후 예약, 지점 수용 능력, 차량 자격과 편도 규정을 확인해야 하므로 승인이 필요합니다. 추가 요금이 발생할 수 있으며 확정 전에는 변경이 유효하지 않습니다.',
    ),
  ),
];
