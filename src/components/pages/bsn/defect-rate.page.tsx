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
    rt: 'A',
    fg: '생산',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'A',
    fg: '불량',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'B',
    fg: '생산',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'B',
    fg: '불량',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'C',
    fg: '생산',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'C',
    fg: '불량',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'D',
    fg: '생산',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'D',
    fg: '불량',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'E',
    fg: '생산',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
  {
    rt: 'E',
    fg: '불량',
    o1: (Math.random() * 100).toFixed(2),
    o2: (Math.random() * 100).toFixed(2),
    o3: (Math.random() * 100).toFixed(2),
    o4: (Math.random() * 100).toFixed(2),
    o5: (Math.random() * 100).toFixed(2),
    o6: (Math.random() * 100).toFixed(2),
    o7: (Math.random() * 100).toFixed(2),
    o8: (Math.random() * 100).toFixed(2),
    o9: (Math.random() * 100).toFixed(2),
    o10: (Math.random() * 100).toFixed(2),
    o11: (Math.random() * 100).toFixed(2),
    o12: (Math.random() * 100).toFixed(2),
  },
];

const columns = [];
const complexColumns = [];

columns.push({ header: '공정', name: 'rt' });
columns.push({ header: '구분', name: 'fg' });

for (let i = 0; i < 12; i++) {
  columns.push({
    header: `${i + 1}월`,
    name: `o${i + 1}`,
  });
}

const summaryData = [...data]
  .filter(data => data.fg === '생산')
  .reduce((acc, cur, idx) => {
    const c = idx === 1 ? { ...acc } : acc;

    c.rt = '합계';
    c.o1 = (Number(c.o1) + Number(cur.o1)).toFixed(2);
    c.o2 = (Number(c.o2) + Number(cur.o2)).toFixed(2);
    c.o3 = (Number(c.o3) + Number(cur.o3)).toFixed(2);
    c.o4 = (Number(c.o4) + Number(cur.o4)).toFixed(2);
    c.o5 = (Number(c.o5) + Number(cur.o5)).toFixed(2);
    c.o6 = (Number(c.o6) + Number(cur.o6)).toFixed(2);
    c.o7 = (Number(c.o7) + Number(cur.o7)).toFixed(2);
    c.o8 = (Number(c.o8) + Number(cur.o8)).toFixed(2);
    c.o9 = (Number(c.o9) + Number(cur.o9)).toFixed(2);
    c.o10 = (Number(c.o10) + Number(cur.o10)).toFixed(2);
    c.o11 = (Number(c.o11) + Number(cur.o11)).toFixed(2);
    c.o12 = (Number(c.o12) + Number(cur.o12)).toFixed(2);

    return c;
  });
const summaryDataDefect = [...data]
  .filter(data => data.fg === '불량')
  .reduce((acc, cur, idx) => {
    const c = idx === 1 ? { ...acc } : acc;

    c.rt = '합계';
    c.o1 = (Number(c.o1) + Number(cur.o1)).toFixed(2);
    c.o2 = (Number(c.o2) + Number(cur.o2)).toFixed(2);
    c.o3 = (Number(c.o3) + Number(cur.o3)).toFixed(2);
    c.o4 = (Number(c.o4) + Number(cur.o4)).toFixed(2);
    c.o5 = (Number(c.o5) + Number(cur.o5)).toFixed(2);
    c.o6 = (Number(c.o6) + Number(cur.o6)).toFixed(2);
    c.o7 = (Number(c.o7) + Number(cur.o7)).toFixed(2);
    c.o8 = (Number(c.o8) + Number(cur.o8)).toFixed(2);
    c.o9 = (Number(c.o9) + Number(cur.o9)).toFixed(2);
    c.o10 = (Number(c.o10) + Number(cur.o10)).toFixed(2);
    c.o11 = (Number(c.o11) + Number(cur.o11)).toFixed(2);
    c.o12 = (Number(c.o12) + Number(cur.o12)).toFixed(2);

    return c;
  });

export const PgDefectRateReport = () => {
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_reg_date', 'end_reg_date'],
      defaults: [getToday(-7), getToday()],
      label: '생산 기간',
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
          text: '불량율',
        },
      },
    },
    data: {
      labels: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      datasets: [
        {
          label: '불량율',
          data: Object.keys(summaryData)
            .filter(key => key.includes('o'))
            .map(key =>
              Number.parseFloat(
                (summaryDataDefect[key] / summaryData[key]).toFixed(2),
              ),
            ),
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
          data={[...data, summaryData, summaryDataDefect]}
          columns={[...columns]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
