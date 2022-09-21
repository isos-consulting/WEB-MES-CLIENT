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

/** 비가동현황 */
export const PgPrdWorkDowntimeReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/prd/work-downtimes/report';
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
      ids: ['work_start_date', 'work_end_date'],
      defaults: [getToday(-7), getToday()],
      label: '작업일',
    },

    {
      type: 'radio',
      id: 'sort_type',
      default: 'none',
      label: '소계기준',
      options: [
        { code: 'none', text: '없음' },
        { code: 'proc', text: '공정별' },
        { code: 'equip', text: '설비별' },
        { code: 'downtime', text: '비가동별' },
      ],
    },
  ]);

  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['downtime'],
      textColumns: [
        {
          columnName: 'proc_nm',
          content: '합계',
        },
        {
          columnName: 'equip_nm',
          content: '합계',
        },
        {
          columnName: 'downtime_type_nm',
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
      case 'none':
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
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '설비',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
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
            header: '품목',
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
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
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
            header: '비가동유형',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_nm',
            filter: 'text',
          },
          {
            header: '비가동명',
            width: ENUM_WIDTH.L,
            name: 'downtime_nm',
            filter: 'text',
          },
          {
            header: '비가동 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'equip':
        _columns = [
          {
            header: '설비',
            width: ENUM_WIDTH.M,
            name: 'equip_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '설비',
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
            header: '공정',
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
            header: '품목',
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
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
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
            header: '비가동유형',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_nm',
            filter: 'text',
          },
          {
            header: '비가동명',
            width: ENUM_WIDTH.L,
            name: 'downtime_nm',
            filter: 'text',
          },
          {
            header: '비가동 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'downtime':
        _columns = [
          {
            header: '비가동',
            width: ENUM_WIDTH.L,
            name: 'downtime_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '비가동유형',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_nm',
            filter: 'text',
          },
          {
            header: '비가동명',
            width: ENUM_WIDTH.L,
            name: 'downtime_nm',
            filter: 'text',
          },
          {
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '설비',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
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
            header: '품목',
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
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
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
            header: '비가동 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      default:
        _columns = [
          {
            header: '비가동유형',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_nm',
            filter: 'text',
          },
          {
            header: '비가동명',
            width: ENUM_WIDTH.L,
            name: 'downtime_nm',
            filter: 'text',
          },
          {
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '작업장명',
            width: ENUM_WIDTH.M,
            name: 'workings_nm',
            filter: 'text',
          },
          {
            header: '설비',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
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
            header: '품목',
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
          { header: 'Rev', width: ENUM_WIDTH.S, name: 'rev', filter: 'text' },
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
            header: '비가동 시작 일시',
            width: ENUM_WIDTH.M,
            name: 'start_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 종료 일시',
            width: ENUM_WIDTH.M,
            name: 'end_date',
            filter: 'text',
            format: 'datetime',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
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
            header: '공정UUID',
            width: ENUM_WIDTH.L,
            name: 'proc_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '공정',
            width: ENUM_WIDTH.M,
            name: 'proc_nm',
            filter: 'text',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
          },
        ];
        break;

      case 'equip':
        _columns = [
          {
            header: '설비UUID',
            width: ENUM_WIDTH.L,
            name: 'equip_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '설비',
            width: ENUM_WIDTH.M,
            name: 'equip_nm',
            filter: 'text',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
          },
        ];
        break;

      case 'downtime':
        _columns = [
          {
            header: '비가동유형UUID',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '비가동유형',
            width: ENUM_WIDTH.L,
            name: 'downtime_type_nm',
            filter: 'text',
          },
          {
            header: '비가동UUID',
            width: ENUM_WIDTH.L,
            name: 'downtime_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '비가동명',
            width: ENUM_WIDTH.L,
            name: 'downtime_nm',
            filter: 'text',
          },
          {
            header: '비가동 시간(분)',
            width: ENUM_WIDTH.M,
            name: 'downtime',
            filter: 'number',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_NOMAL,
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
  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'proc'
        ? '공정별'
        : searchInfo.values?.sort_type === 'equip'
        ? '설비별'
        : searchInfo.values?.sort_type === 'downtime'
        ? '비가동별'
        : '',
    );
  }, [searchInfo?.values]);

  // subTotal 데이터 세팅
  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const setSubTotalDatas = (data: object[]) => {
    if (data?.length > 0) {
      const curculationColumnNames = ['downtime'];
      const standardNames =
        searchInfo.values?.sort_type === 'equip'
          ? ['equip_uuid', 'equip_nm']
          : searchInfo.values?.sort_type === 'proc'
          ? ['proc_uuid', 'proc_nm']
          : searchInfo.values?.sort_type === 'downtime'
          ? [
              'downtime_uuid',
              'downtime_nm',
              'downtime_type_uuid',
              'downtime_type_nm',
            ]
          : null;
      const subGridData =
        convDataToSubTotal(grid?.gridInfo?.data, {
          standardNames: standardNames,
          curculations: [{ names: curculationColumnNames, type: 'sum' }],
        }).subTotals || [];

      subGrid.setGridData(subGridData);
    } else {
      subGrid.setGridData([]);
    }
  };

  /** 검색 */
  const onSearch = values => {
    const searchKeys = ['work_start_date', 'work_end_date', 'sort_type'];
    const searchParams = cleanupKeyOfObject(values, searchKeys);

    //입력된 두 개의 날짜 전후 비교
    const firstDate = new Date(searchParams.work_start_date);
    const secondDate = new Date(searchParams.work_end_date);

    if (firstDate > secondDate) {
      message.error('조회 기간의 순서가 올바른지 확인하세요.');
      return;
    }

    if (values?.sort_type === 'none') {
      searchParams['sort_type'] = 'proc';
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
