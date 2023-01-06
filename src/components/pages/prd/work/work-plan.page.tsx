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
import { ENUM_WIDTH } from '~/enums';
import {
  executeData,
  getData,
  getNow,
  getPageName,
  getUserFactoryUuid,
} from '~/functions';
import { FlexBox } from '../../adm/excel-upload-type/components/Header';
import BasicModalContext from '../../adm/excel-upload-type/hooks/modal';

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

export const PgWorkPlan = () => {
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
      fetchWorkPlanGetApi(userSelectedPlanMonth).then(setWorkPlanData),
  );

  const [workPlanData, setWorkPlanData] = useState([]);
  const [workPlanModalContext, modalContextSwitch] =
    useState(hiddenWorkPlanModal);

  const workPlanDataGridRef = useRef();

  const fetchWorkPlanGetApi = ({ plan_date }: { plan_date: string }) =>
    getData({ plan_month: plan_date, wait_task_fg: false }, 'prd/plan-monthly');

  const hideWorkPlanModal = () => modalContextSwitch(hiddenWorkPlanModal);

  const getWorkPlanData = () =>
    fetchWorkPlanGetApi(workPlanSearchInfo.ref.current.values);

  const confirmBeforeAddWorkPlan = grid => {
    Modal.confirm({
      icon: null,
      title: SENTENCE.ADD_RECORD,
      content: `${WORD.WORK_PLAN} ${SENTENCE.SAVE_CONFIRM}`,
      onOk: () =>
        workPlanPostApiCallSuccess(grid.current.getInstance().getData()),
    });
  };

  const confirmBeforeEditWorkPlan = grid => {
    Modal.confirm({
      icon: null,
      title: WORD.EDIT,
      content: `${WORD.WORK_PLAN} ${SENTENCE.EDIT_CONFIRM}`,
      onOk: () =>
        workPlanPutApiCallSuccess(
          grid.current
            .getInstance()
            .getModifiedRows()
            .updatedRows.map(({ work_plan_month_uuid, ...workPlanRest }) => ({
              uuid: work_plan_month_uuid,
              ...workPlanRest,
            })),
        ),
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
          checkedWorkPlans.map(({ plan_monthly_uuid }) => ({
            uuid: plan_monthly_uuid,
          })),
        ),
    });
  };

  const workPlanPostApiCallSuccess = addedWorkPlan => {
    executeData(
      addedWorkPlan.map(
        ({ prod_uuid, workings_uuid, plan_month, plan_monthly_qty }) => ({
          prod_uuid,
          workings_uuid,
          plan_month,
          plan_monthly_qty,
          factory_uuid: getUserFactoryUuid(),
        }),
      ),
      '/prd/plan-monthly',
      'post',
    ).then(res => {
      if (res.success === true) {
        message.info(SENTENCE.SAVE_COMPLETE);
        modalContextSwitch(hiddenWorkPlanModal);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const workPlanPutApiCallSuccess = editedWorkPlan => {
    executeData(
      editedWorkPlan.map(
        ({
          plan_monthly_uuid,
          prod_uuid,
          workings_uuid,
          plan_month,
          plan_monthly_qty,
        }) => ({
          uuid: plan_monthly_uuid,
          prod_uuid,
          workings_uuid,
          plan_month,
          plan_monthly_qty,
          factory_uuid: getUserFactoryUuid(),
        }),
      ),
      '/prd/plan-monthly',
      'put',
    ).then(res => {
      if (res.success === true) {
        message.info(SENTENCE.EDIT_COMPLETE);
        modalContextSwitch(hiddenWorkPlanModal);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const workPlanDeleteApiCallSuccess = deletedWorkPlan => {
    executeData(deletedWorkPlan, '/prd/plan-monthly', 'delete').then(res => {
      if (res.success === true) {
        message.info(SENTENCE.DELETE_COMPLETE);
        getWorkPlanData().then(setWorkPlanData);
      }
    });
  };

  const showAddWorkPlanModal = () =>
    modalContextSwitch({
      ...BasicModalContext.add({
        title,
        columns: ColumnStore.WORK_PLAN,
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
        columns: [
          {
            header: '라우팅UUID',
            name: 'routing_uuid',
            alias: 'uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '공정UUID',
            name: 'proc_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '공정순서',
            name: 'proc_no',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '공정',
            name: 'proc_nm',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '작업장UUID',
            name: 'workings_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '작업장',
            name: 'workings_nm',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '품목유형UUID',
            name: 'item_type_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '제품유형UUID',
            name: 'prod_type_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '품목UUID',
            name: 'prod_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '품목',
            name: 'prod_nm',
            width: ENUM_WIDTH.L,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '모델UUID',
            name: 'model_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.M,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '단위UUID',
            name: 'unit_uuid',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
          {
            header: '단위',
            name: 'unit_nm',
            width: ENUM_WIDTH.S,
            filter: 'text',
            hidden: false,
            format: 'text',
          },
          {
            header: '자동 실적처리유무',
            name: 'auto_work_fg',
            width: ENUM_WIDTH.M,
            hidden: true,
            format: 'text',
          },
        ],
        dataApiSettings: {
          uriPath: '/std/routings/actived-prod',
          params: {},
        },
        gridMode: 'multi-select',
      },
    });

  const showEditWorkPlanModal = () =>
    modalContextSwitch(
      BasicModalContext.edit({
        title,
        columns: ColumnStore.WORK_PLAN.map<IGridColumn>(column => {
          if (column.name === 'plan_monthly_qty') {
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
          innerRef={workPlanSearchInfo.props.innerRef}
          searchItems={workPlanSearchInfo.searchItems}
          onSearch={workPlanSearchInfo.onSearch}
        />
      </header>
      <main>
        <Container>
          <Datagrid
            ref={workPlanDataGridRef}
            data={workPlanData}
            columns={ColumnStore.WORK_PLAN}
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
