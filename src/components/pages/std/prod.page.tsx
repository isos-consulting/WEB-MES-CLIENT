import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import stdProdNewModalColumns from './prod/modal/std-prod-new-modal-columns';
import stdProdColumns from './prod/std-prod-columns';
import stdProdComplexColumns from './prod/std-prod-complex-columns';
import stdProdGridpopup from './prod/std-prod-gridpopup';

export const PgStdProd = () => {
  const title = getPageName();

  const [modal, modalContext] = Modal.useModal();

  const defaultGridMode: TGridMode = 'delete';
  const prodsApiUrl = '/std/prods';

  const grid = useGrid('GRID', stdProdColumns, {
    searchUriPath: prodsApiUrl,
    saveUriPath: prodsApiUrl,
    gridMode: defaultGridMode,
    header: {
      complexColumns: stdProdComplexColumns,
    },
    gridPopupInfo: stdProdGridpopup,
  });

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    stdProdNewModalColumns,
    {
      searchUriPath: prodsApiUrl,
      saveUriPath: prodsApiUrl,
      header: grid.gridInfo?.header,
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', stdProdColumns, {
    searchUriPath: prodsApiUrl,
    saveUriPath: prodsApiUrl,
    header: grid.gridInfo?.header,
    gridPopupInfo: grid.gridInfo?.gridPopupInfo,
  });
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  const onSearch = values => {
    const searchParams = {};

    let data = [];

    getData(searchParams, prodsApiUrl)
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        grid.setGridData(data);
      });
  };

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

  const buttonActions = {
    search: () => {
      onSearch(searchInfo?.values);
    },

    update: () => {
      setEditDataPopupGridVisible(true);
    },

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

    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },

    save: () => {
      onSave();
    },

    cancelEdit: () => {
      const { gridRef, setGridMode } = grid;
      const { columns } = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel,
  };

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
