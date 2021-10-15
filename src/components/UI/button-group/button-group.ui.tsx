import React, { useMemo } from 'react';
import { Button } from '../button';
import { Space } from 'antd';
import Props from './button-group.ui.type';


/** 버튼 그룹 */
const ButtonGroup: React.FC<Props> = (props) => {
  return useMemo (() =>
    <Space size={10} wrap>
      {props?.btnItems.map((childProps) => {
          return (
            <Button {...childProps} />
          );
      })}
    </Space>,
    [props.btnItems]
  );
}


export default ButtonGroup;