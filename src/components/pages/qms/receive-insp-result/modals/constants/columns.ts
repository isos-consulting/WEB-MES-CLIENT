import { IGridColumn } from '~/components/UI';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  InspectionCellHeader,
  URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS_WAITING,
} from '../constants';

export const RECEIVE_POPUP_COLUMNS: IGridColumn[] = [
  {
    header: '세부입하UUID',
    name: 'receive_detail_uuid',
    width: ENUM_WIDTH.L,
    hidden: true,
  },
  {
    header: '세부입하전표번호',
    name: 'stmt_no_sub',
    width: ENUM_WIDTH.L,
    hidden: true,
  },
  {
    header: '입하구분코드',
    name: 'insp_detail_type_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
  },
  { header: '입하구분', name: 'insp_detail_type_nm', width: ENUM_WIDTH.M },
  {
    header: '입하일자',
    name: 'reg_date',
    width: ENUM_WIDTH.M,
    format: 'date',
    filter: 'text',
  },
  {
    header: '거래처명',
    name: 'partner_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '품목유형명',
    name: 'item_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '제품유형명',
    name: 'prod_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  { header: '품번', name: 'prod_no', width: ENUM_WIDTH.L, filter: 'text' },
  { header: '품목명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
  { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
  { header: '모델명', name: 'model_nm', width: ENUM_WIDTH.L, filter: 'text' },
  { header: '단위명', name: 'unit_nm', width: ENUM_WIDTH.L, filter: 'text' },
  { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
  { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.L, filter: 'text' },
  {
    header: '입하 수량',
    name: 'qty',
    width: ENUM_WIDTH.M,
    filter: 'number',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '안전재고',
    name: 'inv_safe_qty',
    width: ENUM_WIDTH.M,
    filter: 'number',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '입고 창고UUID',
    name: 'to_store_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '입고 창고',
    name: 'to_store_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '입고 위치UUID',
    name: 'to_location_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '입고 위치',
    name: 'to_location_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
];

export const INSP_DETAIL_COLUMNS: IGridColumn[] = [
  {
    header: '검사기준서 상세UUID',
    name: 'insp_detail_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '검사항목 유형UUID',
    name: 'insp_item_type_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '검사항목 유형명',
    name: 'insp_item_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '검사항목UUID',
    name: 'insp_item_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '검사항목명',
    name: 'insp_item_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '검사 기준',
    name: 'spec_std',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '최소 값',
    name: 'spec_min',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '최대 값',
    name: 'spec_max',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '검사방법UUID',
    name: 'insp_method_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '검사방법명',
    name: 'insp_method_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '검사구UUID',
    name: 'insp_tool_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '검사구명',
    name: 'insp_tool_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '정렬',
    name: 'sortby',
    width: ENUM_WIDTH.S,
    filter: 'text',
    hidden: true,
  },
  {
    header: '시료 수량',
    name: 'sample_cnt',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '검사 주기',
    name: 'insp_cycle',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
];

export const INFO_INPUT_ITEMS: IInputGroupboxItem[] = [
  {
    id: 'receive_detail_uuid',
    label: '입하상세UUID',
    type: 'text',
    disabled: true,
    hidden: true,
  },
  {
    id: 'stmt_no_sub',
    label: '세부입하전표번호',
    type: 'text',
    readOnly: true,
    usePopup: true,
    popupKeys: [
      'receive_detail_uuid',
      'stmt_no_sub',
      'partner_nm',
      'reg_date',
      'to_store_uuid',
      'insp_type_uuid',
      'insp_detail_type_uuid',
      'insp_detail_type_cd',
      'insp_detail_type_nm',
      'prod_uuid',
      'prod_no',
      'prod_nm',
      'prod_std',
      'unit_uuid',
      'unit_nm',
      'lot_no',
      'qty',
    ],
    popupButtonSettings: {
      dataApiSettings: {
        uriPath: URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS_WAITING,
      },
      datagridSettings: { gridId: null, columns: RECEIVE_POPUP_COLUMNS },
      modalSettings: { title: '입하전표 선택' },
    },
    handleChange: null,
  },
  { id: 'partner_nm', label: '거래처', type: 'text', disabled: true },
  { id: 'reg_date', label: '입하일', type: 'date', disabled: true },
  {
    id: 'insp_detail_type_cd',
    label: '입하구분코드',
    type: 'text',
    hidden: true,
  },
  {
    id: 'insp_detail_type_nm',
    label: '입하구분',
    type: 'text',
    disabled: true,
  },
  { id: 'prod_uuid', label: '품목UUID', type: 'text', hidden: true },
  { id: 'prod_no', label: '품번', type: 'text', disabled: true },
  { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
  { id: 'prod_std', label: '규격', type: 'text', disabled: true },
  {
    id: 'unit_uuid',
    label: '단위UUID',
    type: 'text',
    disabled: true,
    hidden: true,
  },
  { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
  { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
  { id: 'qty', label: '입하수량', type: 'number', disabled: true },
];

export const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
  {
    id: 'insp_uuid',
    label: '검사기준서UUID',
    type: 'text',
    disabled: true,
    hidden: true,
  },
  {
    id: 'insp_result_fg',
    label: '최종판정',
    type: 'text',
    disabled: true,
    hidden: true,
  },
  {
    id: 'insp_result_state',
    label: '최종판정',
    type: 'text',
    disabled: true,
  },
  { id: 'reg_date', label: '검사일자', type: 'date', default: '' },
  { id: 'reg_date_time', label: '검사시간', type: 'time' },
  { id: 'emp_uuid', label: '검사자UUID', type: 'text', hidden: true },
  {
    id: 'emp_nm',
    label: '검사자',
    type: 'text',
    usePopup: true,
    popupKey: '사원관리',
    popupKeys: ['emp_nm', 'emp_uuid'],
    params: { emp_status: 'incumbent' },
  },
  {
    id: 'insp_handling_type',
    label: '처리결과',
    type: 'combo',
    firstItemType: 'empty',
    options: [],
    disabled: true,
    onAfterChange: () => {
      // this is a workaround for the combo box not updating the value
    },
  },
  { id: 'remark', label: '비고', type: 'text' },
];

export const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
  {
    id: 'qty',
    label: '입고수량',
    type: 'number',
    disabled: true,
    onAfterChange: () => {
      // this is a workaround for the combo box not updating the value
    },
  },
  {
    id: 'to_store_uuid',
    label: '입고창고',
    type: 'combo',
    firstItemType: 'empty',
    dataSettingOptions: {
      codeName: 'store_uuid',
      textName: 'store_nm',
      uriPath: '',
      params: {
        store_type: 'available',
      },
    },
    onAfterChange: ev => {
      // this is a workaround for the combo box not updating the value
    },
  },
  {
    id: 'to_location_uuid',
    label: '입고위치',
    type: 'combo',
    firstItemType: 'empty',
    dataSettingOptions: {
      codeName: 'location_uuid',
      textName: 'location_nm',
      uriPath: '',
    },
    onAfterChange: ev => {
      // this is a workaround for the combo box not updating the value
    },
  },
];

export const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
  {
    id: 'reject_qty',
    label: '부적합수량',
    type: 'number',
    disabled: true,
    onAfterChange: () => {
      // this is a workaround for the combo box not updating the value
    },
  },
  {
    id: 'reject_uuid',
    label: '불량유형UUID',
    type: 'text',
    hidden: true,
  },
  {
    id: 'reject_nm',
    label: '불량유형',
    type: 'text',
    usePopup: true,
    popupKey: '부적합관리',
    popupKeys: ['reject_nm', 'reject_uuid'],
  },
  {
    id: 'reject_store_uuid',
    label: '반출창고',
    type: 'combo',
    firstItemType: 'empty',
    dataSettingOptions: {
      codeName: 'store_uuid',
      textName: 'store_nm',
      uriPath: '',
      params: {
        store_type: 'return',
      },
    },
  },
  {
    id: 'reject_location_uuid',
    label: '반출위치',
    type: 'combo',
    firstItemType: 'empty',
    dataSettingOptions: {
      codeName: 'location_uuid',
      textName: 'location_nm',
      uriPath: '',
    },
    onAfterChange: ev => {
      // this is a workaround for the combo box not updating the value
    },
  },
];

export const inspectionCheckCells: IGridColumn[] = [
  {
    header: InspectionCellHeader._insp_result_detail_value_uuid,
    name: '_insp_result_detail_value_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: InspectionCellHeader._sample_no,
    name: '_sample_no',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
  {
    header: InspectionCellHeader._insp_value,
    name: '_insp_value',
    width: ENUM_WIDTH.L,
    filter: 'text',
    editable: true,
  },
  {
    header: InspectionCellHeader._insp_result_fg,
    name: '_insp_result_fg',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
  {
    header: InspectionCellHeader._insp_result_state,
    name: '_insp_result_state',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
];

export const inspectionItemResultCells: IGridColumn[] = [
  {
    header: '합격여부',
    name: 'insp_result_fg',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
  {
    header: '판정',
    name: 'insp_result_state',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '비고',
    name: 'remark',
    width: ENUM_WIDTH.XL,
    filter: 'text',
  },
];
