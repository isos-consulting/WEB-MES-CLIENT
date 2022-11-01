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
  responsive: boolean;
  plugins: BarGraphPlugins;
};

type BarGraphData = {
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
}
