import React from 'react';
import BaseRangePicker, {
  BaseRangeDatePickerProps,
} from './base-date-range-picker';
import CheckBoxRangeDataPiacker from './checkbox-date-range-picker';
import LabelRangeDataPiacker from './label-date-range-picker';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps {
  ILabelProps;
  ICheckboxProps;
}

const RangePicker: React.FC<RangeDatePickerProps> = ({
  checkbox,
  label,
  ...pickerProps
}) => {
  return checkbox ? (
    <CheckBoxRangeDataPiacker {...{ checkbox, ...pickerProps }} />
  ) : label ? (
    <LabelRangeDataPiacker {...{ label, ...pickerProps }} />
  ) : (
    <BaseRangePicker {...pickerProps} />
  );
};

export default RangePicker;
