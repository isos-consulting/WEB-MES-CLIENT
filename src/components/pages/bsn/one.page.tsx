import React, { useState } from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { PieChart } from '~/components/UI/graph/chart-pie.ui';
import { ENUM_DECIMAL } from '~/enums';
import { getData, getToday } from '~/functions';
import { getWeeksAtMonth } from '~/functions/date.function';

export const PgPrdBsnOne = () => {
  const [weeklyData, setWeelkyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
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
          const weeks = getWeeksAtMonth(reg_month);

          const weeklyEquipDownTimeTypes = await getData(
            { reg_date: reg_month },
            '/kpi/production/equip-downtime-type',
          );

          const weeklyEquipDownTimeTotal = weeklyEquipDownTimeTypes.reduce(
            (acc, { fg, ...equipDownTimesForWeek }) => {
              const totalCalculatedData = Object.entries(
                equipDownTimesForWeek,
              ).reduce(
                ({ fg, total, ...datasForWeek }, [week, equipDownTime]) => {
                  if (datasForWeek.hasOwnProperty(week))
                    return {
                      ...datasForWeek,
                      [week]: datasForWeek[week] + equipDownTime,
                      total: total + equipDownTime,
                    };
                  else
                    return {
                      ...datasForWeek,
                      [week]: equipDownTime,
                      total: total + equipDownTime,
                    };
                },
                acc,
              );

              return { fg: '합계', ...totalCalculatedData };
            },
            { fg: '합계', total: 0 },
          );

          const weelkyEquipDownTimeTypesForDataGrid = [
            ...weeklyEquipDownTimeTypes,
            weeklyEquipDownTimeTotal,
          ].map((weeklyEquipDownTimeType, index) => {
            const filledWeeklyEquipDownTimeType = weeks.reduce(
              ({ fg, total, ...datasForWeek }, cur) => {
                if (!weeklyEquipDownTimeType.hasOwnProperty(cur))
                  return {
                    fg,
                    [cur]: 0,
                    total: total,
                    ...datasForWeek,
                  };
                else
                  return {
                    fg,
                    [cur]: weeklyEquipDownTimeType[cur],
                    total: total + weeklyEquipDownTimeType[cur],
                    ...datasForWeek,
                  };
              },
              { fg: weeklyEquipDownTimeType.fg, total: 0 },
            );

            if (index < weeklyEquipDownTimeTypes.length) {
              return {
                ...filledWeeklyEquipDownTimeType,
                avg:
                  filledWeeklyEquipDownTimeType.total /
                  weeklyEquipDownTimeTotal.total,
              };
            }

            return { ...filledWeeklyEquipDownTimeType, avg: 0 };
          });

          setWeelkyData(weelkyEquipDownTimeTypesForDataGrid);
          const months = [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ];
          const monthlyEquipDownTimes = await getData(
            { reg_date: reg_month },
            '/kpi/production/equip-downtime-type-month',
          );

          const monthlyEquipDownTimeTotal = monthlyEquipDownTimes.reduce(
            (acc, { fg, ...equipDownTimesForMonth }) => {
              const totalCalculatedData = Object.entries(
                equipDownTimesForMonth,
              ).reduce(
                ({ fg, total, ...datasForMonth }, [month, equipDownTime]) => {
                  if (datasForMonth.hasOwnProperty(month))
                    return {
                      ...datasForMonth,
                      [month]: datasForMonth[month] + equipDownTime,
                      total: total + equipDownTime,
                    };
                  else
                    return {
                      ...datasForMonth,
                      [month]: equipDownTime,
                      total: total + equipDownTime,
                    };
                },
                acc,
              );

              return { fg: '합계', ...totalCalculatedData };
            },
            { fg: '합계', total: 0 },
          );

          setMonthlyData(
            [...monthlyEquipDownTimes, monthlyEquipDownTimeTotal].map(
              (data, index) => {
                const filledMonthlyEquipDownTimeType = months.reduce(
                  ({ fg, total, ...rest }, month) => {
                    const downtimeMonth = `${reg_month.substring(
                      0,
                      5,
                    )}${month}`;
                    if (!data.hasOwnProperty(downtimeMonth)) {
                      return {
                        ...rest,
                        fg,
                        total: total,
                        [downtimeMonth]: 0,
                      };
                    }

                    return {
                      ...rest,
                      fg,
                      total: total + data[downtimeMonth],
                      [downtimeMonth]: data[downtimeMonth],
                    };
                  },
                  {
                    fg: data.fg,
                    total: 0,
                  },
                );

                if (index < weeklyEquipDownTimeTypes.length) {
                  return {
                    ...filledMonthlyEquipDownTimeType,
                    avg:
                      filledMonthlyEquipDownTimeType.total /
                      monthlyEquipDownTimeTotal.total,
                  };
                }

                return { ...filledMonthlyEquipDownTimeType, avg: 0 };
              },
            ),
          );
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0px 15px' }}>
        <Container style={{ width: '50%' }}>
          <Datagrid
            data={weeklyData.map(data => {
              return Object.entries(data).reduce((acc, [key, value]) => {
                return {
                  ...acc,
                  [key]: `${value}`,
                };
              }, {});
            })}
            columns={[
              { header: '원인항목', name: 'fg' },
              {
                header: '1주차',
                name: '1',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              {
                header: '2주차',
                name: '2',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              {
                header: '3주차',
                name: '3',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              {
                header: '4주차',
                name: '4',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              {
                header: '5주차',
                name: '5',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              {
                header: '합계',
                name: 'total',
                format: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
              { header: '점유율', name: 'avg', format: 'percent' },
            ]}
            disabledAutoDateColumn={true}
          />
        </Container>
        <div
          style={{
            width: 'Calc(50% - 15px)',
            marginTop: '8px',
            border: '1px',
            borderRadius: '3px',
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
          }}
        >
          <PieChart
            data={{
              labels: weeklyData
                .filter(({ avg }) => avg > 0)
                .map(({ fg }) => fg),
              datasets: [
                {
                  label: 'hello',
                  data: weeklyData
                    .filter(({ avg }) => avg > 0)
                    .map(({ avg }) => avg * 100),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>
      <Container style={{ minHeight: '150px' }}></Container>
      <Container>
        <Datagrid
          data={monthlyData.map(({ fg, avg, ...months }) => {
            return Object.entries(months).reduce(
              (acc, [key, value]) => {
                return {
                  ...acc,
                  [key]: `${value}`,
                  avg: `${avg}`,
                };
              },
              { fg, avg },
            );
          })}
          columns={[
            { header: '원인항목', name: 'fg' },
            {
              header: '1월',
              name: '2023-01',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '2월',
              name: '2023-02',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '3월',
              name: '2023-03',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '4월',
              name: '2023-04',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '5월',
              name: '2023-05',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '6월',
              name: '2023-06',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '7월',
              name: '2023-07',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '8월',
              name: '2023-08',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '9월',
              name: '2023-09',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '10월',
              name: '2023-10',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '11월',
              name: '2023-11',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '12월',
              name: '2023-12',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            {
              header: '합계',
              name: 'total',
              format: 'number',
              decimal: ENUM_DECIMAL.DEC_STCOK,
            },
            { header: '점유율', name: 'avg', format: 'percent' },
          ]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
