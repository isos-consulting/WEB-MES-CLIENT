import React, { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';

/** 입학기준 LOT 추적현황 */
export const PgMatReceiveLotTracking = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/mat/receives/lot-tracking';
  const saveUriPath = '/mat/receives/lot-tracking';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '품목UUID',
        name: 'work_prod_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '폼목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      { header: '품번', name: 'prod_no', width: ENUM_WIDTH.L, filter: 'text' },
      { header: '품명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
      { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },

      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      { header: '공정', name: 'proc_nm', width: ENUM_WIDTH.L, filter: 'text' },
      {
        header: '설비UUID',
        name: 'equip_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      { header: '설비', name: 'equip_nm', width: ENUM_WIDTH.L, filter: 'text' },
      {
        header: '생산일자',
        name: 'work_date',
        width: ENUM_WIDTH.L,
        format: 'date',
        filter: 'text',
      },
      {
        header: '품목유형',
        name: 'work_item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품번',
        name: 'work_prod_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '품명',
        name: 'work_prod_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: 'LOT NO',
        name: 'work_lot_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },

      {
        header: '거래처UUID',
        name: 'partner_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '거래처',
        name: 'partner_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '출하일자',
        name: 'out_reg_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
      },

      { header: 'lv', name: 'level', width: ENUM_WIDTH.M, filter: 'text' },
      {
        header: 'sortBy',
        name: 'sortby',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      disabledAutoDateColumn: true,
      header: {
        complexColumns: [
          {
            header: '작업',
            name: '_input',
            childNames: [
              'proc_nm',
              'equip_nm',
              'work_date',
              'work_item_type_nm',
              'work_prod_no',
              'work_prod_nm',
              'work_lot_no',
            ],
          },
          {
            header: '출하',
            name: '_in',
            childNames: ['partner_nm', 'out_reg_date'],
          },
        ],
      },
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
  });
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'text',
      id: 'partner_uuid',
      label: '거래처UUID',
      disabled: true,
      hidden: true,
    },
    { type: 'text', id: 'partner_nm', label: '거래처', disabled: true },
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
        datagridSettings: {
          gridId: 'OUTGO_REPORT',
          columns: [
            {
              header: '출하일자',
              name: 'reg_date',
              width: ENUM_WIDTH.M,
              format: 'date',
              filter: 'text',
            },
            {
              header: '거래처UUID',
              name: 'partner_uuid',
              width: ENUM_WIDTH.M,
              filter: 'text',
              hidden: true,
            },
            {
              header: '거래처',
              name: 'partner_nm',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '품목UUID',
              name: 'prod_uuid',
              width: ENUM_WIDTH.M,
              filter: 'text',
              hidden: true,
            },
            {
              header: '품목유형UUID',
              name: 'item_type_uuid',
              width: ENUM_WIDTH.M,
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
              header: '품번',
              name: 'prod_no',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
            {
              header: '품명',
              name: 'prod_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
            { header: 'Rev', name: 'rev', width: ENUM_WIDTH.M, filter: 'text' },
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
              width: ENUM_WIDTH.M,
              filter: 'text',
              hidden: true,
            },
            {
              header: '단위',
              name: 'unit_nm',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: 'LOT NO',
              name: 'lot_no',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
          ],
        },
        dataApiSettings: {
          uriPath: '/mat/receives/report',
          params: {
            sort_type: 'date',
          },
        },
        modalSettings: {
          title: '입하 리스트',
        },
      },
      popupKeys: [
        'partner_uuid',
        'partner_nm',
        'prod_uuid',
        'prod_no',
        'prod_nm',
        'lot_no',
      ],
    },
    { type: 'text', id: 'lot_no', label: 'LOT NO', disabled: true },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  /** 검색 */
  const onSearch = values => {
    const searchParams: any = cleanupKeyOfObject(
      values,
      searchInfo?.searchItemKeys,
    );

    if (!searchParams?.prod_uuid || !searchParams?.lot_no) {
      message.warn('입하 품목을 먼저 선택하신 후 다시 시도해주세요.');
      return;
    }

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
    templateType: 'report',
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      title: '입하 정보',
      ...searchInfo?.props,
      onSearch,
    },
    inputProps: null,

    popupGridRef: [newDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfo: [newDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
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
