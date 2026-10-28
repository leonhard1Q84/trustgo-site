import type {
  HelpFaqExternalLinkDefinition,
  HelpFaqLinkTarget,
  HelpFaqQuestionDefinition,
  HelpFaqReferenceLinkDefinition,
  LocaleText,
} from './types';

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});
const question = (
  id: string,
  links: HelpFaqLinkTarget[],
  prompt: LocaleText,
  answer: LocaleText,
  externalLinks?: HelpFaqExternalLinkDefinition[],
  referenceLinks?: HelpFaqReferenceLinkDefinition[],
): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
  externalLinks,
  referenceLinks,
});

const otaBookingLinks: HelpFaqExternalLinkDefinition[] = [
  {
    href: 'https://www.trip.com/carhire/supplier/trustgo-sd15794/',
    label: text('TrustGo on Trip.com', 'Trip.com 上的 TrustGo', 'Trip.comのTrustGo', 'TrustGo en Trip.com', 'Trip.com의 TrustGo'),
  },
];

export const rentalRequirementsQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'required-driving-licence',
    ['important'],
    text('What type of driver\'s license do I need?', '需要哪一種駕照？', 'どの種類の運転免許証が必要ですか？', '¿Qué tipo de permiso de conducir necesito?', '어떤 운전면허가 필요한가요?'),
    text(
      'You need a valid licence to drive in Japan: a 1949 Geneva Convention International Driving Permit; a licence from Switzerland, Germany, France, Belgium, Taiwan or Monaco with an official Japanese translation; or a Japanese licence.',
      '在日本駕駛須持有效駕照：1949 年《日內瓦道路交通公約》國際駕照；瑞士、德國、法國、比利時、台灣或摩納哥駕照及官方日文譯本；或日本駕照。',
      '日本で運転するには有効な免許が必要です。1949年ジュネーブ条約の国際運転免許証、スイス・ドイツ・フランス・ベルギー・台湾・モナコの免許証と公的な日本語訳、または日本の免許証が必要です。',
      'Necesitas un permiso válido para conducir en Japón: permiso internacional del Convenio de Ginebra de 1949; permiso de Suiza, Alemania, Francia, Bélgica, Taiwán o Mónaco con traducción oficial al japonés; o permiso japonés.',
      '일본에서 운전하려면 유효한 면허가 필요합니다. 1949년 제네바 협약 국제운전면허증, 스위스·독일·프랑스·벨기에·대만·모나코 면허와 공식 일본어 번역문, 또는 일본 면허가 필요합니다.',
    ),
  ),
  question(
    'geneva-idp-eligibility',
    ['important'],
    text('I hold an international driving permit. Can I rent a vehicle?', '持有國際駕照可以租車嗎？', '国際運転免許証があればレンタカーを借りられますか？', '¿Puedo alquilar con un permiso internacional?', '국제운전면허증이 있으면 대여할 수 있나요?'),
    text(
      'The permit must be issued under the Road Traffic Convention of 19 September 1949 (Geneva). A 1968 Vienna Convention permit, an EU-issued licence or another licence form is not accepted for driving in Japan. Bring the original passport and, where required, the domestic licence and official Japanese translation.',
      '國際駕照必須依 1949 年 9 月 19 日《日內瓦道路交通公約》簽發。1968 年《維也納公約》駕照、歐盟簽發駕照或其他形式不獲日本駕駛認可。請攜帶護照正本，並按簽發地帶備本國駕照及官方日文譯本。',
      '1949年9月19日ジュネーブ条約に基づく免許が必要です。1968年ウィーン条約の免許、EU発行免許、その他の形式は日本で認められません。原本の旅券と、必要に応じて自国免許証・公的な日本語訳を持参してください。',
      'Debe emitirse conforme al Convenio de Ginebra de 19 de septiembre de 1949. No se aceptan permisos del Convenio de Viena de 1968, permisos de la UE ni otros formatos. Lleva el pasaporte original y, cuando corresponda, permiso nacional y traducción oficial.',
      '1949년 9월 19일 제네바 협약에 따라 발급된 면허여야 합니다. 1968년 비엔나 협약 면허, EU 발급 면허 또는 다른 형식은 일본에서 인정되지 않습니다. 여권 원본과 필요한 경우 자국 면허 및 공식 일본어 번역문을 지참하세요.',
    ),
  ),
  question(
    'licence-forgotten-at-pickup',
    ['important', 'support'],
    text('If I forget my driver\'s license that day, can I still rent a vehicle?', '取車當天忘記帶駕照，仍然可以租車嗎？', '当日に運転免許証を忘れた場合、借りられますか？', '¿Puedo alquilar si olvido el permiso el día de recogida?', '픽업 당일 운전면허증을 잊으면 대여할 수 있나요?'),
    text(
      'No. The original valid driver\'s licence must be presented at pickup. Without it, the vehicle cannot be released and driving without a licence violates traffic law.',
      '不可以。取車時必須出示有效駕照正本；未能出示就不能交付車輛，無照駕駛亦違反交通法規。',
      'できません。受け取り時に有効な運転免許証の原本が必要です。提示できない場合は車両を引き渡せず、無免許運転は交通法違反です。',
      'No. Debes presentar el permiso original y vigente al recoger. Sin él no se entrega el vehículo y conducir sin permiso infringe la ley.',
      '불가능합니다. 픽업 시 유효한 운전면허증 원본을 제시해야 합니다. 없으면 차량을 인도할 수 없고 무면허 운전은 교통법 위반입니다.',
    ),
  ),
  question(
    'rental-refusal-eligibility',
    ['important', 'support'],
    text('Are there situations where I cannot rent even with a valid license?', '即使有有效駕照，也有不能租車的情況嗎？', '有効な免許証があっても借りられない場合はありますか？', '¿Pueden rechazar el alquiler aunque tenga un permiso válido?', '유효한 면허가 있어도 대여가 거절될 수 있나요?'),
    text(
      'Yes. TrustGo may refuse a rental if a customer appears under the influence of alcohol, a different driver arrives from the person named in the booking, a previous rental remains unpaid, or another rental-agreement condition is not met.',
      '可以。如客戶疑似受酒精影響、到店駕駛人與預訂人不符、上一筆租車費未支付，或不符合其他租賃合約條件，TrustGo 可拒絕出租。',
      'はい。飲酒の疑いがある、予約者と異なる運転者が来店する、前回の利用料金が未払い、その他の貸渡条件を満たさない場合、TrustGoは貸し渡しをお断りすることがあります。',
      'Sí. TrustGo puede rechazar si pareces bajo los efectos del alcohol, llega un conductor distinto al de la reserva, queda un alquiler anterior impagado o no se cumple otra condición del contrato.',
      '가능합니다. 음주가 의심되거나 예약자와 다른 운전자가 방문하거나 이전 대여 요금이 미납되었거나 다른 계약 조건을 충족하지 못하면 TrustGo은 대여를 거절할 수 있습니다.',
    ),
  ),
  question(
    'original-licence-not-copy',
    ['important'],
    text('Do I need the original international driver\'s license, or can I use a copy?', '需要國際駕照正本，還是可以使用副本？', '国際運転免許証は原本が必要ですか、コピーでも使えますか？', '¿Necesito el permiso internacional original o sirve una copia?', '국제운전면허증 원본이 필요한가요, 사본도 가능한가요?'),
    text(
      'Original valid licences and passports are required for every driver, including additional drivers. Copies, scans and digital-only documents are not accepted.',
      '所有駕駛人（包括附加駕駛人）都須出示有效駕照及護照正本，不接受影印本、掃描本或僅電子版文件。',
      '追加運転者を含む全員について、有効な免許証と旅券の原本が必要です。コピー、スキャン、デジタル版のみは受け付けません。',
      'Todos los conductores, incluidos los adicionales, deben presentar permisos y pasaportes originales y vigentes. No se aceptan copias, escaneos ni documentos solo digitales.',
      '추가 운전자를 포함한 모든 운전자는 유효한 면허증과 여권 원본을 제시해야 합니다. 사본, 스캔본 또는 디지털 문서만으로는 이용할 수 없습니다.',
    ),
  ),
  question(
    'driver-age-restriction',
    ['rent'],
    text('Are there any age restrictions for drivers?', '駕駛人有年齡限制嗎？', '運転者に年齢制限はありますか？', '¿Hay restricciones de edad para los conductores?', '운전자 연령 제한이 있나요?'),
    text(
      'Drivers must be 18 or older. The booking terms and vehicle class may impose additional eligibility conditions.',
      '駕駛人須年滿 18 歲；預訂條款及車型組可能另有資格限制。',
      '運転者は18歳以上である必要があります。予約条件や車両クラスに追加の利用条件が設定される場合があります。',
      'Los conductores deben tener al menos 18 años. Las condiciones de reserva y categoría pueden añadir requisitos.',
      '운전자는 만 18세 이상이어야 합니다. 예약 조건과 차량 등급에 추가 자격 요건이 적용될 수 있습니다.',
    ),
  ),
  question(
    'additional-driver-at-counter',
    ['important', 'manage'],
    text('Can a passenger other than the person who made the reservation drive the vehicle?', '預訂人以外的乘客可以駕駛嗎？', '予約者以外の同乗者も運転できますか？', '¿Puede conducir un pasajero distinto del titular de la reserva?', '예약자 외 동승자가 운전할 수 있나요?'),
    text(
      'Yes. An additional driver can be added at the counter free of charge when the rental terms allow it. Every driver must come to the location, present a valid licence and passport, and be recorded before driving.',
      '可以。租賃條款允許時，可在門店櫃檯免費加入附加駕駛人。所有駕駛人都須到店，出示有效駕照及護照，並在駕駛前完成登記。',
      '貸渡条件で認められる場合、同乗者を追加運転者としてカウンターで無料登録できます。全員が来店し、有効な免許証と旅券を提示して、運転前に登録してください。',
      'Sí. Si lo permiten las condiciones, se puede añadir gratis en el mostrador. Todos deben acudir, presentar permiso y pasaporte válidos y quedar registrados antes de conducir.',
      '대여 조건에서 허용하면 카운터에서 추가 운전자를 무료로 등록할 수 있습니다. 모든 운전자가 지점에 와서 유효한 면허와 여권을 제시하고 운전 전에 등록해야 합니다.',
    ),
  ),
];

