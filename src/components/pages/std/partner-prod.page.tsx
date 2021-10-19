// import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
// import {
//   newCreateGridInit as defaultNewCreateGridInit,
//   newDetailCreateGridInit as defaultNewDetailCreateGridInit, 
//   TpDoubleGrid,
//   doubleGridEvents,
//   baseHeaderDetailPage} 
// from '~components/templates/grid-double-new';
// import { v4 as uuidv4 } from 'uuid';
// import { useLoadingState } from '~/hooks';
// import { IInitialGridState } from '~/components/templates/grid-single-new';
// import { FormikProps, FormikValues } from 'formik';
// import { message } from 'antd';
// import { useRecoilState } from 'recoil';
// import { afPopupVisible } from '~/components/UI';



// const { onSearch, onShowDetailCreatePopup } = doubleGridEvents;



// //#region 🔶초기 값
// /** (header) 페이지 그리드의 상태 초기값 */
// const headerGridInit:IInitialGridState = {
//   gridId: uuidv4(),
//   gridMode:'view',
//   columns: [
//     {header: '거래처UUID', name:'partner_uuid', alias:'uuid', width:150, hidden:true},
//     {header: '거래처 유형UUID', name:'partner_type_uuid', alias:'uuid', width:150, hidden:true},
//     {header: '거래처 유형코드', name:'partner_type_cd', width:150, hidden:true},
//     {header: '거래처 유형명', name:'partner_type_nm', width:150, filter:'text', editable:true, requiredField:true},
//     {header: '거래처코드', name:'partner_cd', width:150, editable:true, hidden:true, requiredField:true},
//     {header: '거래처명', name:'partner_nm', width:200, filter:'text', editable:true, requiredField:true},
//   ],
//   data: [],
//   searchUriPath:'/std/partners',
//   saveUriPath:'/std/partners',
// };


// /** (detail) 페이지 그리드의 상태 초기값 */
// const detailGridInit:IInitialGridState = {
//   gridId: uuidv4(),
//   gridMode:'view',
//   columns: [
//     {header: '거래처 품목UUID', name:'partner_prod_uuid', alias:'uuid', width:150, hidden:true},
//     {header: '거래처UUID', name:'partner_uuid', width:150, filter:'text', hidden:true},
//     {header: '거래처코드', name:'partner_cd', width:150, filter:'text', hidden:true},
//     {header: '거래처명', name:'partner_nm', width:200, filter:'text', hidden:true},
//     {header: '거래처 유형UUID', name:'partner_type_uuid', width:150, filter:'text', hidden:true},
//     {header: '거래처 유형코드', name:'partner_type_cd', width:150, filter:'text', hidden:true},
//     {header: '거래처 유형명', name:'partner_type_nm', width:200, filter:'text', hidden:true},
//     {header: '품목 유형UUID', name:'item_type_uuid', width:150, filter:'text', hidden:true},
//     {header: '품목 유형코드', name:'item_type_cd', width:150, filter:'text', hidden:true},
//     {header: '품목 유형명', name:'item_type_nm', width:120, filter:'text', align:'center'},
//     {header: '제품 유형UUID', name:'prod_type_uuid', width:150, filter:'text', hidden:true},
//     {header: '제품 유형코드', name:'prod_type_cd', width:150, filter:'text', hidden:true},
//     {header: '제품 유형명', name:'prod_type_nm', width:150, filter:'text'},
//     {header: '품목UUID', name:'prod_uuid', width:150, filter:'text', hidden:true},
//     {header: '품번', name:'prod_no', width:150, filter:'text'},
//     {header: '거래처 품번', name:'partner_prod_no', width:200, filter:'text', editable:true, requiredField:true},
//     {header: '품목명', name:'prod_nm', width:200, filter:'text', requiredField:true},
//     {header: '모델UUID', name:'model_uuid', width:150, filter:'text', hidden:true},
//     {header: '모델코드', name:'model_cd', width:150, filter:'text', hidden:true},
//     {header: '모델명', name:'model_nm', width:200, filter:'text'},
//     {header: 'Rev', name:'rev', width:120, filter:'text'},
//     {header: '규격', name:'prod_std', width:150, filter:'text'},
//     {header: '단위UUID', name:'unit_uuid', width:150, filter:'text', hidden:true},
//     {header: '단위코드', name:'unit_cd', width:150, filter:'text', hidden:true},
//     {header: '단위명', name:'unit_nm', width:100, filter:'text', align:'center'},
//     {header: '비고', name:'remark', width:150, filter:'text', editable:true},
//   ],
//   data: [],
//   inputItems: [
//     {type:'text', id:'partner_uuid', label:'거래처UUID', disabled:true, hidden:true},
//     {type:'text', id:'partner_cd', label:'거래처코드', disabled:true, hidden:true},
//     {type:'text', id:'partner_nm', label:'거래처명', disabled:true},
//   ],
//   searchUriPath:'/std/partner-prods',
//   saveUriPath:'/std/partner-prods',
//   searchParams: {},
// };


