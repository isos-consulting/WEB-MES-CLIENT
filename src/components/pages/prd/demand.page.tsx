import React from 'react';
import { useState } from "react";
import { getPopupForm, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { checkGridData, cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday, saveGridData } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';


/** 자재출고요청관리 */
export const PgPrdDemand = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/prd/demands';
  const saveUriPath = '/prd/demands';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const PROD_POPUP = getPopupForm('품목관리2');


  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header:'자재출고요청UUID', name:'demand_uuid', alias:'uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'요청일', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text', defaultValue: getToday()},
    {header:'완료상태', name:'complete_state', width:ENUM_WIDTH.S, filter:'text', hiddenCondition: (props) => props?.gridMode !== 'delete'},
    {header:'완료', name:'complete_fg', width:ENUM_WIDTH.S, format:'check', filter:'text', editable:true, hiddenCondition: (props) => props?.gridMode === 'delete'},
    {header:'요청부서UUID', name:'dept_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'요청부서', name:'dept_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'요청유형UUID', name:'demand_type_cd', width:ENUM_WIDTH.M, hidden:true},
    {header:'요청유형', name:'demand_type_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
    {header:'품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
    {header:'품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', requiredField:true},
    {header:'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
    {header:'제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'모델UUID', name:'model_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'모델', name:'model_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.M, filter:'text'},
    {header:'단위UUID', name:'unit_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'단위', name:'unit_nm', width:ENUM_WIDTH.S, filter:'text'},
    {header:'수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number', editable:true, requiredField:true},
    {header:'납기일자', name:'due_date', width:ENUM_WIDTH.M, format:'date', filter:'text', editable:true},
    {header:'투입설비UUID', name:'equip_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'투입설비', name:'equip_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'투입공정UUID', name:'proc_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'투입공정', name:'proc_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'입고창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'입고요청창고', name:'to_store_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
    {header:'입고위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'입고요청위치', name:'to_location_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'비고', name:'remark', width:ENUM_WIDTH.L, filter:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 입고창고 팝업
        columnNames: [
          {original:'to_store_uuid', popup:'store_uuid'},
          {original:'to_store_nm', popup:'store_nm'},
        ],
        columns: STORE_POPUP.datagridProps?.columns,
        dataApiSettings: {
          uriPath: STORE_POPUP.uriPath,
          params: {
            store_type: 'all',
          }
        },
        gridMode: 'select',
      },
      { // 입고위치 팝업
        columnNames: [
          {original:'to_location_uuid', popup:'location_uuid'},
          {original:'to_location_nm', popup:'location_nm'},
        ],
        columns: LOCATION_POPUP.datagridProps?.columns,
        dataApiSettings: {
          uriPath: LOCATION_POPUP.uriPath,
          params: {}
        },
        gridMode: 'select',
      },
      { // 요청부서 팝업
        columnNames: [
          {original:'dept_uuid', popup:'dept_uuid'},
          {original:'dept_nm', popup:'dept_nm'},
        ],
        columns: [
          {header:'요청부서UUID', name:'dept_uuid', hidden:true},
          {header:'요청부서', name:'dept_nm', filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/depts',
          params: {}
        },
        gridMode: 'select',
      },
      { // 유형유형 팝업
        columnNames: [
          {original:'demand_type_cd', popup:'demand_type_cd'},
          {original:'demand_type_nm', popup:'demand_type_nm'},
        ],
        columns: [
          {header:'요청유형코드', name:'demand_type_cd', hidden:true},
          {header:'요청유형', name:'demand_type_nm', filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/adm/demand-types',
          params: {}
        },
        gridMode: 'select',
      },
      { // 투입설비 팝업
        columnNames: [
          {original:'equip_uuid', popup:'equip_uuid'},
          {original:'equip_nm', popup:'equip_nm'},
        ],
        columns: [
          {header:'투입설비UUID', name:'equip_uuid', hidden:true},
          {header:'투입설비', name:'equip_nm', filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/equips',
          params: {}
        },
        gridMode: 'select',
      },
      { // 투입공정 팝업
        columnNames: [
          {original:'proc_uuid', popup:'proc_uuid'},
          {original:'proc_nm', popup:'proc_nm'},
        ],
        columns: [
          {header:'투입공정UUID', name:'proc_uuid', hidden:true},
          {header:'투입공정', name:'proc_nm', filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/procs',
          params: {}
        },
        gridMode: 'select',
      },
    ],
    rowAddPopupInfo: {
      columnNames: [
        {original:'reg_date', popup:'reg_date'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'safe_stock', popup:'safe_stock'},
        {original:'unit_qty', popup:'unit_qty'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_location_uuid', popup:'location_uuid'},
        {original:'from_location_nm', popup:'location_nm'},
        {original:'qty', popup:'qty'},
      ],
      columns: PROD_POPUP.datagridProps?.columns,
      dataApiSettings: {
        uriPath: PROD_POPUP.uriPath,
        params: PROD_POPUP.params,
      },
      gridMode: 'multi-select',
    },
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    cloneObject(grid.gridInfo.columns)?.map((el) => {
      if (!['qty', 'complete_fg'].includes(el?.name))
        el['editable'] = false;
        
      return el;
    }),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], label:'요청일', defaults:[getToday(-7), getToday()]},
  ]);
  

  /** 액션 관리 */


  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null;//useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null;//useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);


  /** 검색 */
  const onSearch = (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

    let data = [];

    getData({
      ...searchParams,
      complete_state: 'all',
    }, searchUriPath).then((res) => {
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

  const onAfterEditSave = async (isSuccess:boolean, savedData?:any[]) => {
    if (isSuccess) {
      const gridRef = editDataPopupGrid?.gridRef;
      const columns = editDataPopupGrid?.gridInfo?.columns;
      const modifiedRows = await getModifiedRows(gridRef, columns);
      const saveUriPath = '/prd/demands/complete';

      // 저장 가능한지 체크
      const chk:boolean = await checkGridData(columns, modifiedRows);

      if (chk === false) return;

      // 완료상태 따로 저장
      saveGridData(modifiedRows, columns, saveUriPath, {}, true).then((result) => {
        const {success, count, savedData} = result;
        if (success === false) return;

        setEditDataPopupGridVisible(false);
        onSearch(searchInfo?.values);

      }).catch((e) => {
        console.log('Error', e);
      });
    }
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

    onPopupAfterOk: [null, onAfterEditSave],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}