import { GridEventProps } from 'tui-grid/types/event';
import { TGridPopupInfos } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export default [
  {
    columnNames: [
      { original: 'item_type_uuid', popup: 'item_type_uuid' },
      { original: 'item_type_cd', popup: 'item_type_cd' },
      { original: 'item_type_nm', popup: 'item_type_nm' },
    ],
    columns: [
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목유형코드',
        name: 'item_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품목유형명',
        name: 'item_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/item-types',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
      { original: 'prod_type_cd', popup: 'prod_type_cd' },
      { original: 'prod_type_nm', popup: 'prod_type_nm' },
    ],
    columns: [
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품유형코드',
        name: 'prod_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '제품유형명',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/prod-types',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'model_uuid', popup: 'model_uuid' },
      { original: 'model_cd', popup: 'model_cd' },
      { original: 'model_nm', popup: 'model_nm' },
    ],
    columns: [
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '모델코드',
        name: 'model_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/models',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'unit_uuid', popup: 'unit_uuid' },
      { original: 'unit_cd', popup: 'unit_cd' },
      { original: 'unit_nm', popup: 'unit_nm' },
    ],
    columns: [
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '단위코드',
        name: 'unit_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/units',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'bom_type_uuid', popup: 'bom_type_uuid' },
      { original: 'bom_type_cd', popup: 'bom_type_cd' },
      { original: 'bom_type_nm', popup: 'bom_type_nm' },
    ],
    columns: [
      {
        header: 'BOM유형UUID',
        name: 'bom_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: 'BOM유형코드',
        name: 'bom_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: 'BOM유형명',
        name: 'bom_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/adm/bom-types',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'prd_plan_type_uuid', popup: 'prd_plan_type_uuid' },
      { original: 'prd_plan_type_cd', popup: 'prd_plan_type_cd' },
      { original: 'prd_plan_type_nm', popup: 'prd_plan_type_nm' },
    ],
    columns: [
      {
        header: '계획유형UUID',
        name: 'prd_plan_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '계획유형코드',
        name: 'prd_plan_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '계획유형명(MPS/MRP)',
        name: 'prd_plan_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/adm/prd-plan-types',
      params: {},
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'inv_to_store_uuid', popup: 'store_uuid' },
      { original: 'inv_to_store_cd', popup: 'store_cd' },
      { original: 'inv_to_store_nm', popup: 'store_nm' },
    ],
    columns: [
      {
        header: '창고UUID',
        name: 'store_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '창고코드',
        name: 'store_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '창고명',
        name: 'store_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/stores',
      params: { store_type: 'available' },
    },
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'inv_to_location_uuid', popup: 'location_uuid' },
      { original: 'inv_to_location_cd', popup: 'location_cd' },
      { original: 'inv_to_location_nm', popup: 'location_nm' },
    ],
    columns: [
      {
        header: '위치UUID',
        name: 'location_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '위치코드',
        name: 'location_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '위치명',
        name: 'location_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: (ev: GridEventProps & { instance: any }) => {
      const { rowKey, instance } = ev;
      const { rawData } = instance?.store?.data;

      const storeUuid = rawData[rowKey]?.inv_to_store_uuid;
      return {
        uriPath: '/std/locations',
        params: { store_uuid: storeUuid ?? '' },
      };
    },
    gridMode: 'select',
  },
] as TGridPopupInfos;
