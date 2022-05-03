import { chain } from "lodash";
import React, { useState } from "react";
import { Combobox, Container, Searchbox, useSearchbox } from "~/components/UI";
import { getData, getNow } from "~/functions";
import LineChart from "~/components/UI/graph/chart-line.ui";

enum TemperatureColors {
  "가열로 1" = "#00e396",
  "가열로 2" = "#008ffb",
  "수조온도" = "#ff8b0a",
  "온도4" = "#fe4762",
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

export const PgEqmTempInterface = () => {
  const initialData: GraphProps[] = [];

  const [graph, setGraph] = useState(initialData);

  const handleSearchButtonClick = async (
    searchPayLoads: EqmTempSearchCondition
  ) => {
    const datas = await getData(searchPayLoads, "gat/data-history/report");
    const axis = convertToAxis(datas);
    const group = groupingRaws(axis);

    setGraph(group);
  };

  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    {
      type: "datetime",
      id: "start_date",
      label: "조회일시",
      disabled: false,
      default: getNow(),
      hidden: true,
    },
    {
      type: "datetime",
      id: "end_date",
      label: "조회일시",
      disabled: false,
      default: getNow(),
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
          unit: 'minute'
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
  return (
    <>
      <Searchbox {...props} />
      <Container>
        <Combobox firstItemType={'none'} options={[{code:"year", text:"년"}, {code:'month', text:'월'}, {code:'day', text:'일'}, {code:'minute', text:'분'}]}/>
        <LineChart {...lineChartPorps} />
      </Container>
    </>
  );
};
