import React from "react";
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { ScCheckbox } from './checkbox.ui.styled';
import Props from './checkbox.ui.type';
import {afBooleanState} from '~recoils/recoil.atom-family';
import {Space} from 'antd';
import {Label} from '../label';
import { CheckboxChangeEvent } from "antd/lib/checkbox";


/** 체크박스 */
const Checkbox: React.FC<Props> = (props) => {
  const [,CheckboxSetValue] = useRecoilState(afBooleanState(props.id));

  const handleChangeCheckboxValue = (e:CheckboxChangeEvent) => {
    CheckboxSetValue(e.target.checked);
  };

  /** 데이터 리셋 함수 */
  const resetState=()=>{
    CheckboxSetValue(false);
  }

  /** 컴포넌트 소멸시 recoil데이터 리셋 */
  useEffect(()=>{
    return () => {
      resetState();
    }
  },[]);

  if (props?.label != null ) {
    /** 라벨이 있는 버전 */
    return (
      <Space size={10}>
        <Label text={props.label} important={props.important}/>
        <ScCheckbox
          onChange={props.onChange || handleChangeCheckboxValue}
          indeterminate={props.indeterminate}
          value={props.code}
          defaultChecked={props.defaultChecked}
          checked={props.checked}
          disabled={props.disabled}>
          {props.text}
        </ScCheckbox>
      </Space>
    )
  } else {
    /** 라벨이 없는 버전 */
    return (
      <ScCheckbox
        onChange={props.onChange || handleChangeCheckboxValue}
        indeterminate={props.indeterminate}
        value={props.code}
        defaultChecked={props.defaultChecked}
        checked={props.checked}
        disabled={props.disabled}>
        {props.text}
      </ScCheckbox>
    );
  }
};


export default Checkbox;