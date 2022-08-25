import TuiGrid from 'tui-grid';
import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import moment from 'moment';
import React, { useRef, useEffect } from 'react';
import { Container, Datagrid, DatePicker } from '~/components/UI';
import ComboStore from '~/constants/combos';
import { WORD } from '~/constants/lang/ko';
import { ENUM_WIDTH } from '~/enums';
import { executeData, getData, getToday } from '~/functions';
import Header, { Button } from '../adm/excel-upload-type/components/Header';

const fetchWorkCalendarGetApi = ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) =>
  getData(
    {
      start_date,
      end_date,
    },
    '/std/work-calendars',
  );

const workCalendarLists = workMonth =>
  [...Array(Number(moment(workMonth).endOf('month').format('DD')))].map(
    (_, i) => ({
      day_no: i > 8 ? i + 1 : `0${i + 1}`,
      work_type_uuid: null,
      work_type_nm: null,
      day_value: null,
    }),
  );

const syncWorkCalendar = () => {
  const initilizedMonth = moment(getToday()).format('YYYY-MM');
  return fetchWorkCalendarGetApi({
    start_date: `${initilizedMonth}-01`,
    end_date: `${initilizedMonth}-${moment(initilizedMonth)
      .endOf('month')
      .format('DD')}`,
  });
};

export const PgStdWorkCalendar = () => {
  const [workMonth, setWorkMonth] = React.useState(
    moment(getToday()).format('YYYY-MM'),
  );
  const [workCalendarData, setWorkCalendarData] = React.useState([]);
  const workCalendarDataGridRef = useRef<Grid>(null);

  const setWorkCalendarDatas = workCalendarApiResponseList => {
    const copyWorkCalendarData = workCalendarLists(workMonth);
    const getDayToYMDFormatDate = (YMDFormatDate: string) =>
      YMDFormatDate.substring(YMDFormatDate.length - 2);

    workCalendarApiResponseList.forEach(item => {
      copyWorkCalendarData[Number(getDayToYMDFormatDate(item.day_no)) - 1] = {
        ...item,
        uuid: item.workcalendar_uuid,
        day_no: getDayToYMDFormatDate(item.day_no),
      };
    });
    setWorkCalendarData(copyWorkCalendarData);
  };

  const searchWorkCalendarDatas = () => {
    fetchWorkCalendarGetApi({
      start_date: `${workMonth}-01`,
      end_date: `${workMonth}-${moment(workMonth).endOf('month').format('DD')}`,
    }).then(setWorkCalendarDatas);
  };

  const saveWorkCalendarDatas = () => {
    const updatedWorkCalendarDatas = workCalendarDataGridRef.current
      .getInstance()
      .getModifiedRows().updatedRows;

    if (
      updatedWorkCalendarDatas.some(({ day_value }) => {
        if (day_value == null) return true;
        if (day_value === '') return true;

        return Number.isNaN(Number(day_value)) === true;
      }) === true
    ) {
      message.warn('숫자만 입력해주세요.');
      return;
    }

    executeData(
      updatedWorkCalendarDatas.map(
        ({ day_no, day_value, work_type_uuid, ...workDayRest }) => {
          if (work_type_uuid == null)
            return {
              day_no: `${workMonth}-${day_no}`,
              day_value: Number(day_value),
              workcalendar_fg: true,
              ...workDayRest,
            };

          return {
            day_no: `${workMonth}-${day_no}`,
            day_value: Number(day_value),
            workcalendar_fg: true,
            work_type_uuid,
            ...workDayRest,
          };
        },
      ),
      '/std/work-calendars',
      'post',
    ).then(searchWorkCalendarDatas);
  };

  useEffect(() => {
    syncWorkCalendar().then(setWorkCalendarDatas);
  }, []);

  useEffect(searchWorkCalendarDatas, [workMonth]);

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
            onClick={searchWorkCalendarDatas}
          >
            {WORD.SEARCH}
          </Button>
          <Button
            primary="true"
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="add"
            onClick={saveWorkCalendarDatas}
          >
            {WORD.SAVE}
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
          ref={workCalendarDataGridRef}
          data={[...workCalendarData]}
          gridMode="update"
          height={700}
          columns={[
            {
              header: '일자',
              name: 'day_no',
              width: ENUM_WIDTH.S,
            },
            {
              header: '',
              name: 'work_type_uuid',
              editable: false,
              hidden: true,
            },
            {
              header: '근무유형',
              name: 'work_type_nm',
              width: ENUM_WIDTH.M,
              editable: true,
              format: 'combo',
            },
            {
              header: 'hour',
              name: 'day_value',
              width: ENUM_WIDTH.M,
              editable: true,
            },
            {
              header: '행 초기화',
              name: 'reset',
              width: ENUM_WIDTH.S,
              editable: false,
              format: 'button',
              options: {
                value: `${WORD.RESET}`,
                onClick: (
                  _,
                  { grid, rowKey }: { grid: TuiGrid; rowKey: number },
                ) => {
                  console.log(
                    grid.setRow(rowKey, {
                      ...grid.getRowAt(rowKey),
                      work_type_uuid: null,
                      work_type_nm: null,
                      day_value: 0,
                    }),
                  );
                },
              },
            },
          ]}
          gridComboInfo={[ComboStore.USED_WORK_TYPE]}
          disabledAutoDateColumn={true}
        ></Datagrid>
      </Container>
    </>
  );
};
