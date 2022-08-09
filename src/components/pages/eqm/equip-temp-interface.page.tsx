import React, { useState, useEffect } from 'react';
import { Combobox, Container, Searchbox, useSearchbox } from '~/components/UI';
import { getData, getToday } from '~/functions';
import LineChart from '~/components/UI/graph/chart-line.ui';
import { message } from 'antd';
import dayjs from 'dayjs';

enum TimeAxisScale {
  'year' = '연',
  'month' = '월',
  'day' = '일',
  'hour' = '시',
  'minute' = '분',
}

interface DueDate {
  start_date: string;
  end_date: string;
}

interface EqmTempSearchCondition {
  start_date: string;
  end_date: string;
  data_item_uuid: string;
  equip_uuid: string;
}

const getTimeAxisComboBoxDatas = () => {
  return Object.keys(TimeAxisScale).map(x => ({
    code: x,
    text: TimeAxisScale[x],
  }));
};

export const PgEqmTempInterface = () => {
  const timeAixsComboLists = getTimeAxisComboBoxDatas();

  const [graph, setGraph] = useState([]);
  const [timeAxis, setTimeAxis] = useState('minute');

  const [equipmentItem, setEquipmentItem] = useState([]);

  const handleChangeComboData = timeUnit => setTimeAxis(timeUnit);

  const getDayjs = ({ start_date, end_date }: DueDate) => ({
    startDate: dayjs(start_date),
    endDate: dayjs(end_date),
  });

  const diffDay = ({ startDate, endDate }) => endDate.diff(startDate, 'd');

  const validateSearchDate = searchConditions => {
    return diffDay(getDayjs(searchConditions)) < 8;
  };

  const handleSearchButtonClick = async (
    searchPayLoads: EqmTempSearchCondition,
  ) => {
    //입력된 두 개의 날짜 전후 비교
    if (searchPayLoads.start_date > searchPayLoads.end_date) {
      message.error('조회 기간의 순서가 올바른지 확인하세요.');
      return;
    }

    const dataIsValid = validateSearchDate(searchPayLoads);

    if (dataIsValid) {
      const datas = await getData(searchPayLoads, 'gat/data-history/graph');

      setGraph(datas);
    } else {
      message.warn('8일 이상의 데이터는 조회 할 수 없습니다');
    }
  };

  const { props, setSearchItems } = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'date',
      id: 'start_date',
      label: '조회일자',
      disabled: false,
      default: getToday(),
    },
    {
      type: 'date',
      id: 'end_date',
      disabled: false,
      default: getToday(),
    },
    {
      type: 'combo',
      id: 'data_item_uuid',
      label: '인터페이스 항목',
      firstItemType: 'none',
      dataSettingOptions: {
        uriPath: '/gat/data-items',
        params: {
          monitoring_fg: true,
        },
        codeName: 'data_item_uuid',
        textName: 'data_item_nm',
      },
      onAfterChange: async dataItemUuid => {
        const res = await getData(
          { data_item_uuid: dataItemUuid, use_fg: 'true' },
          'gat/data-items/equip',
        );

        setEquipmentItem(
          res.map(row => ({ code: row.equip_uuid, text: row.equip_nm })),
        );
      },
    },
    {
      type: 'combo',
      id: 'equip_uuid',
      label: '설비',
      default: 'all',
      firstItemType: 'all',
      widthSize: '160px',
    },
  ]);

  useEffect(() => {
    if (setSearchItems) {
      setSearchItems(crr => {
        return crr?.map(el => {
          if (el?.id === 'equip_uuid') {
            return {
              ...el,
              options: equipmentItem,
              default: 'all',
            };
          } else return el;
        });
      });
    }
  }, [equipmentItem]);

  props.onSearch = handleSearchButtonClick;

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeAxis,
        },
      },
    },
  };

  const data = {
    datasets: graph,
  };

  const lineChartPorps = {
    options,
    data,
  };

  const comboBoxProps = {
    firstItemType: 'none',
    options: timeAixsComboLists,
    value: timeAxis,
    onChange: handleChangeComboData,
    label: '시간 축 단위 선택',
  };

  return (
    <>
      <Searchbox {...props} />
      <Container>
        <Combobox {...comboBoxProps} />
        <LineChart {...lineChartPorps} />
      </Container>
    </>
  );
};
