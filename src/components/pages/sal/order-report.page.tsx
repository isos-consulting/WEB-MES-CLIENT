import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, convDataToSubTotal, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';



/** 수주현황 */
export const PgSalOrdersReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/sal/orders/report';
  const saveUriPath = null;
  
  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });
  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['qty', 'supply_price', 'tax', 'total_price', 'outgo_qty', 'balance'],
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
      ]
    },
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_reg_date', 'end_reg_date'], defaults:[getToday(-7), getToday()], label:'수주일', useCheckbox:true},
    {type:'daterange', id:'due_date', ids:['start_due_date', 'end_due_date'], defaults:[getToday(-7), getToday()], label:'납기일', useCheckbox:true},

    {type:'radio', id:'sort_type', default:'partner', label:'조회기준',
      options: [
        {code:'partner', text:'거래처별'},
        {code:'prod', text:'품목별'},
        {code:'date', text:'일자별'},
      ]
    },

    {type:'radio', id:'complete_state', default:'all', label:'완료구분',
      options: [
        {code:'all', text:'전체'},
        {code:'complete', text:'완료'},
        {code:'incomplete', text:'미완료'},
      ]
    }
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
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '수주일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '납기일자', name:'due_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', width:ENUM_WIDTH.M, name:'price', format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위', width:ENUM_WIDTH.S, name:'money_unit_nm', filter:'text'},
          {header: '환율', width:ENUM_WIDTH.M, name:'exchange', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
          {header: '완료유무', width:ENUM_WIDTH.M, name:'complete_state', filter:'select'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '수주일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '납기일자', name:'due_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', width:ENUM_WIDTH.M, name:'price', format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위', width:ENUM_WIDTH.S, name:'money_unit_nm', filter:'text'},
          {header: '환율', width:ENUM_WIDTH.M, name:'exchange', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
          {header: '완료유무', width:ENUM_WIDTH.M, name:'complete_state', filter:'select'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'partner':
      default:
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '수주일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '납기일자', name:'due_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', width:ENUM_WIDTH.M, name:'price', format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위', width:ENUM_WIDTH.S, name:'money_unit_nm', filter:'text'},
          {header: '환율', width:ENUM_WIDTH.M, name:'exchange', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
          {header: '완료유무', width:ENUM_WIDTH.M, name:'complete_state', filter:'select'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
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
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '수주일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
        ];
        break;

      case 'partner':
        _columns = [
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', width:ENUM_WIDTH.M, name:'supply_price', format:'number', filter:'number'},
          {header: '부가세액', width:ENUM_WIDTH.M, name:'tax', format:'number', filter:'number'},
          {header: '합계금액', width:ENUM_WIDTH.L, name:'total_price', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'outgo_qty', format:'number', filter:'number'},
          {header: '미납수량', width:ENUM_WIDTH.M, name:'balance', format:'number', filter:'number'},
        ];
        break;

      default:
        _columns = null;
        break;
    }
    
    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);



  /** 액션 관리 */
  useLayoutEffect(() => {
    grid?.setGridColumns(columns);
  }, [columns]);

  useLayoutEffect(() => {
    if (subColumns) {
      subGrid?.setGridColumns(subColumns);
      subGrid?.setGridHidden(false);

    } else {
      subGrid?.setGridHidden(true);
    }
  }, [subColumns]);

  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'prod' ? '품목별'
      : searchInfo.values?.sort_type === 'date' ? '일자별'
      : searchInfo.values?.sort_type === 'partner' ? '거래처별'
      : searchInfo.values?.sort_type === 'store' ? '창고별'
      : ''
    );
  }, [searchInfo?.values]);

  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    if (grid?.gridInfo?.data?.length <= 0) return;
    const curculationColumnNames = ['qty', 'supply_price', 'tax', 'total_price', 'outgo_qty', 'balance'];
    const standardNames = (
      searchInfo.values?.sort_type === 'prod' ?
        ['prod_uuid', 'item_type_nm', 'prod_type_nm', 'prod_no', 'rev', 'prod_nm', 'model_nm', 'prod_std', 'unit_nm']
      : searchInfo.values?.sort_type === 'partner' ?
        ['partner_uuid', 'partner_nm']
      : searchInfo.values?.sort_type === 'date' ?
        ['reg_date']
      : null
    );
    const subGridData = convDataToSubTotal(grid?.gridInfo?.data, {
      standardNames: standardNames,
      curculations: [
        {names: curculationColumnNames, type:'sum'},
      ],
    }).subTotals || [];

    subGrid.setGridData(subGridData);

  }, [subColumns, grid?.gridInfo?.data]);


  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = ['start_reg_date', 'end_reg_date', 'start_due_date', 'end_due_date', 'complete_state', 'sort_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

    if (!values?.reg_date_chk) {
      delete searchParams['start_reg_date'];
      delete searchParams['end_reg_date'];
    }

    if (!values?.due_date_chk) {
      delete searchParams['start_due_date'];
      delete searchParams['end_due_date'];
    }

    let data = [];

    getData(searchParams, searchUriPath, 'raws').then((res) => {
      data = res;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
      subGrid.setGridData([]);
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

    printExcel: dataGridEvents.printExcel
  };
  
  /** 템플릿에 전달할 값 */
  const props:ITpSingleGridProps = {
    title,
    templateType: 'report',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props, 
      onSearch
    }, 
    inputProps: null,  

    subTitle,
    subGridRef: subGrid.gridRef,
    subGridInfo: subGrid.gridInfo,
    
    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [newDataPopupGrid?.gridInfo, editDataPopupGrid?.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}