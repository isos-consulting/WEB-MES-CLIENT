import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { useGrid } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getModifiedRows, getPageName, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';



/** 단위 변환값 관리 */
export const PgStdUnitConvert = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/units';
  const headerSaveUriPath = '/std/units';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/unit-converts';
  const detailSaveUriPath = '/std/unit-converts';
  const searchInitKeys = null;
  const dataSaveType = 'basic';

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header: '단위UUID', name:'unit_uuid', alias:'uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header: '단위변환UUID', name:'unit_convert_uuid', alias:'uuid', width:ENUM_WIDTH.M, format:'text', hidden:true},
    // {header: 'From 단위UUID', name:'from_unit_uuid', width:ENUM_WIDTH.M, format:'popup', hidden:true, requiredField:true},
    // {header: 'From 단위명', name:'from_unit_nm', width:ENUM_WIDTH.L, format:'popup', editable:true},
    {header: 'To 단위UUID', name:'to_unit_uuid', width:ENUM_WIDTH.M, format:'popup', hidden:true, requiredField:true},
    {header: 'To 단위명', name:'to_unit_nm', width:ENUM_WIDTH.L, format:'popup', editable:true},
    {header: 'from 값', name:'from_value', width:ENUM_WIDTH.L, format:'number', editable:true, requiredField:true},
    {header: 'to 값', name:'to_value', width:ENUM_WIDTH.L, format:'number', editable:true, requiredField:true},
    {header: '변환값', name:'convert_value', width:ENUM_WIDTH.L, format:'number', editable:true, hidden: true},
    {header: '비고', name:'remark', width:ENUM_WIDTH.L, format:'text', editable:true},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', detailGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
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
      unit_uuid: uuid,
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
    {type:'text', id:'unit_uuid', label:'선택단위UUID', alias:'from_unit_uuid', disabled:true, hidden:true},
    {type:'text', id:'unit_nm', label:'단위', alias:'from_unit_nm', disabled:true},
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
    onSearchDetail(selectedHeaderRow?.unit_uuid, detailSearchInfo?.values);
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
          onAfterSaveAction(searchResult, selectedHeaderRow?.unit_uuid);
        });
      },
      true
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailInputInfo?.values.unit_uuid == null) {
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
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setNewDataPopupGridVisible(false);
  }

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setAddDataPopupGridVisible(false);
  }

  /** 수정 저장 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => onAfterSaveAction(searchResult, savedUuid));
    setEditDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.unit_uuid === uuid);
      
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
        onSearch: (values) => onSearchDetail(selectedHeaderRow?.unit_uuid, values)
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

