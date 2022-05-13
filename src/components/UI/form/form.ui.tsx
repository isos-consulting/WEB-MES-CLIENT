import React from 'react';
import { Form as AntForm } from 'antd';
import Props from './form.ui.type';

/** 폼 */
const Form: React.FC<Props> = props => {
  return (
    <AntForm form={props.form} layout={props.layout} name={props.name}>
      {props.formItem}
    </AntForm>
  );
};

export default Form;
