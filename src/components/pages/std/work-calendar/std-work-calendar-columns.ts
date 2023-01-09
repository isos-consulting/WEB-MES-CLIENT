import { IGridColumn } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';

export default <IGridColumn[]>[
  {
    header: '일자',
    name: 'day_no',
    width: ENUM_WIDTH.S,
  },
  {
    header: '근무유형UUID',
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
    onAfterChange: () => {
      // this function will implement at work-calendar.page.ts
    },
  },
  {
    header: 'hour',
    name: 'day_value',
    width: ENUM_WIDTH.M,
    editable: true,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_NOMAL,
  },
  {
    header: '주차',
    name: 'week_no',
    width: ENUM_WIDTH.S,
    editable: false,
    align: 'center',
    formatter: ({ value }) => `${value}주차`,
  },
];
