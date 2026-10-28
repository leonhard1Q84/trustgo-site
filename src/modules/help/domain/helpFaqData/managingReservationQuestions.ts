import { routeLanguages } from '@/i18n/locales';
import { getTranslation } from '@/i18n/translation';
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
  answer: LocaleText
): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
});

const reservationChangeGuidance = Object.fromEntries(
  routeLanguages.map((lang) => [lang, getTranslation('service_no_modification', lang)])
) as LocaleText;

export const managingReservationQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'how-to-modify-reservation',
    ['manage', 'support'],
    text(
      'How do I modify a reservation?',
      '如何修改訂單？',
      '予約を変更するにはどうすればよいですか？',
      '¿Cómo modifico una reserva?',
      '예약을 변경하려면 어떻게 해야 하나요?'
    ),
    reservationChangeGuidance
  ),
  question(
    'how-to-cancel-reservation',
    ['manage', 'support'],
    text(
      'How do I cancel a reservation?',
      '如何取消訂單？',
      '予約をキャンセルするにはどうすればよいですか？',
      '¿Cómo cancelo una reserva?',
      '예약을 취소하려면 어떻게 해야 하나요?'
    ),
    text(
      'Eligible direct bookings can be cancelled in Manage Booking. After submitting cancellation, please wait for the cancellation confirmation email or order status update; do not assume the booking is cancelled until written confirmation is received.',
      '直接預訂且符合條件的訂單可在「管理訂單」處理。提交取消後，請等待取消確認電郵或訂單狀態更新；未收到確認前，不應假設訂單已經取消。',
      '対象となる直接予約は「予約管理」でキャンセル手続きが可能です。キャンセル送信後は確認メールまたは予約ステータスの更新をお待ちください。確認が届くまではキャンセル完了と判断しないでください。',
      'Las reservas directas aptas pueden cancelarse en Gestionar reserva. Tras solicitar la cancelación, espera el correo de confirmación o la actualización del estado; no asumas que la reserva está cancelada hasta recibir dicha confirmación.',
      '직접 예약하고 취소 조건에 부합하는 예약은 \'예약 관리\'에서 취소할 수 있습니다. 취소 신청 후 취소 확인 이메일이나 주문 상태 업데이트를 기다려 주세요. 확인을 받기 전에는 예약이 취소된 것으로 간주하지 마세요.'
    )
  ),
  question(
    'cancellation-fee',
    ['manage', 'support'],
    text(
      'Will a cancellation fee be charged?',
      '取消會收取費用嗎？',
      'キャンセル料は発生しますか？',
      '¿Se cobra alguna tasa por cancelar?',
      '취소 시 수수료가 부과되나요?'
    ),
    text(
      'Whether a cancellation fee applies depends on the rate, payment method, and cancellation timing. If the booking displays free cancellation, note the deadline and corresponding time zone; exceeding the deadline, or choosing partial prepayment or pay-at-pickup plans, may incur partial or full charges. Missing pickup or failing document/payment card requirements may be treated under No-show rules. The cancellation policy on the booking confirmation takes priority.',
      '是否收取取消費用取決於訂單費率、支付方式、取消時間。若訂單顯示免費取消，請注意截止時間和對應時區；超過截止時間、部分預付或到店付方案，可能產生部分或全額費用。未按時到店、證件或付款卡不符合要求導致無法取車，也可能按未取車規則處理。請以訂單確認頁的取消政策為準。',
      'キャンセル料の有無は予約レート、決済方法、キャンセル時刻によります。無料キャンセル対象の場合は期限とタイムゾーンをご確認ください。期限超過、一部事前決済、現地払いプランでは一部または全額の費用が発生する場合があります。来店遅延、書類やカード不備で出発できない場合もノーショー扱いとなる場合があります。予約確認書のキャンセル規定をご確認ください。',
      'El cobro de gastos de cancelación depende de la tarifa, la forma de pago y el momento de cancelación. Si indica cancelación gratuita, comprueba el plazo límite y la zona horaria; superado el plazo, o en tarifas de prepago parcial/pago en destino, pueden aplicarse gastos parciales o totales. No presentarse o no cumplir requisitos de documentos/tarjeta puede tratarse como No-show. Consulta la política de tu confirmación.',
      '취소 수수료 부과 여부는 예약 요금제, 결제 방식, 취소 시점에 따라 결정됩니다. 무료 취소 상품인 경우 마감 시간과 해당 시간대를 확인하세요. 마감 시간 초과, 일부 선결제 또는 현장 결제 플랜은 일부 또는 전액 수수료가 발생할 수 있습니다. 미방문, 서류나 결제 카드 요건 미충족으로 대여하지 못할 경우에도 노쇼 규정이 적용될 수 있습니다. 예약 확인서의 취소 규정을 확인해 주세요.'
    )
  ),
  question(
    'what-is-no-show',
    ['manage', 'support'],
    text(
      'What is a No-show?',
      '什麼是未取車(no show)？',
      'ノーショー（無断不乗・未受取）とは何ですか？',
      '¿Qué es un No-show (no presentado)?',
      '노쇼(no show, 미픽업)란 무엇인가요?'
    ),
    text(
      'A No-show occurs when you fail to arrive at the pickup location at the scheduled time, or cannot be handed the vehicle due to unmet pickup conditions—such as missing documents, mismatched main driver, insufficient card limit, or failed verification. Refunds and charges for No-shows follow booking terms, and some bookings are non-refundable. If delayed, please contact the branch or TrustGo support before your scheduled pickup time.',
      '未取車(no show)是指您未在規定時間到達取車點，或因未滿足取車條件而無法交車，例如未攜帶所需證件、主駕駛人與訂單不符、付款卡額度不足或未完成資格核驗。未取車的退款與費用處理以訂單條款為準，部分訂單可能不予退款。若預計遲到，請在原定取車時間前主動聯絡門店或TrustGo 支援團隊。',
      'ノーショー（未受取）とは、指定時刻に受け取り場所へ来店されない場合、または必要書類不備、主運転者の不一致、カード限度額不足、資格確認未了などにより車両をお渡しできない状態を指します。ノーショー時の返金や費用負担は予約規約に準じ、返金不可となる場合もあります。遅れる見込みがある場合は、予約時刻前に店舗またはTrustGoサポートへご連絡ください。',
      'Un No-show (no presentado) ocurre cuando no te presentas a tiempo en el punto de recogida o no se te entrega el vehículo por incumplir los requisitos (falta de documentos, conductor distinto, crédito insuficiente o verificación incompleta). El reembolso o cargo depende de las condiciones de la reserva y puede ser no reembolsable. Si te retrasas, contacta con la oficina o soporte TrustGo antes de la hora prevista.',
      '노쇼(no show, 미픽업)는 정해진 시간에 픽업 장소에 도착하지 않거나 필수 서류 미지참, 주 운전자 불일치, 카드 한도 부족, 자격 검증 미완료 등 대여 조건을 충족하지 못해 차량을 인수받지 못하는 경우를 말합니다. 노쇼 시 환불 및 비용 처리는 예약 약관에 따르며 일부 예약은 환불되지 않을 수 있습니다. 늦어질 것으로 예상되면 기존 픽업 시간 전에 지점이나 TrustGo 지원팀에 미리 연락하세요.'
    )
  ),
  question(
    'flight-delay-or-cancellation',
    ['manage', 'support'],
    text(
      'What should I do if my flight is delayed or cancelled?',
      '航班延誤或取消了怎麼辦？',
      'フライトが遅延または欠航した場合はどうすればよいですか？',
      '¿Qué hago si mi vuelo se retrasa o cancela?',
      '항공편이 지연되거나 결항되면 어떻게 해야 하나요?'
    ),
    text(
      'If flight details were provided for your airport pickup, the branch may track delays, but this does not guarantee the vehicle will be held automatically. If your flight is delayed, rescheduled or cancelled, call the branch using the phone number shown in the booking details and provide the booking reference and new ETA. Holding the vehicle depends on opening hours, availability and branch confirmation.',
      '如您的機場取車訂單已填寫航班資訊，門店可能據此了解延誤情況，但這不表示車輛一定會自動保留。航班延誤、改簽或取消後，請儘快使用訂單詳情中顯示的電話聯絡門店，並說明訂單編號和新的預計抵達時間；能否保留車輛取決於營業時間、庫存和門店確認。',
      '空港受け取りでフライト情報を登録済みの場合、店舗側で遅延状況を把握できる場合がありますが、自動的に車両が確保されるわけではありません。遅延・変更・欠航時は予約詳細に表示された店舗電話番号へ連絡し、予約番号と新しい到着予定時刻を伝えてください。車両確保は営業時間、在庫、店舗確認によります。',
      'Si indicaste el vuelo para una recogida en aeropuerto, la oficina puede conocer el retraso, pero no garantiza que conserve el vehículo. Ante retrasos, cambios o cancelaciones, llama al número mostrado en los detalles de la reserva e indica la referencia y la nueva hora prevista. Depende del horario, disponibilidad y confirmación.',
      '공항 픽업 예약에 항공편 정보를 입력했다면 지점이 지연 상황을 확인할 수 있지만 차량이 자동 보장되지는 않습니다. 지연, 변경 또는 결항 시 예약 상세에 표시된 지점 전화번호로 예약 번호와 새 도착 예정 시간을 알리세요. 차량 보유 여부는 영업시간, 재고와 지점 확인에 따릅니다.'
    )
  ),
  question(
    'extend-rental-or-change-driver',
    ['manage', 'important'],
    text(
      'Can I extend the rental or change the main driver?',
      '可以延長租期或更換主駕駛人嗎？',
      '利用期間の延長や主運転者の変更はできますか？',
      '¿Puedo ampliar el alquiler o cambiar el conductor principal?',
      '대여 기간을 연장하거나 주 운전자를 변경할 수 있나요?'
    ),
    text(
      'Extending a rental requires contacting the branch before the original return time and depends on vehicle availability, price adjustments, and protection continuity. Changing the main driver is not a simple contact update: the new driver must fully satisfy driving licence, age, payment card, and eligibility criteria, and the contract may need to be reissued or adjusted by the branch. Do not extend the rental or allow unregistered drivers to operate the vehicle without written confirmation.',
      '延長租期須在原定還車時間前聯絡門店，並以車輛後續庫存、價格及保障延續的確認結果為準。更換主駕駛人不是簡單的資料修改：新的主駕駛人須重新滿足駕照、年齡、付款卡和其他資格要求，且可能需要由門店重新建立或調整合約。未經書面確認，請不要擅自延長租期或讓未登記人員駕駛。',
      '利用期間の延長は、当初の返却予定時刻前に店舗へ連絡し、車両の空き状況、追加料金、補償継続の確認を受ける必要があります。主運転者の変更は単なる情報変更ではなく、新しい運転者が免許・年齢・クレジットカード等の要件を再審査され、契約の再作成・調整が必要となります。書面による確認なしに無断で延長したり、未登録者に運転させたりしないでください。',
      'Para ampliar el alquiler, contacta con la oficina antes de la hora de devolución pactada, sujeto a disponibilidad, tarifas y continuidad del seguro. Cambiar de conductor principal no es una simple edición de datos: el nuevo conductor debe cumplir los requisitos de permiso, edad y tarjeta, y la oficina puede necesitar rehacer el contrato. No amplíes el alquiler ni permitas conducir a personas no autorizadas sin confirmación escrita.',
      '대여 기간 연장은 기존 반납 시간 전에 지점에 문의해야 하며 이후 차량 재고, 요금 및 보장 연장 확인 결과에 따릅니다. 주 운전자 변경은 단순 정보 수정이 아닙니다. 새 주 운전자가 면허, 연령, 결제 카드 및 기타 자격 요건을 충족해야 하며 지점에서 계약을 재작성하거나 조정해야 할 수 있습니다. 서면 확인 없이 임의로 대여 기간을 연장하거나 미등록자에게 운전하게 해서는 안 됩니다.'
    )
  ),
  question(
    'late-pickup-next-day',
    ['manage', 'support'],
    text(
      'If I cannot pick up on time, can I collect the car the next day?',
      '無法按時取車時，可以翌日取車嗎？',
      '指定時刻に受け取れない場合、翌日に受け取ることはできますか？',
      'Si no puedo recoger a tiempo, ¿puedo recoger al día siguiente?',
      '제시간에 픽업하지 못하면 다음 날 픽업할 수 있나요?'
    ),
    text(
      'Vehicles are not automatically held until the next day. If you cannot arrive on time, contact the branch or TrustGo support before your scheduled pickup time with your new estimated arrival. If you fail to contact the branch and are more than 1 hour late, your booking may be cancelled; even if the branch agrees to a next-day pickup, the vehicle, rate, and services must be reconfirmed and cannot be treated as an automatic extension.',
      '不會自動保留至翌日。若預計無法按時到店，請在原取車時間前聯絡門店或TrustGo 支援團隊，說明新的預計到店時間。若未聯絡且超過預約取車時間 1 小時仍未到店，訂單可能被取消；即使門店同意改至翌日，車輛、價格和服務也須重新由門店確認，不能視為原訂單自動延續。',
      '翌日への自動繰り越し保持はされません。予定時刻に来店できない場合は、当初の受け取り時刻前に店舗またはTrustGoサポートへ連絡し、新しい到着予定をお伝えください。連絡なく予約時刻から1時間以上経過した場合、予約はキャンセルされる可能性があります。店舗が翌日受け取りに同意した場合でも、車両・料金・サービスは再確認が必要であり、元の予約が自動継続されるわけではありません。',
      'El vehículo no se reserva automáticamente hasta el día siguiente. Si no puedes llegar a tiempo, avisa a la oficina o a soporte TrustGo antes de la hora acordada indicando tu nueva llegada. Si no avisas y transcurre más de 1 hora, la reserva puede cancelarse; aunque la oficina acepte cambiarla al día siguiente, el vehículo, precio y condiciones deben reconfirmarse y no se consideran continuación automática.',
      '다음 날까지 자동으로 보관되지 않습니다. 제시간에 방문하지 못할 경우 기존 픽업 시간 전에 지점이나 TrustGo 지원팀에 새 도착 예정 시간을 알려주세요. 연락 없이 예약 픽업 시간보다 1시간 이상 늦어지면 예약이 취소될 수 있습니다. 지점에서 다음 날 수령을 승인하더라도 차량, 요금 및 서비스는 재확인되어야 하며 기존 예약이 자동 연장되는 것으로 간주되지 않습니다.'
    )
  ),
  question(
    'upgrade-vehicle-rules',
    ['manage', 'important'],
    text(
      'Can I upgrade the vehicle?',
      '可以升級車輛嗎？',
      '車両をアップグレードできますか？',
      '¿Puedo mejorar la categoría del vehículo?',
      '차량을 업그레이드할 수 있나요?'
    ),
    reservationChangeGuidance
  ),
  question(
    'update-contact-email-or-phone',
    ['manage', 'support'],
    text(
      'How do I update my email address or phone number?',
      '如何更新電子郵件或電話號碼？',
      'メールアドレスや電話番号はどう更新しますか？',
      '¿Cómo actualizo mi correo electrónico o teléfono?',
      '이메일 주소나 전화번호는 어떻게 변경하나요?'
    ),
    text(
      'For an existing booking, please contact the TrustGo support team to update your details. After updating, ensure the new email address can receive booking, change, cancellation, and urgent notifications. Note that updating contact details is not the same as changing the main driver or payment card, which must be verified separately under booking rules.',
      '如訂單已經生成，請聯絡TrustGo 支援團隊處理。更新後，請確認新的電子郵件能夠收到訂單、變更、取消及緊急通知。請注意，變更聯絡資料不等於更換主駕駛人或付款卡，這些項目須按訂單規則另行核驗。',
      'すでに予約が確定している場合は、TrustGoサポートへご連絡ください。更新後は新しいメールアドレスで予約、変更、キャンセル、緊急通知が確実に受信できることをご確認ください。連絡先情報の変更は主運転者やクレジットカードの変更とは異なり、別途規定に基づく確認が必要となります。',
      'Si la reserva ya se ha generado, contacta con el equipo de soporte de IX. Tras actualizar, comprueba que el nuevo correo reciba confirmaciones, cambios, cancelaciones y avisos urgentes. Ten en cuenta que modificar los datos de contacto no equivale a cambiar de conductor principal ni de tarjeta, los cuales requieren verificación independiente.',
      '이미 생성된 예약인 경우 TrustGo 지원팀에 연락하여 처리해 주세요. 변경 후 새 이메일 주소로 예약, 변경, 취소 및 긴급 알림을 정상 수신할 수 있는지 확인하세요. 연락처 변경은 주 운전자나 결제 카드 변경과 동일하지 않으며 별도 규정에 따라 재확인해야 합니다.'
    )
  ),
  question(
    'refund-status-check',
    ['manage', 'support'],
    text(
      'How do I check my refund status, and how long will it take?',
      '如何查看退款狀態？退款多久能到帳？',
      '返金状況はどう確認し、着金までどのくらいかかりますか？',
      '¿Cómo consulto el reembolso y cuánto tarda en abonarse?',
      '환불 상태는 어떻게 확인하며 입금까지 얼마나 걸리나요?'
    ),
    text(
      'Refund status can be tracked in Manage Booking, your cancellation confirmation email, or the original booking platform. Approved refunds are normally returned to the original payment method, but processing time depends on the payment provider and issuing bank; a refund notice does not guarantee immediate receipt of funds. If the standard timeline has passed, prepare your booking reference, refund notice, and payment details, and contact TrustGo support.',
      '退款狀態可在訂單管理頁、取消確認電郵或原預訂平台中查看。獲批退款通常會原路退回至原付款帳戶，但到帳時間取決於支付工具和發卡行；退款通知不一定等同於已到帳。若超過該工具告知的處理時限，請準備訂單編號、退款通知和付款資料聯絡TrustGo 支援團隊查詢。',
      '返金状況は「予約管理」画面、キャンセル確認メール、または元の予約プラットフォームでご確認いただけます。承認された返金は通常元の支払い口座へ返金されますが、着金時期は決済手段およびカード発行会社によって異なります。返金通知は必ずしも即時着金を意味しません。所定の処理期間を過ぎても反映されない場合は、予約番号、返金通知、決済情報をご用意の上、TrustGoサポートへお問い合わせください。',
      'El estado del reembolso puede consultarse en Gestionar reserva, en el correo de confirmación de cancelación o en la plataforma original. El importe aprobado suele devolverse al método de pago original, pero el plazo depende del proveedor y banco emisor; el aviso no implica abono inmediato. Si se supera el plazo informado, prepara número de reserva, aviso de reembolso y datos de pago y contacta con soporte IX.',
      '환불 상태는 예약 관리 페이지, 취소 확인 이메일 또는 기존 예약 플랫폼에서 확인할 수 있습니다. 승인된 환불은 일반적으로 기존 결제 계좌로 원상 복구되지만 입금 시점은 결제 수단과 카드사에 따라 다릅니다. 환불 안내가 즉시 입금을 의미하지는 않습니다. 안내된 처리 기한을 초과한 경우 예약 번호, 환불 안내 및 결제 정보를 준비하여 TrustGo 지원팀에 문의해 주세요.'
    )
  ),
  question(
    'refund-notice-reservation-status',
    ['manage', 'support'],
    text(
      'If I receive a refund notice, is my reservation cancelled?',
      '收到退款通知，預訂是否已取消？',
      '返金通知が届いた場合、予約はキャンセルされていますか？',
      'Si recibo un aviso de reembolso, ¿está cancelada mi reserva?',
      '환불 알림을 받으면 예약이 취소된 것인가요?'
    ),
    text(
      'Not necessarily. A refund notice may indicate that the booking was cancelled, a refund was approved, the amount was adjusted, or an initial payment was voided; the notification alone does not confirm formal cancellation. Please check your latest status in Manage Booking or refer to your official cancellation confirmation email.',
      '不一定。退款通知可能表示訂單已取消、退款已獲批准、訂單金額調整，或原付款被撤銷；單憑通知無法判斷訂單是否已正式取消。請在「管理訂單」查看最新狀態，或以取消確認電郵為準。',
      '必ずしもそうとは限りません。返金通知は予約のキャンセル、返金承認、金額調整、または元決済の取り消しを示す場合があり、通知のみで正式にキャンセルされたかを断定することはできません。「予約管理」で最新のステータスを確認するか、キャンセル確認メールをご確認ください。',
      'No necesariamente. El aviso puede deberse a la cancelación de la reserva, la aprobación de un reembolso, un ajuste de importe o la anulación del pago; el aviso por sí solo no confirma la cancelación formal. Comprueba el estado actualizado en Gestionar reserva o básate en el correo oficial de cancelación.',
      '반드시 그렇지는 않습니다. 환불 알림은 예약 취소, 환불 승인, 결제 금액 조정 또는 기존 결제 승인 취소를 의미할 수 있으므로 알림만으로 예약이 공식 취소되었는지 단정할 수 없습니다. \'예약 관리\'에서 최신 상태를 확인하시거나 취소 확인 이메일을 기준으로 판단해 주세요.'
    )
  ),
];
