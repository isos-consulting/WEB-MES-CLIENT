import { IInputGroupboxItem } from '~/components/UI/input-groupbox';

export default [
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
    hidden: true,
  },
  {
    type: 'text',
    id: 'equip_nm',
    label: '설비명',
    disabled: true,
    hidden: true,
  },
] as IInputGroupboxItem[];
