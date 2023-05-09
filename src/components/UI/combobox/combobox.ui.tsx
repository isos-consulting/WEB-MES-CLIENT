import { Select, Space } from 'antd';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getData } from '~/functions';
import { getCodeTextPairList } from '~/functions/combobox.function';
import { isNil } from '~/helper/common';
import { afStringState } from '~recoils/recoil.atom-family';
import { Label } from '../label';
import { ScCombobox } from './combobox.ui.styled';
import Props from './combobox.ui.type';

/** 콤보박스 */
const Combobox: React.FC<Props> = props => {
  const [, setComboValue] = useRecoilState(afStringState(props.id));
  const [, setComboTextValue] = useRecoilState(afStringState(props.id));
  const [options, setOptions] = useState([]);

  /** 콤보박스 값 변경 이벤트 */
  const onChangeValue = useCallback(
    (changedValue: any, option: any) => {
      setComboTextValue(option.children);
      setComboValue(changedValue);

      if (props.onChange) props.onChange(changedValue, option);
    },
    [props.onChange],
  );

  /** 데이터 리셋 함수 */
  const resetState = () => {
    switch (props?.firstItemType) {
      case 'all':
        setComboTextValue('전체');
        setComboValue('all');
        break;

      case 'empty':
        setComboTextValue('');
        setComboValue('');
        break;

      case 'none':
        if (props?.defaultValue) {
          setComboTextValue(props?.defaultText || props?.defaultValue);
          setComboValue(props.defaultValue);
        } else {
          setComboTextValue(options[0]?.text);
          setComboValue(options[0]?.code);
        }
        break;

      default:
        setComboTextValue('-');
        setComboValue('-');
        break;
    }
  };

  /** 서버 데이터로 콤보박스 데이터 구성 */
  const getComboDatas = () => {
    const { uriPath, params, codeName, textName } = props?.dataSettingOptions;

    getData<any[]>(params, uriPath).then(apiResponseOptions => {
      const comboData = getCodeTextPairList({
        codeName,
        textName,
        options: apiResponseOptions,
      });

      setOptions(comboData);
    });
  };

  /** 콤보박스 기본 값 세팅 & 컴포넌트 소멸시 recoil데이터 리셋 */
  useLayoutEffect(() => {
    if (!isNil(props?.dataSettingOptions)) {
      getComboDatas();
    } else {
      setOptions(props.options);
    }

    return () => {
      resetState();
    };
  }, []);

  /** 콤보박스 기본 값 세팅 */
  useLayoutEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  /** 콤보박스 기본 값 세팅 */
  useLayoutEffect(() => {
    if (props?.defaultValue) {
      setComboTextValue(props?.defaultText || props?.defaultValue);
      setComboValue(props?.defaultValue);
    } else {
      switch (props?.firstItemType) {
        case 'all':
          setComboTextValue('전체');
          setComboValue('all');
          break;

        case 'empty':
          setComboTextValue('');
          setComboValue('');
          break;

        case 'none':
          if (options?.length > 0) {
            setComboTextValue(options[0]?.text);
            setComboValue(options[0]?.code);
          } else {
            setComboTextValue(null);
            setComboValue(null);
          }
          break;

        default:
          setComboTextValue('-');
          setComboValue('-');
          break;
      }
    }
  }, [options]);

  const defaultValue = useMemo(() => {
    if (props.defaultValue) {
      return props.defaultValue;
    }
    return options?.length > 0 ? options[0]?.code : null;
  }, [props.defaultValue, options]);

  const value = useMemo(() => {
    if (props.value) {
      return props.value;
    } else {
      return props.defaultValue;
    }
  }, [props.value, defaultValue]);

  if (props?.label) {
    /** 라벨이 있는 버전 */
    return (
      <Space size={10} wrap>
        <Label text={props.label} important={props.important} />
        <ScCombobox
          defaultValue={defaultValue}
          value={value}
          onChange={onChangeValue}
          disabled={props.disabled}
          widthSize={props.widthSize}
          fontSize={props.fontSize}
        >
          {props?.firstItemType === 'empty' ? (
            // @ts-ignore
            <Select.Option value="" disabled={false}>
              {''}
            </Select.Option>
          ) : props?.firstItemType === 'all' ? (
            // @ts-ignore
            <Select.Option value="all" disabled={false}>
              전체
            </Select.Option>
          ) : props?.firstItemType === 'none' ? null : (
            // @ts-ignore
            <Select.Option value="-" disabled={false}>
              -
            </Select.Option>
          )}
          {options?.map(({ code, disabled, text }) => {
            return (
              // @ts-ignore
              <Select.Option key={code} value={code} disabled={disabled}>
                {text}
              </Select.Option>
            );
          })}
        </ScCombobox>
      </Space>
    );
  } else {
    /** 라벨이 없는 버전 */
    return (
      <ScCombobox
        defaultValue={defaultValue}
        value={value}
        onChange={onChangeValue}
        disabled={props.disabled}
        widthSize={props.widthSize}
        fontSize={props.fontSize}
      >
        {props?.firstItemType === 'empty' ? (
          // @ts-ignore
          <Select.Option value="" disabled={false}>
            {''}
          </Select.Option>
        ) : props?.firstItemType === 'all' ? (
          // @ts-ignore
          <Select.Option value="all" disabled={false}>
            전체
          </Select.Option>
        ) : props?.firstItemType === 'none' ? null : (
          // @ts-ignore
          <Select.Option value="-" disabled={false}>
            -
          </Select.Option>
        )}
        {options?.map(({ code, disabled, text }) => {
          return (
            // @ts-ignore
            <Select.Option key={code} value={code} disabled={disabled}>
              {text}
            </Select.Option>
          );
        })}
      </ScCombobox>
    );
  }
};

export default Combobox;
