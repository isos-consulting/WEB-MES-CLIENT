import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH, URL_PATH_AUT } from '~/enums';


/** 그룹 관리 */
export const PgAutMenu = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = URL_PATH_AUT.MENU.GET.MENUS;
  const saveUriPath = URL_PATH_AUT.MENU.PUT.MENUS;

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '메뉴UUID', name:'menu_uuid', alias:'uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '메뉴명', name:'menu_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '메뉴유형UUID', name:'menu_type_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true, requiredField:true},
    {header: '메뉴유형', name:'menu_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '메뉴URL', name:'menu_uri', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '컴포넌트명', name:'component_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '아이콘', name:'icon', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '사용', name:'use_fg', width:ENUM_WIDTH.S, format:'check', editable:true, requiredField:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    treeColumnOptions: {
      name: 'menu_nm',
      useIcon: true,
      useCascadingCheckbox: true
    }
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
      treeColumnOptions: {
        name: 'menu_nm',
        useIcon: true,
        useCascadingCheckbox: true
      }
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

    // const dataS = [
    //   {
    //     menu_nm: 'foo',
    //     menu_type_nm: 'bar',
    //     _attributes: {
    //       expanded: true // default: false
    //     },
    //     _children: [
    //       {
    //         menu_nm: 'baz',
    //         menu_type_nm: 'qux',
    //         _children: [
    //           {
    //             menu_nm: 'baz',
    //             menu_type_nm: 'qux'
    //           },
    //           // ...,
    //         ]
    //       },
    //       // ...,
    //     ]
    //   },
    //   // ...,
    // ];
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