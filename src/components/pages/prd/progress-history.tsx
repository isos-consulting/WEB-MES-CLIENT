import React from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import { dataGridEvents, getData, getPageName, getToday } from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import {
  concreteProgressHistoryGridColumns,
  searchFields,
  rowSpanKeys,
} from './progress-history/constant';
import ProgressHistoryService from './progress-history/ProgressHistoryService';

export const PgPrdProgressHistory = () => {
  const title = getPageName();
  const [, modalContext] = Modal.useModal();
  const progressHistoryService = new ProgressHistoryService();

  searchFields[0].defaults = [getToday(-6), getToday()];

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', searchFields);

  const grid = useGrid('GRID', concreteProgressHistoryGridColumns);

  const onSearch = async searchConditions => {
    if (!progressHistoryService.isValidSearchCondition(searchConditions)) {
      return console.trace(
        '%c공정 별 진행 현황 조회 조건 유효성 검사 실패함',
        'color: red; font-size: 15px;',
      );
    }

    const { raws, value } = await getData(
      searchConditions,
      'prd/multi-proc-by-orders',
      'datas',
    );

    for (let index = 0; index < raws.length / 5; index++) {
      raws[index * 5]._attributes = {
        rowSpan: progressHistoryService.spanObject(rowSpanKeys, 5),
      };
    }

    grid.setGridColumns(
      progressHistoryService.dynamicColumns(
        concreteProgressHistoryGridColumns,
        value.proc_nos.map(progressHistoryService.columnAttributes),
      ),
    );
    grid.setGridData(raws);
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
