import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { message } from 'antd';



/** 품목관리 */
export const PgStdProd = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/std/prods';
  const saveUriPath = '/std/prods';

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '품목UUID', name:'prod_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '품목명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true, hidden:true},
    {header: '품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup', requiredField:true},
    {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '리비전', name:'rev', width:ENUM_WIDTH.S, filter:'text', editable:true, requiredField:true},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true, hidden:true},
    {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup', requiredField:true},
    {header: 'LOT 사용여부', name:'lot_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '사용여부', name:'use_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '품목활성상태', name:'active_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: 'BOM유형uuid', name:'bom_type_uuid', width:ENUM_WIDTH.M, filter:'text', editable:true, format:'popup', hidden:true},
    {header: 'BOM유형코드', name:'bom_type_cd', width:ENUM_WIDTH.M, filter:'text', editable:true, format:'popup', hidden:true},
    {header: 'BOM유형명', name:'bom_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '구매주문가능여부', name:'mat_order_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '발주최소수량', name:'mat_order_min_qty', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '발주소요일', name:'mat_supply_days', width:ENUM_WIDTH.S, editable:true, filter:'number', format:'number'},
    {header: '재고관리여부', name:'inv_use_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '포장단위수량', name:'inv_package_qty', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '안전재고수량', name:'inv_safe_qty', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '입고창고UUID', name:'inv_to_store_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '입고창고', name:'inv_to_store_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '입고위치UUID', name:'inv_to_location_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '입고위치', name:'inv_to_location_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '고객주문가능여부', name:'sal_order_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '수입검사여부', name:'qms_receive_insp_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '공정검사여부', name:'qms_proc_insp_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '최종검사여부', name:'qms_final_insp_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '계획유형UUID', name:'prd_plan_type_uuid', width:ENUM_WIDTH.M, filter:'text', editable:true, hidden:true},
    {header: '계획유형코드', name:'prd_plan_type_cd', width:ENUM_WIDTH.M, filter:'text', editable:true, format:'popup', hidden:true},
    {header: '계획유형명(MPS/MRP)', name:'prd_plan_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '생산품여부', name:'prd_active_fg', width:ENUM_WIDTH.XS, editable:true, format:'check', requiredField:true},
    {header: '생산최소수량', name:'prd_min', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '생산최대수량', name:'prd_max', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '폭', name:'width', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '길이', name:'length', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '높이', name:'height', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '중량', name:'weight', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '두께', name:'thickness', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '재질', name:'material', width:ENUM_WIDTH.M, filter:'text', editable:true},
    {header: '색상', name:'color', width:ENUM_WIDTH.M, filter:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    header: {
      complexColumns: [
        {
          header: '공통',
          name: '_prod_group',
          childNames: ['prod_no', 'prod_nm', 'item_type_nm', 'prod_type_nm', 'model_nm', 'rev', 'prod_std', 'unit_nm', 'lot_fg', 'use_fg', 'active_fg', 'bom_type_cd', 'bom_type_nm']
        },
        {
          header: '자재/구매',
          name: '_mat_order_group',
          childNames: ['mat_order_fg', 'mat_order_min_qty', 'mat_supply_days']
        },
        {
          header: '재고',
          name: '_stock_group',
          childNames: ['inv_use_fg', 'inv_safe_qty', 'inv_package_qty', 'inv_to_store_nm', 'location_nm']
        },
        {
          header: '영업',
          name: '_sal_group',
          childNames: ['sal_order_fg']
        },
        {
          header: '품질',
          name: '_qms_group',
          childNames: ['qms_receive_insp_fg', 'qms_proc_insp_fg', 'qms_final_insp_fg']
        },
        {
          header: '생산',
          name: '_prd_group',
          childNames: ['prd_plan_type_cd', 'prd_plan_type_nm', 'prd_active_fg', 'prd_min', 'prd_max']
        },
      ]
    },
    gridPopupInfo: [
      { // 품목유형팝업
        columnNames: [
          {original:'item_type_uuid', popup:'item_type_uuid'},
          {original:'item_type_cd', popup:'item_type_cd'},
          {original:'item_type_nm', popup:'item_type_nm'},
        ],
        columns: [
          {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '품목유형코드', name:'item_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/item-types',
          params: {}
        },
        gridMode:'select'
      },
      { // 제품유형팝업
        columnNames: [
          {original:'prod_type_uuid', popup:'prod_type_uuid'},
          {original:'prod_type_cd', popup:'prod_type_cd'},
          {original:'prod_type_nm', popup:'prod_type_nm'},
        ],
        columns: [
          {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '제품유형코드', name:'prod_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/prod-types',
          params: {}
        },
        gridMode:'select'
      },
      { // 모델팝업
        columnNames: [
          {original:'model_uuid', popup:'model_uuid'},
          {original:'model_cd', popup:'model_cd'},
          {original:'model_nm', popup:'model_nm'},
        ],
        columns: [
          {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/models',
          params: {}
        },
        gridMode:'select'
      },
      { // 단위팝업
        columnNames: [
          {original:'unit_uuid', popup:'unit_uuid'},
          {original:'unit_cd', popup:'unit_cd'},
          {original:'unit_nm', popup:'unit_nm'},
        ],
        columns: [
          {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/units',
          params: {}
        },
        gridMode:'select'
      },
      { // BOM유형팝업
        columnNames: [
          {original:'bom_type_uuid', popup:'bom_type_uuid'},
          {original:'bom_type_cd', popup:'bom_type_cd'},
          {original:'bom_type_nm', popup:'bom_type_nm'},
        ],
        columns: [
          {header: 'BOM유형UUID', name:'bom_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
          {header: 'BOM유형코드', name:'bom_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: 'BOM유형명', name:'bom_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/adm/bom-types',
          params: {}
        },
        gridMode:'select'
      },
      { // 계획유형(MPS/MRP)팝업
        columnNames: [
          {original:'prd_plan_type_uuid', popup:'prd_plan_type_uuid'},
          {original:'prd_plan_type_cd', popup:'prd_plan_type_cd'},
          {original:'prd_plan_type_nm', popup:'prd_plan_type_nm'},
        ],
        columns: [
          {header: '계획유형UUID', name:'prd_plan_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
          {header: '계획유형코드', name:'prd_plan_type_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '계획유형명(MPS/MRP)', name:'prd_plan_type_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/adm/prd-plan-types',
          params: {}
        },
        gridMode:'select'
      },
      { // 창고팝업
        columnNames: [
          {original:'inv_to_store_uuid', popup:'store_uuid'},
          {original:'inv_to_store_cd', popup:'store_cd'},
          {original:'inv_to_store_nm', popup:'store_nm'},
        ],
        columns: [
          {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '창고코드', name:'store_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '창고명', name:'store_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: {
          uriPath: '/std/stores',
          params: {store_type:'available'}
        },
        gridMode:'select'
      },
      { // 위치팝업
        columnNames: [
          {original:'inv_to_location_uuid', popup:'location_uuid'},
          {original:'inv_to_location_cd', popup:'location_cd'},
          {original:'inv_to_location_nm', popup:'location_nm'},
        ],
        columns: [
          {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: (ev) => {
          const {rowKey, instance} = ev;
          const {rawData} = instance?.store?.data;
      
          const storeUuid = rawData[rowKey]?.inv_to_store_uuid
          return {
            uriPath: '/std/locations',
            params: {store_uuid: storeUuid ?? ''}
          }
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
      header: grid.gridInfo?.header,
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      header: grid.gridInfo?.header,
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