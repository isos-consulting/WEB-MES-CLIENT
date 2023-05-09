import { message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import {
  ButtonGroup,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  IGridColumn,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ButtonStore } from '~/constants/buttons';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import {
  executeData,
  getData,
  getNow,
  getPageName,
  getUserFactoryUuid,
} from '~/functions';
import { FlexBox } from '../../adm/excel-upload-type/components/Header';
import BasicModalContext from '../../adm/excel-upload-type/hooks/modal';
import prdDailyWorkPlanColumns from './plan/daily/prd-daily-work-plan-columns';
import Grid from '@toast-ui/react-grid';

const hiddenWorkPlanModal = new BasicModalContext({
  title: '',
  columns: ColumnStore.WORK_PLAN,
  visible: false,
  gridMode: 'view',
  data: [],
  gridPopupInfo: [],
  gridComboInfo: [],
  onOk: () => {
    // This is intentional
  },
});

export const PgDailyWorkPlan = () => {
  const title = getPageName();
  const workPlanSearchInfo = useSearchbox(
    'workPlanSearchInfo',
    [
      {
        type: 'dateym',
        id: 'plan_date',
        default: getNow(0, { format: 'YYYY-MM' }),
        label: WORD.WORK_PLAN_MONTH,
      },
    ],
    userSelectedPlanMonth =>
      fetchDailyWorkPlanGetApi(userSelectedPlanMonth).then(setWorkPlanData),
  );

  const [workPlanData, setWorkPlanData] = useState([]);
  const [workPlanModalContext, modalContextSwitch] =
    useState(hiddenWorkPlanModal);

  const workPlanDataGridRef = useRef<Grid>();

  const fetchDailyWorkPlanGetApi = ({ plan_date }: { plan_date: string }) =>
    getData({ plan_month: plan_date, wait_task_fg: false }, '/prd/plan-daily');

  const hideWorkPlanModal = () => modalContextSwitch(hiddenWorkPlanModal);

  const getWorkPlanData = () =>
    fetchDailyWorkPlanGetApi(
      workPlanSearchInfo.ref.current.values as { plan_date: string },
    );

  const confirmBeforeAddWorkPlan = grid => {
    Modal.confirm({
      icon: null,
      title: SENTENCE.ADD_RECORD,
      content: `${WORD.WORK_PLAN} ${SENTENCE.SAVE_CONFIRM}`,
      onOk: () =>
        workPlanPostApiCallSuccess(
          grid.current
            .getInstance()
            .getData()
            .map(
              ({
                plan_monthly_uuid,
                prod_uuid,
                workings_uuid,
                plan_day,
                plan_daily_qty,
              }) => ({
                plan_monthly_uuid,
                prod_uuid,
                workings_uuid,
                plan_day,
                plan_daily_qty,
                factory_uuid: getUserFactoryUuid(),
              }),
            ),
        ),
    });
  };

  const confirmBeforeEditWorkPlan = grid => {
    Modal.confirm({
      icon: null,
      title: WORD.EDIT,
      content: `${WORD.WORK_PLAN} ${SENTENCE.EDIT_CONFIRM}`,
      onOk: () => {
        console.log(grid.current.getInstance().getModifiedRows().updatedRows);
        workPlanPutApiCallSuccess(
          grid.current
            .getInstance()
            .getModifiedRows()
            .updatedRows.map(
              ({
                plan_daily_uuid,
                plan_monthly_uuid,
                prod_uuid,
                workings_uuid,
                plan_day,
                plan_daily_qty,
              }) => ({
                uuid: plan_daily_uuid,
                plan_monthly_uuid,
                prod_uuid,
                workings_uuid,
                plan_day,
                plan_daily_qty,
                factory_uuid: getUserFactoryUuid(),
              }),
            ),
        );
      },
    });
  };

  const confirmBeforeDeleteWorkPlan = () => {
    const checkedWorkPlans = workPlanDataGridRef.current
      .getInstance()
      .getCheckedRows();

    if (checkedWorkPlans.length === 0) {
      message.warn(SENTENCE.SELECT_RECORD);
      return;
    }

    Modal.confirm({
      icon: null,
      title: WORD.DELETE,
      content: SENTENCE.DELETE_CONFIRM,
      onOk: () =>
        workPlanDeleteApiCallSuccess(
          checkedWorkPlans.map(({ plan_daily_uuid }) => ({
            uuid: plan_daily_uuid,
          })),
        ),
    });
  };

  const workPlanPostApiCallSuccess = addedWorkPlan => {
    executeData(addedWorkPlan, '/prd/plan-daily', 'post').then(res => {
      if (res.success === true) {
        message.info(SENTENCE.SAVE_COMPLETE);
        modalContextSwitch(hiddenWorkPlanModal);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const workPlanPutApiCallSuccess = editedWorkPlan => {
    executeData(editedWorkPlan, '/prd/plan-daily', 'put').then(res => {
      if (res.success === true) {
        message.info(SENTENCE.EDIT_COMPLETE);
        modalContextSwitch(hiddenWorkPlanModal);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const workPlanDeleteApiCallSuccess = deletedWorkPlan => {
    executeData(deletedWorkPlan, '/prd/plan-daily', 'delete').then(res => {
      if (res.success === true) {
        message.info(SENTENCE.DELETE_COMPLETE);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const showAddWorkPlanModal = () => {
    modalContextSwitch({
      ...BasicModalContext.add({
        title: `${workPlanSearchInfo.ref.current.values.plan_date} ${title}`,
        columns: prdDailyWorkPlanColumns,
        gridPopupInfo: [
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
        ],
        gridComboInfo: [],
        onOk: confirmBeforeAddWorkPlan,
      }),
      disabledAutoDateColumn: true,
      rowAddPopupInfo: {
        // 라우팅 팝업 불러오기
        columnNames: [
          { original: 'plan_monthly_uuid', popup: 'plan_monthly_uuid' },
          { original: 'routing_uuid', popup: 'routing_uuid' },
          { original: 'proc_uuid', popup: 'proc_uuid' },
          { original: 'proc_no', popup: 'proc_no' },
          { original: 'proc_nm', popup: 'proc_nm' },
          { original: 'workings_uuid', popup: 'workings_uuid' },
          { original: 'workings_nm', popup: 'workings_nm' },
          { original: 'item_type_uuid', popup: 'item_type_uuid' },
          { original: 'item_type_nm', popup: 'item_type_nm' },
          { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
          { original: 'prod_type_nm', popup: 'prod_type_nm' },
          { original: 'prod_uuid', popup: 'prod_uuid' },
          { original: 'prod_no', popup: 'prod_no' },
          { original: 'prod_nm', popup: 'prod_nm' },
          { original: 'model_uuid', popup: 'model_uuid' },
          { original: 'model_nm', popup: 'model_nm' },
          { original: 'rev', popup: 'rev' },
          { original: 'prod_std', popup: 'prod_std' },
          { original: 'unit_uuid', popup: 'unit_uuid' },
          { original: 'unit_nm', popup: 'unit_nm' },
          { original: 'auto_work_fg', popup: 'auto_work_fg' },
        ],
        columns: ColumnStore.WORK_PLAN,
        dataApiSettings: {
          uriPath: 'prd/plan-monthly',
          params: {
            plan_month: workPlanSearchInfo.ref.current.values.plan_date,
            wait_task_fg: true,
          },
        },
        gridMode: 'multi-select',
      },
    });
  };

  const showEditWorkPlanModal = () =>
    modalContextSwitch(
      BasicModalContext.edit({
        title,
        columns: prdDailyWorkPlanColumns.map<IGridColumn>(column => {
          if (column.name === 'plan_daily_qty') {
            return {
              ...column,
              editable: true,
            };
          }
          return {
            ...column,
            editable: false,
          };
        }),
        data: [...workPlanData],
        gridPopupInfo: [],
        gridComboInfo: [],
        onOk: confirmBeforeEditWorkPlan,
      }),
    );

  const headerButtonActionTable = {
    DELETE: confirmBeforeDeleteWorkPlan,
    EDIT: showEditWorkPlanModal,
    ADD: showAddWorkPlanModal,
  };
  const headerButtonsKeys = Object.keys(headerButtonActionTable);

  const headerButtonGroups = Object.entries(ButtonStore)
    .filter(key => headerButtonsKeys.includes(key[0]))
    .map(([key, value]) => ({
      ...value,
      onClick: headerButtonActionTable[key],
    }));

  return (
    <>
      <header>
        <FlexBox justifyContent="flex-end">
          <ButtonGroup btnItems={headerButtonGroups} />
        </FlexBox>
        <Searchbox
          id="workPlanSearchInfo"
          innerRef={workPlanSearchInfo.props.innerRef}
          searchItems={workPlanSearchInfo.searchItems}
          onSearch={workPlanSearchInfo.onSearch}
        />
      </header>
      <main>
        <Container>
          <Datagrid
            gridId="workPlanDataGrid"
            ref={workPlanDataGridRef}
            data={workPlanData}
            columns={prdDailyWorkPlanColumns}
            gridMode="delete"
          />
        </Container>
      </main>
      {workPlanModalContext.visible === true && (
        <GridPopup {...workPlanModalContext} onCancel={hideWorkPlanModal} />
      )}
    </>
  );
};
