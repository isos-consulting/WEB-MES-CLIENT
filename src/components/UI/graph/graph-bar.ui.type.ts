type BarGraphPlugins = {
  legend: {
    position: 'top' | 'left' | 'right' | 'bottom' | 'center' | 'chartArea';
  };
  title: {
    display: boolean;
    text: string;
  };
};

type BarGraphOptions = {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins: BarGraphPlugins;
  onClick?: (event: any, elements: any) => void;
};

export type BarGraphData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

export interface BarGraphProps {
  options: BarGraphOptions;
  data: BarGraphData;
  dataKeys: string[];
}
