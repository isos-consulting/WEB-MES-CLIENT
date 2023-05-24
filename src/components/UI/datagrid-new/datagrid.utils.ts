import dayjs from 'dayjs';
import { ENUM_FORMAT } from '~/enums';

const ENUM_DATA_GRID = {
  CHECK_COLUMN_INDEX: -1,
  DATE_COLUMN: 'date',
  DATE_TIME_COLUMN: 'datetime',
  FILTER_EQUAL: 'eq',
  FILTER_NOT_EQUAL: 'neq',
  FILTER_AFTER: 'after',
  FILTER_BEFORE: 'before',
  FILTER_AFTER_OR_EQUAL: 'afterEqual',
  FILTER_BEFORE_OR_EQUAL: 'beforeEqual',
};

export const isEnabledDateColumnFilter = (columnType: string) => {
  return (
    ![ENUM_DATA_GRID.DATE_COLUMN, ENUM_DATA_GRID.DATE_TIME_COLUMN].includes(
      columnType,
    ) === false
  );
};

export const getFilteredDataForDateFormat = (
  datas: unknown[],
  columnName: string,
  filterCode: string,
  filterValue: string,
) => {
  return datas.filter(data => {
    const compValue = dayjs(data[columnName]).format(ENUM_FORMAT.DATE);

    switch (filterCode) {
      case ENUM_DATA_GRID.FILTER_EQUAL:
        return compValue === filterValue;
      case ENUM_DATA_GRID.FILTER_NOT_EQUAL:
        return compValue !== filterValue;
      case ENUM_DATA_GRID.FILTER_AFTER:
        return compValue > filterValue;
      case ENUM_DATA_GRID.FILTER_BEFORE:
        return compValue < filterValue;
      case ENUM_DATA_GRID.FILTER_AFTER_OR_EQUAL:
        return compValue >= filterValue;
      case ENUM_DATA_GRID.FILTER_BEFORE_OR_EQUAL:
        return compValue <= filterValue;
      default:
        return false;
    }
  });
};
