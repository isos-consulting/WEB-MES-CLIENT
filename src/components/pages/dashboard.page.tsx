import React, { useLayoutEffect, useState } from 'react';
import { getData } from "~/functions";
import { Card, Col, Row, Statistic } from 'antd';
import { BarGraph, PieGraph } from '~components/UI/graph';
import { URL_PATH_DAS } from '~/enums';
import dayjs from 'dayjs';

export const Dashboard = () => {
  const [productionData, setProductionData] = useState<object>([]);
  const [qualityData, setQualityData] = useState<object>([]);
  const [delayedSalOrderData, setDelayedSalOrderData] = useState<object>([]);
  const [operatingeRateData, setOperatingeRateData] = useState<object>([]);
  const [deliveredInWeekData, setDeliveredInWeekData] = useState<object>([]);

  const onSearchDashboardDatas = async ()  => {
    await getData(null, URL_PATH_DAS.WORK_COMPARED_ORDER.GET.WORK_COMPARED_ORDER, 'raws').then((res) => {
      if (res) {
        [{"id": "id","value": 0},{"id": "make2","value": 1}]
      };
      setProductionData(res);
    });
    await getData(null, URL_PATH_DAS.PASSED_INSP_RESULT.GET.PASSED_INSP_RESULT, 'raws').then((res) => {
      setQualityData(res);
    });
    await getData(null, URL_PATH_DAS.DELAYED_SAL_ORDER.GET.DELAYED_SAL_ORDER, 'raws').then((res) => {
      setDelayedSalOrderData(res);
    });
    await getData(null, URL_PATH_DAS.OPERATING_RATE.GET.OPERATING_RATE, 'raws').then((res) => {
      setOperatingeRateData(res);
    });
    await getData(null, URL_PATH_DAS.DELIVERED_IN_WEEK.GET.DELIVERED_IN_WEEK, 'raws').then((res) => {
      const datas:object[] = res.map((el)=> {
        el['date'] = dayjs(el.date).format('YYYY-MM-DD')
        return el
      });
      setDeliveredInWeekData(res);
    });

  }

  useLayoutEffect(() => {onSearchDashboardDatas()}, []);
  
  return (
    <div>
      <Row gutter={[16,16]} >
        <Col span={6}>
          <PercentPie 
            id='work'
            title='생산실적'
            extra={<a href="#">{'상세보기 >'}</a>}
            height={180}
            data={productionData}
          />
        </Col>
        <Col span={6}>
          <PercentPie 
            id='insp'
            title='품질실적'
            extra={<a href="#">{'상세보기 >'}</a>}
            height={180}
          data={qualityData}
          />
        </Col>
        <Col span={6}>
          <Card
            title='미납현황'
            headStyle={{}}
            extra={<a href="#">{'상세보기 >'}</a>}
          >
            <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>
              <Statistic title={delayedSalOrderData[0]?.label} value={delayedSalOrderData[0]?.value} suffix={'건'} style={{height:190, textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden'}}/>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <PercentPie 
            id='equip'
            title='가동율'
            extra={<a href="#">{'상세보기 >'}</a>}
            height={180}
            data={operatingeRateData}
          />
        </Col>
      </Row>
      <Row gutter={[16,16]}>
        <Col span={24} key={'outgo'}>
          <Card
            title='출하 현황'
            headStyle={{}}
            extra={<a href="#">{'상세보기 >'}</a>}
          >
            <div style={{height:250}}>
              <BarGraph 
                data={deliveredInWeekData}
                dataKeys={['total','delivered']}
                indexBy='date'
                groupMode='grouped'
                colors={['#E0483E','#F4C2BE']}
              />
            </div>
          </Card>
          
        </Col>
      </Row>
    </div>
  )
}

type TPieData = {
  id?:string,
  label?:string,
  value?:number
}

type TPercentPie = {
  title:string,
  extra?:React.ReactNode,
  height:number,
  data:TPieData[]
}

type TStatisticData = {
  id?:string,
  title:string,
  value:number,
  unit:string
}
const PercentPie:React.FC<TPercentPie> = (props) => {
  let pieData = props.data;
  let colors:string[] =['#788EE03F'];
  let isInteractive:boolean = false;
  let centerStr:string = '0%'
  let statisticData:TStatisticData[] = []

  if (pieData?.length === 0) {
    pieData = [{id: 'None', value: 1}];
  } else {
    colors = ['#788EE0', '#788EE03F' ];
    isInteractive = true;
    if (pieData[0]?.value) {
      centerStr = (pieData[0]?.value * 100).toFixed(2) + '%'
    }
    statisticData = [
      {title: pieData[0]?.label, value: Number((pieData[0]?.value * 100).toFixed(2)), unit: '%'},
      {title: pieData[1]?.label, value: Number((pieData[1]?.value * 100).toFixed(2)), unit: '%'},
    ]
  };
  return (
    <Card
      title={props.title}
      headStyle={{}}
      extra={props.extra}>
      <Row style={{height:props.height}}>
        <Col span={16} style={{height:'100%'}}>
          <PieGraph
            maxVal={0} 
            data={pieData}
            centerStr={centerStr}
            isInteractive={isInteractive}
            valueFormat=' >-.2%'
            colors={colors} 
            padAngle={0.1}
            innerRadius={0.85}
            cornerRadius={10}
            borderWidth={0}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            radialLabelsSkipAngle={25}
            radialLabelsTextColor="#212121"
            radialLabelsLinkColor={{ from: 'color' }}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          />
        </Col>
        <Col span={8} style={{marginTop:-5, height:'100%'}}>
          <Row style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>
            {
              statisticData.length === 0 ?
              <Col span={24}>
                <h2> no data </h2>
              </Col> :
              statisticData.map((datas, index)=>{
                return(
                  <Col span={24} key={datas?.id + String(index)}>
                    <Statistic title={datas?.title} value={datas?.value} suffix={datas?.unit} style={{textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden'}}/>
                  </Col>
                )
              })
            }
          </Row>
        </Col>
      </Row>
    </Card>
  );
}