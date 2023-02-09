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
import { isNil } from '~/helper/common';

const workings_columns = [];

export const PgFacilityProductive = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
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
        'kpi/production/equip-productivity',
      ).then(productivity => {
        setData(productivity);
        if (isNil(innerRef.current.values.workings_uuid)) {
          setColumns(workings_columns);
        } else {
          setColumns(
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
          text: '설비 운영율/가동율',
        },
      },
    },
    data: {
      labels: columns.map(column => column.workings_nm),
      datasets: [
        {
          label: '운영율',
          data: Object.entries(data.at(0) ?? {})
            .filter(([key]) => key !== 'fg')
            .map(([_key, value]) => Number(value)),
          backgroundColor: '#3AD1FF',
        },
        {
          label: '가동율',
          data: Object.entries(data.at(1) ?? {})
            .filter(([key]) => key !== 'fg')
            .map(([_key, value]) => Number(value)),
          backgroundColor: '#86E236',
        },
      ],
    },
  };

  useEffect(() => {
    getData({ store_type: 'all' }, URL_PATH_STD.WORKINGS.GET.WORKINGSES).then(
      workings => {
        workings_columns.push(...workings);
      },
    );
  }, []);

  return (
    <>
      <Searchbox {...{ searchItems, innerRef, onSearch }} />
      <Container>
        <BarGraph {...barGraphProps} />
      </Container>
      <Container>
        <Datagrid
          disabledAutoDateColumn={true}
          {...{
            data,
            columns: [{ header: '구분', name: 'fg' }].concat(
              columns.map(column => ({
                header: column.workings_nm,
                name: column.workings_cd,
              })),
            ),
          }}
        />
      </Container>
    </>
  );
};
