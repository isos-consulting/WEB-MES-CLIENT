import React, { useState } from 'react';
import { BarGraph, Container, Datagrid } from '~/components/UI';

export const PgBsnPageOne = () => {
  const [year, _setYear] = useState(
    new Array(12).fill(1).map((_, i) => i * Math.random()),
  );
  const [week, setWeek] = useState([]);
  return (
    <>
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: '0px 10px',
          }}
        >
          <div style={{ width: '100%' }}>
            <BarGraph
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '월별' },
                },
                onClick: (chartClickEvent, selectedBarData) => {
                  setWeek(
                    new Array(4).fill(1).map((_, i) => i * Math.random()),
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
          <div style={{ width: '100%' }}>
            <BarGraph
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '주별' },
                },
              }}
              data={{
                labels: ['1주', '2주', '3주', '4주'],
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
          <div style={{ width: '100%' }}>
            <BarGraph
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '일별' },
                },
              }}
              data={{
                labels: [
                  '1일',
                  '2일',
                  '3일',
                  '4일',
                  '5일',
                  '6일',
                  '7일',
                  '8일',
                  '9일',
                  '10일',
                  '11일',
                  '12일',
                  '13일',
                  '14일',
                  '15일',
                  '16일',
                  '17일',
                  '18일',
                  '19일',
                  '20일',
                  '21일',
                  '22일',
                  '23일',
                  '24일',
                  '25일',
                  '26일',
                  '27일',
                  '28일',
                  '29일',
                  '30일',
                  '31일',
                ],
                datasets: [
                  {
                    label: '달성율',
                    data: new Array(31)
                      .fill(1)
                      .map((_, i) => i * Math.random()),
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
          <Datagrid columns={[]} data={[]} height={80} />
          <Datagrid columns={[]} data={[]} height={80} />
          <Datagrid columns={[]} data={[]} height={80} />
          <Datagrid columns={[]} data={[]} height={80} />
        </div>
      </Container>
    </>
  );
};
