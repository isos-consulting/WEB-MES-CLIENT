import React, { useState, useEffect } from 'react';
import {
  BarGraph,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { URL_PATH_STD } from '~/enums';
import { getData, getToday } from '~/functions';

const workings_columns = [];

export const PgDownTimeReport = () => {
  const [downtime, setDownTime] = useState([]);
  const [workings, setWorkings] = useState([]);
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
      {
        type: 'multi-combo',
        id: 'workings_uuid',
        label: '작업장',
        dataSettingOptions: {
          codeName: 'workings_uuid',
          textName: 'workings_nm',
          uriPath: URL_PATH_STD.WORKINGS.GET.WORKINGSES,
          params: { store_type: 'all' },
        },
      },
    ],
    () => {
      getData(
        {
          ...innerRef.current.values,
          working_uuid: [],
        },
        'kpi/production/downtime',
      ).then(downtimes => {
        setDownTime(
          downtimes.map(downtime => ({ ...downtime, fg: '비가동 시간' })),
        );
        if (innerRef.current.values.workings_uuid == null) {
          setWorkings(workings_columns);
        } else {
          setWorkings(
            workings_columns.filter(workings =>
              innerRef.current.values.workings_uuid.includes(
                workings.workings_uuid,
              ),
            ),
          );
        }
      });
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
          text: '비가동 시간',
        },
      },
    },
    data: {
      labels: workings.map(({ workings_nm }) => workings_nm),
      datasets: [
        {
          label: '시간(분)',
          data: workings.map(({ workings_cd }) =>
            Number(downtime[0][workings_cd]),
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    },
  };

  useEffect(() => {
    getData({ store_type: 'all' }, URL_PATH_STD.WORKINGS.GET.WORKINGSES).then(
      workings => {
        workings_columns.length = 0;
        workings_columns.push(...workings);
      },
    );
  }, []);

  return (
    <>
      <Searchbox {...{ searchItems, onSearch, innerRef }} />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          data={downtime}
          columns={[{ header: '구분', name: 'fg' }].concat(
            workings.map(({ workings_cd, workings_nm }) => ({
              header: workings_nm,
              name: workings_cd,
            })),
          )}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
