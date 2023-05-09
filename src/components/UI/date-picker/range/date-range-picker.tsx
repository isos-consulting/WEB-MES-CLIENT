import { Space } from 'antd';
import React, { useCallback } from 'react';
import { isEmpty } from '~/helper/common';
import BaseRangePicker, {
  BaseRangeDatePickerProps,
} from './base-date-range-picker';

export interface RangeDatePickerProps<T> extends BaseRangeDatePickerProps {
  children: T;
}

const RangePicker: <T>(
  t: React.PropsWithChildren<RangeDatePickerProps<T>>,
) => JSX.Element = ({ children, ...props }) => {
  const onChange = useCallback(
    (dates, dateStrings) => {
      let returnValue = props.returnType === 'dateString' ? dateStrings : dates;

      if (isEmpty(returnValue) && props.defaultValue)
        returnValue = props.defaultValue;

      if (props.onChange) props.onChange(returnValue);
    },
    [props.onChange],
  );

  return (
    <>
      <Space size={10} wrap>
        {children}
        <BaseRangePicker {...{ ...props, onChange }} />
      </Space>
    </>
  );
};

export default RangePicker;
