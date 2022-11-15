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
          data: productivities.map(productivity =>
            Object.keys(productivity)
              .filter(workingKey => workingKey !== 'workings_nm')
              .reduce((acc, cur) => acc + Number(productivity[cur]), 0)
              .toFixed(2),
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
  };

  const data = () => {
    if (productivities.length === 0) return [];

    return [
      productivities.reduce((c, cur) => {
        const key = cur.workings_nm;

        if (c[`${key}sum`] == null) {
          c[`${key}sum`] = 0;
        }

        const a = Object.keys(cur)
          .filter(key => key !== 'workings_nm')
          .map(k => {
            const newWorkingProuctivity = {};

            if (k !== 'workings_nm') {
              newWorkingProuctivity[`${key}${k}`] = Number(cur[k]).toFixed(2);
            }

            return newWorkingProuctivity;
          });

        a.forEach(item => {
          c[`${key}sum`] += Number(Object.values(item)[0]);
          c = { ...c, ...item };
        });

        c[`${key}sum`] = c[`${key}sum`].toFixed(2);

        return c;
      }, {}),
    ];
  };

  return (
    <>
      <Searchbox {...{ onSearch, searchItems, innerRef }} />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          data={data()}
          columns={productivities.reduce((c, cur) => {
            const key = cur.workings_nm;

            const a = Object.keys(cur)
              .filter(key => key !== 'workings_nm')
              .map(k => {
                return {
                  header: k,
                  name: `${key}${k}`,
                  width: ENUM_WIDTH.M,
                  format: 'number',
                  decimal: ENUM_DECIMAL.DEC_STCOK,
                };
              })
              .concat({
                header: '합계',
                name: `${key}sum`,
                width: ENUM_WIDTH.M,
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              });

            return [...c, ...a];
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
