import React from 'react';
import { useState } from 'react';
import { menuData, TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  checkGridData,
  dataGridEvents,
  executeData,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH, URL_PATH_AUT } from '~/enums';
import { moduleExpression } from '@babel/types';

type TGridAttributes = {
  expanded?: boolean;
  disabled?: boolean;
};

type TMenuData = {
  component_nm?: string;
  icon?: string;
  lv?: number;
  menu_nm?: string;
  menu_type_nm?: string;
  menu_type_uuid?: string;
  menu_uri?: string;
  menu_uuid?: string;
  sortby?: string;
  use_fg?: boolean;
  created_at?: string;
  created_nm?: string;
  updated_at?: string;
  updated_nm?: string;
  _attributes?: TGridAttributes;
  _children?: TMenuData[];
};

type TGetMenuData = {
  lv?: number;
  menu_nm?: string;
  menu_type_nm?: string;
  menu_type_uuid?: string;
  menu_uri?: string;
  menu_uuid?: string;
  sortby?: string;
  use_fg?: boolean;
};

/** 그룹 관리 */
export const PgAutMenu = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = URL_PATH_AUT.MENU.GET.MENUS;
  const saveUriPath = URL_PATH_AUT.MENU.PUT.MENUS;

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '메뉴UUID',
        name: 'menu_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '메뉴레벨',
        name: 'lv',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '메뉴명',
        name: 'menu_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '메뉴유형UUID',
        name: 'menu_type_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '메뉴유형',
        name: 'menu_type_nm',
        width: ENUM_WIDTH.L,
        format: 'combo',
        filter: 'text',
        editable: true,
      },
      {
        header: '메뉴URL',
        name: 'menu_uri',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '컴포넌트명',
        name: 'component_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '아이콘',
        name: 'icon',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '사용',
        name: 'use_fg',
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
      treeColumnOptions: {
        name: 'menu_nm',
        useIcon: true,
        useCascadingCheckbox: true,
      },
      gridComboInfo: [
        {
          // 투입단위 콤보박스
          columnNames: [
            {
              codeColName: {
                original: 'menu_type_uuid',
                popup: 'menu_type_uuid',
              },
              textColName: { original: 'menu_type_nm', popup: 'menu_type_nm' },
            },
          ],
          dataApiSettings: {
            uriPath: URL_PATH_AUT.MENU_TYPE.GET.MENU_TYPES,
            params: {},
          },
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
    treeColumnOptions: {
      name: 'menu_nm',
      useIcon: true,
      useCascadingCheckbox: true,
    },
    draggable: true,
    extraButtons: [
      {
        buttonProps: { text: '행 추가' },
        buttonAction: (ev, props, options) => {
          const {
            gridRef,
            childGridRef,
            childGridId,
            columns,
            data,
            modal,
            onAppendRow,
          } = options;

          const gridInstance = gridRef.current.getInstance();
          const { rowKey } = gridInstance.getFocusedCell();
          const rowData = gridInstance.getRow(rowKey);

          gridRef.current.getInstance().appendRow({}, { at: 0 });
          if (null) {
            message.warn('거래처를 선택하신 후 다시 시도해주세요.');
            return;
          }
        },
      },
      {
        buttonProps: { text: '행 취소' },
        buttonAction: (ev, props, options) => {
          const {
            gridRef,
            childGridRef,
            childGridId,
            columns,
            data,
            modal,
            onAppendRow,
          } = options;
          const gridInstance = gridRef.current.getInstance();
          const { rowKey } = gridInstance.getFocusedCell();
          const rowData = gridInstance.getRow(rowKey);

          if (rowData?.menu_uuid) {
            message.warn('추가한 행에만 취소가 가능합니다.');
            return;
          } else {
            gridInstance.removeRow(rowKey);
          }
        },
      },
      {
        buttonProps: { text: '◀' },
        buttonAction: (ev, props, options) => {
          const {
            gridRef,
            childGridRef,
            childGridId,
            columns,
            data,
            modal,
            onAppendRow,
          } = options;
          const gridInstance = gridRef.current.getInstance();
          const { rowKey } = gridInstance.getFocusedCell();
          const rowData = gridInstance.getRow(rowKey);

          if (rowData?.menu_uuid) {
            message.warn('추가한 행에만 취소가 가능합니다.');
            return;
          } else {
            gridInstance.removeRow(rowKey);
          }
        },
      },
      {
        buttonProps: { text: '▶' },
        buttonAction: (ev, props, options) => {
          const {
            gridRef,
            childGridRef,
            childGridId,
            columns,
            data,
            modal,
            onAppendRow,
          } = options;
          const gridInstance = gridRef.current.getInstance();
          const { rowKey } = gridInstance.getFocusedCell();
          const rowData = gridInstance.getRow(rowKey);

          if (rowData?.menu_uuid) {
            message.warn('추가한 행에만 취소가 가능합니다.');
            return;
          } else {
            gridInstance.removeRow(rowKey);
          }
        },
      },
    ],
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
    getData<TGetMenuData[]>(searchParams, searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        let menuDatas: TMenuData[] = [];
        data.map(el => {
          if (el.lv == 1) {
            menuDatas.push({
              ...el,
              _attributes: {
                expanded: true,
              },
              _children: [],
            });
          } else if (el.lv == 2) {
            menuDatas[menuDatas.length - 1]._children.push({
              ...el,
              _attributes: {
                expanded: true,
              },
              _children: el.component_nm ? null : [],
            });
          } else if (el.lv == 3) {
            menuDatas[menuDatas.length - 1]?._children[
              menuDatas[menuDatas.length - 1]?._children?.length - 1
            ]?._children.push({
              ...el,
              _attributes: {
                expanded: false,
              },
              _children: null,
            });
          }
        });
        console.log(menuDatas);
        inputInfo?.instance?.resetForm();
        grid.setGridData(menuDatas);
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

  const onEditSave = () => {
    const { gridRef, setGridMode } = editDataPopupGrid;
    const { columns, saveUriPath } = editDataPopupGrid.gridInfo;
    console.log(gridRef.current.getInstance().getData());
    const saveDatas = gridRef.current
      .getInstance()
      .getData()
      .map(el => {
        return {
          uuid: el.menu_uuid,
          menu_type_uuid: el.menu_type_uuid,
          menu_nm: el.menu_nm,
          menu_uri: el.menu_uri,
          component_nm: el.component_nm,
          icon: el.icon,
          lv: el.lv,
          use_fg: el.use_fg,
        };
      });
    modal.confirm({
      icon: null,
      title: '저장',
      // icon: <ExclamationCircleOutlined />,
      content: '편집된 내용을 저장하시겠습니까?',
      onOk: async () => {
        // 저장 가능한지 체크
        const chk: boolean = await checkGridData(columns, saveDatas, false, [
          'emptyDatas',
        ]);

        if (chk === false) return;

        executeData(saveDatas, URL_PATH_AUT.MENU.PUT.MENUS, 'put').then(res => {
          setEditDataPopupGridVisible(false);
          onSearch(searchInfo?.values);
        });
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });
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
    popupGridInfo: [
      newDataPopupGrid.gridInfo,
      { ...editDataPopupGrid.gridInfo, onOk: onEditSave },
    ],
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
