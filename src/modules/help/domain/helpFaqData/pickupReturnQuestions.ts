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

export const pickupReturnQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'how-to-find-pickup-location',
    ['locations', 'support'],
    text(
      'How do I find the pickup location?',
      '如何找到取車地點？',
      '受取店舗・出発場所への行き方を教えてください。',
      '¿Cómo encuentro la oficina de recogida?',
      '차량 픽업 지점은 어떻게 찾아가나요?'
    ),
    text(
      'Please refer to the pickup address, branch name, operating hours, meeting point, and branch contact number indicated in your booking confirmation. Pickup procedures vary across airport, train station, and downtown locations; some require airport shuttle transfers or meeting at a specific service counter. We recommend mapping your route in advance and saving the branch telephone number. Upon arrival, if you have difficulty locating the branch, contact staff directly using the details on your voucher rather than traveling to an unconfirmed location.',
      '請以訂單詳情中的取車地址、門店名稱、營業時間、集合點和門店聯絡電話為準。機場、火車站或市區門店的取車方式可能不同，部分需要接駁或在指定櫃檯集合；建議在出發前打開地圖確認路線並保存門店電話。抵達後如無法找到地點，請先按訂單詳情中的指引聯絡門店，不要擅自前往未確認的地點。',
      '予約詳細に記載された出発店舗の住所、店舗名、営業時間、送迎集合場所、店舗電話番号をご確認ください。空港、鉄道駅、市内店舗によって受付手順が異なり、専用シャトルバスの利用や指定カウンターへの集合が必要な場合があります。出発前に地図アプリでルートを確認し、店舗の連絡先を保存しておくことをおすすめします。到着後に場所が分からない場合は、自己判断で未確認の場所へ向かわず、予約書の案内に従い店舗へ直接お電話ください。',
      'Consulta la dirección de recogida, el nombre de la oficina, los horarios, el punto de encuentro y el teléfono de contacto indicados en la confirmación de tu reserva. El procedimiento varía según se trate de un aeropuerto, estación de tren u oficina urbana; en algunos casos se requiere traslado en lanzadera o personarse en un mostrador específico. Conviene comprobar la ruta en el mapa y guardar el teléfono antes del viaje. Si no encuentras la oficina al llegar, contacta con el personal con los datos de tu bono.',
      '예약 확인서에 기재된 픽업 지점 주소, 지점명, 영업시간, 미팅 포인트 및 지점 전화번호를 기준으로 확인하시기 바랍니다. 공항, 기차역, 시내 지점별로 인수 방식이 상이하며 공항 셔틀 탑승이나 전용 안내 카운터 방문이 필요할 수 있습니다. 출발 전 지도 앱으로 이동 경로를 확인하고 지점 연락처를 미리 저장해 두시는 것을 권장합니다. 도착 후 지점을 찾기 어려운 경우 임의로 이동하지 마시고 예약서에 안내된 번호로 지점에 바로 연락하세요.'
    )
  ),
  question(
    'branch-opening-hours',
    ['locations'],
    text(
      'What are branch opening hours, and when can I pick up and return?',
      '門店營業時間與取還車時間如何規定？',
      '店舗の営業時間と受取・返却時間について教えてください。',
      '¿Cuáles son los horarios de apertura y de recogida y devolución?',
      '지점 영업시간과 픽업 및 반납 가능 시간은 어떻게 되나요?'
    ),
    text(
      'Branch opening hours vary by city, airport, and railway station, and may be adjusted during public holidays. Vehicle pickup and drop-off must generally occur within the confirmed operating hours of the branch. If flight delays or unexpected events prevent you from arriving on time, contact the branch immediately using the phone number on your voucher; whether the vehicle can be held or after-hours service provided depends on branch availability and local policy.',
      '各門店的營業時間依所在城市、機場或火車站而有所不同，公共假期亦可能調整。取車和還車原則上必須在預訂確認的門店營業時間內辦理。若因航班延誤或突發狀況無法在營業時間內到店，請儘早使用訂單中的電話聯絡門店；逾時到店能否保留車輛或提供服務以門店當日安排為準。',
      '各店舗の営業時間は、都市、空港、駅の立地によって異なり、祝日や年末年始等で変更される場合があります。車両の受取および返却は、原則として予約時に確定した営業時間内に行っていただく必要があります。万が一、フライトの遅延や不測の事態により営業時間内の到着が困難な場合は、予約書に記載の店舗電話番号へ至急ご連絡ください。営業時間後の車両確保や対応の可否は、店舗の当日の運行状況に準じます。',
      'Los horarios de apertura varían según la ciudad, aeropuerto o estación y pueden modificarse en días festivos. La recogida y la devolución deben realizarse en principio dentro del horario comercial confirmado en la reserva. Si sufres un retraso de vuelo o imprevisto, llama de inmediato a la oficina con el teléfono indicado en tu bono; la retención del vehículo o la atención fuera de hora dependerá de la disponibilidad de la oficina.',
      '지점별 영업시간은 위치한 도시, 공항 또는 기차역에 따라 상이하며 공휴일 등에 변동될 수 있습니다. 차량의 픽업 및 반납은 원칙적으로 예약에 확정된 지점 영업시간 내에 완료하셔야 합니다. 항공편 지연이나 예기치 않은 사정으로 영업시간 내 방문이 어려운 경우 즉시 바우처에 기재된 지점 전화번호로 연락하십시오. 영업시간 종료 후 차량 보유 여부나 응대 가능 여부는 지점의 당일 운영 상황에 따릅니다.'
    )
  ),
  question(
    'outside-business-hours',
    ['locations', 'support'],
    text(
      'Can I pick up or return the vehicle outside of business hours?',
      '可以在營業時間外取車或還車嗎？',
      '営業時間外に受取や返却を行うことはできますか？',
      '¿Puedo recoger o devolver el vehículo fuera del horario de oficina?',
      '영업시간 외에 차량 픽업이나 반납이 가능한가요?'
    ),
    text(
      'After-hours pickup or return is available only when explicitly indicated and supported in your confirmed booking. Self-service key drop boxes, staff meet-and-greet, shuttle operations, and night service surcharges vary by branch; please verify availability for your intended times prior to booking and payment. If your booking does not offer out-of-hours service, do not assume it can be arranged on the spot upon arrival; please contact the branch in advance to confirm arrangements.',
      '只有在訂單明確顯示支持時，才可在營業時間外取車或還車。自助取還車、鑰匙交接、接駁及夜間服務費均可能因門店而不同；請在付款前查看所選時間是否可用。若訂單未顯示相應服務，請不要假設到店後可臨時辦理；如有特殊時間需求，請在預訂前聯絡門店確認。',
      '営業時間外の受取または返却は、予約画面や予約確認書で対応可能と明記されている場合にのみご利用いただけます。無人返却ボックス、キーボックス受渡、時間外送迎、深夜早朝割増料金などの提供状況は店舗によって異なります。決済前にご希望の日時で時間外対応が可能か必ずご確認ください。予約時に時間外対応が含まれていない場合、当日現地で急遽対応することはできませんので、特別な時間帯のご利用は事前に店舗へご確認ください。',
      'La recogida o devolución fuera de horario solo es posible cuando la reserva confirmada lo admita y especifique expresamente. Los buzones de devolución de llaves, la entrega desatendida, el servicio de traslado y los suplementos nocturnos varían según la oficina; comprueba la disponibilidad de tus horarios antes de pagar. Si la reserva no incluye este servicio, no des por hecho que podrá gestionarse in situ el mismo día; confírmalo antes con la oficina.',
      '영업시간 외 픽업 또는 반납은 예약서에 해당 서비스가 지원된다고 명시된 경우에 한해 가능합니다. 무인 키 반납함 이용, 대면 키 전달, 셔틀 운행 여부 및 심야/조기 서비스 수수료는 지점에 따라 상이하므로 결제 전 해당 시간대 이용이 가능한지 반드시 확인하세요. 예약 시 시간 외 서비스가 포함되지 않은 경우 현장에서 즉시 신청할 수 없으므로 심야·새벽 이용이 필요한 경우 사전 문의하시기 바랍니다.'
    )
  ),
  question(
    'airport-shuttle',
    ['locations', 'support'],
    text(
      'Is there a shuttle service between the airport and the rental branch?',
      '機場到租車門店有接駁車嗎？',
      '空港からレンタカー店舗への送迎バスはありますか？',
      '¿Hay servicio de traslado (shuttle) desde el aeropuerto a la oficina de alquiler?',
      '공항에서 렌터카 지점까지 셔틀버스가 운행되나요?'
    ),
    text(
      'Shuttle bus transfers are provided by certain airport locations, but availability depends on the specific airport and branch. Check the pickup instructions on your booking confirmation and store page for meeting point directions, contact numbers, operating schedules, and advance reservation requirements. If you cannot find the shuttle pickup point upon arrival, please call the branch phone number listed on your voucher.',
      '部分機場門店提供接駁服務，但並非所有門店均設有接駁。請以訂單詳情和門店頁面中的取車指引為準，確認集合點、聯絡方法、接駁時段及是否需要提前預約。抵達後如找不到集合點，請使用訂單上列明的門店電話聯絡工作人員。',
      '一部の空港店舗では無料送迎シャトルバスを運行しておりますが、すべての店舗で運行しているわけではありません。予約確認書および店舗詳細ページに記載された送迎案内をご確認いただき、送迎集合場所、連絡方法、運行時間帯、事前予約の要否をご確認ください。空港到着後に集合場所が見当たらない場合は、予約書に記載された店舗電話番号へお電話いただきスタッフの指示に従ってください。',
      'Algunas oficinas de aeropuerto ofrecen servicio de lanzadera gratuito, aunque no todas disponen de él. Revisa las instrucciones de recogida en tu bono y en la ficha de la oficina para confirmar el punto de encuentro, teléfonos, frecuencias y si requiere reserva previa. Si no localizas la parada al llegar, llama directamente al número de la oficina que figura en tu reserva.',
      '일부 공항 지점에서 무료 셔틀버스 서비스를 제공하지만, 모든 지점에 셔틀이 운행되는 것은 아닙니다. 예약 확인서와 지점 상세 페이지의 픽업 안내를 확인하시어 미팅 장소, 연락 방법, 셔틀 운행 시간 및 사전 예약 필요 여부를 확인하십시오. 공항 도착 후 미팅 포인트를 찾기 어려운 경우 예약서에 기재된 지점 전화번호로 연락하여 직원의 안내를 받으시기 바랍니다.'
    )
  ),
  question(
    'rental-day-requirements',
    ['important'],
    text(
      'What documents and items are required on the day of rental?',
      '租車當天需要攜帶甚麼？',
      '利用当日に必要な書類や持ち物は何ですか？',
      '¿Qué documentos y requisitos necesito el día de la recogida?',
      '차량 대여 당일 지참해야 하는 서류와 준비물은 무엇인가요?'
    ),
    text(
      `Please present the following original documents at vehicle pickup:
1. Main Driver's Domestic Driving Licence: Full, valid original physical licence matching the vehicle category (probational/learner licences, digital scans, and photocopies are strictly prohibited).
2. Passport or Official ID: Valid original passport (mandatory for international visitors).
3. Destination-Compliant International Driving Permit (IDP) or Official Translation:
   • Taiwan Market (TW): Domestic licence + Passport + origin country IDP; Japanese licence holders require original Japanese licence + official Chinese translation (JAF/Exchange Association); HK/Macao residents require full local licences.
   • Japan: Physical booklet IDP strictly under the 1949 Geneva Convention (1968 Vienna Convention and digital IDPs are strictly rejected); or domestic licence + official Japanese translation for 6 eligible countries/territories (Taiwan, France, Germany, Belgium, Monaco, Switzerland).
   • Malaysia: Full English-language licence (valid up to 3 months) or domestic licence + IDP; provisional/P-plate licences are not accepted.
   • Thailand: Domestic licence held for at least 1 year + valid IDP (or certified English translation).
4. Physical Credit Card in Main Driver's Name: Must have sufficient available credit for the security deposit pre-authorization.
5. Booking Confirmation / Rental Voucher.
All additional drivers must be physically present at the counter and provide full original licences and identification documents.`,
      `請攜帶以下齊備之原件辦理取車：
1. 主駕駛人有效本國實體駕照原件（准駕車型相符且已過實習期；嚴禁照片、影印件或電子駕照）。
2. 護照或身分證明文件原件（非本地居民必須出示有效護照）。
3. 符合目的地法規要求的國際駕駛許可證（IDP）或官方認可翻譯件：
   • 台灣市場（TW）：本國駕照 + 護照 + 原籍國 IDP；日本駕照須持日文駕照 + JAF/交流協會中文譯本；港澳居民持正式駕照原件。
   • 日本：1949 年日內瓦公約實體小冊子 IDP（嚴禁 1968 年公約及電子 IDP）；或台/法/德/比/摩/瑞 6 國本國駕照 + JAF 官方日文譯本。
   • 馬來西亞：英文駕照原件（最長 3 個月），非英文駕照須附 IDP；實習牌（P牌）不接受。
   • 泰國：持照滿 1 年之本國駕照 + IDP（或官方英文譯本）。
4. 主駕駛人本人名下實體信用卡（可用額度充足，用於現場押金預授權）。
5. 預訂確認單（Voucher）。
所有登記的附加駕駛人亦須親自到場並出示上述全部駕照與身分文件原件。`,
      `ご出発当日は以下の書類原本を必ずご持参ください：
1. 主運転者の自国運転免許証原本（有効期限内で車両区分に適合するもの。仮免許・初心者標識・写真・コピー・電子免許証は不可）。
2. パスポート原本（非居住者の場合は提示必須）。
3. 渡航先法令に適合する国際運転免許証または公認翻訳文：
   • 台湾市場（TW）：自国免許証＋パスポート＋自国発行IDP（ジュネーブ条約等）。日本の運転免許証保持者は日本免許証＋JAF/日台交流協会発行の公式中国語翻訳文。香港・マカオ免許証は原本提示。
   • 日本：1949年ジュネーブ条約に基づく紙の小冊子型国際運転免許証（1968年ウィーン条約および電子IDPは一切不可）。または台湾・フランス・ドイツ・ベルギー・モナコ・スイスの6カ国・地域発行免許証＋JAF等の公式日本語翻訳文。
   • マレーシア：英語表記の有効な自国免許証（入国後最大3ヶ月有効）、非英語免許証はIDPを併携。Pプレート（初心者免許）は不可。
   • タイ：取得後1年以上の自国免許証＋有効なIDP（または公認英語翻訳文）。
4. 主運転者本人名義の有効なクレジットカード（デポジット枠が十分にあるもの）。
5. 予約確認書（バウチャー）。
すべての追加運転者様もカウンターへご同行いただき、免許証および本人確認書類の原本をご提示ください。`,
      `Presenta los siguientes documentos originales en el mostrador de recogida:
1. Permiso de conducir nacional del conductor principal: Original físico, en vigor y acorde a la categoría (prohibidas copias, fotos, licencias digitales o de aprendizaje).
2. Pasaporte o documento de identidad en vigor: Pasaporte obligatorio para clientes internacionales.
3. Permiso Internacional (IDP) o traducción oficial válida según el destino:
   • Mercado de Taiwán (TW): Permiso nacional + Pasaporte + IDP de origen; titulares de permiso japonés precisan carné japonés + traducción oficial al chino (JAF/Asociación); residentes de Hong Kong/Macao carné definitivo.
   • Japón: Libreta física de IDP conforme al Convenio de Ginebra de 1949 (estrictamente prohibidos el Convenio de 1968 y formatos digitales); o carné nacional + traducción oficial al japonés para 6 países/territorios (Taiwán, Francia, Alemania, Bélgica, Mónaco, Suiza).
   • Malasia: Carné nacional en inglés (hasta 3 meses) o carné nacional + IDP; no se admiten carnés provisionales (placas P).
   • Tailandia: Carné nacional con al menos 1 año de antigüedad + IDP válido (o traducción jurada al inglés).
4. Tarjeta de crédito física a nombre del conductor principal: Con límite disponible para la fianza.
5. Bono o confirmación de la reserva.
Todos los conductores adicionales registrados deben personarse en el mostrador con su documentación original completa.`,
      `차량 인수 당일 카운터에서 아래의 필수 원본 서류를 제시하셔야 합니다:
1. 주 운전자의 국내 유효 운전면허증 원본 (대여 차종 운전 자격 충족, 연습면허 불가, 사진/복사본/모바일 전자 면허 불인정).
2. 여권 원본 (해외 대여 시 필수 지참).
3. 여행지 법규에 부합하는 국제운전면허증(IDP) 또는 공식 번역문:
   • 대만 시장 (TW): 국내 면허증 + 여권 + 제네바 협약 IDP; 일본 면허 소지자는 일본 면허증 + JAF/교류협회 중국어 번역문; 홍콩·마카오 거주자는 정규 면허증 원본.
   • 일본: 1949년 제네바 협약 기반의 종이 책자형 국제운전면허증 (1968년 비엔나 협약 및 모바일 전자 IDP 불가); 또는 대만/프랑스/독일/벨기에/모나코/스위스 6개국 면허증 + JAF 공식 일본어 번역문.
   • 말레이시아: 영문 면허증 원본(입국 후 최대 3개월 유효) 또는 국내 면허증 + IDP; 수습 면허(P플레이트) 불가.
   • 태국: 취득 1년 이상의 국내 면허증 + 유효한 IDP(또는 공식 영문 번역문).
4. 주 운전자 본인 명의의 실물 신용카드 (현장 보증금 사전 승인을 위한 한도 필수).
5. 예약 확정 바우처.
등록되는 모든 추가 운전자도 반드시 카운터에 동행하여 상기 면허증 및 신분 서류 원본을 제시해야 합니다.`
    )
  ),
  question(
    'pre-departure-inspection',
    ['support', 'important'],
    text(
      'What should I inspect before driving away at pickup?',
      '取車前我應該檢查甚麼？',
      '出発前に車体のどこを確認すべきですか？',
      '¿Qué debo revisar antes de salir con el vehículo?',
      '차량 인수 후 출발하기 전에 무엇을 점검해야 하나요?'
    ),
    text(
      'Before departing the branch, inspect the vehicle alongside staff: verify exterior bodywork, pre-existing scratches/dents, fuel/charge level, odometer reading, tyres, glass/windscreen, headlights/taillights, wipers, dashboard warning lights, and onboard accessories. Ensure the vehicle starts smoothly and key controls operate properly, photographing any existing blemishes and ensuring they are added to the handover report. If you are unsure of fuel type, filler cap release, or equipment operation, ask staff before driving off.',
      '離店前請與門店核對車輛外觀、已有損傷、油量或電量、里程、輪胎、玻璃、燈光、雨刷、儀表警示燈及隨車設備。請確認車輛啟動和基本功能正常，並對已有刮痕、凹陷或內飾問題拍照／錄像，要求門店寫入車況記錄。若對燃油類型、加油口位置或任何設備不確定，請在離店前詢問。',
      '店舗を出発する前に、店舗スタッフと一緒に外観の傷やへこみ、燃料残量またはバッテリー残量、走行距離、タイヤの空気圧・摩耗、窓ガラス、ライト類、ワイパー、メーターの警告灯、車載工具・付属品を確認してください。エンジンの始動や基本操作が正常であることを確認し、既存の傷や内装の汚れは写真・動画を撮影して貸渡票に明記させてください。給油する燃料の種類、給油口レバーの位置、操作方法に不安がある場合は、必ず出発前にスタッフにご確認ください。',
      'Antes de abandonar la oficina, revisa el vehículo con el personal: comprueba carrocería, daños existentes, nivel de combustible o batería, kilometraje, neumáticos, lunas, luces, limpiaparabrisas, testigos del cuadro y equipamiento de serie. Comprueba que arranque bien y los mandos funcionen correctamente; fotografía cualquier arañazo o mancha y exige que figure en el parte de entrega. Si tienes dudas sobre el tipo de combustible o el manejo de algún mando, pregúntalo antes de partir.',
      '출발 전 지점 직원과 함께 차량 외관의 기존 긁힘과 찌그러짐, 연료 또는 배터리 잔량, 주행거리, 타이어 상태, 유리창, 전조등/미등, 와이퍼, 계기판 경고등 점등 여부 및 기본 비품을 점검하십시오. 시동 및 주요 기능이 정상 작동하는지 확인하고, 발견된 손상 부위는 사진이나 영상으로 촬영하여 차량 점검표에 기재를 요청하세요. 사용 연료 종류, 주유구 레버 위치나 기기 조작법에 의문이 있다면 반드시 출차 전에 직원에게 문의하시기 바랍니다.'
    )
  ),
  question(
    'existing-damage',
    ['support', 'important'],
    text(
      'How should I record pre-existing vehicle damage at pickup?',
      '取車時應如何記錄已有車損？',
      '出発時に既存の車両損傷をどのように記録すべきですか？',
      '¿Cómo debo registrar los daños existentes al recoger el vehículo?',
      '차량 인수 시 기존 파손 부위를 어떻게 기록해야 하나요?'
    ),
    text(
      'Before driving away from the branch, conduct a thorough joint vehicle inspection with branch staff, inspecting the bodywork, windscreen/glass, tyres, alloy rims, interior cabin, fuel/battery level, odometer mileage, and all onboard equipment. For any scratch, dent, chip, or defect not documented on the vehicle condition sheet, take clear photos/videos immediately and insist staff add them to the official record. Retain signed copies of the inspection sheet and digital media until after final post-return charges are settled. If pre-existing issues compromise safety or differ materially from your booking, request a replacement vehicle on the spot; never wait until return, as it becomes difficult to prove damages preceded your rental.',
      '離店前請與門店一起檢查車輛狀況，並重點查看車身、玻璃、輪胎與輪圈、內飾、油量／電量、里程及隨車設備。對任何交接單未列出的刮痕、凹陷或損壞，請立即拍照／錄像並請門店補充記錄；保存簽署的車況單和影像至還車及最終帳單確認後，以便處理爭議。如車況影響安全或與預訂明顯不符，可要求門店評估是否提供替代車輛。不要等到還車時才提出，否則可能難以證明損傷在取車前已存在。',
      '出発前に店舗スタッフ立ち会いのもと車両の状態を念入りに点検し、車体、窓ガラス、タイヤ・ホイール、内装シート、燃料・充電残量、走行距離、車載備品を重点的に確認してください。車両チェックシートに記載のない傷、へこみ、汚れを発見した場合は、直ちにスマートフォン等で写真や動画を撮影し、スタッフにシートへ追記させてください。署名済みの車況確認票および画像データは、返却および最終請求の精算が完了するまで大切に保管してください。車況が安全運行に支障をきたす場合や予約内容と著しく異なる場合は、その場で代替車両の手配を要求してください。返却時に申し出ても出発前の傷であることを証明することが極めて困難となります。',
      'Antes de salir de las instalaciones, inspecciona detenidamente el vehículo junto con el personal de la oficina, prestando especial atención a la carrocería, lunas, neumáticos, llantas, habitáculo interior, nivel de combustible/batería, kilometraje y equipamiento a bordo. Si detectas cualquier arañazo, abolladura o desperfecto no anotado en el parte de entrega, haz fotos y vídeos claros al momento y exige que lo incluyan en el registro firmado. Conserva copia del parte y los archivos digitales hasta la liquidación final tras la devolución. Si el estado compromete la seguridad o difiere gravemente de lo reservado, solicita un coche de sustitución antes de marcharte; no esperes a la entrega final.',
      '출차 전 반드시 지점 직원과 함께 차량 상태를 꼼꼼히 점검하시고 차체 외관, 전면 유리, 타이어 및 휠 림, 실내 시트, 연료/배터리 잔량, 주행거리 계기판 및 차량 비품을 중점적으로 확인하십시오. 차량 인수인계 점검표에 기재되지 않은 미세한 스크래치, 찌그러짐, 파손이 있을 경우 즉시 사진이나 동영상으로 명확히 촬영하고 직원에게 점검표 기록 추가를 요구하세요. 서명된 차량 점검표와 촬영 영상은 반납 및 최종 정산이 완료될 때까지 보관하십시오. 차량 결함이 안전 운행에 지장을 주거나 예약 내용과 현저히 다른 경우 즉시 대체 차량 배차를 요구해야 하며, 반납 시점에 문제를 제기하면 인수 전부터 존재했던 파손임을 증명하기 어려울 수 있습니다.'
    )
  ),
  question(
    'one-way-rental',
    ['rent', 'locations', 'support'],
    text(
      'Can I return my vehicle to a different branch location (one-way rental)?',
      '可以在不同門店還車嗎？',
      '出発店舗と異なる店舗へ返却できますか？（乗り捨て・ワンウェイ利用）',
      '¿Puedo devolver el vehículo en una oficina distinta (alquiler one-way)?',
      '출발 지점과 다른 지점에 반납할 수 있나요? (편도/원웨이 대여)'
    ),
    text(
      'Yes, provided you select different pickup and return locations during the booking process and the one-way route is confirmed available in search results. One-way rentals are subject to vehicle category eligibility, operational route policies, and branch parking capacity, and may incur a one-way drop-off charge and associated local taxes; please verify the final return location and fee breakdown before payment. If you decide to change to a different return branch after pickup, you must obtain prior written approval from the pickup branch; this requires reassessing vehicle scheduling, operating hours, and fleet repositioning, and rates may be recalculated accordingly. Changes without explicit branch authorization are invalid.',
      '可以，但須在預訂時選擇不同的取車與還車門店，並以搜尋結果顯示可用為前提。異地還車可能受車型組、行車路線及門店容量限制，並可能收取單程費（異地還車費）和相關稅費；請在付款前核對訂單中的還車地點和費用明細。取車後如需臨時改為異地還車，必須先取得門店明確確認；這通常需要門店重新核對後續庫存、營業安排及調度路線，費用可能隨之調整並重新計算。未經門店明確確認的變更不生效。',
      '可能です。ただし、予約検索時に出発店舗と異なる返却店舗を指定し、検索結果でワンウェイ利用が可能と表示されていることが前提となります。乗り捨て利用は車両クラス、運行ルート、店舗の受入可能台数によって制限される場合があり、ワンウェイ手数料および所定の税金が発生する場合があります。決済前に予約明細に記載された返却店舗と手数料をご確認ください。出発後に途中から乗り捨て先を変更したい場合は、必ず事前に出発店舗へ連絡し明確な承認を得る必要があります。後続の予約在庫、店舗の営業時間、回送体制を確認する必要があり、料金が再計算されます。店舗の正式承認のない返却先変更は無効となります。',
      'Sí, siempre que selecciones oficinas distintas de recogida y devolución al reservar y la ruta figure como disponible en los resultados de búsqueda. El alquiler one-way está sujeto a la aptitud de la categoría, rutas autorizadas y capacidad de la oficina de destino, y puede conllevar una tasa por trayecto único (one-way fee) e impuestos; revisa el lugar de devolución y el desglose de tarifas antes de pagar. Si deseas cambiar de oficina de devolución una vez iniciado el alquiler, debes solicitar autorización previa a la oficina de recogida; requerirá verificar la flota, horarios y logística de retorno, recalculándose el precio. Ningún cambio es válido sin confirmación expresa.',
      '가능합니다. 단, 예약 검색 단계에서 픽업 지점과 반납 지점을 다르게 설정하고 검색 결과에서 편도 이용이 가능하다고 표시되어야 합니다. 편도 대여(원웨이)는 대여 차량 등급, 이동 경로 및 도착 지점의 주차 수용 여부에 따라 제한될 수 있으며 편도 수수료(Drop-off fee) 및 관련 세금이 부과될 수 있으므로 결제 전 반납 지점과 비용 내역을 확인하십시오. 차량 인수 후 대여 도중 반납 지점을 다른 곳으로 변경하고자 하는 경우, 반드시 기존 픽업 지점에 사전 연락하여 명확한 승인을 받아야 합니다. 이는 차량의 후속 스케줄, 지점 영업시간 및 차량 회송 일정을 재확인해야 하며 수수료가 재산정될 수 있습니다. 지점의 승인 없는 임의 변경은 효력이 없습니다.'
    )
  ),
  question(
    'vehicle-exchange-during-rental',
    ['support'],
    text(
      'Can I exchange the vehicle during the rental?',
      '租期中可以更換車輛嗎？',
      '利用期間中に車両を交換することはできますか？',
      '¿Puedo cambiar de vehículo durante el alquiler?',
      '대여 기간 중에 차량을 교체할 수 있나요?'
    ),
    text(
      'If upon vehicle handover you notice vehicle condition, pre-existing damage, or specifications that differ materially from your booking, immediately notify the branch staff and ensure it is documented before leaving. If safety concerns or mechanical malfunctions arise during the rental, contact roadside assistance or the pickup branch immediately; do not attempt an unauthorized exchange. Any vehicle swap, replacement class, exchange location, and possible cost adjustments require official branch approval and depend on fleet availability. Retain all communication logs and the revised vehicle handover agreement.',
      '如取車時發現車輛狀況、已記錄損傷或實際配置與訂單明顯不符，請在離店前立即告知門店並要求記錄。租期中如出現安全或機械問題，請先聯絡道路救援或門店，不要自行換車；是否可更換、替代車組、地點和費用均須由門店確認，並取決於當日庫存。請保存所有溝通與新的交接記錄。',
      '受取時に車両の状態、既存の損傷、実際の仕様が予約内容と著しく異なる場合は、出発前に直ちに店舗スタッフへ申し出て車両チェックシートへ記録させてください。利用中に安全上の問題や機械的トラブルが発生した場合は、自己判断で勝手に交換せず、まずはロードサービスまたは出発店舗へご連絡ください。車両の交換可否、代替車両のクラス、交換場所および費用の調整は店舗の承認と当日の在庫状況に依存します。すべての連絡履歴と新しい車両受渡書を保管してください。',
      'Si al recoger el vehículo observas que su estado, daños existentes o especificaciones difieren de tu reserva, indícalo de inmediato al personal de la oficina y asegúrate de que quede registrado antes de salir. Si surgen incidencias mecánicas o de seguridad durante el alquiler, contacta enseguida con la asistencia en carretera o la oficina de recogida; no intentes cambiar el coche por tu cuenta. Cualquier cambio, categoría de sustitución, lugar y ajuste de precio requiere aprobación de la oficina y depende del inventario. Guarda todas las comunicaciones y el nuevo parte de entrega.',
      '차량 인수 시 차량 상태, 기존 파손 부위 또는 실제 사양이 예약 내용과 현저히 다른 경우 출차 전에 즉시 지점 직원에게 알리고 체크표에 기록을 요청하세요. 대여 운행 중 안전 문제나 기계적 결함이 발생한 경우 임의로 차량을 바꾸지 마시고 먼저 긴급출동 서비스나 픽업 지점에 연락하세요. 차량 교체 가능 여부, 대체 차량 그룹, 교체 장소 및 요금 정산은 전적으로 지점 승인과 당일 재고에 달려 있습니다. 모든 대화 기록과 새로 서명한 차량 인수인계서를 반드시 보관하세요.'
    )
  ),
  question(
    'late-return-rules',
    ['manage', 'support'],
    text(
      'Can I return the vehicle later than the scheduled time?',
      '可以延遲還車嗎？',
      '予定の返却時刻より遅れて返却することはできますか？',
      '¿Puedo devolver el coche más tarde de la hora prevista?',
      '약정된 반납 예정 시간보다 늦게 반납할 수 있나요?'
    ),
    text(
      'If you anticipate being unable to return on time or need an extension, contact the pickup branch as early as possible before your scheduled return time. Approval of late returns depends strictly on subsequent vehicle bookings and branch operating hours; unapproved delays will incur overdue hourly fees or may be billed as an entire extra rental day even if delayed by just a few hours. Always obtain and follow explicit updated confirmation and cost breakdowns from the branch.',
      '如無法按時還車或需要續租，請在原定還車時間前儘早聯絡門店。延遲能否獲准取決於後續車輛安排和營業時間；未經確認的延遲可能產生超時費用，部分門店即使少於 24 小時也可能按額外一日或新的租期計費。請以門店提供的更新確認和費用說明為準。',
      '予定通りの返却が困難な場合や利用の延長が必要な場合は、当初の返却時刻より前にできる限り早く店舗へご連絡ください。遅延・延長の承認可否は後続の予約状況および店舗の営業体制に依存します。事前連絡や承認のない遅延は超過料金の対象となり、数時間の遅れであっても丸1日分の追加基本料金が請求される場合があります。店舗から提示される変更後の確認内容および費用明細に従ってください。',
      'Si prevés que no podrás devolver el vehículo a la hora acordada o necesitas ampliar el alquiler, contacta cuanto antes con la oficina antes de que venza el plazo. La autorización depende de las reservas posteriores y del horario comercial; cualquier retraso no autorizado devengará recargos por demora y, según la oficina, puede cobrarse como un día completo adicional aunque sea de pocas horas. Guíate siempre por la confirmación por escrito y el desglose facilitado por la oficina.',
      '약정된 반납 시간에 늦을 것으로 예상되거나 대여 연장이 필요한 경우, 기존 반납 시간 전에 가급적 일찍 지점에 연락하셔야 합니다. 지연 승인 여부는 후속 차량 예약 현황과 영업시간에 따라 결정되며, 승인받지 않은 무단 연체는 높은 시간당 초과 요금이 부과되거나 몇 시간의 지연이라도 1일 대여 요금이 전액 청구될 수 있습니다. 반드시 지점이 승인한 변경 내용과 요금 안내에 따르시기 바랍니다.'
    )
  ),
  question(
    'extend-rental',
    ['support', 'manage'],
    text(
      'How can I extend the rental period?',
      '如何延長租期？',
      '利用期間を延長（延泊）するにはどうすればよいですか？',
      '¿Cómo puedo ampliar el periodo de alquiler?',
      '대여 기간을 연장하려면 어떻게 해야 하나요?'
    ),
    text(
      'Contact the pickup branch well before your agreed return time. The branch must verify vehicle availability for the extended dates, confirm continuous insurance/protection validity, and calculate the updated price and payment method. Never continue driving the vehicle past the original agreement without prior written branch authorization, and retain your updated contract confirmation.',
      '請在約定還車時間前聯絡取車門店。門店須確認後續車輛安排、保障延續、更新價格及付款方式；未獲批准前請勿自行繼續使用車輛，並保存更新後的訂單或租賃協議書面確認。',
      '当初の返却時刻より前に、必ず出発店舗へご連絡いただき延長手続きを行ってください。店舗側で後続の予約在庫、補償・保険の継続適用、延長料金、追加決済方法を確認・承認する必要があります。店舗の承認を得ることなく自己判断で車両を乗り続けることは重大な約款違反となりますので、必ず更新された予約確認書や貸渡契約書面の承認を保管してください。',
      'Contacta con la oficina de recogida antes de la hora fijada para la devolución. La oficina debe comprobar la disponibilidad del coche, la continuidad de la cobertura del seguro, calcular el nuevo importe y tramitar el cobro. No continúes utilizando el vehículo sin autorización previa por escrito y guarda la confirmación del contrato actualizado.',
      '약정된 반납 시간 전에 반드시 픽업 지점에 연락하여 연장 승인을 받아야 합니다. 지점에서 이후 차량 배차 가능 여부, 보험 보장의 연속성, 변경 요금 및 결제 방식을 확인해야 합니다. 지점의 승인 없이 임의로 차량을 계속 운행하는 것은 약관 위반이며, 갱신된 예약 내역이나 서면 계약 확인서를 반드시 보관하십시오.'
    )
  ),
  question(
    'avoid-post-return-fees',
    ['support', 'manage'],
    text(
      'How can I avoid additional charges when returning the vehicle?',
      '還車時如何避免額外費用？',
      '返却時に追加費用やトラブルを避けるにはどうすればよいですか？',
      '¿Cómo puedo evitar cargos adicionales al devolver el coche?',
      '차량 반납 시 추가 요금이나 불필요한 비용을 피하려면 어떻게 해야 하나요?'
    ),
    text(
      'Please return the vehicle strictly in accordance with the time, location, and fuel/battery charging policy specified in your booking agreement, ensuring all personal belongings are removed and keys, documents, and rented extras (such as child seats or navigation devices) are properly returned. Before handing over the car, photograph the exterior bodywork, interior cabin, fuel/battery gauge, and odometer; photographic or video records are especially essential for after-hours contactless key-drop returns. Avoid new scratches/dents, deep cabin stains, unauthorized late returns, wrong drop-off locations, or returning without the agreed fuel level. Always request and retain your final return receipt on the spot.',
      '請按訂單規定的時間、地點和燃油／電量政策還車，並清空個人物品、妥善歸還鑰匙和所有附加設備。還車前請拍攝車輛外觀、內飾、油量／電量和里程；自助還車時尤其建議拍照或錄像留存。避免新增損傷、嚴重污損、超時、錯誤還車地點和未按約定補油；如可取得還車收據，請當場保存。',
      '予約契約で定められた返却日時、返却店舗、燃料・充電規定を厳守してご返却ください。私物の置き忘れがないか車内を確認し、キー、車検証、チャイルドシートやカーナビ等のすべての追加装備を不備なく返却してください。車両をスタッフへ引き渡す前に、車体外観、車内シート、燃料・バッテリー残量計、走行距離メーターの写真を撮影しておくことを推奨します（特に無人キーボックス返却時は写真・動画の記録が必須です）。返却時の新たな傷、車内のひどい汚損、無断延長、異なる店舗への誤返却、燃料未給油による精算差額の発生を防いでください。返却手続き完了時はその場で返却受領証（レシート）を受け取り保管してください。',
      'Devuelve el vehículo respetando escrupulosamente la hora, oficina y política de combustible/batería establecidas en tu reserva, retirando tus pertenencias y entregando llaves, documentación y todos los extras alquilados (sillitas, GPS, etc.). Antes de entregar el vehículo, haz fotos de la carrocería, habitáculo, indicador de combustible/batería y cuentakilómetros; esto es fundamental en devoluciones fuera de horario mediante buzón. Evita nuevos daños, suciedad grave, retrasos no autorizados, entregas en lugares erróneos o falta de combustible según lo pactado. Solicita y conserva siempre el recibo de devolución firmado en el momento.',
      '예약 계약서에 명시된 반납 일시, 지정 반납 지점 및 연료/충전 규정을 엄격히 준수하여 반납하십시오. 차량 내 개인 소지품을 완전히 수거하시고 차 키와 대여한 모든 추가 부가 장비(카시트, 내비게이션 등)를 정상 반납해야 합니다. 차량 인계 직전 차체 외관, 실내 시트 상태, 연료/배터리 게이지 및 계기판 주행거리를 사진으로 촬영해 두시기 바랍니다(특히 무인 키 박스 반납 시 사진이나 동영상 보관이 필수적입니다). 새로운 손상 발생, 차량 내부 심각한 오염, 무단 연체 반납, 잘못된 반납 지점 방문 및 미주유 반납 수수료 발생을 방지하시고, 반납 완료 시 현장에서 반납 영수증을 수령하여 보관하세요.'
    )
  ),
];
