import React from 'react';
import { Typography } from 'antd';
import Props from './label.ui.type';
import Fonts from '~styles/font.style.scss';

/** 라벨 */
const Label: React.FC<Props> = props => {
  const { Text } = Typography;

  return (
    <span>
      <Text style={{ fontSize: Fonts.fontSize_label_s }}>{props.text}</Text>
      {props.important ? <Text>*</Text> : ''}
    </span>
  );
};

export default Label;
