import { Space } from 'antd';
import React from 'react';
import { ILabelProps, Label } from '../../label';
import BaseRangePicker, {
  BaseRangeDatePickerProps,
} from './base-date-range-picker';

export interface LabelRangeDatePickerProps extends BaseRangeDatePickerProps {
  label: ILabelProps;
}

const LabelRangeDataPiacker: React.FC<LabelRangeDatePickerProps> = props => {
  return (
    <Space size={10} wrap>
      <Label {...props.label} />
      <BaseRangePicker {...props} />
    </Space>
  );
};

export default LabelRangeDataPiacker;
