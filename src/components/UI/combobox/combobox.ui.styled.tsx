import React from 'react';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import styled from 'styled-components';
import Props from './combobox.ui.type';
import { Select } from 'antd';

interface IBaseSelect extends Omit<Props, 'id' | 'options'> {}

const BaseSelect: React.FC<IBaseSelect> = props => {
  const { widthSize, fontSize, ...otherProps } = props;

  return <Select {...otherProps} />;
};

/* 콤보박스 스타일 */
export const ScCombobox = styled(BaseSelect)`
  width: ${props =>
    props.widthSize === 'default'
      ? Sizes.width_combobox_md
      : props.widthSize === 'flex'
      ? '100%'
      : props.widthSize == null
      ? Sizes.width_combobox_md
      : props.widthSize};
  /* min-width: ${Sizes.width_combobox_lg}; */

  // 콤보박스 내부에 적용
  .ant-radio-inner::after {
    background-color: ${Colors.bg_comboBox_selectedInner};
    border-color: ${Colors.bg_comboBox_border};
  }

  // 콤보박스 내부에 적용
  .ant-radio-wrapper {
    letter-spacing: ${Sizes.size_letterSpacing};
    font-size: ${Fonts.fontSize_cbo};
    color: blue;
  }

  // 콤보박스에서 선택한 옵션 내용을 보여줄 때 적용
  .ant-select-selection-item {
    /* font-size: 15px; */
    font-size: ${props =>
      props.fontSize === 'large' ? Fonts.fontSize_cbo_lg : Fonts.fontSize_cbo};
  }
`;
