import React, { useLayoutEffect, useState } from 'react';
import {
  COLUMN_CODE,
  EDIT_ACTION_CODE,
  getPopupForm,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import ITpDoubleGridProps, {
  TExtraGridPopups,
} from '~/components/templates/grid-double/grid-double.template.type';
import { FormikValues } from 'formik';
import { cloneDeep } from 'lodash';

const changeNameToAlias = (data: object, items: any[]) => {
  let newData = cloneDeep(data);

  Object.keys(newData)?.forEach(key => {
    const item = items?.find(el => el?.id === key);
    if (item?.alias) newData[item?.alias] = newData[key];
  });
  return newData;
};

/** 부적합품판정 */
export const PgQmsRework = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const defaultDetailGridMode: TGridMode = 'view';
  const searchUriPath = '/qms/reworks';
  const saveUriPath = '/qms/reworks';
  const detailSearchUriPath = '/qms/rework-disassembles';
  const detailSaveUriPath = '/qms/rework-disassembles';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const STOCK_POPUP = getPopupForm('재고관리');

  /** 팝업 상태 관리 */
  const [disassemblePopupVisible, setDisassemblePopupVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    { type: 'date', id: 'reg_date', label: '작업일', default: getToday() },
    {
      type: 'combo',
      id: 'rework_type_cd',
      label: '일괄처리기준',
      default: 'DISPOSAL',
      firstItemType: 'none',
      options: [
        { code: 'DISPOSAL', text: '폐기' },
        { code: 'REWORK', text: '재작업' },
        { code: 'RETURN', text: '반품' },
      ],
    },
  ]);
  const editDataPopupInputInfo = useInputGroup(
    'EDOT_DATA_POPUP_INPUT_BOX',
    cloneDeep(newDataPopupInputInfo?.props?.inputItems)?.filter(
      el => el?.id !== 'rework_type_cd',
    ),
  );

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '부적합품판정UUID',
        name: 'rework_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '판정일',
        name: 'reg_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
        requiredField: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
      },
      { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
      { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
      {
        header: '부적합UUID',
        name: 'reject_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '부적합',
        name: 'reject_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        requiredField: true,
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '부적합판정 수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
        editable: true,
        requiredField: true,
      },
      {
        header: '부적합판정 UUID',
        name: 'rework_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '부적합판정 코드',
        name: 'rework_type_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '부적합판정',
        name: 'rework_type_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '출고창고UUID',
        name: 'from_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '출고창고',
        name: 'from_store_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '출고위치UUID',
        name: 'from_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '출고위치',
        name: 'from_location_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
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
        format: 'popup',
        filter: 'text',
        editable: true,
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
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '비교',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
    ],
    {
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridPopupInfo: [
        {
          // 출고창고 팝업
          columnNames: [
            { original: 'from_store_uuid', popup: 'store_uuid' },
            { original: 'from_store_nm', popup: 'store_nm' },
          ],
          columns: STORE_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: STORE_POPUP.uriPath,
            params: {
              store_type: 'reject',
            },
          },
          gridMode: 'select',
        },
        {
          // 입고창고 팝업
          columnNames: [
            { original: 'to_store_uuid', popup: 'store_uuid' },
            { original: 'to_store_nm', popup: 'store_nm' },
          ],
          columns: STORE_POPUP.datagridProps?.columns,
          dataApiSettings: (el: any) => {
            const { rowKey, instance } = el;
            const { rawData } = instance?.store.data;

            const rowData = rawData[rowKey];

            return {
              uriPath: STORE_POPUP.uriPath,
              params: {
                store_type: 'all',
              },
              onInterlock: () => {
                if (rowData?.rework_type_nm == null) {
                  message.warning('부적합판정을 먼저 선택해주세요');
                  return false;
                }

                if (rowData?.rework_type_nm == '폐기') {
                  message.warning('폐기는 입고창고를 선택할 수 없습니다');
                  return false;
                }

                return true;
              },
            };
          },
          gridMode: 'select',
        },
        {
          // 출고위치 팝업
          columnNames: [
            { original: 'from_location_uuid', popup: 'location_uuid' },
            { original: 'from_location_nm', popup: 'location_nm' },
          ],
          columns: LOCATION_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: LOCATION_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
        },
        {
          // 입고위치 팝업
          columnNames: [
            { original: 'to_location_uuid', popup: 'location_uuid' },
            { original: 'to_location_nm', popup: 'location_nm' },
          ],
          columns: LOCATION_POPUP.datagridProps?.columns,
          dataApiSettings: el => {
            const { rowKey, instance } = el;
            const { rawData } = instance?.store.data;

            const rowData = rawData[rowKey];

            return {
              uriPath: LOCATION_POPUP.uriPath,
              params: {},
              onInterlock: () => {
                if (rowData?.rework_type_nm === '재작업') {
                  return true;
                } else {
                  message.warning('부적합판정이 재작업일 때 입력 가능합니다');
                  return false;
                }
              },
            };
          },
          gridMode: 'select',
        },
        {
          // 재작업유형 팝업
          columnNames: [
            { original: 'rework_type_uuid', popup: 'rework_type_uuid' },
            { original: 'rework_type_cd', popup: 'rework_type_cd' },
            { original: 'rework_type_nm', popup: 'rework_type_nm' },
          ],
          columns: [
            {
              header: '재작업유형UUID',
              name: 'rework_type_uuid',
              hidden: true,
            },
            { header: '재작업유형코드', name: 'rework_type_cd', hidden: true },
            { header: '재작업유형', name: 'rework_type_nm', filter: 'text' },
          ],
          dataApiSettings: (el: any) => {
            const { rowKey, instance } = el;
            const { rawData } = instance?.store.data;
            const rowData = rawData[rowKey];
            return {
              uriPath: '/adm/rework-types',
              params: {},
              onAfterOk: () => {
                if (rowData.rework_type_nm === '분해') {
                  message.warn(
                    '분해 판정은 분해이력 추가 버튼을 이용해 주세요',
                  );
                  rowData.rework_type_cd = '';
                  rowData.rework_type_nm = '';
                  return;
                }
                rowData.to_store_uuid = '';
                rowData.to_store_nm = '';
                rowData.to_location_uuid = '';
                rowData.to_location_nm = '';
              },
            };
          },

          gridMode: 'select',
        },
      ],
      rowAddPopupInfo: {
        columnNames: [
          { original: 'reg_date', popup: 'reg_date' },
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
          { original: 'lot_no', popup: 'lot_no' },
          { original: 'reject_uuid', popup: 'reject_uuid' },
          { original: 'reject_cd', popup: 'reject_cd' },
          { original: 'reject_nm', popup: 'reject_nm' },
          { original: 'reject_type_uuid', popup: 'reject_type_uuid' },
          { original: 'prod_std', popup: 'prod_std' },
          { original: 'safe_stock', popup: 'safe_stock' },
          { original: 'unit_qty', popup: 'unit_qty' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'from_store_uuid', popup: 'store_uuid' },
          { original: 'from_store_nm', popup: 'store_nm' },
          { original: 'from_location_uuid', popup: 'location_uuid' },
          { original: 'from_location_nm', popup: 'location_nm' },
          { original: 'qty', popup: 'qty' },
        ],
        columns: STOCK_POPUP.datagridProps?.columns,
        dataApiSettings: () => {
          let params: FormikValues = {};

          if (newDataPopupGridVisible) {
            params = newDataPopupInputInfo.ref.current?.values;
          } else if (editDataPopupGridVisible) {
            params = editDataPopupInputInfo.ref.current?.values;
          }

          return {
            uriPath: STOCK_POPUP.uriPath,
            params: {
              reg_date: params?.reg_date,
              stock_type: 'reject',
              grouped_type: 'all',
              price_type: 'all',
            },
            onInterlock: () => {
              if (!params?.reg_date) {
                message.info('작업일을 선택한 후 다시 시도해주세요.');
                return false;
              } else return true;
            },
          };
        },
        gridMode: 'multi-select',
      },
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '부적합품판정 분해UUID',
        name: 'rework_disassemble_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '부적합품판정UUID',
        name: 'rework_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '품번', name: 'prod_no', width: ENUM_WIDTH.M, filter: 'text' },
      { header: '품명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
      { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
      { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
      {
        header: '부적합UUID',
        name: 'reject_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '부적합',
        name: 'reject_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
      },
      { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '입고 수량',
        name: 'income_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
      },
      {
        header: '반출 수량',
        name: 'return_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
      },
      {
        header: '폐기 수량',
        name: 'disposal_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
      },
      {
        header: '분해시입고창고UUID',
        name: 'income_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '입고 창고', name: 'income_store_nm', width: ENUM_WIDTH.M },
      {
        header: '분해시입고위치UUID',
        name: 'income_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '입고 위치', name: 'income_location_nm', width: ENUM_WIDTH.M },
      {
        header: '반출 창고UUID',
        name: 'return_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '반출 창고', name: 'return_store_nm', width: ENUM_WIDTH.M },
      {
        header: '반출 위치UUID',
        name: 'return_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '반출 위치', name: 'return_location_nm', width: ENUM_WIDTH.M },
      { header: '비교', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: defaultDetailGridMode,
      title: '분해이력',
    },
  );

  const newDataPopupGridColumns = cloneDeep(grid.gridInfo.columns)?.filter(
    el => el?.name !== 'reg_date',
  );
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      saveUriPath: saveUriPath,
      saveParams: newDataPopupInputInfo?.values,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
      extraButtons: [
        {
          buttonProps: { text: '분해이력 추가' },
          buttonAction: (ev, props, options) => {
            //분해이력을 등록하는 팝업 열기
            setDisassemblePopupVisible(true);
          },
        },
        {
          buttonProps: { text: '일괄 처리' },
          buttonAction: (ev, props, options) => {
            const inputValues = newDataPopupInputInfo?.values;
            getData(
              {
                stock_type: 'reject',
                grouped_type: 'all',
                price_type: 'all',
                exclude_zero_fg: true,
                reg_date: getToday(),
              },
              STOCK_POPUP.uriPath,
            ).then(res => {
              res?.map(el => {
                el[COLUMN_CODE.EDIT] = EDIT_ACTION_CODE.CREATE;
                el['rework_type_cd'] = inputValues?.rework_type_cd;

                const rework_type_nm =
                  el['rework_type_cd'] === 'REWORK'
                    ? '재작업'
                    : el['rework_type_cd'] === 'DISPOSAL'
                    ? '폐기'
                    : el['rework_type_cd'] === 'DISASSEMBLE'
                    ? '분해'
                    : el['rework_type_cd'] === 'RETURN'
                    ? '반품'
                    : null;

                el['rework_type_nm'] = rework_type_nm;

                el['from_store_uuid'] = el?.store_uuid;
                el['from_store_nm'] = el?.store_nm;

                el['reg_date'] = inputValues?.reg_date;

                return el;
              });

              const rows = res?.filter(el => el?.reject_uuid != null);

              newDataPopupGrid?.setGridData(rows || []);
            });
          },
        },
      ],
    },
  );
  const editDataPopupGridColumns = cloneDeep(
    newDataPopupGrid?.gridInfo?.columns,
  )?.map(el => {
    if (el?.name !== 'remark') el['editable'] = false;

    return el;
  });
  const editDataPopupGrid = useGrid(
    'EDIT_POPUP_GRID',
    editDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
    },
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    // {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], label:'작업기간', defaults:[getToday(-7), getToday()]},
    { type: 'date', id: 'reg_date', label: '작업일', default: getToday() },
  ]);

  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', null);

  /** 액션 관리 */
  const onClickHeader = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      onSearchDetail(selectedHeaderRow?.rework_uuid);
    }
  }, [selectedHeaderRow]);

  /** 검색 */
  const onSearch = () => {
    const searchParams: any = cleanupKeyOfObject(
      searchInfo?.ref.current.values,
      searchInfo.searchItemKeys,
    );

    let data = [];

    getData(
      {
        start_date: searchParams?.reg_date,
        end_date: searchParams?.reg_date,
      },
      searchUriPath,
    )
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        grid.setGridData(data);
        detailGrid.setGridData([]);
      });
  };

  const onSearchDetail = uuid => {
    if (uuid == null) return;

    const searchParams: any = {
      rework_uuid: uuid,
    };

    let data = [];

    getData(searchParams, detailSearchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        detailGrid.setGridData(data);
      });
  };

  /** UPDATE / DELETE 저장 기능 */
  const onSave = () => {
    const { gridRef, setGridMode } = grid;
    const { columns, saveUriPath } = grid.gridInfo;

    dataGridEvents.onSave(
      'basic',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
        defaultGridMode,
      },
      inputInfo?.values,
      modal,
      () => onSearch(),
    );
  };

  useLayoutEffect(() => {
    if (editDataPopupGridVisible && editDataPopupGrid) {
      editDataPopupGrid?.setGridData(grid?.gridInfo?.data || []);
    }
  }, [editDataPopupGridVisible, editDataPopupGrid]);

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch();
    },

    /** 수정 */
    update: () => {
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (
        getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows
          ?.length === 0
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

    createDetail: null,

    /** 저장 */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const { gridRef, setGridMode } = grid;
      const { columns } = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel,
  };

  const fomulaQty = (fomulaParams, props, columnType: '입고' | '반출') => {
    const instance = fomulaParams?.gridRef?.current?.getInstance();
    const inputValue = Number(fomulaParams?.value);
    const targetValue = Number(
      fomulaParams?.targetValues[fomulaParams?.targetColumnNames[0]],
    );
    const maxValue = Number(
      fomulaParams?.targetValues[fomulaParams?.targetColumnNames[1]],
    );

    const compareValue = maxValue - (inputValue + targetValue);

    if (inputValue + targetValue > maxValue) {
      message.error(`판정 수량보다 더 많이 ${columnType}시킬 수 없습니다.`);
      instance?.setValue(fomulaParams?.rowKey, fomulaParams?.columnName, 0);
      return maxValue - targetValue;
    }

    if (inputValue < 0) {
      message.error(`마이너스로 ${columnType}시킬 수 없습니다.`);
      instance?.setValue(fomulaParams?.rowKey, fomulaParams?.columnName, 0);
      return maxValue - targetValue;
    }

    return compareValue;
  };

  //#region 🔶 분해이력 관리
  const disassemblePopupGrid = useGrid(
    'DISASSEMBLE_GRID',
    [
      {
        header: '부적합품판정분해UUID',
        name: 'rework_disassemble_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
      },
      { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, filter: 'text' },
      { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.S, filter: 'text' },
      {
        header: '소요량',
        name: 'usage',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_USE_STOCK,
        filter: 'number',
      },
      {
        header: '기준수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
      },
      {
        header: '재입고 LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고수량',
        name: 'income_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
        defaultValue: 0,
        editable: true,
        formula: {
          targetColumnNames: ['return_qty', 'qty'],
          resultColumnName: 'disposal_qty',
          formula: (fomulaParams, props) =>
            fomulaQty(fomulaParams, props, '입고'),
        },
      },
      {
        header: '입고창고UUID',
        name: 'income_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '입고창고',
        name: 'income_store_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '입고위치UUID',
        name: 'income_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '입고위치',
        name: 'income_location_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '반출수량',
        name: 'return_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
        defaultValue: 0,
        editable: true,
        formula: {
          targetColumnNames: ['income_qty', 'qty'],
          resultColumnName: 'disposal_qty',
          formula: (fomulaParams, props) =>
            fomulaQty(fomulaParams, props, '반출'),
        },
      },
      {
        header: '반출창고UUID',
        name: 'return_store_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '반출창고',
        name: 'return_store_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '반출위치UUID',
        name: 'return_location_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '반출위치',
        name: 'return_location_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '폐기수량',
        name: 'disposal_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        filter: 'number',
        defaultValue: 0,
      },
      {
        header: '비교',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
    ],
    {
      title: '분해 이력',
      hiddenActionButtons: true,
      gridMode: 'create',
      gridPopupInfo: [
        {
          // 입고창고
          columnNames: [
            { original: 'income_store_uuid', popup: 'store_uuid' },
            { original: 'income_store_nm', popup: 'store_nm' },
          ],
          columns: STORE_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: STORE_POPUP.uriPath,
            params: {
              store_type: 'all',
            },
          },
          gridMode: 'select',
        },
        {
          // 입고위치
          columnNames: [
            { original: 'income_location_uuid', popup: 'location_uuid' },
            { original: 'income_location_nm', popup: 'location_nm' },
          ],
          columns: LOCATION_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: LOCATION_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
        },
        {
          // 반출창고
          columnNames: [
            { original: 'return_store_uuid', popup: 'store_uuid' },
            { original: 'return_store_nm', popup: 'store_nm' },
          ],
          columns: STORE_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: STORE_POPUP.uriPath,
            params: {
              store_type: 'all',
            },
          },
          gridMode: 'select',
        },
        {
          // 반출위치
          columnNames: [
            { original: 'return_location_uuid', popup: 'location_uuid' },
            { original: 'return_location_nm', popup: 'location_nm' },
          ],
          columns: LOCATION_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: LOCATION_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
        },
      ],
    },
  );

  const disassemblePopupInputInfo = useInputGroup('DISASSEMBLE_INPUTBOX', [
    { type: 'date', id: 'reg_date', label: '작업일', default: getToday() },
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
      usePopup: true,
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: STOCK_POPUP.uriPath,
          params: {
            stock_type: 'reject',
            grouped_type: 'all',
            price_type: 'all',
            reg_date: getToday(),
          },
        },
        datagridSettings: {
          gridId: 'STOCK_POPUP',
          columns: STOCK_POPUP.datagridProps?.columns,
        },
        modalSettings: STOCK_POPUP.modalProps,
      },
      popupKeys: [
        'prod_uuid',
        'prod_no',
        'prod_nm',
        'prod_std',
        'reject_uuid',
        'reject_nm',
        'store_uuid',
        'store_nm',
        'location_uuid',
        'location_nm',
        'lot_no',
        'stock_qty',
        'remark',
        'qty',
      ],
    },
    { type: 'text', id: 'prod_nm', label: '품명', disabled: true },
    { type: 'text', id: 'prod_std', label: '규격', disabled: true },
    {
      type: 'text',
      id: 'reject_uuid',
      label: '부적합UUID',
      disabled: true,
      hidden: true,
    },
    { type: 'text', id: 'reject_nm', label: '부적합', disabled: true },
    {
      type: 'text',
      id: 'store_uuid',
      alias: 'from_store_uuid',
      label: '창고UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'store_nm',
      alias: 'from_store_nm',
      label: '창고',
      disabled: true,
    },
    {
      type: 'text',
      id: 'location_uuid',
      alias: 'from_location_uuid',
      label: '위치UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'location_nm',
      alias: 'from_location_nm',
      label: '위치',
      disabled: true,
    },
    { type: 'text', id: 'lot_no', label: 'LOT NO', disabled: true },
    {
      type: 'number',
      id: 'stock_qty',
      label: '재고',
      disabled: true,
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      type: 'number',
      id: 'qty',
      label: '부적합품 판정 수량',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    { type: 'text', id: 'remark', label: '비고' },
  ]);

  /** 분해이력에서 품목이 변경됐을 때, 그리드 데이터를 해당 하위 BOM 데이터로 리셋합니다. */
  useLayoutEffect(() => {
    const inputValues = disassemblePopupInputInfo?.values;
    if (!inputValues || inputValues.length === {}) return;

    const prod_uuid = inputValues?.prod_uuid;

    if (!prod_uuid) return;

    getData({ p_prod_uuid: prod_uuid }, '/std/boms').then(res => {
      res?.map(el => {
        el['_edit'] = EDIT_ACTION_CODE.CREATE;
        el['prod_uuid'] = el?.c_prod_uuid;
        el['prod_no'] = el?.c_prod_no;
        el['prod_nm'] = el?.c_prod_nm;
        el['prod_std'] = el?.c_prod_std;
        el['rev'] = el?.c_rev;
        el['prod_type_uuid'] = el?.c_prod_type_uuid;
        el['prod_type_nm'] = el?.c_prod_type_nm;
        el['item_type_uuid'] = el?.c_item_type_uuid;
        el['item_type_nm'] = el?.c_item_type_nm;
        el['model_uuid'] = el?.c_model_uuid;
        el['model_nm'] = el?.c_model_nm;
        el['unit_uuid'] = el?.c_unit_uuid;
        el['unit_nm'] = el?.c_unit_nm;
        el['usage'] = el?.c_usage;
        el['qty'] = inputValues?.qty;
        return el;
      });

      disassemblePopupGrid?.setGridData(res || []);
    });
  }, [disassemblePopupInputInfo?.values?.prod_uuid]);
  //#endregion

  const extraGridPopups: TExtraGridPopups = [
    {
      ...disassemblePopupGrid?.gridInfo,
      popupId: 'EXTRA_POPUP_DISASSEMBLE',
      gridMode: 'create',
      visible: disassemblePopupVisible,
      saveType: 'headerInclude',
      searchUriPath: '/qms/rework-disassembles',
      saveUriPath: '/qms/reworks/disassembles',
      okText: '저장하기',
      onCancel: () => {
        disassemblePopupInputInfo?.instance?.resetForm();
        setDisassemblePopupVisible(false);
      },
      onAfterOk: success => {
        if (success) {
          setNewDataPopupGridVisible(false);
          setEditDataPopupGridVisible(false);
          setDisassemblePopupVisible(false);

          onSearch();
        }
      },
      saveOptionParams: changeNameToAlias(
        disassemblePopupInputInfo?.values,
        disassemblePopupInputInfo?.inputItems,
      ),
      inputProps: disassemblePopupInputInfo?.props,
    },
  ];

  /** 템플릿에 전달할 값 */
  const props: ITpDoubleGridProps = {
    title,
    dataSaveType: 'basic',
    templateOrientation: 'horizontal',
    gridRefs: [grid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...grid.gridInfo,
        onAfterClick: onClickHeader,
      },
      detailGrid.gridInfo,
    ],
    searchProps: [
      {
        ...searchInfo?.props,
        onSearch,
      },
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.rework_uuid),
      },
    ],
    inputProps: [null, null],

    popupGridRefs: [newDataPopupGrid.gridRef, null, editDataPopupGrid.gridRef],
    popupGridInfos: [
      newDataPopupGrid.gridInfo,
      null,
      editDataPopupGrid.gridInfo,
    ],
    popupVisibles: [newDataPopupGridVisible, null, editDataPopupGridVisible],
    setPopupVisibles: [
      setNewDataPopupGridVisible,
      null,
      setEditDataPopupGridVisible,
    ],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      null,
      editDataPopupInputInfo?.props,
    ],

    extraGridPopups,

    buttonActions,
    modalContext,
  };

  return <TpDoubleGrid {...props} />;
};
