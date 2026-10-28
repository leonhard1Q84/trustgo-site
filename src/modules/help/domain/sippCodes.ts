import type {RouteLanguage} from '@/i18n/locales';

type LocaleText = Record<RouteLanguage, string>;

type SippCodeDefinition = {
  code: string;
  label: LocaleText;
};

export type SippCodeSection = {
  id: string;
  position: string;
  title: string;
  description: string;
  entries: Array<{code: string; label: string}>;
};

export type SippCodeGuide = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  helpCenter: string;
  backToHelp: string;
  exampleTitle: string;
  exampleIntro: string;
  exampleResult: string;
  classRuleTitle: string;
  classRuleBody: string;
  tableHeadingCode: string;
  tableHeadingMeaning: string;
  sourceLabel: string;
  sourceName: string;
  sourceNote: string;
  sections: SippCodeSection[];
};

const text = (en: string, zh: string, ja: string, es: string, ko: string): LocaleText => ({en, zh, ja, es, ko});

const categoryCodes: SippCodeDefinition[] = [
  {code: 'M', label: text('Mini', '微型車', 'ミニ', 'Mini', '미니')},
  {code: 'N', label: text('Mini Elite', '精緻微型車', 'ミニ・エリート', 'Mini Elite', '미니 엘리트')},
  {code: 'E', label: text('Economy', '經濟型', 'エコノミー', 'Económico', '이코노미')},
  {code: 'H', label: text('Economy Elite', '精緻經濟型', 'エコノミー・エリート', 'Económico Elite', '이코노미 엘리트')},
  {code: 'C', label: text('Compact', '緊湊型', 'コンパクト', 'Compacto', '컴팩트')},
  {code: 'D', label: text('Compact Elite', '精緻緊湊型', 'コンパクト・エリート', 'Compacto Elite', '컴팩트 엘리트')},
  {code: 'I', label: text('Intermediate', '中型', 'インターミディエイト', 'Intermedio', '중형')},
  {code: 'J', label: text('Intermediate Elite', '精緻中型', 'インターミディエイト・エリート', 'Intermedio Elite', '중형 엘리트')},
  {code: 'S', label: text('Standard', '標準型', 'スタンダード', 'Estándar', '스탠다드')},
  {code: 'R', label: text('Standard Elite', '精緻標準型', 'スタンダード・エリート', 'Estándar Elite', '스탠다드 엘리트')},
  {code: 'F', label: text('Fullsize', '大型', 'フルサイズ', 'Grande', '풀사이즈')},
  {code: 'G', label: text('Fullsize Elite', '精緻大型', 'フルサイズ・エリート', 'Grande Elite', '풀사이즈 엘리트')},
  {code: 'P', label: text('Premium', '高級', 'プレミアム', 'Premium', '프리미엄')},
  {code: 'U', label: text('Premium Elite', '精緻高級', 'プレミアム・エリート', 'Premium Elite', '프리미엄 엘리트')},
  {code: 'L', label: text('Luxury', '豪華', 'ラグジュアリー', 'Lujo', '럭셔리')},
  {code: 'W', label: text('Luxury Elite', '精緻豪華', 'ラグジュアリー・エリート', 'Lujo Elite', '럭셔리 엘리트')},
  {code: 'O', label: text('Oversize', '超大型', 'オーバーサイズ', 'Extragrande', '오버사이즈')},
  {code: 'X', label: text('Special', '特殊車型', 'スペシャル', 'Especial', '스페셜')},
];

