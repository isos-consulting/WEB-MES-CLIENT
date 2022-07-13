import React from 'react';
import { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cloneObject,
  dataGridEvents,
  executeData,
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH, URL_PATH_AUT } from '~/enums';
import { WORD } from '~/constants/lang/ko/word';
import { SENTENCE } from '~/constants/lang/ko/sentence';

export const PgAutUser = () => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const [modal, modalContext] = Modal.useModal();

  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/aut/users';
  const saveUriPath = '/aut/users';

  const fetchUserPassword = async ({ user_uuid }) => {
    return await executeData(
      [{ uuid: user_uuid }],
      `/aut/user/pwd-init`,
      'put',
    );
  };

  const resetUserPassword = async ({ user_uuid }) => {
    const userPasswordResetResponse = await fetchUserPassword({ user_uuid });

    if (userPasswordResetResponse.success === true) {
      message.success(`${SENTENCE.IS_RESETED_PASSWORD}`);
    }
  };

  const confirmResetPasswordModal = ({ grid, rowKey }) => {
    return modal.confirm({
      title: `${WORD.PASSWORD} ${WORD.RESET}`,
      content: `${SENTENCE.IS_RESET_PASSWORD}`,
      onOk: async () => {
        await resetUserPassword(grid.getRow(rowKey));

        close();
      },
      onCancel: () => {},
    });
  };

  const grid = useGrid(
    'GRID',
    [
      {
        header: '사용자UUID',
        name: 'user_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '로그인ID',
        name: 'id',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '성명',
        name: 'user_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '권한그룹UUID',
        name: 'group_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '권한그룹',
        name: 'group_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        format: 'combo',
      },
      {
        header: '이메일',
        name: 'email',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '비밀번호 변경여부',
        name: 'pwd_fg',
        width: ENUM_WIDTH.L,
        format: 'check',
        filter: 'text',
        editable: true,
        requiredField: true,
        hidden: true,
      },
      {
        header: '관리자 유무',
        name: 'admin_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: `${WORD.PASSWORD} ${WORD.RESET}`,
        name: 'pwd_reset',
        width: ENUM_WIDTH.M,
        format: 'button',
        options: {
          value: `${WORD.RESET}`,
          onClick: (_, clickProps) => {
            confirmResetPasswordModal(clickProps);
          },
        },
        disabled: !permissions?.create_fg,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridComboInfo: [
        {
          columnNames: [
            {
              codeColName: { original: 'group_uuid', popup: 'group_uuid' },
              textColName: { original: 'group_nm', popup: 'group_nm' },
            },
          ],
          dataApiSettings: {
            uriPath: URL_PATH_AUT.GROUP.GET.GROUPS,
            params: {},
          },
        },
      ],
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns.filter(({ name }) => name !== 'pwd_reset'),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridComboInfo: grid.gridInfo.gridComboInfo,
    },
  );

  const popupColumns = cloneObject(grid.gridInfo.columns)
    ?.map(el => {
      if (['id', 'user_nm'].includes(el?.name)) {
        el['editable'] = false;
      }
      return el;
    })
    .filter(({ name }) => name !== 'pwd_reset');

  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', popupColumns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridComboInfo: grid.gridInfo.gridComboInfo,
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

    getData(searchParams, searchUriPath)
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
