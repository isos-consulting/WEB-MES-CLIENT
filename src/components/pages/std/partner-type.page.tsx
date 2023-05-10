import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { dataGridEvents, getData, getPageName } from '~/functions';
import { GridRef } from '~/v2/core/ToastGrid';
import { PartnerTypeServiceImpl } from '~/v2/service/PartnerTypeService';
import { ServiceUtil } from '~/v2/util/CallbackServices';
import { DialogUtil } from '~/v2/util/DialogUtil';

/** 거래처유형관리 */
export const PgStdPartnerType = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/partner-types';
  const saveUriPath = '/std/partner-types';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '거래처유형UUID',
        name: 'partner_type_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '거래처유형코드',
        name: 'partner_type_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '거래처유형명',
        name: 'partner_type_nm',
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
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
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
      DialogUtil.valueOf(modal).confirm({
        title: '삭제확인',
        message: '삭제하시겠습니까?',
        onOk: () => {
          ServiceUtil.getInstance()
            .callMethod(
              PartnerTypeServiceImpl.getInstance().delete,
              grid.gridRef as GridRef,
            )
            .then(_ => {
              message.success('삭제되었습니다.');
              onSearch(searchInfo?.values);
            })
            .catch((error: unknown) => {
              message.warn(error.toString());
            });
        },
      });
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
      {
        ...newDataPopupGrid.gridInfo,
        onOk: okEvent => {
          const gridRef = okEvent as unknown as GridRef;

          ServiceUtil.getInstance()
            .callMethod(PartnerTypeServiceImpl.getInstance().create, gridRef)
            .then(_ => {
              message.success('저장되었습니다.');
              setNewDataPopupGridVisible(false);
              onSearch(searchInfo?.values);
            })
            .catch((error: unknown) => {
              message.warn(error.toString());
            });
        },
      },
      {
        ...editDataPopupGrid.gridInfo,
        onOk: okEvent => {
          const gridRef = okEvent as unknown as GridRef;

          ServiceUtil.getInstance()
            .callMethod(PartnerTypeServiceImpl.getInstance().update, gridRef)
            .then(_ => {
              message.success('수정되었습니다.');
              setEditDataPopupGridVisible(false);
              onSearch(searchInfo?.values);
            })
            .catch((error: unknown) => {
              message.warn(error.toString());
            });
        },
      },
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
