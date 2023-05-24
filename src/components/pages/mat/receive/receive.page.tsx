import React from 'react';
import { ReceiveRemoteStoreInstance } from '~/apis/mat/receive';
import { FlexBox } from '~/components/UI';
import {
  useMatReceiveModalServiceImpl,
  useMatReceiveService,
} from '~/service/mat/ReceiveService';
import { MatReceiveAside } from './receive-aside';
import { MatReceiveContent } from './receive-content';
import { MatReceiveHeader } from './receive-header';
import { MatReceiveModal } from './receive-modal';

export const PgMatReceive = () => {
  const matReceiveRemoteStore = new ReceiveRemoteStoreInstance();
  const matReceiveService = useMatReceiveService(matReceiveRemoteStore);
  const matReceiveModalService = useMatReceiveModalServiceImpl(
    matReceiveRemoteStore,
    matReceiveService,
  );

  return (
    <>
      <MatReceiveHeader
        service={matReceiveService}
        modalService={matReceiveModalService}
      />
      <FlexBox alignItems="flex-start">
        <MatReceiveAside service={matReceiveService} />
        <MatReceiveContent service={matReceiveService} />
      </FlexBox>
      <MatReceiveModal
        service={matReceiveService}
        modalService={matReceiveModalService}
      />
    </>
  );
};
