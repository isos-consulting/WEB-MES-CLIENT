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
// import dayjs from 'dayjs';
// import { FormikProps, FormikValues } from 'formik';
// import { useState } from 'react';


// const { onSearch } = singleGridEvents;

// /** 페이지 그리드의 상태 초기값 */

// /** (header) 페이지 그리드의 상태 초기값 */
// const headerGridInit:IInitialGridState = {
//   gridId: uuidv4(),
//   gridMode:'view',
//   columns: [],
//   data: [],
//   searchItems: [
//     {type:'date', id:'start_date', default:dayjs().format('YYYY-MM-DD'), label:'기준일'},
//     {type:'date', id:'end_date', default:dayjs().format('YYYY-MM-DD')}
//   ],
//   searchParams:{
//     complete_state: 'all'
//   },
//   searchUriPath:'/sal/releases',
//   saveUriPath:'/sal/releases',
// };

// /** (detail) 페이지 그리드의 상태 초기값 */
// const gridStateInit:IInitialGridState = {
//   gridId: uuidv4(),
//   gridMode:'view' as TGridMode,
//   columns: [
//     {header: '제품출고아이디', name:'release_uuid', width:150, alias: 'uuid', filter:'text', format:'text', hidden:true},
//     {header: '출고일시', name:'reg_date', width:200, filter:'text', format:'date', requiredField:true},
//     {header: '품목아이디', name:'prod_uuid', filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '품번', name:'prod_no', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '품명', name:'prod_nm', width:150, filter:'text', format:'popup'},
//     {header: '모델', name:'model_nm', width:100, filter:'text', format:'text', hidden:true},
//     {header: 'Rev', name:'rev', width:100, filter:'text', format:'text', hidden:true},
//     {header: '규격', name:'prod_std', width:100, filter:'text', format:'text', hidden:true},
//     {header: '단위', name:'unit_nm', width:200, filter:'text', format:'text', hidden:true},
//     {header: 'LOT NO', name:'lot_no', width:150, filter:'text', format:'text', requiredField:true},
//     {header: '수량', name:'qty', width:150, filter:'text', format:'number', editable:true, requiredField:true},

//     {header: '제품수주상세아이디', name:'order_detail_uuid', width:150, filter:'text', format:'text', hidden:true},
//     {header: '수주수량', name:'order_qty', width:150, filter:'text', format:'number'},
//     {header: '제품출하지시상세아이디', name:'outgo_order_detail_uuid', width:150, filter:'text', format:'text', hidden:true},
//     {header: '출하지시수량', name:'outgo_order_qty', width:150, filter:'text', format:'number'},

//     {header: '출고창고아이디', name:'from_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '출고창고코드', name:'from_store_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '출고창고명', name:'from_store_nm', width:150, filter:'text', format:'popup', requiredField:true},

//     {header: '출고위치아이디', name:'from_location_uuid', width:150, filter:'text', format:'text', hidden:true},
//     {header: '출고위치코드', name:'from_location_cd', width:150, filter:'text', format:'text', hidden:true},
//     {header: '출고위치명', name:'from_location_nm', width:150, filter:'text', format:'text', hidden:true},

//     {header: '입고창고아이디', name:'to_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
//     {header: '입고창고코드', name:'to_store_cd', width:150, filter:'text', format:'popup', hidden:true},
//     {header: '입고창고명', name:'to_store_nm', width:150, filter:'text', format:'popup', requiredField:true},

//     {header: '입고위치아이디', name:'to_location_uuid', width:150, filter:'text', format:'text', hidden:true},
//     {header: '입고위치코드', name:'to_location_cd', width:150, filter:'text', format:'text', hidden:true},
//     {header: '입고위치명', name:'to_location_nm', width:150, filter:'text', format:'text', hidden:true},

//     {header: '비고', name:'remark', width:200, filter:'text', format:'text' },
//     {header: '바코드', name:'barcode', width:200, filter:'text', format:'text', },
//     {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
//     {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
// ],

