import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_MLD } from '~/enums';

/** 그룹 관리 */
export const PgMldMoldReport = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = URL_PATH_MLD.REPORT.GET.REPORT;
  const saveUriPath = null;

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'date', id: 'reg_date', default: getToday(), label: '기준일자'},
  ]);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '금형UUID', name:'mold_uuid', alias:'uuid', width:150, filter:'text', hidden:true},
    {header: '금형명', name:'mold_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '금형번호', name:'mold_no', width:ENUM_WIDTH.L, filter:'text'},
    {header: 'cavity [A]', name:'cavity', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '보증타수 [B]', name:'guarantee_cnt', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '기초타수 [C]', name:'basic_cnt', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '생산타수 [D]', name:'work_cnt', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '누적 생산타수 [E≒C+D]', name:'accumulated_cnt', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '잔여타수 [F=B-E]', name:'remained_cnt', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '보증수량 [G=A*B]', name:'guarantee_qty', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '기초수량 [H=A*C]', name:'basic_qty', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '생산수량 [I]', name:'work_qty', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '잔여수량 [J=G-(H+I)]', name:'remained_qty', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '타수율 [(H+I)/G]', name:'mold_rate', width:ENUM_WIDTH.M,  format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    disabledAutoDateColumn: true,
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = Object.keys(values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);
    
    searchParams['use_fg'] = true;
    
    let data = [];

    getData(searchParams, searchUriPath).then((res) => {
      data = res;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
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