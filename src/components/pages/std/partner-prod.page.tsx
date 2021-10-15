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
    {header: '거래처UUID', name:'partner_uuid', alias:'uuid', width:150, hidden:true},
    {header: '거래처 유형UUID', name:'partner_type_uuid', alias:'uuid', width:150, hidden:true},
    {header: '거래처 유형코드', name:'partner_type_cd', width:150, hidden:true},
    {header: '거래처 유형명', name:'partner_type_nm', width:150, filter:'text', editable:true, requiredField:true},
    {header: '거래처코드', name:'partner_cd', width:150, editable:true, hidden:true, requiredField:true},
    {header: '거래처명', name:'partner_nm', width:200, filter:'text', editable:true, requiredField:true},
  ],
  data: [],
  searchUriPath:'/std/partners',
  saveUriPath:'/std/partners',
};


/** (detail) 페이지 그리드의 상태 초기값 */
const detailGridInit:IInitialGridState = {
  gridId: uuidv4(),
  gridMode:'view',
  columns: [
    {header: '거래처 품목UUID', name:'partner_prod_uuid', alias:'uuid', width:150, hidden:true},
    {header: '거래처UUID', name:'partner_uuid', width:150, filter:'text', hidden:true},
    {header: '거래처코드', name:'partner_cd', width:150, filter:'text', hidden:true},
    {header: '거래처명', name:'partner_nm', width:200, filter:'text', hidden:true},
    {header: '거래처 유형UUID', name:'partner_type_uuid', width:150, filter:'text', hidden:true},
    {header: '거래처 유형코드', name:'partner_type_cd', width:150, filter:'text', hidden:true},
    {header: '거래처 유형명', name:'partner_type_nm', width:200, filter:'text', hidden:true},
    {header: '품목 유형UUID', name:'item_type_uuid', width:150, filter:'text', hidden:true},
    {header: '품목 유형코드', name:'item_type_cd', width:150, filter:'text', hidden:true},
    {header: '품목 유형명', name:'item_type_nm', width:120, filter:'text', align:'center'},
    {header: '제품 유형UUID', name:'prod_type_uuid', width:150, filter:'text', hidden:true},
    {header: '제품 유형코드', name:'prod_type_cd', width:150, filter:'text', hidden:true},
    {header: '제품 유형명', name:'prod_type_nm', width:150, filter:'text'},
    {header: '품목UUID', name:'prod_uuid', width:150, filter:'text', hidden:true},
    {header: '품번', name:'prod_no', width:150, filter:'text'},
    {header: '거래처 품번', name:'partner_prod_no', width:200, filter:'text', editable:true, requiredField:true},
    {header: '품목명', name:'prod_nm', width:200, filter:'text', requiredField:true},
    {header: '모델UUID', name:'model_uuid', width:150, filter:'text', hidden:true},
    {header: '모델코드', name:'model_cd', width:150, filter:'text', hidden:true},
    {header: '모델명', name:'model_nm', width:200, filter:'text'},
    {header: 'Rev', name:'rev', width:120, filter:'text'},
    {header: '규격', name:'prod_std', width:150, filter:'text'},
    {header: '단위UUID', name:'unit_uuid', width:150, filter:'text', hidden:true},
    {header: '단위코드', name:'unit_cd', width:150, filter:'text', hidden:true},
    {header: '단위명', name:'unit_nm', width:100, filter:'text', align:'center'},
    {header: '비고', name:'remark', width:150, filter:'text', editable:true},
  ],
  data: [],
  inputItems: [
    {type:'text', id:'partner_uuid', label:'거래처UUID', disabled:true, hidden:true},
    {type:'text', id:'partner_cd', label:'거래처코드', disabled:true, hidden:true},
    {type:'text', id:'partner_nm', label:'거래처명', disabled:true},
  ],
  searchUriPath:'/std/partner-prods',
  saveUriPath:'/std/partner-prods',
  searchParams: {},
};


