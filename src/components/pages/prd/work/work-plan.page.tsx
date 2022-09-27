import { Modal } from 'antd';
import React, { useState } from 'react';
import {
  ButtonGroup,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ButtonStore } from '~/constants/buttons';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { getPageName } from '~/functions';
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
        type: 'date',
        id: 'plan_date',
        default: '2022-09',
        label: WORD.WORK_PLAN_MONTH,
      },
    ],
    userSelectedPlanMonth => {
      fetchWorkPlanGetApi(userSelectedPlanMonth).then(getWorkPlanData);
    },
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
        gridPopupInfo: [],
        gridComboInfo: [],
        onOk: confirmAtBeforeCallApi,
      }),
      disabledAutoDateColumn: true,
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
          <Datagrid data={workPlanData} columns={ColumnStore.WORK_PLAN} />
        </Container>
      </main>
      {workPlanModalContext.visible === true && (
        <GridPopup {...workPlanModalContext} onCancel={hideWorkPlanModal} />
      )}
    </>
  );
};
