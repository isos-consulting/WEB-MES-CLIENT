import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useState } from "react";
import { getPopupForm, IGridColumn, IGridPopupProps, ISearchItem, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps, { IExtraButton, TExtraButtons, TExtraGridPopups } from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { onDefaultGridSave } from '../prd/work';
import Grid from '@toast-ui/react-grid';


/** 재고실사관리 */
export const PgInvStore = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'view';
  const searchUriPath = '/inv/stores/stocks';
  const saveUriPath = '/inv/stores';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const PRODUCT_POPUP = getPopupForm('품목관리2');
  const REJECT_POPUP = getPopupForm('부적합관리');
  
  const [stockType, setStockType] = useState('all');
  const [storeUuid, setStoreUuid] = useState('all');
  const [storeOptions, setStoreOptions] = useState([]);
  const [rejectHidden, setRejectHidden] = useState(true);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '품목UUID', name:'prod_uuid', filter:'text', hidden:true},
    {header: '품목유형UUID', name:'item_type_uuid', filter:'text', hidden:true},
    {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '제품유형UUID', name:'prod_type_uuid', filter:'text', hidden:true},
    {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', requiredField:true},
    {header: '모델UUID', name:'model_uuid', filter:'text', hidden:true},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
    {header: '단위UUID', name:'unit_uuid', filter:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '창고', name:'store_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
    {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '위치', name:'location_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
    {header: '부적합UUID', name:'reject_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '부적합', name:'reject_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', hidden:rejectHidden, editable:true},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', editable:true, requiredField:true},
    {header: '재고', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number', editable:true, requiredField:true, decimal:ENUM_DECIMAL.DEC_STCOK},
    // {header: '실사수량', name:'inv_qty', width:ENUM_WIDTH.M, alias:'qty', format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_STCOK, editable:true},
    // {header: '조정수량', name:'adjusted_qty', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header: '비고', name:'remark', width:ENUM_WIDTH.L, filter:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    disabledAutoDateColumn:true,
    gridPopupInfo: [
      { // 창고
        columnNames: [
          {original:'store_uuid', popup:'store_uuid'},
          {original:'store_nm', popup:'store_nm'},
        ],
        columns: STORE_POPUP.datagridProps?.columns,
        dataApiSettings: {
          uriPath: STORE_POPUP.uriPath,
          params: {
            store_type: 'all',
          }
        },
        gridMode: 'select',
      },
      { // 위치
        columnNames: [
          {original:'location_uuid', popup:'location_uuid'},
          {original:'location_nm', popup:'location_nm'},
        ],
        columns: LOCATION_POPUP.datagridProps?.columns,
        dataApiSettings: {
          uriPath: LOCATION_POPUP.uriPath,
          params: {}
        },
        gridMode: 'select',
      },
      { // 부적합
        columnNames: [
          {original:'reject_uuid', popup:'reject_uuid'},
          {original:'reject_nm', popup:'reject_nm'},
        ],
        columns: REJECT_POPUP.datagridProps?.columns,
        dataApiSettings: {
          uriPath: REJECT_POPUP.uriPath,
          params: {}
        },
        gridMode: 'select',
      },
    ],
    rowAddPopupInfo: {
      columnNames: [
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
        {original:'unit_qty', popup:'unit_qty'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_nm', popup:'unit_nm'},
      ],
      columns: PRODUCT_POPUP.datagridProps?.columns,
      dataApiSettings: {
        uriPath: PRODUCT_POPUP.uriPath,
        params: {}
      },
      gridMode: 'multi-select',
    }
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', grid?.gridInfo?.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
      disabledAutoDateColumn:true,
    }
  );
  const editDataPopupGrid = null;//useGrid('EDIT_POPUP_GRID', []);
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);


  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', [
    {type:'date', id:'reg_date', label:'기준일', default:getToday()},
    {
      type:'combo', id:'stock_type', label:'창고유형', default:'all', firstItemType:'all',
      dataSettingOptions: {
        uriPath: '/adm/store-types',
        params: {},
        codeName: 'store_type_cd',
        textName: 'store_type_nm',
      },
      onAfterChange: (ev) => {
        const stockType = ev;
        // if (stockType === '-') {
        //   setStockType('all');
        //   setStoreOptions([]);
        //   return;
        // }

        getData(
          {store_type: stockType},
          '/std/stores'
    
        ).then(res => {
          if (!res) {
            setStockType(stockType);
            setStoreOptions([]);
            return;
          }

          const result = res?.map((row) => {
            return {
              code: row?.store_uuid,
              text: row?.store_nm,
            }
          });
    
          setStockType(stockType);
          setStoreOptions(result);
        });
      },
    },
    {
      type:'combo', id:'store_uuid', label:'기준창고', default:'all', firstItemType:'all',
      dataSettingOptions: ({item, props}) => {
        return {
          uriPath: '/std/stores',
          params: {
            store_type: stockType,
          },
          codeName: 'store_uuid',
          textName: 'store_nm',
        }
      }
    },
    {type:'text', id:'tran_type', label:'수불유형', default:'inventory', hidden:true},
  ]);
  

  /** 액션 관리 */
  useLayoutEffect(() => {
    if (!storeOptions || !stockType) {
      // 기준창고 콤보박스 값 초기화
      searchInfo?.setValues(crr => (
        {
          ...crr, 
          stock_type: stockType, 
          store_uuid: 'all',
        }
      ));
      setStoreUuid(null);
      return;
    };

    setRejectHidden(stockType !== 'reject');

    // 기준창고 콤보박스 데이터 불러오기
    searchInfo?.setSearchItems((crr) => {
      return crr?.map((el) => {
        if (el?.id === 'store_uuid') {
          setStoreUuid(null);
          return {
            ...el, 
            options: storeOptions, 
            default: 'all',
          };
        } else return el;
      });
    });
  }, [stockType, storeOptions]);

  useLayoutEffect(() => {
    // 기준창고 콤보박스 선택 값 지정
    if (!storeUuid)
      setStoreUuid('all')
    else
      searchInfo.instance?.setFieldValue('store_uuid', storeUuid);
  }, [storeUuid]);

  useLayoutEffect(() => {
    const columns:any[] = [
      {header: '품목UUID', name:'prod_uuid', filter:'text', hidden:true},
      {header: '품목유형UUID', name:'item_type_uuid', filter:'text', hidden:true},
      {header: '품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
      {header: '제품유형UUID', name:'prod_type_uuid', filter:'text', hidden:true},
      {header: '제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
      {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
      {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', requiredField:true},
      {header: '모델UUID', name:'model_uuid', filter:'text', hidden:true},
      {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, filter:'text'},
      {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
      {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
      {header: '단위UUID', name:'unit_uuid', filter:'text', hidden:true},
      {header: '단위', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text'},
      {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
      {header: '창고', name:'store_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
      {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
      {header: '위치', name:'location_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true, requiredField:true},
      {header: '부적합UUID', name:'reject_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
      {header: '부적합', name:'reject_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', hidden:rejectHidden, editable:true},
      {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', editable:true, requiredField:true},
      {header: (newDataPopupGridVisible || editDataPopupGridVisible) ? '실샤수량' : '재고', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number', editable:true, requiredField:true, decimal:ENUM_DECIMAL.DEC_STCOK},
      // {header: '실사수량', name:'inv_qty', width:ENUM_WIDTH.M, format:'number', filter:'number', decimal:ENUM_DECIMAL.DEC_STCOK, editable:true, hidden:grid?.gridInfo?.gridMode === defaultGridMode},
    ];

    grid?.setGridColumns(columns);
    newDataPopupGrid?.setGridColumns(columns);
    editDataPopupGrid?.setGridColumns(columns);
  }, [rejectHidden, newDataPopupGridVisible, editDataPopupGridVisible]);


  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    {type:'date', id:'reg_date', label:'수불일', default:getToday()},
  ]);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);


  /** 검색 */
  const onSearch = (values) => {
    const searchParams = cleanupKeyOfObject(values, searchInfo.searchItemKeys);

    let data = [];

    getData({
      ...searchParams,
      grouped_type: 'all',
      price_type: 'all',
      exclude_zero_fg: true,
      stock_type: (searchParams as any)?.stock_type,
      store_uuid: (searchParams as any)?.store_uuid === 'all' ? null : (searchParams as any)?.store_uuid,
    }, searchUriPath).then((res) => {
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
    update: null,
    // update: () => {
    //   setEditDataPopupGridVisible(true);
    // },

    /** 삭제 */
    delete: null,
    // delete: () => {
    //   if (getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows?.length === 0) {
    //     message.warn('편집된 데이터가 없습니다.');
    //     return;
    //   }
    //   onSave();
    // },
    
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

  
  //#region 🔶재고이력삭제 팝업 관련
  const [invStoreData, setInvStoreData] = useState<any[]>([]);
  const [invStorePopupVisible, setInvStorePopupVisible] = useState<boolean>(false);
  const invStoreGridRef = useRef<Grid>();
  const invStroeUriPath = '/inv/stores';
  const invStoreSearchItems:ISearchItem[] = [
    {type:'daterange', id:'reg_date', ids:['start_date', 'end_date'], defaults:[getToday(-7), getToday()], label:'기간'},
  ];
  const invStoreColumns:IGridColumn[] = [
    {header: '재고수불UUID', name:'inv_store_uuid', alias:'uuid', filter:'text', hidden:true},
    {header: '수불일', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
    {header: '품목UUID', name:'prod_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '품목 유형UUID', name:'item_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '품목 유형', name:'item_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '제품 유형UUID', name:'prod_type_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '제품 유형', name:'prod_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '모델UUID', name:'model_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '모델', name:'model_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: 'Rev', name:'rev', width:ENUM_WIDTH.M, filter:'text'},
    {header: '단위UUID', name:'unit_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '단위', name:'unit_nm', width:ENUM_WIDTH.S, filter:'text'},
    {header: '부적합UUID', name:'reject_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '부적합', name:'reject_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text'},
    {header: '수량', name:'qty', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header: '입출고 유형', name:'inout_state', width:ENUM_WIDTH.M, filter:'text'},
    {header: '창고UUID', name:'store_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '창고', name:'store_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '위치UUID', name:'location_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '위치', name:'location_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'},
  ];
  const getInvStoreData = (searchParams) => {
    getData({
      ...searchParams,
      tran_type: 'inventory',
    }, invStroeUriPath).then((res) => {
      setInvStoreData(res);
    });
  };
  const onInvStroeOkAfterEvent = ({success}) => {
    if (success) { //저장성공
      setInvStorePopupVisible(false);
      onSearch(searchInfo?.values);
    } else { //저장실패
    }
  }
  const INV_STORE_EXTRA_POPUP:IGridPopupProps = {
    title:'재고 이력 삭제',
    gridId: 'EXTRA_GRID_INV_STORE',
    popupId: 'EXTRA_GRID_POPUP_INV_STORE',
    columns: invStoreColumns,
    data:invStoreData,
    ref:invStoreGridRef,
    gridMode: 'delete',
    saveType: 'basic',
    saveUriPath: invStroeUriPath,
    searchProps: {
      id: 'EXTRA_INV_STORE_SEARCHBOX',
      boxShadow:false,
      searchItems: invStoreSearchItems,
      onSearch: getInvStoreData,
    },
    searchUriPath: invStroeUriPath,
    visible:invStorePopupVisible,
    cancelButtonProps: {hidden:true},
    onCancel: () => setInvStorePopupVisible(false),
    okText: '저장',
    onOk: () => {
      onDefaultGridSave('basic', invStoreGridRef, invStoreColumns, invStroeUriPath, {}, modal, onInvStroeOkAfterEvent);
    }
  };
  const INV_STORE_EXTRA_BUTTON:IExtraButton = {
    text: '재고 이력 삭제',
    ImageType: 'add',
    onClick: () => {
      setInvStorePopupVisible(true);
    },
  };
  const extraGridPopups:TExtraGridPopups = [INV_STORE_EXTRA_POPUP];
  const extraButtons:TExtraButtons = [INV_STORE_EXTRA_BUTTON];
  //#endregion

  
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
    
    popupGridRef: [newDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfo: [
      {
        ...newDataPopupGrid?.gridInfo,
        saveParams: newDataPopupInputInfo?.values,
      },
      editDataPopupGrid?.gridInfo
    ],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    extraButtons,
    extraGridPopups,

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}