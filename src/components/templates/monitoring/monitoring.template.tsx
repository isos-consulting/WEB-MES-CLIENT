import React from "react";
import MonitorCard, { IMonitorProps } from "~/components/UI/card/monitor.ui";

export interface ITpMonitorProps {
  equips: IMonitorProps[];
}

export const TpMonitor: React.FC<ITpMonitorProps> = (
  props: ITpMonitorProps
) => {
  const setEquipCards = props.equips.map((equipProps: IMonitorProps) => (
    <MonitorCard {...equipProps} />
  ));

  return <div>{setEquipCards}</div>;
};
