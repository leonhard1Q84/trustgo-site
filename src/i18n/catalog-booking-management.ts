import type { Language } from './locales';

export const bookingManagementTranslations: Record<string, Record<Language, string>> = {
  bm_checkin_title: {
    EN: 'Online identity verification', ZH: '線上身份核驗', JA: 'オンライン本人確認',
    ES: 'Verificación de identidad en línea', KO: '온라인 신원 확인',
  },
  bm_checkin_description: {
    EN: 'Upload your driver’s license and passport before pick-up for identity verification.',
    ZH: '取車前上傳駕駛執照及護照，完成線上身份核驗。',
    JA: '受け取り前に運転免許証とパスポートをアップロードして、本人確認を行います。',
    ES: 'Sube tu permiso de conducir y pasaporte antes de la recogida para verificar tu identidad.',
    KO: '차량 인수 전에 운전면허증과 여권을 업로드하여 신원을 확인하세요.',
  },
  bm_checkin_upload: {
    EN: 'Upload clear photos of your driver’s license and passport',
    ZH: '上傳清晰的駕駛執照及護照照片',
    JA: '運転免許証とパスポートの鮮明な写真をアップロード',
    ES: 'Sube fotos claras de tu permiso de conducir y pasaporte',
    KO: '운전면허증과 여권의 선명한 사진을 업로드하세요',
  },
  bm_checkin_formats: {
    EN: 'JPG, PNG or PDF, up to 10 MB', ZH: '支援 JPG、PNG、PDF，最大 10 MB',
    JA: 'JPG・PNG・PDF、最大10 MB', ES: 'JPG, PNG o PDF, hasta 10 MB', KO: 'JPG, PNG, PDF, 최대 10 MB',
  },
  bm_checkin_submit: {
    EN: 'Submit for identity verification', ZH: '提交身份核驗', JA: '本人確認を申請',
    ES: 'Enviar para verificar la identidad', KO: '신원 확인 제출',
  },
  guest_feature_trip: {
    EN: 'Trip details', ZH: '行程詳情', JA: 'ご旅程', ES: 'Tu viaje', KO: '여정 정보',
  },
  guest_feature_cost: {
    EN: 'Price breakdown', ZH: '費用明細', JA: '料金明細', ES: 'Desglose del precio', KO: '요금 내역',
  },
  guest_feature_rules: {
    EN: 'Cancellation rules', ZH: '取消規則', JA: 'キャンセル規定', ES: 'Cancelaciones', KO: '취소 규정',
  },
  guest_form_title: {
    EN: 'Find your booking', ZH: '查詢您的預訂', JA: '予約を確認する', ES: 'Busca tu reserva', KO: '예약 조회',
  },
  guest_form_note: {
    EN: "Enter your confirmation code and the main driver's last name to access your booking.",
    ZH: '輸入預訂確認號與主駕駛人姓氏，驗證後即可查看預訂。',
    JA: '予約確認番号と主運転者の姓を入力して、予約を確認できます。',
    ES: 'Introduce el código de confirmación y el apellido del conductor principal para acceder a tu reserva.',
    KO: '예약 확인번호와 주 운전자의 성을 입력하여 예약을 확인하세요.',
  },
  guest_list_title: {
    EN: 'Your bookings', ZH: '您的預訂', JA: '予約一覧', ES: 'Tus reservas', KO: '예약 목록',
  },
  guest_list_note: {
    EN: 'Your verified bookings appear here. Look up another booking to add it to the list.',
    ZH: '已驗證的預訂會顯示於此。您可查詢並加入其他預訂。',
    JA: '確認済みの予約です。別の予約を確認すると、この一覧に追加されます。',
    ES: 'Aquí aparecen tus reservas verificadas. Busca otra reserva para añadirla a la lista.',
    KO: '확인된 예약이 여기에 표시됩니다. 다른 예약을 조회하면 이 목록에 추가됩니다.',
  },
  guest_back_list: {
    EN: 'Back to your bookings', ZH: '返回預訂列表', JA: '予約一覧に戻る', ES: 'Volver a tus reservas', KO: '예약 목록으로 돌아가기',
  },
  guest_find: {
    EN: 'Find booking', ZH: '查詢預訂', JA: '予約を確認', ES: 'Buscar reserva', KO: '예약 조회',
  },
  guest_name_hint: {
    EN: 'Use the last name entered when booking.', ZH: '請填寫預訂時使用的主駕駛人姓氏。',
    JA: '予約時に入力した主運転者の姓をご入力ください。', ES: 'Usa el apellido indicado al reservar.', KO: '예약 시 입력한 주 운전자의 성을 사용하세요.',
  },
  guest_not_found: {
    EN: 'We couldn’t find a matching booking. Check your confirmation code and last name, then try again.',
    ZH: '未找到匹配的預訂，請確認預訂確認號與姓氏後重試。',
    JA: '一致する予約が見つかりません。予約確認番号と姓をご確認のうえ、もう一度お試しください。',
    ES: 'No encontramos una reserva coincidente. Revisa el código de confirmación y el apellido e inténtalo de nuevo.',
    KO: '일치하는 예약을 찾지 못했어요. 예약 확인번호와 성을 확인하고 다시 시도해 주세요.',
  },
  guest_contact: {
    EN: 'Contact support', ZH: '聯絡客服', JA: 'サポートに問い合わせる', ES: 'Contactar con atención al cliente', KO: '고객 지원 문의',
  },
  guest_code_help: {
    EN: 'Where can I find my confirmation code?', ZH: '在哪裡找到預訂確認號？',
    JA: '予約確認番号はどこにありますか？', ES: '¿Dónde encuentro mi código de confirmación?', KO: '예약 확인번호는 어디서 찾나요?',
  },
  guest_code_hint: {
    EN: 'Your confirmation code is on the booking confirmation page and in your confirmation email. Search your inbox for “TrustGo”.',
    ZH: '預訂確認號顯示於預訂確認頁及確認郵件中。您可在收件匣搜尋「TrustGo」。',
    JA: '予約確認番号は予約完了画面と確認メールに記載されています。受信箱で「TrustGo」を検索してください。',
    ES: 'El código aparece en la página de confirmación y en el correo de confirmación. Busca «TrustGo» en tu bandeja de entrada.',
    KO: '예약 확인 페이지와 확인 이메일에서 확인번호를 찾을 수 있어요. 받은 편지함에서 “TrustGo”를 검색하세요.',
  },
};
