import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  ScInputbox,
  ScInputPasswordbox,
  ScInputNumberbox,
  ScInputIdbox,
} from './textbox.ui.styled';
import Props from './textbox.ui.type';
import { Space } from 'antd';
import { Label } from '../label';
import { afStringState } from '~recoils/recoil.atom-family';
import { isNil } from '~/helper/common';

/** 입력박스 */
const Textbox: React.FC<Props> = props => {
  const [, setValue] = useRecoilState(afStringState(props.id));
  const [, setTextHiddenValue] = useRecoilState(afStringState(props.id));

  const onChangeTextValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value || '');

    if (props.onChange) {
      props.onChange(event);
    }
  };

  const resetState = () => {
    setValue('');
    setTextHiddenValue('');
  };

  useEffect(() => {
    setTextHiddenValue(props.hiddenValue || '');
  }, [props.hiddenValue]);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  const textboxComponent =
    props.inputType === 'number' ? (
      <ScInputNumberbox
        {...props}
        inputMode="numeric"
        type="number"
        onChange={onChangeTextValue}
      />
    ) : props.inputType === 'id' ? (
      <ScInputIdbox {...props} onChange={onChangeTextValue} />
    ) : props.inputType === 'password' ? (
      <ScInputPasswordbox
        {...props}
        inputType="password"
        type="password"
        onChange={onChangeTextValue}
      />
    ) : (
      <ScInputbox {...props} inputMode="text" onChange={onChangeTextValue} />
    );

  if (!isNil(props?.label)) {
    return (
      <Space size={10} wrap hidden={props.hidden}>
        <Label text={props.label} important={props.important} />
        {textboxComponent}
      </Space>
    );
  } else {
    return textboxComponent;
  }
};

export default Textbox;
