import React from 'react';
import {
  Button,
  Datagrid,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';

export const PgWorkPlan = () => {
  const workPlanSearchInfo = useSearchbox(
    'workPlanSearchInfo',
    [{ type: 'date', id: 'plan_date', default: '2022-09', label: '계획월' }],
    userSelectedPlanMonth => {
      console.log(userSelectedPlanMonth);
      console.log('데이터 그리드에 검색조건을 적용하여 조회를 수행합니다');
    },
  );
  const rref = React.createRef();
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
          <Datagrid
            data={[]}
            columns={[
              {
                header: '계획월',
                name: 'planMonth',
                width: 100,
                align: 'center',
                editable: true,
              },
              {
                header: '품목UUID',
                name: 'prod_uuid',
                width: ENUM_WIDTH.L,
                hidden: true,
                editable: false,
              },
              {
                header: '품목유형UUID',
                name: 'item_type_uuid',
                width: ENUM_WIDTH.L,
                hidden: true,
                editable: false,
              },
              {
                header: '품목유형',
                name: 'item_type_nm',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: '제품유형UUID',
                name: 'prod_type_uuid',
                width: ENUM_WIDTH.L,
                editable: false,
                format: 'text',
              },
              {
                header: '제품유형',
                name: 'prod_type_nm',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: '품번',
                name: 'prod_no',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: '품명',
                name: 'prod_nm',
                width: ENUM_WIDTH.M,
                editable: true,
              },
              {
                header: '모델UUID',
                name: 'model_uuid',
                width: ENUM_WIDTH.L,
                hidden: true,
                editable: false,
              },
              {
                header: '모델',
                name: 'model_nm',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: 'Rev',
                name: 'rev',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: '규격',
                name: 'prod_std',
                width: ENUM_WIDTH.M,
                editable: false,
              },
              {
                header: '작업장UUID',
                name: 'workings_uuid',
                width: ENUM_WIDTH.L,
                hidden: true,
                editable: false,
              },
              {
                header: '작업장',
                name: 'workplaceName',
                width: ENUM_WIDTH.M,
                editable: true,
              },
              {
                header: '계획수량',
                name: 'plan_qty',
                width: ENUM_WIDTH.M,
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_USE_STOCK,
                editable: true,
              },
            ]}
          />
        </div>
      </main>
      <GridPopup
        gridref={rref}
        columns={[
          {
            header: '계획월',
            name: 'planMonth',
            width: 100,
            align: 'center',
            editable: true,
          },
          {
            header: '품목UUID',
            name: 'prod_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
            editable: false,
          },
          {
            header: '품목유형UUID',
            name: 'item_type_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
            editable: false,
          },
          {
            header: '품목유형',
            name: 'item_type_nm',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: '제품유형UUID',
            name: 'prod_type_uuid',
            width: ENUM_WIDTH.L,
            editable: false,
            format: 'text',
          },
          {
            header: '제품유형',
            name: 'prod_type_nm',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: '품번',
            name: 'prod_no',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: '품명',
            name: 'prod_nm',
            width: ENUM_WIDTH.M,
            editable: true,
          },
          {
            header: '모델UUID',
            name: 'model_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
            editable: false,
          },
          {
            header: '모델',
            name: 'model_nm',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: 'Rev',
            name: 'rev',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: '규격',
            name: 'prod_std',
            width: ENUM_WIDTH.M,
            editable: false,
          },
          {
            header: '작업장UUID',
            name: 'workings_uuid',
            width: ENUM_WIDTH.L,
            hidden: true,
            editable: false,
          },
          {
            header: '작업장',
            name: 'workplaceName',
            width: ENUM_WIDTH.M,
            editable: true,
          },
          {
            header: '계획수량',
            name: 'plan_qty',
            width: ENUM_WIDTH.M,
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_USE_STOCK,
            editable: true,
          },
        ]}
        visible={false}
        gridMode="create"
        disabledAutoDateColumn={true}
      />
    </>
  );
};
