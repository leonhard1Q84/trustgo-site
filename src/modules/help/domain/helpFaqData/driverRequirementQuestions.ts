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

export const driverRequirementQuestions: HelpFaqQuestionDefinition[] = [
  question(
    'general-and-destination-driving-licence-rules',
    ['important'],
    text(
      "What are the driving licence and credential requirements across key destinations? (Taiwan Market, Japan, Malaysia, Thailand)",
      '各主要營運市場（台灣市場、日本、馬來西亞、泰國）的自駕駕駛執照與證件規定是什麼？',
      '主要渡航先（台湾市場・日本・マレーシア・タイ）での運転免許証と必要書類の規定は何ですか？',
      '¿Cuáles son los requisitos de permiso de conducir en los principales destinos? (Mercado de Taiwán, Japón, Malasia, Tailandia)',
      '주요 목적지(대만 시장, 일본, 말레이시아, 태국)에서의 운전면허 및 필요 서류 규정은 무엇인가요?'
    ),
    text(
      `[General Overseas Driving Rules]
• Renters must present: valid original domestic driver's license from country of residence, original passport, a destination-approved International Driving Permit (IDP) or official translation, and the booking confirmation voucher.
• Photocopies, digital scans, electronic licenses, and learner/probational licenses are strictly prohibited.

[Taiwan Market (TW)]
• General Travelers: Valid domestic license + Passport + International Driving Permit (IDP) from country of origin.
• Japan License Holders: Japanese license + Passport + Official Chinese translation issued by JAF or the Japan-Taiwan Exchange Association (an IDP is NOT accepted).
• Hong Kong & Macao Residents: Valid passport + Full local Hong Kong/Macao driving license.
• Regulatory Reciprocity: Under local motor vehicle regulations and reciprocity rules, holders of non-reciprocal driving licenses (such as Mainland China or Austria licenses) cannot self-drive in the Taiwan market.
• Stays Over 30 Days: Travelers staying and driving more than 30 days must register and endorse their IDP at a local Motor Vehicle Office.

[Japan (JP)]
• Statutory Requirement: Drivers without a Japanese license must present their domestic license + Physical booklet IDP issued strictly under the 1949 Geneva Convention (with A/B/C/D/E category stamps).
• Prohibited: Digital IDPs, mobile apps, and 1968 Vienna Convention IDPs are strictly rejected.
• 6 Countries/Regions Exception: License holders from Belgium, France, Germany, Monaco, Switzerland, and Taiwan may drive with their domestic license + Official Japanese translation (must be obtained prior to pickup; no counter exceptions).

[Malaysia]
• Drivers must hold a valid national driving license or an International Driving Permit (IDP).
• Full licenses issued in English permit driving in Malaysia for up to 3 months without an IDP; non-English licenses must be accompanied by an IDP.
• Probational or learner licenses (e.g. P-plates) are strictly not accepted.

[Thailand]
• Drivers must possess at least 1 year of licensed driving experience at the time of rental.
• An International Driving Permit (IDP) is required, or a domestic license with an official English translation (an IDP is mandatory if the license is not in English).
• Cross-border driving outside of Thailand is strictly prohibited.`,

      `【通用自駕通則】
• 取車時必須出示：居住國核發的有效本國駕駛執照正本、護照正本、目的地認可的國際駕照（IDP）或法定官方譯本，以及訂單確認憑證。
• 嚴禁使用影印本、掃描檔、電子駕照或實習／暫准駕照（例如 P 牌）。

【台灣市場（Taiwan Market）】
• 一般旅客：本國駕照正本 + 護照 + 原籍國簽發之有效國際駕照（IDP）。
• 日本駕照持有人：日本駕照正本 + 護照 + JAF 或日台交流協會出具的官方中文譯本（不接受 IDP）。
• 港澳居民：港澳本地有效正式駕照 + 護照。
• 監理互惠資格：依當地監理與雙邊互惠法規，部分非互惠協議之駕照（例如中國大陸居民駕照或奧地利駕照持有人）無法於台灣市場自駕。
• 停留逾 30 天：在台灣市場停留自駕超過 30 天者，須向當地監理所辦理國際駕照簽證登記。

【日本（JP）】
• 法律要求：非日本駕照者必須持有本國有效駕照 + 依 1949 年《日內瓦公約》核發之紙本小冊子實體國際駕照（須具 A/B/C/D/E 蓋印欄）。
• 嚴格限制：絕不接受任何數碼／電子 IDP，亦不接受 1968 年維也納公約 IDP 或商業翻譯件。
• 6 國/地區特例：比利時、法國、德國、摩納哥、瑞士、台灣駕照持有人，可憑本國駕照正本 + 法定官方日文譯本自駕（須在取車前自備，現場無例外）。

【馬來西亞（Malaysia）】
• 須持有有效的本國正式駕照或國際駕照（IDP）。
• 持全英文有效本國正式駕照者，在馬來西亞合法自駕最長為 3 個月；非英文駕照取車時必須同時出示 IDP。
• 嚴禁使用任何實習期或暫准駕照（Probational license / P 牌）。

【泰國（Thailand）】
• 駕駛人取車時必須持有正式駕照滿 1 年（具備至少 1 年持照駕駛經驗）。
• 必須持有有效國際駕照（IDP），或持有附官方英文翻譯之本國駕照；若原駕照非英文，則必須同時出示 IDP。
• 車輛嚴禁駛出泰國境外。`,

      `【海外運転の基本規則】
・受取時の必須提示書類：居住国の有効な運転免許証原本、旅券（パスポート）原本、渡航先の法令で認められた国際運転免許証（IDP）または公的翻訳文、および予約確認書（バウチャー）。
・コピー、スキャン画像、デジタル免許証、仮免許・試用期間免許（初心者マーク・Pプレート）は一切受け付けられません。

【台湾市場（TW）】
・一般旅行者：自国の有効な運転免許証原本 ＋ 旅券原本 ＋ 原籍国発行の有効な国際運転免許証（IDP）。
・日本免許保持者：日本の運転免許証原本 ＋ 旅券原本 ＋ JAFまたは日本台湾交流協会が発行した公式「中国語翻訳文」（※日本免許保持者のIDPは一切不可）。
・香港・マカオ住民：旅券原本 ＋ 香港・マカオの有効な正式運転免許証原本。
・法令上の資格不適合：現地の監理・相互主義法規により、相互承認協定のない特定国・地域（中国本土やオーストリア等）の免許保持者は台湾市場で自走運転できません。
・30日超の滞在：台湾市場に30日を超えて滞在し運転する場合は、現地の監理所で国際免許の裏書き登録手続きが必要です。

【日本（JP）】
・法定要件：日本の免許証をお持ちでない方は、自国免許証原本 ＋ 1949年ジュネーブ条約に基づく紙の小冊子型「国際運転免許証（IDP）」（A/B/C/D/Eスタンプ欄が必要）の提示が必須。
・利用不可：デジタルIDP、スマホ画面、1968年条約免許証は一切受け付けられません。
・6カ国・地域特例：ベルギー、フランス、ドイツ、モナコ、スイス、台湾の免許をお持ちの方は、自国免許原本 ＋ JAFや各大使館等発行の公式「日本語翻訳文」で運転可能（出発前に取得必須）。

【マレーシア（Malaysia）】
・主運転者および追加運転者は、有効な本国運転免許証または国際運転免許証（IDP）を所持している必要があります。
・英語表記の正式本国免許をお持ちの方は最長3ヶ月間IDPなしで運転可能。非英文免許はIDPの併託が必須です。
・プロベーショナル免許（仮免許、試用期間免許、Pプレート）は一切利用できません。

【タイ（Thailand）】
・レンタル時点で免許取得後1年以上の有効な運転経験が必要です。
・有効な国際運転免許証（IDP）、または公式英語訳が添付された自国免許証が必要です（非英文免許はIDP必須）。
・タイ国外への越境運転は一切禁止されています。`,

      `[Normas Generales para Conducir en el Extranjero]
• Imprescindible al recoger: permiso de conducir nacional original y vigente del país de residencia, pasaporte original, Permiso Internacional (IDP) o traducción oficial admitida por el destino y comprobante de la reserva.
• Quedan estrictamente prohibidas fotocopias, imágenes digitales y permisos provisionales o en prácticas.

[Mercado de Taiwán (TW)]
• Viajeros generales: Permiso nacional vigente + Pasaporte + Permiso Internacional (IDP) del país de origen.
• Titulares de permiso japonés: Permiso japonés original + Pasaporte + Traducción oficial al chino emitida por JAF o la Asociación de Intercambio Japón-Taiwán (el IDP NO se admite).
• Residentes de Hong Kong y Macao: Pasaporte + Permiso de conducir oficial de HK/Macao.
• Reciprocidad y normativa: Conforme a la legislación local de tráfico y los convenios de reciprocidad, quienes posean permisos sin acuerdo recíproco (ej. China continental o Austria) no pueden conducir en el mercado de Taiwán.
• Estancias de más de 30 días: Quienes permanezcan y conduzcan más de 30 días en el mercado de Taiwán deben registrar su IDP en una oficina local de tráfico.

[Japón (JP)]
• Exigencia legal: Quienes no tengan carné japonés deben presentar permiso nacional original + Folleto físico de IDP bajo el Convenio de Ginebra de 1949 (con sellos en categorías A/B/C/D/E).
• Prohibido: Se rechazan terminantemente IDP digitales, apps móviles y permisos del Convenio de 1968.
• Excepción 6 países/territorios: Bélgica, Francia, Alemania, Mónaco, Suiza y Taiwán pueden conducir con carné original + Traducción oficial al japonés emitida por JAF o consulados (debe obtenerse antes de la recogida).

[Malasia]
• Se exige permiso de conducir nacional vigente o Permiso Internacional (IDP).
• Los carnés completos en inglés permiten conducir hasta 3 meses sin IDP; los no redactados en inglés deben acompañarse de un IDP.
• No se admiten permisos de aprendizaje ni en periodo de prueba (como la L o P).

[Tailandia]
• Se requiere al menos 1 año de experiencia de conducción con permiso en vigor al momento del alquiler.
• Es obligatorio un Permiso Internacional (IDP) o permiso nacional con traducción oficial al inglés (IDP imprescindible si el carné no está en inglés).
• Está totalmente prohibido salir de Tailandia con el vehículo.`,

      `[해외 운전 기본 규정]
• 픽업 시 필수 제시 서류: 거주국에서 발급된 유효한 자국 운전면허증 원본, 여권 원본, 여행지 법률이 인정하는 유효한 국제운전면허증(IDP) 또는 공식 번역본, 그리고 예약 확인서(바우처).
• 복사본, 스캔 파일, 디지털 면허증 및 임시·수습 면허증은 엄격히 이용 불가합니다.

[대만 시장 (TW)]
• 일반 여행자: 자국 운전면허증 원본 + 여권 + 원적국 발행 유효 국제운전면허증(IDP).
• 일본 면허 소지자: 일본 면허증 원본 + 여권 + JAF 또는 일본대만교류협회 발행 공식 '중국어 번역문' 지참 필수 (일본 면허자의 IDP는 일체 불인정).
• 홍콩·마카오 주민: 여권 원본 + 홍콩·마카오 정식 운전면허증.
• 현지 법령 및 상호주의 요건: 현지 운전면허 감리 및 양자 상호주의 규정에 따라, 상호 협정이 체결되지 않은 특정 국가·지역 면허증(예: 중국 본토 또는 오스트리아 면허) 소지자는 대만 시장에서 자가운전이 불가합니다.
• 30일 초과 체류: 대만 시장에서 30일을 초과하여 체류·운전하는 경우 현지 감리소에서 국제면허 확인 등록을 완료해야 합니다.

[일본 (JP)]
• 법적 요건: 일본 면허증이 없는 운전자는 자국 유효 면허증 원본 + 1949년 제네바 협약에 따른 실물 책자형 국제운전면허증(IDP)(A/B/C/D/E 스탬프 날인 필수) 지참.
• 불인정: 디지털 IDP, 모바일 앱 화면, 1968년 비엔나 협약 면허증은 일체 불가합니다.
• 6개국/지역 특별 협정: 벨기에, 프랑스, 독일, 모나코, 스위스, 대만 면허 소지자는 자국 면허증 원본 + JAF 또는 대사관 등 공인 기관 발행 공식 '일본어 번역문'으로 운전 가능(사전 발급 필수).

[말레이시아]
• 주 운전자 및 추가 운전자는 유효한 본국 운전면허증 또는 국제운전면허증(IDP)을 소지해야 합니다.
• 영문으로 표기된 유효한 정식 면허증 소지자는 최대 3개월간 IDP 없이 운전 가능하며, 비영문 면허증은 IDP를 필히 병기 제시해야 합니다.
• 수습, 임시 또는 연습 면허(P 플레이트 등)는 일체 이용할 수 없습니다.

[태국]
• 렌터카 인수 시점에 정식 운전면허 취득 후 최소 1년 이상의 운전 경력이 필수입니다.
• 유효한 국제운전면허증(IDP) 또는 공인 영문 번역본이 첨부된 자국 면허증 지참 필수(비영문 면허는 IDP 필수).
• 차량을 이용한 태국 국경 외 해외 출국은 엄격히 금지됩니다.`
    )
  ),
  question(
    'driver-age-and-experience-requirements',
    ['rent'],
    text(
      'Are there age, driving experience, or vehicle group requirements?',
      '租車有年齡、持照年限與車型組要求嗎？',
      '年齢、運転経歴、車両グループによる制限はありますか？',
      '¿Hay requisitos de edad, experiencia de conducción o grupo de vehículos?',
      '연령, 운전 경력 및 차량 그룹별 요건이 있나요?'
    ),
    text(
      `[Age Calculation Benchmark]
• Age eligibility is calculated strictly based on the driver's date of birth.

[Benchmark Age Limits by Destination]
• Japan (JP): Minimum age is 18 years old, generally with no maximum age limit.
• Taiwan Market (TW): Minimum age is generally 20 years old, and the maximum age limit is 75 years old.
• Thailand: For self-drive rentals, the minimum age is 21 years old and the maximum age is 70 years old (drivers must hold a full license for at least 1 year; cross-border driving outside Thailand is prohibited).
• Malaysia: Standard vehicle categories (Economy, Compact, Sedans, and Standard SUVs) require drivers to be 21 to 75 years old. Premium, Luxury, or Specialty vehicle categories restrict driver age to 25 to 65 years old.

[Vehicle Group Correlation & Surcharge Guidance]
• Age requirements correlate directly with the selected "Vehicle Group": luxury cars, premium SUVs, or specialty models often mandate higher age thresholds (e.g. 21 or 25 years old).
• Certain locations may apply young or senior driver surcharges for drivers aged 21–24 or over 65.
• The booking system automatically validates eligibility against your entered age during vehicle selection; learner or probational permits are excluded across all markets.`,

      `【年齡計算基準】
• 年齡嚴格依據駕駛人的出生日期計算。

【各目的地市場基準年齡】
• 日本市場（JP）：最低法定年齡為 18 歲，通常無最高年齡上限。
• 台灣市場（TW）：自駕租車最低年齡一般為 20 歲，最高年齡上限一般為 75 歲。
• 泰國市場（Thailand）：自駕租車最低年齡為 21 歲，最高年齡上限為 70 歲；且取車時必須持有正式駕照滿 1 年（車輛不可駛出泰國境外）。
• 馬來西亞市場（Malaysia）：標準常規車型組（經濟型、緊湊型轎車及一般 SUV）：通常為 21 歲至 75 歲；高階、尊貴型休旅或特殊車款：年齡限制為 25 歲至 65 歲。

【車型組別與附加費特別說明（核心參考）】
• 實際年齡門檻與所選「車型組別（Vehicle Group）」直接相關：豪華車、大型休旅車或特殊跑車通常要求更高的年齡門檻（例如 21 歲或 25 歲）。
• 部分門店針對 21-24 歲的年輕駕駛人或 65 歲以上的高齡駕駛人可能收取年輕／高齡駕駛人附加費。
• 預訂時系統會依據輸入之年齡自動核對車型可用性；所有市場均嚴格拒絕學習或實習駕照。`,

      `【年齢計算の基準】
・運転資格の年齢は、生年月日を基準として厳格に計算されます。

【主要渡航先の基準年齢】
・日本市場（JP）：最低年齢は18歳で、原則として最高年齢制限はありません。
・台湾市場（TW）：自走レンタルの最低年齢は原則20歳、最高年齢上限は原則75歳です。
・タイ市場（Thailand）：自走レンタルの最低年齢は21歳、最高年齢は70歳です（また、有効な運転免許取得後1年以上の運転経験が必須であり、国外への越境運転は禁止されています）。
・マレーシア市場（Malaysia）：標準・普通車クラス（エコノミー、コンパクト、一般SUV等）は21歳〜75歳が対象です。高級車・プレミアム・特殊車クラスは25歳〜65歳に制限されます。

【車両グループと追加料金に関する重要事項】
・実際の年齢要件は選択された「車両グループ（クラス）」と直接連動しており、高級車、大型SUV、スポーツカーでは21歳や25歳以上の高い年齢門檻が設定される場合があります。
・一部の地域・店舗では、21〜24歳の若年運転者または65歳以上の高齢運転者に対して追加料金（サーチャージ）が適用される場合があります。
・すべての国において仮免許や試用免許での利用は一切認められません。`,

      `[Cálculo de Edad]
• La edad se calcula estrictamente a partir de la fecha de nacimiento del conductor.

[Límites de Edad por Destino]
• Japón (JP): La edad mínima es de 18 años, generalmente sin límite máximo de edad.
• Mercado de Taiwán (TW): La edad mínima habitual es de 20 años y la máxima de 75 años.
• Tailandia: Para alquiler sin conductor, la edad mínima es de 21 años y la máxima de 70 años (se exige 1 año de carné y está prohibido salir del país).
• Malasia: Las categorías de vehículos estándar (económicos, compactos, berlinas y SUV estándar) exigen entre 21 y 75 años. Los grupos premium o vehículos especiales limitan la edad entre 25 y 65 años.

[Relación con el Grupo de Vehículos y Suplementos]
• Los requisitos de edad varían según el "Grupo de Vehículo": los coches de gama alta, todoterrenos o modelos especiales suelen requerir 21 o 25 años.
• Algunas oficinas aplican suplementos de conductor joven (21-24 años) o mayor (más de 65 años).
• No se admiten permisos provisionales ni en prácticas en ningún país.`,

      `[연령 산정 기준]
• 운전 자격 연령은 생년월일을 기준으로 엄격히 계산됩니다.

[주요 목적지별 기준 연령]
• 일본 시장 (JP): 법적 최저 연령은 만 18세이며, 원칙적으로 최고 연령 상한은 없습니다.
• 대만 시장 (TW): 자가운전 최저 연령은 통상 만 20세, 최고 연령 상한은 만 75세입니다.
• 태국 시장 (Thailand): 자가운전 최저 연령은 만 21세, 최고 연령은 만 70세입니다(운전면허 취득 후 최소 1년 이상 경력 필수, 국경 밖 이동 불가).
• 말레이시아 시장 (Malaysia): 표준 일반 차량 그룹(소형, 준중형 및 일반 SUV 등)은 만 21세~75세 대상이며, 프리미엄·고급·특수 차량 그룹은 만 25세~65세로 제한됩니다.

[차량 그룹 연계 및 추가 요금 유의사항]
• 실제 연령 요건은 선택하신 '차량 그룹(Vehicle Group)'과 직접 연동되며, 고급차나 특수 모델은 만 21세 또는 25세 이상의 높은 기준이 적용될 수 있습니다.
• 만 21~24세 청년 운전자 또는 만 65세 이상 고령 운전자의 경우 추가 요금(서차지)이 부과될 수 있습니다.
• 모든 국가에서 임시 및 연습 면허로는 차량을 대여할 수 없습니다.`
    )
  ),
  question(
    'main-driver-and-payment-card-match',
    ['important', 'rent'],
    text(
      'Must the main driver match the payment cardholder, and can debit cards be used?',
      '主駕駛人與付款卡持有人必須是同一人嗎？可以使用借記卡嗎？',
      '主運転者とカード名義人は同一である必要がありますか？デビットカードは使えますか？',
      '¿Deben coincidir el conductor principal y el titular de la tarjeta? ¿Se aceptan tarjetas de débito?',
      '주 운전자와 카드 명의자가 동일해야 하나요? 체크카드를 사용할 수 있나요?'
    ),
    text(
      `Cardholder-name and card-type requirements for payment and deposit at pickup depend on the selected booking and serving branch. Some branches require a physical card in the main driver's name; others may accept another cardholder when the booking terms allow it and the cardholder is present for verification. Debit, prepaid and virtual-card support also varies and may differ from online payment rules. Before travel, check the booking's pickup requirements or confirm with the branch, and bring an accepted card with enough available credit for any pre-authorisation.`,
      `取車時付款及押金所適用的持卡人姓名與卡片種類要求，取決於所選訂單和服務門店。部分門店要求主駕駛人出示本人名下的實體卡；如訂單條款及門店政策允許，其他持卡人到場並完成核驗後也可能可以使用。借記卡、預付卡及虛擬卡的接受情況亦因門店而異，且可能與網上付款規則不同。出發前請查看訂單的取車要求或向門店確認，並攜帶符合要求且有足夠可用額度完成預授權的卡片。`,
      `受取時の支払い・デポジットに関する名義とカード種類の条件は、予約内容と対応店舗により異なります。主運転者本人名義の物理カードを求める店舗もあれば、予約条件と店舗方針で認められ、名義人が来店して確認を受ける場合に別名義カードを利用できることもあります。デビット、プリペイド、バーチャルカードの可否も店舗ごとに異なり、オンライン決済の条件とは一致しない場合があります。出発前に予約の受取条件または店舗へ確認し、事前承認に必要な利用可能額のある対象カードをご用意ください。`,
      `Los requisitos de titular y tipo de tarjeta para el pago y depósito al recoger dependen de la reserva y de la oficina. Algunas exigen una tarjeta física a nombre del conductor principal; otras pueden aceptar a otro titular si lo permiten las condiciones y está presente para la verificación. La aceptación de débito, prepago o tarjetas virtuales también varía y puede diferir de las reglas online. Antes del viaje, revisa los requisitos o confirma con la oficina y lleva una tarjeta aceptada con crédito suficiente para la preautorización.`,
      `픽업 시 결제 및 보증금의 카드 명의자와 카드 종류 요건은 선택한 예약과 서비스 지점에 따라 다릅니다. 일부 지점은 주 운전자 명의의 실물 카드를 요구하지만, 예약 조건과 지점 정책이 허용하고 카드 명의자가 현장에서 인증하면 다른 명의의 카드를 받을 수도 있습니다. 직불, 선불 및 가상 카드 허용 여부도 지점마다 다르며 온라인 결제 규정과 다를 수 있습니다. 출발 전에 예약의 픽업 요건을 확인하거나 지점에 문의하고 사전 승인에 필요한 충분한 가용 한도가 있는 허용 카드를 준비하세요.`
    )
  ),
  question(
    'additional-driver-requirements',
    ['important', 'manage'],
    text(
      'Can I add an additional driver, and what are the conditions?',
      '可以增加附加駕駛人嗎？有哪些條件？',
      '追加運転者を登録できますか？条件はどうなっていますか？',
      '¿Puedo añadir un conductor adicional y cuáles son las condiciones?',
      '추가 운전자를 등록할 수 있나요? 어떤 조건이 있나요?'
    ),
    text(
      `[Additional Driver Registration Rules]
• Location: Additional drivers must be officially registered at the rental counter.
• Presence & Verification: Every additional driver must appear in person and present their valid domestic driving license, passport, and applicable IDP/translation.
• Equal Standards: Additional drivers must meet the exact same age, license duration, and qualification rules as the main driver.
• Insurance Protection: Driving by unregistered individuals is strictly prohibited and immediately voids all insurance coverage.`,

      `【附加駕駛人登記規則】
• 登記地點：在租賃條款允許的情況下，附加駕駛人須於取車門店櫃檯完成登記。
• 親自到場核驗：每位附加駕駛人都必須親自到場，出示有效本國駕照正本、護照正本及符合目的地規定的 IDP 或法定譯本。
• 資格同等標準：附加駕駛人必須完全符合與主駕駛人相同的年齡、駕齡門檻及法規要求。
• 保險保障效力：嚴格禁止未在合約登記的人員駕駛車輛，否則所有車險與賠償保障將全部失效。`,

      `【追加運転者の登録規定】
・登録場所：貸渡条件で認められている場合、出発店舗のカウンターで追加運転者を登録できます。
・本人来店と原本確認：すべての追加運転者が直接来店し、自国免許証原本、旅券、該当するIDPまたは公的翻訳文を提示する必要があります。
・同一の資格基準：追加運転者にも、主運転者と全く同一の年齢制限、運転経歴、法規要件が適用されます。
・保険補償の適用：契約書に未登録の方の運転は固く禁じられており、違反した場合はすべての保険・補償が無効となります。`,

      `[Registro de Conductores Adicionales]
• Lugar de registro: Si las condiciones lo permiten, deben registrarse en el mostrador de la oficina.
• Presencia física y verificación: Cada conductor adicional debe acudir en persona y presentar carné de conducir original, pasaporte e IDP o traducción correspondiente.
• Mismos requisitos: Se aplican exactamente los mismos criterios de edad, experiencia y validez que al conductor principal.
• Validez del seguro: Conducir sin estar registrado está terminantemente prohibido e invalida cualquier cobertura.`,

      `[추가 운전자 등록 규정]
• 등록 장소: 대여 약관상 허용되는 경우 픽업 지점 카운터에서 추가 운전자를 등록할 수 있습니다.
• 본인 방문 및 원본 확인: 모든 추가 운전자가 현장에 직접 방문하여 자국 운전면허증 원본, 여권 및 해당 IDP/번역문을 제시해야 합니다.
• 동일한 자격 기준: 추가 운전자에게도 주 운전자와 완전히 동일한 연령, 운전 경력 및 법적 자격 요건이 적용됩니다.
• 보험 보장 효력: 계약서에 등록되지 않은 사람의 운전은 엄격히 금지되며, 위반 시 모든 보험 및 보장이 즉시 무효화됩니다.`
    )
  ),
  question(
    'rental-refusal-conditions',
    ['important', 'support'],
    text(
      'Are there situations where vehicle handover is refused even with a valid license?',
      '即使有有效駕照，也有不能租車的情況嗎？',
      '有効な運転免許証があっても貸渡を拒否される場合はありますか？',
      '¿Hay situaciones en las que se deniegue el alquiler aun teniendo carné válido?',
      '유효한 면허가 있어도 대여가 거절되는 경우가 있나요?'
    ),
    text(
      `[Grounds for Rental Refusal at the Counter]
• Sobriety & Fitness: The driver appears under the influence of alcohol, drugs, or severe physical/mental impairment.
• Identity Mismatch: The person collecting the vehicle does not match the driver named in the booking confirmation.
• Statutory Ineligibility: Destination reciprocity laws prohibit the driver (e.g. driving in the Taiwan market with a non-reciprocal foreign driving permit).
• Payment Card Failure: The main driver fails to provide a physical credit card in their name, or available funds are insufficient for the deposit pre-authorisation.
• Unsettled Debts: Outstanding payments or dispute records remain from a previous rental.`,

      `【門店有權拒絕交車的法定與風控情形】
• 酒精或狀態不宜：駕駛人疑似受酒精、藥物影響或呈現嚴重精神/體力不支狀態。
• 身分不符：到店取車人員與訂單確認單上的主駕駛人身分不一致。
• 監理互惠准入不符：目的地互惠法規不符合自駕資格之情形（例如於台灣市場持未簽署互惠協議之特定駕照）。
• 信用卡與押金不符：無法出示主駕駛人本人名下實體信用卡，或可用額度不足以完成押金預授權。
• 歷史欠款未清：過往租車合約有尚未結清之費用、罰單或爭議欠款。`,

      `【貸渡を拒否される主な事由】
・飲酒または体調不良：飲酒、薬物の影響、または著しい過労・体調不良が認められる場合。
・予約者との不一致：来店者が予約確認書上の主運転者本人と一致しない場合。
・法令上の資格不適合：現地の監理・相互主義法令により運転資格が認められない場合（台湾市場における非相互協定国の免許保持者など）。
・カード・デポジット不備：主運転者名義の物理クレジットカードを提示できない、またはデポジット枠が不足している場合。
・過去の未払い：過去のレンタルで未払金、反則金、トラブル履歴が残っている場合。`,

      `[Motivos de Denegación del Alquiler en Mostrador]
• Embriaguez o incapacidad: El conductor muestra signos de consumo de alcohol, sustancias o fatiga extrema.
• Discrepancia de identidad: La persona que acude no coincide con el conductor indicado en la reserva.
• Incompatibilidad legal: La normativa local no reconoce reciprocidad de conducción (ej. conducir en el mercado de Taiwán con permisos sin convenio recíproco).
• Fallo en la fianza: No se presenta tarjeta de crédito física a nombre del conductor o el saldo es insuficiente.
• Deudas pendientes: Existen importes impagados o sanciones pendientes de alquileres anteriores.`,

      `[카운터에서 대여가 거절될 수 있는 주요 사유]
• 음주 또는 신체 부적합: 음주, 약물 복용 징후가 있거나 심각한 피로·신체 이상 상태로 판단되는 경우.
• 신원 불일치: 픽업 방문자가 예약 확인서 상의 주 운전자 본인과 일치하지 않는 경우.
• 법적 상호주의 결격: 여행지 법령상 운전 자격이 인정되지 않는 경우(대만 시장 내 상호주의 미체결국 면허 소지자 등).
• 보증금 카드 미비: 주 운전자 본인 명의의 실물 신용카드를 제시하지 못하거나 보증금 한도가 부족한 경우.
• 과거 미납 내역: 이전 대여에서 미납된 요금, 과태료 또는 미해결 분쟁 내역이 남아 있는 경우.`
    )
  ),
  question(
    'driver-arrangement-prohibited',
    ['support'],
    text(
      'Can the branch arrange or hire a driver for me?',
      '門店可以代為安排駕駛人嗎？',
      '店舗で運転手を手配・紹介してもらえますか？',
      '¿Puede la oficina proporcionarme un conductor?',
      '지점에서 운전자를 대신 배정해 줄 수 있나요?'
    ),
    text(
      `[Prohibition of Driver Intermediary Services]
• Self-Drive Only: TrustGo strictly provides self-drive vehicle rental services only.
• Legal Prohibition: Transport laws strictly forbid vehicle rental companies from acting as drivers, providing chauffeur services, or introducing drivers as an intermediary.
• Customer Responsibility: Customers must independently arrange their own qualified drivers and officially register all drivers on the rental agreement prior to vehicle handover.`,

      `【禁止代客駕駛與中介安排說明】
• 僅提供自駕租賃：TrustGo 僅提供無人駕駛之自駕車輛租賃服務。
• 法律嚴格禁止：各國道路交通運輸法規明文禁止租車公司代客駕駛、派遣司機或作為中介介紹駕駛人。
• 客戶自備責任：承租人必須自行安排符合法規與合約資格的合格駕駛人，並於取車時正式登記至合約中。`,

      `【運転代行および紹介業務の禁止について】
・自走レンタカー専用：TrustGoは運転者の付かない自走レンタカー貸渡のみを提供しています。
・法令による禁止：道路運送法等の法令により、レンタカー会社が運転手を派遣したり、運転代行や運転手の紹介・斡旋を行うことは厳格に禁止されています。
・お客様ご自身の手配：適格な運転資格を持つ運転者をお客様ご自身で手配し、受取時に契約書へ正しく登録してください。`,

      `[Prohibición de Servicios de Conductor o Chófer]
• Solo alquiler sin conductor: TrustGo ofrece exclusivamente vehículos en modalidad de alquiler sin conductor.
• Prohibición legal: La legislación prohíbe expresamente a las empresas de alquiler actuar como chóferes o intermediar conductores.
• Responsabilidad del cliente: El cliente debe contar con sus propios conductores cualificados y registrarlos debidamente en el contrato.`,

      `[운전자 알선 및 대행 금지 안내]
• 자가운전 대여 전용: TrustGo은 운전자가 포함되지 않은 순수 자가운전 렌터카 대여 서비스만을 제공합니다.
• 법적 금지 사항: 도로교통 관련 법률에 따라 렌터카 업체가 직접 운전 기사를 제공하거나 대리운전, 운전자 알선·중개를 하는 행위는 엄격히 금지되어 있습니다.
• 고객 직접 준비: 법적 자격을 갖춘 운전자를 고객께서 직접 준비하셔야 하며, 차량 인수 전 대여 계약서에 정식 등록해야 합니다.`
    )
  ),
];
