/** 파이 그래프 속성 인터페이스 */
export default interface IPieGraphProps {
  /** 그래프 데이터 */
  data?: data[];

  /** 그래프 최대값 */
  maxVal?: number;

  radialLabel: any;
}

type data = {
  id: string;
  label: string;
  value: number;
  color?: string;
};
