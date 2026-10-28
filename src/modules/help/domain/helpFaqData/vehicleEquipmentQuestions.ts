import type { HelpFaqLinkTarget, HelpFaqQuestionDefinition, LocaleText } from './types';

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({
  en,
  zh,
  ja,
  es,
  ko,
});

const question = (
  id: string,
  links: HelpFaqLinkTarget[],
  prompt: LocaleText,
  answer: LocaleText,
  referenceLinks?: Array<{ href: string; label: LocaleText }>
): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
  referenceLinks,
});

export const vehicleEquipmentQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'guaranteed-vehicle-model',
    ['rent'],
    text(
      'Can I guarantee a specific vehicle model?',
      '可以保證指定車型嗎？',
      '特定の車種・モデルを確約できますか？',
      '¿Se puede garantizar un modelo de vehículo específico?',
      '특정 차종이나 모델을 보장받을 수 있나요?'
    ),
    text(
      'Most vehicle options are sold by vehicle group (SIPP code category). The displayed brand, model, seat capacity, luggage space, and transmission describe typical configurations within that group; the actual car delivered depends on branch inventory at pickup. A specific model is guaranteed only when the rate or package explicitly displays "Guaranteed Model" or equivalent wording; vehicle exterior colour cannot be guaranteed. If passenger seating, luggage capacity, accessibility fittings, or specific powertrain types are essential to your trip, please confirm group specifications and branch availability before completing your reservation.',
      '大多數方案按「車型組」（SIPP Code 組別）出售。頁面展示的品牌、車款、座位數、行李容量和變速箱類型用於說明該組別的典型配置；實際交付車輛可能因取車當日門店庫存而有所不同。只有方案明確標示「保證車型」（Guaranteed Model）或同等含義時，才可按該說明保證指定型號；車輛顏色通常無法保證。如您有無障礙、多人行李或特殊設備等剛性需求，請在預訂前確認方案的具體配置和門店可提供情況。',
      'ほとんどのプランは「車両グループ（SIPPコード分類）」単位で販売されます。表示されるブランド、車種名、乗車定員、荷物容量、変速機は該当クラスの代表的な仕様であり、実際に配車される車両は受取当日の店舗在庫により異なる場合があります。プラン詳細に「車種確約（Guaranteed Model）」等の明記がある場合のみ特定モデルが保証され、車体色は通常ご指定いただけません。アクセシビリティ、多人数での荷物積載など特別な要件が必須の場合は、予約前に仕様と店舗在庫をご確認ください。',
      'La mayoría de las opciones se reservan por grupo de vehículos (código SIPP). La marca, modelo, plazas, capacidad de maletero y cambio mostrados describen la configuración típica del grupo; el vehículo real entregado puede variar según el stock disponible en la oficina el día de la recogida. Solo se garantiza un modelo concreto si la tarifa indica expresamente "Modelo garantizado" (Guaranteed Model); el color exterior no se puede garantizar. Si tienes requisitos indispensables de accesibilidad, equipaje voluminoso o equipamiento especial, confírmalo antes de reservar.',
      '대부분의 상품은 「차량 그룹(SIPP 코드 기준)」 단위로 판매됩니다. 화면에 표시되는 브랜드, 차종, 좌석 수, 수하물 공간 및 변속기는 해당 그룹의 대표 사양이며, 실제 배차되는 차량은 인수 당일 지점 재고 상황에 따라 달라질 수 있습니다. 요금제에 「확정 차종(Guaranteed Model)」 또는 동일한 의미가 명시된 경우에 한해 특정 모델이 보장되며, 차량 외관 색상은 지정할 수 없습니다. 휠체어 접근성, 대용량 수하물이나 특수 장비가 필수적인 경우 예약 전에 세부 사양과 지점 재고를 반드시 확인하시기 바랍니다.'
    ),
    [
      {
        href: '/{lang}/help/sipp-codes/',
        label: text(
          'View the SIPP code guide',
          '查看 SIPP Code 車型組代碼指南',
          'SIPPコードガイドを見る',
          'Ver la guía de códigos SIPP',
          'SIPP 코드 가이드 보기'
        ),
      },
    ]
  ),
  question(
    'can-reserve-extras',
    ['rent'],
    text(
      'Can I book additional equipment or extras?',
      '可以預訂附加設備嗎？',
      '追加装備やオプションを予約できますか？',
      '¿Puedo reservar equipamiento o extras adicionales?',
      '추가 장비나 옵션을 예약할 수 있나요?'
    ),
    text(
      'If the selected vehicle offers child/infant safety seats, GPS navigation, winter tyres or other additional equipment, you can add them during booking. Equipment availability is limited; fees, taxes, language, installation and payment methods may vary by branch and rate; some items are charged separately at the counter. Confirm all items appear in your price breakdown before payment. For child seats, please choose the correct type based on age, height and weight.',
      '如所選車輛提供兒童／嬰兒安全座椅、GPS 車載導航、雪胎或其他附加設備，您可在預訂時一併選擇。設備庫存有限，費用、稅項、語言、安裝及付款方式可能因門店和方案而不同；部分項目會在門店單獨收取。請在付款前確認設備已顯示在訂單明細中；兒童座椅請按兒童的年齡、身高和體重選擇合適規格。',
      '選択した車両・プランでチャイルドシート／ジュニアシート、GPS車載ナビ、スタッドレスタイヤ等の追加装備が提供されている場合、予約時に同時に選択できます。装備の在庫には限りがあり、料金、税金、言語、取付条件、支払方法は店舗やプランにより異なり、一部は店頭で別途支払う場合があります。決済前に見積明細に装備が記載されていることをご確認ください。チャイルドシートはお子様の年齢・身長・体重に適した規格をお選びください。',
      'Si el vehículo seleccionado ofrece sillitas infantiles o para bebés, navegador GPS, neumáticos de invierno u otro equipamiento adicional, puedes seleccionarlos durante la reserva. El inventario es limitado; las tarifas, impuestos, idiomas, instalación y formas de pago varían según la oficina y el plan; algunos conceptos se cobran por separado en mostrador. Comprueba que figuren en el desglose antes de pagar. En el caso de sillitas infantiles, elige el modelo adecuado según edad, altura y peso.',
      '선택한 차량에서 유아·어린이 카시트, GPS 내비게이션, 겨울 타이어 등 추가 장비가 제공되는 경우 예약 시 함께 선택할 수 있습니다. 장비 재고는 한정되어 있으며 요금, 세금, 언어, 장착 및 결제 방식은 지점과 상품에 따라 다르고 일부 항목은 지점 현장에서 별도 청구될 수 있습니다. 결제 전 주문 내역에 장비가 표시되었는지 확인하시고, 카시트는 어린이의 연령, 신장, 체중에 맞는 규격을 선택하세요.'
    )
  ),
  question(
    'extras-charges-and-payment',
    ['rent'],
    text(
      'When and where are additional equipment fees charged?',
      '附加設備何時收費、在哪裡付款？',
      '追加装備はいつ、どこで支払いますか？',
      '¿Cuándo y dónde se cobra el equipamiento adicional?',
      '추가 장비 요금은 언제, 어디서 결제하나요?'
    ),
    text(
      'Payment terms for extras depend on your selected quote. If fees are listed on the checkout page, they are usually included and confirmed with your booking; if equipment is supplied directly by the branch or added on arrival, payment may be collected separately at pickup and could require local taxes or deposit adjustments. Review the price breakdown and rental terms before confirming to understand what is prepaid and what is due at the counter.',
      '附加設備的收費方式取決於您選擇的方案。若結算頁已列明費用，通常會隨訂單一併確認；若設備由門店現場提供或臨時加購，則可能在取車時單獨支付，並可能產生當地稅費或押金。請在確認前查看價格明細和租賃協議，了解哪些項目已付、哪些項目需現場支付。',
      '追加装備のお支払い方法は選択されたプランによって異なります。決済画面に料金が明記されている場合は、原則として予約時にまとめて確定されます。店舗で直接手配される装備や当日追加購入の装備は、出発時に現地カウンターで別途支払いとなり、現地の税金やデポジットが適用される場合があります。確定前に料金明細と貸渡規約を確認し、前払い項目と現地払い項目をご確認ください。',
      'La forma de cobro del equipamiento adicional depende del plan seleccionado. Si las tarifas figuran en la página de pago, normalmente se confirman junto con la reserva; si el equipamiento lo suministra la oficina en el momento o se añade in situ, suele abonarse por separado en la recogida y puede implicar impuestos locales o fianza. Revisa el desglose y las condiciones de alquiler antes de confirmar para ver qué conceptos están pagados y cuáles se liquidan en el mostrador.',
      '추가 장비 결제 방식은 선택하신 대여 요금제에 따라 다릅니다. 결제 화면에 비용이 명시된 경우 일반적으로 예약과 함께 확정 결제됩니다. 지점 현장에서 직접 제공되거나 픽업 시 추가한 장비는 인수 시 카운터에서 별도로 결제될 수 있으며 현지 세금이나 보증금 사전 승인이 추가될 수 있습니다. 예약 확정 전 가격 내역과 대여 약관을 검토하여 선결제 항목과 현장 결제 항목을 구분해 확인하세요.'
    )
  ),
  question(
    'add-extras-on-pickup-day',
    ['rent', 'support'],
    text(
      'Can I add equipment or extras on the day of pickup?',
      '可以在取車當天增加附加設備嗎？',
      '受取当日にオプションや装備を追加できますか？',
      '¿Puedo añadir extras el mismo día de la recogida?',
      '픽업 당일 추가 장비나 옵션을 신청할 수 있나요?'
    ),
    text(
      'You may request extras at the counter, but fulfillment depends on same-day inventory, vehicle compatibility, operating hours and the selected vehicle group. Extras added on arrival may differ in price from online rates and availability cannot be guaranteed. If the equipment is essential to your journey—such as child safety seats, winter tyres, snow chains or accessibility fittings—please select them during booking and confirm prior to departure.',
      '可以向門店申請，但能否提供取決於當日庫存、車輛兼容性、門店營業安排及所選車組。臨時增加的設備可能與預訂時價格不同，也無法保證一定有貨。若該設備對行程必要，例如兒童座椅、冬季裝備或無障礙配置，請儘量在預訂時完成選擇，並在出發前確認訂單。',
      '出発店舗にリクエストすることは可能ですが、当日の在庫、車両の適合性、店舗の営業時間、選択された車両クラスによりご希望に沿えない場合があります。当日追加の装備は予約時の料金と異なる場合があり、在庫は保証されません。チャイルドシート、冬季用装備、福祉装備など旅行に不可欠な装備については、可能な限り予約時に選択し、出発前に予約内容をご確認ください。',
      'Puedes solicitarlo en la oficina, pero el suministro depende del stock del día, la compatibilidad con el vehículo, los horarios de apertura y el grupo de vehículo reservado. El equipamiento añadido el mismo día puede tener un precio distinto al de la reserva online y no se garantiza su disponibilidad. Si el equipo es imprescindible —como sillitas infantiles, equipamiento de invierno o adaptaciones de accesibilidad— selecciónalo al reservar y confírmalo antes del viaje.',
      '지점 카운터에서 신청할 수 있으나, 당일 재고 여부, 차량 호환성, 영업 일정 및 선택하신 차량 그룹에 따라 제공이 불가할 수 있습니다. 당일 현장에서 추가하는 장비는 온라인 예약 시 요금과 다를 수 있으며 재고를 보장할 수 없습니다. 카시트, 겨울철 장비, 장애인 편의 장치 등 운행에 필수적인 품목은 가급적 예약 단계에서 미리 선택하고 출발 전 예약을 확정해 두시기 바랍니다.'
    )
  ),
  question(
    'pets-in-vehicle',
    ['rent'],
    text(
      'Are pets allowed in TrustGo vehicles?',
      '可以攜帶寵物嗎？',
      '車両にペットを同乗させることはできますか？',
      '¿Se admiten mascotas en los vehículos?',
      '차량에 반려동물 동승이 가능한가요?'
    ),
    text(
      'Pet travel depends strictly on the vehicle group, branch policy and specific rental terms. Please read our Pet Travel Guide and obtain written confirmation from the pickup branch prior to booking or departure; never assume pets are permitted without prior authorization. When approved, pets must be kept in appropriate pet carriers with protective coverings to maintain vehicle cleanliness; additional cleaning or detailing fees will apply if excessive hair, odor, or soiling occurs.',
      '是否可攜帶寵物由車輛組別、門店和預訂條款共同決定。請先閱讀寵物同行指南，並在預訂前或出發前向取車門店確認；未經確認請勿默認可以攜帶。獲准攜帶時，請使用適當容器或保護措施並保持車輛清潔；如因毛髮、異味或污損需要額外處理，可能產生清潔費用。',
      'ペットの同乗可否は、車両グループ、出発店舗および貸渡規約によって個別に定められています。事前に「ペット同行ガイド」をご確認のうえ、予約前または出発前に必ず受取店舗へ確認してください。事前の確認・承認なく同乗させることはできません。承認された場合は、適切なケージや保護シートを使用し車内の清潔を維持してください。抜け毛、異臭、汚れ等による特別清掃が必要な場合、清掃費用を申し受けます。',
      'Llevar mascotas depende estrictamente del grupo de vehículo, la oficina y las condiciones de alquiler. Consulta la Guía para viajar con mascotas y confirma con la oficina de recogida antes de reservar o viajar; no asumas que está permitido sin confirmación previa. Si se autoriza, deben usarse transportines adecuados y fundas protectoras manteniendo la limpieza; cualquier necesidad de limpieza profunda por pelos, olores o manchas conllevará cargos adicionales.',
      '반려동물 동승 가능 여부는 차량 그룹, 지점 및 대여 약관에 따라 결정됩니다. 먼저 반려동물 동승 가이드를 확인하시고 예약 전 또는 출발 전에 픽업 지점에 승인을 받으셔야 하며, 사전 확인 없이 임의로 동승시켜서는 안 됩니다. 승인된 경우 반드시 전용 이동장(케이지)과 방수 보호 시트를 사용하여 차량을 청결하게 유지해야 하며, 털, 악취, 오염 등으로 특별 세차가 필요한 경우 별도의 클리닝 비용이 부과됩니다.'
    ),
    [
      {
        href: '/{lang}/help/pet-travel/',
        label: text(
          'View the pet travel guide',
          '查看寵物同行指南',
          'ペット同行ガイドを見る',
          'Ver la guía para viajar con mascotas',
          '반려동물 동승 가이드 보기'
        ),
      },
    ]
  ),
  question(
    'non-smoking-vehicle',
    ['rent'],
    text(
      'Are TrustGo vehicles non-smoking?',
      '車輛是否禁煙？',
      '車両は全車禁煙ですか？',
      '¿Todos los vehículos son para no fumadores?',
      '모든 차량은 금연 차량인가요?'
    ),
    text(
      'All TrustGo vehicles are strictly non-smoking; smoking inside the car is prohibited at all times. To prevent persistent odors, stains, and impact on future renters, please also refrain from using vaporizers, heated tobacco, electronic cigarettes, or any products that produce heavy fumes or strong scents. Violating this policy will result in comprehensive cleaning, deodorization, and vehicle downtime charges in accordance with the rental agreement.',
      'TrustGo 車輛均為禁煙車，請勿在車內吸煙。為避免異味、污損或後續清潔影響，也請避免在車內使用會產生煙霧或明顯氣味的產品（包含電子煙與加熱煙）。若違反禁煙規定，門店可能收取清潔、除味或相關處理費用，具體以租賃協議為準。',
      'TrustGoの車両は全車禁煙車です。車内での喫煙は固く禁止されています。異臭やシートの汚れ、後続のお客様への影響を防ぐため、電子タバコや加熱式タバコを含む煙や強い匂いを発する製品の使用も一切お控えください。禁煙規定に違反した場合は、貸渡約款に基づき特別脱臭・清掃費用や休車補償（NOC）を請求いたします。',
      'Todos los vehículos de TrustGo son estrictamente para no fumadores; está totalmente prohibido fumar en su interior. Para evitar olores persistentes, manchas y molestias a futuros clientes, tampoco se permite el uso de cigarrillos electrónicos, vapeadores o tabaco calentado. El incumplimiento de esta norma conllevará cargos por limpieza especial, desodorización y paralización del vehículo según el contrato de alquiler.',
      'TrustGo의 모든 대여 차량은 엄격한 금연 차량이며 차량 내 흡연은 절대 금지되어 있습니다. 냄새, 오염 방지 및 다음 대여 고객을 위해 전자담배나 가열식 담배를 포함하여 연기나 강한 냄새를 유발하는 제품의 사용도 삼가해 주십시오. 금연 규정을 위반할 경우 대여 계약서에 따라 특수 세차, 탈취 및 영업 손실 비용이 청구될 수 있습니다.'
    )
  ),
  question(
    'winter-tyres-standard',
    ['rent'],
    text(
      'Does the rental vehicle come equipped with winter tyres?',
      '車輛會配備雪胎嗎？',
      '車両にはスタッドレスタイヤが標準装備されていますか？',
      '¿El vehículo viene equipado con neumáticos de invierno?',
      '차량에 겨울 타이어(스노 타이어)가 기본 장착되어 있나요?'
    ),
    text(
      'Unless your booking confirmation or vehicle quote explicitly states "Winter tyres included", winter tyres must be treated as an optional add-on. Add them during online reservation and verify your booking confirmation before pickup; never assume a vehicle comes pre-fitted with winter tyres based merely on the winter season, vehicle model, or destination area.',
      '除非訂單確認頁或車輛詳情明確寫明「包含雪胎」，否則請將雪胎視為可選附加項目。請在付款前加入所需選項，並在取車前再次核對訂單；不要僅因季節、車型或目的地而假設車輛已經配備雪胎。',
      '予約確認画面や見積詳細に「スタッドレスタイヤ込み」と明記されていない限り、スタッドレスタイヤは有料の追加オプション品として扱われます。予約時に必ずオプションを追加し、受取前に確定予約内容を再確認してください。冬季の季節、車種、目的地の地域情報だけで、スタッドレスタイヤが標準装備されていると判断しないでください。',
      'Salvo que la confirmación o el detalle del presupuesto indique expresamente "Neumáticos de invierno incluidos", deben considerarse un extra opcional. Añádelos durante la reserva y revisa la confirmación antes de la recogida; nunca des por sentado que el coche los lleva de serie únicamente por la temporada invernal, el modelo o la zona geográfica.',
      '예약 확인서나 차량 상세 안내에 겨울 타이어 포함이라고 명시되어 있지 않은 한, 겨울 타이어는 유료 선택 옵션(Extra)으로 취급됩니다. 결제 전 필요한 옵션을 반드시 추가하시고 인수 전 예약 내역을 다시 확인하세요. 계절, 차량 모델 또는 목적지가 눈이 오는 지역이라는 이유만으로 겨울 타이어가 기본 장착되어 있을 것이라고 간주해서는 안 됩니다.'
    )
  ),
  question(
    'need-winter-tyres',
    ['rent'],
    text(
      'Do I need winter tyres when driving in winter?',
      '冬季駕駛需要雪胎嗎？',
      '冬季の運転にはスタッドレスタイヤが必要ですか？',
      '¿Son necesarios los neumáticos de invierno al conducir en invierno?',
      '겨울철 운전 시 겨울 타이어가 반드시 필요한가요?'
    ),
    text(
      'Whether winter tyres, snow chains, or winter equipment are legally required depends strictly on destination road traffic regulations, real-time meteorological conditions, and highway control orders. Check regional road alerts, mountain pass controls, and weather forecasts prior to departure; never drive onto icy, snow-covered, or legally regulated winter roads without appropriate winter equipment.',
      '是否需要雪胎、雪鏈或其他冬季裝備，應以目的地道路法規、實際天氣和路線狀況為準。出發前請查看天氣、路況與道路管制信息；若車輛未配備所需裝備，請不要駛入結冰、積雪或受限制路段。',
      'スタッドレスやタイヤチェーン、冬季装備の装着義務は、渡航先の道路交通法令、実際の気象、走行ルートの規制状況によって決まります。出発前に現地の気象予報、路面凍結情報、高速道路等のチェーン規制情報を必ずご確認ください。適切な冬季装備を備えていない車両で、凍結路・積雪路・規制対象路線へ進入することは大変危険であり法令違反となります。',
      'La necesidad legal de equipar neumáticos de invierno, cadenas o accesorios de nieve depende de las normas de tráfico del destino, la meteorología real y el estado de las vías. Consulta previsiones meteorológicas y avisos de tráfico antes de salir; no circules por calzadas con nieve, hielo o tramos restringidos sin el equipamiento adecuado.',
      '겨울 타이어, 스노 체인 등 동절기 장비 장착 필요 여부는 목적지 도로교통 법규, 실제 기상 및 운행 경로의 도로 통제 상황에 따라 결정됩니다. 출발 전 날씨 예보와 도로 통제 정보를 반드시 확인하시고, 적절한 안전 장비를 갖추지 않은 상태에서 결빙 구간, 적설 도로 또는 체인 규제 구간에 진입하지 마십시오.'
    )
  ),
  question(
    'car-navigation-system',
    ['rent'],
    text(
      'Can I add a GPS navigation system to my rental?',
      '可以選配 GPS 車載導航嗎？',
      'GPS車載カーナビを追加オプションとして選べますか？',
      '¿Puedo solicitar navegación GPS como extra?',
      'GPS 차량 내비게이션을 옵션으로 추가할 수 있나요?'
    ),
    text(
      'If GPS navigation is listed as an available Extra on the vehicle details page, you can add it during reservation; equipment availability, system language, user interface, and rental pricing depend on the selected quote. Smartphone connectivity such as Apple CarPlay or Android Auto depends on the exact model and multimedia unit provided and is not guaranteed unless explicitly specified in your confirmed booking. If a specific language or feature is required, please verify prior to payment.',
      '如車輛詳情顯示 GPS 或車載導航為可選附加設備，您可在預訂時加入；是否可提供、語言、介面及費用以所選報價為準。Apple CarPlay、Android Auto 或其他連接功能取決於實際交付車輛和設備，除非訂單明確列示，否則不作保證。需要特定語言或功能時，請在付款前確認。',
      '車両詳細画面にGPSまたは車載カーナビがオプション装備として表示されている場合、予約時に追加できます。在庫状況、対応言語、操作画面、追加料金は選択したプランによって異なります。なお、Apple CarPlayやAndroid Auto等のスマートフォン連携機能は実際に配車される車両および搭載機器の仕様に依存し、予約内容に明記されていない限り確約されません。特定の言語や機能が必要な場合は、決済前にご確認ください。',
      'Si los detalles del vehículo muestran el GPS como extra disponible, puedes añadirlo al hacer la reserva; la disponibilidad, el idioma del sistema, la interfaz y el coste dependen de la tarifa elegida. La compatibilidad con Apple CarPlay o Android Auto depende del modelo y la unidad multimedia concreta suministrada y no se garantiza salvo que conste expresamente en la reserva confirmada. Si precisas un idioma o función específica, confírmalo antes de pagar.',
      '차량 상세 페이지에서 GPS 또는 차량 내비게이션이 선택 가능한 부가 장비로 표시된 경우 예약 시 추가할 수 있습니다. 지원 여부, 안내 언어, 인터페이스 및 요금은 선택한 견적 조건에 따릅니다. Apple CarPlay나 Android Auto 등 스마트폰 연동 기능은 실제 배차 차량 및 오디오 장비에 따라 달라지며 예약서에 명시되지 않는 한 보장되지 않습니다. 특정 언어나 기능이 필수적인 경우 결제 전에 미리 확인하세요.'
    )
  ),
  question(
    'etc-card-rental',
    ['rent', 'support'],
    text(
      'Do you offer ETC card rental?',
      '提供 ETC 卡租用嗎？',
      'ETCカードのレンタルサービスはありますか？',
      '¿Ofrecen servicio de alquiler de tarjetas ETC?',
      'ETC 카드 대여 서비스를 제공하나요?'
    ),
    text(
      'Certain branches provide ETC (Electronic Toll Collection) card rental services. Check if the option is available during booking, or contact the TrustGo Support Team before checkout to confirm. Availability, rental fees, pickup procedures, and return requirements depend on the specific branch. Please note that personal ETC cards, rental ETC cards, and regional Expressway Passes are distinct products with different operational rules.',
      '部分門店可提供 ETC 卡租用服務。請在預訂時查看是否可以選擇，或在付款前聯絡 TrustGo 支援團隊確認；ETC 卡的可用性、費用、領取方式和歸還要求均取決於具體門店。請勿把個人 ETC 卡、租賃 ETC 卡和高速通行證視為同一產品。',
      '一部の店舗でETCカードの貸出サービスを行っております。予約画面で選択可能かご確認いただくか、決済前にIXサポートチームへお問い合わせください。ETCカードの在庫状況、利用料金、受取方法、返却条件は店舗ごとに異なります。なお、個人所有のETCカード、レンタルETCカード、各種高速道路乗り放題パスはそれぞれ異なるサービスですので混同されないようご注意ください。',
      'Algunas oficinas disponen de servicio de alquiler de tarjetas ETC (telepeaje electrónico). Comprueba si la opción está disponible al reservar o consulta con el equipo de soporte de TrustGo antes del pago. La disponibilidad, el importe del alquiler, el procedimiento de recogida y las condiciones de devolución dependen de cada oficina. Ten en cuenta que las tarjetas ETC personales, las de alquiler y los pases de autopista son productos diferentes.',
      '일부 지점에서 고속도로 전자통행료(ETC) 카드 대여 서비스를 제공합니다. 예약 시 선택 가능한지 확인하시거나 결제 전 TrustGo 지원팀에 문의하세요. ETC 카드의 재고, 대여 요금, 수령 및 반납 절차는 지점별로 상이합니다. 개인 소유 ETC 카드, 렌터카 전용 ETC 카드 및 고속도로 패스는 서로 다른 상품이므로 유의하시기 바랍니다.'
    )
  ),

  question(
    'universal-accessible-vehicle',
    ['support'],
    text(
      'Do you offer wheelchair-accessible or mobility-adapted vehicles?',
      '有提供無障礙車輛嗎？',
      '福祉車両や車いす対応車の取り扱いはありますか？',
      '¿Disponen de vehículos adaptados para personas con movilidad reducida?',
      '휠체어 리프트나 장애인 편의 차량을 대여할 수 있나요?'
    ),
    text(
      'Certain branch locations may provide wheelchair-accessible vehicles, swivel/lift passenger seats, or specialized mobility fittings; however, fleet availability and specifications vary widely. Please contact the TrustGo Support Team before booking with your required vehicle type, pickup and return locations, rental dates, and mobility requirements. Finalize your reservation only after availability, pricing, and handover procedures have been confirmed.',
      '部分門店可能提供輪椅無障礙車輛、升降座椅或其他特殊配置，但服務範圍與庫存並不統一。請在預訂前聯絡 TrustGo 支援團隊，並提供所需車輛類型、取還車門店、日期時間及同行人員需求；待確認可用性、費用和交接方式後再完成預訂。',
      '一部の店舗で車いす対応のスロープ付き福祉車両、昇降回転シート車などの特殊仕様車をご用意できる場合がございますが、取扱店舗や配車台数は限られております。予約手続き前にIXサポートチームへご連絡いただき、希望車種、受取・返却店舗、ご利用日時、同乗者の方のご要望をお知らせください。在庫、追加料金、受渡方法の確認が完了したうえで予約を確定してください。',
      'Algunas oficinas pueden suministrar vehículos adaptados para sillas de ruedas, asientos giratorios o elevadores y otras configuraciones especiales, aunque la disponibilidad es limitada. Contacta con el equipo de asistencia de TrustGo antes de reservar indicando el tipo de vehículo, oficinas de recogida y devolución, fechas y necesidades de movilidad. Completa la reserva una vez confirmados el stock, los costes y la entrega.',
      '일부 지점에서 휠체어 탑승 가능 차량, 전동 회전·승강 시트 등 특수 편의 사양 차량을 제공할 수 있으나, 서비스 가능 지점과 보유 수량이 한정되어 있습니다. 예약 진행 전 TrustGo 지원팀에 문의하시어 희망 차종, 픽업·반납 지점, 이용 일정 및 동승자 요구 사항을 전달해 주십시오. 재고, 추가 요금 및 차량 인계 방식을 확인받으신 후 예약을 완료하시기 바랍니다.'
    )
  ),
  question(
    'four-wheel-drive',
    ['rent'],
    text(
      'Do you offer four-wheel drive (4WD / AWD) vehicles?',
      '有提供四輪驅動車嗎？',
      '4WD（4輪駆動）の車両はありますか？',
      '¿Disponen de vehículos con tracción a las cuatro ruedas (4x4 / AWD)?',
      '4륜구동(4WD / AWD) 차량을 제공하나요?'
    ),
    text(
      'When 4WD or AWD filtering is available in search results or displayed as a vehicle attribute, you can select the corresponding group. Availability, extra charges, and drivetrain specifications depend strictly on the confirmed booking. Please be aware that 4WD does not substitute for winter tyres or snow chains, nor does it automatically grant winter road access during highway chain restrictions; proper winter equipment must still be prepared according to regional regulations.',
      '如搜尋頁或車輛詳情提供 4WD 篩選或標識，您可選擇對應車組；是否可用、額外費用及實際配置以訂單為準。請注意，四輪驅動不等同於配備雪胎、雪鏈或獲得任何冬季道路通行資格；冬季出行仍須按目的地要求準備相應裝備。',
      '検索画面や車両詳細で「4WD」の絞り込みや表示がある場合、該当する車両クラスをご選択いただけます。空車状況、追加料金、駆動方式の詳細は予約内容に準じます。なお、4WD車両であってもスタッドレスタイヤやチェーンが自動的に装着されるわけではなく、冬季のチェーン規制区間を通行できる資格を保証するものではありません。渡航先の気象条件に応じた専用の冬季装備をご準備ください。',
      'Si la búsqueda o la ficha del vehículo muestra la opción de tracción 4x4 / AWD, puedes elegir dicho grupo. La disponibilidad, suplementos y tracción real dependen de lo confirmado en la reserva. Recuerda que la tracción a las cuatro ruedas no sustituye a los neumáticos de invierno ni a las cadenas, ni autoriza automáticamente a circular por tramos de montaña con restricción invernal; debes equipar el coche según la normativa local.',
      '검색 결과나 차량 상세 페이지에서 4WD(사륜구동) 필터 또는 아이콘이 제공되는 경우 해당 차량 그룹을 선택하실 수 있습니다. 이용 가능 여부, 추가 요금 및 구동 사양은 예약서에 따릅니다. 단, 4WD 차량이라도 겨울 타이어나 스노 체인이 기본 장착되는 것은 아니며 겨울철 도로 통행 자격을 보장하지 않습니다. 동절기 운행 시에는 현지 규정에 맞춰 적합한 안전 장비를 별도로 준비하셔야 합니다.'
    )
  ),
  question(
    'automatic-transmission',
    ['rent'],
    text(
      'Can I specify an automatic transmission?',
      '可以指定自動變速箱嗎？',
      'オートマチック（AT）車を指定できますか？',
      '¿Puedo solicitar cambio automático?',
      '자동변속기(AT) 차량을 지정할 수 있나요?'
    ),
    text(
      'Passenger cars, SUVs, and minivans in our fleet are generally equipped with automatic transmissions. However, certain commercial vans, trucks, or specialty vehicles may feature manual gearboxes. Please verify the transmission indicator listed in the vehicle specifications. If an automatic transmission is essential—especially when booking cargo trucks or vans—contact the TrustGo Support Team before payment to prevent unexpected surprises at pickup.',
      '乘用車及小型客車通常為自動變速箱；部分卡車或特殊車組可能為手動變速。請以車輛詳情顯示的變速箱類型為準；若您必須使用自動變速箱，尤其是預訂卡車時，請在付款前聯絡 TrustGo 支援團隊確認，避免取車時與預期不符。',
      '乗用車、SUV、ミニバンは原則として全車オートマチック（AT）車です。ただし、一部の商用トラックや特殊車両クラスではマニュアル（MT）車の場合があります。車両詳細に表示されている変速機タイプを必ずご確認ください。トラックのご予約などAT車の配車が必須である場合は、受取時の不一致を防ぐため決済前にIXサポートチームへご確認ください。',
      'Los turismos, SUV y monovolúmenes cuentan habitualmente con transmisión automática. No obstante, ciertos camiones comerciales o vehículos especiales pueden ser manuales. Consulta el tipo de cambio indicado en la ficha del vehículo. Si el cambio automático es imprescindible —sobre todo al reservar camiones o vehículos industriales— contacta con el soporte de TrustGo antes de pagar para evitar incidencias en la recogida.',
      '일반 승용차, SUV 및 미니밴은 원칙적으로 전 차량 자동변속기(AT)입니다. 다만 일부 상용 화물 트럭이나 특수 차종은 수동변속기(MT)일 수 있습니다. 차량 상세 정보에 표기된 변속기 유형을 반드시 확인하시고, 특히 화물 트럭 예약 등 자동변속기가 필수적인 경우에는 인수 시 혼선을 방지하기 위해 결제 전 TrustGo 지원팀에 문의하시기 바랍니다.'
    )
  ),
  question(
    'winter-chain-rental',
    ['rent'],
    text(
      'Can I rent snow chains?',
      '可以租用雪鏈嗎？',
      'タイヤチェーンをレンタルできますか？',
      '¿Se pueden alquilar cadenas para la nieve?',
      '스노 체인을 대여할 수 있나요?'
    ),
    text(
      'Where snow chains are offered as an optional Extra, you can add them during reservation. Inventory, rental pricing, vehicle compatibility, and mounting guidelines are governed by branch terms. Do not attempt to install unverified aftermarket chains on rental vehicles without authorization, and check whether regional highway authorities mandate or prohibit specific chain types along your route.',
      '如車輛詳情將雪鏈列為可選選項，您可在預訂時加入；可用性、費用、適配車型與安裝要求以訂單和門店確認內容為準。請不要在未確認兼容的車輛上自行安裝雪鏈，並在出發前核對目的地是否要求或禁止特定冬季裝備。',
      '車両詳細でタイヤチェーンがオプションとして表示されている場合、予約時に追加できます。在庫、貸出料金、装着可能な適合車種、取付時の注意事項は店舗および予約確認書の内容に従います。適合が確認されていない市販チェーンをお客様自身で無断装着することはご遠慮いただき、走行ルート上で指定の滑り止め装備が義務付けられているか事前にお確かめください。',
      'Si la ficha del vehículo incluye las cadenas para la nieve como extra opcional, puedes agregarlas al reservar. La disponibilidad, el suplemento, la compatibilidad con los neumáticos y las normas de colocación se rigen por las condiciones de la oficina. No instales cadenas por tu cuenta sin verificar la compatibilidad y consulta la normativa del trayecto sobre el uso obligatorio de cadenas.',
      '차량 상세 페이지에서 스노 체인이 선택 옵션으로 제공되는 경우 예약 시 추가할 수 있습니다. 재고 여부, 대여 요금, 휠 규격 적합성 및 장착 관련 안내는 지점 정책과 예약 확인서에 따릅니다. 규격이 검증되지 않은 체인을 임의로 차량에 장착하지 마시고, 출발 전 운행 경로에 특정 동절기 장비 장착 의무화 또는 금지 규정이 있는지 확인하세요.'
    )
  ),
  question(
    'ski-carrier-rental',
    ['rent'],
    text(
      'Can I rent a ski rack or snowboard carrier?',
      '可以租用滑雪板架或滑雪架嗎？',
      'スキーキャリアやスノーボードラックをレンタルできますか？',
      '¿Puedo alquilar un portaesquís o soporte para snowboard?',
      '스키 캐리어나 스노보드 랙을 대여할 수 있나요?'
    ),
    text(
      'If ski or snowboard carriers are listed as selectable Extras, please add them during your initial reservation. Roof racks must be factory-approved and structurally compatible with the assigned vehicle model, subject to branch inventory and mounting constraints. Verify that the carrier is itemized in your confirmed booking, and never attach personal roof equipment without written consent from the branch.',
      '如訂單提供滑雪板架或雪具架選項，請在預訂時一併選擇。設備必須與實際車輛兼容，並可能受庫存、安裝和歸還要求限制；請在取車前確認訂單已列明該設備。請勿自行加裝未獲門店確認的車頂裝備。',
      'スキーキャリアやスノーボードラックがオプション選択肢にある場合は、予約時に同時にご選択ください。装備は配車される車両のルーフ形状に適合している必要があり、店舗の在庫数や取付規定によって制限される場合があります。受取前に予約確認書に明記されていることを確認し、店舗の事前承認のないルーフ装備をお客様自身で勝手に後付けすることは固く禁じられています。',
      'Si la reserva ofrece la opción de portaesquís o soportes para tablas de snowboard, selecciónalos durante el proceso de reserva. El equipamiento debe ser compatible con la estructura del vehículo y está sujeto a disponibilidad y normas de montaje; comprueba que conste en tu reserva confirmada y no montes equipamiento de techo por tu cuenta sin autorización previa de la oficina.',
      '스키 캐리어 또는 스노보드 랙 옵션이 제공되는 경우 예약 시 함께 선택해 주십시오. 루프 장비는 배차 차량과 구조적으로 완벽히 호환되어야 하며 지점의 재고 및 장착 기준에 따라 제한될 수 있습니다. 인수 전 예약 확인서에 해당 장비가 포함되어 있는지 확인하시고, 지점의 공식 승인 없이 임의의 루프 장비를 사적으로 장착하지 마십시오.'
    )
  ),
  question(
    'options-without-car',
    ['support'],
    text(
      'Can I rent optional equipment without renting a vehicle?',
      '可以不租車而單獨租用附加設備嗎？',
      '車両を借りずにオプション装備だけをレンタルできますか？',
      '¿Puedo alquilar equipamiento o extras sin alquilar un coche?',
      '차량 대여 없이 추가 장비나 옵션만 단독으로 렌탈할 수 있나요?'
    ),
    text(
      'No. Optional equipment and accessories from TrustGo are provided strictly in conjunction with an active vehicle rental booking and cannot be rented standalone. Please select any required equipment when booking your car and verify that all items appear on your confirmation prior to payment; unlisted extras cannot be guaranteed on pickup day.',
      '不可以。TrustGo 的附加設備僅隨車輛租賃訂單提供，不單獨對外出租。請在預訂車輛時一併選擇所需設備，並在付款前確認設備已列入訂單；未列出的附加服務通常不能保證在取車當天提供。',
      'できません。TrustGoが提供する追加装備やオプション品は、車両のレンタカー予約に付帯してのみ貸出を行っており、オプション単体での貸出は一切承っておりません。車両のご予約時に必要な装備を併せて選択し、決済前に予約明細に含まれていることをご確認ください。予約外の装備は受取当日にご用意できない場合がございます。',
      'No. El equipamiento opcional y los extras de TrustGo solo se suministran asociados a una reserva activa de alquiler de vehículo y no se alquilan por separado. Elige el equipamiento necesario al reservar el coche y comprueba que conste en la confirmación antes de pagar; los extras no incluidos previamente no suelen poder garantizarse en mostrador.',
      '불가능합니다. TrustGo의 모든 부가 장비 및 옵션 품목은 차량 대여 예약과 연계해서만 제공되며, 장비만을 단독으로 대여하지는 않습니다. 차량 예약 시 필요한 옵션을 함께 선택하시고 결제 전 예약 내역에 포함되어 있는지 확인하십시오. 사전에 예약되지 않은 부가 품목은 픽업 당일 현장에서 제공을 보장할 수 없습니다.'
    )
  ),
];
