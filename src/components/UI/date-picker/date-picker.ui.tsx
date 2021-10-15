import React, { useMemo } from "react";
import dayjs from 'dayjs';
import Props from './date-picker.ui.type';
import { ScDatePicker } from './date-picker.ui.styled';
import { Label } from "../label";
import { Space } from "antd";

import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';


// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);


/** 날짜 선택기 */
const BaseDatePicker: React.FC<Props> = (props) => {

  const values = useMemo(() => {
    if (props?.value == null) {
      return props?.defaultValue ? {value: props.defaultValue} : {};

    } else if (dayjs(props?.value).isValid()) {
      return {value: dayjs(props.value)};

    } else {
      return props?.defaultValue ? {value: props.defaultValue} : {};
    }
  }, [props?.value, props?.defaultValue]);
  

  if (props?.label != null) {
    return (
      <Space size={10} wrap >
        <Label text={props.label} important={props.important}/>
        <ScDatePicker
          id={props.id}
          name={props.name}
          picker={props.picker || 'date'}
          format={props.format || 'YYYY-MM-DD'}
          // defaultValue={props.defaultValue}
          // value={value}
          {...values}
          onChange={props.onChange}
          placeholder={props.placeholder}
          disabled={props.disabled}
          widthSize={props.widthSize}
        />
      </Space>
    );
  } else {
    return (
      <ScDatePicker
        id={props.id}
        name={props.name}
        picker={props.picker || 'date'}
        format={props.format || 'YYYY-MM-DD'}
        // defaultValue={props.defaultValue}
        // value={value}
        {...values}
        onChange={props.onChange}
        placeholder={props.placeholder} 
        disabled={props.disabled}
        widthSize={props.widthSize}/>
    );
  }
};


const DatePicker = React.memo(BaseDatePicker);

export default DatePicker;