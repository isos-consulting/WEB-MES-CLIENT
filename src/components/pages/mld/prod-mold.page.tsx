import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { IGridPopupInfo, useGrid } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { ENUM_WIDTH, URL_PATH_MLD } from '~/enums';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getPageName,
  isModified,
} from '~/functions';
import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { GridInstance } from '~/v2/core/ToastGrid';
import { MoldProductService } from '~/v2/service/MoldProductService';
import { ServiceUtil } from '~/v2/util/CallbackServices';
import { DialogUtil } from '~/v2/util/DialogUtil';

/** 품목별 금형정보 */
export const PgMldProdMold = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/prods';
  const headerSaveUriPath = '/std/prods';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = URL_PATH_MLD.PROD_MOLD.GET.PROD_MOLDS;
  const detailSaveUriPath = URL_PATH_MLD.PROD_MOLD.PUT.PROD_MOLDS;
  const searchInitKeys = null;
  const dataSaveType = 'basic';

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '품목 유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목 유형명',
        name: 'item_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '제품 유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품 유형명',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
      { header: '리비전', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
      { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
      },
    ],
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      gridMode: headerDefaultGridMode,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '품목별 금형정보UUID',
        name: 'prod_mold_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목 유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품목 유형명',
        name: 'item_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품 유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품 유형명',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '리비전',
        name: 'rev',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '금형UUID',
        name: 'mold_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '금형코드',
        name: 'mold_cd',
        width: ENUM_WIDTH.M,
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '금형명',
        name: 'mold_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
    },
  );

  const moldPopupInfo: IGridPopupInfo = {
    columnNames: [
      { original: 'mold_uuid', popup: 'mold_uuid' },
      { original: 'mold_cd', popup: 'mold_cd' },
      { original: 'mold_nm', popup: 'mold_nm' },
    ],
    columns: [
      {
        header: '금형UUID',
        name: 'mold_uuid',
        width: ENUM_WIDTH.M,
        format: 'text',
        hidden: true,
      },
      {
        header: '금형코드',
        name: 'mold_cd',
        width: ENUM_WIDTH.M,
        format: 'text',
      },
      {
        header: '금형명',
        name: 'mold_nm',
        width: ENUM_WIDTH.L,
        format: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: URL_PATH_MLD.MOLD.GET.MOLDS,
      params: {},
    },
    gridMode: 'multi-select',
  };

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      rowAddPopupInfo: moldPopupInfo,
      gridPopupInfo: [moldPopupInfo],
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
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

    const searchParams = {
      ...detailSearchInfo?.values,
      prod_uuid: uuid,
    };
    getData(searchParams, detailSearchUriPath).then(res => {
      detailGrid.setGridData(res || []);
    });
  };

  /** 조회조건 View */
  const headerSearchInfo = null;
  const detailSearchInfo = null;

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(searchParams, headerSearchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        setSelectedHeaderRow(null);
        headerGrid.setGridData(data);
      });

    return data;
  };

  const onSearchDetail = uuid => {
    if (isNil(uuid)) return;
    reloadDetailGrid(uuid);
  };

  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'prod_uuid',
      label: '품목UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'prod_no',
      label: '품번',
      disabled: true,
      hidden: true,
      required: true,
    },
    {
      type: 'text',
      id: 'prod_nm',
      label: '품명',
      disabled: true,
      required: true,
    },
    {
      type: 'text',
      id: 'item_type_uuid',
      label: '품목 유형UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'item_type_nm',
      label: '품목 유형명',
      disabled: true,
    },
    {
      type: 'text',
      id: 'prod_type_uuid',
      label: '제품 유형UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'prod_type_nm',
      label: '제품 유형명',
      disabled: true,
    },
    {
      type: 'text',
      id: 'model_uuid',
      label: '모델UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'model_nm',
      label: '모델명',
      disabled: true,
    },
    {
      type: 'text',
      id: 'rev',
      label: '리비전',
      disabled: true,
    },
    {
      type: 'text',
      id: 'prod_std',
      label: '규격',
      disabled: true,
    },
    {
      type: 'text',
      id: 'unit_uuid',
      label: '단위UUID',
      disabled: true,
      hidden: true,
    },
    { type: 'text', id: 'unit_nm', label: '단위명', disabled: true },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      el['disabled'] = false;
      return el;
    }),
  );

  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    detailInputInfo.props.inputItems,
  );
  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    detailInputInfo.props.inputItems,
  );

  useLayoutEffect(() => {
    if (isNil(selectedHeaderRow)) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.prod_uuid);
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
      dataSaveType,
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.values,
      modal,
      () => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo?.values).then(searchResult => {
          onAfterSaveAction(searchResult, selectedHeaderRow?.prod_uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (isNil(detailInputInfo?.values.prod_uuid)) {
      message.warn('공정을 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

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
      DialogUtil.valueOf(modal).confirm({
        title: MESSAGE.MOLD_PRODUCT_DELETE,
        message: MESSAGE.MOLD_PRODUCT_DELETE_QUESTION,
        onOk: () => {
          ServiceUtil.getInstance()
            .callMethod(
              MoldProductService.getInstance().delete,
              detailGrid.gridRef as React.MutableRefObject<Grid>,
            )
            .then(_ => {
              message.success(MESSAGE.MOLD_PRODUCT_DELETE_SUCCESS);
              onSearchHeader(headerSearchInfo?.values).then(searchResult => {
                onAfterSaveAction(searchResult, selectedHeaderRow?.prod_uuid);
              });
            })
            .catch((error: unknown) => {
              message.error(error.toString());
            });
        },
      });
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

  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.prod_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setNewDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.prod_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setAddDataPopupGridVisible(false);
  };

  /** 수정 저장 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.prod_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setEditDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.prod_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys),
    );
  };

  const props: ITpDoubleGridProps = {
    title,
    dataSaveType,
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
      {
        ...newDataPopupGrid.gridInfo,
        saveParams: newDataPopupInputInfo.values,
      },
      {
        ...addDataPopupGrid.gridInfo,
        saveParams: addDataPopupInputInfo.values,
        onOk: clickEvent => {
          const instance = (
            clickEvent as unknown as React.MutableRefObject<Grid>
          ).current.getInstance();

          MoldProductService.getInstance()
            .createWithUuid(
              instance as GridInstance,
              detailInputInfo.values.prod_uuid,
            )
            .then(_ => {
              message.success(MESSAGE.MOLD_PRODUCT_CREATE_SUCCESS);
              onAfterSaveAddData(true, [
                { prod_uuid: detailInputInfo.values.prod_uuid },
              ]);
            })
            .catch((error: unknown) => {
              console.error(error);
              message.error(error.toString());
            });
        },
      },
      {
        ...editDataPopupGrid.gridInfo,
        saveParams: editDataPopupInputInfo.values,
        onOk: clickEvent => {
          const instance = (
            clickEvent as unknown as React.MutableRefObject<Grid>
          ).current.getInstance();

          MoldProductService.getInstance()
            .update(instance as GridInstance)
            .then(_ => {
              message.success(MESSAGE.MOLD_PRODUCT_CREATE_SUCCESS);
              onAfterSaveEditData(true, [
                { prod_uuid: detailInputInfo.values.prod_uuid },
              ]);
            })
            .catch((error: unknown) => {
              console.error(error);
              message.error(error.toString());
            });
        },
      },
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props,
        onSearch: onSearchHeader,
      },
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.prod_uuid),
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
    onAfterOkAddDataPopup: onAfterSaveAddData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
  };

  return <TpDoubleGrid {...props} />;
};
