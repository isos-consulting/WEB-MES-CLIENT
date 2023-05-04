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
  {
    header: `생산`,
    name: 'work_qty_month_sum',
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STOCK,
  },
  {
    header: `불량`,
    name: 'reject_qty_month_sum',
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STOCK,
  },
  {
    header: `불량율`,
    name: 'rate_month_sum',
    width: ENUM_WIDTH.S,
    format: 'percent',
  },
];

const complexColumns = [
  {
    header: '합계',
    name: 'sum',
    childNames: [
      'work_qty_month_sum',
      'reject_qty_month_sum',
      'rate_month_sum',
    ],
  },
];

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
    decimal: ENUM_DECIMAL.DEC_STOCK,
  });
  columns.push({
    header: `불량`,
    name: reject,
    width: ENUM_WIDTH.S,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STOCK,
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
          data: Object.values<number>(
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
      <Searchbox
        id="SEARCH_INPUTBOX"
        {...{ onSearch, searchItems, innerRef }}
      />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          gridId="DEFECT_RATE_REPORT"
          data={defects.map(defect => {
            let workQtyMonthSum = 0;
            let rejectQtyMonthSum = 0;
            let rateMonthSum = 0;

            for (let i = 0; i < 12; i++) {
              const month = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
              const work = `work_qty_month`.concat(month);
              const reject = `reject_qty_month`.concat(month);
              const rate = `rate_month`.concat(month);

              workQtyMonthSum += Number(defect[work]);
              rejectQtyMonthSum += Number(defect[reject]);
              rateMonthSum += Number(defect[rate]);
            }

            return {
              ...defect,
              work_qty_month_sum: workQtyMonthSum.toString(),
              reject_qty_month_sum: rejectQtyMonthSum.toString(),
              rate_month_sum: rateMonthSum.toString(),
            };
          })}
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
