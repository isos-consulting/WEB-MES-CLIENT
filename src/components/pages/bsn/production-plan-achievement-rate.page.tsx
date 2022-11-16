import React from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { getData, getToday } from '~/functions';

const headers = {
  지시: 'order_month_',
  생산: 'work_month_',
  달성: 'rate_month_',
};
const summaryHeaders = {
  지시: 'sum_order_qty',
  생산: 'sum_work_qty',
  달성: 'sum_rate',
};
const columns = [];

const complexColumns = [
  {
    header: '합계',
    name: 'sum',
    childNames: Object.values(summaryHeaders),
  },
];

columns.push({ header: '공정', name: 'proc_nm', width: ENUM_WIDTH.L });
columns.push(
  ...Object.entries(summaryHeaders).map(([header, name]) => ({
    header,
    name,
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  })),
);

for (let i = 0; i < 12; i++) {
  for (const [header, name] of Object.entries(headers)) {
    columns.push({
      header,
      name: `${name}${i + 1}`,
      width: ENUM_WIDTH.S,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    });
  }

  complexColumns.push({
    header: `${i + 1}월`,
    name: `m${i + 1}`,
    childNames: [`o${i + 1}`, `c${i + 1}`, `a${i + 1}`],
  });
}

const summaryData = [...data].reduce((acc, cur, idx) => {
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
  c.c1 = (Number(c.c1) + Number(cur.c1)).toFixed(2);
  c.c2 = (Number(c.c2) + Number(cur.c2)).toFixed(2);
  c.c3 = (Number(c.c3) + Number(cur.c3)).toFixed(2);
  c.c4 = (Number(c.c4) + Number(cur.c4)).toFixed(2);
  c.c5 = (Number(c.c5) + Number(cur.c5)).toFixed(2);
  c.c6 = (Number(c.c6) + Number(cur.c6)).toFixed(2);
  c.c7 = (Number(c.c7) + Number(cur.c7)).toFixed(2);
  c.c8 = (Number(c.c8) + Number(cur.c8)).toFixed(2);
  c.c9 = (Number(c.c9) + Number(cur.c9)).toFixed(2);
  c.c10 = (Number(c.c10) + Number(cur.c10)).toFixed(2);
  c.c11 = (Number(c.c11) + Number(cur.c11)).toFixed(2);
  c.c12 = (Number(c.c12) + Number(cur.c12)).toFixed(2);
  c.a1 = (Number(c.a1) + Number(cur.a1)).toFixed(2);
  c.a2 = (Number(c.a2) + Number(cur.a2)).toFixed(2);
  c.a3 = (Number(c.a3) + Number(cur.a3)).toFixed(2);
  c.a4 = (Number(c.a4) + Number(cur.a4)).toFixed(2);
  c.a5 = (Number(c.a5) + Number(cur.a5)).toFixed(2);
  c.a6 = (Number(c.a6) + Number(cur.a6)).toFixed(2);
  c.a7 = (Number(c.a7) + Number(cur.a7)).toFixed(2);
  c.a8 = (Number(c.a8) + Number(cur.a8)).toFixed(2);
  c.a9 = (Number(c.a9) + Number(cur.a9)).toFixed(2);
  c.a10 = (Number(c.a10) + Number(cur.a10)).toFixed(2);
  c.a11 = (Number(c.a11) + Number(cur.a11)).toFixed(2);
  c.a12 = (Number(c.a12) + Number(cur.a12)).toFixed(2);

  return c;
});

export const PgProductionPlanAchievementRateReport = () => {
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
          text: '생산계획달성율',
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
          label: '지시',
          data: Object.keys(summaryData)
            .filter(key => key.includes('o'))
            .map(key => summaryData[key]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '생산',
          data: Object.keys(summaryData)
            .filter(key => key.includes('c'))
            .map(key => summaryData[key]),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    },
  };

  const data = () => {
    if (Object.keys(summaryData(archiveRates)).length === 0) {
      return [];
    }

    return [...archiveRates, summaryData(archiveRates)];
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
          data={data()}
          columns={[...columns]}
          header={{
            complexColumns: [...complexColumns],
          }}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
