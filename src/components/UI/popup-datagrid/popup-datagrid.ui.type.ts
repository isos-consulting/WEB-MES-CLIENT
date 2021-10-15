import Grid from "@toast-ui/react-grid";
import { ModalProps } from "antd";
import { MutableRefObject } from "react";
import { IDatagridProps, IGridColumn } from "../datagrid-new";
import { IInputGroupboxProps } from "../input-groupbox/input-groupbox.ui";
import ISearchboxProps from "../searchbox/searchbox.ui.type";


/** 그리드 팝업 속성 인터페이스 */
export default interface IGridPopupProps extends ModalProps, IDatagridProps {
  /** 모달 아이디 */
  popupId: string;

  /** 모달 제목 */
  title?: string;

  /** 모달 너비 */
  width?: number;

  /** 그리드 reference (그리드DOM 접근 매개체) */
  ref?: MutableRefObject<Grid>;

  /** 그리드 초기 값 */
  defaultData?: any[];

  /** 팝업의 기본 visible 상태 값 (기본값:false) */
  defaultVisible?: boolean;

  /** 조회할 api의 uri path */
  searchUriPath?: string;

  /** 저장할 api의 uri path */
  saveUriPath: string;

  /** 저장할때 같이 저장시킬 데이터 */
  saveOptionParams?: object;

  /** 조회할 때 조회조건 */
  searchParams?: object;

  /** 부모 그리드의 데이터를 변경하는 함수 */
  setParentData?: (data:any) => void;

  /** 그리드 컬럼 */
  columns: IGridColumn[];

  /** 부모의 그리드 reference */
  parentGridRef?: MutableRefObject<Grid>;

  /** 저장 방식 */
  saveType: 'basic' | 'headerInclude';

  /** 입력그룹상자 내용 */
  inputProps?: IInputGroupboxProps | IInputGroupboxProps[];

  /** 검색상자 내용 */
  searchProps?: ISearchboxProps;

  onAfterOk?: (success:boolean, savedData?:any) => void;
}