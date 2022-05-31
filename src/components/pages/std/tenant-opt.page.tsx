import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { TpSingleGrid } from '~/components/templates';
import { useGrid } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';
import { getData, getPageName } from '~/functions';

enum TenantHeaderOptions {
  gridName = 'Grid',
  gridMode = 'View',
  searchUriPath = '/std/tenant-opts',
  saveUriPath = '/std/tenant-opts',
}

export const PgStdTenantOption = () => {
  const [, modalContext] = Modal.useModal();
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
      },
    ],
    {
      serchUriPath: TenantHeaderOptions.searchUriPath,
      saveUriPath: TenantHeaderOptions.saveUriPath,
      gridMode: TenantHeaderOptions.gridMode,
    },
  );

  const buttonActions = {
    search: async () => {
      const tenantOptData = await getData(
        [],
        TenantHeaderOptions.searchUriPath,
      );

      grid.setGridData(tenantOptData);
    },
    update: () => {
      toggle(!editTenantDataModalVisible);
    },
    save: () => {
      () => {};
    },
    cancelEdit: () => {
      () => {};
    },
  };

  const [editTenantDataModalVisible, toggle] = useState<boolean>(false);

  const editTenantDataModalGrid = useGrid(
    'EDIT_MODAL_GRID',
    grid.gridInfo.columns,
    {
      seachUriPath: TenantHeaderOptions.searchUriPath,
      saveUriPath: TenantHeaderOptions.saveUriPath,
    },
  );

  const tenantOptionTemplateProps = {
    title: getPageName(),
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: null,
    inputProps: null,
    popupGridRef: [, editTenantDataModalGrid.gridRef],
    popupGridInfo: [, editTenantDataModalGrid.gridInfo],
    popupVisible: [, editTenantDataModalVisible],
    setPopupVisible: [, toggle],
    popupInputProps: [null, null],
    buttonActions,
    modalContext,
  };
  return <TpSingleGrid {...tenantOptionTemplateProps} />;
};
