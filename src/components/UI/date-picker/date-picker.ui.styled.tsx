import React from 'react';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import Props from './date-picker.ui.type';
import { isNil } from '~/helper/common';

type TAntdDatePicker = {
  showTime: boolean;
  picker: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
};
type IBaseDatePicker = Props & TAntdDatePicker;

const BaseDatePicker: React.FC<IBaseDatePicker> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 DatePicker 컴포넌트에 넣어야 합니다.
  const { widthSize, picker, ...otherProps } = props;

  return <DatePicker picker={picker} {...otherProps} />;
};

const getDatePickerWidthSize = widthSize => {
  const width = {
    auto: 'auto',
    flex: '100%',
  };

  if (isNil(widthSize)) return Sizes.width_datePicker_md;

  if (width.hasOwnProperty(widthSize) === true) {
    return width[widthSize];
  }

  return `${widthSize}px`;
};

/* DatePicker 스타일 */
export const ScDatePicker = styled(BaseDatePicker)`
  width: ${props => getDatePickerWidthSize(props.widthSize)};
  height: ${Sizes.height_datePicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datePicker_border};

  // 포커스, 마우스오버 했을 때 적용
  &:hover,
  &:focus {
    border-color: ${Colors.bg_datePicker_border};
  }
  // 선택했을 때 했을 때 적용
  ::selection {
    color: ${Colors.fg_datePicker_selection};
    background: ${Colors.bg_datePicker_selection};
  }
  // datePicker에서 선택한 날짜에 적용
  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datePicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;
