import { IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export const ColumnStore: { [key: string]: IGridColumn[] } = {
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
    },
    {
      header: '생산 수량',
      name: 'total_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '양품 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: ENUM_WIDTH.M,
      hidden: false,
      format: 'number',
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
};
