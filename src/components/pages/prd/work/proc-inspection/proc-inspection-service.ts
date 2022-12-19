type ColumnNames = Array<{ columnName: string }>;

export const isColumnNameNotIncludes_insp_value = (columnNames: ColumnNames) =>
  columnNames.some(({ columnName }) => !columnName.includes('_insp_value'));
