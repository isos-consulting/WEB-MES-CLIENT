import React, { useEffect, useState } from 'react';
import { Container, Datagrid, Searchbox } from '~/components/UI';
import { PieChart } from '~/components/UI/graph/chart-pie.ui';
import { getToday } from '~/functions';
import { BsnProductionEquipDowntimeService } from './production/bsn-production-equip-downtime-service';

export const PgProductionEquipDowntimeType = () => {
  const [month, setMonth] = useState(getToday().substring(0, 7));
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(async () => {
    const service = new BsnProductionEquipDowntimeService();

    setWeeklyData(await service.weeklyData({ reg_date: month }));
    setMonthlyData(await service.monthlyData({ reg_date: month }));
  }, [month]);

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
        onSearch={({ reg_date }: { reg_date: string }) => {
          setMonth(reg_date.substring(0, 7));
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
            columns={BsnProductionEquipDowntimeService.weekColumns(month)}
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
            data={BsnProductionEquipDowntimeService.weeklyGraphData(weeklyData)}
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
          columns={BsnProductionEquipDowntimeService.monthColumns(
            month.substring(0, 4),
          )}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
