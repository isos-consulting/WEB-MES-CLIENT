import { IGridColumn } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';

export default <IGridColumn[]>[
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
];
