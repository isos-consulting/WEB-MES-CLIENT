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

/** 비가동관리 */
export const PgStdDowntime = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/downtimes';
  const saveUriPath = '/std/downtimes';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '비가동UUID',
        name: 'downtime_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        format: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '비가동 유형UUID',
        name: 'downtime_type_uuid',
        width: ENUM_WIDTH.L,
        format: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '비가동 유형코드',
        name: 'downtime_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '비가동 유형명',
        name: 'downtime_type_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        editable: true,
      },
      {
        header: '비가동코드',
        name: 'downtime_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '비가동명',
        name: 'downtime_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '설비고장여부',
        name: 'eqm_failure_fg',
        width: ENUM_WIDTH.S,
        format: 'check',
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
          // 비가동유형 팝업
          columnNames: [
            { original: 'downtime_type_uuid', popup: 'downtime_type_uuid' },
            { original: 'downtime_type_cd', popup: 'downtime_type_cd' },
            { original: 'downtime_type_nm', popup: 'downtime_type_nm' },
          ],
          columns: [
            {
              header: '비가동유형UUID',
              name: 'downtime_type_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '비가동유형코드',
              name: 'downtime_type_cd',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '비가동유형명',
              name: 'downtime_type_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/downtime-types',
            params: null,
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
  const editDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    },
  );
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
