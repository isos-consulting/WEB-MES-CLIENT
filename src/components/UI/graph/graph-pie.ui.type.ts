/** 파이 그래프 속성 인터페이스 */
export default interface IPieGraphProps {
  /** 그래프 데이터 */
  data?: TPieData[];

  /** 그래프 최대값 */
  maxVal?: number;
  radialLabel: any;
  theme?: any;
  margin?: any;
  innerRadius?: number;
  valueFormat?: any;
  colors?: string;
  borderWidth?: number;
  isInteractive?: boolean;
  radialLabelsSkipAngle?: number;
  radialLabelsTextColor?: string;
  sliceLabelsRadiusOffset?: number;
  sliceLabelsSkipAngle?: number;
  sliceLabelsTextColor?: string;
  centerStr?: string;
  padAngle?: number;
  cornerRadius?: number;
  borderColor?: {
    from: string;
    modifiers: (string | number)[][];
  };
  radialLabelsLinkColor?: {
    from: string;
  };
}

export type TPieData = {
  id?: string;
  label?: string;
  value: number;
  color?: string;
  unit?: number;
};
