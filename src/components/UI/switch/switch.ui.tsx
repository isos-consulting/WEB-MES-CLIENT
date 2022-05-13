import React from 'react';
import { Switch as AntSwitch } from 'antd';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import Props from './switch.ui.type';
import { afBooleanState } from '~recoils/recoil.atom-family';

/** 스위치 */
const Switch: React.FC<Props> = props => {
  const [, SwitchSetValue] = useRecoilState(afBooleanState(props.id));

  const handleChangeSwitchValue = (checked: boolean, event: MouseEvent) => {
    SwitchSetValue(checked);
  };

  const resetState = () => {
    SwitchSetValue(false);
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return (
    <AntSwitch
      {...props}
      onChange={props.onChange || handleChangeSwitchValue}
    />
  );
};

export default Switch;
