import { IGridComboInfo } from '~/components/UI';

interface ComboStoreProps {
  [combo: string]: IGridComboInfo;
}

const ComboStore: ComboStoreProps = {
  formType: {
    columnNames: [
      {
        codeColName: { original: 'formType', popup: 'formType' },
        textColName: { original: 'formType', popup: 'formType' },
      },
    ],
    itemList: [
      { code: 'text', text: 'text' },
      { code: 'number', text: 'number' },
      { code: 'popup', text: 'popup' },
      { code: 'date', text: 'date' },
      { code: 'datetime', text: 'datetime' },
      { code: 'time', text: 'time' },
      { code: 'boolean', text: 'boolean' },
    ],
  },
  WORK_TIME_TYPE: {
    columnNames: [
      {
        codeColName: {
          original: 'worktime_type_uuid',
          popup: 'worktime_type_uuid',
        },
        textColName: {
          original: 'worktime_type_nm',
          popup: 'worktime_type_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: '/std/worktime-types',
      params: {},
    },
  },
  USED_WORK_TYPE: {
    columnNames: [
      {
        codeColName: {
          original: 'work_type_uuid',
          popup: 'work_type_uuid',
        },
        textColName: {
          original: 'work_type_nm',
          popup: 'work_type_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: '/std/work-types',
      params: { use_fg: true },
    },
  },
  SHIFT: {
    columnNames: [
      {
        codeColName: { original: 'shift_uuid', popup: 'shift_uuid' },
        textColName: { original: 'shift_nm', popup: 'shift_nm' },
      },
    ],
    dataApiSettings: {
      uriPath: '/std/shifts',
      params: {},
    },
  },
  WORKER_GROUP: {
    columnNames: [
      {
        codeColName: {
          original: 'worker_group_uuid',
          popup: 'worker_group_uuid',
        },
        textColName: {
          original: 'worker_group_nm',
          popup: 'worker_group_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: '/std/worker-groups',
      params: {},
    },
  },
  WORKER_EMPLOYEE: {
    columnNames: [
      {
        codeColName: {
          original: 'worker_uuid',
          popup: 'emp_uuid',
        },
        textColName: {
          original: 'worker_nm',
          popup: 'emp_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: '/std/emps',
      params: { emp_status: 'incumbent', worker_fg: true },
    },
  },
};

export default ComboStore;
