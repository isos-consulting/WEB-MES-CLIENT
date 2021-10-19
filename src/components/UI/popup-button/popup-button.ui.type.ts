import Grid from '@toast-ui/react-grid';
import { MutableRefObject } from 'react';
import { IDatagridProps } from '../datagrid-new';
import { IModalProps } from '../modal';
import { TPopupKey } from '../popup/popup.ui.model';


/** 팝업 호출 버튼 속성 인터페이스 */
export default interface IPopupButtonProps {
   /** 버튼 아이디 */
  id?: string;

  /** 호출될 팝업 폼의 키 값 */
  popupKey?: TPopupKey;

  /** 값을 선택해서 가져올때 실제로 가져올 key의 이름 */
  popupKeys: string[];

  /** 비허용(잠금) 여부 */
  disabled?: boolean;

  ref?: MutableRefObject<Grid>;

  params?: object;

  /** 팝업키가 없는 경우 직접 요청옵션을 세팅 */
  dataApiSettings?: {
    uriPath: string;
    params: object;
  }

  /** 팝업내에 데이터그리드 정보를 세팅합니다. (popupKey보다 높은 우선순위로 작동합니다.) */
  datagridSettings?: IDatagridProps;

  /** 팝업 정보를 세팅합니다. (popupKey보다 높은 우선순위로 작동합니다.) */
  modalSettings?: IModalProps;

  /** 첫줄에 빈칸 생성 */
  firstItemEmpty?: boolean;

  setValues?: (values: any, shouldValidate?: boolean) => void
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  handleChange?: (value) => void;
}