// /** 신규 생성 팝업 그리드의 상태 초기값 */
// const newCreateGridInit = {
//   ...defaultNewCreateGridInit,
//   columns:detailGridInit.columns,
//   inputProps: {
//     inputItems: detailGridInit.inputItems
//   },
//   rowAddPopupInfo: {
//     columnNames:[
//       {original:'prod_uuid', popup:'prod_uuid'},
//       {original:'item_type_uuid', popup:'item_type_uuid'},
//       {original:'item_type_cd', popup:'item_type_cd'},
//       {original:'item_type_nm', popup:'item_type_nm'},
//       {original:'prod_type_uuid', popup:'prod_type_uuid'},
//       {original:'prod_type_cd', popup:'prod_type_cd'},
//       {original:'prod_type_nm', popup:'prod_type_nm'},
//       {original:'prod_no', popup:'prod_no'},
//       {original:'prod_nm', popup:'prod_nm'},
//       {original:'rev', popup:'rev'},
//       {original:'prod_std', popup:'prod_std'},
//       {original:'unit_uuid', popup:'unit_uuid'},
//       {original:'unit_cd', popup:'unit_cd'},
//       {original:'unit_nm', popup:'unit_nm'},
//     ],
//     columns: [
//       {header: '품목UUID', name:'prod_uuid', width:150, format:'text', hidden:true},
//       {header: '품목 유형UUID', name:'item_type_uuid', width:150, format:'text', hidden:true},
//       {header: '품목 유형코드', name:'item_type_cd', width:150, format:'text', hidden:true},
//       {header: '품목 유형명', name:'item_type_nm', width:200, format:'text'},
//       {header: '제품 유형UUID', name:'prod_type_uuid', width:150, format:'text', hidden:true},
//       {header: '제품 유형코드', name:'prod_type_cd', width:150, format:'text', hidden:true},
//       {header: '제품 유형명', name:'prod_type_nm', width:200, format:'text'},
//       {header: '품번', name:'prod_no', width:150, format:'text'},
//       {header: '품명', name:'prod_nm', width:200, format:'text'},
//       {header: '모델UUID', name:'model_uuid', width:150, format:'text', hidden:true},
//       {header: '모델코드', name:'model_cd', width:150, format:'text', hidden:true},
//       {header: '모델명', name:'model_nm', width:200, format:'text'},
//       {header: 'Rev', name:'rev', width:200, format:'text'},
//       {header: '규격', name:'prod_std', width:200, format:'text'},
//       {header: '안전재고', name:'inv_safe_qty', width:200, format:'text'},
//       {header: '단위UUID', name:'unit_uuid', width:150, format:'text', hidden:true},
//       {header: '단위코드', name:'unit_cd', width:150, format:'text', hidden:true},
//       {header: '단위명', name:'unit_nm', width:200, format:'text'},
//     ],
//     dataApiSettings: {
//       uriPath: '/std/prods',
//       params: {}
//     },
//     gridMode:'multi-select'
//   }
// };

