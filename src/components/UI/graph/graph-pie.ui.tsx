import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import Props from './graph-pie.ui.type';
import { ScPieGraph } from './graph-pie.ui.styled';
import { setNumberToDigit } from '~functions/util.function';


/** 파이 그래프 */
const PieGraph: React.FC<Props> = (props) => {
  return (
    <div style={ScPieGraph.root as object}>
      <ResponsivePie
        theme={{
          fontSize: 14,
          fontFamily: 'Noto Sans CJK KR'
        }}
        data={props.data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        padAngle={0.7}
        innerRadius={0.4}
        //sortByValue={true}
        valueFormat={setNumberToDigit}
        colors={['#788EE0', '#6EE0B6', '#3BC7D6', '#E1E0A5', '#4CACDE', '#ACE6AA', '#CDE0BD', '#4CDBD3', '#EDCE9C']} 
        borderWidth={1}
        //radialLabel={function(e){return e.id+" ("+e.value+"%)"}}
        radialLabel={function(e){return e.id}}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#212121" //#333333
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsRadiusOffset={0.7}
        sliceLabelsSkipAngle={10}
        //enableSliceLabels={false}
        sliceLabelsTextColor="#212121"   //#333333
        />
        {props.maxVal!=0 ?
          <div style={ScPieGraph.overlay as object}>
            <span style={ScPieGraph.totalLabel}>Total</span>
            <span>{setNumberToDigit(props.maxVal)}</span>
          </div>
        :''}
    </div>
  );
};


export default PieGraph;