const bodyCodes: SippCodeDefinition[] = [
  {code: 'B', label: text('2/3 door', '2/3 門', '2/3ドア', '2/3 puertas', '2/3도어')},
  {code: 'C', label: text('2/4 door', '2/4 門', '2/4ドア', '2/4 puertas', '2/4도어')},
  {code: 'D', label: text('4/5 door', '4/5 門', '4/5ドア', '4/5 puertas', '4/5도어')},
  {code: 'W', label: text('Estate / Wagon', '旅行車', 'ステーションワゴン', 'Familiar', '왜건')},
  {code: 'V', label: text('Passenger Van', '客運廂型車', 'パッセンジャーバン', 'Monovolumen', '승합 밴')},
  {code: 'L', label: text('Limousine', '加長豪華轎車', 'リムジン', 'Limusina', '리무진')},
  {code: 'S', label: text('Sport', '跑車', 'スポーツ', 'Deportivo', '스포츠')},
  {code: 'T', label: text('Convertible', '敞篷車', 'オープンカー', 'Descapotable', '컨버터블')},
  {code: 'F', label: text('SUV', '休旅車 (SUV)', 'SUV', 'SUV', 'SUV')},
  {code: 'J', label: text('Open-air all-terrain', '敞篷全地形車', 'オープン全地形対応車', 'Todoterreno abierto', '오픈 전지형차')},
  {code: 'X', label: text('Special', '特殊車身', 'スペシャルボディ', 'Carrocería especial', '특수 차체')},
  {code: 'P', label: text('Pickup regular cab', '單排皮卡', 'レギュラーキャブ・ピックアップ', 'Pickup cabina simple', '싱글캡 픽업')},
  {code: 'Q', label: text('Pickup extended cab', '一排半皮卡', 'エクステンドキャブ・ピックアップ', 'Pickup cabina extendida', '더블캡 픽업')},
  {code: 'Z', label: text('Special commercial', '特殊商用車', '特殊商用車', 'Comercial especial', '특수 상용차')},
  {code: 'E', label: text('Coupe', '雙門轎跑', 'クーペ', 'Coupé', '쿠페')},
  {code: 'M', label: text('Monospace', '單廂多功能車', 'モスペース', 'Monovolumen compacto', '모노스페이스')},
  {code: 'H', label: text('Motor home', '露營車', 'キャンピングカー', 'Autocaravana', '캠핑카')},
  {code: 'Y', label: text('2-wheel vehicle', '兩輪車', '二輪車', 'Vehículo de 2 ruedas', '이륜차')},
  {code: 'N', label: text('Roadster', '雙座敞篷跑車', 'ロードスター', 'Roadster', '로드스터')},
  {code: 'G', label: text('Crossover', '跨界休旅車', 'クロスオーバー', 'Crossover', '크로스오버')},
  {code: 'K', label: text('Commercial van', '商用廂型車', '商用バン', 'Furgoneta comercial', '상용 밴')},
];

const transmissionCodes: SippCodeDefinition[] = [
  {code: 'M', label: text('Manual, unspecified drive', '手動變速，未指定驅動', 'マニュアル・駆動指定なし', 'Manual, tracción no especificada', '수동 변속, 구동 미지정')},
  {code: 'N', label: text('Manual, 4WD', '手動變速，4WD', 'マニュアル・4WD', 'Manual, 4x4', '수동 변속, 4WD')},
  {code: 'C', label: text('Manual, AWD', '手動變速，AWD', 'マニュアル・AWD', 'Manual, AWD', '수동 변속, AWD')},
  {code: 'A', label: text('Automatic, unspecified drive', '自動變速，未指定驅動', 'オートマチック・駆動指定なし', 'Automático, tracción no especificada', '자동 변속, 구동 미지정')},
  {code: 'B', label: text('Automatic, 4WD', '自動變速，4WD', 'オートマチック・4WD', 'Automático, 4x4', '자동 변속, 4WD')},
  {code: 'D', label: text('Automatic, AWD', '自動變速，AWD', 'オートマチック・AWD', 'Automático, AWD', '자동 변속, AWD')},
];

