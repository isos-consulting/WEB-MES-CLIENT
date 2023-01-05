import { getPopupForm } from '~/components/UI';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox';
import { getToday } from '~/functions';

export default [
  {
    id: 'reg_date',
    name: 'reg_date',
    default: getToday(),
    type: 'date',
    label: '검사일',
  },
  {
    id: 'equip_nm',
    name: 'equip_nm',
    type: 'text',
    usePopup: true,
    label: '설비',
    popupKeys: ['equip_uuid', 'equip_nm'],
    popupButtonSettings: {
      dataApiSettings: {
        uriPath: getPopupForm('설비관리').uriPath,
        params: {},
      },
      datagridSettings: {
        gridId: null,
        columns: getPopupForm('설비관리').datagridProps.columns,
      },
      modalSettings: {
        title: '설비관리',
      },
    },
  },
  {
    id: 'insp_type',
    name: 'insp_type',
    type: 'combo',
    label: '검사유형',
    firstItemType: 'none',
    default: 'daily',
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
] as IInputGroupboxItem[];
