import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

export const PieChart = ({ data }: { data: PieData }) => {
  return (
    <Pie
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
        },
      }}
      data={data}
    />
  );
};
