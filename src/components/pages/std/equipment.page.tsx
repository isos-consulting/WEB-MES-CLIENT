import React, { useState } from 'react';
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
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

/** 설비관리 */
export const PgStdEquipment = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/equips';
  const saveUriPath = '/std/equips';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '설비UUID',
        name: 'equip_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '설비유형UUID',
        name: 'equip_type_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        hidden: true,
      },
      {
        header: '파일첨부',
        name: 'files',
        width: ENUM_WIDTH.M,
        format: 'file',
        options: {
          file_mgmt_type_cd: 'FIL_STD_EQUIP',
          ok_type: 'save',
          reference_col: 'equip_uuid',
        },
      },
      {
        header: '설비유형명',
        name: 'equip_type_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '설비코드',
        name: 'equip_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '설비명',
        name: 'equip_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        hidden: true,
      },
      {
        header: '작업장명',
        name: 'workings_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
      },
      {
        header: '관리자(정)UUID',
        name: 'manager_emp_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        hidden: true,
      },
      {
        header: '관리자(정) 사원명',
        name: 'manager_emp_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        hidden: true,
      },
      {
        header: '관리자(부)UUID',
        name: 'sub_manager_emp_uuid',
        width: ENUM_WIDTH.L,
        format: 'popup',
        hidden: true,
      },
      {
        header: '관리자(부) 사원명',
        name: 'sub_manager_emp_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        hidden: true,
      },
      {
        header: '설비관리번호',
        name: 'equip_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '설비등급',
        name: 'equip_grade',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '설비모델명',
        name: 'equip_model',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '설비규격',
        name: 'equip_std',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '설비제원',
        name: 'equip_spec',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '전압',
        name: 'voltage',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '제조사',
        name: 'manufacturer',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '구매업체',
        name: 'purchase_partner',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '구매일자',
        name: 'purchase_date',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'date',
        editable: true,
        hidden: true,
      },
      {
        header: '구매업체연락처',
        name: 'purchase_tel',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
        hidden: true,
      },
      {
        header: '구매금액',
        name: 'purchase_price',
        width: ENUM_WIDTH.L,
        decimal: ENUM_DECIMAL.DEC_PRICE,
        format: 'number',
        filter: 'number',
        editable: true,
        hidden: true,
      },
      {
        header: '사용유무',
        name: 'use_fg',
        width: ENUM_WIDTH.S,
        format: 'check',
        editable: true,
        requiredField: true,
        defaultValue: true,
      },
      {
        header: '생산설비',
        name: 'prd_fg',
        width: ENUM_WIDTH.S,
        format: 'check',
        editable: true,
        requiredField: true,
        defaultValue: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridPopupInfo: [
        {
          columnNames: [
            { original: 'equip_type_uuid', popup: 'equip_type_uuid' },
            { original: 'equip_type_nm', popup: 'equip_type_nm' },
          ],
          popupKey: '설비유형관리',
          gridMode: 'select',
        },
      ],
    },
  );

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    cloneDeep(grid.gridInfo.columns).map(el => {
      if (el.name === 'files') {
        el.options['ok_type'] = 'json';
      }
      return el;
    }),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
    },
  );
  const editDataPopupGrid = useGrid(
    'EDIT_POPUP_GRID',
    cloneDeep(grid.gridInfo.columns).map(el => {
      if (el.name === 'files') {
        el.hidden = true;
      }
      return el;
    }),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
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
