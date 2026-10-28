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

export const protectionLiabilityQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'order-included-protection',
    ['manage', 'important'],
    text(
      'What protection is included in my booking?',
      '我的訂單包含哪些保障？',
      '予約にはどのような補償・保険が含まれていますか？',
      '¿Qué coberturas incluye mi reserva?',
      '내 예약에는 어떤 보장 및 보험이 포함되어 있나요?'
    ),
    text(
      'Please check the protection details on your booking confirmation page and in the rental agreement signed at pickup. Pay particular attention to included coverage names, deductible/excess amounts, covered vehicles and authorized drivers, exclusions, and post-incident reporting requirements. Coverage varies by rate plan, branch, and destination; never assume all risks are covered solely based on the plan title, and always refer to the specific terms itemized in your booking.',
      '請在訂單確認頁及取車時簽署的租賃協議中核對保障內容。重點查看已包含的保障名稱、自負額、適用車輛與駕駛人、除外責任及事故後的報告要求。不同方案、門店和目的地的保障不同；請不要僅憑名稱判斷已涵蓋所有風險，最終以您訂單列明的條款為準。',
      '予約確認画面および出発時に署名する貸渡契約書で補償内容をご確認ください。含まれる補償の名称、自己負担額（免責額）、対象車両と登録運転者、免責事項（補償対象外）、事故後の報告手順を重点的にご確認ください。補償内容はプラン、店舗、国・地域によって異なります。名称だけで全リスクが補償されると判断せず、最終的には予約書に明記された条項をご確認ください。',
      'Consulta los detalles de cobertura en la página de confirmación y en el contrato de alquiler firmado en la recogida. Presta especial atención al nombre de las coberturas incluidas, importes de franquicia, vehículos y conductores autorizados, exclusiones y requisitos de notificación de siniestros. La cobertura varía según la tarifa, oficina y destino; no asumas que todos los riesgos están cubiertos solo por el nombre del paquete y guíate por los términos de tu reserva.',
      '예약 확인 페이지와 차량 인수 시 서명하는 대여 계약서에서 보장 내역을 반드시 확인하시기 바랍니다. 포함된 보장 명칭, 자기부담금(면책금), 적용 차량 및 등록 운전자 범위, 보상 제외 항목, 사고 발생 시 보고 의무를 중점적으로 검토하세요. 보장 범위는 요금제, 지점 및 여행지에 따라 상이하므로 명칭만으로 모든 위험이 보장된다고 단정하지 마시고 최종적으로 예약서에 명시된 약관을 기준으로 삼으시기 바랍니다.'
    )
  ),
  question(
    'incident-protection-procedure',
    ['support', 'important'],
    text(
      'How does protection work if an accident occurs?',
      '發生事故後，保障會怎樣處理？',
      '事故が発生した場合、補償はどのように処理されますか？',
      '¿Cómo actúa la cobertura si ocurre un accidente?',
      '사고가 발생하면 보장 처리는 어떻게 진행되나요?'
    ),
    text(
      'First ensure the personal safety of all parties and contact local emergency services if necessary; then notify the rental branch or roadside assistance as soon as possible, completing all required incident reports in accordance with local regulations and the rental agreement. Photograph the accident scene, vehicle damage, and third-party details, and preserve the police report number, payment receipts, and all written records. Even if you have purchased comprehensive coverage, never settle privately, leave the scene unauthorized, or delay reporting, as failure to follow mandatory accident protocols may invalidate protection and claim settlements.',
      '先確保人身安全，必要時聯絡當地緊急服務；隨後盡快通知租車公司或道路救援，並按當地法規和租賃協議完成必要報告。請拍攝現場、車輛及第三方資料，保留警方案件記錄、收據和所有書面溝通。即使已購買保障，也請不要私下和解、離開現場或延遲報告；未履行事故程序可能影響保障和理賠。',
      'まずは全員の人身の安全を確保し、必要に応じて現地の警察・救急へ通報してください。その後、速やかに出発店舗またはロードサービスへ連絡し、現地法令および貸渡約款に基づき必要な事故報告を行ってください。事故現場、自車・相手車両の損傷、相手方の情報を写真等で記録し、警察の事故受付番号、領収書、すべての書面連絡を保管してください。補償に加入していても、示談を行ったり、無断で現場を離れたり、報告を遅延させたりしないでください。所定の手続きを怠ると補償・保険金請求の対象外となる場合があります。',
      'Primero garantiza la seguridad personal y contacta con los servicios de emergencia si es preciso; a continuación, avisa cuanto antes a la oficina de alquiler o a la asistencia en carretera y realiza las denuncias pertinentes según la ley local y el contrato. Haz fotos del lugar, los daños del vehículo y los datos de terceros, y guarda el atestado policial, recibos y comunicaciones escritas. Aunque cuentes con cobertura contratada, nunca aceptes acuerdos amistosos privados, abandones el lugar ni demores el aviso; incumplir el protocolo de siniestro puede invalidar la cobertura.',
      '가장 먼저 탑승자의 인명 안전을 확보하고 필요한 경우 현지 긴급 구조 기관에 연락하십시오. 그 후 가능한 한 신속히 렌터카 지점이나 긴급출동 서비스에 사고를 통보하고 현지 법규 및 대여 약관에 따른 필수 신고 절차를 진행하세요. 사고 현장, 자차 및 상대 차량 파손 부위, 상대방 정보를 사진으로 기록하고 경찰 사고 접수증, 영수증 및 모든 서면 기록을 보관하십시오. 보장 상품에 가입되어 있더라도 사적인 합의, 무단 현장 이탈, 보고 지연을 절대 삼가시기 바랍니다. 필수 사고 절차를 미이행할 경우 보장 적용 및 보험 처리가 불가할 수 있습니다.'
    )
  ),
  question(
    'how-to-purchase-or-upgrade-protection',
    ['rent', 'manage'],
    text(
      'How can I purchase or upgrade protection?',
      '如何購買或升級保障？',
      '補償の購入やアップグレードはどのように行いますか？',
      '¿Cómo puedo contratar o mejorar una cobertura?',
      '보장 상품을 추가 구매하거나 업그레이드하려면 어떻게 하나요?'
    ),
    text(
      'Available protection options are displayed during vehicle selection and checkout; we recommend comparing coverage scope, deductibles, rates, and exclusions before finalizing your reservation. Certain protection tiers are available exclusively during initial booking and cannot be added or modified once the booking is confirmed; if your preferred tier is not shown, please contact the TrustGo Support Team before checkout. Before purchasing, verify whether your selected package already includes equivalent protection to avoid redundant charges.',
      '可購買的保障通常會在選車或結算步驟顯示，建議在預訂完成前比較保障範圍、自負額、價格與除外責任後再選擇。部分保障只可在預訂時購買，訂單完成後可能無法追加或變更；如頁面沒有所需方案，請在付款前聯絡 TrustGo 支援團隊確認。購買前請先檢查訂單是否已包含類似保障，以免重複支付。',
      '購入可能な補償プランは、車両選択画面または決済画面に表示されます。補償範囲、免責額、料金、免責事項を事前に比較検討したうえでお選びいただくことをおすすめします。一部の補償プランは予約時のみ追加可能で、予約確定後の追加・変更ができない場合があります。ご希望のプランが見当たらない場合は決済前にIXサポートチームへお問い合わせください。また、二重払いを防ぐため、選択済みプランに同様の補償が含まれていないか事前にご確認ください。',
      'Las opciones de cobertura disponibles se muestran durante la selección del coche y el paso de pago; conviene comparar el alcance, las franquicias, los precios y las exclusiones antes de finalizar la reserva. Determinadas coberturas solo se pueden contratar durante la reserva inicial y no pueden añadirse o cambiarse una vez confirmada; si no encuentras el plan deseado, contacta con el soporte de TrustGo antes de pagar. Revisa antes si tu tarifa ya incluye coberturas similares para no pagar dos veces.',
      '구매 가능한 보장 옵션은 차량 선택 또는 결제 단계에서 표시되며, 예약 완료 전에 보장 범위, 자기부담금, 요금 및 보상 제외 사항을 비교한 후 선택하시는 것을 권장합니다. 일부 보장 상품은 온라인 예약 시점에만 구매할 수 있으며 예약 완료 후에는 추가나 변경이 불가능할 수 있습니다. 원하는 상품이 표시되지 않는 경우 결제 전에 TrustGo 지원팀에 문의하세요. 구매 전 이미 선택한 상품에 유사한 보장이 포함되어 있는지 확인하여 중복 결제를 방지하시기 바랍니다.'
    )
  ),
  question(
    'protection-claim-documents',
    ['support', 'manage'],
    text(
      'What documents are required for a protection claim?',
      '申請保障理賠需要哪些資料？',
      '補償・保険金の請求にはどのような書類が必要ですか？',
      '¿Qué documentos se necesitan para tramitar una reclamación de cobertura?',
      '보장 보험금 청구 시 어떤 서류가 필요한가요?'
    ),
    text(
      'Claim settlement or dispute review generally requires your booking confirmation, rental agreement, driver documents, incident statement, scene and vehicle photographs, police or third-party reports, written communications with the branch, payment receipts, final invoice, and detailed damage billing sheets. Documentation requirements and submission deadlines vary by protection provider; preserve all originals immediately following an incident and submit them promptly through the designated protection contact or TrustGo Support Team. Complete documentation ensures swift and smooth claim processing.',
      '理賠或爭議處理通常需要訂單確認、租賃協議、駕駛人證件、事故說明、現場和車輛照片、警方或第三方記錄、與門店的書面溝通、付款證明、最終帳單及損壞費用文件。不同保障提供方的材料和提交期限可能不同，請在事件發生後盡早保存資料，並按訂單中列明的保障方或 TrustGo 支援團隊提交。材料越完整，處理越順利。',
      '補償請求や費用異議申し立ての手続きには、予約確認書、貸渡契約書、運転者の本人確認書類、事故状況説明書、現場および車両の写真、警察の事故証明・第三者記録、店舗との書面連絡履歴、支払証明書、最終請求書、損傷修理見積書等が必要です。必要書類や提出期限は補償引受会社によって異なりますので、事案発生後は速やかに原本を保管し、予約書記載の窓口またはIXサポートチームを通じてご提出ください。書類が揃っているほど円滑に審査が進みます。',
      'Para tramitar la reclamación o resolución de incidencias se suele requerir la confirmación de reserva, el contrato de alquiler, documentos del conductor, relato de los hechos, fotografías del lugar y del vehículo, atestado policial o informe de terceros, comunicaciones escritas con la oficina, justificantes de pago, factura final y desglose de daños. Los requisitos y plazos varían según la entidad aseguradora; conserva todos los documentos originales tras el suceso y remítelos al contacto de cobertura o al soporte de IX. Una documentación completa agiliza el trámite.',
      '보장 청구 및 분쟁 처리를 위해서는 예약 확인서, 대여 계약서, 운전자 신분·면허 서류, 사고 경위서, 현장 및 차량 파손 사진, 경찰 사고 접수 기록 또는 제3자 확인서, 지점과의 서면 대화 내역, 결제 영수증, 최종 정산 청구서 및 차량 수리 내역서가 필요합니다. 보장 제공 기관별로 요구 서류와 접수 기한이 다를 수 있으므로 사건 발생 즉시 원본을 보관하시고 예약서에 안내된 보장 담당처 또는 TrustGo 지원팀을 통해 신속히 제출하세요. 서류가 완비될수록 심사 및 처리가 원활해집니다.'
    )
  ),
  question(
    'add-protection-after-pickup',
    ['rent', 'support'],
    text(
      'Can I purchase additional protection after pickup?',
      '可以在取車後加購保障嗎？',
      '車両受取後に補償を追加購入できますか？',
      '¿Puedo contratar cobertura adicional después de recoger el coche?',
      '차량 인수 후에도 추가 보장을 가입할 수 있나요?'
    ),
    text(
      'Certain branches permit purchasing additional protection at the counter during pickup, but availability, pricing, payment methods, and coverage terms remain at the discretion of the branch and booking rules. In-person counter insurance packages may differ from online protection offerings and cannot be retroactively applied to incidents that occurred prior to addition. If comprehensive protection is a deciding factor for your journey, verify and secure your required coverage online before checkout.',
      '部分門店允許在取車時購買額外保障，但是否可購買、價格、付款方式及實際保障範圍由門店和訂單決定。現場可購買的加購保險未必與線上保障相同，也不一定可以追溯覆蓋已發生的事件。若保障是您預訂決策的重要條件，請儘量在付款前確認並保留訂單保障明細。',
      '一部の店舗では出発カウンターでの追加補償購入を受け付けておりますが、購入の可否、料金、支払方法、実際の補償範囲は店舗および予約条件によって決定されます。店頭で購入できる補償内容はオンライン提供プランと異なる場合があり、すでに出発後に発生したトラブルや事故に遡及して適用することは一切できません。補償内容が旅行計画における重要な決定要因である場合は、オンライン予約完了前に補償明細を確定・保存しておくことを強くおすすめします。',
      'Algunas oficinas permiten contratar coberturas adicionales en el mostrador en el momento de la recogida, pero la disponibilidad, tarifas, formas de pago y cobertura real dependen de la oficina y de las condiciones de la reserva. Los paquetes de mostrador pueden no coincidir con los planes online y nunca cubren de forma retroactiva siniestros ya ocurridos. Si la cobertura es un factor decisivo en tu reserva, conviene confirmarla y guardarla en el desglose online antes de pagar.',
      '일부 지점의 경우 인수 당일 카운터 현장에서 추가 보장 상품 구매를 허용할 수 있으나, 가입 가능 여부, 요금, 결제 방식 및 실제 보장 범위는 지점 재량과 예약 조건에 따라 달라집니다. 현장에서 판매하는 추가 상품은 온라인 제공 상품과 보장 내용이 다를 수 있으며, 이미 발생한 사고나 손상에 대해 소급 적용되지 않습니다. 보장 조건이 여행의 중요한 결정 요소라면 가급적 온라인 결제 완료 전에 필요한 보장 명세를 확인하고 확정해 두시기 바랍니다.'
    )
  ),
  question(
    'need-additional-insurance',
    ['rent', 'important'],
    text(
      'Do I need extra insurance on top of standard cover?',
      '基本保險以外還需要加購保險嗎？',
      '基本補償に加えて追加の保険・補償に加入する必要がありますか？',
      '¿Necesito contratar un seguro adicional además de la cobertura básica?',
      '기본 보험 외에 추가 보험에 가입해야 하나요?'
    ),
    text(
      'Review the "Protection / Price Breakdown" of your booking first to check included coverages, deductible amounts, and policy exclusions. If your confirmed booking already includes the protection tier you require, there is generally no need to purchase redundant packages suggested at the counter. While branches may offer optional local coverages, their availability, pricing, terms, and payment methods depend strictly on local branch policies. Compare coverage names, liability limits, and existing benefits before buying to avoid duplicate charges or misunderstandings.',
      '請先查看訂單的「保障／價格明細」，確認已包含的保障、自負額及除外責任。若訂單已包含您需要的保障，一般無需因現場推銷而重複購買；部分門店可能提供額外保障，但是否可購、價格、保障範圍與付款方式都須以門店和訂單為準。購買前請比較保障名稱、責任範圍與已有方案，避免重複或誤解保障內容。',
      'まずは予約内容の「補償・料金明細」を開き、すでに含まれている補償項目、自己負担額（免責額）、免責事項をご確認ください。必要な補償がすでに予約に含まれている場合は、現地の店頭勧誘に応じて同じ補償を重複購入する必要は原則としてありません。店舗独自の上位オプションが提案される場合もありますが、購入可否、料金、補償範囲、支払方法は店舗規約に準じます。購入前に補償名、責任範囲、既存プランとの違いを比較し、二重払いや補償内容の誤認を防いでください。',
      'Revisa primero el "Desglose de precios / Cobertura" de tu reserva para comprobar qué coberturas están incluidas, los importes de franquicia y las exclusiones. Si tu reserva ya incluye la protección que necesitas, no hace falta contratar duplicidades por insistencia en el mostrador. Aunque algunas oficinas ofrecen opciones complementarias, su disponibilidad, precio, alcance y pago se rigen por las condiciones locales. Compara las denominaciones, los límites de responsabilidad y tu plan actual antes de contratar para no pagar de más.',
      '먼저 예약서의 「보장 / 가격 내역」을 확인하여 이미 포함된 보장 내역, 자기부담금(면책금) 액수 및 보상 제외 사항을 살펴보십시오. 이미 원하는 보장 범위가 포함되어 있다면 지점 현장에서 권유받더라도 중복해서 추가 구매할 필요는 없습니다. 일부 지점에서 상위 부가 보장을 제공할 수 있으나, 가입 가능 여부, 비용, 보장 범위 및 결제 방식은 지점 약관에 따릅니다. 결제 전 상품 명칭, 책임 한도 및 기존 보유 혜택을 꼼꼼히 비교하시어 불필요한 중복 결제나 보장 내용의 오해를 방지하시기 바랍니다.'
    )
  ),
  question(
    'collision-damage-waiver',
    ['important'],
    text(
      'What is Collision Damage Waiver (CDW)?',
      '碰撞損害免責（CDW）是甚麼？',
      '車両・対物免責補償（CDW）とは何ですか？',
      '¿Qué es la exención de daños por colisión (CDW)?',
      '차량 충돌 손해 면책(CDW)이란 무엇인가요?'
    ),
    text(
      'Collision Damage Waiver (CDW) is an agreement that reduces your financial liability for covered accidental damage to the rental vehicle during a collision. CDW is not a total liability release: deductible/excess thresholds, policy exclusions, authorized driver restrictions, prohibited vehicle uses, and mandatory incident reporting obligations still apply. Please refer to your booking breakdown and the rental agreement signed at pickup for precise terms; you must report any incident promptly to preserve waiver coverage.',
      'CDW（碰撞損害免責）通常用於降低您在符合保障條件的碰撞事故中，對租賃車輛損失所承擔的責任。它不等同於「所有損失均免賠」：自負額、除外情形、駕駛人資格、禁止用途及事故報告義務仍可能適用。請以訂單保障明細和取車時簽署的租賃協議為準；發生事故後仍須按規定聯絡租車方並完成必要記錄。',
      'CDW（車両・対物免責補償制度）は、補償条件を満たす衝突・接触事故が発生した際、借受車両の損害に対してお客様が負担すべき免責額を減額または免除する制度です。「いかなる損害も全額免責」という意味ではなく、免責額（自己負担金）、対象外の損害（タイヤ・ガラス・車体下部等）、運転者資格、禁止用途、事故報告義務等は依然として適用されます。予約明細および出発時に署名する貸渡契約書の内容をご確認いただき、事故発生時は速やかに所定の手続きを行ってください。',
      'La exención de daños por colisión (CDW) reduce tu responsabilidad económica por daños accidentales cubiertos en el vehículo de alquiler en caso de impacto. No equivale a "cero responsabilidad absoluta": pueden seguir existiendo franquicias, exclusiones (neumáticos, lunas, bajos), restricciones de conductores autorizados, usos prohibidos y la obligación de presentar atestado. Guíate por el desglose de tu reserva y el contrato suscrito en mostrador; cualquier siniestro debe notificarse puntualmente para mantener la validez.',
      'CDW(Collision Damage Waiver, 자차손해면책)는 보장 기준을 충족하는 충돌 사고 발생 시 렌터카의 파손 손해에 대해 고객이 부담해야 하는 자기부담금을 감면하거나 면제해 주는 약정입니다. 이는 모든 손해에 대해 책임이 완전히 면제되는 전액 면책을 의미하는 것이 아니며, 자기부담금 기준, 보상 제외 항목(타이어, 유리, 하부 등), 운전자 자격 조건, 금지된 운행 용도 및 사고 신고 의무가 계속 적용됩니다. 예약 세부 내역과 현장 서명 계약서를 기준으로 확인하시고, 사고 발생 시 반드시 정해진 보고 절차를 완료해야 보장이 유지됩니다.'
    )
  ),
  question(
    'non-operation-charge',
    ['important'],
    text(
      'What is the Non-Operation Charge (NOC)?',
      '營業損失賠償費（NOC）是甚麼？',
      '休車補償料（NOC）とは何ですか？',
      '¿Qué es el cargo por paralización del vehículo (NOC)?',
      '영업 손실 배상금(NOC, 휴차보상료)이란 무엇인가요?'
    ),
    text(
      'The Non-Operation Charge (NOC) is a flat fee charged to compensate the rental company for business revenue loss during vehicle downtime while the car undergoes repairs, specialized cleaning, or recovery due to an accident, heavy soiling, theft, vandalism, or breakdown not attributable to TrustGo. NOC is not standard insurance indemnification and is not automatically waived by basic CDW protection; applicable conditions, fixed amounts, and waiver eligibility are governed by the booking terms and rental contract (primarily applicable to rentals in Japan).',
      'NOC（營業損失賠償費）是車輛因事故、污損、失竊、故障或其他非 TrustGo 責任原因而需要維修、清潔或停駛時，可能收取的營業損失費用。它不是傳統保險賠款，也不必然由一般保障自動免除；適用條件、金額及是否可減免，請以日本訂單和租賃協議為準。',
      'NOC（ノンオペレーションチャージ／休車補償料）は、事故、車両の汚損、盗難、故障など、TrustGo側の過失によらない事由により車両の修理・特別清掃が必要となり、営業車両として稼働できなくなった期間の営業損失を補填するために申し受ける定額料金です。通常の自動車保険賠償金とは異なり、一般的な基本免責補償（CDW）では自動的に免除されません。適用基準、請求金額、免除制度の有無は日本向け予約条件および貸渡約款に準じます。',
      'El Non-Operation Charge (NOC) es un suplemento por paralización que compensa a la empresa de alquiler por la pérdida de ingresos mientras el vehículo permanece inmovilizado en taller, limpieza especial o recuperación tras un accidente, suciedad grave, robo o avería no imputable a TrustGo. No es una indemnización de seguro tradicional ni queda eximido de forma automática con la cobertura CDW básica; las condiciones, importes fijos y opciones de exención se rigen por la reserva y el contrato de alquiler (frecuente en Japón).',
      'NOC(Non-Operation Charge, 휴차보상료/영업손실배상금)는 사고, 차량 오염, 도난, 고장 등 TrustGo의 귀책사유가 아닌 원인으로 인해 차량의 수리, 특수 세차 또는 회수가 필요하여 영업에 투입하지 못할 때 발생하는 영업 손실을 보전하기 위해 청구되는 정액 보상금입니다. 이는 일반적인 자동차 보험금과 성격이 다르며, 기본 자차손해면책(CDW) 가입만으로 자동 면제되지 않습니다. 적용 기준, 정액 금액 및 면제 가능 여부는 일본 지역 예약 조건 및 대여 약관에 따릅니다.'
    )
  ),
  question(
    'extra-coverage-option',
    ['important'],
    text(
      'What is the Extra Coverage Option (ECO)?',
      '額外保障選項（ECO）是甚麼？',
      '安心補償オプション（ECO）とは何ですか？',
      '¿Qué es la opción de cobertura adicional (ECO)?',
      '추가 보장 옵션(ECO)이란 무엇인가요?'
    ),
    text(
      'ECO (Extra Coverage Option) is an optional supplemental waiver package specifically designed to waive the Non-Operation Charge (NOC) that would otherwise be payable by the renter in the event of an accident or breakdown. ECO is not an all-inclusive insurance policy: general exclusions, timely police incident reporting, authorized driver rules, and customer obligations remain fully applicable. Eligibility to purchase, purchase deadlines, and the precise waiver scope are defined by your booking terms and branch contract.',
      'ECO 是與 NOC 相關的附加補償選項，可能用於在符合條件時減免您原本須支付的 NOC。ECO 不等同於全面保險，除外責任、事故報告、駕駛人資格及客戶義務仍然適用。是否可購買、何時購買及具體可減免範圍，應以訂單保障說明和門店合約為準。',
      'ECO（Extra Coverage Option）は、NOC（休車補償料）の負担免除に特化した追加の安心補償オプションであり、対象となる事故やトラブルが発生した際にお客様が負担すべきNOCを免除するものです。ECOは完全無制限の包括保険ではなく、保険適用外事項、警察への事故届出義務、運転者資格、借受人義務は通常通り適用されます。購入の可否、申込期限、具体的な免除適用範囲は予約詳細および店舗契約書の規定をご確認ください。',
      'La Extra Coverage Option (ECO) es una cobertura complementaria vinculada al NOC concebida para eximir al arrendatario del pago del suplemento por paralización en caso de accidente o avería cubierta. ECO no equivale a un seguro a todo riesgo absoluto: siguen vigentes las exclusiones legales, la obligación de declarar el accidente a la policía, los requisitos del conductor y las obligaciones contractuales. La posibilidad de contratación, los plazos y el alcance exacto de la exención se detallan en las condiciones de la reserva y en el contrato de mostrador.',
      'ECO(Extra Coverage Option)는 휴차보상료(NOC)와 직접 연계된 부가 보장 옵션으로, 보장 요건을 충족하는 사고 또는 고장 발생 시 고객이 부담해야 하는 NOC를 면제해 주는 제도입니다. ECO는 모든 상황을 보장하는 종합 무한 보험이 아니며, 보상 제외 사유, 경찰 사고 신고 의무, 등록 운전자 제한 및 대여자 준수 의무가 여전히 엄격히 적용됩니다. 가입 가능 여부, 신청 시점 및 구체적인 감면 적용 범위는 예약서 보장 안내 및 지점 계약서 약관에 따릅니다.'
    )
  ),
];
