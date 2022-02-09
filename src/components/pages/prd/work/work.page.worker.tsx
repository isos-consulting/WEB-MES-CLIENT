import Grid from '@toast-ui/react-grid';
import { message, Space, Modal } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IGridPopupProps, IDatagridProps } from '~/components/UI';
import { IGridModifiedRows } from '~/components/UI/datagrid-new';
import { checkGridData, getData, getModifiedRows, getPageName, getPermissions, isModified, saveGridData } from '~/functions';
import { onErrorMessage, TAB_CODE } from './work.page.util';

const DATA_PICKUP_INFO = {
  create: [
    'factory_uuid',
    'work_uuid',
    'work_routing_uuid',
    'worker_uuid',
    'start_date',
    'end_date',
    'work_time',
  ],
  update: [
    'work_worker_uuid', //uuid
    'worker_uuid',
    'start_date',
    'end_date',
    'work_time',
  ],
  delete: [
    'work_worker_uuid', //uuid
  ]
}

//#region 🔶✅투입인원관리
/** 투입인원관리 */
export const WORKER = () => {
  //#region 🔶공용 설정
  /** 페이지 제목 */
  const title = getPageName();
  /** 권한 관련 */
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});
  //#endregion


  //#region 🔶투입인원 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  /** 투입인원 그리드 속성 */
  const gridInfo:IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.workWorker+'_GRID'+'_POPUP_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 400,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/work-workers',
    /** 조회 END POINT */
    searchUriPath: '/prd/work-workers',
    /** 컬럼 */
    columns: [
      {header:'작업자투입UUID', name:'work_worker_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
      {header:'작업자UUID', name:'worker_uuid', width:200, hidden:true, format:'text'},
      {header:'작업자', name:'worker_nm', width:100, hidden:false, format:'text'},
      {header:'시작일시', name:'start_date', width:120, hidden:false, format:'date', editable:true},
      {header:'시작시간', name:'start_time', width:100, hidden:false, format:'time', editable:true},
      {header:'종료일시', name:'end_date', width:120, hidden:false, format:'date', editable:true},
      {header:'종료시간', name:'end_time', width:100, hidden:false, format:'time', editable:true},
      // {header:'작업시간', name:'work_time', width:100, hidden:false, format:'time', editable:true},
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: {
      columnNames: [
        {original:'worker_uuid', popup:'worker_uuid'},
        {original:'worker_nm', popup:'worker_nm'},
      ],
      columns: [
        {header:'작업자UUID', name:'worker_uuid', width:200, hidden:true, format:'text'},
        {header:'작업자명', name:'worker_nm', width:120, hidden:false, format:'text'},
        {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
        {header:'공정', name:'proc_nm', width:120, hidden:false, format:'text'},
        {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
        {header:'작업장', name:'workings_nm', width:120, hidden:false, format:'text'},
        {header:'사원UUID', name:'emp_uuid', width:200, hidden:true, format:'text'},
        {header:'사원명', name:'emp_nm', width:120, hidden:false, format:'text'},
      ],
      dataApiSettings: {
        uriPath: '/std/workers',
        params: {}
      },
      gridMode: 'multi-select',
    },
  };
  //#endregion


  //#region 🔶신규 팝업 관련
  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.workWorker+'_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workWorker+'_GRID'+'_NEW_POPUP',
    /** 팝업 제목 */
    title: '투입인원 항목 추가',
    /** 포지티브 버튼 글자 */
    okText: '추가하기',
    onOk: () => onSave(newPopupGridRef, 'create'),
    /** 네거티브 버튼 글자 */
    cancelText: '취소',
    onCancel: () => {
      setNewPopupVisible(false);
    },
    /** 부모 참조 */
    parentGridRef: gridRef,
    /** 저장 유형 */
    saveType: 'basic',
    /** 저장 END POINT */
    saveUriPath: gridInfo.saveUriPath,
    /** 조회 END POINT */
    searchUriPath: gridInfo.searchUriPath,
    /** 추가 저장 값 */
    saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: newPopupVisible,
  };
  //#endregion
  
  
  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.workWorker+'_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: null,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workWorker+'_GRID'+'_EDIT_POPUP',
    /** 팝업 제목 */
    title: '투입인원 항목 수정',
    /** 포지티브 버튼 글자 */
    okText: '수정하기',
    onOk: () => onSave(editPopupGridRef, 'update'),
    /** 네거티브 버튼 글자 */
    cancelText: '취소',
    onCancel: () => {
      setEditPopupVisible(false);
    },
    /** 부모 참조 */
    parentGridRef: gridRef,
    /** 저장 유형 */
    saveType: 'basic',
    /** 저장 END POINT */
    saveUriPath: gridInfo.saveUriPath,
    /** 조회 END POINT */
    searchUriPath: gridInfo.searchUriPath,
    /** 추가 저장 값 */
    saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: editPopupVisible,
  };
  //#endregion


  //#region ✅함수
  const onSearch = () => {
    const work_uuid = searchParams?.['work_uuid'];
    const work_routing_uuid = searchParams?.['work_routing_uuid'];
    getData(
      {
        work_uuid, 
        work_routing_uuid,
      }, 
      gridInfo.searchUriPath, 
      undefined, undefined, undefined, undefined,
      {disabledZeroMessage: true}).then((res) => {
      setData(res);
    });
  }

  /** 조작 가능 여부 판단 */
  const onCheckAccessAllow = ():boolean => {
    if (searchParams?.['work_uuid'] == null || searchParams?.['work_routing_uuid'] == null) {
      onErrorMessage('하위이력작업시도');
      return false;
    }

    if (searchParams?.['complete_fg'] == 'true') {
      onErrorMessage('완료된작업시도');
      return false;
    }

    return true;
  }

  /** 삭제 버튼 이벤트 */
  const onDelete = () => {
    onCheckedSave();
  }

  /** 수정 버튼 이벤트 */
  const onUpdate = () => {
    setEditPopupVisible(true);
  }

  /** 신규 추가 버튼 이벤트 */
  const onAppend = () => {
    setNewPopupVisible(true);
  }

  type TPopupType = 'create' | 'update' | 'delete';
  /** 팝업 여는 이벤트 */
  const onOpenPopup = (popupType:TPopupType) => {
    if (!popupType) return;
    if (onCheckAccessAllow() === false) return;

    switch (popupType) {
      case 'create':
        onAppend();
        break;

      case 'update':
        onUpdate();
        break;

      case 'delete':
        onDelete();
        break;
    }
  }

  const onCheckedSave = () => {
    if (isModified(gridRef, gridInfo.columns)) { // 편집 이력이 있는 경우
      modal.confirm({
        icon: null,
        title: '저장',
        // icon: <ExclamationCircleOutlined />,
        content: '편집된 내용을 저장하시겠습니까?',
        onOk: async () => {
          onSave();
        },
      });

    } else {
      message.warn('저장할 데이터가 없습니다.');
    }
  }

  const onSave = async (ref?, popupGridMode?) => {
    const modifedRows = getModifiedRows(ref ?? gridRef, gridInfo.columns);
    const _gridMode = popupGridMode ?? gridInfo.gridMode; 
    
    // date + time 작업을 해줘야함 (❗datetime picker 스타일 깨지는 문제 복구하거나 아예 editor를 만들고 나면 고쳐야함)

    const saveData:IGridModifiedRows =
      _gridMode === 'create' ?
        {
          createdRows: modifedRows.createdRows,
          updatedRows: [],
          deletedRows: []
        }
      : _gridMode === 'update' ?
        {
          createdRows: [],
          updatedRows: modifedRows.updatedRows,
          deletedRows: []
        }
      : _gridMode === 'delete' ?
        {
          createdRows: [],
          updatedRows: [],
          deletedRows: modifedRows.deletedRows,
        }
      : {
          createdRows: modifedRows.createdRows,
          updatedRows: [],
          deletedRows: []
        };


    await saveData[_gridMode+'dRows']?.forEach((el) => {
      if (el['start_date'] != null && el['start_time'] != null) {
        let time = el['start_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const start_date = dayjs(el['start_date']).format('YYYY-MM-DD') + ' ' + time;
        if (dayjs(start_date)?.isValid()) {
          el['start_date'] = dayjs(start_date).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      

      if (el['end_date'] != null && el['end_time'] != null) {
        let time = el['end_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const end_date = dayjs(el['end_date']).format('YYYY-MM-DD') + ' ' + time;
        if (dayjs(end_date)?.isValid()) {
          el['end_date'] = dayjs(end_date).format('YYYY-MM-DD HH:mm:ss');
        }
      }

      delete el['start_time'];
      delete el['end_time'];
    });

    saveData[_gridMode+'dRows'] = saveData[_gridMode+'dRows']?.map((row) => {
      return _.pick(row, DATA_PICKUP_INFO?.[_gridMode]);
    });

    // 저장 가능한지 체크
    const chk:boolean = await checkGridData(gridInfo.columns, saveData);

    if (chk === false) return;

    saveGridData(saveData, gridInfo.columns, gridInfo.saveUriPath, saveOptionParams).then(({success}) => {
      if (!success) return;
      onSearch();
      setNewPopupVisible(false);
      setEditPopupVisible(false);
    });
  }
  //#endregion


  //#region ✅렌더부
  const component = (
    <>
      <Container boxShadow={false}>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={() => onOpenPopup('delete')} disabled={!permissions?.delete_fg}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={() => onOpenPopup('update')} disabled={!permissions?.update_fg}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={() => onOpenPopup('create')} disabled={!permissions?.create_fg}>신규 추가</Button>
          </Space>
        </div>
        <p/>
        <Datagrid {...gridInfo} height={420} />
      </Container>

      {contextHolder}

      <GridPopup {...newGridPopupInfo} />
      <GridPopup {...editGridPopupInfo} />
    </>
  );
  //#endregion


  return {
    component,
    
    gridRef,
    gridMode: gridInfo.gridMode,

    data,
    setData,

    searchParams,
    setSearchParams,

    saveOptionParams,
    setSaveOptionParams,

    onSearch,

    SEARCH_URI_PATH: gridInfo.searchUriPath,
  }
}
//#endregion
