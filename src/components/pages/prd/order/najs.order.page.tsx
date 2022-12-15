import Grid from '@toast-ui/react-grid';
import { message, Modal, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  COLUMN_CODE,
  Container,
  Datagrid,
  EDIT_ACTION_CODE,
  getPopupForm,
  GridPopup,
  IGridColumn,
  IGridPopupColumnInfo,
  IGridPopupInfo,
  IPopupItemsRetrunProps,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { ENUM_WIDTH } from '~/enums';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  getToday,
  saveGridData,
} from '~/functions';
import { onDefaultGridSave } from './order.page.util';
import { v4 as uuidv4 } from 'uuid';
import { ColumnStore } from '~/constants/columns';
import ComboStore from '~/constants/combos';
import ModalStore from '~/constants/modals';
import { injectClassNameAttributesInColumn } from '~/functions/tui-grid/class-name';
import { FieldStore } from '~/constants/fields';

type WorkPlanRowAddPopupInfo = {
  popupKey: TPopupKey;
  columns: IGridColumn[];
  dataApiSettings: {
    uriPath: string;
    params: { start_date: string; end_date: string; wait_task_fg: boolean };
  };
  onInterlock: () => void;
  onAfterOk: () => void;
  onBeforeOk: () => void;
  columnNames: IGridPopupColumnInfo[];
  gridMode: string;
};

const putDueDateFielLabel = (field, index, replacedLabel) => {
  if (index === 0)
    return {
      ...field,
      label: replacedLabel,
    };
  return field;
};

