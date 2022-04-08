import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { Datagrid, getPopupForm, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday, isModified } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_STD } from '~/enums';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';


/** 완료상태 컬럼 renderer 조건 */
const inspectionCondition = [
  { value: '완료', text: '완료', color: 'blue' },
  { value: '미완료', text: '미완료', color: 'red' },
  { value: '무검사', text: '무검사', color: 'block' }
];

/** 입하등록 */
export const PgMatReceive = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerSearchUriPath = '/mat/receives';
  const headerSaveUriPath = '/mat/receives';
  const detailSearchUriPath = '/mat/receive/{uuid}/include-details';
  const detailDefaultGridMode = 'delete';
  const detailSaveUriPath = '/mat/receives';
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
    {header: '입하UUID', name:'receive_uuid', alias:'uuid', hidden:true},
    {header: '전표번호', name:'stmt_no', filter:'text', width:ENUM_WIDTH.M},
    {header: '입하일', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', editable:true, format:'date', requiredField:true},
    {header: '거래처UUID', name:'partner_uuid', hidden:true},
    {header: '거래처명', name:'partner_nm', filter:'text', width:ENUM_WIDTH.M, editable:true, requiredField:true},
    {header: '공급처UUID', name:'supplier_uuid', hidden:true},
    {header: '공급처명', name:'supplier_nm', filter:'text', width:ENUM_WIDTH.M, editable:true},
    {header: '합계금액', name:'total_price', width:ENUM_WIDTH.M, editable:true, format:'number'},
  ], {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header: '세부입하UUID', name:'receive_detail_uuid', alias:'uuid', hidden:true},
    {header: '입하UUID', name:'receive_uuid', hidden:true},
    {header: '발주UUID', name:'order_detail_uuid', hidden:true},
    {header: '입고UUID', name:'income_uuid', hidden:true},
    {header: '품목UUID', name:'prod_uuid', hidden:true},
    {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text', format:'popup', editable:true, align:'center'},
    {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text', format:'popup', editable:true, align:'center'},
    {header: '품번', width:ENUM_WIDTH.M, name:'prod_no', filter:'text', format: 'popup', editable: true, requiredField:true},
    {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '모델', width:ENUM_WIDTH.M, name:'model_nm', filter:'text', format:'popup', editable:true},
    {header: 'Rev', width:ENUM_WIDTH.S, name:'rev', filter:'text', format:'popup', editable:true},
    {header: '규격', width:ENUM_WIDTH.L, name:'prod_std', filter:'text', format:'popup', editable:true},
    {header: '안전재고', width:ENUM_WIDTH.S, name:'safe_stock', format:'popup', editable:true},
    {header: '단위UUID', name:'unit_uuid', format:'popup', editable:true, hidden:true},
    {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text', editable:true, requiredField:true},
    {header: '화폐단위UUID', name:'money_unit_uuid', hidden:true, format:'popup', editable:true},
    {header: '화폐단위', width:ENUM_WIDTH.M, name:'money_unit_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '단가', width:ENUM_WIDTH.S, name:'price', format:'number', editable:true, requiredField:true},
    {header: '환율', width:ENUM_WIDTH.S, name:'exchange', format:'number', editable:true, requiredField:true},
    {header: '발주량', width:ENUM_WIDTH.S, name:'order_qty', format:'number', editable:false},
    {header: '수량', width:ENUM_WIDTH.S, name:'qty', format:'number', editable:true, requiredField:true},
    {header: '금액', width:ENUM_WIDTH.S, name:'total_price', format:'number', editable:false},
    {header: '수입검사', width:ENUM_WIDTH.S, name:'insp_fg', format:'check', editable:false, hiddenCondition: (props) => ['view', 'delete'].includes(props?.gridMode), requiredField:true},
    {header: '수입검사', width:ENUM_WIDTH.M, name:'insp_result', filter:'text', format:'tag', options:{conditions: inspectionCondition}, editable:false},
    {header: '이월', width:ENUM_WIDTH.S, name:'carry_fg', format:'check', editable:true, requiredField:true},
    {header: '입고창고UUID', name:'to_store_uuid', hidden:true, format:'popup', editable:true, requiredField:true},
    {header: '입고창고', width:ENUM_WIDTH.M, name:'to_store_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '입고위치UUID', name:'to_location_uuid', hidden:true, format:'popup', editable:true},
    {header: '입고위치', width:ENUM_WIDTH.M, name:'to_location_nm', filter:'text', format:'popup', editable:true},
    {header: '단위수량', width:ENUM_WIDTH.M, name:'unit_qty', format:'number', editable:true},
    {header: '비고', width:ENUM_WIDTH.XL, name:'remark', editable:true},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
    gridPopupInfo: [
      { // 창고팝업
        columnNames: [
          {original:'to_store_uuid', popup:'store_uuid'},
          {original:'to_store_cd', popup:'store_cd'},
          {original:'to_store_nm', popup:'store_nm'},
        ],
        columns: [
          {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '창고코드', name:'store_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '창고명', name:'store_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: (ev) => {
          const {rowKey, instance} = ev;
          const {rawData} = instance?.store?.data;

          return {
            uriPath: '/std/stores',
            params: {store_type:'available'},
            onAfterOk:() => {
              rawData[rowKey].to_location_uuid = '';
              rawData[rowKey].to_location_nm = '';
            }
          }
        },
        gridMode:'select'
      },
      { // 위치팝업
        columnNames: [
          {original:'to_location_uuid', popup:'location_uuid'},
          {original:'to_location_cd', popup:'location_cd'},
          {original:'to_location_nm', popup:'location_nm'},
        ],
        columns: [
          {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
          {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text'},
          {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text'},
        ],
        dataApiSettings: (ev) => {
          const {rowKey, instance} = ev;
          const {rawData} = instance?.store?.data;
      
          const storeUuid = rawData[rowKey]?.to_store_uuid
          return {
            uriPath: '/std/locations',
            params: {store_uuid: storeUuid ?? ''},
          }
        },
        gridMode:'select'
      }
    ]
  });

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type: 'text', id: 'receive_uuid', alias:'uuid', label: '입하UUID', disabled:true, hidden:true},
    {type:'text', id:'partner_uuid', label:'거래처UUID', disabled:true, hidden:true},
    {type:'text', id:'supplier_uuid', label:'공급처UUID', disabled:true, hidden:true},
    {type:'text', id:'stmt_no', label:'전표번호', disabled:true},
    {type:'date', id:'reg_date', label:'입하일', disabled:true},
    {
      type:'text', 
      id:'partner_nm', 
      label:'거래처', 
      disabled:true, 
      usePopup:true, 
      popupKey:'거래처관리', 
      popupKeys:['partner_uuid', 'partner_nm'], 
      params:{partner_fg:1}, 
      required:true,
      handleChange:(values)=>{newDataPopupGrid?.setGridData([]);}
    },
    {
      type:'text', 
      id:'supplier_nm', 
      label:'공급처', 
      disabled:true, 
      usePopup:true,
      popupKeys:['supplier_uuid', 'supplier_nm'], 
      popupButtonSettings: {
        datagridSettings:{
          gridId:null, 
          columns:getPopupForm('공급처관리').datagridProps.columns
        },
        dataApiSettings: (el) => {
          return {
            uriPath: URL_PATH_STD.SUPPLIER.GET.SUPPLIERS,
            params: {
              partner_uuid: el?.values?.partner_uuid
            },
            onInterlock: ()=> {
              if(el?.values?.partner_uuid) {
                return true;
              } else {
                message.warning('거래처를 먼저 선택해주세요.')
                return false;
              }
            }
          }
        },
        modalSettings:{title:'공급처 조회'}
      }
    },
    {type:'number', id:'total_qty', label:'합계수량', disabled:true},
    {type:'number', id:'total_price', label:'합계금액', disabled:true, decimal:ENUM_DECIMAL.DEC_PRICE},
    {type:'text', id:'remark', label:'비고', disabled:!(detailGrid.gridInfo.gridMode === 'update')},
  ],);

  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', 
    cloneDeep(detailInputInfo.props?.inputItems)?.map((el) => {
        if (el?.id !== 'total_qty' && el?.id !== 'total_price' && el?.id !== 'stmt_no') {
          el['disabled'] = false;
        }

        if (el?.id === 'reg_date')
          el['default'] = getToday();
          
        return el;
      }
    )
  );

  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', 
  cloneDeep(detailInputInfo.props?.inputItems)?.map((el) => {
        if (el?.id !== 'total_qty' && el?.id !== 'total_price' && el?.id !== 'partner_nm' && el?.id !== 'stmt_no') {
          el['disabled'] = false;
        }

        if (el?.id === 'reg_date')
          el['default'] = getToday();
          
        return el;
      }
    )
  );

  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', detailInputInfo.props.inputItems);
  //#endregion

  const extraButtons = [
    {
      buttonProps:{text:'발주 불러오기'},
      buttonAction:(ev, props, options) => {
        const {gridRef, childGridRef, childGridId, columns, data, modal, onAppendRow} = options;
        const updateColumns:{original:string, popup:string}[] = props.rowAddPopupInfo.columnNames;

        let params = {
          complete_state: 'incomplete',
          partner_uuid: null,
        };
        
        if (newDataPopupGridVisible) {
          params['partner_uuid'] = newDataPopupInputInfo.ref.current.values?.partner_uuid;

        } else if (editDataPopupGridVisible) {
          params['partner_uuid'] = editDataPopupInputInfo.ref.current.values?.partner_uuid;

        } else if (addDataPopupGridVisible) {
          params['partner_uuid'] = addDataPopupInputInfo.ref.current.values?.partner_uuid;
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
                    {header: '품목UUID', name:'prod_uuid', hidden:true},
                    {header: '품목유형', width:ENUM_WIDTH.M, name:'item_type_nm', filter:'text', align:'center'},
                    {header: '제품유형', width:ENUM_WIDTH.M, name:'prod_type_nm', filter:'text', align:'center'},
                    {header: '품번', width:ENUM_WIDTH.M, name:'prod_no', filter:'text'},
                    {header: '품명', width:ENUM_WIDTH.L, name:'prod_nm', filter:'text'},
                    {header: '모델', width:ENUM_WIDTH.M, name:'model_nm', filter:'text'},
                    {header: 'Rev', width:ENUM_WIDTH.S, name:'rev'},
                    {header: '규격', width:ENUM_WIDTH.L, name:'prod_std'},
                    {header: '안전재고', width:ENUM_WIDTH.S, name:'safe_stock'},
                    {header: '단위UUID', name:'unit_uuid', hidden:true},
                    {header: '단위', width:ENUM_WIDTH.XS, name:'unit_nm'},
                    {header: '화폐단위UUID', name:'money_unit_uuid', hidden:true},
                    {header: '화폐단위', width:ENUM_WIDTH.M, name:'money_unit_nm'},
                    {header: '단가', width:ENUM_WIDTH.S, name:'price', format:'number'},
                    {header: '환율', width:ENUM_WIDTH.S, name:'exchange', format:'number'},
                    {header: '미납수량', width:ENUM_WIDTH.S, name:'balance', format:'number'},
                    {header: '금액', width:ENUM_WIDTH.S, name:'total_price', format:'number'},
                    {header: '단위수량', width:ENUM_WIDTH.M, name:'unit_qty', format:'number'},
                    {header: '납기일', width:ENUM_WIDTH.M, name:'due_date', format:'date'},
                    {header: '비고', width:ENUM_WIDTH.XL, name:'remark'}
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
  ];
  
  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', 
    (cloneObject(detailGrid.gridInfo.columns) as any[]).filter(
      (el) => {
        if (el?.name === 'lot_no') {
          el['defaultValue'] = () => {
            const regDate = newDataPopupInputInfo?.values?.reg_date;
            return dayjs(regDate).format('YYYYMMDD');
          }
        }
        
        if (['item_type_nm', 'prod_type_nm', 'prod_no', 'prod_nm', 'model_nm', 'rev', 'prod_std', 'safe_stock', 'unit_nm', 'money_unit_nm'].includes(el?.name)) {
          el['editable'] = false;
        }

        return !['total_price', 'insp_result', 'order_qty'].includes(el.name);
      }
    ), {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,
    gridPopupInfo: detailGrid.gridInfo.gridPopupInfo,
    rowAddPopupInfo: {
      columnNames:[
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'order_detail_uuid', popup:'order_detail_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'safe_stock', popup:'safe_stock'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'money_unit_uuid', popup:'money_unit_uuid'},
        {original:'money_unit_nm', popup:'money_unit_nm'},
        {original:'price', popup:'price'},
        {original:'unit_qty', popup:'unit_qty'},
        {original:'to_store_uuid', popup:'to_store_uuid'},
        {original:'to_store_cd', popup:'to_store_cd'},
        {original:'to_store_nm', popup:'to_store_nm'},
        {original:'to_location_uuid', popup:'to_location_uuid'},
        {original:'to_location_cd', popup:'to_location_cd'},
        {original:'to_location_nm', popup:'to_location_nm'},
        {original:'insp_fg', popup:'qms_receive_insp_fg'},
        {original:'qty', popup:'balance'},
        {original:'exchange', popup:'exchange'},
      ],
      columns: [
        {header: '품목UUID', name:'prod_uuid', filter:'text', format:'text', hidden:true},
        {header: '품목 유형UUID', name:'item_type_uuid', filter:'text', format:'text', hidden:true},
        {header: '품목 유형코드', name:'item_type_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '제품 유형UUID', name:'prod_type_uuid', filter:'text', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '모델UUID', name:'model_uuid', filter:'text', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'text'},
        {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        {header: '안전재고', name:'safe_stock', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
        {header: '단위UUID', name:'unit_uuid', filter:'text', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '화폐단위UUID', name:'money_unit_uuid', filter:'text', format:'text', hidden:true},
        {header: '화폐단위코드', name:'money_unit_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '화폐단위명', name:'money_unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '단가유형UUID', name:'price_type_uuid', filter:'text', format:'text', hidden:true},
        {header: '단가유형코드', name:'price_type_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '단가유형명', name:'price_type_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '단가', name:'price', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_PRICE},
        {header: '소급단가', name:'retroactive_price', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_PRICE, hidden:true},
        {header: '배분율', name:'division', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, hidden:true},
        {header: '수입검사', width:ENUM_WIDTH.S, name:'qms_receive_insp_fg', format:'check'},
        {header: '입고창고UUID', name:'to_store_uuid', hidden:true, filter:'text', format:'text'},
        {header: '입고창고코드', width:ENUM_WIDTH.M, name:'to_store_cd', filter:'text', format:'text'},
        {header: '입고창고명', width:ENUM_WIDTH.M, name:'to_store_nm', filter:'text', format:'text'},
        {header: '입고위치UUID', name:'to_location_uuid', hidden:true, filter:'text', format:'text'},
        {header: '입고위치코드', width:ENUM_WIDTH.M, name:'to_location_cd', filter:'text', format:'text'},
        {header: '입고위치명', width:ENUM_WIDTH.M, name:'to_location_nm', filter:'text', format:'text'},
        {header: '비고', name:'remark', width:ENUM_WIDTH.XL, format:'text'},
      ],
      dataApiSettings: () => {
        type TParams = {date?:string, partner_uuid?:string, uuid?:string};
        let inputValues = null;
        let params:TParams = {};

        if (newDataPopupGridVisible) { // 신규 등록 팝업일 경우
          inputValues = newDataPopupInputInfo.ref.current.values;

        } else { // 세부 항목 등록 팝업일 경우
          inputValues = addDataPopupInputInfo.ref.current.values;
        }

        if (inputValues != null) {
          params = {
            uuid : newDataPopupGridVisible ? null : inputValues.receive_uuid,
            partner_uuid: inputValues?.partner_uuid,
            date: inputValues?.reg_date ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD') : null,
          };
        };

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
    extraButtons: extraButtons,
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', cloneObject(newDataPopupGrid.gridInfo.columns), {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    extraButtons: extraButtons,
  });
  
  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', 
    cloneObject(newDataPopupGrid.gridInfo.columns).map((el) => {
      if (['receive_detail_uuid', 'qty', 'price', 'money_unit_nm', 'exchange', 'carry_fg'].includes(el?.name)) {
        el['requiredField'] = true;
      } else {
        el['requiredField'] = false;
      }
      return el;
    }), 
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    }
  );

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

    const uriPath = detailSearchUriPath.replace('{uuid}', uuid);
    getData(detailSearchInfo?.values, uriPath, 'header-details').then((res:any) => {
      detailGrid.setGridData(res?.details || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(-7), getToday()], label:'입하일'},
  ]);
  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', null);

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
      detailInputInfo.ref.current.resetForm();
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

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.receive_uuid);
    }

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
      addDataPopupInputInfo.setValues(cloneDeep(detailInputInfo.ref.current.values));
    }

  }, [addDataPopupGridVisible, detailInputInfo.values]);
  
  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo.setValues(cloneDeep(detailInputInfo.ref.current.values));
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
    }, detailInputInfo.ref.current.values, modal,
      ({success, datas}) => {
        if (!success) return;

        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then((searchResult) => {
          const headerRow = datas?.raws[0]?.receive?.header[0];
          
          if (headerRow?.uuid == null) {
            setSelectedHeaderRow(null);
            return;
          }
          
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
    const selectedRow = searchResult?.find(el => el?.receive_uuid === uuid);
      
    if (!selectedRow) {
      setSelectedHeaderRow(null);
    } else {
      setSelectedHeaderRow(cleanupKeyOfObject(selectedRow, detailInputInfo?.inputItemKeys));
    }
  }

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

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion


  return <TpDoubleGrid {...props}/>;
}

