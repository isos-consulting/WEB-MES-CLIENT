import React from 'react';
import MonitorCard, {
  ICreateMonitorProps,
  IDefineMonitorProps,
} from '~/components/UI/card/monitor.ui';

export interface ITpMonitorCardsProps {
  equips: IDefineMonitorProps[];
}

export const MonitorCards: React.FC<ITpMonitorCardsProps> = (
  props: ITpMonitorCardsProps,
) => {
  const equips: ICreateMonitorProps[] = props.equips.map(
    (defineEquipProps: IDefineMonitorProps) => {
      const createEquipProps: ICreateMonitorProps = {
        key: Math.random().toString(),
        ...defineEquipProps,
      };

      return createEquipProps;
    },
  );

  const setEquipCards = equips.map((createEquipProps: ICreateMonitorProps) => (
    <MonitorCard {...createEquipProps} />
  ));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>{setEquipCards}</div>
  );
};
