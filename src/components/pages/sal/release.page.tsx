import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { COLUMN_CODE, EDIT_ACTION_CODE, getPopupForm, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TExtraGridPopups } from '~/components/templates/grid-double/grid-double.template.type';
import dayjs from 'dayjs';



const changeNameToAlias = (data:object, items:any[]) => {
  let newData = cloneObject(data);
  
  Object.keys(newData)?.forEach(key => {
    const item = items?.find(el => el?.id === key);
    if (item?.alias)
      newData[item?.alias] = newData[key];
  });

  return newData;
}



/** 자재공정출고 */
export const PgSalRelease = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/sal/releases';
  const saveUriPath = '/sal/releases';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const STOCK_POPUP = getPopupForm('재고관리');
  const ORDER_PROD_POPUP = getPopupForm('수주품목관리');
  const OUTGO_ORDER_POPUP = getPopupForm('출하지시품목관리');
  
  const [orderProdPopupVisible, setOrderProdPopupVisible] = useState<boolean>(false);
  const [outgoOrderPopupVisible, setOutgoOrderPopupVisible] = useState<boolean>(false);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    {type:'date', id:'reg_date', label:'출고일', default:getToday()},
  ]);
  const editDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', newDataPopupInputInfo?.props?.inputItems);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '제품출고UUID', name:'release_uuid', width:ENUM_WIDTH.M, alias: 'uuid', filter:'text', format:'text', hidden:true},
    {header: '출고일', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', format:'date', requiredField:true},
    {header: '품목UUID', name:'prod_uuid', filter:'text', format:'popup', hidden:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true, requiredField:true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', requiredField:true},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.S, filter:'text', format:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text', format:'text', hidden:true},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text', requiredField:true},
    {header: '수량', name:'qty', width:ENUM_WIDTH.M, filter:'number', format:'number', editable:true, requiredField:true},

    {header: '제품수주상세UUID', name:'order_detail_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '수주수량', name:'order_qty', width:ENUM_WIDTH.M, filter:'number', format:'number'},
    {header: '제품출하지시상세UUID', name:'outgo_order_detail_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출하지시수량', name:'outgo_order_qty', width:ENUM_WIDTH.M, filter:'text', format:'number'},

    {header: '출고창고UUID', name:'from_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '출고창고명', name:'from_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', requiredField:true},

    {header: '출고위치UUID', name:'from_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '출고위치명', name:'from_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},

    {header: '입고창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.M, filter:'text', format:'popup', hidden:true},
    {header: '입고창고명', name:'to_store_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true, requiredField:true},

    {header: '입고위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
    {header: '입고위치명', name:'to_location_nm', width:ENUM_WIDTH.M, filter:'text', format:'popup', editable:true},

    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text', format:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
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
        dataApiSettings: {
          uriPath: '/std/stores',
          params: {store_type:'available'}
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
      
          const storeUuid = rawData[rowKey]?.to_store_uuid;
          return {
            uriPath: '/std/locations',
            params: {store_uuid: storeUuid ?? null}
          }
        },
        gridMode:'select'
      },
    ],
    rowAddPopupInfo: {
      columnNames: [
        {original:'prod_uuid', popup:'prod_uuid'},
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
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_cd', popup:'store_cd'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_location_uuid', popup:'location_uuid'},
        {original:'from_location_cd', popup:'location_cd'},
        {original:'from_location_nm', popup:'location_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: [
        {header: '창고UUID', name:'store_uuid', filter:'text', format:'text', hidden:true},
        {header: '창고코드', name:'store_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '창고명', name:'store_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
        
        {header: '위치UUID', name:'location_uuid', filter:'text', format:'text', hidden:true},
        {header: '위치코드', name:'location_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},

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
        {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
        {header: '단위UUID', name:'unit_uuid', filter:'text', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:ENUM_WIDTH.M, filter:'text', format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
        {header: '재고', name:'qty', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
      ],
      dataApiSettings: () => {
        // 출고일 기준으로 재고조회
        const params = {
          reg_date: newDataPopupInputInfo?.ref?.cureent?.values?.reg_date,
          stock_type: 'available',
          grouped_type: 'all',
          price_type: 'all',
        }
        return {
          uriPath: STOCK_POPUP?.uriPath,
          params,
        };
      },
      gridMode:'multi-select'
    },
  });

  const newDataPopupGridColumns = cloneObject(grid.gridInfo.columns)?.filter((el) => !['reg_date'].includes(el?.name));
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      saveParams: newDataPopupInputInfo?.ref?.current?.values,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
      extraButtons: [
        {
          buttonProps: {text: '수주품목 불러오기'},
          buttonAction: (ev, props, options) => {
            //수주품목을 불러오는 팝업 열기
            setOrderProdPopupVisible(true);
          }
        },
        {
          buttonProps: {text: '출하지시 불러오기'},
          buttonAction: (ev, props, options) => {
            //출하지시를 불러오는 팝업 열기
            setOutgoOrderPopupVisible(true);
          }
        },
      ],
    }
  );
  const editDataPopupGridColumns = cloneObject(newDataPopupGrid?.gridInfo?.columns)?.map(
    (el) => {
      if (!['qty', 'remark'].includes(el?.name))
        el['editable'] = false;

      return el;
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    cloneObject(editDataPopupGridColumns).map((el) => {
      if (['release_uuid', 'qty'].includes(el?.name)) {
        el['requiredField'] = true;
      } else {
        el['requiredField'] = false;
      }
      return el;
    }),
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], label:'출고일', defaults:[getToday(-7), getToday()]},
  ]);
  

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    const searchParams:any = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

    let data = [];

    getData(searchParams, searchUriPath).then((res) => {
      data = res;

    }).finally(() => {
      inputInfo?.instance?.resetForm();
      grid.setGridData(data);
    });
  };

  /** UPDATE / DELETE 저장 기능 */
  const onSave = () => {
    const {gridRef, setGridMode} = grid;
    const {columns, saveUriPath} = grid.gridInfo;
    
    dataGridEvents.onSave('basic', {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
        defaultGridMode,
      },inputInfo?.values, modal, () => onSearch(searchInfo?.values)
    );
  }

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch(searchInfo?.values);
    },

    /** 수정 */
    update: () => {
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows?.length === 0) {
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

    /** 저장 */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const {gridRef, setGridMode} = grid;
      const {columns} = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel
  };


  //#region 🔶 수주폼목 불러오기
  const orderProdPopupGrid = useGrid('ORDER_PROD_GRID', cloneObject(grid?.gridInfo?.columns).filter(el => !['reg_date', 'outgo_order_detail_uuid', 'outgo_order_qty', 'order_qty'].includes(el?.name)), {
    title: '수주폼목 불러오기',
    gridMode: 'create',
    gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
    rowAddPopupInfo: {
      columnNames: [
        {original:'reg_date', popup:'reg_date'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_locaiton_uuid', popup:'locaiton_uuid'},
        {original:'from_locaiton_nm', popup:'locaiton_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: STOCK_POPUP?.datagridProps?.columns,
      dataApiSettings: () => {
        const params = {
          stock_type: 'available',
          grouped_type: 'all',
          price_type: 'all',
          reg_date: dayjs(orderProdPopupInputInfo?.values?.reg_date)?.format('YYYY-MM-DD'),
          zero_except_fg: true,
          minus_except_fg: true,
          prod_uuid: orderProdPopupInputInfo?.values?.prod_uuid,
        };

        return {
          uriPath: STOCK_POPUP?.uriPath,
          params,
          onInterlock: () => {
            const regDate = orderProdPopupInputInfo?.values?.reg_date;
            const prodUuid = orderProdPopupInputInfo?.values?.prod_uuid;

            if (!regDate) {
              message.error('기준일을 선택하신 후 다시 시도해주세요.');
              return false;
            }
            
            if (!prodUuid) {
              message.error('품목을 선택하신 후 다시 시도해주세요.');
              return false;
            }

            return true;
          }
        };
      },
      gridMode: 'multi-select',
    },
  });

  const orderProdPopupInputInfo = useInputGroup('ORDER_PROD_INPUTBOX', [
    {type:'text', id:'order_detail_uuid', label:'수주세부항목UUID', disabled:true, hidden:true},
    {type:'date', id:'reg_date', label:'기준일', default:getToday(), disabled:true},
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {
      type:'text', id:'prod_no', label:'품번', usePopup:true,
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: ORDER_PROD_POPUP?.uriPath,
          params: ORDER_PROD_POPUP?.params,
        },
        datagridSettings: {
          gridId: 'GET_RELEASE_REQUEST_GRID',
          columns: ORDER_PROD_POPUP?.datagridProps?.columns,
        },
        modalSettings: ORDER_PROD_POPUP?.modalProps,
      },
      popupKeys: ['order_detail_uuid', 'prod_uuid', 'prod_no', 'prod_nm', 'prod_std', 'location_uuid', 'location_nm', 'remark', 'unit_uuid', 'unit_nm', 'qty'],
    },
    {type:'text', id:'prod_nm', label:'품명', disabled:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true},
    {type:'text', id:'unit_uuid', label:'단위UUID', disabled:true, hidden:true},
    {type:'text', id:'unit_nm', label:'단위', disabled:true},
    {type:'number', id:'qty', alias:'order_qty', label:'수주수량', disabled:true},
  ], {
    title: '수주 품목 정보',
  });

  useLayoutEffect(() => {
    if (!orderProdPopupInputInfo?.values?.prod_uuid) return;

  }, [orderProdPopupInputInfo?.values?.prod_uuid])


  /** 수주품목 팝업을 닫을때 그리드와 그룹입력상자 데이터를 초기화 합니다. */
  useLayoutEffect(() => {
    if (orderProdPopupVisible === false) { 
      orderProdPopupInputInfo?.instance?.resetForm();
      orderProdPopupGrid?.setGridData([]);

    } else {
      orderProdPopupInputInfo?.setFieldValue('reg_date', newDataPopupInputInfo?.values?.reg_date);
    }
  }, [orderProdPopupVisible]);
  //#endregion



  
  //#region 🔶 출하지시 불러오기
  const outgoOrderPopupGrid = useGrid('OUTGO_ORDER_GRID', cloneObject(grid?.gridInfo?.columns).filter(el => !['reg_date', 'order_detail_uuid', 'order_qty', 'outgo_order_qty'].includes(el?.name)), {
    title: '출하지시 불러오기',
    gridMode: 'create',
    gridPopupInfo: grid?.gridInfo?.gridPopupInfo,
    rowAddPopupInfo: {
      columnNames: [
        {original:'reg_date', popup:'reg_date'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_nm', popup:'store_nm'},
        {original:'from_locaiton_uuid', popup:'locaiton_uuid'},
        {original:'from_locaiton_nm', popup:'locaiton_nm'},
        {original:'lot_no', popup:'lot_no'},
        {original:'qty', popup:'qty'},
      ],
      columns: STOCK_POPUP?.datagridProps?.columns,
      dataApiSettings: () => {
        const params = {
          stock_type: 'available',
          grouped_type: 'all',
          price_type: 'all',
          reg_date: dayjs(outgoOrderPopupInputInfo?.values?.reg_date)?.format('YYYY-MM-DD'),
          zero_except_fg: true,
          minus_except_fg: true,
          prod_uuid: outgoOrderPopupInputInfo?.values?.prod_uuid,
        };

        return {
          uriPath: STOCK_POPUP?.uriPath,
          params,
          onInterlock: () => {
            const regDate = outgoOrderPopupInputInfo?.values?.reg_date;
            const prodUuid = outgoOrderPopupInputInfo?.values?.prod_uuid;

            if (!regDate) {
              message.error('기준일을 선택하신 후 다시 시도해주세요.');
              return false;
            }
            
            if (!prodUuid) {
              message.error('품목을 선택하신 후 다시 시도해주세요.');
              return false;
            }

            return true;
          }
        };
      },
      gridMode: 'multi-select',
    },
  });

  const outgoOrderPopupInputInfo = useInputGroup('OUTGO_ORDER_INPUTBOX', [
    {type:'text', id:'outgo_order_detail_uuid', label:'출하지시세부항목UUID', disabled:true, hidden:true},
    {type:'date', id:'reg_date', label:'기준일', default:getToday(), disabled:true},
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {
      type:'text', id:'prod_no', label:'품번', usePopup:true,
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: OUTGO_ORDER_POPUP?.uriPath,
          params: OUTGO_ORDER_POPUP?.params,
        },
        datagridSettings: {
          gridId: 'GET_RELEASE_REQUEST_GRID',
          columns: OUTGO_ORDER_POPUP?.datagridProps?.columns,
        },
        modalSettings: OUTGO_ORDER_POPUP?.modalProps,
      },
      popupKeys: ['outgo_order_detail_uuid', 'prod_uuid', 'prod_no', 'prod_nm', 'prod_std', 'location_uuid', 'location_nm', 'remark', 'unit_uuid', 'unit_nm', 'qty'],
    },
    {type:'text', id:'prod_nm', label:'품명', disabled:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true},
    {type:'text', id:'unit_uuid', label:'단위UUID', disabled:true, hidden:true},
    {type:'text', id:'unit_nm', label:'단위', disabled:true},
    {type:'number', id:'qty', alias:'outgo_order_qty', label:'지시수량', disabled:true},
  ], {
    title: '출하 지시 정보',
  });

  useLayoutEffect(() => {
    if (!outgoOrderPopupInputInfo?.values?.prod_uuid) return;

  }, [outgoOrderPopupInputInfo?.values?.prod_uuid])


  /** 수주품목 팝업을 닫을때 그리드와 그룹입력상자 데이터를 초기화 합니다. */
  useLayoutEffect(() => {
    if (outgoOrderPopupVisible === false) { 
      outgoOrderPopupInputInfo?.instance?.resetForm();
      outgoOrderPopupGrid?.setGridData([]);

    } else {
      outgoOrderPopupInputInfo?.setFieldValue('reg_date', newDataPopupInputInfo?.values?.reg_date);
    }
  }, [outgoOrderPopupVisible]);
  //#endregion



  const extraGridPopups:TExtraGridPopups = [
    // 🌵수주품목 불러오기 팝업
    {
      ...orderProdPopupGrid?.gridInfo,
      ref: orderProdPopupGrid?.gridRef,
      popupId: 'EXTRA_POPUP_ORDER_PROD',
      gridMode: 'create',
      visible: orderProdPopupVisible,
      saveType: 'basic',
      searchUriPath: '/sal/releases',
      saveUriPath: '/sal/releases',
      okText: '저장하기',
      onCancel: (ev) => {
        const releaseRequestData = orderProdPopupGrid?.gridInstance?.getData();

        if (releaseRequestData?.length > 0) {
          modal.warning({
            title: '추가 취소',
            content: '작성중인 항목이 있습니다. 수주품목 불러오기를 취소하시겠습니까?',
            onOk: () => setOrderProdPopupVisible(false),
          });

        } else {
          setOrderProdPopupVisible(false);
        }
      },
      onOk: () => {
        const releaseRequestData = orderProdPopupGrid?.gridInstance?.getData();

        if (releaseRequestData?.length > 0) {
          // inputbox에 있는 항목 추가로 셀에 넣은 후 append
          releaseRequestData?.map((el) => {
            const uuid = orderProdPopupInputInfo?.values?.order_detail_uuid;
            const qty = orderProdPopupInputInfo?.values?.qty;
            el['order_detail_uuid'] = uuid;
            el['order_qty'] = qty;
            return el;
          });
          newDataPopupGrid?.gridInstance?.appendRows(releaseRequestData);
          setOrderProdPopupVisible(false);
          
        } else {
          message.warn('행을 추가한 후 다시 시도해주세요.');
          return;
        }
      },
      saveOptionParams: changeNameToAlias(orderProdPopupInputInfo?.values, orderProdPopupInputInfo?.inputItems),
      inputProps: orderProdPopupInputInfo?.props,
    },

    // 🌵출하지시 불러오기 팝업
    {
      ...outgoOrderPopupGrid?.gridInfo,
      ref: outgoOrderPopupGrid?.gridRef,
      popupId: 'EXTRA_POPUP_OUTGO_ORDER',
      gridMode: 'create',
      visible: outgoOrderPopupVisible,
      saveType: 'basic',
      searchUriPath: '/sal/releases',
      saveUriPath: '/sal/releases',
      okText: '저장하기',
      onCancel: (ev) => {
        const releaseRequestData = outgoOrderPopupGrid?.gridInstance?.getData();

        if (releaseRequestData?.length > 0) {
          modal.warning({
            title: '추가 취소',
            content: '작성중인 항목이 있습니다. 출하지시 불러오기를 취소하시겠습니까?',
            onOk: () => setOutgoOrderPopupVisible(false),
          });

        } else {
          setOutgoOrderPopupVisible(false);
        }
      },
      onOk: () => {
        const releaseRequestData = outgoOrderPopupGrid?.gridInstance?.getData();

        if (releaseRequestData?.length > 0) {
          // inputbox에 있는 항목 추가로 셀에 넣은 후 append
          releaseRequestData?.map((el) => {
            const uuid = outgoOrderPopupInputInfo?.values?.outgo_order_detail_uuid;
            const qty = outgoOrderPopupInputInfo?.values?.qty;
            el['outgo_order_detail_uuid'] = uuid;
            el['outgo_order_qty'] = qty;
            return el;
          });
          newDataPopupGrid?.gridInstance?.appendRows(releaseRequestData);
          setOutgoOrderPopupVisible(false);
          
        } else {
          message.warn('행을 추가한 후 다시 시도해주세요.');
          return;
        }
      },
      saveOptionParams: changeNameToAlias(outgoOrderPopupInputInfo?.values, outgoOrderPopupInputInfo?.inputItems),
      inputProps: outgoOrderPopupInputInfo?.props,
    },
  ];
  
  /** 템플릿에 전달할 값 */
  const props:ITpSingleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props, 
      onSearch
    }, 
    inputProps: null,  
    
    popupGridRef: [newDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfo: [newDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    extraGridPopups,

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}