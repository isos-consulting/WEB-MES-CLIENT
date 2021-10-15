import React, { useLayoutEffect, useMemo } from 'react';
import { useState } from "react";
import { TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, getData, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_WIDTH } from '~/enums';



/** 반출현황 */
export const PgMatReturnReport = () => {
  /** 페이지 제목 */
  const title = getPageName();
  const [subTitle, setSubTitle] = useState<string>('');

  /** 모달 DOM */
  const [, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/mat/returns/report';
  const saveUriPath = null;

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
  });
  const subGrid = useGrid('SUB_GRID', [], {
    summaryOptions: {
      sumColumns: ['qty', 'supply_price', 'tax', 'total_price', 'receive_qty'],
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
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(), getToday()], label:'반출일'},

    {type:'radio', id:'sort_type', default:'none', label:'조회기준',
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
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목아이디', name:'prod_uuid', filter:'text', hidden:true},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처코드', name:'partner_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출일자', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
      
          {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
          {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', filter:'text', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, filter:'text', hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, filter:'number', format:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, filter:'number', format:'number'},
          {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'},
        ];
        break;

      case 'date':
        _columns = [
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '반출일자', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처코드', name:'partner_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목아이디', name:'prod_uuid', filter:'text', hidden:true},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
      
          {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
          {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', filter:'text', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, filter:'text', hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text' },
        ];
        break;

      case 'partner':
      default:
        _columns = [
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처코드', name:'partner_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목아이디', name:'prod_uuid', filter:'text', hidden:true},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출일자', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
      
          {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
          {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '화폐단위아이디', name:'money_unit_uuid', filter:'text', hidden:true},
          {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.S, filter:'text', hidden:true},
          {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text'},
          {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text' },
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
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '품목아이디', name:'prod_uuid', filter:'text', hidden:true},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
      
          {header: '모델아이디', name:'model_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '모델', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
          {header: '단위아이디', name:'unit_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        ];
        break;

      case 'date':
        _columns = [
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '반출일자', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
        ];
        break;

      case 'partner':
        _columns = [
          {header: 'row_type', name:'row_type', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '자재반출상세아이디', name:'return_detail_uuid', filter:'text', hidden:true},
          {header: '거래처아이디', name:'partner_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처코드', name:'partner_cd', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '거래처', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
          {header: '반출수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '공급가액', name:'supply_price', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '부가세액', name:'tax', width:ENUM_WIDTH.S, format:'number', filter:'number'},
          {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number'},
          {header: '입하수량', name:'receive_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
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
      : ''
    );
  }, [searchInfo?.values]);

  /** 검색 */
  const onSearch = (values) => {
    const searchKeys = ['start_date', 'end_date', 'sort_type'];//Object.keys(searchInfo.values);
    const searchParams = cleanupKeyOfObject(values, searchKeys);

    let data = [];
    let subTotalData = [];

    getData(searchParams, searchUriPath, 'raws').then((res) => {
      data = res;

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