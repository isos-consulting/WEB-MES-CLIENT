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
import {FormikProps, FormikValues} from 'formik';
import { message } from 'antd';
import { useRecoilState } from 'recoil';
import { afPopupVisible } from '~/components/UI';



const { onSearch, onShowDetailCreatePopup } = doubleGridEvents;



//#region 🔶초기 값
/** (header) 페이지 그리드의 상태 초기값 */
const headerGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [
    {header: '품목UUID', name:'prod_uuid', alias:'uuid', width:150, format:'text', hidden:true},
    {header: '품번', name:'prod_no', width:150, filter:'text', format:'text'},
    {header: '품명', name:'prod_nm', width:200, filter:'text', format:'text'},
    {header: '규격', name:'prod_std', width:150, format:'text'},
  ],
  data: [],
  searchUriPath:'/std/prods',
  saveUriPath:'/std/prods',
};



/** (detail) 페이지 그리드의 상태 초기값 */
const detailGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [
    {header: '품목별 작업장UUID', name:'routing_workings_uuid', alias:'uuid', width:150, format:'text', hidden:true},
    {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true, requiredField:true},
    {header: '작업장UUID', name:'workings_uuid', width:150, format:'text', hidden:true, requiredField:true},
    {header: '작업장코드', name:'workings_cd', width:200, format:'text', hidden:true},
    {header: '작업장명', name:'workings_nm', width:150, format:'text', filter:'text', editable:true},
  ],
  data: [],
  inputItems: [
    {type:'text', id:'prod_uuid', label:'품목UUID', default:'', disabled:true, hidden:true},
    {type:'text', id:'prod_no', label:'품번', default:'', disabled:true},
    {type:'text', id:'prod_nm', label:'품명', default:'', disabled:true},
    {type:'text', id:'prod_std', label:'규격', default:'', disabled:true},
  ],
  searchUriPath:'/std/routing-workingses',
  saveUriPath:'/std/routing-workingses',
  searchParams: {},

  gridPopupInfo: [
    {
      columnNames: [
        {original:'workings_uuid', popup:'workings_uuid'},
        {original:'workings_cd', popup:'workings_cd'},
        {original:'workings_nm', popup:'workings_nm'},
      ],
      columns: [
        {header: '작업장UUID', name:'workings_uuid', width:150, format:'text', hidden:true},
        {header: '작업장코드', name:'workings_cd', width:150, format:'text'},
        {header: '작업장명', name:'workings_nm', width:200, format:'text'},
      ],
      dataApiSettings: {
        uriPath: '/std/workingses',
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
    columnNames:[
        {original:'workings_uuid', popup:'workings_uuid'},
        {original:'workings_cd', popup:'workings_cd'},
        {original:'workings_nm', popup:'workings_nm'},
    ],
    columns: [
      {header: '작업장UUID', name:'workings_uuid', width:150, format:'text', hidden:true},
      {header: '작업장코드', name:'workings_cd', width:150, format:'text'},
      {header: '작업장명', name:'workings_nm', width:200, format:'text'},
    ],

    dataApiSettings: {
      uriPath: '/std/workingses',
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
  rowAddPopupInfo: {
    columnNames:[
        {original:'workings_uuid', popup:'workings_uuid'},
        {original:'workings_cd', popup:'workings_cd'},
        {original:'workings_nm', popup:'workings_nm'},
    ],
    columns: [
      {header: '작업장UUID', name:'workings_uuid', width:150, format:'text', hidden:true},
      {header: '작업장코드', name:'workings_cd', width:150, format:'text'},
      {header: '작업장명', name:'workings_nm', width:200, format:'text'},
    ],


    dataApiSettings: {
      uriPath: '/std/workingses',
      params: {}
    },
    gridMode:'multi-select'
  }
};
//#endregion




/** 품목별 작업장관리 */
export const PgStdRoutingWorking = () => {
  const inputRef = useRef<FormikProps<FormikValues>>();

  //#region 🔶세팅 값
  const {headerGrid, detailGrid, newCreateGrid, newDetailCreateGrid} = baseHeaderDetailPage(headerGridInit, detailGridInit, newCreateGridInit, newDetailCreateGridInit);
  const headerGridRef = headerGrid.content.gridRef;
  const detailGridRef = detailGrid.content.gridRef;

  const [,setLoading] = useLoadingState();

  const [,setDetailCreatePopupVisible] = useRecoilState(afPopupVisible(newDetailCreateGrid.state.gridId));



  // const searchParams = useRecoilValue(sfSearchbox(searchKeys));
  // const saveOptionParams = useRecoilValue(sfInputbox(inputKeys));
  const [clickedRowKey, setClickedRowKey] = useState(null);

  const saveOptionParams = inputRef.current?.values;

  //#endregion


  /** 셀 클릭 트리거 */
  const headerRowClickedValue = useMemo(() => {
    if (clickedRowKey == null) return null;
    return headerGridRef?.current?.getInstance().getValue(clickedRowKey, 'prod_uuid');
  }, [clickedRowKey]);


  /** 헤더 셀 클릭 변경되면 디테일 조회 */
  useLayoutEffect(() => {
    if (headerRowClickedValue != null) {
      const {dispatch, content} = detailGrid;

      const row = headerGridRef?.current?.getInstance().getRow(clickedRowKey);
      // setInputboxItems(row);
      inputRef.current.setValues(row);

      const searchParams = {prod_uuid: headerRowClickedValue};
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
      // searchItems={headerGrid.state.searchItems}
      // searchParams={searchParams}

      onSearch={() => {
        onSearch(headerGrid.content.gridRef, headerGrid.dispatch, headerGrid.content.searchUriPath,  headerGrid.content.searchParams, headerGrid.content.gridItems.columns, setLoading);
        inputRef?.current.resetForm();
        detailGrid.dispatch({type:'setData', data:[]});
      }}
      
      inputProps={{
        id:'inputItems',
        inputItems:detailGridInit.inputItems,
        innerRef: inputRef
      }}

      onShowDetailCreatePopup={() => {
        if ([null, undefined, ''].includes(inputRef?.current?.values?.prod_uuid)) {
          message.warn('품목을 선택한 후 다시 시도해주세요.');
        } else {
          onShowDetailCreatePopup(setDetailCreatePopupVisible);
        }
      }}

      setParentData={headerGrid.dispatch}
      newCreateBtnDisabled={true}
      
      header={{...headerGrid.content}}
      detail={detailGrid.content}
    />
  )
}