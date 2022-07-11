import React from 'react';
import { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cloneObject,
  dataGridEvents,
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

/** 사용자 관리 */
export const PgAutUser = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const permissions = getPermissions(title);

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/aut/users';
  const saveUriPath = '/aut/users';

  /** 그리드 상태를 관리 */
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
        header: '비밀번호 초기화',
        name: 'pwd_reset',
        width: ENUM_WIDTH.M,
        format: 'button',
        options: {
          value: '투입',
          onClick: (_, { grid, rowKey }) => {
            const resetUser = grid.getRow(rowKey);
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
          // 투입단위 콤보박스
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

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    // const searchKeys = Object.keys(values);
    const searchParams = {}; //cleanupKeyOfObject(values, searchKeys);

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
