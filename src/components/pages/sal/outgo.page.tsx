import React, { useLayoutEffect, useRef, useState } from 'react';
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
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_STD } from '~/enums';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import Grid from '@toast-ui/react-grid';

// 금액 컬럼 계산 (단가 * 수량 * 환율)
const priceFormula = (params, props) => {
  const { value, targetValues } = params;
  return (
    Number(value) *
      Number(targetValues?._array[0]) *
      Number(targetValues?._array[1]) || 0
  );
};

/** 제품출하 */
export const PgSalOutgo = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/sal/outgos';
  const headerSaveUriPath = '/sal/outgos';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/sal/outgo/$/include-details';
  const detailSaveUriPath = '/sal/outgos';
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

  const gridRef = useRef<Grid>();

  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '제품출하UUID',
        name: 'outgo_uuid',
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
        header: '출하일',
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
        header: '제품출하상세UUID',
        name: 'outgo_detail_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '수주상세UUID',
        name: 'order_detail_uuid',
        hidden: true,
      },
      {
        header: '출하지시상세UUID',
        name: 'outgo_order_detail_uuid',
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
        decimal: ENUM_DECIMAL.DEC_STCOK,
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
        name: 'order_detail_qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
      },
      {
        header: '지시수량',
        name: 'outgo_order_detail_qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        requiredField: true,
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
        header: '수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        requiredField: true,
        editable: true,
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
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
      },
      {
        header: '이월',
        name: 'carry_fg',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '창고UUID',
        name: 'from_store_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '창고',
        name: 'from_store_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '위치UUID',
        name: 'from_location_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '위치',
        name: 'from_location_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '단위수량',
        name: 'unit_qty',
        width: ENUM_WIDTH.M,
        filter: 'number',
        format: 'number',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '바코드',
        name: 'barcode',
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
            { original: 'from_store_uuid', popup: 'store_uuid' },
            { original: 'from_store_nm', popup: 'store_nm' },
          ],
          columns: getPopupForm('창고관리')?.datagridProps?.columns,
          dataApiSettings: {
            uriPath: getPopupForm('창고관리')?.uriPath,
            params: {
              store_type: 'all',
            },
          },
          gridMode: 'select',
        },
        {
          // 입고위치
          popupKey: '위치관리',
          columnNames: [
            { original: 'from_location_uuid', popup: 'location_uuid' },
            { original: 'from_location_nm', popup: 'location_nm' },
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
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
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
          { original: 'lot_no', popup: 'lot_no' },
          { original: 'qty', popup: 'qty' },
        ],
        columns: getPopupForm('재고관리')?.datagridProps?.columns,
        dataApiSettings: () => {
          type TParams = {
            partner_uuid?: string;
            stock_type?: string;
            grouped_type?: string;
            price_type?: string;
            reg_date?: string;
            exclude_zero_fg?: boolean;
            exclude_minus_fg?: boolean;
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
              partner_uuid: inputValues?.partner_uuid,
              stock_type: 'outgo',
              grouped_type: 'all',
              price_type: 'sales',
              exclude_zero_fg: true,
              exclude_minus_fg: true,
              reg_date: inputValues?.reg_date
                ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                : null,
            };
          }

          return {
            uriPath: getPopupForm('재고관리')?.uriPath,
            params,
            onInterlock: () => {
              let showPopup: boolean = false;

              if (params?.reg_date == null) {
                message.warn('출하일을 입력하신 후 다시 시도해주세요.');
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
      extraButtons: [
        {
          buttonProps: { text: '수주 불러오기' },
          buttonAction: (ev, props, options) => {
            const {
              gridRef,
              childGridRef,
              childGridId,
              columns,
              data,
              modal,
              onAppendRow,
            } = options;
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

            if (params?.partner_uuid == null) {
              message.warn('거래처를 선택하신 후 다시 시도해주세요.');
              return;
            }

            getData(params, getPopupForm('수주품목관리')?.uriPath).then(res => {
              modal.confirm({
                title: '수주품목',
                width: '80%',
                content: (
                  <>
                    <Datagrid
                      ref={childGridRef}
                      gridId={'GRID_POPUP_ORDER'}
                      columns={
                        getPopupForm('수주품목관리')?.datagridProps?.columns
                      }
                      gridMode="select"
                      data={res}
                    />
                  </>
                ),
                icon: null,
                okText: '선택',
                onOk: close => {
                  const child = childGridRef.current;
                  const row = child.getInstance().getCheckedRows();
                  let inputValues = null;
                  if (newDataPopupGridVisible) {
                    // 신규 등록 팝업일 경우
                    inputValues = newDataPopupInputInfo.ref.current.values;
                  } else {
                    // 세부 항목 등록 팝업일 경우
                    inputValues = addDataPopupInputInfo.ref.current.values;
                  }
                  if (row.length > 0) {
                    close();
                    getData(
                      {
                        stock_type: 'outgo',
                        grouped_type: 'all',
                        price_type: 'sales',
                        exclude_zero_fg: true,
                        exclude_minus_fg: true,
                        reg_date: inputValues?.reg_date
                          ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                          : null,
                        partner_uuid: params?.partner_uuid,
                        prod_uuid: row[0].prod_uuid,
                      },
                      getPopupForm('재고관리')?.uriPath,
                    ).then(res => {
                      addStocks(
                        {
                          order_detail_uuid: row[0].order_detail_uuid,
                          order_detail_qty: row[0].qty,
                          carry_fg: false,
                        },
                        res,
                        updateColumns,
                        onAppendRow,
                      );
                    });
                  } else {
                    message.warning(
                      '품목을 선택 후 선택 버튼을 클릭 해 주세요.',
                    );
                  }
                },
                cancelText: '취소',
                maskClosable: false,
              });
            });
          },
        },
        {
          buttonProps: { text: '지시 불러오기' },
          buttonAction: (ev, props, options) => {
            const {
              gridRef,
              childGridRef,
              childGridId,
              columns,
              data,
              modal,
              onAppendRow,
            } = options;
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

            if (params?.partner_uuid == null) {
              message.warn('거래처를 선택하신 후 다시 시도해주세요.');
              return;
            }

            getData(params, getPopupForm('출하지시품목관리')?.uriPath).then(
              res => {
                modal.confirm({
                  title: '출하지시품목',
                  width: '80%',
                  content: (
                    <>
                      <Datagrid
                        ref={childGridRef}
                        gridId={'GRID_POPUP_ORDER'}
                        columns={
                          getPopupForm('출하지시품목관리')?.datagridProps
                            ?.columns
                        }
                        gridMode="select"
                        data={res}
                      />
                    </>
                  ),
                  icon: null,
                  okText: '선택',
                  onOk: close => {
                    const child = childGridRef.current;
                    const row = child.getInstance().getCheckedRows();
                    let inputValues = null;
                    if (newDataPopupGridVisible) {
                      // 신규 등록 팝업일 경우
                      inputValues = newDataPopupInputInfo.ref.current.values;
                    } else {
                      // 세부 항목 등록 팝업일 경우
                      inputValues = addDataPopupInputInfo.ref.current.values;
                    }
                    console.log(row);
                    if (row.length > 0) {
                      close();
                      getData(
                        {
                          stock_type: 'outgo',
                          grouped_type: 'all',
                          price_type: 'sales',
                          exclude_zero_fg: true,
                          exclude_minus_fg: true,
                          reg_date: inputValues?.reg_date
                            ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
                            : null,
                          partner_uuid: params?.partner_uuid,
                          prod_uuid: row[0].prod_uuid,
                        },
                        getPopupForm('재고관리')?.uriPath,
                      ).then(res => {
                        addStocks(
                          {
                            order_detail_uuid: row[0].order_detail_uuid,
                            order_detail_qty: row[0].order_qty,
                            outgo_order_detail_uuid: row[0].order_detail_uuid,
                            outgo_order_detail_qty: row[0].qty,
                            carry_fg: false,
                          },
                          res,
                          updateColumns,
                          onAppendRow,
                        );
                      });
                    } else {
                      message.warning(
                        '품목을 선택 후 선택 버튼을 클릭 해 주세요.',
                      );
                    }
                  },
                  cancelText: '취소',
                  maskClosable: false,
                });
              },
            );
          },
        },
      ],
    },
  );

  const addStocks = (mainData, res, updateColumns, onAppendRow) => {
    return modal.confirm({
      title: '재고관리 - 수주품목',
      width: '80%',
      content: (
        <>
          <Datagrid
            ref={gridRef}
            gridId={'GRID_POPUP_ORDER'}
            columns={getPopupForm('재고관리')?.datagridProps?.columns}
            gridMode="multi-select"
            data={res}
          />
        </>
      ),
      icon: null,
      okText: '선택',
      cancelText: '취소',
      onOk: close => {
        const child = gridRef.current;
        const rows = child.getInstance().getCheckedRows();

        let popupGridRef = null;
        if (newDataPopupGridVisible) {
          // 신규 등록 팝업일 경우
          popupGridRef = newDataPopupGrid.gridRef;
        } else {
          // 세부 항목 등록 팝업일 경우
          popupGridRef = editDataPopupGrid.gridRef;
        }

        if (rows.length > 0) {
          rows?.forEach(row => {
            let newRow = {};
            if (typeof row === 'object') {
              updateColumns.forEach(columnName => {
                // 값 설정
                newRow[columnName.original] =
                  row[columnName.popup] != null ? row[columnName.popup] : null;
              });

              // 행 추가
              onAppendRow({ ...mainData, ...newRow });
            }
          });
          close();
        } else {
          message.warning('재고를 선택 후 선택 버튼을 클릭 해 주세요.');
        }
      },
    });
  };

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
      if (['outgo_detail_uuid', 'qty'].includes(el?.name)) {
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
      label: '출하일',
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
      id: 'outgo_uuid',
      alias: 'uuid',
      label: '출하UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '출하일',
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
    },
    {
      type: 'text',
      id: 'delivery_nm',
      label: '납품처',
      disabled: true,
      usePopup: true,
      popupKeys: ['delivery_uuid', 'delivery_nm'],
      popupButtonSettings: {
        datagridSettings: {
          gridId: null,
          columns: getPopupForm('납품처관리').datagridProps.columns,
        },
        dataApiSettings: el => {
          return {
            uriPath: URL_PATH_STD.DELIVERY.GET.DELIVERIES,
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
        modalSettings: { title: '납품처 조회' },
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
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.outgo_uuid);
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
          const headerRow = res?.datas?.raws[0]?.outgo?.header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values?.outgo_uuid == null) {
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
    let selectedRow = searchResult?.find(el => el?.outgo_uuid === uuid);

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
        onSearch: () => onSearchDetail(selectedHeaderRow?.outgo_uuid),
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
