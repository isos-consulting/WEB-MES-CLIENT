import React, { useLayoutEffect, useState } from 'react';
import {
  EDIT_ACTION_CODE,
  getPopupForm,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import {
  dataGridEvents,
  getData,
  getInspCheckResultValue,
  getModifiedRows,
  getPageName,
  getToday,
  isNumber,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH, URL_PATH_EQM } from '~/enums';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { useInputGroup } from '~/components/UI/input-groupbox';

// 검사값 판정
const inspValueFormula = (params, props) => {
  const { value, targetValues, columnName, rowKey } = params;
  const instance = props?.parentGridRef?.current?.getInstance();

  const specMin = targetValues['spec_min'];
  const specMax = targetValues['spec_max'];
  let nullFg: boolean = true;
  let resultFg: boolean = true;

  [nullFg, resultFg] = getInspCheckResultValue(value, { specMin, specMax });

  console.log(nullFg, resultFg);
  const cellFlagResultValue = nullFg ? null : resultFg;
  console.log('cellFlagResultValue', cellFlagResultValue);

  if (!isNumber(specMin) && !isNumber(specMax)) {
    if (resultFg === true) {
      instance?.setValue(rowKey, columnName, 'OK');
    } else if (resultFg === false) {
      instance?.setValue(rowKey, columnName, 'NG');
    }
  }

  return cellFlagResultValue;
};

const inspResultCondition = [
  {
    value: false,
    text: '불합격',
    color: 'red',
  },
  {
    value: true,
    text: '합격',
    color: 'blue',
  },
];

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
  const grid = useGrid(
    'GRID',
    [
      {
        header: '설비검사 성적서UUID',
        name: 'insp_result_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비검사 기준서 번호',
        name: 'insp_no',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비검사 기준서 상세UUID',
        name: 'insp_detail_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '상세기준서번호',
        name: 'insp_no_sub',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사항목 유형UUID',
        name: 'insp_item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사항목 유형코드',
        name: 'insp_item_type_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사항목 유형',
        name: 'insp_item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사항목 상세내용',
        name: 'insp_item_desc',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사 기준',
        name: 'spec_std',
        width: ENUM_WIDTH.L,
        filter: 'text',
        noSave: true,
      },
      {
        header: '최소 값',
        name: 'spec_min',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '최대 값',
        name: 'spec_max',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사구UUID',
        name: 'insp_tool_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사구코드',
        name: 'insp_tool_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사구',
        name: 'insp_tool_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사방법UUID',
        name: 'insp_method_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사방법코드',
        name: 'insp_method_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사방법',
        name: 'insp_method_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        noSave: true,
      },
      {
        header: '일상점검주기UUID',
        name: 'daily_insp_cycle_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '일상점검주기코드',
        name: 'daily_insp_cycle_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '일상점검주기',
        name: 'daily_insp_cycle_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        noSave: true,
      },
      {
        header: '주기단위UUID',
        name: 'cycle_unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '주기단위코드',
        name: 'cycle_unit_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '주기단위',
        name: 'cycle_unit_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '주기 기준일',
        name: 'base_date',
        width: ENUM_WIDTH.L,
        filter: 'text',
        noSave: true,
      },
      {
        header: '점검주기',
        name: 'cycle',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '설비유형UUID',
        name: 'equip_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비유형코드',
        name: 'equip_type_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비유형',
        name: 'equip_type_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        noSave: true,
      },
      {
        header: '설비UUID',
        name: 'equip_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비코드',
        name: 'equip_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '설비',
        name: 'equip_nm',
        width: ENUM_WIDTH.XL,
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사자UUID',
        name: 'emp_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사자코드',
        name: 'emp_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        noSave: true,
      },
      {
        header: '검사자',
        name: 'emp_nm',
        width: ENUM_WIDTH.M,
        format: 'popup',
        filter: 'text',
        noSave: true,
      },
      {
        header: '등록일시',
        name: 'reg_date',
        width: ENUM_WIDTH.L,
        format: 'date',
        filter: 'text',
        noSave: true,
      },
      {
        header: '검사 값',
        name: 'insp_value',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
        formula: {
          targetColumnNames: ['spec_min', 'spec_max'],
          resultColumnName: 'insp_result_fg',
          formula: inspValueFormula,
        },
      },
      {
        header: '합격여부',
        name: 'insp_result_fg',
        width: ENUM_WIDTH.M,
        format: 'tag',
        options: { conditions: inspResultCondition },
        filter: 'text',
        noSave: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      gridPopupInfo: [
        {
          // 검사자
          columnNames: [
            { original: 'emp_uuid', popup: 'emp_uuid' },
            { original: 'emp_nm', popup: 'emp_nm' },
          ],
          columns: [
            {
              header: '사원UUID',
              name: 'emp_uuid',
              width: ENUM_WIDTH.L,
              filter: 'text',
              hidden: true,
            },
            {
              header: '사원명',
              name: 'emp_nm',
              width: ENUM_WIDTH.M,
              filter: 'text',
            },
          ],
          dataApiSettings: {
            uriPath: '/std/emps',
            params: {
              emp_status: 'incumbent',
            },
          },
          gridMode: 'select',
        },
      ],
      gridComboInfo: [
        // 합격여부
        {
          columnNames: [
            {
              codeColName: {
                original: 'insp_result_fg',
                popup: 'insp_result_fg',
              },
              textColName: {
                original: 'insp_result_state',
                popup: 'insp_result_state',
              },
            },
          ],
          itemList: [
            { code: false, text: '불합격' },
            { code: true, text: '합격' },
          ],
        },
      ],
    },
  );

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

  const editDataPopupInputInfo = null;

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
