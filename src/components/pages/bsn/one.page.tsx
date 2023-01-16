import React from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { PieChart } from '~/components/UI/graph/chart-pie.ui';
import { getToday } from '~/functions';

export const PgPrdBsnOne = () => {
  return (
    <>
      <Searchbox
        searchItems={[
          {
            id: 'reg_date',
            label: '생산 월',
            type: 'dateym',
            default: getToday(),
          },
        ]}
        onSearch={async ({ reg_date }: { reg_date: string }) => {
          const reg_month = reg_date.substring(0, 7);

          console.log({ reg_month });
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0px 15px' }}>
        <Container style={{ width: '50%' }}>
          <Datagrid
            data={[{}, {}, {}, {}, {}, {}, {}, {}]}
            columns={[
              { header: '원인항목' },
              { header: '1주차' },
              { header: '2주차' },
              { header: '3주차' },
              { header: '4주차' },
              { header: '5주차' },
              { header: '합계' },
              { header: '점유율' },
            ]}
            disabledAutoDateColumn={true}
          />
        </Container>
        <div
          style={{
            width: 'Calc(50% - 15px)',
            marginTop: '8px',
            border: '1px',
            borderRadius: '3px',
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
          }}
        >
          <PieChart />
        </div>
      </div>
      <Container style={{ minHeight: '150px' }}>textarea</Container>
      <Container>
        <Datagrid
          data={[{}, {}, {}, {}, {}, {}, {}, {}]}
          columns={[
            { header: '원인항목' },
            { header: '1월' },
            { header: '2월' },
            { header: '3월' },
            { header: '4월' },
            { header: '5월' },
            { header: '6월' },
            { header: '7월' },
            { header: '8월' },
            { header: '9월' },
            { header: '10월' },
            { header: '11월' },
            { header: '12월' },
            { header: '합계' },
            { header: '점유율' },
          ]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
