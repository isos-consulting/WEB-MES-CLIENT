import React, { useState, useEffect } from "react";
import {
  ITpMonitorProps,
  TpMonitor,
} from "~/components/templates/monitoring/monitoring.template";
import { IMonitorProps } from "~/components/UI/card/monitor.ui";

const dummyEquips: IMonitorProps[] = [
  {
    title: "설비1",
    content: "55%",
    footer: "가동 8h | 목표 12h",
    status: "Run",
  },
  {
    title: "설비2",
    content: "",
    footer: "",
    status: "Stop",
  },
  {
    title: "설비3",
    content: "",
    footer: "",
    status: "Downtime",
  },
];

const searchNewEquips: IMonitorProps[] = [
  {
    title: "설비1",
    content: "55%",
    footer: "가동 8h | 목표 12h",
    status: "Run",
  },
  {
    title: "설비2",
    content: "55%",
    footer: "가동 8h | 목표 12h",
    status: "Run",
  },
  {
    title: "설비3",
    content: "",
    footer: "",
    status: "Run",
  },
  {
    title: "설비4",
    content: "",
    footer: "",
    status: "Stop",
  },
];

export const PgEquiInterfaceMonitor = () => {
  const [equipStatus, setEquipStatus] = useState<IMonitorProps[]>([]);

  const monitorProps: ITpMonitorProps = {
    equips: equipStatus,
  };

  const handleSearchButtonClick = () => {
    setEquipStatus(searchNewEquips);
  };

  useEffect(() => {
    setEquipStatus(dummyEquips);
  }, []);

  return (
    <>
      <button onClick={handleSearchButtonClick}> 조회하기 </button>
      <TpMonitor {...monitorProps} />
    </>
  );
};
