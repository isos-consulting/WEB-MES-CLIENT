// import React, { useCallback, useLayoutEffect, useReducer, useRef } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { TGridMode } from '~/components/UI/datagrid-new/datagrid.ui.type';
// import Grid from '@toast-ui/react-grid';
// import { useMemo } from 'react';
// import '~styles/grid.style.scss';
// import {singleGridEvents, singleGridReducer, createGridInit as defaultCreateGridInit, IInitialGridState} from '~/components/templates/grid-single-new';
// import { useLoadingState } from '~/hooks';
// import {TpSingleGrid} from '~components/templates/grid-single-new';
// import { IDatagridProps } from '~/components/UI/datagrid-new';
// import { FormikProps, FormikValues } from 'formik';
// import { useState } from 'react';
// import { getToday } from '~/functions';


// const { onSearch } = singleGridEvents;

// /** (detail) 페이지 그리드의 상태 초기값 */
// const gridStateInit:IInitialGridState = {
//   gridId: uuidv4(),
//   gridMode:'view' as TGridMode,
//   columns: [
//     {header: '제품입고아이디', name:'income_uuid', width:150, alias: 'uuid', filter:'text', format:'text', hidden:true},
//     {header: '입고일시', name:'reg_date', width:200, filter:'text', format:'date', requiredField:true},
//     {header: '품목아이디', name:'prod_uuid', filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '품번', name:'prod_no', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '품명', name:'prod_nm', width:150, filter:'text', format:'popup', hidden:false},
//     {header: '모델아이디', name:'model_uuid', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '모델코드', name:'model_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '모델명', name:'model_nm', width:150, filter:'text', format:'popup'},
//     {header: '리비전', name:'rev', width:100, filter:'text', format:'popup'},
//     {header: '규격', name:'prod_std', width:150, filter:'text', format:'popup'},
//     {header: '단위아이디', name:'unit_uuid', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '단위코드', name:'unit_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '단위명', name:'unit_nm', width:150, filter:'text', format:'popup'},

//     {header: 'LOT NO', name:'lot_no', width:150, filter:'text', format:'text', requiredField:true},
//     {header: '수량', name:'qty', width:150, filter:'text', format:'number', editable:true, requiredField:true},

//     {header: '출고창고아이디', name:'from_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '출고창고코드', name:'from_store_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '출고창고명', name:'from_store_nm', width:150, filter:'text', format:'popup'},

//     {header: '출고위치아이디', name:'from_location_uuid', width:150, filter:'text', format:'text', hidden:true},
//     {header: '출고위치코드', name:'from_location_cd', width:150, filter:'text', format:'text', hidden:true},
//     {header: '출고위치명', name:'from_location_nm', width:150, filter:'text', format:'text', hidden:true},

//     {header: '입고창고아이디', name:'to_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '입고창고코드', name:'to_store_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '입고창고명', name:'to_store_nm', width:150, filter:'text', format:'popup'},

//     {header: '입고위치아이디', name:'to_location_uuid', width:150, filter:'text', format:'text',  hidden:true},
//     {header: '입고위치코드', name:'to_location_cd', width:150, filter:'text', format:'text', hidden:true},
//     {header: '입고위치명', name:'to_location_nm', width:150, filter:'text', format:'text', hidden:true},

//     {header: '비고', name:'remark', width:200, filter:'text', format:'text' },

