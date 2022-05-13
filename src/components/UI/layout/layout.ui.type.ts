/** 레이아웃 속성 인터페이스 */
export default interface ILayoutProps {}

/** 레이아웃 여백 관련 인터페이스 */
export interface ILayoutSpacing {
  top: number;
  left: number;
  bottom?: number;
  contentSpacing?: number;
}

/** 레이아웃 내용의 여백 관련 인터페이스 */
export interface IContentProps {
  topSpacing: number;
  titleBodySpacing: number;
  wrapperSpacing: number;
  bottomSpacing: number;
}
