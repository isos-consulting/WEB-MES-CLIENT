import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import timezone from 'dayjs/plugin/timezone';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
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

const disabledDate = current => current > dayjs(getNow(0).substring(0, 10));
export interface BaseRangeDatePickerProps {
  id: string;
  ids: string;
  names?: string;
  placeholder?: string;
  defaultValue?: string | any;
  disabled?: boolean;
  returnType?: 'date' | 'dateString';
  widthSize?: 'default' | 'auto' | 'flex' | number | string;
  onChange?: (date: Dayjs, dateString?: string) => void;
}

export const RangePickerWrapper = styled(DatePicker.RangePicker)`
  width: ${props =>
    props.widthSize === 'flex'
      ? '100%'
      : props.widthSize === 'auto'
      ? 'auto'
      : props.widthSize
      ? `${props.widthSize}px`
      : Sizes.width_datePicker_md};

  height: ${Sizes.height_datePicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datePicker_border};
  /* margin-bottom: 8px; */

  &:hover,
  &:focus {
    border-color: ${Colors.bg_datePicker_border};
  }
  ::selection {
    color: ${Colors.fg_datePicker_selection};
    background: ${Colors.bg_datePicker_selection};
  }
  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datePicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

const BaseRangePicker: React.FC<BaseRangeDatePickerProps> = props => {
  return (
    <RangePickerWrapper
      ids={props.ids}
      names={props.names}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      disabledDate={disabledDate}
      placeholder={props.placeholder}
      disabled={props.disabled}
      widthSize={props.widthSize}
    />
  );
};

export default BaseRangePicker;
