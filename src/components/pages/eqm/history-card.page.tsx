import Grid from '@toast-ui/react-grid';
import React from 'react';
import { useState, useRef, useLayoutEffect } from "react";
import { TGridMode, useGrid, useSearchbox, getPopupForm } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps, { TExtraGridPopups } from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_EQM } from '~/enums';
import { FormikProps, FormikValues } from 'formik';
import { message } from 'antd';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox';



/** 설비등록대장 */
export const PgEqmHistoryCard = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = '/std/equips';
  const saveUriPath = '/std/equips';

  const grdRefHistory = useRef<Grid>();
  const inputRefHistory = useRef<FormikProps<FormikValues>>();
  const inputRefCreateHistory = useRef<FormikProps<FormikValues>>();
  const inputRefUdateHistory = useRef<FormikProps<FormikValues>>();

  const [historyGridPopupVisible, setHistoryGridPopupVisible] = useState<boolean>(false);
  const [historyGridPopupCreateVisible, setHistoryGridPopupCreateVisible] = useState<boolean>(false);
  const [historyGridPopupUpdateVisible, setHistoryGridPopupUpdateVisible] = useState<boolean>(false);


  const [historyInfo, setHistoryInfo] = useState<{equip_uuid?:string}>({});
  const [historyData, setHistoryData] = useState([]);

  const onSetHistoryInfo = async (historyInfo) => {
   setHistoryInfo(historyInfo);
  }

  /** 그리드 상태를 관리 */
  const grid = useGrid('HISTORY_CARD_GRID', [
    {
      header:'개정', name:'equip_history_btn', format:'button', width:ENUM_WIDTH.S,
      options: {
        value: '개정',
        onClick: (ev, props) => {
          onSetHistoryInfo(props?.grid?.store?.data?.rawData[props?.rowKey]).then(() => {
            setHistoryGridPopupVisible(true);
            inputRefHistory?.current?.setValues(props?.grid?.store?.data?.rawData[props?.rowKey]);
          })
        }
      }
    },
    {header: '설비UUID', name:'equip_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '설비유형UUID', name:'equip_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '설비유형명', name:'equip_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header: '설비코드', name:'equip_cd', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
    {header: '설비명', name:'equip_nm', width:ENUM_WIDTH.L, filter:'text', requiredField:true},
    {header: '작업장UUID', name:'workings_uuid', width:ENUM_WIDTH.L, format:'popup', hidden:true},
    {header: '작업장명', name:'workings_nm', width:ENUM_WIDTH.L, format:'popup', editable: true},
    {header: '관리자(정)UUID', name:'manager_emp_uuid', width:ENUM_WIDTH.L, format:'popup', hidden:true},
    {header: '관리자(정) 사원명', name:'manager_emp_nm', width:ENUM_WIDTH.L, format:'popup', editable: true},
    {header: '관리자(부)UUID', name:'sub_manager_emp_uuid', width:ENUM_WIDTH.L, format:'popup', hidden:true},
    {header: '관리자(부) 사원명', name:'sub_manager_emp_nm', width:ENUM_WIDTH.L, format:'popup', editable: true},
    {header: '설비관리번호', name:'equip_no', width:ENUM_WIDTH.M, filter:'text', editable:true},
    {header: '설비등급', name:'equip_grade', width:ENUM_WIDTH.M, filter:'text', editable:true},
    {header: '설비모델명', name:'equip_model', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '설비규격', name:'equip_std', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '설비제원', name:'equip_spec', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '전압', name:'voltage', width:ENUM_WIDTH.M, filter:'text', editable:true},
    {header: '제조사', name:'manufacturer', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '구매업체', name:'purchase_partner', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '구매일자', name:'purchase_date', width:ENUM_WIDTH.L, filter:'text', format:'date', editable:true},
    {header: '구매업체연락처', name:'purchase_tel', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '구매금액', name:'purchase_price', width:ENUM_WIDTH.L, decimal:ENUM_DECIMAL.DEC_PRICE, format:'number', filter:'number', editable:true},    
    {header: '사용유무', name:'use_fg', width:ENUM_WIDTH.S, format: 'check', editable:true, requiredField:true, defaultValue: true, hidden:true},
    {header: '생산설비', name:'prd_fg', width:ENUM_WIDTH.S, format: 'check', editable:true, requiredField:true, defaultValue: true, hidden:true},
    {header: '비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: [
      { // 작업장
        columnNames: [
          {original:'workings_uuid', popup:'workings_uuid'},
          {original:'workings_nm', popup:'workings_nm'},
        ],
        columns: getPopupForm('작업장관리').datagridProps?.columns,
        dataApiSettings: {
          uriPath: getPopupForm('작업장관리').uriPath,
          params: {}
        },
        gridMode: 'select',
      },
      { // 관리자(정) 사원
        columnNames: [
          {original:'manager_emp_uuid', popup:'emp_uuid'},
          {original:'manager_emp_nm', popup:'emp_nm'},
        ],
        columns: getPopupForm('사원관리').datagridProps?.columns,
        dataApiSettings: {
          uriPath: getPopupForm('사원관리').uriPath,
          params: {
            emp_status: 'incumbent'
          }
        },
        gridMode: 'select',
      },
      { // 관리자(부) 사원
        columnNames: [
          {original:'sub_manager_emp_uuid', popup:'emp_uuid'},
          {original:'sub_manager_emp_nm', popup:'emp_nm'},
        ],
        columns: getPopupForm('사원관리').datagridProps?.columns,
        dataApiSettings: {
          uriPath: getPopupForm('사원관리').uriPath,
          params: {
            emp_status: 'incumbent'
          }
        },
        gridMode: 'select',
      },
    ],
  });

  const getHistoryData = () => {
    getData({equip_uuid:historyInfo?.equip_uuid}, URL_PATH_EQM.HISTORY.GET.HISTORIES).then((res) => {
      setHistoryData(res);
    });
  };

  useLayoutEffect(() => {
    if((historyGridPopupVisible && !historyGridPopupCreateVisible) || historyGridPopupUpdateVisible){
      getHistoryData();
    }
  }, [historyGridPopupVisible, historyGridPopupCreateVisible, historyGridPopupUpdateVisible]);

  const HISOTRY_INPUT_ITEMS:IInputGroupboxItem[] = [
    {type:'text', id:'equip_uuid', label:'설비UUID', disabled: true, hidden: true},
    {type:'text', id:'equip_type_nm', label:'설비유형명', disabled: true},
    {type:'text', id:'equip_cd', label:'설비코드', disabled: true},
    {type:'text', id:'equip_nm', label:'설비명', disabled: true},
  ];

  const extraGridPopups: TExtraGridPopups = [
    {
      title: '개정 이력',
      popupId: 'HISTORY_CARD_HISTORY_GRID_POPUP',
      gridId: 'HISTORY_CARD_HISTORY_GRID_POPUP_GRID',
      columns: [
        {header:'설비 개정이력UUID', name:'history_uuid', alias:'uuid', hidden: true},
        {header:'개정일자', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', format:'date', requiredField:true},
        {header:'개정내용', name:'contents', width:ENUM_WIDTH.L, filter:'text'},
      ],
      ref: grdRefHistory,
      inputProps: {
        id: 'HISTORY_CARD_HISTORY_GRID_INPUT',
        inputItems:HISOTRY_INPUT_ITEMS,
        innerRef:inputRefHistory,
      }, 
      gridMode: 'delete',
      data: historyData,
      saveUriPath: URL_PATH_EQM.HISTORY.PUT.HISTORIES,
      saveParams: {},
      saveType: 'basic',
      extraButtons: [
        {
          buttonProps:{text:'신규추가'},
          align:'left',
          buttonAction:()=>setHistoryGridPopupCreateVisible(true),
        },
        {
          buttonProps:{text:'수정'},
          align:'right',
          buttonAction:()=>setHistoryGridPopupUpdateVisible(true),
        },
        {
          buttonProps:{text:'삭제'},
          align:'right',
          buttonAction:()=>{
            dataGridEvents?.onSave(
              'basic',
              {
                gridRef:grdRefHistory,
                columns:[
                  {header:'설비 개정이력UUID', name:'history_uuid', alias:'uuid', hidden: true},
                  {header:'개정일자', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', format:'date', requiredField:true},
                  {header:'개정내용', name:'contents', width:ENUM_WIDTH.L, filter:'text'},
                ],
                saveUriPath:URL_PATH_EQM.HISTORY.DELETE.HISTORIES,
              },
              {},
              modal,
              getHistoryData,
            )
          },
        }
      ],
      visible: historyGridPopupVisible,
      okButtonProps: {hidden:true},
      cancelText: '닫기',
      onCancel: () => setHistoryGridPopupVisible(false),
    },
    {
      title: '개정 이력 추가',
      popupId: 'HISTORY_CARD_HISTORY_GRID_POPUP_CREATE',
      gridId: 'HISTORY_CARD_HISTORY_GRID_POPUP_CREATE_GRID',
      columns: [
        {header:'개정일자', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', format:'date', editable: true, requiredField:true},
        {header:'개정내용', name:'contents', width:ENUM_WIDTH.L, filter:'text', editable: true},
      ],
      inputProps: {
        id: 'HISTORY_CARD_HISTORY_GRID_CREATE_INPUT',
        inputItems:HISOTRY_INPUT_ITEMS,
        innerRef: inputRefCreateHistory,
      }, 
      gridMode: 'create',
      saveUriPath: URL_PATH_EQM.HISTORY.POST.HISTORIES,
      saveParams: {equip_uuid: historyInfo?.equip_uuid},
      saveType: 'basic',
      visible: historyGridPopupCreateVisible,
      onAfterOk:(isSuccess, savedData) => { 
        if (!isSuccess) return;
        setHistoryGridPopupCreateVisible(false);
      },
      onCancel: () => setHistoryGridPopupCreateVisible(false),
    },
    {
      title: '개정 이력 수정',
      popupId: 'HISTORY_CARD_HISTORY_GRID_POPUP_UPDATE',
      gridId: 'HISTORY_CARD_HISTORY_GRID_POPUP_UPDATE_GRID',
      columns: [
        {header:'설비 개정이력UUID', name:'history_uuid', alias:'uuid', hidden: true},
        {header:'개정일자', name:'reg_date', width:ENUM_WIDTH.L, filter:'text', editable: true, format:'date', requiredField:true},
        {header:'개정내용', name:'contents', width:ENUM_WIDTH.L, filter:'text', editable: true},
      ],
      inputProps: {
        id: 'HISTORY_CARD_HISTORY_GRID_UPDATE_INPUT',
        inputItems:HISOTRY_INPUT_ITEMS,
        innerRef: inputRefUdateHistory,
      }, 
      gridMode: 'update',
      data: historyData,
      saveUriPath: URL_PATH_EQM.HISTORY.PUT.HISTORIES,
      saveParams: {equip_uuid: historyInfo?.equip_uuid},
      saveType: 'basic',
      visible: historyGridPopupUpdateVisible,
      onAfterOk:(isSuccess, savedData) => { 
        if (!isSuccess) return;
        setHistoryGridPopupUpdateVisible(false);
      },
      onCancel: () => setHistoryGridPopupUpdateVisible(false),
    },
  ];

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
    }
  );
  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
    }
  );
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  // 개정 신규추가, 수정 시 상단 InputItem에 현재 값 세팅
  useLayoutEffect(() => {
    if ( historyGridPopupCreateVisible === true ) {
      inputRefCreateHistory?.current?.setValues(inputRefHistory?.current?.values);
    } else if ( historyGridPopupUpdateVisible === true) {
      inputRefUdateHistory?.current?.setValues(inputRefHistory?.current?.values);
    }
  }, [historyGridPopupCreateVisible, historyGridPopupUpdateVisible])

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = (values) => {
    // const searchKeys = Object.keys(values);
    const searchParams = {};//cleanupKeyOfObject(values, searchKeys);

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
    // delete: () => {
    //   if (getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows?.length === 0) {
    //     message.warn('편집된 데이터가 없습니다.');
    //     return;
    //   }
    //   onSave();
    // },
    
    /** 신규 추가 */
    // create: () => {
    //   newDataPopupInputInfo?.instance?.resetForm();
    //   newDataPopupGrid?.setGridData([]);
    //   setNewDataPopupGridVisible(true);
    // },

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