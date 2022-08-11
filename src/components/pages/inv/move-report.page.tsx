import React, { useState } from 'react';
import { IGridColumn, TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH, URL_PATH_INV } from '~/enums';

/** 재고실사현황 */
export const PgInvMoveReport = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = URL_PATH_INV.MOVE.GET.MOVES;
  const saveUriPath = null;

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '기준일',
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  const columns: IGridColumn[] = [
    {
      header: '이동일',
      width: ENUM_WIDTH.M,
      name: 'reg_date',
      filter: 'text',
      align: 'center',
      format: 'date',
    },
    {
      header: '품목유형',
      width: ENUM_WIDTH.M,
      name: 'item_type_nm',
      filter: 'text',
      align: 'center',
    },
    {
      header: '제품유형',
      width: ENUM_WIDTH.L,
      name: 'prod_type_nm',
      filter: 'text',
    },
    { header: '품번', width: ENUM_WIDTH.L, name: 'prod_no', filter: 'text' },
    {
      header: 'Rev',
      width: ENUM_WIDTH.S,
      name: 'rev',
      filter: 'text',
      align: 'center',
    },
    { header: '품명', width: ENUM_WIDTH.L, name: 'prod_nm', filter: 'text' },
    { header: '모델', width: ENUM_WIDTH.L, name: 'model_nm', filter: 'text' },
    { header: '규격', width: ENUM_WIDTH.L, name: 'prod_std', filter: 'text' },
    { header: '단위', width: ENUM_WIDTH.XS, name: 'unit_nm', filter: 'text' },
    {
      header: '출고창고',
      width: ENUM_WIDTH.L,
      name: 'from_store_nm',
      filter: 'text',
    },
    {
      header: '출고위치',
      width: ENUM_WIDTH.M,
      name: 'from_location_nm',
      filter: 'text',
    },
    {
      header: '입고창고',
      width: ENUM_WIDTH.L,
      name: 'to_store_nm',
      filter: 'text',
    },
    {
      header: '입고위치',
      width: ENUM_WIDTH.M,
      name: 'to_location_nm',
      filter: 'text',
    },
    { header: 'LOT NO', width: ENUM_WIDTH.L, name: 'lot_no', filter: 'text' },
    {
      header: '이동수량',
      width: ENUM_WIDTH.M,
      name: 'qty',
      format: 'number',
      filter: 'number',
    },
    { header: '비고', width: ENUM_WIDTH.M, name: 'remark', filter: 'text' },
  ];

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });
  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = values => {
    const searchParams = cleanupKeyOfObject(values, searchInfo?.searchItemKeys);

    let data = [];

    getData(
      {
        ...searchParams,
        store_uuid:
          (searchParams as any)?.store_uuid === 'all'
            ? null
            : (searchParams as any)?.store_uuid,
        stock_type: 'all',
        price_type: 'all',
        grouped_type: 'all',
      },
      searchUriPath,
      'raws',
    )
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        grid.setGridData(data);
      });
  };

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
    },

    /** 수정 */
    update: null,

    /** 삭제 */
    delete: null,

    /** 신규 추가 */
    create: null,

    /** 저장 */
    save: null,

    /** 편집 취소 */
    cancelEdit: null,

    printExcel: dataGridEvents.printExcel,
  };

  /** 템플릿에 전달할 값 */
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

    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [newDataPopupGrid?.gridInfo, editDataPopupGrid?.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
