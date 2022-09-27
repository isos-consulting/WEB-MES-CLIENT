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
import { getPageName } from '~/functions';
import BasicModalContext from '../../adm/excel-upload-type/hooks/modal';

const hiddenWokrPlanModal = new BasicModalContext({
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
    [{ type: 'date', id: 'plan_date', default: '2022-09', label: '계획월' }],
    userSelectedPlanMonth => {
      fetchWorkPlanGetApi(userSelectedPlanMonth).then(getWorkPlanData);
    },
  );

  const [workPlanData, setWorkPlanData] = useState([]);
  const [workPlanModalContext, modalContextSwitch] =
    useState(hiddenWokrPlanModal);

  const fetchWorkPlanGetApi = planMonth => Promise.resolve([]);

  const hideWokrPlanModal = () => modalContextSwitch(hiddenWokrPlanModal);

  const getWorkPlanData = () =>
    fetchWorkPlanGetApi(workPlanSearchInfo.ref.current.values);

  const confirmAtBeforeDeleteWorkPlan = () => {
    Modal.confirm({
      icon: null,
      title: '삭제하시겠습니까?',
      content: '삭제된 데이터는 복구할 수 없습니다.',
      onOk: setWorkPlanData(getWorkPlanData),
    });
  };

  const confirmAtBeforeCallApi = () =>
    Modal.confirm({
      icon: null,
      title: '저장하시겠습니까?',
      content: '생산 계획 정보를 저장하시겠습니까?',
      onOk: modalApiCallSuccess,
    });

  const modalApiCallSuccess = () => {
    Promise.resolve({ success: true }).then(res => {
      if (res.success === true) {
        modalContextSwitch(hiddenWokrPlanModal);
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonGroup btnItems={headerButtonGroups} />
        </div>
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
        <GridPopup {...workPlanModalContext} onCancel={hideWokrPlanModal} />
      )}
    </>
  );
};
