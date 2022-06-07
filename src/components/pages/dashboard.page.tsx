import React, { useLayoutEffect, useState } from 'react';
import { getData } from '~/functions';
import { Card, Col, Row } from 'antd';
import { BarGraph, PieGraph } from '~components/UI/graph';
import { URL_PATH_DAS } from '~/enums';
import dayjs from 'dayjs';
import Meta from 'antd/lib/card/Meta';
import LineChart from '../UI/graph/chart-line.ui';

const dailyApiMock = () =>
  new Promise(res =>
    res({
      daily: [
        {
          label: '매입금액',
          data: [
            {
              y: 1,
              x: '월',
            },
            {
              y: 10,
              x: '화',
            },
            {
              y: 0,
              x: '수',
            },
            {
              y: 0,
              x: '목',
            },
            {
              y: 0,
              x: '금',
            },
            {
              y: 0,
              x: '토',
            },
            {
              y: 0,
              x: '일',
            },
          ],
          borderColor: '#788ee0',
        },
        {
          label: '매출금액',
          data: [
            {
              y: 0,
              x: '월',
            },
            {
              y: 5,
              x: '화',
            },
            {
              y: 10,
              x: '수',
            },
            {
              y: 6,
              x: '목',
            },
            {
              y: 0,
              x: '금',
            },
            {
              y: 0,
              x: '토',
            },
            {
              y: 0,
              x: '일',
            },
          ],
          borderColor: '#fe4762',
        },
      ],
      monthly: [
        {
          label: '매입금액',
          data: [
            {
              y: 1,
              x: '1월',
            },
            {
              y: 10,
              x: '2월',
            },
            {
              y: 0,
              x: '3월',
            },
            {
              y: 0,
              x: '4월',
            },
            {
              y: 0,
              x: '5월',
            },
            {
              y: 0,
              x: '6월',
            },
            {
              y: 0,
              x: '7월',
            },
            {
              y: 0,
              x: '8월',
            },
            {
              y: 0,
              x: '9월',
            },
            {
              y: 0,
              x: '10월',
            },
            {
              y: 0,
              x: '11월',
            },
            {
              y: 0,
              x: '12월',
            },
          ],
          borderColor: '#788ee0',
        },
        {
          label: '매출금액',
          data: [
            {
              y: 0,
              x: '1월',
            },
            {
              y: 5,
              x: '2월',
            },
            {
              y: 16,
              x: '3월',
            },
            {
              y: 4,
              x: '4월',
            },
            {
              y: 3,
              x: '5월',
            },
            {
              y: 2,
              x: '6월',
            },
            {
              y: 8,
              x: '7월',
            },
            {
              y: 10,
              x: '8월',
            },
            {
              y: 7,
              x: '9월',
            },
            {
              y: 2,
              x: '10월',
            },
            {
              y: 10,
              x: '11월',
            },
            {
              y: 10,
              x: '12월',
            },
          ],
          borderColor: '#fe4762',
        },
      ],
      yearly: [
        {
          label: '매입금액',
          data: [
            {
              y: 1,
              x: '2011',
            },
            {
              y: 10,
              x: '2012',
            },
            {
              y: 0,
              x: '2013',
            },
            {
              y: 0,
              x: '2014',
            },
            {
              y: 0,
              x: '2015',
            },
            {
              y: 0,
              x: '2016',
            },
            {
              y: 0,
              x: '2017',
            },
            {
              y: 0,
              x: '2018',
            },
            {
              y: 0,
              x: '2019',
            },
            {
              y: 0,
              x: '2020',
            },
            {
              y: 0,
              x: '2021',
            },
            {
              y: 0,
              x: '2022',
            },
          ],
          borderColor: '#788ee0',
        },
        {
          label: '매출금액',
          data: [
            {
              y: 150,
              x: '2011',
            },
            {
              y: 500,
              x: '2012',
            },
            {
              y: 160,
              x: '2013',
            },
            {
              y: 400,
              x: '2014',
            },
            {
              y: 130,
              x: '2015',
            },
            {
              y: 200,
              x: '2016',
            },
            {
              y: 80,
              x: '2017',
            },
            {
              y: 100,
              x: '2018',
            },
            {
              y: 754,
              x: '2019',
            },
            {
              y: 200,
              x: '2020',
            },
            {
              y: 1000,
              x: '2021',
            },
            {
              y: 100,
              x: '2022',
            },
          ],
          borderColor: '#fe4762',
        },
      ],
    }),
  );

const realTimeAPIMock = () =>
  new Promise(res =>
    res([
      { title: '설비가동율', value: '70', color: '#788EE0', unit: '%' },
      { title: '불량율', value: '10', color: '#fe4762', unit: '%' },
      { title: '생산진척율', value: '45', color: '#ff8b0a', unit: '%' },
    ]),
  );

export const Dashboard = () => {
  const [current, chageTarget] = useState<string>('daily');
  const graphSets = dailyApiMock();
  const chartSets = realTimeAPIMock();
  const [totalGraphDataSets, setTotalGraphDataSets] = useState<object>([]);
  const [realTimeChartDataSets, setRealTimeChartDataSets] = useState<object>(
    [],
  );

  useLayoutEffect(() => {
    graphSets.then(res => setTotalGraphDataSets(res[current]));
    chartSets.then(setRealTimeChartDataSets);
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
                      chageTarget('daily');
                    }}
                  >
                    일별
                  </button>
                  <button
                    onClick={() => {
                      chageTarget('monthly');
                    }}
                  >
                    월별
                  </button>
                  <button
                    onClick={() => {
                      chageTarget('yearly');
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
  const Pies = data.map(({ title, value, color, unit }) => (
    <Col key={`${title}-col`} span={8}>
      <PercentPie
        key={title}
        id={title}
        title={title}
        data={[{ value, unit }]}
        height={180}
        color={[color]}
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
  return (
    <Card headStyle={{}}>
      <Row style={{ height: height }}>
        <Col span={24} style={{ height: '100%' }}>
          <PieGraph
            maxVal={0}
            data={data}
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
