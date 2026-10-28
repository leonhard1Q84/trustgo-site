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

export const duringRentalSupportQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'vehicle-breakdown-or-starting-failure',
    ['support'],
    text(
      'What should I do if the vehicle breaks down or fails to start?',
      '車輛發生故障或無法啟動怎麼辦？',
      '車両が故障した、またはエンジンが始動しない場合はどうすればよいですか？',
      '¿Qué debo hacer si el vehículo se avería o no arranca?',
      '차량이 고장 나거나 시동이 걸리지 않을 때는 어떻게 해야 하나요?'
    ),
    text(
      'First bring the vehicle to a stop in a safe location, activate hazard warning lights, and avoid continuing to drive any vehicle that presents safety hazards. Contact assistance using the emergency roadside support number listed in your rental agreement, booking voucher, or return receipt. If you cannot locate the emergency number, call the pickup branch directly, providing your booking reference, current vehicle location, registration plate number, and description of the malfunction. Except for immediate personal safety needs, do not attempt unauthorized repairs, engage private unapproved towing, or drive a compromised vehicle; liability for costs and protection coverage depend strictly on rental terms.',
      '請先將車輛停在安全地點，開啟必要警示並避免繼續駕駛可能存在安全風險的車輛，並使用租賃協議、訂單詳情或還車收據中的道路救援電話聯絡協助。若無法找到救援聯絡方式，請聯絡取車門店；請提供訂單編號、車輛位置、車輛牌照和故障情況。除即時安全需要外，請不要自行維修、安排非授權拖車或繼續駕駛存在安全風險的車輛，相關費用和保障適用性以合約為準。',
      'まずは車両を安全な場所に停車させ、非常点滅表示灯（ハザードランプ）を点灯させて安全確保を行い、危険が伴う状態での運転を直ちに取りやめてください。貸渡契約書、予約詳細バウチャー、または返却受領証に記載されている緊急ロードサービスの電話番号へ連絡し、指示を仰いでください。連絡先が見当たらない場合は出発店舗へ直接ご連絡いただき、予約番号、現在地、ナンバープレート、故障の具体的な症状をお伝えください。人命や即座の安全確保に必要な場合を除き、無断でご自身で修理を行ったり、未承認のレッカーを手配したり、故障車両を走行させ続けたりしないでください。費用負担および補償の適用可否は契約約款に準じます。',
      'Primero detén el vehículo en un lugar seguro, enciende las luces de emergencia y no continúes conduciendo si existe riesgo. Llama a la asistencia en carretera mediante el teléfono de urgencias que figura en tu contrato de alquiler, confirmación de reserva o recibo. Si no lo encuentras, contacta con la oficina de recogida indicando tu número de reserva, ubicación exacta, matrícula y descripción de la avería. Salvo por necesidad inmediata de seguridad, no intentes reparar el coche por tu cuenta, no contrates grúas no autorizadas ni sigas conduciendo un vehículo averiado; los gastos y coberturas se rigen por el contrato.',
      '가장 먼저 차량을 안전한 장소로 정차시키고 비상등을 점등하여 안전을 확보한 후, 안전 위험이 있는 상태에서 무리하게 운행을 지속하지 마십시오. 대여 계약서, 예약 확정 바우처 또는 반납 영수증에 기재된 전용 긴급출동(로드서비스) 전화번호로 즉시 지원을 요청하세요. 연락처를 찾기 어려운 경우 픽업 지점으로 직접 전화하여 예약 번호, 차량 위치, 차량 번호판 및 고장 증상을 전달하십시오. 긴급한 인명 안전 확보를 제외하고, 지점 승인 없이 사설 수리를 진행하거나 미인가 견인차를 부르거나 결함 차량을 계속 주행해서는 안 되며, 관련 비용 부담 및 보험 보장 적용 여부는 계약 약관에 따릅니다.'
    )
  ),
  question(
    'minor-scratches-incident-procedure',
    ['support', 'important'],
    text(
      'Do I still need to follow the accident procedure for minor scratches?',
      '輕微刮痕也須執行事故程序嗎？',
      '小さな擦り傷やへこみでも事故対応手続きが必要ですか？',
      '¿Debo seguir el protocolo de accidente incluso en caso de arañazos leves?',
      '경미한 스크래치나 긁힘도 반드시 사고 처리 절차를 진행해야 하나요?'
    ),
    text(
      'Yes, absolutely. Regardless of how slight a scratch, dent, or blemish appears, and whether or not third parties are involved, you must execute mandatory accident and damage procedures: photograph the damage alongside time, location, and scene context, notify the branch or roadside assistance as soon as possible, and complete police/incident reporting where mandated by local law. Failure to complete compulsory reporting protocols may void protection coverage and insurance settlements; never ignore, repair privately, or settle damages on your own.',
      '需要。無論損傷看起來多輕微、是否凹陷或是否涉及第三方，都請按事故／損傷流程處理：先拍照記錄時間地點和損傷，再儘快通知門店或道路救援，並按當地法規完成必要報告。未完成訂單或取車地要求的程序，可能影響保障和理賠；請不要自行忽略、修復或私下處理。',
      '必要です。傷がどれほど小さく見えても、へこみの有無や相手方の有無にかかわらず、必ず所定の事故・損傷対応手続きを行ってください。まずは日時、場所、損傷箇所が分かるように鮮明な写真を撮影し、速やかに出発店舗またはロードサービスへ連絡した上で、現地法令に基づき警察へ届出を行ってください。予約契約や渡航先の法令で定められた正規の手続きを怠った場合、補償制度や保険金支払いの適用対象外となる恐れがあります。傷を自己判断で放置したり、勝手に修理したり、現場で私的に示談することは固く禁じられています。',
      'Sí, es obligatorio. Por leve que parezca un arañazo, roce o abolladura, y con independencia de que intervengan terceros, debes aplicar el protocolo oficial de siniestros: fotografía el daño, la fecha, hora y entorno del lugar, avisa cuanto antes a la oficina o a la asistencia en carretera y tramita el atestado policial si la ley local lo exige. No cumplir los trámites obligatorios puede anular la cobertura del seguro; nunca ignores el daño, intentes arreglarlo por tu cuenta ni pactes acuerdos privados.',
      '반드시 진행해야 합니다. 손상이 아무리 경미해 보이거나 단순 긁힘이더라도, 상대방 유무와 관계없이 정해진 사고/손상 보고 절차를 따라야 합니다. 먼저 발생 일시, 장소 및 손상 부위를 사진으로 명확히 기록한 후 즉시 지점 또는 긴급출동 서비스에 알리고 현지 법규에 따른 필수 경찰 신고를 완료하십시오. 계약 약관이나 현지 법규에서 요구하는 보고 절차를 누락할 경우 보험 보장 및 면책 혜택 적용이 불가할 수 있으므로, 임의로 손상을 방치하거나 사적으로 수리하거나 당사자 간 합의를 시도해서는 안 됩니다.'
    )
  ),
  question(
    'accident-first-step',
    ['support', 'important'],
    text(
      'What is the very first step I should take if an accident occurs?',
      '發生事故時第一步該做甚麼？',
      '万が一事故に遭った場合、最初に行うべき対応は何ですか？',
      '¿Cuál es el primer paso que debo dar si ocurre un accidente?',
      '사고가 발생했을 때 가장 먼저 취해야 할 조치는 무엇인가요?'
    ),
    text(
      'The first priority is always securing human safety: render first aid, contact local emergency medical and police services if necessary, and maneuver the vehicle out of immediate hazard when safe to do so. Immediately following that, notify the rental provider or roadside assistance, file a formal police accident report in compliance with local statutory laws, photograph the accident scene, vehicle points of impact, and third-party details, and preserve all written evidence. Never accept liability, make private settlements, or flee the scene; even for minor incidents, formal reporting is required to protect your coverage.',
      '第一步是確保人身安全：必要時聯絡當地緊急服務，並在安全情況下將車輛移離危險位置。隨後立即通知租車公司或道路救援，按當地法規取得警方或相關記錄；拍攝現場、車輛和第三方資料，並保存所有書面證據。請不要私下和解、承認責任或擅自離開現場；即使損傷輕微，也應按訂單和當地規定完成報告。',
      '最優先で行うべきは全員の人身の安全確保です。必要に応じて直ちに現地の救急・警察へ緊急通報し、安全が確保できる場合は二次災害を防ぐため車両を安全な場所へ移動させてください。続いて、直ちにレンタカー会社またはロードサービスへ事故の一報を入れ、現地法令に従い警察署へ事故の届出を行い事故証明書番号を取得してください。事故現場、自車および相手車両の損傷、相手方の連絡先や保険情報を撮影・記録し、すべての書面証拠を保管してください。責任を認める発言をしたり、私的な示談を行ったり、警察を呼ばずに現場を立ち去ることは絶対にしないでください。軽微な損傷であっても正規の報告義務があります。',
      'La prioridad absoluta es garantizar la seguridad de las personas: presta auxilio, llama a los servicios médicos y policiales de urgencia si es preciso y, si es seguro, aparta el vehículo del tráfico. A continuación, avisa de inmediato a la empresa de alquiler o a la asistencia, tramita el atestado policial reglamentario, fotografía la escena, los impactos de los vehículos y los datos de la parte contraria, y conserva todas las pruebas documentales. Nunca admitas culpa, no firmes acuerdos privados ni te marches del lugar; incluso con daños mínimos, el parte oficial es indispensable.',
      '가장 먼저 최우선으로 인명의 안전을 확보해야 합니다. 필요한 경우 즉시 현지 응급구조대 및 경찰에 신고하고, 안전이 확보된 상황에서 2차 사고를 방지하기 위해 차량을 안전지대로 이동시키십시오. 그 후 즉시 렌터카 회사 또는 긴급출동 서비스에 사고 사실을 통보하고 현지 법규에 따라 경찰에 정식 사고 접수를 진행하여 사건 접수 번호를 확보하세요. 사고 현장, 자차 및 상대 차량 충돌 부위, 상대방 인적 사항을 사진으로 꼼꼼히 기록하고 모든 서면 증빙을 보관하십시오. 현장에서 과실을 인정하거나 사적인 합의를 하거나 무단으로 현장을 이탈해서는 절대 안 되며, 경미한 사고라도 정식 보고 의무를 준수해야 합니다.'
    )
  ),
  question(
    'traffic-and-parking-fines',
    ['support', 'manage'],
    text(
      'What should I do if I receive a traffic violation or parking fine?',
      '收到交通或停車罰單怎麼辦？',
      '交通違反の反則金や駐車違反切符を切られた場合はどうすればよいですか？',
      '¿Qué debo hacer si recibo una multa de tráfico o aparcamiento?',
      '교통위반 딱지나 주차위반 범칙금 고지서를 받으면 어떻게 해야 하나요?'
    ),
    text(
      'Traffic fines, parking tickets, toll violations, and associated administrative processing charges are the responsibility of the renter. Please pay fines directly following the instructions on the citation within the stipulated deadline and retain valid payment receipts. If the citation is routed directly to the rental branch or paid on your behalf by the fleet operator, the fine amount along with reasonable administrative handling fees will be charged to your payment card in post-return billing. If you believe a citation or fee was assessed in error, contact the TrustGo Support Team promptly with your booking reference, citation copy, payment receipt, and supporting evidence.',
      '交通罰單、停車費、道路收費違規及相關行政費用通常由租客承擔。請按罰單指引在期限內處理並保留付款證明；如門店先收到或代為處理，可能會在後續帳單中向您收取罰款、停車費及合理管理費。若您認為費用有誤，請儘快提供訂單編號、罰單、付款證明和相關證據聯絡 TrustGo 支援團隊。',
      '交通違反金、違法駐車反則金、有料道路通行料の未払い、およびこれらに伴う事務手数料は、原則としてお客様ご自身の負担となります。違反切符に記載された納付案内に従い、指定期日内に所定の機関（警察署・金融機関等）で納付を完了し、領収証書を必ず保管してください。店舗に違反通知が後日届いた場合や、レンタカー会社が立替納付を行った場合は、反則金相当額に加えて所定の事務管理手数料が後日クレジットカードへ請求されます。請求内容に誤りがあると思われる場合は、予約番号、違反切符、納付領収証、関連資料を添えて速やかにIXサポートチームへご連絡ください。',
      'Las sanciones de tráfico, multas de aparcamiento, peajes impagados y las tasas de gestión administrativa correspondientes corren a cargo del arrendatario. Abónalas directamente siguiendo las instrucciones de la denuncia dentro del plazo legal y guarda el resguardo de pago. Si la notificación llega a la oficina o la empresa tramita el pago en tu nombre, se te cargará el importe de la multa más un suplemento razonable de tramitación administrativa en la liquidación posterior. Si consideras que hay un error, contacta con el soporte de TrustGo facilitando número de reserva, copia de la multa, justificante de pago y alegaciones.',
      '교통위반 과태료, 불법주차 범칙금, 유료도로 통행료 미납금 및 관련 행정 처리 수수료는 대여자가 전액 부담해야 합니다. 범칙금 고지서에 기재된 납부 안내에 따라 지정된 기한 내에 관할 기관(경찰서, 금융기관 등)에 직접 납부하시고 영수증을 반드시 보관하십시오. 지점으로 위반 고지서가 전달되거나 렌터카 회사가 대납을 진행한 경우, 범칙금 원금과 함께 소정의 행정 관리 수수료가 반납 후 사후 청구됩니다. 청구 내역에 이의가 있는 경우 예약 번호, 범칙금 영수증, 결제 증빙을 구비하여 TrustGo 지원팀에 즉시 문의하시기 바랍니다.'
    )
  ),
  question(
    'post-return-payment-proof-and-invoices',
    ['manage', 'support'],
    text(
      'How do I obtain payment receipts, invoices, or proof of payment after return?',
      '還車後如何取得付款證明？',
      '返却後に領収書、インボイス、支払証明書はどのように取得できますか？',
      '¿Cómo obtengo el recibo, factura o justificante de pago tras la devolución?',
      '차량 반납 후 결제 영수증, 인보이스나 지불 증빙은 어떻게 발급받나요?'
    ),
    text(
      'Return receipts, booking invoices, and final statements all serve as valid proof of payment and corporate expense reimbursement. Always request a physical or electronic return receipt upon drop-off, and download available invoices from Manage Booking or your confirmation email. If you require a formal tax invoice, corporate header/VAT details, or supplemental financial statements, please submit a request to the TrustGo Support Team. We strongly recommend preserving your pickup rental agreement, handover return sheet, and final closing invoice together until all accounts are fully settled.',
      '還車收據、訂單發票和最終帳單均可作為付款或報銷證明。請在還車時向門店索取收據，並在訂單管理頁或確認郵件中下載可用文件；如需正式發票、公司抬頭或補充資料，請向 TrustGo 支援團隊申請。建議將取車合約、還車收據和最終帳單一併保存至費用完全結清。',
      '返却受領証（レシート）、予約インボイス、最終精算書はいずれも公的な支払証明や経費精算書類としてご利用いただけます。車両返却時に店頭で必ず返却受領証を受け取り、「予約管理」画面または予約確認メールから利用可能なPDF書類をダウンロードしてください。会社名義の宛名（インボイス）や所定の税務書類、明細の追加発行が必要な場合は、返却後にIXサポートチームへご申請ください。すべての精算が完全に完了するまで、出発時の貸渡契約書、返却票、最終請求書を一括して大切に保管してください。',
      'El recibo de devolución, la factura de la reserva y el desglose de liquidación final sirven como justificante de pago para reembolsos y contabilidad. Solicita siempre el recibo de entrega en la oficina y descarga los documentos disponibles en Gestionar reserva o desde tu correo de confirmación. Si precisas factura fiscal oficial con datos de empresa/CIF o documentación complementaria, solicítala al soporte de IX. Te aconsejamos conservar juntos el contrato de recogida, el acta de devolución y la factura final hasta el cierre definitivo.',
      '차량 반납 영수증, 예약 인보이스 및 최종 정산서는 공식적인 지불 증빙 및 회사 경비 정산 자료로 활용하실 수 있습니다. 차량 반납 시 카운터에서 반드시 반납 영수증을 수령하시고, 「예약 관리」 페이지 또는 확인 이메일에서 제공되는 전자 문서를 다운로드하세요. 회사 법인명 영수증, 세금계산서 또는 추가 증빙이 필요한 경우 반납 후 TrustGo 지원팀에 발급을 신청하시기 바랍니다. 모든 비용 정산이 최종 종결될 때까지 인수 계약서, 반납 점검표, 최종 정산 영수증을 한곳에 보관하시는 것을 권장합니다.'
    )
  ),
  question(
    'dispute-post-return-charges',
    ['support', 'manage'],
    text(
      'What should I do if I dispute unexpected charges after returning the vehicle?',
      '我不同意還車後的收費怎麼辦？',
      '返却後の請求内容に納得がいかない（異議がある）場合はどうすればよいですか？',
      '¿Qué hago si no estoy de acuerdo con un cargo posterior a la devolución?',
      '차량 반납 후 청구된 금액에 동의하지 않는 경우 어떻게 해야 하나요?'
    ),
    text(
      'First cross-examine the itemized final invoice against your rental agreement and selected services, verifying each billing item, timestamp, and amount. If you believe you were charged incorrectly, submit a formal dispute through the TrustGo Support Team as soon as possible, attaching your booking reference, pickup and return inspection sheets, timestamped vehicle photos/videos, refuelling fuel receipts, police/incident documents, card charge statements, and written communications with the branch. Keep all original physical and digital evidence throughout the investigation rather than relying solely on verbal claims.',
      '請先核對最終帳單、租賃協議和已選服務，確認費用的項目、日期和金額。若認為收費有誤，請儘快透過 TrustGo 支援團隊提交異議，並附上訂單編號、取還車記錄、車輛照片／影片、燃油小票、事故或警方文件、帳單和與門店的書面溝通。請在爭議處理期間保留全部原始資料，避免只通過口頭描述提出申訴。',
      'まずは送付された最終請求書、貸渡契約書、追加加入サービス明細を照合し、請求項目、発生日時、金額を詳細にご確認ください。請求に明らかな誤りや不当な点があると思われる場合は、速やかにIXサポートチームへ異議申し立てを行ってください。その際、予約番号、出発・返却時の車況チェック票、日時入り車両写真・動画、返却直前の給油領収書、警察事故証明、店舗との書面やり取り等の証拠資料を必ず添付してください。調査が完了するまで、口頭の説明のみに頼らずすべての客観的な一次資料を保管してください。',
      'Primero comprueba la factura desglosada cotejándola con tu contrato de alquiler y los servicios contratados, revisando cada concepto, fecha e importe. Si consideras que el cobro es erróneo, presenta una reclamación formal ante el soporte de TrustGo cuanto antes, adjuntando número de reserva, partes de entrega y devolución, fotos/vídeos con fecha del coche, tique de repostaje, informes policiales y comunicaciones con la oficina. Conserva todas las pruebas documentales durante la resolución del caso y evita basar la disputa en alegaciones puramente verbales.',
      '먼저 발송된 최종 정산 청구서, 대여 계약서 및 선택 서비스 내역을 대조하여 청구 항목, 발생 일시 및 금액을 면밀히 확인하십시오. 청구 내용에 오류나 부당한 요금이 있다고 판단되는 경우, 즉시 TrustGo 지원팀을 통해 공식 이의신청을 접수해 주십시오. 접수 시 예약 번호, 인수·반납 점검표, 촬영 시간 정보가 포함된 차량 사진/영상, 반납 직전 주유 영수증, 경찰 사고 보고서 및 지점과의 서면 대화 내역을 첨부해야 합니다. 조사가 완료될 때까지 구두 진술에만 의존하지 마시고 모든 객관적인 원본 증빙을 철저히 보관하세요.'
    )
  ),
  question(
    'lost-key-lockout-procedure',
    ['support'],
    text(
      'What should I do if the car key is lost, jammed, or locked inside the vehicle?',
      '車匙遺失、卡住或鎖在車內時怎樣處理？',
      '車の鍵を紛失した、折れた、または車内に閉じ込めた（インロック）場合はどうすればよいですか？',
      '¿Qué hago si pierdo la llave, se atasca o se queda dentro del coche?',
      '차 키를 분실했거나 키가 꽂힌 채 잠겼을(인록) 때는 어떻게 해야 하나요?'
    ),
    text(
      'First ensure the security of the vehicle and your personal surroundings, then immediately call the emergency roadside assistance number or pickup branch listed on your rental agreement. Do not attempt to force door locks, break windows, employ uncertified third-party locksmiths, or tamper with mechanical or electrical components, as this will cause severe chargeable damage. Replacement key fabrication, lockout unlocking services, towing logistics, and related downtime charges are governed strictly by your rental contract and insurance tier.',
      '請確保車輛和隨身物品安全，並立即聯絡訂單或租賃協議中的道路救援／取車門店。不要強行撬鎖、破壞車窗、使用未經批准的鎖匠，或自行啟動可能損壞車輛的部件。鑰匙遺失、開鎖、拖車、備用鑰匙和相關損失的費用及保障適用性，均以訂單和租賃協議為準。',
      'まずは車両および身の回りの安全を確保し、貸渡契約書や予約書に記載された緊急ロードサービスまたは出発店舗へ直ちにご連絡ください。ドアを無理やりこじ開けたり、窓ガラスを割ったり、未承認の鍵業者を勝手に呼んだり、車両部品を破損させる恐れのある行為は絶対に行わないでください。鍵の紛失に伴う合鍵製作費、インロック開錠費用、レッカー費用、休車損害の負担および各種補償の適用可否は、貸渡契約書の規定に従います。',
      'Asegura el coche y tus pertenencias y avisa de inmediato al teléfono de asistencia en carretera o a la oficina de recogida indicado en el contrato. No fuerces cerraduras, no rompas lunas, no recurras a cerrajeros no autorizados ni manipules componentes que puedan deteriorar el vehículo. El duplicado de llaves, apertura de puertas, remolque y gastos asociados por paralización se rigen por las condiciones del contrato de alquiler y la cobertura suscrita.',
      '차량과 소지품의 안전을 확보한 후 대여 계약서나 바우처에 기재된 긴급출동 서비스 또는 픽업 지점에 즉시 연락하십시오. 강제로 문을 따거나 창문을 파손하거나 미인가 열쇠 수리공을 부르거나 차량 부품을 무리하게 조작해서는 절대 안 됩니다. 키 분실에 따른 재발급 비용, 잠금 해제 출동비, 견인비, 대체 키 배송비 및 휴차 손실 비용 부담 여부는 대여 계약서 및 가입 보장 약관에 따릅니다.'
    )
  ),
  question(
    'vehicle-theft-procedure',
    ['support', 'important'],
    text(
      'What should I do if the rental vehicle is stolen?',
      '車輛被盜怎麼辦？',
      'レンタカーが盗難に遭った場合はどうすればよいですか？',
      '¿Qué debo hacer si roban el vehículo de alquiler?',
      '렌터카를 도난당했을 때는 어떻게 해야 하나요?'
    ),
    text(
      'First verify your personal safety and report the theft immediately to local police authorities to obtain a formal police crime report; immediately thereafter, notify the rental company or roadside emergency desk, providing the crime reference number, booking details, vehicle physical keys, and requested statements. Do not attempt to track or recover the vehicle yourself, and never delay reporting. Theft protection typically involves customer deductibles, exclusions, and duty of care obligations; for example, leaving keys inside an unattended vehicle, failing to lock doors, or late police reporting may void theft coverage entirely under the rental agreement.',
      '請先確保自身安全，並立即聯絡當地警方報案；隨後儘快通知租車公司或道路救援，按其指引提供警方記錄、訂單資料、車輛鑰匙及其他證明。不要自行尋找車輛或延遲報告。盜竊保障通常可能設有自負額、除外責任和客戶義務；例如未妥善保管鑰匙、未鎖車或未按要求報告，可能影響保障適用性，最終以租賃協議為準。',
      'まずはご自身の安全を確保したうえで、直ちに現地の所轄警察署へ盗難届を提出し、受理番号（事故・事件証明）を取得してください。その後、速やかにレンタカー会社または緊急サポート窓口へ連絡し、警察の届出番号、予約情報、所持している車両の鍵、状況説明書類を提出してください。ご自身で車両を捜索したり、通報を遅らせたりしないでください。車両盗難補償には免責額、免責事項、お客様の保管管理義務が定められています。鍵を車内に放置した、施錠を怠った、通報が著しく遅れたなどの重大な過失がある場合、補償が一切適用されず全額実費賠償となる場合があります。',
      'Comprueba tu seguridad personal y acude de inmediato a la policía local para formular la denuncia y obtener el número de atestado. A continuación, avisa enseguida a la empresa de alquiler o al servicio de urgencias aportando el informe policial, datos de la reserva, las llaves originales del coche y tu declaración. No intentes rastrear el vehículo por tu cuenta ni demores el aviso. La cobertura por robo suele incluir franquicia, exclusiones y obligaciones del cliente; descuidar las llaves, dejar el coche abierto o no denunciar a tiempo puede anular completamente la cobertura del contrato.',
      '자신의 안전을 최우선으로 확보한 후 즉시 현지 경찰서에 방문하거나 신고하여 정식 도난 신고 접수증(사건 번호)을 발급받으십시오. 그 직후 렌터카 회사 또는 긴급 지원 데스크에 연락하여 경찰 접수 번호, 예약 내역, 소지하고 있는 차량 원본 키 및 관련 서류를 제출하세요. 개별적으로 차량을 추적하려 하거나 신고를 지체해서는 안 됩니다. 차량 도난 보장은 자기부담금, 보상 제외 조항 및 고객의 선량한 관리자 주의 의무가 수반되며, 차량 내 키 방치, 문 잠금 소홀, 늑장 신고 등 중대한 과실이 있을 경우 보장 적용이 전면 배제될 수 있습니다.'
    )
  ),
  question(
    'post-return-final-charges-timeline',
    ['manage', 'support'],
    text(
      'How long after returning the vehicle might final charges appear?',
      '還車後多久會出現最終收費？',
      '返却後、最終的な精算請求書はどのくらいの期間で確定・請求されますか？',
      '¿Cuánto tiempo después de devolver el coche pueden cargarse costes finales?',
      '차량 반납 후 최종 청구서나 추가 결제는 언제쯤 확정되어 청구되나요?'
    ),
    text(
      'Upon drop-off, the branch typically issues an initial vehicle return receipt; however, the generation of the final closed invoice depends on post-trip vehicle detailing, fuel reconciliation, extension calculations, in-store extras, damage assessment, municipal parking tickets, automated toll charges, or traffic fines. Certain external authority charges take weeks to be billed to the rental fleet and may be processed subsequently. Please maintain your card validity, booking documents, and return receipts, and rely on the itemized final invoice; contact the TrustGo Support Team promptly if you require clarification.',
      '還車後，門店可能先提供還車收據；最終帳單的生成時間會受車輛檢查、燃油、延租、門店加購、損壞處理、停車費、通行費或罰單等影響。部分費用可能在還車後較晚才由相關機構通知門店，因此可能隨後出現。請保留付款卡、訂單和還車資料，並以最終帳單的費用明細為準；如有疑問，請及時聯絡 TrustGo 支援團隊查詢。',
      '返却時にはまず店頭で暫定的な返却受領書が発行されますが、最終的な確定精算書の作成には、返却後の車両詳細点検、燃料精算、延長料金、現地オプション、損傷修理見積、有料道路のETC利用料金、駐車違反や反則金の照会等の状況によって日数を要する場合があります。自治体や道路公社からの通知が後日届くことで、返却後数日から数週間後に確定請求が発生することがあります。精算完了まで決済カード、予約確認書、返却票を保管し、最終請求書の明細をご確認ください。ご不明点がある場合はIXサポートチームへお問い合わせください。',
      'Al entregar el coche, la oficina suele emitir un recibo provisional de devolución, pero la factura definitiva de liquidación puede demorarse según la inspección final, repostaje, ampliaciones, extras de mostrador, valoración de daños o recepción de peajes, aparcamientos y multas de tráfico. Algunos costes procedentes de organismos externos se notifican con semanas de retraso y se cargarán posteriormente. Mantén activa la tarjeta de pago y conserva la documentación de entrega; ante cualquier duda, contacta con el soporte de IX.',
      '반납 시점에는 지점에서 1차 반납 영수증이 발행되지만, 최종 정산서의 확정은 반납 후 차량 상세 정밀 검사, 연료 차액 정산, 대여 연장, 현장 추가 옵션, 수리비 산정, 주차위반 범칙금, 고속도로 하이패스 통행료 정산 상황에 따라 시일이 걸릴 수 있습니다. 외부 행정 기관이나 도로공사의 통지 시점에 따라 반납 후 수일에서 수주일 뒤에 최종 청구가 발생할 수 있습니다. 결제 카드와 반납 서류를 보관하시고 최종 정산서의 항목별 명세를 확인하십시오. 의문 사항이 있을 경우 즉시 TrustGo 지원팀에 문의하세요.'
    )
  ),
  question(
    'roadside-assistance-services',
    ['support', 'important'],
    text(
      'What services are included with roadside assistance?',
      '道路救援包含哪些服務？',
      'ロードサービスにはどのようなサービスが含まれていますか？',
      '¿Qué servicios incluye la asistencia en carretera?',
      '긴급출동(로드서비스)에는 어떤 지원 서비스가 포함되나요?'
    ),
    text(
      'The scope of roadside assistance depends on your selected rate package, cause of failure, and branch territory regulations, typically encompassing flat tyre replacement, battery jump-starts, lockout assistance, emergency fuel delivery, winching/recovery, and vehicle towing. When an issue arises, park safely and call the dedicated emergency support number shown on your voucher or rental contract; never arrange private repairs or towing unless emergency safety dictates. Fuel costs, unauthorized third-party repairs, or services exceeding package distance or monetary limits may be billed separately.',
      '道路救援的服務範圍取決於您購買的套餐、故障原因和取車地規定，可能涵蓋爆胎、搭電、鑰匙鎖在車內、送油、脫困或拖車等項目。發生問題時，請先在安全地點停車，再使用訂單或租賃協議中的救援電話聯絡；除非涉及即時安全，請不要自行安排維修或拖車。燃油、未授權維修、超出保障範圍或限額的服務可能另行收費。',
      'ロードサービスの提供範囲は、加入された補償プラン、故障トラブルの原因、渡航先の提携規定によって異なりますが、一般にタイヤのパンク交換、バッテリー上がり（ジャンプスタート）、インロック開錠、緊急給油、脱輪・スタック引き上げ、レッカー移動などが対象となります。トラブル発生時はまず安全な場所へ停車し、予約書や貸渡契約書に記載された緊急ロードサービス番号へご連絡ください。差し迫った危険がある場合を除き、無断で民間の修理業者やレッカーを手配しないでください。燃料実費、未承認の修理、規定の距離・回数限度を超えるサービスは実費請求となる場合があります。',
      'La cobertura de la asistencia en carretera depende del paquete contratado, la causa de la incidencia y la normativa del destino; suele abarcar cambio de rueda pinchada, arranque por batería descargada, apertura por llaves dentro, suministro de combustible de emergencia, rescate/remolque y grúa. Ante cualquier incidencia, aparca en lugar seguro y contacta con el teléfono de emergencias del contrato; salvo riesgo vital inminente, no contrates talleres o grúas privadas. El combustible, reparaciones no autorizadas o servicios que superen los límites de kilometraje o coste del plan podrán cobrarse aparte.',
      '긴급출동 서비스의 제공 범위는 가입하신 요금제 패키지, 고장 원인 및 현지 지점 규정에 따라 결정되며, 일반적으로 타이어 펑크 교체, 배터리 방전 점프 스타트, 차 문 잠금 해제(인록), 비상 주유, 구난(견인) 및 렉카 이동 서비스 등이 포함될 수 있습니다. 문제 발생 시 먼저 안전지대에 정차한 후 바우처나 계약서에 안내된 전용 긴급출동 번호로 연락하십시오. 즉각적인 인명 안전 문제를 제외하고 사설 수리나 견인을 임의로 부르지 마십시오. 연료 실비, 미인가 사설 수리비, 패키지 한도를 초과하는 원거리 견인 비용 등은 별도 청구될 수 있습니다.'
    )
  ),
];
