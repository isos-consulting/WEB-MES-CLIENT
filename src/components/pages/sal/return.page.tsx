import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { GridEventProps } from 'tui-grid/types/event';
import { getPopupForm, useGrid, useSearchbox } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_SAL } from '~/enums';
import {
  cleanupKeyOfObject,
  cloneObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
  isModified,
} from '~/functions';
import { isNil } from '~/helper/common';
import { SalesReturnGetResponseEntity } from '~/v2/api/model/SalesReturnDTO';
import { MESSAGE } from '~/v2/core/Message';
import { GridInstance } from '~/v2/core/ToastGrid';
import { SalesReturnService } from '~/v2/service/SalesReturnService';

// 금액 컬럼 계산 (단가 * 수량 * 환율)
const priceFormula = (params, props) => {
  const { value, targetValues } = params;
  return (
    Number(value) *
      Number(targetValues?._array[0]) *
      Number(targetValues?._array[1]) || 0
  );
};

/** 제품반입 */
export const PgSalReturn = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/sal/returns';
  const headerSaveUriPath = '/sal/returns';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/sal/return/$/include-details';
  const detailSaveUriPath = '/sal/returns';
  const searchInitKeys = ['start_date', 'end_date'];
  const LOCATION_POPUP = getPopupForm('위치관리');

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
        header: '제품반입UUID',
        name: 'return_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '전표번호',
        name: 'stmt_no',
        width: ENUM_WIDTH.M,
        format: 'text',
      },
      {
        header: '반입일',
        name: 'reg_date',
        width: ENUM_WIDTH.M,
        format: 'date',
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
        requiredField: true,
      },
      {
        header: '합계금액(￦)',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
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
        header: '제품반입상세UUID',
        name: 'return_detail_uuid',
        format: 'text',
        alias: 'uuid',
        hidden: true,
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
        header: '안전재고',
        name: 'safe_stock',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STOCK,
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
        header: '부적합UUID',
        name: 'reject_uuid',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: true,
      },
      {
        header: '부적합',
        name: 'reject_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '입고창고UUID',
        name: 'to_store_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '입고창고',
        name: 'to_store_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고위치UUID',
        name: 'to_location_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '입고위치',
        name: 'to_location_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STOCK,
        requiredField: true,
        editable: true,
        formula: {
          targetColumnNames: ['price', 'exchange'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '화폐단위UUID',
        name: 'money_unit_uuid',
        width: ENUM_WIDTH.S,
        hidden: true,
        requiredField: true,
      },
      {
        header: '화폐단위',
        name: 'money_unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '단가',
        name: 'price',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        requiredField: true,
        editable: true,
        formula: {
          targetColumnNames: ['qty', 'exchange'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '환율',
        name: 'exchange',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        requiredField: true,
        editable: true,
        formula: {
          targetColumnNames: ['qty', 'price'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '금액',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        requiredField: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
      gridPopupInfo: [
        {
          // 입고창고
          columnNames: [
            { original: 'to_store_uuid', popup: 'store_uuid' },
            { original: 'to_store_nm', popup: 'store_nm' },
          ],
          columns: getPopupForm('창고관리')?.datagridProps?.columns,
          dataApiSettings: {
            uriPath: getPopupForm('창고관리')?.uriPath,
            params: {
              store_type: 'return',
            },
          },
          gridMode: 'select',
        },
        {
          columnNames: [
            { original: 'to_location_uuid', popup: 'location_uuid' },
            { original: 'to_location_nm', popup: 'location_nm' },
          ],
          dataApiSettings: (ev: GridEventProps & { instance: any }) => {
            const { rowKey, instance } = ev;
            const data = instance.getData();
            const storeUuid = data[rowKey].to_store_uuid;

            return {
              uriPath: LOCATION_POPUP.uriPath,
              params: { store_uuid: storeUuid ?? null },
            };
          },
          columns: LOCATION_POPUP.datagridProps.columns,
          gridMode: 'select',
        },
        {
          // 부적합
          popupKey: '부적합관리',
          columnNames: [
            { original: 'reject_uuid', popup: 'reject_uuid' },
            { original: 'reject_nm', popup: 'reject_nm' },
          ],
          gridMode: 'select',
        },
      ],
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    detailGrid.gridInfo.columns,
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      gridPopupInfo: detailGrid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: {
        columnNames: [
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
          { original: 'exchange', popup: 'exchange' },
        ],
        columns: getPopupForm('판매단가관리')?.datagridProps?.columns,
        dataApiSettings: () => {
          type TParams = {
            partner_uuid?: string;
            stock_type?: string;
            grouped_type?: string;
            price_type?: string;
            reg_date?: string;
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
              partner_uuid: inputValues?.partner_uuid,
              stock_type: 'outgo',
              grouped_type: 'all',
              price_type: 'sales',
              reg_date: inputValues?.reg_date
                ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                : null,
            };
          }

          return {
            uriPath: getPopupForm('판매단가관리')?.uriPath,
            params,
            onInterlock: () => {
              let showPopup: boolean = false;

              if (isNil(params?.reg_date)) {
                message.warn('반입일을 입력하신 후 다시 시도해주세요.');
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
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    cloneDeep(newDataPopupGrid.gridInfo.columns),
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
    cloneDeep(newDataPopupGrid.gridInfo.columns).map(el => {
      if (
        [
          'return_detail_uuid',
          'qty',
          'price',
          'money_unit_nm',
          'exchange',
        ].includes(el?.name)
      ) {
        el['requiredField'] = true;
      } else {
        el['requiredField'] = false;
      }
      return el;
    }),
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

  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '반입일',
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
    if (uuid) {
      const uriPath = URL_PATH_SAL.RETURN.GET.DETAILS.replace('{uuid}', uuid);

      getData(detailSearchInfo?.values, uriPath, 'raws').then(res => {
        detailGrid.setGridData(res || []);
      });
    } else {
      detailGrid.setGridData([]);
    }
  };

  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'return_uuid',
      alias: 'uuid',
      label: '반입UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '반입일',
      disabled: true,
      default: getToday(),
    },
    {
      type: 'text',
      id: 'stmt_no',
      label: '전표번호',
      disabled: true,
    },
    {
      type: 'number',
      id: 'total_price',
      label: '합계금액',
      disabled: true,
      decimal: ENUM_DECIMAL.DEC_PRICE,
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
    cloneObject(detailInputInfo.props?.inputItems)?.map(el => {
      if (!['total_price', 'stmt_no'].includes(el?.id)) el['disabled'] = false;
      if (el?.id === 'reg_date') el['default'] = getToday();
      return el;
    }),
  );

  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneObject(detailInputInfo.props?.inputItems)?.map(el => {
      if (
        !['partner_nm', 'reg_date', 'total_price', 'stmt_no'].includes(el?.id)
      )
        el['disabled'] = false;

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    detailInputInfo.props?.inputItems,
  );

  useLayoutEffect(() => {
    if (isNil(selectedHeaderRow)) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.return_uuid);
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
          const headerRow = res?.datas?.raws[0]?.outgo?.header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (isNil(detailInputInfo?.values?.return_uuid)) {
      message.warn('전표를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

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
    const savedUuid = savedData[0]?.outgo?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.outgo?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.outgo?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.return_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys),
    );
  };

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
      newDataPopupGrid.gridInfo,
      addDataPopupGrid.gridInfo,
      {
        ...editDataPopupGrid.gridInfo,
        onOk: clickEvent => {
          const instance = (
            clickEvent as unknown as React.MutableRefObject<Grid>
          ).current.getInstance();

          SalesReturnService.getInstance()
            .updateWithHeaderDetail(
              instance as GridInstance,
              selectedHeaderRow as SalesReturnGetResponseEntity,
            )
            .then(_ => {
              message.success(MESSAGE.SALES_RETURN_UPDATE_SUCCESS);
              setEditDataPopupGridVisible(false);
              onSearchHeader(headerSearchInfo?.values);
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
        onSearch: () => onSearchDetail(selectedHeaderRow?.return_uuid),
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

  return <TpDoubleGrid {...props} />;
};
