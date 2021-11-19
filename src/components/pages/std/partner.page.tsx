import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { message } from 'antd';


/** 거래처관리 */
export const PgStdPartner = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/std/partners';
  const saveUriPath = '/std/partners';

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '거래처유형UUID', name:'partner_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '거래처유형코드', name:'partner_type_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true },
    {header: '거래처유형명', name:'partner_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '거래처UUID', name:'partner_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '거래처코드', name:'partner_cd', width:ENUM_WIDTH.M, filter:'text', editable:true, requiredField:true},
    {header: '거래처명', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '거래처번호', name:'partner_no', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '대표자', name:'boss_nm', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '관리자', name:'manager', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '이메일', name:'email', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '연락처', name:'tel', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '팩스', name:'fax', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '우편번호', name:'post', width:ENUM_WIDTH.M, filter:'text', editable:true},
    {header: '주소', name:'addr', width:ENUM_WIDTH.XL, filter:'text', editable:true},
    {header: '상세주소', name:'addr_detail', width:ENUM_WIDTH.XL, filter:'text', editable:true},
    {header: '사용구분', name:'use_fg', width:ENUM_WIDTH.M, format:'check', editable:true, requiredField:true, defaultValue: true},
    {header: '협력사구분', name:'vendor_fg', width:ENUM_WIDTH.M, format:'check', editable:true, requiredField:true },
    {header: '고객사구분', name:'customer_fg', width:ENUM_WIDTH.M, editable:true, format:'check', requiredField:true},
    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 거래처유형 팝업
        columnNames: [
          {original:'partner_type_uuid', popup:'partner_type_uuid'},
          {original:'partner_type_cd', popup:'partner_type_cd'},
          {original:'partner_type_nm', popup:'partner_type_nm'},
        ],
        columns: [
          {header: '거래처유형UUID', name:'partner_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처유형코드', name:'partner_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '거래처유형명', name:'partner_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/partner-types',
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
    // const searchKeys = Object.keys(searchInfo.values);
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