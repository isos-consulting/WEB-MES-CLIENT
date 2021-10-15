/** 상단바 속성 인터페이스 */
export default interface IHeaderProps {
  /** 상단바 고정 높이 */
  height: number;

  /** 상단바 제목 */
  title?: string;
  
  /** 상단바 부제목(설명) */
  description?: string;
}