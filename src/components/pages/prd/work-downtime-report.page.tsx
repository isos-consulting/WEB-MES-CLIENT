import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';



/** 비가동현황 */
export const PgPrdWorkDowntimeReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/prd/work-downtimes/report';
  const saveUriPath = null;
  
  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });
  const subGrid = useGrid('SUB_GRID', [], {
    summaryOptions: {
      sumColumns: ['downtime'],
      textColumns: [
        {
          columnName: 'proc_nm',
          content: '합계',
        },
        {
            columnName: 'equip_nm',
            content: '합계',
        },
        {
            columnName: 'downtime_type_nm',
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
    {type:'daterange', id:'reg_date', ids:['start_reg_date', 'end_reg_date'], defaults:[getToday(), getToday()], label:'작업일', useCheckbox:true},

    {type:'radio', id:'sort_type', default:'none', label:'조회기준',
      options: [
        {code:'none', text:'없음'},
        {code:'proc', text:'공정별'},
        {code:'equip', text:'설비별'},
        {code:'downtime', text:'비가동별'},
      ]
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  const columns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sub_total_type) {

      case 'proc':
        _columns = [
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_id', filter:'text',hidden :true},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품목', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '비가동유형', width:ENUM_WIDTH.L, name:'downtime_type_nm', filter:'text'},
            {header: '비가동명', width:ENUM_WIDTH.L, name:'downtime_nm', filter:'text'},
            {header: '비가동 시작 일시', width:ENUM_WIDTH.M,name:'start_date',  filter:'text', format:'datetime'},
            {header: '비가동 종료 일시', width:ENUM_WIDTH.M,name:'end_date',  filter:'text', format:'datetime'},
            {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'equip':
        _columns = [
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_id', filter:'text', hidden :true},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품목', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '비가동유형', width:ENUM_WIDTH.L, name:'downtime_type_nm', filter:'text'},
            {header: '비가동명', width:ENUM_WIDTH.L, name:'downtime_nm', filter:'text'},
            {header: '비가동 시작 일시', width:ENUM_WIDTH.M,name:'start_date',  filter:'text', format:'datetime'},
            {header: '비가동 종료 일시', width:ENUM_WIDTH.M,name:'end_date',  filter:'text', format:'datetime'},
            {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'downtime':
        _columns = [
            {header: '비가동', width:ENUM_WIDTH.L, name:'downtime_id', filter:'text', hidden :true},
            {header: '비가동유형', width:ENUM_WIDTH.L, name:'downtime_type_nm', filter:'text'},
            {header: '비가동명', width:ENUM_WIDTH.L, name:'downtime_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품목', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '비가동 시작 일시', width:ENUM_WIDTH.M,name:'start_date',  filter:'text', format:'datetime'},
            {header: '비가동 종료 일시', width:ENUM_WIDTH.M,name:'end_date',  filter:'text', format:'datetime'},
            {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      default:
        _columns = [

            {header: '비가동유형', width:ENUM_WIDTH.L, name:'downtime_type_nm', filter:'text'},
            {header: '비가동명', width:ENUM_WIDTH.L, name:'downtime_nm', filter:'text'},
            {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
            {header: '작업장명', width:ENUM_WIDTH.M, name:'workings_nm', filter:'text'},
            {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
            {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
            {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
            {header: '품목', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
            {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
            {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
            {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
            {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
            {header: '비가동 시작 일시', width:ENUM_WIDTH.M,name:'start_date',  filter:'text', format:'datetime'},
            {header: '비가동 종료 일시', width:ENUM_WIDTH.M,name:'end_date',  filter:'text', format:'datetime'},
            {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
            {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;
    }

    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sub_total_type) {
      case 'proc':
        _columns = [
          {header: '공정', width:ENUM_WIDTH.M, name:'proc_nm', filter:'text'},
          {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
        ];
        break;

      case 'equip':
        _columns = [
          {header: '설비', width:ENUM_WIDTH.M, name:'equip_nm', filter:'text'},
          {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
        ];
        break;

      case 'downtime':
        _columns = [
          {header: '비가동유형', width:ENUM_WIDTH.L, name:'downtime_type_nm', filter:'text'},
          {header: '비가동명', width:ENUM_WIDTH.L, name:'downtime_nm', filter:'text'},
          {header: '비가동 시간(분)', width:ENUM_WIDTH.M,name:'downtime',  filter:'number', format:'number'},
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
      searchInfo.values?.sub_total_type === 'proc' ? '공정별'
      : searchInfo.values?.sub_total_type === 'equip' ? '설비별'
      : searchInfo.values?.sub_total_type === 'downtime' ? '비가동별'
      : ''
    );
  }, [searchInfo?.values]);

  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = ['start_reg_date', 'end_reg_date', 'sort_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);
    
    if (!values?.reg_date_chk) {
      delete searchParams['start_reg_date'];
      delete searchParams['end_reg_date'];
    }

    let data = [];
    let subTotalData = [];

    getData(searchParams, searchUriPath, 'raws').then((res) => {
      data = res;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
      grid.setGridData(data);
      subGrid.setGridData(subTotalData);
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