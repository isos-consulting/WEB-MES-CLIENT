import IModalProps from '../modal/modal.ui.type';
import IFormProps from '../form/form.ui.type';
import IFormItemProps from '../form-item/form-item.ui.type';


/** 입력 팝업 속성 인터페이스 */
export default interface IInputPopupProps {
  /** 모달 컴포넌트 속성 인터페이스 */
  modalProps: IModalProps;

  /** 폼 컴포넌트 속성 인터페이스 */
  formProps: IFormProps;

  /** 모달 아이템 속성 배열 */
  formItemList: IFormItemList[];
}


/** 폼 아이템 리스트 인터페이스 */
export interface IFormItemList {
  /** 폼 개별 아이디 */
  id?: string;

  name?: string;

  /** 폼 개별 입력 유형 */
  inputItemType: 'text' | 'number' |'password';

  /** 폼 개별 속성 값 */
  formItemProps: IFormItemProps;
}