// /** 신규 생성 팝업 그리드의 상태 초기값 */
// const newDetailCreateGridInit = {
//   ...defaultNewDetailCreateGridInit, 
//   columns:detailGridInit.columns, 
//   inputProps: {
//     inputItems: detailGridInit.inputItems
//   },
//   gridPopupInfo: detailGridInit.gridPopupInfo,
//   rowAddPopupInfo: newCreateGridInit.rowAddPopupInfo
// };
// //#endregion




// /** 거래처품목관리 */
// export const PgStdPartnerProd = () => {
//   //#region 🔶세팅 값

//   const inputRef = useRef<FormikProps<FormikValues>>();

//   const {headerGrid, detailGrid, newCreateGrid, newDetailCreateGrid} = baseHeaderDetailPage(headerGridInit, detailGridInit, newCreateGridInit, newDetailCreateGridInit);
//   const headerGridRef = headerGrid.content.gridRef;
//   const detailGridRef = detailGrid.content.gridRef;

//   const [,setLoading] = useLoadingState();

//   const [,setDetailCreatePopupVisible] = useRecoilState(afPopupVisible(newDetailCreateGrid.state.gridId));

//   const [clickedRowKey, setClickedRowKey] = useState(null);

//   const saveOptionParams = inputRef.current?.values;

//   //#endregion


//   /** 셀 클릭 트리거 */
//   const headerRowClickedValue = useMemo(() => {
//     if (clickedRowKey == null) return null;
//     return headerGridRef?.current?.getInstance().getValue(clickedRowKey, 'partner_uuid');
//   }, [clickedRowKey]);


//   /** 헤더 셀 클릭 변경되면 디테일 조회 */
//   useLayoutEffect(() => {
//     if (headerRowClickedValue != null) {
//       const {dispatch, content} = detailGrid;

//       const row = headerGridRef?.current?.getInstance().getRow(clickedRowKey);
//       inputRef.current.setValues(row);

//       const searchParams = {partner_uuid: headerRowClickedValue};
//       onSearch(content.gridRef, dispatch, content.searchUriPath, searchParams, content.gridItems.columns, setLoading);
      
//       setClickedRowKey(null);
//     }
//   }, [headerRowClickedValue]);


//   /** 헤더 데이터가 다시 조회되면 */
//   useLayoutEffect(() => {
//     const ref = headerGrid.content.gridRef;

//     ref?.current.getInstance().on('click', (ev) => {
//       const {rowKey, targetType} = ev as any;

//       if (targetType === 'cell') {
//         setClickedRowKey(rowKey)
//       }
//     });

//     return () => {
//       ref?.current?.getInstance().off('click');
//     }
//   }, [headerGrid]);



//   return (
//     <TpDoubleGrid
//       gridMode={detailGrid.state.gridMode}
//       createNewPopupGridItems={newCreateGrid.state}
//       createNewPopupGridRef={newCreateGrid.ref}
//       createDetailPopupGridItems={newDetailCreateGrid.state}
//       createDetailPopupGridRef={newDetailCreateGrid.ref}
//       parentGridRef={detailGridRef}

//       saveUriPath={detailGrid.state.saveUriPath}
//       saveOptionParams={saveOptionParams}

//       searchUriPath={detailGrid.state.searchUriPath}

//       inputProps={{
//         id:'inputItems',
//         inputItems:detailGridInit.inputItems,
//         innerRef: inputRef
//       }}

      
//       onShowDetailCreatePopup={() => {
//         if ([null, undefined, ''].includes(inputRef?.current?.values?.partner_uuid)) {
//           message.warn('거래처를 선택한 후 다시 시도해주세요.');
//         } else {
//           onShowDetailCreatePopup(setDetailCreatePopupVisible);
//         }
//       }}


//       newCreateBtnDisabled={true}

//       setParentData={headerGrid.dispatch}
      
//       header={headerGrid.content}
//       detail={detailGrid.content}
//     />
//   )
// }

import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { getPopupForm, useGrid } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getModifiedRows, getPageName, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';