const getDailyWorkPlanModalProps = async ({
  childGridRef,
  columns,
  gridRef,
  props,
}) => {
  const {
    columnNames,
    searchProps,
    params,
    uriPath,
    modalProps,
    datagridProps,
    gridMode,
  }: IPopupItemsRetrunProps &
    WorkPlanRowAddPopupInfo & {
      params: WorkPlanRowAddPopupInfo['dataApiSettings']['params'];
    } = {
    columnNames: ModalStore.ORDER_ADD_ROW_POPUP_INFO.columnNames.concat([
      { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
    ]),
    columns: ColumnStore.DAILY_WORK_PLAN,
    dataApiSettings: {
      uriPath: '/prd/plan-daily',
      params: {
        start_date: getToday(-7),
        end_date: getToday(),
        wait_task_fg: true,
      },
    },
    datagridProps: {
      gridId: null,
      columns: ColumnStore.DAILY_WORK_PLAN,
    },
    gridMode: 'multi-select',
    modalProps: {
      title: '생산계획 - 다중선택',
    },
    onAfterOk: null,
    onBeforeOk: null,
    onInterlock: null,
    params: {
      start_date: getToday(-7),
      end_date: getToday(),
      wait_task_fg: true,
    },
    popupKey: null,
    searchProps: {
      id: 'workPlanSearch',
      searchItems: FieldStore.DUE_DATE_RANGE_SEVEN.map((field, index) =>
        putDueDateFielLabel(field, index, '생산계획일자'),
      ),
      onSearch: async (
        dailyWorkPlanConditions: WorkPlanRowAddPopupInfo['dataApiSettings']['params'],
      ) => {
        const dailyWorkPlans = await getData(
          { ...dailyWorkPlanConditions },
          '/prd/plan-daily',
        );

        childGridRef.current.getInstance().resetData(dailyWorkPlans);
      },
      boxShadow: false,
    },
    uriPath: '/prd/plan-daily',
  };

  const dailyWrokPlans = await getData(params, uriPath);

  if (typeof dailyWrokPlans === 'undefined') {
    throw new Error('에러가 발생되었습니다.');
  }

  return {
    title: modalProps.title,
    width: '80%',
    icon: null,
    okText: '선택',
    cancelText: '취소',
    maskClosable: false,
    content: (
      <>
        <Searchbox {...searchProps} />
        <Datagrid
          ref={childGridRef}
          gridId={uuidv4()}
          columns={datagridProps.columns}
          gridMode={gridMode}
          data={dailyWrokPlans}
        />
      </>
    ),
    onOk: async () => {
      const dailyWorkPlanGridInstance = childGridRef.current.getInstance();
      const prodOrderGridInstanceInNewModal = gridRef.current.getInstance();
      const selectedDailyWorkPlans = dailyWorkPlanGridInstance.getCheckedRows();

      const dailyWorkPlanUuids = selectedDailyWorkPlans
        .reduce((acc, cur) => `${acc}${cur.plan_daily_uuid},`, '')
        .slice(0, -1);

      if (dailyWorkPlanUuids.length === 0) return;

      const prodOrdersIncludesBom = await getData(
        { plan_daily_uuid: dailyWorkPlanUuids },
        '/std/routings/integrated-actived-prod',
      );

      const classNames = injectClassNameAttributesInColumn(
        columns,
        props.gridMode,
      );

      const newProdOrdersIncludesBom = prodOrdersIncludesBom.map(prodOrder => {
        if (typeof prodOrder !== 'object') {
          return {
            [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
            _attributes: { classNames },
          };
        }

        const newProdOrder = columnNames.reduce(
          (newProdOrder, { original, popup }) => {
            if (popup != null) {
              return {
                ...newProdOrder,
                [original]: prodOrder[popup],
              };
            }

            const column = columns.filter(el => el.name === original)[0];

            if (column == null) throw new Error('DataGrid Column null');
            if (column.defaultValue == null)
              throw new Error('DataGrid Column defaultValue Key null');
            if (typeof column.defaultValue === 'function') {
              return {
                ...newProdOrder,
                [original]: column.defaultValue(props, prodOrder),
              };
            }

            return {
              ...newProdOrder,
              [original]: column.defaultValue,
            };
          },
          {},
        );

        return {
          ...newProdOrder,
          [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
          _attributes: { classNames },
        };
      });

      prodOrderGridInstanceInNewModal.resetData(newProdOrdersIncludesBom);
    },
  };
};

export const PgPrdNajsOrder = () => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const ORDER_POPUP_INFO: IGridPopupInfo[] = [
    {
      columnNames: [
        { original: 'routing_resource_uuid', popup: 'routing_resource_uuid' },
        { original: 'equip_uuid', popup: 'equip_uuid' },
        { original: 'equip_cd', popup: 'equip_cd' },
        { original: 'equip_nm', popup: 'equip_nm' },
      ],
      columns: [
        {
          header: '생산자원UUID',
          name: 'routing_resource_uuid',
          alias: 'uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '공장UUID',
          name: 'factory_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '라우팅UUID',
          name: 'routing_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '자원 유형',
          name: 'resource_type',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: '설비UUID',
          name: 'equip_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '설비명',
          name: 'equip_nm',
          width: ENUM_WIDTH.L,
          hidden: false,
          format: 'text',
        },
        {
          header: '인원',
          name: 'emp_cnt',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: 'Cycle Time',
          name: 'cycle_time',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: 'std/equips',
        params: {},
      },
      gridMode: 'select',
    },
    {
      columnNames: [
        { original: 'workings_uuid', popup: 'workings_uuid' },
        { original: 'workings_cd', popup: 'workings_cd' },
        { original: 'workings_nm', popup: 'workings_nm' },
      ],
      columns: getPopupForm('작업장관리')?.datagridProps?.columns,
      dataApiSettings: {
        uriPath: getPopupForm('작업장관리')?.uriPath,
        params: {},
      },
      gridMode: 'select',
    },
  ];

  const gridInfo: IDatagridProps = {
    gridId: 'ORDER_GRID',
    ref: gridRef,
    height: 300,
    gridMode: 'delete',
    saveUriPath: '/prd/orders',
    searchUriPath: '/prd/orders',
    columns: ColumnStore.NAJS_PROD_ORDER,
    data: data,
    rowAddPopupInfo: {
      ...ModalStore.ORDER_ADD_ROW_POPUP_INFO,
      dataApiSettings: {
        ...ModalStore.ORDER_ADD_ROW_POPUP_INFO.dataApiSettings,
        onInterlock: () => {
          message.warn(
            '통합 작업지시 등록화면은 "생산계획 불러오기" 기능을 이용해주세요',
          );
          return false;
        },
      },
    },
    gridPopupInfo: ORDER_POPUP_INFO,
    gridComboInfo: [
      ComboStore.SHIFT,
      ComboStore.WORKER_GROUP,
      ComboStore.WORKER_EMPLOYEE,
    ],
  };

  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  const openCreatableOrderModal = () => {
    setNewPopupVisible(true);
  };

  const closeCreatableOrderModal = () => {
    setNewPopupVisible(false);
  };

  const newModalDatagridColumnProps = {
    hidden: ['order_state', 'order_no'],
    readOnly: [],
    noSave: [
      'working_nm',
      'prod_no',
      'prod_nm',
      'prod_type_nm',
      'item_type_nm',
      'model_nm',
      'rev',
      'prod_std',
      'unit_nm',
      'shift_nm',
    ],
    multiSelect: ['worker_nm'],
  };

  const dataGridColumnsInNewModal = ColumnStore.NAJS_PROD_ORDER.map(
    ({ name, ...columnOpts }) => {
      const columnInEditModal = { name, ...columnOpts };

      if (newModalDatagridColumnProps.hidden.includes(name)) {
        columnInEditModal.hidden = true;
      }

      if (newModalDatagridColumnProps.readOnly.includes(name)) {
        columnInEditModal.editable = true;
      }

      if (newModalDatagridColumnProps.noSave.includes(name)) {
        columnInEditModal.noSave = true;
      }

      if (newModalDatagridColumnProps.multiSelect.includes(name)) {
        columnInEditModal.format = 'multi-select';
      }

      return columnInEditModal;
    },
  );

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    columns: dataGridColumnsInNewModal,
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    disabledAutoDateColumn: true,
    popupId: 'NAJS_PROD_ORDER_NEW_MODAL',
    title: '작업지시 등록',
    okText: '저장하기',
    onOk: gridRef => {
      saveGridData(
        getModifiedRows(
          gridRef,
          newGridPopupInfo.columns,
          newGridPopupInfo.data,
        ),
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
        closeCreatableOrderModal();
      });
    },
    cancelText: '취소',
    onCancel: closeCreatableOrderModal,
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: newPopupVisible,
    onAfterOk: isSuccess => {
      if (!isSuccess) return;
      closeCreatableOrderModal();
      onSearch(searchParams);
    },
    extraButtons: [
      {
        buttonProps: { text: '생산계획 불러오기', children: '' },
        buttonAction: (_ev, props, options) => {
          const { childGridRef, columns, gridRef } = options;

          getDailyWorkPlanModalProps({
            childGridRef,
            columns,
            gridRef,
            props,
          }).then(modal.confirm);
        },
      },
    ],
  };

  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  const closeEditableOrderModal = () => {
    setEditPopupVisible(false);
  };

  const editModalDatagridColumnProps = {
    hidden: ['order_state'],
    readOnly: ['reg_date'],
    noSave: [
      'working_nm',
      'prod_no',
      'prod_nm',
      'prod_type_nm',
      'item_type_nm',
      'model_nm',
      'rev',
      'prod_std',
      'unit_nm',
      'shift_nm',
    ],
    multiSelect: ['worker_nm'],
  };

  const dataGridColumnsInEditModal = ColumnStore.NAJS_PROD_ORDER.map(
    ({ name, ...columnOpts }) => {
      const columnInEditModal = { name, ...columnOpts };

      if (editModalDatagridColumnProps.hidden.includes(name)) {
        columnInEditModal.hidden = true;
      }

      if (editModalDatagridColumnProps.readOnly.includes(name)) {
        columnInEditModal.editable = true;
      }

      if (editModalDatagridColumnProps.noSave.includes(name)) {
        columnInEditModal.noSave = true;
      }

      if (editModalDatagridColumnProps.multiSelect.includes(name)) {
        columnInEditModal.format = 'multi-select';
      }

      return columnInEditModal;
    },
  );

  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    columns: dataGridColumnsInEditModal,
    defaultData: data,
    data: data,
    height: null,
    onAfterClick: null,
    popupId: 'NAJS_PROD_ORDER_EDIT_MODAL',
    title: '작업지시 수정',
    okText: '저장하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(
          editPopupGridRef,
          editGridPopupInfo.columns,
          editGridPopupInfo.data,
        ),
        editGridPopupInfo.columns,
        editGridPopupInfo.saveUriPath,
        editGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
        closeEditableOrderModal();
      });
    },
    cancelText: '취소',
    onCancel: closeEditableOrderModal,
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: editPopupVisible,
    onAfterOk: isSuccess => {
      if (!isSuccess) return;
      closeEditableOrderModal();
      onSearch(searchParams);
    },
  };

  const onSearch = async (orderSearchParams: Record<string, string>) => {
    const findedOrderDatas =
      (await getData(
        {
          ...orderSearchParams,
          order_state: 'all',
        },
        gridInfo.searchUriPath,
      )) ?? [];

    setData(findedOrderDatas);
  };

  const openDeleteDialog = () => {
    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      gridInfo.saveUriPath,
      gridInfo.saveOptionParams,
      modal,
      ({ success }) => {
        if (!success) return;
        onSearch(searchParams);
      },
    );
  };

  const HeaderGridElement = useMemo(() => {
    const gridMode = !permissions?.delete_fg ? 'view' : 'delete';
    return <Datagrid {...gridInfo} gridMode={gridMode} />;
  }, [gridRef, data, permissions]);

  return !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '7px',
        }}
      >
        <Button
          btnType="buttonFill"
          widthSize="medium"
          heightSize="small"
          fontSize="small"
          ImageType="delete"
          colorType="delete"
          onClick={openDeleteDialog}
          disabled={!permissions?.delete_fg}
        >
          삭제
        </Button>
        <Button
          btnType="buttonFill"
          widthSize="large"
          heightSize="small"
          fontSize="small"
          ImageType="add"
          colorType="blue"
          onClick={openCreatableOrderModal}
          disabled={!permissions?.create_fg}
        >
          신규 추가
        </Button>
      </div>
      <Searchbox
        id="prod_order_search"
        innerRef={searchRef}
        searchItems={FieldStore.DUE_DATE_RANGE_SEVEN.map((field, index) =>
          putDueDateFielLabel(field, index, '지시기간'),
        )}
        onSearch={onSearch}
        boxShadow={false}
      />
      <Container>{HeaderGridElement}</Container>
      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}
      {editPopupVisible ? <GridPopup {...editGridPopupInfo} /> : null}
      {contextHolder}
    </>
  );
};
