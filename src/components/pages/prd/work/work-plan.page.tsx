import React from 'react';
import {
  Button,
  Datagrid,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ColumnStore } from '~/constants/columns';

export const PgWorkPlan = () => {
  const workPlanSearchInfo = useSearchbox(
    'workPlanSearchInfo',
    [{ type: 'date', id: 'plan_date', default: '2022-09', label: '계획월' }],
    userSelectedPlanMonth => {
      console.log(userSelectedPlanMonth);
      console.log('데이터 그리드에 검색조건을 적용하여 조회를 수행합니다');
    },
  );
  const workPlanDataGridRef = React.createRef();
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
              console.log('수정 모달 창 나옴');
            }}
          >
            수정
          </Button>
          <Button
            onClick={() => {
              console.log('신규항목추가 모달 창 나옴');
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
      <GridPopup
        gridref={workPlanDataGridRef}
        columns={ColumnStore.WORK_PLAN}
        visible={false}
        gridMode="create"
        disabledAutoDateColumn={true}
      />
    </>
  );
};
