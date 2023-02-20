import React, { useRef, useState } from 'react';
import { ReceiveHeader, ReceiveRemoteStore } from '~/apis/mat/receive';
import { Button, Div, Flexbox } from '~/components/UI';
import { isNil } from '~/helper/common';
import { MatReceiveService } from '~/service/mat/ReceiveService';
import { MatReceiveAside } from './receive-aside';
import { MatReceiveContent } from './receive-content';

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
      <Div>
        <Flexbox width="100%" justifyContent="space-between">
          <Button>신규 항목 추가</Button>
          <div
            style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
          >
            <Button>삭제</Button>
            <Button>수정</Button>
            <Button>세부 항목 추가</Button>
          </div>
        </Flexbox>
      </Div>
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
    </>
  );
};
