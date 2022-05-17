import React, { useMemo, useState, useCallback } from 'react';
import { Select } from 'antd';
import { useRecoilState } from 'recoil';
import Props, { IComboboxItem } from './combobox.ui.type';
import { ScCombobox } from './combobox.ui.styled';
import { afStringState } from '~recoils/recoil.atom-family';
import { Space } from 'antd';
import { Label } from '../label';
import { useLayoutEffect } from 'react';
import { getData } from '~/functions';

/** 콤보박스 */
const Combobox: React.FC<Props> = props => {
  const [comboValue, setComboValue] = useRecoilState(afStringState(props.id));
  const [, setComboTextValue] = useRecoilState(afStringState(props.id));
  const [options, setOptions] = useState([]);

  /** 콤보박스 값 변경 이벤트 */
  const onChangeValue = useCallback(
    (value: any, option: any) => {
      setComboTextValue(option.children);
      setComboValue(value);

      if (props.onChange) props.onChange(value);
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
    let comboData: IComboboxItem[] = [];

    getData<any[]>(params, uriPath).then(res => {
      res?.forEach(el => {
        const keys = Object.keys(el);

        let code = null;
        let text = null;

        for (let i = 0; i < keys.length; i++) {
          if (codeName === keys[i]) {
            code = el[keys[i]];
          }

          if (textName === keys[i]) {
            text = el[keys[i]];
          }

          if (code != null && text != null) {
            comboData.push({ code, text });
            break;
          }
        }
      });

      setOptions(comboData);
    });
  };

  /** 콤보박스 기본 값 세팅 & 컴포넌트 소멸시 recoil데이터 리셋 */
  useLayoutEffect(() => {
    if (props?.dataSettingOptions != null) {
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

          // setComboTextValue(props?.defaultText || props?.defaultValue);
          // setComboValue(props.defaultValue);
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
    } else {
      const value = options?.length > 0 ? options[0]?.code : null;
      return value;
    }
  }, [props.defaultValue, options]);

  // useLayoutEffect(() => {
  //   if ((options?.length > 0) === false) return;
  //   onChangeValue(props.defaultValue, options[0]?.text);
  // }, [props.defaultValue, options]);

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
            <Select.Option value="" disabled={false}>
              {''}
            </Select.Option>
          ) : props?.firstItemType === 'all' ? (
            <Select.Option value="all" disabled={false}>
              전체
            </Select.Option>
          ) : props?.firstItemType === 'none' ? null : (
            <Select.Option value="-" disabled={false}>
              -
            </Select.Option>
          )}
          {options?.map((value, index) => {
            return (
              <Select.Option
                key={value.code}
                value={value.code}
                disabled={value.disabled}
              >
                {value.text}
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
          <Select.Option value="" disabled={false}>
            {''}
          </Select.Option>
        ) : props?.firstItemType === 'all' ? (
          <Select.Option value="all" disabled={false}>
            전체
          </Select.Option>
        ) : props?.firstItemType === 'none' ? null : (
          <Select.Option value="-" disabled={false}>
            -
          </Select.Option>
        )}
        {options?.map((value, index) => {
          return (
            <Select.Option
              key={value.code}
              value={value.code}
              disabled={value.disabled}
            >
              {value.text}
            </Select.Option>
          );
        })}
      </ScCombobox>
    );
  }
};

export default Combobox;
