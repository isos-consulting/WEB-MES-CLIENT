import { Container, Datagrid, Modal, Searchbox, Tabs } from '~/components/UI';
import React, { useState, useLayoutEffect } from 'react';
import { ScModal } from '~/components/UI/modal/modal.ui.styled';
import { getData } from '~/functions';

export const ProdOrderModalInWorkPerformancePage = ({
  visible,
  onClose,
  onSave,
  searchInfo,
  gridRef,
  PROD_ORDER_COLUMNS,
  data,
}) => {
  return (
    <Modal
      title="작업지시 관리"
      okText={null}
      cancelText={null}
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      onOk={onSave}
      width="80%"
    >
      <>
        <Searchbox
          {...searchInfo.props}
          onSearch={searchInfo.onSearch}
          boxShadow={false}
        />
        <Datagrid
          gridId="PROD_ORDER_GRID"
          ref={gridRef}
          gridMode="update"
          columns={PROD_ORDER_COLUMNS}
          columnOptions={{
            frozenCount: 3,
            frozenBorderWidth: 2,
          }}
          data={data}
        />
      </>
    </Modal>
  );
};

export const WorkRoutingHistoryModalInWorkPerformancePage = ({
  visible,
  columns,
  TAB_CODE,
  workerReadOnly,
  rejectReadOnly,
  downtimeReadOnly,
  data,
  onCancel,
  work_uuid,
}) => {
  const [tab, selectTab] = useState('');
  const selectRoutingPerformance = ({ rowKey, instance }) => {
    const { work_routing_uuid, complete_fg } = instance.getRow(rowKey);
    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      workerReadOnly.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      workerReadOnly.setData(res);
      workerReadOnly.setSearchParams({
        work_uuid,
        work_routing_uuid,
        complete_fg,
      });
    });

    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      rejectReadOnly.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      rejectReadOnly.setData(res);
      rejectReadOnly.setSearchParams({
        work_uuid,
        work_routing_uuid,
        complete_fg,
      });
    });

    getData(
      {
        work_uuid: String(work_uuid),
        work_routing_uuid: work_routing_uuid,
      },
      downtimeReadOnly.SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      downtimeReadOnly.setData(res);
      downtimeReadOnly.setSearchParams({
        work_uuid,
        work_routing_uuid,
        complete_fg,
      });
    });
  };

  useLayoutEffect(() => {
    if (tab !== '') {
      switch (tab) {
        case 'WORKER':
          return workerReadOnly.gridRef.current.getInstance().refreshLayout();
        case 'REJECT':
          return rejectReadOnly.gridRef.current.getInstance().refreshLayout();
        case 'DOWNTIME':
          return downtimeReadOnly.gridRef.current.getInstance().refreshLayout();
        default:
          break;
      }
    }
  }, [tab]);
  return (
    <ScModal
      title={'실적이력관리'}
      visible={visible}
      width={'95vw'}
      footer={null}
      onCancel={onCancel}
    >
      <Container>
        <Datagrid
          gridId="WORK_ROUTING_HISTORY_GRID"
          columns={columns}
          height={300}
          data={data}
          onAfterClick={selectRoutingPerformance}
        />
      </Container>
      <Container>
        <Tabs
          type="card"
          onChange={selectTab}
          panels={[
            {
              tab: '투입인원 관리',
              tabKey: TAB_CODE.WORK_WORKER,
              content: workerReadOnly.component,
            },
            {
              tab: '부적합 관리',
              tabKey: TAB_CODE.WORK_REJECT,
              content: rejectReadOnly.component,
            },
            {
              tab: '비가동 관리',
              tabKey: TAB_CODE.WORK_DOWNTIME,
              content: downtimeReadOnly.component,
            },
          ]}
        />
      </Container>
    </ScModal>
  );
};
