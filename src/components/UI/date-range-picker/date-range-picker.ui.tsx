import React, { useLayoutEffect } from 'react';
import { Label } from '../label';
import { DatePicker } from '../date-picker';
import { Space } from 'antd';
import Props from './date-range-picker.ui.type';
import dayjs from 'dayjs';
import { isNil } from '~/helper/common';

type RangePickerProps = {
  id: string[];
  placeholder: string[];
  defaultValue: string[];
  name: string[];
  onChange: ((e: any) => void)[];
  value: any;
  disabled: boolean[];
};

/** 날짜 기간 선택기 */
const DateRangePicker: React.FC<Props> = props => {
  const rangePickerProps: RangePickerProps = {
    id: [null, null],
    placeholder: ['시작일', '종료일'],
    defaultValue: [null, null],
    name: [null, null],
    onChange: [null, null],
    value: [null, null],
    disabled: [false, false],
  };

  if (props?.ids) rangePickerProps.id = props?.ids;
  if (props?.placeholders) rangePickerProps.placeholder = props?.placeholders;
  if (props?.defaultValues)
    rangePickerProps.defaultValue = props?.defaultValues;
  if (props?.names) rangePickerProps.name = props?.names;
  if (props?.onChanges) rangePickerProps.onChange = props?.onChanges;
  if (props?.values) rangePickerProps.value = props?.values;
  else
    rangePickerProps.value = [props?.defaultValues[0], props?.defaultValues[1]];
  if (props?.disabled)
    rangePickerProps.disabled = [props?.disabled, props?.disabled];

  const getDatePickerProps = (index: number) =>
    Object.entries(rangePickerProps).reduce((acc, [key, value]) => {
      acc[key] = value[index];
      return acc;
    }, {});

  useLayoutEffect(() => {
    const { id, defaultValue, name } = rangePickerProps;
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

  if (!isNil(props?.label)) {
    return (
      <Space size={10} wrap>
        <Label text={props.label} important={props.important} />
        <DatePicker id="start_date" {...getDatePickerProps(0)} />
        <DatePicker id="end_date" {...getDatePickerProps(1)} />
      </Space>
    );
  } else {
    return (
      <Space size={[10, 0]} wrap>
        <DatePicker id="start_date" {...getDatePickerProps(0)} />
        <DatePicker id="end_date" {...getDatePickerProps(1)} />
      </Space>
    );
  }
};

export default DateRangePicker;
