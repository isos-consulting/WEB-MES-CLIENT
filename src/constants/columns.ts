import { IGridColumn } from '~/components/UI';

export const ColumnStore: { [key: string]: IGridColumn[] } = {
  WORK_TYPE: [
    {
      header: '',
      name: 'work_type_uuid',
      hidden: true,
    },
    {
      header: '근무유형코드',
      name: 'work_type_cd',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무유형명',
      name: 'work_type_nm',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '사용유무',
      name: 'use_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
  ],
  WORK_TIME_TYPE: [
    {
      header: '',
      name: 'worktime_type_uuid',
      hidden: true,
    },
    {
      header: '근무시간유형코드',
      name: 'worktime_type_cd',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무시간유형명',
      name: 'worktime_type_nm',
      format: 'text',
      editable: true,
      requiredField: true,
    },
  ],
  WORK_TIME: [
    {
      header: '근무UUID',
      name: 'worktime_uuid',
      hidden: true,
    },
    {
      header: '근무코드',
      name: 'worktime_cd',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무명',
      name: 'worktime_nm',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무시간UUID',
      name: 'worktime_type_uuid',
      requiredField: true,
      hidden: true,
    },
    {
      header: '근무시간코드',
      name: 'worktime_type_cd',
      requiredField: true,
      hidden: true,
    },
    {
      header: '근무시간',
      name: 'worktime_type_nm',
      format: 'combo',
      editable: true,
      requiredField: true,
    },
    {
      header: '사용유무',
      name: 'use_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
    {
      header: '휴게유무',
      name: 'break_time_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
    {
      header: '시작시간',
      name: 'start_time',
      format: 'time',
      editable: true,
      requiredField: true,
    },
    {
      header: '종료시간',
      name: 'end_time',
      format: 'time',
      editable: true,
      requiredField: true,
    },
  ],
};
