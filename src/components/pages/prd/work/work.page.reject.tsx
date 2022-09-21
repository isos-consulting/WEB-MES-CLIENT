import Grid from '@toast-ui/react-grid';
import { message, Space, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  IDatagridProps,
  IGridModifiedRows,
  IGridPopupProps,
} from '~/components/UI';
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
import { cloneDeep, pick } from 'lodash';
import { ENUM_DECIMAL } from '~/enums';

const DATA_PICKUP_INFO = {
  create: [
    'factory_uuid',
    'work_uuid',
    'work_routing_uuid',
    'reject_uuid',
    'qty',
    'to_store_uuid',
    'to_location_uuid',
    'remark',
  ],
  update: [
    'work_reject_uuid', //uuid
    'qty',
    'remark',
  ],
  delete: [
    'work_reject_uuid', //uuid
  ],
};

/** 생산관리 - 부적합관리 */
export const REJECT = () => {
  //#region 🔶공용 설정
  /** 페이지 제목 */
  const title = getPageName();
  /** 권한 관련 */
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});
  const [rowAddedParams, setRowAddedParams] = useState({});
  //#endregion

  //#region 🔶부적합 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  /** 비가동 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.workReject + '_GRID' + '_POPUP_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 400,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/work-rejects',
    /** 조회 END POINT */
    searchUriPath: '/prd/work-rejects',
    /** 컬럼 */
    columns: [
      {
        header: '생산부적합UUID',
        name: 'work_reject_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '부적합UUID',
        name: 'reject_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '부적합 유형',
        name: 'reject_type_nm',
        width: 120,
        format: 'text',
      },
      {
        header: '부적합명',
        name: 'reject_nm',
        width: 120,
        format: 'text',
        requiredField: true,
      },
      {
        header: '수량',
        name: 'qty',
        width: 100,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        editable: true,
        requiredField: true,
      },
      {
        header: '입고 창고UUID',
        name: 'to_store_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '입고 창고',
        name: 'to_store_nm',
        width: 120,
        format: 'combo',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고 위치UUID',
        name: 'to_location_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '입고 위치',
        name: 'to_location_nm',
        width: 120,
        format: 'combo',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: 150,
        format: 'text',
        editable: true,
      },
    ],
    /** 그리드 데이터 */
    data: data,
    gridComboInfo: [
      {
        //입고창고 콤보박스
        columnNames: [
          {
            codeColName: { original: 'to_store_uuid', popup: 'store_uuid' },
            textColName: { original: 'to_store_nm', popup: 'store_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/stores',
          params: {
            store_type: 'reject',
          },
        },
      },
      {
        //입고위치 콤보박스
        columnNames: [
          {
            codeColName: {
              original: 'to_location_uuid',
              popup: 'location_uuid',
            },
            textColName: { original: 'to_location_nm', popup: 'location_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/locations',
          params: {
            //store_uuid
          },
        },
      },
    ],
    /** 행추가팝업 */
    rowAddPopupInfo: {
      columnNames: [
        { original: 'reject_uuid', popup: 'reject_uuid' },
        { original: 'reject_nm', popup: 'reject_nm' },
        { original: 'reject_type_nm', popup: 'reject_type_nm' },
      ],
      columns: [
        {
          header: '부적합UUID',
          name: 'reject_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '부적합 유형',
          name: 'reject_type_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
        {
          header: '부적합명',
          name: 'reject_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/proc-rejects',
        params: { ...rowAddedParams },
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
    gridId: TAB_CODE.workReject + '_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workReject + '_GRID' + '_NEW_POPUP',
    /** 팝업 제목 */
    title: '부적합 항목 추가',
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
    if (['to_store_nm', 'to_location_nm'].includes(el?.name)) {
      el['editable'] = false;
    }
    return el;
  });

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.workReject + '_EDIT_GRID',
    columns: editPopupGridColumns,
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: data,
    height: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.workReject + '_GRID' + '_EDIT_POPUP',
    /** 팝업 제목 */
    title: '부적합 항목 수정',
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
      searchParams?.['work_uuid'] == null ||
      searchParams?.['work_routing_uuid'] == null
    ) {
      onErrorMessage('하위이력작업시도');
      return false;
    }

    if (searchParams?.['complete_fg'] == 'true') {
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
    const modifedRows = getModifiedRows(ref ?? gridRef, gridInfo.columns);
    const _gridMode = popupGridMode ?? gridInfo.gridMode;

    const saveData: IGridModifiedRows =
      _gridMode === 'create'
        ? {
            createdRows: modifedRows.createdRows,
            updatedRows: [],
            deletedRows: [],
          }
        : _gridMode === 'update'
        ? {
            createdRows: [],
            updatedRows: modifedRows.updatedRows,
            deletedRows: [],
          }
        : _gridMode === 'delete'
        ? {
            createdRows: [],
            updatedRows: [],
            deletedRows: modifedRows.deletedRows,
          }
        : {
            createdRows: modifedRows.createdRows,
            updatedRows: [],
            deletedRows: [],
          };

    // 저장 가능한지 체크
    const chk: boolean = await checkGridData(gridInfo.columns, saveData);

    if (chk === false) return;

    saveData[_gridMode + 'dRows'] = saveData[_gridMode + 'dRows']?.map(row => {
      return pick(row, DATA_PICKUP_INFO?.[_gridMode]);
    });

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
    setRowAddedParams,

    onSearch,

    SEARCH_URI_PATH: gridInfo.searchUriPath,
  };
};
