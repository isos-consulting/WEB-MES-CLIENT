import Grid from '@toast-ui/react-grid';
import { message, Modal, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { ColumnStore } from '~/constants/columns';
import ComboStore from '~/constants/combos';
import { FieldStore } from '~/constants/fields';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import ModalStore from '~/constants/modals';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  saveGridData,
} from '~/functions';
import { onDefaultGridSave } from './order.page.util';
import { getDailyWorkPlanModalProps } from './plan/prd-load-work-plan';
import prdOrderRowAddpopups from './prd-order-row-addpopups';

const putDueDateFielLabel = (field, index, replacedLabel) => {
  if (index === 0)
    return {
      ...field,
      label: replacedLabel,
    };
  return field;
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
      ...prdOrderRowAddpopups,
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
    visible: ['monthly_balance'],
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

      if (newModalDatagridColumnProps.visible.includes(name)) {
        columnInEditModal.hidden = false;
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

      const workerNameSplitedRows = createdRows.map(row => {
        if (row.lv === '0') {
          return {
            ...row,
            worker_nm: row.worker_nm?.split(',') ?? [],
          };
        }

        return {
          ...row,
          worker_nm: row.worker_nm?.split(',') ?? [],
          plan_daily_uuid: null,
        };
      });

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
        align: 'right',
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
      {
        align: 'right',
        buttonProps: { text: '행취소' },
        buttonAction: (_ev, props, { gridRef }) => {
          const prodOrderGrid = gridRef.current.getInstance();
          const { rowKey, columnName } = prodOrderGrid.getFocusedCell();
          const rowIndex = prodOrderGrid.getIndexOfRow(rowKey);
          const columns = prodOrderGrid.store.column.visibleColumns;
          const columnIndex = columns.findIndex(
            column => column.name === columnName,
          );

          if (rowKey == null) {
            message.warn('취소할 행을 선택해주세요');
            return;
          }

          prodOrderGrid.removeRow(rowKey, { removeOriginalData: false });

          if (prodOrderGrid.getRowCount() <= 0) return;

          if (Number(rowIndex) - 1 < 0) {
            prodOrderGrid.focusAt(0, columnIndex);
            return;
          }

          prodOrderGrid.focusAt(Number(rowIndex) - 1, columnIndex);
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
      {newPopupVisible ? (
        <GridPopup {...{ ...newGridPopupInfo, hiddenActionButtons: true }} />
      ) : null}
      {contextHolder}
    </>
  );
};
