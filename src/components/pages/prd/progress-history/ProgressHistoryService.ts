import { message } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { ENUM_WIDTH } from '~/enums';

const ProgressHistoryService = class {
  invalidError = text => {
    message.warning(text);
    return false;
  };

  isValidSearchCondition = ({ start_date, end_date }) => {
    return start_date > end_date
      ? this.invalidError('시작일은 종료일을 넘을 수 없습니다')
      : end_date > dayjs(new Date()).format('YYYY-MM-DD')
      ? this.invalidError('종료일은 현재 날짜를 넘을 수 없습니다')
      : true;
  };

  spanObject = (rowSpanKeys: string[], spanLength: number) => {
    const spanObject = {};

    rowSpanKeys.forEach((key: string) => {
      spanObject[key] = spanLength;
    });

    return spanObject;
  };

  dynamicColumns = (concreateColumns, dynamicColumns) => {
    const dynamicColumn = cloneDeep(concreateColumns);

    dynamicColumn.splice(10, 0, ...dynamicColumns);

    return dynamicColumn;
  };

  columnAttributes = key => {
    return {
      header: key,
      name: key,
      width: ENUM_WIDTH.S,
      filter: 'text',
    };
  };
};

export default ProgressHistoryService;
