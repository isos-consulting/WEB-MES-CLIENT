import { FormikProps, FormikValues } from "formik";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { cloneObject } from "~/functions";
import { afInputGroupValues, IInputGroupboxItem, IInputGroupboxProps } from "./input-groupbox.ui";


export const inputGroupModel = (props:{
  /** 그룹입력상자 컴포넌트의 레퍼런스, 컴포넌트 DOM에 접근 가능 */
  ref
  : React.MutableRefObject<FormikProps<FormikValues>>,

  /** 컴포넌트 DOM에 접근 가능 */
  instance
  : FormikProps<FormikValues>,

  /** 그룹입력상자에 property를 설정하기 위한 변수 */
  props
  : IInputGroupboxProps,

  /** 그룹입력상자의 값을 가지고 있는 객체 변수 */
  values
  : FormikValues,

  setValues
  : SetterOrUpdater<FormikValues>,

  modifiedValues
  : FormikValues,

  isModified
  : boolean,

  inputItemKeys
  : string[],
  
  inputItems
  : IInputGroupboxItem[],

  setInputItems
  : React.Dispatch<React.SetStateAction<IInputGroupboxItem[]>>,

  inputGroupOptions
  : Omit<IInputGroupboxProps, 'id' | 'inputItems' | 'innerRef'>,

  setInputGroupOptions
  : React.Dispatch<React.SetStateAction<Omit<IInputGroupboxProps, "id" | "inputItems" | "innerRef">>>,

  setFieldDisabled
  : (values:{[key: string]: boolean}) => void,

  setDisabledAll
  : (value:boolean) => void,

  setFieldValue
  : (id: string, value: any) => void,
}) => {
  
  return props;
};

export const useInputGroup = (id: string, inputItems:IInputGroupboxItem[], inputGroupOptions?:Omit<IInputGroupboxProps, 'id' | 'inputItems' | 'innerRef'>) => {
  
  const ref = useRef<FormikProps<FormikValues>>();

  const [values, setValues] = useState<FormikValues>({});
  const defaultValues = useRef({});
  const [_inputItems, setInputItems] = useState<IInputGroupboxItem[]>(inputItems);
  const [_inputGroupOptions, setInputGroupOptions] = useState<Omit<IInputGroupboxProps, 'id' | 'inputItems' | 'innerRef'>>(inputGroupOptions);

  //#region 🔶disabled 관련
  const setFieldDisabled = (values:{[key: string]: boolean}) => {
    const changedInputItems = cloneObject(_inputItems)?.map((item:IInputGroupboxItem) => {
      if (Object.keys(values).includes(item?.id)) {
        item['disabled'] = values[item?.id];
      }
      
      return item;
    });

    setInputItems(changedInputItems);
  }

  const setDisabledAll = (disabled:boolean) => {
    const changedInputItems = cloneObject(_inputItems)?.map((el) => {
      el['disabled'] = disabled;
      return el;
    });

    setInputItems(changedInputItems);
  }
  //#endregion

  const setFieldValue = (id:string, value:any) => {
    if (ref?.current) {
      ref?.current?.setFieldValue(id, value);
    } else {
      setValues(crr => ({...crr, [id]:value}));
    }
  }

  const modifiedValues = useMemo(() => {
    return getModifiedInputGroupValues(id, defaultValues, values);
  }, [id, values, defaultValues]);
  
  const isModified = useMemo(() => {
    return Object.keys(modifiedValues).length > 0;
  }, [modifiedValues]);

  const inputItemKeys = useMemo(() => {
    let result:string[] = [];
    inputItems?.forEach((el) => {
      result.push(el?.id ?? el?.name);
    });

    return result;
  }, [inputItems]);

  const props:IInputGroupboxProps = {
    id,
    innerRef: ref,
    inputItems: _inputItems,
    ..._inputGroupOptions,
  };

  useLayoutEffect(() => {
    setInputGroupOptions(_inputGroupOptions);
  }, [inputGroupOptions]);

  useLayoutEffect(() => {
    if (ref?.current) {
      const includeAliasValues = onIncludeAliasValues(inputItems, values);
      defaultValues.current = ref?.current?.values;
      ref?.current?.setValues(includeAliasValues);
    }
  }, [values]);

  const model = inputGroupModel({
    ref,
    instance: ref?.current,
    props,
    values: values,
    setValues: setValues,
    modifiedValues,
    isModified,
    inputItemKeys,
    inputItems: _inputItems,
    setInputItems,
    inputGroupOptions: _inputGroupOptions,
    setInputGroupOptions,
    setFieldDisabled,
    setDisabledAll,
    setFieldValue,
  });

  return model;
}


/** ❗(임시 / select reponse키와 request키가 달라서 생긴 문제인데, 나중에 이 부분에 대해 reponse키와 request키를 통일할지, 이대로 변환하며 사용할지 결정해야함)
 * 
 * 그룹입력상자에 alias 넣어주는 함수
*/
const onIncludeAliasValues = (inputItems, values) => {
  let result = cloneObject(values) || {};

  for (let i = 0; i < inputItems?.length; i++) {
    const alias = inputItems[i]?.alias;
    const originalKeyName = inputItems[i]?.id;
    if (alias) {
      if (values == null) {
        result[alias] = null;
      } else {
        if (Object.keys(values).includes(originalKeyName)) {
          // result[alias] = values[originalKeyName];
          result = Object.assign({[alias]: values[originalKeyName]}, result);
        } else {
          // result[alias] = null;
          result = Object.assign({[alias]: null}, result);
        }
      }
    }
  }

  return result;
}

/** 그룹입력상자의 수정된 항목만 반환합니다. */
const getModifiedInputGroupValues = (id:string, oldValues, newValues):FormikValues => {
  let result = {};

  // 초기값과 비교해서 달라진 항목만 출력합니다.
  const oldKeys = oldValues == null ? [] : Object.keys(oldValues);
  const newKeys = newValues == null ? [] : Object.keys(newValues);

  let keys = oldKeys.concat(newKeys)
  keys = keys?.filter((value, index) => keys?.indexOf(value) === index);

  keys?.forEach((key) => {
    if (oldKeys?.includes(key) === false && newKeys?.includes(key)) { // 새로 신규 키가 삽입되어 있는 경우
      result[key] = newValues[key];

    } else if (oldKeys?.includes(key) && newKeys?.includes(key)) { // 둘다 키를 가지고 있지만 값이 다른 경우
      if (oldValues[key] !== newValues[key]) {
        result[key] = newValues[key];
      }
    } 
  });

  return result;
}