import type {HelpFaqLinkTarget, HelpFaqQuestionDefinition, LocaleText} from './types';

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});
const question = (id: string, links: HelpFaqLinkTarget[], prompt: LocaleText, answer: LocaleText): HelpFaqQuestionDefinition => ({
  id,
  question: prompt,
  answer,
  relatedLinks: links,
});

export const reservationDocumentQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'where-to-view-rental-terms',
    ['manage'],
    text('Where can I view the rental terms?', '如何查看租賃條款？', '貸渡条件はどこで確認できますか？', '¿Dónde puedo consultar las condiciones del alquiler?', '대여 약관은 어디에서 확인하나요?'),
    text(
      'Before booking, open Price breakdown / Rental terms on the vehicle selection page. After booking, review the confirmation email, Manage Booking and the rental agreement signed at pickup. Pay particular attention to driver and payment-card requirements, deposit, protection and excess, fuel and mileage policies, cancellation, one-way return and cross-border restrictions. Requirements vary by vehicle, branch and destination; the selected option, confirmed order and signed rental agreement take priority.',
      '完成預訂前，您可以在選車頁的「價格明細／租賃條款」查看適用規則；完成預訂後，也可在確認電郵、「管理訂單」及取車時簽署的租賃協議中再次查看。請特別留意駕照與付款卡要求、押金、保障範圍與自負額、燃油及里程政策、取消規則、異地還車或跨境駕駛限制。不同車輛、門店和目的地的要求可能不同，最終以所選方案、已確認訂單及簽署的租賃協議為準。',
      '予約前は車両選択画面の「料金内訳／貸渡条件」で確認できます。予約後は確認メール、「予約管理」、受け取り時に署名する貸渡契約で再確認してください。運転者・カード条件、デポジット、補償と免責額、燃料・走行距離、キャンセル、ワンウェイ、越境制限にご注意ください。車両、店舗、目的地により条件が異なり、選択プラン、確定注文、署名済み貸渡契約が優先されます。',
      'Antes de reservar, abre Desglose del precio / Condiciones del alquiler en la selección del vehículo. Después, consulta el correo de confirmación, Gestionar reserva y el contrato firmado al recoger. Revisa conductor y tarjeta, depósito, protección y franquicia, combustible, kilometraje, cancelación, one-way y fronteras. Prevalecen la opción elegida, el pedido confirmado y el contrato firmado.',
      '예약 전 차량 선택 페이지의 가격 내역/대여 약관에서 확인하세요. 예약 후에는 확인 이메일, 예약 관리와 픽업 시 서명한 대여 계약에서 다시 확인할 수 있습니다. 운전자와 카드 요건, 보증금, 보장과 자기부담금, 연료·주행거리, 취소, 편도 반납과 국경 이동 제한을 확인하세요. 선택 상품, 확정 주문과 서명한 대여 계약이 우선합니다.',
    ),
  ),
];

