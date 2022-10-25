import Grid from '@toast-ui/react-grid';
import { Space, Modal, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  TGridPopupInfos,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  saveGridData,
} from '~/functions';
import { onDefaultGridSave, onErrorMessage, TAB_CODE } from './order.page.util';

/** 작업지시 - 투입인원관리 */
export const orderWorker = () => {
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
    {
      columnNames: [
        { original: 'emp_uuid', popup: 'emp_uuid' },
        { original: 'emp_nm', popup: 'emp_nm' },
      ],
      dataApiSettings: {
        uriPath: '/std/emps',
        params: {
          emp_status: 'incumbent',
          worker_fg: true,
        },
      },
      columns: [
        {
          header: '사원UUID',
          name: 'emp_uuid',
          alias: 'uuid',
          width: 150,
          format: 'text',
          hidden: true,
        },
        {
          header: '사번',
          name: 'emp_cd',
          width: 150,
          format: 'popup',
          editable: true,
        },
        {
          header: '사원명',
          name: 'emp_nm',
          width: 120,
          format: 'popup',
          editable: true,
        },
      ],
      gridMode: 'multi-select',
    },
  ];

  /** 메인 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.투입인원관리 + '_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 300,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/order-workers',
    /** 조회 END POINT */
    searchUriPath: '/prd/order-workers',
    saveOptionParams: saveOptionParams,
    /** 컬럼 */
    columns: [
      {
        header: '작업자투입UUID',
        name: 'order_worker_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업지시UUID',
        name: 'order_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '작업자UUID',
        name: 'emp_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '작업자명',
        name: 'emp_nm',
        width: 200,
        hidden: false,
        format: 'text',
        requiredField: true,
      },
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: gridPopupInfo[0],
    /** 수정팝업 */
    gridPopupInfo: gridPopupInfo,
    gridComboInfo: null,
  };
  //#endregion

  //#region 🔶신규 팝업 관련
  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.투입인원관리 + '_NEW_POPUP_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.투입인원관리 + '_NEW_POPUP',
    /** 팝업 제목 */
    title: '투입인원 등록',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: gridRef => {
      console.log('saveOptionParams', saveOptionParams);
      saveGridData(
        getModifiedRows(
          gridRef,
          newGridPopupInfo.columns,
          newGridPopupInfo.data,
        ),
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch();
        setNewPopupVisible(false);
      });
    },
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
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      onSearch();
      setNewPopupVisible(false);
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
      { title: '투입인원 관리' },
    ).then(res => {
      setData(res);
    });
  };

  const onAppend = ev => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setNewPopupVisible(true);
  };

  const onDelete = () => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      gridInfo.saveUriPath,
      {},
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

      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}

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