const fuelCodes: SippCodeDefinition[] = [
  {code: 'R', label: text('Unspecified fuel / power with air conditioning', '未指定燃料/動力，配備空調', '燃料指定なし・エアコンあり', 'Combustible no especificado con aire acondicionado', '연료 미지정, 에어컨 있음')},
  {code: 'N', label: text('Unspecified fuel / power without air conditioning', '未指定燃料/動力，無空調', '燃料指定なし・エアコンなし', 'Combustible no especificado sin aire acondicionado', '연료 미지정, 에어컨 없음')},
  {code: 'D', label: text('Diesel with air conditioning', '柴油，配備空調', 'ディーゼル・エアコンあり', 'Diésel con aire acondicionado', '디젤, 에어컨 있음')},
  {code: 'Q', label: text('Diesel without air conditioning', '柴油，無空調', 'ディーゼル・エアコンなし', 'Diésel sin aire acondicionado', '디젤, 에어컨 없음')},
  {code: 'H', label: text('Hybrid with air conditioning', '油電混合，配備空調', 'ハイブリッド・エアコンあり', 'Híbrido con aire acondicionado', '하이브리드, 에어컨 있음')},
  {code: 'I', label: text('Hybrid without air conditioning', '油電混合，無空調', 'ハイブリッド・エアコンなし', 'Híbrido sin aire acondicionado', '하이브리드, 에어컨 없음')},
  {code: 'E', label: text('Electric with air conditioning', '純電動，配備空調', '電気・エアコンあり', 'Eléctrico con aire acondicionado', '전기, 에어컨 있음')},
  {code: 'C', label: text('Electric without air conditioning', '純電動，無空調', '電気・エアコンなし', 'Eléctrico sin aire acondicionado', '전기, 에어컨 없음')},
  {code: 'L', label: text('LPG with air conditioning', '液化石油氣，配備空調', 'LPG・エアコンあり', 'GLP con aire acondicionado', 'LPG, 에어컨 있음')},
  {code: 'S', label: text('LPG without air conditioning', '液化石油氣，無空調', 'LPG・エアコンなし', 'GLP sin aire acondicionado', 'LPG, 에어컨 없음')},
  {code: 'A', label: text('Hydrogen with air conditioning', '氫動力，配備空調', '水素・エアコンあり', 'Hidrógeno con aire acondicionado', '수소, 에어컨 있음')},
  {code: 'B', label: text('Hydrogen without air conditioning', '氫動力，無空調', '水素・エアコンなし', 'Hidrógeno sin aire acondicionado', '수소, 에어컨 없음')},
  {code: 'M', label: text('Multi-fuel with air conditioning', '多燃料，配備空調', 'マルチフューエル・エアコンあり', 'Multicombustible con aire acondicionado', '다중 연료, 에어컨 있음')},
  {code: 'F', label: text('Multi-fuel without air conditioning', '多燃料，無空調', 'マルチフューエル・エアコンなし', 'Multicombustible sin aire acondicionado', '다중 연료, 에어컨 없음')},
  {code: 'V', label: text('Petrol with air conditioning', '汽油，配備空調', 'ガソリン・エアコンあり', 'Gasolina con aire acondicionado', '휘발유, 에어컨 있음')},
  {code: 'Z', label: text('Petrol without air conditioning', '汽油，無空調', 'ガソリン・エアコンなし', 'Gasolina sin aire acondicionado', '휘발유, 에어컨 없음')},
  {code: 'U', label: text('Ethanol with air conditioning', '乙醇，配備空調', 'エタノール・エアコンあり', 'Etanol con aire acondicionado', '에탄올, 에어컨 있음')},
  {code: 'X', label: text('Ethanol without air conditioning', '乙醇，無空調', 'エタノール・エアコンなし', 'Etanol sin aire acondicionado', '에탄올, 에어컨 없음')},
];

