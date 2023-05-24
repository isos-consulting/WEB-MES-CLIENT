import React, { useLayoutEffect, useMemo, useState } from 'react';
import { TGridMode, useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  convertDataToSubTotal,
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

export const PgPrdWorkRejectReport = () => {
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');
  const [, modalContext] = Modal.useModal();

  const defaultGridMode: TGridMode = 'view';
  const searchUriPath = '/prd/work-rejects/report';
  const saveUriPath = null;

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

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
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
        { code: 'prod', text: '품목별' },
        { code: 'reject', text: '불량항목별' },
      ],
    },
  ]);

  const subGrid = useGrid('SUB_GRID', [], {
    disabledAutoDateColumn: true,
    summaryOptions: {
      sumColumns: ['qty'],
      textColumns: [
        {
          columnName: 'reject_proc_nm',
          content: '합계',
        },
        {
          columnName: 'item_type_nm',
          content: '합계',
        },
        {
          columnName: 'reject_type_nm',
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

  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sort_type) {
      case 'prod':
        _columns = [
          {
            header: '작업일',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '품목',
            width: ENUM_WIDTH.M,
            name: 'prod_id',
            filter: 'text',
            hidden: true,
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.L,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.L,
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
            header: 'Rev',
            width: ENUM_WIDTH.S,
            name: 'rev',
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
            width: ENUM_WIDTH.XS,
            name: 'unit_nm',
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
            header: '불량 발생 공정',
            width: ENUM_WIDTH.M,
            name: 'reject_proc_nm',
            filter: 'text',
          },
          {
            header: '불량유형',
            width: ENUM_WIDTH.L,
            name: 'reject_type_nm',
            filter: 'text',
          },
          {
            header: '불량명',
            width: ENUM_WIDTH.L,
            name: 'reject_nm',
            filter: 'text',
          },
          {
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
            filter: 'number',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'reject':
        _columns = [
          {
            header: '작업일',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '불량 발생 공정',
            width: ENUM_WIDTH.M,
            name: 'reject_proc_nm',
            filter: 'text',
          },
          {
            header: '불량유형',
            width: ENUM_WIDTH.L,
            name: 'reject_type_nm',
            filter: 'text',
          },
          {
            header: '불량',
            width: ENUM_WIDTH.L,
            name: 'reject_id',
            filter: 'text',
            hidden: true,
          },
          {
            header: '불량명',
            width: ENUM_WIDTH.L,
            name: 'reject_nm',
            filter: 'text',
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.L,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.L,
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
            header: 'Rev',
            width: ENUM_WIDTH.S,
            name: 'rev',
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
            width: ENUM_WIDTH.XS,
            name: 'unit_nm',
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
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
            filter: 'number',
          },
          {
            header: '비고',
            width: ENUM_WIDTH.XL,
            name: 'remark',
            filter: 'text',
          },
        ];
        break;

      case 'proc':
      case 'none':
      default:
        _columns = [
          {
            header: '작업일',
            width: ENUM_WIDTH.M,
            name: 'reg_date',
            filter: 'text',
            format: 'date',
          },
          {
            header: '불량 발생 공정',
            width: ENUM_WIDTH.M,
            name: 'reject_proc_nm',
            filter: 'text',
          },
          {
            header: '불량유형',
            width: ENUM_WIDTH.L,
            name: 'reject_type_nm',
            filter: 'text',
          },
          {
            header: '불량명',
            width: ENUM_WIDTH.L,
            name: 'reject_nm',
            filter: 'text',
          },
          {
            header: '품목유형',
            width: ENUM_WIDTH.L,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.L,
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
            header: 'Rev',
            width: ENUM_WIDTH.S,
            name: 'rev',
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
            width: ENUM_WIDTH.XS,
            name: 'unit_nm',
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
            header: 'LOT NO',
            width: ENUM_WIDTH.M,
            name: 'lot_no',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
            filter: 'number',
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
            header: '불량공정',
            width: ENUM_WIDTH.M,
            name: 'reject_proc_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '불량 발생 공정',
            width: ENUM_WIDTH.M,
            name: 'reject_proc_nm',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
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
            width: ENUM_WIDTH.L,
            name: 'item_type_nm',
            filter: 'text',
          },
          {
            header: '제품유형',
            width: ENUM_WIDTH.L,
            name: 'prod_type_nm',
            filter: 'text',
          },
          {
            header: '품번',
            width: ENUM_WIDTH.L,
            name: 'prod_no',
            filter: 'text',
          },
          {
            header: '품명',
            width: ENUM_WIDTH.L,
            name: 'prod_nm',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
            filter: 'number',
          },
        ];
        break;

      case 'reject':
        _columns = [
          {
            header: '불량UUID',
            width: ENUM_WIDTH.L,
            name: 'reject_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '불량유형UUID',
            width: ENUM_WIDTH.L,
            name: 'reject_type_uuid',
            filter: 'text',
            hidden: true,
          },
          {
            header: '불량유형',
            width: ENUM_WIDTH.L,
            name: 'reject_type_nm',
            filter: 'text',
          },
          {
            header: '불량명',
            width: ENUM_WIDTH.L,
            name: 'reject_nm',
            filter: 'text',
          },
          {
            header: '불량수량',
            width: ENUM_WIDTH.M,
            name: 'qty',
            format: 'number',
            decimal: ENUM_DECIMAL.DEC_STOCK,
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

  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sort_type === 'proc'
        ? '공정별'
        : searchInfo.values?.sort_type === 'prod'
        ? '품목별'
        : searchInfo.values?.sort_type === 'reject'
        ? '불량항목별'
        : '',
    );
  }, [searchInfo?.values]);

  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const setSubTotalDatas = (data: object[]) => {
    if (data?.length > 0) {
      const calculationColumnNames = ['qty'];
      const standardNames =
        searchInfo.values?.sort_type === 'prod'
          ? ['prod_uuid', 'item_type_nm', 'prod_type_nm', 'prod_nm', 'prod_no']
          : searchInfo.values?.sort_type === 'proc'
          ? ['reject_proc_uuid', 'reject_proc_nm']
          : searchInfo.values?.sort_type === 'reject'
          ? ['reject_uuid', 'reject_nm', 'reject_type_uuid', 'reject_type_nm']
          : null;
      const subGridData =
        convertDataToSubTotal(grid?.gridInfo?.data, {
          standardNames: standardNames,
          calculations: [{ names: calculationColumnNames, type: 'sum' }],
        }).subTotals || [];

      subGrid.setGridData(subGridData);
    } else {
      subGrid.setGridData([]);
    }
  };

  useLayoutEffect(() => {
    setSubTotalDatas(grid?.gridInfo?.data);
  }, [subColumns, grid?.gridInfo?.data]);

  const onSearch = values => {
    const searchKeys = ['start_date', 'end_date', 'sort_type'];
    const searchParams: { [key: string]: any } = cleanupKeyOfObject(
      values,
      searchKeys,
    );
    const firstDate = new Date(searchParams.start_date);
    const secondDate = new Date(searchParams.end_date);

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

  const buttonActions = {
    search: () => {
      onSearch(searchInfo?.values);
    },
    update: null,
    delete: null,
    create: null,
    save: null,
    cancelEdit: null,
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
