import { IGridColumn } from '~/components/UI';
import { ENUM_WIDTH, ENUM_DECIMAL } from '~/enums';

type ColumnRecordKeys =
  | 'WORK_TYPE'
  | 'WORK_CALENDAR'
  | 'WORK_TIME_TYPE'
  | 'WORK_TIME'
  | 'WORK_PERFORMANCE'
  | 'PROD_ORDER'
  | 'WORK_ROUTING_HISTORY'
  | 'WORK_PLAN'
  | 'DAILY_WORK_PLAN'
  | 'INSP_CLONE'
  | 'INCOME_STORE_ECOUNT_INTERFACE'
  | 'OUT_STORE_ECOUNT_INTERFACE'
  | 'REWORK_REPORT_HEADER'
  | 'REWORK_REPORT_DETAIL'
  | 'EXCEL_INVALID_ERROR'
  | 'NAJS_PROD_ORDER';

export const ColumnStore: Record<ColumnRecordKeys, IGridColumn[]> = {
  WORK_TYPE: [
    {
      header: '',
      name: 'work_type_uuid',
      hidden: true,
    },
    {
      header: '근무유형코드',
      name: 'work_type_cd',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무유형명',
      name: 'work_type_nm',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '사용유무',
      name: 'use_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
  ],
  WORK_TIME_TYPE: [
    {
      header: '',
      name: 'worktime_type_uuid',
      hidden: true,
    },
    {
      header: '근무시간유형코드',
      name: 'worktime_type_cd',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무시간유형명',
      name: 'worktime_type_nm',
      format: 'text',
      editable: true,
      requiredField: true,
    },
  ],
  WORK_TIME: [
    {
      header: '근무UUID',
      name: 'worktime_uuid',
      hidden: true,
    },
    {
      header: '근무코드',
      name: 'worktime_cd',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무명',
      name: 'worktime_nm',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무시간UUID',
      name: 'worktime_type_uuid',
      requiredField: true,
      hidden: true,
    },
    {
      header: '근무시간코드',
      name: 'worktime_type_cd',
      requiredField: true,
      hidden: true,
    },
    {
      header: '근무시간',
      name: 'worktime_type_nm',
      format: 'combo',
      editable: true,
      requiredField: true,
    },
    {
      header: '사용유무',
      name: 'use_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
    {
      header: '휴게유무',
      name: 'break_time_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
    {
      header: '시작시간',
      name: 'start_time',
      format: 'time',
      editable: true,
      requiredField: true,
    },
    {
      header: '종료시간',
      name: 'end_time',
      format: 'time',
      editable: true,
      requiredField: true,
    },
  ],
  WORK_CALENDAR: [
    {
      header: '일자',
      name: 'day_no',
      width: ENUM_WIDTH.S,
    },
    {
      header: '',
      name: 'work_type_uuid',
      editable: false,
      hidden: true,
    },
    {
      header: '근무유형',
      name: 'work_type_nm',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'combo',
    },
    {
      header: 'hour',
      name: 'day_value',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NOMAL,
    },
  ],
  WORK_PERFORMANCE: [
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '실적 일시',
      name: 'reg_date',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '지시번호',
      name: 'order_no',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산실적 순번',
      name: 'seq',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '품명',
      name: 'prod_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '모델',
      name: 'model_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: 'Rev',
      name: 'rev',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '규격',
      name: 'prod_std',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '단위',
      name: 'unit_nm',
      width: ENUM_WIDTH.S,
      hidden: false,
      format: 'text',
    },
    {
      header: 'LOT NO',
      name: 'lot_no',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 수량',
      name: 'order_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '생산 수량',
      name: 'total_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '양품 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '생산시작 일시',
      name: 'start_date',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '생산종료 일시',
      name: 'end_date',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '작업시간',
      name: 'work_time',
      width: ENUM_WIDTH.S,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대UUID',
      name: 'shift_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대명',
      name: 'shift_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자수',
      name: 'worker_cnt',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자명',
      name: 'worker_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '생산 완료여부(완료, 미완료)',
      name: 'complete_state',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산 종료여부',
      name: 'complete_fg',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 비고',
      name: 'order_remark',
      width: ENUM_WIDTH.L,
      hidden: false,
      format: 'text',
    },
    {
      header: '생산 비고',
      name: 'remark',
      width: ENUM_WIDTH.L,
      hidden: false,
      format: 'text',
    },
  ],
  PROD_ORDER: [
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '구분',
      name: 'order_state',
      width: 80,
      hidden: false,
      format: 'text',
      align: 'center',
    },
    {
      header: '지시일자',
      name: 'order_date',
      hidden: true,
      format: 'date',
    },
    {
      header: '작업일자',
      name: 'reg_date',
      width: 150,
      hidden: false,
      format: 'date',
      editable: true,
      disabled: true,
    },
    {
      header: '작업시작',
      name: '_work_start',
      width: 80,
      hidden: false,
      format: 'check',
      editable: true,
    },
    {
      header: '마감',
      name: 'complete_fg',
      width: 80,
      hidden: false,
      format: 'check',
      editable: true,
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '설비UUID',
      name: 'equip_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '설비',
      name: 'equip_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목 유형UUID',
      name: 'item_type_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '품목 유형',
      name: 'item_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '제품 유형UUID',
      name: 'prod_type_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '제품 유형',
      name: 'prod_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목',
      name: 'prod_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '모델',
      name: 'model_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: 'Rev',
      name: 'rev',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '규격',
      name: 'prod_std',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '단위',
      name: 'unit_nm',
      width: 80,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '계획 수량',
      name: 'plan_qty',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '지시 수량',
      name: 'qty',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 순번',
      name: 'seq',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대UUID',
      name: 'shift_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대명',
      name: 'shift_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '시작예정',
      name: 'start_date',
      width: 120,
      hidden: false,
      format: 'date',
    },
    {
      header: '종료예정',
      name: 'end_date',
      width: 120,
      hidden: false,
      format: 'date',
    },
    {
      header: '작업조UUID',
      name: 'worker_group_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업조',
      name: 'worker_group_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업인원',
      name: 'worker_cnt',
      width: 100,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NOMAL,
    },
    {
      header: '수주UUID',
      name: 'sal_order_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '수주상세UUID',
      name: 'sal_order_detail_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산 진행여부',
      name: 'work_fg',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '마감 일시',
      name: 'complete_date',
      width: 120,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '비고',
      name: 'remark',
      width: 150,
      hidden: false,
      format: 'text',
    },
  ],
  WORK_ROUTING_HISTORY: [
    {
      header: '공정순서',
      name: 'proc_no',
    },
    {
      header: '공정',
      name: 'proc_nm',
    },
    {
      header: '시작일시',
      name: 'start_date',
    },
    {
      header: '종료일시',
      name: 'end_date',
    },
    {
      header: '작업장',
      name: 'workings_nm',
    },
    {
      header: '설비',
      name: 'equip_nm',
    },
    {
      header: '금형',
      name: 'mold_nm',
    },
    {
      header: '금형Cavity',
      name: 'mold_cavity',
    },
    {
      header: '양품수량',
      name: 'qty',
    },
    {
      header: '비고',
      name: 'remark',
    },
  ],
  WORK_PLAN: [
    {
      header: '계획월',
      name: 'plan_month',
      width: ENUM_WIDTH.M,
      format: 'dateym',
      align: 'center',
      editable: true,
      requiredField: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '품명',
      name: 'prod_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '모델',
      name: 'model_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: 'Rev',
      name: 'rev',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '규격',
      name: 'prod_std',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      editable: true,
      requiredField: true,
    },
    {
      header: '계획수량',
      name: 'plan_monthly_qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      editable: true,
      requiredField: true,
    },
    {
      header: '잔량',
      name: 'balance',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      editable: false,
    },
  ],
  DAILY_WORK_PLAN: [
    {
      header: '계획일',
      name: 'plan_day',
      width: ENUM_WIDTH.M,
      format: 'date',
      align: 'center',
      editable: true,
      requiredField: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '품명',
      name: 'prod_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '모델',
      name: 'model_nm',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: 'Rev',
      name: 'rev',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '규격',
      name: 'prod_std',
      width: ENUM_WIDTH.M,
      editable: false,
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      editable: true,
      requiredField: true,
    },
    {
      header: '계획수량',
      name: 'plan_daily_qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      editable: true,
      requiredField: true,
    },
    {
      header: '잔량',
      name: 'balance',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      editable: false,
    },
    {
      header: '월생산계획UUID',
      name: 'plan_monthly_uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
      editable: false,
    },
  ],
  INSP_CLONE: [
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.L,
    },
    {
      header: '품목명',
      name: 'prod_nm',
      width: ENUM_WIDTH.L,
    },
    {
      header: '기준서유형UUID',
      name: 'insp_type_uuid',
      hidden: true,
    },
    {
      header: '기준서유형코드',
      name: 'insp_type_cd',
      hidden: true,
    },
    {
      header: '기준서유형',
      name: 'insp_type_nm',
      width: ENUM_WIDTH.M,
      align: 'center',
    },
    {
      header: '기준서번호',
      name: 'insp_no',
      width: ENUM_WIDTH.M,
      align: 'center',
    },
  ],
  INCOME_STORE_ECOUNT_INTERFACE: [
    { header: '일자', name: 'reg_date', width: ENUM_WIDTH.M },
    { header: '순번', name: 'seq', width: ENUM_WIDTH.M },
    { header: '거래처코드', name: 'partner_cd', width: ENUM_WIDTH.M },
    { header: '거래처명', name: 'partner_nm', width: ENUM_WIDTH.L },
    { header: '담당자', name: 'manager', width: ENUM_WIDTH.M },
    { header: '입고창고', name: 'to_store_cd', width: ENUM_WIDTH.M },
    { header: '거래유형', name: '거래유형', width: ENUM_WIDTH.M },
    { header: '통화', name: '통화', width: ENUM_WIDTH.M },
    { header: '환율', name: 'exchange', width: ENUM_WIDTH.M },
    { header: '프로젝트', name: '프로젝트', width: ENUM_WIDTH.M },
    { header: '품목코드', name: 'prod_no', width: ENUM_WIDTH.M },
    { header: '품목명', name: 'prod_nm', width: ENUM_WIDTH.XXL },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M },
    { header: '수량', name: 'qty', width: ENUM_WIDTH.M },
    { header: '단가', name: 'price', width: ENUM_WIDTH.M },
    { header: '외화금액', name: '외화금액', width: ENUM_WIDTH.M },
    { header: '공급가액', name: 'supply_price', width: ENUM_WIDTH.M },
    { header: '부가세', name: 'tax', width: ENUM_WIDTH.M },
    { header: '적요', name: '적요', width: ENUM_WIDTH.M },
    {
      header: '불러온 전표일자',
      name: '불러온 전표일자',
      width: ENUM_WIDTH.M,
    },
    { header: '불러온 전표No.', name: '불러온 전표No.', width: ENUM_WIDTH.M },
    { header: '판매처(직납)', name: '판매처(직납)', width: ENUM_WIDTH.M },
    { header: '파이프단가', name: '파이프단가', width: ENUM_WIDTH.M },
    { header: 'Lot No', name: 'lot_no', width: ENUM_WIDTH.M },
    { header: '제조업체', name: '제조업체', width: ENUM_WIDTH.M },
    { header: '재질', name: 'material', width: ENUM_WIDTH.M },
    { header: '외경', name: '외경', width: ENUM_WIDTH.M },
    { header: '두께', name: 'thickness', width: ENUM_WIDTH.M },
    { header: '길이', name: 'length', width: ENUM_WIDTH.M },
    { header: '단가(vat포함)', name: '단가(vat포함)', width: ENUM_WIDTH.M },
  ],
  OUT_STORE_ECOUNT_INTERFACE: [
    { header: '일자', name: 'reg_date', width: ENUM_WIDTH.M },
    { header: '순번', name: '순번', width: ENUM_WIDTH.S },
    { header: '담당자', name: '담당자', width: ENUM_WIDTH.M },
    { header: '보내는창고', name: 'from_store_cd', width: ENUM_WIDTH.S },
    { header: '받는공장', name: '받는공장', width: ENUM_WIDTH.S },
    { header: '프로젝트', name: '프로젝트', width: ENUM_WIDTH.S },
    {
      header: '작지(일자-번호품목)',
      name: '작지(일자-번호품목)',
      width: ENUM_WIDTH.L,
    },
    { header: 'No.', name: 'No.', width: ENUM_WIDTH.S },
    {
      header: '작업지시품목코드',
      name: '작업지시품목코드',
      width: ENUM_WIDTH.L,
    },
    { header: '품목코드', name: 'prod_no', width: ENUM_WIDTH.M },
    { header: '품목명', name: 'prod_nm', width: ENUM_WIDTH.XXL },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M },
    { header: '수량', name: 'qty', width: ENUM_WIDTH.M },
    { header: '적요', name: '적요', width: ENUM_WIDTH.S },
    { header: '시리얼/로트', name: 'lot_no', width: ENUM_WIDTH.XL },
    { header: 'BOX', name: 'BOX', width: ENUM_WIDTH.S },
    { header: '거래처코드', name: 'partner_cd', width: ENUM_WIDTH.M },
  ],
  REWORK_REPORT_HEADER: [
    {
      header: '부적합품판정UUID',
      name: 'rework_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '판정일',
      name: 'reg_date',
      width: ENUM_WIDTH.M,
      format: 'date',
      filter: 'text',
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.M, filter: 'text' },
    { header: '품명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
    {
      header: '부적합UUID',
      name: 'reject_uuid',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합',
      name: 'reject_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
    },
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '부적합판정 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      filter: 'number',
    },
    {
      header: '부적합판정 코드',
      name: 'rework_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '부적합판정',
      name: 'rework_type_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
    },
    {
      header: '출고창고UUID',
      name: 'from_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고창고',
      name: 'from_store_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '출고위치UUID',
      name: 'from_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고위치',
      name: 'from_location_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '입고창고UUID',
      name: 'to_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '입고창고',
      name: 'to_store_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
    },
    {
      header: '입고위치UUID',
      name: 'to_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '입고위치',
      name: 'to_location_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
    },
    { header: '비교', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
  ],
  REWORK_REPORT_DETAIL: [
    {
      header: '부적합품판정 분해UUID',
      name: 'rework_disassemble_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '부적합품판정UUID',
      name: 'rework_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.M, filter: 'text' },
    { header: '품명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
    {
      header: '부적합UUID',
      name: 'reject_uuid',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합',
      name: 'reject_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
    },
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '입고 수량',
      name: 'income_qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      filter: 'number',
    },
    {
      header: '반출 수량',
      name: 'return_qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      filter: 'number',
    },
    {
      header: '폐기 수량',
      name: 'disposal_qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      filter: 'number',
    },
    {
      header: '분해시입고창고UUID',
      name: 'income_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '입고 창고', name: 'income_store_nm', width: ENUM_WIDTH.M },
    {
      header: '분해시입고위치UUID',
      name: 'income_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '입고 위치', name: 'income_location_nm', width: ENUM_WIDTH.M },
    {
      header: '반출 창고UUID',
      name: 'return_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '반출 창고', name: 'return_store_nm', width: ENUM_WIDTH.M },
    {
      header: '반출 위치UUID',
      name: 'return_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '반출 위치', name: 'return_location_nm', width: ENUM_WIDTH.M },
    { header: '비교', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
  ],
  EXCEL_INVALID_ERROR: [
    { header: '오류 내역', name: 'error', width: ENUM_WIDTH.XXL },
  ],
  NAJS_PROD_ORDER: [
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '상태',
      name: 'order_state',
      width: ENUM_WIDTH.S,
      align: 'center',
      editable: false,
      format: 'text',
      filter: 'text',
    },
    {
      header: '우선순위',
      name: 'priority',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NOMAL,
      filter: 'number',
    },
    {
      header: '지시일',
      name: 'reg_date',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'date',
      filter: 'date',
      requiredField: true,
    },
    {
      header: '지시번호',
      name: 'order_no',
      width: ENUM_WIDTH.M,
      editable: true,
    },
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      requiredField: true,
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'popup',
      filter: 'text',
      requiredField: true,
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      requiredField: true,
    },
    {
      header: '공정순서',
      name: 'proc_no',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: false,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
      requiredField: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      requiredField: true,
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.L,
      filter: 'text',
      requiredField: true,
    },
    {
      header: '품목',
      name: 'prod_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
      requiredField: true,
    },
    {
      header: '제품유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '품목유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
    { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
    {
      header: '계획수량',
      name: 'plan_qty',
      width: ENUM_WIDTH.M,
      editable: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '지시수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      requiredField: true,
    },
    {
      header: '지시순번',
      name: 'seq',
      width: ENUM_WIDTH.S,
      editable: true,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NOMAL,
      hidden: true,
    },
    {
      header: '작업교대UUID',
      name: 'shift_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      requiredField: true,
    },
    {
      header: '작업교대',
      name: 'shift_nm',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'combo',
      filter: 'text',
      requiredField: true,
    },
    {
      header: '작업조UUID',
      name: 'worker_group_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '작업조',
      name: 'worker_group_nm',
      width: ENUM_WIDTH.M,
      editable: true,
      format: 'combo',
      filter: 'text',
    },
    {
      header: '작업자',
      name: 'worker_nm',
      width: ENUM_WIDTH.XXL,
      editable: true,
      alias: 'emp_uuid',
    },
    {
      header: '설비UUID',
      name: 'equip_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      format: 'text',
    },
    {
      header: '설비명',
      name: 'equip_nm',
      width: ENUM_WIDTH.L,
      editable: true,
      hidden: false,
      format: 'popup',
    },
    {
      header: '수주상세UUID',
      name: 'sal_order_detail_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      editable: true,
      filter: 'text',
    },
    {
      header: '마감여부',
      name: 'complete_fg',
      width: ENUM_WIDTH.M,
      hidden: true,
      format: 'check',
    },
  ],
};