const sectionCopy = {
  category: {
    position: text('1st character', '第 1 位', '1文字目', '1.er carácter', '첫 번째 문자'),
    title: text('Vehicle category', '車輛級別', '車両カテゴリー', 'Categoría del vehículo', '차량 등급'),
    description: text('Indicates the size or market level of the vehicle class.', '表示車型組的尺寸或市場級別。', '車両クラスのサイズまたは市場上のグレードを示します。', 'Indica el tamaño o nivel comercial de la categoría.', '차량 등급의 크기 또는 시장 수준을 나타냅니다.'),
  },
  body: {
    position: text('2nd character', '第 2 位', '2文字目', '2.º carácter', '두 번째 문자'),
    title: text('Body type or doors', '車身類型或車門數', 'ボディタイプまたはドア数', 'Carrocería o puertas', '차체 유형 또는 도어 수'),
    description: text('Describes the body style, usage or number of doors.', '描述車身形式、用途或車門數。', 'ボディ形状、用途、またはドア数を示します。', 'Describe la carrocería, el uso o el número de puertas.', '차체 형태, 용도 또는 도어 수를 나타냅니다.'),
  },
  transmission: {
    position: text('3rd character', '第 3 位', '3文字目', '3.er carácter', '세 번째 문자'),
    title: text('Transmission and drive', '變速箱及驅動方式', 'トランスミッションと駆動方式', 'Transmisión y tracción', '변속기 및 구동 방식'),
    description: text('Shows manual or automatic transmission and, where specified, 4WD or AWD.', '表示手動或自動變速，以及在有標示時的 4WD 或 AWD。', 'マニュアル／オートマチックと、指定される場合は4WD／AWDを示します。', 'Indica cambio manual o automático y, cuando se especifica, 4x4 o AWD.', '수동 또는 자동 변속과 표시된 경우 4WD 또는 AWD를 나타냅니다.'),
  },
  fuel: {
    position: text('4th character', '第 4 位', '4文字目', '4.º carácter', '네 번째 문자'),
    title: text('Fuel and air conditioning', '燃料及空調', '燃料とエアコン', 'Combustible y aire acondicionado', '연료 및 에어컨'),
    description: text('Combines the fuel or power source with air-conditioning availability.', '同時表示燃料或動力來源，以及是否配備空調。', '燃料・動力源とエアコンの有無を組み合わせて示します。', 'Combina el combustible o energía con la disponibilidad de aire acondicionado.', '연료 또는 동력원과 에어컨 유무를 함께 나타냅니다.'),
  },
};

