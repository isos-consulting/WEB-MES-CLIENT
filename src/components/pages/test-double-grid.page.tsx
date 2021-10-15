
import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { Datagrid, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps, { TExtraGridPopups } from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import dayjs from 'dayjs';


// 금액 컬럼 계산 (단가 * 수량 * 환율)
const priceFormula = (params, props) => {
  const {value, targetValues} = params;
  return (Number(value) * Number(targetValues?._array[0]) * Number(targetValues?._array[1])) || 0;
};


/** 2분할 테스트 페이지 */
export const PgTestDoubleGrid = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/out/receives';
  const headerSaveUriPath = '/out/receives';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/out/receive/$/include-details';
  const detailSaveUriPath = '/out/receives';
  const searchInitKeys = ['start_date', 'end_date'];

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header: '외주입하UUID', name:'receive_uuid', alias:'uuid', hidden:true},
    {header: '전표번호', name:'stmt_no', width:ENUM_WIDTH.L},
    {header: '입하일', name:'reg_date', width:ENUM_WIDTH.M, format:'date'},
    {header: '거래처UUID', name:'partner_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header: '거래처명', name:'partner_nm', width:ENUM_WIDTH.L},
    {header: '공급처UUID', name:'supplier_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header: '공급처명', name:'supplier_nm', width:ENUM_WIDTH.L, hidden:true},
    {header: '합계금액', name:'total_qty', width:ENUM_WIDTH.L, format:'number'},
    {header: '비고', name:'remark', width:ENUM_WIDTH.L, hidden:true},
  ], {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header: '외주입하상세UUID', name:'receive_detail_uuid', alias:'uuid', hidden:true},
    {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '품목유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.S, filter:'text', format:'popup', hidden:true},
    {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '제품유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true, requiredField:true},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},
    {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.S, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, filter:'text', format:'popup', editable:true, requiredField:true},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text', editable:true, requiredField:true},
    {header: '화폐단위아이디', name:'money_unit_uuid', hidden:true, requiredField:true},
    {header: '화폐단위', name:'money_unit_nm', width:ENUM_WIDTH.S, filter:'text', requiredField:true},
    {header: '단가', name:'price', width:ENUM_WIDTH.M, format:'number', decimal:ENUM_DECIMAL.DEC_PRICE, editable:true, requiredField:true,
      formula: {
        targetColumnNames:['qty', 'exchange'], resultColumnName:'total_price',
        formula: priceFormula
      }
    },
    {header: '환율', name:'exchange', width:ENUM_WIDTH.M, format:'number', filter:'number', editable:true, requiredField:true, 
      formula: {
        targetColumnNames:['qty', 'price'], resultColumnName:'total_price',
        formula: priceFormula
      }
    },
    {header: '발주량', name:'order_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header: '수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number', editable:true, requiredField:true, 
      formula: {
        targetColumnNames:['price', 'exchange'], resultColumnName:'total_price',
        formula: priceFormula
      }
    },
    {header: '금액', name:'total_price', width:ENUM_WIDTH.M, format:'number', filter:'number', requiredField:true,
      defaultValue: (props, row) => {
        if (row == null) return;
        return Number(row?.qty) * Number(row?.price) * Number(row?.exchange);
      }
    },
    {header: '수입검사', name:'insp_fg', width:ENUM_WIDTH.S, format:'check', filter:'text', requiredField:true},
    {header: '이월', name:'carry_fg', width:ENUM_WIDTH.S, format:'check', filter:'text', editable:true, requiredField:true},
    {header: '창고아이디', name:'to_store_uuid', width:ENUM_WIDTH.L, format:'popup', filter:'text', hidden:true},
    {header: '창고', name:'to_store_nm', width:ENUM_WIDTH.L, format:'popup', filter:'text', requiredField:true},
    {header: '위치아이디', name:'to_location_uuid', width:ENUM_WIDTH.L,format:'popup', filter:'text', hidden:true},
    {header: '위치', name:'to_location_nm', width:ENUM_WIDTH.L,format:'popup', filter:'text', editable:true, requiredField:true},
    {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header: '비고', name:'remark', width:ENUM_WIDTH.L, filter:'text'},
    {header: '바코드', name:'barcode', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
    gridPopupInfo: [
      { // 입고창고
        popupKey: '창고관리',
        columnNames: [
          {original:'to_store_uuid', popup:'store_uuid'},
          {original:'to_store_nm', popup:'store_nm'},
        ],
        gridMode: 'select',
      },
      { // 입고위치
        popupKey: '위치관리',
        columnNames: [
          {original:'to_location_uuid', popup:'location_uuid'},
          {original:'to_location_nm', popup:'location_nm'},
        ],
        gridMode: 'select',
      },
    ]
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', detailGrid.gridInfo.columns, {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    rowAddPopupInfo: {
      modalProps: {
        title: '구매단가',
      },
      columnNames:[
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'safe_stock', popup:'safe_stock'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'money_unit_uuid', popup:'money_unit_uuid'},
        {original:'money_unit_nm', popup:'money_unit_nm'},
        {original:'price_type', popup:'price_type'},
        {original:'price', popup:'price'},
        {original:'exchange', popup:'exchange'},
        {original:'insp_fg', popup:'qms_receive_insp_fg'},
        {original:'to_store_uuid', popup:'to_store_uuid'},
        {original:'to_store_nm', popup:'to_store_nm'},
        {original:'to_location_uuid', popup:'to_location_uuid'},
        {original:'to_location_nm', popup:'to_location_nm'},
        {original:'order_qty', popup:'qty'},
        {original:'order_qty', popup:'mat_order_min_qty'},
        {original:'qty', popup:'balance'},
        {original:'lot_no', popup:'lot_no'},
      ],
      columns: [
        {header: '품목UUID', name:'prod_uuid', format:'text', hidden:true},
        {header: '품목 유형UUID', name:'item_type_uuid', format:'text', hidden:true},
        {header: '품목 유형코드', name:'item_type_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '제품 유형UUID', name:'prod_type_uuid', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, format:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, format:'text'},
        {header: '모델UUID', name:'model_uuid', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, format:'text'},
        {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
        {header: '단위UUID', name:'unit_uuid', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '화폐단위UUID', name:'money_unit_uuid', format:'text', hidden:true},
        {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '화폐단위명', name:'money_unit_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '단가유형UUID', name:'price_type_uuid', format:'text', hidden:true},
        {header: '단가유형코드', name:'price_type_cd', width:ENUM_WIDTH.M, format:'text', hidden:true},
        {header: '단가유형명', name:'price_type_nm', width:ENUM_WIDTH.M, format:'text'},
        {header: '단가', name:'price', width:ENUM_WIDTH.S, format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
        {header: '환율', name:'exchange', width:ENUM_WIDTH.S, format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
        {header: '수입검사', name:'qms_receive_insp_fg', width:ENUM_WIDTH.S, format:'check'},
        {header: '입고창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.M, hidden:true},
        {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.M},
        {header: '입고위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.M, hidden:true},
        {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.M},
        {header: '발주최소수량', name:'mat_order_min_qty', width:ENUM_WIDTH.M, format:'number'},
        {header: 'LOT_NO', name:'lot_no', width:ENUM_WIDTH.M, hidden:true, defaultValue: getToday('YYYYMMDD')},
      ],
      dataApiSettings: () => {
        type TParams = {date?:string, partner_uuid?:string, supplier_uuid?:string, uuid?:string};
        let inputValues = null;
        let params:TParams = {};

        if (newDataPopupGridVisible) { // 신규 등록 팝업일 경우
          inputValues = newDataPopupInputInfo.values;

        } else { // 세부 항목 등록 팝업일 경우
          inputValues = addDataPopupInputInfo.values;
        }

        if (inputValues != null) {
          params = {
            uuid : newDataPopupGridVisible ? null : inputValues?.receive_uuid,
            partner_uuid: inputValues?.partner_uuid,
            supplier_uuid: inputValues?.supplier_uuid,
            date: inputValues?.reg_date ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD') : null,
          };
        }

        return {
          uriPath: '/std/vendor-prices',
          params,
          onInterlock: () => {
            let showPopup:boolean = false;
            
            if (params?.date == null) {
              message.warn('입하일을 입력하신 후 다시 시도해주세요.');

            } else if (params?.partner_uuid == null) {
              message.warn('거래처를 선택하신 후 다시 시도해주세요.');

            } else {
              showPopup = true; 
            }

            return showPopup;
          }
        }
      },
      gridMode:'multi-select'
    },
    gridPopupInfo: detailGrid.gridInfo.gridPopupInfo,
    extraButtons: [
      {
        buttonProps:{text:'발주 불러오기'},
        buttonAction:(ev, props, options) => {
          const {gridRef, childGridRef, childGridId, columns, data, modal, onAppendRow} = options;
          const updateColumns:{original:string, popup:string}[] = props.rowAddPopupInfo.columnNames;

          let params = {
            complete_state: 'all',
            partner_uuid: null,
          };
          
          if (newDataPopupGridVisible) {
            params['partner_uuid'] = newDataPopupInputInfo.values?.partner_uuid;

          } else if (editDataPopupGridVisible) {
            params['partner_uuid'] = editDataPopupInputInfo.values?.partner_uuid;

          } else if (addDataPopupGridVisible) {
            params['partner_uuid'] = addDataPopupInputInfo.values?.partner_uuid;
          }

          if (params?.partner_uuid == null) {
            message.warn('거래처를 선택하신 후 다시 시도해주세요.');
            return;
          }

          getData(
            params, 
            '/mat/order-details'

          ).then((res) => {
            modal.confirm({
              title: '발주품목 - 다중선택',
              width: '80%',
              content:
                <>
                  <Datagrid
                    ref={childGridRef}
                    gridId={'GRID_POPUP_ORDER'}
                    columns={[
                      {header: '세부발주UUID', name:'order_detail_uuid', alias:'uuid', hidden:true},
                      {header: '발주UUID', name:'order_uuid', hidden:true},
                      {header: '납기일', width:ENUM_WIDTH.M, name:'due_date', format:'date', filter:'text'},
                      {header: '완료상태', width:ENUM_WIDTH.S, name:'complete_state', align:'center'},
                      // {header: '완료여부', width:ENUM_WIDTH.S, name:'complete_fg', format:'check'},
                      {header: '품목UUID', name:'prod_uuid', hidden:true},
                      {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text', align:'center'},
                      {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text', align:'center'},
                      {header: '품번', width:ENUM_WIDTH.M, name:'prod_no', filter:'text'},
                      {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
                      {header: '모델', width:ENUM_WIDTH.M, name:'model_nm', filter:'text'},
                      {header: 'Rev', width:ENUM_WIDTH.S, name:'rev'},
                      {header: '규격', width:ENUM_WIDTH.L, name:'prod_std'},
                      {header: '안전재고', width:ENUM_WIDTH.S, name:'safe_stock', decimal:ENUM_DECIMAL.DEC_STCOK},
                      {header: '단위UUID', name:'unit_uuid', hidden:true},
                      {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm'},
                      {header: '발주량', width:ENUM_WIDTH.S, name:'qty', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
                      {header: '미납량', width:ENUM_WIDTH.S, name:'balance', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
                      {header: '화폐단위UUID', name:'money_unit_uuid', hidden:true},
                      {header: '화폐단위', width:ENUM_WIDTH.M, name:'money_unit_nm'},
                      {header: '단가유형UUID', name:'price_type_uuid', hidden:true},
                      {header: '단가유형', width:ENUM_WIDTH.M, name:'price_type_nm'},
                      {header: '단가', width:ENUM_WIDTH.S, name:'price', format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
                      {header: '환율', width:ENUM_WIDTH.S, name:'exchange', format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
                      {header: '수입검사', width:ENUM_WIDTH.S, name:'qms_receive_insp_fg', format:'check'},
                      {header: '입고창고아이디', name:'to_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
                      {header: '입고창고', name:'to_store_nm', width:ENUM_WIDTH.L, filter:'text'},
                      {header: '입고위치아이디', name:'to_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
                      {header: '입고위치', name:'to_location_nm', width:ENUM_WIDTH.L, filter:'text', editable:true},
                      {header: 'LOT_NO', name:'lot_no', width:ENUM_WIDTH.M, hidden:false, defaultValue: getToday('YYYYMMDD')},
                    ]}
                    gridMode='multi-select'
                    data={res}
                  />
                </>,
              icon:null,
              okText: '선택',
              onOk: () => {
                const child = childGridRef.current;
                const rows = child.getInstance().getCheckedRows();
      
                rows?.forEach((row) => {
                  let newRow = {};
                  if (typeof row === 'object') {
                    updateColumns.forEach((columnName) => {
                      // 값 설정
                      newRow[columnName.original] = row[columnName.popup] != null ? row[columnName.popup] : null;
                    });
        
                    // 행 추가
                    onAppendRow(newRow);
                  }
                })
              },
              cancelText:'취소',
              maskClosable:false,
            });
          });
        },
      }
    ],
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', newDataPopupGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    extraButtons: newDataPopupGrid.gridInfo.extraButtons,
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', newDataPopupGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    extraButtons: newDataPopupGrid.gridInfo.extraButtons,
  });

  /** 헤더 클릭 이벤트 */
  const onClickHeader = (ev) => {

    const {targetType, rowKey, instance} = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = (uuid) => {
    if (!uuid) return;

    const uriPath = detailSearchUriPath.replace('$', uuid);
    getData(detailSearchInfo?.values, uriPath, 'header-details').then((res) => {
      detailGrid.setGridData(res?.details || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(), getToday()], label:'입하일'},
  ]);

  const detailSearchInfo = null;//useSearchbox('DETAIL_SEARCH_INPUTBOX', []);

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(searchParams, headerSearchUriPath).then((res) => {
      data = res;
    }).finally(() => {
      setSelectedHeaderRow(null);
      headerGrid.setGridData(data);
    });

    return data;
  };

  const onSearchDetail = (uuid) => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  }
  //#endregion


  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type: 'text', id: 'receive_uuid', alias:'uuid', label: '외주입하UUID', disabled:true, hidden:true},
    {type:'date', id:'reg_date', label:'입하일', disabled:true, default:getToday()},
    {type:'text', id:'stmt_no', label:'전표번호', disabled:true},
    {type:'number', id:'total_price', label:'합계금액', disabled:true, decimal:ENUM_DECIMAL.DEC_PRICE},
    {type:'text', id:'partner_uuid', label:'거래처UUID', disabled:true, hidden:true},
    {type:'text', id:'partner_nm', label:'거래처', disabled:true, usePopup:true, popupKey:'거래처관리', popupKeys:['partner_uuid', 'partner_nm']},
    {type:'text', id:'supplier_nm', label:'공급처', disabled:true, usePopup:true, popupKey:'공급처관리', popupKeys:['supplier_uuid', 'supplier_nm']},
    {type:'text', id:'remark', label:'비고', disabled:true},
  ]);

  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', 
    cloneObject(detailInputInfo.props?.inputItems)?.map((el) => {
        if (!['total_price'].includes(el?.id))
          el['disabled'] = false; 

        if (el?.id === 'reg_date')
          el['default'] = getToday();
          
        return el;
      }
    )
  );

  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', 
    cloneObject(detailInputInfo.props?.inputItems)?.map((el) => {
        if (!['partner_nm', 'reg_date', 'total_price'].includes(el?.id))
          el['disabled'] = false;

        if (el?.id === 'reg_date')
          el['default'] = getToday();
          
        return el;
      }
    )
  );

  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', detailInputInfo.props?.inputItems);
  //#endregion
  


  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.receive_uuid);
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {

    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      // ❗ 세부 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      addDataPopupInputInfo.setValues(detailInputInfo.values);
    }

  }, [addDataPopupGridVisible, detailInputInfo.values]);
  
  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo.setValues(detailInputInfo.values);
      editDataPopupGrid.setGridData(detailGrid.gridInfo.data);
    }

  }, [editDataPopupGridVisible, detailInputInfo.values, detailGrid.gridInfo.data]);
  //#endregion

  const onSave = () => {
    const {gridRef, setGridMode} = detailGrid;
    const {columns, saveUriPath} = detailGrid.gridInfo;

    if (!detailInputInfo.isModified && !isModified(detailGrid.gridRef, detailGrid.gridInfo.columns)) {
      message.warn('편집된 데이터가 없습니다.');
      return;
    }
    
    dataGridEvents.onSave('headerInclude', {
      gridRef,
      setGridMode,
      columns,
      saveUriPath,
    }, detailInputInfo.values, modal,
      (res) => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then((searchResult) => {
          const headerRow = res?.datas?.raws[0]?.receive?.header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailInputInfo?.values?.receive_uuid == null) {
      message.warn('전표를 선택하신 후 다시 시도해 주세요.');
      return false;
    };
    return true;
  }
  
  //#region 🔶작동될 버튼들의 기능 정의 (By Template) 
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (getModifiedRows(detailGrid.gridRef, detailGrid.gridInfo.columns)?.deletedRows?.length === 0) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },
    
    /** 신규 추가 */
    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },
    
    /** 상세 신규 추가 */
    createDetail: () => {
      if (!onCheckUuid()) return;
      setAddDataPopupGridVisible(true);
    },

    /** 저장(수정, 삭제) */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const {gridRef, setGridMode} = detailGrid;
      const {columns} = detailGrid.gridInfo;
      
      if (detailInputInfo.isModified || isModified(gridRef, columns)) { // 편집 이력이 있는 경우
        modal.confirm({
          title: '편집 취소',
          // icon: <ExclamationCircleOutlined />,
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk:() => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel:() => {
          },
          okText: '예',
          cancelText: '아니오',
        });

      } else { // 편집 이력이 없는 경우
        setGridMode('view');
      }
    },

    printExcel: dataGridEvents.printExcel
  };
  //#endregion


  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    console.log(isSuccess, savedData)
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setNewDataPopupGridVisible(false);
  }

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setEditDataPopupGridVisible(false);
  }

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, savedUuid); });
    setAddDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.receive_uuid === uuid);
      
    if (!selectedRow) { selectedRow = searchResult[0]; }
    setSelectedHeaderRow(cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys));
  }


  const [customModalVisible, setCustomModalVisible] = useState<boolean>(false);
  const [customGridPopupVisible, setCustomGridPopupVisible] = useState<boolean>(false);

  //#region 🌵헤더 기타 버튼 커스텀 예시
  const headerExtraButtons = [
    {
      text: '모달 호출1',
      onClick: () => {
        modal.info({
          icon:null,
          title: '나는 modal함수로 호출 됐어',
          content: <img src='https://item.kakaocdn.net/do/ae897b8fe81a9cf7bcbe9af58d473755617ea012db208c18f6e83b1a90a7baa7'/>,
          okText: '확인',
        })
      }
    },
    {
      text: '모달 호출2',
      onClick: () => setCustomModalVisible(true),
    },
    {
      text: '그리드팝업 호출',
      onClick: () => setCustomGridPopupVisible(true),
    },
  ];
  //#endregion 


  //#region 🌵커스텀 모달 사용 예시
  const extraModals = [
    {
      title: '나는 템플릿에서 렌더링 되는 모달이야',
      children: <img src='https://item.kakaocdn.net/do/493188dee481260d5c89790036be0e66effd194bae87d73dd00522794070855d'/>,
      visible: customModalVisible,
      onCancel: () => setCustomModalVisible(false),
    },
  ];
  //#endregion


  //#region 🌵커스텀 그리드 팝업 사용 예시
  const extraGridPopups:TExtraGridPopups = [
    {
      title: '나는 템플릿에서 렌더링되는 그리드 팝업이야',
      popupId: 'TEST_GRID_POPUP',
      gridId: 'TEST_GRID_POPUP_GRID',
      columns: [
        {name:'test', header:'난 컬럼', format:'text'},

        /** 🌵셀에 버튼 넣기 사용 예시 */
        {name:'test_button', header:'글자고정', format:'button', width:200, options: {value:'셀을 클릭하면 동작'}},
        {name:'test_button2', header:'글자고정 + onClick속성사용', format:'button', width:200,
          options: {
            value:'버튼을 누르면 동작',
            onClick: (ev, props) => message.info(props.columnInfo.name + ' ' + props.rowKey + '을(를) 눌렀구나')
          }
        },
        {name:'test_button3', header:'동적버튼', format:'button', width:200,
          options: {
            formatter: (props) => props.columnInfo.name + ' ' + props.rowKey,
            onClick: (ev, props) => {
              const {columnInfo, rowKey} = props;
              modal.info({
                title: `${columnInfo.name} [${rowKey}]` + '의 팝업',
                content: '내용없음',
              })
            },
          }
        },
        {name:'test_button4', header:'로우데이터를 버튼글자로', format:'button', width:200},
      ],
      searchUriPath: null,
      searchParams: {},
      saveUriPath: null,
      saveParams: {},
      saveType: 'basic',
      onAfterClick: (ev) => {
        // afterClick이벤트를 써서 onClick을 누른 것처럼 사용할 수도 있다.
        const {columnName, rowKey, targetType} = ev;
        if (targetType !== 'cell' || columnName !== 'test_button') return;
        message.info(columnName + ' ' + rowKey + '을(를) 눌렀어');
      },
      data: [
        {test_button4: '김치찌개', otherKey:'....'},
        {test_button4: '된장찌개', otherKey:'....'},
        {test_button4: '고추바사삭', otherKey:'....'},
        {test_button4: '후라이드', otherKey:'....'},
        {test_button4: '양념', otherKey:'....'},
        {test_button4: '간장', otherKey:'....'},
        {test_button4: '스파게티', otherKey:'....'},
        {test_button4: '만두', otherKey:'....'},
        {test_button4: '라면', otherKey:'....'},
      ],
      visible: customGridPopupVisible,
      onOk: () => {
        message.info('확인 버튼을 눌렀구나');
      },
      onCancel: () => setCustomGridPopupVisible(false),
    },
  ];
  //#endregion



  //#region 🔶템플릿에 값 전달
  const props:ITpDoubleGridProps = {
    title,
    dataSaveType: 'headerInclude',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader
      }, 
      detailGrid.gridInfo
    ],
    popupGridRefs: [newDataPopupGrid.gridRef, addDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfos: [newDataPopupGrid.gridInfo, addDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
    searchProps: [
      {
        ...headerSearchInfo?.props, 
        onSearch: onSearchHeader
      }, 
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.receive_uuid)
      },
    ],
    inputProps: [null, detailInputInfo.props],  
    popupVisibles: [newDataPopupGridVisible, addDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisibles: [setNewDataPopupGridVisible, setAddDataPopupGridVisible, setEditDataPopupGridVisible],
    popupSearchProps: [newDataPopupSearchInfo?.props, addDataPopupSearchInfo?.props, editDataPopupSearchInfo?.props],
    popupInputProps: [newDataPopupInputInfo?.props, addDataPopupInputInfo?.props, editDataPopupInputInfo?.props],
    buttonActions,
    modalContext,

    headerExtraButtons,
    extraModals,
    extraGridPopups,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion


  return <TpDoubleGrid {...props}/>;
}

