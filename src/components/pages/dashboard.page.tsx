import React, { useLayoutEffect, useState } from 'react';
import { getData, getToday } from '~/functions';
import { Card as AntdCard, Col, Row } from 'antd';
import { PieGraph } from '~components/UI/graph';
import { URL_PATH_DAS } from '~/enums';
import Meta from 'antd/lib/card/Meta';
import LineChart from '../UI/graph/chart-line.ui';

export const Dashboard = () => {
  const Card = () => AntdCard;
  const [current, chageTarget] = useState<string>('byDay');
  const graphSets = getData(
    { reg_date: getToday() },
    URL_PATH_DAS.OVERALL_STATUS.GET.OVERALL_STATUS,
  );
  const chartSets = getData(
    { reg_date: getToday() },
    URL_PATH_DAS.REALTIME_STATUS.GET.REALTIME_STATUS,
  );
  const [totalGraphDataSets, setTotalGraphDataSets] = useState<object>([]);
  const [realTimeChartDataSets, setRealTimeChartDataSets] = useState<object>(
    [],
  );

  useLayoutEffect(() => {
    graphSets.then(res => setTotalGraphDataSets(res[0][current]));
    chartSets.then(res => setRealTimeChartDataSets(res));
  }, [current]);

  return (
    <div>
      <div
        className="chart-container"
        style={{ height: '59vh', margin: '1vh', backgroundColor: '#ffffff' }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} key={'outgo'}>
            <Card
              title="종합현황"
              extra={
                <>
                  <button
                    onClick={() => {
                      chageTarget('byDay');
                    }}
                  >
                    일별
                  </button>
                  <button
                    onClick={() => {
                      chageTarget('byMonth');
                    }}
                  >
                    월별
                  </button>
                  <button
                    onClick={() => {
                      chageTarget('byYear');
                    }}
                  >
                    연도별
                  </button>
                </>
              }
              headStyle={{}}
              bodyStyle={{
                height: 'Calc(59vh - 70px)',
              }}
            >
              <LineChart
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 0,
                    },
                  },
                }}
                data={{
                  datasets: totalGraphDataSets,
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <RealTimeCharts data={realTimeChartDataSets} />
    </div>
  );
};

type TPieData = {
  id?: string;
  label?: string;
  value?: number;
};

type TPercentPie = {
  title: string;
  extra?: React.ReactNode;
  height: number;
  data: TPieData[];
};

const RealTimeCharts = ({ data }) => {
  const Card = () => AntdCard;
  const Pies = data.map(({ title, value, color, unit }) => (
    <Col key={`${title}-col`} span={8}>
      <PercentPie
        key={title}
        id={title}
        title={title}
        data={[{ value, unit }]}
        height={180}
        color={[color, '#FFFFFF']}
      />
    </Col>
  ));
  return (
    <>
      <div style={{ height: '30vh' }}>
        <Card title="실시간현황" headStyle={{}}>
          <Row gutter={[16, 16]}>{Pies}</Row>
        </Card>
      </div>
    </>
  );
};

const PercentPie: React.FC<TPercentPie> = ({ title, data, height, color }) => {
  const Card = () => AntdCard;
  return (
    <Card headStyle={{}}>
      <Row style={{ height: height }}>
        <Col span={24} style={{ height: '100%' }}>
          <PieGraph
            maxVal={0}
            data={[
              ...data,
              {
                id: Math.random() * 100,
                value: 100 - data[0].value,
              },
            ]}
            centerStr={`${data[0].value}${data[0].unit}`}
            isInteractive={false}
            valueFormat=" >-.2%"
            colors={color}
            padAngle={0.1}
            innerRadius={0.85}
            cornerRadius={10}
            borderWidth={0}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={25}
            radialLabelsTextColor="#212121"
            radialLabelsLinkColor={{ from: 'color' }}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          />
        </Col>
      </Row>
      <Meta
        title={title}
        style={{ textAlign: 'center', marginBottom: '5px' }}
      />
    </Card>
  );
};
