import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
  isModified,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { cloneDeep } from 'lodash';

/** 구매단가관리 */
export const PgStdVendorPrice = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/partners';
  const headerSaveUriPath = '/std/partners';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/vendor-prices';
  const detailSaveUriPath = '/std/vendor-prices';
  const searchInitKeys = ['start_date', 'end_date'];
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
        header: '거래처UUID',
        name: 'partner_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처 유형UUID',
        name: 'partner_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '거래처 유형',
        name: 'partner_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
      },
      {
        header: '거래처',
        name: 'partner_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      gridMode: headerDefaultGridMode,
      disabledAutoDateColumn: true,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '협력사 단가UUID',
        name: 'vendor_price_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '거래처UUID',
        name: 'partner_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처',
        name: 'partner_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        format: 'popup',
        editable: true,
      },
      {
        header: '품목',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        editable: true,
      },
      {
        header: '품목 유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        editable: true,
        align: 'center',
      },
      {
        header: '제품 유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        editable: true,
        align: 'center',
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: 'rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        format: 'popup',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고 창고UUID',
        name: 'to_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '입고 창고',
        name: 'to_store_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '입고 위치UUID',
        name: 'to_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '입고 위치',
        name: 'to_location_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '화폐단위UUID',
        name: 'money_unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '화폐 단위',
        name: 'money_unit_nm',
        width: ENUM_WIDTH.S,
        format: 'combo',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '단가유형UUID',
        name: 'price_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '단가 유형',
        name: 'price_type_nm',
        width: ENUM_WIDTH.M,
        format: 'combo',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '단가',
        name: 'price',
        width: ENUM_WIDTH.M,
        format: 'number',
        filter: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        editable: true,
        requiredField: true,
      },
      {
        header: '단가 적용일자',
        name: 'start_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
        requiredField: true,
      },
      {
        header: '소급단가',
        name: 'retroactive_price',
        width: ENUM_WIDTH.M,
        format: 'number',
        editable: true,
      },
      {
        header: '배분율',
        name: 'division',
        width: ENUM_WIDTH.S,
        format: 'number',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
      disabledAutoDateColumn: true,
      gridPopupInfo: [
        {
          columnNames: [
            { original: 'unit_uuid', popup: 'unit_uuid' },
            { original: 'unit_nm', popup: 'unit_nm' },
          ],
          columns: [
            {
              header: '단위UUID',
              name: 'unit_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
              requiredField: true,
            },
            {
              header: '단위코드',
              name: 'unit_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '단위',
              name: 'unit_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/units',
            params: {},
          },
          gridMode: 'select',
        },
        {
          columnNames: [
            { original: 'prod_uuid', popup: 'prod_uuid' },
            { original: 'prod_no', popup: 'prod_no' },
            { original: 'prod_nm', popup: 'prod_nm' },
            { original: 'item_type_uuid', popup: 'item_type_uuid' },
            { original: 'item_type_nm', popup: 'item_type_nm' },
            { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
            { original: 'prod_type_nm', popup: 'prod_type_nm' },
            { original: 'model_uuid', popup: 'model_uuid' },
            { original: 'model_nm', popup: 'model_nm' },
            { original: 'rev', popup: 'rev' },
            { original: 'prod_std', popup: 'prod_std' },
            { original: 'unit_uuid', popup: 'unit_uuid' },
            { original: 'unit_nm', popup: 'unit_nm' },
          ],
          columns: [
            {
              header: '품목UUID',
              name: 'prod_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
              requiredField: true,
            },
            {
              header: '품번',
              name: 'prod_no',
              width: ENUM_WIDTH.M,
              format: 'text',
            },
            {
              header: '품목',
              name: 'prod_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '품목 유형UUID',
              name: 'item_type_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '품목 유형코드',
              name: 'item_type_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '품목 유형',
              name: 'item_type_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '제품 유형UUID',
              name: 'prod_type_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '제품 유형코드',
              name: 'prod_type_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '제품 유형',
              name: 'prod_type_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '모델UUID',
              name: 'model_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '모델코드',
              name: 'model_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '모델',
              name: 'model_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            { header: 'rev', name: 'rev', width: ENUM_WIDTH.L, format: 'text' },
            {
              header: '규격',
              name: 'prod_std',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
            {
              header: '단위UUID',
              name: 'unit_uuid',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
              requiredField: true,
            },
            {
              header: '단위코드',
              name: 'unit_cd',
              width: ENUM_WIDTH.M,
              format: 'text',
              hidden: true,
            },
            {
              header: '단위',
              name: 'unit_nm',
              width: ENUM_WIDTH.L,
              format: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/prods',
            params: {},
          },
          gridMode: 'select',
        },
      ],
      gridComboInfo: [
        {
          // 화폐유형 콤보박스
          columnNames: [
            {
              codeColName: {
                original: 'money_unit_uuid',
                popup: 'money_unit_uuid',
              },
              textColName: {
                original: 'money_unit_nm',
                popup: 'money_unit_nm',
              },
            },
          ],
          dataApiSettings: {
            uriPath: '/std/money-units',
            params: {},
          },
        },
        {
          // 단가유형 콤보박스
          columnNames: [
            {
              codeColName: {
                original: 'price_type_uuid',
                popup: 'price_type_uuid',
              },
              textColName: {
                original: 'price_type_nm',
                popup: 'price_type_nm',
              },
            },
          ],
          dataApiSettings: {
            uriPath: '/std/price-types',
            params: {},
          },
        },
      ],
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: {
        ...detailGrid.gridInfo.gridPopupInfo[1],
        gridMode: 'multi-select',
      },
      gridPopupInfo: detailGrid.gridInfo.gridPopupInfo,
      gridComboInfo: detailGrid.gridInfo.gridComboInfo,
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
      partner_uuid: uuid,
    };
    getData(searchParams, detailSearchUriPath).then(res => {
      detailGrid.setGridData(res || []);
    });
  };
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = null;
  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', [
    { type: 'date', id: 'date', label: '적용일', default: getToday() },
  ]);

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData({ ...searchParams, partner_fg: 1 }, headerSearchUriPath)
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
    if (uuid == null) return;
    reloadDetailGrid(uuid, searchValues);
  };
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'partner_uuid',
      label: '고객사UUID',
      hidden: true,
      disabled: true,
    },
    {
      type: 'text',
      id: 'partner_nm',
      label: '고객사',
      usePopup: true,
      disabled: true,
      popupKey: '거래처관리',
      popupKeys: ['partner_uuid', 'partner_nm'],
    },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    JSON.parse(JSON.stringify(detailInputInfo.props?.inputItems))?.map(el => {
      if (el?.id !== 'total_qty' && el?.id !== 'total_price')
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
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.partner_uuid, detailSearchInfo.values);
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
          onAfterSaveAction(searchResult, selectedHeaderRow?.partner_uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values.partner_uuid == null) {
      message.warn('거래처를 선택하신 후 다시 시도해 주세요.');
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
      const { gridRef, setGridMode } = detailGrid;
      const { columns } = detailGrid.gridInfo;

      if (detailInputInfo.isModified || isModified(gridRef, columns)) {
        // 편집 이력이 있는 경우
        modal.confirm({
          title: '편집 취소',
          // icon: <ExclamationCircleOutlined />,
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk: () => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel: () => {},
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
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setNewDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setAddDataPopupGridVisible(false);
  };

  /** 수정 저장 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.partner_uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult =>
      onAfterSaveAction(searchResult, savedUuid),
    );
    setEditDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.partner_uuid === uuid);

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
        saveParams: newDataPopupInputInfo.values,
      },
      {
        ...addDataPopupGrid.gridInfo,
        saveParams: addDataPopupInputInfo.values,
      },
      {
        ...editDataPopupGrid.gridInfo,
        saveParams: editDataPopupInputInfo.values,
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
          onSearchDetail(selectedHeaderRow?.partner_uuid, values),
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
