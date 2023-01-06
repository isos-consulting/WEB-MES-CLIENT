type OriginalIncludeColumn = {
  original: string;
};

export const isOriginalsIncludesColumnName = (
  columns: OriginalIncludeColumn[],
  columnName: string,
) => {
  for (const { original } of columns) {
    if (original === columnName) {
      return true;
    }
  }

  return false;
};
