import React from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { URL_PATH_STD } from '~/enums';
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
        ids: ['start_reg_date', 'end_reg_date'],
        defaults: [getToday(-7), getToday()],
        label: '생산 기간',
      },
      {
        type: 'multi-combo',
        id: 'facility_type',
        label: '작업장',
        dataSettingOptions: {
          codeName: 'workings_cd',
          textName: 'workings_nm',
          uriPath: URL_PATH_STD.WORKINGS.GET.WORKINGSES,
          params: { store_type: 'all' },
        },
      },
    ],
    () => {
      console.log({ ...innerRef.current.values });
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
          backgroundColor: '#3AD1FF',
        },
        {
          label: '가동율',
          data: Object.keys(data[1])
            .filter(key => key !== 'fg')
            .map(key => data[1][key]),
          backgroundColor: '#86E236',
        },
      ],
    },
  };

  return (
    <>
      <Searchbox {...{ searchItems, innerRef, onSearch }} />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid disabledAutoDateColumn={true} {...{ data, columns }} />
      </Container>
    </>
  );
};
