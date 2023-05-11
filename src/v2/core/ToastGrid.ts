export type GridInstance = {
  getData: <E>() => E[];
  getModifiedRows: <E>() => {
    createdRows: E[];
    deletedRows: E[];
    updatedRows: E[];
  };
  getCheckedRows: <E>() => E[];
};
