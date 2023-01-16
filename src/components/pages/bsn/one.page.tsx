import React from 'react';
import { Container, Datagrid } from '~/components/UI';

export const PgPrdBsnOne = () => {
  return (
    <>
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
        <Container style={{ width: 'Calc(50% - 15px)' }}>chartArea</Container>
      </div>
      <Container style={{ minHeight: '150px' }}>textarea</Container>
      <Container>
        <Datagrid
          data={[{}, {}, {}, {}, {}, {}, {}, {}]}
          columns={[]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
