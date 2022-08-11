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
import { ENUM_WIDTH } from '~/enums';
import { message } from 'antd';

/** 창고관리 */
export const PgStdStore = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/stores';
  const saveUriPath = '/std/stores';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '창고UUID',
        name: 'store_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '창고코드',
        name: 'store_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '창고명',
        name: 'store_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '창고 위치 유형(사내/사외)',
        name: 'position_type',
        width: ENUM_WIDTH.XL,
        format: 'combo',
        editable: true,
        requiredField: true,
      },
      {
        header: '가용재고창고여부',
        name: 'available_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '부적합창고여부',
        name: 'reject_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '반출창고여부',
        name: 'return_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '출하창고여부',
        name: 'outgo_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '최종검사창고여부',
        name: 'final_insp_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: '외주창고여부',
        name: 'outsourcing_store_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        editable: true,
        requiredField: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridComboInfo: [
        {
          // 투입단위 콤보박스
          columnNames: [
            {
              codeColName: {
                original: 'position_type',
                popup: 'position_type',
              },
              textColName: {
                original: 'position_type_nm',
                popup: 'position_type_nm',
              },
            },
          ],
          itemList: [
            { code: '사내', text: '사내' },
            { code: '사외', text: '사외' },
          ],
        },
      ],
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridComboInfo: grid.gridInfo.gridComboInfo,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridComboInfo: grid.gridInfo.gridComboInfo,
  });
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    { type: 'text', id: 'store_type', default: 'all', hidden: true },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    const searchKeys = Object.keys(values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

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
