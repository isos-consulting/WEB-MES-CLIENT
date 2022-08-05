import React from 'react';
import { useState } from 'react';
import {
  getPopupForm,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import {
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_WIDTH, URL_PATH_MLD } from '~/enums';

/** 그룹 관리 */
export const PgMldRepairHistory = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = URL_PATH_MLD.REPAIR_HISTORY.GET.REPAIR_HISTORIES;
  const saveUriPath = URL_PATH_MLD.REPAIR_HISTORY.PUT.REPAIR_HISTORIES;
  const MOLD_POPUP = getPopupForm('금형관리');
  const PRODUCT_POPUP = getPopupForm('품목관리2');
  const EMP_POPUP = getPopupForm('사원관리');
  const PROBLEM_POPUP = getPopupForm('금형문제점관리');

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '금형 수리이력 관리UUID',
        name: 'repair_history_uuid',
        alias: 'uuid',
        width: 150,
        filter: 'text',
        hidden: true,
      },
      {
        header: '금형UUID',
        name: 'mold_uuid',
        width: 150,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '금형명',
        name: 'mold_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: 150,
        filter: 'text',
        hidden: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '품목명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '품목 유형명',
        name: 'item_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '제품 유형명',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '리비전',
        name: 'rev',
        width: ENUM_WIDTH.S,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '금형 문제점UUID',
        name: 'problem_uuid',
        width: 150,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '금형 문제점명',
        name: 'problem_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '발생 일자',
        name: 'occur_date',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        format: 'date',
      },
      {
        header: '발생확인자UUID',
        name: 'occur_emp_uuid',
        width: 150,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '발생확인자명',
        name: 'occur_emp_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '수리자UUID',
        name: 'repair_emp_uuid',
        width: 150,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '수리자명',
        name: 'repair_emp_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '수리업체',
        name: 'repair_partner',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '수리번호',
        name: 'repair_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '수리시작일자',
        name: 'start_date',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        format: 'date',
        requiredField: true,
      },
      {
        header: '수리완료일자',
        name: 'end_date',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        format: 'date',
      },
      {
        header: '수리내용',
        name: 'contents',
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
          // 금형관리 ( 금형명 )
          columnNames: [
            { original: 'mold_uuid', popup: 'mold_uuid' },
            { original: 'mold_nm', popup: 'mold_nm' },
          ],
          columns: MOLD_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: MOLD_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
        },
        {
          // 품목관리 ( 품목 관련 )
          columnNames: [
            { original: 'prod_uuid', popup: 'prod_uuid' },
            { original: 'prod_no', popup: 'prod_no' },
            { original: 'prod_nm', popup: 'prod_nm' },
            { original: 'item_type_nm', popup: 'item_type_nm' },
            { original: 'prod_type_nm', popup: 'prod_type_nm' },
            { original: 'model_nm', popup: 'model_nm' },
            { original: 'rev', popup: 'rev' },
            { original: 'prod_std', popup: 'prod_std' },
            { original: 'unit_nm', popup: 'unit_nm' },
          ],
          columns: PRODUCT_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: PRODUCT_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
        },
        {
          // 사원관리 ( 발생확인자 )
          columnNames: [
            { original: 'occur_emp_uuid', popup: 'emp_uuid' },
            { original: 'occur_emp_nm', popup: 'emp_nm' },
          ],
          columns: EMP_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: EMP_POPUP.uriPath,
            params: {
              emp_status: 'all',
            },
          },
          gridMode: 'select',
        },
        {
          // 사원관리 ( 수리자 )
          columnNames: [
            { original: 'repair_emp_uuid', popup: 'emp_uuid' },
            { original: 'repair_emp_nm', popup: 'emp_nm' },
          ],
          columns: EMP_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: EMP_POPUP.uriPath,
            params: {
              emp_status: 'all',
            },
          },
          gridMode: 'select',
        },
        {
          // 금형문제점관리 ( 금형문제점명 )
          columnNames: [
            { original: 'problem_uuid', popup: 'problem_uuid' },
            { original: 'problem_nm', popup: 'problem_nm' },
          ],
          columns: PROBLEM_POPUP.datagridProps?.columns,
          dataApiSettings: {
            uriPath: PROBLEM_POPUP.uriPath,
            params: {},
          },
          gridMode: 'select',
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
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridPopupInfo: grid.gridInfo.gridPopupInfo,
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
