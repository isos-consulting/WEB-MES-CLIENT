import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Container, Datagrid, layoutStore, Searchbox } from '~/components/UI';
import { getToday } from '~/functions';
import { isNil } from '~/helper/common';
import {
  getDailyProductionOrderWorkRate,
  getMonthlyProductionOrderWorkRate,
  getWeeklyProductionOrderWorkRate,
} from './production/bsn-production-order-work-rate-apis';
import { BsnProductionOrderWorkRateChart } from './production/bsn-production-order-work-rate-chart';
import { BsnProductionOrderWorkRateService } from './production/bsn-production-order-work-rate-service';

export const PgBsnProductionOrderWorkRate = () => {
  const [layoutState] = useRecoilState(layoutStore.state);
  const [isRefreshGraph, toggleRefreshGraph] = useState(true);
  const [weekLabel, setWeekLabel] = useState([]);
  const [dateLabel, setDateLabel] = useState([]);
  const [yearData, setYearData] = useState(
    BsnProductionOrderWorkRateService.emptyData(),
  );
  const [monthColumns, setMonthColumns] = useState([]);
  const [weekColumns, setWeekColumns] = useState([]);
  const [weekData, setWeekData] = useState(
    BsnProductionOrderWorkRateService.emptyData(),
  );
  const [dateFirstHalfColumns, setDateFirstHalfColumns] = useState([]);
  const [dateLastHalfColumns, setDateLastHalfColumns] = useState([]);
  const [dateData, setDateData] = useState(
    BsnProductionOrderWorkRateService.emptyData(),
  );

  const setDataGridColumns = month => {
    const service = new BsnProductionOrderWorkRateService(month);

    setMonthColumns(service.monthColumn());
    setWeekColumns(service.weekColumn());
    setDateFirstHalfColumns(service.firstHalfDateColumn());
    setDateLastHalfColumns(service.lastHalfDateColumn());
  };

  const setGraphLabels = month => {
    const service = new BsnProductionOrderWorkRateService(month);

    setWeekLabel(service.weekGraphLabel());
    setDateLabel(service.dateGraphLabel());
  };

  const setDataGridData = async month => {
    const service = new BsnProductionOrderWorkRateService(month);

    const monthlyProductionOrderWorkRate =
      await getMonthlyProductionOrderWorkRate(month);

    const weeklyProductionOrderWorkRate =
      await getWeeklyProductionOrderWorkRate(month);

    const dailyProductionOrderWorkRate = await getDailyProductionOrderWorkRate(
      month,
    );

    if (isNil(monthlyProductionOrderWorkRate)) {
      setYearData(BsnProductionOrderWorkRateService.emptyData());
    } else {
      setYearData(service.monthData(monthlyProductionOrderWorkRate));
    }

    if (isNil(weeklyProductionOrderWorkRate)) {
      setWeekData(BsnProductionOrderWorkRateService.emptyData());
    } else {
      setWeekData(service.weekData(weeklyProductionOrderWorkRate));
    }

    if (isNil(dailyProductionOrderWorkRate)) {
      setDateData(BsnProductionOrderWorkRateService.emptyData());
    } else {
      setDateData(service.dateData(dailyProductionOrderWorkRate));
    }
  };

  useEffect(() => {
    const reg_month = getToday().substring(0, 7);

    setDataGridColumns(reg_month);
    setGraphLabels(reg_month);
    setDataGridData(reg_month);
  }, []);

  useEffect(() => {
    toggleRefreshGraph(layoutState.leftSpacing > 200);
  }, [layoutState.leftSpacing]);

  return (
    <>
      <Searchbox
        searchItems={[
          {
            id: 'reg_date',
            label: '생산 월',
            type: 'dateym',
            default: getToday(),
          },
        ]}
        onSearch={async ({ reg_date }: { reg_date: string }) => {
          const reg_month = reg_date.substring(0, 7);

          setDataGridColumns(reg_month);
          setGraphLabels(reg_month);
          setDataGridData(reg_month);
        }}
      />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '0px 10px',
          }}
        >
          <BsnProductionOrderWorkRateChart
            graphLabels={BsnProductionOrderWorkRateService.monthGraphLabel()}
            graphData={BsnProductionOrderWorkRateService.monthGraphData(
              yearData[2],
            )}
            graphTitle="월별"
            graphWidth="30%"
            graphDataLabel="달성율"
            refreshFlag={isRefreshGraph}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={weekLabel}
            graphData={BsnProductionOrderWorkRateService.weekGraphData(
              weekData[2],
            )}
            graphTitle="주별"
            graphWidth="20%"
            graphDataLabel="달성율"
            refreshFlag={isRefreshGraph}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={dateLabel}
            graphData={BsnProductionOrderWorkRateService.dateGraphData(
              dateData[2],
            )}
            graphTitle="일별"
            graphWidth="50%"
            graphDataLabel="달성율"
            refreshFlag={isRefreshGraph}
          />
        </div>
      </Container>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Datagrid
            columns={dateFirstHalfColumns}
            data={dateData}
            disabledAutoDateColumn={true}
            height={80}
          />
          <Datagrid
            columns={dateLastHalfColumns}
            data={dateData}
            disabledAutoDateColumn={true}
            height={80}
          />
          <Datagrid
            columns={weekColumns}
            data={weekData}
            disabledAutoDateColumn={true}
            height={80}
          />
          <Datagrid
            columns={monthColumns}
            data={yearData}
            disabledAutoDateColumn={true}
            height={80}
          />
        </div>
      </Container>
    </>
  );
};
