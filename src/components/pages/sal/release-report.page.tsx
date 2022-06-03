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

/** 제품출고현황 */
export const PgSalReleaseReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/sal/releases/report';
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
  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_reg_date', 'end_reg_date'],
      defaults: [getToday(-7), getToday()],
      label: '출고일',
    },

    {
      type: 'radio',
      id: 'sort_type',
      default: 'none',
      label: '소계기준',
      options: [
        { code: 'none', text: '없음' },
        { code: 'store', text: '창고별' },
        { code: 'prod', text: '품목별' },
        { code: 'date', text: '일자별' },
      ],
    },
  ]);
  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['qty'],
      textColumns: [
        {
          columnName: 'from_location_nm',
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
    hidden: searchInfo.values?.sort_type === 'none' ? true : false,
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

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
            header: '제품수주상세UUID',
            name: 'order_detail_uuid',
            alias: 'uuid',
            hidden: true,
          },
          { header: '제품아이디', name: 'prod_uuid', hidden: true },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: '출고창고아이디',
            name: 'from_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고창고',
            name: 'from_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고위치아이디',
            name: 'from_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고위치',
            name: 'from_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
          {
            header: '입고창고아이디',
            name: 'to_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고창고',
            name: 'to_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '입고위치아이디',
            name: 'to_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고위치',
            name: 'to_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;
      case 'none':
      case 'date':
        _columns = [
          {
            header: '제품수주상세UUID',
            name: 'order_detail_uuid',
            alias: 'uuid',
            hidden: true,
          },
          {
            header: '출고일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '출고창고아이디',
            name: 'from_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고창고',
            name: 'from_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고위치아이디',
            name: 'from_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고위치',
            name: 'from_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          { header: '제품아이디', name: 'prod_uuid', hidden: true },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
          {
            header: '입고창고아이디',
            name: 'to_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고창고',
            name: 'to_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '입고위치아이디',
            name: 'to_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고위치',
            name: 'to_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'store':
      default:
        _columns = [
          {
            header: '제품수주상세UUID',
            name: 'order_detail_uuid',
            alias: 'uuid',
            hidden: true,
          },
          {
            header: '출고창고아이디',
            name: 'from_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고창고',
            name: 'from_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고위치아이디',
            name: 'from_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고위치',
            name: 'from_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          { header: '제품아이디', name: 'prod_uuid', hidden: true },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
          {
            header: '입고창고아이디',
            name: 'to_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고창고',
            name: 'to_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '입고위치아이디',
            name: 'to_location_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '입고위치',
            name: 'to_location_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;
    }
    grid?.setGridColumns(_columns);
    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'prod':
        _columns = [
          { header: '제품아이디', name: 'prod_uuid', hidden: true },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
        ];
        break;

      case 'date':
        _columns = [
          {
            header: '출고일자',
            name: 'reg_date',
            width: ENUM_WIDTH.M,
            filter: 'text',
            format: 'date',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
        ];
        break;

      case 'store':
        _columns = [
          {
            header: '출고창고아이디',
            name: 'from_store_uuid',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: true,
          },
          {
            header: '출고창고',
            name: 'from_store_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
          },
          {
            header: '출고수량',
            width: ENUM_WIDTH.M,
            decimal: ENUM_DECIMAL.DEC_STCOK,
            name: 'qty',
            format: 'number',
            filter: 'number',
          },
        ];
        break;
      case 'none':
      default:
        _columns = [];
        break;
    }
    subGrid?.setGridColumns(_columns);
    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  /** 액션 관리 */

  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'prod'
        ? '품목별'
        : searchInfo.values?.sort_type === 'date'
        ? '일자별'
        : searchInfo.values?.sort_type === 'partner'
        ? '거래처별'
        : searchInfo.values?.sort_type === 'store'
        ? '창고별'
        : '',
    );
  }, [searchInfo?.values]);

  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const setSubTotalDatas = (data: object[]) => {
    if (data?.length > 0) {
      const curculationColumnNames = ['qty'];
      const standardNames =
        searchInfo.values?.sort_type === 'prod'
          ? [
              'prod_uuid',
              'item_type_nm',
              'prod_type_nm',
              'prod_no',
              'rev',
              'prod_nm',
              'model_nm',
              'prod_std',
              'unit_nm',
            ]
          : searchInfo.values?.sort_type === 'store'
          ? ['from_store_uuid', 'from_store_nm']
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
    const searchKeys = ['start_date', 'end_date', 'sort_type']; //Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);
    if (values?.sort_type === 'none') {
      searchParams['sort_type'] = 'date';
    }
    let data = [];
    let subTotalData = [];

    getData(searchParams, searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        subGrid.setGridData(subTotalData);
        grid.setGridData(data);
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
