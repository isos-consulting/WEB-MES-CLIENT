import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import {
  COLUMN_CODE,
  Datagrid,
  EDIT_ACTION_CODE,
  IGridColumn,
  IGridPopupColumnInfo,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import { IPopupItemsReturnProps } from '~/components/UI/popup/popup.ui.type';
import { FieldStore } from '~/constants/fields';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { getData, getToday } from '~/functions';
import { injectClassNameAttributesInColumn } from '~/functions/tui-grid/class-name';
import { isNil } from '~/helper/common';
import prdDailyWorkPlanColumns from '../../work/plan/daily/prd-daily-work-plan-columns';
import prdLoadWorkPlanColumnNames from './prd-load-work-plan-column-names';

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

const putDueDateFieldLabel = (field, index, replacedLabel) => {
  if (index === 0)
    return {
      ...field,
      label: replacedLabel,
    };
  return field;
};

const getDailyWorkPlans = async (dailyWorkPlanConditions, childGridRef) => {
  const dailyWorkPlans = await getData(
    { ...dailyWorkPlanConditions },
    '/prd/plan-daily',
  );

  childGridRef.current.getInstance().resetData(dailyWorkPlans);
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
  }: IPopupItemsReturnProps &
    WorkPlanRowAddPopupInfo &
    WorkPlanRowAddPopupDataApiSettingParams = {
    columnNames: prdLoadWorkPlanColumnNames,
    columns: prdDailyWorkPlanColumns,
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
      columns: prdDailyWorkPlanColumns,
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
          putDueDateFieldLabel(field, index, WORD.WORK_PLAN_DATE_RANGE),
        ),
        {
          id: 'wait_task_fg',
          label: '',
          type: 'checkbox',
          default: true,
          hidden: true,
        },
      ],
      onSearch: (
        condition: WorkPlanRowAddPopupInfo['dataApiSettings']['params'],
      ) => {
        getDailyWorkPlans(condition, childGridRef);
      },
      boxShadow: false,
    },
    uriPath: '/prd/plan-daily',
  };

  const dailyWorkPlans = await getData(params, uriPath);

  if (typeof dailyWorkPlans === 'undefined') {
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
          gridId={uuidV4()}
          columns={datagridProps.columns}
          gridMode={gridMode}
          data={dailyWorkPlans}
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
            if (!isNil(popup)) {
              return {
                ...newProdOrder,
                [original]: prodOrder[popup],
              };
            }

            const column = columns.filter(el => el.name === original)[0];

            if (isNil(column)) throw new Error('DataGrid Column null');
            if (isNil(column.defaultValue))
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
