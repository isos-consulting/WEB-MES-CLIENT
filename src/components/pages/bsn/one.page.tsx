import React, { useState } from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { PieChart } from '~/components/UI/graph/chart-pie.ui';
import { ENUM_DECIMAL } from '~/enums';
import { getData, getToday } from '~/functions';
import { getWeeksAtMonth } from '~/functions/date.function';

export const PgPrdBsnOne = () => {
  const [weeklyData, setWeelkyData] = useState([]);
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
      <Container style={{ minHeight: '150px' }}>textarea</Container>
      <Container>
        <Datagrid
          data={[{}, {}, {}, {}, {}, {}, {}, {}]}
          columns={[
            { header: '원인항목' },
            { header: '1월' },
            { header: '2월' },
            { header: '3월' },
            { header: '4월' },
            { header: '5월' },
            { header: '6월' },
            { header: '7월' },
            { header: '8월' },
            { header: '9월' },
            { header: '10월' },
            { header: '11월' },
            { header: '12월' },
            { header: '합계' },
            { header: '점유율' },
          ]}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
