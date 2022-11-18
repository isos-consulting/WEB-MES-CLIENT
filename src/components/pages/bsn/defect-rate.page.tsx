import React, { useState } from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  IGridColumn,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { getData, getToday } from '~/functions';

const columns: IGridColumn[] = [
  { header: '공정', name: 'proc_nm', width: ENUM_WIDTH.M },
];

const complexColumns = [];

for (let i = 0; i < 12; i++) {
  const month = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
  const work = `work_qty_month`.concat(month);
  const reject = `reject_qty_month`.concat(month);
  const rate = `rate_month`.concat(month);

  columns.push({
    header: `생산`,
    name: work,
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  });
  columns.push({
    header: `불량`,
    name: reject,
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  });
  columns.push({
    header: `불량율`,
    name: rate,
    width: ENUM_WIDTH.S,
    format: 'percent',
  });

  complexColumns.push({
    header: `${month}월`,
    name: `month_${month}`,
    childNames: [work, reject, rate],
  });
}

export const PgDefectRateReport = () => {
  const [defects, setDefects] = useState([]);
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
        label: '시작일',
      },
    ],
    () => {
      getData(
        innerRef.current.values,
        '/kpi/production/work-rejects-rate',
      ).then(setDefects);
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
          text: '불량율',
        },
      },
    },
    data: {
      labels: complexColumns.map(({ header }) => header),
      datasets: [
        {
          label: '불량율',
          data: Object.values(
            defects.reduce(
              (acc, cur, idx) => {
                Object.entries(acc).forEach(([key, value]) => {
                  const month = Number(key) > 9 ? `${key}` : `0${key}`;

                  acc[key] =
                    Number(value) + Number(cur[`reject_qty_month${month}`]);

                  if (idx === defects.length - 1) {
                    acc[key] = Number(acc[key]) / defects.length;
                    acc[key] = Number(acc[key].toFixed(2));
                  }
                });

                return acc;
              },
              Array(12)
                .fill(0)
                .reduce((acc, cur, idx) => {
                  acc[idx + 1] = cur;
                  return acc;
                }, {}),
            ),
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
          data={defects}
          columns={[...columns]}
          header={{
            complexColumns,
          }}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
