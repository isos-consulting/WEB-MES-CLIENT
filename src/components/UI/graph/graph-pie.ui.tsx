import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import Props from './graph-pie.ui.type';
import { ScPieGraph } from './graph-pie.ui.styled';
import { setNumberToDigit } from '~functions/util.function';

/** 파이 그래프 */
export default props => {
  const responseivePieProps = {
    theme: props.theme || {
      fontSize: 14,
      fontFamily: 'Noto Sans CJK KR',
    },
    data: props.data || [],
    margin: props.margin || { top: 10, right: 10, bottom: 10, left: 10 },
    padAngle: 0,
    cornerRadius: 0,
    innerRadius: props.innerRadius || 0.4,
    sortByValue: false,
    valueFormat: props.valueFormat,
    colors: props.colors || [
      '#788EE0',
      '#6EE0B6',
      '#3BC7D6',
      '#E1E0A5',
      '#4CACDE',
      '#ACE6AA',
      '#CDE0BD',
      '#4CDBD3',
      '#EDCE9C',
    ],
    borderWidth: props.borderWidth || 1,
    isInteractive: props.isInteractive || false,
    radialLabelsSkipAngle: props.radialLabelsSkipAngle || 10,
    radialLabelsTextColor: props.radialLabelsTextColor || '#212121',
    sliceLabelsRadiusOffset: props.sliceLabelsRadiusOffset || 0.7,
    sliceLabelsSkipAngle: props.sliceLabelsSkipAngle || 10,
    enableSliceLabels: false,
    enableRadialLabels: false,
    enableArcLabels: false,
    enableArcLinkLabels: false,
    sliceLabelsTextColor: props.sliceLabelsTextColor || '#212121',
    radialLabel:
      props.radialLabel ||
      function (e) {
        return e.id;
      },
  };
  return (
    <div style={ScPieGraph.root as object}>
      <span
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          flexDirection: 'column',
          pointerEvents: 'none',
          fontSize: 16,
        }}
      >
        {props?.centerStr}
      </span>
      <ResponsivePie {...responseivePieProps} />
      {props.maxVal != 0 ? (
        <div style={ScPieGraph.overlay as object}>
          <span style={ScPieGraph.totalLabel}>Total</span>
          <span>{setNumberToDigit(props.maxVal)}</span>
        </div>
      ) : (
        ''
      )}
    </div>
  ) as React.FC<Props>;
};
