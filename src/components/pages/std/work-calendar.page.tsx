import moment from 'moment';
import React, { useEffect } from 'react';
import { Container, Datagrid, DatePicker } from '~/components/UI';
import { WORD } from '~/constants/lang/ko';
import { ENUM_WIDTH } from '~/enums';
import { getData, getToday } from '~/functions';
import Header, { Button } from '../adm/excel-upload-type/components/Header';

export const PgStdWorkCalendar = () => {
  const [workMonth, setWorkMonth] = React.useState(
    moment(getToday()).format('YYYY-MM'),
  );
  const [workCalendarData, setWorkCalendarData] = React.useState([]);

  useEffect(() => {
    setWorkCalendarData(
      [...Array(Number(moment(workMonth).endOf('month').format('DD')))].map(
        (_, i) => ({
          work_date: i > 8 ? i + 1 : `0${i + 1}`,
          work: null,
          hour: null,
        }),
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
              getData(
                {
                  start_date: `${workMonth}-01`,
                  end_date: `${workMonth}-${Number(
                    moment(workMonth).endOf('month').format('DD'),
                  )}`,
                },
                '/std/work-calendars',
              ).then(res => {
                if (res.length > 0) {
                  const copyWorkCalendarData = [...workCalendarData];
                  res.forEach(item => {
                    copyWorkCalendarData[item.day - 1].work = item.work_fg;
                    copyWorkCalendarData[item.day - 1].hour = item.hour;
                  });

                  setWorkCalendarData(copyWorkCalendarData);
                }
              });
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
          height={700}
          columns={[
            {
              header: '일자',
              name: 'work_date',
              width: ENUM_WIDTH.S,
            },
            {
              header: 'work',
              name: 'work',
              width: ENUM_WIDTH.M,
              editable: true,
              format: 'check',
            },
            {
              header: 'hour',
              name: 'hour',
              width: ENUM_WIDTH.M,
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
