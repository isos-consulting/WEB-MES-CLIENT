import moment from 'moment';
import React, { useEffect } from 'react';
import { Container, Datagrid, DatePicker } from '~/components/UI';
import { WORD } from '~/constants/lang/ko';
import { getToday } from '~/functions';
import Header, { Button } from '../adm/excel-upload-type/components/Header';

export const PgStdWorkCalendar = () => {
  const [workMonth, setWorkMonth] = React.useState(
    moment(getToday()).format('YYYY-MM'),
  );
  const [workCalendarData, setWorkCalendarData] = React.useState([]);

  useEffect(() => {
    setWorkCalendarData(
      [...Array(Number(moment(workMonth).endOf('month').format('DD')))].map(
        (_, i) => ({ work_date: i + 1, work: null, hour: null }),
      ),
    );
  }, [workMonth]);

  return (
    <>
      <Header>
        <Header.FlexBox justifyContent="space-between">
          <Button
            primary="true"
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="search"
            onClick={() => {
              // 조회 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
            }}
          >
            {WORD.SEARCH}
          </Button>
        </Header.FlexBox>
      </Header>
      <Container>
        <DatePicker
          picker="month"
          format="YYYY-MM"
          label="근무월"
          value={workMonth}
          onChange={e => {
            setWorkMonth(e.format('YYYY-MM'));
          }}
        />
      </Container>
      <Container>
        <Datagrid
          ref={null}
          data={[...workCalendarData]}
          gridMode="update"
          columns={[
            {
              header: '일자',
              name: 'work_date',
            },
            {
              header: 'work',
              name: 'work',
              editable: true,
              format: 'check',
            },
            {
              header: 'hour',
              name: 'hour',
              editable: true,
              format: 'time',
            },
          ]}
          disabledAutoDateColumn={true}
        ></Datagrid>
      </Container>
    </>
  );
};
