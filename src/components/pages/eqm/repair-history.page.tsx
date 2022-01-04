import React from 'react';
import { useState } from "react";
import { getPopupForm, IGridModifiedRows, TGridMode, useGrid, useSearchbox } from "~/components/UI";
import { dataGridEvents, getData, getModifiedRows, getNow, getPageName } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_EQM, URL_PATH_STD } from '~/enums';
import { message } from 'antd';
import _ from 'lodash';
import { onDefaultGridSave } from '../prd/work';
import dayjs from 'dayjs';



/** 설비수리이력관리 */
export const PgEqmRepairHistory = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode:TGridMode = 'delete';
  const searchUriPath = URL_PATH_EQM.REPAIR_HISTORY.GET.REPAIR_HISTORIES;
  const saveUriPath = URL_PATH_EQM.REPAIR_HISTORY.POST.REPAIR_HISTORIES;

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 그리드 상태를 관리 */
  const grid = useGrid('GRID', [
    {header: '설비수리이력UUID', name:'repair_history_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header: '설비UUID', name:'equip_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '설비', name:'equip_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true, requiredField:true},
    {header: '발생시작일', name:'occur_start_date', width:ENUM_WIDTH.M, format:'date', editable:true, requiredField:true},
    {header: '발생시작시간', name:'occur_start_time', width:ENUM_WIDTH.M, format:'time', editable:true, requiredField:true},
    {header: '발생종료일', name:'occur_end_date', width:ENUM_WIDTH.M, format:'date', editable:true},
    {header: '발생종료시간', name:'occur_end_time', width:ENUM_WIDTH.M, format:'time', editable:true},
    {header: '발생확인자UUID', name:'occur_emp_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '발생확인자', name:'occur_emp_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true},
    {header: '발생원인', name:'occur_reason', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '발생내용', name:'occur_contents', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '수리시작일', name:'repair_start_date', width:ENUM_WIDTH.M, format:'date', editable:true},
    {header: '수리시작시간', name:'repair_start_time', width:ENUM_WIDTH.M, format:'time', editable:true},
    {header: '수리종료일', name:'repair_end_date', width:ENUM_WIDTH.M, format:'date', editable:true},
    {header: '수리종료시간', name:'repair_end_time', width:ENUM_WIDTH.M, format:'time', editable:true},
    {header: '수리시간', name:'repair_time', width:ENUM_WIDTH.S, format:'number', decimal:ENUM_DECIMAL.DEC_NOMAL},
    {header: '수리장소', name:'repair_place', width:ENUM_WIDTH.L, filter:'text', editable:true},
    {header: '수리금액', name:'repair_price', width:ENUM_WIDTH.L, filter:'number', decimal:ENUM_DECIMAL.DEC_NOMAL, editable:true},
    {header: '점검일', name:'check_date', width:ENUM_WIDTH.M, format:'date', editable:true},
    {header: '점검시간', name:'check_time', width:ENUM_WIDTH.M, format:'time', editable:true},
    {header: '점검자UUID', name:'check_emp_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header: '점검자', name:'check_emp_nm', width:ENUM_WIDTH.L, filter:'text', format:'popup', editable:true},
  ], {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    rowAddPopupInfo: {
      columnNames: [
        {original:'equip_uuid', popup:'equip_uuid'},
        {original:'equip_nm', popup:'equip_nm'},
      ],
      columns: getPopupForm('설비관리').datagridProps.columns,
      dataApiSettings: {
        uriPath: URL_PATH_STD.EQUIP.GET.EQUIPS,
        params: {}
      },
      gridMode:'multi-select'
    },
    gridPopupInfo: [
      {
        columnNames: [
          {original:'work_routing_uuid', popup:'work_routing_uuid'},
          {original:'proc_nm', popup:'proc_nm'},
          {original:'proc_no', popup:'proc_no'},
          {original:'equip_nm', popup:'equip_nm'},
        ],
        columns: [
          {header:'공정순서UUID', name:'work_routing_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
          {header:'생산실적UUID', name:'work_uuid', width:200, hidden:true, format:'text'},
          {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
          {header:'공정순서', name:'proc_no', width:100, format:'text'},
          {header:'공정', name:'proc_nm', width:120, format:'text'},
          {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
          {header:'작업장', name:'workings_nm', width:120, format:'text'},
          {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
          {header:'설비', name:'equip_nm', width:120, format:'text'},
        ],
        dataApiSettings: {
          uriPath: '/prd/work-routings',
          params: {}
        },
        gridMode:'select'
      }
    ],
  });
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      onOk:(gridRef)=>{
        const instance = gridRef.current.getInstance();

        instance.blur();
        const data = () => {
          const getModifiedRows = instance.getModifiedRows()
          
          function  MixDateTime (el, dateString, timeString) {
            console.log(el, dateString, timeString)
            if (el[dateString] != null && el[timeString] != null) {
              let time = el[timeString];
      
              if (String(time)?.length !== 5) {
                time = dayjs(time).format('HH:mm');
              }
      
              const dateTime = dayjs(el[dateString]).format('YYYY-MM-DD') + ' ' + time;
              el[dateString] = dayjs(dateTime).locale('ko').format('YYYY-MM-DD HH:mm:ss');
            }
          };
          getModifiedRows.createdRows.forEach((el) =>{
            MixDateTime(el, 'occur_start_date', 'occur_start_time');
            MixDateTime(el, 'occur_end_date', 'occur_end_time');
            MixDateTime(el, 'repair_start_date', 'repair_start_time');
            MixDateTime(el, 'repair_end_date', 'repair_end_time');
            MixDateTime(el, 'check_date', 'check_time');
          });
          
          return getModifiedRows;
        };
        
        dataGridEvents.onSave(
          'basic',
          {
            gridRef,
            columns:grid.gridInfo.columns,
            saveUriPath:saveUriPath,
            methodType:'post',
            modifiedData:data()
          },
          null,
          modal,
          ({success})=>{
            if(success){
              setEditDataPopupGridVisible(false)
              onSearch()
            };
          }
        );
      },
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo
    }
  );


  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      onOk:(gridRef)=>{
        const instance = gridRef.current.getInstance();

        instance.blur();
        const data = () => {
          const getModifiedRows = instance.getModifiedRows()
          
          function  MixDateTime (el, dateString, timeString) {
            console.log(el, dateString, timeString)
            if (el[dateString] != null && el[timeString] != null) {
              let time = el[timeString];
      
              if (String(time)?.length !== 5) {
                time = dayjs(time).format('HH:mm');
              }
      
              const dateTime = dayjs(el[dateString]).format('YYYY-MM-DD') + ' ' + time;
              el[dateString] = dayjs(dateTime).locale('ko').format('YYYY-MM-DD HH:mm:ss');
            }
          };
          getModifiedRows.createdRows.forEach((el) =>{
            MixDateTime(el, 'occur_start_date', 'occur_start_time');
            MixDateTime(el, 'occur_end_date', 'occur_end_time');
            MixDateTime(el, 'repair_start_date', 'repair_start_time');
            MixDateTime(el, 'repair_end_date', 'repair_end_time');
            MixDateTime(el, 'check_date', 'check_time');
          });
          
          return getModifiedRows;
        };
        
        dataGridEvents.onSave(
          'basic',
          {
            gridRef,
            columns:grid.gridInfo.columns,
            saveUriPath:saveUriPath,
            methodType:'post',
            modifiedData:data()
          },
          null,
          modal,
          ({success})=>{
            if(success){
              setNewDataPopupGridVisible(false)
              onSearch()
            };
          }
        );
      },
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo
    }
  );

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null; //useInputGroup('INPUTBOX', []);
  const newDataPopupInputInfo = null; //useInputGroup('NEW_DATA_POPUP_INPUT_BOX', []);
  const editDataPopupInputInfo = null; //useInputGroup('EDOT_DATA_POPUP_INPUT_BOX', []);

  /** 액션 관리 */

  /** 검색 */
  const onSearch = () => {
    // const searchKeys = Object.keys(values);
    const searchParams = {};//cleanupKeyOfObject(values, searchKeys);

    let data = [];
    getData(searchParams, searchUriPath).then((res) => {
      data = res;

    }).finally(() => {
      const datas = data.map((el)=>{
        let data = _.cloneDeep(el);
        data.occur_start_time = data.occur_start_date
        data.occur_end_time = data.occur_end_date
        data.repair_start_time = data.repair_start_date
        data.repair_end_time = data.repair_end_date
        data.check_time = data.check_date
        return data;
      })

      inputInfo?.instance?.resetForm();
      grid.setGridData(datas);
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

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props}/>;
}