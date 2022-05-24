import React from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import { dataGridEvents, getData, getPageName, getToday } from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';

export const PgPrdProgressHistory = () => {
  const title = getPageName();
  const [, modalContext] = Modal.useModal();

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      names: ['start_date', 'end_date'],
      defaults: [getToday(-6), getToday()],
      type: 'daterange',
      label: '기간',
    },
  ]);

  const columns = [
    {
      header: '일자',
      name: 'reg_date',
      width: ENUM_WIDTH.XL,
      filter: 'datetime',
      format: 'datetime',
      align: 'center',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
      align: 'center',
    },
    {
      header: '작업지시 번호',
      name: 'order_no',
      width: ENUM_WIDTH.M,
      filter: 'text',
      align: 'center',
    },
    {
      header: '작업상태',
      name: 'order_state',
      width: ENUM_WIDTH.S,
      filter: 'text',
      align: 'center',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '품목',
      name: 'prod_nm',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.S,
      filter: 'text',
      align: 'center',
    },
    {
      header: '규격',
      name: 'prod_std',
      width: ENUM_WIDTH.M,
      filter: 'text',
      align: 'center',
    },
    {
      header: '순서',
      name: 'sort',
      width: ENUM_WIDTH.M,
      filter: 'text',
      align: 'center',
    },
  ];

  const grid = useGrid('GRID', columns);

  const concatColumns = (columns, list) => {
    columns.splice(10, 0, ...list);

    return columns;
  };

  const onSearch = async values => {
    const { raws, value } = await getData(
      values,
      'prd/multi-proc-by-orders',
      'datas',
    );

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