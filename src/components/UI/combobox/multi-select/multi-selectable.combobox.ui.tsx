import React from 'react';
import { Space } from 'antd';
import { Label } from '../../label';
import { ScCombobox } from '../combobox.ui.styled';
import { useComboDatas } from './data-setting-option.hook';

export const MultiSelectableCombobox = props => {
  const { comboData } = useComboDatas({
    ...props.dataSettingOptions,
  });

  return (
    <Space size={10} wrap>
      <Label text={props.label} important={props.important}></Label>
      <ScCombobox
        mode="multiple"
        maxTagCount="responsive"
        allowClear={true}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        widthSize={props.widthSize}
        fontSize={props.fontSize}
        placeholder={props.placeholder}
        options={comboData}
      />
    </Space>
  );
};
