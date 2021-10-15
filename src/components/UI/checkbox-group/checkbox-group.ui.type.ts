import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import ICheckboxProps from '../checkbox/checkbox.ui.type';


/** 그룹 체크박스 컴포넌트 속성 인터페이스 */
export default interface ICheckboxGroupProps {
  /** 체크박스 그룹 아이디 */
  id: string;

  name?: string;

  defaultValue?: any;
  
  /** 체크박스 라벨 */
  label?: string;

  /** 전체 체크박스 생성 허용 */
  allCheckedable?: boolean;

  /** 체크박스 배열 */
  options: ICheckboxItem[];

  /** 중요 여부 */
  important?: boolean;

  /** 비허용(잠금) */
  disabled?: boolean;
  
  /** 체크박스 값 변경 이벤트 */
  onChange?: (e?: CheckboxValueType[]) => void;
}


/** 그룹 체크박스 아이템 속성 인터페이스 */
export interface ICheckboxItem extends Omit<ICheckboxProps<CheckboxChangeEvent>,'checked' | 'onChange' | 'indeterminate'> {}
