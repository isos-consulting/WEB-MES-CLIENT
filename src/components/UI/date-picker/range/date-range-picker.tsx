import React, { useCallback, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import timezone from 'dayjs/plugin/timezone';
import Colors from '~styles/color.style.scss';
import Sizes from '~styles/size.style.scss';
import Fonts from '~styles/font.style.scss';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import { getNow } from '~/functions';

dayjs.locale('ko-kr');

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(timezone);

export interface RangeDatePickerProps {
  ids: string;
  names?: string;
  placeholder?: string;
  defaultValue?: string | any;
  disabled?: boolean;
  returnType?: 'date' | 'dateString';
  widthSize?: 'default' | 'auto' | 'flex' | number | string;
  onChange?: (date: Dayjs, dateString?: string) => void;
}

export const ReangePickerWrapper = styled(DatePicker.RangePicker)`
  width: ${props =>
    props.widthSize === 'flex'
      ? '100%'
      : props.widthSize === 'auto'
      ? 'auto'
      : props.widthSize
      ? `${props.widthSize}px`
      : Sizes.width_datepicker_md};

  height: ${Sizes.height_datepicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datepicker_border};
  /* margin-bottom: 8px; */

  &:hover,
  &:focus {
    border-color: ${Colors.bg_datepicker_border};
  }
  ::selection {
    color: ${Colors.fg_datepicker_selection};
    background: ${Colors.bg_datepicker_selection};
  }
  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datepicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

const RangePicker: React.FC<RangeDatePickerProps> = props => {
  const onChange = useCallback(
    (dates, dateStrings) => {
      let returnValue = props.returnType === 'dateString' ? dateStrings : dates;

      if ((returnValue === '' || returnValue == null) && props.defaultValue)
        returnValue = props.defaultValue;

      if (props.onChange) props.onChange(returnValue);
    },
    [props.onChange],
  );

  return (
    <ReangePickerWrapper
      ids={props.ids}
      names={props.names}
      defaultValue={props.defalutValue}
      onChange={onChange}
      disabledDate={current => current > dayjs(getNow(1).substring(0, 10))}
      placeholder={props.placeholder}
      disabled={props.disabled}
      widthSize={props.widthSize}
    />
  );
};

export default RangePicker;
