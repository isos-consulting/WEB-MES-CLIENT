import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { useGrid } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpTripleGrid } from '~/components/templates/grid-triple/grid-triple.template';
import ITpTripleGridProps from '~/components/templates/grid-triple/grid-triple.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';


/** BOM 관리 */
export const PgStdBom = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/prods';
  // const headerSaveUriPath = '/mat/orders';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/boms';
  const detailSaveUriPath = '/std/boms';
  const detailSubSearchUriPath = '/std/boms';
  const searchInitKeys = ['start_date', 'end_date'];

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header:'품목UUID', name:'prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header:'모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: headerSearchUriPath,
    searchParams: { 
      'use_fg': true,
    },
    saveUriPath: null,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header:'BOMUUID', name:'bom_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'품목UUID', name:'c_prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true, requiredField:true},
    {header:'품목유형명', name:'c_item_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'제품유형명', name:'c_prod_type_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'품번', name:'c_prod_no', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'품목명', name:'c_prod_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'Rev', name:'c_rev', width:ENUM_WIDTH.S, filter:'text', editable:true, format:'popup'},
    {header:'모델명', name:'c_model_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'규격', name:'c_prod_std', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header:'단위UUID', name:'c_unit_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup', hidden: true, requiredField:true},
    {header:'단위명', name:'c_unit_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '소요량', name:'c_usage', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_USE_STOCK, requiredField: true},
    {header: '소모창고UUID', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true, requiredField:true},
    {header: '소모창고', name:'store_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '소모위치UUID', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '소모위치', name:'location_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
    height: 250
  });

  const detailSubGrid = useGrid('DETAIL_SUB_GRID', [
    {header:'BOMUUID', name:'bom_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'완제품품목UUID', name:'main_prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'품목UUID', name:'prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'레벨', name:'lv', width:ENUM_WIDTH.M, filter:'text'},
    {header:'품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header:'모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '소요량', name:'c_usage', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_USE_STOCK},
    {header: '소요량', name:'t_usage', width:ENUM_WIDTH.M, editable:true, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_USE_STOCK},
    {header: '소모창고UUID', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '소모창고', name:'store_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
    {header: '소모위치UUID', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', editable:true, hidden:true},
    {header: '소모위치', name:'location_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, format:'popup'},
  ], {
    searchUriPath: detailSubSearchUriPath,
    saveUriPath: null,
    gridMode: detailDefaultGridMode,
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = [];
  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', 
    cloneObject(detailGrid.gridInfo.columns)?.map(el => {
      if (el?.name === 'c_unit_uuid')
        el['alias'] = 'unit_uuid';
      return el;
    }), {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: {
      columnNames:[
        {original:'c_prod_uuid', popup:'prod_uuid'},
        {original:'c_item_type_nm', popup:'item_type_nm'},
        {original:'c_prod_type_nm', popup:'prod_type_nm'},
        {original:'c_prod_no', popup:'prod_no'},
        {original:'c_prod_nm', popup:'prod_nm'},
        {original:'c_model_nm', popup:'model_nm'},
        {original:'c_rev', popup:'rev'},
        {original:'c_prod_std', popup:'prod_std'},
        {original:'c_unit_uuid', popup:'unit_uuid'},
        {original:'c_unit_nm', popup:'unit_nm'},
      ],
      columns: [
        {header: '품목UUID', name:'prod_uuid', format:'text', hidden:true},
        {header: '품목 유형UUID', name:'item_type_uuid', format:'text', hidden:true},
        {header: '품목 유형코드', name:'item_type_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '제품 유형UUID', name:'prod_type_uuid', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '모델UUID', name:'model_uuid', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, format:'text'},
        {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, format:'text'},
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
        {header: '단위UUID', name:'unit_uuid', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, format:'text'},
      ],
      dataApiSettings: () => {
        type TParams = {use_fg?:boolean};
        let inputValues = null;
        let params:TParams = {};

        if (newDataPopupGridVisible) { // 신규 등록 팝업일 경우
          inputValues = newDataPopupInputInfo.values;

        } else { // 세부 항목 등록 팝업일 경우
          inputValues = addDataPopupInputInfo.values;
        }

        if (inputValues != null) {
          params = {
            use_fg: true,
          };
        }

        return {
          uriPath: '/std/prods',
          params,
        }
      },
      gridMode:'multi-select'
    },
    gridPopupInfo: [
      { // 단위팝업
        columnNames: [
          {original:'c_unit_uuid', popup:'unit_uuid'},
          {original:'c_unit_nm', popup:'unit_nm'},
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
      { // 창고팝업
        columnNames: [
          {original:'from_store_uuid', popup:'store_uuid'},
          {original:'store_nm', popup:'store_nm'},
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
          {original:'from_location_uuid', popup:'location_uuid'},
          {original:'location_nm', popup:'location_nm'},
        ],
        columns: [
          {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: (ev) => {
          const {rowKey, instance} = ev;
          const {rawData} = instance?.store?.data;
      
          const storeUuid = rawData[rowKey]?.from_store_uuid
          return {
            uriPath: '/std/locations',
            params: {store_uuid: storeUuid ?? ''}
          }
        },
        gridMode:'select'
      }
    ],
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns)?.map(el => {
        if (el?.name === 'c_unit_uuid')
          el['alias'] = 'unit_uuid';
        return el;
    }),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: addDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: addDataPopupGrid.gridInfo.gridPopupInfo,
    }
  );

  /** 헤더 클릭 이벤트 */
  const onClickHeader = (ev) => {

    const {targetType, rowKey, instance} = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = (uuid) => {
    if (!uuid) return;

    const uriPath = `/std/boms?p_prod_uuid=${uuid}`;
    getData(null, uriPath, 'raws').then((res) => {
      detailGrid.setGridData(res || []);
    });
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailSubGrid = (uuid) => {
    if (!uuid) return;

    const uriPath = `/std/boms/trees?prod_uuid=${uuid}`;
    getData(null, uriPath, 'raws').then((res) => {
      detailSubGrid.setGridData(res || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  // const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', []);
  const headerSearchInfo = null;
  const detailSearchInfo = null;
  const detailSubSearchInfo = null;

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

  const onSearchDetail = (uuid) => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
    reloadDetailSubGrid(uuid);
  }
  //#endregion


  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {type:'text', id:'prod_no', label:'품번', disabled:true},
    {type:'text', id:'prod_nm', label:'품명', disabled:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true},
  ]);

  const newDataPopupInputInfo = null;
  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', detailInputInfo.props.inputItems);
  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', detailInputInfo.props.inputItems);
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.prod_uuid);
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
    
    dataGridEvents.onSave('basic', {
      gridRef,
      setGridMode,
      columns,
      saveUriPath,
    }, detailInputInfo.values, modal,
      (res) => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo?.values).then((searchResult) => {
          const headerRow = res.savedData[0];
          onAfterSaveAction(searchResult, headerRow?.prod_uuid);
        });
      },
      true
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailInputInfo?.values.prod_uuid == null) {
      message.warn('품목을 선택하신 후 다시 시도해 주세요.');
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
  const onAfterSaveNewData = null;

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.p_prod_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setAddDataPopupGridVisible(false);
  }

  /** 세부항목 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.p_prod_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setEditDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.prod_uuid === uuid);
      
    if (!selectedRow) { selectedRow = searchResult[0]; }
    setSelectedHeaderRow(cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys));
  }

  //#region 🔶템플릿에 값 전달
  const props:ITpTripleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef, detailSubGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader
      }, 
      detailGrid.gridInfo,
      detailSubGrid.gridInfo,
    ],
    popupGridRefs: [null, addDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfos: [
      null,
      {
        ...addDataPopupGrid.gridInfo,
        saveParams: {
          p_prod_uuid: addDataPopupInputInfo?.values?.prod_uuid
        }
      },
      {
        ...editDataPopupGrid.gridInfo,
      }],
    searchProps: [
      {
        ...headerSearchInfo?.props, 
        onSearch: onSearchHeader
      }, 
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.prod_uuid)
      },
      {
        ...detailSubSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.prod_uuid)
      }
    ],
    inputProps: [null, detailInputInfo.props, null],  
    popupVisibles: [newDataPopupGridVisible, addDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisibles: [setNewDataPopupGridVisible, setAddDataPopupGridVisible, setEditDataPopupGridVisible],
    popupSearchProps: [newDataPopupSearchInfo?.props, addDataPopupSearchInfo?.props, editDataPopupSearchInfo?.props],
    popupInputProps: [newDataPopupInputInfo?.props, addDataPopupInputInfo?.props, editDataPopupInputInfo?.props],
    buttonActions,
    modalContext,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion

  return <TpTripleGrid {...props}/>;
}

