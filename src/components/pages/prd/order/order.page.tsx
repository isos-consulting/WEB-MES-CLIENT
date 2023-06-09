import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Modal, Space, Spin, Typography } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
  Tabs,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { InputGroupbox, useInputGroup } from '~/components/UI/input-groupbox';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { SENTENCE } from '~/constants/lang/ko';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  getToday,
  saveGridData,
} from '~/functions';
import { isNil } from '~/helper/common';
import { orderInput, orderRoute, TAB_CODE } from '../order';
import prdOrderEditModalColumns from './modal/prd-order-edit-modal-columns';
import prdOrderNewModalColumns from './modal/prd-order-new-modal-columns';
import { onDefaultGridSave } from './order.page.util';
import { orderWorker } from './order.page.worker';
import { getDailyWorkPlanModalProps } from './plan/prd-load-work-plan';
import prdOrderHeaderColumns from './prd-order-header-columns';
import prdOrderInputReceiveInputboxes from './prd-order-input-receive-inputboxes';
import prdOrderPopups from './prd-order-popups';
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
    gridPopupInfo: prdOrderPopups,
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

  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    columns: prdOrderEditModalColumns,
    defaultData: data,
    data: data,
    height: null,
    onAfterClick: null,
    popupId: 'ORDER_EDIT_GRID_POPUP',
    title: '작업지시 수정',
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
    cancelText: '취소',
    onCancel: () => {
      setEditPopupVisible(false);
    },
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: editPopupVisible,
    onAfterOk: (isSuccess, savedData) => {
      if (!isSuccess) return;
      setEditPopupVisible(false);
      onSearch(searchParams);
    },
  };

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
        {HeaderGridElement}
      </Container>
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
              if (!isNil((ORDER_INPUT.saveOptionParams as any)?.order_uuid)) {
                ORDER_INPUT.onSearch();
              }
              break;

            case TAB_CODE.투입인원관리:
              if (!isNil((ORDER_WORKER.saveOptionParams as any)?.order_uuid)) {
                ORDER_WORKER.onSearch();
              }
              break;

            case TAB_CODE.공정순서:
              if (!isNil((ORDER_ROUTE.saveOptionParams as any)?.order_uuid)) {
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
