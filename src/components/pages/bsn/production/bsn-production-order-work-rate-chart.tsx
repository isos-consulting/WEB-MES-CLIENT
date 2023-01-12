import React from 'react';
import styled from 'styled-components';
import { BarGraph } from '~/components/UI';
import { isNumber } from '~/functions';

const convertGraphWidth = (graphWidth: string) => {
  if (isNumber(graphWidth)) {
    return `${graphWidth}px`;
  }

  return graphWidth;
};

const BarChartWrapper = styled('div')`
  height: Calc(37vh - 61px);
  position: relative;
  ${({ graphWidth }) => {
    const width = convertGraphWidth(graphWidth);
    return `
      width: ${width};
    `;
  }}
`;

export const BsnProductionOrderWorkRateChart = ({
  graphLabels,
  graphData,
  graphTitle,
  graphWidth,
  isDecrease,
}) => {
  const decrease = isDecrease ? 'decrease' : '';

  return (
    <BarChartWrapper graphWidth={graphWidth}>
      <BarGraph
        key={decrease}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: graphTitle },
          },
        }}
        data={{
          labels: graphLabels,
          datasets: [
            {
              label: '달성율',
              data: graphData,
              backgroundColor: 'blue',
            },
          ],
        }}
      />
    </BarChartWrapper>
  );
};
