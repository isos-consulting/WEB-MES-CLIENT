import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  BarGraph,
  Container,
  Datagrid,
  IGridColumn,
  layoutStore,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { getData, isNumber } from '~/functions';
import {
  getRangeDateAtMonth,
  getRangeDateAtMonthForWeek,
  getWeeksAtMonth,
} from '~/functions/date.function';

const getWeeklyProductionOrderWorkRate = month => {
  return getData(
    {
      reg_date: month,
      week_fg: true,
    },
    '/kpi/production/order-work-rate',
  );
};

const getDailyProductionOrderWorkRate = month => {
  return getData(
    {
      reg_date: month,
      week_fg: false,
    },
    '/kpi/production/order-work-rate',
  );
};

export const PgBsnPageOne = () => {
  const [layoutState] = useRecoilState(layoutStore.state);
  const [yearChartWidth, setYearChartWidth] = useState(0);
  const [weekchartWidth, setWeekChartWidth] = useState(0);
  const [datechartWidth, setDateChartWidth] = useState(0);
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

  useEffect(() => {
    getData(
      { reg_date: `2023-01` },
      '/kpi/production/order-work-month-rate',
    ).then(productionOrderWorkMonthRates => {
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
              total: (actualOrderWorkMonthRate / planOrderWorkMonthRate) * 100,
            };
          },
        ),
      );
    });
  }, []);

  useEffect(() => {
    const chartWidth =
      document.querySelector('.chart-container').clientWidth / 3 - 20;
    const halfChartWidth = chartWidth * 0.5;

    console.log(chartWidth + halfChartWidth);
    setYearChartWidth(chartWidth);
    setWeekChartWidth(halfChartWidth);
    setDateChartWidth(chartWidth + halfChartWidth);

    setYear(current => current);
    setWeek(current => current);
  }, [layoutState.leftSpacing]);

  return (
    <>
      <Container>
        <div
          className="chart-container"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: '0px 10px',
          }}
        >
          <div
            style={{
              width: yearChartWidth,
              height: '287px',
              position: 'relative',
            }}
          >
            <BarGraph
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '월별' },
                },
                onClick: async (chartClickEvent, selectedBarData) => {
                  if (selectedBarData.length === 0) return;

                  const twoSizedCharMonth =
                    selectedBarData[0].index >= 9
                      ? `${selectedBarData[0].index + 1}`
                      : `0${selectedBarData[0].index + 1}`;

                  const selectedMonth = `2023-${twoSizedCharMonth}`;

                  const weeks = getWeeksAtMonth(`2023-${twoSizedCharMonth}`);

                  const weeksHeaders = weeks.map(week => {
                    const dates = getRangeDateAtMonthForWeek(
                      2023,
                      selectedBarData[0].index + 1,
                      week,
                    );

                    if (dates.length > 2) {
                      return `${week}주`.concat(
                        `(${dates[0]} ~ ${dates[dates.length - 1]})`,
                      );
                    }

                    return `${week}주`.concat(`(${dates[0]})`);
                  });

                  const weeksColumns: IGridColumn[] = weeksHeaders.map(
                    (weekHeader, i) => {
                      const weekKey =
                        weeks[i] > 9 ? `${weeks[i]}` : `0${weeks[i]}`;
                      return {
                        header: weekHeader,
                        name: weekKey,
                        format: 'number',
                        decimal: ENUM_DECIMAL.DEC_PRICE,
                        sortable: false,
                      };
                    },
                  );

                  const weeklyProductionOrderWorkRate =
                    await getWeeklyProductionOrderWorkRate(selectedMonth);

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

                  const dates = getRangeDateAtMonth(
                    `2023-${twoSizedCharMonth}`,
                  );

                  const datesColumns = dates.map(date => {
                    const dateKey = date > 9 ? `${date}` : `0${date}`;

                    return {
                      header: `${date}`,
                      name: `2023-${twoSizedCharMonth}-${dateKey}`,
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
                    ...datesColumns.splice(0, datesColumns.length / 2),
                  ]);
                  setDateLastHalfColumns([
                    {
                      header: '구분',
                      name: 'fg',
                      width: ENUM_WIDTH.M,
                      sortable: false,
                    },
                    ...datesColumns.splice(0, datesColumns.length),
                    {
                      header: '합계',
                      name: 'total',
                      width: ENUM_WIDTH.M,
                      format: 'number',
                      decimal: ENUM_DECIMAL.DEC_PRICE,
                    },
                  ]);

                  const dailyProductionOrderWorkRate =
                    await getDailyProductionOrderWorkRate(selectedMonth);
                  setDateData(
                    dailyProductionOrderWorkRate.map(
                      (dateProductionOrderWorkRate, index) => {
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
                      },
                    ),
                  );
                  setDateLabel(dates.map(date => `${date}일`));
                  setDate(
                    Object.keys(dailyProductionOrderWorkRate[2])
                      .filter(key => key !== 'fg')
                      .map(key => dailyProductionOrderWorkRate[2][key]),
                  );
                },
              }}
              data={{
                labels: [
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
                ],
                datasets: [
                  {
                    label: '달성율',
                    data: year,
                    backgroundColor: 'blue',
                  },
                ],
              }}
            />
          </div>
          <div
            style={{
              width: weekchartWidth,
              height: '287px',
              position: 'relative',
            }}
          >
            <BarGraph
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '주별' },
                },
              }}
              data={{
                labels: weekLabel,
                datasets: [
                  {
                    label: '달성율',
                    data: week,
                    backgroundColor: 'blue',
                  },
                ],
              }}
            />
          </div>
          <div
            style={{
              width: datechartWidth,
              height: '287px',
              position: 'relative',
            }}
          >
            <BarGraph
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '일별' },
                },
              }}
              data={{
                labels: dateLabel,
                datasets: [
                  {
                    label: '달성율',
                    data: date,
                    backgroundColor: 'blue',
                  },
                ],
              }}
            />
          </div>
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
