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
};

export default ComboStore;
