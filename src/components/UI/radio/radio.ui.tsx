import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Props from './radio.ui.type';
import { RadioChangeEvent, Space } from 'antd';
import { Label } from '../label';
import { ScRadio } from './radio.ui.styled';
import { afStringState } from '~recoils/recoil.atom-family';

/** 라디오 버튼 */
const Radio: React.FC<Props> = props => {
  const [, setRadioValue] = useRecoilState(afStringState(props.id));

  const handleChangeRadioValue = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value || '');
  };

  const resetState = () => {
    setRadioValue('');
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  if (props?.label != null) {
    return (
      <Space size={10}>
        <Label text={props.label} important={props.important} />
        <ScRadio
          onChange={props.onChange || handleChangeRadioValue}
          value={props.code}
          disabled={props.disabled}
          defaultChecked={props.defaultChecked}
        >
          {props.text}
        </ScRadio>
      </Space>
    );
  } else {
    return (
      <ScRadio
        onChange={props.onChange || handleChangeRadioValue}
        value={props.code}
        disabled={props.disabled}
        defaultChecked={props.defaultChecked}
      >
        {props.text}
      </ScRadio>
    );
  }
};

export default Radio;
