/** 스위치 Props 타입 */
export default interface ISwitchProps {
  /** 스위치 아이디 */
  id?: string;

  /** 사이즈 유형 */
  size?: 'default' | 'small';

  /** 스위치가 켜진 상태일때 표시될 문자 */
  checkedChildren?: string;

  /** 스위치가 꺼진 상태일때 표시될 문자 */
  unCheckedChildren?: string;

  /** 기본 값 */
  defaultChecked?: boolean;

  /** 값 변경 이벤트 */
  onChange?: (checked: boolean, event: MouseEvent) => void;
}
