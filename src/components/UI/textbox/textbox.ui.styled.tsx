import React from 'react';
import Colors from '~styles/color.style.scss';
import Sizes from '~styles/size.style.scss';
// import Fonts from '~styles/font.style.scss';
import styled from 'styled-components';
import { Input } from 'antd';
import { InputProps as IAntInputProps } from 'antd/lib/input/';
import ITextboxProps from './textbox.ui.type';

type Props = IAntInputProps & ITextboxProps;

const BaseInput: React.FC<Props> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 Datepicker 컴포넌트에 넣어야 합니다.
  const { widthSize, ...otherProps } = props;

  return <Input {...otherProps} />;
};

const PasswordInput: React.FC<Props> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 Datepicker 컴포넌트에 넣어야 합니다.
  const { widthSize, ...otherProps } = props;

  return <Input.Password {...otherProps} />;
};

/* TextBox  스타일 */
export const ScInputbox = styled(BaseInput)`
  width: ${props =>
    props.widthSize === 'default'
      ? Sizes.width_input_md
      : props.widthSize === 'flex'
      ? '100%'
      : Sizes.width_input_md};
  height: ${Sizes.height_input_default};
  border-radius: ${Sizes.borderRadius_common};

  .ag-input-wrapper,
  .ag-picker-field-wrapper {
    border-color: ${Colors.bg_input_wrapper};
  }

  &:active {
    border-color: ${Colors.bg_input_active};
  }
`;

/* TextBox-password 스타일 */
export const ScInputPasswordbox = styled(PasswordInput)`
  width: ${props =>
    props.widthSize === 'default'
      ? Sizes.width_input_lg
      : props.widthSize === 'flex'
      ? '100%'
      : Sizes.width_input_lg};
  height: ${Sizes.height_input_lg};
  border-radius: ${Sizes.borderRadius_common};

  .ag-input-wrapper,
  .ag-picker-field-wrapper {
    border-color: ${Colors.bg_inputPassword_wrapper};
  }

  &:active {
    border-color: ${Colors.bg_inputPassword_active};
  }
`;

/* TextBox-id 스타일 */
export const ScInputIdbox = styled(BaseInput)`
  width: ${props =>
    props.widthSize === 'default'
      ? Sizes.width_input_lg
      : props.widthSize === 'flex'
      ? '100%'
      : Sizes.width_input_lg};
  height: ${Sizes.height_input_lg};
  border-radius: ${Sizes.borderRadius_common};

  .ag-input-wrapper,
  .ag-picker-field-wrapper {
    border-color: ${Colors.bg_inputPassword_wrapper};
  }

  &:active {
    border-color: ${Colors.bg_inputPassword_active};
  }
`;

/* TextBox 스타일 */
export const ScInputNumberbox = styled(BaseInput)`
  width: ${props =>
    props.widthSize === 'default'
      ? Sizes.width_inputNumber_md
      : props.widthSize === 'flex'
      ? '100%'
      : Sizes.width_inputNumber_md};
  height: ${Sizes.height_inputNumber_default};
  box-sizing: border-box;
  border-radius: ${Sizes.borderRadius_common};

  .ag-input-wrapper,
  .ag-picker-field-wrapper {
    border-color: ${Colors.bg_inputNumber_wrapper};
  }

  &:active {
    border-color: ${Colors.bg_inputNumber_active};
  }
`;
