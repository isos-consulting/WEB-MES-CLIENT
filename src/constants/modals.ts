import { getPopupForm, IGridPopupInfo } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

type ModalRecordKeys =
  | 'autMenu'
  | 'ORDER_ADD_ROW_POPUP_INFO'
  | 'EQUIP_POPUP_INFO'
  | 'WORKINGS_POPUP_INFO';

export default {
  autMenu: {
    columnNames: [
      { original: 'menuUuid', popup: 'menu_uuid' },
      { original: 'menuName', popup: 'menu_nm' },
    ],
    gridMode: 'select',
    popupKey: '메뉴관리',
  },
  ORDER_ADD_ROW_POPUP_INFO: {
    columnNames: [
      { original: 'routing_uuid', popup: 'routing_uuid' },
      { original: 'proc_uuid', popup: 'proc_uuid' },
      { original: 'proc_no', popup: 'proc_no' },
      { original: 'proc_nm', popup: 'proc_nm' },
      { original: 'workings_uuid', popup: 'workings_uuid' },
      { original: 'workings_nm', popup: 'workings_nm' },
      { original: 'item_type_uuid', popup: 'item_type_uuid' },
      { original: 'item_type_nm', popup: 'item_type_nm' },
      { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
      { original: 'prod_type_nm', popup: 'prod_type_nm' },
      { original: 'prod_uuid', popup: 'prod_uuid' },
      { original: 'prod_no', popup: 'prod_no' },
      { original: 'prod_nm', popup: 'prod_nm' },
      { original: 'model_uuid', popup: 'model_uuid' },
      { original: 'model_nm', popup: 'model_nm' },
      { original: 'rev', popup: 'rev' },
      { original: 'prod_std', popup: 'prod_std' },
      { original: 'unit_uuid', popup: 'unit_uuid' },
      { original: 'unit_nm', popup: 'unit_nm' },
      { original: 'auto_work_fg', popup: 'auto_work_fg' },
      { original: 'plan_qty', popup: 'plan_daily_qty' },
      { original: 'qty', popup: 'balance' },
      { original: 'monthly_balance', popup: 'monthly_balance' },
    ],
    columns: [
      {
        header: '라우팅UUID',
        name: 'routing_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
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
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장',
        name: 'workings_nm',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '품목',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '자동 실적처리유무',
        name: 'auto_work_fg',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/routings/actived-prod',
      params: {},
    },
    gridMode: 'select',
  },
  EQUIP_POPUP_INFO: {
    columnNames: [
      { original: 'routing_resource_uuid', popup: 'routing_resource_uuid' },
      { original: 'equip_uuid', popup: 'equip_uuid' },
      { original: 'equip_cd', popup: 'equip_cd' },
      { original: 'equip_nm', popup: 'equip_nm' },
    ],
    columns: [
      {
        header: '생산자원UUID',
        name: 'routing_resource_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공장UUID',
        name: 'factory_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '라우팅UUID',
        name: 'routing_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '자원 유형',
        name: 'resource_type',
        width: ENUM_WIDTH.M,
        hidden: false,
        format: 'text',
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
        hidden: false,
        format: 'text',
      },
      {
        header: '인원',
        name: 'emp_cnt',
        width: ENUM_WIDTH.M,
        hidden: false,
        format: 'text',
      },
      {
        header: 'Cycle Time',
        name: 'cycle_time',
        width: ENUM_WIDTH.M,
        hidden: false,
        format: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: 'std/equips',
      params: {},
    },
    gridMode: 'select',
  },
  WORKINGS_POPUP_INFO: {
    columnNames: [
      { original: 'workings_uuid', popup: 'workings_uuid' },
      { original: 'workings_cd', popup: 'workings_cd' },
      { original: 'workings_nm', popup: 'workings_nm' },
    ],
    columns: getPopupForm('작업장관리')?.datagridProps?.columns,
    dataApiSettings: {
      uriPath: getPopupForm('작업장관리')?.uriPath,
      params: {},
    },
    gridMode: 'select',
  },
} as Record<ModalRecordKeys, IGridPopupInfo>;
