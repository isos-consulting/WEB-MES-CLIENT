import React from 'react';
import Grid, { Props as GridProps } from '@toast-ui/react-grid';
import { TPopupKey } from '../popup';
import { ColumnOptions, ModifiedRows } from 'tui-grid/types';
import { GridEventProps } from 'tui-grid/types/event';
import IButtonProps from '~/components/UI/button/button.ui.type';
import IModalProps from '../modal/modal.ui.type';

/** 데이터 그리드 속성 인터페이스 */
export default interface IDatagridProps extends GridProps {
  ref?: React.MutableRefObject<Grid>;
  /** 제목 */
  title?: string;

  /** 그리드 아이디 */
  gridId: string;

  /** 그리드 상태모드 */
  gridMode?: TGridMode; //edit모드는 delete랑 update를 동시에 하기 위한 임시 값임

  data?: any[];

  /** 그리드 컬럼 */
  columns: IGridColumn[];

  /** 그리드 고정 너비 */
  width?: number;

  /** 그리드 고정 높이 */
  height?: number | 'fitToParent';

  /** 숨김여부 */
  hidden?: boolean;

  summaryOptions?: IGridSummaryOptions;

  /** 그리드 콤보박스 세팅 */
  gridComboInfo?: TGridComboInfos;

  /** 그리드 컬럼별 호출 팝업 설정 */
  gridPopupInfo?: TGridPopupInfos;

  /** 그리드 신규생성 팝업 설정 */
  rowAddPopupInfo?: IGridPopupInfo;

  searchUriPath?: string;
  searchParams?: object;
  saveUriPath?: string;
  saveParams?: object;

  /** 행추가/행취소 버튼 숨기기 */
  hiddenActionButtons?: boolean;
  /** 컬럼 여러개 숨기기 */
  hiddenColumns?: string[];
  /** 날짜 컬럼 자동생성 활성화 여부 */
  disabledAutoDateColumn?: boolean;

  /** 강제 리렌더링 */
  forceRerender?: any;

  /** 모달에 새로 버튼을 추가합니다. */
  extraButtons?: TGridExtraButtons[];
  saveOptionParams?: any;

  onClick?: (ev) => void;
  onDblclick?: (ev) => void;
  onCheck?: (ev) => void;
  onUncheck?: (ev) => void;
  onCheckAll?: (ev) => void;
  onUncheckAll?: (ev) => void;

  onAfterUnfilter?: (ev) => void;
  onAfterFilter?: (ev) => void;
  onAfterClick?: (ev) => void;
  onAfterChange?: (ev) => void;
  onAfterKeyDown?: (ev) => void;

  onOk?: (ev) => void;
}

/** 그리드 summary를 세팅하기 위한 커스텀 옵션 입니다. */
export interface IGridSummaryOptions {
  position?: 'top' | 'bottom';
  avgColumns?: string[];
  cntColumns?: string[];
  filteredColumns?: string[];
  minColumns?: string[];
  maxColumns?: string[];
  textColumns?: {
    columnName: string;
    content: string | HTMLElement;
  }[];
  sumColumns?: string[];
}

export interface IGridColumn extends ColumnOptions {
  alias?: string;
  format?:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'time'
    | 'check'
    | 'radio'
    | 'combo'
    | 'popup'
    | 'button'
    | 'tag'
    | 'file'
    | 'percent'
    | 'dateym'
    | 'multi-select';
  editable?: boolean;
  noSave?: boolean;
  requiredField?: boolean;

  /** 저장시 문자열 공백일 경우 제외 됨 */
  disableStringEmpty?: boolean;
  options?: { [key: string]: any };
  decimal?: number;
  unit?: string;

  /** 컬럼 셀의 기본값 설정 */
  defaultValue?: any | ((props: IDatagridProps, ev?) => any);

  formula?: {
    targetColumnName?: string;
    targetColumnNames?: string[];
    resultColumnName: string;
    formula?: (formulaParams: TFormulaParam, props?: IDatagridProps) => any;
  };

  hiddenCondition?: (props?: IDatagridProps) => boolean;
  disableCondition?: (props?: IDatagridProps) => boolean;
  editableCondition?: (props?: IDatagridProps) => boolean;
}

export type TFormulaParam = {
  columnName: string;
  value: any;
  targetColumnName: string;
  targetValue: any;
  targetColumnNames?: string[];
  targetValues?: {};
  rowKey?: number;
  gridRef?: any;
};

