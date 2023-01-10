import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  COLUMN_CODE,
  Datagrid,
  EDIT_ACTION_CODE,
  IGridColumn,
  IGridPopupColumnInfo,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import { IPopupItemsRetrunProps } from '~/components/UI/popup/popup.ui.type';
import { ColumnStore } from '~/constants/columns';
import { FieldStore } from '~/constants/fields';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import ModalStore from '~/constants/modals';
import { getData, getToday } from '~/functions';
import { injectClassNameAttributesInColumn } from '~/functions/tui-grid/class-name';

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

type WorkPlanRowAddPopupDataApiSettingParams = {
  params: {
    start_date: string;
    end_date: string;
    wait_task_fg: boolean;
  };
};

const putDueDateFielLabel = (field, index, replacedLabel) => {
  if (index === 0)
    return {
      ...field,
      label: replacedLabel,
    };
  return field;
};

export const getDailyWorkPlanModalProps = async ({
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
    WorkPlanRowAddPopupInfo &
    WorkPlanRowAddPopupDataApiSettingParams = {
    columnNames: ModalStore.ORDER_ADD_ROW_POPUP_INFO.columnNames.concat([
      { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
      { original: 'lv', popup: 'lv' },
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
      searchItems: [
        ...FieldStore.DUE_DATE_RANGE_SEVEN.map((field, index) =>
          putDueDateFielLabel(field, index, WORD.WORK_PLAN_DATE_RANGE),
        ),
        {
          id: 'wait_task_fg',
          label: '',
          type: 'checkbox',
          default: true,
          hidden: true,
        },
      ],
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
