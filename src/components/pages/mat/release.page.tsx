import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { getPopupForm, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, cloneObject, dataGridEvents, getData, getModifiedRows, getPageName, getToday } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { TExtraGridPopups } from '~/components/templates/grid-double/grid-double.template.type';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';



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
export const PgMatRelease = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/mat/releases';
  const saveUriPath = '/mat/releases';
  const STORE_POPUP = getPopupForm('창고관리');
  const LOCATION_POPUP = getPopupForm('위치관리');
  const STOCK_POPUP = getPopupForm('재고관리');
  
  const [releaseRequestPopupVisible, setReleaseRequestPopupVisible] = useState<boolean>(false);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUT_BOX', [
    {type:'date', id:'reg_date', label:'출고일', default:getToday(), required:true},
  ]);
  const editDataPopupInputInfo = useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', newDataPopupInputInfo?.props?.inputItems);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '출고UUID', name:'release_uuid', alias:'uuid', hidden:true},
    {header: '출고일', name:'reg_date', width:ENUM_WIDTH.M, filter:'text', editable:true, format:'date', requiredField:true},
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
    {header: '단위', width:ENUM_WIDTH.S, name:'unit_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: 'LOT NO', width:ENUM_WIDTH.M, name:'lot_no', filter:'text', editable:true, requiredField:true},
    {header: '수량', width:ENUM_WIDTH.S, name:'qty', format:'number', editable:true, requiredField:true},
    {header: '출고창고UUID', name:'from_store_uuid', hidden:true, format:'popup', editable:true},
    {header: '출고창고', width:ENUM_WIDTH.M, name:'from_store_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '출고위치UUID', name:'from_location_uuid', hidden:true, format:'popup', editable:true},
    {header: '출고위치', width:ENUM_WIDTH.M, name:'from_location_nm', filter:'text', format:'popup', editable:true},
    {header: '입고창고UUID', name:'to_store_uuid', hidden:true, format:'popup', editable:true},
    {header: '입고창고', width:ENUM_WIDTH.M, name:'to_store_nm', filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '입고위치UUID', name:'to_location_uuid', hidden:true, format:'popup', editable:true},
    {header: '입고위치', width:ENUM_WIDTH.M, name:'to_location_nm', filter:'text', format:'popup', editable:true},
    {header: '비고', width:ENUM_WIDTH.XL, name:'remark', editable:true},
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
    
  });

  const newDataPopupGridColumns = cloneObject(grid.gridInfo.columns)?.filter(
    (el) => {
      if (!['qty', 'to_store_nm', 'to_location_nm', 'remark'].includes(el?.name))
        el['editable'] = false;

      return el?.name !== 'reg_date';
    }
  );
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
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
          {header: '창고명', name:'store_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '위치UUID', name:'location_uuid', filter:'text', format:'text', hidden:true},
          {header: '위치명', name:'location_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '품목UUID', name:'prod_uuid', filter:'text', format:'text', hidden:true},
          {header: '품목 유형UUID', name:'item_type_uuid', filter:'text', format:'text', hidden:true},
          {header: '품목 유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '제품 유형UUID', name:'prod_type_uuid', filter:'text', format:'text', hidden:true},
          {header: '제품 유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '품번', name:'prod_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
          {header: '품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '모델UUID', name:'model_uuid', filter:'text', format:'text', hidden:true},
          {header: '모델명', name:'model_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
          {header: 'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text', format:'text'},
          {header: '규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text', format:'text'},
          {header: '단위수량', name:'unit_qty', width:ENUM_WIDTH.M, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
          {header: '단위UUID', name:'unit_uuid', filter:'text', format:'text', hidden:true},
          {header: '단위명', name:'unit_nm', width:ENUM_WIDTH.M, filter:'text', format:'text'},
          {header: 'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text', format:'text'},
          {header: '재고', name:'qty', width:ENUM_WIDTH.S, filter:'text', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
        ],
        dataApiSettings: () => {
          // 출고일 기준으로 재고조회
          const params = {
            reg_date: newDataPopupInputInfo?.ref?.current?.values?.reg_date,
            exclude_zero_fg: true,
            exclude_minus_fg: true,
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
      extraButtons: [
        {
          buttonProps: {text: '출고요청 불러오기'},
          buttonAction: (ev, props, options) => {
            //출고요청을 불러오는 팝업 열기
            setReleaseRequestPopupVisible(true);
          }
        },
      ],
    }
  );
  const editDataPopupGridColumns = cloneObject(grid.gridInfo.columns)?.filter(
    (el) => {
      if (!['qty', 'remark'].includes(el?.name))
        el['editable'] = false;

      return el?.name !== 'reg_date';
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    cloneDeep(editDataPopupGridColumns).map((el) => {
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


  //#region 🔶 출고요청 관리
  const releaseRequestPopupGrid = useGrid('RELEASE_REQUEST_GRID', cloneObject(grid?.gridInfo?.columns).filter(el => el?.name !== 'reg_date'), {
    title: '출고 요청',
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
          reg_date: dayjs(releaseRequestPopupInputInfo?.ref?.current?.values?.reg_date)?.format('YYYY-MM-DD'),
          // zero_except_fg: true,
          // minus_except_fg: true,
          prod_uuid: releaseRequestPopupInputInfo?.ref?.current?.values?.prod_uuid,
        };

        return {
          uriPath: STOCK_POPUP?.uriPath,
          params
        };
      },
      gridMode: 'multi-select',
    },
  });

  const releaseRequestPopupInputInfo = useInputGroup('ReleaseRequest_INPUTBOX', [
    {type:'date', id:'reg_date', label:'기준일', default:getToday(), disabled:true},
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {
      type:'text', id:'prod_no', label:'품번', usePopup:true,
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: '/prd/demands',
          params: {
            complete_state: 'incomplete',
            start_date: '1900-01-01',
            end_date: '2400-12-31',
          },
        },
        datagridSettings: {
          gridId: 'GET_RELEASE_REQUEST_GRID',
          columns: [
            {name:'demand_uuid', header:'자재출고요청UUID', filter:'text', hidden:true},
            {name:'order_uuid', header:'작업지시UUID', filter:'text', hidden:true},
            {name:'reg_date', header:'요청일', width:ENUM_WIDTH.M, format:'date', filter:'text'},
            {name:'demand_type_cd', header:'자재출고요청 유형코드', filter:'text', hidden:true},
            {name:'demand_type_nm', header:'요청유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'proc_uuid', header:'공정UUID', filter:'text', hidden:true},
            {name:'proc_nm', header:'공정', width:ENUM_WIDTH.M, filter:'text'},
            {name:'equip_uuid', header:'설비UUID', filter:'text', hidden:true},
            {name:'equip_nm', header:'설비', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_uuid', header:'품목UUID', filter:'text', hidden:true},
            {name:'prod_nm', header:'품목', width:ENUM_WIDTH.M, filter:'text'},
            {name:'item_type_uuid', header:'품목 유형UUID', filter:'text', hidden:true},
            {name:'item_type_nm', header:'품목 유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_type_uuid', header:'제품 유형UUID', filter:'text', hidden:true},
            {name:'prod_type_nm', header:'제품 유형', width:ENUM_WIDTH.M, filter:'text'},
            {name:'model_uuid', header:'모델UUID', filter:'text', hidden:true},
            {name:'model_nm', header:'모델', width:ENUM_WIDTH.M, filter:'text'},
            {name:'rev', header:'Rev', width:ENUM_WIDTH.M, filter:'text'},
            {name:'prod_std', header:'규격', width:ENUM_WIDTH.M, filter:'text'},
            {name:'unit_uuid', header:'단위UUID', filter:'text', hidden:true},
            {name:'unit_nm', header:'단위', width:ENUM_WIDTH.S, filter:'text'},
            {name:'qty', header:'수량', width:ENUM_WIDTH.M, format:'number', filter:'number'},
            {name:'balance', header:'미납 수량', width:ENUM_WIDTH.M, format:'number', filter:'number'},
            {name:'complete_fg', header:'투입완료 여부', width:ENUM_WIDTH.S, format:'check', filter:'text', hidden:true},
            {name:'complete_state', header:'투입 완료여부(완료 / 미완료)', width:ENUM_WIDTH.S, filter:'text', hidden:true},
            {name:'dept_uuid', header:'자재출고요청 부서UUID', filter:'text', hidden:true},
            {name:'dept_nm', header:'부서', width:ENUM_WIDTH.M, filter:'text'},
            {name:'due_date', header:'납기일', width:ENUM_WIDTH.M, format:'date', filter:'text'},
            {name:'to_store_uuid', header:'입고 창고UUID', filter:'text', hidden:true},
            {name:'to_store_nm', header:'입고 창고', width:ENUM_WIDTH.M, filter:'text'},
            {name:'to_location_uuid', header:'입고 위치UUID', filter:'text', hidden:true},
            {name:'to_location_nm', header:'입고 위치', width:ENUM_WIDTH.M, filter:'text'},
            {name:'remark', header:'비고', width:ENUM_WIDTH.XL, filter:'text', hidden:true},
          ],
        },
        modalSettings: STOCK_POPUP.modalProps,
      },
      popupKeys: ['prod_uuid', 'prod_no', 'prod_nm', 'prod_std', 'reject_uuid', 'reject_nm', 'store_uuid', 'store_nm', 'location_uuid', 'location_nm', 'lot_no', 'stock_qty', 'remark', 'qty'],
    },
    {type:'text', id:'prod_nm', label:'품명', disabled:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true},
    {type:'number', id:'stock_qty', label:'재고', disabled:true, decimal:ENUM_DECIMAL.DEC_STCOK},
    {type:'text', id:'remark', label:'비고'},
  ], {
    title: '출고요청 지정 품목정보',
  });

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {
      newDataPopupInputInfo.ref.current.setFieldValue('reg_date',getToday())
    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  /** 출고요청 팝업을 닫을때 그리드와 그룹입력상자 데이터를 초기화 합니다. */
  useLayoutEffect(() => {
    if (releaseRequestPopupVisible === false) { 
      releaseRequestPopupInputInfo?.instance?.resetForm();
      releaseRequestPopupGrid?.setGridData([]);

    } else {
      releaseRequestPopupInputInfo?.setFieldValue('reg_date', newDataPopupInputInfo?.ref?.current?.values?.reg_date);
    }
  }, [releaseRequestPopupVisible]);
  //#endregion

  const extraGridColumns = cloneObject(newDataPopupGridColumns);
  const extraGridPopups:TExtraGridPopups = [
    {
      ...releaseRequestPopupGrid?.gridInfo,
      columns: extraGridColumns,
      ref: releaseRequestPopupGrid?.gridRef,
      popupId: 'EXTRA_POPUP_ReleaseRequest',
      gridMode: 'create',
      visible: releaseRequestPopupVisible,
      saveType: 'basic',
      searchUriPath: '/mat/releases',
      saveUriPath: '/mat/releases',
      okText: '추가하기',
      onCancel: (ev) => {
        const releaseRequestData = releaseRequestPopupGrid?.gridInstance?.getData();

        if (releaseRequestData?.length > 0) {
          modal.confirm({
            title: '추가 취소',
            content: '작성중인 항목이 있습니다. 출고요청 불러오기를 취소하시겠습니까?',
            onOk: () => setReleaseRequestPopupVisible(false),
            okText: '예',
            cancelText: '아니오',
            cancelButtonProps: {
              hidden: false,
              visible: true
            }
          });

        } else {
          setReleaseRequestPopupVisible(false);
        }
      },
      onOk: () => {
        const releaseRequestData = releaseRequestPopupGrid?.gridRef.current.gridInst?.getData();
        if (releaseRequestData?.length > 0) {
          newDataPopupGrid?.gridInstance?.appendRows(releaseRequestData);
          setReleaseRequestPopupVisible(false);
          
        } else {
          message.warn('행을 추가한 후 다시 시도해주세요.');
          return;
        }
      },
      saveOptionParams: changeNameToAlias(releaseRequestPopupInputInfo?.values, releaseRequestPopupInputInfo?.inputItems),
      inputProps: releaseRequestPopupInputInfo?.props,
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
    popupGridInfo: [
      {
        ...newDataPopupGrid.gridInfo,
        saveParams: newDataPopupInputInfo?.ref?.current?.values
      }, editDataPopupGrid.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props, editDataPopupInputInfo?.props],

    extraGridPopups,

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}