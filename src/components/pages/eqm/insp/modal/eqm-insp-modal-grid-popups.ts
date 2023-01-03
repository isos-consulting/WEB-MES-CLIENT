import { TGridPopupInfos } from '~/components/UI';

export default [
  {
    columnNames: [
      { original: 'insp_method_uuid', popup: 'insp_method_uuid' },
      { original: 'insp_method_nm', popup: 'insp_method_nm' },
    ],
    popupKey: '검사방법관리',
    gridMode: 'select',
  },
  {
    columnNames: [
      { original: 'insp_tool_uuid', popup: 'insp_tool_uuid' },
      { original: 'insp_tool_nm', popup: 'insp_tool_nm' },
    ],
    popupKey: '검사구관리',
    gridMode: 'select',
  },
] as TGridPopupInfos;
