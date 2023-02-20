import React, { useRef, useState } from 'react';
import { ReceiveHeader, ReceiveRemoteStore } from '~/apis/mat/receive';
import { Button, Datagrid, Flexbox, Modal } from '~/components/UI';
import { getToday } from '~/functions';
import { isNil } from '~/helper/common';
import { MatReceiveService } from '~/service/mat/ReceiveService';
import { MatReceiveAside } from './receive-aside';
import { MatReceiveContent } from './receive-content';
import { MatReceiveEditableForm } from './receive-editable-form';
import { MatReceiveHeader } from './receive-header';

const matReceiveService = new MatReceiveService();
const matReceiveRemoteStore = new ReceiveRemoteStore();

const useMatReceiveHeaderService = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ReceiveHeader>({
    ...matReceiveService.empty(),
    reg_date: getToday(),
  });

  const toggle = () => {
    setModalVisible(!modalVisible);
  };

  return {
    modalVisible,
    toggle,
    formValues,
    setFormValues,
  };
};

export const PgMatReceive = () => {
  const service = useMatReceiveHeaderService();
  const asideGridRef = useRef(null);
  const contentGridRef = useRef(null);
  const [asideGridData, setAsideGridData] = useState<any[]>([]);
  const [contentFormValues, setContentFormValues] = useState<ReceiveHeader>(
    matReceiveService.empty(),
  );

  const asideGridClick = async e => {
    if (!isNil(e.rowKey)) {
      const contentGrid = contentGridRef.current.getInstance();
      const selectedRow = e.instance.getRow(e.rowKey);
      const contents = await matReceiveRemoteStore.getDetail(
        selectedRow.receive_uuid,
      );

      if (contents.length > 0) {
        setContentFormValues(contents[0].header);
        contentGrid.resetData(contents[0].details);
      }
    }
  };

  return (
    <>
      <MatReceiveHeader service={service} />
      <Flexbox>
        <MatReceiveAside
          gridRef={asideGridRef}
          onGridClick={asideGridClick}
          gridData={asideGridData}
          setGridData={setAsideGridData}
          remoteStore={matReceiveRemoteStore}
        />
        <MatReceiveContent
          gridRef={contentGridRef}
          formValues={contentFormValues}
          service={matReceiveService}
        />
      </Flexbox>
      <Modal
        title="입하 신규 항목 추가"
        visible={service.modalVisible}
        okText="저장하기"
        onCancel={service.toggle}
      >
        <MatReceiveEditableForm service={service} />
        <Button>발주 불러오기</Button>
        <Button>행추가</Button>
        <Button>행취소</Button>
        <Datagrid columns={[]} />
      </Modal>
    </>
  );
};
