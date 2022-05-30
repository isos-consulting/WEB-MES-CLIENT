import { Space } from 'antd';
import React from 'react';
import { Checkbox, ICheckboxProps } from '../../checkbox';
import BaseRangePicker from './base-date-range-picker';
import { RangeDatePickerProps } from './date-range-picker';

export interface CheckBoxRangeDatePickerProps extends RangeDatePickerProps {
  checkbox: ICheckboxProps;
}

const CheckBoxRangeDataPiacker: React.FC<
  CheckBoxRangeDatePickerProps
> = props => {
  return (
    <Space size={10} wrap>
      <Checkbox {...props.checkbox} />
      <BaseRangePicker {...props} />
    </Space>
  );
};

export default CheckBoxRangeDataPiacker;