//   data: [],
//   searchParams: {
//   },
//   searchUriPath:'/sal/releases',
//   saveUriPath:'/sal/releases',
//   //페이지 그리드 팝업 
//   gridPopupInfo: [
//     {
//       columnNames: [
//         {original:'prod_uuid', popup:'prod_uuid'},
//         {original:'prod_no', popup:'prod_no'},
//         {original:'prod_nm', popup:'prod_nm'},
//         {original:'lot_no', popup:'lot_no'},
//         {original:'from_store_uuid', popup:'store_uuid'},
//         {original:'from_store_cd', popup:'store_cd'},
//         {original:'from_store_nm', popup:'store_nm'},
//       ],
//       columns: [
//         {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true},
//         {header: '품번', name:'prod_no', width:150, format:'text', hidden:true},
//         {header: '품명', name:'prod_nm', width:200, format:'text'},
//         {header: 'LOT NO', name:'lot_no', width:200, format:'text'},
//         {header: '출고창고UUID', name:'from_store_uuid', width:200, format:'text'},
//         {header: '출고창고코드', name:'from_store_cd', width:200, format:'text', hidden:true},
//         {header: '출고창고명', name:'from_store_nm', width:200, format:'text'},
//       ],
//       dataApiSettings: {
//         uriPath: '/inv/stores/stocks',
//         params: {stock_type: 'available', grouped_type: 'all', price_type: 'all', reg_date: 'end_date'}
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
//         {header: '입고창고UUID', name:'from_store_uuid', width:150, format:'text', hidden:true},
//         {header: '입고창고코드', name:'from_store_cd', width:150, format:'text', hidden:true},
//         {header: '입고창고명', name:'from_store_nm', width:200, format:'text'},
//       ],
//       dataApiSettings: {
//         uriPath: '/std/stores',
//         params: {store_type:'outgo'}
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
// export const PgSalRelease = () => {
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
//         searchItems:headerGridInit.searchItems,
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

import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { COLUMN_CODE, EDIT_ACTION_CODE, getPopupForm, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TExtraGridPopups } from '~/components/templates/grid-double/grid-double.template.type';
import dayjs from 'dayjs';



const changeNameToAlias = (data:object, items:any[]) => {
  let newData = cloneObject(data);
  
  Object.keys(newData)?.forEach(key => {
    const item = items?.find(el => el?.id === key);
    if (item?.alias)
      newData[item?.alias] = newData[key];
  });

  return newData;
}