/** 신규 생성 팝업 그리드의 상태 초기값 */
const newCreateGridInit = {
  ...defaultNewCreateGridInit,
  columns:detailGridInit.columns,
  inputProps: {
    inputItems: detailGridInit.inputItems
  },
  rowAddPopupInfo: {
    columnNames:[
      {original:'prod_uuid', popup:'prod_uuid'},
      {original:'item_type_uuid', popup:'item_type_uuid'},
      {original:'item_type_cd', popup:'item_type_cd'},
      {original:'item_type_nm', popup:'item_type_nm'},
      {original:'prod_type_uuid', popup:'prod_type_uuid'},
      {original:'prod_type_cd', popup:'prod_type_cd'},
      {original:'prod_type_nm', popup:'prod_type_nm'},
      {original:'prod_no', popup:'prod_no'},
      {original:'prod_nm', popup:'prod_nm'},
      {original:'rev', popup:'rev'},
      {original:'prod_std', popup:'prod_std'},
      {original:'unit_uuid', popup:'unit_uuid'},
      {original:'unit_cd', popup:'unit_cd'},
      {original:'unit_nm', popup:'unit_nm'},
    ],
    columns: [
      {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true},
      {header: '품목 유형UUID', name:'item_type_uuid', width:150, format:'text', hidden:true},
      {header: '품목 유형코드', name:'item_type_cd', width:150, format:'text', hidden:true},
      {header: '품목 유형명', name:'item_type_nm', width:200, format:'text'},
      {header: '제품 유형UUID', name:'prod_type_uuid', width:150, format:'text', hidden:true},
      {header: '제품 유형코드', name:'prod_type_cd', width:150, format:'text', hidden:true},
      {header: '제품 유형명', name:'prod_type_nm', width:200, format:'text'},
      {header: '품번', name:'prod_no', width:150, format:'text'},
      {header: '품명', name:'prod_nm', width:200, format:'text'},
      {header: '모델UUID', name:'model_uuid', width:150, format:'text', hidden:true},
      {header: '모델코드', name:'model_cd', width:150, format:'text', hidden:true},
      {header: '모델명', name:'model_nm', width:200, format:'text'},
      {header: 'Rev', name:'rev', width:200, format:'text'},
      {header: '규격', name:'prod_std', width:200, format:'text'},
      {header: '안전재고', name:'inv_safe_qty', width:200, format:'text'},
      {header: '단위UUID', name:'unit_uuid', width:150, format:'text', hidden:true},
      {header: '단위코드', name:'unit_cd', width:150, format:'text', hidden:true},
      {header: '단위명', name:'unit_nm', width:200, format:'text'},
    ],
    dataApiSettings: {
      uriPath: '/std/prods',
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
  rowAddPopupInfo: newCreateGridInit.rowAddPopupInfo
};
//#endregion




/** 거래처품목관리 */
export const PgStdPartnerProd = () => {
  //#region 🔶세팅 값

  const inputRef = useRef<FormikProps<FormikValues>>();

  const {headerGrid, detailGrid, newCreateGrid, newDetailCreateGrid} = baseHeaderDetailPage(headerGridInit, detailGridInit, newCreateGridInit, newDetailCreateGridInit);
  const headerGridRef = headerGrid.content.gridRef;
  const detailGridRef = detailGrid.content.gridRef;

  const [,setLoading] = useLoadingState();

  const [,setDetailCreatePopupVisible] = useRecoilState(afPopupVisible(newDetailCreateGrid.state.gridId));

  const [clickedRowKey, setClickedRowKey] = useState(null);

  const saveOptionParams = inputRef.current?.values;

  //#endregion


  /** 셀 클릭 트리거 */
  const headerRowClickedValue = useMemo(() => {
    if (clickedRowKey == null) return null;
    return headerGridRef?.current?.getInstance().getValue(clickedRowKey, 'partner_uuid');
  }, [clickedRowKey]);


  /** 헤더 셀 클릭 변경되면 디테일 조회 */
  useLayoutEffect(() => {
    if (headerRowClickedValue != null) {
      const {dispatch, content} = detailGrid;

      const row = headerGridRef?.current?.getInstance().getRow(clickedRowKey);
      inputRef.current.setValues(row);

      const searchParams = {partner_uuid: headerRowClickedValue};
      onSearch(content.gridRef, dispatch, content.searchUriPath, searchParams, content.gridItems.columns, setLoading);
      
      setClickedRowKey(null);
    }
  }, [headerRowClickedValue]);


  /** 헤더 데이터가 다시 조회되면 */
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

      inputProps={{
        id:'inputItems',
        inputItems:detailGridInit.inputItems,
        innerRef: inputRef
      }}

      
      onShowDetailCreatePopup={() => {
        if ([null, undefined, ''].includes(inputRef?.current?.values?.partner_uuid)) {
          message.warn('거래처를 선택한 후 다시 시도해주세요.');
        } else {
          onShowDetailCreatePopup(setDetailCreatePopupVisible);
        }
      }}


      newCreateBtnDisabled={true}

      setParentData={headerGrid.dispatch}
      
      header={headerGrid.content}
      detail={detailGrid.content}
    />
  )
}