//     {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
//     {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
//   ],
//   data: [],
//   searchItems: [
//     {type:'date', id:'start_date', default:getToday(), label:'기준일'},
//     {type:'date', id:'end_date', default:getToday()}
//   ],
//   searchParams: {},
//   searchUriPath:'/sal/incomes',
//   saveUriPath:'/sal/incomes',
//   //페이지 그리드 팝업 
//   gridPopupInfo: [
//     {
//       columnNames: [
//         {original:'prod_uuid', popup:'prod_uuid'},
//         {original:'prod_no', popup:'prod_no'},
//         {original:'prod_nm', popup:'prod_nm'},
//         {original:'model_nm', popup:'model_nm'},
//         {original:'rev', popup:'rev'},
//         {original:'prod_std', popup:'prod_std'},
//         {original:'unit_nm', popup:'unit_nm'},
//       ],
//       columns: [
//         {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true},
//         {header: '품번', name:'prod_no', width:150, format:'text', hidden:true},
//         {header: '품명', name:'prod_nm', width:200, format:'text'},
//         {header: '모델명', name:'model_nm', width:200, format:'text'},
//         {header: 'rev', name:'rev', width:200, format:'text'},
//         {header: '규격', name:'prod_std', width:200, format:'text', hidden:true},
//         {header: '단위명', name:'unit_nm', width:200, format:'text'},
//       ],
//       dataApiSettings: {
//         uriPath: '/std/prods',
//         params: {}
//       },
//       gridMode:'select'
//     },
//     {
//       columnNames: [
//         {original:'from_store_uuid', popup:'from_store_uuid'},
//         {original:'from_store_cd', popup:'from_store_cd'},
//         {original:'from_store_nm', popup:'from_store_nm'},
//       ],
//       columns: [
//         {header: '출고창고UUID', name:'from_store_uuid', width:150, format:'text', hidden:true},
//         {header: '출고창고코드', name:'from_store_cd', width:150, format:'text', hidden:true},
//         {header: '출고창고명', name:'from_store_nm', width:200, format:'text'},
//       ],
//       dataApiSettings: {
//         uriPath: '/std/stores',
//         params: {store_type:'available'}
//       },
//       gridMode:'select'
//     },
//     {
//       columnNames: [
//         {original:'to_store_uuid', popup:'store_uuid'},
//         {original:'to_store_cd', popup:'store_cd'},
//         {original:'to_store_nm', popup:'store_nm'},
//       ],
//       columns: [
//         {header: '입고창고UUID', name:'to_store_uuid', width:150, format:'text', hidden:true},
//         {header: '입고창고코드', name:'to_store_cd', width:150, format:'text', hidden:true},
//         {header: '입고창고명', name:'to_store_nm', width:200, format:'text'},
//       ],
//       dataApiSettings: {
//         uriPath: '/std/stores',
//         params: {store_type:'available'}
//       },
//       gridMode:'select'
//     }
//   ]
// };


// /** 신규 생성 팝업 그리드의 상태 초기값 */
// const createGridInit = {
//   ...defaultCreateGridInit,
//   columns: gridStateInit.columns,
//   gridComboInfo: gridStateInit.gridComboInfo
// };


// /** 재고이동관리 */
// export const PgSalIncome = () => {
//   const [gridState, dispatch] = useReducer(singleGridReducer, gridStateInit);
//   const [createGridState] = useReducer(singleGridReducer, createGridInit);
//   const [,setLoading] = useLoadingState();
//   const [AUTO_SEARCH_FLAG, SET_AUTO_SEARCH_FLAG] = useState(false);


//   // 그리드의 reference
//   const gridRef = useRef<Grid>();
//   const createPopupGridRef = useRef<Grid>();

//   const searchRef = useRef<FormikProps<FormikValues>>();
//   const searchParams = searchRef.current?.values;


//   /** 그리드 관련 세팅 */
//   const gridItems = useMemo<IDatagridProps>(() => { 
//     return {...gridState}
//   }, [gridState]) ;


//   /** 모드가 변경되면 그리드를 새로 로드 합니다. (view일때만 새로 로드) */
//   useLayoutEffect(() => {
//     if (gridState.gridMode === 'view' && AUTO_SEARCH_FLAG === true) {
//       onSearch(gridRef, dispatch, gridState.searchUriPath, searchParams, gridState.columns, setLoading);
//     }
//   }, [gridState.gridMode]);


//   /** 그리드 데이터 변경 */
//   const setData = useCallback(
//     (data:any) => {
//       dispatch({type:'setData', data:data})
//     },
//     [dispatch],
//   );

  
//   return (
//     <TpSingleGrid
//       createPopupGridItems={createGridState}
//       createPopupGridRef={createPopupGridRef}
//       gridDispatch={dispatch}
//       gridItems={gridItems}
//       gridRef={gridRef}
//       parentGridRef={createPopupGridRef}
//       saveUriPath={gridState.saveUriPath}
//       searchParams={gridState.searchParams}
//       searchProps={{
//         id:'search',
//         searchItems:gridState.searchItems,
//         innerRef: searchRef,
//         onSearch: (values) => {
//           onSearch(gridRef, dispatch, gridState.searchUriPath, searchParams, gridState.columns, setLoading);
//           SET_AUTO_SEARCH_FLAG(true);
//         }
//       }}
//       searchUriPath={gridState.searchUriPath}
//       setParentData={setData}
//     />
//   );
// };

