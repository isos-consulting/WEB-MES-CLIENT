import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';



/** 제품출하현황 */
export const PgSalOutgoReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/sal/outgos/report';
  const saveUriPath = null;
  
  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });
  const subGrid = useGrid('SUB_GRID', [], {
    summaryOptions: {
      sumColumns: ['order_qty', 'outgo_order_qty', 'qty', 'supply_price', 'tax', 'total_price'],
      textColumns: [
        {
          columnName: 'partner_nm',
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
      ]
    }
  });

  const newDataPopupGrid = null;
  const editDataPopupGrid = null;
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(), getToday()], label:'출하일'},

    {type:'radio', id:'sub_total_type', default:'none', label:'조회기준',
      options: [
        {code:'none', text:'없음'},
        {code:'partner', text:'거래처별'},
        {code:'prod', text:'품목별'},
        {code:'date', text:'일자별'},
      ]
    },
  ]);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  const columns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sub_total_type) {
      case 'prod':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '출하일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '출고창고아이디', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '출고위치아이디', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '출하일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '출고창고아이디', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '출고위치아이디', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;

      case 'partner':
      default:
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '출하일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '출고창고아이디', name:'from_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고창고', name:'from_store_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '출고위치아이디', name:'from_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '출고위치', name:'from_location_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
          {header: '비고', width:ENUM_WIDTH.XL, name:'remark', filter:'text'},
        ];
        break;
    }

    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);

  const subColumns = useMemo(() => {
    let _columns = grid?.gridInfo?.columns;
    switch (searchInfo.values?.sub_total_type) {
      case 'prod':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '제품아이디', name:'prod_uuid', hidden:true},
          {header: '품목유형', width:ENUM_WIDTH.L, name:'item_type_nm', filter:'text'},
          {header: '제품유형', width:ENUM_WIDTH.L, name:'prod_type_nm', filter:'text'},
          {header: '품번', width:ENUM_WIDTH.L, name:'prod_no', filter:'text'},
          {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text'},
          {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
          {header: '모델', width:ENUM_WIDTH.L, name:'model_nm', filter:'text'},
          {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text'},
          {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
        ];
        break;

      case 'date':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '출하일자', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
        ];
        break;

      case 'partner':
        _columns = [
          {header: '제품수주상세UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '수주수량', width:ENUM_WIDTH.M, name:'order_qty', format:'number', filter:'number'},
          {header: '출하지시수량', width:ENUM_WIDTH.M, name:'outgo_order_qty', format:'number', filter:'number'},
          {header: '출하수량', width:ENUM_WIDTH.M, name:'qty', format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.L, format:'number', filter:'number'},
        ];
        break;

      default:
        _columns = null;
        break;
    }
    
    return _columns;    
  }, [grid?.gridInfo.data, searchInfo?.values]);



  /** 액션 관리 */
  useLayoutEffect(() => {
    grid?.setGridColumns(columns);
  }, [columns]);

  useLayoutEffect(() => {
    if (subColumns) {
      subGrid?.setGridColumns(subColumns);
      subGrid?.setGridHidden(false);

    } else {
      subGrid?.setGridHidden(true);
    }
  }, [subColumns]);

  useLayoutEffect(() => {
    setSubTitle(
      searchInfo.values?.sub_total_type === 'prod' ? '품목별'
      : searchInfo.values?.sub_total_type === 'date' ? '일자별'
      : searchInfo.values?.sub_total_type === 'partner' ? '거래처별'
      : searchInfo.values?.sub_total_type === 'store' ? '창고별'
      : ''
    );
  }, [searchInfo?.values]);

  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = ['start_date', 'end_date', 'sub_total_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

    let data = [];
    let subTotalData = [];

    getData(searchParams, searchUriPath, 'report').then((res) => {
      const {datas, subTotals} = res;
      data = datas;
      subTotalData = subTotals;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
      grid.setGridData(data);
      subGrid.setGridData(subTotalData);
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

    printExcel: dataGridEvents.printExcel
  };
  
  /** 템플릿에 전달할 값 */
  const props:ITpSingleGridProps = {
    title,
    templateType: 'report',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props, 
      onSearch
    }, 
    inputProps: null,  

    subTitle,
    subGridRef: subGrid.gridRef,
    subGridInfo: subGrid.gridInfo,
    
    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [newDataPopupGrid?.gridInfo, editDataPopupGrid?.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}