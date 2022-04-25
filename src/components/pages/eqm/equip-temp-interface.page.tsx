import dayjs from "dayjs";
import { chain } from "lodash";
import React, { useState } from "react";
import { Container, LineGraph, Searchbox, useSearchbox } from "~/components/UI";
import { getData, getNow } from "~/functions";

enum SensorColorPalette {
    TEMP1 = 'hsl(336, 70%, 50%)',
    TEMP2 = 'hsl(26, 70%, 50%)'
}
  
interface InterfaceApiResponse {
  success: boolean;
  state_cd: string;
  state: object;
  message: string;
  datas: RawDatas;
}

interface RawDatas {
  raws: EquipApiDataType[],
  value: object
}

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
  color: string;
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
                    .map((data, key) => ({id: key, color: SensorColorPalette[key], data}))
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
    const value = dayjs(searchPayLoads.end_date);
    const endDate = value.format();
    const startDate = value.subtract(1, 'hour').format();

    const datas = await getData({
      start_date: startDate,
      end_date: endDate,
    }, 'gat/data-history/report');
    const axis = convertToAxis(datas);
    const group = groupingRaws(axis, "id");

    setGraph(group);
    console.log(group);
  };

  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    // {type: "datetime", id: "start_date", label: "조회일시", disabled: false, default: getNow()},
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
