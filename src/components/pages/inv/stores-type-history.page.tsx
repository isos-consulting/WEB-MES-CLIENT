import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { IGridColumn, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { OptComplexColumnInfo } from 'tui-grid/types/options';

/** 유형별 수불부 */
export const PgInvStoresTypeHistory = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [tranTypes, setTranTypes] = useState([]);

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/inv/stores/type-history';
  const searchTransactionUriPath = '/adm/transactions';
  const saveUriPath = null;
  
  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    // header: {
    //   height: 60,
    //   complexColumns: [
    //     {
    //       header: 'test',
    //       name: '_test',
    //       childNames: ['prod_no', 'rev']
    //     }
    //   ]
    // }
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(-7), getToday()], label:'수불일'},
  ]);

  const columns:IGridColumn[] = useMemo(() => {
    let _columns:IGridColumn[] = [
      {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text'},
      {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text'},
      {header: '품번', width:ENUM_WIDTH.M, name:'prod_no', filter:'text'},
      {header: 'rev', width:ENUM_WIDTH.M, name:'rev', filter:'text'},
      {header: '품명', width:ENUM_WIDTH.M, name:'prod_nm', filter:'text'},
      {header: '모델', width:ENUM_WIDTH.M, name:'model_nm', filter:'text'},
      {header: '규격', width:ENUM_WIDTH.M, name:'prod_std', filter:'text'},
      {header: '단위', width:ENUM_WIDTH.M, name:'unit_nm', filter:'text'},
      {header: '불량명', width:ENUM_WIDTH.M, name:'reject_nm', filter:'text'},
      {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
      {header: '창고', width:ENUM_WIDTH.M, name:'store_nm', filter:'text'},
      {header: '위치', width:ENUM_WIDTH.M, name:'location_nm', filter:'text'},
    ];

    for (let i = 0; i <= tranTypes.length - 1 ; i++) {
      _columns.push({header:'입고', name:tranTypes[i]?.tran_cd +'_in_qty', width:ENUM_WIDTH.M, format:'number' });
      _columns.push({header:'출고', name:tranTypes[i]?.tran_cd +'_out_qty', width:ENUM_WIDTH.M, format:'number' });
    }
    return _columns;    
  }, [tranTypes]);

  const complexColumns:OptComplexColumnInfo[] = useMemo(() => {
    let _complexColumns:OptComplexColumnInfo[] = [];

    for (let i = 0; i <= tranTypes.length - 1 ; i++) {
      _complexColumns.push(
        {
          header:tranTypes[i]?.tran_nm, 
          name:'_'+tranTypes[i]?.tran_cd , 
          childNames:[tranTypes[i]?.tran_cd +'_in_qty', tranTypes[i]?.tran_cd +'_out_qty']
        }
      );
    }
    return _complexColumns;    
  }, [tranTypes]);

  /** 액션 관리 */
  useLayoutEffect(() => {
    grid?.setGridColumns(columns);
  }, [columns]);

  useLayoutEffect(() => { 
    if (complexColumns)
      grid?.setComplexColumns(complexColumns);
  }, [complexColumns]);

  useLayoutEffect(() => {
    getData(
      {}, 
      searchTransactionUriPath, 
      'raws'
    ).then((res) => {
      setTranTypes(res);
    });
  }, []);

  /** 검색 */
  const onSearch = (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInfo?.searchItemKeys);
    
    let data = [];

    getData(
      {
        ...searchParams,
        grouped_type:'all',
      }, 
      searchUriPath, 
      'raws'
    ).then((res) => {
      data = res;
    }).finally(() => {
      grid.setGridData(data);
    });
  };

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch();
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
    
    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [newDataPopupGrid?.gridInfo, editDataPopupGrid?.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}