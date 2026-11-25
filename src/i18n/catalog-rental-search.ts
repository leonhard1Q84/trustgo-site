import type { Language } from './locales';

export const rentalSearchTranslations: Record<string, Record<Language, string>> = {
  rs_filters: { EN: 'Filters', ZH: '篩選', JA: '絞り込み', ES: 'Filtros', KO: '필터' },
  rs_filter_clear_all: { EN: 'Clear all', ZH: '清除全部', JA: 'すべてクリア', ES: 'Borrar todo', KO: '모두 지우기' },
  rs_filter_show_results: {
    EN: 'Show {count} cars', ZH: '顯示 {count} 款車型', JA: '{count}車種を表示',
    ES: 'Mostrar {count} coches', KO: '차량 {count}종 보기',
  },
  rs_filter_no_results: {
    EN: 'No matching cars', ZH: '沒有符合的車型', JA: '該当する車種がありません',
    ES: 'Sin coches que coincidan', KO: '일치하는 차량 없음',
  },
  rs_filter_group_category: { EN: 'Car type', ZH: '車型組', JA: '車種', ES: 'Tipo de vehículo', KO: '차종' },
  rs_filter_group_transmission: { EN: 'Transmission', ZH: '變速箱', JA: 'トランスミッション', ES: 'Transmisión', KO: '변속기' },
  rs_filter_group_seats: { EN: 'Seats', ZH: '座位數', JA: '座席数', ES: 'Plazas', KO: '좌석 수' },
  rs_filter_group_policies: {
    EN: 'Rental policies', ZH: '租車政策', JA: 'レンタル条件', ES: 'Condiciones de alquiler', KO: '렌탈 정책',
  },
  rs_filter_group_depot: {
    EN: 'Pick-up & return', ZH: '取還車服務', JA: '受取・返却', ES: 'Recogida y devolución', KO: '인수·반납',
  },
  rs_filter_group_extras: {
    EN: 'Included extras', ZH: '附加服務', JA: '含まれるサービス', ES: 'Extras incluidos', KO: '포함 서비스',
  },
  rs_type_all: { EN: 'All types', ZH: '全部車型', JA: 'すべての車種', ES: 'Todos los tipos', KO: '전체 차종' },
  rs_type_economy: { EN: 'Economy', ZH: '經濟型', JA: 'エコノミー', ES: 'Económico', KO: '이코노미' },
  rs_type_mpv: { EN: 'MPV & Vans', ZH: 'MPV / 多人座', JA: 'ミニバン', ES: 'Monovolumen', KO: '미니밴' },
  rs_type_premium: { EN: 'Premium', ZH: '豪華型', JA: 'プレミアム', ES: 'Premium', KO: '프리미엄' },
  rs_filter_automatic: { EN: 'Automatic', ZH: '自動擋', JA: 'オートマ', ES: 'Automático', KO: '자동' },
  rs_filter_manual: { EN: 'Manual', ZH: '手動擋', JA: 'マニュアル', ES: 'Manual', KO: '수동' },
  rs_filter_seats_5: { EN: 'Up to 5 seats', ZH: '5 座及以下', JA: '5人乗り以下', ES: 'Hasta 5 plazas', KO: '5인승 이하' },
  rs_filter_seats_6_7: { EN: '6–7 seats', ZH: '6–7 座', JA: '6〜7人乗り', ES: '6–7 plazas', KO: '6~7인승' },
  rs_filter_seats_8: { EN: '8+ seats', ZH: '8 座及以上', JA: '8人乗り以上', ES: '8 plazas o más', KO: '8인승 이상' },
  rs_filter_free_cancellation: {
    EN: 'Free cancellation', ZH: '免費取消', JA: '無料キャンセル', ES: 'Cancelación gratuita', KO: '무료 취소',
  },
  rs_filter_deposit_free: { EN: 'No deposit', ZH: '免押金', JA: '保証金なし', ES: 'Sin depósito', KO: '보증금 없음' },
  rs_filter_unlimited_mileage: {
    EN: 'Unlimited mileage', ZH: '不限里程', JA: '走行距離無制限', ES: 'Kilometraje ilimitado', KO: '주행거리 무제한',
  },
  rs_filter_full_to_full: {
    EN: 'Full to full', ZH: '滿油取還', JA: '満タン返し', ES: 'Lleno a lleno', KO: '풀투풀',
  },
  rs_filter_self_service: {
    EN: 'Self-service pick-up & return', ZH: '自助取還', JA: 'セルフ受取・返却',
    ES: 'Recogida y devolución autoservicio', KO: '셀프 인수·반납',
  },
  rs_filter_open_24h: { EN: 'Open 24 hours', ZH: '24 小時營業', JA: '24時間営業', ES: 'Abierto 24 horas', KO: '24시간 영업' },
  rs_filter_free_additional_driver: {
    EN: 'Free additional driver', ZH: '免費額外駕駛人', JA: '追加運転者無料',
    ES: 'Conductor adicional gratis', KO: '추가 운전자 무료',
  },
  rs_filter_free_gps: { EN: 'Free GPS', ZH: '免費 GPS', JA: 'GPS無料', ES: 'GPS gratis', KO: '무료 GPS' },
  rs_filter_winter_tyres: {
    EN: 'Winter tyres included', ZH: '含雪地胎', JA: 'スタッドレスタイヤ付き',
    ES: 'Neumáticos de invierno incluidos', KO: '겨울용 타이어 포함',
  },
};