/** 거래처 품목 관리 */
export const PgStdPartnerProd = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/partners';
  const headerSaveUriPath = '/std/partners';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/partner-prods';
  const detailSaveUriPath = '/std/partner-prods';
  const searchInitKeys = null;
  const dataSaveType = 'basic';
  const PROD_POPUP = getPopupForm('품목관리');

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header: '거래처UUID', name:'partner_uuid', alias:'uuid', width:ENUM_WIDTH.M, hidden:true},
    {header: '거래처유형UUID', name:'partner_type_uuid', alias:'uuid', width:ENUM_WIDTH.M, hidden:true},
    {header: '거래처유형', name:'partner_type_nm', width:ENUM_WIDTH.M, filter:'text', editable:true, requiredField:true},
    {header: '거래처명', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
  ], {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header: '거래처 품목UUID', name:'partner_prod_uuid', alias:'uuid', width:ENUM_WIDTH.M, hidden:true},
    {header: '거래처UUID', name:'partner_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '거래처유형UUID', name:'partner_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '거래처유형', name:'partner_type_nm', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.S, filter:'text', align:'center'},
    {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text'},
    {header: '거래처 품번', name:'partner_prod_no', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '품목', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', requiredField:true},
    {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, filter:'text'},
    {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, filter:'text', align:'center'},
    {header: '비고', name:'remark', width:ENUM_WIDTH.M, filter:'text', editable:true},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
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
      columns: PROD_POPUP?.datagridProps?.columns,
      dataApiSettings: {
        uriPath: PROD_POPUP?.uriPath,
        params: PROD_POPUP?.params,
      },
      gridMode:'multi-select'
    }
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', detailGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: detailGrid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: [
      { // FROM 단위
        columnNames: [
          {original:'from_unit_uuid', popup:'unit_uuid'},
          {original:'from_unit_nm', popup:'unit_nm'},
        ],
        popupKey:'단위관리',
        gridMode: 'select'
      },
      { // TO 단위
        columnNames: [
          {original:'to_unit_uuid', popup:'unit_uuid'},
          {original:'to_unit_nm', popup:'unit_nm'},
        ],
        popupKey:'단위관리',
        gridMode: 'select'
      },
    ],
    gridComboInfo: detailGrid.gridInfo.gridComboInfo,
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', detailGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    gridComboInfo: newDataPopupGrid.gridInfo.gridComboInfo,
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', detailGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    gridComboInfo: newDataPopupGrid.gridInfo.gridComboInfo,
  });

  /** 헤더 클릭 이벤트 */
  const onClickHeader = (ev) => {

    const {targetType, rowKey, instance} = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = (uuid, searchValues) => {
    if (!uuid) return;

    const searchParams = {
      ...searchValues,
      partner_uuid: uuid,
    }
    getData(searchParams, detailSearchUriPath).then((res) => {
      detailGrid.setGridData(res || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = null;
  const detailSearchInfo = null;

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(searchParams, headerSearchUriPath).then((res) => {
      data = res;
    }).finally(() => {
      setSelectedHeaderRow(null);
      headerGrid.setGridData(data);
    });

    return data;
  };

  const onSearchDetail = (uuid, searchValues) => {
    if (uuid == null) return;
    reloadDetailGrid(uuid, searchValues);
  }
  //#endregion


  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type:'text', id:'partner_uuid', label:'거래처UUID', disabled:true, hidden:true},
    {type:'text', id:'partner_cd', label:'거래처코드', disabled:true, hidden:true},
    {type:'text', id:'partner_nm', label:'거래처', disabled:true},
  ]);

  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', 
    JSON.parse(JSON.stringify(detailInputInfo.props?.inputItems))?.map(
      (el) => {
        el['disabled'] = false;
        return el;
      }
    )
  );

  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', detailInputInfo.props.inputItems);
  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', detailInputInfo.props.inputItems);
  //#endregion
  

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.partner_uuid, detailSearchInfo?.values);
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {

    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      // ❗ 세부 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      addDataPopupInputInfo.setValues(detailInputInfo.values);
    }

  }, [addDataPopupGridVisible, detailInputInfo.values]);
  
  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo.setValues(detailInputInfo.values);
      editDataPopupGrid.setGridData(detailGrid.gridInfo.data);
    }

  }, [editDataPopupGridVisible, detailInputInfo.values, detailGrid.gridInfo.data]);
  //#endregion

  const onSave = () => {
    const {gridRef, setGridMode} = detailGrid;
    const {columns, saveUriPath} = detailGrid.gridInfo;

    if (!detailInputInfo.isModified && !isModified(detailGrid.gridRef, detailGrid.gridInfo.columns)) {
      message.warn('편집된 데이터가 없습니다.');
      return;
    }
    
    dataGridEvents.onSave(dataSaveType, {
      gridRef,
      setGridMode,
      columns,
      saveUriPath,
    }, detailInputInfo.values, modal,
      () => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo?.values).then((searchResult) => {
          console.log()
          onAfterSaveAction(searchResult, selectedHeaderRow?.partner_uuid);
        });
      },
      true
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailInputInfo?.values.partner_uuid == null) {
      message.warn('단위를 선택하신 후 다시 시도해 주세요.');
      return false;
    };
    return true;
  }
  
  //#region 🔶작동될 버튼들의 기능 정의 (By Template) 
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo?.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (getModifiedRows(detailGrid.gridRef, detailGrid.gridInfo.columns)?.deletedRows?.length === 0) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },
    
    /** 신규 추가 */
    create: null,
    // create: () => {
    //   newDataPopupInputInfo?.instance?.resetForm();
    //   newDataPopupGrid?.setGridData([]);
    //   setNewDataPopupGridVisible(true);
    // },
    
    /** 상세 신규 추가 */
    createDetail: () => {
      if (!onCheckUuid()) return;
      setAddDataPopupGridVisible(true);
    },

    /** 저장(수정, 삭제) */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const {gridRef, setGridMode} = detailGrid;
      const {columns} = detailGrid.gridInfo;
      
      if (detailInputInfo.isModified || isModified(gridRef, columns)) { // 편집 이력이 있는 경우
        modal.confirm({
          title: '편집 취소',
          // icon: <ExclamationCircleOutlined />,
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk:() => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel:() => {
          },
          okText: '예',
          cancelText: '아니오',
        });

      } else { // 편집 이력이 없는 경우
        setGridMode('view');
      }
    },

    printExcel: dataGridEvents.printExcel
  };
  //#endregion


  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setNewDataPopupGridVisible(false);
  }

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setAddDataPopupGridVisible(false);
  }

  /** 수정 저장 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setEditDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.partner_uuid === uuid);
      
    if (!selectedRow) { selectedRow = searchResult[0]; }
    setSelectedHeaderRow(cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys));
  }

  //#region 🔶템플릿에 값 전달
  const props:ITpDoubleGridProps = {
    title,
    dataSaveType,
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader
      }, 
      detailGrid.gridInfo
    ],
    popupGridRefs: [newDataPopupGrid.gridRef, addDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfos: [
      {...newDataPopupGrid.gridInfo, saveParams: {...newDataPopupInputInfo.values}},
      {...addDataPopupGrid.gridInfo, saveParams: {...addDataPopupInputInfo.values}},
      {...editDataPopupGrid.gridInfo, saveParams: {...editDataPopupInputInfo.values}},
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props, 
        onSearch: onSearchHeader
      }, 
      {
        ...detailSearchInfo?.props,
        onSearch: (values) => onSearchDetail(selectedHeaderRow?.partner_uuid, values)
      }
    ],
    inputProps: [null, detailInputInfo.props],  
    popupVisibles: [newDataPopupGridVisible, addDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisibles: [setNewDataPopupGridVisible, setAddDataPopupGridVisible, setEditDataPopupGridVisible],
    popupSearchProps: [newDataPopupSearchInfo?.props, addDataPopupSearchInfo?.props, editDataPopupSearchInfo?.props],
    popupInputProps: [newDataPopupInputInfo?.props, addDataPopupInputInfo?.props, editDataPopupInputInfo?.props],
    buttonActions,
    modalContext,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
  };
  //#endregion


  return <TpDoubleGrid {...props}/>;
}

