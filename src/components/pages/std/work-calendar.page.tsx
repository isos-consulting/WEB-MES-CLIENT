import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import TuiGrid from 'tui-grid';
import { Container, Datagrid, DatePicker } from '~/components/UI';
import ComboStore from '~/constants/combos';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { ENUM_WIDTH } from '~/enums';
import { executeData, getData, getToday } from '~/functions';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import stdWorkCalendarColumns from './work-calendar/std-work-calendar-columns';

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

const workCalendarLists = (userSelectedLastMonth: moment.Moment) => {
  const lastDayOfMonth = Number(
    userSelectedLastMonth.endOf('month').format('DD'),
  );

  return new Array(lastDayOfMonth).fill(1).map((entry, i) => {
    const currentDay = i > 8 ? entry + i : `0${entry + i}`;
    const currentWeek = dayjs(
      `${userSelectedLastMonth.year()}-${
        userSelectedLastMonth.month() + entry
      }-${entry + i}`,
    ).week();

    return {
      day_no: currentDay,
      work_type_uuid: null,
      work_type_nm: null,
      day_value: null,
      week_no: currentWeek,
    };
  });
};

const syncWorkCalendar = () => {
  const initilizedMonth = moment(getToday()).format('YYYY-MM');
  return fetchWorkCalendarGetApi({
    start_date: `${initilizedMonth}-01`,
    end_date: `${initilizedMonth}-${moment(initilizedMonth)
      .endOf('month')
      .format('DD')}`,
  });
};

const fetchWorkHoursGetApi = ({ work_type_uuid }: { work_type_uuid: string }) =>
  getData({ work_type_uuid }, 'std/worktimes/work-hours');

export const PgStdWorkCalendar = () => {
  const [workMonth, setWorkMonth] = React.useState(moment(getToday()));
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
      start_date: `${workMonth.format('YYYY-MM')}-01`,
      end_date: `${workMonth.format('YYYY-MM')}-${workMonth
        .endOf('month')
        .format('DD')}`,
    }).then(setWorkCalendarDatas);
  };

  const saveWorkCalendarDatas = () => {
    workCalendarDataGridRef.current.getInstance().finishEditing();
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
      message.warn(SENTENCE.ONLY_NUMBER);
      return;
    }

    executeData(
      updatedWorkCalendarDatas.map(
        ({ day_no, day_value, work_type_uuid, ...workDayRest }) => {
          console.log({ workDayRest });
          if (work_type_uuid == null)
            return {
              day_no: `${workMonth.format('YYYY-MM')}-${day_no}`,
              day_value: Number(day_value),
              workcalendar_fg: true,
              ...workDayRest,
            };

          return {
            day_no: `${workMonth.format('YYYY-MM')}-${day_no}`,
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

  const handleChangeWorkTypeNameCombobox = ({ rowKey }: { rowKey: number }) => {
    const workCalendarDataGridInstance =
      workCalendarDataGridRef.current.getInstance();
    const { work_type_uuid, ...changedWorkCalendarDataRest } =
      workCalendarDataGridInstance.getRowAt(rowKey);

    if (work_type_uuid == null) {
      workCalendarDataGridInstance.setRow(rowKey, {
        ...changedWorkCalendarDataRest,
        work_type_uuid,
        day_value: null,
      });

      return;
    }

    fetchWorkHoursGetApi({ work_type_uuid }).then(workHourGetApiResponse => {
      workCalendarDataGridInstance.setRow(rowKey, {
        ...changedWorkCalendarDataRest,
        work_type_uuid,
        day_value: workHourGetApiResponse[0].work_hours,
      });
    });
  };

  const resetWorkCalendarData = (
    _,
    { grid, rowKey }: { grid: TuiGrid; rowKey: number },
  ) => {
    grid.setRow(rowKey, {
      ...grid.getRowAt(rowKey),
      work_type_uuid: null,
      work_type_nm: null,
      day_value: 0,
    });
  };

  useEffect(() => {
    syncWorkCalendar().then(setWorkCalendarDatas);
  }, []);

  useEffect(searchWorkCalendarDatas, [workMonth]);

  console.log({ stdWorkCalendarColumns });

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
          label={WORD.WORK_MONTH}
          value={workMonth.format('YYYY-MM')}
          onChange={setWorkMonth}
        />
      </Container>
      <Container>
        <Datagrid
          ref={workCalendarDataGridRef}
          data={[...workCalendarData]}
          gridMode="update"
          height={700}
          columns={[
            ...stdWorkCalendarColumns.map(
              ({ name, ...workCalendarColumnsRest }) => {
                if (name === 'work_type_nm') {
                  return {
                    ...workCalendarColumnsRest,
                    name,
                    onAfterChange: handleChangeWorkTypeNameCombobox,
                  };
                }
                return {
                  ...workCalendarColumnsRest,
                  name,
                };
              },
            ),
            {
              header: '행 초기화',
              name: 'reset',
              width: ENUM_WIDTH.S,
              editable: false,
              format: 'button',
              options: {
                value: `${WORD.RESET}`,
                onClick: resetWorkCalendarData,
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
