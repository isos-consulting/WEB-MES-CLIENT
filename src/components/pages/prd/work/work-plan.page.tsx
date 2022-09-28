import { Modal } from 'antd';
import React, { useState } from 'react';
import {
  ButtonGroup,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ButtonStore } from '~/constants/buttons';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { ENUM_WIDTH } from '~/enums';
import { getNow, getPageName } from '~/functions';
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
  onOk: () => {},
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
      fetchWorkPlanGetApi(userSelectedPlanMonth).then(getWorkPlanData),
  );

  const [workPlanData, setWorkPlanData] = useState([]);
  const [workPlanModalContext, modalContextSwitch] =
    useState(hiddenWorkPlanModal);

  const fetchWorkPlanGetApi = planMonth => Promise.resolve([]);

  const hideWorkPlanModal = () => modalContextSwitch(hiddenWorkPlanModal);

  const getWorkPlanData = () =>
    fetchWorkPlanGetApi(workPlanSearchInfo.ref.current.values);

  const confirmAtBeforeDeleteWorkPlan = () => {
    Modal.confirm({
      icon: null,
      title: WORD.DELETE,
      content: SENTENCE.DELETE_CONFIRM,
      onOk: setWorkPlanData(getWorkPlanData),
    });
  };

  const confirmAtBeforeCallApi = () =>
    Modal.confirm({
      icon: null,
      title: WORD.SAVE,
      content: `${WORD.WORK_PLAN} ${SENTENCE.SAVE_CONFIRM}`,
      onOk: modalApiCallSuccess,
    });

  const modalApiCallSuccess = () => {
    Promise.resolve({ success: true }).then(res => {
      if (res.success === true) {
        modalContextSwitch(hiddenWorkPlanModal);
        setWorkPlanData(getWorkPlanData);
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
            // 작업장 관리
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
        onOk: confirmAtBeforeCallApi,
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
        columns: ColumnStore.WORK_PLAN,
        data: [...workPlanData],
        gridPopupInfo: [],
        gridComboInfo: [],
        onOk: confirmAtBeforeCallApi,
      }),
    );

  const headerButtonActionTable = {
    DELETE: confirmAtBeforeDeleteWorkPlan,
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
