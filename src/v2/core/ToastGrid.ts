export type GridInstance = {
  getData: <E>() => E[];
  getModifiedRows: <E>() => {
    createdRows: E[];
    deletedRows: E[];
    updatedRows: E[];
  };
};

export type GridRef = {
  current: {
    getInstance: () => GridInstance;
  };
};
