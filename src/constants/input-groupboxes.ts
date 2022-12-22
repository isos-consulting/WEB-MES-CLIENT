import { URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS_WAITING } from '~/components/pages/qms/receive-insp-result/modals/constants';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox';
import { getToday } from '~/functions';
import { ColumnStore } from './columns';

type InputGroupBoxRecordKeys =
  | 'RECEIVE_INSP_ITEM'
  | 'RECEIVE_INSP_RESULT'
  | 'RECEIVE_INSP_RESULT_INCOME'
  | 'RECEIVE_INSP_RESULT_RETURN'
  | 'PROC_INSP_ITEM_WORK'
  | 'PROC_INSP_RESULT_DETAIL_ITEM'
  | 'PROC_INSP_RESULT';

export const InputGroupBoxStore: Record<
  InputGroupBoxRecordKeys,
  IInputGroupboxItem[]
> = {
  RECEIVE_INSP_ITEM: [
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
        datagridSettings: { gridId: null, columns: ColumnStore.RECEIVE },
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
  ],
  RECEIVE_INSP_RESULT: [
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
  ],
  RECEIVE_INSP_RESULT_INCOME: [
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
  ],
  RECEIVE_INSP_RESULT_RETURN: [
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
  ],
  PROC_INSP_ITEM_WORK: [
    { id: 'reg_date', label: '실적일시', type: 'date', disabled: true },
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    { id: 'proc_nm', label: '공정', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
  ],
  PROC_INSP_RESULT_DETAIL_ITEM: [
    {
      label: '최종판정',
      id: 'insp_result_state',
      type: 'text',
      disabled: true,
    },
    { label: '검사차수', id: 'seq', type: 'number', disabled: true },
    { label: '검사일', id: 'reg_date', type: 'date', disabled: true },
    { label: '검사시간', id: 'reg_date_time', type: 'time', disabled: true },
    { label: '검사자', id: 'emp_nm', type: 'text', disabled: true },
    {
      label: '검사유형',
      id: 'insp_detail_type_nm',
      type: 'text',
      disabled: true,
    },
    { label: '비고', id: 'remark', type: 'text', disabled: true },
  ],
  PROC_INSP_RESULT: [
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
    {
      id: 'insp_detail_type_uuid',
      label: '검사유형',
      type: 'combo',
      dataSettingOptions: {
        codeName: 'insp_detail_type_uuid',
        textName: 'insp_detail_type_nm',
        uriPath: '/adm/insp-detail-types',
        params: {
          insp_type_cd: 'PROC_INSP',
        },
      },
      onAfterChange: () => {
        // this is a workaround for the combo box not updating the value
      },
    },
    { id: 'reg_date', label: '검사일자', type: 'date', default: getToday() },
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
    { id: 'remark', label: '비고', type: 'text' },
  ],
};
