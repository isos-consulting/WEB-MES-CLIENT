import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  convDataToSubTotal,
  dataGridEvents,
  getData,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useLoadingState } from '~/hooks';
import { message } from 'antd';

/** 발주현황 */
export const PgMatOrderReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();
  const [, setLoading] = useLoadingState();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/mat/orders/report';
  const saveUriPath = null;

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    onAfterFilter: ev => {
      setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData);
    },
    onAfterUnfilter: ev => {
      setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData);
    },
  });
  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: [
        'qty',
        'supply_price',
        'tax',
        'total_price',
        'receive_qty',
        'balance',
      ],
      textColumns: [
        {
          columnName: 'partner_nm',
          content: '합계',
        },
        {
          columnName: 'item_type_nm',
          content: '합계',
        },
        {
          columnName: 'reg_date',
          content: '합계',
        },
      ],
    },
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_reg_date', 'end_reg_date'],
      defaults: [getToday(-7), getToday()],
      label: '발주일',
      useCheckbox: true,
      defaultChecked: true,
    },
    {
      type: 'daterange',
      id: 'due_date',
      ids: ['start_due_date', 'end_due_date'],
      defaults: [getToday(-7), getToday()],
      label: '납기일',
      useCheckbox: true,
    },
    {
      type: 'radio',
      id: 'sort_type',
      default: 'partner',
      label: '조회기준',
      options: [
        { code: 'partner', text: '거래처별' },
        { code: 'prod', text: '품목별' },
        { code: 'date', text: '일자별' },
      ],
    },
    {
      type: 'radio',
      id: 'complete_state',
      default: 'all',
      label: '완료구분',
      options: [
        { code: 'all', text: '전체' },
        { code: 'complete', text: '완료' },
        { code: 'incomplete', text: '미완료' },
      ],
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  const columns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'prod':
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '자재공정출고아이디',
            name: 'release_uuid',
            hidden: true,
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '품목아이디',
            name: 'prod_uuid',
            hidden: true,
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '거래처아이디',
            name: 'partner_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '거래처',
            name: 'partner_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '발주일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '모델아이디',
            name: 'model_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '단위아이디',
            name: 'unit_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '납기일자',
            name: 'due_date',
            width: ENUM_WIDTH.M,
            format: 'date',
            align: 'center',
            filter: 'text',
          },

          {
            header: '완료유무',
            name: 'complete_state',
            width: ENUM_WIDTH.M,
            align: 'center',
            filter: 'text',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },

          {
            header: '화폐단위아이디',
            name: 'money_unit_uuid',
            hidden: true,
          },
          {
            header: '화폐단위',
            name: 'money_unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '단가',
            name: 'price',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '환율',
            name: 'exchange',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '비고',
            name: 'remark',
            width: ENUM_WIDTH.XL,
            filter: 'text',
          },
        ];
        break;

      case 'date':
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '자재공정출고아이디',
            name: 'release_uuid',
            hidden: true,
          },
          {
            header: '발주일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '거래처아이디',
            name: 'partner_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '거래처',
            name: 'partner_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '품목아이디',
            name: 'prod_uuid',
            hidden: true,
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '모델아이디',
            name: 'model_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '단위아이디',
            name: 'unit_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '납기일자',
            name: 'due_date',
            width: ENUM_WIDTH.M,
            format: 'date',
            align: 'center',
            filter: 'text',
          },

          {
            header: '완료유무',
            name: 'complete_state',
            width: ENUM_WIDTH.M,
            align: 'center',
            filter: 'select',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },

          { header: '화폐단위아이디', name: 'money_unit_uuid', hidden: true },
          {
            header: '화폐단위',
            name: 'money_unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '단가',
            name: 'price',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '환율',
            name: 'exchange',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '비고',
            name: 'remark',
            width: ENUM_WIDTH.XL,
            filter: 'text',
          },
        ];
        break;

      case 'partner':
      default:
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '자재공정출고아이디',
            name: 'release_uuid',
            hidden: true,
          },
          {
            header: '거래처아이디',
            name: 'partner_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '거래처',
            name: 'partner_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '발주일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '품목아이디',
            name: 'prod_uuid',
            hidden: true,
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '모델아이디',
            name: 'model_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '단위아이디',
            name: 'unit_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '납기일자',
            name: 'due_date',
            width: ENUM_WIDTH.M,
            format: 'date',
            align: 'center',
            filter: 'text',
          },

          {
            header: '완료유무',
            name: 'complete_state',
            width: ENUM_WIDTH.M,
            align: 'center',
            filter: 'select',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '화폐단위아이디',
            name: 'money_unit_uuid',
            hidden: true,
          },
          {
            header: '화폐단위',
            name: 'money_unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '단가',
            name: 'price',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '환율',
            name: 'exchange',
            width: ENUM_WIDTH.S,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '비고',
            name: 'remark',
            width: ENUM_WIDTH.XL,
            filter: 'text',
          },
        ];
        break;
    }

    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'prod':
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            align: 'center',
          },
          { header: '품목아이디', name: 'prod_uuid', hidden: true },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '모델아이디',
            name: 'model_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '단위아이디',
            name: 'unit_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
        ];
        break;

      case 'date':
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '발주일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
        ];
        break;

      case 'partner':
        _columns = [
          {
            header: 'row_type',
            name: 'row_type',
            width: ENUM_WIDTH.L,
            align: 'center',
            hidden: true,
          },
          {
            header: '거래처아이디',
            name: 'partner_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
          },
          {
            header: '거래처',
            name: 'partner_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '발주수량',
            name: 'qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '공급가액',
            name: 'supply_price',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '부가세',
            name: 'tax',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '합계금액',
            name: 'total_price',
            width: ENUM_WIDTH.L,
            decimal: ENUM_DECIMAL.DEC_PRICE,
            format: 'number',
            filter: 'number',
          },
          {
            header: '입하수량',
            name: 'receive_qty',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
          {
            header: '미납수량',
            name: 'balance',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            format: 'number',
            filter: 'number',
          },
        ];
        break;

      default:
        _columns = null;
        break;
    }

    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  /** 액션 관리 */
  // 서브토탈 컬럼 세팅
  useLayoutEffect(() => {
    grid?.setGridColumns(columns);
  }, [columns]);

  // 서브토탈 그리드 숨김 여부
  useLayoutEffect(() => {
    if (subColumns) {
      subGrid?.setGridColumns(subColumns);
      subGrid?.setGridHidden(false);
    } else {
      subGrid?.setGridHidden(true);
    }
  }, [subColumns]);

  // 서브토탈 타이틀 세팅
  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'prod'
        ? '품목별'
        : searchInfo.values?.sort_type === 'date'
        ? '일자별'
        : searchInfo.values?.sort_type === 'partner'
        ? '거래처별'
        : '',
    );
  }, [searchInfo?.values]);

  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const setSubTotalDatas = (data: object[]) => {
    if (data?.length > 0) {
      const curculationColumnNames = [
        'qty',
        'supply_price',
        'tax',
        'total_price',
        'receive_qty',
        'balance',
      ];
      const standardNames =
        searchInfo.values?.sort_type === 'prod'
          ? [
              'prod_uuid',
              'item_type_nm',
              'prod_type_nm',
              'rev',
              'prod_no',
              'prod_nm',
              'model_nm',
              'prod_std',
              'unit_nm',
            ]
          : searchInfo.values?.sort_type === 'partner'
          ? ['partner_uuid', 'partner_nm']
          : searchInfo.values?.sort_type === 'date'
          ? ['reg_date']
          : null;
      const subGridData =
        convDataToSubTotal(data, {
          standardNames: standardNames,
          curculations: [{ names: curculationColumnNames, type: 'sum' }],
        }).subTotals || [];

      subGrid.setGridData(subGridData);
    } else {
      subGrid.setGridData([]);
    }
  };

  /** 검색 */
  const onSearch = values => {
    const searchKeys = [
      'start_reg_date',
      'end_reg_date',
      'start_due_date',
      'end_due_date',
      'complete_state',
      'sort_type',
    ];

    const searchParams = cleanupKeyOfObject(values, searchKeys);

    if (!values?.reg_date_chk && !values?.due_date_chk) {
      message.warning('발주일 혹은 납기일을 하나라도 체크 후 조회해주세요.');
      setLoading(false);
      return;
    }

    if (!values?.reg_date_chk) {
      delete searchParams['start_reg_date'];
      delete searchParams['end_reg_date'];
    }

    if (!values?.due_date_chk) {
      delete searchParams['start_due_date'];
      delete searchParams['end_due_date'];
    }

    let data = [];

    getData(searchParams, searchUriPath, 'raws')
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        subGrid.setGridData([]);
        grid.setGridData(data);
        // subGrid.setGridData(subGridData);
      });
  };

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
    },

    /** 수정 */
    update: null,

    /** 삭제 */
    delete: null,

    /** 신규 추가 */
    create: null,

    /** 저장 */
    save: null,

    /** 편집 취소 */
    cancelEdit: null,

    printExcel: dataGridEvents.printExcel,
  };

  /** 템플릿에 전달할 값 */
  const props: ITpSingleGridProps = {
    title,
    templateType: 'report',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props,
      onSearch,
    },
    inputProps: null,

    subTitle,
    subGridRef: subGrid.gridRef,
    subGridInfo: subGrid.gridInfo,

    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [newDataPopupGrid?.gridInfo, editDataPopupGrid?.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