export const reservationQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'how-to-make-reservation',
    ['rent'],
    text('How can I make a reservation?', '如何預訂？', '予約はどうすればできますか？', '¿Cómo hago una reserva?', '예약은 어떻게 하나요?'),
    text(
      'Book through the TrustGo website or visit the TrustGo page on Trip.com to choose a vehicle and complete your reservation.',
      '可透過 TrustGo 官網預訂，或前往 Trip.com 的 TrustGo 頁面選擇車輛並完成預訂。',
      'TrustGo公式サイト、またはTrip.comのTrustGoページから車両を選んで予約できます。',
      'Reserva en la web de TrustGo o visita la página de TrustGo en Trip.com para elegir un vehículo y completar tu reserva.',
      'TrustGo 공식 웹사이트 또는 Trip.com의 TrustGo 페이지에서 차량을 선택하고 예약할 수 있습니다.',
    ),
    otaBookingLinks,
  ),
  question(
    'view-change-cancel-reservation',
    ['manage', 'support'],
    text('How can I view, change or cancel a reservation?', '如何查看、變更或取消預訂？', '予約の確認・変更・キャンセル方法は？', '¿Cómo consulto, cambio o cancelo una reserva?', '예약을 조회, 변경 또는 취소하려면 어떻게 하나요?'),
    text(
      'Use Manage Booking for an eligible direct TrustGo booking. Reservations made through another company\'s website or a travel agency must be changed through that original channel. Phone or email reservations made through the English Service Desk cannot be managed on the website; contact the desk instead.',
      '符合條件的 TrustGo 官網直接預訂可使用「管理訂單」。透過其他網站或旅行社預訂，必須回到原渠道處理。經英文客服以電話或電郵預訂的訂單不能在網站管理，請直接聯絡客服中心。',
      '対象となるTrustGo直接予約は「予約管理」で確認・変更できます。他社サイトや旅行会社の予約は元の窓口で手続きしてください。英語サービスデスクへ電話・メールで行った予約はウェブ管理できないため、デスクへ連絡してください。',
      'Usa Gestionar reserva para una reserva directa apta. Las reservas de otra web o agencia se modifican en el canal original. Las reservas por teléfono o correo con el servicio en inglés se gestionan contactando con ese servicio.',
      '대상 TrustGo 직접 예약은 예약 관리에서 조회·변경할 수 있습니다. 다른 웹사이트나 여행사 예약은 원래 채널에서 처리하세요. 영어 서비스 데스크의 전화·이메일 예약은 웹에서 관리할 수 없으므로 데스크에 문의하세요.',
    ),
  ),
  question(
    'cancellation-fee-and-no-show',
    ['manage', 'support'],
    text('Will a cancellation fee apply when cancelling a reservation?', '取消預訂會收取取消費嗎？', '予約をキャンセルするとキャンセル料がかかりますか？', '¿Se cobra una tasa al cancelar?', '예약을 취소하면 취소 수수료가 있나요?'),
    text(
      'If a reservation is cancelled within six days of pickup, the specified cancellation fee applies; a cancellation made on the same day as the reservation does not incur that fee. If you do not arrive within one hour of pickup without notice, the reservation is automatically cancelled. Contact the desk or pickup location before pickup if you will be late.',
      '取車日前 6 天內取消會按規定收取取消費；預訂當日取消則不收取該費用。未通知且取車時間後 1 小時仍未到店，預訂會自動取消。如會遲到，請在取車前聯絡客服或門店。',
      '受け取り日の6日前以内にキャンセルすると所定のキャンセル料がかかります。予約当日のキャンセルにはかかりません。連絡なく受け取り時刻から1時間以内に来店しない場合は自動キャンセルとなります。遅れる場合は事前にデスクまたは店舗へ連絡してください。',
      'Si cancelas dentro de los seis días previos a la recogida se aplica la tasa indicada; cancelar el mismo día de la reserva no la genera. Sin aviso y sin llegar en una hora, se cancela automáticamente. Avisa antes si llegarás tarde.',
      '픽업일 6일 이내 취소하면 정해진 취소 수수료가 적용되며 예약 당일 취소에는 부과되지 않습니다. 사전 연락 없이 픽업 시간 1시간 내 도착하지 않으면 자동 취소됩니다. 늦을 경우 픽업 전에 데스크나 지점에 연락하세요.',
    ),
  ),
  question(
    'driver-arrangement',
    ['support'],
    text('Can you arrange for a driver?', '可以代為安排駕駛人嗎？', '運転者を手配してもらえますか？', '¿Pueden proporcionar un conductor?', '운전자를 알선해 주나요?'),
    text(
      'No. Customers must arrange a driver themselves. Rental companies are prohibited by law from acting as drivers, introducing drivers or arranging drivers as an intermediary.',
      '不可以。駕駛人須由客戶自行安排。租車公司依法不得代客駕駛、介紹駕駛人或作為中介安排駕駛人。',
      'できません。運転者はお客様自身で手配してください。レンタカー会社が運転、運転者の紹介、仲介を行うことは法律で禁止されています。',
      'No. El cliente debe organizar el conductor. La ley prohíbe a las empresas conducir, presentar conductores o actuar como intermediarias.',
      '불가능합니다. 운전자는 고객이 직접 준비해야 합니다. 렌터카 회사는 법적으로 직접 운전하거나 운전자를 소개·알선할 수 없습니다.',
    ),
  ),
  question(
    'branch-opening-hours',
    ['locations'],
    text('What are your opening hours?', '門店營業時間是怎樣的？', '営業時間は何時ですか？', '¿Cuál es el horario de apertura?', '지점 영업시간은 어떻게 되나요?'),
    text(
      'Business hours vary by location. Check the pickup branch\'s published hours before travelling.',
      '營業時間因門店而異，請在出發前查看取車門店公布的時間。',
      '営業時間は店舗により異なります。来店前に受け取り店舗の公示時間を確認してください。',
      'El horario varía según la oficina. Consulta el horario publicado de tu oficina antes de ir.',
      '영업시간은 지점마다 다릅니다. 방문 전에 픽업 지점의 공지 시간을 확인하세요.',
    ),
  ),
  question(
    'nearest-location',
    ['locations'],
    text('How do I find the nearest location?', '如何找到最近的門店？', '最寄りの店舗はどう探しますか？', '¿Cómo encuentro la oficina más cercana?', '가장 가까운 지점은 어떻게 찾나요?'),
    text(
      'Use the Locations page to search for the nearest location and check its address, opening hours and pickup instructions.',
      '請使用「服務門店」頁搜尋最近門店，並查看地址、營業時間與取車指引。',
      '「店舗」ページで最寄りの店舗を検索し、住所、営業時間、受け取り案内を確認してください。',
      'Usa Oficinas para buscar la más cercana y consultar dirección, horario e instrucciones.',
      '지점 페이지에서 가까운 지점을 검색하고 주소, 영업시간과 픽업 안내를 확인하세요.',
    ),
  ),
  question(
    'outside-business-hours',
    ['locations', 'support'],
    text('Can I pick up or return the car outside of business hours?', '可以在營業時間外取車或還車嗎？', '営業時間外に受け取り・返却できますか？', '¿Puedo recoger o devolver fuera del horario?', '영업시간 외 픽업·반납이 가능한가요?'),
    text(
      'No. Pickup and return must take place during business hours. To return before opening, return during business hours on the previous day. To collect after closing, come the next morning during business hours. Confirm the exact hours with the location.',
      '不可以。取還車必須在營業時間內辦理。若要在開門前還車，請於前一天營業時間內還車；若要在打烊後取車，請翌日上午營業時間再到店。請向門店確認實際時間。',
      'できません。受け取り・返却は営業時間内に行います。開店前に返却する場合は前日の営業時間内に返却し、閉店後に受け取る場合は翌朝の営業時間内に来店してください。',
      'No. Recogida y devolución son dentro del horario. Para devolver antes de abrir, hazlo el día anterior; para recoger tras el cierre, vuelve a la mañana siguiente. Confirma el horario exacto.',
      '불가능합니다. 픽업과 반납은 영업시간 내에 해야 합니다. 개점 전 반납은 전날 영업시간에 진행하고 폐점 후 픽업은 다음 날 아침 영업시간에 방문하세요. 정확한 시간을 지점에 확인하세요.',
    ),
  ),
  question(
    'late-pickup-next-day',
    ['manage', 'support'],
    text('If I cannot pick up my reservation in time, can I pick it up the next day?', '無法按時取車時，可以翌日取車嗎？', '予約時刻に受け取れない場合、翌日に受け取れますか？', 'Si no llego a tiempo, ¿puedo recoger al día siguiente?', '예약 시간에 픽업하지 못하면 다음 날 받을 수 있나요?'),
    text(
      'Contact the English Service Desk or pickup location in advance. If you do not contact us and do not arrive within one hour of the reservation time, the reservation is cancelled and a vehicle may no longer be available. Next-day pickup is not automatic and requires confirmation.',
      '請提前聯絡英文客服中心或取車門店。若未聯絡且預訂時間後 1 小時仍未到店，預訂會被取消，亦可能無法提供車輛。翌日取車不會自動成立，必須先獲確認。',
      '事前に英語サービスデスクまたは受け取り店舗へ連絡してください。連絡なく予約時刻から1時間以内に来店しないとキャンセルとなり、車両を用意できない場合があります。翌日受け取りは自動ではなく、確認が必要です。',
      'Avisa antes al servicio en inglés o a la oficina. Sin aviso y sin llegar en una hora se cancela la reserva y puede no haber vehículo. Recoger al día siguiente no es automático: requiere confirmación.',
      '영어 서비스 데스크 또는 픽업 지점에 미리 연락하세요. 연락 없이 예약 시간 1시간 내 도착하지 않으면 예약이 취소되고 차량을 제공하지 못할 수 있습니다. 다음 날 픽업은 자동이 아니며 확인이 필요합니다.',
    ),
  ),
  question(
    'airport-shuttle',
    ['locations'],
    text('Is there a shuttle bus from the airport to the rental office?', '機場到租車門店有接駁車嗎？', '空港からレンタル店舗への送迎バスはありますか？', '¿Hay traslado del aeropuerto a la oficina?', '공항에서 렌터카 지점까지 셔틀이 있나요?'),
    text(
      'Some locations offer an airport shuttle. Check the exact pickup instructions for the location in your booking; shuttle service is not available at every location.',
      '部分門店提供機場接駁。請查看預訂門店的具體取車指引；並非所有門店都有接駁服務。',
      '空港送迎を行う店舗があります。予約店舗の受け取り案内を確認してください。すべての店舗で利用できるわけではありません。',
      'Algunas oficinas ofrecen traslado desde el aeropuerto. Revisa las instrucciones de tu oficina; no está disponible en todas.',
      '일부 지점은 공항 셔틀을 제공합니다. 예약한 지점의 픽업 안내를 확인하세요. 모든 지점에서 제공되지는 않습니다.',
    ),
  ),
];

