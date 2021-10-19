import { useState } from "react";
import { getData } from "~/functions";
import React from "react";


/** 품목 유형 */
type TItemType = {
  /** 품목 유형 UUID */
  item_type_uuid?: string;
  /** 품목 유형 코드 */
  item_type_cd?: string;
  /** 품목 유형 */
  item_type_nm?: string;
};

/** 제품 유형 */
type TProdType = {
  /** 제품 유형 UUID */
  prod_type_uuid?: string;
  /** 제품 유형 코드 */
  prod_type_cd?: string;
  /** 제품 유형 */
  prod_type_nm?: string;
};

/** 모델 */
type TModel = {
  /** 모델 UUID */
  model_uuid?: string;
  /** 모델 코드 */
  model_cd?: string;
  /** 모델 */
  model_nm?: string;
};

/** 단위 */
type TUnit = {
  /** 단위 UUID */
  unit_uuid?: string;
  /** 단위 코드 */
  unit_cd?: string;
  /** 단위 */
  unit_nm?: string;
};

/** 품목 */
type TProd = {
  /** 제품 UUID */
  prod_uuid?: string;
  /** 품번 */
  prod_no?: string;
  /** 품명 */
  prod_nm?: string;
  /** 리비전 */
  rev?: string;
  /** 규격 */
  prod_std?: string;
  /** LOT관리 유무 */
  lot_fg?: boolean;
  /** 사용 유무 */
  use_fg?: boolean;
  /** 규격 */
  active_fg?: boolean;
} & TItemType & TProdType & TModel & TUnit;


// 특정 타입의 키를 제거하고 가져오기
type TProd2 = Omit<TProd, keyof TUnit>;

// 특정 키를 선택해서 제거하기
type TProd3 = Omit<TProd, 'lot_fg' | 'use_fg'>;

// 키를 변환하여 가져오기
type WithChange<T> = { [P in keyof T & string as `input_${P}`]: T[P] };
type TProd4 = WithChange<TProd>;





const TestPage = () => {
  const [data1, setData1] = useState<TProd[]>([]);
  const [data2, setData2] = useState<TProd4[]>([]);

  const keys:keyof TProd4 = 'lot_fg';

  

  
  // const onSearch = (values) => {
  //   getData<TProd4[]>({}, '/std/prods').then((res) => {
  //     setData(res);
  //   });
  // }

  // return (
  //   <div>
  //     {data[0].}
  //   </div>
  // )
}