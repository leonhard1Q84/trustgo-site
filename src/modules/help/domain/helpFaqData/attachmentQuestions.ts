import type {HelpFaqLinkTarget, HelpFaqQuestionDefinition, LocaleText} from './types';

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});
const question = (id: string, links: HelpFaqLinkTarget[], prompt: LocaleText, answer: LocaleText): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
});

export const attachmentQuestions = {
  making: [
    question(
      'why-provide-flight-details',
      ['manage', 'support'],
      text('Why should I provide flight details?', '為甚麼需要填寫航班資料？', 'なぜフライト情報が必要ですか？', '¿Por qué debo indicar los datos del vuelo?', '항공편 정보를 입력해야 하는 이유는 무엇인가요?'),
      text(
        'For an airport pickup, flight details help the branch estimate your arrival and understand delays. They do not guarantee that a vehicle will be held. If your flight is delayed, changed or cancelled, use the branch phone number shown in the booking details and provide the booking reference and new arrival time. Retention still depends on opening hours, availability and branch confirmation.',
        '機場取車時，航班資料可協助門店估計到達時間並了解延誤，但不代表一定保留車輛。若航班延誤、改期或取消，請使用訂單詳情中顯示的門店電話聯絡，並提供訂單編號及新的預計到達時間；能否保留仍取決於營業時間、庫存及門店確認。',
        '空港受け取りでは、フライト情報により店舗が到着予定と遅延を把握できますが、車両確保を保証するものではありません。遅延・変更・欠航時は予約詳細に表示された店舗電話番号へ予約番号と新しい到着予定を伝えてください。営業時間、在庫、店舗確認が優先されます。',
        'En recogidas en aeropuerto, el vuelo ayuda a estimar la llegada y conocer retrasos, pero no garantiza que se guarde el vehículo. Si hay retraso, cambio o cancelación, llama a la oficina con la nueva hora. Depende del horario, disponibilidad y confirmación.',
        '공항 픽업 시 항공편 정보는 지점이 도착 예정과 지연을 파악하는 데 도움이 되지만 차량 보장을 의미하지 않습니다. 지연, 변경 또는 결항 시 예약 상세에 표시된 지점 전화번호로 예약 번호와 새 도착 시간을 알리세요. 보유 여부는 영업시간, 재고와 지점 확인에 따릅니다.',
      ),
    ),
  ],
  managing: [],
  vehicles: [],
  pricing: [],
  protection: [],
  pickupReturn: [],
  travel: [
    question(
      'tolls-and-cross-border-rules',
      ['support'],
      text('Who pays tolls, and can I drive across a border?', '通行費由誰支付？可以跨境駕駛嗎？', '通行料は誰が支払い、越境運転できますか？', '¿Quién paga peajes y puedo cruzar fronteras?', '통행료는 누가 부담하며 국경을 넘을 수 있나요?'),
      text(
        'The renter normally pays tolls, parking and related administration charges. Payment may be made at the road, through an electronic device or charged later by the branch. Cross-border driving or entry into a restricted area requires advance permission; allowed destinations, documents, protection and fees depend on the pickup country and vehicle group. Do not cross a border unless the booking or branch confirmation expressly permits it.',
        '租客通常須承擔通行費、停車費及相關行政費，可能現場支付、經電子設備支付或由門店其後收取。跨境或進入受限區域須事先獲准；可前往地區、所需文件、保障及費用取決於取車國家和車型組。訂單或門店未明確允許時，請勿自行跨境。',
        '通行料、駐車料金、関連事務手数料は通常お客様負担で、現地払い、電子機器、店舗からの後日請求があります。越境や制限区域への進入は事前承認が必要で、行先、書類、補償、料金は受取国と車両グループによります。明示許可がない限り越境しないでください。',
        'El arrendatario suele pagar peajes, aparcamiento y gestión, en carretera, por dispositivo o después. Cruzar fronteras o zonas restringidas exige permiso previo; destinos, documentos, protección y costes dependen del país y vehículo.',
        '통행료, 주차비와 관련 관리비는 일반적으로 대여자가 부담하며 현장, 전자 장치 또는 지점의 사후 청구로 결제될 수 있습니다. 국경이나 제한 구역 진입은 사전 허가가 필요하며 목적지, 서류, 보장과 비용은 국가와 차량 그룹에 따릅니다.',
      ),
    ),
  ],
  support: [],
} satisfies Record<string, HelpFaqQuestionDefinition[]>;
