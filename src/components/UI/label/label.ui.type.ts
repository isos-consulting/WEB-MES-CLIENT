/** 라벨 속성 인터페이스 */
export default interface ILabelProps {
  /** 라벨 아이디 */
  id?: string;

  /** 라벨 글자 */
  text?: string;

  /** 중요 여부 */
  important?: boolean;

  width?: number;
}
