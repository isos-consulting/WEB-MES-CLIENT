import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { message } from 'antd';



/** 작업자관리 */
export const PgStdWorker = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/std/workers';
  const saveUriPath = '/std/workers';

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '작업자UUID', name:'worker_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '작업자코드', name:'worker_cd', width:ENUM_WIDTH.M, filter:'text', editable:true, requiredField:true},
    {header: '작업자명', name:'worker_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '공정UUID', name:'proc_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '공정코드', name:'proc_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '공정명', name:'proc_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true},
    {header: '작업장UUID', name:'workings_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '작업장코드', name:'workings_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '작업장명', name:'workings_nm', width:ENUM_WIDTH.L, filter:'text', editable: true, format:'popup'},
    {header: '사원UUID', name:'emp_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '사번', name:'emp_cd', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '사원명', name:'emp_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true},
    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 공정팝업
        columnNames: [
          {original:'proc_uuid', popup:'proc_uuid'},
          {original:'proc_cd', popup:'proc_cd'},
          {original:'proc_nm', popup:'proc_nm'},
        ],
        columns: [
          {header: '공정UUID', name:'proc_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '공정코드', name:'proc_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '공정명', name:'proc_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/procs',
          params: {}
        },
        gridMode:'select'
      },
      { // 작업장팝업
        columnNames: [
          {original:'workings_uuid', popup:'workings_uuid'},
          {original:'workings_cd', popup:'workings_cd'},
          {original:'workings_nm', popup:'workings_nm'},
        ],
        columns: [
          {header: '작업장UUID', name:'workings_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '작업장코드', name:'workings_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '작업장명', name:'workings_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/workingses',
          params: {}
        },
        gridMode:'select'
      },
      { // 사원팝업
        columnNames: [
          {original:'emp_uuid', popup:'emp_uuid'},
          {original:'emp_cd', popup:'emp_cd'},
          {original:'emp_nm', popup:'emp_nm'},
        ],
        columns: [
          {header: '사원UUID', name:'emp_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '사번', name:'emp_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '사원명', name:'emp_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/emps',
          params: {emp_status:'all'}
        },
        gridMode:'select'
      }
    ],
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    // const searchKeys = Object.keys(values);
    const searchParams = {};//cleanupKeyOfObject(values, searchKeys);

    let data = [];

    getData(searchParams, searchUriPath).then((res) => {
      data = res;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
      grid.setGridData(data);
    });
  };

  /** UPDATE / DELETE 저장 기능 */
  const onSave = () => {
    const {gridRef, setGridMode} = grid;
    const {columns, saveUriPath} = grid.gridInfo;
    
    dataGridEvents.onSave('basic', {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
        defaultGridMode,
      },inputInfo?.values, modal, () => onSearch(searchInfo?.values)
    );
  }

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
    },

    /** 수정 */
    update: () => {
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows?.length === 0) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },
    
    /** 신규 추가 */
    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },

    /** 저장 */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const {gridRef, setGridMode} = grid;
      const {columns} = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel
  };
  
  /** 템플릿에 전달할 값 */
  const props:ITpSingleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props, 
      onSearch
    }, 
    inputProps: null,  
    
    popupGridRef: [newDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfo: [newDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}