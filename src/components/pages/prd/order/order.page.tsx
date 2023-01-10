import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, message, Modal, Space, Spin, Typography } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  IGridPopupInfo,
  Searchbox,
  Tabs,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { InputGroupbox, useInputGroup } from '~/components/UI/input-groupbox';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { SENTENCE } from '~/constants/lang/ko';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  getToday,
  saveGridData,
} from '~/functions';
import { orderInput, orderRoute, TAB_CODE } from '../order';
import prdOrderNewModalColumns from './modal/prd-order-new-modal-columns';
import { onDefaultGridSave } from './order.page.util';
import { orderWorker } from './order.page.worker';
import { getDailyWorkPlanModalProps } from './plan/prd-load-work-plan';
import prdOrderHeaderColumns from './prd-order-header-columns';
import prdOrderInputReceiveInputboxes from './prd-order-input-receive-inputboxes';
import prdOrderRowAddpopups from './prd-order-row-addpopups';

export const PgPrdOrder = () => {
  const title = getPageName();
  const permissions = getPermissions(title);

  const [modal, contextHolder] = Modal.useModal();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  const ORDER_INPUT = orderInput();
  const ORDER_WORKER = orderWorker();
  const ORDER_ROUTE = orderRoute();

  const inputReceive = useInputGroup(
    'INPUT_ITEMS_WORK',
    prdOrderInputReceiveInputboxes,
  );

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const ORDER_POPUP_INFO: IGridPopupInfo[] = [
    {
      columnNames: [
        { original: 'routing_resource_uuid', popup: 'routing_resource_uuid' },
        { original: 'equip_uuid', popup: 'equip_uuid' },
        { original: 'equip_cd', popup: 'equip_cd' },
        { original: 'equip_nm', popup: 'equip_nm' },
      ],
      columns: [
        {
          header: '생산자원UUID',
          name: 'routing_resource_uuid',
          alias: 'uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '공장UUID',
          name: 'factory_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '라우팅UUID',
          name: 'routing_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '자원 유형',
          name: 'resource_type',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: '설비UUID',
          name: 'equip_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '설비명',
          name: 'equip_nm',
          width: ENUM_WIDTH.L,
          hidden: false,
          format: 'text',
        },
        {
          header: '인원',
          name: 'emp_cnt',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: 'Cycle Time',
          name: 'cycle_time',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/routing-resources',
        params: {
          resource_type: 'equip',
        },
      },
      gridMode: 'select',
    },
    {
      // 금형관리
      columnNames: [
        { original: 'mold_uuid', popup: 'mold_uuid' },
        { original: 'mold_nm', popup: 'mold_nm' },
        { original: 'mold_no', popup: 'mold_no' },
        { original: 'mold_cavity', popup: 'mold_cavity' },
      ],
      columns: getPopupForm('금형관리')?.datagridProps?.columns,
      dataApiSettings: (el: any) => {
        const rowKey = el.rowKey;
        const rowData = el?.instance?.store?.data?.rawData.find(
          el => el.rowKey === rowKey,
        );
        return {
          uriPath: getPopupForm('금형관리')?.uriPath,
          params: {},
          onInterlock: () => {
            let complete: boolean = rowData?.complete_fg;
            console.log(complete);
            if (complete) {
              message.warn('작업이 마감되어 금형을 수정할 수 없습니다.');
            }
            return !complete;
          },
        };
      },
      gridMode: 'select',
    },
    {
      // 작업장 관리
      columnNames: [
        { original: 'workings_uuid', popup: 'workings_uuid' },
        { original: 'workings_cd', popup: 'workings_cd' },
        { original: 'workings_nm', popup: 'workings_nm' },
      ],
      columns: getPopupForm('작업장관리')?.datagridProps?.columns,
      dataApiSettings: {
        uriPath: getPopupForm('작업장관리')?.uriPath,
        params: {},
      },
      gridMode: 'select',
    },
  ];

  const gridInfo: IDatagridProps = {
    gridId: 'ORDER_GRID',
    ref: gridRef,
    height: 300,
    gridMode: 'delete',
    saveUriPath: '/prd/orders',
    searchUriPath: '/prd/orders',
    columns: prdOrderHeaderColumns,
    data: data,
    rowAddPopupInfo: {
      ...prdOrderRowAddpopups,
      gridMode: 'multi-select',
    },
    gridPopupInfo: ORDER_POPUP_INFO,
    gridComboInfo: [
      {
        columnNames: [
          {
            codeColName: { original: 'shift_uuid', popup: 'shift_uuid' },
            textColName: { original: 'shift_nm', popup: 'shift_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/shifts',
          params: {},
        },
      },
      {
        columnNames: [
          {
            codeColName: {
              original: 'worker_group_uuid',
              popup: 'worker_group_uuid',
            },
            textColName: {
              original: 'worker_group_nm',
              popup: 'worker_group_nm',
            },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/worker-groups',
          params: {},
        },
      },
    ],
    onAfterClick: ev => {
      const { rowKey, targetType } = ev;

      if (targetType === 'cell') {
        try {
          const row = ev?.instance?.store?.data?.rawData[rowKey];
          const order_uuid = row?.order_uuid;

          inputReceive.setValues({ ...row });

          getData(
            {
              order_uuid: String(order_uuid),
            },
            ORDER_INPUT.searchUriPath,
            'raws',
            null,
            false,
            null,
            { title: '투입품목 조회' },
          ).then(res => {
            ORDER_INPUT.setData(res);
            ORDER_INPUT.setSaveOptionParams({ order_uuid });
          });

          getData(
            {
              order_uuid: String(order_uuid),
            },
            ORDER_WORKER.searchUriPath,
            'raws',
            null,
            false,
            null,
            { title: '투입인원 관리' },
          ).then(res => {
            ORDER_WORKER.setData(res);
            ORDER_WORKER.setSaveOptionParams({ order_uuid });
          });

          getData(
            {
              order_uuid: String(order_uuid),
            },
            ORDER_ROUTE.searchUriPath,
            'raws',
            null,
            false,
            null,
            { title: '공정순서 관리' },
          ).then(res => {
            ORDER_ROUTE.setData(res);
            ORDER_ROUTE.setSaveOptionParams({ order_uuid });
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
  };

  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  const newGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    columns: prdOrderNewModalColumns,
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    disabledAutoDateColumn: true,
    popupId: 'ORDER_NEW_GRID_POPUP',
    title: '작업지시 등록',
    okText: '저장하기',
    onOk: gridRef => {
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
        onSearch(searchParams);
        setNewPopupVisible(false);
      });
    },
    cancelText: '취소',
    onCancel: () => {
      setNewPopupVisible(false);
    },
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: newPopupVisible,
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      setNewPopupVisible(false);
      onSearch(searchParams);
    },
    extraButtons: [
      {
        buttonProps: { text: SENTENCE.WORK_PLAN_LOAD, children: '' },
        buttonAction: (_ev, props, options) => {
          const { childGridRef, columns, gridRef } = options;

          getDailyWorkPlanModalProps({
            childGridRef,
            columns,
            gridRef,
            props,
          }).then(modal.confirm);
        },
      },
    ],
  };

  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    columns: [
      {
        header: '작업지시UUID',
        name: 'order_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '우선순위',
        name: 'priority',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NOMAL,
        filter: 'number',
      },
      {
        header: '지시일',
        name: 'reg_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        filter: 'date',
        requiredField: true,
      },
      {
        header: '지시번호',
        name: 'order_no',
        width: ENUM_WIDTH.M,
        editable: true,
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '작업장',
        name: 'workings_nm',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'popup',
        filter: 'text',
        requiredField: true,
        noSave: true,
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
        noSave: true,
      },
      {
        header: '품목',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        requiredField: true,
        noSave: true,
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
        noSave: true,
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        noSave: true,
      },
      {
        header: '계획수량',
        name: 'plan_qty',
        width: ENUM_WIDTH.M,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
      },
      {
        header: '지시수량',
        name: 'qty',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        requiredField: true,
      },
      {
        header: '지시순번',
        name: 'seq',
        width: ENUM_WIDTH.S,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NOMAL,
        hidden: true,
      },
      {
        header: '작업교대UUID',
        name: 'shift_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        requiredField: true,
      },
      {
        header: '작업교대',
        name: 'shift_nm',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'combo',
        filter: 'text',
        requiredField: true,
        noSave: true,
      },
      {
        header: '수주상세UUID',
        name: 'sal_order_detail_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: ENUM_WIDTH.XL,
        editable: true,
        filter: 'text',
      },
    ],
    defaultData: data,
    data: data,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: 'ORDER_EDIT_GRID_POPUP',
    /** 팝업 제목 */
    title: '작업지시 수정',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(
          editPopupGridRef,
          editGridPopupInfo.columns,
          editGridPopupInfo.data,
        ),
        editGridPopupInfo.columns,
        editGridPopupInfo.saveUriPath,
        editGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
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
    // saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: editPopupVisible,
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      setEditPopupVisible(false);
      onSearch(searchParams);
    },
  };
  //#endregion

  const onSearch = values => {
    getData(
      {
        ...values,
        order_state: 'all',
      },
      gridInfo.searchUriPath,
    )
      .then(res => {
        setData(res || []);
        inputReceive.ref.current.resetForm();
      })
      .finally(() => {
        // 지시이력 조회되면서 하위 데이터 초기화
        ORDER_INPUT.setSaveOptionParams({});
        ORDER_WORKER.setSaveOptionParams({});
        ORDER_ROUTE.setSaveOptionParams({});
        ORDER_INPUT.setData([]);
        ORDER_WORKER.setData([]);
        ORDER_ROUTE.setData([]);
      });
  };

  const onAppend = () => {
    setNewPopupVisible(true);
  };

  const onEdit = () => {
    setEditPopupVisible(true);
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
        onSearch(searchParams);
      },
    );
  };

  //#endregion

  const HeaderGridElement = useMemo(() => {
    const gridMode = !permissions?.delete_fg ? 'view' : 'delete';
    return <Datagrid {...gridInfo} gridMode={gridMode} />;
  }, [gridRef, data, permissions]);

  return !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        지시이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} align="start">
            {/* <Input.Search
              placeholder='전체 검색어를 입력하세요.'
              enterButton
              onSearch={onAllFiltered}/> */}
            {/* <Button btnType='buttonFill' widthSize='small' ImageType='search' colorType='blue' onClick={onSearch}>조회</Button> */}
          </Space>
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
              신규 추가
            </Button>
          </Space>
        </div>
        <div style={{ maxWidth: 500, marginTop: -33, marginLeft: -6 }}>
          <Searchbox
            id="prod_order_search"
            innerRef={searchRef}
            searchItems={[
              {
                type: 'date',
                id: 'start_date',
                label: '지시기간',
                default: getToday(-7),
              },
              { type: 'date', id: 'end_date', default: getToday() },
            ]}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        {/* <p/> */}
        {HeaderGridElement}
      </Container>

      {/* 지시정보 */}
      <Typography.Title
        level={5}
        style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
      >
        <CaretRightOutlined />
        지시정보
      </Typography.Title>
      <div style={{ width: '100%', display: 'inline-block', marginTop: -26 }}>
        {' '}
      </div>
      <Divider style={{ marginTop: 2, marginBottom: 10 }} />
      <InputGroupbox {...inputReceive.props} />

      <Typography.Title
        level={5}
        style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
      >
        <CaretRightOutlined />
        이력 항목관리
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Tabs
        type="card"
        onChange={activeKey => {
          switch (activeKey) {
            case TAB_CODE.투입품목관리:
              if ((ORDER_INPUT.saveOptionParams as any)?.order_uuid != null) {
                ORDER_INPUT.onSearch();
              }
              break;

            case TAB_CODE.투입인원관리:
              if ((ORDER_WORKER.saveOptionParams as any)?.order_uuid != null) {
                ORDER_WORKER.onSearch();
              }
              break;

            case TAB_CODE.공정순서:
              if ((ORDER_ROUTE.saveOptionParams as any)?.order_uuid != null) {
                ORDER_ROUTE.onSearch();
              }
              break;
          }
        }}
        panels={[
          {
            tab: '투입품목 관리',
            tabKey: TAB_CODE.투입품목관리,
            content: ORDER_INPUT.element,
          },
          {
            tab: '투입인원 관리',
            tabKey: TAB_CODE.투입인원관리,
            content: ORDER_WORKER.element,
          },
          {
            tab: '공정순서',
            tabKey: TAB_CODE.공정순서,
            content: ORDER_ROUTE.element,
          },
        ]}
      />

      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}
      {editPopupVisible ? <GridPopup {...editGridPopupInfo} /> : null}

      {contextHolder}
    </>
  );
};

//#endregion