export const vehicleCategoryQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'child-seat-age',
    ['rent'],
    text('Until what age are child seats required?', '兒童安全座椅須使用至幾歲？', 'チャイルドシートは何歳まで必要ですか？', '¿Hasta qué edad es obligatoria la silla infantil?', '카시트는 몇 살까지 필요한가요?'),
    text('Japanese road law requires a child safety seat for children under six. Reserve the appropriate seat when booking.', '日本道路交通法要求未滿 6 歲兒童使用兒童安全座椅，請在預訂時選擇合適座椅。', '日本の道路交通法では6歳未満の子どもにチャイルドシートが必要です。予約時に適切な座席を予約してください。', 'La ley japonesa exige silla para menores de seis años. Reserva el tipo adecuado.', '일본 도로교통법은 6세 미만 어린이에게 카시트를 요구합니다. 예약 시 적합한 좌석을 예약하세요.'),
  ),
  question(
    'reserve-winter-tyres',
    ['rent'],
    text('Can I reserve winter tires as an option?', '可以預訂雪胎選項嗎？', 'スタッドレスタイヤをオプション予約できますか？', '¿Puedo reservar neumáticos de invierno?', '겨울 타이어를 옵션으로 예약할 수 있나요?'),
    text('Yes. Select Winter tires while choosing the vehicle. The usual additional charge is JPY 2,200 to 3,300 per day. If the option is unavailable online, contact support.', '可以。在選擇車輛時加入「雪胎」。一般附加費為每日 2,200 至 3,300 日圓。網上無法選擇時請聯絡客服。', 'はい。車両選択時にスタッドレスタイヤを追加します。通常は1日2,200～3,300円です。オンラインで選べない場合はサポートへ連絡してください。', 'Sí. Añade Neumáticos de invierno al elegir el vehículo. Normalmente cuesta 2.200–3.300 JPY al día. Si no aparece, contacta con soporte.', '가능합니다. 차량 선택 시 겨울 타이어를 추가하세요. 일반 추가 요금은 하루 2,200~3,300엔입니다. 온라인에서 선택할 수 없으면 지원팀에 문의하세요.'),
  ),
  question(
    'add-winter-tyres-on-day',
    ['rent', 'support'],
    text('Can I add winter tires on the day of pickup?', '取車當天可以加訂雪胎嗎？', '受け取り当日にスタッドレスタイヤを追加できますか？', '¿Puedo añadir neumáticos de invierno el día de recogida?', '픽업 당일 겨울 타이어를 추가할 수 있나요?'),
    text('Only if a suitable vehicle remains available. A fully booked branch may not be able to provide winter tires on the day. Reserve in advance or contact the English Service Desk with your reservation number.', '只有在仍有合適車輛時才可。車輛額滿時，門店當天可能無法提供雪胎。請提前預訂，或帶預訂編號聯絡英文客服。', '対応車両が残っている場合に限ります。満車の場合、当日に用意できないことがあります。事前予約するか、予約番号を添えて英語サービスデスクへ連絡してください。', 'Solo si queda un vehículo adecuado. Si la oficina está completa, puede no haber disponibilidad ese día. Reserva antes o contacta con el servicio en inglés con tu número.', '적합한 차량이 남아 있는 경우에만 가능합니다. 지점 차량이 모두 예약된 경우 당일 제공하지 못할 수 있습니다. 미리 예약하거나 예약 번호와 함께 영어 서비스 데스크에 문의하세요.'),
  ),
  question(
    'winter-tyres-standard',
    ['rent'],
    text('Does the car come with winter tires?', '車輛會配備雪胎嗎？', '車両にはスタッドレスタイヤが付いていますか？', '¿El vehículo lleva neumáticos de invierno?', '차량에 겨울 타이어가 장착되어 있나요?'),
    text('Winter tires are optional unless the confirmed booking shows them as included. Add them while booking and confirm the equipment shown for your vehicle before pickup.', '除非已確認的預訂顯示包括雪胎，否則雪胎屬可選項目。請在預訂時加入，並於取車前確認車輛裝備。', '確定した予約に含まれると表示されていない限り、スタッドレスタイヤはオプションです。予約時に追加し、受け取り前に車両装備を確認してください。', 'Los neumáticos de invierno son opcionales salvo que la reserva confirmada indique que están incluidos. Añádelos al reservar y confirma el equipamiento antes de recoger.', '확정된 예약에 포함된 것으로 표시되지 않으면 겨울 타이어는 옵션입니다. 예약 시 추가하고 픽업 전에 차량 장비를 확인하세요.'),
  ),
  question(
    'need-winter-tyres',
    ['rent'],
    text('Do I need winter tires if I drive in winter?', '冬季駕駛需要雪胎嗎？', '冬に運転する場合、スタッドレスタイヤは必要ですか？', '¿Necesito neumáticos de invierno en invierno?', '겨울에 운전하면 겨울 타이어가 필요한가요?'),
    text('Use winter tires whenever road or weather conditions require them. Check the route and forecast before departure, and do not drive on icy or snow-covered roads without suitable equipment.', '道路或天氣狀況有需要時，應使用雪胎。出發前請查看路線及天氣預報；未配備合適裝備時，不要在結冰或積雪路面駕駛。', '道路・気象条件に応じてスタッドレスタイヤを使用してください。出発前に経路と予報を確認し、適切な装備がない状態で凍結・積雪路を走行しないでください。', 'Usa neumáticos de invierno cuando lo exijan la carretera o el tiempo. Revisa ruta y previsión y no conduzcas por hielo o nieve sin el equipamiento adecuado.', '도로 또는 기상 조건에 따라 겨울 타이어를 사용하세요. 출발 전에 경로와 예보를 확인하고 적합한 장비 없이 빙판길이나 눈 덮인 도로를 운전하지 마세요.'),
  ),
  question(
    'car-navigation-system',
    ['rent'],
    text('Can I add GPS navigation as an Extra?', '可以選配 GPS 車載導航嗎？', 'GPSナビを追加オプションとして選べますか？', '¿Puedo añadir navegación GPS como Extra?', 'GPS 내비게이션을 Extra로 추가할 수 있나요?'),
    text('Yes, when GPS is shown as an available Extra for the selected Quote. Add it during booking and review the price before confirming. Availability, interface language and support for Apple CarPlay or Android Auto depend on the vehicle and equipment supplied; these features are not guaranteed unless shown in the Quote.', '可以，但須以所選報價顯示 GPS 為可用 Extra 為準。請在預訂時選配，並於確認前查看價格。供應、介面語言，以及 Apple CarPlay 或 Android Auto 支援情況取決於實際車輛及設備；除非報價明確顯示，否則不作保證。', '選択した見積にGPSが利用可能な追加オプションとして表示される場合に選べます。予約時に追加し、確定前に料金を確認してください。在庫、表示言語、Apple CarPlay／Android Auto対応は提供車両・機器により異なり、見積に明記されない限り保証されません。', 'Sí, cuando el GPS aparezca como Extra disponible en la oferta seleccionada. Añádelo durante la reserva y revisa el precio antes de confirmar. La disponibilidad, el idioma y la compatibilidad con Apple CarPlay o Android Auto dependen del vehículo y equipo; no se garantizan salvo que figuren en la oferta.', '선택한 견적에 GPS가 이용 가능한 Extra로 표시된 경우 추가할 수 있습니다. 예약 중 선택하고 확정 전에 가격을 확인하세요. 재고, 화면 언어와 Apple CarPlay 또는 Android Auto 지원 여부는 실제 차량과 장비에 따라 다르며 견적에 표시되지 않으면 보장되지 않습니다.'),
  ),
  question(
    'non-smoking-vehicle',
    ['rent'],
    text('Are all TrustGo vehicles non-smoking?', 'TrustGo 所有車輛都是禁煙車嗎？', 'TrustGoの車両はすべて禁煙ですか？', '¿Todos los vehículos de TrustGo son para no fumadores?', 'TrustGo의 모든 차량은 금연 차량인가요?'),
    text('Yes. All TrustGo vehicles are non-smoking. Smoking is not permitted inside the vehicle.', '是。TrustGo 所有車輛均為禁煙車，車內禁止吸煙。', 'はい。TrustGoの車両はすべて禁煙です。車内での喫煙は禁止されています。', 'Sí. Todos los vehículos de TrustGo son para no fumadores. No se permite fumar dentro del vehículo.', '네. TrustGo의 모든 차량은 금연 차량이며 차량 내 흡연은 금지됩니다.'),
  ),
  question(
    'one-way-rental',
    ['rent', 'locations'],
    text('Can I return my vehicle to a different rental location?', '可以在不同門店還車嗎？', '別の店舗へ返却できますか？', '¿Puedo devolver el vehículo en otra oficina?', '다른 렌터카 지점에 반납할 수 있나요?'),
    text('One-way rental is available when the vehicle and both locations are eligible. A one-way fee may apply. Select the intended return location during search and confirm the route and fee shown in the booking.', '車輛及取還車門店符合條件時可異地還車，可能收取異地還車費。搜尋時請選擇預定還車門店，並確認預訂顯示的路線及費用。', '車両と両店舗が対象ならワンウェイ返却が可能で、料金がかかる場合があります。検索時に返却店舗を選び、予約に表示される経路と料金を確認してください。', 'El alquiler one-way está disponible cuando el vehículo y ambas oficinas son aptos. Puede aplicarse una tasa. Selecciona la oficina de devolución y confirma la ruta y el cargo mostrados.', '차량과 두 지점이 대상이면 편도 반납이 가능하며 수수료가 부과될 수 있습니다. 검색 시 반납 지점을 선택하고 예약에 표시된 경로와 요금을 확인하세요.'),
  ),
  question(
    'etc-card-rental',
    ['rent', 'support'],
    text('Do you offer ETC card rentals?', '提供 ETC 卡租用嗎？', 'ETCカードのレンタルはありますか？', '¿Alquilan tarjetas ETC?', 'ETC 카드 대여가 가능한가요?'),
    text('Participating locations may rent ETC cards. Select the option while booking or contact the English Service Desk. Availability depends on the location.', '部分門店可租用 ETC 卡。請在預訂時選擇，或聯絡英文客服中心；供應取決於門店。', '対応店舗ではETCカードを借りられます。予約時に選択するか、英語サービスデスクへ連絡してください。店舗により異なります。', 'Algunas oficinas alquilan tarjetas ETC. Selecciona la opción o contacta con el servicio en inglés; depende de la oficina.', '참여 지점에서 ETC 카드를 대여할 수 있습니다. 예약 시 옵션을 선택하거나 영어 서비스 데스크에 문의하세요. 지점에 따라 다릅니다.'),
  ),
  question(
    'expressway-pass-reservation',
    ['rent', 'support'],
    text('How do I reserve an Expressway Pass (HEP/TEP/KEP)?', '如何預訂高速公路通行證（HEP/TEP/KEP）？', '高速道路パス（HEP/TEP/KEP）はどう予約しますか？', '¿Cómo reservo un pase de autopista (HEP/TEP/KEP)?', '고속도로 패스(HEP/TEP/KEP)는 어떻게 예약하나요?'),
    text('Contact the English Service Desk. Both pickup and return locations must support the pass, and vehicle-class restrictions apply.', '請聯絡英文客服中心。取車及還車門店都必須支援該通行證，且有車型組限制。', '英語サービスデスクへ連絡してください。受け取り・返却店舗の両方が対応し、車両クラスの制限があります。', 'Contacta con el servicio en inglés. Ambas oficinas deben admitirlo y hay restricciones de categoría.', '영어 서비스 데스크에 문의하세요. 픽업과 반납 지점이 모두 패스를 지원해야 하며 차량 등급 제한이 있습니다.'),
  ),
  question(
    'expressway-pass-advance',
    ['rent', 'support'],
    text('Do I need to reserve an Expressway Pass in advance?', '高速公路通行證需要提前預訂嗎？', '高速道路パスは事前予約が必要ですか？', '¿Debo reservar el pase de autopista con antelación?', '고속도로 패스는 미리 예약해야 하나요?'),
    text('If you reserved the ETC card option, you may be able to add the pass at pickup, subject to both locations and the vehicle class. Advance reservation is recommended to reduce pickup waiting time.', '已預訂 ETC 卡選項時，可能可在取車當天加入通行證，但須符合兩個門店及車型組條件。建議提前預訂以減少等候時間。', 'ETCカードを予約していれば、両店舗と車両クラスが対応する場合、受け取り当日に追加できることがあります。待ち時間短縮のため事前予約をおすすめします。', 'Con la opción ETC puedes añadirlo al recoger si ambas oficinas y la categoría son aptas. Se recomienda reservar antes para esperar menos.', 'ETC 카드 옵션을 예약하면 두 지점과 차량 등급이 지원하는 경우 픽업 당일 추가할 수 있습니다. 대기 시간을 줄이려면 미리 예약하세요.'),
  ),
  question(
    'expressway-pass-requires-etc',
    ['rent'],
    text('If I get an Expressway Pass, do I need an ETC card?', '有高速公路通行證，仍需要 ETC 卡嗎？', '高速道路パスにETCカードは必要ですか？', '¿Necesito una tarjeta ETC con el pase?', '고속도로 패스를 이용하면 ETC 카드가 필요한가요?'),
    text('Yes. An ETC card rental is required to use an Expressway Pass.', '需要。使用高速公路通行證必須租用 ETC 卡。', 'はい。高速道路パスの利用にはETCカードのレンタルが必要です。', 'Sí. El pase requiere alquilar una tarjeta ETC.', '네. 고속도로 패스를 이용하려면 ETC 카드를 대여해야 합니다.'),
  ),
  question(
    'vehicle-model-specification',
    ['rent'],
    text('Can I specify a vehicle model when making a reservation?', '預訂時可以指定車款嗎？', '予約時に車種を指定できますか？', '¿Puedo especificar un modelo al reservar?', '예약할 때 차량 모델을 지정할 수 있나요?'),
    text('Reservations are confirmed by vehicle class, not a specific model, brand or colour. Check the model examples, type, capacity and SIPP code shown for the class.', '預訂確認的是車型組，而非特定車款、品牌或顏色。請查看該車型組顯示的車款例子、類型、座位容量及 SIPP Code。', '予約は特定の車種・ブランド・色ではなく車両クラスで確定します。クラスに表示される車種例、タイプ、定員、SIPPコードを確認してください。', 'La reserva confirma una categoría, no un modelo, marca o color concretos. Consulta los ejemplos, el tipo, la capacidad y el código SIPP de la categoría.', '예약은 특정 모델, 브랜드나 색상이 아닌 차량 등급으로 확정됩니다. 등급에 표시된 모델 예시, 유형, 정원과 SIPP 코드를 확인하세요.'),
    undefined,
    [
      {
        href: '/{lang}/help/sipp-codes/',
        label: text('View the SIPP code guide', '查看 SIPP Code 車型組代碼指南', 'SIPPコードガイドを見る', 'Ver la guía de códigos SIPP', 'SIPP 코드 가이드 보기'),
      },
    ],
  ),
  question(
    'universal-accessible-vehicle',
    ['support'],
    text('Do you offer universal or wheelchair-accessible vehicles?', '有提供無障礙或通用車輛嗎？', '福祉車両・車いす対応車はありますか？', '¿Ofrecen vehículos accesibles o universales?', '장애인 접근 차량을 제공하나요?'),
    text('Some locations may offer wheelchair-accessible vehicles or elevating seats. Contact the English Service Desk with the vehicle type, location, date and time to check availability and reserve.', '部分門店可能提供輪椅無障礙車輛或升降座椅。請向英文客服提供車輛類型、門店、日期及時間，以確認供應及預訂。', '一部店舗では車いす対応車や昇降シートを用意しています。車種、店舗、日時を添えて英語サービスデスクへ問い合わせ、空き状況を確認してください。', 'Algunas oficinas pueden ofrecer vehículos accesibles o asientos elevadores. Consulta al servicio en inglés con tipo, oficina, fecha y hora.', '일부 지점은 휠체어 접근 차량이나 승강 시트를 제공할 수 있습니다. 차량 유형, 지점, 날짜와 시간을 영어 서비스 데스크에 알려 확인하고 예약하세요.'),
  ),
  question(
    'four-wheel-drive',
    ['rent'],
    text('Do you offer 4WD?', '提供四輪驅動車嗎？', '4WDはありますか？', '¿Ofrecen vehículos 4x4?', '4WD 차량이 있나요?'),
    text('4WD is available depending on vehicle class and location. Select 4WD while changing search criteria; an additional charge may apply. Intermediate Plus large and SUV classes include 4WD.', '四輪驅動取決於車型組及門店。修改搜尋條件時可選擇 4WD，可能另收費。Intermediate Plus 大型及 SUV 車型組包括 4WD。', '4WDは車両クラスと店舗により利用できます。検索条件変更で4WDを選択でき、追加料金がかかる場合があります。Intermediate Plus大型・SUVクラスには4WDが含まれます。', 'Hay 4x4 según categoría y oficina. Selecciónalo en los criterios; puede tener coste. Las clases Intermediate Plus grande y SUV lo incluyen.', '4WD는 차량 등급과 지점에 따라 제공됩니다. 검색 조건 변경에서 선택하며 추가 요금이 있을 수 있습니다. Intermediate Plus 대형·SUV 등급에는 4WD가 포함됩니다.'),
  ),
  question(
    'options-without-car',
    ['support'],
    text('Can I rent the options without renting a car?', '可以不租車而單獨租用附加設備嗎？', '車を借りずにオプションだけ借りられますか？', '¿Puedo alquilar opciones sin alquilar un coche?', '차량 없이 옵션만 대여할 수 있나요?'),
    text('No. Optional items are rented only with an TrustGo vehicle rental.', '不可以。附加項目只會隨 TrustGo 車輛租賃提供。', 'できません。オプション品はTrustGoの車両レンタルと一緒にのみ貸し出します。', 'No. Los artículos opcionales solo se alquilan junto con un vehículo de TrustGo.', '불가능합니다. 옵션 품목은 TrustGo 차량 대여와 함께만 대여할 수 있습니다.'),
  ),
  question(
    'automatic-transmission',
    ['rent'],
    text('Can I specify an automatic transmission?', '可以指定自動變速箱嗎？', 'オートマチック車を指定できますか？', '¿Puedo solicitar transmisión automática?', '자동 변속기를 지정할 수 있나요?'),
    text('Passenger cars and minivans are automatic. Some trucks may be manual; contact the English Service Desk in advance if an automatic truck is essential.', '乘用車及小型客貨車均為自動變速。部分卡車可能是手動，如必須使用自動卡車，請提前聯絡英文客服。', '乗用車とミニバンはオートマチックです。一部トラックはマニュアルの場合があるため、ATが必要なら事前に英語サービスデスクへ連絡してください。', 'Turismos y monovolúmenes son automáticos. Algunos camiones pueden ser manuales; contacta antes si necesitas uno automático.', '승용차와 미니밴은 자동 변속입니다. 일부 트럭은 수동일 수 있으므로 자동 트럭이 필수라면 미리 영어 서비스 데스크에 문의하세요.'),
  ),
  question(
    'pets-in-vehicle',
    ['rent'],
    text('Are pets allowed in the car?', '車內可以攜帶寵物嗎？', '車内にペットを同乗できますか？', '¿Se permiten mascotas en el vehículo?', '차량에 반려동물을 태울 수 있나요?'),
    text('Pet travel may be available when the vehicle class, location and booking terms allow it. Read the pet travel guide, add the requirement during booking and confirm the equipment and conditions with the pickup location before travel.', '攜帶寵物須符合車型組、門店及預訂條款。請先查看寵物同行指南，在預訂時加入相關要求，並於出發前向取車門店確認車輛裝備及條件。', 'ペット同乗は車両クラス、店舗、予約条件が認める場合に利用できます。ペット同行ガイドを確認し、予約時に申告したうえで、利用前に受け取り店舗へ装備と条件を確認してください。', 'El viaje con mascotas puede estar disponible si lo permiten la categoría, la oficina y las condiciones. Consulta la guía, indícalo durante la reserva y confirma el equipamiento y las condiciones con la oficina antes del viaje.', '반려동물 동승은 차량 등급, 지점과 예약 조건에서 허용하는 경우 이용할 수 있습니다. 반려동물 동승 가이드를 확인하고 예약할 때 요청한 뒤 이용 전에 픽업 지점에 장비와 조건을 확인하세요.'),
    undefined,
    [
      {
        href: '/{lang}/help/pet-travel/',
        label: text('View the pet travel guide', '查看寵物同行指南', 'ペット同行ガイドを見る', 'Ver la guía para viajar con mascotas', '반려동물 동승 가이드 보기'),
      },
    ],
  ),
  question(
    'winter-chain-rental',
    ['rent'],
    text('Can I rent winter chains?', '可以租用雪鏈嗎？', 'タイヤチェーンを借りられますか？', '¿Puedo alquilar cadenas de nieve?', '스노 체인을 대여할 수 있나요?'),
    text('Winter chains are available as an optional Extra. If needed, add them during booking and confirm the vehicle equipment before pickup.', '雪鏈屬可選 Extra。如有需要，請在預訂時加入，並於取車前確認車輛裝備。', 'タイヤチェーンは追加オプションとして選択できます。必要な場合は予約時に追加し、受け取り前に車両装備を確認してください。', 'Las cadenas de nieve están disponibles como Extra opcional. Si las necesitas, añádelas durante la reserva y confirma el equipamiento del vehículo antes de la recogida.', '스노 체인은 선택 가능한 Extra입니다. 필요한 경우 예약할 때 추가하고 픽업 전에 차량 장비를 확인하세요.'),
  ),
  question(
    'ski-carrier-rental',
    ['rent'],
    text('Can I rent a ski carrier or ski rack?', '可以租用滑雪板架或滑雪架嗎？', 'スキーキャリア・スキーラックを借りられますか？', '¿Puedo alquilar un portaesquís?', '스키 캐리어나 스키 랙을 대여할 수 있나요?'),
    text('Ski carriers and ski racks are available as optional Extras. If needed, add one during booking and confirm the vehicle equipment before pickup.', '滑雪板架及滑雪架屬可選 Extra。如有需要，請在預訂時加入，並於取車前確認車輛裝備。', 'スキーキャリアとスキーラックは追加オプションとして選択できます。必要な場合は予約時に追加し、受け取り前に車両装備を確認してください。', 'Los portaesquís están disponibles como Extras opcionales. Si necesitas uno, añádelo durante la reserva y confirma el equipamiento del vehículo antes de la recogida.', '스키 캐리어와 스키 랙은 선택 가능한 Extra입니다. 필요한 경우 예약할 때 추가하고 픽업 전에 차량 장비를 확인하세요.'),
  ),
  question(
    'music-playback',
    ['rent'],
    text('Can I listen to music in the car?', '可以在車內播放音樂嗎？', '車内で音楽を聴けますか？', '¿Puedo escuchar música en el vehículo?', '차량에서 음악을 들을 수 있나요?'),
    text('If the supplied vehicle or selected GPS Extra includes compatible audio connectivity, you can play music through Bluetooth, USB or AUX. Check the equipment shown in the Quote; a specific connection type is not guaranteed.', '如實際車輛或所選 GPS Extra 配備兼容音訊連接，可透過藍牙、USB 或 AUX 播放音樂。請查看報價所列設備；不保證提供特定連接方式。', '提供車両または選択したGPSオプションに対応オーディオ接続がある場合、Bluetooth、USB、AUXで音楽を再生できます。見積の装備を確認してください。特定の接続方式は保証されません。', 'Si el vehículo o el Extra GPS incluye conexión de audio compatible, puedes reproducir música por Bluetooth, USB o AUX. Revisa el equipo de la oferta; no se garantiza un tipo concreto de conexión.', '실제 차량 또는 선택한 GPS Extra에 호환 오디오 연결 기능이 있으면 Bluetooth, USB 또는 AUX로 음악을 재생할 수 있습니다. 견적의 장비를 확인하세요. 특정 연결 방식은 보장되지 않습니다.'),
  ),
];

