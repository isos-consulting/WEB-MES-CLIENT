import { Modal } from 'antd';
import React, { useState } from 'react';
import {
  Button,
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
  const [workPlanData, setWorkPlanData] = useState([]);
  const workPlanSearchInfo = useSearchbox(
    'workPlanSearchInfo',
    [{ type: 'date', id: 'plan_date', default: '2022-09', label: '계획월' }],
    userSelectedPlanMonth => {
      console.log(userSelectedPlanMonth);
      console.log('데이터 그리드에 검색조건을 적용하여 조회를 수행합니다');
    },
  );

  const [workPlanModalContext, modalContextSwitch] =
    useState(hiddenWokrPlanModal);

  const hideWokrPlanModal = () => modalContextSwitch(hiddenWokrPlanModal);

  const getWorkPlanData = () => [];

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
          <Button
            onClick={() => {
              console.log('삭제 확인 창 나옴');
            }}
          >
            삭제
          </Button>
          <Button
            onClick={() => {
              showEditWorkPlanModal();
            }}
          >
            수정
          </Button>
          <Button
            onClick={() => {
              showAddWorkPlanModal();
            }}
          >
            신규항목추가
          </Button>
        </div>
        <Searchbox {...workPlanSearchInfo} />
      </header>
      <main>
        <div>
          <Datagrid data={[]} columns={ColumnStore.WORK_PLAN} />
        </div>
      </main>
      {workPlanModalContext.visible === true && (
        <GridPopup {...workPlanModalContext} onCancel={hideWokrPlanModal} />
      )}
    </>
  );
};
