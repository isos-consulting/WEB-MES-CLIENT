import { Datagrid, IGridColumn, TGridMode } from '~/components/UI';
import React from 'react';

export const WorkPerformanceHeaderGrid = ({
  gridRef,
  gridMode,
  columns,
  datas,
  onHeaderClick,
}: {
  gridRef: any;
  gridMode: TGridMode;
  columns: IGridColumn[];
  datas: any[];
  onHeaderClick: (e: any) => void;
}) => {
  return (
    <Datagrid
      gridId="WORK_GRID"
      ref={gridRef}
      gridMode={gridMode}
      columns={columns}
      height={300}
      data={datas}
      onAfterClick={onHeaderClick}
    />
  );
};
