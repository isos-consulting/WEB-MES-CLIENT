import React, { useState } from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { getData, getToday } from '~/functions';

const columns = [];
const complexColumns = [];
const headers = {
  지시: 'order_month_',
  생산: 'work_month_',
  달성: 'rate_month_',
};
columns.push({ header: '공정', name: 'proc_nm' });

for (let i = 0; i < 12; i++) {
  for (const [key, value] of Object.entries(headers)) {
    columns.push({ header: key, name: `${value}${i + 1}` });
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
    const c = idx === 1 ? { ...acc } : acc;

    c.proc_nm = '합계';

    for (let i = 0; i < 12; i++) {
      c[`order_month_${i + 1}`] = (
        Number(c[`order_month_${i + 1}`]) + Number(cur[`order_month_${i + 1}`])
      ).toFixed(2);
      c[`work_month_${i + 1}`] = (
        Number(c[`work_month_${i + 1}`]) + Number(cur[`work_month_${i + 1}`])
      ).toFixed(2);
      c[`rate_month_${i + 1}`] = (
        Number(c[`rate_month_${i + 1}`]) + Number(cur[`rate_month_${i + 1}`])
      ).toFixed(2);
    }

    return c;
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

  return (
    <>
      <Searchbox {...{ onSearch, searchItems, innerRef }} />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          data={[...archiveRates, summaryData(archiveRates)]}
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
