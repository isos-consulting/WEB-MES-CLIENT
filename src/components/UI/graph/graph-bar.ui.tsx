import React from 'react';
import { ResponsiveBar } from "@nivo/bar";
import Props from './graph-bar.ui.type';
import { setNumberToDigit } from '~functions/util.function';


/** 바 그래프 */
const BarGraph: React.FC<Props> = (props) => {
  return (
    <ResponsiveBar
      theme={{
        fontSize: 13,
        fontFamily: 'Noto Sans CJK KR'
      }}
      data={props.data || []}
      keys={props.dataKeys || []}
      indexBy={props.indexBy || ''}
      enableGridX={true}
      gridXValues={20}
      margin={{ top: 70, right: 140, bottom: (props.bottomMargin || 50), left: 100 }}
      padding={0.3}
      groupMode={props.groupMode}
      layout={props.layout || 'vertical'}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={['#3C608B', '#E0483E', '#F1A838', '#1A85B9', '#01737C']} 
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 1,
        tickPadding: 5,
        tickRotation: (props.axisBottomRotation || 0),
        legend: props.axisBottom,
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 1,
        tickPadding: 0,
        tickRotation: 0,
        legendOffset: -60,
        format: v => setNumberToDigit(v as string)
      }}
      labelSkipWidth={12}
      labelFormat={d => setNumberToDigit(d)}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 130,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 30,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{
            on: 'hover',
            style: {
                itemOpacity: 1
            }
          }]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};


export default BarGraph;