export const insuranceQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'additional-insurance',
    ['rent', 'important'],
    text('Do I need to purchase insurance in addition to the base rental fee?', '基本租金以外還需要加購保險嗎？', '基本料金以外に保険を購入する必要がありますか？', '¿Necesito comprar seguro además de la tarifa base?', '기본 대여료 외에 보험을 추가 구매해야 하나요?'),
    text('If your booking includes Full Insurance and Compensation Support, no additional package is required at pickup. For a booking made through another website, check that channel. When the rental location permits an additional protection Extra at pickup, it is purchased separately at the location and may be paid by cash or credit card.', '若預訂已包括「完整保險及補償支援」，取車時無須再加購套餐。其他網站預訂請查看原渠道。若門店允許在取車時臨時增加保障 Extra，該項目會在門店另行購買，可使用現金或信用卡支付。', '予約に「フル保険・補償サポート」が含まれていれば、受け取り時の追加パッケージは不要です。他サイトの予約は元のチャネルを確認してください。店舗が受け取り時の補償Extra追加を認める場合、店舗で別途購入し、現金またはクレジットカードで支払います。', 'Si la reserva incluye Full Insurance and Compensation Support no necesitas otro paquete al recoger. Si reservaste en otra web, consulta ese canal. Cuando la oficina permita añadir un Extra de protección al recoger, se compra allí por separado y se paga en efectivo o con tarjeta.', '예약에 Full Insurance and Compensation Support가 포함되어 있으면 픽업 시 추가 패키지가 필요하지 않습니다. 다른 웹사이트 예약은 해당 채널을 확인하세요. 지점에서 픽업 시 보호 Extra 추가를 허용하면 현장에서 별도 구매하고 현금 또는 신용카드로 결제합니다.'),
  ),
  question(
    'collision-damage-waiver',
    ['important'],
    text('What is the Collision Damage Waiver (CDW)?', '碰撞損害免責（CDW）是甚麼？', 'CDWとは何ですか？', '¿Qué es Collision Damage Waiver (CDW)?', 'Collision Damage Waiver(CDW)란 무엇인가요?'),
    text('CDW is an optional waiver that removes the customer\'s deductible liability for covered damage to the rental vehicle and third-party property after an accident. Exclusions and required accident procedures still apply.', 'CDW 是可選免責安排，發生受保障事故時免除客戶對租賃車輛及第三方財物損失的自負額；除外責任及必要事故程序仍然適用。', 'CDWは、事故時の対象車両・対物損害についてお客様の免責額負担を免除するオプションです。免責事項と必要な事故手続きは引き続き適用されます。', 'CDW es una exención opcional de la franquicia por daños cubiertos al vehículo y a bienes de terceros. Siguen aplicándose exclusiones y procedimientos.', 'CDW는 사고 시 보장 대상 렌터카 및 제3자 재물 손해의 고객 자기부담금을 면제하는 옵션입니다. 제외 항목과 필수 사고 절차는 계속 적용됩니다.'),
  ),
  question(
    'non-operation-charge',
    ['important'],
    text('What is the Non-Operation Charge (NOC)?', '營業損失賠償費（NOC）是甚麼？', 'ノンオペレーションチャージ（NOC）とは何ですか？', '¿Qué es el Non-Operation Charge (NOC)?', 'Non-Operation Charge(NOC)란 무엇인가요?'),
    text('When repair or cleaning is required after an accident, theft, breakdown, scratch or another cause not attributable to TrustGo, NOC compensates for loss of vehicle use during that work. ECO can waive NOC for covered cases.', '車輛因事故、失竊、故障、刮痕或其他非 TrustGo 責任原因而需維修或清潔時，NOC 用於補償停駛期間的營業損失。受保障情況下，ECO 可免除 NOC。', '事故、盗難、故障、傷などTrustGoの責任でない原因で修理・清掃が必要な場合、NOCはその期間の休車損失を補償します。対象事案ではECOにより免除されます。', 'Si hace falta reparar o limpiar por accidente, robo, avería, arañazo u otra causa no atribuible a TrustGo, el NOC compensa la pérdida de uso. ECO puede eximirlo en casos cubiertos.', '사고, 도난, 고장, 긁힘 등 TrustGo 책임이 아닌 사유로 수리나 청소가 필요하면 NOC가 그 기간의 휴차 손실을 보상합니다. 보장 대상이면 ECO가 NOC를 면제할 수 있습니다.'),
  ),
  question(
    'extra-coverage-option',
    ['important'],
    text('What is Extra Coverage Option (ECO)?', '額外保障選項（ECO）是甚麼？', 'Extra Coverage Option（ECO）とは何ですか？', '¿Qué es Extra Coverage Option (ECO)?', 'Extra Coverage Option(ECO)이란 무엇인가요?'),
    text('ECO is an additional compensation option that covers the NOC otherwise payable by the customer after an accident or breakdown. ECO is not insurance; its exclusions and customer duties remain applicable.', 'ECO 是附加補償選項，用於承擔客戶在事故或故障後原本須支付的 NOC。ECO 並非保險；除外責任及客戶義務仍然適用。', 'ECOは事故・故障時にお客様が負担するNOCを補償する追加オプションです。ECOは保険ではなく、免責事項とお客様の義務は適用されます。', 'ECO es una compensación adicional que cubre el NOC a cargo del cliente tras accidente o avería. No es un seguro; siguen las exclusiones y obligaciones.', 'ECO는 사고나 고장 후 고객이 부담하는 NOC를 보상하는 추가 옵션입니다. 보험은 아니며 제외 항목과 고객 의무가 적용됩니다.'),
  ),
];

