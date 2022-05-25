import { IGridColumn, ISearchItem } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export const searchFields: ISearchItem[] = [
  {
    id: 'reg_date',
    ids: ['start_date', 'end_date'],
    names: ['start_date', 'end_date'],
    defaults: ['', ''],
    type: 'daterange',
    label: '기간',
  },
];

export const concreteProgressHistoryGridColumns: IGridColumn[] = [
  {
    header: '일자',
    name: 'reg_date',
    width: ENUM_WIDTH.XL,
    format: 'datetime',
    align: 'center',
  },
  {
    header: '작업장',
    name: 'workings_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    align: 'center',
  },
  {
    header: '작업지시 번호',
    name: 'order_no',
    width: ENUM_WIDTH.M,
    filter: 'text',
    align: 'center',
  },
  {
    header: '작업상태',
    name: 'order_state',
    width: ENUM_WIDTH.S,
    filter: 'text',
    align: 'center',
  },
  {
    header: '품번',
    name: 'prod_no',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '품목',
    name: 'prod_nm',
    width: ENUM_WIDTH.XL,
    filter: 'text',
  },
  {
    header: '품목유형',
    name: 'item_type_nm',
    width: ENUM_WIDTH.S,
    filter: 'text',
    align: 'center',
  },
  {
    header: '규격',
    name: 'prod_std',
    width: ENUM_WIDTH.M,
    filter: 'text',
    align: 'center',
  },
  {
    header: '순서',
    name: 'sort',
    width: ENUM_WIDTH.M,
    filter: 'text',
    align: 'center',
  },
];

export const rowSpanKeys: string[] = [
  'reg_date',
  'workings_nm',
  'order_no',
  'order_state',
  'prod_no',
  'prod_nm',
  'item_type_nm',
  'prod_std',
];
