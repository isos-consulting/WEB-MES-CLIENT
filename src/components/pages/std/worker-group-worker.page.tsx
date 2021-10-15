import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  newCreateGridInit as defaultNewCreateGridInit,
  newDetailCreateGridInit as defaultNewDetailCreateGridInit, 
  TpDoubleGrid,
  doubleGridEvents,
  baseHeaderDetailPage} 
from '~components/templates/grid-double-new';
import { v4 as uuidv4 } from 'uuid';
import { useLoadingState } from '~/hooks';
import { IInitialGridState } from '~/components/templates/grid-single-new';
import { FormikProps, FormikValues } from 'formik';



const { onSearch } = doubleGridEvents;



//#region 🔶초기 값
/** (header) 페이지 그리드의 상태 초기값 */
const headerGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [
    {header: '작업조UUID', name:'worker_group_uuid', alias:'uuid', width:150, format:'text', hidden:true},
    {header: '작업조코드', name:'worker_group_cd', width:150, format:'text', hidden:true},
    {header: '작업조명', name:'worker_group_nm', width:200, format:'text', filter:'text'},
  ],
  data: [],
  searchUriPath:'/std/worker-groups',
  saveUriPath:'/std/worker-groups',
};


/** (detail) 페이지 그리드의 상태 초기값 */
const detailGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [
    {header: '작업조-작업자UUID', name:'worker_group_worker_uuid', alias:'uuid', width:150, format:'text', hidden:true},
    {header: '작업조UUID', name:'worker_group_uuid', width:150, format:'text', hidden:true},
    {header: '작업자UUID', name:'worker_uuid', width:150, format:'text', hidden:true},
    {header: '작업자코드', name:'worker_cd', width:150, format:'text', hidden:true},
    {header: '작업자명', name:'worker_nm', width:200, format:'popup', editable:true, requiredField:true},
    {header: '비고', name:'remark', width:150, format:'text', editable:true},
  ],
  data: [],
  inputItems: [
    {type:'text', id:'worker_group_uuid', label:'작업조UUID', disabled:true, hidden:true},
    {type:'text', id:'worker_group_cd', label:'작업조코드', disabled:true, hidden:true},
    {type:'text', id:'worker_group_nm', label:'작업조명', disabled:true},
  ],
  searchUriPath:'/std/worker-group-workers',
  saveUriPath:'/std/worker-group-workers',
  searchParams: {},

  gridPopupInfo: [
    {
      columnNames: [
        {original:'worker_uuid', popup:'worker_uuid'},
        {original:'worker_cd', popup:'worker_cd'},
        {original:'worker_nm', popup:'worker_nm'},
      ],
      columns: [
        {header: '작업자UUID', name:'worker_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '공정UUID', name:'proc_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '공정코드', name:'proc_cd', width:150, format:'text', hidden:true},
        {header: '공정명', name:'proc_nm', width:200, format:'text'},
        {header: '작업장UUID', name:'workings_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '작업장코드', name:'workings_cd', width:150, format:'text', hidden:true},
        {header: '작업장명', name:'workings_nm', width:200, format:'text'},
        {header: '사원UUID', name:'emp_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '사번', name:'emp_cd', width:150, format:'text'},
        {header: '사원명', name:'emp_nm', width:200, format:'text'},
        {header: '작업자명', name:'worker_nm', width:200, format:'text'},
      ],
      dataApiSettings: {
        uriPath: '/std/workers',
        params: {}
      },
      gridMode:'select'
    }
  ]
};


/** 신규 생성 팝업 그리드의 상태 초기값 */
const newCreateGridInit = {
  ...defaultNewCreateGridInit,
  columns:detailGridInit.columns,
  inputProps: {
    inputItems: detailGridInit.inputItems
  },
  gridPopupInfo: detailGridInit.gridPopupInfo,
  rowAddPopupInfo: {
    columnNames: [
      {original:'worker_uuid', popup:'worker_uuid'},
      {original:'worker_cd', popup:'reject_type_nm'},
      {original:'worker_nm', popup:'worker_nm'},
    ],
    columns: [
      {header: '작업자UUID', name:'worker_uuid', alias:'uuid', width:150, format:'text', hidden:true},
      {header: '공정UUID', name:'proc_uuid', alias:'uuid', width:150, format:'text', hidden:true},
      {header: '공정코드', name:'proc_cd', width:150, format:'text', hidden:true},
      {header: '공정명', name:'proc_nm', width:200, format:'text'},
      {header: '작업장UUID', name:'workings_uuid', alias:'uuid', width:150, format:'text', hidden:true},
      {header: '작업장코드', name:'workings_cd', width:150, format:'text', hidden:true},
      {header: '작업장명', name:'workings_nm', width:200, format:'text'},
      {header: '사원UUID', name:'emp_uuid', alias:'uuid', width:150, format:'text', hidden:true},
      {header: '사번', name:'emp_cd', width:150, format:'text'},
      {header: '사원명', name:'emp_nm', width:200, format:'text'},
      {header: '작업자명', name:'worker_nm', width:200, format:'text'},
    ],
    dataApiSettings: {
      uriPath: '/std/workers',
      params: {}
    },
    gridMode:'multi-select'
  }
};

/** 신규 생성 팝업 그리드의 상태 초기값 */
const newDetailCreateGridInit = {
  ...defaultNewDetailCreateGridInit, 
  columns:detailGridInit.columns, 
  inputProps: {
    inputItems: detailGridInit.inputItems
  },
  gridPopupInfo: detailGridInit.gridPopupInfo,
  rowAddPopupInfo: {...newCreateGridInit.rowAddPopupInfo}
};
//#endregion




/** 작업조별 작업자관리 */
export const PgStdWorkerGroupWorker = () => {
  //#region 🔶세팅 값
  const inputRef = useRef<FormikProps<FormikValues>>();

  const {headerGrid, detailGrid, newCreateGrid, newDetailCreateGrid} = baseHeaderDetailPage(headerGridInit, detailGridInit, newCreateGridInit, newDetailCreateGridInit);
  const headerGridRef = headerGrid.content.gridRef;
  const detailGridRef = detailGrid.content.gridRef;

  const [,setLoading] = useLoadingState();

  const saveOptionParams = inputRef?.current?.values;
  const [clickedRowKey, setClickedRowKey] = useState(null);

  //#endregion


  /** 셀 클릭 트리거 */
  const headerRowClickedValue = useMemo(() => {
    if (clickedRowKey == null) return null;
    return headerGridRef?.current?.getInstance().getValue(clickedRowKey, 'worker_group_uuid');
  }, [clickedRowKey]);


  /** 헤더 셀 클릭 변경되면 디테일 조회 */
  useLayoutEffect(() => {
    if (headerRowClickedValue != null) {
      const {dispatch, content} = detailGrid;

      const row = headerGridRef?.current?.getInstance().getRow(clickedRowKey);
      inputRef.current.setValues(row);

      const searchParams = {worker_group_uuid: headerRowClickedValue};
      onSearch(content.gridRef, dispatch, content.searchUriPath, searchParams, content.gridItems.columns, setLoading);
      
      setClickedRowKey(null);
    }
  }, [headerRowClickedValue]);

  useLayoutEffect(() => {
    const ref = headerGrid.content.gridRef;

    ref?.current.getInstance().on('click', (ev) => {
      const {rowKey, targetType} = ev as any;

      if (targetType === 'cell') {
        setClickedRowKey(rowKey)
      }
    });
    
    return () => {
      ref?.current?.getInstance().off('click');
    }
  }, [headerGrid]);



  return (
    <TpDoubleGrid
      gridMode={detailGrid.state.gridMode}
      createNewPopupGridItems={newCreateGrid.state}
      createNewPopupGridRef={newCreateGrid.ref}
      createDetailPopupGridItems={newDetailCreateGrid.state}
      createDetailPopupGridRef={newDetailCreateGrid.ref}
      parentGridRef={detailGridRef}

      saveUriPath={detailGrid.state.saveUriPath}
      saveOptionParams={saveOptionParams}

      searchUriPath={detailGrid.state.searchUriPath}
      searchParams={headerGrid.content.searchParams}

      inputProps={{
        id:'inputItems',
        inputItems:detailGridInit.inputItems,
        innerRef: inputRef
      }}

      onSearch={() => {
        onSearch(headerGrid.content.gridRef, headerGrid.dispatch, headerGrid.content.searchUriPath, headerGrid.content.searchParams, headerGrid.content.gridItems.columns, setLoading);
        inputRef?.current.resetForm();
        detailGrid.dispatch({type:'setData', data:[]});
      }}

      setParentData={headerGrid.dispatch}
      newCreateBtnDisabled={true}
      
      header={headerGrid.content}
      detail={detailGrid.content}
    />
  )
}