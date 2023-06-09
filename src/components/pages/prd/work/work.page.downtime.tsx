import Grid from '@toast-ui/react-grid';
import { message, Space, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  IGridModifiedRows,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import {
  checkGridData,
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  isModified,
  saveGridData,
} from '~/functions';
import { onErrorMessage, TAB_CODE } from './work.page.util';
import dayjs from 'dayjs';
import { cloneDeep, pick } from 'lodash';
import { isNil } from '~/helper/common';

const DATA_PICKUP_INFO = {
  create: [
    'factory_uuid',
    'work_uuid',
    'work_routing_uuid',
    'equip_uuid',
    'downtime_uuid',
    'start_date',
    'end_date',
    // 'downtime',
    'remark',
  ],
  update: [
    'work_downtime_uuid', //uuid
    'start_date',
    'end_date',
    // 'downtime',
    'remark',
  ],
  delete: [
    'work_downtime_uuid', //uuid
  ],
};

/** 생산관리 - 비가동관리 */
export const DOWNTIME = () => {
  //#region 🔶공용 설정
  /** 페이지 제목 */
  const title = getPageName();
  /** 권한 관련 */
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});
  //#endregion

  //#region 🔶비가동 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  /** 비가동 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.workDowntime + '_GRID' + '_POPUP_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 400,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/work-downtimes',
    /** 조회 END POINT */
    searchUriPath: '/prd/work-downtimes',
    /** 컬럼 */
    columns: [
      {
        header: '생산부적합UUID',
        name: 'work_downtime_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동 유형UUID',
        name: 'downtime_type_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동 유형',
        name: 'downtime_type_nm',
        width: 120,
        hidden: false,
        format: 'text',
      },
      {
        header: '비가동UUID',
        name: 'downtime_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동',
        name: 'downtime_nm',
        width: 120,
        hidden: false,
        format: 'text',
      },
      {
        header: '시작일자',
        name: 'start_date',
        width: 100,
        hidden: false,
        format: 'date',
        editable: true,
      },
      {
        header: '시작시간',
        name: 'start_time',
        width: 100,
        hidden: false,
        format: 'time',
        editable: true,
      },
      {
        header: '종료일자',
        name: 'end_date',
        width: 100,
        hidden: false,
        format: 'date',
        editable: true,
      },
      {
        header: '종료시간',
        name: 'end_time',
        width: 100,
        hidden: false,
        format: 'time',
        editable: true,
      },
      {
        header: '비가동 시간',
        name: 'downtime',
        width: 100,
        hidden: true,
        format: 'time',
      },
      {
        header: '비고',
        name: 'remark',
        width: 150,
        hidden: false,
        format: 'text',
        editable: true,
      },
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: {
      columnNames: [
        { original: 'downtime_uuid', popup: 'downtime_uuid' },
        { original: 'downtime_nm', popup: 'downtime_nm' },
        { original: 'downtime_type_uuid', popup: 'downtime_type_uuid' },
        { original: 'downtime_type_nm', popup: 'downtime_type_nm' },
      ],
      columns: [
        {
          header: '비가동UUID',
          name: 'downtime_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '비가동 유형UUID',
          name: 'downtime_type_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '비가동 유형',
          name: 'downtime_type_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
        {
          header: '비가동명',
          name: 'downtime_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/downtimes',
        params: {},
      },
      gridMode: 'multi-select',
    },
  };
  //#endregion

  //#region 🔶신규 팝업 관련
  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.workDowntime + '_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workDowntime + '_GRID' + '_NEW_POPUP',
    /** 팝업 제목 */
    title: '비가동 항목 추가',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: gridRef => onSave(gridRef, 'create'),
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
  const editPopupGridColumns = cloneDeep(gridInfo.columns)?.map(el => {
    if (['proc_nm', 'proc_no', 'equip_nm'].includes(el?.name)) {
      el['editable'] = false;
    }
    return el;
  });

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.workDowntime + '_EDIT_GRID',
    columns: editPopupGridColumns,
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: data,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workDowntime + '_GRID' + '_EDIT_POPUP',
    /** 팝업 제목 */
    title: '비가동 항목 수정',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: gridRef => onSave(gridRef, 'update'),
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

  //#region 🔶함수
  const onSearch = () => {
    const work_uuid = searchParams?.['work_uuid'];
    const work_routing_uuid = searchParams?.['work_routing_uuid'];
    getData(
      {
        work_uuid,
        work_routing_uuid,
      },
      gridInfo.searchUriPath,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      setData(res);
    });
  };

  /** 조작 가능 여부 판단 */
  const onCheckAccessAllow = (): boolean => {
    if (
      isNil(searchParams?.['work_uuid']) ||
      isNil(searchParams?.['work_routing_uuid'])
    ) {
      onErrorMessage('하위이력작업시도');
      return false;
    }

    if ((searchParams as any)?.complete_fg == 'true') {
      onErrorMessage('완료된작업시도');
      return false;
    }

    return true;
  };

  /** 삭제 버튼 이벤트 */
  const onDelete = () => {
    onCheckedSave();
  };

  /** 수정 버튼 이벤트 */
  const onUpdate = () => {
    setEditPopupVisible(true);
  };

  /** 신규 추가 버튼 이벤트 */
  const onAppend = () => {
    setNewPopupVisible(true);
  };

  type TPopupType = 'create' | 'update' | 'delete';
  /** 팝업 여는 이벤트 */
  const onOpenPopup = (popupType: TPopupType) => {
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
  };

  /** 저장 여부 확인 후 저장하는 이벤트 */
  const onCheckedSave = () => {
    if (isModified(gridRef, gridInfo.columns)) {
      // 편집 이력이 있는 경우
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
  };

  /** 저장 이벤트 */
  const onSave = async (ref?, popupGridMode?) => {
    const modifiedRows = getModifiedRows(ref ?? gridRef, gridInfo.columns);
    const _gridMode = popupGridMode ?? gridInfo.gridMode;

    // date + time 작업을 해줘야함 (❗datetime picker 스타일 깨지는 문제 복구하거나 아예 editor를 만들고 나면 고쳐야함)

    const saveData: IGridModifiedRows =
      _gridMode === 'create'
        ? {
            createdRows: modifiedRows.createdRows,
            updatedRows: [],
            deletedRows: [],
          }
        : _gridMode === 'update'
        ? {
            createdRows: [],
            updatedRows: modifiedRows.updatedRows,
            deletedRows: [],
          }
        : _gridMode === 'delete'
        ? {
            createdRows: [],
            updatedRows: [],
            deletedRows: modifiedRows.deletedRows,
          }
        : {
            createdRows: modifiedRows.createdRows,
            updatedRows: [],
            deletedRows: [],
          };

    await saveData[_gridMode + 'dRows']?.forEach(el => {
      if (!isNil(el['start_date']) && !isNil(el['start_time'])) {
        let time = el['start_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const start_date =
          dayjs(el['start_date']).format('YYYY-MM-DD') + ' ' + time;
        if (dayjs(start_date)?.isValid()) {
          el['start_date'] = dayjs(start_date)
            .locale('ko')
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }

      if (!isNil(el['end_date']) && !isNil(el['end_time'])) {
        let time = el['end_time'];

        if (String(time)?.length !== 5) {
          time = dayjs(time).format('HH:mm');
        }

        const end_date =
          dayjs(el['end_date']).format('YYYY-MM-DD') + ' ' + time;
        if (dayjs(end_date)?.isValid()) {
          el['end_date'] = dayjs(end_date)
            .locale('ko')
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }

      delete el['start_time'];
      delete el['end_time'];
    });

    saveData[_gridMode + 'dRows'] = saveData[_gridMode + 'dRows']?.map(row => {
      return pick(row, DATA_PICKUP_INFO?.[_gridMode]);
    });

    // 저장 가능한지 체크
    const chk: boolean = await checkGridData(gridInfo.columns, saveData);

    if (chk === false) return;

    saveGridData(
      saveData,
      gridInfo.columns,
      gridInfo.saveUriPath,
      saveOptionParams,
    ).then(({ success }) => {
      if (!success) return;
      onSearch();
      setNewPopupVisible(false);
      setEditPopupVisible(false);
    });
  };
  //#endregion

  //#region 🔶렌더부
  const component = (
    <>
      <Container boxShadow={false}>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right' }}>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType="blue"
              onClick={() => onOpenPopup('delete')}
              disabled={!permissions?.delete_fg}
            >
              삭제
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="edit"
              colorType="blue"
              onClick={() => onOpenPopup('update')}
              disabled={!permissions?.update_fg}
            >
              수정
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="large"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={() => onOpenPopup('create')}
              disabled={!permissions?.create_fg}
            >
              신규 추가
            </Button>
          </Space>
        </div>
        <p />
        <Datagrid {...gridInfo} height={420} />
      </Container>

      {contextHolder}

      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}
      {editPopupVisible ? <GridPopup {...editGridPopupInfo} /> : null}
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
  };
};
