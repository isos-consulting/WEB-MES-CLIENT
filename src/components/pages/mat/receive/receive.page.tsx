import React, { useRef, useState } from 'react';
import { ReceiveHeader, ReceiveRemoteStore } from '~/apis/mat/receive';
import { Flexbox, Modal } from '~/components/UI';
import { isNil } from '~/helper/common';
import { MatReceiveService } from '~/service/mat/ReceiveService';
import { MatReceiveAside } from './receive-aside';
import { MatReceiveContent } from './receive-content';
import { MatReceiveHeader } from './receive-header';

const matReceiveService = new MatReceiveService();
const matReceiveRemoteStore = new ReceiveRemoteStore();

export const PgMatReceive = () => {
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
      <MatReceiveHeader />
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
      {/* <Modal visible={true} okText="저장하기"></Modal> */}
    </>
  );
};
