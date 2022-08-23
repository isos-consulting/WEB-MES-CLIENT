import { IGridColumn } from '~/components/UI';

export const ColumnStore: { [key: string]: IGridColumn[] } = {
  WORK_TYPE: [
    {
      header: '',
      name: 'work_type_uuid',
      hidden: true,
    },
    {
      header: '근무유형코드',
      name: 'work_type_cd',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '근무유형명',
      name: 'work_type_nm',
      format: 'text',
      editable: true,
      requiredField: true,
    },
    {
      header: '사용유무',
      name: 'use_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
  ],
};
