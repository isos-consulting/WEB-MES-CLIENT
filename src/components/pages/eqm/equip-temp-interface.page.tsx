import { chain } from "lodash";
import React, { useState } from "react";
import { Combobox, Container, Searchbox, useSearchbox } from "~/components/UI";
import { getData, getToday } from "~/functions";
import LineChart from "~/components/UI/graph/chart-line.ui";
import { message } from "antd";
import dayjs from "dayjs";

enum TemperatureColors {
  "가열로 1" = "#00e396",
  "가열로 2" = "#008ffb",
  "수조온도" = "#ff8b0a",
  "온도4" = "#fe4762",
}

enum TimeAxisScale {
  "year" = "연",
  "month" = "월",
  "day" = "일",
  "hour" = "시",
  "minute"= "분",
}

interface EquipApiDataType {
  created_at: string;
  data_map_id: number;
  data_map_nm: string;
  value: number;
}

interface AxisDataType {
  label: string;
  x: string;
  y: number;
}

interface GraphProps {
  label: string;
  data: AxisDataType[];
  borderColor: string;
}

interface DueDate {
  start_date: string;
  end_date: string;
}

const convertToAxis = (raws: EquipApiDataType[]) => {
  return raws.map((raw) => {
    return {
      x: raw.created_at,
      y: raw.value,
      label: raw.data_map_nm,
    };
  });
};

const getAxis = ({ label, ...axis }) => (axis);

const getDataSets = (data, key) => ({
  label: key,
  data: data.map(getAxis),
  backgroundColor: TemperatureColors[key],
});

const groupingRaws = (raws: AxisDataType[]) => {
  return chain(raws).groupBy("label").map(getDataSets).value();
};

interface EqmTempSearchCondition {
  created_at: string;
  end_date: string;
  temperature: string;
}

const getTimeAxisComboBoxDatas = () => {
  return Object.keys(TimeAxisScale).map(x => ({code: x, text: TimeAxisScale[x]}));
}


export const PgEqmTempInterface = () => {
  const initialData: GraphProps[] = [];
  const timeAixsComboLists = getTimeAxisComboBoxDatas();
  
  const [graph, setGraph] = useState(initialData);
  const [timeAxis, setTimeAxis] = useState('minute');
  
  const handleChangeComboData = timeUnit => setTimeAxis(timeUnit);

  const getDayjs = ({start_date, end_date}:DueDate) => ({startDate: dayjs(start_date), endDate: dayjs(end_date)});


  const validateSearchDate = _ => {

    return false;
  };

  const handleSearchButtonClick = async (
    searchPayLoads: EqmTempSearchCondition
    ) => {
      const dataIsValid = validateSearchDate(searchPayLoads);

      if(dataIsValid){
        const datas = await getData(searchPayLoads, "gat/data-history/report");
        const axis = convertToAxis(datas);
        const group = groupingRaws(axis);

        setGraph(group);
      } else {
        message.warn('8일 이상의 데이터는 조회 할 수 없습니다');
      }

  };

  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    {
      type: "date",
      id: "start_date",
      label: "조회일자",
      disabled: false,
      default: getToday(),
    },
    {
      type: "date",
      id: "end_date",
      disabled: false,
      default: getToday(),
    },
    {
      type: "text",
      id: "temperature",
      label: "온도",
      disabled: false,
      default: "",
    },
  ]);

  props.onSearch = handleSearchButtonClick;

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeAxis
        }
      }
    }
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
    label: '시간 축 단위 선택'
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
