import React, { useState } from "react";
import { Container, LineGraph, Searchbox, useSearchbox } from "~/components/UI";
import { getNow } from "~/functions";

enum SensorColorPalette {
    TEMP1 = '#3c608b',
    TEMP2 = '#e0483e'
}

const dummyData = [
    {
      id: "설비1",
      color: SensorColorPalette.TEMP1,
      data: [
        {
          x: "2022-04-25 00:00:00",
          y: 159,
        },
        {
          x: "2022-04-25 01:00:00",
          y: 222,
        },
        {
          x: "2022-04-25 02:00:00",
          y: 165,
        },
        {
          x: "2022-04-25 03:00:00",
          y: 210,
        },
        {
          x: "2022-04-25 04:00:00",
          y: 45,
        },
        {
          x: "2022-04-25 05:00:00",
          y: 176,
        },
        {
          x: "2022-04-25 06:00:00",
          y: 89,
        },
        {
          x: "2022-04-25 07:00:00",
          y: 70,
        },
        {
          x: "2022-04-25 08:00:00",
          y: 256,
        },
        {
          x: "2022-04-25 09:00:00",
          y: 252,
        },
        {
          x: "2022-04-25 10:00:00",
          y: 83,
        },
        {
          x: "2022-04-25 11:00:00",
          y: 14,
        },
      ],
    },
    {
      id: "설비2",
      color: SensorColorPalette.TEMP2,
      data: [
        {
          x: "2022-04-25 00:00:00",
          y: 100,
        },
        {
          x: "2022-04-25 01:00:00",
          y: 252,
        },
        {
          x: "2022-04-25 02:00:00",
          y: 25,
        },
        {
          x: "2022-04-25 03:00:00",
          y: 20,
        },
        {
          x: "2022-04-25 04:00:00",
          y: 54,
        },
        {
          x: "2022-04-25 05:00:00",
          y: 167,
        },
        {
          x: "2022-04-25 06:00:00",
          y: 70,
        },
        {
          x: "2022-04-25 07:00:00",
          y: 171,
        },
        {
          x: "2022-04-25 08:00:00",
          y: 265,
        },
        {
          x: "2022-04-25 09:00:00",
          y: 225,
        },
        {
          x: "2022-04-25 10:00:00",
          y: 200,
        },
        {
          x: "2022-04-25 11:00:00",
          y: 83,
        },
      ],
    },
  ];
  
  const searchData = [
    {
      id: "설비1",
      color: SensorColorPalette.TEMP1,
      data: [
        {
          x: "2022-04-25 00:00:00",
          y: 19,
        },
        {
          x: "2022-04-25 01:00:00",
          y: 222,
        },
        {
          x: "2022-04-25 02:00:00",
          y: 156,
        },
        {
          x: "2022-04-25 03:00:00",
          y: 120,
        },
        {
          x: "2022-04-25 04:00:00",
          y: 54,
        },
        {
          x: "2022-04-25 05:00:00",
          y: 167,
        },
        {
          x: "2022-04-25 06:00:00",
          y: 98,
        },
        {
          x: "2022-04-25 07:00:00",
          y: 7,
        },
        {
          x: "2022-04-25 08:00:00",
          y: 256,
        },
        {
          x: "2022-04-25 09:00:00",
          y: 252,
        },
        {
          x: "2022-04-25 10:00:00",
          y: 83,
        },
        {
          x: "2022-04-25 11:00:00",
          y: 14,
        },
      ],
    },
    {
      id: "설비2",
      color: SensorColorPalette.TEMP2,
      data: [
        {
          x: "2022-04-25 00:00:00",
          y: 100,
        },
        {
          x: "2022-04-25 01:00:00",
          y: 22,
        },
        {
          x: "2022-04-25 02:00:00",
          y: 256,
        },
        {
          x: "2022-04-25 03:00:00",
          y: 102,
        },
        {
          x: "2022-04-25 04:00:00",
          y: 45,
        },
        {
          x: "2022-04-25 05:00:00",
          y: 176,
        },
        {
          x: "2022-04-25 06:00:00",
          y: 89,
        },
        {
          x: "2022-04-25 07:00:00",
          y: 70,
        },
        {
          x: "2022-04-25 08:00:00",
          y: 256,
        },
        {
          x: "2022-04-25 09:00:00",
          y: 252,
        },
        {
          x: "2022-04-25 10:00:00",
          y: 83,
        },
        {
          x: "2022-04-25 11:00:00",
          y: 14,
        },
      ],
    },
  ];

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
  reg_date: string;
  data_map_id: number;
  data_map_nm: string;
  value: number;
}

const tempAPI = async() => {
  const apiResponse: InterfaceApiResponse = {
    "success": true,
    "state_cd": "gatDataHistory-S-0000",
    "state": {
        "state_tag": "gatDataHistory",
        "type": "SUCCESS",
        "state_no": "0000"
    },
    "message": "데이터 조회 성공",
    "datas": {
        "value": {
            "count": 0
        },
        "raws":
        [
          {
            reg_date: "2022-04-25 10:00:00",
            data_map_id: 1,
            data_map_nm: '온도1',
            value: 83
          },
          {
            reg_date: "2022-04-25 11:00:00",
            data_map_id: 1,
            data_map_nm: '온도2',
            value: 14
          },
          {
            reg_date: "2022-04-25 12:00:00",
            data_map_id: 1,
            data_map_nm: '온도1',
            value: 26
          },
        ]
    }
  }
  return apiResponse;
};

const convertToAxis = (datas:RawDatas) => {
  return datas.raws.map(raw => {
    return {
      x: raw.reg_date,
      y: raw.value,
      id: raw.data_map_nm,
    }
  });
}

interface EqmTempSearchCondition {
    reg_date: string;
    end_date: string;
    temperature: string;
}

export const PgEqmTempInterface = () => {
  const [flag, setFlag] = useState(false);

  const handleSearchButtonClick = async (searchPayLoads: EqmTempSearchCondition)=>{
    // console.log(getData(searchPayLoads, 'url'));
    const { datas } = await tempAPI();
    const axis = convertToAxis(datas);

    console.log(datas);
    console.log(axis);
    setFlag(!flag)
  };

  const { props } = useSearchbox("SEARCH_INPUTBOX", [
    {type: "datetime", id: "reg_date", label: "조회일시", disabled: false, default: getNow()},
    {type: "datetime", id: "end_date", disabled: false, default: getNow() },
    {type: "text", id: "temperature", label: "온도", disabled: false, default: "",}
  ]);

  props.onSearch = handleSearchButtonClick;

  return (
    <>
      <Searchbox {...props} />
      <Container>
        <div style={{ width: "100%", height: "80vh"}}>
            <LineGraph data={flag? dummyData: searchData} />
        </div>
      </Container>
    </>
  );
};
