import React from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { getToday } from '~/functions';

export const PgFacilityProductive = () => {
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_reg_date', 'end_reg_date'],
      defaults: [getToday(-7), getToday()],
      label: '생산 기간',
    },
    {
      type: 'check',
      id: 'facility_type',
      default: 'all',
      label: '작업장',
      options: [
        { code: 'ws1', text: '작업장1' },
        { code: 'ws2', text: '작업장2' },
        { code: 'ws3', text: '작업장3' },
      ],
    },
  ]);

  const barGraphProps = {
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: '설비 운영율/가동율',
        },
      },
    },
    data: {
      labels: [
        '작업장1',
        '작업장2',
        '작업장3',
        '작업장4',
        '작업장5',
        '작업장6',
        '작업장7',
      ],
      datasets: [
        {
          label: '운영율',
          data: Array.from({ length: 7 }).map(() => Math.random() * 100),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '가동율',
          data: Array.from({ length: 7 }).map(() => Math.random() * 100),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
  };

  return (
    <>
      <Searchbox
        searchItems={searchInfo.searchItems}
        innerRef={searchInfo.props.innerRef}
        onSearch={() => {}}
      />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid data={[]} columns={[]} disabledAutoDateColumn={true} />
      </Container>
    </>
  );
};
