import { RadioChangeEvent } from "antd";


/** 라디오 버튼 속성 인터페이스 */
export default interface IRadioProps {
  /** 라디오 아이디 */
  id?: string;

  /** 라벨 */
  label?: string;

  /** 숨을 값 */
  code: string;

  value?: string;

  /** 보여줄 값 */
  text: string;

  /** 초기 값 */
  defaultChecked?: boolean;

  /** 중요 여부 */
  important?: boolean;

  /** 비허용(잠금)여부 */
  disabled?: boolean;

  /** 값 변경 이벤트 */
  onChange?: (e: RadioChangeEvent) => void;
}