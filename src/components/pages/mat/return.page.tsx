import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
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

const URI_PATH_GET_INV_STORES_STOCKS_RETURN = '/inv/stores/stocks/return';
const URI_PATH_GET_MAT_RETURN = '/mat/return/{uuid}';
const URI_PATH_GET_MAT_RETURNS = '/mat/returns';
const URI_PATH_GET_MAT_RETURN_DETAILS = '/mat/return/{uuid}/details';
const URI_PATH_GET_MAT_RETURN_INCLUDE_DETAILS =
  '/mat/return/{uuid}/include-details';
const URI_PATH_POST_MAT_RETURNS = '/mat/returns';

/** 제품출하 */
export const PgMatReturn = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

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
        header: '자재반출UUID',
        name: 'return_uuid',
        hidden: true,
      },
      {
        header: '전표번호',
        name: 'stmt_no',
        width: 150,
      },
      {
        header: '기준일',
        name: 'reg_date',
        width: 120,
        editable: true,
        format: 'date',
        requiredField: true,
      },
      {
        header: '거래처UUID',
        name: 'partner_uuid',
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처명',
        name: 'partner_nm',
        width: 150,
        editable: true,
        requiredField: true,
      },
      {
        header: '합계금액',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
      },
    ],
    {
      searchUriPath: URI_PATH_GET_MAT_RETURNS,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '자재반출상세아이디',
        name: 'return_detail_uuid',
        alias: 'uuid',
        filter: 'text',
        hidden: true,
      },
      {
        header: '자재반출아이디',
        name: 'return_uuid',
        filter: 'text',
        hidden: true,
      },
      {
        header: '제품아이디',
        name: 'prod_uuid',
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: 150,
        filter: 'text',
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: 150,
        filter: 'text',
      },
      {
        header: '품번',
        name: 'prod_no',
        width: 150,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: 150,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '모델',
        name: 'model_nm',
        width: 150,
        filter: 'text',
      },
      {
        header: 'Rev',
        name: 'rev',
        width: 100,
        filter: 'text',
      },
      {
        header: '규격',
        name: 'prod_std',
        width: 150,
        filter: 'text',
      },
      {
        header: '안전재고',
        name: 'safe_stock',
        width: 100,
        filter: 'text',
        format: 'number',
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: 100,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '반출수량',
        name: 'return_qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        format: 'number',
        requiredField: true,
        editable: true,
      },
      {
        header: '단위UUID',
        name: 'return_unit_uuid',
        alias: 'unit_uuid',
        width: 80,
        filter: 'text',
        hidden: true,
      },
      {
        header: '단위',
        name: 'return_unit_nm',
        width: 80,
        filter: 'text',
        align: 'center',
        requiredField: true,
      },
      {
        header: '재고수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        format: 'number',
        hidden: true,
        requiredField: true,
      },
      {
        header: '재고단위UUID',
        name: 'unit_uuid',
        width: 80,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '재고단위',
        name: 'unit_nm',
        width: 80,
        filter: 'text',
        align: 'center',
        hidden: true,
        requiredField: true,
      },
      {
        header: '단위변환값',
        name: 'convert_value',
        width: ENUM_WIDTH.S,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_UNIT_CHANGE,
        filter: 'number',
        hidden: true,
        requiredField: true,
      },
      {
        header: '화폐단위아이디',
        name: 'money_unit_uuid',
        filter: 'text',
        format: 'combo',
        editable: true,
        hidden: true,
        requiredField: true,
      },
      {
        header: '화폐단위',
        name: 'money_unit_nm',
        width: 100,
        filter: 'text',
        format: 'combo',
        editable: true,
        requiredField: true,
      },
      {
        header: '단가',
        name: 'price',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        editable: true,
        requiredField: true,
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
      },
      {
        header: '금액',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
      },
      {
        header: '출고창고아이디',
        name: 'from_store_uuid',
        width: 150,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '출고창고',
        name: 'from_store_nm',
        width: 150,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '출고위치아이디',
        name: 'from_location_uuid',
        width: 150,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '출고위치',
        name: 'from_location_nm',
        width: 150,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: 200,
        filter: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: URI_PATH_GET_MAT_RETURN_DETAILS,
      saveUriPath: URI_PATH_POST_MAT_RETURNS,
      gridMode: 'delete',
      onAfterChange: el => {
        const changeDatas = el.changes;
        const gridInstance = el.instance;

        changeDatas.forEach(el => {
          const rowData = gridInstance.getRow(el?.rowKey);
          const value: number = el.value;
          const convert_value: number = rowData.convert_value;
          console.log({ rowData, value, convert_value });
          if (el?.columnName === 'return_qty') {
            gridInstance.setValue(el.rowKey, 'qty', value / convert_value);
          }
        });
      },
    },
  );

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    cloneDeep(detailGrid.gridInfo.columns)
      .filter(row => !['total_price'].includes(row.name))
      .map(el => {
        if (el.name === 'unit_nm' || el.name === 'qty') {
          el.hidden = false;
        }
        return el;
      }),
    {
      searchUriPath: URI_PATH_GET_MAT_RETURNS,
      saveUriPath: URI_PATH_POST_MAT_RETURNS,
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
          { original: 'lot_no', popup: 'lot_no' },
          { original: 'qty', popup: 'qty' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'return_qty', popup: 'return_qty' },
          { original: 'return_unit_uuid', popup: 'return_unit_uuid' },
          { original: 'return_unit_nm', popup: 'return_unit_nm' },
          { original: 'convert_value', popup: 'convert_value' },
          { original: 'from_store_uuid', popup: 'store_uuid' },
          { original: 'from_store_nm', popup: 'store_nm' },
          { original: 'from_location_uuid', popup: 'location_uuid' },
          { original: 'from_location_nm', popup: 'location_nm' },
          { original: 'money_unit_uuid', popup: 'money_unit_uuid' },
          { original: 'money_unit_nm', popup: 'money_unit_nm' },
          { original: 'price_type_uuid', popup: 'price_type_uuid' },
          { original: 'price_type_nm', popup: 'price_type_nm' },
          { original: 'price', popup: 'price' },
          { original: 'exchange', popup: 'exchange' },
        ],
        columns: [
          {
            header: '품목UUID',
            name: 'prod_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '품목유형UUID',
            name: 'item_type_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '제품유형UUID',
            name: 'prod_type_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            format: 'text',
            filter: 'text',
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '단위변환값',
            name: 'convert_value',
            width: ENUM_WIDTH.S,
            format: 'number',
            filter: 'number',
            hidden: true,
          },

          {
            header: '창고UUID',
            name: 'store_uuid',
            width: ENUM_WIDTH.L,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '창고',
            name: 'store_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '위치UUID',
            name: 'location_uuid',
            width: ENUM_WIDTH.L,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '위치',
            name: 'location_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: 'LOT NO',
            name: 'lot_no',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },

          {
            header: '재고',
            name: 'qty',
            width: ENUM_WIDTH.M,
            format: 'number',
            filter: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
          },
          {
            header: '단위UUID',
            name: 'unit_uuid',
            width: ENUM_WIDTH.S,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '재고단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            format: 'text',
            filter: 'text',
            align: 'center',
          },

          {
            header: '반출단위재고',
            name: 'return_qty',
            width: ENUM_WIDTH.M,
            format: 'number',
            filter: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
          },
          {
            header: '단위UUID',
            name: 'return_unit_uuid',
            width: ENUM_WIDTH.S,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '반출단위',
            name: 'return_unit_nm',
            width: ENUM_WIDTH.S,
            format: 'text',
            filter: 'text',
            align: 'center',
          },

          {
            header: '화폐단위UUID',
            name: 'money_unit_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '화폐단위',
            name: 'money_unit_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '단가유형UUID',
            name: 'price_type_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
            hidden: true,
          },
          {
            header: '단가유형',
            name: 'price_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
            filter: 'text',
          },
          {
            header: '단가',
            name: 'price',
            width: ENUM_WIDTH.M,
            format: 'number',
            filter: 'number',
            decimal: ENUM_DECIMAL.DEC_PRICE,
          },
          {
            header: '환율',
            name: 'exchange',
            width: ENUM_WIDTH.M,
            format: 'number',
            filter: 'number',
            decimal: ENUM_DECIMAL.DEC_PRICE,
          },
        ],
        dataApiSettings: () => {
          type TParams = {
            exclude_zero_fg?: boolean;
            exclude_minus_fg?: boolean;
            reg_date?: string;
            partner_uuid?: string;
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

          if (inputValues != null) {
            params = {
              exclude_zero_fg: true,
              exclude_minus_fg: true,
              reg_date: inputValues?.reg_date
                ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                : null,
              partner_uuid: inputValues?.partner_uuid,
            };
          }

          return {
            uriPath: URI_PATH_GET_INV_STORES_STOCKS_RETURN,
            params,
            onInterlock: () => {
              let showPopup: boolean = false;

              if (params?.reg_date == null) {
                message.warn('반출일을 입력하신 후 다시 시도해주세요.');
              } else if (params?.partner_uuid == null) {
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
      onAfterChange: detailGrid.gridInfo.onAfterChange,
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    cloneDeep(newDataPopupGrid.gridInfo.columns),
    {
      searchUriPath: URI_PATH_GET_MAT_RETURN_INCLUDE_DETAILS,
      saveUriPath: URI_PATH_POST_MAT_RETURNS,
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
          'convert_value',
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
      searchUriPath: URI_PATH_GET_MAT_RETURN_INCLUDE_DETAILS,
      saveUriPath: URI_PATH_POST_MAT_RETURNS,
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
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '반출일',
    },
  ]);

  const detailSearchInfo = null;
  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(
      values,
      headerSearchInfo?.searchItemKeys,
    );

    let data = [];
    await getData(searchParams, URI_PATH_GET_MAT_RETURNS)
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
    if (uuid) {
      const uriPath = URI_PATH_GET_MAT_RETURN_DETAILS.replace('{uuid}', uuid);

      getData(detailSearchInfo?.values, uriPath, 'raws').then(res => {
        detailGrid.setGridData(res || []);
      });
    } else {
      detailGrid.setGridData([]);
    }
  };
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'return_uuid',
      alias: 'uuid',
      label: '자재반출UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'stmt_no',
      label: '전표번호',
      disabled: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '반출일',
      disabled: true,
    },
    {
      type: 'text',
      id: 'partner_uuid',
      label: '거래처UUID',
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
      params: { partner_fg: 1 },
      handleChange: values => {
        newDataPopupGrid?.setGridData([]);
      },
    },
    {
      type: 'number',
      id: 'total_qty',
      label: '합계수량',
      disabled: true,
    },
    {
      type: 'number',
      id: 'total_price',
      label: '합계금액',
      disabled: true,
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
      if (!['total_qty', 'total_price', 'stmt_no'].includes(el?.id))
        el['disabled'] = false;

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (
        ![
          'partner_nm',
          'reg_date',
          'total_qty',
          'total_price',
          'stmt_no',
        ].includes(el?.id)
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
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.return_uuid);
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
      'headerInclude',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.ref.current.values,
      modal,
      ({ success, datas }) => {
        if (!success) return;

        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then(searchResult => {
          const headerRow = datas?.raws[0]?.return?.header[0];

          if (headerRow?.uuid == null) {
            setSelectedHeaderRow(null);
            return;
          }

          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values?.return_uuid == null) {
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
  //#endregion

  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.return?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.return?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.return?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    const selectedRow = searchResult?.find(el => el?.return_uuid === uuid);

    if (!selectedRow) {
      setSelectedHeaderRow(null);
    } else {
      setSelectedHeaderRow(
        cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys),
      );
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
  //#endregion

  return <TpDoubleGrid {...props} />;
};
