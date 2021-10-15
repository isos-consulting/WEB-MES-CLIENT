import React, { useCallback, useLayoutEffect, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TGridMode } from '~/components/UI/datagrid-new/datagrid.ui.type';
import Grid from '@toast-ui/react-grid';
import { useMemo } from 'react';
import '~styles/grid.style.scss';
import {singleGridEvents, singleGridReducer, createGridInit as defaultCreateGridInit, IInitialGridState} from '~/components/templates/grid-single-new';
import { useLoadingState } from '~/hooks';
import {TpSingleGrid} from '~components/templates/grid-single-new';
import { IDatagridProps } from '~/components/UI/datagrid-new';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import { useState } from 'react';


const { onSearch } = singleGridEvents;

/** 페이지 그리드의 상태 초기값 */

/** (header) 페이지 그리드의 상태 초기값 */
const headerGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [],
  data: [],
  searchItems: [
    {type:'date', id:'start_date', default:dayjs().format('YYYY-MM-DD'), label:'기준일'},
    {type:'date', id:'end_date', default:dayjs().format('YYYY-MM-DD')}
  ],
  searchParams:{
    complete_state: 'all'
  },
  searchUriPath:'/sal/releases',
  saveUriPath:'/sal/releases',
};

/** (detail) 페이지 그리드의 상태 초기값 */
const gridStateInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view' as TGridMode,
  columns: [
    {header: '제품출고아이디', name:'release_uuid', width:150, alias: 'uuid', filter:'text', format:'text', hidden:true},
    {header: '출고일시', name:'reg_date', width:200, filter:'text', format:'date', requiredField:true},
    {header: '품목아이디', name:'prod_uuid', filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '품번', name:'prod_no', width:150, filter:'text', format:'popup', hidden:true},
    {header: '품명', name:'prod_nm', width:150, filter:'text', format:'popup'},
    {header: '모델', name:'model_nm', width:100, filter:'text', format:'text', hidden:true},
    {header: 'Rev', name:'rev', width:100, filter:'text', format:'text', hidden:true},
    {header: '규격', name:'prod_std', width:100, filter:'text', format:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:200, filter:'text', format:'text', hidden:true},
    {header: 'LOT NO', name:'lot_no', width:150, filter:'text', format:'text', requiredField:true},
    {header: '수량', name:'qty', width:150, filter:'text', format:'number', editable:true, requiredField:true},

    {header: '제품수주상세아이디', name:'order_detail_uuid', width:150, filter:'text', format:'text', hidden:true},
    {header: '수주수량', name:'order_qty', width:150, filter:'text', format:'number'},
    {header: '제품출하지시상세아이디', name:'outgo_order_detail_uuid', width:150, filter:'text', format:'text', hidden:true},
    {header: '출하지시수량', name:'outgo_order_qty', width:150, filter:'text', format:'number'},

    {header: '출고창고아이디', name:'from_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '출고창고코드', name:'from_store_cd', width:150, filter:'text', format:'popup', hidden:true},
    {header: '출고창고명', name:'from_store_nm', width:150, filter:'text', format:'popup', requiredField:true},

    {header: '출고위치아이디', name:'from_location_uuid', width:150, filter:'text', format:'text', hidden:true},
    {header: '출고위치코드', name:'from_location_cd', width:150, filter:'text', format:'text', hidden:true},
    {header: '출고위치명', name:'from_location_nm', width:150, filter:'text', format:'text', hidden:true},

    {header: '입고창고아이디', name:'to_store_uuid', width:150, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '입고창고코드', name:'to_store_cd', width:150, filter:'text', format:'popup', hidden:true},
    {header: '입고창고명', name:'to_store_nm', width:150, filter:'text', format:'popup', requiredField:true},

    {header: '입고위치아이디', name:'to_location_uuid', width:150, filter:'text', format:'text', hidden:true},
    {header: '입고위치코드', name:'to_location_cd', width:150, filter:'text', format:'text', hidden:true},
    {header: '입고위치명', name:'to_location_nm', width:150, filter:'text', format:'text', hidden:true},

    {header: '비고', name:'remark', width:200, filter:'text', format:'text' },
    {header: '바코드', name:'barcode', width:200, filter:'text', format:'text', },
    {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
    {header: '등록자', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
],

  data: [],
  searchParams: {
  },
  searchUriPath:'/sal/releases',
  saveUriPath:'/sal/releases',
  //페이지 그리드 팝업 
  gridPopupInfo: [
    {
      columnNames: [
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_cd', popup:'store_cd'},
        {original:'from_store_nm', popup:'store_nm'},
      ],
      columns: [
        {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true},
        {header: '품번', name:'prod_no', width:150, format:'text', hidden:true},
        {header: '품명', name:'prod_nm', width:200, format:'text'},
        {header: 'LOT NO', name:'lot_no', width:200, format:'text'},
        {header: '출고창고UUID', name:'from_store_uuid', width:200, format:'text'},
        {header: '출고창고코드', name:'from_store_cd', width:200, format:'text', hidden:true},
        {header: '출고창고명', name:'from_store_nm', width:200, format:'text'},
      ],
      dataApiSettings: {
        uriPath: '/inv/stores/stocks',
        params: {stock_type: 'available', grouped_type: 'all', price_type: 'all', reg_date: 'end_date'}
      },
      gridMode:'select'
    },
    {
      columnNames: [
        {original:'to_store_uuid', popup:'store_uuid'},
        {original:'to_store_cd', popup:'store_cd'},
        {original:'to_store_nm', popup:'store_nm'},
      ],
      columns: [
        {header: '입고창고UUID', name:'from_store_uuid', width:150, format:'text', hidden:true},
        {header: '입고창고코드', name:'from_store_cd', width:150, format:'text', hidden:true},
        {header: '입고창고명', name:'from_store_nm', width:200, format:'text'},
      ],
      dataApiSettings: {
        uriPath: '/std/stores',
        params: {store_type:'outgo'}
      },
      gridMode:'select'
    }
  ]
};


/** 신규 생성 팝업 그리드의 상태 초기값 */
const createGridInit = {
  ...defaultCreateGridInit,
  columns: gridStateInit.columns,
  gridComboInfo: gridStateInit.gridComboInfo
};


/** 재고이동관리 */
export const PgSalRelease = () => {
  const [gridState, dispatch] = useReducer(singleGridReducer, gridStateInit);
  const [createGridState] = useReducer(singleGridReducer, createGridInit);
  const [,setLoading] = useLoadingState();
  const [AUTO_SEARCH_FLAG, SET_AUTO_SEARCH_FLAG] = useState(false);


  // 그리드의 reference
  const gridRef = useRef<Grid>();
  const createPopupGridRef = useRef<Grid>();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef.current?.values;


  /** 그리드 관련 세팅 */
  const gridItems = useMemo<IDatagridProps>(() => { 
    return {...gridState}
  }, [gridState]) ;


  /** 모드가 변경되면 그리드를 새로 로드 합니다. (view일때만 새로 로드) */
  useLayoutEffect(() => {
    if (gridState.gridMode === 'view' && AUTO_SEARCH_FLAG === true) {
      onSearch(gridRef, dispatch, gridState.searchUriPath, searchParams, gridState.columns, setLoading);
    }
  }, [gridState.gridMode]);

  /** 그리드 데이터 변경 */
  const setData = useCallback(
    (data:any) => {
      dispatch({type:'setData', data:data})
    },
    [dispatch],
  );

  
  return (
    <TpSingleGrid
      createPopupGridItems={createGridState}
      createPopupGridRef={createPopupGridRef}
      gridDispatch={dispatch}
      gridItems={gridItems}
      gridRef={gridRef}
      parentGridRef={createPopupGridRef}
      saveUriPath={gridState.saveUriPath}
      searchParams={gridState.searchParams}
      searchProps={{
        id:'search',
        searchItems:headerGridInit.searchItems,
        innerRef: searchRef,
        onSearch: (values) => {
          onSearch(gridRef, dispatch, gridState.searchUriPath, searchParams, gridState.columns, setLoading);
          SET_AUTO_SEARCH_FLAG(true);
        }
      }}
      searchUriPath={gridState.searchUriPath}
      setParentData={setData}
    />
  );
};

