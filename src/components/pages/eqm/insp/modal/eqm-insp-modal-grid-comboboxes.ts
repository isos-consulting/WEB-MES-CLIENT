import { TGridComboInfos } from '~/components/UI';
import { URL_PATH_ADM } from '~/enums';

export default [
  {
    columnNames: [
      {
        codeColName: {
          original: 'daily_insp_cycle_uuid',
          popup: 'daily_insp_cycle_uuid',
        },
        textColName: {
          original: 'daily_insp_cycle_nm',
          popup: 'daily_insp_cycle_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: URL_PATH_ADM.DAILY_INSP_CYCLE.GET.DAILY_INSP_CYCLES,
      params: {},
    },
  },
  {
    columnNames: [
      {
        codeColName: {
          original: 'cycle_unit_uuid',
          popup: 'cycle_unit_uuid',
        },
        textColName: {
          original: 'cycle_unit_nm',
          popup: 'cycle_unit_nm',
        },
      },
    ],
    dataApiSettings: {
      uriPath: URL_PATH_ADM.CYCLE_UNIT.GET.CYCLE_UNITS,
      params: {},
    },
  },
] as TGridComboInfos;
