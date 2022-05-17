import React, { useState, useEffect } from 'react';
import { IDefineMonitorProps } from '~/components/UI/card/monitor.ui';
import {
  MonitorCards,
  ITpMonitorCardsProps,
} from '~/components/UI/card/monitors.ui';
import { getData } from '~/functions';

export const PgEqmInterfaceMonitor = () => {
  const [equipStatus, setEquipStatus] = useState<IDefineMonitorProps[]>([]);

  const monitorProps: ITpMonitorCardsProps = {
    equips: equipStatus,
  };

  const handleSearchButtonClick = async () => {
    setEquipStatus((await getData({}, 'std/data-map/report')) ?? []);
  };

  useEffect(() => {
    handleSearchButtonClick();
  }, []);

  return (
    <>
      <button onClick={handleSearchButtonClick}> 조회하기 </button>
      <MonitorCards {...monitorProps} />
    </>
  );
};