export const billingSupplementQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'deposit-purpose',
    ['support'],
    text('Why is a deposit required at pickup?', '取車時為甚麼需要支付押金？', '受取時にデポジットが必要なのはなぜですか？', '¿Por qué se exige un depósito al recoger?', '픽업 시 보증금이 필요한 이유는 무엇인가요?'),
    text(
      'The deposit is usually placed as a pre-authorisation on a payment card accepted by the pickup branch. It may cover fuel differences, late return, fines, damage, excess or other contractual charges arising during the rental. A pre-authorisation uses available credit but is not necessarily a final charge. The amount and card requirements vary by vehicle group, protection, branch and destination; check the booking terms before pickup.',
      '押金通常以預授權形式暫時凍結在取車門店接受的付款卡上，用於燃油差額、延遲還車、罰單、損失、自負額或其他合約應付項目。預授權會佔用卡片可用額度，但不一定等同於實際扣款。金額及卡片要求會因車型組、保障、門店和目的地而異；請在取車前確認訂單條款。',
      'デポジットは通常、受取店舗が認めるカードへの事前承認として設定され、燃料差額、返却遅延、反則金、損傷、免責額など契約上の費用に備えます。利用可能枠を使用しますが、最終請求とは限りません。金額とカード条件は車両クラス、補償、店舗、目的地により異なるため、受取前に予約条件をご確認ください。',
      'El depósito suele realizarse como preautorización en una tarjeta aceptada por la oficina. Puede cubrir combustible, retrasos, multas, daños, franquicia u otros cargos contractuales. Ocupa crédito disponible, pero no siempre es un cargo final. El importe y los requisitos de tarjeta dependen del vehículo, protección, oficina y destino; revisa las condiciones antes de recoger.',
      '보증금은 일반적으로 픽업 지점이 허용하는 결제 카드에 사전 승인 방식으로 설정되며 연료 차액, 지연 반납, 벌금, 손상, 자기부담금 등 계약상 비용에 대비합니다. 가용 한도를 사용하지만 실제 최종 결제와 같지는 않습니다. 금액과 카드 요건은 차량 등급, 보장, 지점과 목적지에 따라 다르므로 픽업 전에 예약 약관을 확인하세요.',
    ),
  ),
  question(
    'deposit-release',
    ['manage', 'support'],
    text('When is the deposit released?', '押金何時會解除？', 'デポジットはいつ解除されますか？', '¿Cuándo se libera el depósito?', '보증금은 언제 해제되나요?'),
    text(
      'After the vehicle is returned, inspected and has no outstanding charges, the branch releases or voids the deposit pre-authorisation. The card issuer and payment network control when the hold disappears or available credit returns, which may take days or weeks. If the issuer’s normal processing time has passed, prepare the booking reference, return receipt and last four digits of the card, contact the issuer first, then contact TrustGo support if needed.',
      '車輛正常歸還、門店完成檢查且無待結費用後，門店會解除或撤銷押金預授權。預授權消失或可用額度恢復所需時間由發卡行和支付網絡決定，可能需要數日至數週。若已超過發卡行告知的正常處理時間，請準備訂單編號、還車收據和卡片末四位，先聯絡發卡行，再按需要向 TrustGo 支援團隊查詢。',
      '車両の返却・点検が完了し未精算額がなければ、店舗はデポジットの事前承認を解除または取消します。保留表示の消去や利用可能額の回復時期はカード会社・決済ネットワークにより、数日から数週間かかる場合があります。通常期間を過ぎても反映されない場合は、予約番号、返却領収書、カード下4桁を用意してまず発行会社へ確認し、必要に応じてIXサポートへお問い合わせください。',
      'Tras devolver e inspeccionar el vehículo, si no quedan importes pendientes, la oficina libera o anula la preautorización. El emisor y la red de pago determinan cuándo desaparece la retención o vuelve el crédito, lo que puede tardar días o semanas. Si se supera el plazo habitual del emisor, prepara la referencia, el recibo de devolución y los últimos cuatro dígitos, consulta primero al emisor y después a soporte TrustGo si es necesario.',
      '차량 반납과 점검이 끝나고 미결제 금액이 없으면 지점에서 보증금 사전 승인을 해제하거나 취소합니다. 보류 표시가 사라지거나 가용 한도가 복구되는 시점은 카드사와 결제 네트워크에 따라 며칠에서 몇 주가 걸릴 수 있습니다. 카드사가 안내한 정상 처리 기간을 넘겼다면 예약 번호, 반납 영수증과 카드 끝 네 자리를 준비해 먼저 카드사에 확인한 뒤 필요하면 TrustGo 지원팀에 문의하세요.',
    ),
  ),
  question(
    'payment-declined',
    ['rent', 'support'],
    text('Why was my payment declined?', '為甚麼付款被拒絕？', '支払いが承認されないのはなぜですか？', '¿Por qué se rechazó el pago?', '결제가 거절된 이유는 무엇인가요?'),
    text(
      'Common causes include insufficient available credit, incorrect card details, a cardholder-name mismatch, blocked online or overseas use, failed 3-D Secure verification or issuer risk controls. Check the details and available balance, then try another supported card. Avoid repeated rapid attempts and contact the card issuer or TrustGo support if the problem continues.',
      '常見原因包括可用額度不足、卡片資料錯誤、持卡人姓名不一致、未開通網上或境外交易、3-D Secure 驗證失敗，或發卡行風險控制。請先核對資料與額度，再改用另一張受支援卡片；避免短時間連續重試，問題持續時請聯絡發卡行或 TrustGo 支援團隊。',
      '利用可能額不足、カード情報や名義の不一致、オンライン・海外利用制限、3-Dセキュア失敗、発行会社のリスク判定などが考えられます。情報と利用枠を確認し、別の対応カードを試してください。短時間の連続試行は避け、続く場合はカード会社またはIXサポートへ連絡してください。',
      'Las causas habituales son crédito insuficiente, datos o titular incorrectos, bloqueo de compras online o internacionales, fallo de 3-D Secure o controles del emisor. Revisa datos y saldo, prueba otra tarjeta admitida y evita intentos repetidos. Si continúa, contacta con el emisor o soporte IX.',
      '가용 한도 부족, 카드 정보 또는 명의 불일치, 온라인·해외 결제 제한, 3-D Secure 실패나 카드사 위험 통제가 흔한 원인입니다. 정보와 한도를 확인한 뒤 다른 지원 카드를 사용하세요. 짧은 시간에 반복 시도하지 말고 계속되면 카드사나 TrustGo 지원팀에 문의하세요.',
    ),
  ),
  question(
    'post-return-charge',
    ['manage', 'support'],
    text('Why is there a charge after return, and how can I dispute it?', '還車後為甚麼仍有收費？如何提出異議？', '返却後の請求はなぜ発生し、異議申立てはどうしますか？', '¿Por qué hay cargos tras devolver y cómo los impugno?', '반납 후 청구가 발생한 이유와 이의 제기 방법은 무엇인가요?'),
    text(
      'Later charges may relate to branch-added services, fuel, late return, parking, tolls, fines, cleaning, damage or administration. Compare the final invoice with the rental agreement and return record. If something appears wrong, contact TrustGo support promptly with the booking reference, invoice, pickup and return evidence, receipts and relevant written communication; never send full card details.',
      '後續收費可能涉及門店加購服務、燃油、延遲還車、停車、通行費、罰單、清潔、車損或行政費。請將最終帳單與租賃協議及還車記錄核對；如認為有誤，請盡快向 TrustGo 支援團隊提供預訂編號、帳單、取還車證據、收據及相關書面溝通，切勿提供完整卡片資料。',
      '店舗追加サービス、燃料、延滞、駐車、通行料、罰金、清掃、損傷、事務手数料などが返却後に請求される場合があります。最終請求書を契約書と返却記録に照らして確認し、誤りと思われる場合は予約番号、請求書、受取・返却証拠、領収書、書面連絡を添えて速やかにIXサポートへ連絡してください。カード情報全体は送らないでください。',
      'Los cargos posteriores pueden corresponder a extras de oficina, combustible, retraso, aparcamiento, peajes, multas, limpieza, daños o gestión. Compara la factura con contrato y devolución. Si parece incorrecto, contacta pronto con soporte TrustGo aportando referencia, factura, pruebas, recibos y comunicaciones; nunca envíes la tarjeta completa.',
      '반납 후 청구는 지점 추가 서비스, 연료, 지연 반납, 주차, 통행료, 벌금, 청소, 손상 또는 관리비일 수 있습니다. 최종 청구서를 계약과 반납 기록에 대조하세요. 오류가 의심되면 예약 번호, 청구서, 픽업·반납 증거, 영수증과 서면 대화를 TrustGo 지원팀에 신속히 제출하고 전체 카드 정보는 보내지 마세요.',
    ),
  ),
  question(
    'late-pickup-return-fees',
    ['manage', 'support'],
    text('Will late pickup or return incur extra charges?', '延遲取車或還車會產生額外費用嗎？', '受取・返却が遅れると追加料金がかかりますか？', '¿Hay cargos por recoger o devolver tarde?', '픽업 또는 반납이 늦으면 추가 요금이 발생하나요?'),
    text(
      'Usually. Out-of-hours or night service, arriving after the booked pickup time, late return or extending the rental may incur charges under the booking and branch rules. In some cases, late return may be charged as an additional day or at a new rental-period rate. If you expect to be late or cannot return on time, contact the branch as early as possible before the scheduled time and obtain confirmation; an unconfirmed delay is not automatically approved.',
      '通常會。營業時間外服務、夜間取還車、超過預約取車時間、延遲還車或續租，都可能按訂單和門店規則產生費用；遲還在部分情況下可能按額外一日或新的租期計費。若預計遲到或無法按時還車，請在原定時間前儘早聯絡門店並取得確認；未經確認的延遲不等於自動獲准。',
      '通常は追加料金が発生します。営業時間外・夜間対応、予約時刻後の受取、返却遅延、延長には予約・店舗条件に基づく料金がかかる場合があります。返却遅延が追加1日分または新しい利用期間の料金で計算されることもあります。遅れる見込みがある場合は予定時刻前にできるだけ早く店舗へ連絡し、確認を得てください。連絡のない遅延は自動承認されません。',
      'Normalmente sí. El servicio fuera de horario o nocturno, llegar después de la hora de recogida, devolver tarde o ampliar el alquiler pueden generar cargos según la reserva y la oficina. En algunos casos, la devolución tardía se cobra como un día adicional o con una nueva tarifa. Si prevés retraso, contacta cuanto antes y antes de la hora acordada para obtener confirmación; un retraso no confirmado no queda autorizado automáticamente.',
      '일반적으로 발생할 수 있습니다. 영업시간 외 또는 야간 서비스, 예약 픽업 시간 초과, 지연 반납이나 연장은 예약 및 지점 규정에 따라 요금이 부과될 수 있습니다. 일부 경우 지연 반납은 추가 하루 또는 새로운 대여 기간 요금으로 계산될 수 있습니다. 늦을 것으로 예상되거나 제때 반납할 수 없다면 예정 시간 전에 가능한 한 빨리 지점에 연락해 확인받으세요. 확인되지 않은 지연이 자동 승인되는 것은 아닙니다.',
    ),
  ),
];