/** 자재공정출고 */
export const PgSalRelease = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/sal/releases';
  const saveUriPath = '/sal/releases';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const STOCK_POPUP = getPopupForm('재고관리');
  
  const [releaseRequestPopupVisible, setReleaseRequestPopupVisible] = useState<boolean>(false);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    {type:'date', id:'reg_date', label:'출고일', default:getToday()},
  ]);
  const editDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', newDataPopupInputInfo?.props?.inputItems);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '제품출고UUID', name:'release_uuid', width:ENUM_WIDTH.M, alias: 'uuid', filter:'text', format:'text', hidden:true},
    {header: '출고일', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date', requiredField:true},
    {header: '품목UUID', name:'prod_uuid', filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup'},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text', format:'text', hidden:true},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text', requiredField:true},
    {header: '수량', name:'qty', width:ENUM_WIDTH.M, filter:'number', format:'number', editable:true, requiredField:true},

    {header: '제품수주상세UUID', name:'order_detail_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '수주수량', name:'order_qty', width:ENUM_WIDTH.M, filter:'number', format:'number'},
    {header: '제품출하지시상세UUID', name:'outgo_order_detail_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출하지시수량', name:'outgo_order_qty', width:ENUM_WIDTH.M, filter:'text', format:'number'},

    {header: '출고창고UUID', name:'from_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '출고창고명', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', requiredField:true},

    {header: '출고위치UUID', name:'from_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출고위치명', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},

    {header: '입고창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '입고창고명', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', requiredField:true},

    {header: '입고위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '입고위치명', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},

    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text', format:'text'},
    {header: '바코드', name:'barcode', width:ENUM_WIDTH.L, filter:'text', format:'text'},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 창고팝업
        columnNames: [
          {original:'to_store_uuid', popup:'store_uuid'},
          {original:'to_store_cd', popup:'store_cd'},
          {original:'to_store_nm', popup:'store_nm'},
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
          {original:'to_location_uuid', popup:'location_uuid'},
          {original:'to_location_cd', popup:'location_cd'},
          {original:'to_location_nm', popup:'location_nm'},
        ],
        columns: [
          {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: (ev) => {
          const {rowKey, instance} = ev;
          const {rawData} = instance?.store?.data;
      
          const storeUuid = rawData[rowKey]?.to_store_uuid;
          return {
            uriPath: '/std/locations',
            params: {store_uuid: storeUuid ?? null}
          }
        },
        gridMode:'select'
      },
    ],
    rowAddPopupInfo: {
      columnNames: [
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'safe_stock', popup:'safe_stock'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'money_unit_uuid', popup:'money_unit_uuid'},
        {original:'money_unit_nm', popup:'money_unit_nm'},
        {original:'price', popup:'price'},
        {original:'unit_qty', popup:'unit_qty'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_cd', popup:'store_cd'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_location_uuid', popup:'location_uuid'},
        {original:'from_location_cd', popup:'location_cd'},
        {original:'from_location_nm', popup:'location_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: [
        {header: '창고UUID', name:'store_uuid', filter:'text', format:'text', hidden:true},
        {header: '창고코드', name:'store_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '창고명', name:'store_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        
        {header: '위치UUID', name:'location_uuid', filter:'text', format:'text', hidden:true},
        {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},

        {header: '품목UUID', name:'prod_uuid', filter:'text', format:'text', hidden:true},
        {header: '품목 유형UUID', name:'item_type_uuid', filter:'text', format:'text', hidden:true},
        {header: '품목 유형코드', name:'item_type_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '제품 유형UUID', name:'prod_type_uuid', filter:'text', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '모델UUID', name:'model_uuid', filter:'text', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
        {header: '단위UUID', name:'unit_uuid', filter:'text', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '재고', name:'qty', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
      ],
      dataApiSettings: () => {
        // 출고일 기준으로 재고조회
        const params = {
          reg_date: newDataPopupInputInfo?.values?.reg_date,
          stock_type: 'available',
          grouped_type: 'all',
          price_type: 'all',
        }
        return {
          uriPath: STOCK_POPUP?.uriPath,
          params,
        };
      },
      gridMode:'multi-select'
    },
  });

  const newDataPopupGridColumns = cloneObject(grid.gridInfo.columns)?.filter((el) => el?.name !== 'reg_date');
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      saveParams: newDataPopupInputInfo?.values,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
      extraButtons: [
        {
          buttonProps: {text: '출고요청 불러오기'},
          buttonAction: (ev, props, options) => {
            //출고요청을 불러오는 팝업 열기
            setReleaseRequestPopupVisible(true);
          }
        },
      ],
    }
  );
  const editDataPopupGridColumns = cloneObject(newDataPopupGrid?.gridInfo?.columns)?.map(
    (el) => {
      if (!['qty', 'to_store_nm', 'to_location_nm', 'remark'].includes(el?.name))
        el['editable'] = false;

      return el;
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    editDataPopupGridColumns,
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
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], label:'출고일', defaults:[getToday(-7), getToday()]},
  ]);
  

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    const searchParams:any = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

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


  //#region 🔶 출고요청 관리
  const orderProdPopupGrid = useGrid('ORDER_PROD_GRID', cloneObject(grid?.gridInfo?.columns).filter(el => el?.name !== 'reg_date'), {
    title: '수주폼목 불러오기',
    gridMode: 'create',
    gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
    rowAddPopupInfo: {
      columnNames: [
        {original:'reg_date', popup:'reg_date'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_locaiton_uuid', popup:'locaiton_uuid'},
        {original:'from_locaiton_nm', popup:'locaiton_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: STOCK_POPUP?.datagridProps?.columns,
      dataApiSettings: () => {
        const params = {
          stock_type: 'available',
          grouped_type: 'all',
          price_type: 'all',
          reg_date: dayjs(orderProdPopupInputInfo?.values?.reg_date)?.format('YYYY-MM-DD'),
          // zero_except_fg: true,
          // minus_except_fg: true,
          prod_uuid: orderProdPopupInputInfo?.values?.prod_uuid,
        };

        return {
          uriPath: STOCK_POPUP?.uriPath,
          params,
          onInterlock: () => {
            const regDate = orderProdPopupInputInfo?.values?.reg_date;
            const prodUuid = orderProdPopupInputInfo?.values?.prod_uuid;

            if (!regDate) {
              message.error('기준일을 선택하신 후 다시 시도해주세요.');
              return false;
            }
            
            if (!prodUuid) {
              message.error('품목을 선택하신 후 다시 시도해주세요.');
              return false;
            }

            return true;
          }
        };
      },
      gridMode: 'multi-select',
    },
  });

  const orderProdPopupInputInfo = useInputGroup('ORDER_PROD_INPUTBOX', [
    {type:'date', id:'reg_date', label:'기준일', default:getToday(), disabled:true},
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {
      type:'text', id:'prod_no', label:'품번', usePopup:true,
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: '/prd/demands',
          params: {
            complete_state: 'incomplete',
            start_date: '1900-01-01',
            end_date: '2400-12-31',
          },
        },
        datagridSettings: {
          gridId: 'GET_RELEASE_REQUEST_GRID',
          columns: [
            {name:'order_uuid', header:'수주UUID', filter:'text', hidden:true},
            {name:'order_detail_uuid', header:'세부수주UUID', filter:'text', hidden:true},
            {name:'complete_state', header:'완료구분', width:ENUM_WIDTH.M, filter:'text'},
            {name:'complete_state', header:'완료구분', width:ENUM_WIDTH.M, filter:'text'},

            {name:'stmt_no', header:'전표번호', width:ENUM_WIDTH.M, format:'date', filter:'text'},
            {name:'demand_type_cd', header:'자재출고요청 유형코드', filter:'text', hidden:true},
            {name:'demand_type_nm', header:'요청유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'proc_uuid', header:'공정UUID', filter:'text', hidden:true},
            {name:'proc_nm', header:'공정', width:ENUM_WIDTH.M, filter:'text'},
            {name:'equip_uuid', header:'설비UUID', filter:'text', hidden:true},
            {name:'equip_nm', header:'설비', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_uuid', header:'품목UUID', filter:'text', hidden:true},
            {name:'prod_nm', header:'품목', width:ENUM_WIDTH.M, filter:'text'},
            {name:'item_type_uuid', header:'품목 유형UUID', filter:'text', hidden:true},
            {name:'item_type_nm', header:'품목 유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_type_uuid', header:'제품 유형UUID', filter:'text', hidden:true},
            {name:'prod_type_nm', header:'제품 유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'model_uuid', header:'모델UUID', filter:'text', hidden:true},
            {name:'model_nm', header:'모델', width:ENUM_WIDTH.M, filter:'text'},
            {name:'rev', header:'Rev', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_std', header:'규격', width:ENUM_WIDTH.M, filter:'text'},
            {name:'unit_uuid', header:'단위UUID', filter:'text', hidden:true},
            {name:'unit_nm', header:'단위', width:ENUM_WIDTH.S, filter:'text'},
            {name:'qty', header:'수량', width:ENUM_WIDTH.M, format:'number', filter:'number'},
            {name:'balance', header:'미납 수량', width:ENUM_WIDTH.M, format:'number', filter:'number'},
            {name:'complete_fg', header:'투입완료 여부', width:ENUM_WIDTH.S, format:'check', filter:'text', hidden:true},
            {name:'complete_state', header:'투입 완료여부(완료 / 미완료)', width:ENUM_WIDTH.S, filter:'text', hidden:true},
            {name:'dept_uuid', header:'자재출고요청 부서UUID', filter:'text', hidden:true},
            {name:'dept_nm', header:'부서', width:ENUM_WIDTH.M, filter:'text'},
            {name:'due_date', header:'납기일', width:ENUM_WIDTH.M, format:'date', filter:'text'},
            {name:'to_store_uuid', header:'입고 창고UUID', filter:'text', hidden:true},
            {name:'to_store_nm', header:'입고 창고', width:ENUM_WIDTH.M, filter:'text'},
            {name:'to_location_uuid', header:'입고 위치UUID', filter:'text', hidden:true},
            {name:'to_location_nm', header:'입고 위치', width:ENUM_WIDTH.M, filter:'text'},
            {name:'remark', header:'비고', width:ENUM_WIDTH.XL, filter:'text', hidden:true},
          ],
        },
        modalSettings: STOCK_POPUP.modalProps,
      },
      popupKeys: ['prod_uuid', 'prod_no', 'prod_nm', 'prod_std', 'reject_uuid', 'reject_nm', 'store_uuid', 'store_nm', 'location_uuid', 'location_nm', 'lot_no', 'stock_qty', 'remark', 'qty'],
    },
    {type:'text', id:'prod_nm', label:'품명', disabled:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true},
    {type:'number', id:'safe_stock', label:'안전재고', disabled:true, decimal:ENUM_DECIMAL.DEC_STCOK},
    {type:'text', id:'unit_uuid', label:'단위UUID', disabled:true, hidden:true},
    {type:'text', id:'unit_nm', label:'단위', disabled:true},
    {type:'number', id:'qty', label:'수주량', decimal:ENUM_DECIMAL.DEC_STCOK},
    {type:'number', id:'balance', label:'미납량', decimal:ENUM_DECIMAL.DEC_STCOK},
    {type:'text', id:'money_unit_uuid', label:'화폐단위UUID', disabled:true, hidden:true},
    {type:'text', id:'money_unit_nm', label:'화폐단위', disabled:true},
    {type:'text', id:'price_type_uuid', label:'단가유형UUID', disabled:true, hidden:true},
    {type:'text', id:'price_type_nm', label:'단가유형', disabled:true},
    {type:'number', id:'price', label:'단가', decimal:ENUM_DECIMAL.DEC_PRICE},
    {type:'number', id:'exchange', label:'환율', decimal:ENUM_DECIMAL.DEC_PRICE},
  ], {
    title: '수주 품목 정보',
  });


  /** 출고요청 팝업을 닫을때 그리드와 그룹입력상자 데이터를 초기화 합니다. */
  useLayoutEffect(() => {
    if (releaseRequestPopupVisible === false) { 
      orderProdPopupInputInfo?.instance?.resetForm();
      orderProdPopupGrid?.setGridData([]);

    } else {
      orderProdPopupInputInfo?.setFieldValue('reg_date', newDataPopupInputInfo?.values?.reg_date);
    }
  }, [releaseRequestPopupVisible]);
  //#endregion

  const extraGridPopups:TExtraGridPopups = [
    {
      ...orderProdPopupGrid?.gridInfo,
      ref: orderProdPopupGrid?.gridRef,
      popupId: 'EXTRA_POPUP_ReleaseRequest',
      gridMode: 'create',
      visible: releaseRequestPopupVisible,
      saveType: 'basic',
      searchUriPath: '/sal/releases',
      saveUriPath: '/sal/releases',
      okText: '추가하기',
      onCancel: (ev) => {
        const releaseRequestData = orderProdPopupGrid?.gridInstance?.getData();

        console.log('releaseRequestData', releaseRequestData);

        if (releaseRequestData?.length > 0) {
          modal.warning({
            title: '추가 취소',
            content: '작성중인 항목이 있습니다. 출고요청 불러오기를 취소하시겠습니까?',
            onOk: () => setReleaseRequestPopupVisible(false),
          });

        } else {
          setReleaseRequestPopupVisible(false);
        }
      },
      onOk: () => {
        const releaseRequestData = orderProdPopupGrid?.gridInstance?.getData();

        console.log('releaseRequestData', releaseRequestData);

        if (releaseRequestData?.length > 0) {
          newDataPopupGrid?.gridInstance?.appendRows(releaseRequestData);
          setReleaseRequestPopupVisible(false);
          
        } else {
          message.warn('행을 추가한 후 다시 시도해주세요.');
          return;
        }
      },
      saveOptionParams: changeNameToAlias(orderProdPopupInputInfo?.values, orderProdPopupInputInfo?.inputItems),
      inputProps: orderProdPopupInputInfo?.props,
    },
  ];
  
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

    extraGridPopups,

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}