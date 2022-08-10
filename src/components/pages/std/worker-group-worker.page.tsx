import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  cloneObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  isModified,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';
import { cloneDeep } from 'lodash';

/** 작업조별 작업자 관리 */
export const PgStdWorkerGroupWorker = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';

  const headerSearchUriPath = '/std/worker-groups';
  const headerSaveUriPath = '/std/worker-groups';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/worker-group-emps';
  const detailSaveUriPath = '/std/worker-group-emps';

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'worker_group_uuid',
      label: '작업조UUID',
      disabled: true,
      hidden: true,
    },
    { type: 'text', id: 'worker_group_nm', label: '작업조명', disabled: true },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneObject(detailInputInfo.props.inputItems),
  );
  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    cloneObject(detailInputInfo.props.inputItems),
  );
  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneObject(detailInputInfo.props.inputItems),
  );
  //#endregion

  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '작업조UUID',
        name: 'worker_group_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '작업조명',
        name: 'worker_group_nm',
        width: ENUM_WIDTH.XL,
        filter: 'text',
      },
    ],
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      gridMode: headerDefaultGridMode,
      // disabledAutoDateColumn: true,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '작업조-작업자UUID',
        name: 'worker_group_emp_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '작업자UUID',
        name: 'emp_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '사원명',
        name: 'emp_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        requiredField: true,
      },
      { header: '비고', name: 'remark', width: ENUM_WIDTH.L, editable: true },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
      gridPopupInfo: [
        {
          columnNames: [
            { original: 'emp_uuid', popup: 'emp_uuid' },
            { original: 'emp_nm', popup: 'emp_nm' },
          ],
          columns: [
            {
              header: '사원UUID',
              name: 'emp_uuid',
              width: ENUM_WIDTH.M,
              hidden: true,
              requiredField: true,
            },
            { header: '사번', name: 'emp_cd', width: ENUM_WIDTH.M },
            { header: '사원명', name: 'emp_nm', width: ENUM_WIDTH.L },
          ],
          dataApiSettings: {
            uriPath: '/std/emps',
            params: {
              emp_status: 'incumbent',
              worker_fg: true,
            },
          },
          gridMode: 'select',
        },
      ],
      saveParams: detailInputInfo.values,
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns),
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      saveParams: newDataPopupInputInfo?.values,
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: detailGrid?.gridInfo?.gridPopupInfo[0],
      gridPopupInfo: detailGrid?.gridInfo?.gridPopupInfo,
      saveParams: addDataPopupInputInfo?.values,
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns)?.map(el => {
      if (el?.name === 'worker_nm') el['editable'] = false;

      return el;
    }),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridPopupInfo: detailGrid?.gridInfo?.gridPopupInfo,
      saveParams: editDataPopupInputInfo?.values,
    },
  );

  /** 헤더 클릭 이벤트 */
  const onClickHeader = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = uuid => {
    if (!uuid) return;

    getData(
      {
        worker_group_uuid: uuid,
      },
      detailSearchUriPath,
    ).then(res => {
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
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(values, Object.keys(values));

    let data = [];
    await getData(searchParams, headerSearchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        detailInputInfo.ref.current.resetForm();
        setSelectedHeaderRow(null);
        headerGrid.setGridData(data);
      });

    return data;
  };

  const onSearchDetail = uuid => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  };
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.worker_group_uuid);
    }
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {
      // 신규 등록 팝업 나타났을 때 기능 추가할 것
    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      // ❗ 세부 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      addDataPopupInputInfo.setValues(
        cloneDeep(detailInputInfo.ref.current.values),
      );
    }
  }, [addDataPopupGridVisible, detailInputInfo.values]);

  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo.setValues(
        cloneDeep(detailInputInfo.ref.current.values),
      );
      editDataPopupGrid.setGridData(detailGrid.gridInfo.data);
    }
  }, [
    editDataPopupGridVisible,
    detailInputInfo.values,
    detailGrid.gridInfo.data,
  ]);
  //#endregion

  const onSave = () => {
    const { gridRef, setGridMode } = detailGrid;
    const { columns, saveUriPath } = detailGrid.gridInfo;

    if (
      !detailInputInfo.isModified &&
      !isModified(detailGrid.gridRef, detailGrid.gridInfo.columns)
    ) {
      message.warn('편집된 데이터가 없습니다.');
      return;
    }

    dataGridEvents.onSave(
      'basic',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.values,
      modal,
      ({ success, savedData }) => {
        if (!success) return;
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then(searchResult => {
          if (!savedData) return;

          const headerRow = savedData[0];
          onAfterSaveAction(searchResult, headerRow?.worker_group_uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values.worker_group_uuid == null) {
      message.warn('작업조를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

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
    delete: () => {
      if (
        getModifiedRows(detailGrid.gridRef, detailGrid.gridInfo.columns)
          ?.deletedRows?.length === 0
      ) {
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
      const { gridRef, setGridMode } = detailGrid;
      const { columns } = detailGrid.gridInfo;

      if (detailInputInfo.isModified || isModified(gridRef, columns)) {
        // 편집 이력이 있는 경우
        modal.confirm({
          title: '편집 취소',
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk: () => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel: () => {
            // this function will be executed when cancel button is clicked
          },
          okText: '예',
          cancelText: '아니오',
        });
      } else {
        // 편집 이력이 없는 경우
        setGridMode('view');
      }
    },

    printExcel: dataGridEvents.printExcel,
  };
  //#endregion

  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.worker_group_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.worker_group_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.worker_group_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.worker_group_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys),
    );
  };

  //#region 🔶템플릿에 값 전달
  const props: ITpDoubleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader,
      },
      detailGrid.gridInfo,
    ],
    popupGridRefs: [
      newDataPopupGrid.gridRef,
      addDataPopupGrid.gridRef,
      editDataPopupGrid.gridRef,
    ],
    popupGridInfos: [
      newDataPopupGrid.gridInfo,
      addDataPopupGrid.gridInfo,
      editDataPopupGrid.gridInfo,
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props,
        onSearch: onSearchHeader,
      },
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.worker_group_uuid),
      },
    ],
    inputProps: [null, detailInputInfo.props],
    popupVisibles: [
      newDataPopupGridVisible,
      addDataPopupGridVisible,
      editDataPopupGridVisible,
    ],
    setPopupVisibles: [
      setNewDataPopupGridVisible,
      setAddDataPopupGridVisible,
      setEditDataPopupGridVisible,
    ],
    popupSearchProps: [
      newDataPopupSearchInfo?.props,
      addDataPopupSearchInfo?.props,
      editDataPopupSearchInfo?.props,
    ],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      addDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],
    buttonActions,
    modalContext,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion

  return <TpDoubleGrid {...props} />;
};
