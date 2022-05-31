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

// "tenant_opt_uuid": "d12c4fcf-b8bb-4e39-b9d4-1e6a601df0ca",
// "tenant_opt_cd": "string",
// "tenant_opt_nm": "string",
// "value": 0,
// "remark": "string",
// "created_at": "2019-08-24T14:15:22Z",
// "created_nm": "string",
// "updated_at": "2019-08-24T14:15:22Z",
// "updated_nm": "string"

export const PgStdTenantOption = () => {
  const grid = useGrid(
    TenantHeaderOptions.gridName,
    [
      {
        header: 'a',
        name: 'tenant_opt_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'tenant_opt_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'tenant_opt_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'value',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'remark',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'created_at',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'created_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'updated_at',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: 'a',
        name: 'updated_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
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
