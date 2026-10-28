import type { Language } from '@/i18n/locales';
import type { LocationCard, StoreFaqItem } from './types';

export function getStoreFaqList(location: LocationCard, language: Language): StoreFaqItem[] {
  const storeName = location[language]?.name || location.EN.name;
  const isJapan = location.marketCode === 'JP';
  const isAirport = location.storeType === 'airport';

  if (language === 'ZH') {
    return [
      {
        id: 'license',
        question: `在 ${storeName} 辦理取車，需要攜帶哪些證件與駕照？`,
        answer: isJapan
          ? `取車時主駕駛人必須出示：① 護照原件；② 符合 1949 年《日內瓦公約》之國際駕照（IDP）原件，或台灣、瑞士、德國、法國等官方指定之本國駕照原件及日文官方翻譯本；③ 主駕駛人名下有效信用卡。請注意非 1949 公約駕照或非官方機構之翻譯件在日本境內無法合法取車。`
          : `取車時主駕駛人必須出示：① 護照或政府核發身分證明原件；② 效期內本國正式駕駛執照；③ 國際駕駛執照（IDP）或官方英文翻譯認證文件；④ 主駕駛人名下實體信用卡進行押金預授權。`,
      },
      {
        id: 'fees',
        question: `${storeName} 是否有特殊營業時段費用或隱藏手續費？`,
        answer: `TrustGo 堅持費用透明無隱藏。在標準營業時間內取還車不收取任何額外費用。若您的用車時間涵蓋清晨或深夜等特殊服務時段，系統會在結帳前明確列出時間外服務費，所見即所付。`,
      },
      {
        id: 'grace-period',
        question: `門店是否提供還車寬限期（Grace Period）？`,
        answer: `本門店提供標準 29 分鐘的還車寬限期。若您在約定還車時間後 29 分鐘內抵達歸還，將完全免收超時費用；若超出 29 分鐘，系統將依照租車合約標準按小時透明計收超時費用。如預計嚴重延遲，建議提前透過線上專屬客服告知。`,
      },
      {
        id: 'flight-delay',
        question: `如果抵達航班延誤或降落時間晚於預約時間，該如何處理？`,
        answer: isAirport
          ? `若您在預訂時填寫了正確的入境航班號，門店將自動追蹤航班動態，並在飛機落地後為您保留車輛。如遭遇重大延誤（超過營業時間），請在落地後第一時間透過專屬熱線或線上客服聯繫，我們將為您協調延遲交車或優先安排次日取車。`
          : `若您預期晚於預定時間到達門店，請透過線上客服或電話提前告知。門店通常為您保留車輛至多 2 小時。`,
      },
      {
        id: 'insurance',
        question: `租車費率是否包含基礎保險？是否建議加購全額免賠保障？`,
        answer: `所有費率均已包含法定第三方責任保險。為確保旅途無憂，我們推薦加購「全額安心保障（Zero Excess）」，在不幸發生意外碰撞或刮蹭時，享受零自負額並免除車輛停運損失費（NOC）。`,
      },
      {
        id: 'deposit',
        question: `門店取車時如何收取押金？何時解凍還款？`,
        answer: `取車時門店會在主駕駛人信用卡進行預授權凍結押金（不實際扣款）。還車結清且無違章罰單後，門店將即刻發起預授權撤銷，銀行通常在 7 至 14 個工作日內自動解除凍結額度。`,
      },
    ];
  }

  if (language === 'JA') {
    return [
      {
        id: 'license',
        question: `${storeName}での車両引き取りに必要な書類・免許証は何ですか？`,
        answer: isJapan
          ? `主運転者様の①パスポート原本、②1949年ジュネーブ条約加盟国発行の国際運転免許証（IDP）原本（または台湾・スイス・ドイツ等の運転免許証原本＋公式日本語翻訳文）、③ご本人名義のクレジットカードのご提示が必要です。`
          : `主運転者様の①有効なパスポート、②自国運転免許証、③国際運転免許証（IDP）または公的英語翻訳文、④ご本人名義のクレジットカードをご提示ください。`,
      },
      {
        id: 'fees',
        question: `時間外手数料や隠れた費用は発生しますか？`,
        answer: `TrustGoは明朗会計を徹底しています。通常営業時間内の貸出・返却に追加料金は一切ございません。早朝や深夜など特別対応枠をご利用の場合も、決済前に画面上に透明に明記されます。`,
      },
      {
        id: 'grace-period',
        question: `返却の猶予時間（Grace Period）はありますか？`,
        answer: `29分間の無料返却猶予期間を設けております。返却予定時刻から29分以内のご返却であれば追加料金は発生いたしません。`,
      },
      {
        id: 'flight-delay',
        question: `フライトが遅延した場合、予約はどうなりますか？`,
        answer: isAirport
          ? `ご予約時に便名をご登録いただいている場合、現地の空港到着状況を自動追跡し、車両を確保いたします。大幅な遅延時は速やかにコンシェルジュデスクまでご連絡ください。`
          : `予定より遅れる場合は、事前にチャットまたはお電話にてお知らせください。原則2時間までお車をお取り置きいたします。`,
      },
      {
        id: 'insurance',
        question: `基本保険は含まれていますか？免責補償への加入は必要ですか？`,
        answer: `すべてのプランに法定対人・対物賠償保険が含まれています。万が一の事故や小傷の際にも自己負担をゼロにするため、フル免責補償（Zero Excess）のご加入を推奨しております。`,
      },
      {
        id: 'deposit',
        question: `デポジット（保証金）の取扱いはどうなっていますか？`,
        answer: `店頭にて運転者様名義のクレジットカードで一時的な事前承認枠を確保します。無事故でご返却後、速やかに枠の解除処理を行います。`,
      },
    ];
  }

  if (language === 'ES') {
    return [
      {
        id: 'license',
        question: `¿Qué documentos necesito para recoger el vehículo en ${storeName}?`,
        answer: `El conductor principal debe presentar: ① Pasaporte o documento de identidad en vigor; ② Permiso de conducir original válido; ③ Permiso internacional de conducir (IDP) si procede; ④ Tarjeta de crédito física a nombre del conductor.`,
      },
      {
        id: 'fees',
        question: `¿Hay cargos ocultos o suplementos por horario en ${storeName}?`,
        answer: `En TrustGo todos los precios son transparentes. No hay costes ocultos. Si la recogida se realiza fuera de horario habitual, cualquier suplemento se muestra claramente antes del pago.`,
      },
      {
        id: 'grace-period',
        question: `¿Existe un período de cortesía o gracia al devolver el vehículo?`,
        answer: `Ofrecemos un período de gracia de 29 minutos. Si devuelve el vehículo dentro de los 29 minutos posteriores a la hora acordada, no se aplicarán recargos por demora.`,
      },
      {
        id: 'flight-delay',
        question: `¿Qué ocurre si mi vuelo sufre un retraso?`,
        answer: isAirport
          ? `Si incluyó su número de vuelo en la reserva, monitorizamos su llegada y mantenemos su coche reservado sin coste adicional.`
          : `Si prevé llegar con retraso, avísenos con antelación vía chat o teléfono para retener su vehículo.`,
      },
      {
        id: 'insurance',
        question: `¿Está incluido el seguro básico? ¿Se recomienda cobertura total?`,
        answer: `Todas las tarifas incluyen seguro básico a terceros. Para viajar con total tranquilidad, recomendamos la cobertura Total Relax (Zero Excess) sin franquicia por daños ni robos.`,
      },
      {
        id: 'deposit',
        question: `¿Cómo funciona el depósito de fianza y cuándo se desbloquea?`,
        answer: `Se retiene una fianza en la tarjeta de crédito del titular al recoger el coche. Tras la devolución conforme, se desbloquea de inmediato y el banco lo refleja en 7-14 días hábiles.`,
      },
    ];
  }

  if (language === 'KO') {
    return [
      {
        id: 'license',
        question: `${storeName}에서 차량을 인수할 때 필요한 서류는 무엇인가요?`,
        answer: isJapan
          ? `주 운전자 본인의 ① 유효한 여권 원본, ② 1949 제네바 협약 가입국 발행 국제운전면허증(IDP) 원본(또는 인정 국가 공인 번역본), ③ 본인 명의 신용카드가 필수입니다.`
          : `주 운전자 명의의 ① 유효한 여권 원본, ② 국내 운전면허증 원본, ③ 국제운전면허증(IDP) 또는 영문 공증 번역본, ④ 본인 명의 해외 결제 가능 신용카드를 지참하셔야 합니다.`,
      },
      {
        id: 'fees',
        question: `야간 할증이나 숨겨진 추가 수수료가 있나요?`,
        answer: `TrustGo는 투명한 요금제를 약속합니다. 정규 영업시간 내 인수 및 반납에는 숨은 비용이 전혀 없습니다. 심야/새벽 등 특수 시간대 서비스는 결제 전 명확하게 사전 안내됩니다.`,
      },
      {
        id: 'grace-period',
        question: `차량 반납 시 무료 유예 시간(Grace Period)이 제공되나요?`,
        answer: `표준 29분의 무료 반납 유예 기간을 제공합니다. 약정 반납 시간 기준 29분 이내에 반납하시면 추가 요금이 부과되지 않습니다.`,
      },
      {
        id: 'flight-delay',
        question: `항공편이 지연된 경우 예약은 어떻게 유지되나요?`,
        answer: isAirport
          ? `예약 시 항공편명을 기재해 주시면 현지 지점에서 항공편 도착 상태를 실시간 모니터링하여 착륙 후에도 차량을 안전하게 보관합니다.`
          : `지연이 예상될 경우 고객센터나 온라인 채팅을 통해 사전에 알려주시면 최대 2시간 동안 차량이 보관됩니다.`,
      },
      {
        id: 'insurance',
        question: `기본 보험이 포함되어 있나요? 완전면책 보험 가입을 추천하나요?`,
        answer: `모든 요금에는 법정 대인/대물/자손 기본 보험이 포함되어 있습니다. 안전하고 부담 없는 여행을 위해 자기부담금이 전혀 없는 풀커버 안심 플랜(Zero Excess) 가입을 강력 추천합니다.`,
      },
      {
        id: 'deposit',
        question: `보증금(Deposit) 승인 및 환불 규정은 어떻게 되나요?`,
        answer: `차량 인수 시 주 운전자 신용카드로 보증금을 가승인(홀딩)합니다. 정상 반납 확인 후 즉시 가승인 취소되며 카드사에 따라 영업일 기준 7~14일 이내 자동 취소 처리됩니다.`,
      },
    ];
  }

  // Fallback EN
  return [
    {
      id: 'license',
      question: `What driver license and documents do I need to pick up my car at ${storeName}?`,
      answer: isJapan
        ? `The primary driver must present: ① Original passport; ② International Driving Permit (IDP) issued under the 1949 Geneva Convention (or home license + certified Japanese translation for Taiwan/Switzerland/Germany/France); ③ Physical credit card in primary driver name.`
        : `The primary driver must present: ① Valid passport or government-issued photo ID; ② Valid home country driver license; ③ International Driving Permit (IDP) or official certified English translation; ④ Physical credit card in primary driver name for the security deposit.`,
    },
    {
      id: 'fees',
      question: `Are there any hidden fees or out-of-hours service surcharges at ${storeName}?`,
      answer: `TrustGo guarantees transparent, upfront pricing with zero hidden fees. Pick-up and drop-off during normal operating hours incur no additional charge. Any early morning or late night service surcharge is transparently itemized before checkout.`,
    },
    {
      id: 'grace-period',
      question: `Is there a grace period for returning the vehicle?`,
      answer: `We provide a standard 29-minute return grace period. If you return the vehicle within 29 minutes after your scheduled drop-off time, no overtime charges apply.`,
    },
    {
      id: 'flight-delay',
      question: `What happens if my arrival flight is delayed?`,
      answer: isAirport
        ? `If you provide your arrival flight number during booking, our local station team tracks flight arrivals in real time. Your car will be held without forfeiture even if flight schedules shift.`
        : `If you anticipate running late, please contact our support team in advance. Stations will hold your reservation for up to 2 hours.`,
    },
    {
      id: 'insurance',
      question: `Is basic insurance included? Do you recommend Zero Excess coverage?`,
      answer: `All rental rates include mandatory Third-Party Liability insurance. For complete peace of mind, we strongly recommend our Zero Excess Protection plan, which waives your financial liability for collision damage, scratches, and non-operation charges (NOC).`,
    },
    {
      id: 'deposit',
      question: `How does the security deposit work, and when is it released?`,
      answer: `A security deposit is pre-authorized (held, not charged) on the main driver credit card upon collection. Following safe vehicle return and inspection, the hold is released immediately, typically reflecting in 7–14 business days depending on your issuing bank.`,
    },
  ];
}
