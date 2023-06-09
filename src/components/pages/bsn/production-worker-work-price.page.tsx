import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Container, Datagrid, layoutStore, Searchbox } from '~/components/UI';
import { getToday } from '~/functions';
import { isNil } from '~/helper/common';
import { BsnProductionOrderWorkRateChart } from './production/bsn-production-order-work-rate-chart';
import {
  getDailyProductionWorkerWorkPrices,
  getMonthlyProductionWorkerWorkPrices,
  getWeeklyProductionWorkerWorkPrices,
} from './production/bsn-production-worker-work-price-apis';
import { BsnProductionWorkerWorkPriceService } from './production/bsn-production-worker-work-price-service';

export const PgPrdBsnProductionWorkerWorkPrice = () => {
  const emptyKpiData = BsnProductionWorkerWorkPriceService.emptyData();
  const [layoutState] = useRecoilState(layoutStore.state);
  const [isRefreshGraph, toggleRefreshGraph] = useState(true);
  const [weekLabel, setWeekLabel] = useState([]);
  const [dateLabel, setDateLabel] = useState([]);
  const [yearData, setYearData] = useState(emptyKpiData);
  const [monthColumns, setMonthColumns] = useState([]);
  const [weekColumns, setWeekColumns] = useState([]);
  const [weekData, setWeekData] = useState(emptyKpiData);
  const [dateFirstHalfColumns, setDateFirstHalfColumns] = useState([]);
  const [dateLastHalfColumns, setDateLastHalfColumns] = useState([]);
  const [dateData, setDateData] = useState(emptyKpiData);

  const setDataGridColumns = month => {
    const service = new BsnProductionWorkerWorkPriceService(month);

    setMonthColumns(service.monthColumn());
    setWeekColumns(service.weekColumn());
    setDateFirstHalfColumns(service.firstHalfDateColumn());
    setDateLastHalfColumns(service.lastHalfDateColumn());
  };

  const setGraphLabels = month => {
    const service = new BsnProductionWorkerWorkPriceService(month);

    setWeekLabel(service.weekGraphLabel());
    setDateLabel(service.dateGraphLabel());
  };

  const setDataGridData = async month => {
    const service = new BsnProductionWorkerWorkPriceService(month);

    const monthlyProductionOrderWorkRate =
      await getMonthlyProductionWorkerWorkPrices(month);

    const weeklyProductionOrderWorkRate =
      await getWeeklyProductionWorkerWorkPrices(month);

    const dailyProductionOrderWorkRate =
      await getDailyProductionWorkerWorkPrices(month);

    if (isNil(monthlyProductionOrderWorkRate)) {
      setYearData(emptyKpiData);
    } else {
      setYearData(service.monthData(monthlyProductionOrderWorkRate));
    }

    if (isNil(weeklyProductionOrderWorkRate)) {
      setWeekData(emptyKpiData);
    } else {
      setWeekData(service.weekData(weeklyProductionOrderWorkRate));
    }

    if (isNil(dailyProductionOrderWorkRate)) {
      setDateData(emptyKpiData);
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
            graphLabels={BsnProductionWorkerWorkPriceService.monthGraphLabel()}
            graphData={BsnProductionWorkerWorkPriceService.monthGraphData(
              yearData[2],
            )}
            graphTitle="월별"
            graphWidth="30%"
            graphDataLabel="인당금액"
            refreshFlag={isRefreshGraph}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={weekLabel}
            graphData={BsnProductionWorkerWorkPriceService.weekGraphData(
              weekData[2],
            )}
            graphTitle="주별"
            graphDataLabel="인당금액"
            graphWidth="20%"
            refreshFlag={isRefreshGraph}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={dateLabel}
            graphData={BsnProductionWorkerWorkPriceService.dateGraphData(
              dateData[2],
            )}
            graphTitle="일별"
            graphDataLabel="인당금액"
            graphWidth="50%"
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
