import { FormikErrors, FormikValues } from 'formik';
import { IInputGroupboxItem } from '../input-groupbox/input-groupbox.ui';
// import {IInputUiGroupItem} from '../input-ui-groupbox/input-ui-groupbox.ui.type';


/** 검색조건 박스 속성 인터페이스 */
export default interface ISearchboxProps extends ISearchboxStyles {
  id: string;
  /** 검색조건 배열 */
  searchItems?: ISearchItem[] | undefined;
  innerRef?: any;

  title?:string;

  /** 검색 버튼 클릭 이벤트 */
  onSearch?: (searchParams?) => void;
  validate?: (values?: any) => Promise<FormikErrors<FormikValues>>;
};

/** 검색조건 스타일 인터페이스 */
export interface ISearchboxStyles {
  boxShadow?: boolean;
}

export interface ISearchItem extends IInputGroupboxItem {};
