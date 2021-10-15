/** 폼 아이템 속성 인터페이스 */
export default interface IFormItemProps {
  /** 폼 아이템 이름 */
  name:string;

  /** 라벨 */
  label:string;

  /** 필수 여부 */
  required:boolean;
  
  /** 필수 값인데 빈값일 경우 표시될 메시지 */
  requireMessage:string;

  /** 내용 */
  children?:any; //❗
}