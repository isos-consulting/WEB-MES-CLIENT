import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { message } from 'antd';



/** 검사항목관리 */
export const PgStdInspItem = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/std/insp-items';
  const saveUriPath = '/std/insp-items';

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '검사항목UUID', name:'insp_item_uuid', alias:'uuid', width:ENUM_WIDTH.L, editable:true, hidden:true},
    {header: '검사항목 유형UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.L, editable:true, hidden:true},
    {header: '검사항목 유형명', name:'insp_item_type_nm', width:ENUM_WIDTH.L, format:'popup', filter:'text', editable:true, requiredField:true},
    {header: '검사항목코드', name:'insp_item_cd', width:ENUM_WIDTH.M, editable:true, requiredField:true},
    {header: '검사항목명', name:'insp_item_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.L, editable:true, hidden:true},
    {header: '검사구명', name:'insp_tool_nm', width:ENUM_WIDTH.L, format:'popup', filter:'text', editable:true},
    {header: '검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.L, editable:true, hidden:true},
    {header: '검사방법명', name:'insp_method_nm', width:ENUM_WIDTH.L, format:'popup', filter:'text', editable:true},
    {header: '품질검사', name:'eqm_fg', width:ENUM_WIDTH.M, format:'check', editable:true},
    {header: '설비검사', name:'qms_fg', width:ENUM_WIDTH.M, format:'check', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 검사항목유형 팝업
        columnNames: [
          {original:'insp_item_type_uuid', popup:'insp_item_type_uuid'},
          {original:'insp_item_type_cd', popup:'insp_item_type_cd'},
          {original:'insp_item_type_nm', popup:'insp_item_type_nm'},
        ],
        columns: [
          {header: '검사항목유형UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '검사항목유형코드', name:'insp_item_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '검사항목유형명', name:'insp_item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/insp-item-types',
          params: null
        },
        gridMode:'select',
        
      },
      { // 검사구 팝업
        columnNames: [
          {original:'insp_tool_uuid', popup:'insp_tool_uuid'},
          {original:'insp_tool_cd', popup:'insp_tool_cd'},
          {original:'insp_tool_nm', popup:'insp_tool_nm'},
        ],
        columns: [
          {header: '검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '검사구코드', name:'insp_tool_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '검사구명', name:'insp_tool_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/insp-tools',
          params: null
        },
        gridMode:'select',
        
      },
      { // 검사방법 팝업
        columnNames: [
          {original:'insp_method_uuid', popup:'insp_method_uuid'},
          {original:'insp_method_cd', popup:'insp_method_cd'},
          {original:'insp_method_nm', popup:'insp_method_nm'},
        ],
        columns: [
          {header: '검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '검사방법코드', name:'insp_method_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '검사방법명', name:'insp_method_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/insp-methods',
          params: null
        },
        gridMode:'select',
        
      },
    ],
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
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
    const searchParams = {type:'all'}; //cleanupKeyOfObject(values, searchKeys);

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