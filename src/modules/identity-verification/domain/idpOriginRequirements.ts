export type LocalizedText = {
  en: string;
  zh: string;
  ja?: string;
  es?: string;
  ko?: string;
};

export type SourceIssuer = {
  name: string;
  url?: string;
};

export type SourceImage = {
  src: string;
  alt: LocalizedText;
  caption: LocalizedText;
};

export type IdpOriginRequirement = {
  id: string;
  name: LocalizedText;
  route: 'idp1949' | 'translation' | 'unsupported';
  passportCondition?: LocalizedText;
  doList?: LocalizedText[];
  dontList?: LocalizedText[];
  summary: LocalizedText;
  requirements: LocalizedText[];
  notes: LocalizedText[];
  issuers: SourceIssuer[];
  flagSrc?: string;
  images: SourceImage[];
};

const t = (en: string, zh: string, ja?: string, es?: string, ko?: string): LocalizedText => ({
  en,
  zh,
  ja,
  es,
  ko,
});

const assetBase = '/images/help/driver-documents/idp-1949';

const commonIdpRequirements = (country: string, countryZh: string): LocalizedText[] => [
  t(
    `Original physical driving license issued by ${country}.`,
    `${countryZh}簽發的有效實體駕照正本。`
  ),
  t(
    'Original paper IDP in the 1949 Geneva Convention booklet format; a card, loose translation sheet or 1968 Vienna Convention permit is strictly not accepted.',
    '符合 1949 年日內瓦公約小冊子格式的紙本 IDP 正本；卡片、單獨翻譯紙或 1968 年維也納公約許可一律不可替代。'
  ),
  t(
    `The IDP must be issued by an authority or agent recognized by ${country}, and the permitted vehicle class must cover the rented vehicle.`,
    `IDP 必須由${countryZh}認可的法定機構或代理簽發，且准駕車型必須覆蓋所租車輛。`
  ),
  t(
    'Original passport and the entry evidence required to prove the permitted driving period (entry stamp).',
    '護照正本及可證明允許駕駛期間的入境記錄（1 年內有效入境章）。'
  ),
];

const commonIdpNotes = [
  t(
    'The IDP validity is calculated as up to one year from the date of issue and within one year of arrival; the earlier date strictly controls.',
    'IDP 有效期按簽發日起一年及入境日起一年計算，以較早到期者為準。'
  ),
  t(
    'Online "international driver license" cards, digital versions, or unofficial translations are not accepted under any circumstances.',
    '網售「國際駕照」卡片、電子版或非官方翻譯件一律不予受理。'
  ),
];

