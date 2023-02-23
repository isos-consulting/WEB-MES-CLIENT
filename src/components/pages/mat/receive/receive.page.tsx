import React from 'react';
import { ReceiveRemoteStoreInstance } from '~/apis/mat/receive';
import { Flexbox } from '~/components/UI';
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
  );

  return (
    <>
      <MatReceiveHeader modalService={matReceiveModalService} />
      <Flexbox>
        <MatReceiveAside service={matReceiveService} />
        <MatReceiveContent service={matReceiveService} />
      </Flexbox>
      <MatReceiveModal modalService={matReceiveModalService} />
    </>
  );
};