const pageCopy: Record<RouteLanguage, Omit<SippCodeGuide, 'sections'>> = {
  en: {
    metaTitle: 'SIPP car rental codes guide | TrustGo',
    metaDescription: 'Decode the four characters in a SIPP vehicle-class code: category, body type, transmission, drive, fuel and air conditioning.',
    eyebrow: 'Vehicle class reference',
    title: 'SIPP code guide',
    intro: 'A SIPP code is a four-character car-rental classification that summarises key features of a vehicle class. It helps compare similar classes across booking channels.',
    helpCenter: 'Help Center',
    backToHelp: 'Back to Help Center',
    exampleTitle: 'How to read CDMR',
    exampleIntro: 'Read the code from left to right. Each position describes one part of the vehicle class.',
    exampleResult: 'Compact, 4/5 door, manual transmission, unspecified fuel with air conditioning.',
    classRuleTitle: 'A SIPP code does not guarantee an exact model',
    classRuleBody: 'Your reservation confirms a vehicle class, not a specific make, model or colour. Model images and names are examples. The Quote and booking confirmation show the class and features included in your reservation.',
    tableHeadingCode: 'Code',
    tableHeadingMeaning: 'Meaning',
    sourceLabel: 'Fleet Classification Standard',
    sourceName: 'TrustGo Official SIPP Vehicle Matrix',
    sourceNote: 'TrustGo adopts international ACRISS / SIPP industry standards. Your Quote and booking confirmation serve as the final binding specification for vehicle category and amenities.',
  },
  zh: {
    metaTitle: 'SIPP Code 租車車型組代碼指南 | TrustGo',
    metaDescription: '了解 SIPP 車型組代碼四個字元所代表的車輛級別、車身、變速箱、驅動方式、燃料及空調。',
    eyebrow: '車型組參考資料',
    title: 'SIPP Code 車型組代碼指南',
    intro: 'SIPP Code 是國際租車業採用的四字元車型組分類標準，用於概括車輛級別、車身、傳動與動力配置，方便您精準選擇適合行程的車型組。',
    helpCenter: '幫助中心',
    backToHelp: '返回幫助中心',
    exampleTitle: '如何解讀 CDMR',
    exampleIntro: '請由左至右閱讀，每一位分別描述車型組的一項核心特徵。',
    exampleResult: '緊湊型、4/5 門、手動變速、燃料未指定並配備空調。',
    classRuleTitle: 'SIPP Code 車型組配車原則',
    classRuleBody: '預訂確認的是車型組級別與配備，而非特定單一車款。展示車輛為該組代表車型；您的 Quote 報價單及預訂確認所列車型組、乘員行李空間及配備才是該筆預訂的履約依據。',
    tableHeadingCode: '代碼',
    tableHeadingMeaning: '含義',
    sourceLabel: '車隊分類規範',
    sourceName: 'TrustGo 官方 SIPP 車型代碼標準',
    sourceNote: 'TrustGo 車輛分類標準遵循國際租車業 ACRISS / SIPP 代碼規範。實際預訂請以您的 Quote 報價單及預訂確認所列車型組與配備為最終依據。',
  },
  ja: {
    metaTitle: 'レンタカーSIPPコードガイド | TrustGo',
    metaDescription: 'SIPP車両クラスコード4文字が示すカテゴリー、ボディ、変速機、駆動方式、燃料、エアコンを確認できます。',
    eyebrow: '車両クラス参考資料',
    title: 'SIPPコードガイド',
    intro: 'SIPPコードは、車両クラスの主な特徴を4文字でまとめる国際レンタカー業界標準の分類です。ご旅程に最適な車両クラスを正確にお選びいただけます。',
    helpCenter: 'ヘルプセンター',
    backToHelp: 'ヘルプセンターへ戻る',
    exampleTitle: 'CDMRの読み方',
    exampleIntro: '左から順に読み、各文字が車両クラスの特徴を1つずつ示します。',
    exampleResult: 'コンパクト、4/5ドア、マニュアル、燃料指定なし、エアコンあり。',
    classRuleTitle: 'SIPPコードの配車原則について',
    classRuleBody: '予約で確定するのは車両クラス（グレード・乗車定員・荷物容量等）であり、特定の単一車種や車体色ではありません。表示車種は代表例です。見積と予約確認に表示されるクラスと装備が最終的な履行基準となります。',
    tableHeadingCode: 'コード',
    tableHeadingMeaning: '意味',
    sourceLabel: '車両分類基準',
    sourceName: 'TrustGo 公式 SIPP 車両コード基準',
    sourceNote: 'TrustGoの車両分類は国際レンタカーACRISS/SIPP基準に準拠しています。実際の予約では、TrustGoの見積と予約確認に表示されるSIPPコードと装備が最終記録となります。',
  },
  es: {
    metaTitle: 'Guía de códigos SIPP de alquiler | TrustGo',
    metaDescription: 'Descifra los cuatro caracteres SIPP: categoría, carrocería, transmisión, tracción, combustible y aire acondicionado.',
    eyebrow: 'Referencia de categorías',
    title: 'Guía de códigos SIPP',
    intro: 'Un código SIPP es una clasificación estandarizada de cuatro caracteres que resume las características principales de una categoría de vehículo para ayudarte a elegir el coche ideal para tu viaje.',
    helpCenter: 'Centro de ayuda',
    backToHelp: 'Volver al Centro de ayuda',
    exampleTitle: 'Cómo leer CDMR',
    exampleIntro: 'Lee de izquierda a derecha. Cada posición describe una característica clave de la categoría.',
    exampleResult: 'Compacto, 4/5 puertas, cambio manual, combustible sin especificar y aire acondicionado.',
    classRuleTitle: 'Principio de asignación de categoría SIPP',
    classRuleBody: 'La reserva confirma una categoría de vehículo con capacidad y comodidades garantizadas, no un modelo o color específico. La oferta y la confirmación de TrustGo indican las características vinculantes.',
    tableHeadingCode: 'Código',
    tableHeadingMeaning: 'Significado',
    sourceLabel: 'Normativa de flota',
    sourceName: 'Estándar oficial de códigos SIPP de TrustGo',
    sourceNote: 'TrustGo se adhiere a los estándares internacionales ACRISS / SIPP. Prevalecen el código SIPP y las características que figuran en tu oferta y confirmación.',
  },
  ko: {
    metaTitle: '렌터카 SIPP 코드 가이드 | TrustGo',
    metaDescription: 'SIPP 차량 등급 코드 네 문자가 나타내는 카테고리, 차체, 변속기, 구동 방식, 연료와 에어컨을 확인하세요.',
    eyebrow: '차량 등급 참고 자료',
    title: 'SIPP 코드 가이드',
    intro: 'SIPP 코드는 차량 등급의 주요 특징을 네 문자로 요약하는 국제 렌터카 표준 분류입니다. 여정에 가장 적합한 차량 등급을 정확하게 선택할 수 있도록 돕습니다.',
    helpCenter: '도움말 센터',
    backToHelp: '도움말 센터로 돌아가기',
    exampleTitle: 'CDMR 읽는 방법',
    exampleIntro: '왼쪽부터 순서대로 읽으며 각 문자는 차량 등급의 핵심 특징을 나타냅니다.',
    exampleResult: '컴팩트, 4/5도어, 수동 변속, 연료 미지정, 에어컨 있음.',
    classRuleTitle: 'SIPP 코드 배차 원칙 안내',
    classRuleBody: '예약은 특정 단일 차종이 아닌 차량 등급(승차 인원, 수하물 용량, 편의 사양 등)으로 확정됩니다. 표시된 차량 이미지는 대표 예시이며, 견적서와 예약 확인서의 사양이 최종 보증 기준입니다.',
    tableHeadingCode: '코드',
    tableHeadingMeaning: '의미',
    sourceLabel: '차량 분류 기준',
    sourceName: 'TrustGo 공식 SIPP 차량 등급 표준',
    sourceNote: 'TrustGo의 차량 분류는 국제 렌터카 ACRISS / SIPP 표준을 준수합니다. 실제 예약은 견적서와 예약 확인서에 표시된 SIPP 코드 및 사양을 최종 기준으로 적용합니다.',
  },
};

function localizeEntries(entries: SippCodeDefinition[], lang: RouteLanguage) {
  return entries.map(({code, label}) => ({code, label: label[lang]}));
}

export function getSippCodeGuide(lang: RouteLanguage): SippCodeGuide {
  return {
    ...pageCopy[lang],
    sections: [
      {id: 'category', position: sectionCopy.category.position[lang], title: sectionCopy.category.title[lang], description: sectionCopy.category.description[lang], entries: localizeEntries(categoryCodes, lang)},
      {id: 'body', position: sectionCopy.body.position[lang], title: sectionCopy.body.title[lang], description: sectionCopy.body.description[lang], entries: localizeEntries(bodyCodes, lang)},
      {id: 'transmission', position: sectionCopy.transmission.position[lang], title: sectionCopy.transmission.title[lang], description: sectionCopy.transmission.description[lang], entries: localizeEntries(transmissionCodes, lang)},
      {id: 'fuel', position: sectionCopy.fuel.position[lang], title: sectionCopy.fuel.title[lang], description: sectionCopy.fuel.description[lang], entries: localizeEntries(fuelCodes, lang)},
    ],
  };
}
