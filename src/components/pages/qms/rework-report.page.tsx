import React, { useLayoutEffect, useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { ColumnStore } from '~/constants/columns';

export const PgQmsReworkReport = () => {
  const title = getPageName();
  const [_modal, modalContext] = Modal.useModal();

  const defaultDetailGridMode: TGridMode = 'view';
  const searchUriPath = '/qms/reworks';
  const detailSearchUriPath = '/qms/rework-disassembles';
  const detailSaveUriPath = '/qms/rework-disassembles';

  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  const inputInfo = null;

  const grid = useGrid('HEADER_GRID', ColumnStore.REWORK_REPORT_HEADER);

  const detailGrid = useGrid('DETAIL_GRID', ColumnStore.REWORK_REPORT_DETAIL, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: defaultDetailGridMode,
    title: '분해이력',
  });

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      label: '작업기간',
      defaults: [getToday(-7), getToday()],
    },
  ]);

  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', null);

  const onClickHeader = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      onSearchDetail(selectedHeaderRow?.rework_uuid);
    }
  }, [selectedHeaderRow]);

  /** 검색 */
  const onSearch = values => {
    const searchParams: any = cleanupKeyOfObject(
      values,
      searchInfo.searchItemKeys,
    );

    let data = [];

    getData(searchParams, searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        grid.setGridData(data);
        detailGrid.setGridData([]);
      });
  };

  const onSearchDetail = uuid => {
    if (uuid == null) return;

    const searchParams: any = {
      rework_uuid: uuid,
    };

    let data = [];

    getData(searchParams, detailSearchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        detailGrid.setGridData(data);
      });
  };

  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
    },

    update: () => {
      // todo: 현황 화면은 수정 기능이 필요 없음
    },

    delete: () => {
      // todo: 현황 화면은 삭제 기능이 필요 없음
    },

    create: () => {
      // todo: 현황 화면은 신규 추가 기능이 필요 없음
    },

    createDetail: null,

    save: () => {
      // todo: 현황 화면은 저장 기능이 필요 없음
    },

    cancelEdit: () => {
      // todo: 현황 화면은 편집 취소 기능이 필요 없음
    },

    printExcel: dataGridEvents.printExcel,
  };

  /** 템플릿에 전달할 값 */
  const props: ITpDoubleGridProps = {
    title,
    dataSaveType: 'basic',
    templateOrientation: 'horizontal',
    templateType: 'report',
    gridRefs: [grid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...grid.gridInfo,
        onAfterClick: onClickHeader,
      },
      detailGrid.gridInfo,
    ],
    searchProps: [
      {
        ...searchInfo?.props,
        onSearch,
      },
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.rework_uuid),
      },
    ],
    inputProps: [null, null],

    popupGridRefs: [null, null, null],
    popupGridInfos: [null, null, null],
    popupVisibles: [null, null, null],
    setPopupVisibles: [null, null, null],
    popupInputProps: [null, null, null],
    buttonActions,
    modalContext,
  };

  return <TpDoubleGrid {...props} />;
};
