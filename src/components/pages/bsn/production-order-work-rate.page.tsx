import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  Container,
  Datagrid,
  IGridColumn,
  layoutStore,
  Searchbox,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { getToday, isNumber } from '~/functions';
import {
  getRangeDateAtMonth,
  getRangeDateAtMonthForWeek,
  getWeeksAtMonth,
} from '~/functions/date.function';
import {
  getDailyProductionOrderWorkRate,
  getMonthlyProductionOrderWorkRate,
  getWeeklyProductionOrderWorkRate,
} from './production/bsn-production-order-work-rate-apis';
import { BsnProductionOrderWorkRateChart } from './production/bsn-production-order-work-rate-chart';

export const PgBsnProductionOrderWorkRate = () => {
  const [layoutState] = useRecoilState(layoutStore.state);
  const [isDecrease, toggleDecrease] = useState(true);
  const [year, setYear] = useState([]);
  const [week, setWeek] = useState([]);
  const [date, setDate] = useState([]);
  const [weekLabel, setWeekLabel] = useState([]);
  const [dateLabel, setDateLabel] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [weekColumns, setWeekColumns] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [dateFirstHalfColumns, setDateFirstHalfColumns] = useState([]);
  const [dateLastHalfColumns, setDateLastHalfColumns] = useState([]);
  const [dateData, setDateData] = useState([]);

  const fnc = async reg_month => {
    const month = Number(reg_month.substring(5, 7));

    const weeks = getWeeksAtMonth(reg_month);

    const weeksHeaders = weeks.map(week => {
      const dates = getRangeDateAtMonthForWeek(2023, month, week);

      if (dates.length > 2) {
        return `${week}주`.concat(`(${dates[0]} ~ ${dates[dates.length - 1]})`);
      }

      return `${week}주`.concat(`(${dates[0]})`);
    });

    const weeksColumns: IGridColumn[] = weeksHeaders.map((weekHeader, i) => {
      const weekKey = weeks[i] > 9 ? `${weeks[i]}` : `0${weeks[i]}`;
      return {
        header: weekHeader,
        name: weekKey,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        sortable: false,
      };
    });

    const weeklyProductionOrderWorkRate =
      await getWeeklyProductionOrderWorkRate(reg_month);

    setWeekColumns([
      {
        header: '구분',
        name: 'fg',
        width: ENUM_WIDTH.M,
        sortable: false,
      },
      ...weeksColumns,
      {
        header: '합계',
        name: 'total',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        sortable: false,
      },
    ]);
    setWeekData(
      weeklyProductionOrderWorkRate.map(
        (weekProductionOrderWorkRate, index) => {
          if (index < 2) {
            const total = Object.values<string>(
              weekProductionOrderWorkRate,
            ).reduce((acc: number, cur) => {
              if (cur == null) return acc;

              if (isNumber(cur)) return acc + Number(cur);

              return acc;
            }, 0);

            return {
              ...weekProductionOrderWorkRate,
              total,
            };
          }

          const planPrice = Object.values<string>(
            weeklyProductionOrderWorkRate[0],
          ).reduce((acc: number, cur) => {
            if (cur == null) return acc;

            if (isNumber(cur)) return acc + Number(cur);

            return acc;
          }, 0);

          const actualPrice: number = Object.values<string>(
            weeklyProductionOrderWorkRate[1],
          ).reduce((acc: number, cur) => {
            if (cur == null) return acc;

            if (isNumber(cur)) return acc + Number(cur);

            return acc;
          }, 0);

          return {
            ...weekProductionOrderWorkRate,
            total: (actualPrice / planPrice) * 100,
          };
        },
      ),
    );
    setWeekLabel(weeks.map(week => `${week}주`));
    setWeek(
      Object.keys(weeklyProductionOrderWorkRate[2])
        .filter(key => key !== 'fg')
        .map(key => weeklyProductionOrderWorkRate[2][key]),
    );

    const dates = getRangeDateAtMonth(reg_month);

    const datesColumns = dates.map(date => {
      const dateKey = date > 9 ? `${date}` : `0${date}`;

      return {
        header: `${date}`,
        name: `${reg_month}-${dateKey}`,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        sortable: false,
      };
    });

    setDateFirstHalfColumns([
      {
        header: '구분',
        name: 'fg',
        width: ENUM_WIDTH.M,
        sortable: false,
      },
      ...datesColumns.slice(0, datesColumns.length / 2 + 1),
    ]);
    setDateLastHalfColumns([
      {
        header: '구분',
        name: 'fg',
        width: ENUM_WIDTH.M,
        sortable: false,
      },
      ...datesColumns.slice(datesColumns.length / 2 + 1, datesColumns.length),
      {
        header: '합계',
        name: 'total',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
      },
    ]);

    const dailyProductionOrderWorkRate = await getDailyProductionOrderWorkRate(
      reg_month,
    );
    setDateData(
      dailyProductionOrderWorkRate.map((dateProductionOrderWorkRate, index) => {
        if (index < 2) {
          const total = Object.values<string>(
            dateProductionOrderWorkRate,
          ).reduce((acc: number, cur) => {
            if (cur == null) return acc;

            if (isNumber(cur)) return acc + Number(cur);

            return acc;
          }, 0);

          return {
            ...dateProductionOrderWorkRate,
            total,
          };
        }

        const planPrice = Object.values<string>(
          dailyProductionOrderWorkRate[0],
        ).reduce((acc: number, cur) => {
          if (cur == null) return acc;

          if (isNumber(cur)) return acc + Number(cur);

          return acc;
        }, 0);

        const actualPrice: number = Object.values<string>(
          dailyProductionOrderWorkRate[1],
        ).reduce((acc: number, cur) => {
          if (cur == null) return acc;

          if (isNumber(cur)) return acc + Number(cur);

          return acc;
        }, 0);

        return {
          ...dateProductionOrderWorkRate,
          total: (actualPrice / planPrice) * 100,
        };
      }),
    );
    setDateLabel(dates.map(date => `${date}일`));
    setDate(
      Object.keys(dailyProductionOrderWorkRate[2])
        .filter(key => key !== 'fg')
        .map(key => dailyProductionOrderWorkRate[2][key]),
    );
  };

  useEffect(() => {
    const reg_month = getToday().substring(0, 7);

    getMonthlyProductionOrderWorkRate(reg_month).then(
      productionOrderWorkMonthRates => {
        setYear(
          Object.keys(productionOrderWorkMonthRates[2])
            .filter(key => key !== 'fg')
            .map(key => productionOrderWorkMonthRates[2][key]),
        );

        setYearData(
          productionOrderWorkMonthRates.map(
            (productionOrderWorkMonthRate, index) => {
              if (index < 2) {
                const total = Object.values<string>(
                  productionOrderWorkMonthRate,
                ).reduce((acc: number, cur) => {
                  if (cur == null) return acc;

                  if (isNumber(cur)) return acc + Number(cur);

                  return acc;
                }, 0);
                return {
                  ...productionOrderWorkMonthRate,
                  total,
                };
              }

              const planOrderWorkMonthRate = Object.values<string>(
                productionOrderWorkMonthRates[0],
              ).reduce((acc: number, cur) => {
                if (cur == null) return acc;

                if (isNumber(cur)) return acc + Number(cur);

                return acc;
              }, 0);

              const actualOrderWorkMonthRate = Object.values<string>(
                productionOrderWorkMonthRates[1],
              ).reduce((acc: number, cur) => {
                if (cur == null) return acc;

                if (isNumber(cur)) return acc + Number(cur);

                return acc;
              }, 0);

              return {
                ...productionOrderWorkMonthRate,
                total:
                  (actualOrderWorkMonthRate / planOrderWorkMonthRate) * 100,
              };
            },
          ),
        );
      },
    );
    fnc(reg_month);
  }, []);

  useEffect(() => {
    toggleDecrease(layoutState.leftSpacing > 200);

    setYear(current => current);
    setWeek(current => current);
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

          fnc(reg_month);
          console.log({ reg_month });
        }}
      />
      <Container>
        <div
          className="chart-container"
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '0px 10px',
          }}
        >
          <BsnProductionOrderWorkRateChart
            graphLabels={[
              '1월',
              '2월',
              '3월',
              '4월',
              '5월',
              '6월',
              '7월',
              '8월',
              '9월',
              '10월',
              '11월',
              '12월',
            ]}
            graphData={year}
            graphTitle="월별"
            graphWidth="35%"
            isDecrease={isDecrease}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={weekLabel}
            graphData={week}
            graphTitle="주별"
            graphWidth="25%"
            isDecrease={isDecrease}
          />
          <BsnProductionOrderWorkRateChart
            graphLabels={dateLabel}
            graphData={date}
            graphTitle="일별"
            graphWidth="40%"
            isDecrease={isDecrease}
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
            columns={[
              {
                header: '구분',
                name: 'fg',
                width: ENUM_WIDTH.M,
                sortable: false,
              },
              {
                header: '1월',
                name: '2023-01',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '2월',
                name: '2023-02',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '3월',
                name: '2023-03',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '4월',
                name: '2023-04',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '5월',
                name: '2023-05',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '6월',
                name: '2023-06',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '7월',
                name: '2023-07',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '8월',
                name: '2023-08',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '9월',
                name: '2023-09',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '10월',
                name: '2023-10',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '11월',
                name: '2023-11',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '12월',
                name: '2023-12',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
              {
                header: '합계',
                name: 'total',
                width: ENUM_WIDTH.M,
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_PRICE,
                sortable: false,
              },
            ]}
            data={yearData}
            disabledAutoDateColumn={true}
            height={80}
          />
        </div>
      </Container>
    </>
  );
};
