import { TGridComboInfos } from '~/components/UI';

export default [
  {
    columnNames: [
      {
        codeColName: {
          original: 'insp_result_fg',
          popup: 'insp_result_fg',
        },
        textColName: {
          original: 'insp_result_state',
          popup: 'insp_result_state',
        },
      },
    ],
    itemList: [
      { code: 'false', text: '불합격' },
      { code: 'true', text: '합격' },
    ],
  },
] as TGridComboInfos;
