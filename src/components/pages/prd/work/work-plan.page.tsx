import { Modal } from 'antd';
import React, { useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
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

  return (
    <>
      <header style={{ width: '100%' }}>
        <div>
          <Button onClick={confirmAtBeforeDeleteWorkPlan}>삭제</Button>
          <Button onClick={showEditWorkPlanModal}>수정</Button>
          <Button onClick={showAddWorkPlanModal}>신규항목추가</Button>
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
