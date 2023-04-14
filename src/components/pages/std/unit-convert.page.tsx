import { Modal, message } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { getPopupForm, useGrid } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getPageName,
  isModified,
} from '~/functions';
import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { GridRef } from '~/v2/core/ToastGrid';
import { UnitConvertService } from '~/v2/service/UnitConvertService';
import { ServiceUtil } from '~/v2/util/CallbackServices';
import { DialogUtil } from '~/v2/util/DialogUtil';

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
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '단위UUID',
        name: 'unit_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위코드',
        name: 'unit_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
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
        header: '단위변환UUID',
        name: 'unit_convert_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        format: 'text',
        hidden: true,
      },
      {
        header: 'To 단위UUID',
        name: 'to_unit_uuid',
        width: ENUM_WIDTH.M,
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '변환단위',
        name: 'to_unit_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: 'from 값',
        name: 'from_value',
        width: ENUM_WIDTH.L,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_UNIT_CHANGE,
        defaultValue: 1,
        editable: true,
        requiredField: true,
      },
      {
        header: 'to 값',
        name: 'to_value',
        width: ENUM_WIDTH.L,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_UNIT_CHANGE,
        defaultValue: 1,
        editable: true,
        requiredField: true,
      },
      {
        header: '변환값',
        name: 'convert_value',
        width: ENUM_WIDTH.L,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_UNIT_CHANGE,
        editable: true,
        defaultValue: 1,
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        format: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
      onAfterChange: ev => {
        const { changes, instance, origin } = ev;
        if (
          origin !== 'cell' ||
          !['from_value', 'to_value'].includes(changes[0].columnName)
        )
          return;
        const rowData = instance.getRow(changes[0].rowKey);
        const fromValue = Number(rowData.from_value);
        const toValue = Number(rowData.to_value);

        instance.setValue(
          changes[0].rowKey,
          'convert_value',
          toValue / fromValue,
        );
      },
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridPopupInfo: [
        {
          // TO 단위
          columnNames: [
            { original: 'to_unit_uuid', popup: 'unit_uuid' },
            { original: 'to_unit_nm', popup: 'unit_nm' },
          ],
          columns: getPopupForm('단위관리').datagridProps.columns,
          dataApiSettings: {
            uriPath: getPopupForm('단위관리').uriPath,
            params: {},
            onBeforeOk: (ev, chkRow) => {
              let dataChk: boolean = false;
              let unit_uuid: string;
              const rowUnitUuid: string = chkRow[0]?.unit_uuid;
              if (newDataPopupGridVisible) {
                unit_uuid = newDataPopupInputInfo?.values?.unit_uuid;
              } else if (addDataPopupGridVisible) {
                unit_uuid = addDataPopupInputInfo?.values?.unit_uuid;
              } else if (editDataPopupGridVisible) {
                unit_uuid = editDataPopupInputInfo?.values?.unit_uuid;
              }
              if (rowUnitUuid && rowUnitUuid !== unit_uuid) {
                dataChk = true;
              }
              if (!dataChk) {
                message.warning(
                  '대상단위와 동일한 품목 단위입니다. 확인 후 다시 입력해주세요.',
                );
              }
              return dataChk;
            },
            onAfterOk: ({ ev, parentGrid, popupGrid }, checkedRows) => {
              parentGrid.setValue(ev.rowKey, 'prod_uuid', '');
              parentGrid.setValue(ev.rowKey, 'item_type_nm', '');
              parentGrid.setValue(ev.rowKey, 'prod_type_nm', '');
              parentGrid.setValue(ev.rowKey, 'prod_no', '');
              parentGrid.setValue(ev.rowKey, 'prod_nm', '');
              parentGrid.setValue(ev.rowKey, 'rev', '');
              parentGrid.setValue(ev.rowKey, 'model_nm', '');
              parentGrid.setValue(ev.rowKey, 'prod_std', '');
            },
          },
          gridMode: 'select',
        },
        {
          columnNames: [
            { original: 'prod_uuid', popup: 'prod_uuid' },
            { original: 'item_type_nm', popup: 'item_type_nm' },
            { original: 'prod_type_nm', popup: 'prod_type_nm' },
            { original: 'prod_no', popup: 'prod_no' },
            { original: 'prod_nm', popup: 'prod_nm' },
            { original: 'rev', popup: 'rev' },
            { original: 'model_nm', popup: 'model_nm' },
            { original: 'prod_std', popup: 'prod_std' },
            { original: 'to_unit_uuid', popup: 'unit_uuid' },
            { original: 'to_unit_nm', popup: 'unit_nm' },
          ],
          columns: [
            {
              header: '품목UUID',
              name: 'prod_uuid',
              format: 'text',
              hidden: true,
            },
            {
              header: '품목유형',
              name: 'item_type_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '제품유형',
              name: 'prod_type_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '품번',
              name: 'prod_no',
              width: ENUM_WIDTH.M,
              format: 'text',
            },
            { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, format: 'text' },
            {
              header: '품명',
              name: 'prod_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '모델',
              name: 'model_nm',
              width: ENUM_WIDTH.M,
              format: 'text',
            },
            {
              header: '규격',
              name: 'prod_std',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '단위UUID',
              name: 'unit_uuid',
              format: 'text',
              hidden: true,
            },
            {
              header: '단위코드',
              name: 'unit_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '단위명',
              name: 'unit_nm',
              width: ENUM_WIDTH.M,
              format: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/prods',
            params: {
              use_fg: true,
            },
            onBeforeOk: (ev, chkRow) => {
              let dataChk: boolean = false;
              let unit_uuid: string;
              const rowUnitUuid: string = chkRow[0]?.unit_uuid;
              if (newDataPopupGridVisible) {
                unit_uuid = newDataPopupInputInfo?.values?.unit_uuid;
              } else if (addDataPopupGridVisible) {
                unit_uuid = addDataPopupInputInfo?.values?.unit_uuid;
              } else if (editDataPopupGridVisible) {
                unit_uuid = editDataPopupInputInfo?.values?.unit_uuid;
              }
              if (rowUnitUuid && rowUnitUuid !== unit_uuid) {
                dataChk = true;
              }
              if (!dataChk) {
                message.warning(
                  '대상단위와 동일한 품목 단위입니다. 확인 후 다시 입력해주세요.',
                );
              }
              return dataChk;
            },
          },
          gridMode: 'select',
        },
      ],
      gridComboInfo: detailGrid.gridInfo.gridComboInfo,
      onAfterChange: detailGrid.gridInfo.onAfterChange,
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
      gridComboInfo: newDataPopupGrid.gridInfo.gridComboInfo,
      onAfterChange: detailGrid.gridInfo.onAfterChange,
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
      gridComboInfo: newDataPopupGrid.gridInfo.gridComboInfo,
      onAfterChange: detailGrid.gridInfo.onAfterChange,
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
  const reloadDetailGrid = (uuid, searchValues) => {
    if (!uuid) return;

    const searchParams = {
      ...searchValues,
      unit_uuid: uuid,
    };
    getData(searchParams, detailSearchUriPath).then(res => {
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

  const onSearchDetail = (uuid, searchValues) => {
    if (isNil(uuid)) return;
    reloadDetailGrid(uuid, searchValues);
  };
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'unit_uuid',
      label: '선택단위UUID',
      alias: 'from_unit_uuid',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'unit_nm',
      label: '단위',
      alias: 'from_unit_nm',
      disabled: true,
    },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    JSON.parse(JSON.stringify(detailInputInfo.props?.inputItems))?.map(el => {
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
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (isNil(selectedHeaderRow)) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.unit_uuid, detailSearchInfo?.values);
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
          onAfterSaveAction(searchResult, selectedHeaderRow?.unit_uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (isNil(detailInputInfo?.values.unit_uuid)) {
      message.warn('단위를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

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
      DialogUtil.valueOf(modal).confirm({
        title: MESSAGE.UNIT_CONVERT_DELETE,
        message: MESSAGE.UNIT_CONVERT_DELETE_QUESTION,
        onOk: () => {
          ServiceUtil.getInstance()
            .callMethod(
              UnitConvertService.getInstance().deleteUnitConvert,
              detailGrid.gridRef,
            )
            .then(_ => {
              message.success(MESSAGE.UNIT_CONVERT_DELETE_SUCCESS);
              onSearchDetail(selectedHeaderRow?.unit_uuid, {});
            })
            .catch((error: unknown) => {
              message.warn(error.toString());
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
  //#endregion

  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setNewDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setAddDataPopupGridVisible(false);
  };

  /** 수정 저장 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.unit_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setEditDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.unit_uuid === uuid);

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
        saveParams: { from_unit_uuid: newDataPopupInputInfo.values.unit_uuid },
      },
      {
        ...addDataPopupGrid.gridInfo,
        saveParams: { from_unit_uuid: addDataPopupInputInfo.values.unit_uuid },
        onOk: (unitConvertGridRef: GridRef) => {
          UnitConvertService.getInstance()
            .createUnitConvert(
              unitConvertGridRef.current.getInstance(),
              detailInputInfo?.values.unit_uuid,
            )
            .then((_: unknown) => {
              message.success(MESSAGE.UNIT_CONVERT_CREATE_SUCCESS);
              setAddDataPopupGridVisible(false);
              onSearchDetail(selectedHeaderRow?.unit_uuid, {});
            })
            .catch((error: unknown) => {
              console.error(error);
              message.error(error.toString());
            });
        },
      },
      {
        ...editDataPopupGrid.gridInfo,
        saveParams: { from_unit_uuid: editDataPopupInputInfo.values.unit_uuid },
        onOk: (unitConvertGridRef: GridRef) => {
          ServiceUtil.getInstance()
            .callMethod(
              UnitConvertService.getInstance().updateUnitConvert,
              unitConvertGridRef,
            )
            .then((_: unknown) => {
              message.success(MESSAGE.UNIT_CONVERT_UPDATE_SUCCESS);
              setEditDataPopupGridVisible(false);
              onSearchDetail(selectedHeaderRow?.unit_uuid, {});
            })
            .catch((error: unknown) => {
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
        onSearch: values =>
          onSearchDetail(selectedHeaderRow?.unit_uuid, values),
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
  //#endregion

  return <TpDoubleGrid {...props} />;
};
