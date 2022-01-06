import React, { useLayoutEffect } from 'react';
import { useState } from "react";
import { Button, getPopupForm, useGrid, useSearchbox } from "~/components/UI";
import { cleanupKeyOfObject, dataGridEvents, executeData, getData, getModifiedRows, getPageName, isModified, onAsyncFunction } from "~/functions";
import Modal from 'antd/lib/modal/Modal';
import { TpTripleGrid } from '~/components/templates/grid-triple/grid-triple.template';
import ITpTripleGridProps from '~/components/templates/grid-triple/grid-triple.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_WIDTH } from '~/enums';
import { cloneDeep } from 'lodash';


/** 검사기준서관리 */
export const PgQmsInsp = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/prods';
  const headerSaveUriPath = '/std/prods';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/qms/insps';
  const detailSaveUriPath = '/qms/insps';
  const detailSubSearchUriPath = '/qms/insp/{uuid}/details';
  const detailSubSaveUriPath = '/qms/insps';
  const INSP_POPUP = getPopupForm('검사기준관리');


  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] = useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] = useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] = useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);
  const [editInspNo, setEditInspNo] = useState(null);

  const [applyFg, setApplyFg] = useState(false);

  /** 검사기준서 적용(또는 해제) */
  const onApplyInsp = (ev, props) => {
    // 적용 이벤트
    const {value, rowKey, columnInfo, grid} = props;
    const row = grid?.store?.data?.rawData[rowKey];

    const applyUriPath = '/qms/insps/apply';
    const cancelApplyUriPath = '/qms/insps/cancel-apply';
    const uuid = row?.insp_uuid; //검사기준서uuid

    if (!uuid) {
      message.error('검사기준서 ' + (value ? '해제' : '적용') + ' 실패');
      return;
    }

    executeData(
      {uuid},
      value ? cancelApplyUriPath : applyUriPath,
      'put',
      'success',
    ).then(async (success) => {
      if (success) {
        message.success('검사기준서가 ' + (value ? '해제' : '적용') + '되었습니다.');

        await onReset();
        setApplyFg(true);

      } else {
        // message.error('검사기준서 ' + (value ? '해제' : '적용') + ' 실패');
      }
    });
  }

  const onAfterSaveApply = async () => {
    const headerRow = await cloneDeep(selectedHeaderRow);
    const detailRow = await cloneDeep(selectedDetailRow);

    onSearchHeader(headerSearchInfo?.values).then(res => {
      onAsyncFunction(onClickHeader, {
        targetType: 'cell',
        rowKey: headerRow?.rowKey || 0,
        instance: {
          store: {
            data: {
              rawData: res
            }
          }
        },
      });
    }).finally(() => {
      setSelectedHeaderRow(headerRow);
      setSelectedDetailRow(detailRow);
    });
  }

  useLayoutEffect(() => {
    if (!applyFg) return;

    onAfterSaveApply();
    setApplyFg(false);
  }, [applyFg]);


  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid('HEADER_GRID', [
    {header:'품목UUID', name:'prod_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'품목유형', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'제품유형', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: headerSearchUriPath,
    searchParams: { 
      'use_fg': true,
    },
    saveUriPath: null,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', [
    {header:'기준서유형코드', name:'insp_type_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'기준서유형', name:'insp_type_nm', width:ENUM_WIDTH.M, filter:'text', align:'center'},
    {
      header:'적용', name:'apply_fg', width:ENUM_WIDTH.S, format:'button',
      options: {
        formatter: (props) => {
          const {rowKey, grid} = props;
          const row = grid?.store?.data?.rawData[rowKey];
          return row['apply_fg'] === true ? '해제' : '적용';
        },
        onClick: onApplyInsp,
      }
    },
    // {header:'구분', name:'apply_type', width:ENUM_WIDTH.S, filter:'text'},
    // {header:'적용', name:'apply_fg', width:ENUM_WIDTH.S, format:'check', filter:'text'},
    {header:'기준서UUID', name:'insp_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'제품UUID', name:'prod_uuid', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'기준서번호', name:'insp_no', width:ENUM_WIDTH.M, filter:'text'},
    {header:'개정내용', name:'contents', width:ENUM_WIDTH.XL, filter:'text'},
    {header:'비고', name:'remark', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
  });

  const detailSubGrid = useGrid('DETAIL_SUB_GRID', [
    {header:'세부기준서UUID', name:'insp_detail_uuid', alias:'uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'세부기준서번호', name:'insp_no_sub', width:ENUM_WIDTH.M, hidden:true},
    {header:'검사기준UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'검사유형', name:'insp_item_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사항목UUID', name:'insp_item_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'검사항목', name:'insp_item_nm', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
    {header:'상세검사내용', name:'insp_item_desc', width:ENUM_WIDTH.XL, filter:'text'},
    {header:'위치번호', name:'position_no', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header:'기준', name:'spec_std', width:ENUM_WIDTH.M, filter:'text', requiredField:true},
    {header:'MIN', name:'spec_min', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header:'MAX', name:'spec_max', width:ENUM_WIDTH.M, format:'number', filter:'number'},
    {header:'검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'검사방법', name:'insp_method_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'검사구', name:'insp_tool_nm', width:ENUM_WIDTH.M, format:'popup', filter:'text', editable:true},
    {header:'시료수', name:'worker_sample_cnt', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'검사주기', name:'worker_insp_cycle', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'시료수', name:'inspector_sample_cnt', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사주기', name:'inspector_insp_cycle', width:ENUM_WIDTH.M, filter:'text'},
    {header:'비고', name:'remark', width:ENUM_WIDTH.L, filter:'text'},
  ], {
    searchUriPath: detailSubSearchUriPath,
    saveUriPath: detailSubSaveUriPath,
    gridMode: detailDefaultGridMode,
    header: {
      complexColumns: [ 
        {
          header: '작업자',
          name: '_group_worker',
          childNames: ['worker_sample_cnt', 'worker_insp_cycle'],
        },
        {
          header: '검사원',
          name: '_group_inspector',
          childNames: ['inspector_sample_cnt', 'inspector_insp_cycle'],
        },
      ]
    },
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', 
    cloneDeep(detailSubGrid.gridInfo.columns)?.map((el) => {
      if (['insp_item_type_nm', 'insp_item_nm'].includes(el?.name) == false) {
        el['editable'] = true;
      }
      return el;
    })
    , {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    saveParams: {apply_fg:true},
    header: detailSubGrid?.gridInfo?.header,
    rowAddPopupInfo: {
      columnNames:[
        {original:'insp_item_type_uuid', popup:'insp_item_type_uuid'},
        {original:'insp_item_type_nm', popup:'insp_item_type_nm'},
        {original:'insp_item_uuid', popup:'insp_item_uuid'},
        {original:'insp_item_nm', popup:'insp_item_nm'},
      ],
      columns: INSP_POPUP?.datagridProps?.columns,
      dataApiSettings: {
        uriPath: INSP_POPUP?.uriPath,
        params: {type:'qms'}
      },
      gridMode:'multi-select'
    },
    gridPopupInfo: [
      { //검사방법관리
        columnNames: [
          {original:'insp_method_uuid', popup:'insp_method_uuid'},
          {original:'insp_method_nm', popup:'insp_method_nm'},
        ],
        popupKey: '검사방법관리',        
        gridMode: 'select',
      },
      { //검사구관리
        columnNames: [
          {original:'insp_tool_uuid', popup:'insp_tool_uuid'},
          {original:'insp_tool_nm', popup:'insp_tool_nm'},
        ],
        popupKey: '검사구관리',
        gridMode: 'select',
      },
    ],
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', newDataPopupGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    header: detailSubGrid?.gridInfo?.header,
    rowAddPopupInfo: newDataPopupGrid?.gridInfo?.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', newDataPopupGrid.gridInfo.columns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    header: detailSubGrid?.gridInfo?.header,
    rowAddPopupInfo: newDataPopupGrid?.gridInfo?.rowAddPopupInfo,
    gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
  });

  /** 헤더 클릭 이벤트 */
  const onClickHeader = (ev) => {

    const {targetType, rowKey, instance} = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };
  
  /** 디테일 클릭 이벤트 */
  const onClickDetail = (ev) => {
    const {targetType, rowKey, instance, columnName} = ev;
    if (columnName === 'apply_fg') return;

    const detailRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedDetailRow(detailRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = async (uuid) => {
    if (!uuid) return;

    const uriPath = detailSearchUriPath;
    getData({prod_uuid: uuid}, uriPath, 'raws').then( async (res) => {
      detailGrid.setGridData(res || []);

      if (res?.length > 0) {
        if (selectedDetailRow?.insp_uuid === res[0]?.insp_uuid) {
          await onAsyncFunction(setSelectedDetailRow, null);
        }
        setSelectedDetailRow(res[0]);

      } else {
        detailSubInputInfo?.setValues({});
        detailSubGrid?.setGridData([]);
      }
      // reloadDetailSubGrid(res[0]?.insp_uuid);
    });
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailSubGrid = async (uuid) => {
    if (!uuid) {
      detailSubGrid.setGridData([]);
      return;
    };

    const uriPath = detailSubSearchUriPath?.replace('{uuid}', uuid);

    getData({
      insp_detail_type: detailSubSearchInfo?.values?.insp_detail_type_cd,
    }, uriPath, 'raws').then((res) => {
      detailSubGrid.setGridData(res || []);
    });
  };
  //#endregion


  //#region 🔶조회조건 관리
  /** 조회조건 View */
  // const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', []);
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', []);
  const detailSearchInfo = null;
  const detailSubSearchInfo = null;

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async (values) => {
    const searchParams:any = cleanupKeyOfObject(values, headerSearchInfo?.searchItemKeys);

    let data = [];
    await getData(
      {
        ...searchParams,
        qms_receive_insp_fg: searchParams?.insp_type_cd === 'RECEIVE_INSP' || null,
        qms_proc_insp_fg: searchParams?.insp_type_cd === 'PROC_INSP' || null,
        qms_final_insp_fg: searchParams?.insp_type_cd === 'FINAL_INSP' || null,
        use_fg: true,
      },
      headerSearchUriPath

    ).then((res) => {
      data = res;

    }).finally(async () => {
      await onReset();
      headerGrid.setGridData(data);
    });

    return data;
  };

  const onSearchDetail = async (uuid) => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
    // reloadDetailSubGrid(uuid);
  }

  const onSearchDetailSub = (uuid) => {
    if (uuid == null) return;
    reloadDetailSubGrid(uuid);
  }
  //#endregion


  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {type:'text', id:'prod_no', label:'품번', disabled:true, hidden:true},
    {type:'text', id:'prod_nm', label:'품명', disabled:true, hidden:true},
    {type:'text', id:'prod_std', label:'규격', disabled:true, hidden:true},
  ]);

  const PROD_POPUP = getPopupForm('품목관리');
  const prodApiSettings = (ev) => {
    const values = ev?.values;
    const params = {};

    if(values?.['insp_type_cd'] === 'RECEIVE_INSP') {
      params['qms_receive_insp_fg'] = true;

    } else if(values?.['insp_type_cd'] === 'PROC_INSP') {
      params['qms_proc_insp_fg'] = true;

    } else if(values?.['insp_type_cd'] === 'FINAL_INSP') {
      params['qms_final_insp_fg'] = true;
    }

    return {
      uriPath: PROD_POPUP.uriPath,
      params: params,
    }
  };
  const prodPopupButtonSettings = {
    dataApiSettings: prodApiSettings,
    datagridSettings: PROD_POPUP.datagridProps,
    modalSettings: {
      title: '품목관리',
    }
  }

  const detailSubInputInfo = useInputGroup('DETAIL_SUB_INPUTBOX', [
    {type:'text', id:'insp_uuid', alias:'uuid', label:'검사기준서UUID', disabled:true, hidden:true},
    {type:'text', id:'prod_uuid', label:'품목UUID', disabled:true, hidden:true},
    {
      type:'text', id:'prod_no', label:'품번', disabled:true, usePopup:true,
      popupKeys: ['prod_uuid', 'prod_no', 'prod_nm'],
      popupButtonSettings: prodPopupButtonSettings,
    },
    {
      type:'text', id:'prod_nm', label:'품명', disabled:true, usePopup:true,
      // popupKey: '품목관리',
      popupKeys: ['prod_uuid', 'prod_no', 'prod_nm'],
      popupButtonSettings: prodPopupButtonSettings,
    },
    {
      type:'combo', id:'insp_type_cd', label:'기준서 유형', disabled:true, firstItemType:'none',
      dataSettingOptions: {
        uriPath: '/adm/insp-types',
        params: {},
        codeName: 'insp_type_cd',
        textName: 'insp_type_nm',
      },
    },
    {type:'text', id:'insp_no', label:'기준서 번호', disabled:true},
    {type:'date', id:'reg_date', label:'생성일자', disabled:true},
    {type:'text', id:'contents', label:'개정내역', disabled:true},
    {type:'text', id:'remark', label:'비고', disabled:true},
  ]);


  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneDeep(detailSubInputInfo?.props?.inputItems)?.map(
      (el) => {
        el['disabled'] = false;
        return el;
      }
    ),
  );
  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    cloneDeep(detailSubInputInfo?.props?.inputItems)?.map(
      (el) => {
        if (['insp_no', 'contents', 'remark'].includes(el?.id))
          el['disabled'] = false;
        return el;
      }
    ),
  );
  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneDeep(detailSubInputInfo?.props?.inputItems)?.map(
      (el) => {
        if (['insp_no', 'contents', 'remark'].includes(el?.id))
          el['disabled'] = false;
        return el;
      }
    ),
  );

  const onReset = async () => {
    headerGrid?.setGridData([]);
    detailGrid?.setGridData([]);
    detailSubGrid?.setGridData([]);
    detailInputInfo?.setValues({});
    detailSubInputInfo?.setValues({});
  }
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.prod_uuid);
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (selectedDetailRow == null) return;
    detailSubInputInfo.setValues(selectedDetailRow);
    onSearchDetailSub(selectedDetailRow?.insp_uuid);
  }, [selectedDetailRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {

    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      // ❗ 세부 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      addDataPopupInputInfo?.setValues(detailSubInputInfo?.values);
    } else {
      addDataPopupInputInfo?.setValues({});
    }

  }, [addDataPopupGridVisible, detailSubInputInfo?.values]);
  
  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo?.setValues(detailSubInputInfo?.values);
      editDataPopupGrid?.setGridData(detailSubGrid?.gridInfo?.data);
    } else {
      editDataPopupInputInfo?.setValues({});
      editDataPopupGrid?.setGridData([]);
    }

  }, [editDataPopupGridVisible, detailSubInputInfo.values, detailSubGrid.gridInfo.data]);

  useLayoutEffect(() => {
    const grid = (
      newDataPopupGridVisible === true ?
        newDataPopupGrid
      : addDataPopupGridVisible === true ?
        addDataPopupGrid
      : editDataPopupGridVisible === true ?
        editDataPopupGrid
      : detailSubGrid
    );
    const inputInfo = (
      newDataPopupGridVisible === true ?
        newDataPopupInputInfo
      : addDataPopupGridVisible === true ?
        addDataPopupInputInfo
      : editDataPopupGridVisible === true ?
        editDataPopupInputInfo
      : detailSubInputInfo
    );
    const value = inputInfo?.values?.insp_type_cd;
    if (!value) return;

    const columns = cloneDeep(grid?.gridInfo?.columns)?.map(
      (el) => {
        if (['worker_sample_cnt', 'worker_insp_cycle'].includes(el?.name)) {
          el['hidden'] = value !== 'PROC_INSP';
        }
        return el;
      }
    );
    grid?.setGridColumns(columns);
  }, [detailSubInputInfo?.values?.insp_type_cd, newDataPopupInputInfo?.values?.insp_type_cd, addDataPopupInputInfo?.values?.insp_type_cd, editDataPopupInputInfo?.values?.insp_type_cd]);
  //#endregion

  const onSave = () => {
    const {gridRef, setGridMode} = detailSubGrid;
    const {columns, saveUriPath} = detailSubGrid?.gridInfo;

    if (!detailInputInfo.isModified && !isModified(detailSubGrid?.gridRef, detailSubGrid?.gridInfo?.columns)) {
      message.warn('편집된 데이터가 없습니다.');
      return;
    }
    
    dataGridEvents.onSave('headerInclude', {
      gridRef,
      setGridMode,
      columns,
      saveUriPath,
    }, detailSubInputInfo.values, modal,
      async (res) => {
        // 헤더 그리드 재조회
        const headerRow = cloneDeep(selectedHeaderRow);
        const detailRow = cloneDeep(selectedDetailRow);
        
        await onReset();
        onSearchHeader(headerSearchInfo?.values).then(async (searchResult) => {
          await onAfterSaveAction(searchResult, headerRow?.prod_uuid, detailRow?.insp_uuid);
        });
      },
      true,
    );
  }

  const onCheckUuid = ():boolean => {
    if (detailSubInputInfo?.values?.insp_uuid == null) {
      message.warn('검사기준서를 선택하신 후 다시 시도해 주세요.');
      return false;
    };
    return true;
  }
  
  //#region 🔶작동될 버튼들의 기능 정의 (By Template) 
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo?.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditInspNo(detailSubInputInfo?.values?.insp_no);
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (getModifiedRows(detailSubGrid?.gridRef, detailSubGrid?.gridInfo?.columns)?.deletedRows?.length === 0) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },
    
    /** 신규 추가 */
    create: () => {
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


  /** 신규 저장 이후 수행될 함수 ✅ */
  const onAfterSaveNewData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await onReset();
    const headerRow = newDataPopupInputInfo?.values;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { 
      onAfterSaveAction(searchResult, headerRow?.prod_uuid, null);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 ✅ */
  const onAfterSaveAddData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await onReset();
    const headerRow = cloneDeep(selectedHeaderRow);
    const detailRow = cloneDeep(selectedDetailRow);

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, headerRow?.prod_uuid, detailRow?.insp_uuid); });
    setAddDataPopupGridVisible(false);
  }

  /** 세부항목 수정 이후 수행될 함수 ✅ */
  const onAfterSaveEditData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;
    
    await onReset();
    const headerRow = cloneDeep(selectedHeaderRow);
    const detailRow = cloneDeep(selectedDetailRow);

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then((searchResult) => { onAfterSaveAction(searchResult, headerRow?.prod_uuid, detailRow?.insp_uuid); });
    setEditDataPopupGridVisible(false);
  }

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = async (searchResult, header_uuid, detail_uuid) => {
    let selectedHeaderRow = searchResult?.find(el => el?.prod_uuid === header_uuid);
      
    if (!selectedHeaderRow) { selectedHeaderRow = searchResult[0]; }
    onAsyncFunction(setSelectedHeaderRow, cloneDeep(selectedHeaderRow)).then(() => {
      let selectedDetailRow = searchResult?.find(el => el?.insp_uuid === detail_uuid);
      setSelectedDetailRow(selectedDetailRow);
    });
  }

  //#region 🔶 팝업 Footer 관련
  type TPopup = 'new' | 'add' | 'edit' | null;

  /** 기준서 개정 또는 수정 */
  const onAmendInsp = (type:'개정'|'수정', popupType:TPopup) => {
    const grid = (
      popupType === 'add' ?
        addDataPopupGrid
      : popupType === 'edit' ?
        editDataPopupGrid
      : null
    );

    const inputInfo = (
      popupType === 'add' ?
        addDataPopupInputInfo
      : popupType === 'edit' ?
        editDataPopupInputInfo
      : null
    );

    const setVisible = (
      popupType === 'add' ?
        setAddDataPopupGridVisible
      : popupType === 'edit' ?
        setEditDataPopupGridVisible
      : null
    );

    if (!grid) {
      message.error('기준서 ' + type + '중 문제가 발생했습니다. 관리자에게 문의해주세요.');
    }

    const methodType = (
      popupType === 'add' ?
        'post'
      : type === '개정' ?
        'post'
      : 'put'
    );

    const optionSaveParams = cloneDeep(inputInfo?.values);

    console.log('optionSaveParams', optionSaveParams)

    if (methodType === 'post') {
      // post로 저장할 경우 uuid키를 제거
      delete optionSaveParams['uuid'];
    }

    dataGridEvents.onSave('headerInclude', {
      gridRef: grid?.gridRef,
      setGridMode: null,
      columns: grid?.gridInfo?.columns,
      saveUriPath: grid?.gridInfo?.saveUriPath,
      methodType: methodType,
    }, optionSaveParams, modal,
      async ({success, datas}) => {
        if (success) {
          setVisible(false);

          // 데이터 재조회
          const headerRow = cloneDeep(selectedHeaderRow);
          const detailRow = cloneDeep(selectedDetailRow);

          await onReset();
          onSearchHeader(headerSearchInfo?.values).then(async (searchResult) => {
            await onAfterSaveAction(searchResult, headerRow?.prod_uuid, detailRow?.insp_uuid);
          });
        }
      },
      true,
    );
  }

  /** 팝업 Footer */
  const popupFooter = () => {
    const popupType:TPopup = (
      addDataPopupGridVisible ?
        'add'
      : editDataPopupGridVisible ?
        'edit'
      : null
    );
    const setVisible = (
      popupType === 'add' ?
        setAddDataPopupGridVisible
      : popupType === 'edit' ?
        setEditDataPopupGridVisible
      : null
    );

    if (!setVisible) return null;

    const onCancel = () => {
      setVisible(false);
    }
    const onAmend = () => {
      onAmendInsp('개정', popupType);
    }
    const onEdit = () => {
      onAmendInsp('수정', popupType);
    }

    return (
      <div>
        <Button widthSize='small' heightSize='small' fontSize='small' onClick={onCancel}>취소</Button>
        <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' colorType='delete' onClick={onAmend}>개정하기</Button>
        <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' colorType='basic' onClick={onEdit}>수정하기</Button>
      </div>
    );
  }
  //#endregion

  //#region 🔶템플릿에 값 전달
  const props:ITpTripleGridProps = {
    title,
    dataSaveType: 'headerInclude',
    templateOrientation: 'filledLayoutRight',
    gridRefs: [headerGrid?.gridRef, detailGrid?.gridRef, detailSubGrid?.gridRef],
    gridInfos: [
      {
        ...headerGrid?.gridInfo,
        onAfterClick: onClickHeader,
      }, 
      {
        ...detailGrid?.gridInfo,
        onAfterClick: onClickDetail,
      },
      detailSubGrid?.gridInfo,
    ],
    popupGridRefs: [newDataPopupGrid?.gridRef, addDataPopupGrid?.gridRef, editDataPopupGrid?.gridRef],
    popupGridInfos: [
      newDataPopupGrid?.gridInfo,
      {
        ...addDataPopupGrid?.gridInfo,
        saveParams: {
          p_prod_uuid: addDataPopupInputInfo?.values?.prod_uuid
        },
        footer: popupFooter(),
      },
      {
        ...editDataPopupGrid?.gridInfo,
        footer: popupFooter(),
      }
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props, 
        onSearch: onSearchHeader
      }, 
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.prod_uuid)
      },
      {
        ...detailSubSearchInfo?.props,
        onSearch: () => onSearchDetailSub(selectedDetailRow?.insp_uuid)
      }
    ],
    inputProps: [null, detailInputInfo?.props, detailSubInputInfo?.props],  
    popupVisibles: [newDataPopupGridVisible, addDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisibles: [setNewDataPopupGridVisible, setAddDataPopupGridVisible, setEditDataPopupGridVisible],
    popupSearchProps: [newDataPopupSearchInfo?.props, addDataPopupSearchInfo?.props, editDataPopupSearchInfo?.props],
    popupInputProps: [newDataPopupInputInfo?.props, addDataPopupInputInfo?.props, editDataPopupInputInfo?.props],
    
    buttonActions,
    modalContext,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,

    btnProps: {
      create: {
        text:'신규 기준서 등록',
      },
      edit: {
        text: '수정/개정',
        widthSize: 'auto'
      },
    }
  };
  //#endregion

  return <TpTripleGrid {...props}/>;
}