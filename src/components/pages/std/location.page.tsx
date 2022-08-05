import React from 'react';
import { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
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

/** 위치관리 */
export const PgStdLocation = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/locations';
  const saveUriPath = '/std/locations';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '창고UUID',
        name: 'store_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
        requiredField: true,
      },
      {
        header: '창고코드',
        name: 'store_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '창고명',
        name: 'store_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '위치UUID',
        name: 'location_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        hidden: true,
      },
      {
        header: '위치코드',
        name: 'location_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '위치명',
        name: 'location_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridPopupInfo: [
        {
          // 창고 팝업
          columnNames: [
            { original: 'store_uuid', popup: 'store_uuid' },
            { original: 'store_cd', popup: 'store_cd' },
            { original: 'store_nm', popup: 'store_nm' },
          ],
          columns: [
            {
              header: '창고UUID',
              name: 'store_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
              requiredField: true,
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
            params: { store_type: 'all' },
          },
          gridMode: 'select',
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
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridPopupInfo: grid.gridInfo?.gridPopupInfo,
  });
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  /** 검색 */
  const onSearch = values => {
    const searchParams = {};

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
