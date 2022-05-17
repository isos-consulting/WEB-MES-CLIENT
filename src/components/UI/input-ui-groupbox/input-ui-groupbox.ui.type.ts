import React from 'react';
import { TGridMode } from '../datagrid-new/datagrid.ui.type';
import { TPopupKey } from '../popup/popup.ui.model';

/** 컴포넌트 그룹박스 속성 인터페이스 */
export default interface IInputUiGroupboxProps {
  /** 그룹 상태 */
  insertType?: TGridMode;

  /** 컴포넌트 배열 */
  inputItems: IInputUiGroupItem[];

  /** 검색 버튼 클릭 이벤트 */
  onSearch?: (e?: React.MouseEvent<HTMLElement>) => void;
}

/** 컴포넌트 그룹박스 아이템 속성 인터페이스 */
export interface IInputUiGroupItem {
  id: string | string[];
  name?: string;
  label?: string;
  type?: 'text' | 'check' | 'combo' | 'date' | 'dateRange' | 'popup' | 'radio';

  code?: string;
  value?: any;
  options?: any;
  important?: boolean;
  placeholder?: string | string[];
  defaultValue?: any;
  picker?: any;
  format?: string;
  popupKey?: TPopupKey;
  insertable?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  dataSettingOptions?:
    | { uriPath: string; params?: object }
    | { uriPath: string; params?: object; codeName: string; textName: string };
}
