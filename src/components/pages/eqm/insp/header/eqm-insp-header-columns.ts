import { IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export default [
  {
    header: '설비UUID',
    name: 'equip_uuid',
    width: ENUM_WIDTH.L,
    filter: 'text',
    hidden: true,
  },
  {
    header: '설비코드',
    name: 'equip_cd',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
  {
    header: '설비명',
    name: 'equip_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
  },
] as IGridColumn[];
