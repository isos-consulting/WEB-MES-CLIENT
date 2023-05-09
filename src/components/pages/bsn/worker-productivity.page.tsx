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
import { isNil } from '~/helper/common';

export const PgWorkerProductivityReport = () => {
  const [productivities, setProductivity] = useState([]);
  const {
    onSearch,
    searchItems,
    props: { innerRef },
  } = useSearchbox(
    'SEARCH_INPUTBOX',
    [
      {
        type: 'daterange',
        id: 'reg_date',
        ids: ['start_date', 'end_date'],
        defaults: [getToday(-7), getToday()],
        label: '생산 기간',
      },
    ],
    () => {
      getData(
        { ...innerRef.current.values },
        'kpi/production/worker-productivity',
      ).then(setProductivity);
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
          text: '인당 생산성',
        },
      },
    },
    data: {
      labels: productivities.map(productivity => productivity.workings_nm),
      datasets: [
        {
          label: '합계',
          data: productivities.map(
            productivity =>
              Object.keys(productivity)
                .filter(workingKey => workingKey !== 'workings_nm')
                .reduce((acc, cur) => acc + Number(productivity[cur]), 0)
                .toFixed(2) as unknown as number,
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
  };

  const productivitiesGridData = () => {
    if (productivities.length === 0) return [];

    return [
      productivities.reduce((acc, cur) => {
        const key = cur.workings_nm;

        if (isNil(acc[`${key}sum`])) {
          acc[`${key}sum`] = 0;
        }

        const routingsPerWorking = Object.keys(cur)
          .filter(key => key !== 'workings_nm')
          .map(k => {
            const newWorkingProuctivity = {};

            newWorkingProuctivity[`${key}${k}`] = Number(cur[k]).toFixed(2);

            return newWorkingProuctivity;
          });

        routingsPerWorking.forEach(item => {
          acc[`${key}sum`] += Number(Object.values(item)[0]);
          acc = { ...acc, ...item };
        });

        acc[`${key}sum`] = acc[`${key}sum`].toFixed(2);

        return acc;
      }, {}),
    ];
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
          gridId="WORKER_PRODUCTIVITY"
          data={productivitiesGridData()}
          columns={productivities.reduce((acc, cur) => {
            const key = cur.workings_nm;

            const routingsPerWorking = Object.keys(cur)
              .filter(key => key !== 'workings_nm')
              .map(k => ({
                header: k,
                name: `${key}${k}`,
                width: ENUM_WIDTH.M,
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STOCK,
              }))
              .concat({
                header: '합계',
                name: `${key}sum`,
                width: ENUM_WIDTH.M,
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STOCK,
              });

            return [...acc, ...routingsPerWorking];
          }, [])}
          header={{
            complexColumns: productivities.map(productivity => ({
              header: productivity.workings_nm,
              name: productivity.workings_nm,
              childNames: Object.keys(productivity)
                .filter(key => key !== 'workings_nm')
                .map(key => `${productivity.workings_nm}${key}`)
                .concat(`${productivity.workings_nm}sum`),
            })),
          }}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
