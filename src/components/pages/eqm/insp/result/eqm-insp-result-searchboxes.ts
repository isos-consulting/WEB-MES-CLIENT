import { getPopupForm } from '~/components/UI';
import { getToday } from '~/functions';
import { ISearchItem } from '~/components/UI/searchbox/searchbox.ui.type';

export default [
  {
    id: 'reg_date',
    ids: ['start_date', 'end_date'],
    names: ['start_date', 'end_date'],
    defaults: [getToday(-6), getToday()],
    type: 'daterange',
    label: '기간',
  },
  {
    id: 'equip_uuid',
    name: 'equip_uuid',
    type: 'combo',
    label: '설비',
    firstItemType: 'all',
    default: 'all',
    dataSettingOptions: {
      codeName: 'equip_uuid',
      textName: 'equip_nm',
      uriPath: getPopupForm('설비관리')?.uriPath,
      params: {
        store_type: 'all',
      },
    },
  },
  {
    id: 'insp_type',
    name: 'insp_type',
    type: 'combo',
    label: '검사유형',
    firstItemType: 'all',
    default: 'all',
    options: [
      {
        code: 'daily',
        text: '일상점검',
      },
      {
        code: 'periodicity',
        text: '정기점검',
      },
    ],
  },
] as ISearchItem[];
