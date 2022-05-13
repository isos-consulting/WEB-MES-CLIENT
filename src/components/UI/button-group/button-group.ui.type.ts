import IButtonProps from '../button/button.ui.type';

/** 버튼 그룹 속성 인터페이스 */
export default interface IButtonGroupProps {
  /** 버튼 그룹 아이디 */
  id?: string;

  /** 버튼 배열 */
  btnItems: IButtonGroupItem[];
}

/** 버튼 배열 구성 요소 인터페이스 */
export interface IButtonGroupItem extends IButtonProps {
  /** 버튼 개별 아이디 */
  id?: string;
}
