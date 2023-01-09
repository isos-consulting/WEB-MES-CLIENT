import React from 'react';
import { BarGraph, Container, Datagrid } from '~/components/UI';

export const PgBsnPageOne = () => {
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
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                    data: [1, 2, 3, 4],
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
                    data: [
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                      18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                    ],
                    backgroundColor: 'blue',
                  },
                ],
              }}
            />
          </div>
        </div>
      </Container>
      <Container>
        <Datagrid columns={[]} data={[]} />
      </Container>
      <Container>
        <Datagrid columns={[]} data={[]} />
      </Container>
      <Container>
        <Datagrid columns={[]} data={[]} />
      </Container>
      <Container>
        <Datagrid columns={[]} data={[]} />
      </Container>
    </>
  );
};
