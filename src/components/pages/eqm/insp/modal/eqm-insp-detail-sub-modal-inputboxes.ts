import { getPopupForm } from '~/components/UI';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox';
import { getToday } from '~/functions';

export default [
  {
    type: 'text',
    id: 'insp_uuid',
    alias: 'uuid',
    label: '기준서UUID',
    disabled: true,
    hidden: true,
  },
  {
    type: 'text',
    id: 'equip_uuid',
    label: '설비UUID',
    disabled: true,
    hidden: true,
  },
  {
    type: 'text',
    id: 'equip_cd',
    label: '설비코드',
    disabled: true,
    usePopup: true,
    popupKeys: ['equip_uuid', 'equip_cd', 'equip_nm'],
    popupButtonSettings: {
      dataApiSettings: {
        uriPath: getPopupForm('설비관리').uriPath,
        params: { use_fg: true },
      },
      datagridSettings: getPopupForm('설비관리').datagridProps,
      modalSettings: {
        title: '품목관리',
      },
    },
  },
  { type: 'text', id: 'equip_cd', label: '설비', disabled: true },
  { type: 'text', id: 'insp_no', label: '기준서 번호', disabled: true },
  {
    type: 'date',
    id: 'reg_date',
    label: '생성일자',
    disabled: true,
    default: getToday(0, { format: 'YYYY-MM-DD' }),
    required: true,
  },
  { type: 'text', id: 'contents', label: '개정내역', disabled: false },
  { type: 'text', id: 'remark', label: '비고', disabled: false },
] as IInputGroupboxItem[];