export const rentalFeeQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'rate-calculation',
    ['rent'],
    text(
      'How is the rental price calculated, and what does the quote include?',
      '租車費用如何計算，報價包括哪些費用？',
      '料金はどのように計算され、見積には何が含まれますか？',
      '¿Cómo se calcula el precio del alquiler y qué incluye la oferta?',
      '대여 요금은 어떻게 계산되며 견적에는 무엇이 포함되나요?'
    ),
    text(
      'The rental price is calculated from the vehicle group, rental period, pickup and return dates and locations, and current availability and demand. Use the checkout price breakdown as the source: the total normally includes the listed base rate, taxes, protection and selected extras. Equipment, branch services, one-way or young-driver charges, fuel, tolls, parking, fines, cross-border arrangements or post-rental loss charges may be payable separately. Before payment, compare what is included, due today, payable at pickup and chargeable later. The confirmed booking and rental agreement provide the final applicable terms and charges.',
      '租車費用會按車型組、租期、取還車日期與地點，以及當時的供應與需求計算。請以結算頁的價格明細為準：總價通常包括已列明的基本租金、稅項、保障及已選附加服務；設備、門店服務、異地還車、年輕駕駛人、燃油、通行費、停車費、罰單、跨境安排或租後損失費用可能另付。付款前請逐項核對已包括、今日支付、取車支付及其後收費項目；最終適用條款與費用以已確認的預訂及租賃協議為準。',
      '料金は、車両クラス、利用期間、出発・返却日時と店舗、および予約時点の在庫状況や需要に基づいて計算されます。決済画面の料金内訳を確認してください。通常、表示された基本料金、税金、補償、選択したオプションが含まれます。装備、店舗サービス、ワンウェイ料金、若年運転者料金、燃料、通行料、駐車料金、反則金、越境手続き、返却後に判明した損害に関する費用は別途となる場合があります。支払い前に、料金に含まれる項目、予約時支払い、店舗支払い、後日請求の項目を確認してください。最終的な条件と料金は、確定した予約内容および貸渡契約が適用されます。',
      'El precio del alquiler se calcula según la categoría del vehículo, la duración, las fechas y lugares de recogida y devolución, y la disponibilidad y demanda del momento. Consulta el desglose del pago: el total suele incluir la tarifa base indicada, los impuestos, la protección y los extras seleccionados. El equipamiento, los servicios de la oficina, los cargos por devolución en otra oficina o conductor joven, el combustible, los peajes, el aparcamiento, las multas, los trámites transfronterizos o los daños detectados después del alquiler pueden cobrarse aparte. Antes de pagar, comprueba qué está incluido, qué se paga hoy, en la recogida o posteriormente. Se aplicarán las condiciones y cargos finales de la reserva confirmada y del contrato de alquiler.',
      '대여 요금은 차량 등급, 대여 기간, 픽업·반납 일시와 지점, 예약 시점의 재고와 수요를 기준으로 계산됩니다. 결제 화면의 가격 내역을 확인하세요. 총액에는 보통 표시된 기본 요금, 세금, 보장과 선택한 추가 서비스가 포함됩니다. 장비, 지점 서비스, 편도 또는 젊은 운전자 요금, 연료, 통행료, 주차료, 벌금, 국경 통과 관련 비용이나 대여 후 확인된 손실 비용은 별도로 청구될 수 있습니다. 결제 전에 포함 항목, 오늘 결제할 금액, 픽업 시 결제할 금액과 추후 청구 항목을 확인하세요. 최종 적용 조건과 요금은 확정된 예약 내용과 대여 계약을 따릅니다.'
    ),
  ),
  question(
    'seasonal-rates',
    ['rent'],
    text('Do rates differ depending on the rental period?', '不同租期的費用會不同嗎？', '利用期間によって料金は変わりますか？', '¿Cambian las tarifas según el periodo?', '대여 기간에 따라 요금이 달라지나요?'),
    text('Yes. Each region has regular and high seasons with different rates. The price shown for your selected dates is the applicable rate.', '會。各地區設有普通季及旺季，收費不同；所選日期顯示的價格就是適用價格。', 'はい。地域ごとに通常期とハイシーズンがあり、料金が異なります。選択した日付に表示される価格が適用されます。', 'Sí. Cada región tiene temporada normal y alta con tarifas distintas. Se aplica el precio de tus fechas.', '네. 지역별로 일반 시즌과 성수기 요금이 다릅니다. 선택한 날짜에 표시된 가격이 적용됩니다.'),
  ),
  question(
    'unlimited-distance',
    ['rent'],
    text('Does my rental have a mileage limit?', '我的租車有里程限制嗎？', '走行距離制限はありますか？', '¿Mi alquiler tiene límite de kilometraje?', '대여에 주행거리 제한이 있나요?'),
    text(
      'Check the vehicle details, booking confirmation and rental terms to see whether unlimited mileage or a daily or total limit applies. If there is a limit, the booking states the excess rate, applicable area and any exceptions. If mileage is important for a long trip, confirm it before booking rather than waiting until pickup.',
      '請在車輛詳情、訂單確認頁及租賃條款查看是否為無限里程，或設有每日／總里程上限。如有限制，訂單會列明超額計費方式、適用地區及例外情況。如計劃對里程特別敏感的長途行程，請在預訂前確認，不要等到取車後才查詢。',
      '車両詳細、予約確認、貸渡条件で、走行距離無制限か日次・総距離の上限があるか確認してください。制限がある場合は、超過料金、対象地域、例外が予約に表示されます。長距離など走行距離が重要な場合は、受取時ではなく予約前に確認してください。',
      'Revisa los detalles del vehículo, la confirmación y las condiciones para saber si el kilometraje es ilimitado o tiene un límite diario o total. Si existe un límite, la reserva indica la tarifa por exceso, el área aplicable y las excepciones. Si el kilometraje es importante para un viaje largo, confírmalo antes de reservar y no al recoger.',
      '차량 상세, 예약 확인과 대여 약관에서 무제한 주행거리인지 일일 또는 총 주행거리 제한이 있는지 확인하세요. 제한이 있으면 초과 요금 방식, 적용 지역과 예외 사항이 예약에 표시됩니다. 장거리 여행처럼 주행거리가 중요하다면 픽업 때까지 기다리지 말고 예약 전에 확인하세요.'
    ),
  ),
];

