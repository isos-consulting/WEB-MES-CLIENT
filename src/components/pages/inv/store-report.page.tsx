import React, { useState } from 'react';
import {
  getPopupForm,
  IGridColumn,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
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
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';

/** 재고실사현황 */
export const PgInvStoreReport = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/inv/stores';
  const saveUriPath = null;

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '실사일',
    },
    {
      type: 'combo',
      id: 'store_uuid',
      label: '입고창고',
      firstItemType: 'all',
      default: 'all',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'all',
        },
      },
    },
    {
      type: 'text',
      id: 'tran_type_cd',
      label: '수불유형',
      default: 'INVENTORY',
      hidden: true,
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  const columns: IGridColumn[] = [
    {
      header: '실사일',
      name: 'reg_date',
      width: ENUM_WIDTH.M,
      filter: 'text',
      format: 'date',
    },
    {
      header: '품목유형',
      width: ENUM_WIDTH.L,
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
    { header: '품명', width: ENUM_WIDTH.L, name: 'prod_nm', filter: 'text' },
    { header: '모델', width: ENUM_WIDTH.L, name: 'model_nm', filter: 'text' },
    {
      header: 'Rev',
      width: ENUM_WIDTH.S,
      name: 'rev',
      filter: 'text',
      align: 'center',
    },
    { header: '규격', width: ENUM_WIDTH.L, name: 'prod_std', filter: 'text' },
    { header: '단위', width: ENUM_WIDTH.XS, name: 'unit_nm', filter: 'text' },
    {
      header: '부적합',
      width: ENUM_WIDTH.M,
      name: 'reject_nm',
      filter: 'text',
    },
    { header: 'LOT NO', width: ENUM_WIDTH.L, name: 'lot_no', filter: 'text' },
    {
      header: '입출고 유형',
      width: ENUM_WIDTH.S,
      name: 'inout_state',
      filter: 'text',
      align: 'center',
    },
    {
      header: '실사수량',
      width: ENUM_WIDTH.M,
      name: 'qty',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      filter: 'number',
    },
    { header: '창고명', name: 'store_nm', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '위치명',
      name: 'location_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    { header: '비고', width: ENUM_WIDTH.XL, name: 'remark', filter: 'text' },
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
