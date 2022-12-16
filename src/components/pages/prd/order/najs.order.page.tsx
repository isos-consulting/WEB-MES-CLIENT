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
  GridPopup,
  IGridColumn,
  IGridPopupColumnInfo,
  IPopupItemsRetrunProps,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
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
import { SENTENCE, WORD } from '~/constants/lang/ko';

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
      title: `${WORD.WORK_PLAN} - ${WORD.MULTI_SELECT}`,
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
        putDueDateFielLabel(field, index, WORD.WORK_PLAN_DATE_RANGE),
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
    throw new Error(SENTENCE.ERROR_OCCURRED);
  }

  return {
    title: modalProps.title,
    width: '80%',
    icon: null,
    okText: WORD.SELECT,
    cancelText: WORD.CANCEL,
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

  const gridInfo: IDatagridProps = {
    gridId: 'ORDER_GRID',
    ref: gridRef,
    gridMode: 'delete',
    saveUriPath: '/prd/orders/total',
    searchUriPath: '/prd/orders',
    columns: ColumnStore.NAJS_PROD_ORDER,
    data: data,
    rowAddPopupInfo: {
      ...ModalStore.ORDER_ADD_ROW_POPUP_INFO,
      dataApiSettings: {
        ...ModalStore.ORDER_ADD_ROW_POPUP_INFO.dataApiSettings,
        onInterlock: () => {
          message.warn(SENTENCE.PLEASE_DO_WORK_PLAN_LOAD);
          return false;
        },
      },
    },
    gridPopupInfo: [
      ModalStore.EQUIP_POPUP_INFO,
      ModalStore.WORKINGS_POPUP_INFO,
    ],
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
    title: SENTENCE.CHILD_PROD_ORDER_REGISTER,
    okText: SENTENCE.SAVE_DATA,
    onOk: gridRef => {
      const { createdRows, ...otherRows } = getModifiedRows(
        gridRef,
        newGridPopupInfo.columns,
        newGridPopupInfo.data,
      );

      const workerNameSplitedRows = createdRows.map(row => ({
        ...row,
        worker_nm: row.worker_nm?.split(',') ?? [],
      }));

      saveGridData(
        {
          ...otherRows,
          createdRows: workerNameSplitedRows,
        },
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
        closeCreatableOrderModal();
      });
    },
    cancelText: WORD.CANCEL,
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
        buttonProps: { text: SENTENCE.WORK_PLAN_LOAD, children: '' },
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

  const onSearch = async (orderSearchParams: Record<string, string>) => {
    const findedOrderDatas =
      (await getData(
        {
          ...orderSearchParams,
          order_state: 'all',
        },
        gridInfo.searchUriPath,
      )) ?? [];

    if (!findedOrderDatas.length) {
      setData([]);
      return;
    }

    const orderUuids = `${findedOrderDatas.reduce(
      (orderUuid, order) => `${orderUuid}${order.order_uuid},`,
      '',
    )}`.slice(0, -1);

    const workers = await getData(
      { order_uuid: orderUuids },
      'prd/order-workers/total',
    );

    if (workers.length === 0) {
      setData(findedOrderDatas);
      return;
    }

    const workerInjectedOrders = findedOrderDatas.map(order => {
      const findedWorkers = workers?.filter(
        worker => worker.order_uuid === order.order_uuid,
      );
      const workerNames = findedWorkers
        ?.map(worker => worker.emp_nm)
        ?.join(',');

      return {
        ...order,
        worker_nm: workerNames,
      };
    });

    setData(workerInjectedOrders);
  };

  const openDeleteDialog = () => {
    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      '/prd/orders',
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
    <Spin spinning={true} tip={SENTENCE.LOADING_PERMISSION_INFO} />
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
          {WORD.DELETE}
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
          {SENTENCE.ADD_RECORD}
        </Button>
      </div>
      <Searchbox
        id="prod_order_search"
        innerRef={searchRef}
        searchItems={FieldStore.DUE_DATE_RANGE_SEVEN.map((field, index) =>
          putDueDateFielLabel(field, index, WORD.ORDER_DATE_RANGE),
        )}
        onSearch={onSearch}
        boxShadow={false}
      />
      <Container>{HeaderGridElement}</Container>
      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}
      {contextHolder}
    </>
  );
};
