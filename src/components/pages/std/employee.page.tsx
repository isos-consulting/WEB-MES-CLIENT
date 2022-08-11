import React, { useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import { message } from 'antd';
import { cloneDeep } from 'lodash';

/** 사원관리 */
export const PgStdEmployee = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = '/std/emps';
  const saveUriPath = '/std/emps';

  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '파일첨부',
        name: 'files',
        width: ENUM_WIDTH.M,
        format: 'file',
        options: {
          file_mgmt_type_cd: 'FIL_STD_EMP',
          ok_type: 'save',
          reference_col: 'emp_uuid',
        },
      },
      {
        header: '사원UUID',
        name: 'emp_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        hidden: true,
      },
      {
        header: '사번',
        name: 'emp_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '사원명',
        name: 'emp_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
        requiredField: true,
      },
      {
        header: '사용자UUID',
        name: 'user_uuid',
        width: ENUM_WIDTH.L,
        editable: true,
        hidden: true,
      },
      {
        header: '사용자 로그인ID',
        name: 'id',
        width: ENUM_WIDTH.L,
        format: 'popup',
        editable: true,
      },
      {
        header: '부서UUID',
        name: 'dept_uuid',
        width: ENUM_WIDTH.L,
        editable: true,
        hidden: true,
      },
      {
        header: '부서코드',
        name: 'dept_cd',
        width: ENUM_WIDTH.M,
        editable: true,
        hidden: true,
      },
      {
        header: '부서명',
        name: 'dept_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '직급UUID',
        name: 'grade_uuid',
        width: ENUM_WIDTH.L,
        editable: true,
        hidden: true,
      },
      {
        header: '직급코드',
        name: 'grade_cd',
        width: ENUM_WIDTH.M,
        editable: true,
        hidden: true,
      },
      {
        header: '직급명',
        name: 'grade_nm',
        width: ENUM_WIDTH.L,
        format: 'popup',
        filter: 'text',
        editable: true,
      },
      {
        header: '생년월일',
        name: 'birthday',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
        editable: true,
        disableStringEmpty: true,
      },
      {
        header: '주소',
        name: 'addr',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
      },
      {
        header: '상세주소',
        name: 'addr_detail',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
      },
      {
        header: '우편번호',
        name: 'post',
        width: ENUM_WIDTH.S,
        filter: 'text',
        editable: true,
      },
      {
        header: '전화번호',
        name: 'hp',
        width: ENUM_WIDTH.M,
        filter: 'text',
        editable: true,
      },
      {
        header: '입사일자',
        name: 'enter_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
        editable: true,
      },
      {
        header: '퇴사일자',
        name: 'leave_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'text',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        editable: true,
      },
      {
        header: '작업자유무',
        name: 'worker_fg',
        width: ENUM_WIDTH.M,
        format: 'check',
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
          // 사용자 팝업
          columnNames: [
            { original: 'user_uuid', popup: 'user_uuid' },
            { original: 'user_nm', popup: 'user_nm' },
            { original: 'id', popup: 'id' },
            { original: 'email', popup: 'email' },
          ],
          columns: [
            {
              header: '사용자UUID',
              name: 'user_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '성명',
              name: 'user_nm',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '사용자 로그인ID',
              name: 'id',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
            {
              header: '이메일',
              name: 'email',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/aut/users',
            params: null,
          },
          gridMode: 'select',
        },
        {
          // 부서 팝업
          columnNames: [
            { original: 'dept_uuid', popup: 'dept_uuid' },
            { original: 'dept_cd', popup: 'dept_cd' },
            { original: 'dept_nm', popup: 'dept_nm' },
          ],
          columns: [
            {
              header: '부서UUID',
              name: 'dept_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '부서코드',
              name: 'dept_cd',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '부서명',
              name: 'dept_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/depts',
            params: null,
          },
          gridMode: 'select',
        },
        {
          // 직급 팝업
          columnNames: [
            { original: 'grade_uuid', popup: 'grade_uuid' },
            { original: 'grade_cd', popup: 'grade_cd' },
            { original: 'grade_nm', popup: 'grade_nm' },
          ],
          columns: [
            {
              header: '직급UUID',
              name: 'grade_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '직급코드',
              name: 'grade_cd',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
            {
              header: '직급명',
              name: 'grade_nm',
              width: ENUM_WIDTH.L,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/grades',
            params: null,
          },
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
      gridPopupInfo: grid.gridInfo?.gridPopupInfo,
    },
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridPopupInfo: grid.gridInfo?.gridPopupInfo,
  });
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'radio',
      id: 'emp_status',
      default: 'all',
      label: '재직유무',
      options: [
        { code: 'all', text: '전체' },
        { code: 'incumbent', text: '재직자' },
        { code: 'retiree', text: '퇴직자' },
      ],
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    const searchKeys = Object.keys(values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

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
