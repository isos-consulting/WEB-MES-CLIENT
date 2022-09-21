import React, { useLayoutEffect, useMemo, useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  convDataToSubTotal,
  dataGridEvents,
  getData,
  getPageName,
  getToday,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { message } from 'antd';

/** 불량현황 */
export const PgPrdWorkReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/prd/works/report';
  const saveUriPath = null;

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    onAfterFilter: ev => {
      setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData);
    },
    onAfterUnfilter: ev => {
      setSubTotalDatas(ev?.instance?.store?.data?.filteredRawData);
    },
  });

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '생산일',
    },

    {
      type: 'radio',
      id: 'sort_type',
      default: 'none',
      label: '소계기준',
      options: [
        { code: 'none', text: '없음' },
        { code: 'proc', text: '공정별' },
        { code: 'prod', text: '품목별' },
        { code: 'date', text: '일자별' },
      ],
    },
  ]);

  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['order_qty', 'qty', 'total_qty', 'reject_qty'],
      textColumns: [
        {
          columnName: 'proc_nm',
          content: '합계',
        },
        {
          columnName: 'item_type_nm',
          content: '합계',
        },
        {
          columnName: 'reg_date',
          content: '합계',
        },
      ],
    },
    hidden: searchInfo.values?.sort_type === 'none' ? true : false,
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'proc':
        _columns = [
          {
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '공정명',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '지시일',
            width: ENUM_WIDTH.M,
            name: 'order_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '실적일',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: '설비명',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '작업교대명',
            width: ENUM_WIDTH.M,
            name: 'shift_nm',
            filter: 'text',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '생산 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '입고창고',
            width: ENUM_WIDTH.L,
            name: 'to_store_nm',
            filter: 'text',
          },
          {
            header: '입고위치',
            width: ENUM_WIDTH.L,
            name: 'to_location_nm',
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'prod':
        _columns = [
          {
            header: '품목',
            width: ENUM_WIDTH.M,
            name: 'prod_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: '공정명',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '지시일',
            width: ENUM_WIDTH.M,
            name: 'order_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '실적일',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '설비명',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '작업교대명',
            width: ENUM_WIDTH.M,
            name: 'shift_nm',
            filter: 'text',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '생산 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '입고창고',
            width: ENUM_WIDTH.L,
            name: 'to_store_nm',
            filter: 'text',
          },
          {
            header: '입고위치',
            width: ENUM_WIDTH.L,
            name: 'to_location_nm',
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'date':
      case 'none':
      default:
        _columns = [
          {
            header: '지시일자',
            width: ENUM_WIDTH.M,
            name: 'order_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '실적일자',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '공정명',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '모델',
            width: ENUM_WIDTH.L,
            name: 'model_nm',
            filter: 'text',
          },
          {
            header: '규격',
            width: ENUM_WIDTH.L,
            name: 'prod_std',
            filter: 'text',
          },
          {
            header: '단위',
            width: ENUM_WIDTH.S,
            name: 'unit_nm',
            filter: 'text',
          },
          {
            header: '설비명',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '작업교대명',
            width: ENUM_WIDTH.M,
            name: 'shift_nm',
            filter: 'text',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '생산 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '입고창고',
            width: ENUM_WIDTH.L,
            name: 'to_store_nm',
            filter: 'text',
          },
          {
            header: '입고위치',
            width: ENUM_WIDTH.L,
            name: 'to_location_nm',
            filter: 'text',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;
    }

    grid?.setGridColumns(_columns);

    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'proc':
        _columns = [
          {
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '공정명',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
        ];
        break;

      case 'prod':
        _columns = [
          {
            header: '품목',
            width: ENUM_WIDTH.M,
            name: 'prod_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.M,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.M,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
        ];
        break;

      case 'date':
        _columns = [
          {
            header: '실적일자',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'date',
            format: 'date',
          },
          {
            header: '발주수량',
            width: ENUM_WIDTH.M,
            name: 'order_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '생산수량',
            width: ENUM_WIDTH.M,
            name: 'total_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '양품수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
          {
            header: '부적합수량',
            width: ENUM_WIDTH.M,
            name: 'reject_qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STCOK,
            filter: 'number',
          },
        ];
        break;

      case 'none':
      default:
        _columns = [];
        break;
    }
    subGrid?.setGridColumns(_columns);
    return _columns;
  }, [grid?.gridInfo.data, searchInfo?.values]);

  /** 액션 관리 */

  // 서브토탈 타이틀 세팅
  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'proc'
        ? '공정별'
        : searchInfo.values?.sort_type === 'prod'
        ? '품목별'
        : searchInfo.values?.sort_type === 'date'
        ? '일자별'
        : '',
    );
  }, [searchInfo?.values]);

  const setSubTotalDatas = (data: object[]) => {
    if (data?.length > 0) {
      const curculationColumnNames = [
        'order_qty',
        'total_qty',
        'qty',
        'reject_qty',
      ];
      const standardNames =
        searchInfo.values?.sort_type === 'prod'
          ? [
              'prod_uuid',
              'item_type_nm',
              'prod_type_nm',
              'rev',
              'prod_no',
              'prod_nm',
              'model_nm',
              'prod_std',
              'unit_nm',
            ]
          : searchInfo.values?.sort_type === 'proc'
          ? ['proc_uuid', 'proc_nm']
          : searchInfo.values?.sort_type === 'date'
          ? ['reg_date']
          : null;
      const subGridData =
        convDataToSubTotal(data, {
          standardNames: standardNames,
          curculations: [{ names: curculationColumnNames, type: 'sum' }],
        }).subTotals || [];

      subGrid.setGridData(subGridData);
    } else {
      subGrid.setGridData([]);
    }
  };
  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  /** 검색 */
  const onSearch = values => {
    const searchKeys = ['start_date', 'end_date', 'sort_type'];
    const searchParams = cleanupKeyOfObject(values, searchKeys);

    //입력된 두 개의 날짜 전후 비교
    const firstDate = new Date(searchParams.start_date);
    const secondDate = new Date(searchParams.end_date);

    if (firstDate > secondDate) {
      message.error('조회 기간의 순서가 올바른지 확인하세요.');
      return;
    }

    if (secondDate > new Date(getToday())) {
      message.error('오늘 이후의 날짜로 입력할 수 없습니다');
      return;
    }

    if (values?.sort_type === 'none') {
      searchParams['sort_type'] = 'date';
    }

    let data = [];

    getData(searchParams, searchUriPath, 'raws')
      .then(res => {
        data = res;
      })
      .finally(() => {
        inputInfo?.instance?.resetForm();
        subGrid.setGridData([]);
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

    subTitle,
    subGridRef: subGrid.gridRef,
    subGridInfo: subGrid.gridInfo,

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