import React from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';



/** 제품입고 */
export const PgSalIncome = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/sal/incomes';
  const saveUriPath = '/sal/incomes';

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '제품입고아이디', name:'income_uuid', width:ENUM_WIDTH.M, alias: 'uuid', filter:'text', format:'text', hidden:true},
    {header: '입고일시', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', format:'date', requiredField:true},
    {header: '품목아이디', name:'prod_uuid', filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:false},
    {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup'},
    {header: '리비전', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'popup'},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, filter:'text', format:'popup'},
    {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup'},

    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text', requiredField:true},
    {header: '수량', name:'qty', width:ENUM_WIDTH.M, filter:'text', format:'number', editable:true, requiredField:true},

    {header: '출고창고아이디', name:'from_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '출고창고코드', name:'from_store_cd', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '출고창고명', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup'},

    {header: '출고위치아이디', name:'from_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출고위치코드', name:'from_location_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출고위치명', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},

    {header: '입고창고아이디', name:'to_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '입고창고코드', name:'to_store_cd', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '입고창고명', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup'},

    {header: '입고위치아이디', name:'to_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text',  hidden:true},
    {header: '입고위치코드', name:'to_location_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '입고위치명', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},

    {header: '비고', name:'remark', width:ENUM_WIDTH.L, filter:'text', format:'text' },
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });

  const [multiPopupDatas, setMultiPopupDatas] = useState<any[]>([]);

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns?.filter(el => el.name !== 'reg_date'),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      rowAddPopupInfo: {
        columnNames: [
          {original:'prod_uuid', popup:'prod_uuid'},
          {original:'item_type_uuid', popup:'item_type_uuid'},
          {original:'item_type_nm', popup:'item_type_nm'},
          {original:'prod_type_uuid', popup:'prod_type_uuid'},
          {original:'prod_type_nm', popup:'prod_type_nm'},
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
        columns: [
          {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
          {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
          {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, format:'text'},
          {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
          {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, format:'text'},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text', hidden:true},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text'},
          {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, format:'text'},
          {header: 'rev', name:'rev', width:ENUM_WIDTH.M, format:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, format:'text', hidden:true},
          {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, format:'text'},
          {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.L, format:'text', hidden:true},
          {header: '창고', name:'store_nm', width:ENUM_WIDTH.M, format:'text'},
          {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, format:'text', hidden:true},
          {header: '위치', name:'location_nm', width:ENUM_WIDTH.M, format:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, format:'text'},
          {header: '재고', name:'qty', width:ENUM_WIDTH.M, format:'number'},
        ],
        dataApiSettings: (ev) => {
          const params = {
            stock_type: 'all',
            grouped_type: 'all',
            price_type: 'all',
          };

          if (newDataPopupGridVisible) {
            // params['stock_type'] = newDataPopupInputInfo.values?.stock_type;
            params['reg_date'] = newDataPopupInputInfo.values?.reg_date;

          } else if (setEditDataPopupGridVisible) {
            // params['stock_type'] = editDataPopupInputInfo.values?.stock_type;
            params['reg_date'] = editDataPopupInputInfo.values?.reg_date;
          }

          return {
            uriPath: '/inv/stores/stocks',
            params,
          }
        },
        gridMode:'multi-select'
      },
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(), getToday()], label:'입고일'},
    // {type:'date', id:'end_date', default:getToday()}
  ]);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    {type:'date', id:'reg_date', label:'입고일', default:getToday()},
  ]);
  const editDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', newDataPopupInputInfo?.props?.inputItems);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

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
    popupGridInfo: [
      {
        ...newDataPopupGrid.gridInfo,
        saveParams: newDataPopupInputInfo?.values
      },
      editDataPopupGrid.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}