import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, convDataToSubTotal, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';



/** 불량현황 */
export const PgPrdWorkRejectReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/prd/work-rejects/report';
  const saveUriPath = null;
  
  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    onAfterFilter:(ev) => {setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData)},
    onAfterUnfilter:(ev) => {setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData)}
  });

  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['total_qty', 'qty', 'reject_detail_qty'],
      textColumns: [
        {
          columnName: 'reject_proc_nm',
          content: '합계',
        },
        {
            columnName: 'item_type_nm',
            content: '합계',
        },
        {
            columnName: 'reject_type_nm',
            content: '합계',
        }

      ]
    }
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(-7), getToday()], label:'작업일', useCheckbox:true},

    {type:'radio', id:'sort_type', default:'proc', label:'조회기준',
      options: [
        {code:'proc', text:'공정별'},
        {code:'prod', text:'품목별'},
        {code:'reject', text:'불량항목별'},
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
            {header: '작업일', width:ENUM_WIDTH.M,name:'reg_date',  filter:'text', format:'date'},
            {header: '품목', width:ENUM_WIDTH.M,name:'prod_id', filter:'text',hidden:true},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: '불량 발생 공정', width:ENUM_WIDTH.M,name:'reject_proc_nm', filter:'text'},
            {header: '불량유형', width:ENUM_WIDTH.L, name:'reject_type_nm', filter:'text'},
            {header: '불량명', width:ENUM_WIDTH.L, name:'reject_nm', filter:'text'},
            {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
            {header: '생산수량', width:ENUM_WIDTH.M, name:'total_qty', format:'number', filter:'number'},
            {header: '양품수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
            {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'reject':
        _columns = [
            {header: '작업일', width:ENUM_WIDTH.M,name:'reg_date',  filter:'text', format:'date'},
            {header: '불량 발생 공정', width:ENUM_WIDTH.M,name:'reject_proc_nm', filter:'text'},
            {header: '불량유형', width:ENUM_WIDTH.L, name:'reject_type_nm', filter:'text'},
            {header: '불량', width:ENUM_WIDTH.L, name:'reject_id', filter:'text', hidden : true},
            {header: '불량명', width:ENUM_WIDTH.L, name:'reject_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
            {header: '생산수량', width:ENUM_WIDTH.M, name:'total_qty', format:'number', filter:'number'},
            {header: '양품수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
            {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'proc':
      default:
        _columns = [
            {header: '작업일', width:ENUM_WIDTH.M,name:'reg_date',  filter:'text', format:'date'},
            {header: '불량 발생 공정', width:ENUM_WIDTH.M,name:'reject_proc_nm', filter:'text'},
            {header: '불량유형', width:ENUM_WIDTH.L, name:'reject_type_nm', filter:'text'},
            {header: '불량명', width:ENUM_WIDTH.L, name:'reject_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
            {header: '생산수량', width:ENUM_WIDTH.M, name:'total_qty', format:'number', filter:'number'},
            {header: '양품수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
            {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;
    }

    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'proc':
        _columns = [
          {header: '불량공정', width:ENUM_WIDTH.M,name:'reject_proc_uuid', filter:'text', hidden:true},
          {header: '불량 발생 공정', width:ENUM_WIDTH.M,name:'reject_proc_nm', filter:'text'},
          {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
        ];
        break;

      case 'prod':
        _columns = [
          {header: '품목', width:ENUM_WIDTH.M,name:'prod_uuid', filter:'text', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
        ];
        break;

      case 'reject':
        _columns = [
          {header: '불량UUID', width:ENUM_WIDTH.L, name:'reject_uuid', filter:'text', hidden:true},
          {header: '불량유형UUID', width:ENUM_WIDTH.L, name:'reject_type_uuid', filter:'text', hidden:true},
          {header: '불량유형', width:ENUM_WIDTH.L, name:'reject_type_nm', filter:'text'},
          {header: '불량명', width:ENUM_WIDTH.L, name:'reject_nm', filter:'text'},
          {header: '불량수량', width:ENUM_WIDTH.M, name:'reject_detail_qty', format:'number', filter:'number'},
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
      searchInfo.values?.sort_type === 'proc' ? '공정별'
      : searchInfo.values?.sort_type === 'prod' ? '품목별'
      : searchInfo.values?.sort_type === 'reject' ? '불량항목별'
      : ''
    );
  }, [searchInfo?.values]);
  
  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const setSubTotalDatas = (data:object[]) => {
    if (data?.length > 0) {
      const curculationColumnNames = ['reject_detail_qty'];
      const standardNames = (
        searchInfo.values?.sort_type === 'prod' ?
          ['prod_uuid', 'item_type_nm', 'prod_type_nm', 'prod_nm', 'prod_no']
        : searchInfo.values?.sort_type === 'proc' ?
          ['reject_proc_uuid', 'reject_proc_nm']
        : searchInfo.values?.sort_type === 'reject' ?
          ['reject_uuid', 'reject_nm', 'reject_type_uuid', 'reject_type_nm']
        : null
      );
      const subGridData = convDataToSubTotal(grid?.gridInfo?.data, {
        standardNames: standardNames,
        curculations: [
          {names: curculationColumnNames, type:'sum'},
        ],
      }).subTotals || [];

      subGrid.setGridData(subGridData);
    } else {
      subGrid.setGridData([]);
    };
  }
  
  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = ['start_date', 'end_date', 'sort_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);
    
    if (!values?.reg_date_chk) {
      delete searchParams['start_date'];
      delete searchParams['end_date'];
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