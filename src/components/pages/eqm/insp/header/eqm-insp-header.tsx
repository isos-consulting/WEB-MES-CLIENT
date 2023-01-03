import React from 'react';
import { Container, Datagrid, IGridColumn } from '~/components/UI';

type EqmInspHeaderProps = {
  gridRef: React.MutableRefObject<Grid>;
  columns: IGridColumn[];
  data: any[];
  gridMode: string;
  onAfterClick: (ev: any) => void;
};

export const EqmInspHeader = ({
  gridRef,
  columns,
  data,
  gridMode,
  onAfterClick,
}: EqmInspHeaderProps) => {
  return (
    <Container>
      <Datagrid
        ref={gridRef}
        columns={columns}
        data={data}
        gridMode={gridMode}
        height={220}
        onAfterClick={onAfterClick}
      />
    </Container>
  );
};
