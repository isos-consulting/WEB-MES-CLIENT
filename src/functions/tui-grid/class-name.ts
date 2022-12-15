import {
  COLUMN_CODE,
  IGridColumn,
  TGridMode,
} from '~/components/UI/datagrid-new/datagrid.ui.type';

type ClassNames = {
  column: object;
};

const getColumnAttributesValues = (gridMode, editable, format) => {
  if (editable === false || editable == null) return [gridMode];
  if (format === 'popup') return [gridMode, 'editor', 'popup'];

  return [gridMode, 'editor'];
};

export const injectClassNameAttributesInColumn = (
  columns: IGridColumn[],
  gridMode: TGridMode,
): ClassNames => {
  const column: { [columnName: string]: unknown[] } = columns.reduce(
    (columnAttributes, { name, editable, format }) => {
      if (name === COLUMN_CODE.EDIT) return columnAttributes;

      return {
        ...columnAttributes,
        [name]: getColumnAttributesValues(gridMode, editable, format),
      };
    },
    {},
  );

  return {
    column,
  };
};
