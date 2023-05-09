import React, { useEffect, useState } from 'react';
import { BarGraph, BarGraphData, PieGraph } from '../graph';
import { Container } from '../container';
import Props from './graph.ui.type';

/**
 * 그래프
 * @param Props
 */
const Graph: React.FC<Props> = props => {
  const [data, setDatas] = useState([]);

  useEffect(() => {
    if (props.data && props.data.length > 0 && props.dataKeysName) {
      let datas = JSON.parse(JSON.stringify(props.data));

      let cloneObj = null;
      let targetValue = null;
      let cloneData = [];

      let oldKeys = props.dataKeys;
      let newkeys = props.dataKeysName;

      //템플릿에 맞는 데이터로 key, value를 치환하여 가공
      for (let i = 0; i < datas.length; i++) {
        cloneObj = datas[i];
        for (let z = 0; z < oldKeys.length; z++) {
          targetValue = cloneObj[oldKeys[z]];
          delete cloneObj[oldKeys[z]];
          cloneObj[newkeys[z]] = targetValue;
        }
        cloneData.push(cloneObj);
      }
      setDatas(cloneData);
    } else {
      setDatas(props.data);
    }
  }, [props.data]);

  const getGraph = () => {
    switch (props.graphType) {
      case 'Bar':
        return (
          <BarGraph
            options={{
              plugins: {
                legend: { position: 'bottom' },
                title: { display: false, text: '' },
              },
            }}
            {...props}
            data={data as unknown as BarGraphData}
            dataKeys={props.dataKeysName ? props.dataKeysName : props.dataKeys}
          />
        );
      case 'Pie':
        let sumData: number;
        let pieData = [];
        let sumDataList = [];
        if (data) {
          sumDataList = data.map(v => v[props.dataKeys[0]]);

          sumData = sumDataList.reduce(function add(sum, currValue) {
            return sum + currValue;
          }, 0);
          pieData = data.map(v => ({
            id: v[props.indexBy] + '( ' + v[props.dataKeys[1]] + ' %)',
            value: v[props.dataKeys[0]],
          }));
        } else {
          pieData = [];
          sumData = 0;
        }

        return (
          <PieGraph
            radialLabel={{}}
            {...props}
            data={pieData}
            maxVal={sumData}
          />
        );
      default:
        return (
          <BarGraph
            options={{
              plugins: {
                legend: { position: 'bottom' },
                title: { display: false, text: '' },
              },
            }}
            {...props}
            data={data as unknown as BarGraphData}
          />
        );
    }
  };

  if (props.data ? props.data.length === 0 : true) {
    return (
      <Container>
        <div
          style={{
            display: 'table',
            position: 'relative',
            width: '100%',
            height: props.height || '100%',
          }}
        >
          <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
            <div style={{ display: 'block', margin: '0 auto', width: '150px' }}>
              Data not found
            </div>
          </div>
        </div>
      </Container>
    );
  } else {
    return <div style={{ height: props.height || '100%' }}>{getGraph()}</div>;
  }
};

export default Graph;
