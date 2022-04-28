import { chain } from "lodash";
import React, { useState } from "react";
import { Container, Searchbox, useSearchbox } from "~/components/UI";
import { getData, getNow } from "~/functions";
import LineChart from "~/components/UI/graph/chart-line.ui";

enum TemperatureColors {
  "온도1" = "#00e396",
  "온도2" = "#008ffb",
  "온도3" = "#ff8b0a",
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
      // hidden: true,
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
          unit: 'day'
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

  console.log(graph);
  return (
    <>
      <Searchbox {...props} />
      <Container>
        <LineChart {...lineChartPorps} />
      </Container>
    </>
  );
};