export const onlinePaymentQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'online-credit-card-payment',
    ['rent'],
    text('How does online prepayment work?', '官網線上預付如何運作？', 'オンライン事前決済はどのように行われますか？', '¿Cómo funciona el prepago en línea?', '온라인 선결제는 어떻게 진행되나요?'),
    text(
      'Bookings made on the TrustGo website are prepaid online during booking. The amount shown before payment covers the confirmed booking contents. Extras added at the branch and other amounts due at pickup are paid separately using the currency and payment methods accepted by that branch; cash is not guaranteed to be available. Check the booking terms or confirm with the pickup branch before travel. Your card issuer may also charge currency-conversion or overseas-transaction fees.',
      '透過 TrustGo 官網預訂時，須在預訂流程中完成線上預付。付款前顯示的金額涵蓋已確認的預訂內容；到店後臨時加購的 Extra 或其他取車時應付金額，須按取車門店接受的幣種和付款方式另行支付，並非所有門店都接受現金。出發前請查看訂單條款或向取車門店確認；發卡行亦可能收取匯率差額或境外交易費用。',
      'TrustGo公式サイトの予約は、予約手続き中にオンラインで事前決済します。支払い前に表示される金額は確定した予約内容を対象とします。店舗で追加したオプションや受取時に支払う金額は、その店舗が受け付ける通貨・支払い方法で別途精算します。現金を利用できるとは限りません。出発前に予約条件または受取店舗へ確認してください。カード会社による為替差額や海外取引手数料がかかる場合もあります。',
      'Las reservas en la web de TrustGo se pagan por adelantado durante la reserva. El importe mostrado cubre el contenido confirmado. Los extras añadidos en la oficina y otros importes pendientes al recoger se pagan aparte en la moneda y con los métodos aceptados por esa oficina; no se garantiza el pago en efectivo. Revisa las condiciones o confirma con la oficina antes del viaje. El emisor también puede aplicar conversión de divisa o comisiones internacionales.',
      'TrustGo 웹사이트 예약은 예약 과정에서 온라인으로 선결제합니다. 결제 전 표시 금액은 확정된 예약 내용을 포함합니다. 지점에서 추가한 옵션과 픽업 시 결제할 금액은 해당 지점이 허용하는 통화와 결제 수단으로 별도 결제하며, 현금 결제가 항상 가능한 것은 아닙니다. 출발 전에 예약 약관을 확인하거나 픽업 지점에 문의하세요. 카드사가 환율 차액이나 해외 결제 수수료를 부과할 수도 있습니다.'
    ),
  ),
  question(
    'accepted-credit-cards',
    ['rent'],
    text('What credit cards can I use?', '可以使用哪些信用卡？', 'どのクレジットカードを使えますか？', '¿Qué tarjetas puedo usar?', '어떤 신용카드를 사용할 수 있나요?'),
    text(
      'The currently supported online payment methods are shown at checkout. Use a supported card and complete any required cardholder verification. Cardholder-name, card-type, physical-card and available-credit requirements for payment or deposit at pickup vary by booking and branch; check the rental terms or confirm with the pickup branch before travel.',
      '目前支援的網上付款方式會顯示於結算頁，請使用受支援的卡片並完成所需的持卡人驗證。取車時付款或押金所適用的持卡人姓名、卡片種類、實體卡及可用額度要求，會因訂單和門店而異；出發前請查看租賃條款或向取車門店確認。',
      'オンラインで利用できる支払い方法は決済画面に表示されます。対応カードを使用し、必要な名義人認証を完了してください。受取時の支払い・デポジットに関する名義、カード種類、現物カード、利用可能額の条件は予約・店舗により異なります。出発前に貸渡条件を確認するか、受取店舗へお問い合わせください。',
      'Los métodos online admitidos se muestran en el pago. Usa una tarjeta admitida y completa la verificación requerida del titular. Los requisitos de titular, tipo de tarjeta, tarjeta física y crédito disponible para pagos o depósitos al recoger dependen de la reserva y oficina; revisa las condiciones o confírmalo antes del viaje.',
      '현재 지원되는 온라인 결제 수단은 결제 화면에 표시됩니다. 지원되는 카드를 사용하고 필요한 카드 명의자 인증을 완료하세요. 픽업 시 결제 또는 보증금의 명의, 카드 종류, 실물 카드와 가용 한도 요건은 예약과 지점마다 다르므로 출발 전에 대여 약관을 확인하거나 픽업 지점에 문의하세요.'
    ),
  ),
  question(
    'change-registered-card',
    ['manage', 'support'],
    text('Can I change the credit card registered for Online Credit Card Payment?', '可以更改網上信用卡付款已登記的卡嗎？', 'オンライン決済に登録したカードを変更できますか？', '¿Puedo cambiar la tarjeta registrada?', '온라인 결제에 등록한 카드를 변경할 수 있나요?'),
    text(
      'Before online prepayment succeeds, return to the payment step and use another supported card. After payment succeeds, the card used for that completed transaction cannot be replaced. Extras added at the branch and other amounts due at pickup are separate payments and must use the currency and payment methods accepted by the pickup branch; cash or a different card is not guaranteed to be accepted. Check the booking terms or confirm with the branch before travel, and note that the card issuer may charge currency-conversion or overseas-transaction fees.',
      '線上預付成功前，可返回付款步驟改用另一張支援的信用卡。付款成功後，該筆已完成交易的付款卡不能更換。到店後臨時加購的 Extra 或其他取車時應付金額屬另一筆付款，須使用取車門店接受的幣種和付款方式；不保證可使用現金或其他信用卡。出發前請查看訂單條款或向門店確認，並留意發卡行可能收取匯率差額或境外交易費用。',
      'オンライン事前決済が成功する前なら、決済画面に戻って別の対応カードを使えます。決済完了後、その取引に使用したカードは変更できません。店舗で追加したオプションや受取時の支払いは別決済となり、受取店舗が認める通貨・方法を利用します。現金や別カードを利用できるとは限りません。出発前に予約条件または店舗へ確認し、カード会社の為替差額・海外取引手数料にもご注意ください。',
      'Antes de que el prepago se complete, vuelve al pago y usa otra tarjeta admitida. Después no se puede sustituir la tarjeta de esa transacción. Los extras añadidos en la oficina y otros importes al recoger son pagos separados sujetos a la moneda y métodos aceptados por la oficina; no se garantiza efectivo ni otra tarjeta. Revisa las condiciones o confirma con la oficina y ten en cuenta posibles comisiones de conversión o transacción internacional.',
      '온라인 선결제가 완료되기 전에는 결제 단계로 돌아가 다른 지원 카드를 사용할 수 있습니다. 결제 완료 후에는 해당 거래에 사용한 카드를 변경할 수 없습니다. 지점 추가 옵션과 픽업 시 결제 금액은 별도 거래이며 픽업 지점이 허용하는 통화와 결제 수단을 사용해야 합니다. 현금이나 다른 카드가 항상 허용되는 것은 아닙니다. 출발 전에 예약 약관 또는 지점에 확인하고 환율 차액이나 해외 결제 수수료에도 유의하세요.'
    ),
  ),
  question(
    'cancellation-fee-receipt',
    ['manage'],
    text('Can I get a receipt for the cancellation fee?', '可以取得取消費收據嗎？', 'キャンセル料の領収書を発行できますか？', '¿Puedo obtener recibo de la tasa de cancelación?', '취소 수수료 영수증을 받을 수 있나요?'),
    text('Yes. Use the receipt attached to the email confirming completion of the cancellation-fee payment.', '可以。請使用取消費付款完成確認電郵所附的收據。', 'はい。キャンセル料の支払い完了メールに添付された領収書を利用してください。', 'Sí. Usa el recibo adjunto al correo de confirmación del pago de cancelación.', '가능합니다. 취소 수수료 결제 완료 확인 이메일에 첨부된 영수증을 이용하세요.'),
  ),
  question(
    'refund-notice-reservation-status',
    ['manage'],
    text('I received a refund notice. Has my reservation been cancelled?', '收到退款通知，預訂是否已取消？', '返金通知が届きました。予約はキャンセルされましたか？', 'Recibí un aviso de reembolso. ¿Se canceló la reserva?', '환불 알림을 받았는데 예약이 취소되었나요?'),
    text('A refund notice alone is not the booking status. It may follow a cancellation, approved refund, price adjustment or payment reversal. Check Manage Booking for the current order and refund status; if they do not match the card notice, contact support with the booking reference.', '退款通知本身不代表預訂狀態，可能由取消、已批准退款、金額調整或付款撤銷引起。請在「管理訂單」查看目前訂單及退款狀態；如與信用卡通知不一致，請帶預訂編號聯絡客服。', '返金通知だけでは予約状態を判断できません。キャンセル、承認済み返金、金額調整、決済取消に伴う場合があります。「予約管理」で注文・返金状態を確認し、カード通知と一致しない場合は予約番号を添えてサポートへ連絡してください。', 'Un aviso de reembolso no determina el estado de la reserva. Puede deberse a cancelación, reembolso aprobado, ajuste o reversión. Consulta pedido y reembolso en Gestionar reserva; si no coincide, contacta con soporte usando la referencia.', '환불 알림만으로 예약 상태를 판단할 수 없습니다. 취소, 승인된 환불, 금액 조정 또는 결제 취소로 발생할 수 있습니다. 예약 관리에서 주문과 환불 상태를 확인하고 카드 알림과 일치하지 않으면 예약 번호와 함께 지원팀에 문의하세요.'),
  ),
];

