import React, { useEffect } from 'react';
import { Switch as AntdSwitch } from 'antd';
import { useRecoilState } from 'recoil';
import Props from './switch.ui.type';
import { afBooleanState } from '~recoils/recoil.atom-family';

/** 스위치 */
const Switch: React.FC<Props> = props => {
  const AntSwitch = () => AntdSwitch;
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
