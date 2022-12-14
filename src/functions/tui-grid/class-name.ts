import {
  COLUMN_CODE,
  IGridColumn,
  TGridMode,
} from '~/components/UI/datagrid-new/datagrid.ui.type';

type ClassNames = {
  column: object;
};

export const injectClassNameAttributesInColumn = (
  columns: IGridColumn[],
  gridMode: TGridMode,
): ClassNames => {
  const column: { [columnName: string]: unknown[] } = columns.reduce(
    (columnAttributes, { name, editable, format }) => {
      if (name === COLUMN_CODE.EDIT) return columnAttributes;

      if (editable === false || editable == null) {
        columnAttributes[name] = [gridMode];
        return columnAttributes;
      }

      if (format === 'popup') {
        columnAttributes[name] = [gridMode, 'editor', 'popup'];

        return columnAttributes;
      }

      columnAttributes[name] = [gridMode, 'editor'];

      return columnAttributes;
    },
    {},
  );

  return {
    column,
  };
};
