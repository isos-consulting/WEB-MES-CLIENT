import React from 'react';
import Colors from '~styles/color.style.scss';
import Sizes from '~styles/size.style.scss';
import Fonts from '~styles/font.style.scss';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import Props from './date-picker.ui.type';

type TAntdDatePicker = {
  showTime: boolean;
  picker: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
};
type IBaseDatePicker = Props & TAntdDatePicker;

const BaseDatepicker: React.FC<IBaseDatePicker> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 Datepicker 컴포넌트에 넣어야 합니다.
  const { widthSize, picker, ...otherProps } = props;

  return <DatePicker picker={picker} {...otherProps} />;
};

/* Datepicker 스타일 */
export const ScDatePicker = styled(BaseDatepicker)`
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

  // 포커스, 마우스오버 했을 때 적용
  &:hover,
  &:focus {
    border-color: ${Colors.bg_datepicker_border};
  }
  // 선택했을 때 했을 때 적용
  ::selection {
    color: ${Colors.fg_datepicker_selection};
    background: ${Colors.bg_datepicker_selection};
  }
  // datepicker에서 선택한 날짜에 적용
  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datepicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;