/** 그리드 모드 타입 */
export type TGridMode =
  | 'view'
  | 'select'
  | 'multi-select'
  | 'create'
  | 'update'
  | 'delete';

export type TGridExtraButtons = {
  buttonProps?: IButtonProps;
  buttonAction?: (ev, props?, options?) => void;
  align?: 'left' | 'right';
};

/** 그리드 수정 동작 코드 */
export const EDIT_ACTION_CODE = {
  CREATE: 'C',
  UPDATE: 'U',
  DELETE: 'D',
  SELECT: 'S',
};

/** 그리드 특정 컬럼 코드 */
export const COLUMN_CODE = {
  EDIT: '_edit',
  ATTRIBUTE: '_attributes',
  CHECK: '_checked',
};
export const COLUMN_NAME = {
  EDIT: '구분',
  ATTRIBUTE: '속성',
  CHECK: '체크박스',
};

/** 그리드 수정이력 인터페이스 */
export interface IGridModifiedRows extends ModifiedRows {}

/** IGridPopupInfo인터페이스에서 컬럼정보를 다룰 인터페이스 */
export interface IGridPopupColumnInfo {
  /** 기존 컬럼명 */
  original: string;

  /** 팝업에서 사용되는 컬럼명 */
  popup: string;
}

/** IGridComboInfo인터페이스에서 컬럼정보를 다룰 인터페이스 */
export interface IGridComboColumnInfo {
  /** 숨긴 값과 연결될 컬럼명 */
  codeColName: {
    original: string;
    popup: string;
  };

  /** 보여줄 값과 연결될 컬럼명 */
  textColName: {
    original: string;
    popup: string;
  };
}

/** IGridComboInfo에서 comboItemLists속성의 인터페이스 (콤보 데이터 타입) */
export interface IGridComboItem {
  /** 숨을 값 */
  code: string;

  /** 보여줄 값 */
  text: string;
  value?: string;
}

/** 콤보박스 함수 리턴타입 */
export type TGridComboItems = IGridComboItem[];

/** 그리드 팝업 정보 객체 리스트 타입 */
export type TGridPopupInfos = IGridPopupInfo[];

/** 그리드 콤보박스 정보 객체 리스트 타입 */
export type TGridComboInfos = IGridComboInfo[];

/** IGridPopupInfo의 콤보박스 버전, 해당 컬럼 셀의 콤보박스를 세팅하기 위해 사용될 인터페이스 */
export interface IGridComboInfo {
  /** 컬럼명 배열 */
  columnNames: IGridComboColumnInfo[];

  /** 콤보박스 값 배열 */
  itemList?: IGridComboItem[];

  dataApiSettings?: TApiSettings | ((ev?: GridEventProps) => TApiSettings);
}

/** 그리드 더블클릭시 호출할 팝업의 정보를 다룰 인터페이스 */
export interface IGridPopupInfo {
  /** 상단 제목 */
  modalProps?: IModalProps;

  /** 컬럼명 배열 */
  columnNames: IGridPopupColumnInfo[];

  /** 호출할 팝업의 키값 */
  popupId?: string;

  /** 부모 그리드의 아이디 */
  parentGridId?: string;

  data?: any[];

  popupKey?: TPopupKey;

  dataApiSettings?: TApiSettings | ((ev?: GridEventProps) => TApiSettings);

  columns?: IGridColumn[];

  gridMode: TGridMode;
  // // /** OK버튼 클릭시 실행할 이벤트 유형 */
  // actionType?: TGridPopupAction;
}

type TApiOkEvent = {
  popupGrid: any;
  parentGrid: any;
  ev: GridEventProps;
};
export type TApiSettings = {
  /** 모달 커스텀 */
  modalProps?: IModalProps;
  /** API 요청 포인트 */
  uriPath?: string;
  /** API 요청 파라미터 */
  params?: object;
  /** 데이터 직접 설정 */
  setData?: (value: React.SetStateAction<any[]>) => void;
  /** API 요청 여부를 결정하는 callback함수 */
  onInterlock?: () => boolean;
  onBeforeOk?: (options: TApiOkEvent, checkedRows) => boolean;
  onAfterOk?: (options: TApiOkEvent, checkedRows) => void;
};

export interface GridInstanceReference<GridInstance> {
  current: GridInstance;
}
