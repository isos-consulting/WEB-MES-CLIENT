import React, { useLayoutEffect } from 'react';
import { useState } from 'react';
import { Datagrid, getPopupForm, useGrid, useSearchbox } from '~/components/UI';
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
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_STD } from '~/enums';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

// 금액 컬럼 계산 (단가 * 수량 * 환율)
const priceFormula = (params, props) => {
  const { value, targetValues } = params;
  return (
    Number(value) *
      Number(targetValues?._array[0]) *
      Number(targetValues?._array[1]) || 0
  );
};

/** 외주입하 */
export const PgOutReceive = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/out/receives';
  const headerSaveUriPath = '/out/receives';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/out/receive/$/include-details';
  const detailSaveUriPath = '/out/receives';
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
        header: '외주입하UUID',
        name: 'receive_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '전표번호',
        name: 'stmt_no',
        width: ENUM_WIDTH.L,
      },
      {
        header: '입하일',
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
        header: '공급처UUID',
        name: 'supplier_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '공급처명',
        name: 'supplier_nm',
        width: ENUM_WIDTH.L,
        hidden: true,
      },
      {
        header: '합계금액',
        name: 'total_price',
        width: ENUM_WIDTH.L,
        format: 'number',
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        hidden: true,
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
        header: '외주입하상세UUID',
        name: 'receive_detail_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '안전재고',
        name: 'safe_stock',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '화폐단위아이디',
        name: 'money_unit_uuid',
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
        editable: true,
        requiredField: true,
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
        editable: true,
        requiredField: true,
        formula: {
          targetColumnNames: ['qty', 'price'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '발주량',
        name: 'order_qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
      },
      {
        header: '수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        editable: true,
        requiredField: true,
        formula: {
          targetColumnNames: ['price', 'exchange'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '금액',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        format: 'number',
        filter: 'number',
        requiredField: true,
        defaultValue: (props, row) => {
          if (row == null) return;
          return Number(row?.qty) * Number(row?.price) * Number(row?.exchange);
        },
      },
      {
        header: '수입검사',
        name: 'insp_fg',
        width: ENUM_WIDTH.S,
        format: 'check',
        filter: 'text',
        requiredField: true,
      },
      {
        header: '이월',
        name: 'carry_fg',
        width: ENUM_WIDTH.S,
        format: 'check',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '창고아이디',
        name: 'to_store_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '창고',
        name: 'to_store_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        requiredField: true,
        editable: true,
      },
      {
        header: '위치아이디',
        name: 'to_location_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        hidden: true,
      },
      {
        header: '위치',
        name: 'to_location_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '단위수량',
        name: 'unit_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        filter: 'number',
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
      {
        header: '바코드',
        name: 'barcode',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
      gridPopupInfo: [
        {
          // 입고창고
          popupKey: '창고관리',
          columnNames: [
            { original: 'to_store_uuid', popup: 'store_uuid' },
            { original: 'to_store_nm', popup: 'store_nm' },
          ],
          gridMode: 'select',
        },
        {
          // 입고위치
          popupKey: '위치관리',
          columnNames: [
            { original: 'to_location_uuid', popup: 'location_uuid' },
            { original: 'to_location_nm', popup: 'location_nm' },
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
      rowAddPopupInfo: {
        modalProps: {
          title: '구매단가',
        },
        columnNames: [
          { original: 'prod_uuid', popup: 'prod_uuid' },
          { original: 'item_type_uuid', popup: 'item_type_uuid' },
          { original: 'item_type_nm', popup: 'item_type_nm' },
          { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
          { original: 'prod_type_nm', popup: 'prod_type_nm' },
          { original: 'prod_no', popup: 'prod_no' },
          { original: 'prod_nm', popup: 'prod_nm' },
          { original: 'model_uuid', popup: 'model_uuid' },
          { original: 'model_nm', popup: 'model_nm' },
          { original: 'rev', popup: 'rev' },
          { original: 'prod_std', popup: 'prod_std' },
          { original: 'safe_stock', popup: 'safe_stock' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'money_unit_uuid', popup: 'money_unit_uuid' },
          { original: 'money_unit_nm', popup: 'money_unit_nm' },
          { original: 'price_type', popup: 'price_type' },
          { original: 'price', popup: 'price' },
          { original: 'exchange', popup: 'exchange' },
          { original: 'insp_fg', popup: 'qms_receive_insp_fg' },
          { original: 'to_store_uuid', popup: 'to_store_uuid' },
          { original: 'to_store_nm', popup: 'to_store_nm' },
          { original: 'to_location_uuid', popup: 'to_location_uuid' },
          { original: 'to_location_nm', popup: 'to_location_nm' },
          { original: 'order_qty', popup: 'qty' },
          { original: 'order_qty', popup: 'mat_order_min_qty' },
          { original: 'qty', popup: 'balance' },
          { original: 'lot_no', popup: 'lot_no' },
        ],
        columns: [
          {
            header: '품목UUID',
            name: 'prod_uuid',
            format: 'text',
            hidden: true,
          },
          {
            header: '품목 유형UUID',
            name: 'item_type_uuid',
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
            header: '품목 유형명',
            name: 'item_type_nm',
            width: ENUM_WIDTH.L,
            format: 'text',
          },
          {
            header: '제품 유형UUID',
            name: 'prod_type_uuid',
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
            header: '제품 유형명',
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
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            format: 'text',
          },
          {
            header: '모델UUID',
            name: 'model_uuid',
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
            header: '모델명',
            name: 'model_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.S,
            format: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.L,
            format: 'text',
          },
          {
            header: '안전재고',
            name: 'safe_stock',
            width: ENUM_WIDTH.M,
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
          },
          {
            header: '단위수량',
            name: 'unit_qty',
            width: ENUM_WIDTH.M,
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
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
          {
            header: '화폐단위UUID',
            name: 'money_unit_uuid',
            format: 'text',
            hidden: true,
          },
          {
            header: '화폐단위코드',
            name: 'money_unit_cd',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '화폐단위명',
            name: 'money_unit_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: '단가유형UUID',
            name: 'price_type_uuid',
            format: 'text',
            hidden: true,
          },
          {
            header: '단가유형코드',
            name: 'price_type_cd',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '단가유형명',
            name: 'price_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
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
          {
            header: '수입검사',
            name: 'qms_receive_insp_fg',
            width: ENUM_WIDTH.S,
            format: 'check',
          },
          {
            header: '입고창고UUID',
            name: 'to_store_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
          },
          {
            header: '입고창고',
            name: 'to_store_nm',
            width: ENUM_WIDTH.M,
          },
          {
            header: '입고위치UUID',
            name: 'to_location_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
          },
          {
            header: '입고위치',
            name: 'to_location_nm',
            width: ENUM_WIDTH.M,
          },
          {
            header: '발주최소수량',
            name: 'mat_order_min_qty',
            width: ENUM_WIDTH.M,
            format: 'number',
          },
          {
            header: 'LOT_NO',
            name: 'lot_no',
            width: ENUM_WIDTH.M,
            hidden: true,
            defaultValue: getToday(0, { format: 'YYYYMMDD' }),
          },
        ],
        dataApiSettings: () => {
          type TParams = {
            date?: string;
            partner_uuid?: string;
            supplier_uuid?: string;
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

          if (inputValues != null) {
            params = {
              uuid: newDataPopupGridVisible ? null : inputValues?.receive_uuid,
              partner_uuid: inputValues?.partner_uuid,
              supplier_uuid: inputValues?.supplier_uuid,
              date: inputValues?.reg_date
                ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                : null,
            };
          }

          return {
            uriPath: '/std/vendor-prices',
            params,
            onInterlock: () => {
              let showPopup: boolean = false;

              if (params?.date == null) {
                message.warn('입하일을 입력하신 후 다시 시도해주세요.');
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
      gridPopupInfo: detailGrid.gridInfo.gridPopupInfo,
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
        ['qty', 'price', 'money_unit_nm', 'exchange', 'carry_fg'].includes(
          el?.name,
        )
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

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = uuid => {
    if (!uuid) return;

    const uriPath = detailSearchUriPath.replace('$', uuid);
    getData(detailSearchInfo?.values, uriPath, 'header-details').then(res => {
      detailGrid.setGridData(res?.details || []);
    });
  };
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {
      type: 'rangepicker',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '입하일',
    },
  ]);

  const detailSearchInfo = null; //useSearchbox('DETAIL_SEARCH_INPUTBOX', []);

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
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  };
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'receive_uuid',
      alias: 'uuid',
      label: '외주입하UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '입하일',
      disabled: true,
      default: getToday(),
    },
    { type: 'text', id: 'stmt_no', label: '전표번호', disabled: true },
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
      params: { partner_fg: 1 },
      handleChange: values => {
        newDataPopupGrid?.setGridData([]);
      },
    },
    {
      type: 'text',
      id: 'supplier_nm',
      label: '공급처',
      disabled: true,
      usePopup: true,
      popupKeys: ['supplier_uuid', 'supplier_nm'],
      popupButtonSettings: {
        datagridSettings: {
          gridId: null,
          columns: getPopupForm('공급처관리').datagridProps.columns,
        },
        dataApiSettings: el => {
          return {
            uriPath: URL_PATH_STD.SUPPLIER.GET.SUPPLIERS,
            params: {
              partner_uuid: el?.values?.partner_uuid,
            },
            onInterlock: () => {
              if (el?.values?.partner_uuid) {
                return true;
              } else {
                message.warning('거래처를 먼저 선택해주세요.');
                return false;
              }
            },
          };
        },
        modalSettings: { title: '공급처 선택' },
      },
    },
    { type: 'text', id: 'remark', label: '비고', disabled: true },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (!['total_price', 'stmt_no'].includes(el?.id)) el['disabled'] = false;

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
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
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.receive_uuid);
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
          const headerRow = res?.datas?.raws[0]?.receive?.header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values?.receive_uuid == null) {
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
    console.log(isSuccess, savedData);
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.receive_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys),
    );
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
        onSearch: () => onSearchDetail(selectedHeaderRow?.receive_uuid),
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
