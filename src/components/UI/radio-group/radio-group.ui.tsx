import React from 'react';
import { Card, Radio as AntRadio, RadioChangeEvent, Space } from 'antd';
import { Label } from '../label';
import { Radio } from '../radio';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import Props from './radio-group.ui.type';
import { afStringState } from '~recoils/recoil.atom-family';
import { useMemo } from 'react';

/** 라디오 그룹 */
const RadioGroup: React.FC<Props> = props => {
  const [radioGroupValue, setRadioGroupValue] = useRecoilState(
    afStringState(props.id),
  );

  const onChange = (e: RadioChangeEvent) => {
    setRadioGroupValue(e.target.value);
  };

  const resetState = () => {
    setRadioGroupValue('');
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  return useMemo(
    () => (
      <Space size={10} wrap>
        <Label text={props.label} important={props.important} />
        <AntRadio.Group
          onChange={props.onChange || onChange}
          defaultValue={props.defaultValue}
          value={props.value}
        >
          {props.useOutline ? (
            <Card style={{ margin: 0 }}>
              {props?.options?.map(value => {
                return (
                  <Radio
                    key={value.id || value.code}
                    id={value.id || value.code}
                    code={value.code}
                    text={value.text}
                    defaultChecked={value.defaultChecked}
                    disabled={value.disabled}
                  />
                );
              })}
            </Card>
          ) : (
            props?.options?.map(value => {
              return (
                <Radio
                  key={value.id || value.code}
                  id={value.id || value.code}
                  code={value.code}
                  text={value.text}
                  defaultChecked={value.defaultChecked}
                  disabled={value.disabled}
                />
              );
            })
          )}
        </AntRadio.Group>
      </Space>
    ),
    [props.value, props.options],
  );
};

export default RadioGroup;
