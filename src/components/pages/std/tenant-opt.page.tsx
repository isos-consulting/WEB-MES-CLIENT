import React from 'react';
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

enum PopupGrid {
  new = 'NEW_DATA_POPUP_GRID',
  edit = 'EDIT_POPUP_GRID',
}

export const PgStdTenantOption = () => {
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
        editable: true,
        requiredField: true,
      },
      {
        header: '옵션명',
        name: 'tenant_opt_nm',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
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
        editable: true,
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
      () => {};
    },
    delete: () => {
      () => {};
    },
    create: () => {
      () => {};
    },
    save: () => {
      () => {};
    },
    cancelEdit: () => {
      () => {};
    },
  };

  const tenantOptionTemplateProps = {
    title: getPageName(),
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: null,
    inputProps: null,
    popupGridRef: [],
    popupGridInfo: [],
    popupVisible: [],
    setPopupVisible: [],
    popupInputProps: [null, null],
    buttonActions,
  };
  return <TpSingleGrid {...tenantOptionTemplateProps} />;
};
