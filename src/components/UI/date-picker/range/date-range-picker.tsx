import React from 'react';
import BaseRangePicker from './base-date-range-picker';
import LabelRangeDataPiacker, {
  LabelRangeDatePickerProps,
} from './label-date-range-picker';

export interface RangeDatePickerProps extends LabelRangeDatePickerProps {}

const RangePicker: React.FC<RangeDatePickerProps> = ({
  checkbox,
  label,
  ...rangepicker
}) => {
  if (label) {
    return <LabelRangeDataPiacker {...{ label, ...rangepicker }} />;
  }
};

export default RangePicker;
