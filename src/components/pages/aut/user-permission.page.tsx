import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getPageName, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';



/** 사용자별 권한 관리 */
export const PgAutUserPermission = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';

  const headerSearchUriPath = '/aut/users';
  const headerSaveUriPath = '/aut/users';
  const detailDefaultGridMode = 'view';
  const detailSearchUriPath = '/aut/user-permissions';
  const detailSaveUriPath = '/aut/user-permissions';

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type:'text', id:'user_uuid', label:'사용자UUID', disabled:true, hidden:true},
  ]);

  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', cloneObject(detailInputInfo?.inputItems));

  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', cloneObject(detailInputInfo?.inputItems));

  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', cloneObject(detailInputInfo?.inputItems));
  //#endregion


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header: '사용자UUID', name:'user_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '권한그룹UUID', name:'group_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '로그인ID', name:'id', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '성명', name:'user_nm', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
  ], {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header: '사용자별 메뉴권한UUID', width:ENUM_WIDTH.M, name:'user_permission_uuid', alias:'uuid', hidden:false},
    {header: '메뉴UUID', name:'menu_uuid', hidden:true},
    {header: '최상위 메뉴', width:ENUM_WIDTH.L, name:'first_menu_nm'},
    {header: '메뉴명', width:ENUM_WIDTH.L, name:'menu_nm'},
    {header: '정렬', width:ENUM_WIDTH.M, name:'sortby', hidden:true},
    {header: '메뉴유형UUID', width:ENUM_WIDTH.M, name:'menu_type_uuid', hidden:true},
    {header: '메뉴유형', width:ENUM_WIDTH.M, name:'menu_type_nm', hidden:true},
    {header: '권한UUID', width:ENUM_WIDTH.M, name:'permission_uuid', hidden:false},
    {header: '권한명', width:ENUM_WIDTH.M, name:'permission_nm', editable:true, format:'popup', requiredField:true},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
    disabledAutoDateColumn: true,
  });
  
  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', cloneObject(detailGrid.gridInfo.columns), {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    disabledAutoDateColumn: true,
    gridPopupInfo: [
      { // 권한기준
        columnNames: [
          {original:'permission_uuid', popup:'permission_uuid'},
          {original:'permission_nm', popup:'permission_nm'},
        ],
        columns: [
          {header: '권한UUID', width:ENUM_WIDTH.M, name:'permission_uuid', editable:true, hidden:true},
          {header: '권한명', width:ENUM_WIDTH.M, name:'permission_nm', editable:true},
        ],
        dataApiSettings: {
          uriPath: '/aut/permissions',
          params: {}
        },
        gridMode: 'select',
      },
    ],
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', cloneObject(detailGrid.gridInfo.columns), {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    disabledAutoDateColumn: true,
    gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', cloneObject(detailGrid.gridInfo.columns), {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    disabledAutoDateColumn: true,
    gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
    saveParams: editDataPopupInputInfo.values,
  });

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

    getData({
      user_uuid: uuid,
    }, detailSearchUriPath).then((res) => {
      detailGrid.setGridData(res || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', null);

  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', null);

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async (values) => {
    const searchParams = {};//cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(searchParams, headerSearchUriPath).then((res) => {
      data = res;
    }).finally(() => {
      detailInputInfo?.ref?.current?.resetForm();
      setSelectedHeaderRow(null);
      headerGrid.setGridData(data);
    });

    return data;
  };

  const onSearchDetail = (uuid) => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  }
  //#endregion

  


  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.user_uuid);
    }
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
        onSearchHeader(headerSearchInfo.values).then((searchResult) => {
          const headerRow = res.datas.raws[0].header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailInputInfo?.values.user_uuid == null) {
      message.warn('전표를 선택하신 후 다시 시도해 주세요.');
      return false;
    };
    return true;
  }
  
  //#region 🔶작동될 버튼들의 기능 정의 (By Template) 
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: null,
    
    /** 신규 추가 */
    create: null,
    
    /** 상세 신규 추가 */
    createDetail: null,

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
    const savedUuid = savedData[0]?.user_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setNewDataPopupGridVisible(false);
  }

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.user_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setEditDataPopupGridVisible(false);
  }

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.user_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setAddDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.user_uuid === uuid);
      
    if (!selectedRow) { selectedRow = searchResult[0]; }
    setSelectedHeaderRow(cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys));
  }

  //#region 🔶템플릿에 값 전달
  const props:ITpDoubleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader,
      }, 
      detailGrid.gridInfo
    ],
    popupGridRefs: [newDataPopupGrid.gridRef, addDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfos: [newDataPopupGrid.gridInfo, addDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
    searchProps: [
      {
        ...headerSearchInfo?.props, 
        onSearch: onSearchHeader
      }, 
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.user_uuid)
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
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion


  return <TpDoubleGrid {...props}/>;
}

