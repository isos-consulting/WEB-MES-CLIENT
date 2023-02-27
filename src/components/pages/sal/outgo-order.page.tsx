import React, { useLayoutEffect, useState } from 'react';
import { Datagrid, getPopupForm, useGrid, useSearchbox } from '~/components/UI';
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
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { isNil } from '~/helper/common';
import { OutgoOrderService } from '~/service/sal/OutgoOrderService';

/** 제품출하지시 */
export const PgSalOutgoOrder = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/sal/outgo-orders';
  const headerSaveUriPath = '/sal/outgo-orders';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/sal/outgo-order/$/include-details';
  const detailSaveUriPath = '/sal/outgo-orders';
  const searchInitKeys = ['start_date', 'end_date'];

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
        header: '출하지시UUID',
        name: 'outgo_order_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '출하지시일',
        name: 'reg_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
        requiredField: true,
      },
      {
        header: '거래처UUID',
        name: 'partner_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처명',
        name: 'partner_nm',
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
        header: '출하지시상세UUID',
        name: 'outgo_order_detail_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '세부수주UUID',
        name: 'order_detail_uuid',
        hidden: true,
      },
      {
        header: '완료여부',
        name: 'complete_state',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'check',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
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
        requiredField: true,
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
      },
      {
        header: '수주수량',
        name: 'order_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'text',
      },
      {
        header: '지시수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        editable: true,
        requiredField: true,
      },
      {
        header: '미납수량',
        name: 'balance',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'text',
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      rowAddPopupInfo: {
        columnNames: [
          { original: 'order_detail_uuid', popup: 'order_detail_uuid' },
          { original: 'prod_uuid', popup: 'prod_uuid' },
          { original: 'item_type_nm', popup: 'item_type_nm' },
          { original: 'prod_type_nm', popup: 'prod_type_nm' },
          { original: 'prod_no', popup: 'prod_no' },
          { original: 'prod_nm', popup: 'prod_nm' },
          { original: 'model_nm', popup: 'model_nm' },
          { original: 'rev', popup: 'rev' },
          { original: 'prod_std', popup: 'prod_std' },
          { original: 'safe_stock', popup: 'safe_stock' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'money_unit_uuid', popup: 'money_unit_uuid' },
          { original: 'money_unit_nm', popup: 'money_unit_nm' },
          { original: 'price', popup: 'price' },
          { original: 'qty', popup: 'qty' },
          { original: 'order_qty', popup: 'qty' },
          { original: 'exchange', popup: 'exchange' },
        ],
        columns: getPopupForm('판매단가관리')?.datagridProps?.columns,
        dataApiSettings: () => {
          type TParams = {
            date?: string;
            partner_uuid?: string;
            uuid?: string;
          };
          let inputValues = null;
          let params: TParams = {};

          if (newDataPopupGridVisible) {
            // 신규 등록 팝업일 경우
            inputValues = newDataPopupInputInfo.ref.current.values;
          } else {
            // 세부 항목 등록 팝업일 경우
            inputValues = addDataPopupInputInfo.ref.current.values;
          }

          if (!isNil(inputValues)) {
            params = {
              uuid: newDataPopupGridVisible
                ? null
                : inputValues?.outgo_order_uuid,
              partner_uuid: inputValues?.partner_uuid,
              date: inputValues?.reg_date
                ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                : null,
            };
          }

          return {
            uriPath: getPopupForm('판매단가관리')?.uriPath,
            params,
            onInterlock: () => {
              let showPopup: boolean = false;

              if (isNil(params?.date)) {
                message.warn('발주일을 입력하신 후 다시 시도해주세요.');
              } else if (isNil(params?.partner_uuid)) {
                message.warn('거래처를 선택하신 후 다시 시도해주세요.');
              } else {
                showPopup = true;
              }

              return showPopup;
            },
          };
        },
        gridMode: 'multi-select',
      },
      extraButtons:
        editDataPopupGridVisible === true
          ? []
          : [
              {
                buttonProps: { text: '수주 불러오기' },
                buttonAction: (ev, props, options) => {
                  const { childGridRef, modal, onAppendRow } = options;
                  const updateColumns: { original: string; popup: string }[] =
                    props.rowAddPopupInfo.columnNames;

                  let params = {
                    complete_state: 'all',
                    partner_uuid: null,
                  };

                  if (newDataPopupGridVisible) {
                    params['partner_uuid'] =
                      newDataPopupInputInfo.ref.current.values?.partner_uuid;
                  } else if (editDataPopupGridVisible) {
                    params['partner_uuid'] =
                      editDataPopupInputInfo.ref.current.values?.partner_uuid;
                  } else if (addDataPopupGridVisible) {
                    params['partner_uuid'] =
                      addDataPopupInputInfo.ref.current.values?.partner_uuid;
                  }

                  if (isNil(params?.partner_uuid)) {
                    message.warn('거래처를 선택하신 후 다시 시도해주세요.');
                    return;
                  }

                  getData(params, '/sal/order-details').then(res => {
                    modal.confirm({
                      title: '수주품목 - 다중선택',
                      width: '80%',
                      content: (
                        <>
                          <Datagrid
                            ref={childGridRef}
                            gridId={'GRID_POPUP_ORDER'}
                            columns={[
                              {
                                header: '수주UUID',
                                name: 'order_uuid',
                                hidden: true,
                              },
                              {
                                header: '세부수주UUID',
                                name: 'order_detail_uuid',
                                hidden: true,
                              },
                              {
                                header: '완료구분',
                                name: 'complete_state',
                                width: ENUM_WIDTH.S,
                                align: 'center',
                              },
                              {
                                header: '전표번호',
                                name: 'stmt_no',
                                width: ENUM_WIDTH.M,
                              },
                              {
                                header: '납기일',
                                name: 'due_date',
                                width: ENUM_WIDTH.M,
                                format: 'date',
                                filter: 'text',
                              },
                              {
                                header: '품목UUID',
                                name: 'prod_uuid',
                                hidden: true,
                              },
                              {
                                header: '품목유형',
                                name: 'item_type_nm',
                                width: ENUM_WIDTH.M,
                                filter: 'text',
                                align: 'center',
                              },
                              {
                                header: '제품유형',
                                name: 'prod_type_nm',
                                width: ENUM_WIDTH.M,
                                filter: 'text',
                                align: 'center',
                              },
                              {
                                header: '품번',
                                name: 'prod_no',
                                width: ENUM_WIDTH.M,
                                filter: 'text',
                              },
                              {
                                header: '품명',
                                name: 'prod_nm',
                                width: ENUM_WIDTH.L,
                                filter: 'text',
                              },
                              {
                                header: '모델',
                                name: 'model_nm',
                                width: ENUM_WIDTH.M,
                                filter: 'text',
                              },
                              {
                                header: 'Rev',
                                name: 'rev',
                                width: ENUM_WIDTH.S,
                              },
                              {
                                header: '규격',
                                name: 'prod_std',
                                width: ENUM_WIDTH.L,
                              },
                              {
                                header: '안전재고',
                                name: 'safe_stock',
                                width: ENUM_WIDTH.S,
                                decimal: ENUM_DECIMAL.DEC_STCOK,
                              },
                              {
                                header: '단위UUID',
                                name: 'unit_uuid',
                                hidden: true,
                              },
                              {
                                header: '단위',
                                name: 'unit_nm',
                                width: ENUM_WIDTH.XS,
                              },
                              {
                                header: '수주량',
                                name: 'qty',
                                width: ENUM_WIDTH.S,
                                format: 'number',
                                decimal: ENUM_DECIMAL.DEC_STCOK,
                              },
                              {
                                header: '미납량',
                                name: 'balance',
                                width: ENUM_WIDTH.S,
                                format: 'number',
                                decimal: ENUM_DECIMAL.DEC_STCOK,
                              },
                              {
                                header: '화폐단위UUID',
                                name: 'money_unit_uuid',
                                hidden: true,
                              },
                              {
                                header: '화폐단위',
                                name: 'money_unit_nm',
                                width: ENUM_WIDTH.M,
                              },
                              {
                                header: '단가유형UUID',
                                name: 'price_type_uuid',
                                hidden: true,
                              },
                              {
                                header: '단가유형',
                                name: 'price_type_nm',
                                width: ENUM_WIDTH.M,
                              },
                              {
                                header: '단가',
                                name: 'price',
                                width: ENUM_WIDTH.S,
                                format: 'number',
                                decimal: ENUM_DECIMAL.DEC_PRICE,
                              },
                              {
                                header: '환율',
                                name: 'exchange',
                                width: ENUM_WIDTH.S,
                                format: 'number',
                                decimal: ENUM_DECIMAL.DEC_PRICE,
                              },
                            ]}
                            gridMode="multi-select"
                            data={res}
                          />
                        </>
                      ),
                      icon: null,
                      okText: '선택',
                      onOk: () => {
                        const child = childGridRef.current;
                        const rows = child.getInstance().getCheckedRows();

                        rows?.forEach(row => {
                          let newRow = {};
                          if (typeof row === 'object') {
                            updateColumns.forEach(columnName => {
                              // 값 설정
                              newRow[columnName.original] = !isNil(
                                row[columnName.popup],
                              )
                                ? row[columnName.popup]
                                : null;
                            });
                            // 행 추가
                            onAppendRow(newRow);
                          }
                        });
                      },
                      cancelText: '취소',
                      maskClosable: false,
                    });
                  });
                },
              },
            ],
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    newDataPopupGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
      extraButtons: newDataPopupGrid.gridInfo.extraButtons,
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    newDataPopupGrid.gridInfo.columns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
      extraButtons: newDataPopupGrid.gridInfo.extraButtons,
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

    const uriPath = detailSearchUriPath.replace('$', uuid);
    getData({ complete_state: 'all' }, uriPath, 'header-details').then(res => {
      const detailsRes = res as unknown as { details: any };
      detailGrid.setGridData(detailsRes?.details || []);
    });
  };
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '출하지시일',
    },
  ]);

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
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'outgo_order_uuid',
      alias: 'uuid',
      label: '외주입하UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '출하지시일',
      disabled: true,
      default: getToday(),
    },
    {
      type: 'text',
      id: 'partner_uuid',
      label: '거래처UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'partner_nm',
      label: '거래처',
      disabled: true,
      usePopup: true,
      popupKey: '거래처관리',
      popupKeys: ['partner_uuid', 'partner_nm'],
      params: { partner_fg: 2 },
      required: true,
      handleChange: values => {
        newDataPopupGrid?.setGridData([]);
      },
    },
    {
      type: 'text',
      id: 'delivery_uuid',
      label: '납품처UUID',
      disabled: true,
      hidden: true,
      required: true,
    },
    {
      type: 'text',
      id: 'delivery_nm',
      label: '납품처',
      disabled: true,
      usePopup: true,
      popupKey: '납품처관리',
      popupKeys: ['delivery_uuid', 'delivery_nm'],
    },
    {
      type: 'text',
      id: 'remark',
      label: '비고',
      disabled: true,
    },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (!['total_price'].includes(el?.id)) el['disabled'] = false;

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (!['partner_nm', 'reg_date', 'total_price'].includes(el?.id))
        el['disabled'] = false;

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    detailInputInfo.props?.inputItems,
  );
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (isNil(selectedHeaderRow)) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.outgo_order_uuid);
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
      'headerInclude',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.ref.current.values,
      modal,
      res => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then(searchResult => {
          const headerRow = res?.datas?.raws[0]?.outgo_order?.header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (isNil(detailInputInfo?.values?.outgo_order_uuid)) {
      message.warn('전표를 선택하신 후 다시 시도해 주세요.');
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
    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },

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
            // this function will not be executed
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
    const savedUuid = savedData[0]?.header?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.outgo_order?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.outgo_order?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.outgo_order_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys),
    );
  };

  const addSalOutgoOrder = async createdGridInstance => {
    const service = new OutgoOrderService();

    try {
      const savedOutgoOrder = await service.addOutgoOrder(
        newDataPopupInputInfo?.props.innerRef.current.values,
        createdGridInstance.current.getInstance().getData(),
      );
      message.success('출하지시가 등록되었습니다.');
      onAfterSaveNewData(true, savedOutgoOrder);
    } catch (err) {
      message.error(err.message);
    }
  };

  //#region 🔶템플릿에 값 전달
  const props: ITpDoubleGridProps = {
    title,
    dataSaveType: 'headerInclude',
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
        onOk: addSalOutgoOrder,
      },
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
        onSearch: () => onSearchDetail(selectedHeaderRow?.outgo_order_uuid),
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
