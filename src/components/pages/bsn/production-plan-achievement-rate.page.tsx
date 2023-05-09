import React, { useState } from 'react';
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
  ...Object.entries(summaryHeaders).map(([header, name]) =>
    header === '달성'
      ? {
          header,
          name,
          width: ENUM_WIDTH.S,
          format: 'percent',
        }
      : {
          header,
          name,
          width: ENUM_WIDTH.S,
          format: 'number',
          decimal: ENUM_DECIMAL.DEC_STOCK,
        },
  ),
);

for (let i = 0; i < 12; i++) {
  for (const [header, name] of Object.entries(headers)) {
    if (header === '달성') {
      columns.push({
        header: `${i + 1}월`,
        name: `${name}${i + 1}`,
        width: ENUM_WIDTH.S,
        format: 'percent',
      });
    } else {
      columns.push({
        header,
        name: `${name}${i + 1}`,
        width: ENUM_WIDTH.S,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STOCK,
      });
    }
  }

  complexColumns.push({
    header: `${i + 1}월`,
    name: `m${i + 1}`,
    childNames: Object.values(headers).map(value => `${value}${i + 1}`),
  });
}

const summaryData = data => {
  if (data.length === 0) return {};

  return data.reduce((acc, cur, idx) => {
    const newSummaryData = idx === 1 ? { ...acc } : acc;

    newSummaryData.proc_nm = '합계';

    for (let i = 0; i < 12; i++) {
      newSummaryData[`order_month_${i + 1}`] = (
        Number(newSummaryData[`order_month_${i + 1}`]) +
        Number(cur[`order_month_${i + 1}`])
      ).toFixed(2);
      newSummaryData[`work_month_${i + 1}`] = (
        Number(newSummaryData[`work_month_${i + 1}`]) +
        Number(cur[`work_month_${i + 1}`])
      ).toFixed(2);
      newSummaryData[`rate_month_${i + 1}`] = (
        Number(newSummaryData[`rate_month_${i + 1}`]) +
        Number(cur[`rate_month_${i + 1}`])
      ).toFixed(2);
    }

    return newSummaryData;
  });
};

export const PgProductionPlanAchievementRateReport = () => {
  const [archiveRates, setArchiveRates] = useState([]);
  const {
    onSearch,
    searchItems,
    props: { innerRef },
  } = useSearchbox(
    'SEARCH_INPUTBOX',
    [
      {
        type: 'date',
        id: 'reg_date',
        default: getToday(),
        label: '생산계획일',
      },
    ],
    () => {
      getData(
        { ...innerRef.current.values },
        'kpi/production/work-plan-achievement-rate',
      ).then(setArchiveRates);
    },
  );

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
      labels: Array(12)
        .fill(1)
        .map((value, idx) => `${value * idx + 1}월`),
      datasets: [
        {
          label: '지시',
          data: Object.keys(summaryData(archiveRates))
            .filter(key => key.includes('order_month'))
            .map(key => summaryData(archiveRates)[key]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: '생산',
          data: Object.keys(summaryData(archiveRates))
            .filter(key => key.includes('work_month_'))
            .map(key => summaryData(archiveRates)[key]),
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
        id="SEARCH_INPUTBOX"
        {...{ onSearch, searchItems, innerRef }}
      />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          gridId="DATAGRID_1"
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
