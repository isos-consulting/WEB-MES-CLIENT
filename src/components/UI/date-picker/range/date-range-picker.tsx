import { Space } from 'antd';
import React from 'react';
import BaseRangePicker, {
  BaseRangeDatePickerProps,
} from './base-date-range-picker';

export interface RangeDatePickerProps<T> extends BaseRangeDatePickerProps {
  children: T;
}

const RangePicker: <T>(
  t: React.PropsWithChildren<RangeDatePickerProps<T>>,
) => React.ReactElementRangeDatePickerProps<T> = ({
  checkbox,
  label,
  ...pickerProps
}) => {
  return (
    <>
      <Space size={10} wrap>
        {pickerProps.children}
        <BaseRangePicker {...pickerProps} />
      </Space>
    </>
  );
};

export default RangePicker;
