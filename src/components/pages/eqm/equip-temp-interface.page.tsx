import { chain } from "lodash";
import React, { useState } from "react";
import { Container, LineGraph, Searchbox, useSearchbox } from "~/components/UI";
import { getData, getNow } from "~/functions";

interface EquipApiDataType {
  created_at: string;
  data_map_id: number;
  data_map_nm: string;
  value: number;
}

interface AxisDataType {
  id: string;
  x: string;
  y: number;
}

interface GraphProps {
  id: string;
  data: AxisDataType[]
}

const convertToAxis = (raws:EquipApiDataType[]) => {
  return raws.map(raw => {
    return {
      x: raw.created_at,
      y: raw.value,
      id: raw.data_map_nm,
    }
  });
}

const groupingRaws = (raws: AxisDataType[], key: string) => {
  return chain(raws).groupBy("id")
                    .map((data, key) => ({id: key, data}))
                    .value();
}

interface EqmTempSearchCondition {
    created_at: string;
    end_date: string;
    temperature: string;
}

export const PgEqmTempInterface = () => {
  const initialData:GraphProps[] = [];

  const [graph, setGraph] = useState(initialData);

  const handleSearchButtonClick = async (searchPayLoads: EqmTempSearchCondition)=>{
    const datas = await getData(searchPayLoads, 'gat/data-history/report');
    const axis = convertToAxis(datas);
    const group = groupingRaws(axis, "id");

    setGraph(group);
  };

  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    {type: "datetime", id: "start_date", label: "조회일시", disabled: false, default: getNow(), hidden:true},
    {type: "datetime", id: "end_date", label: "조회일시", disabled: false, default: getNow() },
    {type: "text", id: "temperature", label: "온도", disabled: false, default: "",}
  ]);

  props.onSearch = handleSearchButtonClick;

  return (
    <>
      <Searchbox {...props} />
      <Container>
        <div style={{ width: "100%", height: "80vh"}}>
            <LineGraph data={graph} />
        </div>
      </Container>
    </>
  );
};
