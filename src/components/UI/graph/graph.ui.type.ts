/** 그래프 속성 인터페이스 */
export default interface IGraphProps {
  /** 그래프 아이디 */
  id?: string;

  /** 그래프 유형 */
  graphType: 
  | "Bar" 
  | "Bubble" 
  | "Line" 
  | "Pie" 
  | "Calendar" 
  | "Bump";

  /** 그래프 표현 유형 (그룹 | 간트) */
  groupMode?: 'grouped' | 'stacked';

  /** 그래프 레이아웃 유형 (정렬 방향) */
  layout?: 'vertical' | 'horizontal';

  /** 그래프 데이터 */
  data?: object[];

  /** 데이터를 가져올 서버 end point */
  dataUriPath?: string;

  /** ❗ */
  dataKeys: string[];

  /** ❗ */
  dataKeysName?: string[];

  /** x축 범례 */
  axisBottom?: string;

  /** x축 범례 기울기 */
  axisBottomRotation?:number;

  /** y축 범례 */
  axisLeft?: string;

  /** y축 범례 값 */
  indexBy: string;

  /** 그래프 고정 높이 */
  height?: number;

  /** 하단 여백 */
  bottomMargin?: number;
}