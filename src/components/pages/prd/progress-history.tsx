import React from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import { dataGridEvents, getData, getPageName, getToday } from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';
import dayjs from 'dayjs';
import { message } from 'antd';
import {
  concreteProgressHistoryGridColumns,
  searchFields,
} from './progress-history/constant';

export const PgPrdProgressHistory = () => {
  const title = getPageName();
  const [, modalContext] = Modal.useModal();

  searchFields[0].defaults = [getToday(-6), getToday()];

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', searchFields);

  const grid = useGrid('GRID', concreteProgressHistoryGridColumns);

  const concatColumns = (columns, list) => {
    columns.splice(10, 0, ...list);

    return columns;
  };

  const invlidOverStartDateAtEndDate = () => {
    message.warning('시작일은 종료일을 넘을 수 없습니다');
    return false;
  };

  const invalidOverEndDateAtNow = () => {
    message.warning('종료일은 현재 날짜를 넘을 수 없습니다');
    return false;
  };

  const isValidSearchCondition = ({ start_date, end_date }) => {
    return start_date > end_date
      ? invlidOverStartDateAtEndDate()
      : end_date > dayjs(new Date()).format('YYYY-MM-DD')
      ? invalidOverEndDateAtNow()
      : true;
  };

  const onSearch = async searchConditions => {
    const { raws, value } = isValidSearchCondition(searchConditions)
      ? await getData(searchConditions, 'prd/multi-proc-by-orders', 'datas')
      : { raws: [], value: { proc_nos: [] } };

    for (let index = 0; index < raws.length / 5; index++) {
      raws[index * 5]._attributes = {
        rowSpan: {
          reg_date: 5,
          workings_nm: 5,
          order_no: 5,
          order_state: 5,
          prod_no: 5,
          prod_nm: 5,
          item_type_nm: 5,
          prod_std: 5,
        },
      };
    }

    grid.setGridData(raws);
    grid.setGridColumns(
      concatColumns(
        columns,
        value.proc_nos.map(key => ({
          heaer: key,
          name: key,
          width: ENUM_WIDTH.S,
          filter: 'text',
        })),
      ),
    );
  };

  const buttonActions = {
    search: () => {
      onSearch(searchInfo?.values);
    },
    update: () => {},
    delete: () => {},
    create: () => {},
    save: () => {},
    cancelEdit: () => {},
    printExcel: dataGridEvents.printExcel,
  };

  const props: ITpSingleGridProps = {
    title,
    templateType: 'report',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props,
      onSearch,
    },
    inputProps: null,

    popupGridRef: [null, null],
    popupGridInfo: [null, null, null],
    popupVisible: [null, null],
    setPopupVisible: [null, null],
    popupInputProps: [null, null],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
