import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import {
  EDIT_ACTION_CODE,
  getPopupForm,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { URL_PATH_EQM } from '~/enums';
import {
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
} from '~/functions';
import eqmInspResultColumns from './insp/result/eqm-insp-result-columns';
import eqmInspResultGridComboboxes from './insp/result/eqm-insp-result-grid-comboboxes';
import eqmInspResultGridPopups from './insp/result/eqm-insp-result-grid-popups';

const SAVE_DATA = {
  post: [
    'factory_uuid',
    'insp_detail_uuid',
    // 'equip_uuid',
    'emp_uuid',
    'emp_nm',
    // 'reg_date',
    'insp_value',
    'insp_result_fg',
    'remark',
  ],
  put: [
    'insp_result_uuid',
    'emp_uuid',
    'emp_nm',
    'reg_date',
    'insp_value',
    'insp_result_fg',
    'remark',
  ],
  del: ['insp_result_uuid'],
};

/** 설비점검성적서 */
export const PgEqmInspResult = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = URL_PATH_EQM.INSP_RESULT.GET.INSP_RESULTS;
  const saveUriPath = URL_PATH_EQM.INSP_RESULT.POST.INSP_RESULTS;

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', eqmInspResultColumns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: eqmInspResultGridPopups,
    gridComboInfo: eqmInspResultGridComboboxes,
  });

  const newDataPopupGridColumns = cloneDeep(grid.gridInfo.columns)?.map(
    column => {
      if (SAVE_DATA.post.includes(column?.name)) {
        column['noSave'] = false;
        column['editable'] = true;
      }

      if (['reg_date'].includes(column?.name)) {
        column['hidden'] = true;
      }

      if (['insp_result_fg'].includes(column?.name)) {
        column['editable'] = false;
      }

      if (['emp_nm'].includes(column?.name)) {
        column['editable'] = true;
      }

      if (['emp_nm', 'insp_value', 'insp_result_fg'].includes(column?.name)) {
        column['requiredField'] = true;
      }

      if (['equip_type_nm', 'equip_nm'].includes(column?.name)) {
        column['hidden'] = true;
      }

      return column;
    },
  );

  const [newDataSaveParams, setNewDataSaveParams] = useState();
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      gridComboInfo: grid.gridInfo.gridComboInfo,
      saveParams: newDataSaveParams,
      hiddenActionButtons: true,
    },
  );

  const editDataPopupGridColumns = cloneDeep(grid.gridInfo.columns)?.map(
    column => {
      if (SAVE_DATA.put.includes(column?.name)) {
        column['noSave'] = false;
        column['editable'] = true;
      }

      if (['reg_date'].includes(column?.name)) {
        column['editable'] = false;
      }

      if (['insp_result_fg'].includes(column?.name)) {
        column['editable'] = false;
      }

      if (['emp_nm'].includes(column?.name)) {
        column['editable'] = true;
      }

      if (
        ['emp_nm', 'reg_date', 'insp_value', 'insp_result_fg'].includes(
          column?.name,
        )
      ) {
        column['requiredField'] = true;
      }

      if (['equip_type_nm', 'equip_nm'].includes(column?.name)) {
        column['hidden'] = false;
      }

      return column;
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_POPUP_GRID',
    editDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      gridComboInfo: grid.gridInfo.gridComboInfo,
      hiddenActionButtons: true,
    },
  );

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      names: ['start_date', 'end_date'],
      defaults: [getToday(-6), getToday()],
      type: 'daterange',
      label: '기간',
    },
    {
      id: 'equip_uuid',
      name: 'equip_uuid',
      type: 'combo',
      label: '설비',
      firstItemType: 'all',
      default: 'all',
      dataSettingOptions: {
        codeName: 'equip_uuid',
        textName: 'equip_nm',
        uriPath: getPopupForm('설비관리')?.uriPath,
        params: {
          store_type: 'all',
        },
      },
    },
    {
      id: 'insp_type',
      name: 'insp_type',
      type: 'combo',
      label: '검사유형',
      firstItemType: 'all',
      default: 'all',
      options: [
        {
          code: 'daily',
          text: '일상점검',
        },
        {
          code: 'periodicity',
          text: '정기점검',
        },
      ],
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', [
    {
      id: 'reg_date',
      name: 'reg_date',
      default: getToday(),
      type: 'date',
      label: '검사일',
    },
    {
      id: 'equip_nm',
      name: 'equip_nm',
      type: 'text',
      usePopup: true,
      label: '설비',
      popupKeys: ['equip_uuid', 'equip_nm'],
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: getPopupForm('설비관리').uriPath,
          params: {},
        },
        datagridSettings: {
          gridId: null,
          columns: getPopupForm('설비관리').datagridProps.columns,
        },
        modalSettings: {
          title: '설비관리',
          // onOk: (ev) => {
          //   console.log('왜안타ㅏ', ev);
          // }
        },
      },
    },
    {
      id: 'insp_type',
      name: 'insp_type',
      type: 'combo',
      label: '검사유형',
      firstItemType: 'none',
      default: 'daily',
      options: [
        {
          code: 'daily',
          text: '일상점검',
        },
        {
          code: 'periodicity',
          text: '정기점검',
        },
      ],
    },
  ]);

  async function changeNewDataPopupInputValues(values) {
    if (
      values?.['equip_uuid'] === undefined ||
      values?.['insp_type'] === undefined
    )
      return;

    const data = await getData(
      {
        equip_uuid: values?.['equip_uuid'],
        insp_type: values?.['insp_type'],
      },
      '/eqm/insps/include-details-by-equip',
      'header-details',
    );

    const details = data?.['details'].map(row => ({
      ...row,
      _edit: EDIT_ACTION_CODE.CREATE,
    }));
    newDataPopupGrid?.setGridData(details);
  }

  useLayoutEffect(() => {
    setNewDataSaveParams(newDataPopupInputInfo.values);
    changeNewDataPopupInputValues(newDataPopupInputInfo.values);
  }, [newDataPopupInputInfo.values]);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    let temp = cloneDeep(values);
    if (temp?.['equip_uuid'] === 'all') {
      temp['equip_uuid'] = null;
    }

    const searchParams = temp;

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
    popupInputProps: [newDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
