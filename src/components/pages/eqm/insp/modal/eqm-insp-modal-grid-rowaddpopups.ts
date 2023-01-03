import { getPopupForm, IGridPopupInfo } from '~/components/UI';

export default {
  columnNames: [
    { original: 'insp_item_type_uuid', popup: 'insp_item_type_uuid' },
    { original: 'insp_item_type_nm', popup: 'insp_item_type_nm' },
    { original: 'insp_item_uuid', popup: 'insp_item_uuid' },
    { original: 'insp_item_nm', popup: 'insp_item_nm' },
  ],
  columns: getPopupForm('검사기준관리')?.datagridProps?.columns,
  dataApiSettings: {
    uriPath: getPopupForm('검사기준관리')?.uriPath,
    params: { type: 'eqm' },
  },
  gridMode: 'multi-select',
} as IGridPopupInfo;
