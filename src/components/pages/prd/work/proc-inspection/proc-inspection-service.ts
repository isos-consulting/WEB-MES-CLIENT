type ColumnNames = Array<{ columnName: string }>;

export const isColumnNameNotIncludes_insp_value = (columnNames: ColumnNames) =>
  columnNames.some(({ columnName }) => !columnName.includes('_insp_value'));

export const extract_insp_ItemEntriesAtCounts = (
  inspectionItems: Array<{ [key: string]: any }>,
) =>
  inspectionItems.map(inspectionItem =>
    Object.entries(inspectionItem)
      .filter(([key, _value]) => key.includes('_insp_value'))
      .slice(0, inspectionItem.sample_cnt),
  );

export const checkSamples = () => {};
