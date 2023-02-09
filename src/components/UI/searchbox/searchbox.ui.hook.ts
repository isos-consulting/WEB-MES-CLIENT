import { FormikErrors, FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import { isNil } from '~/helper/common';
import ISearchboxProps, { ISearchItem } from './searchbox.ui.type';

export const searchboxModel = (props: {
  /** 그룹입력상자 컴포넌트의 레퍼런스, 컴포넌트 DOM에 접근 가능 */
  ref: React.MutableRefObject<FormikProps<FormikValues>>;

  /** 컴포넌트 DOM에 접근 가능 */
  instance: FormikProps<FormikValues>;

  /** 그룹입력상자에 property를 설정하기 위한 변수 */
  props: ISearchboxProps;

  /** 그룹입력상자의 값을 가지고 있는 객체 변수 */
  values: FormikValues;

  setValues: (
    values: React.SetStateAction<FormikValues>,
    shouldValidate?: boolean,
  ) => void;

  onSearch?: (values?) => void;

  searchItemKeys: string[];

  searchItems: ISearchItem[];

  setSearchItems: React.Dispatch<React.SetStateAction<ISearchItem[]>>;

  options?: {
    validate: (values?: any) => Promise<FormikErrors<FormikValues>>;
  };
}) => {
  return props;
};

export const useSearchbox = (
  id: string,
  searchItems: ISearchItem[],
  onSearch?: (values?) => void,
  options?: {
    validate: (values?: any) => Promise<FormikErrors<FormikValues>>;
  },
) => {
  const ref = useRef<FormikProps<FormikValues>>();
  const [_searchItems, setSearchItems] = useState<ISearchItem[]>(searchItems);
  const initValues = useMemo(
    () => createInitialValues(_searchItems),
    _searchItems,
  );

  const searchItemKeys = useMemo(() => {
    let result: string[] = [];
    _searchItems?.forEach(el => {
      if (el?.ids) {
        el?.ids.forEach((id, index) => {
          result.push(id ?? el?.names[index]);
        });
      } else {
        result.push(el?.id ?? el?.name);
      }
    });

    return result;
  }, [_searchItems]);

  const props: ISearchboxProps = {
    id,
    innerRef: ref,
    searchItems: _searchItems,
    ...options,
  };

  return searchboxModel({
    ref,
    instance: ref?.current,
    props,
    values: ref?.current?.values ?? initValues,
    setValues: ref?.current?.setValues,
    onSearch,
    searchItemKeys,
    searchItems: _searchItems,
    setSearchItems,
  });
};

/** 초기값 object를 만들어주는 함수 */
const createInitialValues = inputItems => {
  let result = {};

  inputItems?.forEach(item => {
    if (!isNil(item.ids)) {
      item?.ids?.forEach((subItem, index) => {
        if (item?.names) result[item?.names[index]] = item?.defaults[index];
        else result[item?.ids[index]] = item?.defaults[index];
      });
    } else {
      result[item.name || item.id] = item?.default;
    }
  });

  return result;
};
