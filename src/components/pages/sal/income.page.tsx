import React, { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { cloneDeep } from 'lodash';

/** 제품입고 */
export const PgSalIncome = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/sal/incomes';
  const saveUriPath = '/sal/incomes';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '제품입고아이디',
        name: 'income_uuid',
        width: ENUM_WIDTH.M,
        alias: 'uuid',
        filter: 'text',
        format: 'text',
        hidden: true,
      },
      {
        header: '입고일시',
        name: 'reg_date',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'date',
        requiredField: true,
      },
      {
        header: '품목아이디',
        name: 'prod_uuid',
        filter: 'text',
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품명',
        name: 'prod_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: false,
        requiredField: true,
      },
      {
        header: '모델아이디',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '모델코드',
        name: 'model_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
      },
      {
        header: '리비전',
        name: 'rev',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
      },
      {
        header: '단위아이디',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '단위코드',
        name: 'unit_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
      },
      {
        header: 'LOT NO',
        name: 'lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'text',
        requiredField: true,
      },
      {
        header: '수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STOCK,
        editable: true,
        requiredField: true,
      },
      {
        header: '출고창고아이디',
        name: 'from_store_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '출고창고명',
        name: 'from_store_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        requiredField: true,
      },
      {
        header: '출고위치아이디',
        name: 'from_location_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'text',
        hidden: true,
      },
      {
        header: '출고위치코드',
        name: 'from_location_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'text',
        hidden: true,
      },
      {
        header: '출고위치명',
        name: 'from_location_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'text',
        hidden: true,
      },
      {
        header: '입고창고아이디',
        name: 'to_store_uuid',
        width: ENUM_WIDTH.M,
        format: 'popup',
        hidden: true,
        requiredField: true,
      },
      {
        header: '입고창고명',
        name: 'to_store_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고위치아이디',
        name: 'to_location_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '입고위치명',
        name: 'to_location_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        editable: true,
      },

      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridPopupInfo: [
        {
          // 창고팝업
          columnNames: [
            { original: 'to_store_uuid', popup: 'store_uuid' },
            { original: 'to_store_nm', popup: 'store_nm' },
          ],
          columns: [
            {
              header: '창고UUID',
              name: 'store_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '창고코드',
              name: 'store_cd',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '창고명',
              name: 'store_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/stores',
            params: { store_type: 'outgo' },
          },
          gridMode: 'select',
        },
        {
          // 위치팝업
          columnNames: [
            { original: 'to_location_uuid', popup: 'location_uuid' },
            { original: 'to_location_nm', popup: 'location_nm' },
          ],
          columns: [
            {
              header: '위치UUID',
              name: 'location_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '위치코드',
              name: 'location_cd',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '위치명',
              name: 'location_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: ev => {
            const { rowKey, instance } = ev;
            const { rawData } = instance?.store?.data;

            const storeUuid = rawData[rowKey]?.to_store_uuid;
            return {
              uriPath: '/std/locations',
              params: { store_uuid: storeUuid ?? '' },
            };
          },
          gridMode: 'select',
        },
      ],
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    cloneDeep(grid.gridInfo.columns)?.filter(el => el.name !== 'reg_date'),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: {
        columnNames: [
          { original: 'prod_uuid', popup: 'prod_uuid' },
          { original: 'item_type_uuid', popup: 'item_type_uuid' },
          { original: 'item_type_nm', popup: 'item_type_nm' },
          { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
          { original: 'prod_type_nm', popup: 'prod_type_nm' },
          { original: 'prod_no', popup: 'prod_no' },
          { original: 'prod_nm', popup: 'prod_nm' },
          { original: 'model_nm', popup: 'model_nm' },
          { original: 'rev', popup: 'rev' },
          { original: 'prod_std', popup: 'prod_std' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'lot_no', popup: 'lot_no' },
          { original: 'qty', popup: 'qty' },
          { original: 'from_store_uuid', popup: 'store_uuid' },
          { original: 'from_store_nm', popup: 'store_nm' },
          { original: 'from_location_uuid', popup: 'location_uuid' },
          { original: 'from_location_nm', popup: 'location_nm' },
        ],
        columns: [
          {
            header: '품목UUID',
            name: 'prod_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '품목유형UUID',
            name: 'item_type_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: '제품유형UUID',
            name: 'prod_type_uuid',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
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
          { header: 'rev', name: 'rev', width: ENUM_WIDTH.M, format: 'text' },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            format: 'text',
          },
          {
            header: '창고UUID',
            name: 'store_uuid',
            width: ENUM_WIDTH.L,
            format: 'text',
            hidden: true,
          },
          {
            header: '창고',
            name: 'store_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: '위치UUID',
            name: 'location_uuid',
            width: ENUM_WIDTH.L,
            format: 'text',
            hidden: true,
          },
          {
            header: '위치',
            name: 'location_nm',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: 'LOT NO',
            name: 'lot_no',
            width: ENUM_WIDTH.M,
            format: 'text',
          },
          {
            header: '재고',
            name: 'qty',
            width: ENUM_WIDTH.M,
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
          },
        ],
        dataApiSettings: ev => {
          const params = {
            stock_type: 'available',
            grouped_type: 'all',
            price_type: 'all',
            exclude_zero_fg: true,
            exclude_minus_fg: true,
          };

          if (newDataPopupGridVisible) {
            params['reg_date'] =
              newDataPopupInputInfo.ref.current.values?.reg_date;
          } else if (setEditDataPopupGridVisible) {
            params['reg_date'] =
              editDataPopupInputInfo.ref.current.values?.reg_date;
          }

          return {
            uriPath: '/inv/stores/stocks',
            params,
          };
        },
        gridMode: 'multi-select',
      },
    },
  );
  const editDataPopupGrid = useGrid(
    'EDIT_POPUP_GRID',
    cloneDeep(grid.gridInfo.columns)?.filter(el => {
      if (el.name === 'to_location_nm' || el.name === 'to_store_nm') {
        el.editable = false;
      }

      if (['income_uuid', 'qty'].includes(el?.name)) {
        el['requiredField'] = true;
      } else {
        el['requiredField'] = false;
      }

      return el.name !== 'reg_date';
    }),
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
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '입고일',
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    { type: 'date', id: 'reg_date', label: '입고일', default: getToday() },
  ]);
  const editDataPopupInputInfo = useInputGroup(
    'EDOT_DATA_POPUP_INPUT_BOX',
    newDataPopupInputInfo?.props?.inputItems,
  );

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    const searchParams = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

    let data = [];

    getData(searchParams, searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        grid.setGridData(data);
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
      () => onSearch(searchInfo?.values),
    );
  };

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
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

  /** 템플릿에 전달할 값 */
  const props: ITpSingleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props,
      onSearch,
    },
    inputProps: null,

    popupGridRef: [newDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfo: [
      {
        ...newDataPopupGrid.gridInfo,
        saveParams: newDataPopupInputInfo?.values,
      },
      editDataPopupGrid.gridInfo,
    ],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
