import React from 'react';
import { Space } from 'antd';
import { Label } from '../../label';
import { ScCombobox } from '../combobox.ui.styled';
import { useComboDatas } from './data-setting-option.hook';

const MultiSelectableComboboxLabel = ({ label, important }) => {
  if (label) return <Label text={label} {...important} />;

  return null;
};

export const MultiSelectableCombobox = props => {
  const { dataSettingOptions, label, important, ...comboboxProps } = props;
  const { comboData } = useComboDatas({
    ...props.dataSettingOptions,
  });

  return (
    <Space size={10} wrap>
      <MultiSelectableComboboxLabel {...{ label, important }} />
      <ScCombobox
        mode="multiple"
        maxTagCount="responsive"
        allowClear={true}
        {...comboboxProps}
        options={comboData}
      />
    </Space>
  );
};
