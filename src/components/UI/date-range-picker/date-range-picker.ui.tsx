import React, { useLayoutEffect } from 'react';
import { Label } from '../label';
import { DatePicker } from '../date-picker';
import { Space } from 'antd';
import Props from './date-range-picker.ui.type';
import dayjs from 'dayjs';

/** 날짜 기간 선택기 */
const DateRangePicker: React.FC<Props> = props => {
  const id: string[] = props?.ids || [null, null];
  const placeholder: string[] = props?.placeholders || ['', ''];
  const defaultValue: string[] = props?.defaultValues || [null, null];
  const name: string[] = props?.names || [null, null];
  const onChange: ((e) => void)[] = props?.onChanges || [null, null];
  const value = props?.values || [defaultValue[0], defaultValue[1]];

  useLayoutEffect(() => {
    if (props.setFieldValue) {
      props.setFieldValue(
        name && name?.length > 2 ? name[0] : id[0],
        dayjs(defaultValue[0]).format('YYYY-MM-DD'),
      );
      props.setFieldValue(
        name && name?.length > 2 ? name[1] : id[1],
        dayjs(defaultValue[1]).format('YYYY-MM-DD'),
      );
    }
  }, []);

  if (props?.label != null) {
    return (
      <Space size={10} wrap>
        <Label text={props.label} important={props.important} />
        <DatePicker
          id={id[0]}
          name={name[0]}
          defaultValue={defaultValue[0]}
          value={value[0]}
          onChange={props.onChange || onChange[0]}
          placeholder={placeholder[0] || '시작 일자'}
          disabled={props.disabled}
        />
        <DatePicker
          id={id[1]}
          name={name[1]}
          defaultValue={defaultValue[1]}
          value={value[1]}
          onChange={props.onChange || onChange[1]}
          placeholder={placeholder[1] || '종료 일자'}
          disabled={props.disabled}
        />
      </Space>
    );
  } else {
    return (
      <Space size={[10, 0]} wrap>
        <DatePicker
          id={id[0]}
          name={name[0]}
          defaultValue={defaultValue[0]}
          value={value[0]}
          onChange={props.onChange || onChange[0]}
          placeholder={placeholder[0] || '시작 일자'}
          disabled={props.disabled}
        />
        <DatePicker
          id={id[1]}
          name={name[1]}
          defaultValue={defaultValue[1]}
          value={value[1]}
          onChange={props.onChange || onChange[1]}
          placeholder={placeholder[1] || '종료 일자'}
          disabled={props.disabled}
        />
      </Space>
    );
  }
};

export default DateRangePicker;
