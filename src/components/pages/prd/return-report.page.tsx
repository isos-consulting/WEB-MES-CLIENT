import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, convDataToSubTotal, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';

/** 자재반납현황 */
export const PgPrdReturnReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/prd/returns/report';
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
      sumColumns: ['qty'],
      textColumns: [
        {
          columnName: 'from_store_nm',
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
    }
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_reg_date', 'end_reg_date'], defaults:[getToday(-6), getToday()], label:'납입일'},

    {type:'radio', id:'sort_type', default:'store', label:'조회기준',
      options: [
        {code:'store', text:'창고별'},
        {code:'prod', text:'품목별'},
        {code:'date', text:'일자별'},
      ]
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
          {header: '품목', name:'prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.S, name:'unit_nm', filter:'text'},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '반납일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: 'LOT NO', width:ENUM_WIDTH.L, name:'lot_no', filter:'text', hidden:true},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '반납일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.S, name:'unit_nm', filter:'text'},
          {header: 'LOT NO', width:ENUM_WIDTH.L, name:'lot_no', filter:'text', hidden:true},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'store':
      default:
        _columns = [
          {header: '출고창고', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '출고위치', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '반납일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.S, name:'unit_nm', filter:'text'},
          {header: 'LOT NO', width:ENUM_WIDTH.L, name:'lot_no', filter:'text', hidden:true},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;
    }

    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'store':
        _columns = [
          {header: '출고창고', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '출고위치', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text'},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
        ];
        break;

      case 'prod':
        _columns = [
          {header: '품목', name:'prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '반납일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '반납수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
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
      searchInfo.values?.sort_type === 'prod' ? '품목별'
      : searchInfo.values?.sort_type === 'date' ? '일자별'
      : searchInfo.values?.sort_type === 'store' ? '창고별'
      : ''
    );
  }, [searchInfo?.values]);

  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    if (grid?.gridInfo?.data?.length <= 0) return;
    const curculationColumnNames = ['qty'];
    const standardNames = (
      searchInfo.values?.sort_type === 'prod' ?
        ['prod_uuid', 'item_type_nm', 'prod_type_nm', 'rev', 'prod_no', 'prod_nm', 'model_nm', 'prod_std', 'unit_nm']
      : searchInfo.values?.sort_type === 'store' ?
        ['from_store_uuid', 'from_store_nm', 'from_location_uuid', 'from_location_nm']
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
    const searchKeys = ['start_reg_date', 'end_reg_date', 'sort_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

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