export const idpOriginRequirements: IdpOriginRequirement[] = [
  {
    id: 'hong-kong',
    name: t('Hong Kong', '香港', '香港', 'Hong Kong', '홍콩'),
    route: 'idp1949',
    passportCondition: t(
      'If holding a Hong Kong SAR passport / license:',
      '如持香港護照/駕照：',
      '香港パスポート/免許証をお持ちの場合：',
      'Si tiene pasaporte de Hong Kong:',
      '홍콩 여권/면허증을 소지한 경우:'
    ),
    doList: [
      t(
        'Must carry the original 1949 Geneva Convention International Driving Permit (IDP) matching the official sample.',
        '攜帶與樣本相符的紙質國際駕照（IDP - 1949日內瓦公約）及實體駕照原件。'
      ),
      t(
        'Ensure the valid vehicle category stamped covers the rented vehicle class.',
        '確保准駕車型蓋章覆蓋所租車輛級別。'
      ),
    ],
    dontList: [
      t(
        'Electronic versions, digital copies, or non-1949 permits are strictly invalid.',
        '電子版、手機掃描件或非1949日內瓦公約版本一律無法取車。'
      ),
    ],
    summary: t(
      'A Hong Kong-issued 1949 Geneva Convention IDP in the proper booklet format is valid for driving.',
      '香港認可機構簽發且格式合規的 1949 年日內瓦公約 IDP，可用於目的地自駕。'
    ),
    requirements: commonIdpRequirements('Hong Kong', '香港'),
    notes: commonIdpNotes,
    issuers: [
      {
        name: 'Transport Department of Hong Kong',
        url: 'https://www.td.gov.hk/',
      },
      { name: 'Hong Kong Automobile Association' },
    ],
    flagSrc: `${assetBase}/hong-kong-flag.png`,
    images: [
      {
        src: `${assetBase}/hong-kong-idp-01.jpg`,
        alt: t('Hong Kong 1949 Geneva Convention IDP example', '香港 1949 年日內瓦公約 IDP 示例'),
        caption: t(
          'Official valid sample. Verify convention wording, booklet format, issue date, and vehicle class stamps.',
          '法定認可示例；須核對 1949 公約文字、小冊子格式、簽發日期及准駕車型印章。'
        ),
      },
    ],
  },
  {
    id: 'taiwan',
    name: t('Taiwan', '台灣', '台湾', 'Taiwán', '대만'),
    route: 'translation',
    passportCondition: t(
      'If holding a Taiwan passport / license:',
      '如持台灣護照/駕照：',
      '台湾パスポート/免許証をお持ちの場合：',
      'Si tiene pasaporte/licencia de Taiwán:',
      '대만 여권/면허증을 소지한 경우:'
    ),
    doList: [
      t(
        'Must carry the original physical Taiwan driving license + official authorized Japanese translation.',
        '攜帶與樣本相符的實體駕照原件 + 日語官方翻譯件。'
      ),
      t(
        'Obtain official translation from JAF or Taipei Economic and Cultural Representative Office.',
        '在 JAF（日本汽車聯盟）或台北駐日經濟文化代表處取得法定官方翻譯。'
      ),
    ],
    dontList: [
      t(
        'A Taiwan-issued IDP is NOT valid in Japan; translation route is mandatory.',
        '【注意】台灣簽發的 IDP 不適用於日本，不能替代日語官方翻譯件！'
      ),
    ],
    summary: t(
      'A Taiwan-issued IDP is not accepted in Japan. You must present the original Taiwan license plus an authorized Japanese translation.',
      '台灣簽發的 IDP 不適用於在日本駕駛；取車時必須出示台灣駕照正本及認可機構簽發的法定日文譯本。'
    ),
    requirements: [
      t('Original, valid Taiwan driving license.', '有效的實體台灣駕照正本。'),
      t(
        'Official Japanese translation issued by an authorized body: JAF, Taipei Economic and Cultural Representative Office in Japan, or Taiwan-Japan Relations Association.',
        '由法定認可機構簽發的日文譯本：日本自動車聯盟（JAF）、台北駐日經濟文化代表處、台灣日本關係協會。'
      ),
      t(
        'Original passport and entry stamp showing driver is within the permitted one-year period after arrival.',
        '護照正本及入境章，證明在入境後允許駕駛的一年期間內。'
      ),
      t(
        'The translation must be presented together with the valid original license; translation alone is not valid.',
        '日文譯本必須與仍在有效期內的駕照正本一起出示，不能單獨作為駕駛許可。'
      ),
    ],
    notes: [
      t(
        'The Japanese translation has no standalone expiry date, but the original license must remain valid.',
        '日文譯本本身無獨立到期日，但原駕照必須保持有效。'
      ),
      t(
        'Do not present a Taiwan-issued IDP as a substitute for translation.',
        '不得以台灣簽發的 IDP 替代法定日文譯本。'
      ),
    ],
    issuers: [
      {
        name: 'Japan Automobile Federation (JAF)',
        url: 'https://english.jaf.or.jp/',
      },
      { name: 'Taipei Economic and Cultural Representative Offices in Japan' },
    ],
    flagSrc: `${assetBase}/taiwan-flag.png`,
    images: [
      {
        src: `${assetBase}/taiwan-translation-01.jpg`,
        alt: t('Taiwan IDP example not accepted in Japan', '台灣 IDP 不適用於日本的示例'),
        caption: t(
          'Example NOT accepted: A Taiwan-issued IDP does NOT replace the authorized Japanese translation.',
          '不適用之示例：台灣簽發的 IDP 不能替代認可日文譯本。'
        ),
      },
      {
        src: `${assetBase}/taiwan-translation-02.jpg`,
        alt: t(
          'Authorized Japanese translation example for Taiwan license',
          '台灣駕照認可日文譯本示例'
        ),
        caption: t(
          'Valid Japanese translation example: must be presented with the original valid license and passport.',
          '認可日文譯本示例；取車時須與有效台灣駕照正本及護照入境章同時出示。'
        ),
      },
    ],
  },
  {
    id: 'china-mainland',
    name: t('Mainland China', '中國內地', '中国内地', 'China continental', '중국 본토'),
    route: 'unsupported',
    passportCondition: t(
      'If holding a Mainland Chinese driver license:',
      '如持中國內地駕駛執照：',
      '中国本土の運転免許証をお持ちの場合：',
      'Si tiene licencia de China continental:',
      '중국 본토 운전면허증을 소지한 경우:'
    ),
    doList: [
      t(
        'Must hold an additional valid 1949 Geneva Convention IDP issued by an authorized member state (e.g. Hong Kong, US, etc.) if applicable.',
        '若持有其他締約國/地區（如香港、英國、美國等）核發的正規合法駕照及對應 1949 IDP，可作為駕駛資質。'
      ),
    ],
    dontList: [
      t(
        'Mainland China licenses alone, notarized translations, or internet "international license" cards CANNOT be used to pick up a car in Japan.',
        '【重要警示】中國內地駕照原件、公證處翻譯件或網購所謂「國際駕照白本/KIDA卡」一律無法在日取車！'
      ),
    ],
    summary: t(
      'Mainland China is not a party to the 1949 Geneva Convention. Drivers holding only a Mainland Chinese license cannot rent a car or drive legally in Japan.',
      '中國內地尚未加入 1949 年日內瓦道路交通公約。僅持中國內地駕照及公證翻譯件將無法辦理租車手續。'
    ),
    requirements: [
      t(
        'Mainland China has not ratified the 1949 Geneva Convention.',
        '中國內地非 1949 年日內瓦公約締約方。'
      ),
      t(
        'Any translation, notarization, or unauthorized card claiming to permit driving is void at local counters.',
        '任何未經條約締約國官方核發的翻譯件或所謂國際卡，門店均依法嚴格拒絕辦理。'
      ),
    ],
    notes: [
      t(
        'Do not attempt to book with only a Mainland Chinese license to avoid counter refusal and non-refundable cancellation.',
        '請勿在無其他合規 1949 締約國 IDP 的情況下預訂，以避免到店被拒且無法退款。'
      ),
    ],
    issuers: [],
    images: [],
  },
  {
    id: 'united-states',
    name: t('United States', '美國', '米国', 'Estados Unidos', '미국'),
    route: 'idp1949',
    passportCondition: t(
      'If holding a United States passport / license:',
      '如持美國護照/駕照：',
      '米国パスポート/免許証をお持ちの場合：',
      'Si tiene pasaporte de EE.UU.:',
      '미국 여권/면허증을 소지한 경우:'
    ),
    doList: [
      t(
        'Carry the original paper IDP issued by AAA or AATA under the 1949 Convention + US physical license.',
        '攜帶與樣本相符的 AAA 或 AATA 簽發之 1949 年公約 IDP 紙本及美國實體駕照。'
      ),
    ],
    dontList: [
      t(
        'State licenses alone or digital smartphone apps without physical IDP booklet are not accepted.',
        '僅持各州駕照正本或手機電子版駕照無法辦理取車。'
      ),
    ],
    summary: t(
      'A U.S.-issued 1949 Geneva Convention IDP in the proper format is valid for driving. Separate SOFA rules apply to eligible U.S. Forces members.',
      '美國認可機構簽發且格式合規的 1949 年 IDP 可用於自駕；符合條件的駐日美軍人員適用獨立 SOFA 規則。'
    ),
    requirements: commonIdpRequirements('the United States', '美國'),
    notes: commonIdpNotes,
    issuers: [
      {
        name: 'American Automobile Association (AAA)',
        url: 'https://www.aaa.com/',
      },
      { name: 'American Automobile Touring Alliance (AATA)' },
    ],
    flagSrc: `${assetBase}/usa-flag.png`,
    images: [
      {
        src: `${assetBase}/usa-idp-01.jpg`,
        alt: t('AAA United States IDP example', '美國 AAA IDP 示例'),
        caption: t(
          'AAA example valid in Japan; verify issue date and stamped vehicle category.',
          '法定認可的 AAA 示例；須核對簽發日期及已蓋章的准駕車型。'
        ),
      },
      {
        src: `${assetBase}/usa-idp-02.jpg`,
        alt: t('AATA United States IDP example', '美國 AATA IDP 示例'),
        caption: t(
          'AATA example valid in Japan; the physical original booklet is required.',
          '法定認可的 AATA 示例；取車時必須提供實體小冊子正本。'
        ),
      },
    ],
  },
  {
    id: 'korea',
    name: t('South Korea', '韓國', '韓国', 'Corea del Sur', '대한민국'),
    route: 'idp1949',
    passportCondition: t(
      'If holding a South Korean passport / license:',
      '如持韓國護照/駕照：',
      '韓国パスポートをお持ちの場合：',
      'Si tiene pasaporte de Corea del Sur:',
      '대한민국 여권을 소지한 경우:'
    ),
    doList: [
      t(
        'Must carry the original 1949 Geneva Convention IDP issued by KoROAD / Police + physical license.',
        '攜帶與樣本相符的 KoROAD 或警察署簽發的 1949 年公約 IDP 正本及韓國駕照。'
      ),
    ],
    dontList: [
      t(
        'Vienna Convention format or Korean English back-side licenses alone are NOT valid in Japan.',
        '維也納公約格式或僅持韓國英文背面駕照無法直接租車取車。'
      ),
    ],
    summary: t(
      'A Korea-issued 1949 Geneva Convention IDP in the proper format is valid; a Vienna Convention permit is not accepted.',
      '韓國簽發且格式合規的 1949 年 IDP 可用於自駕；維也納公約格式或單純英文背面駕照不被承認。'
    ),
    requirements: commonIdpRequirements('South Korea', '韓國'),
    notes: commonIdpNotes,
    issuers: [
      {
        name: 'KoROAD',
        url: 'http://dl.koroad.or.kr/license/en/sub/interLic.jsp',
      },
    ],
    flagSrc: `${assetBase}/korea-flag.png`,
    images: [
      {
        src: `${assetBase}/korea-idp-01.jpg`,
        alt: t('South Korea IDP example one', '韓國 IDP 示例一'),
        caption: t('KoROAD valid 1949 sample.', '法定認可的 KoROAD 示例一。'),
      },
      {
        src: `${assetBase}/korea-idp-02.jpg`,
        alt: t('South Korea IDP example two', '韓國 IDP 示例二'),
        caption: t('Police station issued 1949 sample.', '警察署簽發之法定認可示例二。'),
      },
    ],
  },
  {
    id: 'germany',
    name: t(
      'Germany / France / Switzerland',
      '德國 / 法國 / 瑞士等',
      'ドイツ / フランス / スイス等',
      'Alemania / Francia / Suiza',
      '독일 / 프랑스 / 스위스 등'
    ),
    route: 'translation',
    passportCondition: t(
      'If holding a German, French, or Swiss license:',
      '如持德國、法國或瑞士駕照：',
      'ドイツ、フランス、スイスの免許をお持ちの場合：',
      'Si tiene licencia de Alemania, Francia o Suiza:',
      '독일, 프랑스, 스위스 면허를 소지한 경우:'
    ),
    doList: [
      t(
        'Original valid license + official authorized Japanese translation issued by JAF / Embassy.',
        '攜帶與樣本相符的實體駕照原件 + JAF/大使館官方日語翻譯件。'
      ),
    ],
    dontList: [
      t(
        'A 1968 Vienna Convention IDP is NOT valid in Japan; authorized translation is required.',
        '歐洲常見的 1968 年維也納公約 IDP 在日本無效，必須使用官方日語翻譯件。'
      ),
    ],
    summary: t(
      '1968 Vienna IDPs are not accepted. You must present the original license plus an authorized Japanese translation.',
      '1968 維也納公約 IDP 不適用於日本；取車時必須出示本國駕照正本及認可機構（如 JAF）簽發的法定日文譯本。'
    ),
    requirements: [
      t('Original, valid driving license.', '有效的實體駕照正本。'),
      t(
        'Official Japanese translation from an authorized authority (e.g. JAF).',
        '由日本現行法規認可之機構簽發的法定日文譯本（如 JAF 譯本）。'
      ),
      t('Original passport and entry stamp.', '護照正本及可證明入境日期的入境記錄。'),
    ],
    notes: commonIdpNotes,
    issuers: [
      {
        name: 'Japan Automobile Federation (JAF)',
        url: 'https://english.jaf.or.jp/',
      },
    ],
    flagSrc: `${assetBase}/germany-flag.png`,
    images: [
      {
        src: `${assetBase}/germany-translation-01.jpg`,
        alt: t('German 1968 IDP not accepted', '德國 1968 年 IDP 不適用示例'),
        caption: t(
          'Example NOT accepted: 1968 Vienna IDP does not replace authorized Japanese translation.',
          '不適用示例：1968 維也納公約 IDP 不能替代法定日文譯本。'
        ),
      },
      {
        src: `${assetBase}/germany-translation-02.jpg`,
        alt: t('Official Japanese translation example', '官方日文譯本示例'),
        caption: t(
          'Official authorized Japanese translation sample.',
          '法定認可的官方日文譯本示例。'
        ),
      },
    ],
  },
];
