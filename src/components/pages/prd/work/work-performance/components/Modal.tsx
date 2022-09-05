import { Container, Datagrid, Modal, Searchbox, Tabs } from '~/components/UI';
import React from 'react';
import { ScModal } from '~/components/UI/modal/modal.ui.styled';

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
}) => {
  return (
    <ScModal
      title={'실적이력관리'}
      visible={visible}
      width={'95vw'}
      footer={null}
    >
      <Container>
        <Datagrid columns={columns} height={300} data={[{ proc_no: '1' }]} />
      </Container>
      <Container>
        <Tabs
          type="card"
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
