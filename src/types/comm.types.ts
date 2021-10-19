
/** 품목 유형 */
export type TItemType = {
  /** 품목 유형 UUID */
  item_type_uuid?: string;
  /** 품목 유형 코드 */
  item_type_cd?: string;
  /** 품목 유형 */
  item_type_nm?: string;
};

/** 제품 유형 */
export type TProdType = {
  /** 제품 유형 UUID */
  prod_type_uuid?: string;
  /** 제품 유형 코드 */
  prod_type_cd?: string;
  /** 제품 유형 */
  prod_type_nm?: string;
};

/** 모델 */
export type TModel = {
  /** 모델 UUID */
  model_uuid?: string;
  /** 모델 코드 */
  model_cd?: string;
  /** 모델 */
  model_nm?: string;
};

/** 단위 */
export type TUnit = {
  /** 단위 UUID */
  unit_uuid?: string;
  /** 단위 코드 */
  unit_cd?: string;
  /** 단위 */
  unit_nm?: string;
};

/** 품목 */
export type TProd = {
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