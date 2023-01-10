import { message } from 'antd';
import { getPopupForm, IGridPopupInfo } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export default <IGridPopupInfo[]>[
  {
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
      uriPath: '/std/routing-resources',
      params: {
        resource_type: 'equip',
      },
    },
    gridMode: 'select',
  },
  {
    // 금형관리
    columnNames: [
      { original: 'mold_uuid', popup: 'mold_uuid' },
      { original: 'mold_nm', popup: 'mold_nm' },
      { original: 'mold_no', popup: 'mold_no' },
      { original: 'mold_cavity', popup: 'mold_cavity' },
    ],
    columns: getPopupForm('금형관리')?.datagridProps?.columns,
    dataApiSettings: (el: any) => {
      const rowKey = el.rowKey;
      const rowData = el?.instance?.store?.data?.rawData.find(
        el => el.rowKey === rowKey,
      );
      return {
        uriPath: getPopupForm('금형관리')?.uriPath,
        params: {},
        onInterlock: () => {
          let complete: boolean = rowData?.complete_fg;
          console.log(complete);
          if (complete) {
            message.warn('작업이 마감되어 금형을 수정할 수 없습니다.');
          }
          return !complete;
        },
      };
    },
    gridMode: 'select',
  },
  {
    // 작업장 관리
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
];