export const duringRentalSupplementQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'correct-fuel-type',
    ['support'],
    text('Which type of fuel should I use?', '車輛應該加哪種燃油？', 'どの種類の燃料を給油すればよいですか？', '¿Qué tipo de combustible debo utilizar?', '어떤 종류의 연료를 주유해야 하나요?'),
    text(
      'Use only the fuel type stated in the rental agreement, inside the fuel flap, in the vehicle instructions or on the key tag. Do not guess from the vehicle’s appearance, price or experience with another vehicle. If you cannot confirm the correct fuel, contact the branch or roadside assistance before refuelling. Using the wrong fuel may cause vehicle damage and towing or cleaning charges, and may not be covered by protection.',
      '請嚴格按照租賃協議、油箱蓋內側、車輛說明或車匙標籤所列的燃油類型加油。不要根據車輛外觀、價格或其他車輛的經驗猜測；如無法確認，請在加油前聯絡門店或道路救援。錯誤燃油可能導致車輛損壞、拖車和清洗費用，且不一定受保障覆蓋。',
      '貸渡契約、給油口の内側、車両の案内、またはキータグに記載された燃料のみを使用してください。車の外観、価格、別の車の経験から推測しないでください。確認できない場合は、給油前に店舗またはロードサービスへ連絡してください。誤給油は車両の損傷、搬送・洗浄費用につながり、補償の対象外となる場合があります。',
      'Utiliza únicamente el combustible indicado en el contrato, dentro de la tapa del depósito, en las instrucciones del vehículo o en la etiqueta de la llave. No lo deduzcas por el aspecto, precio o experiencia con otro vehículo. Si no puedes confirmarlo, contacta con la oficina o asistencia antes de repostar. Un combustible incorrecto puede causar daños y gastos de remolque o limpieza que quizá no estén cubiertos.',
      '대여 계약, 주유구 덮개 안쪽, 차량 안내문 또는 키 태그에 표시된 연료만 사용하세요. 차량 외관, 가격이나 다른 차량 경험으로 추측하지 마세요. 확인할 수 없다면 주유 전에 지점 또는 긴급출동에 문의하세요. 잘못된 연료는 차량 손상, 견인 및 세척 비용을 발생시킬 수 있으며 보장 대상이 아닐 수 있습니다.',
    ),
  ),
  question(
    'wrong-fuel',
    ['support'],
    text('What should I do if I use the wrong fuel?', '加錯燃油怎麼辦？', '燃料を入れ間違えたらどうしますか？', '¿Qué hago si uso el combustible equivocado?', '잘못된 연료를 주유하면 어떻게 하나요?'),
    text(
      'Stop fuelling immediately and do not start or continue driving. From a safe place, contact roadside assistance or the pickup branch. Do not drain the tank or add another fuel yourself. Keep the receipt and follow the instructions for towing, cleaning, repair and protection eligibility.',
      '請立即停止加油，不要啟動或繼續駕駛；在安全位置聯絡道路救援或取車門店。不要自行排空油箱或混加其他燃油。請保留收據，並按指引處理拖車、清洗、維修及保障適用性。',
      '直ちに給油を止め、エンジンを始動・走行しないでください。安全な場所からロードサービスまたは受け取り店舗へ連絡し、自分で抜き取りや別燃料の追加をしないでください。領収書を保管し、搬送・洗浄・修理・補償の案内に従ってください。',
      'Deja de repostar y no arranques ni sigas conduciendo. Desde un lugar seguro, llama a asistencia o a la oficina. No vacíes el depósito ni mezcles combustible. Guarda el recibo y sigue las instrucciones sobre remolque, limpieza, reparación y cobertura.',
      '즉시 주유를 중단하고 시동을 걸거나 계속 운전하지 마세요. 안전한 곳에서 긴급출동 또는 픽업 지점에 연락하세요. 직접 연료를 빼거나 다른 연료를 섞지 말고 영수증을 보관한 뒤 견인, 세척, 수리와 보호 적용 안내를 따르세요.',
    ),
  ),
  question(
    'tolls-and-fines',
    ['support'],
    text('Who pays tolls, parking charges and fines?', '通行費、停車費及罰單由誰支付？', '通行料、駐車料金、反則金は誰が支払いますか？', '¿Quién paga peajes, aparcamiento y multas?', '통행료, 주차비와 벌금은 누가 부담하나요?'),
    text(
      'The renter is normally responsible for tolls, parking, traffic fines and related administration charges incurred during the rental. Follow the notice and payment deadline and keep proof of payment. If the branch receives or processes the notice first, the amount and a reasonable administration fee may appear later on the final invoice.',
      '租客通常須承擔租期內產生的通行費、停車費、交通罰款及相關行政費。請按通知期限處理並保留付款證明；如門店先收到或代為處理，款項及合理行政費可能稍後出現在最終帳單。',
      '利用中の通行料、駐車料金、交通反則金と関連事務手数料は通常お客様負担です。通知の期限に従って支払い、証明を保管してください。店舗が先に受領・処理した場合、金額と合理的な事務手数料が後日請求されることがあります。',
      'El arrendatario suele ser responsable de peajes, aparcamiento, multas y gestión durante el alquiler. Respeta el plazo y guarda el justificante. Si la oficina recibe o tramita primero el aviso, el importe y una tasa razonable pueden aparecer después en la factura.',
      '대여 중 발생한 통행료, 주차비, 교통 벌금과 관련 관리비는 일반적으로 대여자가 부담합니다. 통지 기한에 맞춰 처리하고 결제 증빙을 보관하세요. 지점이 먼저 통지를 받거나 처리하면 금액과 합리적인 관리비가 나중에 최종 청구서에 표시될 수 있습니다.',
    ),
  ),
];
