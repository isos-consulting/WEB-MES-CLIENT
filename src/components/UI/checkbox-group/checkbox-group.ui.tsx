import React, { useEffect, useMemo } from 'react';
import { Checkbox as AntCheckbox, Space } from 'antd';
import { Label } from '../label';
import { Checkbox } from '../checkbox';
import { useRecoilState } from 'recoil';
import Props from './checkbox-group.ui.type';
import { afAnyArrayState, afObjectState } from '~recoils/recoil.atom-family';

/** 체크박스 그룹 */
const CheckboxGroup: React.FC<Props> = props => {
  const [checkboxGroupValues, setCheckboxGroupValues] = useRecoilState(
    afAnyArrayState(props.id),
  ); // 체크박스 배열
  const [allCheckValue, setAllCheckValue] = useRecoilState(
    afObjectState(props.id),
  ); //전체 체크하는 체크박스

  /** 체크박스 변경 이벤트 */
  const onChangeValues = (checkedValues: Array<string | number | boolean>) => {
    setAllCheckValue({
      checked: allCheckValue['checked'] || false,
      indeterminate: checkboxGroupValues.length > 0,
    });

    setCheckboxGroupValues(checkedValues);
  };

  /** 전체 체킹하는 체크박스 변경 이벤트 */
  const onChangeAll = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxGroupValues(
      e?.target.checked
        ? (props.options.map(value => value.code) as string[])
        : ([] as string[]),
    );
    setAllCheckValue({
      checked: e?.target.checked,
      indeterminate: false,
    });
  };

  /** 데이터 리셋 함수 */
  const resetState = () => {
    setCheckboxGroupValues([]);
    setAllCheckValue({
      checked: false,
      indeterminate: false,
    });
  };

  /** 컴포넌트 소멸시 recoil데이터 리셋 */
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  if (props?.label != null) {
    /** 라벨이 있는 버전 */
    return useMemo(
      () => (
        <Space size={10} wrap>
          <Label text={props.label} important={props.important} />
          <AntCheckbox.Group
            name={props.name}
            defaultValue={props.defaultValue}
            onChange={props.onChange || onChangeValues}
          >
            {props.allCheckedable ? (
              <Checkbox
                indeterminate={allCheckValue['indeterminate']}
                onChange={onChangeAll}
                checked={allCheckValue['checked']}
                disabled={props.disabled}
                text="전체"
              />
            ) : (
              ''
            )}
            {props.options.map(value => {
              return (
                <Checkbox
                  key={value.id || value.code}
                  id={value.id || value.code}
                  name={value.name}
                  code={value.code}
                  disabled={value.disabled}
                  defaultChecked={value.defaultChecked}
                  text={value.text}
                />
              );
            })}
          </AntCheckbox.Group>
        </Space>
      ),
      [props.options],
    );
  } else {
    /** 라벨이 없는 버전 */
    return useMemo(
      () => (
        <AntCheckbox.Group
          name={props.name}
          defaultValue={props.defaultValue}
          onChange={props.onChange || onChangeValues}
        >
          {props.allCheckedable ? (
            <Checkbox
              indeterminate={allCheckValue['indeterminate']}
              onChange={onChangeAll}
              checked={allCheckValue['checked']}
              disabled={props.disabled}
              text="전체"
            />
          ) : (
            ''
          )}
          {props.options.map(value => {
            return (
              <Checkbox
                key={value.id || value.code}
                id={value.id || value.code}
                name={value.name}
                code={value.code}
                disabled={value.disabled}
                defaultChecked={value.defaultChecked}
                text={value.text}
              />
            );
          })}
        </AntCheckbox.Group>
      ),
      [props.options],
    );
  }
};

export default CheckboxGroup;
