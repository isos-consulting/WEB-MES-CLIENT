import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { TpSingleGrid } from '~/components/templates';
import { useGrid } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';
import { dataGridEvents, getData, getPageName } from '~/functions';

enum TenantHeaderOptions {
  gridName = 'Grid',
  gridMode = 'View',
  searchUriPath = '/std/tenant-opts',
  saveUriPath = '/std/tenant-opts',
}

export const PgStdTenantOption = () => {
  const handleSearchButtonClick = async () => {
    const tenantOptData = await getData([], TenantHeaderOptions.searchUriPath);

    grid.setGridData(tenantOptData);
  };

  const handleSaveButtonClick = () => {
    const { gridRef, setGridMode } = grid;
    const { columns, saveUriPath } = grid.gridInfo;

    dataGridEvents.onSave(
      'basic',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      null,
      modal,
      handleSearchButtonClick,
    );
  };

  const handleEditCancelAction = () => {
    const { gridRef, setGridMode } = grid;
    const { columns } = grid.gridInfo;
    dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
  };

  const [modal, modalContext] = Modal.useModal();
  const grid = useGrid(
    TenantHeaderOptions.gridName,
    [
      {
        header: '옵션 UUID',
        name: 'tenant_opt_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.XXL,
        filter: 'text',
        requiredField: true,
        hidden: true,
      },
      {
        header: '옵션 코드',
        name: 'tenant_opt_cd',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '옵션명',
        name: 'tenant_opt_nm',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        requiredField: true,
      },
      {
        header: '옵션값',
        name: 'value',
        width: ENUM_WIDTH.S,
        filter: 'number',
        editable: true,
        requiredField: true,
      },
      {
        header: '설명',
        name: 'remark',
        width: ENUM_WIDTH.XXL,
        filter: 'text',
        whiteSpace: 'normal',
      },
    ],
    {
      serchUriPath: TenantHeaderOptions.searchUriPath,
      saveUriPath: TenantHeaderOptions.saveUriPath,
      gridMode: TenantHeaderOptions.gridMode,
      rowHeight: 'auto',
    },
  );

  const buttonActions = {
    search: handleSearchButtonClick,
    update: () => {
      toggle(!editTenantDataModalVisible);
    },
    save: handleSaveButtonClick,
    cancelEdit: handleEditCancelAction,
  };

  const [editTenantDataModalVisible, toggle] = useState<boolean>(false);

  const editTenantDataModalGrid = useGrid(
    'EDIT_MODAL_GRID',
    grid.gridInfo.columns,
    {
      seachUriPath: TenantHeaderOptions.searchUriPath,
      saveUriPath: TenantHeaderOptions.saveUriPath,
      rowHeight: 'auto',
    },
  );

  const tenantOptionTemplateProps = {
    title: getPageName(),
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: null,
    inputProps: null,
    popupGridRef: [null, editTenantDataModalGrid.gridRef],
    popupGridInfo: [null, editTenantDataModalGrid.gridInfo],
    popupVisible: [null, editTenantDataModalVisible],
    setPopupVisible: [null, toggle],
    popupInputProps: [null, null],
    buttonActions,
    modalContext,
  };
  return <TpSingleGrid {...tenantOptionTemplateProps} />;
};
