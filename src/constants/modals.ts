import { getPopupForm, IGridPopupInfo } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

type ModalRecordKeys = 'autMenu' | 'EQUIP_POPUP_INFO' | 'WORKINGS_POPUP_INFO';

export default {
  autMenu: {
    columnNames: [
      { original: 'menuUuid', popup: 'menu_uuid' },
      { original: 'menuName', popup: 'menu_nm' },
    ],
    gridMode: 'select',
    popupKey: '메뉴관리',
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
