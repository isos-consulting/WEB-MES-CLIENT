import { TGridPopupInfos } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export default [
  {
    columnNames: [
      { original: 'emp_uuid', popup: 'emp_uuid' },
      { original: 'emp_nm', popup: 'emp_nm' },
    ],
    columns: [
      {
        header: '사원UUID',
        name: 'emp_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '사원명',
        name: 'emp_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/emps',
      params: {
        emp_status: 'incumbent',
      },
    },
    gridMode: 'select',
  },
] as TGridPopupInfos;
