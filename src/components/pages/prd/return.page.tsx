import React from 'react';
import { useState } from "react";
import { getPopupForm, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import dayjs from 'dayjs';



/** 자재반납 */
export const PgPrdReturn = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/prd/returns';
  const saveUriPath = '/prd/returns';
  const STORE_POPUP = getPopupForm('창고관리');
  const STOCK_POPUP = getPopupForm('재고관리');

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '자재반납아이디', name:'return_uuid', alias: 'uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '반납일', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', format:'date', editable:true, requiredField:true},
    {header: '품목아이디', name:'prod_uuid', format:'text', hidden:true, requiredField: true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'popup', filter:'text', hidden:true, editable:true, requiredField: true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', hidden:false, editable:true, requiredField: true},
    {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '리비전', name:'rev', width:ENUM_WIDTH.S, format:'popup', editable:true},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, format:'popup', editable:true},
    {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, format:'popup', editable:true},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, format:'popup', editable:true, requiredField:true},
    {header: '수량', name:'qty', width:ENUM_WIDTH.S, format:'number', editable:true, requiredField:true},

    {header: '출고창고아이디', name:'from_store_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true, requiredField: true},
    {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.M, format:'popup', requiredField: true},

    {header: '출고위치아이디', name:'from_location_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.M, format:'popup'},

    {header: '입고창고아이디', name:'to_store_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true, requiredField: true},
    {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.M, format:'combo', editable:true, requiredField: true},

    {header: '입고위치아이디', name:'to_location_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.M, format:'combo', editable:true},

    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, format:'text', editable:true },
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 가용창고재고 조회
        columnNames: [
          {original:'prod_uuid', popup:'prod_uuid'},
          {original:'prod_no', popup:'prod_no'},
          {original:'prod_nm', popup:'prod_nm'},
          {original:'model_nm', popup:'model_nm'},
          {original:'rev', popup:'rev'},
          {original:'prod_std', popup:'prod_std'},
          {original:'unit_uuid', popup:'unit_uuid'},
          {original:'unit_nm', popup:'unit_nm'},
          {original:'lot_no', popup:'lot_no'},
          {original:'qty', popup:'qty'},
          {original:'from_store_uuid', popup:'store_uuid'},
          {original:'from_store_nm', popup:'store_nm'},
          {original:'from_location_uuid', popup:'location_uuid'},
          {original:'from_location_nm', popup:'location_nm'},
        ],
        columns: STORE_POPUP.datagridProps.columns,
        dataApiSettings: () => {

          const reg_date = searchInfo?.values;
          
          return {
            uriPath: STORE_POPUP.uriPath,
            params: {
              stock_type: 'available',
              grouped_type: 'all',
              price_type: 'all',
              reg_date,
            }
          };
        },
        gridMode:'select',
      },
      { // 입고창고 콤보박스
        columnNames: [
          {original:'to_store_uuid', popup:'store_uuid'},
          {original:'to_store_nm', popup:'store_nm'},
        ],
        dataApiSettings: {
          uriPath: '/std/stores',
          params: {
            store_type: 'available'
          }
        },
        gridMode: 'select',
      },
      { // 입고위치 콤보박스
        columnNames: [
          {original:'to_location_uuid', popup:'location_uuid'},
          {original:'to_location_nm', popup:'location_nm'},
        ],
        dataApiSettings: {
          uriPath: '/std/locations',
          params: {}
        },
        gridMode: 'select',
      },
    ],
    rowAddPopupInfo: {
      columnNames: [
        {original:'reg_date', popup:'reg_date'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'store_uuid', popup:'store_uuid'},
        {original:'store_nm', popup:'store_nm'},
        {original:'location_uuid', popup:'location_uuid'},
        {original:'location_nm', popup:'location_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: STOCK_POPUP.datagridProps.columns,
      gridMode: 'multi-select',
      dataApiSettings: {
        uriPath: STOCK_POPUP.uriPath,
        params: STOCK_POPUP.params,
      }
    }
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
      rowAddPopupInfo: grid?.gridInfo?.rowAddPopupInfo,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
      rowAddPopupInfo: grid?.gridInfo?.rowAddPopupInfo,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(-7), getToday()], label:'출고일'},
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', [
    {type:'date', id:'reg_date', default:getToday(), label:'기준일'},
    {
      type:'combo', id:'store_uuid', default:'all', label:'조회창고', firstItemType:'all',
      dataSettingOptions: {
        uriPath: '/std/stores',
        params: {
          store_type: 'available',
        },
        codeName: 'store_uuid',
        textName: 'store_nm',
      }
    }
  ]);
  const editDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', newDataPopupInputInfo?.inputItems);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    // const searchKeys = Object.keys(values);
    const searchParams = cleanupKeyOfObject(searchInfo.values, searchInfo.searchItemKeys);

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