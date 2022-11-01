import React from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { getToday } from '~/functions';

const data = [
  {
    fg: '운영율',
    ws1: (Math.random() * 100).toFixed(2),
    ws2: (Math.random() * 100).toFixed(2),
    ws3: (Math.random() * 100).toFixed(2),
    ws4: (Math.random() * 100).toFixed(2),
    ws5: (Math.random() * 100).toFixed(2),
    ws6: (Math.random() * 100).toFixed(2),
    ws7: (Math.random() * 100).toFixed(2),
  },
  {
    fg: '가동율',
    ws1: (Math.random() * 100).toFixed(2),
    ws2: (Math.random() * 100).toFixed(2),
    ws3: (Math.random() * 100).toFixed(2),
    ws4: (Math.random() * 100).toFixed(2),
    ws5: (Math.random() * 100).toFixed(2),
    ws6: (Math.random() * 100).toFixed(2),
    ws7: (Math.random() * 100).toFixed(2),
  },
];

const columns = [
  { header: '구분', name: 'fg' },
  { header: '작업장1', name: 'ws1' },
  { header: '작업장2', name: 'ws2' },
  { header: '작업장3', name: 'ws3' },
  { header: '작업장4', name: 'ws4' },
  { header: '작업장5', name: 'ws5' },
  { header: '작업장6', name: 'ws6' },
];

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
          data: Object.keys(data[0])
            .filter(key => key !== 'fg')
            .map(key => data[0][key]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '가동율',
          data: Object.keys(data[1])
            .filter(key => key !== 'fg')
            .map(key => data[1][key]),
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
        <Datagrid
          data={[...data]}
          columns={[...columns]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
