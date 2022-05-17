import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import Props from './date-picker.ui.type';
import { ScDatePicker } from './date-picker.ui.styled';
import { Label } from '../label';
import { Space } from 'antd';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import timezone from 'dayjs/plugin/timezone';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(timezone);

/** 날짜 선택기 */
const BaseDatePicker: React.FC<Props> = props => {
  const picker = useMemo(() => {
    return props.picker === 'datetime' ? null : props.picker ?? null;
  }, [props.picker]);

  const values: object = useMemo(() => {
    if (!props?.value) {
      return props?.defaultValue ? { value: props.defaultValue } : {};
    } else if (dayjs(props?.value).isValid()) {
      return { value: dayjs(props.value) };
    } else {
      return props?.defaultValue ? { value: props.defaultValue } : {};
    }
  }, [props?.value, props?.defaultValue]);

  const onChange = useCallback(
    (date, dateString) => {
      let returnValue = props.returnType === 'dateString' ? dateString : date;

      if ((returnValue === '' || returnValue == null) && props.defaultValue)
        returnValue = props.defaultValue;

      if (props.onChange) props.onChange(returnValue);
    },
    [props.onChange],
  );

  const showTime: boolean = useMemo(() => {
    return props.picker === 'datetime';
  }, [props.picker]);

  const format: string = useMemo(() => {
    if (props.format) return props.format;

    switch (props.picker) {
      case 'date':
        return 'YYYY-MM-DD';
      case 'datetime':
        return 'YYYY-MM-DD HH:mm:ss';
      case 'month':
        return 'MM';
      case 'week':
        return 'dddd';

      default:
        return null;
    }
  }, [props.format, props.picker]);

  if (props?.label != null) {
    return (
      <Space size={10} wrap>
        <Label text={props.label} important={props.important} />
        <ScDatePicker
          id={props.id}
          name={props.name}
          picker={picker}
          format={format}
          showTime={showTime}
          // defaultValue={props.defaultValue}
          // value={...value}
          {...values}
          onChange={onChange}
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
        picker={picker}
        format={format}
        showTime={showTime}
        // defaultValue={props.defaultValue}
        // value={values}
        {...values}
        onChange={onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        widthSize={props.widthSize}
      />
    );
  }
};

const DatePicker = React.memo(BaseDatePicker);

export default DatePicker;
