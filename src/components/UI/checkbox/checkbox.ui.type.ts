import { CheckboxChangeEvent } from "antd/lib/checkbox";

/** 체크박스 속성 인터페이스 */
export default interface ICheckboxProps {
  /** 체크박스 아이디 */
  id?: string;

  name?: string;
  
  /** 체크박스 라벨 */
  label?: string;

  /** 중요 여부 */
  important?: boolean;

  /** 숨은 값 */
  code?: string;

  /** 보여지는 값 */
  text?: string;

  /** 체크박스 값 */
  checked?: boolean;

  /** 초기 체크여부 */
  defaultChecked?: boolean;

  /**  ❗ */
  indeterminate?: boolean;

  /** 비허용(잠금) */
  disabled?: boolean;

  /** 체크박스 값 변경 이벤트 */
  onChange?: (e: CheckboxChangeEvent) => void;
}