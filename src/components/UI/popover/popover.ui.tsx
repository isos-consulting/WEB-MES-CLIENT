import React from "react";
import { Popover as AntPopover } from 'antd';
import { Button } from '../button';
import Props from './popover.ui.type';


/** 팝 오버 */
const Popover: React.FC<Props> = (props) => {
  return (
    <AntPopover
      placement={props.placement}
      content={props.content}
      title={props.title}
      trigger={props.trigger}>
        {
          props.btnComponent ? 
          props.btnComponent
        : 
          <Button btnType='buttonFill' text={props.btnText}/>
        }
    </AntPopover>
  );
}


export default Popover;