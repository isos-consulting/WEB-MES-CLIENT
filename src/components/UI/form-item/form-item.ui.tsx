import React from "react";
import {Form as AntForm} from 'antd';
import Props from './form-item.ui.type';


/** 폼 아이템 */
const FormItem: React.FC<Props> = (props) => {
  return (
    <AntForm.Item
      label={props.label}
      name={props.name}
      rules={[{ required:props.required, message:props.requireMessage}]} >
      {props.children}
    </AntForm.Item>
  )
};


export default FormItem;