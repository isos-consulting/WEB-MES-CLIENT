/** 바 그래프 속성 인터페이스 */
export default interface IBarGraphProps {
  /** 그래프 표현 유형 (그룹 | 간트) */
  groupMode?: 'grouped' | 'stacked';

  /** 그래프 레이아웃 유형 (정렬 유형) */
  layout?: 'vertical' | 'horizontal';

  /** 그래프 데이터 */
  data?:object[];

  /** ❗ */
  dataKeys:string[];

  /** x축 범례 */
  axisBottom?: string;

  /** x축 범례 기울기 */
  axisBottomRotation?:number;

  /** y축 범례 */
  axisLeft?: string;

  /** y축 기준 값 */
  indexBy: string;

  /** 하단 여백 */
  bottomMargin?: number;
}