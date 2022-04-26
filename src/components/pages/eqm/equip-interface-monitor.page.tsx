import React, { useState, useEffect } from "react";
import { IDefineMonitorProps } from "~/components/UI/card/monitor.ui";
import { MonitorCards, ITpMonitorCardsProps } from "~/components/UI/card/monitors.ui";

const dummyEquips: IDefineMonitorProps[] = [
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

const searchNewEquips: IDefineMonitorProps[] = [
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

export const PgEqmInterfaceMonitor = () => {
  const [equipStatus, setEquipStatus] = useState<IDefineMonitorProps[]>([]);

  const monitorProps: ITpMonitorCardsProps = {
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
      <MonitorCards {...monitorProps} />
    </>
  );
};
