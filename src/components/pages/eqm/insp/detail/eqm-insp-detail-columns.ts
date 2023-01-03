import { IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

export default [
  {
    header: '적용',
    name: 'apply_fg',
    width: ENUM_WIDTH.S,
    format: 'button',
    options: {
      formatter: props => {
        const { rowKey, grid } = props;
        const row = grid?.store?.data?.rawData[rowKey];
        return row['apply_fg'] === true ? '해제' : '적용';
      },
      onClick: () => {},
    },
  },
  {
    header: '기준서UUID',
    name: 'insp_uuid',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
  {
    header: '설비UUID',
    name: 'equip_uuid',
    width: ENUM_WIDTH.M,
    filter: 'text',
    hidden: true,
  },
  {
    header: '기준서번호',
    name: 'insp_no',
    width: ENUM_WIDTH.M,
    filter: 'text',
  },
  {
    header: '개정내용',
    name: 'contents',
    width: ENUM_WIDTH.XL,
    filter: 'text',
  },
  { header: '비고', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
] as IGridColumn[];