export const duringAndAfterUseQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'rental-day-requirements',
    ['important'],
    text('What is required on the day of rental?', '租車當天需要攜帶甚麼？', '利用当日に必要なものは何ですか？', '¿Qué necesito el día del alquiler?', '대여 당일 무엇이 필요한가요?'),
    text('Bring: (1) a licence valid in Japan—a 1949 Geneva International Driving Permit, an eligible foreign licence with Japanese translation, or a Japanese licence; (2) a passport if you do not hold a Japanese licence; and (3) the main driver\'s credit card.', '請攜帶：(1) 在日本有效的駕照——1949 年《日內瓦公約》國際駕照、符合資格的外國駕照及日文譯本，或日本駕照；(2) 非日本駕照持有人須帶護照；(3) 主駕駛人信用卡。', '持参物：(1) 日本で有効な免許証—1949年ジュネーブ条約国際運転免許証、対象外国免許証と日本語訳、または日本免許証、(2) 日本免許証がない場合は旅券、(3) 主運転者名義のクレジットカード。', 'Lleva: (1) permiso válido en Japón—IDP de Ginebra 1949, permiso extranjero apto con traducción o permiso japonés; (2) pasaporte si no tienes permiso japonés; y (3) tarjeta del conductor principal.', '지참물: (1) 일본에서 유효한 면허—1949년 제네바 국제운전면허증, 대상 외국 면허와 일본어 번역문 또는 일본 면허, (2) 일본 면허가 없으면 여권, (3) 주 운전자 신용카드.'),
  ),
  question(
    'refuel-before-return',
    ['support'],
    text('Do I need to refuel my vehicle?', '還車前需要加滿油嗎？', '返却前に給油が必要ですか？', '¿Debo repostar el vehículo?', '반납 전에 주유해야 하나요?'),
    text(
      'Follow the fuel policy shown in the vehicle details, booking confirmation or rental agreement. If your booking is full-to-full, refill to the required level before return and keep the fuel receipt or a photo of the gauge. Returning below the agreed level may incur the fuel difference and a refuelling service fee, which can be higher than the pump price. Do not rely only on another booking or previous rental experience.',
      '請依車輛詳情、訂單確認頁或租賃協議所列的燃油政策還車。如您的訂單採用滿油取、滿油還，請在還車前按要求加滿，並保留加油收據或油表照片。低於約定油量還車時，門店可能收取燃油差額及加油服務費，金額可高於一般油站價格。請以本次訂單列明的政策為準，不要只依據其他訂單或過往租車經驗判斷。',
      '車両詳細、予約確認、貸渡契約に記載された燃料ポリシーに従ってください。満タン返しの場合は返却前に指定量まで給油し、領収書または燃料計の写真を保管してください。指定量を下回ると、燃料差額と給油手数料が発生し、給油所価格より高くなる場合があります。他の予約や過去の利用経験だけで判断せず、今回の予約条件をご確認ください。',
      'Sigue la política de combustible indicada en los detalles del vehículo, la confirmación o el contrato. Si tu reserva es lleno-lleno, reposta hasta el nivel exigido antes de devolver y guarda el recibo o una foto del indicador. Entregar por debajo del nivel acordado puede generar el cobro del combustible y una tasa de repostaje superior al precio de la estación. No te bases solo en otra reserva o experiencia anterior.',
      '차량 상세, 예약 확인 또는 대여 계약에 표시된 연료 정책을 따르세요. 가득 주유 후 반납 조건이면 반납 전에 요구 수준까지 주유하고 영수증이나 연료 게이지 사진을 보관하세요. 약정 수준보다 적게 반납하면 연료 차액과 주유 서비스 요금이 부과되어 일반 주유소 가격보다 높을 수 있습니다. 다른 예약이나 과거 대여 경험만으로 판단하지 말고 이번 예약 조건을 확인하세요.'
    ),
  ),
  question(
    'accident-procedure',
    ['support'],
    text('What should I do if I am involved in an accident?', '發生事故時應怎樣處理？', '事故に遭った場合はどうすればよいですか？', '¿Qué hago si tengo un accidente?', '사고가 나면 어떻게 해야 하나요?'),
    text('Complete all three steps immediately: (1) give first aid and, when safe, move the rental vehicle out of traffic; (2) report the accident to police from the scene by calling 110 and obtain the police accident record; (3) contact TrustGo from the scene using the emergency support details in the rental agreement. These steps are required for insurance and compensation.', '立即完成三個步驟：(1) 救助傷者，安全時將租賃車移離車流；(2) 在現場致電 110 報警並取得警方事故記錄；(3) 在現場使用租賃合約所列的緊急支援資料聯絡 TrustGo。保險及補償要求完成全部程序。', '直ちに3つすべて行ってください。(1) 負傷者を救護し、安全なら車両を交通の妨げにならない場所へ移動、(2) 現場から110番へ通報し事故証明を取得、(3) 貸渡契約書に記載された緊急連絡先から現場でTrustGoへ連絡。保険・補償には必要です。', 'Haz los tres pasos: (1) primeros auxilios y mueve el vehículo si es seguro; (2) llama a la policía al 110 y obtén el atestado; (3) contacta con TrustGo desde el lugar usando los datos de emergencia del contrato. Son obligatorios para la cobertura.', '즉시 세 단계를 모두 진행하세요. (1) 부상자를 구호하고 안전하면 차량을 교통 흐름 밖으로 이동, (2) 현장에서 110으로 경찰 신고하고 사고 증명 확보, (3) 대여 계약서의 긴급 지원 연락처로 현장에서 TrustGo에 연락. 보험·보상을 위해 모두 필요합니다.'),
  ),
  question(
    'small-scratch-procedure',
    ['support'],
    text('Do I need to follow the accident procedure for small scratches?', '輕微刮痕也須執行事故程序嗎？', '小さな傷でも事故手続きが必要ですか？', '¿Debo seguir el procedimiento por arañazos pequeños?', '작은 긁힘에도 사고 절차가 필요한가요?'),
    text('Yes. Every incident is treated as an accident regardless of damage size, dents or third-party involvement. If the required steps are not completed, insurance and compensation may not apply and you may be responsible for the cost.', '需要。無論損壞程度、是否凹陷或有沒有第三方，所有事件均按事故處理。未完成必要程序可能導致保險及補償不適用，費用由你承擔。', 'はい。損傷の大きさ、へこみ、第三者の有無にかかわらず事故として扱います。必要手続きを行わないと保険・補償が適用されず、費用負担が生じる場合があります。', 'Sí. Todo incidente se trata como accidente, sin importar tamaño o terceros. Si no completas los pasos, la cobertura puede no aplicar y asumirás el coste.', '네. 손상 크기, 찌그러짐 또는 제3자 관련 여부와 관계없이 모든 사건은 사고로 처리됩니다. 필수 절차를 완료하지 않으면 보험·보상이 적용되지 않고 비용을 부담할 수 있습니다.'),
  ),
  question(
    'change-return-time-location',
    ['manage', 'support'],
    text('Can I change the return time or return location during the rental?', '租期內可以更改還車時間或門店嗎？', '利用中に返却時刻・店舗を変更できますか？', '¿Puedo cambiar hora u oficina de devolución?', '대여 중 반납 시간이나 지점을 변경할 수 있나요?'),
    text('Contact the pickup location before the agreed return time. Staff must check later bookings and availability before approving the change. Extra-hour and one-way fees may apply. The change is not valid until confirmed.', '請在約定還車時間前聯絡取車門店。門店須核對後續預訂及供應後才能批准，可能收取超時及異地還車費。未確認前變更不生效。', '約定返却時刻前に受け取り店舗へ連絡してください。後続予約と空き状況を確認して承認します。超過時間・ワンウェイ料金がかかる場合があります。確定するまで変更は有効ではありません。', 'Contacta antes con la oficina de recogida. Deben comprobar reservas y disponibilidad. Puede haber cargos por tiempo y one-way; no es válido hasta confirmación.', '약정 반납 시간 전에 픽업 지점에 연락하세요. 이후 예약과 재고를 확인한 뒤 승인합니다. 초과 시간 및 편도 요금이 적용될 수 있으며 확인 전에는 변경이 유효하지 않습니다.'),
  ),
];
