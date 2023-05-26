import Grid from '@toast-ui/react-grid';
import { Space, Modal, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  TGridPopupInfos,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  saveGridData,
} from '~/functions';
import { isNil } from '~/helper/common';
import { onDefaultGridSave } from '.';
import { onErrorMessage, TAB_CODE } from './order.page.util';

/** 작업지시 - 공정순서 */
export const orderRoute = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  const [modal, contextHolder] = Modal.useModal();

  const [saveOptionParams, setSaveOptionParams] = useState({});

  //#region 🔶 메인 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const gridPopupInfo: TGridPopupInfos = [
    // 공정관리
    {
      columnNames: [
        { original: 'proc_uuid', popup: 'proc_uuid' },
        { original: 'proc_cd', popup: 'proc_cd' },
        { original: 'proc_nm', popup: 'proc_nm' },
      ],
      dataApiSettings: {
        uriPath: getPopupForm('공정관리')?.uriPath,
        params: {},
      },
      columns: getPopupForm('공정관리')?.datagridProps?.columns,
      gridMode: 'select',
    },
    // 설비관리
    {
      columnNames: [
        { original: 'equip_uuid', popup: 'equip_uuid' },
        { original: 'equip_cd', popup: 'equip_cd' },
        { original: 'equip_nm', popup: 'equip_nm' },
      ],
      dataApiSettings: {
        uriPath: getPopupForm('설비관리')?.uriPath,
        params: {},
      },
      columns: getPopupForm('설비관리')?.datagridProps?.columns,
      gridMode: 'select',
    },
    // 작업장관리
    {
      columnNames: [
        { original: 'workings_uuid', popup: 'workings_uuid' },
        { original: 'workings_cd', popup: 'workings_cd' },
        { original: 'workings_nm', popup: 'workings_nm' },
      ],
      dataApiSettings: {
        uriPath: getPopupForm('작업장관리')?.uriPath,
        params: {},
      },
      columns: getPopupForm('작업장관리')?.datagridProps?.columns,
      gridMode: 'select',
    },
    // 금형관리
    {
      columnNames: [
        { original: 'mold_uuid', popup: 'mold_uuid' },
        { original: 'mold_cd', popup: 'mold_cd' },
        { original: 'mold_nm', popup: 'mold_nm' },
      ],
      dataApiSettings: {
        uriPath: getPopupForm('금형관리')?.uriPath,
        params: {},
      },
      columns: getPopupForm('금형관리')?.datagridProps?.columns,
      gridMode: 'select',
    },
  ];

  /** 메인 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.공정순서 + '_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 300,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/order-routings',
    /** 조회 END POINT */
    searchUriPath: '/prd/order-routings',
    saveOptionParams: saveOptionParams,
    /** 컬럼 */
    columns: [
      {
        header: '공정순서UUID',
        name: 'order_routing_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정순서',
        name: 'proc_no',
        width: ENUM_WIDTH.M,
        hidden: false,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
        align: 'center',
        requiredField: true,
      },
      {
        header: '작업지시UUID',
        name: 'order_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정코드',
        name: 'proc_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '공정명',
        name: 'proc_nm',
        width: ENUM_WIDTH.XL,
        hidden: false,
        editable: true,
        format: 'popup',
        requiredField: true,
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장코드',
        name: 'workings_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '작업장명',
        name: 'workings_nm',
        width: ENUM_WIDTH.L,
        editable: true,
        format: 'popup',
        requiredField: true,
      },
      {
        header: '금형UUID',
        name: 'mold_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '금형코드',
        name: 'mold_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '금형명',
        name: 'mold_nm',
        width: ENUM_WIDTH.L,
        editable: true,
        format: 'popup',
        noSave: true,
      },
      {
        header: '금형Cavity',
        name: 'mold_cavity',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
      {
        header: '설비UUID',
        name: 'equip_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '설비코드',
        name: 'equip_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '설비명',
        name: 'equip_nm',
        width: ENUM_WIDTH.XL,
        hidden: false,
        editable: true,
        format: 'popup',
        noSave: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.XL,
        hidden: false,
        editable: true,
        format: 'text',
      },
      {
        header: '신호카운트',
        name: 'prd_signal_cnt',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
    ],
    /** 그리드 데이터 */
    data: data,
    /** 수정팝업 */
    gridPopupInfo: gridPopupInfo,
    gridComboInfo: null,
  };
  //#endregion

  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.공정순서 + '_EDIT_POPUP_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    columns: [
      {
        header: '공정순서UUID',
        name: 'order_routing_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정순서',
        name: 'proc_no',
        width: ENUM_WIDTH.M,
        hidden: false,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
        align: 'center',
        requiredField: true,
      },
      {
        header: '작업지시UUID',
        name: 'order_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정코드',
        name: 'proc_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '공정명',
        name: 'proc_nm',
        width: ENUM_WIDTH.XL,
        format: 'popup',
        requiredField: true,
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장코드',
        name: 'workings_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '작업장명',
        name: 'workings_nm',
        width: ENUM_WIDTH.L,
        editable: true,
        format: 'popup',
        requiredField: true,
      },
      {
        header: '금형UUID',
        name: 'mold_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '금형코드',
        name: 'mold_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '금형명',
        name: 'mold_nm',
        width: ENUM_WIDTH.L,
        editable: true,
        format: 'popup',
        noSave: true,
      },
      {
        header: '금형Cavity',
        name: 'mold_cavity',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
      {
        header: '설비UUID',
        name: 'equip_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '설비코드',
        name: 'equip_cd',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
        noSave: true,
      },
      {
        header: '설비명',
        name: 'equip_nm',
        width: ENUM_WIDTH.XL,
        editable: true,
        format: 'popup',
        noSave: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.XL,
        hidden: false,
        editable: true,
        format: 'text',
      },
      {
        header: '신호카운트',
        name: 'prd_signal_cnt',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
        disableStringEmpty: true,
      },
    ],
    defaultData: data,
    data: data,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.공정순서 + '_EDIT_POPUP',
    /** 팝업 제목 */
    title: '공정순서 수정',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: gridRef => {
      gridRef.current.getInstance().finishEditing();
      saveGridData(
        getModifiedRows(
          gridRef,
          editGridPopupInfo.columns,
          editGridPopupInfo.data,
        ),
        editGridPopupInfo.columns,
        editGridPopupInfo.saveUriPath,
        editGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch();
        setEditPopupVisible(false);
      });
    },
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
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      onSearch();
      setEditPopupVisible(false);
    },
  };
  //#endregion

  //#region 🔶수정 팝업 관련
  const appendPopupGridRef = useRef<Grid>();
  const [appendPopupVisible, setAppendPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const appendGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.공정순서 + '_APPEND_POPUP_GRID',
    ref: appendPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    /** 등록/수정 일시 숨기기 */
    disabledAutoDateColumn: true,
    /** 팝업 아이디 */
    popupId: TAB_CODE.공정순서 + '_APPEND_POPUP',
    /** 팝업 제목 */
    title: '공정순서 등록',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: gridRef => {
      gridRef.current.getInstance().finishEditing();
      saveGridData(
        getModifiedRows(
          gridRef,
          appendGridPopupInfo.columns,
          appendGridPopupInfo.data,
        ),
        appendGridPopupInfo.columns,
        appendGridPopupInfo.saveUriPath,
        appendGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch();
        setAppendPopupVisible(false);
      });
    },
    /** 네거티브 버튼 글자 */
    cancelText: '취소',
    onCancel: () => {
      setAppendPopupVisible(false);
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
    visible: appendPopupVisible,
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      onSearch();
      setAppendPopupVisible(false);
    },
  };
  //#endregion

  const onSearch = () => {
    getData(
      saveOptionParams,
      gridInfo.searchUriPath,
      'raws',
      null,
      false,
      null,
      { title: '라우트 조회' },
    ).then(res => {
      setData(res);
    });
  };

  const onEdit = ev => {
    if (isNil(saveOptionParams?.order_uuid)) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setEditPopupVisible(true);
  };

  const onAppend = ev => {
    if (isNil(saveOptionParams?.order_uuid)) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setAppendPopupVisible(true);
  };

  const onDelete = () => {
    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      gridInfo.saveUriPath,
      gridInfo.saveOptionParams,
      modal,
      ({ success }) => {
        if (!success) return;
        onSearch();
      },
    );
  };

  const element = !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right' }}>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType="blue"
              onClick={onDelete}
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
              onClick={onEdit}
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
              onClick={onAppend}
              disabled={!permissions?.create_fg}
            >
              항목 추가
            </Button>
          </Space>
        </div>
        {/* <p/> */}
        <Datagrid
          {...gridInfo}
          gridMode={!permissions?.delete_fg ? 'view' : gridInfo.gridMode}
        />
      </Container>

      {editPopupVisible ? <GridPopup {...editGridPopupInfo} /> : null}
      {appendPopupVisible ? <GridPopup {...appendGridPopupInfo} /> : null}

      {contextHolder}
    </>
  );

  return {
    element,
    setData: setData,
    saveOptionParams,
    setSaveOptionParams: setSaveOptionParams,
    searchUriPath: gridInfo.searchUriPath,
    onSearch,
  };
};
