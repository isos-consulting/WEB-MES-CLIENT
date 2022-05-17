import { RadioChangeEvent } from 'antd';
import IRadioProps from '../radio/radio.ui.type';

/** 라디오 그룹 속성 인터페이스 */
export default interface IRadioGroupProps {
  /** 라디오 그룹 아이디 */
  id?: string;

  name?: string;

  value?: string;

  /** 라벨 */
  label?: string;

  /** 라디오 배열 */
  options?: IRadioItem[];

  /** 기본 값 */
  defaultValue?: string;

  /** 중요 여부 */
  important?: boolean;

  /** 비허용(잠금)여부 */
  disabled?: boolean;

  /** 그룹 아웃라인 표시 여부 */
  useOutline?: boolean;

  /** 값 변경 이벤트 */
  onChange?: (e: RadioChangeEvent) => void;
}

/** 라디오 그룹 아이템 속성 인터페이스 */
export interface IRadioItem extends IRadioProps {}
