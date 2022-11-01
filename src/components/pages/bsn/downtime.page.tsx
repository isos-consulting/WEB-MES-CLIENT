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
    ws1: (Math.random() * 10).toFixed(0),
    ws2: (Math.random() * 10).toFixed(0),
    ws3: (Math.random() * 10).toFixed(0),
    ws4: (Math.random() * 10).toFixed(0),
    ws5: (Math.random() * 10).toFixed(0),
    ws6: (Math.random() * 10).toFixed(0),
  },
  {
    ws1: (Math.random() * 10).toFixed(0),
    ws2: (Math.random() * 10).toFixed(0),
    ws3: (Math.random() * 10).toFixed(0),
    ws4: (Math.random() * 10).toFixed(0),
    ws5: (Math.random() * 10).toFixed(0),
    ws6: (Math.random() * 10).toFixed(0),
  },
  {
    ws1: (Math.random() * 10).toFixed(0),
    ws2: (Math.random() * 10).toFixed(0),
    ws3: (Math.random() * 10).toFixed(0),
    ws4: (Math.random() * 10).toFixed(0),
    ws5: (Math.random() * 10).toFixed(0),
    ws6: (Math.random() * 10).toFixed(0),
  },
];

const columns = [
  {
    header: '작업장1',
    name: 'ws1',
  },
  {
    header: '작업장2',
    name: 'ws2',
  },
  {
    header: '작업장3',
    name: 'ws3',
  },
  {
    header: '작업장4',
    name: 'ws4',
  },
  {
    header: '작업장5',
    name: 'ws5',
  },
  {
    header: '작업장6',
    name: 'ws6',
  },
];

const summaryData = data.reduce((acc, cur, idx) => {
  const c = idx === 1 ? { ...acc } : acc;

  c.ws1 = (Number(c.ws1) + Number(cur.ws1)).toString();
  c.ws2 = (Number(c.ws2) + Number(cur.ws2)).toString();
  c.ws3 = (Number(c.ws3) + Number(cur.ws3)).toString();
  c.ws4 = (Number(c.ws4) + Number(cur.ws4)).toString();
  c.ws5 = (Number(c.ws5) + Number(cur.ws5)).toString();
  c.ws6 = (Number(c.ws6) + Number(cur.ws6)).toString();

  return c;
});

export const PgDownTimeReport = () => {
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
      id: 'ws_type',
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
      ],
      datasets: [
        {
          label: '비가동 시간(분)',
          data: Object.keys(summaryData)
            .filter(key => {
              if (key.includes('ws')) {
                return true;
              }
            })
            .map(key => summaryData[key]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
